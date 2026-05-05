/**
 * RehabAssessment - التقييم الوقائي الذكي
 * Design: Mobile-First PWA - "صون"
 * Features: تقييم وقائي علمي، توليد خطة وقائية مخصصة، مستوى الوعي
 */
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";
import {
  ChevronLeft, ChevronRight, CheckCircle2, AlertTriangle,
  Sparkles, Phone, ArrowLeft, RotateCcw, Target, Shield
} from "lucide-react";
import { rehabPhases } from "@/data/rehabData";
import { toast } from "sonner";

const CONTACT_PHONE = "0546192019";

type Question = {
  id: string;
  text: string;
  category: string;
  options: { value: number; label: string; emoji: string }[];
};

const assessmentQuestions: Question[] = [
  {
    id: "q1",
    text: "كيف تصف مستوى وعيك بمخاطر الإدمان؟",
    category: "الوعي الوقائي",
    options: [
      { value: 3, label: "واعٍ جداً وأعرف كيف أحمي نفسي", emoji: "🛡️" },
      { value: 2, label: "لديّ معرفة أساسية بالمخاطر", emoji: "📚" },
      { value: 1, label: "معرفتي محدودة وأحتاج للتعلم", emoji: "🤔" },
      { value: 0, label: "لا أعرف الكثير عن هذا الموضوع", emoji: "❓" },
    ],
  },
  {
    id: "q2",
    text: "هل تستطيع رفض العروض الضارة بثقة وبدون إحراج؟",
    category: "مهارات الرفض",
    options: [
      { value: 3, label: "نعم، أرفض بسهولة وثقة تامة", emoji: "💪" },
      { value: 2, label: "أستطيع الرفض لكن أحياناً أتردد", emoji: "😊" },
      { value: 1, label: "أجد صعوبة في الرفض أحياناً", emoji: "😐" },
      { value: 0, label: "أجد صعوبة كبيرة في الرفض", emoji: "😟" },
    ],
  },
  {
    id: "q3",
    text: "كيف تتعامل مع الضغط والتوتر في حياتك اليومية؟",
    category: "إدارة الضغط",
    options: [
      { value: 3, label: "أتعامل معه بتقنيات صحية فعّالة", emoji: "🧘" },
      { value: 2, label: "أتعامل معه بشكل مقبول في الغالب", emoji: "😌" },
      { value: 1, label: "أجد صعوبة أحياناً في إدارته", emoji: "😤" },
      { value: 0, label: "الضغط يؤثر عليّ كثيراً وأعاني منه", emoji: "😰" },
    ],
  },
  {
    id: "q4",
    text: "كيف تصف بيئتك الاجتماعية المحيطة بك؟",
    category: "البيئة الاجتماعية",
    options: [
      { value: 3, label: "محيطي إيجابي وداعم تماماً", emoji: "🌟" },
      { value: 2, label: "معظم محيطي إيجابي مع بعض السلبيات", emoji: "👍" },
      { value: 1, label: "محيطي مختلط بين الإيجابي والسلبي", emoji: "⚖️" },
      { value: 0, label: "محيطي يحتوي على عوامل خطر واضحة", emoji: "⚠️" },
    ],
  },
  {
    id: "q5",
    text: "هل تمارس عادات صحية يومية (رياضة، نوم منتظم، تغذية سليمة)؟",
    category: "الصحة الجسدية",
    options: [
      { value: 3, label: "نعم، عادات صحية منتظمة يومياً", emoji: "🏃" },
      { value: 2, label: "في الغالب نعم مع بعض الانقطاع", emoji: "✅" },
      { value: 1, label: "أحياناً فقط وغير منتظم", emoji: "🔄" },
      { value: 0, label: "نادراً ما أمارس عادات صحية", emoji: "😔" },
    ],
  },
  {
    id: "q6",
    text: "كيف هو مستوى تحصينك الروحي والديني؟",
    category: "التحصين الروحي",
    options: [
      { value: 3, label: "أذكار يومية منتظمة وصلاة في وقتها", emoji: "🕌" },
      { value: 2, label: "أحرص على الصلاة مع بعض الأذكار", emoji: "🤲" },
      { value: 1, label: "أحياناً أحافظ وأحياناً أتقاعس", emoji: "😐" },
      { value: 0, label: "تحصيني الروحي ضعيف وأحتاج للتحسين", emoji: "💭" },
    ],
  },
  {
    id: "q7",
    text: "هل لديك أهداف واضحة وخطط مستقبلية تحفزك؟",
    category: "الهدف والطموح",
    options: [
      { value: 3, label: "أهداف واضحة ومحفزة جداً", emoji: "🎯" },
      { value: 2, label: "لديّ أهداف لكنها تحتاج تطوير", emoji: "📈" },
      { value: 1, label: "أهدافي غير واضحة في الغالب", emoji: "🌫️" },
      { value: 0, label: "أشعر بالفراغ وغياب الهدف", emoji: "😶" },
    ],
  },
  {
    id: "q8",
    text: "هل تعرف كيف تطلب المساعدة عند الحاجة؟",
    category: "طلب الدعم",
    options: [
      { value: 3, label: "نعم، لديّ شبكة دعم قوية وأثق بها", emoji: "🤝" },
      { value: 2, label: "أستطيع طلب المساعدة لكن بصعوبة", emoji: "💬" },
      { value: 1, label: "أتردد كثيراً في طلب المساعدة", emoji: "🤐" },
      { value: 0, label: "لا أعرف من أطلب المساعدة منه", emoji: "😞" },
    ],
  },
];

