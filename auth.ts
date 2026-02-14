import { auth, db } from '../firebase';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut 
} from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

// Fixes the red lines in VS Code
interface SignUpData {
  role: string;
  name: string;
  address: string;
}

// 1. SIGNUP: Fixed to remove 'phone' and prevent "undefined" errors
export const signUpEcoFeed = async (email: string, password: string, profileData: SignUpData) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;
  
  await setDoc(doc(db, "users", user.uid), {
    uid: user.uid,
    email,
    role: profileData.role, // "DONOR", "RECEIVER", or "COMPOSTER"
    name: profileData.name,
    address: profileData.address,
    createdAt: serverTimestamp(),
    // Initialize metrics with 0 for the dashboard
    totalMeals: 0,
    wasteReduced: "0kg",
    co2Saved: "0 Tons",
    activeListings: 0
  });

  return user;
};

// 2. LOGIN: Restored this function so Login.tsx works again
export const loginEcoFeed = async (email: string, password: string) => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  return userCredential.user;
};

// 3. LOGOUT: Standard logout function
export const logoutEcoFeed = async () => {
  await signOut(auth);
};