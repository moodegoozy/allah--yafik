import { useLocation } from "wouter";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

/** Routes accessible without login */
const PUBLIC_ROUTES = ["/", "/login", "/404"];

/** Routes that require a full (non-guest) account */
const PROTECTED_ROUTES = [
  "/dashboard",
  "/tracker",
  "/statistics",
  "/achievements",
  "/recovery",
  "/rehab-plan",
  "/rehab-assessment",
  "/exercises",
  "/chat",
  "/notifications",
  "/admin",
];

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const [location, navigate] = useLocation();
  // authReady: true once Firebase has confirmed the auth state on app start.
  // Pre-seed to true if we already have a session so there is no blank flash.
  const [authReady, setAuthReady] = useState(() => {
    return !!(
      sessionStorage.getItem("allah_yafik_current_user") ||
      localStorage.getItem("allah_yafik_current_user")
    );
  });

  // On mount: sync Firebase auth state with localStorage.
  // Admin users authenticate via PIN (sessionStorage only) — not Firebase Auth.
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async firebaseUser => {
      if (firebaseUser) {
        // Firebase says a user is logged in.
        // If localStorage is empty (e.g. cleared by user), restore profile from Firestore.
        const raw = localStorage.getItem("allah_yafik_current_user");
        if (!raw) {
          try {
            const snap = await getDoc(doc(db, "users", firebaseUser.uid));
            if (snap.exists()) {
              localStorage.setItem(
                "allah_yafik_current_user",
                JSON.stringify(snap.data())
              );
            }
          } catch {
            /* ignore network errors — user will be redirected to login below */
          }
        }
      } else {
        // Firebase says no user — clear any stale regular-user localStorage record.
        // Do NOT clear sessionStorage (that's where admin sessions live).
        const lsRaw = localStorage.getItem("allah_yafik_current_user");
        if (lsRaw) {
          try {
            const u = JSON.parse(lsRaw);
            if (u.role !== "admin") {
              localStorage.removeItem("allah_yafik_current_user");
            }
          } catch {}
        }
      }
      setAuthReady(true);
    });
    return unsubscribe;
  }, []);

  // Clean up any stale admin record that ended up in localStorage.
  const lsRaw = localStorage.getItem("allah_yafik_current_user");
  if (lsRaw) {
    try {
      if (JSON.parse(lsRaw).role === "admin")
        localStorage.removeItem("allah_yafik_current_user");
    } catch {}
  }

  const raw =
    sessionStorage.getItem("allah_yafik_current_user") ||
    localStorage.getItem("allah_yafik_current_user");
  const user = raw ? JSON.parse(raw) : null;
  const isPublic = PUBLIC_ROUTES.includes(location);
  const isProtected = PROTECTED_ROUTES.some(r => location.startsWith(r));
  const isTestPage = location === "/mental-health-test";

  // Wait for Firebase to confirm auth state before applying guards.
  if (!authReady) return null;

  // Compute redirect target (null = no redirect needed)
  let redirect: string | null = null;

  if (!user && !isPublic && !isTestPage) {
    redirect = "/login";
  } else if (user?.role === "guest" && isProtected) {
    redirect = "/login";
  } else if (user && user.testCompleted === false && !isTestPage && !isPublic) {
    redirect = "/mental-health-test";
  } else if (location.startsWith("/admin") && user?.role !== "admin") {
    redirect = "/dashboard";
  }

  if (redirect) {
    navigate(redirect);
    return null;
  }

  return <>{children}</>;
}

