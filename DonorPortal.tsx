import React from 'react';
import { Heart, Trash2, Wind, Package, MapPin, Plus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export function DonorPortal() {
  const { profile } = useAuth();

  // Point #3: Dynamic metrics pulling from the logged-in user's profile
  const metrics = [
    { 
      label: 'Meals Provided', 
      value: profile?.totalMeals || '0', 
      icon: Heart, 
      color: 'text-pink-500', 
      bg: 'bg-pink-50' 
    },
    { 
      label: 'Food Waste Reduced', 
      value: profile?.wasteReduced ? `${profile.wasteReduced}kg` : '0kg', 
      icon: Trash2, 
      color: 'text-green-500', 
      bg: 'bg-green-50' 
    },
    { 
      label: 'CO₂ Saved', 
      value: profile?.co2Saved ? `${profile.co2Saved} Tons` : '0 Tons', 
      icon: Wind, 
      color: 'text-blue-500', 
      bg: 'bg-blue-50' 
    },
    { 
      label: 'Active Listings', 
      value: profile?.activeListings || '0', 
      icon: Package, 
      color: 'text-orange-500', 
      bg: 'bg-orange-50' 
    },
  ];

  return (
    <div className="p-8 space-y-8">
      {/* Horizontal Metric Cards */}
      <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
        {metrics.map((m, idx) => (
          <div key={idx} className="bg-white min-w-[280px] rounded-[2rem] p-8 shadow-sm border border-gray-100 flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm font-medium mb-1">{m.label}</p>
              <p className="text-3xl font-bold text-gray-900">{m.value}</p>
            </div>
            <div className={`${m.bg} p-4 rounded-2xl`}>
              <m.icon className={`w-6 h-6 ${m.color}`} />
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Active Listings</h2>
        <button className="bg-green-600 text-white px-8 py-4 rounded-2xl font-bold hover:bg-green-700 shadow-lg shadow-green-100 flex items-center gap-2 transition-all active:scale-95">
          <Plus className="w-5 h-5" /> Post Surplus
        </button>
      </div>

      <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-gray-100 border-l-[12px] border-l-green-600">
        <div className="flex items-center gap-2 text-green-600 font-bold text-sm mb-4 uppercase tracking-widest">
          <MapPin className="w-4 h-4" />
          {/* Point #3: Personalized Location */}
          <span>Registered: {profile?.address || 'MG Road, Bangalore'}</span>
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Live Surplus at {profile?.displayName || 'Your Facility'}</h3>
        <p className="text-gray-400 font-medium italic">New rescue requests will appear here in real-time.</p>
      </div>
    </div>
  );
}