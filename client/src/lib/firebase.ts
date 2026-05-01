import { initializeApp, type FirebaseApp } from "firebase/app";
import {
  getAuth,
  signOut as firebaseSignOut,
  type Auth,
} from "firebase/auth";
import { doc, getDoc, getFirestore, setDoc } from "firebase/firestore";
import type { Firestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBvNzGHDlQuRaOtV-f6fwFGjrsbbMruoyk",
  authDomain: "meem-38f4b.firebaseapp.com",
  projectId: "meem-38f4b",
  storageBucket: "meem-38f4b.firebasestorage.app",
  messagingSenderId: "924259262459",
  appId: "1:924259262459:web:aeaec9223eb89dee9e755e",
  measurementId: "G-FHC9C119PH",
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

let adminPinSessionActive = false;

export function enableAdminPinSession() {
  adminPinSessionActive = true;
}

export function clearAdminPinSession() {
  adminPinSessionActive = false;
}

export function hasAdminPinSession() {
  return adminPinSessionActive;
}

export async function getUserProfile(uid: string) {
  if (!db) return null;
  const userDoc = await getDoc(doc(db, "users", uid));
  return userDoc.exists() ? userDoc.data() : null;
}

export async function saveUserProfile(uid: string, profile: Record<string, unknown>) {
  if (!db) return;
  await setDoc(doc(db, "users", uid), profile, { merge: true });
}

/** Sign out current Firebase user and clear local session data */
export async function logoutUser() {
  clearAdminPinSession();
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
