
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY ,
  authDomain: "real-estate-515ea.firebaseapp.com",
  projectId: "real-estate-515ea",
  storageBucket: "real-estate-515ea.appspot.com",
  messagingSenderId: "293656927653",
  appId: "1:293656927653:web:60bac906564b0443d41c4c"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);