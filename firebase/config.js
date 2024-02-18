// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyC4lie92VyBPi9BDWb3pb3aY-bEdiqp6D4",
  authDomain: "tamarind-house-46200.firebaseapp.com",
  projectId: "tamarind-house-46200",
  storageBucket: "tamarind-house-46200.appspot.com",
  messagingSenderId: "1062794250841",
  appId: "1:1062794250841:web:5871adbdf48dde84ea3f48",
  measurementId: "G-8S36YTYE9S"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
export {db,auth};