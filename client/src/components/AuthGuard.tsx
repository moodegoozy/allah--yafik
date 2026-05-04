import { useLocation } from "wouter";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import {
  auth,
  getUserProfile,
  hasAdminPinSession,
} from "@/lib/firebase";

/** Routes accessible without login */
const PUBLIC_ROUTES = ["/", "/login", "/404", "/privacy-policy", "/terms"];

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
  const [authReady, setAuthReady] = useState(false);
  const [user, setUser] = useState<Record<string, any> | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    if (!auth) {
      setAuthReady(true);
      return;
    }

    const unsubscribe = onAuthStateChanged(
      auth,
      async firebaseUser => {
      if (firebaseUser) {
        setIsAuthenticated(true);
        try {
          const profile = await getUserProfile(firebaseUser.uid);
          setUser(profile);
        } catch {
          setUser(null);
        }
      } else {
        setIsAuthenticated(false);
        setUser(null);
      }
      setAuthReady(true);
      },
      () => {
        // If Firebase auth fails (e.g. invalid API key), keep app usable via localStorage auth.
        setAuthReady(true);
      }
    );
    return unsubscribe;
  }, []);

  const adminAccess = hasAdminPinSession() || user?.role === "admin";
  const isPublic = PUBLIC_ROUTES.includes(location);
  const isProtected = PROTECTED_ROUTES.some(r => location.startsWith(r));
  const isTestPage = location === "/mental-health-test";
  const hasFirebaseSession = !auth || !!auth.currentUser;

  if (!authReady) return null;

  let redirect: string | null = null;

  if (!isAuthenticated && !isPublic && !isTestPage && !adminAccess) {
    redirect = "/login";
  } else if (
    isAuthenticated &&
    user &&
    user.role !== "admin" &&
    user.testCompleted === false &&
    !isTestPage &&
    !isPublic
  ) {
    redirect = "/mental-health-test";
  } else if (location.startsWith("/admin") && !adminAccess) {
    redirect = isAuthenticated ? "/dashboard" : "/login";
  } else if (!isAuthenticated && isProtected && !adminAccess) {
    redirect = "/login";
  }

  if (redirect) {
    navigate(redirect);
    return null;
  }

  return <>{children}</>;
}
