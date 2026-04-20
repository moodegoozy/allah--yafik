/**
 * Achievements - صفحة الإنجازات والشهادات المحفوظة
 * Design: Dark Luxury Wellness - "الله يعافيك"
 * Features: شهادات مكتملة، إنجازات، إحصائيات التعلم، محاضرات مكتملة
 */
import { useState, useEffect, useCallback } from "react";
import { useLocation } from "wouter";
import {
  Award,
  Star,
  BookOpen,
  Clock,
  Brain,
  CheckCircle2,
  Trophy,
  Target,
  Flame,
  TrendingUp,
  Medal,
  Crown,
  Sparkles,
  Shield,
  Heart,
  Zap,
  Users,
  Calendar,
  ChevronLeft,
  Download,
  Share2,
  Eye,
  Lock,
} from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

const CONTACT_PHONE = "0546192019";

// Recovery phases mirrored for achievement mapping
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

const phaseAchievements = [
  {
    phaseId: 1,
    icon: Brain,
    title: "الواعي",
    desc: "أكمل مرحلة الوعي والمعرفة",
    color: "#00D4AA",
    xp: 100,
    reward: "شارة الواعي",
    goalCount: 5,
  },
  {
    phaseId: 2,
    icon: Shield,
    title: "المحصّن",
    desc: "أكمل مرحلة بناء المهارات",
    color: "#F59E0B",
    xp: 150,
    reward: "شارة المحصّن",
    goalCount: 5,
  },
  {
    phaseId: 3,
    icon: Heart,
    title: "المحصّن روحياً",
    desc: "أكمل مرحلة التحصين الروحي",
    color: "#8B5CF6",
    xp: 200,
    reward: "شارة المحصّن روحياً",
    goalCount: 5,
  },
  {
    phaseId: 4,
    icon: TrendingUp,
    title: "سفير الوقاية",
    desc: "أكمل مرحلة الوقاية المستدامة",
    color: "#10B981",
    xp: 300,
    reward: "شهادة سفير الوقاية",
    goalCount: 5,
  },
];

