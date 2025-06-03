
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Firebase configuration
// TODO: Replace with your actual Firebase project configuration
const firebaseConfig = {
  apiKey: "YOUR_ACTUAL_API_KEY_HERE", // Replace this with your real API key
  authDomain: "ironlog-dev.firebaseapp.com",
  projectId: "ironlog-dev",
  storageBucket: "ironlog-dev.appspot.com",
  messagingSenderId: "839894714041",
  appId: "1:839894714041:web:3ef8fed065ee010ba8a9ab"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication
const auth = getAuth(app);

// Initialize Firestore
const db = getFirestore(app);

// Initialize Storage
const storage = getStorage(app);

export { app, auth, db, storage };
