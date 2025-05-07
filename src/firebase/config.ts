
import { initializeApp } from 'firebase/app';
import { getAuth, setPersistence, browserLocalPersistence } from 'firebase/auth';
import { getFirestore, enableIndexedDbPersistence } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAjuJ6X0QJM0J9QqkUJ7YDtdL30XAn-AcE",
  authDomain: "ironlog-e178a.firebaseapp.com",
  projectId: "ironlog-e178a",
  storageBucket: "ironlog-e178a.appspot.com",
  messagingSenderId: "412400158271",
  appId: "1:412400158271:web:20810fc8e9ca156ae81a8a"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Configure Firebase Auth persistence
setPersistence(auth, browserLocalPersistence)
  .then(() => {
    console.log("Firebase auth persistence set to local");
  })
  .catch((error) => {
    console.error("Error setting auth persistence:", error);
  });

// Enable offline data persistence for Firestore
try {
  enableIndexedDbPersistence(db)
    .then(() => {
      console.log("Firestore persistence enabled");
    })
    .catch((err) => {
      console.error("Error enabling Firestore persistence:", err);
      if (err.code === 'failed-precondition') {
        console.warn("Multiple tabs open, persistence can only be enabled in one tab at a time.");
      } else if (err.code === 'unimplemented') {
        console.warn("The current browser does not support all of the features required to enable persistence");
      }
    });
} catch (error) {
  console.error("Error in persistence setup:", error);
}

export { auth, db, storage };
