import React from 'react';
import { Heart, Users, Wind, MapPin, Clock, Info, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export function ReceiverHub() {
  const { profile } = useAuth();

  // Point #3: Dynamic metrics for the Receiver (NGO)
  const rescueMetrics = [
    { 
      label: 'Meals Rescued', 
      value: profile?.totalRescued || '0', 
      icon: Heart, 
      color: 'text-pink-500', 
      bg: 'bg-pink-50' 
    },
    { 
      label: 'People Served', 
      value: profile?.peopleServed || '0', 
      icon: Users, 
      color: 'text-blue-500', 
      bg: 'bg-blue-50' 
    },
    { 
      label: 'CO₂ Diverted', 
      value: profile?.co2Saved ? `${profile.co2Saved}kg` : '0kg', 
      icon: Wind, 
      color: 'text-green-500', 
      bg: 'bg-green-50' 
    },
  ];

  const listings = [
    { id: 1, title: 'Leftover Breakfast Pastries', donor: 'Central Plaza Hotel', qty: '5kg', time: '2h 15m', match: '85%', cat: 'Bakery', img: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400' },
    { id: 2, title: 'Mixed Vegetable Curry', donor: 'The Green Bistro', qty: '10 Portions', time: '2h 15m', match: '92%', cat: 'Cooked Meals', img: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=400' },
    { id: 3, title: 'Fresh Garden Salad Mix', donor: 'Urban Grocers', qty: '15kg', time: '4h 30m', match: '68%', cat: 'Vegetables', img: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400' },
  ];

  return (
    <div className="p-8 space-y-10">
      {/* Point #3: Receiver-Specific Metric Cards */}
      <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
        {rescueMetrics.map((m, idx) => (
          <div key={idx} className="bg-white min-w-[300px] rounded-[2rem] p-8 shadow-sm border border-gray-100 flex items-center justify-between">
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

      <div className="flex justify-between items-end px-2">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Available Food Near You</h1>
          <p className="text-gray-400 font-medium">Matching with <span className="text-green-600 font-bold">{profile?.displayName || 'your NGO'}</span></p>
        </div>
        <div className="bg-blue-50 text-blue-600 px-4 py-2 rounded-xl text-xs font-bold border border-blue-100 flex items-center gap-2">
          <Info className="w-4 h-4" /> Live Radius: 5km
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {listings.map((listing) => (
          <div key={listing.id} className="bg-white rounded-[2.5rem] overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300">
            <div className="h-48 relative">
              <img src={listing.img} className="w-full h-full object-cover" alt={listing.title} />
              <div className="absolute top-4 left-4 bg-orange-100 text-orange-700 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest">{listing.cat}</div>
              <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest shadow-lg shadow-green-200">{listing.match} Match</div>
            </div>
            <div className="p-8">
              <h3 className="font-bold text-xl text-gray-900 mb-6">{listing.title}</h3>
              <div className="space-y-4 mb-8">
                <div className="flex justify-between items-center text-sm font-medium">
                  <span className="text-gray-400">DONOR LOCATION</span>
                  <span className="text-gray-900 flex items-center gap-1 font-bold"><MapPin className="w-4 h-4 text-green-600" />{listing.donor}</span>
                </div>
                <div className="flex justify-between items-center text-sm font-medium">
                  <span className="text-gray-400">QUANTITY</span>
                  <span className="text-gray-900 font-bold">{listing.qty}</span>
                </div>
                <div className="flex justify-between items-center text-sm font-medium">
                  <span className="text-gray-400">EXPIRES IN</span>
                  <span className="text-orange-500 flex items-center gap-1 font-bold"><Clock className="w-4 h-4" />{listing.time}</span>
                </div>
              </div>
              <button className="w-full bg-green-600 text-white py-4 rounded-2xl font-bold hover:bg-green-700 shadow-lg shadow-green-100 transition-all active:scale-95 flex items-center justify-center gap-2">
                <CheckCircle2 className="w-5 h-5" /> Rescue Food
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}