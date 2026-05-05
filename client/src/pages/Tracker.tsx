/**
 * Tracker - التتبع الوقائي اليومي
 * Design: Dark Luxury Wellness - صون
 * الهدف: تتبع الوعي والأنشطة الوقائية اليومية
 */
import { useState } from "react";
import { toast } from "sonner";
import {
  Shield,
  Brain,
  Heart,
  BookOpen,
  CheckCircle,
  Save,
  Sun,
  Moon,
  Star,
  Zap,
  Users,
  AlertTriangle,
  Lightbulb,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const moods = [
  { emoji: "😊", label: "سعيد", value: 8 },
  { emoji: "😌", label: "هادئ", value: 7 },
  { emoji: "😐", label: "عادي", value: 5 },
  { emoji: "😔", label: "حزين", value: 3 },
  { emoji: "😤", label: "غاضب", value: 2 },
  { emoji: "😰", label: "قلق", value: 4 },
  { emoji: "🤩", label: "متحمس", value: 9 },
  { emoji: "😴", label: "متعب", value: 3 },
];

const riskFactors = [
  { label: "ضغط اجتماعي", icon: "👥" },
  { label: "فضول", icon: "🤔" },
  { label: "ملل", icon: "🥱" },
  { label: "وحدة", icon: "😶" },
  { label: "ضغط دراسي", icon: "📚" },
  { label: "مشاكل أسرية", icon: "👨‍👩‍👧" },
  { label: "أصدقاء سوء", icon: "⚠️" },
  { label: "فراغ وقت", icon: "⏰" },
];

const preventionActivities = [
  { label: "قرأت مقالاً توعوياً", icon: "📖", done: false },
  { label: "مارست تمرين الرفض", icon: "🛡️", done: false },
  { label: "أذكار الصباح", icon: "🕌", done: false },
  { label: "تواصلت مع صديق إيجابي", icon: "📞", done: false },
  { label: "مارست رياضة", icon: "🏃", done: false },
  { label: "تجنبت بيئة خطرة", icon: "🚫", done: false },
];

export default function Tracker() {
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [awarenessLevel, setAwarenessLevel] = useState(7);
  const [selectedRisks, setSelectedRisks] = useState<string[]>([]);
  const [activities, setActivities] = useState(preventionActivities);
  const [journalText, setJournalText] = useState("");
  const [saved, setSaved] = useState(false);

  const today = new Date().toLocaleDateString("ar-SA", {
    weekday: "long", year: "numeric", month: "long", day: "numeric"
  });

  const toggleRisk = (label: string) => {
    setSelectedRisks(prev =>
      prev.includes(label) ? prev.filter(r => r !== label) : [...prev, label]
    );
  };

  const toggleActivity = (idx: number) => {
    setActivities(prev => prev.map((a, i) =>
      i === idx ? { ...a, done: !a.done } : a
    ));
    toast.success("تم تسجيل النشاط الوقائي! 🎯");
  };

  const handleSave = () => {
    if (selectedMood === null) {
      toast.error("الرجاء اختيار حالتك المزاجية أولاً");
      return;
    }
    setSaved(true);
    toast.success("تم حفظ سجل اليوم الوقائي بنجاح! ✅");
  };

  const completedActivities = activities.filter(a => a.done).length;

  return (
    <div className="app-container bg-gradient-navy">
      <div className="orb w-64 h-64 opacity-8 -top-10 -left-10" style={{ background: "oklch(0.55 0.25 290)" }} />

      {/* Header */}
      <div className="mobile-header px-5 py-4">
        <div>
          <div className="text-primary text-xs font-bold uppercase tracking-wider mb-1">التتبع اليومي</div>
          <h1 className="text-foreground font-black text-xl">سجل وقايتي</h1>
          <p className="text-muted-foreground text-xs mt-0.5">{today}</p>
        </div>
      </div>

      <div className="page-content overflow-y-auto">

        {/* Daily Score */}
        <div className="px-4 mt-3">
          <div className="p-4 rounded-2xl border border-primary/20 bg-primary/8 flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-primary/15 flex items-center justify-center">
              <div className="text-center">
                <div className="text-primary font-black text-xl">{completedActivities}</div>
                <div className="text-muted-foreground text-[9px]">من ٦</div>
              </div>
            </div>
            <div>
              <div className="text-foreground font-black text-sm">أنشطة الوقاية اليوم</div>
              <div className="text-muted-foreground text-xs mt-0.5">
                {completedActivities === 0 ? "ابدأ يومك الوقائي الآن" :
                 completedActivities < 3 ? "استمر، أنت في الطريق الصحيح" :
                 completedActivities < 6 ? "رائع! تقدم ملحوظ" : "ممتاز! يوم وقائي مكتمل 🏆"}
              </div>
            </div>
          </div>
        </div>

        {/* Mood Picker */}
        <div className="px-4 mt-5">
          <h2 className="text-foreground font-black text-sm mb-3">كيف حالك اليوم؟</h2>
          <div className="grid grid-cols-4 gap-2">
            {moods.map((mood, idx) => (
              <motion.button
                key={idx}
                whileTap={{ scale: 0.9 }}
                onClick={() => setSelectedMood(idx)}
                className={cn(
                  "p-3 rounded-2xl flex flex-col items-center gap-1 border transition-all",
                  selectedMood === idx
                    ? "border-primary/50 bg-primary/15"
                    : "border-border glass-card"
                )}
              >
                <span className="text-2xl">{mood.emoji}</span>
                <span className={cn("text-[10px] font-bold", selectedMood === idx ? "text-primary" : "text-muted-foreground")}>
                  {mood.label}
                </span>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Awareness Level */}
        <div className="px-4 mt-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-foreground font-black text-sm">مستوى وعيك الوقائي اليوم</h2>
            <span className="text-primary font-black text-lg">{awarenessLevel}/١٠</span>
          </div>
          <input
            type="range"
            min={1}
            max={10}
            value={awarenessLevel}
            onChange={(e) => setAwarenessLevel(Number(e.target.value))}
            className="w-full h-2 rounded-full appearance-none cursor-pointer"
            style={{ background: `linear-gradient(to left, oklch(0.75 0.18 175) ${awarenessLevel * 10}%, var(--border) ${awarenessLevel * 10}%)` }}
          />
          <div className="flex justify-between text-muted-foreground/60 text-xs mt-1">
            <span>منخفض</span>
            <span>متوسط</span>
            <span>مرتفع</span>
          </div>
        </div>

        {/* Risk Factors Today */}
        <div className="px-4 mt-5">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="w-4 h-4 text-accent" />
            <h2 className="text-foreground font-black text-sm">هل واجهت أياً من هذه المخاطر اليوم؟</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {riskFactors.map((risk, idx) => (
              <motion.button
                key={idx}
                whileTap={{ scale: 0.92 }}
                onClick={() => toggleRisk(risk.label)}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-bold transition-all",
                  selectedRisks.includes(risk.label)
                    ? "border-destructive/50 bg-destructive/15 text-destructive"
                    : "border-border glass-card text-muted-foreground"
                )}
              >
                <span>{risk.icon}</span>
                <span>{risk.label}</span>
              </motion.button>
            ))}
          </div>
          {selectedRisks.length > 0 && (
            <div className="mt-2 p-3 rounded-xl bg-accent/10 border border-accent/20">
              <p className="text-accent text-xs">
                <span className="font-black">تنبيه وقائي:</span> واجهت {selectedRisks.length} عوامل خطر اليوم. راجع خطتك الوقائية وتواصل مع المجتمع.
              </p>
            </div>
          )}
        </div>

        {/* Prevention Activities */}
        <div className="px-4 mt-5">
          <h2 className="text-foreground font-black text-sm mb-3">أنشطة الوقاية المنجزة</h2>
          <div className="space-y-2">
            {activities.map((activity, idx) => (
              <motion.button
                key={idx}
                whileTap={{ scale: 0.97 }}
                onClick={() => toggleActivity(idx)}
                className={cn(
                  "w-full flex items-center gap-3 p-3 rounded-xl border transition-all text-right",
                  activity.done
                    ? "border-primary/30 bg-primary/8"
                    : "border-border glass-card"
                )}
              >
                <span className="text-xl">{activity.icon}</span>
                <span className={cn("flex-1 text-sm font-medium", activity.done ? "text-muted-foreground line-through" : "text-foreground/80")}>
                  {activity.label}
                </span>
                {activity.done
                  ? <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                  : <div className="w-5 h-5 rounded-full border-2 border-border flex-shrink-0" />
                }
              </motion.button>
            ))}
          </div>
        </div>

        {/* Journal */}
        <div className="px-4 mt-5">
          <h2 className="text-foreground font-black text-sm mb-3">يومية الوقاية</h2>
          <textarea
            value={journalText}
            onChange={(e) => setJournalText(e.target.value)}
            placeholder="اكتب أفكارك وملاحظاتك الوقائية اليوم... ماذا تعلمت؟ ما الذي ساعدك على الابتعاد عن المخاطر؟"
            className="w-full h-28 p-4 rounded-2xl glass-card border border-border text-foreground/80 text-sm resize-none outline-none focus:border-primary/40 placeholder:text-muted-foreground/50 bg-transparent leading-relaxed"
            dir="rtl"
          />
        </div>

        {/* Save Button */}
        <div className="px-4 mt-4 mb-4">
          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={handleSave}
            disabled={saved}
            className={cn(
              "w-full py-4 rounded-2xl font-black text-base flex items-center justify-center gap-2 transition-all",
              saved
                ? "bg-primary/20 text-primary border border-primary/30"
                : "text-primary-foreground"
            )}
            style={!saved ? { background: "linear-gradient(135deg, oklch(0.75 0.18 175), oklch(0.68 0.16 230))" } : {}}
          >
            {saved ? (
              <>
                <CheckCircle className="w-5 h-5" />
                تم حفظ سجل اليوم
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                حفظ السجل الوقائي
              </>
            )}
          </motion.button>
        </div>

      </div>
    </div>
  );
}
