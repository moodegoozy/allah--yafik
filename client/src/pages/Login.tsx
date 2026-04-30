/**
 * Login - صفحة تسجيل الدخول وإنشاء الحساب
 * Design: Dark Luxury Wellness - "الله يعافيك"
 * Features: تسجيل دخول، إنشاء حساب، حفظ بيانات في localStorage
 */
import { useState, useRef } from "react";
import { useLocation } from "wouter";
import {
  Sparkles,
  Eye,
  EyeOff,
  User,
  Lock,
  Phone,
  Mail,
  CheckCircle2,
  ArrowLeft,
  Shield,
  Heart,
  Calendar,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { hashPassword, isValidSaudiPhone, isValidEmail } from "@/lib/utils";

const CONTACT_PHONE = "0546192019";

// SHA-256 hash of the admin PIN — never store the raw PIN in code
const ADMIN_PIN_HASH =
  "f2a13f6230405e7a898ea123b738c84040a98e2434f818b0d56375627bb023c0";

type Mode = "login" | "register" | "forgot" | "admin";
type Gender = "male" | "female";

export default function Login() {
  const [, navigate] = useLocation();
  const [mode, setMode] = useState<Mode>("login");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [registerForm, setRegisterForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    age: "",
    gender: "" as "" | Gender,
    addictionType: "",
    soberDays: "",
    agreeTerms: false,
  });
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotStep, setForgotStep] = useState<"email" | "reset">("email");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [adminPin, setAdminPin] = useState("");
  const [showAdminMode, setShowAdminMode] = useState(false);
  const tapCountRef = useRef(0);
  const tapTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleLogoTap = () => {
    tapCountRef.current += 1;
    if (tapTimerRef.current) clearTimeout(tapTimerRef.current);
    tapTimerRef.current = setTimeout(() => {
      tapCountRef.current = 0;
    }, 3000);
    if (tapCountRef.current >= 5) {
      tapCountRef.current = 0;
      if (tapTimerRef.current) clearTimeout(tapTimerRef.current);
      setShowAdminMode(true);
      setMode("admin");
    }
  };

  const addictionTypes = [
    "مخدرات",
    "تدخين",
    "كحول",
    "إدمان رقمي / ألعاب",
    "إدمان طعام",
    "إدمان عمل",
    "أخرى",
  ];

  const genderOptions: { value: Gender; label: string; emoji: string }[] = [
    { value: "male", label: "ذكر", emoji: "♂️" },
    { value: "female", label: "أنثى", emoji: "♀️" },
  ];

  const handleLogin = async () => {
    if (!loginForm.email || !loginForm.password) {
      toast.error("يرجى تعبئة جميع الحقول");
      return;
    }
    if (!isValidEmail(loginForm.email)) {
      toast.error("البريد الإلكتروني غير صحيح");
      return;
    }
    setLoading(true);
    try {
      const hashedPassword = await hashPassword(loginForm.password);
      const users = JSON.parse(
        localStorage.getItem("allah_yafik_users") || "[]"
      );
      const user = users.find(
        (u: any) =>
          u.email === loginForm.email && u.passwordHash === hashedPassword
      );
      if (user) {
        const { passwordHash: _, ...safeUser } = user;
        localStorage.setItem(
          "allah_yafik_current_user",
          JSON.stringify(safeUser)
        );
        toast.success(`أهلاً بعودتك، ${user.name}!`);
        navigate("/dashboard");
      } else {
        toast.error("البريد الإلكترونيلكتروني أو كلمة المرور غير صحيحة");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!registerForm.name || !registerForm.email || !registerForm.password) {
      toast.error("يرجى تعبئة الحقول المطلوبة");
      return;
    }
    if (!isValidEmail(registerForm.email)) {
      toast.error("البريد الإلكتروني غير صحيح");
      return;
    }
    if (
      !registerForm.age ||
      isNaN(Number(registerForm.age)) ||
      Number(registerForm.age) < 1 ||
      Number(registerForm.age) > 120
    ) {
      toast.error("يرجى إدخال العمر بشكل صحيح");
      return;
    }
    if (!registerForm.gender) {
      toast.error("يرجى تحديد الجنس");
      return;
    }
    if (registerForm.phone && !isValidSaudiPhone(registerForm.phone)) {
      toast.error(
        "رقم الجوال غير صحيح. يجب أن يبدأ بـ 05 ويتكون من 10 أرقامن يبدأ بـ 05 ويتكون من 10 أرقام"
      );
      return;
    }
    if (registerForm.password.length < 8) {
      toast.error("كلمة المرور يجب أن تكون ٨ أحرف على الأقل");
      return;
    }
    if (registerForm.password !== registerForm.confirmPassword) {
      toast.error("كلمة المرور غير متطابقة");
      return;
    }
    if (!registerForm.agreeTerms) {
      toast.error("يرجى الموافقة على الشروط والأحكام");
      return;
    }
    setLoading(true);
    try {
      const users = JSON.parse(
        localStorage.getItem("allah_yafik_users") || "[]"
      );
      const emailExists = users.some(
        (u: any) => u.email === registerForm.email
      );
      if (emailExists) {
        toast.error("البريد الإلكترونيلكتروني مسجل مسبقاً. يرجى تسجيل الدخول");
        setLoading(false);
        return;
      }
      const hashedPassword = await hashPassword(registerForm.password);
      const age = parseInt(registerForm.age);
      const ageGroup = age <= 17 ? "young" : age <= 25 ? "teenage" : "adult";
      const newUser = {
        id: crypto.randomUUID(),
        name: registerForm.name,
        phone: registerForm.phone,
        email: registerForm.email,
        passwordHash: hashedPassword,
        age,
        ageGroup,
        gender: registerForm.gender,
        testCompleted: false,
        addictionType: registerForm.addictionType,
        soberDays: parseInt(registerForm.soberDays) || 0,
        joinDate: new Date().toISOString(),
        achievements: [],
        completedLectures: [],
      };
      users.push(newUser);
      localStorage.setItem("allah_yafik_users", JSON.stringify(users));
      const { passwordHash: _, ...safeUser } = newUser;
      localStorage.setItem(
        "allah_yafik_current_user",
        JSON.stringify(safeUser)
      );
      toast.success(`مرحباً ${newUser.name}! تم إنشاء حسابك بنجاح`);
      navigate("/mental-health-test");
    } finally {
      setLoading(false);
    }
  };

  const handleAdminLogin = async () => {
    if (!adminPin) {
      toast.error("يرجى إدخال رمز الدخول");
      return;
    }
    setLoading(true);
    try {
      const hashed = await hashPassword(adminPin);
      if (hashed === ADMIN_PIN_HASH) {
        // Check if already logged in — promote existing user
        const raw =
          sessionStorage.getItem("allah_yafik_current_user") ||
          localStorage.getItem("allah_yafik_current_user");
        const existing = raw ? JSON.parse(raw) : null;
        const adminUser = existing
          ? { ...existing, role: "admin" }
          : { name: "المشرف", phone: "", role: "admin", testCompleted: true };
        // Admin session in sessionStorage only — auto-clears on tab/browser close
        sessionStorage.setItem(
          "allah_yafik_current_user",
          JSON.stringify(adminUser)
        );
        // Remove any stale admin record that may exist in localStorage
        const lsRaw = localStorage.getItem("allah_yafik_current_user");
        if (lsRaw) {
          try {
            if (JSON.parse(lsRaw).role === "admin")
              localStorage.removeItem("allah_yafik_current_user");
          } catch {}
        }
        toast.success("مرحباً بك في لوحة الإدارة");
        navigate("/admin");
      } else {
        toast.error("رمز الدخول غير صحيح");
      }
    } finally {
      setLoading(false);
      setAdminPin("");
    }
  };

  const handleForgot = () => {
    if (!forgotEmail) {
      toast.error("يرجى إدخال البريد الإلكتروني");
      return;
    }
    if (!isValidEmail(forgotEmail)) {
      toast.error("البريد الإلكتروني غير صحيح");
      return;
    }
    const users = JSON.parse(localStorage.getItem("allah_yafik_users") || "[]");
    const userExists = users.some((u: any) => u.email === forgotEmail);
    if (!userExists) {
      toast.error("البريد الإلكتروني غير مسجل");
      return;
    }
    setForgotStep("reset");
  };

  const handleResetPassword = async () => {
    if (!newPassword || !confirmNewPassword) {
      toast.error("يرجى تعبئة جميع الحقول");
      return;
    }
    if (newPassword.length < 8) {
      toast.error("كلمة المرور يجب أن تكون ٨ أحرف على الأقل");
      return;
    }
    if (newPassword !== confirmNewPassword) {
      toast.error("كلمة المرور غير متطابقة");
      return;
    }
    const hashedPassword = await hashPassword(newPassword);
    const users = JSON.parse(localStorage.getItem("allah_yafik_users") || "[]");
    const updatedUsers = users.map((u: any) =>
      u.email === forgotEmail ? { ...u, passwordHash: hashedPassword } : u
    );
    localStorage.setItem("allah_yafik_users", JSON.stringify(updatedUsers));
    toast.success("تم تغيير كلمة المرور بنجاح. يرجى تسجيل الدخول");
    setForgotStep("email");
    setForgotEmail("");
    setNewPassword("");
    setConfirmNewPassword("");
    setMode("login");
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background orbs */}
      <div className="orb orb-teal w-96 h-96 -top-32 -right-32 opacity-20" />
      <div className="orb orb-gold w-72 h-72 -bottom-20 -left-20 opacity-15" />
      <div className="orb orb-purple w-64 h-64 top-1/2 left-1/4 opacity-10" />

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="text-center mb-8">
          <div
            className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-sky-500 flex items-center justify-center mx-auto mb-4 glow-teal cursor-default select-none"
            onClick={handleLogoTap}
            aria-hidden="true"
          >
            <Sparkles className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-black text-foreground mb-1">
            الله يعافيك
          </h1>
          <p className="text-primary text-sm">برنامج الوقاية من الإدمان</p>
        </div>

        <AnimatePresence mode="wait">
          {/* Login Form */}
          {mode === "login" && (
            <motion.div
              key="login"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="glass-card p-7 border border-border">
                <h2 className="text-foreground font-black text-xl mb-1">
                  تسجيل الدخول
                </h2>
                <p className="text-muted-foreground text-sm mb-6">
                  أهلاً بعودتك في رحلة التعافي
                </p>

                <div className="space-y-4">
                  <div>
                    <label className="text-muted-foreground text-xs font-bold mb-1.5 block">
                      البريد الإلكتروني
                    </label>
                    <div className="relative">
                      <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/70" />
                      <input
                        value={loginForm.email}
                        onChange={e =>
                          setLoginForm(p => ({ ...p, email: e.target.value }))
                        }
                        placeholder="example@email.com"
                        autoComplete="email"
                        className="w-full bg-secondary/50 border border-border rounded-xl pr-10 pl-4 py-3 text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-primary/40 text-sm"
                        dir="ltr"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-muted-foreground text-xs font-bold mb-1.5 block">
                      كلمة المرور
                    </label>
                    <div className="relative">
                      <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/70" />
                      <input
                        type={showPass ? "text" : "password"}
                        value={loginForm.password}
                        onChange={e =>
                          setLoginForm(p => ({
                            ...p,
                            password: e.target.value,
                          }))
                        }
                        placeholder="••••••••"
                        autoComplete="current-password"
                        className="w-full bg-secondary/50 border border-border rounded-xl pr-10 pl-10 py-3 text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-primary/40 text-sm"
                        dir="ltr"
                      />
                      <button
                        onClick={() => setShowPass(!showPass)}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/70 hover:text-muted-foreground"
                      >
                        {showPass ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <button
                      onClick={() => setMode("forgot")}
                      className="text-primary text-xs hover:text-primary/70 transition-colors"
                    >
                      نسيت كلمة المرور؟
                    </button>
                  </div>
                  <button
                    onClick={handleLogin}
                    disabled={loading}
                    className="w-full py-3.5 rounded-xl font-black text-primary-foreground transition-all hover:scale-105 disabled:opacity-60 disabled:scale-100 flex items-center justify-center gap-2"
                    style={{
                      background:
                        "linear-gradient(135deg, oklch(0.75 0.18 175), oklch(0.68 0.16 230))",
                    }}
                  >
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-background/30 border-t-foreground rounded-full animate-spin" />
                    ) : (
                      "دخول"
                    )}
                  </button>
                </div>

                <div className="mt-5 pt-5 border-t border-border text-center">
                  <span className="text-muted-foreground text-sm">
                    ليس لديك حساب؟{" "}
                  </span>
                  <button
                    onClick={() => setMode("register")}
                    className="text-primary font-bold text-sm hover:text-primary/70"
                  >
                    إنشاء حساب جديد
                  </button>
                </div>
              </div>

              {/* Guest Access */}
              <button
                onClick={() => {
                  localStorage.setItem(
                    "allah_yafik_current_user",
                    JSON.stringify({
                      name: "زائر",
                      phone: "",
                      soberDays: 0,
                      role: "guest",
                    })
                  );
                  navigate("/");
                }}
                className="w-full mt-3 py-3 rounded-xl glass-card border border-border text-muted-foreground hover:text-foreground/70 font-bold text-sm transition-all"
              >
                تصفح كزائر
              </button>
            </motion.div>
          )}

          {/* Admin Login — revealed only via secret logo tap (5× in 3s) */}
          {mode === "admin" && showAdminMode && (
            <motion.div
              key="admin"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="glass-card p-7 border border-border">
                <div className="flex items-center gap-3 mb-5">
                  <button
                    onClick={() => {
                      setMode("login");
                      setAdminPin("");
                    }}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  <div>
                    <h2 className="text-foreground font-black text-xl">
                      لوحة الإدارة
                    </h2>
                    <p className="text-muted-foreground text-xs">
                      أدخل رمز المشرف للمتابعة
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-muted-foreground text-xs font-bold mb-1.5 block">
                      رمز الدخول
                    </label>
                    <div className="relative">
                      <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/70" />
                      <input
                        type="password"
                        value={adminPin}
                        onChange={e => setAdminPin(e.target.value)}
                        onKeyDown={e => e.key === "Enter" && handleAdminLogin()}
                        placeholder="أدخل رمز المشرف"
                        className="w-full bg-secondary/50 border border-border rounded-xl pr-10 pl-4 py-3 text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-accent/40 text-sm"
                        dir="ltr"
                        autoFocus
                      />
                    </div>
                  </div>
                  <button
                    onClick={handleAdminLogin}
                    disabled={loading}
                    className="w-full py-3.5 rounded-xl font-black text-primary-foreground transition-all hover:scale-105 disabled:opacity-60 disabled:scale-100 flex items-center justify-center gap-2"
                    style={{
                      background:
                        "linear-gradient(135deg, oklch(0.80 0.16 85), oklch(0.63 0.24 29))",
                    }}
                  >
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-background/30 border-t-foreground rounded-full animate-spin" />
                    ) : (
                      <>
                        <Shield className="w-5 h-5" />
                        دخول
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Register Form */}
          {mode === "register" && (
            <motion.div
              key="register"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="glass-card p-7 border border-border max-h-[75vh] overflow-y-auto">
                <div className="flex items-center gap-3 mb-5">
                  <button
                    onClick={() => setMode("login")}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  <div>
                    <h2 className="text-foreground font-black text-xl">
                      إنشاء حساب
                    </h2>
                    <p className="text-muted-foreground text-xs">
                      ابدأ رحلة التعافي اليوم
                    </p>
                  </div>
                </div>

                <div className="space-y-3.5">
                  <div>
                    <label className="text-muted-foreground text-xs font-bold mb-1.5 block">
                      الاسم الكامل *
                    </label>
                    <div className="relative">
                      <User className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/70" />
                      <input
                        value={registerForm.name}
                        onChange={e =>
                          setRegisterForm(p => ({ ...p, name: e.target.value }))
                        }
                        placeholder="اسمك الكامل"
                        className="w-full bg-secondary/50 border border-border rounded-xl pr-10 pl-4 py-3 text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-primary/40 text-sm"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-muted-foreground text-xs font-bold mb-1.5 block">
                      البريد الإلكتروني *
                    </label>
                    <div className="relative">
                      <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/70" />
                      <input
                        value={registerForm.email}
                        onChange={e =>
                          setRegisterForm(p => ({
                            ...p,
                            email: e.target.value,
                          }))
                        }
                        placeholder="example@email.com"
                        autoComplete="email"
                        className="w-full bg-secondary/50 border border-border rounded-xl pr-10 pl-4 py-3 text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-primary/40 text-sm"
                        dir="ltr"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-muted-foreground text-xs font-bold mb-1.5 block">
                      رقم الجوال (اختياري)
                    </label>
                    <div className="relative">
                      <Phone className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/70" />
                      <input
                        value={registerForm.phone}
                        onChange={e =>
                          setRegisterForm(p => ({
                            ...p,
                            phone: e.target.value,
                          }))
                        }
                        placeholder="05XXXXXXXX"
                        className="w-full bg-secondary/50 border border-border rounded-xl pr-10 pl-4 py-3 text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-primary/40 text-sm font-numbers"
                        dir="ltr"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-muted-foreground text-xs font-bold mb-1.5 block">
                      العمر *
                    </label>
                    <div className="relative">
                      <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/70" />
                      <input
                        type="number"
                        value={registerForm.age}
                        onChange={e =>
                          setRegisterForm(p => ({ ...p, age: e.target.value }))
                        }
                        placeholder="العمر"
                        min="1"
                        max="120"
                        className="w-full bg-secondary/50 border border-border rounded-xl pr-10 pl-4 py-3 text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-primary/40 text-sm font-numbers"
                      />
                    </div>
                    {registerForm.age && Number(registerForm.age) >= 1 && (
                      <p
                        className="text-xs mt-1.5 font-bold"
                        style={{
                          color:
                            Number(registerForm.age) <= 17
                              ? "#00D4AA"
                              : Number(registerForm.age) <= 25
                                ? "#F59E0B"
                                : "#8B5CF6",
                        }}
                      >
                        {Number(registerForm.age) <= 17
                          ? "🌱 فئة الناشئين (١-١٧)"
                          : Number(registerForm.age) <= 25
                            ? "⚡ فئة الشباب (١٨-٢٥)"
                            : "🏛️ فئة البالغين (٢٦+)"}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="text-muted-foreground text-xs font-bold mb-1.5 block">
                      الجنس *
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {genderOptions.map(opt => {
                        const isActive = registerForm.gender === opt.value;
                        return (
                          <button
                            key={opt.value}
                            onClick={() =>
                              setRegisterForm(p => ({
                                ...p,
                                gender: opt.value,
                              }))
                            }
                            className={`py-2.5 rounded-xl border text-sm font-bold transition-all flex items-center justify-center gap-1.5 ${
                              isActive
                                ? "border-primary bg-primary/10 text-primary"
                                : "border-border bg-secondary/40 text-muted-foreground hover:text-foreground"
                            }`}
                          >
                            <span>{opt.emoji}</span>
                            {opt.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                  <div>
                    <label className="text-muted-foreground text-xs font-bold mb-1.5 block">
                      نوع الإدمان (اختياري)
                    </label>
                    <select
                      value={registerForm.addictionType}
                      onChange={e =>
                        setRegisterForm(p => ({
                          ...p,
                          addictionType: e.target.value,
                        }))
                      }
                      className="w-full bg-card border border-border rounded-xl p-3 text-foreground focus:outline-none focus:border-primary/40 text-sm"
                    >
                      <option value="">اختر النوع (سري تماماً)</option>
                      {addictionTypes.map(t => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-muted-foreground text-xs font-bold mb-1.5 block">
                      عدد أيام التعافي (إن وجد)
                    </label>
                    <input
                      type="number"
                      value={registerForm.soberDays}
                      onChange={e =>
                        setRegisterForm(p => ({
                          ...p,
                          soberDays: e.target.value,
                        }))
                      }
                      placeholder="0"
                      min="0"
                      className="w-full bg-secondary/50 border border-border rounded-xl p-3 text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-primary/40 text-sm font-numbers"
                    />
                  </div>
                  <div>
                    <label className="text-muted-foreground text-xs font-bold mb-1.5 block">
                      كلمة المرور *
                    </label>
                    <div className="relative">
                      <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/70" />
                      <input
                        type={showPass ? "text" : "password"}
                        value={registerForm.password}
                        onChange={e =>
                          setRegisterForm(p => ({
                            ...p,
                            password: e.target.value,
                          }))
                        }
                        placeholder="٨ أحرف على الأقل"
                        autoComplete="new-password"
                        className="w-full bg-secondary/50 border border-border rounded-xl pr-10 pl-10 py-3 text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-primary/40 text-sm"
                        dir="ltr"
                      />
                      <button
                        onClick={() => setShowPass(!showPass)}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/70 hover:text-muted-foreground"
                      >
                        {showPass ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="text-muted-foreground text-xs font-bold mb-1.5 block">
                      تأكيد كلمة المرور *
                    </label>
                    <input
                      type="password"
                      value={registerForm.confirmPassword}
                      onChange={e =>
                        setRegisterForm(p => ({
                          ...p,
                          confirmPassword: e.target.value,
                        }))
                      }
                      placeholder="أعد كتابة كلمة المرور"
                      autoComplete="new-password"
                      className="w-full bg-secondary/50 border border-border rounded-xl p-3 text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-primary/40 text-sm"
                      dir="ltr"
                    />
                  </div>

                  <div className="flex items-start gap-3 p-3 rounded-xl bg-secondary/40 border border-border">
                    <button
                      onClick={() =>
                        setRegisterForm(p => ({
                          ...p,
                          agreeTerms: !p.agreeTerms,
                        }))
                      }
                      className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-all ${registerForm.agreeTerms ? "bg-primary border-primary" : "border-border"}`}
                    >
                      {registerForm.agreeTerms && (
                        <CheckCircle2 className="w-3 h-3 text-primary-foreground" />
                      )}
                    </button>
                    <p className="text-muted-foreground text-xs leading-relaxed">
                      أوافق على شروط الاستخدام وسياسة الخصوصية. بياناتي محفوظة
                      بسرية تامة ولن تُشارك مع أي جهة.
                    </p>
                  </div>

                  <button
                    onClick={handleRegister}
                    disabled={loading}
                    className="w-full py-3.5 rounded-xl font-black text-primary-foreground transition-all hover:scale-105 disabled:opacity-60 disabled:scale-100 flex items-center justify-center gap-2"
                    style={{
                      background:
                        "linear-gradient(135deg, oklch(0.75 0.18 175), oklch(0.68 0.16 230))",
                    }}
                  >
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-background/30 border-t-foreground rounded-full animate-spin" />
                    ) : (
                      "إنشاء الحساب"
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Forgot Password */}
          {mode === "forgot" && (
            <motion.div
              key="forgot"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="glass-card p-7 border border-border">
                <div className="flex items-center gap-3 mb-5">
                  <button
                    onClick={() => {
                      setMode("login");
                      setForgotStep("email");
                    }}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  <div>
                    <h2 className="text-foreground font-black text-xl">
                      استعادة كلمة المرور
                    </h2>
                    <p className="text-muted-foreground text-xs">
                      {forgotStep === "email"
                        ? "أدخل بريدك الإلكتروني المسجل"
                        : "أدخل كلمة المرور الجديدة"}
                    </p>
                  </div>
                </div>
                <div className="space-y-4">
                  {forgotStep === "email" ? (
                    <>
                      <div>
                        <label className="text-muted-foreground text-xs font-bold mb-1.5 block">
                          البريد الإلكتروني المسجل
                        </label>
                        <div className="relative">
                          <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/70" />
                          <input
                            value={forgotEmail}
                            onChange={e => setForgotEmail(e.target.value)}
                            placeholder="example@email.com"
                            className="w-full bg-secondary/50 border border-border rounded-xl pr-10 pl-4 py-3 text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-primary/40 text-sm"
                            dir="ltr"
                          />
                        </div>
                      </div>
                      <button
                        onClick={handleForgot}
                        className="w-full py-3.5 rounded-xl font-black text-primary-foreground transition-all hover:scale-105"
                        style={{
                          background:
                            "linear-gradient(135deg, oklch(0.75 0.18 175), oklch(0.68 0.16 230))",
                        }}
                      >
                        التالي
                      </button>
                    </>
                  ) : (
                    <>
                      <div>
                        <label className="text-muted-foreground text-xs font-bold mb-1.5 block">
                          كلمة المرور الجديدة
                        </label>
                        <div className="relative">
                          <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/70" />
                          <input
                            type={showPass ? "text" : "password"}
                            value={newPassword}
                            onChange={e => setNewPassword(e.target.value)}
                            placeholder="٨ أحرف على الأقل"
                            className="w-full bg-secondary/50 border border-border rounded-xl pr-10 pl-10 py-3 text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-primary/40 text-sm"
                            dir="ltr"
                          />
                          <button
                            onClick={() => setShowPass(!showPass)}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/70 hover:text-muted-foreground"
                          >
                            {showPass ? (
                              <EyeOff className="w-4 h-4" />
                            ) : (
                              <Eye className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </div>
                      <div>
                        <label className="text-muted-foreground text-xs font-bold mb-1.5 block">
                          تأكيد كلمة المرور الجديدة
                        </label>
                        <input
                          type="password"
                          value={confirmNewPassword}
                          onChange={e => setConfirmNewPassword(e.target.value)}
                          placeholder="أعد كتابة كلمة المرور"
                          className="w-full bg-secondary/50 border border-border rounded-xl p-3 text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-primary/40 text-sm"
                          dir="ltr"
                        />
                      </div>
                      <button
                        onClick={handleResetPassword}
                        className="w-full py-3.5 rounded-xl font-black text-primary-foreground transition-all hover:scale-105"
                        style={{
                          background:
                            "linear-gradient(135deg, oklch(0.75 0.18 175), oklch(0.68 0.16 230))",
                        }}
                      >
                        تغيير كلمة المرور
                      </button>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Privacy Note */}
        <div className="mt-5 flex items-center justify-center gap-2 text-muted-foreground/60 text-xs">
          <Shield className="w-3.5 h-3.5" />
          بياناتك محفوظة بسرية تامة
          <span>·</span>
          <Heart className="w-3.5 h-3.5 text-pink-500/50" />
          <a
            href={`tel:${CONTACT_PHONE}`}
            className="text-primary/50 hover:text-primary"
          >
            {CONTACT_PHONE}
          </a>
        </div>
      </div>
    </div>
  );
}
