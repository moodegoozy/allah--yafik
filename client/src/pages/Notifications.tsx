/**
 * Notifications - نظام الإشعارات والتذكيرات اليومية
 * Design: Dark Luxury Wellness - "صون"
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
      <div className="orb w-64 h-64 opacity-8 top-20 -left-20" style={{ background: "oklch(0.80 0.18 80)" }} />

      {/* Header */}
      <div className="mobile-header px-5 py-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-accent text-xs font-bold uppercase tracking-wider mb-1">
              الإشعارات والتذكيرات
            </div>
            <h1 className="text-foreground font-black text-xl">نظام التذكيرات</h1>
          </div>
          {unreadCount > 0 && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-destructive/15 border border-destructive/25">
              <BellRing className="w-3.5 h-3.5 text-destructive animate-pulse" />
              <span className="text-destructive font-black text-xs">{unreadCount}</span>
            </div>
          )}
        </div>
      </div>

      <div className="page-content overflow-y-auto">
        <div className="px-4 pt-3">
          {/* Tabs */}
          <div className="flex gap-1 p-1 glass-card border border-border rounded-2xl mb-5 overflow-x-auto">
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
                    ? "bg-primary/15 text-primary border border-primary/25"
                    : "text-muted-foreground hover:text-foreground/70"
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
                {tab.badge && tab.badge > 0 && (
                  <span className="absolute -top-1 -left-1 w-4 h-4 rounded-full bg-destructive text-foreground text-xs flex items-center justify-center font-numbers">
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
                  <h3 className="text-foreground font-black">
                    تذكيراتي ({reminders.length})
                  </h3>
                  <button
                    onClick={() => setShowAddForm(true)}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm text-primary-foreground transition-all hover:scale-105"
                    style={{
                      background: "linear-gradient(135deg, oklch(0.75 0.18 175), oklch(0.68 0.16 230))",
                    }}
                  >
                    <Plus className="w-4 h-4" />
                    إضافة تذكير
                  </button>
                </div>

                <div className="space-y-3 mb-7">
                  {reminders.length === 0 && (
                    <div className="text-center py-8 glass-card border border-border rounded-2xl">
                      <Clock className="w-10 h-10 text-muted-foreground/40 mx-auto mb-3" />
                      <p className="text-muted-foreground/70 text-sm">
                        لا توجد تذكيرات بعد
                      </p>
                      <p className="text-muted-foreground/60 text-xs mt-1">
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
                        className={`glass-card p-4 border transition-all ${reminder.enabled ? "border-border" : "border-border opacity-50"}`}
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
                              <span className="text-foreground font-bold text-sm">
                                {type.label}
                              </span>
                              <span className="text-muted-foreground text-xs font-numbers">
                                {reminder.time}
                              </span>
                            </div>
                            <div className="flex gap-1 flex-wrap">
                              {reminder.days.length === 7 ? (
                                <span className="text-muted-foreground/70 text-xs">
                                  كل يوم
                                </span>
                              ) : (
                                reminder.days.map(d => (
                                  <span
                                    key={d}
                                    className="text-muted-foreground/70 text-xs"
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
                              className={`w-11 h-6 rounded-full transition-all relative ${reminder.enabled ? "bg-primary" : "bg-secondary"}`}
                            >
                              <div
                                className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all ${reminder.enabled ? "left-5.5" : "left-0.5"}`}
                              />
                            </button>
                            <button
                              onClick={() => deleteReminder(reminder.id)}
                              className="w-8 h-8 rounded-lg glass-card border border-border flex items-center justify-center text-muted-foreground/70 hover:text-destructive transition-colors"
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
                      className="glass-card p-5 border border-primary/25 mb-7"
                    >
                      <h4 className="text-foreground font-bold mb-4 flex items-center gap-2">
                        <Plus className="w-4 h-4 text-primary" />
                        تذكير جديد
                      </h4>
                      <div className="space-y-4">
                        <div>
                          <label className="text-muted-foreground text-xs font-bold mb-2 block">
                            نوع التذكير
                          </label>
                          {reminderTypes.length === 0 ? (
                            <p className="text-muted-foreground/70 text-xs">
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
                                  className={`p-2.5 rounded-xl border text-center transition-all ${newReminder.type === t.id ? "text-foreground" : "glass-card border-border text-muted-foreground"}`}
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
                          <label className="text-muted-foreground text-xs font-bold mb-2 block">
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
                            className="bg-secondary/50 border border-border rounded-xl p-3 text-foreground focus:outline-none focus:border-border text-sm font-numbers"
                          />
                        </div>
                        <div>
                          <label className="text-muted-foreground text-xs font-bold mb-2 block">
                            الأيام
                          </label>
                          <div className="flex gap-2 flex-wrap">
                            {allDays.map(day => (
                              <button
                                key={day}
                                onClick={() => toggleDay(day)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${newReminder.days.includes(day) ? "bg-primary/15 text-primary border border-primary/30" : "glass-card border border-border text-muted-foreground"}`}
                              >
                                {day.slice(0, 3)}
                              </button>
                            ))}
                          </div>
                        </div>
                        <div className="flex gap-3">
                          <button
                            onClick={() => setShowAddForm(false)}
                            className="flex-1 py-2.5 rounded-xl glass-card border border-border text-muted-foreground font-bold text-sm"
                          >
                            إلغاء
                          </button>
                          <button
                            onClick={addReminder}
                            className="flex-1 py-2.5 rounded-xl font-bold text-sm text-primary-foreground"
                            style={{
                              background:
                                "linear-gradient(135deg, oklch(0.75 0.18 175), oklch(0.68 0.16 230))",
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
                  <div className="glass-card p-5 border border-border">
                    <h4 className="text-foreground font-bold mb-4 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-primary" />
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
                            <div className="text-muted-foreground text-xs mb-1">
                              {msg.time}
                            </div>
                            <p className="text-foreground/70 text-xs leading-relaxed">
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
                  <h3 className="text-foreground font-black">سجل الإشعارات</h3>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllRead}
                      className="text-primary text-sm font-bold hover:text-primary/70 transition-colors"
                    >
                      تعليم الكل كمقروء
                    </button>
                  )}
                </div>
                <div className="space-y-3">
                  {notifications.length === 0 && (
                    <div className="text-center py-12">
                      <Bell className="w-10 h-10 text-muted-foreground/40 mx-auto mb-3" />
                      <p className="text-muted-foreground/70 text-sm">
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
                        className={`glass-card p-4 border transition-all ${!notif.read ? "border-border bg-secondary/40" : "border-border"}`}
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
                              <span className="text-foreground font-bold text-sm">
                                {notif.title}
                              </span>
                              {!notif.read && (
                                <div className="w-2 h-2 rounded-full bg-primary" />
                              )}
                            </div>
                            <p className="text-muted-foreground text-xs mb-1">
                              {notif.msg}
                            </p>
                            <span className="text-muted-foreground/60 text-xs">
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
                <h3 className="text-foreground font-black mb-5">
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
                      className="glass-card p-4 border border-border flex items-center gap-4"
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
                        <div className="text-foreground font-bold text-sm">
                          {setting.label}
                        </div>
                        <div className="text-muted-foreground text-xs">
                          {setting.desc}
                        </div>
                      </div>
                      <button
                        onClick={setting.toggle}
                        className={`w-11 h-6 rounded-full transition-all relative flex-shrink-0 ${setting.state ? "bg-primary" : "bg-secondary"}`}
                      >
                        <div
                          className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all ${setting.state ? "left-5.5" : "left-0.5"}`}
                        />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Emergency Contact */}
                <div className="glass-card p-5 border border-primary/20">
                  <h4 className="text-foreground font-bold mb-2 flex items-center gap-2">
                    <Phone className="w-4 h-4 text-primary" />
                    خط الدعم الفوري
                  </h4>
                  <p className="text-muted-foreground text-xs mb-4">
                    في حالات الطوارئ أو الإغراء الشديد، تواصل معنا فوراً
                  </p>
                  <a
                    href={`tel:${CONTACT_PHONE}`}
                    className="flex items-center justify-center gap-2 py-3 rounded-xl font-black text-primary-foreground transition-all hover:scale-105"
                    style={{
                      background: "linear-gradient(135deg, oklch(0.75 0.18 175), oklch(0.68 0.16 230))",
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
