// src/firebase.ts

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCEDmDZjjBJ1wysJIwnDzcBpxVJZhQzgis",
  authDomain: "birthday-72ab9.firebaseapp.com",
  projectId: "birthday-72ab9",
  storageBucket: "birthday-72ab9.firebasestorage.app",
  messagingSenderId: "520586162211",
  appId: "1:520586162211:web:b0c16b92b48e3944e80196",
  measurementId: "G-0VFM9CQ7T0"
};


const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
