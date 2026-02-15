import { db } from '../firebase';
import { collection, addDoc, query, where, onSnapshot, orderBy, serverTimestamp, updateDoc, doc } from 'firebase/firestore';

// 1. Send Notification
export const sendNotification = async (userId: string, message: string, type: 'info' | 'success' | 'alert' | 'action_required', payload: any = {}) => {
  try {
    await addDoc(collection(db, "notifications"), {
      userId,
      message,
      type,
      ...payload, // This spreads the donorId and amount so the receiver can access them
      read: false,
      createdAt: serverTimestamp()
    });
  } catch (error) {
    console.error("Error sending notification:", error);
  }
};

// 2. Subscribe (For Bell Icon)
export const subscribeToNotifications = (userId: string, callback: (data: any[]) => void) => {
  const q = query(
    collection(db, "notifications"),
    where("userId", "==", userId),
    orderBy("createdAt", "desc")
  );

  return onSnapshot(q, (snapshot) => {
    const notifs = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
    callback(notifs);
  });
};

// 3. Mark Read
export const markNotificationRead = async (id: string) => {
  const ref = doc(db, "notifications", id);
  await updateDoc(ref, { read: true });
};