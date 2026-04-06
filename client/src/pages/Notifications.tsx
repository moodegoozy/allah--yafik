/**
 * Notifications - نظام الإشعارات والتذكيرات اليومية
 * Design: Dark Luxury Wellness - "الله يعافيك"
 * Features: جدولة تذكيرات، إشعارات مخصصة، سجل الإشعارات
 */
import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import {
  Bell, BellRing, Clock, Heart, Brain, Zap,
  Target, Moon, Sun, Sunrise, CheckCircle2,
  Plus, Trash2, Sparkles, Phone,
  BookOpen, Users, Shield, Volume2, VolumeX
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

const CONTACT_PHONE = "0546192019";

const reminderTypes = [
  { id: "morning", icon: Sunrise, label: "تذكير الصباح", desc: "ابدأ يومك بنية قوية", color: "#F59E0B", defaultTime: "07:00" },
  { id: "exercise", icon: Zap, label: "وقت التمرين", desc: "تمارين التنفس والتأمل", color: "#00D4AA", defaultTime: "08:30" },
  { id: "mood", icon: Heart, label: "تسجيل المزاج", desc: "كيف تشعر الآن؟", color: "#EC4899", defaultTime: "12:00" },
  { id: "lecture", icon: BookOpen, label: "محاضرة اليوم", desc: "تعلم شيئاً جديداً", color: "#3B82F6", defaultTime: "15:00" },
  { id: "community", icon: Users, label: "التواصل الاجتماعي", desc: "تحقق من مجتمع الدعم", color: "#8B5CF6", defaultTime: "17:00" },
  { id: "evening", icon: Moon, label: "مراجعة المساء", desc: "راجع إنجازات يومك", color: "#6366F1", defaultTime: "21:00" },
  { id: "danger", icon: Shield, label: "وقت الخطر الشخصي", desc: "تنبيه في أوقات الإغراء", color: "#EF4444", defaultTime: "22:00" },
  { id: "assessment", icon: Brain, label: "التقييم الأسبوعي", desc: "اختبار التقييم الشخصي", color: "#F59E0B", defaultTime: "10:00" },
];

const motivationalMessages = [
  { time: "الصباح", msg: "كل يوم جديد هو فرصة جديدة للنجاح. أنت قادر!", icon: Sunrise, color: "#F59E0B" },
  { time: "الظهر", msg: "منتصف اليوم! كيف حالك؟ تذكر أن تأخذ نفساً عميقاً.", icon: Sun, color: "#00D4AA" },
  { time: "المساء", msg: "أنهيت يوماً آخر بنجاح. افخر بنفسك!", icon: Moon, color: "#8B5CF6" },
];

const recentNotifications = [
  { id: 1, type: "exercise", title: "وقت التمرين!", msg: "حان وقت تمرين التنفس العميق ٤-٧-٨", time: "منذ ٢ ساعة", read: false, color: "#00D4AA" },
  { id: 2, type: "mood", title: "كيف حالك؟", msg: "لم تسجل مزاجك اليوم بعد. خذ دقيقة للتسجيل.", time: "منذ ٤ ساعات", read: false, color: "#EC4899" },
  { id: 3, type: "achievement", title: "إنجاز جديد! 🏆", msg: "مبروك! أكملت ٤٧ يوماً متواصلاً من التعافي", time: "أمس", read: true, color: "#F59E0B" },
  { id: 4, type: "lecture", title: "محاضرة جديدة متاحة", msg: "محاضرة 'الإدمان الرقمي: الوباء الصامت' متاحة الآن", time: "أمس", read: true, color: "#3B82F6" },
  { id: 5, type: "community", title: "رسالة دعم", msg: "أحمد م. أرسل لك رسالة تشجيع في مجتمع الدعم", time: "منذ يومين", read: true, color: "#8B5CF6" },
  { id: 6, type: "morning", title: "صباح الخير! ☀️", msg: "يوم جديد، فرصة جديدة. ابدأ بنية قوية وإيمان بالله.", time: "منذ يومين", read: true, color: "#F59E0B" },
];

interface Reminder {
  id: string;
  type: string;
  time: string;
  enabled: boolean;
  days: string[];
}

const allDays = ["السبت", "الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة"];

export default function Notifications() {
  const [reminders, setReminders] = useState<Reminder[]>([
    { id: "1", type: "morning", time: "07:00", enabled: true, days: ["السبت", "الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة"] },
    { id: "2", type: "exercise", time: "08:30", enabled: true, days: ["السبت", "الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس"] },
    { id: "3", type: "mood", time: "12:00", enabled: true, days: ["السبت", "الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة"] },
  ]);
  const [notifications, setNotifications] = useState(recentNotifications);
  const [activeTab, setActiveTab] = useState<"reminders" | "history" | "settings">("reminders");
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newReminder, setNewReminder] = useState({ type: "morning", time: "09:00", days: allDays });

  const unreadCount = notifications.filter(n => !n.read).length;

  const toggleReminder = (id: string) => {
    setReminders(prev => prev.map(r => r.id === id ? { ...r, enabled: !r.enabled } : r));
    toast.success("تم تحديث التذكير");
  };

  const deleteReminder = (id: string) => {
    setReminders(prev => prev.filter(r => r.id !== id));
    toast.success("تم حذف التذكير");
  };

  const addReminder = () => {
    const newR: Reminder = {
      id: Date.now().toString(),
      type: newReminder.type,
      time: newReminder.time,
      enabled: true,
      days: newReminder.days,
    };
    setReminders(prev => [...prev, newR]);
    setShowAddForm(false);
    toast.success("تم إضافة التذكير بنجاح!");
  };

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    toast.success("تم تعليم جميع الإشعارات كمقروءة");
  };

  const toggleDay = (day: string) => {
    setNewReminder(prev => ({
      ...prev,
      days: prev.days.includes(day) ? prev.days.filter(d => d !== day) : [...prev.days, day],
    }));
  };

  return (
    <div className="min-h-screen bg-[#060B18] text-white flex">
      <Sidebar />
      <main className="flex-1 mr-64 overflow-y-auto">

        {/* Header */}
        <div className="relative overflow-hidden px-8 pt-10 pb-8 border-b border-white/5">
          <div className="orb orb-gold w-72 h-72 -top-20 -left-20 opacity-30" />
          <div className="relative z-10 flex items-start justify-between">
            <div>
              <div className="section-tag bg-[#F59E0B]/10 border border-[#F59E0B]/25 text-[#F59E0B] mb-3">
                <Bell className="w-3.5 h-3.5" />
                الإشعارات والتذكيرات
              </div>
              <h1 className="text-4xl font-black text-white mb-2">
                نظام
                <span className="gradient-text-gold"> التذكيرات</span>
              </h1>
              <p className="text-white/55 text-sm">تذكيرات مخصصة تساعدك على البقاء في مسار التعافي</p>
            </div>
            {unreadCount > 0 && (
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#EF4444]/15 border border-[#EF4444]/25">
                <BellRing className="w-4 h-4 text-[#EF4444] animate-pulse" />
                <span className="text-[#EF4444] font-black text-sm">{unreadCount} إشعار جديد</span>
              </div>
            )}
          </div>
        </div>

        <div className="px-8 py-8">
          {/* Tabs */}
          <div className="flex gap-1 p-1 glass-card border border-white/8 rounded-2xl mb-7 w-fit">
            {[
              { id: "reminders", label: "التذكيرات", icon: Clock },
              { id: "history", label: "سجل الإشعارات", icon: Bell, badge: unreadCount },
              { id: "settings", label: "الإعدادات", icon: Zap },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all relative ${
                  activeTab === tab.id
                    ? "bg-[#00D4AA]/15 text-[#00D4AA] border border-[#00D4AA]/25"
                    : "text-white/40 hover:text-white/70"
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
                {tab.badge && tab.badge > 0 && (
                  <span className="absolute -top-1 -left-1 w-4 h-4 rounded-full bg-[#EF4444] text-white text-xs flex items-center justify-center font-numbers">
                    {tab.badge}
                  </span>
                )}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">

            {/* Reminders Tab */}
            {activeTab === "reminders" && (
              <motion.div key="reminders" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <div className="flex items-center justify-between mb-5">
                  <h3 className="text-white font-black">تذكيراتي ({reminders.length})</h3>
                  <button
                    onClick={() => setShowAddForm(true)}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm text-[#060B18] transition-all hover:scale-105"
                    style={{ background: "linear-gradient(135deg, #00D4AA, #0EA5E9)" }}
                  >
                    <Plus className="w-4 h-4" />
                    إضافة تذكير
                  </button>
                </div>

                <div className="space-y-3 mb-7">
                  {reminders.map(reminder => {
                    const type = reminderTypes.find(t => t.id === reminder.type)!;
                    return (
                      <motion.div
                        key={reminder.id}
                        layout
                        className={`glass-card p-4 border transition-all ${reminder.enabled ? "border-white/8" : "border-white/4 opacity-50"}`}
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: `${type.color}20` }}>
                            <type.icon className="w-5 h-5" style={{ color: type.color }} />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-0.5">
                              <span className="text-white font-bold text-sm">{type.label}</span>
                              <span className="text-white/40 text-xs font-numbers">{reminder.time}</span>
                            </div>
                            <div className="flex gap-1 flex-wrap">
                              {reminder.days.length === 7
                                ? <span className="text-white/35 text-xs">كل يوم</span>
                                : reminder.days.map(d => (
                                  <span key={d} className="text-white/35 text-xs">{d.slice(0, 3)}</span>
                                ))
                              }
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => toggleReminder(reminder.id)}
                              className={`w-11 h-6 rounded-full transition-all relative ${reminder.enabled ? "bg-[#00D4AA]" : "bg-white/10"}`}
                            >
                              <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all ${reminder.enabled ? "left-5.5" : "left-0.5"}`} />
                            </button>
                            <button
                              onClick={() => deleteReminder(reminder.id)}
                              className="w-8 h-8 rounded-lg glass-card border border-white/8 flex items-center justify-center text-white/30 hover:text-[#EF4444] transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>

                {/* Add Reminder Form */}
                <AnimatePresence>
                  {showAddForm && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="glass-card p-5 border border-[#00D4AA]/25 mb-7"
                    >
                      <h4 className="text-white font-bold mb-4 flex items-center gap-2">
                        <Plus className="w-4 h-4 text-[#00D4AA]" />
                        تذكير جديد
                      </h4>
                      <div className="space-y-4">
                        <div>
                          <label className="text-white/50 text-xs font-bold mb-2 block">نوع التذكير</label>
                          <div className="grid grid-cols-4 gap-2">
                            {reminderTypes.map(t => (
                              <button
                                key={t.id}
                                onClick={() => setNewReminder(prev => ({ ...prev, type: t.id }))}
                                className={`p-2.5 rounded-xl border text-center transition-all ${newReminder.type === t.id ? "text-white" : "glass-card border-white/8 text-white/40"}`}
                                style={newReminder.type === t.id ? { background: `${t.color}15`, borderColor: `${t.color}35` } : {}}
                              >
                                <t.icon className="w-4 h-4 mx-auto mb-1" style={{ color: newReminder.type === t.id ? t.color : undefined }} />
                                <span className="text-xs">{t.label.split(" ")[0]}</span>
                              </button>
                            ))}
                          </div>
                        </div>
                        <div>
                          <label className="text-white/50 text-xs font-bold mb-2 block">الوقت</label>
                          <input
                            type="time"
                            value={newReminder.time}
                            onChange={e => setNewReminder(prev => ({ ...prev, time: e.target.value }))}
                            className="bg-white/4 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-white/25 text-sm font-numbers"
                          />
                        </div>
                        <div>
                          <label className="text-white/50 text-xs font-bold mb-2 block">الأيام</label>
                          <div className="flex gap-2 flex-wrap">
                            {allDays.map(day => (
                              <button
                                key={day}
                                onClick={() => toggleDay(day)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${newReminder.days.includes(day) ? "bg-[#00D4AA]/15 text-[#00D4AA] border border-[#00D4AA]/30" : "glass-card border border-white/8 text-white/40"}`}
                              >
                                {day.slice(0, 3)}
                              </button>
                            ))}
                          </div>
                        </div>
                        <div className="flex gap-3">
                          <button onClick={() => setShowAddForm(false)} className="flex-1 py-2.5 rounded-xl glass-card border border-white/10 text-white/50 font-bold text-sm">إلغاء</button>
                          <button onClick={addReminder} className="flex-1 py-2.5 rounded-xl font-bold text-sm text-[#060B18]" style={{ background: "linear-gradient(135deg, #00D4AA, #0EA5E9)" }}>حفظ التذكير</button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Daily Messages */}
                <div className="glass-card p-5 border border-white/7">
                  <h4 className="text-white font-bold mb-4 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#00D4AA]" />
                    رسائل تحفيزية يومية
                  </h4>
                  <div className="space-y-3">
                    {motivationalMessages.map((msg, i) => (
                      <div key={i} className="flex items-start gap-3 p-3 rounded-xl" style={{ background: `${msg.color}08`, border: `1px solid ${msg.color}15` }}>
                        <msg.icon className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: msg.color }} />
                        <div>
                          <div className="text-white/40 text-xs mb-1">{msg.time}</div>
                          <p className="text-white/70 text-xs leading-relaxed">{msg.msg}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* History Tab */}
            {activeTab === "history" && (
              <motion.div key="history" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <div className="flex items-center justify-between mb-5">
                  <h3 className="text-white font-black">سجل الإشعارات</h3>
                  {unreadCount > 0 && (
                    <button onClick={markAllRead} className="text-[#00D4AA] text-sm font-bold hover:text-[#00D4AA]/70 transition-colors">
                      تعليم الكل كمقروء
                    </button>
                  )}
                </div>
                <div className="space-y-3">
                  {notifications.map(notif => {
                    const type = reminderTypes.find(t => t.id === notif.type);
                    const Icon = type?.icon || Bell;
                    return (
                      <motion.div
                        key={notif.id}
                        layout
                        className={`glass-card p-4 border transition-all ${!notif.read ? "border-white/12 bg-white/3" : "border-white/5"}`}
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${notif.color}20` }}>
                            <Icon className="w-5 h-5" style={{ color: notif.color }} />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-0.5">
                              <span className="text-white font-bold text-sm">{notif.title}</span>
                              {!notif.read && <div className="w-2 h-2 rounded-full bg-[#00D4AA]" />}
                            </div>
                            <p className="text-white/50 text-xs mb-1">{notif.msg}</p>
                            <span className="text-white/25 text-xs">{notif.time}</span>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* Settings Tab */}
            {activeTab === "settings" && (
              <motion.div key="settings" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <h3 className="text-white font-black mb-5">إعدادات الإشعارات</h3>
                <div className="space-y-3 mb-7">
                  {[
                    { label: "الصوت والاهتزاز", desc: "تشغيل صوت مع الإشعارات", state: soundEnabled, toggle: () => setSoundEnabled(!soundEnabled), icon: soundEnabled ? Volume2 : VolumeX, color: "#00D4AA" },
                    { label: "إشعارات الطوارئ", desc: "تنبيهات فورية في حالات الإغراء الشديد", state: true, toggle: () => toast.info("هذا الإعداد لا يمكن تعطيله لأسباب أمنية"), icon: Shield, color: "#EF4444" },
                    { label: "الرسائل التحفيزية", desc: "رسائل يومية ملهمة", state: true, toggle: () => {}, icon: Sparkles, color: "#F59E0B" },
                    { label: "إشعارات المجتمع", desc: "ردود ورسائل من مجتمع الدعم", state: true, toggle: () => {}, icon: Users, color: "#8B5CF6" },
                  ].map((setting, i) => (
                    <div key={i} className="glass-card p-4 border border-white/7 flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${setting.color}15` }}>
                        <setting.icon className="w-5 h-5" style={{ color: setting.color }} />
                      </div>
                      <div className="flex-1">
                        <div className="text-white font-bold text-sm">{setting.label}</div>
                        <div className="text-white/40 text-xs">{setting.desc}</div>
                      </div>
                      <button
                        onClick={setting.toggle}
                        className={`w-11 h-6 rounded-full transition-all relative flex-shrink-0 ${setting.state ? "bg-[#00D4AA]" : "bg-white/10"}`}
                      >
                        <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all ${setting.state ? "left-5.5" : "left-0.5"}`} />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Emergency Contact */}
                <div className="glass-card p-5 border border-[#00D4AA]/20">
                  <h4 className="text-white font-bold mb-2 flex items-center gap-2">
                    <Phone className="w-4 h-4 text-[#00D4AA]" />
                    خط الدعم الفوري
                  </h4>
                  <p className="text-white/45 text-xs mb-4">في حالات الطوارئ أو الإغراء الشديد، تواصل معنا فوراً</p>
                  <a
                    href={`tel:${CONTACT_PHONE}`}
                    className="flex items-center justify-center gap-2 py-3 rounded-xl font-black text-[#060B18] transition-all hover:scale-105"
                    style={{ background: "linear-gradient(135deg, #00D4AA, #0EA5E9)" }}
                  >
                    <Phone className="w-4 h-4" />
                    {CONTACT_PHONE}
                  </a>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
