/**
 * Account - صفحة حسابي
 * Design: Mobile-First Dark Luxury - "صون"
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
  Settings as SettingsIcon,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {
  EmailAuthProvider,
  onAuthStateChanged,
  reauthenticateWithCredential,
  updatePassword,
} from "firebase/auth";
import { isValidEmail } from "@/lib/utils";
import { auth, getUserProfile, logoutUser, saveUserProfile } from "@/lib/firebase";

const ageGroupConfig: Record<
  string,
  { label: string; color: string; emoji: string }
> = {
  young: { label: "يافع", color: "#00D4AA", emoji: "🌱" },
  teenage: { label: "مراهق", color: "#F59E0B", emoji: "⚡" },
  adult: { label: "بالغ", color: "#8B5CF6", emoji: "🎯" },
};

const genderConfig: Record<
  string,
  { label: string; color: string; emoji: string }
> = {
  male: { label: "ذكر", color: "#3B82F6", emoji: "♂️" },
  female: { label: "أنثى", color: "#EC4899", emoji: "♀️" },
};

function getRecoveryAchievementCount() {
  return 0;
}

export default function Account() {
  const [, navigate] = useLocation();
  const [user, setUser] = useState<any>(null);
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
    gender: "",
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
    if (!auth) {
      navigate("/login");
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async firebaseUser => {
      if (!firebaseUser) {
        navigate("/login");
        return;
      }

      const profile = await getUserProfile(firebaseUser.uid);
      if (!profile) {
        navigate("/mental-health-test");
        return;
      }

      setUser(profile);
      setEditForm({
        name: String(profile.name || ""),
        email: String(profile.email || firebaseUser.email || ""),
        gender: String(profile.gender || ""),
        addictionType: String(profile.addictionType || ""),
      });
    });

    return unsubscribe;
  }, [navigate]);

  if (!user) return null;

  const ageCfg = ageGroupConfig[user.ageGroup] || ageGroupConfig.adult;
  const genderMeta = genderConfig[user.gender] || null;

  const handleSaveProfile = async () => {
    if (!editForm.name.trim()) {
      toast.error("الاسم مطلوب");
      return;
    }
    if (editForm.email && !isValidEmail(editForm.email)) {
      toast.error("البريد الإلكتروني غير صحيح");
      return;
    }

    const updated = {
      ...user,
      name: editForm.name.trim(),
      email: editForm.email.trim(),
      gender: editForm.gender,
      addictionType: editForm.addictionType,
    };
    await saveUserProfile(user.id, updated);
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
      const firebaseUser = auth?.currentUser;
      if (!firebaseUser || !firebaseUser.email) {
        toast.error("انتهت الجلسة، يرجى تسجيل الدخول مجدداً");
        navigate("/login");
        return;
      }

      const credential = EmailAuthProvider.credential(
        firebaseUser.email,
        passwordForm.current
      );
      await reauthenticateWithCredential(firebaseUser, credential);
      await updatePassword(firebaseUser, passwordForm.newPass);

      if (auth?.currentUser && auth.currentUser.uid) {
        await saveUserProfile(auth.currentUser.uid, {
          passwordUpdatedAt: new Date().toISOString(),
        });
      }

      setChangingPassword(false);
      setPasswordForm({ current: "", newPass: "", confirm: "" });
      toast.success("تم تغيير كلمة المرور بنجاح");
    } catch {
        toast.error("كلمة المرور الحالية غير صحيحة");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logoutUser();
    toast.success("تم تسجيل الخروج");
    navigate("/login");
  };

  const handleRetakeTest = () => {
    const updated = { ...user, testCompleted: false };
    delete updated.testResult;
    saveUserProfile(user.id, {
      testCompleted: false,
      testResult: null,
    }).catch(() => {
      toast.error("تعذر تحديث حالة الاختبار");
    });
    setUser(updated);
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
            <h1 className="text-foreground font-black text-xl">الملف الشخصي</h1>
          </div>
          <button
            onClick={() => navigate("/dashboard")}
            className="p-2 rounded-xl glass-card border border-border"
          >
            <ChevronLeft className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>
      </div>

      <div className="page-content overflow-y-auto">
        <div className="px-4 pt-3 pb-6 space-y-4">
          {/* Profile Card */}
          <div className="rounded-2xl glass-card border border-border p-5">
            <div className="flex items-center gap-4 mb-4">
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl"
                style={{ background: `${ageCfg.color}20` }}
              >
                {ageCfg.emoji}
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-foreground font-black text-lg truncate">
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
              <div className="text-center p-2.5 rounded-xl bg-secondary/60 border border-border">
                <Clock
                  className="w-4 h-4 mx-auto mb-1"
                  style={{ color: ageCfg.color }}
                />
                <div className="text-foreground font-black text-sm">
                  {daysSinceJoin}
                </div>
                <div className="text-muted-foreground text-xs">يوم معنا</div>
              </div>
              <div className="text-center p-2.5 rounded-xl bg-secondary/60 border border-border">
                <Award className="w-4 h-4 mx-auto mb-1 text-accent" />
                <div className="text-foreground font-black text-sm">
                  {getRecoveryAchievementCount()}
                </div>
                <div className="text-muted-foreground text-xs">إنجاز</div>
              </div>
              <div className="text-center p-2.5 rounded-xl bg-secondary/60 border border-border">
                <BookOpen className="w-4 h-4 mx-auto mb-1 text-violet-500" />
                <div className="text-foreground font-black text-sm">
                  {user.completedLectures?.length || 0}
                </div>
                <div className="text-muted-foreground text-xs">محاضرة</div>
              </div>
            </div>
          </div>

          {/* Test Result */}
          {user.testResult && (
            <div className="rounded-2xl glass-card border border-border p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-foreground font-bold text-sm flex items-center gap-2">
                  <Brain className="w-4 h-4" style={{ color: ageCfg.color }} />
                  نتيجة الاختبار النفسي
                </h3>
                <button
                  onClick={handleRetakeTest}
                  className="text-xs px-3 py-1.5 rounded-lg border border-border text-muted-foreground hover:text-foreground hover:border-border transition-all"
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
                          <span className="text-muted-foreground text-xs">
                            {labels[key] || key}
                          </span>
                          <span className="text-foreground font-bold text-xs">
                            {Math.round(pct)}%
                          </span>
                        </div>
                        <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
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
          <div className="rounded-2xl glass-card border border-border p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-foreground font-bold text-sm flex items-center gap-2">
                <User className="w-4 h-4" style={{ color: ageCfg.color }} />
                البيانات الشخصية
              </h3>
              {!editing ? (
                <button
                  onClick={() => setEditing(true)}
                  className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg border border-border text-muted-foreground hover:text-foreground hover:border-border transition-all"
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
                        gender: user.gender || "",
                        addictionType: user.addictionType || "",
                      });
                    }}
                    className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg border border-border text-muted-foreground hover:text-foreground transition-all"
                  >
                    <X className="w-3 h-3" />
                    إلغاء
                  </button>
                  <button
                    onClick={handleSaveProfile}
                    className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg text-foreground font-bold transition-all"
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
              <div className="flex items-center gap-3 p-3 rounded-xl bg-secondary/40 border border-border">
                <User className="w-4 h-4 text-muted-foreground/70 flex-shrink-0" />
                {editing ? (
                  <input
                    value={editForm.name}
                    onChange={e =>
                      setEditForm(f => ({ ...f, name: e.target.value }))
                    }
                    className="flex-1 bg-transparent text-foreground text-sm outline-none placeholder:text-muted-foreground/60"
                    placeholder="الاسم"
                    dir="rtl"
                  />
                ) : (
                  <div className="flex-1 min-w-0">
                    <div className="text-muted-foreground text-xs mb-0.5">
                      الاسم
                    </div>
                    <div className="text-foreground text-sm font-bold truncate">
                      {user.name}
                    </div>
                  </div>
                )}
              </div>

              {/* Phone (read-only) */}
              <div className="flex items-center gap-3 p-3 rounded-xl bg-secondary/40 border border-border">
                <Phone className="w-4 h-4 text-muted-foreground/70 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="text-muted-foreground text-xs mb-0.5">
                    رقم الجوال
                  </div>
                  <div
                    className="text-foreground text-sm font-bold font-numbers"
                    dir="ltr"
                  >
                    {user.phone}
                  </div>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-center gap-3 p-3 rounded-xl bg-secondary/40 border border-border">
                <Mail className="w-4 h-4 text-muted-foreground/70 flex-shrink-0" />
                {editing ? (
                  <input
                    value={editForm.email}
                    onChange={e =>
                      setEditForm(f => ({ ...f, email: e.target.value }))
                    }
                    className="flex-1 bg-transparent text-foreground text-sm outline-none placeholder:text-muted-foreground/60"
                    placeholder="البريد الإلكتروني (اختياري)"
                    dir="ltr"
                  />
                ) : (
                  <div className="flex-1 min-w-0">
                    <div className="text-muted-foreground text-xs mb-0.5">
                      البريد الإلكتروني
                    </div>
                    <div
                      className="text-foreground text-sm font-bold truncate"
                      dir="ltr"
                    >
                      {user.email || "غير محدد"}
                    </div>
                  </div>
                )}
              </div>

              {/* Age */}
              <div className="flex items-center gap-3 p-3 rounded-xl bg-secondary/40 border border-border">
                <Calendar className="w-4 h-4 text-muted-foreground/70 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="text-muted-foreground text-xs mb-0.5">
                    العمر
                  </div>
                  <div className="text-foreground text-sm font-bold">
                    {user.age} سنة —{" "}
                    <span style={{ color: ageCfg.color }}>{ageCfg.label}</span>
                  </div>
                </div>
              </div>

              {/* Gender */}
              <div className="flex items-center gap-3 p-3 rounded-xl bg-secondary/40 border border-border">
                <Heart className="w-4 h-4 text-muted-foreground/70 flex-shrink-0" />
                {editing ? (
                  <div className="flex-1">
                    <div className="text-muted-foreground text-xs mb-1.5">
                      الجنس
                    </div>
                    <div className="flex gap-2">
                      {Object.entries(genderConfig).map(([key, meta]) => {
                        const isActive = editForm.gender === key;
                        return (
                          <button
                            key={key}
                            onClick={() =>
                              setEditForm(f => ({ ...f, gender: key }))
                            }
                            className="px-2.5 py-1 rounded-lg text-xs font-bold transition-all border"
                            style={
                              isActive
                                ? {
                                    background: `${meta.color}20`,
                                    borderColor: `${meta.color}40`,
                                    color: meta.color,
                                  }
                                : {
                                    background: "transparent",
                                    borderColor: "var(--border)",
                                    color: "var(--muted-foreground)",
                                  }
                            }
                          >
                            {meta.emoji} {meta.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <div className="flex-1 min-w-0">
                    <div className="text-muted-foreground text-xs mb-0.5">
                      الجنس
                    </div>
                    <div className="text-foreground text-sm font-bold truncate">
                      {genderMeta
                        ? `${genderMeta.emoji} ${genderMeta.label}`
                        : "غير محدد"}
                    </div>
                  </div>
                )}
              </div>

              {/* Addiction Type */}
              <div className="flex items-center gap-3 p-3 rounded-xl bg-secondary/40 border border-border">
                <Shield className="w-4 h-4 text-muted-foreground/70 flex-shrink-0" />
                {editing ? (
                  <div className="flex-1">
                    <div className="text-muted-foreground text-xs mb-1.5">
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
                                  borderColor: "var(--border)",
                                  color: "var(--muted-foreground)",
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
                    <div className="text-muted-foreground text-xs mb-0.5">
                      نوع الوقاية
                    </div>
                    <div className="text-foreground text-sm font-bold truncate">
                      {user.addictionType || "غير محدد"}
                    </div>
                  </div>
                )}
              </div>

              {/* Join Date */}
              <div className="flex items-center gap-3 p-3 rounded-xl bg-secondary/40 border border-border">
                <Star className="w-4 h-4 text-muted-foreground/70 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="text-muted-foreground text-xs mb-0.5">
                    تاريخ الانضمام
                  </div>
                  <div className="text-foreground text-sm font-bold">
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
          <div className="rounded-2xl glass-card border border-border p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-foreground font-bold text-sm flex items-center gap-2">
                <Lock className="w-4 h-4" style={{ color: ageCfg.color }} />
                كلمة المرور
              </h3>
              {!changingPassword && (
                <button
                  onClick={() => setChangingPassword(true)}
                  className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg border border-border text-muted-foreground hover:text-foreground hover:border-border transition-all"
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
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-secondary/40 border border-border">
                    <Lock className="w-4 h-4 text-muted-foreground/70 flex-shrink-0" />
                    <input
                      type={showCurrentPass ? "text" : "password"}
                      value={passwordForm.current}
                      onChange={e =>
                        setPasswordForm(f => ({
                          ...f,
                          current: e.target.value,
                        }))
                      }
                      className="flex-1 bg-transparent text-foreground text-sm outline-none placeholder:text-muted-foreground/60"
                      placeholder="كلمة المرور الحالية"
                      dir="rtl"
                    />
                    <button
                      onClick={() => setShowCurrentPass(!showCurrentPass)}
                      className="text-muted-foreground/70"
                    >
                      {showCurrentPass ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>

                  {/* New Password */}
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-secondary/40 border border-border">
                    <Lock className="w-4 h-4 text-muted-foreground/70 flex-shrink-0" />
                    <input
                      type={showNewPass ? "text" : "password"}
                      value={passwordForm.newPass}
                      onChange={e =>
                        setPasswordForm(f => ({
                          ...f,
                          newPass: e.target.value,
                        }))
                      }
                      className="flex-1 bg-transparent text-foreground text-sm outline-none placeholder:text-muted-foreground/60"
                      placeholder="كلمة المرور الجديدة"
                      dir="rtl"
                    />
                    <button
                      onClick={() => setShowNewPass(!showNewPass)}
                      className="text-muted-foreground/70"
                    >
                      {showNewPass ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>

                  {/* Confirm New Password */}
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-secondary/40 border border-border">
                    <Lock className="w-4 h-4 text-muted-foreground/70 flex-shrink-0" />
                    <input
                      type="password"
                      value={passwordForm.confirm}
                      onChange={e =>
                        setPasswordForm(f => ({
                          ...f,
                          confirm: e.target.value,
                        }))
                      }
                      className="flex-1 bg-transparent text-foreground text-sm outline-none placeholder:text-muted-foreground/60"
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
                      className="flex-1 py-2.5 rounded-xl border border-border text-muted-foreground text-xs font-bold hover:text-foreground transition-all"
                    >
                      إلغاء
                    </button>
                    <button
                      onClick={handleChangePassword}
                      disabled={loading}
                      className="flex-1 py-2.5 rounded-xl text-foreground text-xs font-bold transition-all disabled:opacity-50"
                      style={{ background: ageCfg.color }}
                    >
                      {loading ? "جاري التغيير..." : "تغيير كلمة المرور"}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {!changingPassword && (
              <div className="flex items-center gap-3 p-3 rounded-xl bg-secondary/40 border border-border">
                <Lock className="w-4 h-4 text-muted-foreground/70" />
                <span className="text-muted-foreground text-sm">••••••••</span>
              </div>
            )}
          </div>

          {/* Quick Links */}
          <div className="rounded-2xl glass-card border border-border p-4">
            <h3 className="text-foreground font-bold text-sm mb-3 flex items-center gap-2">
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
                {
                  icon: SettingsIcon,
                  label: "الإعدادات",
                  path: "/settings",
                  color: "#EC4899",
                },
              ].map(link => (
                <button
                  key={link.path}
                  onClick={() => navigate(link.path)}
                  className="flex items-center gap-3 w-full p-3 rounded-xl bg-secondary/40 border border-border hover:bg-secondary/60 transition-all text-right"
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
                  <span className="text-foreground text-sm font-bold flex-1">
                    {link.label}
                  </span>
                  <ChevronLeft className="w-4 h-4 text-muted-foreground/60" />
                </button>
              ))}
            </div>
          </div>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-destructive/10 border border-destructive/20 hover:bg-destructive/20 transition-all"
          >
            <LogOut className="w-4 h-4 text-destructive" />
            <span className="text-destructive text-sm font-bold">
              تسجيل الخروج
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
