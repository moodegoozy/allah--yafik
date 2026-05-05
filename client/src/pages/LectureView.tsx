/*
 * Design: Dark Luxury Wellness - "صون"
 * صفحة عرض المحاضرة التفاعلية - AI-Powered Content
 * Features: محتوى علمي كامل، اختبار تفاعلي، تقدم القراءة، إحصائيات
 */
import { useState, useEffect, useRef } from "react";
import { useParams, useLocation } from "wouter";
import { lecturesData } from "@/data/lecturesData";
import {
  BookOpen,
  Play,
  Clock,
  Users,
  Star,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  XCircle,
  Award,
  Brain,
  Target,
  Lightbulb,
  Phone,
  Bookmark,
  FileText,
  Volume2,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Eye,
  Shield,
  Music2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import AudioPlayer from "@/components/AudioPlayer";
import Certificate from "@/components/Certificate";
import LectureSummaryExport from "@/components/LectureSummaryExport";
import LectureRating from "@/components/LectureRating";

const CONTACT_PHONE = "0546192019";

const typeIcons: Record<string, React.ElementType> = {
  video: Play,
  audio: Volume2,
  workshop: Users,
  article: FileText,
};

const typeLabels: Record<string, string> = {
  video: "فيديو",
  audio: "صوتي",
  workshop: "ورشة عمل",
  article: "مقال",
};

export default function LectureView() {
  const params = useParams<{ id: string }>();
  const [, navigate] = useLocation();
  const lecture = lecturesData.find(l => l.id === params.id);

  const [expandedSections, setExpandedSections] = useState<Set<number>>(
    new Set([0])
  );
  const [quizStarted, setQuizStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answeredQuestions, setAnsweredQuestions] = useState<
    { selected: number; correct: boolean }[]
  >([]);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [readProgress, setReadProgress] = useState(0);
  const [bookmarked, setBookmarked] = useState(false);
  const [showCertificate, setShowCertificate] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (contentRef.current) {
        const el = contentRef.current;
        const scrolled = el.scrollTop;
        const total = el.scrollHeight - el.clientHeight;
        setReadProgress(total > 0 ? Math.round((scrolled / total) * 100) : 0);
      }
    };
    const el = contentRef.current;
    if (el) el.addEventListener("scroll", handleScroll);
    return () => {
      if (el) el.removeEventListener("scroll", handleScroll);
    };
  }, []);

  if (!lecture) {
    return (
      <div className="app-container bg-gradient-navy">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="text-6xl mb-4">📚</div>
            <h2 className="text-foreground text-2xl font-black mb-2">
              المحاضرة غير موجودة
            </h2>
            <button
              onClick={() => navigate("/lectures")}
              className="btn-teal px-6 py-3 rounded-xl font-bold mt-4"
            >
              العودة للمحاضرات
            </button>
          </div>
        </div>
      </div>
    );
  }

  const TypeIcon = typeIcons[lecture.type] || Play;
  const score = answeredQuestions.filter(a => a.correct).length;

  const toggleSection = (idx: number) => {
    const next = new Set(expandedSections);
    if (next.has(idx)) next.delete(idx);
    else next.add(idx);
    setExpandedSections(next);
  };

  const handleAnswer = (optionIdx: number) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(optionIdx);
    const correct = optionIdx === lecture.quiz[currentQuestion].correct;
    setAnsweredQuestions(prev => [...prev, { selected: optionIdx, correct }]);
  };

  const nextQuestion = () => {
    if (currentQuestion < lecture.quiz.length - 1) {
      setCurrentQuestion(p => p + 1);
      setSelectedAnswer(null);
    } else {
      setQuizCompleted(true);
    }
  };

  return (
    <div className="app-container bg-gradient-navy">
      {/* Top Progress Bar */}
      <div className="h-1 bg-secondary/60 fixed top-0 left-0 right-0 z-50">
        <div
          className="h-full transition-all duration-300"
          style={{
            width: `${readProgress}%`,
            background: `linear-gradient(to right, ${lecture.color}, oklch(0.75 0.18 175))`,
          }}
        />
      </div>

      {/* Header */}
      <div className="mobile-header px-4 py-3">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/lectures")}
            className="w-8 h-8 rounded-xl bg-secondary/60 flex items-center justify-center text-muted-foreground"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
          <div className="flex-1 min-w-0">
            <h1 className="text-foreground font-black text-sm truncate">
              {lecture.title}
            </h1>
            <p className="text-muted-foreground text-xs">{lecture.speaker}</p>
          </div>
          <button
            onClick={() => setBookmarked(!bookmarked)}
            className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all ${bookmarked ? "bg-accent/20 text-accent" : "bg-secondary/60 text-muted-foreground"}`}
          >
            <Bookmark
              className="w-4 h-4"
              fill={bookmarked ? "#F59E0B" : "none"}
            />
          </button>
        </div>
      </div>

      <div ref={contentRef} className="page-content overflow-y-auto">
        {/* Hero */}
        <div className="relative overflow-hidden px-4 pt-3 pb-5">
          <div
            className="orb w-60 h-60 -top-20 -right-20 opacity-30"
            style={{ background: `${lecture.color}20` }}
          />

          <div className="relative z-10">
            <div className="flex items-start gap-3 mb-3">
              <div
                className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{
                  background: `linear-gradient(135deg, ${lecture.color}30, ${lecture.color}10)`,
                  border: `1px solid ${lecture.color}40`,
                }}
              >
                <TypeIcon
                  className="w-7 h-7"
                  style={{ color: lecture.color }}
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-2 flex-wrap">
                  <span
                    className="px-2 py-0.5 rounded-full text-[10px] font-bold"
                    style={{
                      background: `${lecture.color}15`,
                      color: lecture.color,
                    }}
                  >
                    {typeLabels[lecture.type]}
                  </span>
                  <span className="badge-teal text-[10px]">
                    {lecture.ageLabel}
                  </span>
                  <span className="badge-gold text-[10px]">
                    {lecture.category}
                  </span>
                </div>
                <h2 className="text-foreground font-black text-lg leading-tight">
                  {lecture.title}
                </h2>
              </div>
            </div>

            <p className="text-muted-foreground text-xs mb-3">{lecture.subtitle}</p>

            {/* Speaker */}
            <div className="flex items-center gap-2.5 mb-3">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center font-black text-sm"
                style={{
                  background: `${lecture.color}20`,
                  color: lecture.color,
                }}
              >
                {lecture.speaker.split(" ").slice(-1)[0].charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-foreground font-bold text-xs">
                  {lecture.speaker}
                </div>
                <div className="text-muted-foreground text-[10px]">
                  {lecture.speakerTitle}
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Star className="w-3.5 h-3.5 text-accent fill-amber-500" />
                <span className="text-foreground font-bold text-xs">
                  {lecture.rating}
                </span>
              </div>
            </div>

            {/* Meta */}
            <div className="flex items-center gap-3 text-muted-foreground text-xs flex-wrap">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {lecture.duration}
              </span>
              <span className="flex items-center gap-1">
                <BookOpen className="w-3.5 h-3.5" />
                {lecture.sections.length} أقسام
              </span>
              <span className="flex items-center gap-1">
                <Brain className="w-3.5 h-3.5" />
                {lecture.quiz.length} أسئلة
              </span>
              <span className="flex items-center gap-1">
                <Eye className="w-3.5 h-3.5" />
                {readProgress}%
              </span>
            </div>
          </div>
        </div>

        {/* Objectives */}
        <div className="px-4 py-4 border-t border-border">
          <div className="flex items-center gap-2 mb-3">
            <Target className="w-4 h-4 text-primary" />
            <h2 className="text-foreground font-bold text-sm">أهداف المحاضرة</h2>
          </div>
          <div className="space-y-2">
            {lecture.objectives.map((obj, i) => (
              <div
                key={i}
                className="flex items-start gap-2.5 p-2.5 rounded-xl"
                style={{
                  background: `${lecture.color}08`,
                  border: `1px solid ${lecture.color}12`,
                }}
              >
                <div
                  className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                  style={{ background: `${lecture.color}20` }}
                >
                  <span
                    className="text-[10px] font-black"
                    style={{ color: lecture.color }}
                  >
                    {i + 1}
                  </span>
                </div>
                <span className="text-foreground/70 text-xs leading-relaxed">
                  {obj}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Audio Player */}
        {lecture.type === "audio" && (
          <div className="px-4 py-4 border-t border-border">
            <div className="flex items-center gap-2 mb-3">
              <Music2 className="w-4 h-4" style={{ color: lecture.color }} />
              <h2 className="text-foreground font-bold text-sm">
                مشغّل المحاضرة الصوتية
              </h2>
            </div>
            <AudioPlayer
              title={lecture.title}
              speaker={lecture.speaker}
              duration={lecture.duration}
              color={lecture.color}
            />
          </div>
        )}

        {/* Sections */}
        <div className="px-4 py-4 border-t border-border">
          <div className="flex items-center gap-2 mb-3">
            <BookOpen className="w-4 h-4 text-primary" />
            <h2 className="text-foreground font-bold text-sm">محتوى المحاضرة</h2>
          </div>
          <div className="space-y-3">
            {lecture.sections.map((section, idx) => (
              <div
                key={idx}
                className="rounded-xl border border-border overflow-hidden bg-foreground/[0.02]"
              >
                <button
                  className="w-full flex items-center justify-between p-3.5 text-right"
                  onClick={() => toggleSection(idx)}
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black"
                      style={{
                        background: `${lecture.color}20`,
                        color: lecture.color,
                      }}
                    >
                      {idx + 1}
                    </div>
                    <span className="text-foreground font-bold text-sm">
                      {section.title}
                    </span>
                  </div>
                  {expandedSections.has(idx) ? (
                    <ChevronUp className="w-4 h-4 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-muted-foreground" />
                  )}
                </button>

                <AnimatePresence>
                  {expandedSections.has(idx) && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="px-3.5 pb-3.5 border-t border-border">
                        <div className="mt-3 text-foreground/70 text-xs leading-loose whitespace-pre-line">
                          {section.content.split("\n").map((line, li) => {
                            if (line.startsWith("**") && line.endsWith("**")) {
                              return (
                                <p
                                  key={li}
                                  className="text-foreground font-bold mt-3 mb-1"
                                >
                                  {line.replace(/\*\*/g, "")}
                                </p>
                              );
                            }
                            if (line.includes("**")) {
                              const parts = line.split(/\*\*(.*?)\*\*/g);
                              return (
                                <p key={li} className="mb-1">
                                  {parts.map((part, pi) =>
                                    pi % 2 === 1 ? (
                                      <strong
                                        key={pi}
                                        className="text-foreground font-bold"
                                      >
                                        {part}
                                      </strong>
                                    ) : (
                                      part
                                    )
                                  )}
                                </p>
                              );
                            }
                            return line ? (
                              <p key={li} className="mb-1">
                                {line}
                              </p>
                            ) : (
                              <br key={li} />
                            );
                          })}
                        </div>

                        {section.highlight && (
                          <div
                            className="mt-3 p-3 rounded-xl border-r-4 flex items-start gap-2.5"
                            style={{
                              background: `${lecture.color}10`,
                              borderColor: lecture.color,
                            }}
                          >
                            <Lightbulb
                              className="w-4 h-4 flex-shrink-0 mt-0.5"
                              style={{ color: lecture.color }}
                            />
                            <p className="text-foreground font-bold text-xs leading-relaxed">
                              {section.highlight}
                            </p>
                          </div>
                        )}

                        {section.stats && (
                          <div className="mt-3 grid grid-cols-3 gap-2">
                            {section.stats.map((stat, si) => (
                              <div
                                key={si}
                                className="p-2.5 rounded-xl bg-foreground/[0.03] border border-border text-center"
                              >
                                <div
                                  className="text-lg font-black font-numbers mb-0.5"
                                  style={{ color: stat.color }}
                                >
                                  {stat.value}
                                </div>
                                <div className="text-muted-foreground text-[10px]">
                                  {stat.label}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>

        {/* Quiz Section */}
        <div className="px-4 py-4 border-t border-border">
          <div className="flex items-center gap-2 mb-4">
            <Brain className="w-4 h-4 text-violet-500" />
            <h2 className="text-foreground font-bold text-sm">اختبر فهمك</h2>
            <span className="badge-purple text-[10px]">
              {lecture.quiz.length} أسئلة
            </span>
          </div>

          {!quizStarted && !quizCompleted && (
            <div className="p-6 rounded-xl border border-violet-500/20 bg-violet-500/[0.05] text-center">
              <div className="w-14 h-14 rounded-xl bg-violet-500/20 flex items-center justify-center mx-auto mb-3">
                <Brain className="w-7 h-7 text-violet-500" />
              </div>
              <h3 className="text-foreground font-black text-base mb-1">
                هل أنت مستعد؟
              </h3>
              <p className="text-muted-foreground text-xs mb-4">
                {lecture.quiz.length} أسئلة لاختبار ما تعلمته
              </p>
              <button
                onClick={() => setQuizStarted(true)}
                className="btn-teal px-6 py-2.5 rounded-xl font-bold text-sm"
              >
                ابدأ الاختبار
              </button>
            </div>
          )}

          {quizStarted && !quizCompleted && (
            <div className="p-4 rounded-xl border border-violet-500/20 bg-foreground/[0.02]">
              {/* Progress */}
              <div className="flex items-center justify-between mb-3">
                <span className="text-muted-foreground text-xs">
                  السؤال {currentQuestion + 1} من {lecture.quiz.length}
                </span>
                <div className="flex gap-1">
                  {lecture.quiz.map((_, qi) => (
                    <div
                      key={qi}
                      className="w-2 h-2 rounded-full transition-all"
                      style={{
                        background:
                          qi < answeredQuestions.length
                            ? answeredQuestions[qi]?.correct
                              ? "#10B981"
                              : "#EF4444"
                            : qi === currentQuestion
                              ? "#8B5CF6"
                              : "var(--border)",
                      }}
                    />
                  ))}
                </div>
              </div>

              <h3 className="text-foreground font-bold text-sm mb-4 leading-relaxed">
                {lecture.quiz[currentQuestion].question}
              </h3>

              <div className="space-y-2 mb-4">
                {lecture.quiz[currentQuestion].options.map((opt, oi) => {
                  const isSelected = selectedAnswer === oi;
                  const isCorrect =
                    oi === lecture.quiz[currentQuestion].correct;
                  const showResult = selectedAnswer !== null;

                  let bg = "bg-foreground/[0.03] border border-border";
                  let textColor = "text-foreground/70";
                  if (showResult && isCorrect) {
                    bg = "border border-emerald-500/50 bg-emerald-500/10";
                    textColor = "text-emerald-500";
                  } else if (showResult && isSelected && !isCorrect) {
                    bg = "border border-destructive/50 bg-destructive/10";
                    textColor = "text-destructive";
                  }

                  return (
                    <button
                      key={oi}
                      onClick={() => handleAnswer(oi)}
                      disabled={selectedAnswer !== null}
                      className={`w-full flex items-center gap-2.5 p-3 rounded-xl text-right transition-all ${bg}`}
                    >
                      <div
                        className={`w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 text-xs font-black transition-all ${
                          showResult && isCorrect
                            ? "bg-emerald-500/20 text-emerald-500"
                            : showResult && isSelected && !isCorrect
                              ? "bg-destructive/20 text-destructive"
                              : "bg-secondary/60 text-muted-foreground"
                        }`}
                      >
                        {showResult && isCorrect ? (
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        ) : showResult && isSelected && !isCorrect ? (
                          <XCircle className="w-3.5 h-3.5" />
                        ) : (
                          String.fromCharCode(0x0627 + oi)
                        )}
                      </div>
                      <span className={`text-xs font-medium ${textColor}`}>
                        {opt}
                      </span>
                    </button>
                  );
                })}
              </div>

              {selectedAnswer !== null && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3 rounded-xl mb-3 border-r-4"
                  style={{
                    background: answeredQuestions[answeredQuestions.length - 1]
                      ?.correct
                      ? "#10B98110"
                      : "#EF444410",
                    borderColor: answeredQuestions[answeredQuestions.length - 1]
                      ?.correct
                      ? "#10B981"
                      : "#EF4444",
                  }}
                >
                  <div className="flex items-center gap-2 mb-1">
                    {answeredQuestions[answeredQuestions.length - 1]
                      ?.correct ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                    ) : (
                      <XCircle className="w-3.5 h-3.5 text-destructive" />
                    )}
                    <span
                      className="font-bold text-xs"
                      style={{
                        color: answeredQuestions[answeredQuestions.length - 1]
                          ?.correct
                          ? "#10B981"
                          : "#EF4444",
                      }}
                    >
                      {answeredQuestions[answeredQuestions.length - 1]?.correct
                        ? "إجابة صحيحة!"
                        : "إجابة خاطئة"}
                    </span>
                  </div>
                  <p className="text-muted-foreground text-[11px] leading-relaxed">
                    {lecture.quiz[currentQuestion].explanation}
                  </p>
                </motion.div>
              )}

              {selectedAnswer !== null && (
                <button
                  onClick={nextQuestion}
                  className="btn-teal w-full py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2"
                >
                  {currentQuestion < lecture.quiz.length - 1 ? (
                    <>
                      <ChevronLeft className="w-4 h-4" />
                      السؤال التالي
                    </>
                  ) : (
                    <>
                      <Award className="w-4 h-4" />
                      عرض النتيجة
                    </>
                  )}
                </button>
              )}
            </div>
          )}

          {quizCompleted && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-6 rounded-xl border border-primary/20 bg-foreground/[0.02] text-center"
            >
              <div
                className="w-16 h-16 rounded-full mx-auto mb-3 flex items-center justify-center"
                style={{
                  background:
                    score === lecture.quiz.length
                      ? "linear-gradient(135deg, oklch(0.80 0.16 85), oklch(0.85 0.15 85))"
                      : score >= lecture.quiz.length * 0.6
                        ? "linear-gradient(135deg, oklch(0.75 0.18 175), oklch(0.68 0.16 230))"
                        : "linear-gradient(135deg, oklch(0.55 0.24 290), oklch(0.65 0.24 350))",
                }}
              >
                <Award className="w-8 h-8 text-primary-foreground" />
              </div>
              <h3 className="text-foreground font-black text-lg mb-1">
                {score === lecture.quiz.length
                  ? "ممتاز! إجابات مثالية"
                  : score >= lecture.quiz.length * 0.6
                    ? "جيد جداً! استمر"
                    : "تحتاج مراجعة"}
              </h3>
              <p className="text-muted-foreground text-xs mb-4">
                أجبت على{" "}
                <span className="text-primary font-black">{score}</span> من{" "}
                <span className="font-black">{lecture.quiz.length}</span> أسئلة
                بشكل صحيح
              </p>
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => {
                    setQuizStarted(false);
                    setQuizCompleted(false);
                    setCurrentQuestion(0);
                    setSelectedAnswer(null);
                    setAnsweredQuestions([]);
                  }}
                  className="btn-outline-teal w-full py-2.5 rounded-xl font-bold text-sm"
                >
                  إعادة الاختبار
                </button>
                {score >= lecture.quiz.length * 0.6 && (
                  <button
                    onClick={() => setShowCertificate(true)}
                    className="w-full py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all"
                    style={{
                      background: "linear-gradient(135deg, oklch(0.80 0.16 85), oklch(0.85 0.15 85))",
                      color: "var(--background)",
                    }}
                  >
                    <Award className="w-4 h-4" />
                    احصل على شهادتك
                  </button>
                )}
                <button
                  onClick={() => navigate("/lectures")}
                  className="btn-teal w-full py-2.5 rounded-xl font-bold text-sm"
                >
                  محاضرة أخرى
                </button>
              </div>
            </motion.div>
          )}
        </div>

        {/* Key Takeaways */}
        <div className="px-4 py-4 border-t border-border">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-accent" />
              <h2 className="text-foreground font-bold text-sm">النقاط الرئيسية</h2>
            </div>
            <LectureSummaryExport
              title={lecture.title}
              speaker={lecture.speaker}
              speakerTitle={lecture.speakerTitle}
              keyTakeaways={lecture.keyTakeaways}
              tags={lecture.tags}
              color={lecture.color}
              duration={lecture.duration}
              rating={lecture.rating}
            />
          </div>
          <div className="space-y-2">
            {lecture.keyTakeaways.map((point, i) => (
              <div
                key={i}
                className="flex items-start gap-2.5 p-2.5 rounded-xl bg-foreground/[0.03] border border-border"
              >
                <div className="w-5 h-5 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <CheckCircle2 className="w-3 h-3 text-accent" />
                </div>
                <span className="text-foreground/75 text-xs leading-relaxed">
                  {point}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Resources */}
        <div className="px-4 py-4 border-t border-border">
          <div className="flex items-center gap-2 mb-3">
            <FileText className="w-4 h-4 text-sky-500" />
            <h2 className="text-foreground font-bold text-sm">مصادر إضافية</h2>
          </div>
          <div className="space-y-2">
            {lecture.resources.map((res, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-2.5 rounded-xl bg-foreground/[0.03] border border-border"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-sky-500/15 flex items-center justify-center">
                    <BookOpen className="w-3.5 h-3.5 text-sky-500" />
                  </div>
                  <span className="text-foreground/70 text-xs">{res.title}</span>
                </div>
                <span className="badge-teal text-[10px]">{res.type}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Speaker Bio */}
        <div className="px-4 py-4 border-t border-border">
          <div className="p-3.5 rounded-xl bg-foreground/[0.03] border border-border">
            <div className="flex items-center gap-2.5 mb-2">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center font-black"
                style={{
                  background: `${lecture.color}20`,
                  color: lecture.color,
                }}
              >
                {lecture.speaker.split(" ").slice(-1)[0].charAt(0)}
              </div>
              <div>
                <div className="text-foreground font-bold text-xs">
                  {lecture.speaker}
                </div>
                <div className="text-muted-foreground text-[10px]">
                  {lecture.speakerTitle}
                </div>
              </div>
            </div>
            <p className="text-muted-foreground text-[11px] leading-relaxed">
              {lecture.speakerBio}
            </p>
            <div className="mt-2 pt-2 border-t border-border flex items-center gap-1.5 text-muted-foreground/70 text-[10px]">
              <Shield className="w-3 h-3" />
              <span>{lecture.institution}</span>
            </div>
          </div>
        </div>

        {/* Tags */}
        <div className="px-4 py-4 border-t border-border">
          <div className="flex flex-wrap gap-1.5">
            {lecture.tags.map((tag, i) => (
              <span key={i} className="badge-teal text-[10px]">
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Rating */}
        <div className="px-4 py-4 border-t border-border mb-4">
          <LectureRating lectureId={lecture.id} color={lecture.color} />
        </div>

        {/* CTA */}
        <div className="px-4 pb-6">
          <div className="p-4 rounded-xl border border-primary/15 bg-primary/[0.05] relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="text-foreground font-black text-sm mb-1">
                هل تحتاج دعماً شخصياً؟
              </h3>
              <p className="text-muted-foreground text-[11px] mb-3">
                فريق "صون" متاح للمساعدة والإرشاد
              </p>
              <a
                href={`tel:${CONTACT_PHONE}`}
                className="btn-teal px-5 py-2 rounded-xl font-bold flex items-center gap-2 text-xs w-fit"
              >
                <Phone className="w-3.5 h-3.5" />
                {CONTACT_PHONE}
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Certificate Modal */}
      <AnimatePresence>
        {showCertificate && (
          <Certificate
            lectureTitle={lecture.title}
            speaker={lecture.speaker}
            speakerTitle={lecture.speakerTitle}
            score={score}
            totalQuestions={lecture.quiz.length}
            color={lecture.color}
            category={lecture.category}
            duration={lecture.duration}
            onClose={() => setShowCertificate(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