type RiskResult = {
  level: "excellent" | "good" | "moderate" | "needs-work";
  title: string;
  color: string;
  icon: string;
  description: string;
  recommendedPhase: string;
  actions: string[];
};

const getRiskResult = (score: number, maxScore: number): RiskResult => {
  const percentage = (score / maxScore) * 100;
  if (percentage >= 75) return {
    level: "excellent",
    title: "وعيك الوقائي ممتاز!",
    color: "#10B981",
    icon: "🏆",
    description: "أنت في وضع وقائي قوي جداً. استمر في تعزيز عاداتك الإيجابية وشارك وعيك مع الآخرين.",
    recommendedPhase: "maintain",
    actions: ["شارك وعيك مع الأصدقاء والأسرة", "انضم لمجموعة التوعية في التطبيق", "ساهم في نشر محاضرات التوعية"],
  };
  if (percentage >= 55) return {
    level: "good",
    title: "وعيك الوقائي جيد",
    color: "#00D4AA",
    icon: "✅",
    description: "لديك أساس وقائي جيد مع بعض المجالات التي تحتاج تعزيزاً. الخطة المقترحة ستساعدك على تطوير مهاراتك.",
    recommendedPhase: "skills",
    actions: ["طور مهارات الرفض الحازم", "عزز شبكة دعمك الاجتماعي", "حضور محاضرة توعوية أسبوعياً"],
  };
  if (percentage >= 35) return {
    level: "moderate",
    title: "تحتاج تعزيز وقايتك",
    color: "#F59E0B",
    icon: "⚠️",
    description: "لديك بعض نقاط الضعف الوقائية التي تحتاج عملاً. ابدأ بخطة الوقاية المخصصة لك الآن.",
    recommendedPhase: "awareness",
    actions: ["ابدأ بمرحلة الوعي الوقائي", "احضر محاضرات التوعية الأساسية", "تواصل مع متخصص للدعم"],
  };
  return {
    level: "needs-work",
    title: "وقايتك تحتاج اهتماماً عاجلاً",
    color: "#EF4444",
    icon: "🆘",
    description: "أنت في منطقة خطر تحتاج تدخلاً وقائياً فورياً. تواصل مع المتخصصين الآن.",
    recommendedPhase: "awareness",
    actions: ["تواصل فوراً مع فريق الدعم", "ابدأ برنامج الوقاية المكثف", "أخبر شخصاً تثق به بوضعك"],
  };
};

