import React, { useState, useEffect } from 'react';
import { Leaf, Trash2, MapPin, Recycle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { subscribeToListings, claimFoodListing } from '../services/listings';

export function ComposterHub() {
    const { profile, user } = useAuth();
    const [liveListings, setLiveListings] = useState<any[]>([]);

    useEffect(() => {
        // 1. Subscribe to Compost Only items
        const unsubscribe = subscribeToListings(true, (data) => setLiveListings(data));
        return () => unsubscribe();
    }, []);

    const handlePickup = async (id: string, qty: number, donorId: string) => {
        try {
            // 2. Verified Logic: Sends all 5 arguments correctly
            await claimFoodListing(id, user!.uid, profile!.name || "Composter", qty, donorId);
        } catch (e) {
            console.error("Pickup failed:", e);
        }
    };

    return (
        <div className="p-8 space-y-10">
            <div className="flex justify-between items-end px-2">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight flex items-center gap-2">
                        <Recycle className="text-orange-700" /> Compost Collection
                    </h1>
                    <p className="text-gray-400 font-medium italic text-sm mt-2">Organic waste available for your facility</p>
                </div>
            </div>

            {liveListings.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 bg-gray-50 rounded-[3rem] border-2 border-dashed border-gray-200">
                    <Leaf className="w-16 h-16 text-orange-300 mb-4" />
                    <p className="text-orange-800 font-bold text-xl text-center">No compost listings available</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {liveListings.map((l) => (
                        <div key={l.id} className="bg-white rounded-[2.5rem] overflow-hidden shadow-sm border border-gray-100 p-8 flex flex-col justify-between hover:shadow-xl transition-all">
                            <div>
                                <h3 className="font-bold text-xl text-gray-900 mb-4 truncate">{l.description || "Organic Batch"}</h3>
                                <div className="space-y-4 mb-8">
                                    <div className="flex justify-between items-center text-xs font-bold text-gray-400">
                                        <span className="uppercase tracking-widest">Source</span>
                                        <span className="text-gray-900 font-bold flex items-center gap-1">
                                            <MapPin className="w-4 h-4 text-orange-600" />
                                            {l.donorName}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center text-xs font-bold text-gray-400">
                                        <span className="uppercase tracking-widest">Weight</span>
                                        <span className="text-gray-900 font-black text-lg">{l.currentQty} Units</span>
                                    </div>
                                </div>
                            </div>


                           <button 
  onClick={() => handlePickup(l.id, l.currentQty, l.donorId)} 
  style={{ backgroundColor: 'black', color: 'white' }} 
  className="w-full py-4 rounded-2xl font-bold shadow-lg flex items-center justify-center gap-2 transition-all active:scale-95"
>
  <Trash2 className="w-5 h-5" /> Schedule Pickup
</button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}