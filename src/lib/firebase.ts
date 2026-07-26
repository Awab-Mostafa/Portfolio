import { initializeApp, getApps } from "firebase/app";
import { getAnalytics, isSupported as isAnalyticsSupported } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCfjd6HHxZDBLys_IChajUoWku-v1eONmo",
  authDomain: "portfolio-81b3a.firebaseapp.com",
  projectId: "portfolio-81b3a",
  storageBucket: "portfolio-81b3a.firebasestorage.app",
  messagingSenderId: "606064075382",
  appId: "1:606064075382:web:693a085202e09d9d173557",
  measurementId: "G-J0S03ZJ774"
};

const app = getApps().length > 0 ? getApps()[0] : initializeApp(firebaseConfig);

const analyticsPromise = typeof window !== "undefined"
  ? isAnalyticsSupported().then((supported) => (supported ? getAnalytics(app) : null)).catch(() => null)
  : Promise.resolve(null);

const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage, analyticsPromise as analytics };