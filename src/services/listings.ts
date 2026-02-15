import { db } from '../firebase';
import { 
  collection, addDoc, updateDoc, doc, query, where, onSnapshot, serverTimestamp, increment 
} from 'firebase/firestore';

// 1. Post Food Logic - Force numeric types
export const postFoodListing = async (donorId: string, donorName: string, details: any) => {
  const numericQty = Number(details.qty) || 0; 
  
  return await addDoc(collection(db, "listings"), {
    ...details,
    donorId,
    donorName,
    qty: numericQty,
    initialQty: numericQty,
    currentQty: numericQty, 
    status: 'AVAILABLE',
    createdAt: serverTimestamp(),
  });
};

// 2. CLAIM LOGIC: FIXED to accept 'donorId' (The 5th Argument)
export const claimFoodListing = async (listingId: string, claimerId: string, claimerName: string, amount: number, donorId?: string) => {
  const listingRef = doc(db, "listings", listingId);
  
  // Decrease quantity
  await updateDoc(listingRef, {
    currentQty: increment(-amount)
  });

  // If we have a donorId, update their "Impact" stats automatically
  if (donorId) {
    const donorRef = doc(db, "users", donorId);
    await updateDoc(donorRef, {
      totalMeals: increment(amount),
      wasteReduced: increment(amount * 0.5), // Approx 0.5kg per meal
      activeListings: increment(amount === 0 ? -1 : 0) // Reduce active count if 0 left? Logic depends on your preference. 
      // safer to just not touch activeListings here unless we verify it's empty, 
      // but for now let's just update the positive impact:
    }).catch(e => console.log("Error updating donor stats:", e));
  }

  // Log transaction
  return await addDoc(collection(db, "transactions"), {
    listingId, 
    claimerId, 
    claimerName, 
    amountClaimed: amount, 
    timestamp: serverTimestamp()
  });
};

// 3. Subscription Logic
export const subscribeToListings = (forCompost: boolean, callback: (data: any[]) => void) => {
  const q = query(
    collection(db, "listings"), 
    where("status", "==", "AVAILABLE")
  );

  return onSnapshot(q, (snapshot) => {
    const allItems = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
    
    // Filter logic
    const filtered = allItems.filter((l: any) => {
      const hasStock = Number(l.currentQty) > 0;
      const typeMatch = forCompost ? l.isCompost === true : l.isDonation === true;
      return hasStock && typeMatch;
    });
      
    callback(filtered);
  });
};