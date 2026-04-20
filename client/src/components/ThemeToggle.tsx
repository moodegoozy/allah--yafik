/**
 * ThemeToggle — زر تبديل المظهر (فاتح/داكن)
 * Design: Minimalist animated toggle with Sun/Moon icons
 */
import { Sun, Moon } from "lucide-react";
import { motion } from "framer-motion";
import { useTheme } from "@/contexts/ThemeContext";

export default function ThemeToggle({ className = "" }: { className?: string }) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <motion.button
      onClick={toggleTheme}
      whileTap={{ scale: 0.85 }}
      className={`relative w-14 h-7 rounded-full p-0.5 transition-colors duration-300 ${
        isDark
          ? "bg-secondary border border-border"
          : "bg-primary/15 border border-primary/20"
      } ${className}`}
      aria-label={isDark ? "تبديل إلى الوضع الفاتح" : "تبديل إلى الوضع الداكن"}
    >
      <motion.div
        className={`w-6 h-6 rounded-full flex items-center justify-center ${
          isDark ? "bg-muted-foreground" : "bg-primary"
        }`}
        layout
        animate={{ x: isDark ? 0 : 28 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
      >
        {isDark ? (
          <Moon className="w-3.5 h-3.5 text-background" />
        ) : (
          <Sun className="w-3.5 h-3.5 text-primary-foreground" />
        )}
      </motion.div>
    </motion.button>
  );
}
