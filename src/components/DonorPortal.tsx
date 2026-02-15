import React, { useState, useEffect, useRef } from 'react';
import { Heart, Trash2, Wind, Package, Plus, Clock, CheckCircle, Users, Navigation, Zap, Search, X, AlertCircle, Leaf, Recycle, Image as ImageIcon, MapPin, Eye } from 'lucide-react';
// @ts-ignore
import { useAuth } from '../context/AuthContext';
// @ts-ignore
import { postFoodListing } from '../services/listings';
import RescueMap from './ui/RescueMap';

// --- REAL BANGALORE NGO DATA ---
const REAL_NGOS = [
  { id: 1, name: 'Bangalore Food Bank', lat: 12.9719, lng: 77.6412, type: 'NGO', capacity: 'High Capacity', verified: true },
  { id: 2, name: 'Rakum School for the Blind', lat: 12.9780, lng: 77.5690, type: 'NGO', capacity: 'Medium Capacity', verified: true },
  { id: 3, name: 'Mercy Angels Foundation', lat: 13.0219, lng: 77.5937, type: 'NGO', capacity: 'Small Capacity', verified: false },
  { id: 4, name: 'Rise Against Hunger India', lat: 13.0031, lng: 77.5643, type: 'NGO', capacity: 'High Capacity', verified: true }
];

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371;
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export function DonorPortal() {
  const { profile, user } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [sortedRescuers, setSortedRescuers] = useState<any[]>(REAL_NGOS);
  
  // --- LISTINGS STATE ---
  const [listings, setListings] = useState<any[]>([]);

  // Form State
  const [formData, setFormData] = useState({
    title: '', description: '', category: 'Vegetables', qty: '', disposal: 'donation', allowPartial: true,
    expiryTime: '', pickupTime: '', location: 'My Location'
  });
  const [selectedAllergens, setSelectedAllergens] = useState<string[]>([]);
  
  // Image Upload State
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const allergensList = ['Gluten', 'Dairy', 'Nuts', 'Eggs', 'Soy'];

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => setUserLocation([position.coords.latitude, position.coords.longitude]),
        () => setUserLocation([12.9716, 77.5946])
      );
    }
  }, []);

  useEffect(() => {
    if (userLocation) {
      const updatedList = REAL_NGOS.map(ngo => {
        const dist = calculateDistance(userLocation[0], userLocation[1], ngo.lat, ngo.lng);
        return { ...ngo, distanceVal: dist, distance: `${dist.toFixed(1)} km` };
      });
      setSortedRescuers(updatedList.sort((a, b) => a.distanceVal - b.distanceVal));
    }
  }, [userLocation]);

  const filteredRescuers = sortedRescuers.filter(rescuer => 
    rescuer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    rescuer.capacity.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleAllergen = (tag: string) => {
    if (selectedAllergens.includes(tag)) {
      setSelectedAllergens(selectedAllergens.filter(t => t !== tag));
    } else {
      setSelectedAllergens([...selectedAllergens, tag]);
    }
  };

  // --- IMAGE HANDLING ---
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    setImage(null);
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handlePost = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Create new listing object
    const newListing = {
        id: Date.now(),
        ...formData,
        allergens: selectedAllergens,
        image: imagePreview || "https://images.unsplash.com/photo-1543339308-43e59d6b73a6?w=800", 
        status: 'AVAILABLE',
        expiry: `Today, ${formData.expiryTime}`,
        type: formData.disposal === 'either' ? 'Donation or Compost' : formData.disposal.charAt(0).toUpperCase() + formData.disposal.slice(1)
    };

    setListings([newListing, ...listings]);

    try {
      await postFoodListing(user!.uid, profile!.name || profile!.displayName, {
        ...newListing,
        isCompost: formData.disposal === 'compost' || formData.disposal === 'either',
        isDonation: formData.disposal === 'donation' || formData.disposal === 'either',
      });

      setShowForm(false);
      setShowSuccess(true);
      
      setFormData({
        title: '', description: '', category: 'Vegetables', qty: '', disposal: 'donation', allowPartial: true,
        expiryTime: '', pickupTime: '', location: 'My Location'
      });
      setSelectedAllergens([]);
      setImage(null); 
      // Note: We keep imagePreview briefly so the card has it, then we'd clear it. 
      // For this demo, let's just clear the input ref.
      if (fileInputRef.current) fileInputRef.current.value = '';

      setTimeout(() => setShowSuccess(false), 3000);
    } catch (err) { console.error(err); }
  };

  const metrics = [
    { label: 'Meals Provided', value: profile?.totalMeals || '0', icon: Heart, color: 'text-pink-500', bg: 'bg-pink-50' },
    { label: 'Food Waste Reduced', value: profile?.wasteReduced || '0kg', icon: Trash2, color: 'text-green-500', bg: 'bg-green-50' },
    { label: 'CO₂ Saved', value: profile?.co2Saved || '0 Tons', icon: Wind, color: 'text-blue-500', bg: 'bg-blue-50' },
    { label: 'Active Listings', value: profile?.activeListings || '0', icon: Package, color: 'text-orange-500', bg: 'bg-orange-50' },
  ];

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Bakery': return 'bg-orange-100 text-orange-700';
      case 'Cooked Meals': return 'bg-red-100 text-red-700';
      case 'Vegetables': return 'bg-green-100 text-green-700';
      case 'Fruits': return 'bg-yellow-100 text-yellow-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="p-8 space-y-8 relative max-w-[1600px] mx-auto">
      {showSuccess && (
        <div className="fixed top-24 right-8 bg-green-600 text-white px-8 py-4 rounded-2xl shadow-2xl flex items-center gap-3 z-50 animate-bounce">
          <CheckCircle className="w-6 h-6" /> <span className="font-bold">Listing Posted Successfully!</span>
        </div>
      )}

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((m, i) => (
          <div key={i} className="bg-white rounded-[1.5rem] p-8 shadow-sm border border-gray-100 flex items-center justify-between">
            <div><p className="text-gray-400 text-sm font-bold mb-1 uppercase tracking-tight">{m.label}</p><p className="text-3xl font-black text-gray-900">{m.value}</p></div>
            <div className={`${m.bg} p-4 rounded-2xl`}><m.icon className={`w-6 h-6 ${m.color}`} /></div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LEFT COLUMN: Listings */}
        <div className="lg:col-span-2 space-y-6">
            <div className="flex justify-between items-center bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                    <div className="bg-green-100 p-2 rounded-xl"><Clock className="text-green-600 w-6 h-6" /></div>
                    Live Surplus Food Listings
                </h2>
                <button onClick={() => setShowForm(true)} className="bg-green-600 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-green-200 hover:bg-green-700 transition-all active:scale-95">
                    <Plus className="w-5 h-5" /> Post Surplus
                </button>
            </div>
            
            {/* REAL LISTINGS DISPLAY */}
            <div className="space-y-6">
              {listings.length > 0 ? (
                listings.map(listing => (
                  <div key={listing.id} className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 flex gap-6 animate-in slide-in-from-bottom-4 duration-300">
                    <div className="w-48 h-48 shrink-0 rounded-2xl overflow-hidden bg-gray-100">
                         <img src={listing.image} alt={listing.title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                    </div>
                    
                    <div className="flex-1 flex flex-col justify-between py-1">
                      <div>
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex gap-2">
                             <span className={`px-3 py-1 rounded-full text-xs font-bold ${getCategoryColor(listing.category)}`}>
                                {listing.category}
                             </span>
                             {listing.allergens && listing.allergens.length > 0 && (
                                <span className="bg-yellow-50 text-yellow-700 px-3 py-1 rounded-full text-xs font-bold border border-yellow-100">
                                    Contains Allergens
                                </span>
                             )}
                          </div>
                          <span className="text-xs font-black text-gray-400 uppercase tracking-wide">{listing.qty}</span>
                        </div>

                        <h3 className="text-2xl font-bold text-gray-900 leading-tight mb-2">{listing.title || listing.description.substring(0, 30)}</h3>
                        
                        <div className="grid grid-cols-2 gap-y-2 text-sm text-gray-600 font-medium mb-4">
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-gray-400" />
                            {listing.location}
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-gray-400" />
                            Expires: {listing.expiry}
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-between items-center border-t border-gray-50 pt-4">
                        <button className="bg-green-600 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-sm hover:bg-green-700 transition-colors text-sm">
                          <Eye className="w-4 h-4" /> View Matches
                        </button>
                        {listing.type && (
                            <span className="bg-green-50 text-green-700 px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 uppercase tracking-wide">
                                <Heart className="w-4 h-4" /> {listing.type}
                            </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200 p-16 text-center">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                         <Package className="w-8 h-8 text-gray-300" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-1">No Active Listings</h3>
                    <p className="text-gray-400 font-medium">Post your surplus food to start saving the planet!</p>
                </div>
              )}
            </div>
        </div>

        {/* RIGHT COLUMN: Map & Rescuers */}
        <div className="space-y-6">
            <div className="bg-white rounded-[1.5rem] p-6 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2"><Users className="w-5 h-5 text-green-600" /><h3 className="font-bold text-gray-900">Nearby NGOs</h3></div>
                    {userLocation && <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full flex items-center gap-1 font-bold"><Navigation className="w-3 h-3"/> GPS Active</span>}
                </div>

                <div className="relative mb-4">
                    <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    <input type="text" placeholder="Search NGOs..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-green-500" />
                    {searchQuery && <button onClick={() => setSearchQuery('')} className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"><X className="w-4 h-4" /></button>}
                </div>

                {!showForm && (
                    <div className="rounded-2xl overflow-hidden border border-gray-200 mb-4 h-[280px] w-full relative z-0">
                        <RescueMap locations={filteredRescuers} userLocation={userLocation} />
                    </div>
                )}

                <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                    {filteredRescuers.length > 0 ? (
                        filteredRescuers.map((rescuer) => (
                            <div key={rescuer.id} className="pb-4 border-b border-gray-100 last:border-0">
                                <div className="flex items-start gap-3 mb-2">
                                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0"><Users className="w-5 h-5 text-blue-600" /></div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2"><h4 className="font-bold text-gray-900 text-sm">{rescuer.name}</h4>{rescuer.verified && <CheckCircle className="w-4 h-4 text-blue-500" />}</div>
                                        <p className="text-xs text-gray-500 font-medium mt-0.5">{rescuer.distance} away • {rescuer.capacity}</p>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : <p className="text-center text-sm text-gray-400 py-4">No NGOs found.</p>}
                </div>
            </div>

            <div className="bg-gradient-to-br from-green-600 to-green-800 rounded-[1.5rem] p-6 shadow-xl text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
                <div className="flex items-center gap-2 mb-3 relative z-10"><Zap className="w-5 h-5 text-yellow-300" /><h3 className="font-bold text-white tracking-wide text-sm">AI INSIGHT</h3></div>
                <p className="text-green-50 text-sm leading-relaxed relative z-10 font-medium">{filteredRescuers.length > 0 ? `NGO "${filteredRescuers[0].name}" is closest and needs grains.` : "No NGOs match your criteria."}</p>
            </div>
        </div>
      </div>

      {/* --- FULL SCREEN FORM MODAL --- */}
      {showForm && (
        <div className="fixed inset-0 z-50 bg-white flex flex-col animate-in slide-in-from-bottom-5 duration-300">
            
            {/* 1. HEADER */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-white">
                <div className="flex items-center gap-4">
                    <button onClick={() => setShowForm(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <X className="w-6 h-6 text-gray-500" />
                    </button>
                    <h2 className="text-2xl font-black text-gray-900">Post Food Surplus</h2>
                </div>
                <button onClick={handlePost} disabled={!formData.title} className="bg-green-600 text-white px-8 py-3 rounded-xl font-bold text-lg shadow-lg hover:bg-green-700 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                    <CheckCircle className="w-5 h-5" /> Publish
                </button>
            </div>

            {/* 2. SCROLLABLE CONTENT (Two Columns) */}
            <div className="flex-1 overflow-y-auto bg-gray-50 p-6 md:p-12">
                <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
                    
                    {/* LEFT COLUMN: Visuals */}
                    <div className="space-y-6">
                        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 space-y-4">
                             <h3 className="text-lg font-bold text-gray-900">Listing Image</h3>
                             <div className="flex items-center justify-center w-full">
                                {imagePreview ? (
                                <div className="relative w-full h-64 rounded-2xl overflow-hidden group border-2 border-gray-100">
                                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                    <button onClick={removeImage} className="absolute top-3 right-3 bg-black/60 p-2 rounded-full text-white hover:bg-black/80 transition-colors">
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>
                                ) : (
                                <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-200 border-dashed rounded-2xl cursor-pointer bg-gray-50 hover:bg-green-50 hover:border-green-200 transition-all group">
                                    <ImageIcon className="w-12 h-12 text-gray-300 group-hover:text-green-500 mb-3 transition-colors" />
                                    <p className="text-gray-500 font-bold group-hover:text-green-600">Click to upload photo</p>
                                    <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                                </label>
                                )}
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 space-y-4">
                             <h3 className="text-lg font-bold text-gray-900">Basic Info</h3>
                             <div className="space-y-4">
                                <div>
                                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1 mb-1 block">Title</label>
                                    <input type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="e.g. Leftover Catering Food" className="w-full p-4 bg-gray-50 rounded-xl outline-none font-bold text-gray-700 focus:ring-2 focus:ring-green-500 transition-all" />
                                </div>
                                <div>
                                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1 mb-1 block">Description</label>
                                    <textarea className="w-full p-4 bg-gray-50 rounded-xl outline-none font-bold text-gray-700 focus:ring-2 focus:ring-green-500 min-h-[120px] resize-none" placeholder="Details about the food..." value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
                                </div>
                             </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: Details */}
                    <div className="space-y-6">
                        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 space-y-6">
                            <h3 className="text-lg font-bold text-gray-900">Logistics</h3>
                            
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1 mb-1 block">Category</label>
                                    <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full p-4 bg-gray-50 rounded-xl outline-none font-bold text-gray-700 appearance-none">
                                        <option>Vegetables</option><option>Cooked Meals</option><option>Bakery</option><option>Fruits</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1 mb-1 block">Quantity</label>
                                    <input type="text" value={formData.qty} onChange={e => setFormData({...formData, qty: e.target.value})} placeholder="e.g. 10 kg" className="w-full p-4 bg-gray-50 rounded-xl outline-none font-bold text-gray-700" />
                                </div>
                            </div>

                            {/* Allergens */}
                            <div className="p-4 bg-yellow-50 rounded-xl border border-yellow-100">
                                <div className="flex items-center gap-2 mb-3">
                                <AlertCircle className="w-4 h-4 text-yellow-600" />
                                <span className="font-bold text-yellow-800 text-sm">Allergens</span>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                {allergensList.map(tag => (
                                    <button type="button" key={tag} onClick={() => toggleAllergen(tag)} className={`px-4 py-2 rounded-full text-xs font-bold border transition-all ${selectedAllergens.includes(tag) ? 'bg-yellow-100 border-yellow-400 text-yellow-800' : 'bg-white border-yellow-200 text-gray-500 hover:border-yellow-300'}`}>
                                    {tag}
                                    </button>
                                ))}
                                </div>
                            </div>

                            {/* Disposal Options */}
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">Disposal Method</label>
                                <div className="grid grid-cols-3 gap-3">
                                    {[
                                        { id: 'donation', label: 'Donation', icon: Heart },
                                        { id: 'compost', label: 'Compost', icon: Leaf },
                                        { id: 'either', label: 'Either', icon: Recycle }
                                    ].map((opt) => (
                                    <button key={opt.id} type="button" onClick={() => setFormData({...formData, disposal: opt.id})} className={`flex flex-col items-center justify-center gap-1.5 py-4 rounded-xl border-2 transition-all ${formData.disposal === opt.id ? 'border-green-500 bg-green-50 text-green-700' : 'border-gray-100 text-gray-400 hover:bg-gray-50'}`}>
                                        <opt.icon className="w-5 h-5" />
                                        <span className="text-xs font-bold">{opt.label}</span>
                                    </button>
                                    ))}
                                </div>
                            </div>

                            {/* Time */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1 mb-1 block">Expiry</label>
                                    <input type="time" value={formData.expiryTime} onChange={e => setFormData({...formData, expiryTime: e.target.value})} className="w-full p-4 bg-gray-50 rounded-xl outline-none font-bold text-gray-700" />
                                </div>
                                <div>
                                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1 mb-1 block">Pickup By</label>
                                    <input type="time" value={formData.pickupTime} onChange={e => setFormData({...formData, pickupTime: e.target.value})} className="w-full p-4 bg-gray-50 rounded-xl outline-none font-bold text-gray-700" />
                                </div>
                            </div>

                        </div>
                    </div>

                </div>
            </div>
        </div>
      )}
    </div>
  );
}