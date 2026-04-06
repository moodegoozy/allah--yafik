/**
 * Achievements - صفحة الإنجازات والشهادات المحفوظة
 * Design: Dark Luxury Wellness - "الله يعافيك"
 * Features: شهادات مكتملة، إنجازات، إحصائيات التعلم، محاضرات مكتملة
 */
import { useState } from "react";
import { useLocation } from "wouter";
import Sidebar from "@/components/Sidebar";
import {
  Award, Star, BookOpen, Clock, Brain, CheckCircle2,
  Trophy, Target, Flame, TrendingUp, Medal, Crown,
  Sparkles, Shield, Heart, Zap, Users, Calendar,
  ChevronLeft, Download, Share2, Eye, Lock
} from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

const CONTACT_PHONE = "0546192019";

// بيانات وهمية للإنجازات
const completedLectures = [
  {
    id: "addiction-brain-science",
    title: "علم الأعصاب والإدمان",
    speaker: "د. عبدالرحمن الحارثي",
    score: 3,
    total: 3,
    date: "٢ مارس ٢٠٢٦",
    color: "#EF4444",
    category: "صحي",
    certId: "LLYK-2026-A3F9B2E4",
  },
  {
    id: "social-refusal-skills",
    title: "قل لا بثقة: مهارات الرفض الاجتماعي",
    speaker: "أ. سارة المطيري",
    score: 2,
    total: 3,
    date: "٤ مارس ٢٠٢٦",
    color: "#3B82F6",
    category: "نفسي",
    certId: "LLYK-2026-B7C1D5F2",
  },
  {
    id: "digital-addiction",
    title: "الإدمان الرقمي: الوباء الصامت",
    speaker: "د. أحمد الزهراني",
    score: 3,
    total: 3,
    date: "٥ مارس ٢٠٢٦",
    color: "#0EA5E9",
    category: "رقمي",
    certId: "LLYK-2026-C2E8A1B6",
  },
];

const allAchievements = [
  {
    id: 1,
    icon: BookOpen,
    title: "القارئ المبتدئ",
    desc: "أكمل أول محاضرة",
    color: "#00D4AA",
    unlocked: true,
    date: "٢ مارس ٢٠٢٦",
    xp: 50,
  },
  {
    id: 2,
    icon: Brain,
    title: "العقل الواعي",
    desc: "اجتز ٣ اختبارات بنجاح",
    color: "#8B5CF6",
    unlocked: true,
    date: "٥ مارس ٢٠٢٦",
    xp: 100,
  },
  {
    id: 3,
    icon: Flame,
    title: "المثابر",
    desc: "تعلّم ٣ أيام متتالية",
    color: "#EF4444",
    unlocked: true,
    date: "٥ مارس ٢٠٢٦",
    xp: 150,
  },
  {
    id: 4,
    icon: Trophy,
    title: "المتفوق",
    desc: "احصل على تقدير امتياز في محاضرة",
    color: "#F59E0B",
    unlocked: true,
    date: "٢ مارس ٢٠٢٦",
    xp: 200,
  },
  {
    id: 5,
    icon: Star,
    title: "النجم الصاعد",
    desc: "أكمل ٥ محاضرات",
    color: "#F59E0B",
    unlocked: false,
    date: null,
    xp: 250,
    progress: 3,
    target: 5,
  },
  {
    id: 6,
    icon: Crown,
    title: "الملك المتعلم",
    desc: "أكمل جميع محاضرات فئة عمرية",
    color: "#F59E0B",
    unlocked: false,
    date: null,
    xp: 500,
    progress: 3,
    target: 8,
  },
  {
    id: 7,
    icon: Heart,
    title: "السفير الصحي",
    desc: "شارك ٣ محاضرات مع الآخرين",
    color: "#EC4899",
    unlocked: false,
    date: null,
    xp: 200,
    progress: 1,
    target: 3,
  },
  {
    id: 8,
    icon: Shield,
    title: "الحارس المجتمعي",
    desc: "انضم لمجموعة دعم وشارك فيها",
    color: "#10B981",
    unlocked: false,
    date: null,
    xp: 300,
    progress: 0,
    target: 1,
  },
  {
    id: 9,
    icon: Zap,
    title: "السريع الفهم",
    desc: "أجب على ١٠ أسئلة صحيحة متتالية",
    color: "#F59E0B",
    unlocked: false,
    date: null,
    xp: 350,
    progress: 7,
    target: 10,
  },
  {
    id: 10,
    icon: Medal,
    title: "المعلم الأول",
    desc: "أكمل ١٠ محاضرات",
    color: "#8B5CF6",
    unlocked: false,
    date: null,
    xp: 1000,
    progress: 3,
    target: 10,
  },
];

