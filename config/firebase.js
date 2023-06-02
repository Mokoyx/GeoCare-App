import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDy9d5dloP3AmHlNV_B3Ar3PpEX6Bx6Nvw",
  authDomain: "geocare-2a0e6.firebaseapp.com",
  projectId: "geocare-2a0e6",
  storageBucket: "geocare-2a0e6.appspot.com",
  messagingSenderId: "1042896785363",
  appId: "1:1042896785363:web:7bb5eb1b065ed15a15a926",
};

const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
export const db = getFirestore(app);
export const auth = getAuth(app);
