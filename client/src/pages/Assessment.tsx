/**
 * Assessment - صفحة التقييم الوقائي الشخصي
 * Design: Dark Luxury Wellness - "الله يعافيك"
 * Features: اختبار علمي متعدد الأبعاد، نتيجة تفصيلية، خطة عمل مخصصة
 */
import { useState } from "react";
import { useLocation } from "wouter";
import {
  Brain,
  ChevronLeft,
  ChevronRight,
  Shield,
  AlertTriangle,
  CheckCircle2,
  Heart,
  Zap,
  Target,
  Phone,
  BookOpen,
  Users,
  Star,
  BarChart3,
  ArrowRight,
  RefreshCw,
  Sparkles,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const CONTACT_PHONE = "0546192019";

const assessmentSections = [
  {
    id: "intro",
    title: "اختبار التقييم الوقائي",
    subtitle: "اكتشف مستوى وعيك الوقائي وخطتك الشخصية",
    desc: "هذا الاختبار العلمي يساعدك على تحديد عوامل الخطر في حياتك ووضع خطة وقائية مخصصة قبل الوقوع في الإدمان. جميع إجاباتك سرية تماماً.",
    icon: Brain,
    color: "#8B5CF6",
  },
];

const questions = [
  {
    id: 1,
    section: "الاستخدام والتحكم",
    question:
      "هل تجد صعوبة في التوقف عن استخدام مادة أو سلوك معين حتى عندما تريد ذلك؟",
    options: [
      "لا، أستطيع التوقف بسهولة",
      "أحياناً أجد بعض الصعوبة",
      "في أغلب الأحيان أجد صعوبة",
      "لا أستطيع التوقف أبداً",
    ],
    weights: [0, 1, 2, 3],
    icon: Target,
    color: "#EF4444",
  },
  {
    id: 2,
    section: "الاستخدام والتحكم",
    question:
      "هل تحتاج إلى كميات أكبر من المادة أو وقت أطول في السلوك لتحقيق نفس الشعور؟",
    options: [
      "لا، الكمية نفسها كافية",
      "نعم، أحتاج أكثر قليلاً",
      "نعم، أحتاج أكثر بكثير",
      "الكميات الكبيرة لم تعد تكفي",
    ],
    weights: [0, 1, 2, 3],
    icon: Zap,
    color: "#F59E0B",
  },
  {
    id: 3,
    section: "التأثير على الحياة",
    question: "هل أثّر هذا الاستخدام سلباً على علاقاتك الاجتماعية أو العائلية؟",
    options: [
      "لا، علاقاتي بخير",
      "بعض التوترات البسيطة",
      "مشاكل واضحة في العلاقات",
      "علاقاتي تدهورت بشكل كبير",
    ],
    weights: [0, 1, 2, 3],
    icon: Heart,
    color: "#EC4899",
  },
  {
    id: 4,
    section: "التأثير على الحياة",
    question: "هل تجد نفسك تفكر في المادة أو السلوك بشكل متكرر خلال اليوم؟",
    options: ["نادراً أو أبداً", "أحياناً", "كثيراً", "معظم الوقت"],
    weights: [0, 1, 2, 3],
    icon: Brain,
    color: "#8B5CF6",
  },
  {
    id: 5,
    section: "أعراض الانسحاب",
    question:
      "عند محاولة التوقف، هل تشعر بأعراض جسدية أو نفسية (قلق، توتر، صداع، تعرق)؟",
    options: [
      "لا، لا أشعر بشيء",
      "أعراض خفيفة تزول سريعاً",
      "أعراض مزعجة تستمر أياماً",
      "أعراض شديدة تمنعني من التوقف",
    ],
    weights: [0, 1, 2, 3],
    icon: AlertTriangle,
    color: "#EF4444",
  },
  {
    id: 6,
    section: "أعراض الانسحاب",
    question:
      "هل تستخدم المادة أو السلوك لتخفيف مشاعر سلبية مثل القلق أو الاكتئاب أو الوحدة؟",
    options: [
      "لا، لأسباب أخرى",
      "أحياناً للاسترخاء",
      "في أغلب الأحيان",
      "دائماً لتخفيف المشاعر السلبية",
    ],
    weights: [0, 1, 2, 3],
    icon: Shield,
    color: "#3B82F6",
  },
  {
    id: 7,
    section: "الوعي والإنكار",
    question: "هل اعترض عليك أحد أفراد عائلتك أو أصدقائك بسبب هذا الاستخدام؟",
    options: ["لا أحد", "شخص أو اثنان", "عدة أشخاص", "كثيرون وبشكل متكرر"],
    weights: [0, 1, 2, 3],
    icon: Users,
    color: "#10B981",
  },
  {
    id: 8,
    section: "الوعي والإنكار",
    question: "هل حاولت التوقف أو التقليل من الاستخدام في الماضي دون نجاح؟",
    options: [
      "لم أحاول لأنه لا مشكلة",
      "حاولت مرة وأوقفت",
      "حاولت عدة مرات دون نجاح",
      "حاولت كثيراً وفشلت دائماً",
    ],
    weights: [0, 1, 2, 3],
    icon: RefreshCw,
    color: "#F59E0B",
  },
];

const getRiskLevel = (score: number) => {
  const maxScore = questions.length * 3;
  const percentage = (score / maxScore) * 100;
  if (percentage <= 20)
    return {
      level: "منخفض جداً",
      color: "#10B981",
      bg: "#10B98115",
      desc: "لا توجد مؤشرات مقلقة. استمر في الوقاية والتوعية.",
      icon: CheckCircle2,
      action: "الوقاية والتثقيف",
    };
  if (percentage <= 40)
    return {
      level: "منخفض",
      color: "#00D4AA",
      bg: "#00D4AA15",
      desc: "بعض المؤشرات الخفيفة. الوعي والمتابعة كافيان.",
      icon: Shield,
      action: "المتابعة والوعي",
    };
  if (percentage <= 60)
    return {
      level: "متوسط",
      color: "#F59E0B",
      bg: "#F59E0B15",
      desc: "مؤشرات واضحة تستوجب الانتباه والتدخل المبكر.",
      icon: AlertTriangle,
      action: "التدخل المبكر",
    };
  if (percentage <= 80)
    return {
      level: "مرتفع",
      color: "#EF4444",
      bg: "#EF444415",
      desc: "مؤشرات خطيرة. يُنصح بالتواصل مع متخصص.",
      icon: AlertTriangle,
      action: "استشارة متخصص",
    };
  return {
    level: "مرتفع جداً",
    color: "#DC2626",
    bg: "#DC262615",
    desc: "حالة تستوجب تدخلاً فورياً. تواصل مع متخصص الآن.",
    icon: AlertTriangle,
    action: "تدخل فوري",
  };
};

const getPersonalizedPlan = (score: number, answers: number[]) => {
  const risk = getRiskLevel(score);
  const plans = [];

  if (risk.level === "منخفض جداً" || risk.level === "منخفض") {
    plans.push({
      icon: BookOpen,
      title: "التثقيف الوقائي",
      desc: "اقرأ محاضرات التوعية لتعزيز وعيك",
      color: "#00D4AA",
      action: "/lectures",
    });
    plans.push({
      icon: Heart,
      title: "تمارين الاسترخاء",
      desc: "مارس تمارين التنفس والتأمل يومياً",
      color: "#EC4899",
      action: "/exercises",
    });
    plans.push({
      icon: Users,
      title: "شبكة الدعم",
      desc: "انضم لمجموعة دعم للوقاية المبكرة",
      color: "#3B82F6",
      action: "/community",
    });
  } else if (risk.level === "متوسط") {
    plans.push({
      icon: Brain,
      title: "تقييم دوري",
      desc: "أعد الاختبار كل أسبوع لمتابعة تقدمك",
      color: "#8B5CF6",
      action: "/assessment",
    });
    plans.push({
      icon: BookOpen,
      title: "محاضرات مكثفة",
      desc: "ابدأ بمحاضرة علم الأعصاب والإدمان",
      color: "#00D4AA",
      action: "/lectures/addiction-brain-science",
    });
    plans.push({
      icon: Phone,
      title: "استشارة مجانية",
      desc: "تواصل مع مختص للحصول على توجيه",
      color: "#F59E0B",
      action: `tel:${CONTACT_PHONE}`,
    });
  } else {
    plans.push({
      icon: Phone,
      title: "تواصل فوري",
      desc: "اتصل بنا الآن للحصول على مساعدة متخصصة",
      color: "#EF4444",
      action: `tel:${CONTACT_PHONE}`,
    });
    plans.push({
      icon: Shield,
      title: "خطة تعافي",
      desc: "ابدأ خطة تعافي مخصصة بإشراف متخصص",
      color: "#8B5CF6",
      action: "/recovery",
    });
    plans.push({
      icon: Heart,
      title: "دعم نفسي",
      desc: "تمارين طارئة للتعامل مع الرغبة الشديدة",
      color: "#EC4899",
      action: "/exercises",
    });
  }

  return plans;
};

export default function Assessment() {
  const [, navigate] = useLocation();
  const [phase, setPhase] = useState<"intro" | "questions" | "result">("intro");
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);

  const totalScore = answers.reduce((sum, a) => sum + a, 0);
  const risk = getRiskLevel(totalScore);
  const plan = getPersonalizedPlan(totalScore, answers);
  const maxScore = questions.length * 3;
  const percentage = Math.round((totalScore / maxScore) * 100);

  const handleAnswer = (weight: number) => {
    setSelectedAnswer(weight);
  };

  const handleNext = () => {
    if (selectedAnswer === null) return;
    const newAnswers = [...answers, selectedAnswer];
    setAnswers(newAnswers);
    setSelectedAnswer(null);

    if (currentQ < questions.length - 1) {
      setCurrentQ(currentQ + 1);
    } else {
      setPhase("result");
    }
  };

  const handleReset = () => {
    setPhase("intro");
    setCurrentQ(0);
    setAnswers([]);
    setSelectedAnswer(null);
  };

  const currentQuestion = questions[currentQ];
  const sectionQuestions = questions.filter(
    q => q.section === currentQuestion?.section
  );
  const sectionIndex = sectionQuestions.findIndex(
    q => q.id === currentQuestion?.id
  );

  return (
    <div className="app-container bg-gradient-navy overflow-hidden">
      <div className="orb w-64 h-64 opacity-8 -top-20 -right-20" style={{ background: "oklch(0.55 0.25 290)" }} />

      {/* Header */}
      <div className="mobile-header px-5 py-4">
        <div>
          <div className="text-violet-500 text-xs font-bold uppercase tracking-wider mb-1">
            التقييم الشخصي
          </div>
          <h1 className="text-foreground font-black text-xl">اختبار تقييم الإدمان</h1>
          <p className="text-muted-foreground text-xs mt-0.5">اختبار علمي سري — معايير DSM-5</p>
        </div>
      </div>

      <div className="page-content overflow-y-auto">
        <div className="px-4 pt-3">
          <AnimatePresence mode="wait">
            {/* Intro Phase */}
            {phase === "intro" && (
              <motion.div
                key="intro"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <div className="glass-card p-5 border border-violet-500/25 mb-4 text-center relative overflow-hidden">
                  <div className="orb orb-purple w-60 h-60 -top-10 -right-10 opacity-20" />
                  <div className="relative z-10">
                    <div className="w-14 h-14 rounded-2xl bg-violet-500/20 flex items-center justify-center mx-auto mb-5 glow-purple">
                      <Brain className="w-7 h-7 text-violet-500" />
                    </div>
                    <h2 className="text-lg font-black text-foreground mb-2">
                      اختبار التقييم الشخصي
                    </h2>
                    <p className="text-foreground/55 leading-relaxed mb-6">
                      هذا الاختبار العلمي المبني على معايير{" "}
                      <strong className="text-foreground">DSM-5</strong> الدولية
                      يساعدك على فهم مستوى خطر الإدمان وتحديد الخطة المناسبة لك.
                      يتكون من <strong className="text-foreground">٨ أسئلة</strong>{" "}
                      ويستغرق حوالي{" "}
                      <strong className="text-foreground">٣ دقائق</strong>.
                    </p>

                    <div className="grid grid-cols-3 gap-4 mb-8">
                      {[
                        { icon: Shield, label: "سري تماماً", color: "#10B981" },
                        { icon: Brain, label: "علمي موثوق", color: "#8B5CF6" },
                        { icon: Target, label: "خطة مخصصة", color: "#F59E0B" },
                      ].map((item, i) => (
                        <div
                          key={i}
                          className="p-3 rounded-xl"
                          style={{
                            background: `${item.color}10`,
                            border: `1px solid ${item.color}20`,
                          }}
                        >
                          <item.icon
                            className="w-5 h-5 mx-auto mb-1.5"
                            style={{ color: item.color }}
                          />
                          <div className="text-foreground/70 text-xs">
                            {item.label}
                          </div>
                        </div>
                      ))}
                    </div>

                    <button
                      onClick={() => setPhase("questions")}
                      className="w-full py-4 rounded-2xl font-black text-lg text-primary-foreground transition-all hover:scale-105"
                      style={{
                        background: "linear-gradient(135deg, oklch(0.55 0.24 290), oklch(0.44 0.27 290))",
                      }}
                    >
                      ابدأ الاختبار الآن
                    </button>
                    <p className="text-muted-foreground/60 text-xs mt-3">
                      لا يُستخدم هذا الاختبار كتشخيص طبي - للاستشارة الطبية اتصل
                      بـ {CONTACT_PHONE}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Questions Phase */}
            {phase === "questions" && currentQuestion && (
              <motion.div
                key={`q-${currentQ}`}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.3 }}
              >
                {/* Progress */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-muted-foreground text-sm">
                      السؤال {currentQ + 1} من {questions.length}
                    </span>
                    <span className="text-muted-foreground text-sm">
                      {currentQuestion.section}
                    </span>
                  </div>
                  <div className="h-2 bg-secondary/80 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${((currentQ + 1) / questions.length) * 100}%`,
                        background: `linear-gradient(to right, ${currentQuestion.color}, oklch(0.75 0.18 175))`,
                      }}
                    />
                  </div>
                </div>

                {/* Question Card */}
                <div
                  className="glass-card p-4 border mb-5 relative overflow-hidden"
                  style={{ borderColor: `${currentQuestion.color}25` }}
                >
                  <div
                    className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-5"
                    style={{
                      background: `radial-gradient(circle, ${currentQuestion.color}, transparent)`,
                    }}
                  />
                  <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-5">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center"
                        style={{
                          background: `${currentQuestion.color}20`,
                          border: `1px solid ${currentQuestion.color}30`,
                        }}
                      >
                        <currentQuestion.icon
                          className="w-5 h-5"
                          style={{ color: currentQuestion.color }}
                        />
                      </div>
                      <span className="text-muted-foreground text-sm">
                        {currentQuestion.section}
                      </span>
                    </div>
                    <h3 className="text-foreground font-black text-lg leading-relaxed mb-6">
                      {currentQuestion.question}
                    </h3>

                    <div className="space-y-3">
                      {currentQuestion.options.map((option, i) => (
                        <button
                          key={i}
                          onClick={() =>
                            handleAnswer(currentQuestion.weights[i])
                          }
                          className={`w-full text-right p-4 rounded-xl transition-all border ${
                            selectedAnswer === currentQuestion.weights[i]
                              ? "text-foreground"
                              : "glass-card text-muted-foreground border-border hover:border-border hover:text-foreground/80"
                          }`}
                          style={
                            selectedAnswer === currentQuestion.weights[i]
                              ? {
                                  background: `${currentQuestion.color}15`,
                                  borderColor: `${currentQuestion.color}40`,
                                }
                              : {}
                          }
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className="w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0"
                              style={{
                                borderColor:
                                  selectedAnswer === currentQuestion.weights[i]
                                    ? currentQuestion.color
                                    : "var(--muted-foreground)",
                                background:
                                  selectedAnswer === currentQuestion.weights[i]
                                    ? `${currentQuestion.color}30`
                                    : "transparent",
                              }}
                            >
                              {selectedAnswer ===
                                currentQuestion.weights[i] && (
                                <div
                                  className="w-2.5 h-2.5 rounded-full"
                                  style={{ background: currentQuestion.color }}
                                />
                              )}
                            </div>
                            <span className="text-sm">{option}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Navigation */}
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => {
                      if (currentQ > 0) {
                        setCurrentQ(currentQ - 1);
                        setAnswers(answers.slice(0, -1));
                        setSelectedAnswer(null);
                      }
                    }}
                    disabled={currentQ === 0}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl glass-card border border-border text-muted-foreground hover:text-foreground disabled:opacity-30 transition-all text-sm"
                  >
                    <ChevronRight className="w-4 h-4" />
                    السابق
                  </button>
                  <button
                    onClick={handleNext}
                    disabled={selectedAnswer === null}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm transition-all disabled:opacity-40"
                    style={{
                      background:
                        selectedAnswer !== null
                          ? `linear-gradient(135deg, ${currentQuestion.color}, oklch(0.75 0.18 175))`
                          : "var(--secondary)",
                      color:
                        selectedAnswer !== null
                          ? "var(--background)"
                          : "var(--muted-foreground)",
                    }}
                  >
                    {currentQ === questions.length - 1
                      ? "عرض النتيجة"
                      : "التالي"}
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* Result Phase */}
            {phase === "result" && (
              <motion.div
                key="result"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                {/* Risk Level Card */}
                <div
                  className="glass-card p-4 border mb-6 text-center relative overflow-hidden"
                  style={{ borderColor: `${risk.color}30` }}
                >
                  <div
                    className="absolute inset-0 opacity-5"
                    style={{
                      background: `radial-gradient(ellipse at center, ${risk.color}, transparent)`,
                    }}
                  />
                  <div className="relative z-10">
                    <div
                      className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
                      style={{
                        background: risk.bg,
                        border: `1px solid ${risk.color}30`,
                      }}
                    >
                      <risk.icon
                        className="w-8 h-8"
                        style={{ color: risk.color }}
                      />
                    </div>
                    <div className="text-muted-foreground text-sm mb-1">
                      مستوى الخطر
                    </div>
                    <h2
                      className="text-3xl font-black mb-2"
                      style={{ color: risk.color }}
                    >
                      {risk.level}
                    </h2>
                    <p className="text-muted-foreground text-sm mb-5">{risk.desc}</p>

                    {/* Score Meter */}
                    <div className="max-w-xs mx-auto mb-4">
                      <div className="flex justify-between text-xs text-muted-foreground/70 mb-2">
                        <span>منخفض</span>
                        <span className="font-numbers">{percentage}%</span>
                        <span>مرتفع</span>
                      </div>
                      <div className="h-3 bg-secondary/80 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${percentage}%` }}
                          transition={{ duration: 1, ease: "easeOut" }}
                          className="h-full rounded-full"
                          style={{
                            background: `linear-gradient(to right, oklch(0.70 0.17 160), oklch(0.80 0.16 85), ${risk.color})`,
                          }}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-4 gap-3 mt-5">
                      {questions.map((q, i) => (
                        <div key={i} className="text-center">
                          <div
                            className="w-full h-2 rounded-full mb-1"
                            style={{
                              background:
                                answers[i] === 0
                                  ? "#10B98140"
                                  : answers[i] === 1
                                    ? "#F59E0B40"
                                    : answers[i] === 2
                                      ? "#EF444440"
                                      : "#DC262640",
                            }}
                          />
                          <div className="text-muted-foreground/60 text-xs font-numbers">
                            {i + 1}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Personalized Plan */}
                <div className="mb-6">
                  <h3 className="text-foreground font-black text-lg mb-4 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-primary" />
                    خطتك الشخصية المقترحة
                  </h3>
                  <div className="space-y-3">
                    {plan.map((item, i) => (
                      <motion.button
                        key={i}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.15 }}
                        onClick={() =>
                          item.action.startsWith("tel:")
                            ? window.open(item.action)
                            : navigate(item.action)
                        }
                        className="w-full flex items-center gap-4 p-4 rounded-xl glass-card border border-border hover:border-border transition-all group text-right"
                      >
                        <div
                          className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
                          style={{
                            background: `${item.color}15`,
                            border: `1px solid ${item.color}25`,
                          }}
                        >
                          <item.icon
                            className="w-6 h-6"
                            style={{ color: item.color }}
                          />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-foreground font-bold text-sm">
                            {item.title}
                          </h4>
                          <p className="text-muted-foreground text-xs">{item.desc}</p>
                        </div>
                        <ArrowRight className="w-4 h-4 text-muted-foreground/60 group-hover:text-muted-foreground transition-colors rotate-180" />
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Emergency Contact */}
                {(risk.level === "مرتفع" || risk.level === "مرتفع جداً") && (
                  <div className="glass-card p-5 border border-destructive/30 mb-6">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-xl bg-destructive/20 flex items-center justify-center">
                        <Phone className="w-5 h-5 text-destructive" />
                      </div>
                      <div>
                        <h4 className="text-foreground font-bold text-sm">
                          تواصل معنا الآن
                        </h4>
                        <p className="text-muted-foreground text-xs">
                          متخصصون متاحون للمساعدة
                        </p>
                      </div>
                    </div>
                    <a
                      href={`tel:${CONTACT_PHONE}`}
                      className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-black text-primary-foreground transition-all hover:scale-105"
                      style={{
                        background: "linear-gradient(135deg, oklch(0.63 0.24 29), oklch(0.56 0.24 27))",
                      }}
                    >
                      <Phone className="w-4 h-4" />
                      {CONTACT_PHONE}
                    </a>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-3">
                  <button
                    onClick={handleReset}
                    className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl glass-card border border-border text-muted-foreground hover:text-foreground font-bold text-sm transition-all"
                  >
                    <RefreshCw className="w-4 h-4" />
                    إعادة الاختبار
                  </button>
                  <button
                    onClick={() => navigate("/dashboard")}
                    className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-all"
                    style={{
                      background: "linear-gradient(135deg, oklch(0.75 0.18 175), oklch(0.68 0.16 230))",
                      color: "var(--background)",
                    }}
                  >
                    <BarChart3 className="w-4 h-4" />
                    لوحة التحكم
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