const learningStats = [
  { label: "محاضرات مكتملة", value: "٣", icon: BookOpen, color: "#00D4AA" },
  { label: "ساعات تعلّم", value: "٢.٥", icon: Clock, color: "#3B82F6" },
  { label: "اختبارات ناجحة", value: "٣", icon: Brain, color: "#8B5CF6" },
  { label: "نقاط XP", value: "٥٠٠", icon: Zap, color: "#F59E0B" },
  { label: "إنجازات مفتوحة", value: "٤", icon: Trophy, color: "#EF4444" },
  { label: "أيام متتالية", value: "٣", icon: Flame, color: "#EC4899" },
];

export default function Achievements() {
  const [, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState<"achievements" | "certificates" | "stats">("achievements");

  const totalXP = allAchievements.filter(a => a.unlocked).reduce((sum, a) => sum + a.xp, 0);
  const level = Math.floor(totalXP / 200) + 1;
  const nextLevelXP = level * 200;
  const progressToNext = ((totalXP % 200) / 200) * 100;

  const handleShareCert = (cert: typeof completedLectures[0]) => {
    const text = `🎓 حصلت على شهادة إتمام محاضرة "${cert.title}" من برنامج الله يعافيك!\n\nرقم الشهادة: ${cert.certId}\n📞 0546192019`;
    navigator.clipboard.writeText(text);
    toast.success("تم نسخ الشهادة للمشاركة!");
  };

  return (
    <div className="min-h-screen bg-[#060B18] text-white flex">
      <Sidebar />
      <main className="flex-1 mr-64 overflow-y-auto">

        {/* Header */}
        <div className="relative overflow-hidden px-8 pt-10 pb-8 border-b border-white/5">
          <div className="orb orb-gold w-80 h-80 -top-20 -left-20 opacity-40" />
          <div className="orb orb-teal w-60 h-60 -bottom-10 -right-10 opacity-30" />
          <div className="relative z-10">
            <div className="flex items-start justify-between">
              <div>
                <div className="section-tag bg-[#F59E0B]/10 border border-[#F59E0B]/25 text-[#F59E0B] mb-3">
                  <Trophy className="w-3.5 h-3.5" />
                  مركز الإنجازات
                </div>
                <h1 className="text-4xl font-black text-white mb-2">
                  إنجازاتي
                  <span className="gradient-text-gold"> وشهاداتي</span>
                </h1>
                <p className="text-white/55 text-sm">تتبع تقدمك في رحلة التعلم والوقاية</p>
              </div>

              {/* Level Card */}
              <div className="glass-card p-5 border border-[#F59E0B]/25 min-w-48">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#F59E0B] to-[#FBBF24] flex items-center justify-center glow-gold">
                    <Crown className="w-6 h-6 text-[#060B18]" />
                  </div>
                  <div>
                    <div className="text-white/40 text-xs">المستوى الحالي</div>
                    <div className="text-white font-black text-xl">المستوى {level}</div>
                  </div>
                </div>
                <div className="mb-2">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-white/40">{totalXP} XP</span>
                    <span className="text-white/40">{nextLevelXP} XP</span>
                  </div>
                  <div className="h-2 bg-white/8 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{ width: `${progressToNext}%`, background: "linear-gradient(to right, #F59E0B, #FBBF24)" }}
                    />
                  </div>
                </div>
                <div className="text-white/30 text-xs text-center">{nextLevelXP - totalXP} XP للمستوى التالي</div>
              </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-6 gap-3 mt-6">
              {learningStats.map((stat, i) => (
                <div key={i} className="glass-card p-3 border border-white/5 text-center">
                  <stat.icon className="w-4 h-4 mx-auto mb-1.5" style={{ color: stat.color }} />
                  <div className="text-white font-black font-numbers">{stat.value}</div>
                  <div className="text-white/30 text-xs">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="px-8 pt-6">
          <div className="flex gap-2 mb-6">
            {[
              { id: "achievements", label: "الإنجازات", icon: Trophy, count: allAchievements.filter(a => a.unlocked).length },
              { id: "certificates", label: "الشهادات", icon: Award, count: completedLectures.length },
              { id: "stats", label: "إحصائيات التعلم", icon: TrendingUp, count: null },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
                  activeTab === tab.id
                    ? "bg-[#F59E0B]/15 text-[#F59E0B] border border-[#F59E0B]/30"
                    : "glass-card text-white/50 border border-white/7 hover:text-white/80"
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
                {tab.count !== null && (
                  <span className={`text-xs px-1.5 py-0.5 rounded-full font-numbers ${activeTab === tab.id ? "bg-[#F59E0B]/20 text-[#F59E0B]" : "bg-white/10 text-white/40"}`}>
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Achievements Tab */}
          {activeTab === "achievements" && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-bold">
                  {allAchievements.filter(a => a.unlocked).length} / {allAchievements.length} إنجاز مفتوح
                </h3>
                <div className="h-2 w-48 bg-white/8 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${(allAchievements.filter(a => a.unlocked).length / allAchievements.length) * 100}%`,
                      background: "linear-gradient(to right, #F59E0B, #FBBF24)"
                    }}
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 pb-8">
                {allAchievements.map((ach, i) => (
                  <motion.div
                    key={ach.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className={`glass-card p-5 border transition-all relative overflow-hidden ${
                      ach.unlocked
                        ? "border-white/10 hover:border-white/20"
                        : "border-white/5 opacity-60"
                    }`}
                  >
                    {ach.unlocked && (
                      <div className="absolute top-3 left-3">
                        <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
                      </div>
                    )}
                    {!ach.unlocked && (
                      <div className="absolute top-3 left-3">
                        <Lock className="w-4 h-4 text-white/20" />
                      </div>
                    )}

                    <div className="flex items-start gap-4">
                      <div
                        className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 ${ach.unlocked ? "" : "grayscale opacity-40"}`}
                        style={{ background: `${ach.color}20`, border: `1px solid ${ach.color}30` }}
                      >
                        <ach.icon className="w-7 h-7" style={{ color: ach.unlocked ? ach.color : "rgba(255,255,255,0.3)" }} />
                      </div>
                      <div className="flex-1">
                        <h4 className={`font-bold text-sm mb-1 ${ach.unlocked ? "text-white" : "text-white/40"}`}>{ach.title}</h4>
                        <p className="text-white/35 text-xs mb-2">{ach.desc}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-numbers" style={{ color: ach.unlocked ? ach.color : "rgba(255,255,255,0.2)" }}>
                            +{ach.xp} XP
                          </span>
                          {ach.unlocked && ach.date && (
                            <span className="text-white/25 text-xs">{ach.date}</span>
                          )}
                        </div>
                        {!ach.unlocked && ach.progress !== undefined && ach.target && (
                          <div className="mt-2">
                            <div className="flex justify-between text-xs text-white/25 mb-1">
                              <span>{ach.progress}/{ach.target}</span>
                              <span>{Math.round((ach.progress / ach.target) * 100)}%</span>
                            </div>
                            <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                              <div
                                className="h-full rounded-full"
                                style={{ width: `${(ach.progress / ach.target) * 100}%`, background: `${ach.color}60` }}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Certificates Tab */}
          {activeTab === "certificates" && (
            <div className="pb-8">
              {completedLectures.length === 0 ? (
                <div className="text-center py-16">
                  <Award className="w-16 h-16 text-white/10 mx-auto mb-4" />
                  <h3 className="text-white/40 font-bold">لا توجد شهادات بعد</h3>
                  <p className="text-white/25 text-sm mt-2">أكمل محاضرة واجتز اختبارها للحصول على شهادتك</p>
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
                    const percentage = Math.round((cert.score / cert.total) * 100);
                    const grade = percentage === 100 ? "امتياز" : percentage >= 80 ? "جيد جداً" : "جيد";
                    const gradeColor = percentage === 100 ? "#F59E0B" : percentage >= 80 ? "#00D4AA" : "#3B82F6";
                    return (
                      <motion.div
                        key={cert.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.1 }}
                        className="relative overflow-hidden rounded-2xl p-0.5"
                        style={{ background: `linear-gradient(135deg, ${cert.color}50, #00D4AA30)` }}
                      >
                        <div className="bg-[#0A0F1E] rounded-[14px] p-5">
                          {/* Header */}
                          <div className="flex items-center justify-between mb-4">
                            <div
                              className="w-10 h-10 rounded-xl flex items-center justify-center"
                              style={{ background: `${cert.color}20`, border: `1px solid ${cert.color}30` }}
                            >
                              <Award className="w-5 h-5" style={{ color: cert.color }} />
                            </div>
                            <span className="text-xs font-bold px-2 py-1 rounded-lg" style={{ background: `${gradeColor}15`, color: gradeColor }}>
                              {grade}
                            </span>
                          </div>

                          {/* Title */}
                          <h4 className="text-white font-black text-sm mb-1 leading-snug">{cert.title}</h4>
                          <p className="text-white/40 text-xs mb-4">{cert.speaker}</p>

                          {/* Score */}
                          <div className="flex items-center gap-3 mb-4">
                            <div className="flex-1 h-2 bg-white/8 rounded-full overflow-hidden">
                              <div
                                className="h-full rounded-full"
                                style={{ width: `${percentage}%`, background: `linear-gradient(to right, ${cert.color}, #00D4AA)` }}
                              />
                            </div>
                            <span className="text-white font-black font-numbers text-sm">{percentage}%</span>
                          </div>

                          {/* Details */}
                          <div className="flex items-center justify-between text-xs text-white/30 mb-4">
                            <span>{cert.date}</span>
                            <span className="font-numbers">{cert.certId.split("-").slice(-1)[0]}</span>
                          </div>

                          {/* Actions */}
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleShareCert(cert)}
                              className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold transition-all"
                              style={{ background: `${cert.color}12`, border: `1px solid ${cert.color}20`, color: cert.color }}
                            >
                              <Share2 className="w-3.5 h-3.5" />
                              مشاركة
                            </button>
                            <button
                              onClick={() => navigate(`/lectures/${cert.id}`)}
                              className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs glass-card border border-white/8 text-white/50 hover:text-white transition-all"
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
                    <div key={i} className="glass-card p-5 border border-white/5 opacity-40 relative overflow-hidden">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Lock className="w-8 h-8 text-white/20" />
                      </div>
                      <div className="blur-sm">
                        <div className="w-10 h-10 rounded-xl bg-white/5 mb-4" />
                        <div className="h-3 bg-white/5 rounded mb-2 w-3/4" />
                        <div className="h-2 bg-white/5 rounded mb-4 w-1/2" />
                        <div className="h-2 bg-white/5 rounded-full" />
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
              <div className="grid md:grid-cols-2 gap-5">
                {/* Weekly Progress */}
                <div className="glass-card p-5 border border-white/7">
                  <h4 className="text-white font-bold mb-4 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-[#00D4AA]" />
                    نشاط الأسبوع
                  </h4>
                  <div className="flex items-end gap-2 h-24">
                    {["أح", "إث", "ثل", "أر", "خم", "جم", "سب"].map((day, i) => {
                      const heights = [20, 60, 40, 80, 100, 30, 70];
                      return (
                        <div key={i} className="flex-1 flex flex-col items-center gap-1">
                          <div
                            className="w-full rounded-t-lg transition-all"
                            style={{ height: `${heights[i]}%`, background: i === 4 ? "linear-gradient(to top, #00D4AA, #0EA5E9)" : "rgba(255,255,255,0.08)" }}
                          />
                          <span className="text-white/30 text-xs">{day}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Category Distribution */}
                <div className="glass-card p-5 border border-white/7">
                  <h4 className="text-white font-bold mb-4 flex items-center gap-2">
                    <Target className="w-4 h-4 text-[#8B5CF6]" />
                    توزيع المحاضرات حسب الفئة
                  </h4>
                  <div className="space-y-3">
                    {[
                      { label: "صحي", value: 40, color: "#EF4444" },
                      { label: "نفسي", value: 30, color: "#3B82F6" },
                      { label: "رقمي", value: 20, color: "#0EA5E9" },
                      { label: "ديني", value: 10, color: "#F59E0B" },
                    ].map((cat, i) => (
                      <div key={i}>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-white/60">{cat.label}</span>
                          <span className="text-white/40 font-numbers">{cat.value}%</span>
                        </div>
                        <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full"
                            style={{ width: `${cat.value}%`, background: cat.color }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Learning Streak */}
                <div className="glass-card p-5 border border-[#EF4444]/20">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-[#EF4444]/20 flex items-center justify-center">
                      <Flame className="w-5 h-5 text-[#EF4444]" />
                    </div>
                    <div>
                      <h4 className="text-white font-bold">سلسلة التعلم</h4>
                      <p className="text-white/40 text-xs">استمر في التعلم يومياً</p>
                    </div>
                  </div>
                  <div className="text-5xl font-black text-[#EF4444] font-numbers mb-2">٣</div>
                  <p className="text-white/40 text-sm">أيام متتالية 🔥</p>
                  <div className="mt-4 flex gap-1.5">
                    {[...Array(7)].map((_, i) => (
                      <div
                        key={i}
                        className="flex-1 h-8 rounded-lg flex items-center justify-center text-xs"
                        style={{
                          background: i < 3 ? "#EF444420" : "rgba(255,255,255,0.04)",
                          border: `1px solid ${i < 3 ? "#EF444430" : "rgba(255,255,255,0.06)"}`,
                          color: i < 3 ? "#EF4444" : "rgba(255,255,255,0.2)"
                        }}
                      >
                        {i < 3 ? "✓" : "·"}
                      </div>
                    ))}
                  </div>
                </div>

                {/* CTA - محاضرات مقترحة */}
                <div className="glass-card p-5 border border-[#00D4AA]/20 relative overflow-hidden">
                  <div className="orb orb-teal w-40 h-40 -top-5 -right-5 opacity-30" />
                  <div className="relative z-10">
                    <h4 className="text-white font-bold mb-2 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-[#00D4AA]" />
                      محاضرة مقترحة لك
                    </h4>
                    <p className="text-white/50 text-xs mb-4">بناءً على اهتماماتك وتقدمك</p>
                    <div
                      className="p-3 rounded-xl mb-4 cursor-pointer hover:opacity-80 transition-opacity"
                      style={{ background: "#F59E0B10", border: "1px solid #F59E0B20" }}
                      onClick={() => navigate("/lectures/islam-addiction")}
                    >
                      <h5 className="text-white font-bold text-sm mb-1">الإدمان في ضوء الإسلام</h5>
                      <p className="text-white/40 text-xs">الشيخ د. عبدالله الراشد · ٦٠ دقيقة</p>
                    </div>
                    <button
                      onClick={() => navigate("/lectures")}
                      className="w-full btn-teal py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2"
                    >
                      <BookOpen className="w-4 h-4" />
                      استكشف المزيد
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
