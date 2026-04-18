/**
 * Recovery - خطتي الوقائية
 * Design: Dark Luxury Wellness - الله يعافيك
 * الهدف: الوقاية من الإدمان قبل الوقوع فيه
 */
import { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  Shield,
  CheckCircle2,
  Circle,
  Award,
  TrendingUp,
  Calendar,
  ChevronDown,
  ChevronUp,
  Star,
  Brain,
  Zap,
  Users,
  BookOpen,
  Heart,
  Target,
  Lightbulb,
  Lock,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { ExternalLink } from "lucide-react";

const STORAGE_KEY_PREFIX = "allah_yafik_recovery_goals";
const ADMIN_PHASES_KEY = "allah_yafik_admin_prevention_phases";

function getUserStorageKey(): string {
  try {
    const raw = localStorage.getItem("allah_yafik_current_user");
    if (raw) {
      const user = JSON.parse(raw);
      if (user.email) return `${STORAGE_KEY_PREFIX}_${user.email}`;
    }
  } catch {}
  return STORAGE_KEY_PREFIX;
}

// Icon map for serialisation — admin stores iconName string, we resolve here
const iconMap: Record<string, typeof Brain> = {
  Brain, Shield, Heart, TrendingUp, Target, Star, BookOpen, Users, Zap, Lightbulb,
};

interface StoredPhase {
  id: number;
  title: string;
  subtitle: string;
  iconName: string;
  color: string;
  description: string;
  goals: { text: string; link: string }[];
  reward: string;
}

const defaultPhases: StoredPhase[] = [
  {
    id: 1,
    title: "مرحلة الوعي والمعرفة",
    subtitle: "الأسبوع ١-٢",
    iconName: "Brain",
    color: "from-[#00D4AA] to-[#0EA5E9]",
    description: "اكتساب المعرفة الكاملة بمخاطر الإدمان وعوامل الخطر الشخصية",
    goals: [
      { text: "إكمال تقييم مستوى الخطر الشخصي", link: "/assessment" },
      { text: "قراءة محاضرة: علم الأعصاب والإدمان", link: "/lectures" },
      { text: "تحديد عوامل الخطر في بيئتك", link: "/assessment" },
      { text: "تعلم أعراض الإدمان المبكرة", link: "/resources" },
      { text: "إكمال اختبار الوعي الوقائي", link: "/assessment" },
    ],
    reward: "شارة الواعي",
  },
  {
    id: 2,
    title: "مرحلة بناء المهارات",
    subtitle: "الأسبوع ٣-٤",
    iconName: "Shield",
    color: "from-[#F59E0B] to-[#EF4444]",
    description: "تطوير مهارات الرفض والمقاومة وبناء الحصانة الشخصية",
    goals: [
      { text: "تعلم تقنية الرفض الاجتماعي الحازم", link: "/exercises" },
      { text: "ممارسة سيناريوهات الضغط الاجتماعي", link: "/exercises" },
      { text: "تطوير خطة الهروب من المواقف الخطرة", link: "/rehab-plan" },
      { text: "حضور جلسة توعية جماعية", link: "/community" },
      { text: "إكمال تمارين الوقاية الأسبوعية", link: "/exercises" },
    ],
    reward: "شارة المحصّن",
  },
  {
    id: 3,
    title: "مرحلة التحصين الروحي",
    subtitle: "الأسبوع ٥-٦",
    iconName: "Heart",
    color: "from-[#8B5CF6] to-[#EC4899]",
    description: "تعزيز الجانب الروحي والديني كدرع واقٍ قوي من الإدمان",
    goals: [
      { text: "الالتزام بأذكار الصباح والمساء يومياً", link: "/tracker" },
      { text: "حضور محاضرة التوعية الدينية", link: "/lectures" },
      { text: "قراءة آيات الوقاية والتحصين", link: "/resources" },
      { text: "التواصل مع إمام أو مرشد ديني", link: "/partners" },
      { text: "إكمال برنامج التحصين الروحي", link: "/exercises" },
    ],
    reward: "شارة المحصّن روحياً",
  },
  {
    id: 4,
    title: "مرحلة الوقاية المستدامة",
    subtitle: "الأسبوع ٧+",
    iconName: "TrendingUp",
    color: "from-[#10B981] to-[#3B82F6]",
    description: "الحفاظ على مستوى الوقاية ونشر الوعي في المجتمع",
    goals: [
      { text: "مشاركة تجربتك الوقائية مع الآخرين", link: "/community" },
      { text: "الانضمام لفريق التوعية المجتمعية", link: "/community" },
      { text: "إكمال ٣ محاضرات توعوية", link: "/lectures" },
      { text: "تدريب شخص آخر على مهارات الوقاية", link: "/community" },
      { text: "الحصول على شهادة السفير الوقائي", link: "/achievements" },
    ],
    reward: "شهادة سفير الوقاية",
  },
];

function loadAdminPhases(): StoredPhase[] {
  try {
    const raw = localStorage.getItem(ADMIN_PHASES_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {}
  return defaultPhases;
}

function resolvePhases(stored: StoredPhase[]) {
  return stored.map(p => ({
    ...p,
    icon: iconMap[p.iconName] || Brain,
  }));
}

type CompletedGoals = Record<number, boolean[]>;

function loadCompleted(): CompletedGoals {
  try {
    const raw = localStorage.getItem(getUserStorageKey());
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveCompleted(data: CompletedGoals) {
  localStorage.setItem(getUserStorageKey(), JSON.stringify(data));
}

function getPhaseStatus(
  phaseId: number,
  completed: CompletedGoals,
  phases: { id: number; goals: { text: string; link: string }[] }[]
): "completed" | "active" | "locked" {
  const phase = phases.find(p => p.id === phaseId);
  if (!phase) return "locked";
  const done = completed[phaseId] || [];
  const allDone =
    phase.goals.length > 0 && phase.goals.every((_: unknown, i: number) => done[i]);

  if (allDone) return "completed";

  // First phase (by index) is always unlocked
  const phaseIdx = phases.indexOf(phase);
  if (phaseIdx === 0) return "active";

  // Unlock if previous phase is completed
  const prevPhase = phases[phaseIdx - 1];
  const prevDone = completed[prevPhase.id] || [];
  const prevAllDone =
    prevPhase.goals.length > 0 && prevPhase.goals.every((_: unknown, i: number) => prevDone[i]);
  return prevAllDone ? "active" : "locked";
}

const weeklyTips = [
  {
    icon: "🧠",
    tip: "الوعي بالمخاطر يقلل احتمالية الوقوع في الإدمان بنسبة ٦٠٪",
  },
  { icon: "💪", tip: "قل لا بثقة — الرفض الحازم يُعلّم الآخرين احترام حدودك" },
  { icon: "🕌", tip: "الصلاة والذكر تُقوّي الإرادة وتحمي من الانجراف" },
  { icon: "👥", tip: "اختر أصدقاءك بعناية — البيئة تؤثر ٦٠٪ على سلوكك" },
];

export default function Recovery() {
  const [expandedPhase, setExpandedPhase] = useState<number | null>(1);
  const [completed, setCompleted] = useState<CompletedGoals>(loadCompleted);
  const [storedPhases, setStoredPhases] = useState<StoredPhase[]>(loadAdminPhases);

  // Re-read admin phases when window regains focus (admin may have edited them)
  useEffect(() => {
    const onFocus = () => setStoredPhases(loadAdminPhases());
    const onStorage = (e: StorageEvent) => {
      if (e.key === ADMIN_PHASES_KEY) setStoredPhases(loadAdminPhases());
    };
    window.addEventListener("focus", onFocus);
    window.addEventListener("storage", onStorage);
    return () => { window.removeEventListener("focus", onFocus); window.removeEventListener("storage", onStorage); };
  }, []);

  const preventionPhases = resolvePhases(storedPhases);

  const handleGoalToggle = (phaseId: number, goalIdx: number) => {
    const status = getPhaseStatus(phaseId, completed, preventionPhases);
    if (status === "locked") return;

    setCompleted(prev => {
      const phaseGoals = [
        ...(prev[phaseId] ||
          Array(
            preventionPhases.find(p => p.id === phaseId)!.goals.length
          ).fill(false)),
      ];
      phaseGoals[goalIdx] = !phaseGoals[goalIdx];
      const next = { ...prev, [phaseId]: phaseGoals };
      saveCompleted(next);
      return next;
    });

    toast.success("تم تسجيل إنجاز الهدف! استمر في التقدم 🎯");
  };

  // Compute overall progress
  const totalGoals = preventionPhases.reduce(
    (sum, p) => sum + p.goals.length,
    0
  );
  const doneGoals = preventionPhases.reduce((sum, p) => {
    const done = completed[p.id] || [];
    return sum + done.filter(Boolean).length;
  }, 0);
  const overallPct =
    totalGoals > 0 ? Math.round((doneGoals / totalGoals) * 100) : 0;

  // Find current active phase for header
  const activePhase = preventionPhases.find(
    p => getPhaseStatus(p.id, completed, preventionPhases) === "active"
  );
  const activePhaseIdx = activePhase
    ? preventionPhases.indexOf(activePhase) + 1
    : overallPct === 100
      ? preventionPhases.length
      : 1;

  // Arabic numeral helper
  const toAr = (n: number) => n.toLocaleString("ar-SA");

  return (
    <div className="app-container bg-gradient-navy">
      {/* Ambient */}
      <div
        className="orb w-72 h-72 opacity-8 -top-20 -right-20"
        style={{ background: "#00D4AA" }}
      />

      {/* Header */}
      <div className="mobile-header px-5 py-4">
        <div>
          <div className="text-[#00D4AA] text-xs font-bold uppercase tracking-wider mb-1">
            برنامج الوقاية
          </div>
          <h1 className="text-white font-black text-xl">خطتي الوقائية</h1>
          <p className="text-white/40 text-xs mt-0.5">
            ٤ مراحل لبناء حصانة قوية ضد الإدمان
          </p>
        </div>
      </div>

      <div className="page-content overflow-y-auto">
        {/* Progress Overview */}
        <div className="px-4 mt-3">
          <div
            className="p-4 rounded-2xl border border-[#00D4AA]/20"
            style={{
              background:
                "linear-gradient(135deg, rgba(0,212,170,0.12), rgba(14,165,233,0.06))",
            }}
          >
            <div className="flex items-center justify-between mb-3">
              <div>
                <div className="text-white font-black text-lg">
                  المرحلة {toAr(activePhaseIdx)} من{" "}
                  {toAr(preventionPhases.length)}
                </div>
                <div className="text-white/50 text-xs">
                  {activePhase?.title || "مكتمل!"}
                </div>
              </div>
              <div className="w-14 h-14 rounded-2xl bg-[#00D4AA]/15 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-[#00D4AA] font-black text-lg">
                    {toAr(overallPct)}٪
                  </div>
                  <div className="text-white/40 text-[9px]">مكتمل</div>
                </div>
              </div>
            </div>
            <div className="w-full h-2 bg-white/8 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#00D4AA] to-[#0EA5E9] transition-all duration-500"
                style={{ width: `${overallPct}%` }}
              />
            </div>
          </div>
        </div>

        {/* Prevention Phases */}
        <div className="px-4 mt-5 space-y-3">
          <h2 className="text-white font-black text-sm">
            مراحل الخطة الوقائية
          </h2>

          {preventionPhases.map((phase, idx) => {
            const status = getPhaseStatus(phase.id, completed, preventionPhases);
            const phaseCompleted = completed[phase.id] || [];
            const phaseDoneCount = phaseCompleted.filter(Boolean).length;
            const phaseTotal = phase.goals.length;

            return (
              <motion.div
                key={phase.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.08 }}
                className={cn(
                  "rounded-2xl border overflow-hidden",
                  status === "active"
                    ? "border-[#F59E0B]/30"
                    : status === "completed"
                      ? "border-[#00D4AA]/20"
                      : "border-white/8"
                )}
                style={{
                  background:
                    status === "active"
                      ? "linear-gradient(135deg, rgba(245,158,11,0.08), rgba(239,68,68,0.04))"
                      : status === "completed"
                        ? "linear-gradient(135deg, rgba(0,212,170,0.06), rgba(14,165,233,0.03))"
                        : "rgba(255,255,255,0.02)",
                }}
              >
                {/* Phase Header */}
                <button
                  className="w-full p-4 flex items-center gap-3 text-right"
                  onClick={() =>
                    setExpandedPhase(
                      expandedPhase === phase.id ? null : phase.id
                    )
                  }
                >
                  <div
                    className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0",
                      status === "locked"
                        ? "bg-white/5"
                        : `bg-gradient-to-br ${phase.color}`
                    )}
                  >
                    {status === "locked" ? (
                      <Lock className="w-4 h-4 text-white/30" />
                    ) : (
                      <phase.icon className="w-5 h-5 text-white" />
                    )}
                  </div>
                  <div className="flex-1 text-right">
                    <div className="flex items-center gap-2">
                      <span
                        className={cn(
                          "text-sm font-black",
                          status === "locked" ? "text-white/30" : "text-white"
                        )}
                      >
                        {phase.title}
                      </span>
                      {status === "completed" && (
                        <CheckCircle2 className="w-4 h-4 text-[#00D4AA]" />
                      )}
                      {status === "active" && (
                        <span className="px-2 py-0.5 rounded-full bg-[#F59E0B]/20 text-[#F59E0B] text-[10px] font-bold">
                          جارية
                        </span>
                      )}
                    </div>
                    <div className="text-white/40 text-xs">
                      {phase.subtitle}
                    </div>
                  </div>
                  {status !== "locked" &&
                    (expandedPhase === phase.id ? (
                      <ChevronUp className="w-4 h-4 text-white/40 flex-shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-white/40 flex-shrink-0" />
                    ))}
                </button>

                {/* Phase Content */}
                {expandedPhase === phase.id && status !== "locked" && (
                  <div className="px-4 pb-4">
                    <p className="text-white/50 text-xs leading-relaxed mb-3">
                      {phase.description}
                    </p>

                    {phaseTotal > 0 && (
                      <div className="mb-3">
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-white/40">التقدم</span>
                          <span className="text-[#F59E0B] font-bold">
                            {toAr(phaseDoneCount)}/{toAr(phaseTotal)} أهداف
                          </span>
                        </div>
                        <div className="w-full h-1.5 bg-white/8 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-[#F59E0B] to-[#EF4444] transition-all duration-500"
                            style={{
                              width: `${(phaseDoneCount / phaseTotal) * 100}%`,
                            }}
                          />
                        </div>
                      </div>
                    )}

                    <div className="space-y-2">
                      {phase.goals.map((goal, gi) => {
                        const isDone = !!phaseCompleted[gi];
                        return (
                          <div key={gi} className="flex items-center gap-2.5">
                            <button
                              className="flex-shrink-0"
                              onClick={() => handleGoalToggle(phase.id, gi)}
                            >
                              {isDone ? (
                                <CheckCircle2 className="w-4 h-4 text-[#00D4AA]" />
                              ) : (
                                <Circle className="w-4 h-4 text-white/20" />
                              )}
                            </button>
                            <Link
                              href={goal.link}
                              className={cn(
                                "flex-1 flex items-center gap-1.5 text-xs text-right",
                                isDone
                                  ? "text-white/35 line-through"
                                  : "text-white/70 hover:text-[#00D4AA] transition-colors"
                              )}
                            >
                              <span>{goal.text}</span>
                              <ExternalLink className="w-3 h-3 flex-shrink-0 opacity-40" />
                            </Link>
                          </div>
                        );
                      })}
                    </div>

                    <div className="mt-3 flex items-center gap-2 p-2.5 rounded-xl bg-white/4">
                      <Award className="w-4 h-4 text-[#F59E0B]" />
                      <span className="text-white/60 text-xs">
                        المكافأة:{" "}
                        <span className="text-[#F59E0B] font-bold">
                          {phase.reward}
                        </span>
                      </span>
                    </div>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Weekly Prevention Tips */}
        <div className="px-4 mt-5 mb-4">
          <h2 className="text-white font-black text-sm mb-3">
            نصائح الوقاية الأسبوعية
          </h2>
          <div className="space-y-2">
            {weeklyTips.map((tip, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3 p-3 rounded-xl glass-card border border-white/6"
              >
                <span className="text-xl flex-shrink-0">{tip.icon}</span>
                <p className="text-white/65 text-xs leading-relaxed">
                  {tip.tip}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
