/**
 * Notifications - نظام الإشعارات والتذكيرات اليومية
 * Design: Dark Luxury Wellness - "الله يعافيك"
 * Features: جدولة تذكيرات، إشعارات مخصصة، سجل الإشعارات
 */
import { useState } from "react";
import {
  Bell,
  BellRing,
  Clock,
  Heart,
  Brain,
  Zap,
  Target,
  Moon,
  Sun,
  Sunrise,
  CheckCircle2,
  Plus,
  Trash2,
  Sparkles,
  Phone,
  BookOpen,
  Users,
  Shield,
  Volume2,
  VolumeX,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

const CONTACT_PHONE = "0546192019";

// Mock data removed — see git history to restore
const reminderTypes: {
  id: string;
  icon: typeof Bell;
  label: string;
  desc: string;
  color: string;
  defaultTime: string;
}[] = [];

// Mock data removed — see git history to restore
const motivationalMessages: {
  time: string;
  msg: string;
  icon: typeof Bell;
  color: string;
}[] = [];

// Mock data removed — see git history to restore
const recentNotifications: {
  id: number;
  type: string;
  title: string;
  msg: string;
  time: string;
  read: boolean;
  color: string;
}[] = [];

interface Reminder {
  id: string;
  type: string;
  time: string;
  enabled: boolean;
  days: string[];
}

const allDays = [
  "السبت",
  "الأحد",
  "الاثنين",
  "الثلاثاء",
  "الأربعاء",
  "الخميس",
  "الجمعة",
];

export default function Notifications() {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [notifications, setNotifications] = useState(recentNotifications);
  const [activeTab, setActiveTab] = useState<
    "reminders" | "history" | "settings"
  >("reminders");
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newReminder, setNewReminder] = useState({
    type: "morning",
    time: "09:00",
    days: allDays,
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  const toggleReminder = (id: string) => {
    setReminders(prev =>
      prev.map(r => (r.id === id ? { ...r, enabled: !r.enabled } : r))
    );
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
      days: prev.days.includes(day)
        ? prev.days.filter(d => d !== day)
        : [...prev.days, day],
    }));
  };

  return (
    <div className="app-container bg-gradient-navy overflow-hidden">
      <div className="orb w-64 h-64 opacity-8 top-20 -left-20" style={{ background: "#F59E0B" }} />

      {/* Header */}
      <div className="mobile-header px-5 py-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-[#F59E0B] text-xs font-bold uppercase tracking-wider mb-1">
              الإشعارات والتذكيرات
            </div>
            <h1 className="text-white font-black text-xl">نظام التذكيرات</h1>
          </div>
          {unreadCount > 0 && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#EF4444]/15 border border-[#EF4444]/25">
              <BellRing className="w-3.5 h-3.5 text-[#EF4444] animate-pulse" />
              <span className="text-[#EF4444] font-black text-xs">{unreadCount}</span>
            </div>
          )}
        </div>
      </div>

      <div className="page-content overflow-y-auto">
        <div className="px-4 pt-3">
          {/* Tabs */}
          <div className="flex gap-1 p-1 glass-card border border-white/8 rounded-2xl mb-5 overflow-x-auto">
            {[
              { id: "reminders", label: "التذكيرات", icon: Clock },
              {
                id: "history",
                label: "سجل الإشعارات",
                icon: Bell,
                badge: unreadCount,
              },
              { id: "settings", label: "الإعدادات", icon: Zap },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-all relative ${
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
              <motion.div
                key="reminders"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                <div className="flex items-center justify-between mb-5">
                  <h3 className="text-white font-black">
                    تذكيراتي ({reminders.length})
                  </h3>
                  <button
                    onClick={() => setShowAddForm(true)}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm text-[#060B18] transition-all hover:scale-105"
                    style={{
                      background: "linear-gradient(135deg, #00D4AA, #0EA5E9)",
                    }}
                  >
                    <Plus className="w-4 h-4" />
                    إضافة تذكير
                  </button>
                </div>

                <div className="space-y-3 mb-7">
                  {reminders.length === 0 && (
                    <div className="text-center py-8 glass-card border border-white/8 rounded-2xl">
                      <Clock className="w-10 h-10 text-white/10 mx-auto mb-3" />
                      <p className="text-white/30 text-sm">
                        لا توجد تذكيرات بعد
                      </p>
                      <p className="text-white/20 text-xs mt-1">
                        أضف تذكيراً لمساعدتك في رحلة التعافي
                      </p>
                    </div>
                  )}
                  {reminders.map(reminder => {
                    const type = reminderTypes.find(
                      t => t.id === reminder.type
                    );
                    if (!type) return null;
                    return (
                      <motion.div
                        key={reminder.id}
                        layout
                        className={`glass-card p-4 border transition-all ${reminder.enabled ? "border-white/8" : "border-white/4 opacity-50"}`}
                      >
                        <div className="flex items-center gap-4">
                          <div
                            className="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0"
                            style={{ background: `${type.color}20` }}
                          >
                            <type.icon
                              className="w-5 h-5"
                              style={{ color: type.color }}
                            />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-0.5">
                              <span className="text-white font-bold text-sm">
                                {type.label}
                              </span>
                              <span className="text-white/40 text-xs font-numbers">
                                {reminder.time}
                              </span>
                            </div>
                            <div className="flex gap-1 flex-wrap">
                              {reminder.days.length === 7 ? (
                                <span className="text-white/35 text-xs">
                                  كل يوم
                                </span>
                              ) : (
                                reminder.days.map(d => (
                                  <span
                                    key={d}
                                    className="text-white/35 text-xs"
                                  >
                                    {d.slice(0, 3)}
                                  </span>
                                ))
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => toggleReminder(reminder.id)}
                              className={`w-11 h-6 rounded-full transition-all relative ${reminder.enabled ? "bg-[#00D4AA]" : "bg-white/10"}`}
                            >
                              <div
                                className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all ${reminder.enabled ? "left-5.5" : "left-0.5"}`}
                              />
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
                          <label className="text-white/50 text-xs font-bold mb-2 block">
                            نوع التذكير
                          </label>
                          {reminderTypes.length === 0 ? (
                            <p className="text-white/30 text-xs">
                              لا توجد أنواع تذكيرات متاحة حالياً
                            </p>
                          ) : (
                            <div className="grid grid-cols-3 gap-2">
                              {reminderTypes.map(t => (
                                <button
                                  key={t.id}
                                  onClick={() =>
                                    setNewReminder(prev => ({
                                      ...prev,
                                      type: t.id,
                                    }))
                                  }
                                  className={`p-2.5 rounded-xl border text-center transition-all ${newReminder.type === t.id ? "text-white" : "glass-card border-white/8 text-white/40"}`}
                                  style={
                                    newReminder.type === t.id
                                      ? {
                                          background: `${t.color}15`,
                                          borderColor: `${t.color}35`,
                                        }
                                      : {}
                                  }
                                >
                                  <t.icon
                                    className="w-4 h-4 mx-auto mb-1"
                                    style={{
                                      color:
                                        newReminder.type === t.id
                                          ? t.color
                                          : undefined,
                                    }}
                                  />
                                  <span className="text-xs">
                                    {t.label.split(" ")[0]}
                                  </span>
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                        <div>
                          <label className="text-white/50 text-xs font-bold mb-2 block">
                            الوقت
                          </label>
                          <input
                            type="time"
                            value={newReminder.time}
                            onChange={e =>
                              setNewReminder(prev => ({
                                ...prev,
                                time: e.target.value,
                              }))
                            }
                            className="bg-white/4 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-white/25 text-sm font-numbers"
                          />
                        </div>
                        <div>
                          <label className="text-white/50 text-xs font-bold mb-2 block">
                            الأيام
                          </label>
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
                          <button
                            onClick={() => setShowAddForm(false)}
                            className="flex-1 py-2.5 rounded-xl glass-card border border-white/10 text-white/50 font-bold text-sm"
                          >
                            إلغاء
                          </button>
                          <button
                            onClick={addReminder}
                            className="flex-1 py-2.5 rounded-xl font-bold text-sm text-[#060B18]"
                            style={{
                              background:
                                "linear-gradient(135deg, #00D4AA, #0EA5E9)",
                            }}
                          >
                            حفظ التذكير
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Daily Messages */}
                {motivationalMessages.length > 0 && (
                  <div className="glass-card p-5 border border-white/7">
                    <h4 className="text-white font-bold mb-4 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-[#00D4AA]" />
                      رسائل تحفيزية يومية
                    </h4>
                    <div className="space-y-3">
                      {motivationalMessages.map((msg, i) => (
                        <div
                          key={i}
                          className="flex items-start gap-3 p-3 rounded-xl"
                          style={{
                            background: `${msg.color}08`,
                            border: `1px solid ${msg.color}15`,
                          }}
                        >
                          <msg.icon
                            className="w-4 h-4 mt-0.5 flex-shrink-0"
                            style={{ color: msg.color }}
                          />
                          <div>
                            <div className="text-white/40 text-xs mb-1">
                              {msg.time}
                            </div>
                            <p className="text-white/70 text-xs leading-relaxed">
                              {msg.msg}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* History Tab */}
            {activeTab === "history" && (
              <motion.div
                key="history"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                <div className="flex items-center justify-between mb-5">
                  <h3 className="text-white font-black">سجل الإشعارات</h3>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllRead}
                      className="text-[#00D4AA] text-sm font-bold hover:text-[#00D4AA]/70 transition-colors"
                    >
                      تعليم الكل كمقروء
                    </button>
                  )}
                </div>
                <div className="space-y-3">
                  {notifications.length === 0 && (
                    <div className="text-center py-12">
                      <Bell className="w-10 h-10 text-white/10 mx-auto mb-3" />
                      <p className="text-white/30 text-sm">
                        لا توجد إشعارات بعد
                      </p>
                    </div>
                  )}
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
                          <div
                            className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                            style={{ background: `${notif.color}20` }}
                          >
                            <Icon
                              className="w-5 h-5"
                              style={{ color: notif.color }}
                            />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-0.5">
                              <span className="text-white font-bold text-sm">
                                {notif.title}
                              </span>
                              {!notif.read && (
                                <div className="w-2 h-2 rounded-full bg-[#00D4AA]" />
                              )}
                            </div>
                            <p className="text-white/50 text-xs mb-1">
                              {notif.msg}
                            </p>
                            <span className="text-white/25 text-xs">
                              {notif.time}
                            </span>
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
              <motion.div
                key="settings"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                <h3 className="text-white font-black mb-5">
                  إعدادات الإشعارات
                </h3>
                <div className="space-y-3 mb-7">
                  {[
                    {
                      label: "الصوت والاهتزاز",
                      desc: "تشغيل صوت مع الإشعارات",
                      state: soundEnabled,
                      toggle: () => setSoundEnabled(!soundEnabled),
                      icon: soundEnabled ? Volume2 : VolumeX,
                      color: "#00D4AA",
                    },
                    {
                      label: "إشعارات الطوارئ",
                      desc: "تنبيهات فورية في حالات الإغراء الشديد",
                      state: true,
                      toggle: () =>
                        toast.info("هذا الإعداد لا يمكن تعطيله لأسباب أمنية"),
                      icon: Shield,
                      color: "#EF4444",
                    },
                    {
                      label: "الرسائل التحفيزية",
                      desc: "رسائل يومية ملهمة",
                      state: true,
                      toggle: () => {},
                      icon: Sparkles,
                      color: "#F59E0B",
                    },
                    {
                      label: "إشعارات المجتمع",
                      desc: "ردود ورسائل من مجتمع الدعم",
                      state: true,
                      toggle: () => {},
                      icon: Users,
                      color: "#8B5CF6",
                    },
                  ].map((setting, i) => (
                    <div
                      key={i}
                      className="glass-card p-4 border border-white/7 flex items-center gap-4"
                    >
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center"
                        style={{ background: `${setting.color}15` }}
                      >
                        <setting.icon
                          className="w-5 h-5"
                          style={{ color: setting.color }}
                        />
                      </div>
                      <div className="flex-1">
                        <div className="text-white font-bold text-sm">
                          {setting.label}
                        </div>
                        <div className="text-white/40 text-xs">
                          {setting.desc}
                        </div>
                      </div>
                      <button
                        onClick={setting.toggle}
                        className={`w-11 h-6 rounded-full transition-all relative flex-shrink-0 ${setting.state ? "bg-[#00D4AA]" : "bg-white/10"}`}
                      >
                        <div
                          className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all ${setting.state ? "left-5.5" : "left-0.5"}`}
                        />
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
                  <p className="text-white/45 text-xs mb-4">
                    في حالات الطوارئ أو الإغراء الشديد، تواصل معنا فوراً
                  </p>
                  <a
                    href={`tel:${CONTACT_PHONE}`}
                    className="flex items-center justify-center gap-2 py-3 rounded-xl font-black text-[#060B18] transition-all hover:scale-105"
                    style={{
                      background: "linear-gradient(135deg, #00D4AA, #0EA5E9)",
                    }}
                  >
                    <Phone className="w-4 h-4" />
                    {CONTACT_PHONE}
                  </a>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
