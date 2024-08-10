// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAk6XO2f4Aje6mbNiXgcaaHfJRF7i_yBLY",
  authDomain: "dha7akna.firebaseapp.com",
  projectId: "dha7akna",
  storageBucket: "dha7akna.appspot.com",
  messagingSenderId: "173751881001",
  appId: "1:173751881001:web:33d01ece1a86ac67063b38",
  measurementId: "G-JYPTJFF9G5",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
