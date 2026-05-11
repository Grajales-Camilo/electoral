// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD3-usibvVhZV_5vcnhrib74uWqOtpQWJE",
  authDomain: "ivc-26.firebaseapp.com",
  projectId: "ivc-26",
  storageBucket: "ivc-26.firebasestorage.app",
  messagingSenderId: "833549665008",
  appId: "1:833549665008:web:4e4820f0bef8fbd8f5b835",
  measurementId: "G-ZFM5TW6YE5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
