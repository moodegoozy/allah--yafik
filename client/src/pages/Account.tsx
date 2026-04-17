/**
 * Account - صفحة حسابي
 * Design: Mobile-First Dark Luxury - "الله يعافيك"
 * Features: عرض وتعديل البيانات، نتائج الاختبار، الإنجازات، تسجيل خروج
 */
import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import {
  User,
  Phone,
  Mail,
  Calendar,
  Shield,
  Award,
  BookOpen,
  Edit3,
  Save,
  LogOut,
  ChevronLeft,
  Brain,
  Clock,
  Star,
  Heart,
  CheckCircle2,
  X,
  Eye,
  EyeOff,
  Lock,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { hashPassword, isValidSaudiPhone, isValidEmail } from "@/lib/utils";

const ageGroupConfig: Record<
  string,
  { label: string; color: string; emoji: string }
> = {
  young: { label: "يافع", color: "#00D4AA", emoji: "🌱" },
  teenage: { label: "مراهق", color: "#F59E0B", emoji: "⚡" },
  adult: { label: "بالغ", color: "#8B5CF6", emoji: "🎯" },
};

const RECOVERY_KEY_PREFIX = "allah_yafik_recovery_goals";

function getUserRecoveryKey(): string {
  try {
    const raw = localStorage.getItem("allah_yafik_current_user");
    if (raw) {
      const user = JSON.parse(raw);
      if (user.email) return `${RECOVERY_KEY_PREFIX}_${user.email}`;
    }
  } catch {}
  return RECOVERY_KEY_PREFIX;
}

function getRecoveryAchievementCount(): number {
  try {
    const raw = localStorage.getItem(getUserRecoveryKey());
    if (!raw) return 0;
    const data: Record<number, boolean[]> = JSON.parse(raw);
    // 4 phases, each with 5 goals — a phase counts as an achievement when all 5 goals are done
    let count = 0;
    for (let phaseId = 1; phaseId <= 4; phaseId++) {
      const goals = data[phaseId] || [];
      if (goals.length >= 5 && goals.every(Boolean)) count++;
    }
    return count;
  } catch {
    return 0;
  }
}

export default function Account() {
  const [, navigate] = useLocation();
  const [user, setUser] = useState<any>(null);
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
    addictionType: "",
  });
  const [changingPassword, setChangingPassword] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    current: "",
    newPass: "",
    confirm: "",
  });
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const addictionTypes = [
    "مخدرات",
    "تدخين",
    "كحول",
    "إدمان رقمي / ألعاب",
    "إدمان طعام",
    "إدمان عمل",
    "أخرى",
  ];

  useEffect(() => {
    const stored = localStorage.getItem("allah_yafik_current_user");
    if (stored) {
      const parsed = JSON.parse(stored);
      setUser(parsed);
      setEditForm({
        name: parsed.name || "",
        email: parsed.email || "",
        addictionType: parsed.addictionType || "",
      });
    } else {
      navigate("/login");
    }
  }, [navigate]);

  if (!user) return null;

  const ageCfg = ageGroupConfig[user.ageGroup] || ageGroupConfig.adult;

  const handleSaveProfile = () => {
    if (!editForm.name.trim()) {
      toast.error("الاسم مطلوب");
      return;
    }
    if (editForm.email && !isValidEmail(editForm.email)) {
      toast.error("البريد الإلكتروني غير صحيح");
      return;
    }

    // Update in users array
    const users = JSON.parse(localStorage.getItem("allah_yafik_users") || "[]");
    const idx = users.findIndex((u: any) => u.id === user.id);
    if (idx !== -1) {
      users[idx].name = editForm.name.trim();
      users[idx].email = editForm.email.trim();
      users[idx].addictionType = editForm.addictionType;
      localStorage.setItem("allah_yafik_users", JSON.stringify(users));
    }

    // Update current user
    const updated = {
      ...user,
      name: editForm.name.trim(),
      email: editForm.email.trim(),
      addictionType: editForm.addictionType,
    };
    localStorage.setItem("allah_yafik_current_user", JSON.stringify(updated));
    setUser(updated);
    setEditing(false);
    toast.success("تم تحديث البيانات بنجاح");
  };

  const handleChangePassword = async () => {
    if (
      !passwordForm.current ||
      !passwordForm.newPass ||
      !passwordForm.confirm
    ) {
      toast.error("يرجى تعبئة جميع الحقول");
      return;
    }
    if (passwordForm.newPass.length < 8) {
      toast.error("كلمة المرور الجديدة يجب أن تكون ٨ أحرف على الأقل");
      return;
    }
    if (passwordForm.newPass !== passwordForm.confirm) {
      toast.error("كلمة المرور الجديدة غير متطابقة");
      return;
    }
    setLoading(true);
    try {
      const currentHash = await hashPassword(passwordForm.current);
      const users = JSON.parse(
        localStorage.getItem("allah_yafik_users") || "[]"
      );
      const idx = users.findIndex((u: any) => u.id === user.id);
      if (idx === -1 || users[idx].passwordHash !== currentHash) {
        toast.error("كلمة المرور الحالية غير صحيحة");
        return;
      }
      const newHash = await hashPassword(passwordForm.newPass);
      users[idx].passwordHash = newHash;
      localStorage.setItem("allah_yafik_users", JSON.stringify(users));
      setChangingPassword(false);
      setPasswordForm({ current: "", newPass: "", confirm: "" });
      toast.success("تم تغيير كلمة المرور بنجاح");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("allah_yafik_current_user");
    toast.success("تم تسجيل الخروج");
    navigate("/login");
  };

  const handleRetakeTest = () => {
    // Reset test so AuthGuard redirects to test
    const users = JSON.parse(localStorage.getItem("allah_yafik_users") || "[]");
    const idx = users.findIndex((u: any) => u.id === user.id);
    if (idx !== -1) {
      users[idx].testCompleted = false;
      delete users[idx].testResult;
      localStorage.setItem("allah_yafik_users", JSON.stringify(users));
    }
    const updated = { ...user, testCompleted: false };
    delete updated.testResult;
    localStorage.setItem("allah_yafik_current_user", JSON.stringify(updated));
    navigate("/mental-health-test");
  };

  const daysSinceJoin = user.joinDate
    ? Math.floor(
        (Date.now() - new Date(user.joinDate).getTime()) / (1000 * 60 * 60 * 24)
      )
    : 0;

  return (
    <div className="app-container bg-gradient-navy">
      {/* Ambient */}
      <div
        className="orb w-72 h-72 opacity-8 -top-20 -right-20"
        style={{ background: ageCfg.color }}
      />

      {/* Header */}
      <div className="mobile-header px-5 py-4">
        <div className="flex items-center justify-between">
          <div>
            <div
              className="text-xs font-bold uppercase tracking-wider mb-1"
              style={{ color: ageCfg.color }}
            >
              حسابي
            </div>
            <h1 className="text-white font-black text-xl">الملف الشخصي</h1>
          </div>
          <button
            onClick={() => navigate("/dashboard")}
            className="p-2 rounded-xl glass-card border border-white/8"
          >
            <ChevronLeft className="w-4 h-4 text-white/50" />
          </button>
        </div>
      </div>

      <div className="page-content overflow-y-auto">
        <div className="px-4 pt-3 pb-6 space-y-4">
          {/* Profile Card */}
          <div className="rounded-2xl glass-card border border-white/8 p-5">
            <div className="flex items-center gap-4 mb-4">
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl"
                style={{ background: `${ageCfg.color}20` }}
              >
                {ageCfg.emoji}
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-white font-black text-lg truncate">
                  {user.name}
                </h2>
                <div className="flex items-center gap-2 mt-1">
                  <span
                    className="px-2 py-0.5 rounded-full text-xs font-bold"
                    style={{
                      background: `${ageCfg.color}20`,
                      color: ageCfg.color,
                    }}
                  >
                    {ageCfg.label} — {user.age} سنة
                  </span>
                </div>
              </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-3 gap-2">
              <div className="text-center p-2.5 rounded-xl bg-white/5 border border-white/5">
                <Clock
                  className="w-4 h-4 mx-auto mb-1"
                  style={{ color: ageCfg.color }}
                />
                <div className="text-white font-black text-sm">
                  {daysSinceJoin}
                </div>
                <div className="text-white/40 text-xs">يوم معنا</div>
              </div>
              <div className="text-center p-2.5 rounded-xl bg-white/5 border border-white/5">
                <Award className="w-4 h-4 mx-auto mb-1 text-[#F59E0B]" />
                <div className="text-white font-black text-sm">
                  {getRecoveryAchievementCount()}
                </div>
                <div className="text-white/40 text-xs">إنجاز</div>
              </div>
              <div className="text-center p-2.5 rounded-xl bg-white/5 border border-white/5">
                <BookOpen className="w-4 h-4 mx-auto mb-1 text-[#8B5CF6]" />
                <div className="text-white font-black text-sm">
                  {user.completedLectures?.length || 0}
                </div>
                <div className="text-white/40 text-xs">محاضرة</div>
              </div>
            </div>
          </div>

          {/* Test Result */}
          {user.testResult && (
            <div className="rounded-2xl glass-card border border-white/8 p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-white font-bold text-sm flex items-center gap-2">
                  <Brain className="w-4 h-4" style={{ color: ageCfg.color }} />
                  نتيجة الاختبار النفسي
                </h3>
                <button
                  onClick={handleRetakeTest}
                  className="text-xs px-3 py-1.5 rounded-lg border border-white/10 text-white/50 hover:text-white hover:border-white/20 transition-all"
                >
                  إعادة الاختبار
                </button>
              </div>
              <div className="space-y-2">
                {Object.entries(user.testResult.dimensions || {}).map(
                  ([key, val]: [string, any]) => {
                    const labels: Record<string, string> = {
                      mentalHealth: "الصحة النفسية",
                      awareness: "مستوى الوعي",
                      stillness: "السكينة الداخلية",
                    };
                    const pct = typeof val === "number" ? val : 50;
                    return (
                      <div key={key}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-white/60 text-xs">
                            {labels[key] || key}
                          </span>
                          <span className="text-white font-bold text-xs">
                            {Math.round(pct)}%
                          </span>
                        </div>
                        <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${pct}%` }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="h-full rounded-full"
                            style={{ background: ageCfg.color }}
                          />
                        </div>
                      </div>
                    );
                  }
                )}
              </div>
            </div>
          )}

          {/* Personal Info */}
          <div className="rounded-2xl glass-card border border-white/8 p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-white font-bold text-sm flex items-center gap-2">
                <User className="w-4 h-4" style={{ color: ageCfg.color }} />
                البيانات الشخصية
              </h3>
              {!editing ? (
                <button
                  onClick={() => setEditing(true)}
                  className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg border border-white/10 text-white/50 hover:text-white hover:border-white/20 transition-all"
                >
                  <Edit3 className="w-3 h-3" />
                  تعديل
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setEditing(false);
                      setEditForm({
                        name: user.name,
                        email: user.email || "",
                        addictionType: user.addictionType || "",
                      });
                    }}
                    className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg border border-white/10 text-white/50 hover:text-white transition-all"
                  >
                    <X className="w-3 h-3" />
                    إلغاء
                  </button>
                  <button
                    onClick={handleSaveProfile}
                    className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg text-white font-bold transition-all"
                    style={{ background: ageCfg.color }}
                  >
                    <Save className="w-3 h-3" />
                    حفظ
                  </button>
                </div>
              )}
            </div>

            <div className="space-y-3">
              {/* Name */}
              <div className="flex items-center gap-3 p-3 rounded-xl bg-white/3 border border-white/5">
                <User className="w-4 h-4 text-white/30 flex-shrink-0" />
                {editing ? (
                  <input
                    value={editForm.name}
                    onChange={e =>
                      setEditForm(f => ({ ...f, name: e.target.value }))
                    }
                    className="flex-1 bg-transparent text-white text-sm outline-none placeholder:text-white/20"
                    placeholder="الاسم"
                    dir="rtl"
                  />
                ) : (
                  <div className="flex-1 min-w-0">
                    <div className="text-white/40 text-xs mb-0.5">الاسم</div>
                    <div className="text-white text-sm font-bold truncate">
                      {user.name}
                    </div>
                  </div>
                )}
              </div>

              {/* Phone (read-only) */}
              <div className="flex items-center gap-3 p-3 rounded-xl bg-white/3 border border-white/5">
                <Phone className="w-4 h-4 text-white/30 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="text-white/40 text-xs mb-0.5">رقم الجوال</div>
                  <div
                    className="text-white text-sm font-bold font-numbers"
                    dir="ltr"
                  >
                    {user.phone}
                  </div>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-center gap-3 p-3 rounded-xl bg-white/3 border border-white/5">
                <Mail className="w-4 h-4 text-white/30 flex-shrink-0" />
                {editing ? (
                  <input
                    value={editForm.email}
                    onChange={e =>
                      setEditForm(f => ({ ...f, email: e.target.value }))
                    }
                    className="flex-1 bg-transparent text-white text-sm outline-none placeholder:text-white/20"
                    placeholder="البريد الإلكتروني (اختياري)"
                    dir="ltr"
                  />
                ) : (
                  <div className="flex-1 min-w-0">
                    <div className="text-white/40 text-xs mb-0.5">
                      البريد الإلكتروني
                    </div>
                    <div
                      className="text-white text-sm font-bold truncate"
                      dir="ltr"
                    >
                      {user.email || "غير محدد"}
                    </div>
                  </div>
                )}
              </div>

              {/* Age */}
              <div className="flex items-center gap-3 p-3 rounded-xl bg-white/3 border border-white/5">
                <Calendar className="w-4 h-4 text-white/30 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="text-white/40 text-xs mb-0.5">العمر</div>
                  <div className="text-white text-sm font-bold">
                    {user.age} سنة —{" "}
                    <span style={{ color: ageCfg.color }}>{ageCfg.label}</span>
                  </div>
                </div>
              </div>

              {/* Addiction Type */}
              <div className="flex items-center gap-3 p-3 rounded-xl bg-white/3 border border-white/5">
                <Shield className="w-4 h-4 text-white/30 flex-shrink-0" />
                {editing ? (
                  <div className="flex-1">
                    <div className="text-white/40 text-xs mb-1.5">
                      نوع ما تريد الوقاية منه
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {addictionTypes.map(t => (
                        <button
                          key={t}
                          onClick={() =>
                            setEditForm(f => ({ ...f, addictionType: t }))
                          }
                          className="px-2.5 py-1 rounded-lg text-xs font-bold transition-all border"
                          style={
                            editForm.addictionType === t
                              ? {
                                  background: `${ageCfg.color}20`,
                                  borderColor: `${ageCfg.color}40`,
                                  color: ageCfg.color,
                                }
                              : {
                                  background: "transparent",
                                  borderColor: "rgba(255,255,255,0.1)",
                                  color: "rgba(255,255,255,0.4)",
                                }
                          }
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="flex-1 min-w-0">
                    <div className="text-white/40 text-xs mb-0.5">
                      نوع الوقاية
                    </div>
                    <div className="text-white text-sm font-bold truncate">
                      {user.addictionType || "غير محدد"}
                    </div>
                  </div>
                )}
              </div>

              {/* Join Date */}
              <div className="flex items-center gap-3 p-3 rounded-xl bg-white/3 border border-white/5">
                <Star className="w-4 h-4 text-white/30 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="text-white/40 text-xs mb-0.5">
                    تاريخ الانضمام
                  </div>
                  <div className="text-white text-sm font-bold">
                    {user.joinDate
                      ? new Date(user.joinDate).toLocaleDateString("ar-SA", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })
                      : "غير متاح"}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Change Password */}
          <div className="rounded-2xl glass-card border border-white/8 p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-white font-bold text-sm flex items-center gap-2">
                <Lock className="w-4 h-4" style={{ color: ageCfg.color }} />
                كلمة المرور
              </h3>
              {!changingPassword && (
                <button
                  onClick={() => setChangingPassword(true)}
                  className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg border border-white/10 text-white/50 hover:text-white hover:border-white/20 transition-all"
                >
                  <Edit3 className="w-3 h-3" />
                  تغيير
                </button>
              )}
            </div>

            <AnimatePresence>
              {changingPassword && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="space-y-3 overflow-hidden"
                >
                  {/* Current Password */}
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-white/3 border border-white/5">
                    <Lock className="w-4 h-4 text-white/30 flex-shrink-0" />
                    <input
                      type={showCurrentPass ? "text" : "password"}
                      value={passwordForm.current}
                      onChange={e =>
                        setPasswordForm(f => ({
                          ...f,
                          current: e.target.value,
                        }))
                      }
                      className="flex-1 bg-transparent text-white text-sm outline-none placeholder:text-white/20"
                      placeholder="كلمة المرور الحالية"
                      dir="rtl"
                    />
                    <button
                      onClick={() => setShowCurrentPass(!showCurrentPass)}
                      className="text-white/30"
                    >
                      {showCurrentPass ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>

                  {/* New Password */}
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-white/3 border border-white/5">
                    <Lock className="w-4 h-4 text-white/30 flex-shrink-0" />
                    <input
                      type={showNewPass ? "text" : "password"}
                      value={passwordForm.newPass}
                      onChange={e =>
                        setPasswordForm(f => ({
                          ...f,
                          newPass: e.target.value,
                        }))
                      }
                      className="flex-1 bg-transparent text-white text-sm outline-none placeholder:text-white/20"
                      placeholder="كلمة المرور الجديدة"
                      dir="rtl"
                    />
                    <button
                      onClick={() => setShowNewPass(!showNewPass)}
                      className="text-white/30"
                    >
                      {showNewPass ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>

                  {/* Confirm New Password */}
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-white/3 border border-white/5">
                    <Lock className="w-4 h-4 text-white/30 flex-shrink-0" />
                    <input
                      type="password"
                      value={passwordForm.confirm}
                      onChange={e =>
                        setPasswordForm(f => ({
                          ...f,
                          confirm: e.target.value,
                        }))
                      }
                      className="flex-1 bg-transparent text-white text-sm outline-none placeholder:text-white/20"
                      placeholder="تأكيد كلمة المرور الجديدة"
                      dir="rtl"
                    />
                  </div>

                  <div className="flex gap-2 pt-1">
                    <button
                      onClick={() => {
                        setChangingPassword(false);
                        setPasswordForm({
                          current: "",
                          newPass: "",
                          confirm: "",
                        });
                      }}
                      className="flex-1 py-2.5 rounded-xl border border-white/10 text-white/50 text-xs font-bold hover:text-white transition-all"
                    >
                      إلغاء
                    </button>
                    <button
                      onClick={handleChangePassword}
                      disabled={loading}
                      className="flex-1 py-2.5 rounded-xl text-white text-xs font-bold transition-all disabled:opacity-50"
                      style={{ background: ageCfg.color }}
                    >
                      {loading ? "جاري التغيير..." : "تغيير كلمة المرور"}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {!changingPassword && (
              <div className="flex items-center gap-3 p-3 rounded-xl bg-white/3 border border-white/5">
                <Lock className="w-4 h-4 text-white/30" />
                <span className="text-white/40 text-sm">••••••••</span>
              </div>
            )}
          </div>

          {/* Quick Links */}
          <div className="rounded-2xl glass-card border border-white/8 p-4">
            <h3 className="text-white font-bold text-sm mb-3 flex items-center gap-2">
              <Star className="w-4 h-4" style={{ color: ageCfg.color }} />
              روابط سريعة
            </h3>
            <div className="space-y-2">
              {[
                {
                  icon: Shield,
                  label: "خطتي الوقائية",
                  path: "/recovery",
                  color: "#00D4AA",
                },
                {
                  icon: Award,
                  label: "إنجازاتي",
                  path: "/achievements",
                  color: "#F59E0B",
                },
                {
                  icon: Brain,
                  label: "تقييم مستوى الخطر",
                  path: "/assessment",
                  color: "#8B5CF6",
                },
                {
                  icon: BookOpen,
                  label: "محاضراتي",
                  path: "/lectures",
                  color: "#0EA5E9",
                },
              ].map(link => (
                <button
                  key={link.path}
                  onClick={() => navigate(link.path)}
                  className="flex items-center gap-3 w-full p-3 rounded-xl bg-white/3 border border-white/5 hover:bg-white/5 transition-all text-right"
                >
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: `${link.color}15` }}
                  >
                    <link.icon
                      className="w-4 h-4"
                      style={{ color: link.color }}
                    />
                  </div>
                  <span className="text-white text-sm font-bold flex-1">
                    {link.label}
                  </span>
                  <ChevronLeft className="w-4 h-4 text-white/20" />
                </button>
              ))}
            </div>
          </div>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-[#EF4444]/10 border border-[#EF4444]/20 hover:bg-[#EF4444]/20 transition-all"
          >
            <LogOut className="w-4 h-4 text-[#EF4444]" />
            <span className="text-[#EF4444] text-sm font-bold">
              تسجيل الخروج
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
