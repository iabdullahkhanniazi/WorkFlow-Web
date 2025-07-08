



import { initializeApp } from "firebase/app";
// Import all the auth functions we need, including updateProfile
import { 
  getAuth, 
  onAuthStateChanged, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut,
  updateProfile // Add this import
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your firebaseConfig object
// Your firebaseConfig object
const firebaseConfig = {
  apiKey: "AIzaSyBGFHAw9HtFGd5AU6LuMRDN3GkJIZDR7eY",
  authDomain: "workflow-1e6ed.firebaseapp.com",
  projectId: "workflow-1e6ed",
  storageBucket: "workflow-1e6ed.firebasestorage.app",
  messagingSenderId: "475146109664",
  appId: "1:475146109664:web:20debe12f06c666ff88685",
  measurementId: "G-BHZX95WXJJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Export everything, including the new updateProfile function
export { 
  auth, 
  db, 
  onAuthStateChanged, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut,
  updateProfile // Add this export
};
