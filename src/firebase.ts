// src/firebase.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAwJdWcagjCbsFED1PviJYVnx3668jZKCA",
  authDomain: "ecofeed-project.firebaseapp.com",
  projectId: "ecofeed-project",
  storageBucket: "ecofeed-project.firebasestorage.app",
  messagingSenderId: "27873879892",
  appId: "1:27873879892:web:ef4511b2f64b32831fcac1"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);