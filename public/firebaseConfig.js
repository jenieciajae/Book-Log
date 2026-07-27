
// Import Firebase functions
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  updateDoc,
  doc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAHLb1JXqdV4Pjx4Nhb9Vv_FKO1gnHqFTQ",
  authDomain: "jeniecia-book-log.firebaseapp.com",
  projectId: "jeniecia-book-log",
  storageBucket: "jeniecia-book-log.firebasestorage.app",
  messagingSenderId: "501991426377",
  appId: "1:501991426377:web:eee5e27023bf7e533cb298",
  measurementId: "G-XYJRNBEVE5"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);


// Initialize Firestore
const db = getFirestore(app);


// Export database
export {
  db,
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  updateDoc,
  doc
};