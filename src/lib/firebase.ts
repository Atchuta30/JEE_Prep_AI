import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";

// Your web app's Firebase configuration
// It's STRONGLY recommended to use environment variables for this
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase
let app: FirebaseApp;

if (!firebaseConfig.apiKey || firebaseConfig.apiKey === "YOUR_FIREBASE_API_KEY" || firebaseConfig.apiKey === "AIzaSyBDvb5zle8KPrt-ytI9tE78RoyI9JOk_xY_PLACEHOLDER") {
  console.warn(
    "Firebase API Key is missing, is using a placeholder, or is the previous example key. " +
    "Please ensure NEXT_PUBLIC_FIREBASE_API_KEY in your .env file is correctly set for Firebase to work."
  );
}


if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

const auth: Auth = getAuth(app);
const db: Firestore = getFirestore(app);

export { app, auth, db };


