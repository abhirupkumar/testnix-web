// Import the functions you need from the SDKs you need
import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCkj_r-qqoqetCpyipJPnFuNpvPuQ7sDRo",
    authDomain: "testnix-f4954.firebaseapp.com",
    projectId: "testnix-f4954",
    storageBucket: "testnix-f4954.appspot.com",
    messagingSenderId: "980135875201",
    appId: "1:980135875201:web:184a2bcbcce1ce61a2f380"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp()
const db = getFirestore()
const auth = getAuth()

export default app
export { auth, db }