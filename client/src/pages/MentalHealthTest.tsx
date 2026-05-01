/**
 * MentalHealthTest — اختبار الصحة النفسية والوعي والاستقرار
 * Age-adaptive test: young (1-17), teenage (18-25), adult (26+)
 * Design: Dark Luxury Wellness - "الله يعافيك"
 */
import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import {
  Brain,
  Heart,
  Shield,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  AlertTriangle,
  Phone,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { onAuthStateChanged } from "firebase/auth";
import {
  type AgeGroup,
  type TestResult,
  ageGroupLabels,
  getTestQuestions,
  calculateTestResult,
} from "@/data/mentalHealthTestData";
import { auth, getUserProfile, saveUserProfile } from "@/lib/firebase";

const CONTACT_PHONE = "0546192019";

const dimensionMeta = {
  mentalHealth: { label: "الصحة النفسية", icon: Heart, color: "#EC4899" },
  awareness: { label: "الوعي والمعرفة", icon: Brain, color: "#F59E0B" },
  stillness: { label: "الاستقرار والثبات", icon: Shield, color: "#00D4AA" },
};

export default function MentalHealthTest() {
  const [, navigate] = useLocation();
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [result, setResult] = useState<TestResult | null>(null);
  const [ageGroup, setAgeGroup] = useState<AgeGroup>("adult");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async firebaseUser => {
      if (!firebaseUser) {
        navigate("/login");
        return;
      }

      const profile = await getUserProfile(firebaseUser.uid);
      if (!profile) return;

      if (profile.testCompleted) {
        navigate("/dashboard");
        return;
      }

      if (profile.ageGroup) setAgeGroup(profile.ageGroup as AgeGroup);
    });

    return unsubscribe;
  }, [navigate]);

  const questions = getTestQuestions(ageGroup);
  const groupInfo = ageGroupLabels[ageGroup];
  const question = questions[currentQ];
  const progress = ((currentQ + (result ? 1 : 0)) / questions.length) * 100;

  const handleAnswer = (score: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQ] = score;
    setAnswers(newAnswers);

    if (currentQ < questions.length - 1) {
      setCurrentQ(currentQ + 1);
    } else {
      const testResult = calculateTestResult(newAnswers, questions);
      setResult(testResult);

      const currentUser = auth.currentUser;
      if (!currentUser) return;

      saveUserProfile(currentUser.uid, {
        testCompleted: true,
        testResult,
      }).catch(() => {
        toast.error("تعذر حفظ النتيجة، تحقق من الاتصال بالإنترنت");
      });
    }
  };

  const goToDashboard = () => {
    toast.success("تم حفظ نتيجة التقييم. مرحباً بك في رحلتك!");
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background orbs */}
      <div className="orb orb-teal w-96 h-96 -top-32 -right-32 opacity-20" />
      <div className="orb orb-gold w-72 h-72 -bottom-20 -left-20 opacity-15" />

      <div className="w-full max-w-lg relative z-10">
        {/* Header */}
        <div className="text-center mb-6">
          <div
            className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${groupInfo.gradient} flex items-center justify-center mx-auto mb-3`}
          >
            <Brain className="w-7 h-7 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-black text-foreground mb-1">
            اختبار الصحة النفسية
          </h1>
          <p className="text-sm" style={{ color: groupInfo.color }}>
            {groupInfo.emoji} {groupInfo.label} — {questions.length} أسئلة
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between text-xs text-muted-foreground mb-1.5">
            <span>
              السؤال {Math.min(currentQ + 1, questions.length)} من{" "}
              {questions.length}
            </span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="w-full h-2 rounded-full bg-secondary/60 overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ background: groupInfo.color }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            />
          </div>
        </div>

        <AnimatePresence mode="wait">
          {!result ? (
            <motion.div
              key={`q-${currentQ}`}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.25 }}
            >
              {/* Question Card */}
              <div className="glass-card p-6 border border-border mb-4">
                {/* Dimension badge */}
                <div className="flex items-center gap-2 mb-4">
                  {(() => {
                    const dim = dimensionMeta[question.dimension];
                    const Icon = dim.icon;
                    return (
                      <span
                        className="flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full"
                        style={{
                          background: `${dim.color}15`,
                          color: dim.color,
                        }}
                      >
                        <Icon size={12} />
                        {dim.label}
                      </span>
                    );
                  })()}
                </div>

                <h2 className="text-foreground font-black text-lg leading-relaxed mb-6">
                  {question.text}
                </h2>

                <div className="space-y-2.5">
                  {question.options.map((opt, i) => {
                    const isSelected = answers[currentQ] === opt.score;
                    return (
                      <motion.button
                        key={i}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => handleAnswer(opt.score)}
                        className={`w-full flex items-center gap-3 p-4 rounded-xl border transition-all text-right ${
                          isSelected
                            ? "border-primary/40 bg-primary/10"
                            : "border-border bg-secondary/40 hover:bg-secondary/70 hover:border-border"
                        }`}
                      >
                        <span className="text-2xl flex-shrink-0">
                          {opt.emoji}
                        </span>
                        <span className="text-foreground text-sm font-medium flex-1">
                          {opt.label}
                        </span>
                        {isSelected && (
                          <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                        )}
                      </motion.button>
                    );
                  })}
                </div>
              </div>

              {/* Back button */}
              {currentQ > 0 && (
                <button
                  onClick={() => setCurrentQ(currentQ - 1)}
                  className="flex items-center gap-2 text-muted-foreground hover:text-foreground text-sm transition-colors mx-auto"
                >
                  <ArrowRight className="w-4 h-4" />
                  السؤال السابق
                </button>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
            >
              {/* Result Card */}
              <div className="glass-card p-7 border border-border">
                <div className="text-center mb-6">
                  <div
                    className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4"
                    style={{
                      background: `${result.color}20`,
                      border: `2px solid ${result.color}40`,
                    }}
                  >
                    <span
                      className="text-4xl font-black"
                      style={{ color: result.color }}
                    >
                      {result.total}%
                    </span>
                  </div>
                  <h2 className="text-foreground font-black text-xl mb-1">
                    نتيجة التقييم
                  </h2>
                  <p
                    className="font-bold text-lg"
                    style={{ color: result.color }}
                  >
                    {result.label}
                  </p>
                </div>

                {/* Dimension Breakdown */}
                <div className="space-y-3 mb-6">
                  {(["mentalHealth", "awareness", "stillness"] as const).map(
                    dim => {
                      const meta = dimensionMeta[dim];
                      const Icon = meta.icon;
                      const value = result[dim];
                      return (
                        <div key={dim}>
                          <div className="flex items-center justify-between mb-1">
                            <span className="flex items-center gap-2 text-muted-foreground text-sm">
                              <Icon size={14} style={{ color: meta.color }} />
                              {meta.label}
                            </span>
                            <span className="text-foreground font-bold text-sm">
                              {value}%
                            </span>
                          </div>
                          <div className="w-full h-2.5 rounded-full bg-secondary/60 overflow-hidden">
                            <motion.div
                              className="h-full rounded-full"
                              style={{ background: meta.color }}
                              initial={{ width: 0 }}
                              animate={{ width: `${value}%` }}
                              transition={{ duration: 0.8, delay: 0.2 }}
                            />
                          </div>
                        </div>
                      );
                    }
                  )}
                </div>

                {/* Recommendation */}
                <div
                  className="p-4 rounded-xl mb-6"
                  style={{
                    background: `${result.color}10`,
                    border: `1px solid ${result.color}20`,
                  }}
                >
                  <div className="flex items-start gap-3">
                    {result.level === "critical" || result.level === "low" ? (
                      <AlertTriangle
                        className="w-5 h-5 flex-shrink-0 mt-0.5"
                        style={{ color: result.color }}
                      />
                    ) : (
                      <Sparkles
                        className="w-5 h-5 flex-shrink-0 mt-0.5"
                        style={{ color: result.color }}
                      />
                    )}
                    <p className="text-foreground/70 text-sm leading-relaxed">
                      {result.recommendation}
                    </p>
                  </div>
                </div>

                {/* Emergency contact for critical */}
                {(result.level === "critical" || result.level === "low") && (
                  <a
                    href={`tel:${CONTACT_PHONE}`}
                    className="flex items-center gap-3 p-3 rounded-xl bg-red-500/10 border border-red-500/20 mb-4 hover:bg-red-500/20 transition-colors"
                  >
                    <Phone className="w-5 h-5 text-red-400" />
                    <div>
                      <p className="text-red-400 font-bold text-sm">
                        خط المساعدة الفوري
                      </p>
                      <p className="text-muted-foreground text-xs font-numbers">
                        {CONTACT_PHONE}
                      </p>
                    </div>
                  </a>
                )}

                <button
                  onClick={goToDashboard}
                  className="w-full py-3.5 rounded-xl font-black text-primary-foreground transition-all hover:scale-105 flex items-center justify-center gap-2"
                  style={{
                    background: `linear-gradient(135deg, ${groupInfo.color}, ${groupInfo.color}99)`,
                  }}
                >
                  <ArrowLeft className="w-5 h-5" />
                  الذهاب للوحة التحكم
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
