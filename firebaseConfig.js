// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

import { initializeAuth } from "firebase/auth";
//@ts-ignore
import { getReactNativePersistence } from "@firebase/auth/dist/rn/index.js";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getFirestore, collection } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBAKrgJ-7w6x86oQLK0Hkz2sLyyQtM23wg",
  authDomain: "apna-karcha-7d635.firebaseapp.com",
  projectId: "apna-karcha-7d635",
  storageBucket: "apna-karcha-7d635.firebasestorage.app",
  messagingSenderId: "335667504981",
  appId: "1:335667504981:web:9e1c0e4ad056aaec9671dc",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

export const db = getFirestore(app);
export const userRef = collection(db, "users");
export const roomRef = collection(db, "rooms");
