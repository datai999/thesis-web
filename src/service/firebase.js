import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC8147ZvfFX6fIuxYzAZaxmjQxJJoYQQZo",
  authDomain: "thesis-89bfb.firebaseapp.com",
  projectId: "thesis-89bfb",
  storageBucket: "thesis-89bfb.appspot.com",
  messagingSenderId: "889075031837",
  appId: "1:889075031837:web:f754a809a3f260cd254bf4",
  measurementId: "G-TKZRC7GR4L",
};

initializeApp(firebaseConfig);

const auth = getAuth();
const provider = new GoogleAuthProvider();

export const signInWithGoogle = async () => {
  let result = await signInWithPopup(auth, provider);
  return GoogleAuthProvider.credentialFromResult(result);
};

export const getIdToken = async () => {
  return await auth.currentUser.getIdToken(true);
};
