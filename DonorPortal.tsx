import React, { useState } from 'react';
import { Heart, Trash2, Wind, Package, Plus, Clock, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { postFoodListing } from '../services/listings';

export function DonorPortal() {
  const { profile, user } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [formData, setFormData] = useState({
    description: '', category: 'Vegetables', qty: '', disposal: 'donation', allowPartial: true
  });

  const handlePost = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await postFoodListing(user!.uid, profile!.name || profile!.displayName, {
        ...formData,
        isCompost: formData.disposal === 'compost' || formData.disposal === 'either',
        isDonation: formData.disposal === 'donation' || formData.disposal === 'either',
        img: "https://images.unsplash.com/photo-1543339308-43e59d6b73a6?w=800",
        status: 'AVAILABLE'
      });
      setShowForm(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (err) { console.error(err); }
  };

  // Connecting cards to REAL database profile values
  const metrics = [
    { label: 'Meals Provided', value: profile?.totalMeals || '0', icon: Heart, color: 'text-pink-500', bg: 'bg-pink-50' },
    { label: 'Food Waste Reduced', value: profile?.wasteReduced || '0kg', icon: Trash2, color: 'text-green-500', bg: 'bg-green-50' },
    { label: 'CO₂ Saved', value: profile?.co2Saved || '0 Tons', icon: Wind, color: 'text-blue-500', bg: 'bg-blue-50' },
    { label: 'Active Listings', value: profile?.activeListings || '0', icon: Package, color: 'text-orange-500', bg: 'bg-orange-50' },
  ];

  return (
    <div className="p-8 space-y-12 relative">
      {showSuccess && (
        <div className="fixed top-24 right-8 bg-green-600 text-white px-8 py-4 rounded-2xl shadow-2xl flex items-center gap-3 z-50 animate-bounce">
          <CheckCircle className="w-6 h-6" /> <span className="font-bold">Listing Posted Successfully!</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((m, i) => (
          <div key={i} className="bg-white rounded-[1.5rem] p-8 shadow-sm border border-gray-100 flex items-center justify-between">
            <div><p className="text-gray-400 text-sm font-bold mb-1 uppercase tracking-tight">{m.label}</p><p className="text-3xl font-black text-gray-900">{m.value}</p></div>
            <div className={`${m.bg} p-4 rounded-2xl`}><m.icon className={`w-6 h-6 ${m.color}`} /></div>
          </div>
        ))}
      </div>

      <div className="flex justify-between items-center border-t border-gray-50 pt-10">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2"><Clock className="text-green-600" /> Live Surplus Food Listings</h2>
        <button onClick={() => setShowForm(true)} className="bg-green-600 text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-2 shadow-lg hover:bg-green-700 transition-all active:scale-95"><Plus /> Post Surplus</button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl p-10 space-y-8 animate-in zoom-in-95 duration-200">
            <h2 className="text-2xl font-bold text-gray-900">Post Food Surplus</h2>
            
            <div className="space-y-3">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-2">Description</label>
              <textarea 
                className="w-full p-6 bg-gray-50 rounded-3xl border-none outline-none focus:ring-2 focus:ring-green-500 min-h-[120px] resize-none" 
                placeholder="e.g. 5 boxes of sandwiches..." 
                onChange={e => setFormData({...formData, description: e.target.value})} 
              />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <select className="w-full p-4 bg-gray-50 rounded-2xl outline-none font-bold text-gray-700 appearance-none border border-transparent focus:border-green-200" onChange={e => setFormData({...formData, category: e.target.value})}>
                <option>Vegetables</option><option>Cooked Meals</option><option>Bakery</option>
              </select>
              <input type="number" placeholder="Quantity (e.g. 10)" className="w-full p-4 bg-gray-50 rounded-2xl outline-none font-bold text-gray-700 border border-transparent focus:border-green-200" onChange={e => setFormData({...formData, qty: e.target.value})} />
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-2">Disposal Options</label>
              <div className="grid grid-cols-3 gap-4">
                {['donation', 'compost', 'either'].map((opt) => (
                  <button key={opt} type="button" onClick={() => setFormData({...formData, disposal: opt})} className={`py-4 rounded-2xl border-2 font-bold capitalize transition-all ${formData.disposal === opt ? 'border-green-600 bg-green-50 text-green-700' : 'border-gray-100 text-gray-400 hover:bg-gray-50'}`}>
                    {opt === 'either' ? 'Either Option' : `${opt} Only`}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-between items-center bg-gray-50 p-6 rounded-3xl border border-gray-100">
              <div><p className="font-bold text-gray-900">Allow Partial Pickup</p><p className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">NGOs can request less than full quantity</p></div>
              <input type="checkbox" checked={formData.allowPartial} onChange={e => setFormData({...formData, allowPartial: e.target.checked})} className="w-12 h-6 rounded-full bg-gray-300 appearance-none checked:bg-green-500 relative cursor-pointer transition-all before:content-[''] before:absolute before:w-4 before:h-4 before:bg-white before:rounded-full before:top-1 before:left-1 checked:before:translate-x-6 before:transition-all" />
            </div>

            <div className="flex gap-4 pt-4">
              <button onClick={() => setShowForm(false)} className="flex-1 py-4 font-bold text-gray-400 hover:text-gray-600 transition-colors">Cancel</button>
              <button onClick={handlePost} className="flex-1 bg-green-600 text-white py-4 rounded-2xl font-bold shadow-lg shadow-green-100 hover:bg-green-700 transition-all">Post Food Listing</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}