export default function RehabAssessment() {
  const [, navigate] = useLocation();
  const [currentQ, setCurrentQ] = useState(-1);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [result, setResult] = useState<RiskResult | null>(null);

  const totalScore = Object.values(answers).reduce((a, b) => a + b, 0);
  const maxScore = assessmentQuestions.length * 3;
  const progress = currentQ >= 0 ? ((currentQ + 1) / assessmentQuestions.length) * 100 : 0;

  const handleAnswer = (questionId: string, value: number) => {
    const updated = { ...answers, [questionId]: value };
    setAnswers(updated);
    if (currentQ < assessmentQuestions.length - 1) {
      setTimeout(() => setCurrentQ(prev => prev + 1), 300);
    } else {
      const finalScore = Object.values(updated).reduce((a, b) => a + b, 0);
      setResult(getRiskResult(finalScore, maxScore));
    }
  };

  const restart = () => {
    setCurrentQ(-1);
    setAnswers({});
    setResult(null);
  };

  const currentQuestion = assessmentQuestions[currentQ];

  return (
    <div className="app-container bg-gradient-navy">
      <div className="orb w-64 h-64 opacity-8 top-0 right-0" style={{ background: "#8B5CF6" }} />

      {/* Header */}
      <div className="mobile-header px-4 py-3">
        <div className="flex items-center gap-3">
          <button onClick={() => window.history.back()} className="p-2 rounded-xl glass-card border border-white/8">
            <ChevronRight className="w-4 h-4 text-white/60" />
          </button>
          <div>
            <div className="text-[#00D4AA] text-xs font-bold uppercase tracking-wider">تقييم وقائي</div>
            <h1 className="text-white font-black text-base">اختبار الوعي الوقائي</h1>
          </div>
        </div>
      </div>

      <div className="page-content overflow-y-auto">
        <AnimatePresence mode="wait">

          {/* Intro */}
          {currentQ === -1 && !result && (
            <motion.div key="intro" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="px-4 py-6">
              <div className="text-center mb-8">
                <div className="text-6xl mb-4">🛡️</div>
                <h2 className="text-white font-black text-2xl mb-3">اختبر وعيك الوقائي</h2>
                <p className="text-white/50 text-sm leading-relaxed">
                  ٨ أسئلة علمية تقيس مستوى حصانتك الوقائية وتولّد خطة مخصصة لتعزيز وقايتك من الإدمان.
                </p>
              </div>

              <div className="space-y-3 mb-8">
                {[
                  { icon: "🧠", text: "يقيس مستوى وعيك ومهاراتك الوقائية" },
                  { icon: "🎯", text: "يولّد خطة وقائية مخصصة لك" },
                  { icon: "🔒", text: "إجاباتك سرية تماماً ومحفوظة محلياً" },
                  { icon: "⏱️", text: "يستغرق ٣ دقائق فقط" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-2xl glass-card border border-white/8">
                    <span className="text-xl">{item.icon}</span>
                    <span className="text-white/70 text-sm">{item.text}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => setCurrentQ(0)}
                className="w-full py-4 rounded-2xl font-black text-[#060B18] text-base transition-all active:scale-95"
                style={{ background: "linear-gradient(135deg, #00D4AA, #0EA5E9)" }}
              >
                ابدأ التقييم الوقائي ←
              </button>
            </motion.div>
          )}

          {/* Question */}
          {currentQ >= 0 && !result && currentQuestion && (
            <motion.div key={`q-${currentQ}`} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="px-4 py-4">

              {/* Progress */}
              <div className="mb-6">
                <div className="flex justify-between text-xs text-white/40 mb-2">
                  <span>السؤال {currentQ + 1} من {assessmentQuestions.length}</span>
                  <span>{Math.round(progress)}٪</span>
                </div>
                <div className="h-2 bg-white/8 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: "linear-gradient(90deg, #00D4AA, #8B5CF6)" }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.4 }}
                  />
                </div>
              </div>

              {/* Category Badge */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#8B5CF6]/15 border border-[#8B5CF6]/25 mb-4">
                <Shield className="w-3 h-3 text-[#8B5CF6]" />
                <span className="text-[#8B5CF6] text-xs font-bold">{currentQuestion.category}</span>
              </div>

              {/* Question Text */}
              <h2 className="text-white font-black text-lg leading-relaxed mb-6">
                {currentQuestion.text}
              </h2>

              {/* Options */}
              <div className="space-y-3">
                {currentQuestion.options.map((option, idx) => (
                  <motion.button
                    key={idx}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => handleAnswer(currentQuestion.id, option.value)}
                    className={`w-full flex items-center gap-3 p-4 rounded-2xl border text-right transition-all ${
                      answers[currentQuestion.id] === option.value
                        ? "border-[#00D4AA]/60 bg-[#00D4AA]/10"
                        : "border-white/8 glass-card"
                    }`}
                  >
                    <span className="text-2xl">{option.emoji}</span>
                    <span className="text-white/80 text-sm font-bold flex-1">{option.label}</span>
                    {answers[currentQuestion.id] === option.value && (
                      <CheckCircle2 className="w-5 h-5 text-[#00D4AA]" />
                    )}
                  </motion.button>
                ))}
              </div>

              {/* Back button */}
              {currentQ > 0 && (
                <button
                  onClick={() => setCurrentQ(prev => prev - 1)}
                  className="w-full mt-4 py-3 rounded-2xl glass-card border border-white/8 text-white/50 text-sm font-bold"
                >
                  ← السؤال السابق
                </button>
              )}
            </motion.div>
          )}

          {/* Result */}
          {result && (
            <motion.div key="result" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="px-4 py-6">

              {/* Score Circle */}
              <div className="text-center mb-6">
                <div className="text-6xl mb-3">{result.icon}</div>
                <h2 className="text-white font-black text-xl mb-2">{result.title}</h2>
                <p className="text-white/50 text-sm leading-relaxed">{result.description}</p>
                <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl" style={{ background: `${result.color}20`, border: `1px solid ${result.color}40` }}>
                  <span className="font-black text-2xl font-numbers" style={{ color: result.color }}>{totalScore}</span>
                  <span className="text-white/40 text-sm">/ {maxScore} نقطة</span>
                </div>
              </div>

              {/* Recommended Plan */}
              {result.recommendedPhase && (() => {
                const phase = rehabPhases.find(p => p.id === result.recommendedPhase);
                return phase ? (
                  <div className="p-4 rounded-2xl glass-card border border-white/8 mb-4">
                    <div className="text-white/40 text-xs mb-2">الخطة الوقائية المقترحة</div>
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{phase.icon}</span>
                      <div>
                        <div className="text-white font-black text-sm">{phase.title}</div>
                        <div className="text-white/50 text-xs">{phase.subtitle}</div>
                      </div>
                    </div>
                  </div>
                ) : null;
              })()}

              {/* Actions */}
              <div className="mb-6">
                <h3 className="text-white font-black text-sm mb-3">الخطوات الموصى بها:</h3>
                <div className="space-y-2">
                  {result.actions.map((action, i) => (
                    <div key={i} className="flex items-start gap-3 p-3 rounded-2xl glass-card border border-white/8">
                      <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: `${result.color}30` }}>
                        <span className="text-[10px] font-black" style={{ color: result.color }}>{i + 1}</span>
                      </div>
                      <span className="text-white/70 text-sm">{action}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Buttons */}
              <div className="space-y-3">
                <button
                  onClick={() => navigate("/rehab-plan")}
                  className="w-full py-4 rounded-2xl font-black text-[#060B18] text-base"
                  style={{ background: "linear-gradient(135deg, #00D4AA, #0EA5E9)" }}
                >
                  ابدأ خطة الوقاية الآن ←
                </button>
                <a
                  href={`tel:${CONTACT_PHONE}`}
                  className="flex items-center justify-center gap-2 w-full py-3 rounded-2xl glass-card border border-white/8 text-white/70 text-sm font-bold"
                >
                  <Phone className="w-4 h-4" />
                  تواصل مع متخصص: {CONTACT_PHONE}
                </a>
                <button
                  onClick={restart}
                  className="flex items-center justify-center gap-2 w-full py-3 rounded-2xl glass-card border border-white/8 text-white/50 text-sm"
                >
                  <RotateCcw className="w-4 h-4" />
                  إعادة التقييم
                </button>
              </div>

            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}
