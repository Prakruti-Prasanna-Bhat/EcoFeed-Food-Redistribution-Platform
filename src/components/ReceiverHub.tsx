import React, { useState, useEffect } from 'react';
import { PackageSearch, MapPin, Clock, Users, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { subscribeToListings, claimFoodListing } from '../services/listings';

export function ReceiverHub() {
  const { profile, user } = useAuth();
  const [liveListings, setLiveListings] = useState<any[]>([]);
  const [partialModal, setPartialModal] = useState<{id: string, max: number} | null>(null);
  const [amt, setAmt] = useState(1);

  useEffect(() => {
    // Verified: Finding listings where isDonation is true
    const unsubscribe = subscribeToListings(false, (data) => setLiveListings(data));
    return () => unsubscribe();
  }, []);

  const handlePartialRescue = async () => {
    if (!partialModal) return;
    try {
      await claimFoodListing(partialModal.id, user!.uid, profile!.name || profile!.displayName, amt);
      setPartialModal(null);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="p-8 space-y-10 relative">
      <h1 className="text-3xl font-black text-gray-900 tracking-tight">Available Food Near You</h1>

      {/* Partial Rescue Modal UI */}
      {partialModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white p-10 rounded-[2.5rem] w-full max-w-sm text-center space-y-6 animate-in zoom-in-95">
            <div className="flex justify-between items-center">
               <h2 className="text-xl font-bold">Partial Rescue</h2>
               <button onClick={() => setPartialModal(null)}><X className="text-gray-400" /></button>
            </div>
            <p className="text-gray-500 font-medium">How many portions? (Max: {partialModal.max})</p>
            <input 
              type="number" 
              value={amt} 
              onChange={e => setAmt(Math.min(Number(e.target.value), partialModal.max))} 
              className="w-full p-4 bg-gray-50 rounded-2xl text-center text-3xl font-black outline-none focus:ring-2 focus:ring-green-500" 
            />
            <button 
              onClick={handlePartialRescue}
              className="w-full bg-green-600 text-white py-4 rounded-2xl font-bold shadow-lg"
            >Confirm Rescue</button>
          </div>
        </div>
      )}
      
      {liveListings.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-gray-50 rounded-[3rem] border-2 border-dashed border-gray-200">
          <PackageSearch className="w-16 h-16 text-gray-300 mb-4" />
          <p className="text-gray-500 font-bold text-xl text-center">No current listings available</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {liveListings.map((l) => (
            <div key={l.id} className="bg-white rounded-[2rem] overflow-hidden shadow-sm border border-gray-100 transition-all hover:shadow-xl p-8 space-y-6">
              <h3 className="text-xl font-bold text-gray-900 truncate">{l.description || l.category}</h3>
              <div className="space-y-4 text-sm font-bold text-gray-400">
                <div className="flex justify-between items-center border-t border-gray-50 pt-4">
                  <span className="uppercase text-[10px] tracking-widest">Remaining</span>
                  <span className="text-gray-900 font-black text-lg">{l.currentQty} Portions</span>
                </div>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => claimFoodListing(l.id, user!.uid, profile!.name || profile!.displayName, l.currentQty)} 
                  className="flex-1 bg-green-600 text-white py-4 rounded-2xl font-bold hover:bg-green-700 transition-all active:scale-95 shadow-lg shadow-green-100"
                >Accept Full</button>
                
                {/* RESTORED: Partial Button logic */}
                {l.allowPartial && (
                  <button 
                    onClick={() => { setPartialModal({id: l.id, max: l.currentQty}); setAmt(1); }}
                    className="p-4 bg-gray-50 rounded-2xl border border-gray-100 hover:bg-gray-100 transition-all"
                  >
                    <Users className="text-gray-600 w-6 h-6" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}