function loadRecoveryProgress(): Record<number, boolean[]> {
  try {
    const raw = localStorage.getItem(getUserRecoveryKey());
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function buildAchievements(recoveryData: Record<number, boolean[]>) {
  return phaseAchievements.map(pa => {
    const done = recoveryData[pa.phaseId] || [];
    const doneCount = done.filter(Boolean).length;
    const unlocked = doneCount >= pa.goalCount;
    return {
      id: pa.phaseId,
      icon: pa.icon,
      title: pa.title,
      desc: pa.desc,
      color: pa.color,
      xp: pa.xp,
      unlocked,
      progress: doneCount,
      target: pa.goalCount,
    };
  });
}

export default function Achievements() {
  const [, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState<
    "achievements" | "certificates" | "stats"
  >("achievements");

  const [recoveryData, setRecoveryData] = useState(loadRecoveryProgress);

  // Re-read when tab becomes visible (user might toggle goals in Recovery then come back)
  useEffect(() => {
    const onFocus = () => setRecoveryData(loadRecoveryProgress());
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, []);

  // Also re-read on storage events (same-tab won't fire, but cross-tab will)
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key?.startsWith(RECOVERY_KEY_PREFIX))
        setRecoveryData(loadRecoveryProgress());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const allAchievements = buildAchievements(recoveryData);
  const completedLectures: {
    id: string;
    title: string;
    speaker: string;
    score: number;
    total: number;
    date: string;
    color: string;
    category: string;
    certId: string;
  }[] = [];

  const totalXP = allAchievements
    .filter(a => a.unlocked)
    .reduce((sum, a) => sum + a.xp, 0);
  const level = Math.floor(totalXP / 200) + 1;
  const nextLevelXP = level * 200;
  const progressToNext = ((totalXP % 200) / 200) * 100;

  const totalGoals = phaseAchievements.reduce((s, p) => s + p.goalCount, 0);
  const doneGoals = allAchievements.reduce((s, a) => s + (a.progress ?? 0), 0);

  const handleShareCert = (cert: (typeof completedLectures)[0]) => {
    const text = `🎓 حصلت على شهادة إتمام محاضرة "${cert.title}" من برنامج الله يعافيك!\n\nرقم الشهادة: ${cert.certId}\n📞 0546192019`;
    navigator.clipboard.writeText(text);
    toast.success("تم نسخ الشهادة للمشاركة!");
  };

  return (
    <div className="app-container bg-gradient-navy overflow-hidden">
      <div className="orb w-64 h-64 opacity-8 top-10 -left-20" style={{ background: "oklch(0.80 0.18 80)" }} />

      {/* Header */}
      <div className="mobile-header px-5 py-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-accent text-xs font-bold uppercase tracking-wider mb-1">
              مركز الإنجازات
            </div>
            <h1 className="text-foreground font-black text-xl">إنجازاتي وشهاداتي</h1>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-amber-400 flex items-center justify-center">
              <Crown className="w-4 h-4 text-primary-foreground" />
            </div>
            <div>
              <div className="text-foreground font-black text-sm">Lv.{level}</div>
              <div className="text-muted-foreground/70 text-[10px]">{totalXP} XP</div>
            </div>
          </div>
        </div>

        {/* XP Progress */}
        <div className="mt-2">
          <div className="h-1.5 bg-secondary/80 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all"
              style={{
                width: `${progressToNext}%`,
                background: "linear-gradient(to right, oklch(0.80 0.16 85), oklch(0.85 0.15 85))",
              }}
            />
          </div>
          <div className="text-muted-foreground/60 text-[10px] mt-1 text-center">
            {nextLevelXP - totalXP} XP للمستوى التالي
          </div>
        </div>

        {/* Stats Row */}
        {doneGoals > 0 && (
          <div className="grid grid-cols-4 gap-2 mt-3">
            {[
              { icon: Target, label: "أهداف", value: `${doneGoals}/${totalGoals}`, color: "#00D4AA" },
              { icon: Trophy, label: "إنجازات", value: `${allAchievements.filter(a => a.unlocked).length}`, color: "#F59E0B" },
              { icon: Zap, label: "XP", value: `${totalXP}`, color: "#8B5CF6" },
              { icon: Flame, label: "مستوى", value: `${level}`, color: "#EF4444" },
            ].map((stat, i) => (
              <div key={i} className="glass-card p-2 border border-border text-center rounded-xl">
                <stat.icon className="w-3.5 h-3.5 mx-auto mb-1" style={{ color: stat.color }} />
                <div className="text-foreground font-black text-xs font-numbers">{stat.value}</div>
                <div className="text-muted-foreground/60 text-[10px]">{stat.label}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="page-content overflow-y-auto">
        {/* Tabs */}
        <div className="px-4 pt-3">
          <div className="flex gap-2 mb-6">
            {[
              {
                id: "achievements",
                label: "الإنجازات",
                icon: Trophy,
                count: allAchievements.filter(a => a.unlocked).length,
              },
              {
                id: "certificates",
                label: "الشهادات",
                icon: Award,
                count: completedLectures.length,
              },
              {
                id: "stats",
                label: "إحصائيات التعلم",
                icon: TrendingUp,
                count: null,
              },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  activeTab === tab.id
                    ? "bg-accent/15 text-accent border border-accent/30"
                    : "glass-card text-muted-foreground border border-border hover:text-foreground/80"
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
                {tab.count !== null && (
                  <span
                    className={`text-xs px-1.5 py-0.5 rounded-full font-numbers ${activeTab === tab.id ? "bg-accent/20 text-accent" : "bg-secondary text-muted-foreground"}`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Achievements Tab */}
          {activeTab === "achievements" && (
            <div>
              {allAchievements.every(
                a => !a.unlocked && (a.progress ?? 0) === 0
              ) ? (
                <div className="text-center py-16">
                  <Trophy className="w-12 h-12 text-muted-foreground/40 mx-auto mb-4" />
                  <h3 className="text-muted-foreground font-bold">
                    لا توجد إنجازات بعد
                  </h3>
                  <p className="text-muted-foreground/60 text-sm mt-2">
                    أكمل أهداف خطتك الوقائية لفتح الإنجازات
                  </p>
                  <button
                    onClick={() => navigate("/recovery")}
                    className="btn-teal px-6 py-3 rounded-xl font-bold text-sm mt-6"
                  >
                    ابدأ خطتك الوقائية
                  </button>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-foreground font-bold">
                      {allAchievements.filter(a => a.unlocked).length} /{" "}
                      {allAchievements.length} إنجاز مفتوح
                    </h3>
                    <div className="h-2 w-48 bg-secondary/80 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${(allAchievements.filter(a => a.unlocked).length / allAchievements.length) * 100}%`,
                          background:
                            "linear-gradient(to right, oklch(0.80 0.16 85), oklch(0.85 0.15 85))",
                        }}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-3 pb-8">
                    {allAchievements.map((ach, i) => (
                      <motion.div
                        key={ach.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className={`glass-card p-5 border transition-all relative overflow-hidden ${
                          ach.unlocked
                            ? "border-border hover:border-border"
                            : "border-border opacity-60"
                        }`}
                      >
                        {ach.unlocked && (
                          <div className="absolute top-3 left-3">
                            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                          </div>
                        )}
                        {!ach.unlocked && (
                          <div className="absolute top-3 left-3">
                            <Lock className="w-4 h-4 text-muted-foreground/60" />
                          </div>
                        )}

                        <div className="flex items-start gap-4">
                          <div
                            className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 ${ach.unlocked ? "" : "grayscale opacity-40"}`}
                            style={{
                              background: `${ach.color}20`,
                              border: `1px solid ${ach.color}30`,
                            }}
                          >
                            <ach.icon
                              className="w-7 h-7"
                              style={{
                                color: ach.unlocked
                                  ? ach.color
                                  : "var(--muted-foreground)",
                              }}
                            />
                          </div>
                          <div className="flex-1">
                            <h4
                              className={`font-bold text-sm mb-1 ${ach.unlocked ? "text-foreground" : "text-muted-foreground"}`}
                            >
                              {ach.title}
                            </h4>
                            <p className="text-muted-foreground/70 text-xs mb-2">
                              {ach.desc}
                            </p>
                            <div className="flex items-center justify-between">
                              <span
                                className="text-xs font-numbers"
                                style={{
                                  color: ach.unlocked
                                    ? ach.color
                                    : "var(--muted-foreground)",
                                }}
                              >
                                +{ach.xp} XP
                              </span>
                            </div>
                            {!ach.unlocked &&
                              ach.progress !== undefined &&
                              ach.target && (
                                <div className="mt-2">
                                  <div className="flex justify-between text-xs text-muted-foreground/60 mb-1">
                                    <span>
                                      {ach.progress}/{ach.target}
                                    </span>
                                    <span>
                                      {Math.round(
                                        (ach.progress / ach.target) * 100
                                      )}
                                      %
                                    </span>
                                  </div>
                                  <div className="h-1.5 bg-secondary/60 rounded-full overflow-hidden">
                                    <div
                                      className="h-full rounded-full"
                                      style={{
                                        width: `${(ach.progress / ach.target) * 100}%`,
                                        background: `${ach.color}60`,
                                      }}
                                    />
                                  </div>
                                </div>
                              )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}

          {/* Certificates Tab */}
          {activeTab === "certificates" && (
            <div className="pb-8">
              {completedLectures.length === 0 ? (
                <div className="text-center py-16">
                  <Award className="w-12 h-12 text-muted-foreground/40 mx-auto mb-4" />
                  <h3 className="text-muted-foreground font-bold">
                    لا توجد شهادات بعد
                  </h3>
                  <p className="text-muted-foreground/60 text-sm mt-2">
                    أكمل محاضرة واجتز اختبارها للحصول على شهادتك
                  </p>
                  <button
                    onClick={() => navigate("/lectures")}
                    className="btn-teal px-6 py-3 rounded-xl font-bold text-sm mt-6"
                  >
                    ابدأ محاضرة الآن
                  </button>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {completedLectures.map((cert, i) => {
                    const percentage = Math.round(
                      (cert.score / cert.total) * 100
                    );
                    const grade =
                      percentage === 100
                        ? "امتياز"
                        : percentage >= 80
                          ? "جيد جداً"
                          : "جيد";
                    const gradeColor =
                      percentage === 100
                        ? "#F59E0B"
                        : percentage >= 80
                          ? "#00D4AA"
                          : "#3B82F6";
                    return (
                      <motion.div
                        key={cert.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.1 }}
                        className="relative overflow-hidden rounded-2xl p-0.5"
                        style={{
                          background: `linear-gradient(135deg, ${cert.color}50, oklch(0.75 0.18 175 / 0.19))`,
                        }}
                      >
                        <div className="bg-background rounded-[14px] p-5">
                          {/* Header */}
                          <div className="flex items-center justify-between mb-4">
                            <div
                              className="w-10 h-10 rounded-xl flex items-center justify-center"
                              style={{
                                background: `${cert.color}20`,
                                border: `1px solid ${cert.color}30`,
                              }}
                            >
                              <Award
                                className="w-5 h-5"
                                style={{ color: cert.color }}
                              />
                            </div>
                            <span
                              className="text-xs font-bold px-2 py-1 rounded-lg"
                              style={{
                                background: `${gradeColor}15`,
                                color: gradeColor,
                              }}
                            >
                              {grade}
                            </span>
                          </div>

                          {/* Title */}
                          <h4 className="text-foreground font-black text-sm mb-1 leading-snug">
                            {cert.title}
                          </h4>
                          <p className="text-muted-foreground text-xs mb-4">
                            {cert.speaker}
                          </p>

                          {/* Score */}
                          <div className="flex items-center gap-3 mb-4">
                            <div className="flex-1 h-2 bg-secondary/80 rounded-full overflow-hidden">
                              <div
                                className="h-full rounded-full"
                                style={{
                                  width: `${percentage}%`,
                                  background: `linear-gradient(to right, ${cert.color}, oklch(0.75 0.18 175))`,
                                }}
                              />
                            </div>
                            <span className="text-foreground font-black font-numbers text-sm">
                              {percentage}%
                            </span>
                          </div>

                          {/* Details */}
                          <div className="flex items-center justify-between text-xs text-muted-foreground/70 mb-4">
                            <span>{cert.date}</span>
                            <span className="font-numbers">
                              {cert.certId.split("-").slice(-1)[0]}
                            </span>
                          </div>

                          {/* Actions */}
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleShareCert(cert)}
                              className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold transition-all"
                              style={{
                                background: `${cert.color}12`,
                                border: `1px solid ${cert.color}20`,
                                color: cert.color,
                              }}
                            >
                              <Share2 className="w-3.5 h-3.5" />
                              مشاركة
                            </button>
                            <button
                              onClick={() => navigate(`/lectures/${cert.id}`)}
                              className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs glass-card border border-border text-muted-foreground hover:text-foreground transition-all"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              عرض
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}

                  {/* Locked Certificates */}
                  {[1, 2].map(i => (
                    <div
                      key={i}
                      className="glass-card p-5 border border-border opacity-40 relative overflow-hidden"
                    >
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Lock className="w-8 h-8 text-muted-foreground/60" />
                      </div>
                      <div className="blur-sm">
                        <div className="w-10 h-10 rounded-xl bg-secondary/60 mb-4" />
                        <div className="h-3 bg-secondary/60 rounded mb-2 w-3/4" />
                        <div className="h-2 bg-secondary/60 rounded mb-4 w-1/2" />
                        <div className="h-2 bg-secondary/60 rounded-full" />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Stats Tab */}
          {activeTab === "stats" && (
            <div className="pb-8">
              {doneGoals === 0 ? (
                <div className="text-center py-16">
                  <TrendingUp className="w-12 h-12 text-muted-foreground/40 mx-auto mb-4" />
                  <h3 className="text-muted-foreground font-bold">
                    لا توجد إحصائيات بعد
                  </h3>
                  <p className="text-muted-foreground/60 text-sm mt-2">
                    ابدأ خطتك الوقائية لتظهر إحصائياتك
                  </p>
                  <button
                    onClick={() => navigate("/recovery")}
                    className="btn-teal px-6 py-3 rounded-xl font-bold text-sm mt-6"
                  >
                    ابدأ خطتك الوقائية
                  </button>
                </div>
              ) : (
                <div className="space-y-5">
                  <div className="glass-card p-5 border border-border">
                    <h3 className="text-foreground font-bold text-sm mb-4">
                      تقدم المراحل
                    </h3>
                    <div className="space-y-4">
                      {allAchievements.map(ach => (
                        <div key={ach.id}>
                          <div className="flex items-center justify-between mb-1.5">
                            <div className="flex items-center gap-2">
                              <ach.icon
                                className="w-4 h-4"
                                style={{ color: ach.color }}
                              />
                              <span className="text-foreground/70 text-sm font-bold">
                                {ach.title}
                              </span>
                            </div>
                            <span
                              className="text-xs font-numbers"
                              style={{ color: ach.color }}
                            >
                              {ach.progress}/{ach.target}
                            </span>
                          </div>
                          <div className="h-2 bg-secondary/80 rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full transition-all duration-500"
                              style={{
                                width: `${((ach.progress ?? 0) / (ach.target ?? 1)) * 100}%`,
                                background: ach.color,
                              }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="glass-card p-5 border border-border text-center">
                      <div className="text-3xl font-black font-numbers text-primary mb-1">
                        {Math.round((doneGoals / totalGoals) * 100)}%
                      </div>
                      <div className="text-muted-foreground text-xs">التقدم الكلي</div>
                    </div>
                    <div className="glass-card p-5 border border-border text-center">
                      <div className="text-3xl font-black font-numbers text-accent mb-1">
                        {totalXP}
                      </div>
                      <div className="text-muted-foreground text-xs">نقاط الخبرة</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
