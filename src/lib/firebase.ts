// src/lib/firebase.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAjuJ6X0QJM0J9QqkUJ7YDtdL30XAn-AcE",
  authDomain: "ironlog-e178a.firebaseapp.com",
  projectId: "ironlog-e178a",
  storageBucket: "ironlog-e178a.appspot.com",
  messagingSenderId: "412400158271",
  appId: "1:412400158271:web:example1234567890" // replace with real if you have one
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
