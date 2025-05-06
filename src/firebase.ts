
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Firebase configuration (user must replace with their config from Firebase Console)
const firebaseConfig = {
  apiKey: "your-ironlog-api-key",
  authDomain: "your-ironlog-auth-domain",
  projectId: "your-ironlog-project-id",
  storageBucket: "your-ironlog-storage-bucket",
  messagingSenderId: "your-ironlog-messaging-sender-id",
  appId: "your-ironlog-app-id"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore and Auth
export const db = getFirestore(app);
export const auth = getAuth(app);

// IMPORTANT: Replace the firebaseConfig values above with your actual Firebase project 
// configuration from the Firebase Console (Project settings > General > Your apps > Web app)
