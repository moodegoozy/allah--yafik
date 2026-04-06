/*
 * Design: Dark Luxury Wellness - "الله يعافيك"
 * صفحة عرض المحاضرة التفاعلية - AI-Powered Content
 * Features: محتوى علمي كامل، اختبار تفاعلي، تقدم القراءة، إحصائيات
 */
import { useState, useEffect, useRef } from "react";
import { useParams, useLocation } from "wouter";
import Sidebar from "@/components/Sidebar";
import { lecturesData } from "@/data/lecturesData";
import { BookOpen, Play, Clock, Users, Star, ChevronLeft, ChevronRight,
  CheckCircle2, XCircle, Award, Brain, Target, Lightbulb,
  Phone, Share2, Bookmark, ArrowRight, BarChart3, FileText,
  Volume2, Sparkles, TrendingUp, MessageSquare, Download,
  ChevronDown, ChevronUp, Eye, Heart, Shield, Music2,
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
  const lecture = lecturesData.find((l) => l.id === params.id);

  const [activeSection, setActiveSection] = useState(0);
  const [expandedSections, setExpandedSections] = useState<Set<number>>(new Set([0]));
  const [quizStarted, setQuizStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answeredQuestions, setAnsweredQuestions] = useState<{ selected: number; correct: boolean }[]>([]);
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
    return () => { if (el) el.removeEventListener("scroll", handleScroll); };
  }, []);

  if (!lecture) {
    return (
      <div className="min-h-screen bg-[#060B18] text-white flex">
        <Sidebar />
        <main className="flex-1 mr-64 flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl mb-4">📚</div>
            <h2 className="text-white text-2xl font-black mb-2">المحاضرة غير موجودة</h2>
            <button onClick={() => navigate("/lectures")} className="btn-teal px-6 py-3 rounded-xl font-bold mt-4">
              العودة للمحاضرات
            </button>
          </div>
        </main>
      </div>
    );
  }

  const TypeIcon = typeIcons[lecture.type] || Play;
  const score = answeredQuestions.filter((a) => a.correct).length;

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
    setAnsweredQuestions((prev) => [...prev, { selected: optionIdx, correct }]);
  };

  const nextQuestion = () => {
    if (currentQuestion < lecture.quiz.length - 1) {
      setCurrentQuestion((p) => p + 1);
      setSelectedAnswer(null);
    } else {
      setQuizCompleted(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#060B18] text-white flex">
      <Sidebar />
      <div className="flex-1 mr-64 flex flex-col overflow-hidden">

        {/* Top Progress Bar */}
        <div className="h-1 bg-white/5 fixed top-0 right-64 left-0 z-50">
          <div
            className="h-full transition-all duration-300"
            style={{ width: `${readProgress}%`, background: `linear-gradient(to right, ${lecture.color}, #00D4AA)` }}
          />
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Main Content */}
          <div ref={contentRef} className="flex-1 overflow-y-auto">

            {/* Hero Header */}
            <div className="relative overflow-hidden px-8 pt-10 pb-8 border-b border-white/5">
              <div className="orb w-96 h-96 -top-20 -right-20 opacity-40" style={{ background: `${lecture.color}20` }} />
              <div className="orb orb-teal w-64 h-64 bottom-0 left-0 opacity-30" />

              <div className="relative z-10">
                {/* Back */}
                <button
                  onClick={() => navigate("/lectures")}
                  className="flex items-center gap-2 text-white/40 hover:text-white text-sm mb-5 transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                  العودة للمحاضرات
                </button>

                <div className="flex items-start gap-6">
                  {/* Icon */}
                  <div
                    className="w-20 h-20 rounded-2xl flex items-center justify-center flex-shrink-0 float-anim"
                    style={{ background: `linear-gradient(135deg, ${lecture.color}30, ${lecture.color}10)`, border: `1px solid ${lecture.color}40` }}
                  >
                    <TypeIcon className="w-10 h-10" style={{ color: lecture.color }} />
                  </div>

                  <div className="flex-1">
                    {/* Badges */}
                    <div className="flex items-center gap-2 mb-3 flex-wrap">
                      <span className="section-tag border text-xs" style={{ background: `${lecture.color}15`, borderColor: `${lecture.color}30`, color: lecture.color }}>
                        {typeLabels[lecture.type]}
                      </span>
                      <span className="badge-teal">{lecture.ageLabel}</span>
                      <span className="badge-gold">{lecture.category}</span>
                      {lecture.featured && <span className="badge-purple">مميز</span>}
                    </div>

                    <h1 className="text-3xl font-black text-white mb-2 leading-tight">{lecture.title}</h1>
                    <p className="text-white/55 text-base mb-4">{lecture.subtitle}</p>

                    {/* Speaker */}
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-lg" style={{ background: `${lecture.color}20`, color: lecture.color }}>
                        {lecture.speaker.split(" ").slice(-1)[0].charAt(0)}
                      </div>
                      <div>
                        <div className="text-white font-bold text-sm">{lecture.speaker}</div>
                        <div className="text-white/45 text-xs">{lecture.speakerTitle}</div>
                      </div>
                      <div className="mr-auto flex items-center gap-1">
                        <Star className="w-4 h-4 text-[#F59E0B] fill-[#F59E0B]" />
                        <span className="text-white font-bold">{lecture.rating}</span>
                        <span className="text-white/30 text-sm">({lecture.views} مشاهدة)</span>
                      </div>
                    </div>

                    {/* Meta */}
                    <div className="flex items-center gap-4 text-white/40 text-sm">
                      <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" />{lecture.duration}</span>
                      <span className="flex items-center gap-1.5"><BookOpen className="w-4 h-4" />{lecture.sections.length} أقسام</span>
                      <span className="flex items-center gap-1.5"><Brain className="w-4 h-4" />{lecture.quiz.length} أسئلة</span>
                      <span className="flex items-center gap-1.5"><Eye className="w-4 h-4" />{readProgress}% مكتمل</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2 flex-shrink-0">
                    <button
                      onClick={() => setBookmarked(!bookmarked)}
                      className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${bookmarked ? "bg-[#F59E0B]/20 text-[#F59E0B]" : "glass-card text-white/40 hover:text-white"}`}
                    >
                      <Bookmark className="w-4 h-4" fill={bookmarked ? "#F59E0B" : "none"} />
                    </button>
                    <button className="w-10 h-10 rounded-xl glass-card flex items-center justify-center text-white/40 hover:text-white transition-all">
                      <Share2 className="w-4 h-4" />
                    </button>
                    <button className="w-10 h-10 rounded-xl glass-card flex items-center justify-center text-white/40 hover:text-white transition-all">
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Objectives */}
            <div className="px-8 py-6 border-b border-white/5">
              <div className="flex items-center gap-2 mb-4">
                <Target className="w-4 h-4 text-[#00D4AA]" />
                <h2 className="text-white font-bold">أهداف المحاضرة</h2>
              </div>
              <div className="grid md:grid-cols-2 gap-3">
                {lecture.objectives.map((obj, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 rounded-xl" style={{ background: `${lecture.color}08`, border: `1px solid ${lecture.color}15` }}>
                    <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: `${lecture.color}20` }}>
                      <span className="text-xs font-black" style={{ color: lecture.color }}>{i + 1}</span>
                    </div>
                    <span className="text-white/70 text-sm leading-relaxed">{obj}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Audio Player - للمحاضرات الصوتية */}
            {lecture.type === "audio" && (
              <div className="px-8 py-5 border-b border-white/5">
                <div className="flex items-center gap-2 mb-4">
                  <Music2 className="w-4 h-4" style={{ color: lecture.color }} />
                  <h2 className="text-white font-bold">مشغّل المحاضرة الصوتية</h2>
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
            <div className="px-8 py-6 border-b border-white/5">
              <div className="flex items-center gap-2 mb-5">
                <BookOpen className="w-4 h-4 text-[#00D4AA]" />
                <h2 className="text-white font-bold">محتوى المحاضرة</h2>
              </div>
              <div className="space-y-4">
                {lecture.sections.map((section, idx) => (
                  <div key={idx} className="glass-card border border-white/7 overflow-hidden">
                    <button
                      className="w-full flex items-center justify-between p-5 text-right"
                      onClick={() => toggleSection(idx)}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl flex items-center justify-center font-black" style={{ background: `${lecture.color}20`, color: lecture.color }}>
                          {idx + 1}
                        </div>
                        <span className="text-white font-bold">{section.title}</span>
                      </div>
                      {expandedSections.has(idx) ? (
                        <ChevronUp className="w-4 h-4 text-white/40" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-white/40" />
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
                          <div className="px-5 pb-5 border-t border-white/5">
                            {/* Content */}
                            <div className="mt-4 text-white/70 text-sm leading-loose whitespace-pre-line">
                              {section.content.split("\n").map((line, li) => {
                                if (line.startsWith("**") && line.endsWith("**")) {
                                  return <p key={li} className="text-white font-bold mt-3 mb-1">{line.replace(/\*\*/g, "")}</p>;
                                }
                                if (line.includes("**")) {
                                  const parts = line.split(/\*\*(.*?)\*\*/g);
                                  return (
                                    <p key={li} className="mb-1">
                                      {parts.map((part, pi) => pi % 2 === 1 ? <strong key={pi} className="text-white font-bold">{part}</strong> : part)}
                                    </p>
                                  );
                                }
                                return line ? <p key={li} className="mb-1">{line}</p> : <br key={li} />;
                              })}
                            </div>

                            {/* Highlight */}
                            {section.highlight && (
                              <div className="mt-4 p-4 rounded-xl border-r-4 flex items-start gap-3" style={{ background: `${lecture.color}10`, borderColor: lecture.color }}>
                                <Lightbulb className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: lecture.color }} />
                                <p className="text-white font-bold text-sm leading-relaxed">{section.highlight}</p>
                              </div>
                            )}

                            {/* Stats */}
                            {section.stats && (
                              <div className="mt-4 grid grid-cols-3 gap-3">
                                {section.stats.map((stat, si) => (
                                  <div key={si} className="counter-card p-4 text-center">
                                    <div className="text-2xl font-black font-numbers mb-1" style={{ color: stat.color }}>{stat.value}</div>
                                    <div className="text-white/40 text-xs">{stat.label}</div>
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
            <div className="px-8 py-6 border-b border-white/5">
              <div className="flex items-center gap-2 mb-5">
                <Brain className="w-4 h-4 text-[#8B5CF6]" />
                <h2 className="text-white font-bold">اختبر فهمك</h2>
                <span className="badge-purple">{lecture.quiz.length} أسئلة</span>
              </div>

              {!quizStarted && !quizCompleted && (
                <div className="glass-card p-8 border border-[#8B5CF6]/20 text-center">
                  <div className="w-16 h-16 rounded-2xl bg-[#8B5CF6]/20 flex items-center justify-center mx-auto mb-4">
                    <Brain className="w-8 h-8 text-[#8B5CF6]" />
                  </div>
                  <h3 className="text-white font-black text-xl mb-2">هل أنت مستعد؟</h3>
                  <p className="text-white/50 text-sm mb-6">{lecture.quiz.length} أسئلة لاختبار ما تعلمته من هذه المحاضرة</p>
                  <button
                    onClick={() => setQuizStarted(true)}
                    className="btn-teal px-8 py-3 rounded-xl font-bold text-sm"
                  >
                    ابدأ الاختبار
                  </button>
                </div>
              )}

              {quizStarted && !quizCompleted && (
                <div className="glass-card p-6 border border-[#8B5CF6]/20">
                  {/* Progress */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-white/40 text-sm">السؤال {currentQuestion + 1} من {lecture.quiz.length}</span>
                    <div className="flex gap-1.5">
                      {lecture.quiz.map((_, qi) => (
                        <div key={qi} className="w-2 h-2 rounded-full transition-all" style={{
                          background: qi < answeredQuestions.length
                            ? (answeredQuestions[qi]?.correct ? "#10B981" : "#EF4444")
                            : qi === currentQuestion ? "#8B5CF6" : "rgba(255,255,255,0.1)"
                        }} />
                      ))}
                    </div>
                  </div>

                  {/* Question */}
                  <h3 className="text-white font-bold text-lg mb-5 leading-relaxed">
                    {lecture.quiz[currentQuestion].question}
                  </h3>

                  {/* Options */}
                  <div className="space-y-3 mb-5">
                    {lecture.quiz[currentQuestion].options.map((opt, oi) => {
                      const isSelected = selectedAnswer === oi;
                      const isCorrect = oi === lecture.quiz[currentQuestion].correct;
                      const showResult = selectedAnswer !== null;

                      let bg = "glass-card border border-white/7 hover:border-white/15";
                      let textColor = "text-white/70";
                      if (showResult && isCorrect) { bg = "border border-[#10B981]/50 bg-[#10B981]/10"; textColor = "text-[#10B981]"; }
                      else if (showResult && isSelected && !isCorrect) { bg = "border border-[#EF4444]/50 bg-[#EF4444]/10"; textColor = "text-[#EF4444]"; }

                      return (
                        <button
                          key={oi}
                          onClick={() => handleAnswer(oi)}
                          disabled={selectedAnswer !== null}
                          className={`w-full flex items-center gap-3 p-4 rounded-xl text-right transition-all ${bg}`}
                        >
                          <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 text-sm font-black transition-all ${
                            showResult && isCorrect ? "bg-[#10B981]/20 text-[#10B981]" :
                            showResult && isSelected && !isCorrect ? "bg-[#EF4444]/20 text-[#EF4444]" :
                            "bg-white/5 text-white/40"
                          }`}>
                            {showResult && isCorrect ? <CheckCircle2 className="w-4 h-4" /> :
                             showResult && isSelected && !isCorrect ? <XCircle className="w-4 h-4" /> :
                             String.fromCharCode(0x0627 + oi)}
                          </div>
                          <span className={`text-sm font-medium ${textColor}`}>{opt}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Explanation */}
                  {selectedAnswer !== null && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 rounded-xl mb-4 border-r-4"
                      style={{
                        background: answeredQuestions[answeredQuestions.length - 1]?.correct ? "#10B98110" : "#EF444410",
                        borderColor: answeredQuestions[answeredQuestions.length - 1]?.correct ? "#10B981" : "#EF4444",
                      }}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        {answeredQuestions[answeredQuestions.length - 1]?.correct ? (
                          <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
                        ) : (
                          <XCircle className="w-4 h-4 text-[#EF4444]" />
                        )}
                        <span className="font-bold text-sm" style={{ color: answeredQuestions[answeredQuestions.length - 1]?.correct ? "#10B981" : "#EF4444" }}>
                          {answeredQuestions[answeredQuestions.length - 1]?.correct ? "إجابة صحيحة!" : "إجابة خاطئة"}
                        </span>
                      </div>
                      <p className="text-white/65 text-xs leading-relaxed">{lecture.quiz[currentQuestion].explanation}</p>
                    </motion.div>
                  )}

                  {selectedAnswer !== null && (
                    <button onClick={nextQuestion} className="btn-teal w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2">
                      {currentQuestion < lecture.quiz.length - 1 ? (
                        <><ChevronLeft className="w-4 h-4" />السؤال التالي</>
                      ) : (
                        <><Award className="w-4 h-4" />عرض النتيجة</>
                      )}
                    </button>
                  )}
                </div>
              )}

              {quizCompleted && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="glass-card p-8 border border-[#00D4AA]/20 text-center"
                >
                  <div className="w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center" style={{
                    background: score === lecture.quiz.length ? "linear-gradient(135deg, #F59E0B, #FBBF24)" :
                                score >= lecture.quiz.length * 0.6 ? "linear-gradient(135deg, #00D4AA, #0EA5E9)" :
                                "linear-gradient(135deg, #8B5CF6, #EC4899)"
                  }}>
                    <Award className="w-10 h-10 text-[#060B18]" />
                  </div>
                  <h3 className="text-white font-black text-2xl mb-2">
                    {score === lecture.quiz.length ? "ممتاز! إجابات مثالية" :
                     score >= lecture.quiz.length * 0.6 ? "جيد جداً! استمر" :
                     "تحتاج مراجعة"}
                  </h3>
                  <p className="text-white/50 mb-4">
                    أجبت على <span className="text-[#00D4AA] font-black">{score}</span> من <span className="font-black">{lecture.quiz.length}</span> أسئلة بشكل صحيح
                  </p>
                  <div className="flex gap-3 justify-center flex-wrap">
                    <button
                      onClick={() => { setQuizStarted(false); setQuizCompleted(false); setCurrentQuestion(0); setSelectedAnswer(null); setAnsweredQuestions([]); }}
                      className="btn-outline-teal px-6 py-2.5 rounded-xl font-bold text-sm"
                    >
                      إعادة الاختبار
                    </button>
                    {score >= lecture.quiz.length * 0.6 && (
                      <button
                        onClick={() => setShowCertificate(true)}
                        className="px-6 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 transition-all"
                        style={{ background: "linear-gradient(135deg, #F59E0B, #FBBF24)", color: "#060B18" }}
                      >
                        <Award className="w-4 h-4" />
                        احصل على شهادتك
                      </button>
                    )}
                    <button onClick={() => navigate("/lectures")} className="btn-teal px-6 py-2.5 rounded-xl font-bold text-sm">
                      محاضرة أخرى
                    </button>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Key Takeaways */}
            <div className="px-8 py-6 border-b border-white/5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#F59E0B]" />
                  <h2 className="text-white font-bold">النقاط الرئيسية</h2>
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
              <div className="space-y-3">
                {lecture.keyTakeaways.map((point, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 rounded-xl glass-card border border-white/5">
                    <div className="w-6 h-6 rounded-full bg-[#F59E0B]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#F59E0B]" />
                    </div>
                    <span className="text-white/75 text-sm leading-relaxed">{point}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Resources */}
            <div className="px-8 py-6 border-b border-white/5">
              <div className="flex items-center gap-2 mb-4">
                <FileText className="w-4 h-4 text-[#0EA5E9]" />
                <h2 className="text-white font-bold">مصادر إضافية</h2>
              </div>
              <div className="space-y-2">
                {lecture.resources.map((res, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-xl glass-card border border-white/5 hover:border-white/10 transition-all">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[#0EA5E9]/15 flex items-center justify-center">
                        <BookOpen className="w-4 h-4 text-[#0EA5E9]" />
                      </div>
                      <span className="text-white/70 text-sm">{res.title}</span>
                    </div>
                    <span className="badge-teal">{res.type}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className="px-8 py-8">
              <div className="glass-card p-6 border border-[#00D4AA]/20 relative overflow-hidden">
                <div className="orb orb-teal w-64 h-64 -top-10 -right-10 opacity-40" />
                <div className="relative z-10 flex items-center justify-between gap-4">
                  <div>
                    <h3 className="text-white font-black text-lg mb-1">هل تحتاج دعماً شخصياً؟</h3>
                    <p className="text-white/50 text-sm">فريق "الله يعافيك" متاح للمساعدة والإرشاد</p>
                  </div>
                  <a href={`tel:${CONTACT_PHONE}`} className="btn-teal px-6 py-3 rounded-xl font-bold flex items-center gap-2 text-sm flex-shrink-0">
                    <Phone className="w-4 h-4" />
                    {CONTACT_PHONE}
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar - Table of Contents */}
          <div className="w-72 border-r border-white/5 overflow-y-auto p-5 flex-shrink-0">
            {/* Speaker Bio */}
            <div className="glass-card p-4 border border-white/7 mb-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center font-black text-xl" style={{ background: `${lecture.color}20`, color: lecture.color }}>
                  {lecture.speaker.split(" ").slice(-1)[0].charAt(0)}
                </div>
                <div>
                  <div className="text-white font-bold text-sm">{lecture.speaker}</div>
                  <div className="text-white/40 text-xs">{lecture.speakerTitle}</div>
                </div>
              </div>
              <p className="text-white/50 text-xs leading-relaxed">{lecture.speakerBio}</p>
              <div className="mt-3 pt-3 border-t border-white/5 flex items-center gap-2 text-white/30 text-xs">
                <Shield className="w-3.5 h-3.5" />
                <span>{lecture.institution}</span>
              </div>
            </div>

            {/* Progress */}
            <div className="glass-card p-4 border border-white/7 mb-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-white/50 text-xs">تقدم القراءة</span>
                <span className="text-[#00D4AA] font-black text-sm font-numbers">{readProgress}%</span>
              </div>
              <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                <div className="h-full rounded-full transition-all duration-300" style={{ width: `${readProgress}%`, background: `linear-gradient(to right, ${lecture.color}, #00D4AA)` }} />
              </div>
            </div>

            {/* TOC */}
            <div className="mb-5">
              <h4 className="text-white/40 text-xs font-bold mb-3 uppercase tracking-wider">المحتويات</h4>
              <div className="space-y-1.5">
                {lecture.sections.map((section, idx) => (
                  <button
                    key={idx}
                    onClick={() => { setExpandedSections(new Set([idx])); setActiveSection(idx); }}
                    className={`w-full text-right flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs transition-all ${
                      activeSection === idx ? "text-[#00D4AA] bg-[#00D4AA]/10" : "text-white/40 hover:text-white/70"
                    }`}
                  >
                    <div className="w-5 h-5 rounded flex items-center justify-center flex-shrink-0 text-xs font-black" style={{ background: activeSection === idx ? `${lecture.color}20` : "rgba(255,255,255,0.05)", color: activeSection === idx ? lecture.color : "rgba(255,255,255,0.3)" }}>
                      {idx + 1}
                    </div>
                    <span className="line-clamp-2 leading-snug">{section.title}</span>
                  </button>
                ))}
                <button
                  onClick={() => setQuizStarted(true)}
                  className="w-full text-right flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs text-white/40 hover:text-white/70 transition-all"
                >
                  <div className="w-5 h-5 rounded bg-[#8B5CF6]/10 flex items-center justify-center flex-shrink-0">
                    <Brain className="w-3 h-3 text-[#8B5CF6]" />
                  </div>
                  <span>الاختبار ({lecture.quiz.length} أسئلة)</span>
                </button>
              </div>
            </div>

            {/* Tags */}
            <div className="mb-5">
              <h4 className="text-white/40 text-xs font-bold mb-3 uppercase tracking-wider">الوسوم</h4>
              <div className="flex flex-wrap gap-1.5">
                {lecture.tags.map((tag, i) => (
                  <span key={i} className="badge-teal">{tag}</span>
                ))}
              </div>
            </div>

            {/* Rating & Recommendations */}
            <LectureRating lectureId={lecture.id} color={lecture.color} />
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
