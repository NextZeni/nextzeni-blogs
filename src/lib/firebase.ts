import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyACySoYMGC1PU2iplSU-NJKCaWXc0slbLA",
  authDomain: "nextzeni.firebaseapp.com",
  projectId: "nextzeni",
  storageBucket: "nextzeni.firebasestorage.app",
  messagingSenderId: "890024062859",
  appId: "1:890024062859:web:c99892321e1c59df31c98e",
  measurementId: "G-D5R33CV9SX",
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export const db = getFirestore(app);
export const storage = getStorage(app);
