/**
 * RehabPlan - نظام خطط التعافي التأهيلي
 * Design: Mobile-First PWA - "الله يعافيك"
 * Features: ٤ مراحل علمية، جدول يومي تفاعلي، تتبع التقدم، خطة مخصصة
 */
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";
import {
  ChevronLeft, ChevronRight, CheckCircle2, Circle,
  Clock, Star, AlertTriangle, TrendingUp, Calendar,
  Phone, Heart, Flame, Target, Award, BookOpen,
  ChevronDown, ChevronUp, Info, Play, Lock
} from "lucide-react";
import { rehabPhases, type RehabPhase, type PhaseId, motivationalQuotes } from "@/data/rehabData";
import { toast } from "sonner";

const CONTACT_PHONE = "0546192019";

// LocalStorage helpers
const getProgress = () => {
  try { return JSON.parse(localStorage.getItem("rehab_progress") || "{}"); } catch { return {}; }
};
const saveProgress = (data: Record<string, unknown>) => {
  localStorage.setItem("rehab_progress", JSON.stringify(data));
};

export default function RehabPlan() {
  const [, navigate] = useLocation();
  const [activePhase, setActivePhase] = useState<PhaseId>("awareness");
  const [completedTasks, setCompletedTasks] = useState<Record<string, boolean>>({});
  const [expandedTask, setExpandedTask] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"schedule" | "goals" | "signals" | "support">("schedule");
  const [dayCount, setDayCount] = useState(0);
  const [quote] = useState(() => motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)]);

  const phase = rehabPhases.find(p => p.id === activePhase)!;
  const phaseIndex = rehabPhases.findIndex(p => p.id === activePhase);

  useEffect(() => {
    const progress = getProgress();
    setCompletedTasks(progress.tasks || {});
    setDayCount(progress.dayCount || 0);
    const savedPhase = progress.currentPhase as PhaseId;
    if (savedPhase) setActivePhase(savedPhase);
  }, []);

  const toggleTask = (taskId: string) => {
    const updated = { ...completedTasks, [taskId]: !completedTasks[taskId] };
    setCompletedTasks(updated);
    const progress = getProgress();
    saveProgress({ ...progress, tasks: updated });
    if (!completedTasks[taskId]) {
      toast.success("أحسنت! تم إتمام المهمة ✅");
    }
  };

  const todayTasks = phase.dailySchedule;
  const completedToday = todayTasks.filter(t => completedTasks[`${activePhase}_${t.id}`]).length;
  const completionRate = Math.round((completedToday / todayTasks.length) * 100);

  const categoryColors: Record<string, string> = {
    awareness: "#00D4AA",
    psychological: "#8B5CF6",
    spiritual: "#F59E0B",
    social: "#10B981",
    physical: "#0EA5E9",
    skill: "#EC4899",
  };
  const categoryLabels: Record<string, string> = {
    awareness: "وعي",
    psychological: "نفسي",
    spiritual: "روحي",
    social: "اجتماعي",
    physical: "بدني",
    skill: "مهاري",
  };

  return (
    <div className="app-container bg-gradient-navy">
      {/* Ambient Orbs */}
      <div className="orb w-64 h-64 opacity-10 top-0 right-0" style={{ background: phase.color }} />
      <div className="orb w-48 h-48 opacity-5 bottom-40 left-0" style={{ background: "#0EA5E9" }} />

      {/* Header */}
      <div className="mobile-header px-4 py-3">
        <div className="flex items-center justify-between">
          <button onClick={() => navigate("/")} className="p-2 rounded-xl glass-card border border-white/8">
            <ChevronRight className="w-4 h-4 text-white/60" />
          </button>
          <div className="text-center">
            <h1 className="text-white font-black text-base">خطة الوقاية التأهيلية</h1>
            <p className="text-white/40 text-xs">اليوم {dayCount + 1} من رحلة الوقاية</p>
          </div>
          <a href={`tel:${CONTACT_PHONE}`} className="p-2 rounded-xl bg-[#EF4444]/15 border border-[#EF4444]/25">
            <Phone className="w-4 h-4 text-[#EF4444]" />
          </a>
        </div>
      </div>

      <div className="page-content overflow-y-auto">
        {/* Motivational Quote */}
        <div className="mx-4 mt-4 p-4 rounded-2xl glass-card border border-white/8">
          <p className="text-white/80 text-sm leading-relaxed text-center italic">"{quote.text}"</p>
          <p className="text-[#00D4AA] text-xs text-center mt-2 font-bold">— {quote.author}</p>
        </div>

        {/* Phase Selector */}
        <div className="px-4 mt-5">
          <h2 className="text-white/50 text-xs font-bold uppercase tracking-widest mb-3">مراحل التعافي الأربع</h2>
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {rehabPhases.map((p, idx) => {
              const isActive = p.id === activePhase;
              const isUnlocked = idx <= phaseIndex + 1;
              return (
                <motion.button
                  key={p.id}
                  whileTap={{ scale: 0.93 }}
                  onClick={() => {
                    if (isUnlocked) setActivePhase(p.id);
                    else toast.info("أكمل المرحلة الحالية أولاً");
                  }}
                  className={`flex-shrink-0 flex flex-col items-center gap-1.5 px-4 py-3 rounded-2xl border transition-all ${
                    isActive
                      ? "border-white/20 scale-105"
                      : isUnlocked
                        ? "border-white/8 glass-card"
                        : "border-white/5 opacity-40"
                  }`}
                  style={isActive ? { background: `${p.color}20`, borderColor: `${p.color}40` } : {}}
                >
                  <span className="text-xl">{p.icon}</span>
                  <span className={`text-xs font-black whitespace-nowrap ${isActive ? "text-white" : "text-white/50"}`}>
                    {p.title}
                  </span>
                  <span className={`text-[10px] whitespace-nowrap ${isActive ? "text-white/60" : "text-white/25"}`}>
                    {p.duration}
                  </span>
                  {!isUnlocked && <Lock className="w-3 h-3 text-white/25" />}
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Phase Overview Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activePhase}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="mx-4 mt-4"
          >
            <div className="rounded-3xl overflow-hidden border border-white/10" style={{ background: `${phase.color}12` }}>
              {/* Phase Header */}
              <div className="p-5" style={{ background: `linear-gradient(135deg, ${phase.color}20, ${phase.color}08)` }}>
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-2xl">{phase.icon}</span>
                      <span className="text-white/40 text-xs font-bold">المرحلة {phase.order}</span>
                    </div>
                    <h3 className="text-white font-black text-xl">{phase.title}</h3>
                    <p className="text-white/50 text-sm mt-0.5">{phase.subtitle}</p>
                  </div>
                  <div className="text-left">
                    <div className="text-white/30 text-xs mb-1">المدة</div>
                    <div className="font-black text-sm" style={{ color: phase.color }}>{phase.duration}</div>
                  </div>
                </div>
                <p className="text-white/60 text-sm leading-relaxed">{phase.description}</p>

                {/* Scientific Basis */}
                <div className="mt-3 p-3 rounded-xl bg-white/4 border border-white/8">
                  <div className="flex items-center gap-2 mb-1">
                    <BookOpen className="w-3.5 h-3.5" style={{ color: phase.color }} />
                    <span className="text-white/50 text-xs font-bold">الأساس العلمي</span>
                  </div>
                  <p className="text-white/40 text-xs leading-relaxed">{phase.scientificBasis}</p>
                </div>
              </div>

              {/* Today's Progress */}
              <div className="px-5 py-4 border-t border-white/8">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-white/60 text-sm font-bold">تقدم اليوم</span>
                  <span className="font-black text-sm" style={{ color: phase.color }}>{completedToday}/{todayTasks.length} مهمة</span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-white/8 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${completionRate}%` }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="h-full rounded-full"
                    style={{ background: phase.gradient }}
                  />
                </div>
                <div className="flex justify-between mt-1.5">
                  <span className="text-white/30 text-xs">{completionRate}% مكتمل</span>
                  {completionRate === 100 && (
                    <span className="text-[#10B981] text-xs font-bold flex items-center gap-1">
                      <Star className="w-3 h-3" /> يوم مثالي!
                    </span>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Tabs */}
        <div className="px-4 mt-5">
          <div className="flex gap-1 p-1 rounded-2xl glass-card border border-white/8">
            {[
              { id: "schedule", label: "الجدول" },
              { id: "goals", label: "الأهداف" },
              { id: "signals", label: "التحذيرات" },
              { id: "support", label: "الدعم" },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeTab === tab.id
                    ? "text-[#060B18]"
                    : "text-white/35"
                }`}
                style={activeTab === tab.id ? { background: phase.gradient } : {}}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="px-4 mt-4 pb-4">
          <AnimatePresence mode="wait">
            {/* Daily Schedule */}
            {activeTab === "schedule" && (
              <motion.div key="schedule" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-3">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-white font-black text-sm">الجدول اليومي</h3>
                  <span className="text-white/30 text-xs">{new Date().toLocaleDateString("ar-SA", { weekday: "long", day: "numeric", month: "long" })}</span>
                </div>
                {todayTasks.map((task, idx) => {
                  const taskKey = `${activePhase}_${task.id}`;
                  const isDone = completedTasks[taskKey];
                  const isExpanded = expandedTask === taskKey;
                  return (
                    <motion.div
                      key={task.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className={`rounded-2xl border transition-all ${
                        isDone ? "border-white/5 opacity-70" : "border-white/10 glass-card"
                      }`}
                      style={isDone ? { background: `${phase.color}08` } : {}}
                    >
                      <div
                        className="flex items-center gap-3 p-4 cursor-pointer"
                        onClick={() => setExpandedTask(isExpanded ? null : taskKey)}
                      >
                        {/* Time */}
                        <div className="flex-shrink-0 text-center w-12">
                          <div className="text-white/30 text-[10px]">{task.time}</div>
                        </div>

                        {/* Icon & Title */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-base">{task.icon}</span>
                            <div>
                              <div className={`font-bold text-sm ${isDone ? "text-white/40 line-through" : "text-white"}`}>
                                {task.title}
                              </div>
                              <div className="flex items-center gap-2 mt-0.5">
                                <span
                                  className="text-[10px] px-1.5 py-0.5 rounded-full font-bold"
                                  style={{
                                    background: `${categoryColors[task.category]}20`,
                                    color: categoryColors[task.category]
                                  }}
                                >
                                  {categoryLabels[task.category]}
                                </span>
                                <span className="text-white/25 text-[10px] flex items-center gap-0.5">
                                  <Clock className="w-2.5 h-2.5" /> {task.duration} د
                                </span>
                                {task.mandatory && (
                                  <span className="text-[#EF4444] text-[10px] font-bold">إلزامي</span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Checkbox */}
                        <button
                          onClick={(e) => { e.stopPropagation(); toggleTask(taskKey); }}
                          className="flex-shrink-0 p-1"
                        >
                          {isDone
                            ? <CheckCircle2 className="w-6 h-6" style={{ color: phase.color }} />
                            : <Circle className="w-6 h-6 text-white/20" />
                          }
                        </button>
                      </div>

                      {/* Expanded Description */}
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                          >
                            <div className="px-4 pb-4 border-t border-white/6 pt-3">
                              <p className="text-white/55 text-sm leading-relaxed">{task.description}</p>
                              {!isDone && (
                                <button
                                  onClick={() => toggleTask(taskKey)}
                                  className="mt-3 w-full py-2.5 rounded-xl font-bold text-sm text-[#060B18] transition-all active:scale-95"
                                  style={{ background: phase.gradient }}
                                >
                                  تم الإتمام ✓
                                </button>
                              )}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                })}
              </motion.div>
            )}

            {/* Weekly Goals */}
            {activeTab === "goals" && (
              <motion.div key="goals" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
                <h3 className="text-white font-black text-sm mb-3">أهداف المرحلة</h3>
                {phase.goals.map((goal, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.07 }}
                    className="flex items-start gap-3 p-4 rounded-2xl glass-card border border-white/8"
                  >
                    <div className="w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0 font-black text-sm text-[#060B18]" style={{ background: phase.gradient }}>
                      {idx + 1}
                    </div>
                    <p className="text-white/75 text-sm leading-relaxed">{goal}</p>
                  </motion.div>
                ))}

                <h3 className="text-white font-black text-sm mt-5 mb-3">الأهداف الأسبوعية القابلة للقياس</h3>
                {phase.weeklyGoals.map((goal, idx) => (
                  <motion.div
                    key={goal.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.07 }}
                    className="p-4 rounded-2xl glass-card border border-white/8"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white font-bold text-sm">{goal.title}</span>
                      <span className="font-black text-sm" style={{ color: phase.color }}>{goal.target} {goal.unit}</span>
                    </div>
                    <p className="text-white/40 text-xs">{goal.description}</p>
                    <div className="mt-3 w-full h-1.5 rounded-full bg-white/8">
                      <div className="h-full rounded-full w-0" style={{ background: phase.gradient }} />
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}

            {/* Warning Signals */}
            {activeTab === "signals" && (
              <motion.div key="signals" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-3">
                <div className="p-4 rounded-2xl bg-[#EF4444]/10 border border-[#EF4444]/20 mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="w-4 h-4 text-[#EF4444]" />
                    <span className="text-[#EF4444] font-black text-sm">إشارات التحذير المبكر</span>
                  </div>
                  <p className="text-white/50 text-xs">إذا لاحظت أي من هذه الإشارات، تواصل فوراً مع فريق الدعم</p>
                </div>
                {phase.warningSignals.map((signal, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.07 }}
                    className="flex items-start gap-3 p-4 rounded-2xl glass-card border border-[#EF4444]/15"
                  >
                    <div className="w-2 h-2 rounded-full bg-[#EF4444] mt-1.5 flex-shrink-0" />
                    <p className="text-white/70 text-sm leading-relaxed">{signal}</p>
                  </motion.div>
                ))}

                <div className="p-4 rounded-2xl bg-[#10B981]/10 border border-[#10B981]/20 mt-5">
                  <div className="flex items-center gap-2 mb-3">
                    <TrendingUp className="w-4 h-4 text-[#10B981]" />
                    <span className="text-[#10B981] font-black text-sm">مؤشرات النجاح</span>
                  </div>
                  {phase.successIndicators.map((indicator, idx) => (
                    <div key={idx} className="flex items-center gap-2 mb-2">
                      <CheckCircle2 className="w-4 h-4 text-[#10B981] flex-shrink-0" />
                      <p className="text-white/65 text-sm">{indicator}</p>
                    </div>
                  ))}
                </div>

                <a
                  href={`tel:${CONTACT_PHONE}`}
                  className="flex items-center justify-center gap-3 p-4 rounded-2xl mt-4 font-black text-[#060B18] active:scale-95 transition-transform"
                  style={{ background: "linear-gradient(135deg, #EF4444, #F97316)" }}
                >
                  <Phone className="w-5 h-5" />
                  اتصل الآن: {CONTACT_PHONE}
                </a>
              </motion.div>
            )}

            {/* Professional Support */}
            {activeTab === "support" && (
              <motion.div key="support" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-3">
                <h3 className="text-white font-black text-sm mb-3">الدعم المهني المطلوب</h3>
                {phase.professionalSupport.map((support, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.07 }}
                    className="flex items-center gap-3 p-4 rounded-2xl glass-card border border-white/8"
                  >
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${phase.color}20` }}>
                      <Heart className="w-4 h-4" style={{ color: phase.color }} />
                    </div>
                    <p className="text-white/75 text-sm">{support}</p>
                  </motion.div>
                ))}

                <h3 className="text-white font-black text-sm mt-5 mb-3">أدوات الرعاية الذاتية</h3>
                {phase.selfCareTools.map((tool, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.07 }}
                    className="flex items-center gap-3 p-4 rounded-2xl glass-card border border-white/8"
                  >
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 bg-[#00D4AA]/15">
                      <Target className="w-4 h-4 text-[#00D4AA]" />
                    </div>
                    <p className="text-white/75 text-sm">{tool}</p>
                  </motion.div>
                ))}

                {/* Contact Card */}
                <div className="mt-5 p-5 rounded-3xl border border-white/10 glass-card-strong">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#00D4AA] to-[#0EA5E9] flex items-center justify-center">
                      <Phone className="w-5 h-5 text-[#060B18]" />
                    </div>
                    <div>
                      <div className="text-white font-black text-sm">تواصل مع المشرف</div>
                      <div className="text-white/40 text-xs">متاح ٢٤/٧ للدعم الفوري</div>
                    </div>
                  </div>
                  <a
                    href={`tel:${CONTACT_PHONE}`}
                    className="flex items-center justify-center gap-2 w-full py-3.5 rounded-2xl font-black text-[#060B18] text-sm active:scale-95 transition-transform"
                    style={{ background: "linear-gradient(135deg, #00D4AA, #0EA5E9)" }}
                  >
                    <Phone className="w-4 h-4" />
                    {CONTACT_PHONE}
                  </a>
                  <p className="text-white/25 text-xs text-center mt-3">
                    يمكنك أيضاً التواصل عبر الدردشة المباشرة في التطبيق
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
