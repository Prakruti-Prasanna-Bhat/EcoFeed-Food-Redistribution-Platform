import React from 'react';
import { Leaf, MapPin, Trash2, Clock, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export function ComposterHub() {
  const { profile } = useAuth();

  // Point #4: Mock data following the Receiver Hub UI style
  const compostListings = [
    { id: 1, title: 'Vegetable Scraps & Peels', donor: 'The Green Bistro', qty: '12kg', time: '5h remaining', match: '98%', cat: 'Organic Waste', img: 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=400' },
    { id: 2, title: 'Used Coffee Grounds', donor: 'Artisan Bakas', qty: '8kg', time: 'Overnight', match: '95%', cat: 'Nitrogen Rich', img: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400' },
  ];

  return (
    <div className="p-8 space-y-10">
      <div className="flex justify-between items-end px-2">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Available for Composting</h1>
          <p className="text-gray-400 font-medium italic text-sm">Matching with <span className="text-green-600 font-bold">{profile?.displayName || 'your Facility'}</span></p>
        </div>
        <div className="bg-amber-50 text-amber-700 px-4 py-2 rounded-xl text-xs font-bold border border-amber-100 flex items-center gap-2">
          <Leaf className="w-4 h-4" /> Soil Health Priority
        </div>
      </div>

      {/* Point #4: Grid layout exactly like ReceiverHub */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {compostListings.map((listing) => (
          <div key={listing.id} className="bg-white rounded-[2.5rem] overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300">
            <div className="h-48 relative">
              <img src={listing.img} className="w-full h-full object-cover grayscale-[20%]" alt={listing.title} />
              <div className="absolute top-4 left-4 bg-amber-100 text-amber-900 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest">{listing.cat}</div>
              <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest shadow-lg shadow-green-200">{listing.match} Match</div>
            </div>
            <div className="p-8">
              <h3 className="font-bold text-xl text-gray-900 mb-6">{listing.title}</h3>
              <div className="space-y-4 mb-8">
                <div className="flex justify-between items-center text-sm font-medium">
                  <span className="text-gray-400 font-bold uppercase text-[10px]">SOURCE</span>
                  <span className="text-gray-900 flex items-center gap-1 font-bold"><MapPin className="w-4 h-4 text-green-600" />{listing.donor}</span>
                </div>
                <div className="flex justify-between items-center text-sm font-medium">
                  <span className="text-gray-400 font-bold uppercase text-[10px]">WEIGHT</span>
                  <span className="text-gray-900 font-bold">{listing.qty}</span>
                </div>
                <div className="flex justify-between items-center text-sm font-medium">
                  <span className="text-gray-400 font-bold uppercase text-[10px]">AVAILABILITY</span>
                  <span className="text-orange-500 flex items-center gap-1 font-bold"><Clock className="w-4 h-4" />{listing.time}</span>
                </div>
              </div>
              <button className="w-full bg-green-600 text-white py-4 rounded-2xl font-bold hover:bg-green-700 shadow-lg shadow-green-100 transition-all active:scale-95 flex items-center justify-center gap-2">
                <CheckCircle2 className="w-5 h-5" /> Schedule Pickup
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}