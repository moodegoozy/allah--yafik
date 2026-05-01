import { initializeApp, type FirebaseApp } from "firebase/app";
import {
  getAuth,
  signOut as firebaseSignOut,
  type Auth,
} from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey &&
    firebaseConfig.authDomain &&
    firebaseConfig.projectId &&
    firebaseConfig.appId
);

let app: FirebaseApp | null = null;
export let auth: Auth | null = null;
export let db: Firestore | null = null;

if (isFirebaseConfigured) {
  try {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
  } catch (error) {
    console.warn("Firebase initialization failed. Falling back to local mode.", error);
  }
} else {
  console.warn("Firebase env vars are missing. Running in local mode.");
}

/** Sign out current Firebase user and clear local session data */
export async function logoutUser() {
  if (auth) {
    try {
      await firebaseSignOut(auth);
    } catch {
      // Ignore sign-out failures in local/offline mode.
    }
  }
  localStorage.removeItem("allah_yafik_current_user");
  sessionStorage.removeItem("allah_yafik_current_user");
}
