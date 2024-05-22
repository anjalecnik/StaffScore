import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCYHzm6Kx7N7yi02lU_9LdpfbI3ioZgLPA",
  authDomain: "staffscore-c3953.firebaseapp.com",
  projectId: "staffscore-c3953",
  storageBucket: "staffscore-c3953.appspot.com",
  messagingSenderId: "856623404494",
  appId: "1:856623404494:web:2c5c789a9ab2bcee74479f",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
