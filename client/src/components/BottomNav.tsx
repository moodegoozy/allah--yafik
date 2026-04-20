/**
 * BottomNav - شريط التنقل السفلي للجوال
 * Design: Modern Minimalist - "الله يعافيك"
 * الهدف: الوقاية من الإدمان
 */
import { Link, useLocation } from "wouter";
import { Home, Shield, BookOpen, User } from "lucide-react";
import { motion } from "framer-motion";

const navItems = [
  { icon: Home, label: "الرئيسية", path: "/" },
  { icon: Shield, label: "وقايتي", path: "/recovery" },
  { icon: BookOpen, label: "التوعية", path: "/lectures" },
  { icon: User, label: "حسابي", path: "/account" },
];

export default function BottomNav() {
  const [location] = useLocation();

  // Hide bottom nav on admin, login, and mental-health-test pages
  if (location.startsWith("/admin") || location === "/login" || location === "/mental-health-test") {
    return null;
  }

  return (
    <nav className="bottom-nav">
      <div className="flex items-center justify-around px-2 py-2">
        {navItems.map(item => {
          const isActive =
            location === item.path ||
            (item.path !== "/" && location.startsWith(item.path));

          return (
            <Link key={item.path} href={item.path}>
              <motion.div
                whileTap={{ scale: 0.85 }}
                className="flex flex-col items-center gap-1 px-3 py-1.5 rounded-2xl transition-all relative"
              >
                {isActive && (
                  <motion.div
                    layoutId="nav-active"
                    className="absolute inset-0 rounded-2xl bg-primary/15"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
                  />
                )}
                <item.icon
                  className={`w-5 h-5 transition-colors relative z-10 ${
                    isActive ? "text-primary" : "text-muted-foreground"
                  }`}
                  strokeWidth={isActive ? 2.5 : 1.8}
                />
                <span
                  className={`text-[10px] font-bold transition-colors relative z-10 ${
                    isActive ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  {item.label}
                </span>
              </motion.div>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
