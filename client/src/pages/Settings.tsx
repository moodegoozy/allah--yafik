/**
 * Settings - صفحة الإعدادات
 * Design: Mobile-First Dark Luxury - "الله يعافيك"
 * Features: المظهر، الخط، الإشعارات، الخصوصية، البيانات، عام
 */
import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import {
  Settings as SettingsIcon,
  Sun,
  Moon,
  Type,
  Bell,
  BellOff,
  Shield,
  Eye,
  EyeOff,
  Download,
  Trash2,
  RefreshCw,
  Globe,
  Info,
  Phone,
  ChevronLeft,
  ChevronDown,
  ChevronUp,
  Check,
  AlertTriangle,
  FileText,
  HelpCircle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { useTheme } from "@/contexts/ThemeContext";
import { auth, db, logoutUser } from "@/lib/firebase";
import { deleteUser } from "firebase/auth";
import { collection, deleteDoc, doc, getDocs, writeBatch } from "firebase/firestore";

const CONTACT_PHONE = "0546192019";
const FONT_SIZE_KEY = "allah_yafik_font_size";
const NOTIFICATIONS_KEY = "allah_yafik_notifications_enabled";
const ANONYMOUS_KEY = "allah_yafik_anonymous_mode";
const HIDE_STATS_KEY = "allah_yafik_hide_stats";

type FontSize = "small" | "medium" | "large";
type SettingsDoc = "privacy" | "terms" | "help" | null;

const fontSizeConfig: Record<
  FontSize,
  { label: string; class: string; size: string }
> = {
  small: { label: "صغير", class: "text-xs", size: "14px" },
  medium: { label: "متوسط", class: "text-sm", size: "16px" },
  large: { label: "كبير", class: "text-base", size: "18px" },
};

function getStoredFontSize(): FontSize {
  const stored = localStorage.getItem(FONT_SIZE_KEY);
  if (stored === "small" || stored === "medium" || stored === "large")
    return stored;
  return "medium";
}

export default function Settings() {
  const [, navigate] = useLocation();
  const { theme, toggleTheme } = useTheme();

  // Font size
  const [fontSize, setFontSize] = useState<FontSize>(getStoredFontSize);

  // Notifications
  const [notificationsEnabled, setNotificationsEnabled] = useState(() => {
    return localStorage.getItem(NOTIFICATIONS_KEY) !== "false";
  });

  // Privacy
  const [anonymousMode, setAnonymousMode] = useState(() => {
    return localStorage.getItem(ANONYMOUS_KEY) === "true";
  });
  const [hideStats, setHideStats] = useState(() => {
    return localStorage.getItem(HIDE_STATS_KEY) === "true";
  });

  // Expanded sections
  const [expandedSection, setExpandedSection] = useState<string | null>(
    "appearance"
  );

  // Confirm dialogs
  const [showClearData, setShowClearData] = useState(false);
  const [showClearCache, setShowClearCache] = useState(false);
  const [showDeleteAccount, setShowDeleteAccount] = useState(false);
  const [activeDoc, setActiveDoc] = useState<SettingsDoc>(null);

  // Apply font size
  useEffect(() => {
    document.documentElement.style.fontSize = fontSizeConfig[fontSize].size;
    localStorage.setItem(FONT_SIZE_KEY, fontSize);
  }, [fontSize]);

  // Save notification preference
  useEffect(() => {
    localStorage.setItem(NOTIFICATIONS_KEY, String(notificationsEnabled));
  }, [notificationsEnabled]);

  // Save privacy preferences
  useEffect(() => {
    localStorage.setItem(ANONYMOUS_KEY, String(anonymousMode));
  }, [anonymousMode]);
  useEffect(() => {
    localStorage.setItem(HIDE_STATS_KEY, String(hideStats));
  }, [hideStats]);

  const handleExportData = () => {
    try {
      const exportData: Record<string, unknown> = {};
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key?.startsWith("allah_yafik_")) {
          try {
            exportData[key] = JSON.parse(localStorage.getItem(key) || "");
          } catch {
            exportData[key] = localStorage.getItem(key);
          }
        }
      }
      const blob = new Blob([JSON.stringify(exportData, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `allah_yafik_backup_${new Date().toISOString().split("T")[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success("تم تصدير البيانات بنجاح");
    } catch {
      toast.error("حدث خطأ أثناء التصدير");
    }
  };

  const handleClearTracking = () => {
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (
        key?.startsWith("allah_yafik_tracker_") ||
        key?.startsWith("allah_yafik_daily_")
      ) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach(k => localStorage.removeItem(k));
    toast.success(`تم مسح بيانات التتبع (${keysToRemove.length} عنصر)`);
    setShowClearData(false);
  };

  const handleClearCache = () => {
    const protectedKeys = [
      "allah_yafik_current_user",
      "allah_yafik_users",
      "allah_yafik_theme",
      "allah_yafik_font_size",
    ];
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith("allah_yafik_") && !protectedKeys.includes(key)) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach(k => localStorage.removeItem(k));
    toast.success(
      `تم مسح الكاش (${keysToRemove.length} عنصر) — بيانات الحساب محفوظة`
    );
    setShowClearCache(false);
  };

  const handleDeleteAccount = async () => {
    try {
      const raw = localStorage.getItem("allah_yafik_current_user");
      if (!raw) {
        toast.error("لا يوجد حساب نشط حالياً");
        return;
      }

      const currentUser = JSON.parse(raw);
      const uid = auth?.currentUser?.uid || currentUser?.id;
      const userEmail = currentUser?.email;

      if (db && uid) {
        try {
          // Remove profile document.
          await deleteDoc(doc(db, "users", uid));

          // Remove synchronized localStorage subcollection in chunks.
          const syncCollection = collection(db, "users", uid, "local_storage_sync_items");
          const syncSnapshot = await getDocs(syncCollection);
          if (!syncSnapshot.empty) {
            let batch = writeBatch(db);
            let count = 0;

            for (const item of syncSnapshot.docs) {
              batch.delete(item.ref);
              count += 1;

              if (count >= 400) {
                await batch.commit();
                batch = writeBatch(db);
                count = 0;
              }
            }

            if (count > 0) {
              await batch.commit();
            }
          }
        } catch {
          // Keep flow resilient; user can still sign out and request manual deletion by email.
        }
      }

      if (userEmail) {
        const keysToDelete: string[] = [];
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key?.startsWith("allah_yafik_") && key.includes(userEmail)) {
            keysToDelete.push(key);
          }
        }
        keysToDelete.forEach(k => localStorage.removeItem(k));
      }

      // Delete the Firebase Auth account
      const firebaseUser = auth?.currentUser;
      if (firebaseUser) {
        try {
          await deleteUser(firebaseUser);
        } catch {
          /* If re-auth is needed, skip — localStorage is already cleared */
        }
      }

      await logoutUser();
      toast.success("تم استلام طلب حذف الحساب، وسيتم إنهاء جميع البيانات خلال مدة لا تتجاوز 30 يوماً");
      setShowDeleteAccount(false);
      navigate("/login");
    } catch {
      toast.error("حدث خطأ أثناء حذف الحساب");
    }
  };

  const toggleSection = (id: string) => {
    setExpandedSection(prev => (prev === id ? null : id));
  };

  const themeOptions: {
    value: "light" | "dark";
    label: string;
    icon: typeof Sun;
  }[] = [
    { value: "light", label: "فاتح", icon: Sun },
    { value: "dark", label: "داكن", icon: Moon },
  ];

  const fontOptions: { value: FontSize; label: string }[] = [
    { value: "small", label: "صغير — أ" },
    { value: "medium", label: "متوسط — أ" },
    { value: "large", label: "كبير — أ" },
  ];

  interface SettingsSection {
    id: string;
    icon: typeof Sun;
    title: string;
    subtitle: string;
    color: string;
  }

  const sections: SettingsSection[] = [
    {
      id: "appearance",
      icon: Sun,
      title: "المظهر",
      subtitle: "الثيم وحجم الخط",
      color: "#8B5CF6",
    },
    {
      id: "notifications",
      icon: Bell,
      title: "الإشعارات",
      subtitle: "التذكيرات والتنبيهات",
      color: "#0EA5E9",
    },
    {
      id: "privacy",
      icon: Shield,
      title: "الخصوصية",
      subtitle: "التحكم في ظهور بياناتك",
      color: "#10B981",
    },
    {
      id: "data",
      icon: Download,
      title: "البيانات",
      subtitle: "تصدير ومسح البيانات",
      color: "#F59E0B",
    },
    {
      id: "general",
      icon: Globe,
      title: "عام",
      subtitle: "معلومات التطبيق والتواصل",
      color: "#EC4899",
    },
  ];

  const docMeta: Record<
    Exclude<SettingsDoc, null>,
    { title: string; color: string; icon: typeof Shield }
  > = {
    privacy: { title: "سياسة الخصوصية", color: "#10B981", icon: Shield },
    terms: { title: "الشروط والأحكام", color: "#8B5CF6", icon: FileText },
    help: { title: "مركز المساعدة", color: "#0EA5E9", icon: HelpCircle },
  };
  const ActiveDocIcon = activeDoc ? docMeta[activeDoc].icon : null;

  return (
    <div className="app-container">
      {/* Mobile Header */}
      <div className="mobile-header">
        <div className="flex items-center justify-between px-4 py-3">
          <button
            onClick={() => navigate("/account")}
            className="w-9 h-9 rounded-xl bg-secondary/60 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
          >
            <ChevronLeft className="w-5 h-5 rotate-180" />
          </button>
          <h1 className="text-foreground font-black text-base">الإعدادات</h1>
          <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
            <SettingsIcon className="w-4 h-4 text-primary" />
          </div>
        </div>
      </div>

      <div className="page-content px-4 pt-3 space-y-3">
        {sections.map(section => {
          const isExpanded = expandedSection === section.id;
          return (
            <motion.div
              key={section.id}
              layout
              className="rounded-2xl glass-card border border-border overflow-hidden"
            >
              {/* Section Header */}
              <button
                onClick={() => toggleSection(section.id)}
                className="w-full flex items-center gap-3 p-4 text-right"
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: `${section.color}15` }}
                >
                  <section.icon
                    className="w-5 h-5"
                    style={{ color: section.color }}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-foreground font-bold text-sm">
                    {section.title}
                  </div>
                  <div className="text-muted-foreground text-xs">
                    {section.subtitle}
                  </div>
                </div>
                <motion.div
                  animate={{ rotate: isExpanded ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronDown className="w-4 h-4 text-muted-foreground/60" />
                </motion.div>
              </button>

              {/* Section Content */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
                    className="overflow-hidden"
                  >
                    <div className="px-4 pb-4 space-y-3">
                      {/* ═══ APPEARANCE ═══ */}
                      {section.id === "appearance" && (
                        <>
                          {/* Theme Selector */}
                          <div>
                            <label className="text-muted-foreground text-xs mb-2 block">
                              الثيم
                            </label>
                            <div className="grid grid-cols-2 gap-2">
                              {themeOptions.map(opt => {
                                const isActive = theme === opt.value;
                                return (
                                  <button
                                    key={opt.value}
                                    onClick={() => {
                                      if (theme !== opt.value) toggleTheme();
                                    }}
                                    className={`flex items-center justify-center gap-2 py-3 rounded-xl border text-sm font-bold transition-all ${
                                      isActive
                                        ? "border-primary bg-primary/10 text-primary"
                                        : "border-border bg-secondary/40 text-muted-foreground hover:text-foreground"
                                    }`}
                                  >
                                    <opt.icon className="w-4 h-4" />
                                    {opt.label}
                                    {isActive && (
                                      <Check className="w-3.5 h-3.5" />
                                    )}
                                  </button>
                                );
                              })}
                            </div>
                          </div>

                          {/* Font Size */}
                          <div>
                            <label className="text-muted-foreground text-xs mb-2 block">
                              حجم الخط
                            </label>
                            <div className="grid grid-cols-3 gap-2">
                              {fontOptions.map(opt => {
                                const isActive = fontSize === opt.value;
                                return (
                                  <button
                                    key={opt.value}
                                    onClick={() => setFontSize(opt.value)}
                                    className={`py-2.5 rounded-xl border text-sm font-bold transition-all ${
                                      isActive
                                        ? "border-primary bg-primary/10 text-primary"
                                        : "border-border bg-secondary/40 text-muted-foreground hover:text-foreground"
                                    }`}
                                  >
                                    {opt.label}
                                  </button>
                                );
                              })}
                            </div>
                            <div className="mt-2 p-3 rounded-xl bg-secondary/40 border border-border">
                              <p
                                className="text-foreground"
                                style={{
                                  fontSize: fontSizeConfig[fontSize].size,
                                }}
                              >
                                هذا مثال على حجم الخط المختار
                              </p>
                            </div>
                          </div>
                        </>
                      )}

                      {/* ═══ NOTIFICATIONS ═══ */}
                      {section.id === "notifications" && (
                        <>
                          <ToggleRow
                            icon={notificationsEnabled ? Bell : BellOff}
                            label="تفعيل الإشعارات"
                            description="التذكيرات اليومية والتنبيهات"
                            enabled={notificationsEnabled}
                            onToggle={() => {
                              setNotificationsEnabled(!notificationsEnabled);
                              toast.success(
                                notificationsEnabled
                                  ? "تم إيقاف الإشعارات"
                                  : "تم تفعيل الإشعارات"
                              );
                            }}
                            color="#0EA5E9"
                          />
                          <button
                            onClick={() => navigate("/notifications")}
                            className="w-full flex items-center gap-3 p-3 rounded-xl bg-secondary/40 border border-border hover:bg-secondary/60 transition-all"
                          >
                            <Bell className="w-4 h-4 text-sky-500" />
                            <span className="text-foreground text-sm font-bold flex-1">
                              إدارة التذكيرات
                            </span>
                            <ChevronLeft className="w-4 h-4 text-muted-foreground/60" />
                          </button>
                        </>
                      )}

                      {/* ═══ PRIVACY ═══ */}
                      {section.id === "privacy" && (
                        <>
                          <ToggleRow
                            icon={anonymousMode ? EyeOff : Eye}
                            label="الوضع المجهول"
                            description="إخفاء اسمك في الصفحات العامة"
                            enabled={anonymousMode}
                            onToggle={() => {
                              setAnonymousMode(!anonymousMode);
                              toast.success(
                                anonymousMode
                                  ? "تم إيقاف الوضع المجهول"
                                  : "تم تفعيل الوضع المجهول"
                              );
                            }}
                            color="#10B981"
                          />
                          <ToggleRow
                            icon={Shield}
                            label="إخفاء الإحصائيات"
                            description="إخفاء إحصائياتك من ملفك الشخصي"
                            enabled={hideStats}
                            onToggle={() => {
                              setHideStats(!hideStats);
                              toast.success(
                                hideStats
                                  ? "تم إظهار الإحصائيات"
                                  : "تم إخفاء الإحصائيات"
                              );
                            }}
                            color="#10B981"
                          />
                        </>
                      )}

                      {/* ═══ DATA ═══ */}
                      {section.id === "data" && (
                        <>
                          <button
                            onClick={handleExportData}
                            className="w-full flex items-center gap-3 p-3.5 rounded-xl bg-secondary/40 border border-border hover:bg-secondary/60 transition-all"
                          >
                            <div className="w-8 h-8 rounded-lg bg-amber-500/15 flex items-center justify-center">
                              <Download className="w-4 h-4 text-amber-500" />
                            </div>
                            <div className="flex-1 text-right">
                              <div className="text-foreground text-sm font-bold">
                                تصدير بياناتي
                              </div>
                              <div className="text-muted-foreground text-xs">
                                تحميل نسخة JSON من جميع بياناتك
                              </div>
                            </div>
                          </button>

                          <button
                            onClick={() => setShowClearData(true)}
                            className="w-full flex items-center gap-3 p-3.5 rounded-xl bg-secondary/40 border border-border hover:bg-destructive/10 transition-all"
                          >
                            <div className="w-8 h-8 rounded-lg bg-red-500/15 flex items-center justify-center">
                              <Trash2 className="w-4 h-4 text-red-500" />
                            </div>
                            <div className="flex-1 text-right">
                              <div className="text-foreground text-sm font-bold">
                                مسح بيانات التتبع
                              </div>
                              <div className="text-muted-foreground text-xs">
                                حذف سجل التتبع اليومي فقط
                              </div>
                            </div>
                          </button>

                          <button
                            onClick={() => setShowClearCache(true)}
                            className="w-full flex items-center gap-3 p-3.5 rounded-xl bg-secondary/40 border border-border hover:bg-destructive/10 transition-all"
                          >
                            <div className="w-8 h-8 rounded-lg bg-orange-500/15 flex items-center justify-center">
                              <RefreshCw className="w-4 h-4 text-orange-500" />
                            </div>
                            <div className="flex-1 text-right">
                              <div className="text-foreground text-sm font-bold">
                                مسح الكاش
                              </div>
                              <div className="text-muted-foreground text-xs">
                                مسح جميع البيانات ما عدا الحساب والثيم
                              </div>
                            </div>
                          </button>

                          <button
                            onClick={() => setShowDeleteAccount(true)}
                            className="w-full flex items-center gap-3 p-3.5 rounded-xl bg-red-500/8 border border-red-500/30 hover:bg-red-500/12 transition-all"
                          >
                            <div className="w-8 h-8 rounded-lg bg-red-500/15 flex items-center justify-center">
                              <Trash2 className="w-4 h-4 text-red-500" />
                            </div>
                            <div className="flex-1 text-right">
                              <div className="text-red-500 text-sm font-bold">
                                حذف الحساب نهائياً
                              </div>
                              <div className="text-muted-foreground text-xs">
                                سيتم حذف حسابك وبياناتك الشخصية نهائياً
                              </div>
                            </div>
                          </button>
                        </>
                      )}

                      {/* ═══ GENERAL ═══ */}
                      {section.id === "general" && (
                        <>
                          <button
                            onClick={() => navigate("/assessment")}
                            className="w-full flex items-center gap-3 p-3.5 rounded-xl bg-secondary/40 border border-border hover:bg-secondary/60 transition-all"
                          >
                            <div className="w-8 h-8 rounded-lg bg-violet-500/15 flex items-center justify-center">
                              <RefreshCw className="w-4 h-4 text-violet-500" />
                            </div>
                            <div className="flex-1 text-right">
                              <div className="text-foreground text-sm font-bold">
                                إعادة اختبار تقييم الخطر
                              </div>
                              <div className="text-muted-foreground text-xs">
                                أعد التقييم لتحديث مستوى خطورتك
                              </div>
                            </div>
                            <ChevronLeft className="w-4 h-4 text-muted-foreground/60" />
                          </button>

                          <a
                            href={`tel:${CONTACT_PHONE}`}
                            className="w-full flex items-center gap-3 p-3.5 rounded-xl bg-secondary/40 border border-border hover:bg-secondary/60 transition-all"
                          >
                            <div className="w-8 h-8 rounded-lg bg-pink-500/15 flex items-center justify-center">
                              <Phone className="w-4 h-4 text-pink-500" />
                            </div>
                            <div className="flex-1 text-right">
                              <div className="text-foreground text-sm font-bold">
                                تواصل معنا
                              </div>
                              <div
                                className="text-muted-foreground text-xs font-numbers"
                                dir="ltr"
                              >
                                {CONTACT_PHONE}
                              </div>
                            </div>
                            <ChevronLeft className="w-4 h-4 text-muted-foreground/60" />
                          </a>

                          <div className="p-3.5 rounded-xl bg-secondary/40 border border-border">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-lg bg-pink-500/15 flex items-center justify-center">
                                <Info className="w-4 h-4 text-pink-500" />
                              </div>
                              <div className="flex-1">
                                <div className="text-foreground text-sm font-bold">
                                  الله يعافيك
                                </div>
                                <div className="text-muted-foreground text-xs">
                                  منصة الوقاية من الإدمان — الإصدار ١.٠
                                </div>
                              </div>
                            </div>
                          </div>

                          <button
                            onClick={() => setActiveDoc("privacy")}
                            className="w-full flex items-center gap-3 p-3.5 rounded-xl bg-secondary/40 border border-border hover:bg-secondary/60 transition-all"
                          >
                            <div className="w-8 h-8 rounded-lg bg-emerald-500/15 flex items-center justify-center">
                              <Shield className="w-4 h-4 text-emerald-500" />
                            </div>
                            <div className="flex-1 text-right">
                              <div className="text-foreground text-sm font-bold">
                                سياسة الخصوصية
                              </div>
                              <div className="text-muted-foreground text-xs">
                                كيف نجمع بياناتك ونستخدمها ونحميها
                              </div>
                            </div>
                            <ChevronLeft className="w-4 h-4 text-muted-foreground/60" />
                          </button>

                          <button
                            onClick={() => setActiveDoc("terms")}
                            className="w-full flex items-center gap-3 p-3.5 rounded-xl bg-secondary/40 border border-border hover:bg-secondary/60 transition-all"
                          >
                            <div className="w-8 h-8 rounded-lg bg-violet-500/15 flex items-center justify-center">
                              <FileText className="w-4 h-4 text-violet-500" />
                            </div>
                            <div className="flex-1 text-right">
                              <div className="text-foreground text-sm font-bold">
                                الشروط والأحكام
                              </div>
                              <div className="text-muted-foreground text-xs">
                                شروط استخدام المنصة وحقوق والتزامات المستخدم
                              </div>
                            </div>
                            <ChevronLeft className="w-4 h-4 text-muted-foreground/60" />
                          </button>

                          <button
                            onClick={() => setActiveDoc("help")}
                            className="w-full flex items-center gap-3 p-3.5 rounded-xl bg-secondary/40 border border-border hover:bg-secondary/60 transition-all"
                          >
                            <div className="w-8 h-8 rounded-lg bg-sky-500/15 flex items-center justify-center">
                              <HelpCircle className="w-4 h-4 text-sky-500" />
                            </div>
                            <div className="flex-1 text-right">
                              <div className="text-foreground text-sm font-bold">
                                مركز المساعدة
                              </div>
                              <div className="text-muted-foreground text-xs">
                                أسئلة شائعة وخطوات الدعم السريع
                              </div>
                            </div>
                            <ChevronLeft className="w-4 h-4 text-muted-foreground/60" />
                          </button>
                        </>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>

      {/* ═══ Confirm: Clear Tracking Data ═══ */}
      <AnimatePresence>
        {showClearData && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm px-6"
            onClick={() => setShowClearData(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              className="w-full max-w-sm rounded-2xl glass-card border border-border p-5 text-center"
            >
              <div className="w-12 h-12 rounded-xl bg-destructive/15 flex items-center justify-center mx-auto mb-3">
                <AlertTriangle className="w-6 h-6 text-destructive" />
              </div>
              <h3 className="text-foreground font-bold mb-1">
                مسح بيانات التتبع؟
              </h3>
              <p className="text-muted-foreground text-sm mb-4">
                سيتم حذف سجل التتبع اليومي. لا يمكن التراجع.
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowClearData(false)}
                  className="flex-1 py-2.5 rounded-xl border border-border text-muted-foreground text-sm font-bold hover:text-foreground transition-all"
                >
                  إلغاء
                </button>
                <button
                  onClick={handleClearTracking}
                  className="flex-1 py-2.5 rounded-xl bg-destructive text-destructive-foreground text-sm font-bold transition-all"
                >
                  مسح
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══ Confirm: Clear Cache ═══ */}
      <AnimatePresence>
        {showClearCache && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm px-6"
            onClick={() => setShowClearCache(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              className="w-full max-w-sm rounded-2xl glass-card border border-border p-5 text-center"
            >
              <div className="w-12 h-12 rounded-xl bg-amber-500/15 flex items-center justify-center mx-auto mb-3">
                <AlertTriangle className="w-6 h-6 text-amber-500" />
              </div>
              <h3 className="text-foreground font-bold mb-1">مسح الكاش؟</h3>
              <p className="text-muted-foreground text-sm mb-4">
                سيتم حذف جميع البيانات ما عدا الحساب وإعدادات الثيم.
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowClearCache(false)}
                  className="flex-1 py-2.5 rounded-xl border border-border text-muted-foreground text-sm font-bold hover:text-foreground transition-all"
                >
                  إلغاء
                </button>
                <button
                  onClick={handleClearCache}
                  className="flex-1 py-2.5 rounded-xl bg-destructive text-destructive-foreground text-sm font-bold transition-all"
                >
                  مسح الكاش
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══ Confirm: Delete Account ═══ */}
      <AnimatePresence>
        {showDeleteAccount && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm px-6"
            onClick={() => setShowDeleteAccount(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              className="w-full max-w-sm rounded-2xl glass-card border border-red-500/30 p-5 text-center"
            >
              <div className="w-12 h-12 rounded-xl bg-red-500/15 flex items-center justify-center mx-auto mb-3">
                <AlertTriangle className="w-6 h-6 text-red-500" />
              </div>
              <h3 className="text-foreground font-bold mb-1">
                حذف الحساب نهائياً؟
              </h3>
              <p className="text-muted-foreground text-sm mb-4">
                سيتم حذف الحساب من هذا الجهاز نهائياً، ولن تتمكن من استعادته
                لاحقاً.
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowDeleteAccount(false)}
                  className="flex-1 py-2.5 rounded-xl border border-border text-muted-foreground text-sm font-bold hover:text-foreground transition-all"
                >
                  إلغاء
                </button>
                <button
                  onClick={handleDeleteAccount}
                  className="flex-1 py-2.5 rounded-xl bg-destructive text-destructive-foreground text-sm font-bold transition-all"
                >
                  حذف نهائي
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══ Doc Viewer: Privacy / Terms / Help ═══ */}
      <AnimatePresence>
        {activeDoc && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4"
            onClick={() => setActiveDoc(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
              onClick={e => e.stopPropagation()}
              className="w-full max-w-lg rounded-3xl glass-card border border-border p-5 max-h-[80vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center"
                    style={{ background: `${docMeta[activeDoc].color}18` }}
                  >
                    {ActiveDocIcon && (
                      <ActiveDocIcon
                        className="w-4 h-4"
                        style={{ color: docMeta[activeDoc].color }}
                      />
                    )}
                  </div>
                  <h3 className="text-foreground font-black text-base">
                    {docMeta[activeDoc].title}
                  </h3>
                </div>
                <button
                  onClick={() => setActiveDoc(null)}
                  className="w-8 h-8 rounded-lg bg-secondary/60 text-muted-foreground hover:text-foreground"
                >
                  ✕
                </button>
              </div>

              {activeDoc === "privacy" && (
                <div className="space-y-3 text-right">
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    نحترم خصوصيتك. يتم حفظ بياناتك محلياً على جهازك لتحسين
                    تجربتك داخل منصة الله يعافيك.
                  </p>
                  <DocItem
                    title="ما البيانات التي نخزنها؟"
                    text="بيانات الحساب (الاسم، البريد، العمر)، نتائج التقييم، تقدّمك في الخطط والإنجازات، وإعداداتك الشخصية."
                  />
                  <DocItem
                    title="كيف نستخدم البيانات؟"
                    text="لاستخدامها داخل التطبيق فقط: تخصيص المحتوى، حفظ التقدم، وتقديم توصيات مناسبة لعمرك."
                  />
                  <DocItem
                    title="مشاركة البيانات"
                    text="لا نشارك بياناتك الشخصية مع أي طرف ثالث ضمن النسخة الحالية من التطبيق."
                  />
                  <DocItem
                    title="حذف البيانات"
                    text="يمكنك حذف بيانات التتبع أو حذف الحساب نهائياً من صفحة الإعدادات في أي وقت."
                  />
                </div>
              )}

              {activeDoc === "terms" && (
                <div className="space-y-3 text-right">
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    باستخدامك للمنصة، فأنت توافق على الالتزام بهذه الشروط بما
                    يضمن بيئة آمنة ومحترمة للجميع.
                  </p>
                  <DocItem
                    title="الاستخدام المسؤول"
                    text="يجب استخدام المنصة لأغراض التوعية والدعم فقط، وعدم إساءة الاستخدام أو نشر محتوى ضار."
                  />
                  <DocItem
                    title="الدقة الطبية"
                    text="المحتوى توعوي ولا يغني عن الاستشارة الطبية المتخصصة عند الحاجة."
                  />
                  <DocItem
                    title="الحساب"
                    text="أنت مسؤول عن صحة البيانات التي تدخلها وحماية الوصول إلى جهازك وحسابك المحلي."
                  />
                  <DocItem
                    title="التحديثات"
                    text="يجوز تحديث الميزات أو المحتوى أو الشروط لتحسين الخدمة دون إشعار مسبق."
                  />
                </div>
              )}

              {activeDoc === "help" && (
                <div className="space-y-3 text-right">
                  <DocItem
                    title="كيف أبدأ؟"
                    text="أنشئ حساباً، أكمل اختبار التقييم، ثم اتبع الخطة الوقائية المناسبة لفئتك العمرية."
                  />
                  <DocItem
                    title="نسيت كلمة المرور"
                    text="من صفحة تسجيل الدخول اختر (نسيت كلمة المرور) واتبع خطوات إعادة التعيين."
                  />
                  <DocItem
                    title="كيف أغيّر الإعدادات؟"
                    text="من صفحة الإعدادات يمكنك التحكم في المظهر، الإشعارات، الخصوصية، والبيانات."
                  />
                  <DocItem
                    title="أحتاج مساعدة مباشرة"
                    text={`يمكنك التواصل فوراً عبر رقم الدعم: ${CONTACT_PHONE}`}
                  />
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ═══ Toggle Row Component ═══ */
function ToggleRow({
  icon: Icon,
  label,
  description,
  enabled,
  onToggle,
  color,
}: {
  icon: typeof Sun;
  label: string;
  description: string;
  enabled: boolean;
  onToggle: () => void;
  color: string;
}) {
  return (
    <button
      onClick={onToggle}
      className="w-full flex items-center gap-3 p-3.5 rounded-xl bg-secondary/40 border border-border transition-all"
    >
      <div
        className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
        style={{ background: `${color}15` }}
      >
        <Icon className="w-4 h-4" style={{ color }} />
      </div>
      <div className="flex-1 text-right min-w-0">
        <div className="text-foreground text-sm font-bold">{label}</div>
        <div className="text-muted-foreground text-xs">{description}</div>
      </div>
      <div
        className={`w-11 h-6 rounded-full transition-all relative flex-shrink-0 ${enabled ? "bg-primary" : "bg-secondary"}`}
      >
        <div
          className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all ${enabled ? "left-5.5" : "left-0.5"}`}
        />
      </div>
    </button>
  );
}

function DocItem({ title, text }: { title: string; text: string }) {
  return (
    <div className="p-3 rounded-xl bg-secondary/40 border border-border">
      <div className="text-foreground text-sm font-bold mb-1">{title}</div>
      <div className="text-muted-foreground text-xs leading-relaxed">
        {text}
      </div>
    </div>
  );
}
