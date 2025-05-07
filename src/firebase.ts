import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Validate environment variables before initializing Firebase
const requiredEnvVars = [
  "VITE_FIREBASE_API_KEY",
  "VITE_FIREBASE_AUTH_DOMAIN",
  "VITE_FIREBASE_PROJECT_ID",
  "VITE_FIREBASE_STORAGE_BUCKET",
  "VITE_FIREBASE_MESSAGING_SENDER_ID",
  "VITE_FIREBASE_APP_ID",
];

// Check for missing environment variables
const missingEnvVars = requiredEnvVars.filter((key) => !import.meta.env[key]);
if (missingEnvVars.length > 0) {
  console.error("Missing required Firebase environment variables:", missingEnvVars);
  console.warn("Falling back to hardcoded Firebase configuration as a temporary measure.");
}

// Log the raw environment variables for debugging
console.log("Raw Environment Variables:", {
  VITE_FIREBASE_API_KEY: import.meta.env.VITE_FIREBASE_API_KEY,
  VITE_FIREBASE_AUTH_DOMAIN: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  VITE_FIREBASE_PROJECT_ID: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  VITE_FIREBASE_STORAGE_BUCKET: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  VITE_FIREBASE_MESSAGING_SENDER_ID: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  VITE_FIREBASE_APP_ID: import.meta.env.VITE_FIREBASE_APP_ID,
});

// Use environment variables if available, otherwise fall back to hardcoded values
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyAjuJ6X0QJM0J9QqkUJ7YDtdL30XAn-AcE",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "ironlog-e178a.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "ironlog-e178a",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "ironlog-e178a.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "412400158271",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:412400158271:web:20810fc8e9ca156ae81a8a",
};

// Log the final firebaseConfig to verify the loaded values
console.log("Firebase Config Used for Initialization:", firebaseConfig);

let app;
try {
  app = initializeApp(firebaseConfig);
  console.log("Firebase app initialized successfully.");
} catch (error) {
  console.error("Failed to initialize Firebase app:", error);
  throw error;
}

let auth;
try {
  auth = getAuth(app);
  console.log("Firebase Auth initialized successfully.");
} catch (error) {
  console.error("Failed to initialize Firebase Auth:", error);
  throw error;
}

let db;
try {
  db = getFirestore(app);
  console.log("Firestore initialized successfully.");
} catch (error) {
  console.error("Failed to initialize Firestore:", error);
  throw error;
}

export { auth, db };
