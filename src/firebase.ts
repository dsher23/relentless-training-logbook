
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAjuJ6X0QJM0J9QqkUJ7YDtdL30XAn-AcE",
  authDomain: "ironlog-e178a.firebaseapp.com",
  projectId: "ironlog-e178a",
  storageBucket: "ironlog-e178a.appspot.com",  // Fixed storage bucket URL
  messagingSenderId: "412400158271",
  appId: "1:412400158271:web:20810fc8e9ca156ae81a8a",
  measurementId: "G-E74P4KFPB3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore and Auth
export const db = getFirestore(app);
export const auth = getAuth(app);
