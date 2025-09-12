// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD3yJMlIh965r8pWeqEPRdtU7kysRZgBjk",
  authDomain: "maashura-admin.firebaseapp.com",
  projectId: "maashura-admin",
  storageBucket: "maashura-admin.firebasestorage.app",
  messagingSenderId: "858574954468",
  appId: "1:858574954468:web:a89ac0b6ee207147de71f1",
  measurementId: "G-TDQSZW7L13"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth(app);

// Export the database and auth instances
export { db, auth };