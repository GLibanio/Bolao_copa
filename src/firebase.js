import { initializeApp } from "firebase/app";

import { getAuth } from "firebase/auth";

import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBuq8kPq5N8baKSLMHcUQIxsGAddEWwbt8",
  authDomain: "bolao-copa-26-89492.firebaseapp.com",
  databaseURL:
    "https://bolao-copa-26-89492-default-rtdb.firebaseio.com",
  projectId: "bolao-copa-26-89492",
  storageBucket:
    "bolao-copa-26-89492.firebasestorage.app",
  messagingSenderId: "1018880795842",
  appId:
    "1:1018880795842:web:f2713055d5ab428f16c75b",
  measurementId: "G-K6YSFBHTT6",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const db = getFirestore(app);

export default app;