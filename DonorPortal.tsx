import React, { useState, useEffect } from 'react';
import { Heart, Trash2, Wind, Package, Plus, Clock, Bell, Star, Award, CheckCircle, X, Camera, Sparkles, AlertCircle, Leaf, Users } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { postFoodListing } from '../services/listings';
import { subscribeToNotifications, markNotificationRead } from '../services/notifications';
import { db } from '../firebase'; // Import Firestore database
import { collection, query, where, onSnapshot } from 'firebase/firestore';

export function DonorPortal() {
  const { profile, user } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [showNotifPanel, setShowNotifPanel] = useState(false);
  
  // Real-time state for Task 7
  const [activeListingsCount, setActiveListingsCount] = useState(0);

  const [formData, setFormData] = useState({
    description: '', category: 'Vegetables', qty: '', disposal: 'donation', allowPartial: true,
    expiry: '', pickupEnd: '', image: null as File | null
  });

  useEffect(() => {
    if (user) {
      // Notification Subscription
      const unsubNotifs = subscribeToNotifications(user.uid, (data) => setNotifications(data));
      
      // TASK 7: Real-time Data-Driven Analytics for Active Listings
      const q = query(
        collection(db, "listings"), 
        where("donorId", "==", user.uid), 
        where("status", "==", "AVAILABLE")
      );
      
      const unsubListings = onSnapshot(q, (snapshot) => {
        // Only count listings that have not been fully claimed (qty > 0)
        const active = snapshot.docs.filter(doc => (doc.data().currentQty || 0) > 0);
        setActiveListingsCount(active.length);
      });

      return () => {
        unsubNotifs();
        unsubListings();
      };
    }
  }, [user]);

  const handlePost = async (e: React.FormEvent) => {
    e.preventDefault();
    await postFoodListing(user!.uid, profile?.displayName || "Bakery", {
      ...formData,
      isDonation: formData.disposal !== 'compost',
      isCompost: formData.disposal !== 'donation',
      status: 'AVAILABLE'
    });
    setShowForm(false);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  // TASK 7: Environmental Impact Logic
  const wasteReduced = profile?.wasteReduced || 0;
  const co2SavedKg = wasteReduced * 2.5; // Formula: 1kg food = 2.5kg CO2 emissions
  
  const co2Display = co2SavedKg >= 1000 
    ? `${(co2SavedKg / 1000).toFixed(2)} Tons` 
    : `${co2SavedKg.toFixed(1)} kg`;

  const rating = profile?.rating || 5.0;
  
  // STATS MAPPED TO ACTUAL FIREBASE DATA
  const metrics = [
    { label: 'Meals Provided', value: (profile?.totalMeals || 0).toString(), icon: Heart, color: 'text-pink-500', bg: 'bg-pink-50' },
    { label: 'Food Waste Reduced', value: `${wasteReduced.toFixed(1)}kg`, icon: Trash2, color: 'text-green-500', bg: 'bg-green-50' },
    { label: 'CO₂ Saved', value: co2Display, icon: Wind, color: 'text-blue-500', bg: 'bg-blue-50' },
    { label: 'Active Listings', value: activeListingsCount.toString(), icon: Package, color: 'text-orange-500', bg: 'bg-orange-50' },
  ];

  return (
    <div className="p-8 space-y-12 max-w-[1400px] mx-auto min-h-screen relative">
      {/* 🔔 FLOATING NOTIFICATION PANEL (FIXED) */}
      {showNotifPanel && (
        <div className="fixed top-24 right-8 w-80 bg-white rounded-[2rem] shadow-[0_20px_60px_rgba(0,0,0,0.2)] p-8 z-[999] border border-gray-50 animate-in slide-in-from-top-4">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-black text-gray-900 text-lg">Activity</h3>
            <button onClick={() => setShowNotifPanel(false)}><X className="w-5 h-5 text-gray-300" /></button>
          </div>
          <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
            {notifications.length === 0 ? <p className="text-gray-300 font-bold text-center py-10">No updates yet</p> : 
              notifications.map(n => (
                <div key={n.id} onClick={() => markNotificationRead(n.id)} className={`p-4 rounded-3xl text-sm cursor-pointer ${n.read ? 'bg-gray-50 text-gray-400' : 'bg-green-50 text-green-900 font-bold'}`}>
                  {n.message}
                </div>
              ))
            }
          </div>
        </div>
      )}

      {/* HEADER */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-4xl font-black text-gray-900">Hello,</h1>
          <div className="flex items-center gap-3 mt-2">
            <div className="flex text-gray-900 font-bold text-xl items-center"><Star className="w-5 h-5 mr-1 fill-gray-900" />{rating.toFixed(1)}</div>
            <span className="bg-white border border-gray-100 text-gray-400 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-sm flex items-center gap-1"><Award className="w-3 h-3" /> Model Donor</span>
          </div>
        </div>
        <button onClick={() => setShowNotifPanel(!showNotifPanel)} className="p-4 bg-white rounded-2xl shadow-sm border border-gray-100 relative hover:bg-gray-50 active:scale-95 transition-all">
          <Bell className="w-6 h-6 text-gray-700" />
          {notifications.some(n => !n.read) && <span className="absolute top-3 right-3 w-3 h-3 bg-red-500 rounded-full border-2 border-white animate-pulse"></span>}
        </button>
      </div>

      {/* DATA-DRIVEN METRICS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((m, i) => (
          <div key={i} className="bg-white rounded-[2rem] p-8 border border-gray-50 shadow-sm flex items-center justify-between">
            <div><p className="text-gray-400 text-[10px] font-black mb-1 uppercase tracking-widest leading-none">{m.label}</p><p className="text-3xl font-black text-gray-900">{m.value}</p></div>
            <div className={`${m.bg} p-4 rounded-2xl`}><m.icon className={`w-6 h-6 ${m.color}`} /></div>
          </div>
        ))}
      </div>

      <div className="flex justify-between items-center border-t border-gray-50 pt-10">
        <h2 className="text-2xl font-black text-gray-900 flex items-center gap-2"><Clock className="text-green-600" /> Active Listings</h2>
        <button onClick={() => setShowForm(true)} className="bg-green-600 text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-2 shadow-xl shadow-green-100 hover:bg-green-700 active:scale-95 transition-all"><Plus /> Post Surplus</button>
      </div>

      {/* 🖼️ THE RESTORED MODAL */}
      {showForm && (
        <div className="fixed inset-0 bg-[#0F172A]/40 backdrop-blur-md z-[1000] flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl p-10 my-10 animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-3">
                    <div className="bg-green-100 p-2 rounded-full"><Plus className="text-green-600 w-6 h-6" /></div>
                    <h2 className="text-2xl font-black text-[#1E293B]">Post Food Surplus</h2>
                </div>
                <button onClick={() => setShowForm(false)} className="p-2 hover:bg-gray-100 rounded-full"><X className="text-gray-400" /></button>
            </div>

            <form onSubmit={handlePost} className="space-y-8">
              {/* Description box from reference image */}
              <div className="space-y-3">
                <label className="text-sm font-bold text-[#475569]">Describe the food (Our AI will categorize it)</label>
                <div className="relative">
                    <textarea 
                        className="w-full p-6 bg-[#F8FAFC] rounded-3xl border border-[#E2E8F0] outline-none min-h-[120px] focus:ring-2 focus:ring-green-500/20" 
                        placeholder="e.g. 5 boxes of vegetarian sandwiches, contain gluten and dairy..." 
                        onChange={e => setFormData({...formData, description: e.target.value})}
                    />
                    <button type="button" className="absolute bottom-4 right-4 bg-[#00C897] text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg shadow-green-100">
                        <Sparkles className="w-3 h-3" /> Auto-fill with AI
                    </button>
                </div>
              </div>

              {/* Category & Quantity */}
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-3">
                    <label className="text-sm font-bold text-[#475569]">Category</label>
                    <select className="w-full p-4 bg-[#F8FAFC] rounded-2xl border border-[#E2E8F0] outline-none font-medium text-[#1E293B]" onChange={e => setFormData({...formData, category: e.target.value})}>
                        <option>Vegetables</option><option>Bakery</option><option>Cooked Meals</option>
                    </select>
                </div>
                <div className="space-y-3">
                    <label className="text-sm font-bold text-[#475569]">Quantity</label>
                    <input type="text" placeholder="e.g. 10 kg / 20 units" className="w-full p-4 bg-[#F8FAFC] rounded-2xl border border-[#E2E8F0] outline-none font-medium" onChange={e => setFormData({...formData, qty: e.target.value})} />
                </div>
              </div>

              {/* Allergen Protection from reference */}
              <div className="bg-orange-50/50 p-6 rounded-3xl border border-orange-100 space-y-3">
                  <div className="flex items-center gap-2 text-orange-800 font-bold text-sm"><AlertCircle className="w-4 h-4" /> Safety First: Allergens</div>
                  <div className="flex flex-wrap gap-2">
                      {['Gluten', 'Dairy', 'Nuts', 'Eggs', 'Soy'].map(tag => (
                          <button key={tag} type="button" className="bg-white border border-orange-100 text-orange-600 px-4 py-1.5 rounded-full text-xs font-bold hover:bg-orange-100 transition-colors">{tag}</button>
                      ))}
                  </div>
              </div>

              {/* Image Upload Area */}
              <div className="space-y-3">
                  <label className="text-sm font-bold text-[#475569]">Food Image</label>
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-[#E2E8F0] rounded-3xl cursor-pointer bg-[#F8FAFC] hover:bg-[#F1F5F9] transition-colors">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <Camera className="w-8 h-8 text-gray-400 mb-2" />
                          <p className="text-xs text-gray-500 font-bold">Upload a photo of the surplus</p>
                      </div>
                      <input type="file" className="hidden" onChange={e => setFormData({...formData, image: e.target.files?.[0] || null})} />
                  </label>
              </div>

              {/* Strategy Grid */}
              <div className="space-y-3">
                  <label className="text-sm font-bold text-[#475569]">Disposal Options</label>
                  <div className="grid grid-cols-3 gap-4">
                      <button type="button" onClick={() => setFormData({...formData, disposal: 'donation'})} className={`p-4 rounded-3xl border-2 flex flex-col items-center gap-2 transition-all ${formData.disposal === 'donation' ? 'border-[#00C897] bg-[#F0FDF4] text-[#166534]' : 'border-[#F1F5F9] text-[#64748B]'}`}>
                        <Heart className="w-5 h-5" /> <span className="text-[10px] font-black uppercase text-center leading-none">Donation Only</span>
                      </button>
                      <button type="button" onClick={() => setFormData({...formData, disposal: 'compost'})} className={`p-4 rounded-3xl border-2 flex flex-col items-center gap-2 transition-all ${formData.disposal === 'compost' ? 'border-[#00C897] bg-[#F0FDF4] text-[#166534]' : 'border-[#F1F5F9] text-[#64748B]'}`}>
                        <Leaf className="w-5 h-5" /> <span className="text-[10px] font-black uppercase text-center leading-none">Compost Only</span>
                      </button>
                      <button type="button" onClick={() => setFormData({...formData, disposal: 'either'})} className={`p-4 rounded-3xl border-2 flex flex-col items-center gap-2 transition-all ${formData.disposal === 'either' ? 'border-[#00C897] bg-[#F0FDF4] text-[#166534]' : 'border-[#F1F5F9] text-[#64748B]'}`}>
                        <div className="flex gap-1"><Heart className="w-4 h-4" /><Leaf className="w-4 h-4" /></div> <span className="text-[10px] font-black uppercase text-center leading-none">Either Option</span>
                      </button>
                  </div>
              </div>

              {/* Switch Toggle */}
              <div className="flex items-center justify-between p-6 bg-[#F8FAFC] rounded-3xl border border-[#E2E8F0]">
                  <div>
                      <p className="font-bold text-[#1E293B]">Allow Partial Pickup</p>
                      <p className="text-[11px] text-[#64748B] font-medium leading-none">NGOs can request less than full quantity</p>
                  </div>
                  <button type="button" onClick={() => setFormData({...formData, allowPartial: !formData.allowPartial})} className={`w-12 h-6 rounded-full transition-colors relative ${formData.allowPartial ? 'bg-[#00C897]' : 'bg-[#CBD5E1]'}`}>
                      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${formData.allowPartial ? 'right-1' : 'left-1'}`} />
                  </button>
              </div>

              {/* Timing */}
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-3">
                    <label className="text-sm font-bold text-[#475569]">Expiry Time</label>
                    <input type="time" className="w-full p-4 bg-[#F8FAFC] rounded-2xl border border-[#E2E8F0] outline-none font-medium" onChange={e => setFormData({...formData, expiry: e.target.value})} />
                </div>
                <div className="space-y-3">
                    <label className="text-sm font-bold text-[#475569]">Pickup End Time</label>
                    <input type="time" className="w-full p-4 bg-[#F8FAFC] rounded-2xl border border-[#E2E8F0] outline-none font-medium" onChange={e => setFormData({...formData, pickupEnd: e.target.value})} />
                </div>
              </div>

              <button type="submit" className="w-full bg-[#00C897] text-white py-5 rounded-3xl font-black text-lg shadow-xl shadow-green-100 flex items-center justify-center gap-2 hover:bg-[#00B086] transition-all">
                <CheckCircle className="w-6 h-6" /> Post Food Listing
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}