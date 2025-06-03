
import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAjuJ6X0QJM0J9QqkUJ7YDtdL30XAn-AcE",
  authDomain: "ironlog-dev.firebaseapp.com",
  projectId: "ironlog-dev",
  storageBucket: "ironlog-dev.appspot.com",
  messagingSenderId: "839894714041",
  appId: "1:839894714041:web:3ef8fed065ee010ba8a9ab"
};

// Initialize Firebase - check if app already exists to prevent duplicate app error
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Initialize Firebase Authentication
const auth = getAuth(app);

// Initialize Firestore
const db = getFirestore(app);

// Initialize Storage
const storage = getStorage(app);

export { app, auth, db, storage };
