/**
 * Exercises - تمارين الوقاية
 * Design: Dark Luxury Wellness - الله يعافيك
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

const exercises = [
  {
    id: "refusal-skill",
    icon: Shield,
    title: "مهارة الرفض الحازم",
    subtitle: "وقاية اجتماعية",
    duration: "١٠ دقائق",
    difficulty: "سهل",
    color: "from-[#00D4AA] to-[#0EA5E9]",
    description: "تعلم كيف ترفض الضغط الاجتماعي بثقة وحزم دون إحراج",
    steps: [
      "قل 'لا شكراً' بصوت واضح وثابت",
      "أضف سبباً بسيطاً: 'لا يناسبني هذا'",
      "غيّر الموضوع أو اقترح بديلاً",
      "إذا استمر الضغط: ابتعد فوراً",
    ],
    category: "مهارات",
    popular: true,
  },
  {
    id: "breathing-478",
    icon: Wind,
    title: "تقنية ٤-٧-٨",
    subtitle: "تنفس وقائي",
    duration: "٥ دقائق",
    difficulty: "سهل",
    color: "from-[#8B5CF6] to-[#EC4899]",
    description: "عند الشعور بالضغط أو الإغراء، هذا التنفس يهدئ الجهاز العصبي فوراً",
    steps: [
      "استنشق ببطء لمدة ٤ ثوانٍ",
      "احبس النفس ٧ ثوانٍ",
      "أخرج الهواء ببطء ٨ ثوانٍ",
      "كرر ٤ مرات",
    ],
    category: "تنفس",
    popular: true,
  },
  {
    id: "awareness-quiz",
    icon: Brain,
    title: "تمرين الوعي الذاتي",
    subtitle: "معرفة عوامل الخطر",
    duration: "٧ دقائق",
    difficulty: "متوسط",
    color: "from-[#F59E0B] to-[#EF4444]",
    description: "تحديد عوامل الخطر الشخصية والمواقف التي تجعلك عرضة للإدمان",
    steps: [
      "اكتب ٣ مواقف تشعر فيها بالضعف",
      "حدد من يؤثر عليك سلباً",
      "ضع خطة هروب لكل موقف",
      "راجع الخطة أسبوعياً",
    ],
    category: "وعي",
    popular: false,
  },
  {
    id: "positive-affirmations",
    icon: Heart,
    title: "التأكيدات الإيجابية",
    subtitle: "تعزيز الإرادة",
    duration: "٥ دقائق",
    difficulty: "سهل",
    color: "from-[#10B981] to-[#3B82F6]",
    description: "تكرار جمل إيجابية يومياً يبني قوة الإرادة ويعزز مقاومة الإغراءات",
    steps: [
      "قف أمام المرآة صباحاً",
      "ردد: 'أنا قوي وأحمي نفسي'",
      "ردد: 'أختار مستقبلاً مشرقاً'",
      "ردد: 'الله يعافيني ويحفظني'",
    ],
    category: "نفسي",
    popular: false,
  },
  {
    id: "social-mapping",
    icon: Users,
    title: "خريطة العلاقات",
    subtitle: "تحديد البيئة",
    duration: "١٥ دقيقة",
    difficulty: "متوسط",
    color: "from-[#EC4899] to-[#8B5CF6]",
    description: "رسم خريطة علاقاتك الاجتماعية لتحديد من يدعمك ومن يشكّل خطراً",
    steps: [
      "اكتب أسماء أصدقائك المقربين",
      "صنّف كل شخص: داعم / محايد / خطر",
      "قلّل التواصل مع فئة الخطر",
      "عزّز العلاقات مع الداعمين",
    ],
    category: "اجتماعي",
    popular: false,
  },
  {
    id: "islamic-protection",
    icon: BookOpen,
    title: "التحصين الإسلامي",
    subtitle: "حصن روحي يومي",
    duration: "١٠ دقائق",
    difficulty: "سهل",
    color: "from-[#F59E0B] to-[#10B981]",
    description: "الأذكار والأدعية الإسلامية تُشكّل درعاً روحياً قوياً ضد الانجراف",
    steps: [
      "أذكار الصباح كاملة",
      "قراءة آية الكرسي",
      "المعوذتين والإخلاص ٣ مرات",
      "أذكار المساء",
    ],
    category: "ديني",
    popular: true,
  },
];

type ExerciseType = typeof exercises[0];

export default function Exercises() {
  const [selectedExercise, setSelectedExercise] = useState<ExerciseType | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300);
  const [completed, setCompleted] = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState("الكل");

  const categories = ["الكل", "مهارات", "تنفس", "وعي", "نفسي", "اجتماعي", "ديني"];

  const filteredExercises = activeCategory === "الكل"
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

  const formatTime = (s: number) => `${Math.floor(s / 60).toString().padStart(2, "0")}:${(s % 60).toString().padStart(2, "0")}`;

  const startExercise = (exercise: ExerciseType) => {
    setSelectedExercise(exercise);
    setTimeLeft(300);
    setIsRunning(false);
  };

  return (
    <div className="app-container bg-gradient-navy">
      <div className="orb w-64 h-64 opacity-8 top-20 -right-20" style={{ background: "#00D4AA" }} />

      {/* Header */}
      <div className="mobile-header px-5 py-4">
        <div>
          <div className="text-[#00D4AA] text-xs font-bold uppercase tracking-wider mb-1">تمارين الوقاية</div>
          <h1 className="text-white font-black text-xl">بناء الحصانة</h1>
          <p className="text-white/40 text-xs mt-0.5">تمارين يومية لتقوية مقاومتك</p>
        </div>
      </div>

      <div className="page-content overflow-y-auto">

        {/* Stats */}
        <div className="px-4 mt-3 grid grid-cols-3 gap-3">
          <div className="p-3 rounded-2xl glass-card border border-white/8 text-center">
            <div className="text-[#00D4AA] font-black text-xl">{completed.length}</div>
            <div className="text-white/40 text-[10px]">مكتمل</div>
          </div>
          <div className="p-3 rounded-2xl glass-card border border-white/8 text-center">
            <div className="text-[#F59E0B] font-black text-xl">{exercises.length}</div>
            <div className="text-white/40 text-[10px]">تمرين</div>
          </div>
          <div className="p-3 rounded-2xl glass-card border border-white/8 text-center">
            <div className="text-[#8B5CF6] font-black text-xl">٧</div>
            <div className="text-white/40 text-[10px]">أيام متواصلة</div>
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
                    ? "bg-[#00D4AA] text-[#060B18]"
                    : "glass-card border border-white/10 text-white/50"
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
              className="mx-4 mt-4 p-4 rounded-2xl border border-[#00D4AA]/25"
              style={{ background: "linear-gradient(135deg, rgba(0,212,170,0.12), rgba(14,165,233,0.06))" }}
            >
              <div className="flex items-center justify-between mb-3">
                <div>
                  <div className="text-white font-black text-sm">{selectedExercise.title}</div>
                  <div className="text-white/40 text-xs">{selectedExercise.subtitle}</div>
                </div>
                <div className="text-[#00D4AA] font-black text-2xl font-numbers">{formatTime(timeLeft)}</div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setIsRunning(!isRunning)}
                  className="flex-1 py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 text-[#060B18]"
                  style={{ background: "linear-gradient(135deg, #00D4AA, #0EA5E9)" }}
                >
                  {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  {isRunning ? "إيقاف مؤقت" : "ابدأ"}
                </button>
                <button
                  onClick={() => { setTimeLeft(300); setIsRunning(false); }}
                  className="p-2.5 rounded-xl glass-card border border-white/10 text-white/50"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>

              <div className="mt-3 space-y-1.5">
                {selectedExercise.steps.map((step, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-[#00D4AA]/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-[#00D4AA] text-[10px] font-black">{i + 1}</span>
                    </div>
                    <span className="text-white/65 text-xs">{step}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Exercises List */}
        <div className="px-4 mt-4 space-y-3 mb-4">
          {filteredExercises.map((exercise, idx) => (
            <motion.div
              key={exercise.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.06 }}
              className={cn(
                "p-4 rounded-2xl border transition-all",
                completed.includes(exercise.id)
                  ? "border-[#00D4AA]/25 bg-[#00D4AA]/5"
                  : "border-white/8 glass-card"
              )}
            >
              <div className="flex items-start gap-3">
                <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 bg-gradient-to-br", exercise.color)}>
                  <exercise.icon className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-white font-black text-sm">{exercise.title}</span>
                    {exercise.popular && (
                      <span className="px-1.5 py-0.5 rounded-full bg-[#F59E0B]/20 text-[#F59E0B] text-[9px] font-bold">شائع</span>
                    )}
                    {completed.includes(exercise.id) && (
                      <CheckCircle2 className="w-4 h-4 text-[#00D4AA]" />
                    )}
                  </div>
                  <div className="text-white/45 text-xs mb-2">{exercise.description}</div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1 text-white/30 text-xs">
                      <Clock className="w-3 h-3" />
                      {exercise.duration}
                    </div>
                    <div className="flex items-center gap-1 text-white/30 text-xs">
                      <Zap className="w-3 h-3" />
                      {exercise.difficulty}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => startExercise(exercise)}
                  className="p-2 rounded-xl bg-[#00D4AA]/15 flex-shrink-0"
                >
                  <Play className="w-4 h-4 text-[#00D4AA]" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </div>
  );
}
