/*
 * Design: Modern Minimalist Sidebar
 * الهدف: الوقاية من الإدمان — "الله يعافيك"
 */
import { Link, useLocation } from "wouter";
import {
  Shield,
  Brain,
  Dumbbell,
  BarChart3,
  Users,
  BookOpen,
  Menu,
  X,
  Sparkles,
  Building2,
  GraduationCap,
  Phone,
  Trophy,
  Heart,
  Bell,
  UserPlus,
  MessageCircle,
  LogOut,
  FileText,
  Lightbulb,
  User,
  Settings as SettingsIcon,
} from "lucide-react";
import { useState } from "react";
import { useLocation as useNavLocation } from "wouter";
import { cn } from "@/lib/utils";
import ThemeToggle from "@/components/ThemeToggle";

const CONTACT_PHONE = "0546192019";

const navGroups = [
  {
    label: "الوقاية والوعي",
    items: [
      { icon: Shield, label: "خطتي الوقائية", path: "/recovery" },
      { icon: Brain, label: "تقييم مستوى الخطر", path: "/assessment" },
      { icon: Dumbbell, label: "تمارين الوقاية", path: "/exercises" },
      { icon: BarChart3, label: "إحصائيات وطنية", path: "/statistics" },
      { icon: Trophy, label: "إنجازاتي", path: "/achievements" },
    ],
  },
  {
    label: "التوعية والمعرفة",
    items: [
      { icon: GraduationCap, label: "محاضرات توعوية", path: "/lectures" },
      { icon: BookOpen, label: "الموارد والمعلومات", path: "/resources" },
      { icon: Lightbulb, label: "قصص الوعي", path: "/success-stories" },
      { icon: FileText, label: "التتبع اليومي", path: "/tracker" },
    ],
  },
  {
    label: "الشراكات المؤسسية",
    items: [
      { icon: Building2, label: "منظومة الشراكات", path: "/partners" },
      { icon: UserPlus, label: "انضم كشريك", path: "/join-partner" },
      { icon: Users, label: "مجتمع الوقاية", path: "/community" },
    ],
  },
  {
    label: "التواصل",
    items: [{ icon: Bell, label: "التذكيرات اليومية", path: "/notifications" }],
  },
  {
    label: "الحساب",
    items: [
      { icon: User, label: "حسابي", path: "/account" },
      { icon: SettingsIcon, label: "الإعدادات", path: "/settings" },
    ],
  },
];

export default function Sidebar() {
  const [location] = useLocation();
  const [, navigate] = useNavLocation();
  const [collapsed, setCollapsed] = useState(
    () => typeof window !== "undefined" && window.innerWidth < 1024
  );

  const handleLogout = async () => {
    const { logoutUser } = await import("@/lib/firebase");
    await logoutUser();
    navigate("/login");
  };

  return (
    <>
      {/* Mobile overlay */}
      {!collapsed && (
        <div
          className="fixed inset-0 bg-background/80 z-20 lg:hidden"
          onClick={() => setCollapsed(true)}
        />
      )}

      <aside
        className={cn(
          "fixed right-0 top-0 h-full z-30 flex flex-col transition-all duration-300",
          "bg-sidebar border-l border-sidebar-border",
          collapsed ? "w-0 overflow-hidden lg:w-16" : "w-64"
        )}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 p-5 border-b border-sidebar-border">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-[oklch(0.60_0.17_200)] flex items-center justify-center flex-shrink-0">
            <Shield className="w-5 h-5 text-primary-foreground" />
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <h1 className="text-foreground font-black text-sm leading-tight">
                الله يعافيك
              </h1>
              <p className="text-primary text-xs opacity-80">
                برنامج الوقاية من الإدمان
              </p>
            </div>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="text-muted-foreground hover:text-foreground transition-colors lg:hidden flex-shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 overflow-y-auto space-y-4">
          {navGroups.map((group, gi) => (
            <div key={gi}>
              {!collapsed && (
                <div className="px-3 mb-2">
                  <span className="text-muted-foreground/50 text-xs font-bold uppercase tracking-widest">
                    {group.label}
                  </span>
                </div>
              )}
              <div className="space-y-0.5">
                {group.items.map(item => {
                  const isActive = location === item.path;
                  return (
                    <Link key={item.path} href={item.path}>
                      <div
                        className={cn(
                          "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group",
                          isActive
                            ? "bg-primary/10 border border-primary/20 text-foreground"
                            : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                        )}
                      >
                        <item.icon
                          className={cn(
                            "flex-shrink-0 transition-all",
                            isActive
                              ? "text-primary"
                              : "group-hover:text-foreground"
                          )}
                          size={18}
                        />
                        {!collapsed && (
                          <span className="text-sm font-medium">
                            {item.label}
                          </span>
                        )}
                        {isActive && !collapsed && (
                          <div className="mr-auto w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                        )}
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Contact Phone */}
        {!collapsed && (
          <div className="px-3 pb-2">
            <a
              href={`tel:${CONTACT_PHONE}`}
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-primary/5 border border-primary/20 hover:bg-primary/10 transition-all group"
            >
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary to-[oklch(0.60_0.17_200)] flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                <Phone className="w-3.5 h-3.5 text-primary-foreground" />
              </div>
              <div>
                <div className="text-primary font-black text-xs font-numbers">
                  {CONTACT_PHONE}
                </div>
                <div className="text-muted-foreground text-xs">
                  خط الاستشارة الوقائية
                </div>
              </div>
            </a>
          </div>
        )}

        {/* Theme Toggle + User Profile + Logout */}
        <div className="p-3 border-t border-sidebar-border space-y-2">
          {/* Theme toggle */}
          {!collapsed && (
            <div className="flex items-center justify-between px-3 py-2">
              <span className="text-sm text-muted-foreground">المظهر</span>
              <ThemeToggle />
            </div>
          )}
          <div
            className={cn(
              "flex items-center gap-3 px-3 py-3 rounded-xl",
              "bg-secondary/50 border border-border"
            )}
          >
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-[oklch(0.60_0.17_200)] flex items-center justify-center flex-shrink-0">
              <Shield className="w-4 h-4 text-primary-foreground" />
            </div>
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-foreground text-sm font-bold truncate">
                  مستخدم محمي
                </p>
                <p className="text-primary text-xs">مستوى الوقاية: ممتاز ✦</p>
              </div>
            )}
          </div>
          <button
            onClick={handleLogout}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 w-full",
              "text-red-400/70 hover:text-red-400 hover:bg-red-500/10"
            )}
          >
            <LogOut className="flex-shrink-0" size={18} />
            {!collapsed && (
              <span className="text-sm font-medium">تسجيل الخروج</span>
            )}
          </button>
        </div>
      </aside>

      {/* Mobile toggle button */}
      <button
        onClick={() => setCollapsed(false)}
        className={cn(
          "fixed top-4 left-4 z-[60] p-2 rounded-xl bg-card border border-border text-foreground",
          "lg:hidden",
          !collapsed && "hidden"
        )}
      >
        <Menu className="w-5 h-5" />
      </button>
    </>
  );
}
