import { useLocation } from "wouter";
import { useEffect } from "react";

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

  // Read user synchronously on every render so the guard is always up-to-date.
  // Admin sessions live in sessionStorage (clears on tab close); regular users in localStorage.
  // Also clean up any stale admin record in localStorage left by older app versions.
  const lsRaw = localStorage.getItem("allah_yafik_current_user");
  if (lsRaw) {
    try {
      if (JSON.parse(lsRaw).role === "admin") localStorage.removeItem("allah_yafik_current_user");
    } catch {}
  }
  const raw =
    sessionStorage.getItem("allah_yafik_current_user") ||
    localStorage.getItem("allah_yafik_current_user");
  const user = raw ? JSON.parse(raw) : null;
  const isPublic = PUBLIC_ROUTES.includes(location);
  const isProtected = PROTECTED_ROUTES.some(r => location.startsWith(r));
  const isTestPage = location === "/mental-health-test";

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

  useEffect(() => {
    if (redirect) navigate(redirect);
  }, [redirect, navigate]);

  // Block rendering when a redirect is pending
  if (redirect) return null;

  return <>{children}</>;
}
