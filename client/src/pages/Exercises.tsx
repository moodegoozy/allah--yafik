/**
 * Exercises - تمارين الوقاية
 * Design: Dark Luxury Wellness - صون
 * الهدف: تمارين بناء الحصانة ومهارات الرفض الوقائية
 */
import { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  Shield,
  Brain,
  Heart,
  Play,
  Pause,
  RotateCcw,
  Clock,
  Star,
  CheckCircle2,
  ChevronRight,
  Zap,
  Users,
  BookOpen,
  Wind,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface Exercise {
  id: string;
  icon: typeof Shield;
  title: string;
  subtitle: string;
  duration: string;
  difficulty: string;
  color: string;
  description: string;
  steps: string[];
  category: string;
  popular: boolean;
}

const exercises: Exercise[] = [
  {
    id: "deep-breathing",
    icon: Wind,
    title: "تمرين التنفس العميق",
    subtitle: "تقنية 4-7-8 لتهدئة الجهاز العصبي",
    duration: "5 دقائق",
    difficulty: "سهل",
    color: "#00D4AA",
    description:
      "تمرين تنفس مبني على تقنية 4-7-8 العلمية. يساعد على تنشيط الجهاز العصبي اللاإرادي وتخفيف التوتر والرغبة الشديدة خلال دقائق.",
    steps: [
      "اجلس في وضع مريح وأغلق عينيك",
      "استنشق ببطء من الأنف لمدة 4 ثوانٍ",
      "احبس نفَسك لمدة 7 ثوانٍ",
      "أخرج الهواء ببطء من الفم لمدة 8 ثوانٍ",
      "كرر الدورة 4 مرات متتالية",
      "لاحظ الهدوء الذي يملأ جسدك تدريجياً",
    ],
    category: "تنفس",
    popular: true,
  },
  {
    id: "refusal-skills",
    icon: Shield,
    title: "مهارة الرفض الحازم",
    subtitle: "بناء حصانة ضد الضغط الاجتماعي",
    duration: "10 دقائق",
    difficulty: "متوسط",
    color: "#8B5CF6",
    description:
      "تدريب على أساليب الرفض الحازم والواثق. تعلّم كيف تقول 'لا' بوضوح دون الشعور بالذنب عند التعرض لضغط الأقران أو المواقف المحفزة.",
    steps: [
      "تخيّل موقفاً يُعرض عليك فيه شيء تريد تجنبه",
      "تدرّب على قول 'لا شكراً' بصوت واثق وحازم",
      "استخدم لغة جسد قوية: تواصل بصري ووقفة ثابتة",
      "جهّز ثلاث عبارات رفض بديلة تناسبك",
      "تدرّب على تغيير الموضوع بعد الرفض",
      "كافئ نفسك ذهنياً بعد كل رفض ناجح",
    ],
    category: "مهارات",
    popular: true,
  },
  {
    id: "islamic-protection",
    icon: BookOpen,
    title: "الأذكار والتحصين",
    subtitle: "تحصين يومي بالأذكار الشرعية",
    duration: "7 دقائق",
    difficulty: "سهل",
    color: "#F59E0B",
    description:
      "روتين يومي من الأذكار والأدعية التي تُعين على تقوية الإرادة والثبات. الاستعاذة والتحصين من أقوى أدوات الوقاية الروحية.",
    steps: [
      "ابدأ بالاستعاذة بالله من الشيطان الرجيم",
      "اقرأ آية الكرسي بتدبر وتأمل",
      "ردد أذكار الصباح أو المساء حسب الوقت",
      "ادعُ الله بصدق أن يُعينك على ترك ما يضرك",
      "ردد: 'اللهم إني أعوذ بك من شر نفسي ومن شر كل ذي شر'",
      "اختم بالصلاة على النبي ﷺ عشر مرات",
    ],
    category: "ديني",
    popular: true,
  },
  {
    id: "positive-affirmations",
    icon: Heart,
    title: "التأكيدات الإيجابية",
    subtitle: "إعادة برمجة الحوار الداخلي",
    duration: "5 دقائق",
    difficulty: "سهل",
    color: "#EC4899",
    description:
      "تمرين لاستبدال الأفكار السلبية بتأكيدات إيجابية. يساعد على تغيير نمط التفكير التلقائي وبناء صورة ذاتية صحية تدعم التعافي.",
    steps: [
      "اجلس بهدوء وخذ ثلاثة أنفاس عميقة",
      "ردد بصوت: 'أنا أقوى من أي رغبة مؤقتة'",
      "ردد: 'أستحق حياة صحية ونظيفة'",
      "ردد: 'كل يوم أقترب أكثر من أفضل نسخة مني'",
      "تخيّل نفسك بعد سنة وأنت حر من هذا القيد",
      "اكتب تأكيداً شخصياً خاصاً بك واحتفظ به",
    ],
    category: "نفسي",
    popular: false,
  },
  {
    id: "progressive-relaxation",
    icon: Brain,
    title: "الاسترخاء التدريجي",
    subtitle: "إرخاء العضلات من القدمين للرأس",
    duration: "10 دقائق",
    difficulty: "متوسط",
    color: "#06B6D4",
    description:
      "تمرين الاسترخاء العضلي التدريجي (PMR). تقنية مُثبتة علمياً لتقليل التوتر الجسدي والنفسي الذي يسبق الانتكاسة.",
    steps: [
      "استلقِ في مكان هادئ وأغلق عينيك",
      "اشدّ عضلات قدميك بقوة لمدة 5 ثوانٍ ثم أرخِها",
      "انتقل لعضلات الساقين: شدّ 5 ثوانٍ ثم إرخاء",
      "تابع مع البطن والصدر والذراعين",
      "اشدّ عضلات الكتفين والرقبة ثم أرخِها",
      "لاحظ الفرق بين التوتر والاسترخاء في كل منطقة",
    ],
    category: "وعي",
    popular: false,
  },
  {
    id: "social-connection",
    icon: Users,
    title: "مهارات التواصل",
    subtitle: "بناء شبكة دعم اجتماعي صحية",
    duration: "8 دقائق",
    difficulty: "متوسط",
    color: "#10B981",
    description:
      "تمرين لتعزيز مهارات التواصل وبناء علاقات داعمة. العزلة من أخطر محفزات الانتكاسة، والتواصل الصحي هو درعك الأقوى.",
    steps: [
      "اكتب أسماء 3 أشخاص تثق بهم ويدعمونك",
      "أرسل رسالة تقدير لأحدهم الآن",
      "تدرّب على مشاركة مشاعرك بصدق: 'أشعر بـ...'",
      "خطط لنشاط اجتماعي إيجابي هذا الأسبوع",
      "تعلّم أن تطلب المساعدة عند الحاجة دون خجل",
      "فكّر في الانضمام لمجموعة دعم أو نشاط تطوعي",
    ],
    category: "اجتماعي",
    popular: false,
  },
];

type ExerciseType = Exercise;

export default function Exercises() {
  const [selectedExercise, setSelectedExercise] = useState<ExerciseType | null>(
    null
  );
  const [isRunning, setIsRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300);
  const [completed, setCompleted] = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState("الكل");

  const categories = [
    "الكل",
    "مهارات",
    "تنفس",
    "وعي",
    "نفسي",
    "اجتماعي",
    "ديني",
  ];

  const filteredExercises =
    activeCategory === "الكل"
      ? exercises
      : exercises.filter(e => e.category === activeCategory);

  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
    } else if (timeLeft === 0) {
      setIsRunning(false);
      toast.success("أحسنت! أكملت التمرين الوقائي 🎯");
      if (selectedExercise && !completed.includes(selectedExercise.id)) {
        setCompleted(prev => [...prev, selectedExercise.id]);
      }
    }
    return () => clearInterval(timer);
  }, [isRunning, timeLeft, selectedExercise, completed]);

  const formatTime = (s: number) =>
    `${Math.floor(s / 60)
      .toString()
      .padStart(2, "0")}:${(s % 60).toString().padStart(2, "0")}`;

  const startExercise = (exercise: ExerciseType) => {
    setSelectedExercise(exercise);
    setTimeLeft(300);
    setIsRunning(false);
  };

  return (
    <div className="app-container bg-gradient-navy">
      <div
        className="orb w-64 h-64 opacity-8 top-20 -right-20"
        style={{ background: "oklch(0.75 0.18 175)" }}
      />

      {/* Header */}
      <div className="mobile-header px-5 py-4">
        <div>
          <div className="text-primary text-xs font-bold uppercase tracking-wider mb-1">
            تمارين الوقاية
          </div>
          <h1 className="text-foreground font-black text-xl">بناء الحصانة</h1>
          <p className="text-muted-foreground text-xs mt-0.5">
            تمارين يومية لتقوية مقاومتك
          </p>
        </div>
      </div>

      <div className="page-content overflow-y-auto">
        {/* Stats */}
        <div className="px-4 mt-3 grid grid-cols-3 gap-3">
          <div className="p-3 rounded-2xl glass-card border border-border text-center">
            <div className="text-primary font-black text-xl">
              {completed.length}
            </div>
            <div className="text-muted-foreground text-[10px]">مكتمل</div>
          </div>
          <div className="p-3 rounded-2xl glass-card border border-border text-center">
            <div className="text-accent font-black text-xl">
              {exercises.length}
            </div>
            <div className="text-muted-foreground text-[10px]">تمرين</div>
          </div>
          <div className="p-3 rounded-2xl glass-card border border-border text-center">
            <div className="text-violet-500 font-black text-xl">٧</div>
            <div className="text-muted-foreground text-[10px]">أيام متواصلة</div>
          </div>
        </div>

        {/* Category Filter */}
        <div className="px-4 mt-4">
          <div className="flex gap-2 overflow-x-auto pb-1">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={cn(
                  "flex-shrink-0 px-3 py-1.5 rounded-xl text-xs font-bold transition-all",
                  activeCategory === cat
                    ? "bg-primary text-primary-foreground"
                    : "glass-card border border-border text-muted-foreground"
                )}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Active Exercise Timer */}
        <AnimatePresence>
          {selectedExercise && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mx-4 mt-4 p-4 rounded-2xl border border-primary/25"
              style={{
                background:
                  "linear-gradient(135deg, rgba(0,212,170,0.12), rgba(14,165,233,0.06))",
              }}
            >
              <div className="flex items-center justify-between mb-3">
                <div>
                  <div className="text-foreground font-black text-sm">
                    {selectedExercise.title}
                  </div>
                  <div className="text-muted-foreground text-xs">
                    {selectedExercise.subtitle}
                  </div>
                </div>
                <div className="text-primary font-black text-2xl font-numbers">
                  {formatTime(timeLeft)}
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setIsRunning(!isRunning)}
                  className="flex-1 py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 text-primary-foreground"
                  style={{
                    background: "linear-gradient(135deg, oklch(0.75 0.18 175), oklch(0.68 0.16 230))",
                  }}
                >
                  {isRunning ? (
                    <Pause className="w-4 h-4" />
                  ) : (
                    <Play className="w-4 h-4" />
                  )}
                  {isRunning ? "إيقاف مؤقت" : "ابدأ"}
                </button>
                <button
                  onClick={() => {
                    setTimeLeft(300);
                    setIsRunning(false);
                  }}
                  className="p-2.5 rounded-xl glass-card border border-border text-muted-foreground"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>

              <div className="mt-3 space-y-1.5">
                {selectedExercise.steps.map((step, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-primary text-[10px] font-black">
                        {i + 1}
                      </span>
                    </div>
                    <span className="text-muted-foreground text-xs">{step}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Exercises List */}
        <div className="px-4 mt-4 space-y-3 mb-4">
          {filteredExercises.length === 0 && (
            <div className="text-center py-12">
              <Shield className="w-12 h-12 text-muted-foreground/40 mx-auto mb-3" />
              <p className="text-muted-foreground/70 text-sm">
                سيتم إضافة التمارين قريباً
              </p>
              <p className="text-muted-foreground/60 text-xs mt-1">
                تمارين وقائية لبناء الحصانة
              </p>
            </div>
          )}
          {filteredExercises.map((exercise, idx) => (
            <motion.div
              key={exercise.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.06 }}
              className={cn(
                "p-4 rounded-2xl border transition-all",
                completed.includes(exercise.id)
                  ? "border-primary/25 bg-primary/5"
                  : "border-border glass-card"
              )}
            >
              <div className="flex items-start gap-3">
                <div
                  className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 bg-gradient-to-br",
                    exercise.color
                  )}
                >
                  <exercise.icon className="w-5 h-5 text-foreground" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-foreground font-black text-sm">
                      {exercise.title}
                    </span>
                    {exercise.popular && (
                      <span className="px-1.5 py-0.5 rounded-full bg-accent/20 text-accent text-[9px] font-bold">
                        شائع
                      </span>
                    )}
                    {completed.includes(exercise.id) && (
                      <CheckCircle2 className="w-4 h-4 text-primary" />
                    )}
                  </div>
                  <div className="text-muted-foreground text-xs mb-2">
                    {exercise.description}
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1 text-muted-foreground/70 text-xs">
                      <Clock className="w-3 h-3" />
                      {exercise.duration}
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground/70 text-xs">
                      <Zap className="w-3 h-3" />
                      {exercise.difficulty}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => startExercise(exercise)}
                  className="p-2 rounded-xl bg-primary/15 flex-shrink-0"
                >
                  <Play className="w-4 h-4 text-primary" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
