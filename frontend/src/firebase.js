import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyDpqiTGgre18E3b8WijnpnIl5DgwgNhY0c",
  authDomain: "pcb-micod.firebaseapp.com",
  projectId: "pcb-micod",
  storageBucket: "pcb-micod.firebasestorage.app",
  messagingSenderId: "914402672068",
  appId: "1:914402672068:web:89fc08966491b4c9127891",
  measurementId: "G-MQK9KE12S7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Services
export const storage = getStorage(app);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const analytics = typeof window !== "undefined" ? getAnalytics(app) : null;

export default app;
