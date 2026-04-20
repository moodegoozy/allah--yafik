/**
 * Home - الصفحة الرئيسية
 * Design: Mobile-First PWA Dark Luxury - "الله يعافيك"
 * الهدف: الوقاية من الإدمان قبل الوقوع فيه
 */
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import {
  BookOpen, MessageCircle, BarChart3,
  Phone, Star, ChevronLeft,
  Shield, Users, Award, Brain,
  Heart, Lightbulb, Bell, FileText,
  Settings,
} from "lucide-react";
import { toast } from "sonner";

const CONTACT_PHONE = "0546192019";

const preventionQuotes = [
  { text: "الوقاية خير من ألف علاج — حصّن نفسك قبل أن تحتاج للعلاج", author: "برنامج الله يعافيك" },
  { text: "العلم بالمخاطر هو أول خطوة في طريق الوقاية", author: "منظمة الصحة العالمية" },
  { text: "مَن عرف الخطر تجنّبه، ومَن جهله وقع فيه", author: "حكمة عربية" },
  { text: "قُل: رَبِّ أَعُوذُ بِكَ مِنْ هَمَزَاتِ الشَّيَاطِينِ", author: "القرآن الكريم" },
  { text: "قوة الإرادة تُبنى بالتدريج — ابدأ اليوم قبل أن تحتاجها غداً", author: "د. أحمد الشمري" },
  { text: "الشباب الواعي هو درع المجتمع ضد الإدمان", author: "برنامج الله يعافيك" },
];

const quickActions = [
  { icon: Shield, label: "الوقاية", sublabel: "خطتي الوقائية", path: "/recovery", color: "#00D4AA", bg: "from-[#00D4AA]/20 to-[#0EA5E9]/10" },
  { icon: Brain, label: "تقييمي", sublabel: "مستوى الخطر", path: "/assessment", color: "#8B5CF6", bg: "from-[#8B5CF6]/20 to-[#3B82F6]/10" },
  { icon: BookOpen, label: "محاضرات", sublabel: "توعية علمية", path: "/lectures", color: "#F59E0B", bg: "from-[#F59E0B]/20 to-[#EF4444]/10" },
  { icon: MessageCircle, label: "دردشة", sublabel: "استشارة فورية", path: "/chat", color: "#10B981", bg: "from-[#10B981]/20 to-[#059669]/10" },
  { icon: Users, label: "مجتمع", sublabel: "قصص وعي", path: "/community", color: "#EC4899", bg: "from-[#EC4899]/20 to-[#F97316]/10" },
  { icon: BarChart3, label: "إحصائيات", sublabel: "بيانات وطنية", path: "/statistics", color: "#0EA5E9", bg: "from-[#0EA5E9]/20 to-[#6366F1]/10" },
];

const preventionPillars = [
  { icon: "🧠", title: "الوعي الذاتي", desc: "اعرف مخاطر الإدمان قبل التعرض لها", color: "#8B5CF6" },
  { icon: "💪", title: "مهارات الرفض", desc: "قل لا بثقة في المواقف الصعبة", color: "#00D4AA" },
  { icon: "🕌", title: "التحصين الديني", desc: "القرآن والسنة درع واقٍ قوي", color: "#F59E0B" },
  { icon: "👨‍👩‍👧", title: "دعم الأسرة", desc: "الأسرة الواعية تحمي أبناءها", color: "#EC4899" },
];

const partnerTypes = [
  { icon: "🏥", label: "مستشفيات", desc: "دعم صحي", color: "#EF4444" },
  { icon: "🎓", label: "جامعات", desc: "دعم أكاديمي", color: "#8B5CF6" },
  { icon: "⚔️", label: "عسكري", desc: "دعم أمني", color: "#0EA5E9" },
  { icon: "🕌", label: "ديني", desc: "توعية دينية", color: "#F59E0B" },
  { icon: "🚔", label: "مكافحة المخدرات", desc: "إحصائيات", color: "#10B981" },
];

export default function Home() {
  const [quote] = useState(() => preventionQuotes[Math.floor(Math.random() * preventionQuotes.length)]);
  const [greeting, setGreeting] = useState("");
  const [userName, setUserName] = useState("");
  const [riskScore] = useState(() => {
    try {
      const raw = localStorage.getItem("allah_yafik_current_user");
      if (raw) {
        const user = JSON.parse(raw);
        if (user.testResult?.total != null) return user.testResult.total;
      }
      return null;
    } catch { return null; }
  });

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("صباح النور");
    else if (hour < 17) setGreeting("مساء الخير");
    else setGreeting("مساء النور");

    try {
      const raw = localStorage.getItem("allah_yafik_current_user");
      if (raw) {
        const user = JSON.parse(raw);
        if (user.name) setUserName(user.name);
      }
    } catch {}
  }, []);

  return (
    <div className="app-container bg-gradient-navy overflow-hidden">
      {/* Ambient Orbs */}
      <div className="orb w-80 h-80 opacity-10 -top-20 -right-20" style={{ background: "#00D4AA" }} />
      <div className="orb w-60 h-60 opacity-6 top-40 -left-20" style={{ background: "#8B5CF6" }} />

      {/* Header */}
      <div className="mobile-header px-5 py-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-muted-foreground text-xs">{greeting}{userName ? ` يا ${userName}` : ""}</p>
            <h1 className="text-foreground font-black text-lg">الله يعافيك</h1>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/settings">
              <div className="p-2 rounded-xl glass-card border border-border">
                <Settings className="w-4 h-4 text-muted-foreground" />
              </div>
            </Link>
            <Link href="/notifications">
              <div className="relative p-2 rounded-xl glass-card border border-border">
                <Bell className="w-4 h-4 text-muted-foreground" />
                <div className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-destructive" />
              </div>
            </Link>
            <a href={`tel:${CONTACT_PHONE}`} className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-primary/15 border border-primary/25">
              <Phone className="w-3.5 h-3.5 text-primary" />
              <span className="text-primary text-xs font-black">تواصل</span>
            </a>
          </div>
        </div>
      </div>

      <div className="page-content overflow-y-auto">

        {/* Hero Banner - الوقاية */}
        <div className="px-4 mt-2">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-3xl p-5 relative overflow-hidden"
            style={{ background: "linear-gradient(135deg, rgba(0,212,170,0.15), rgba(14,165,233,0.08))", border: "1px solid rgba(0,212,170,0.2)" }}
          >
            <div className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-20" style={{ background: "radial-gradient(circle, #00D4AA, transparent)" }} />

            <div className="flex items-start gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: "linear-gradient(135deg, #00D4AA, #0EA5E9)" }}>
                <Shield className="w-6 h-6 text-background" />
              </div>
              <div>
                <div className="text-primary font-black text-xs uppercase tracking-wider mb-1">برنامج الوقاية</div>
                <h2 className="text-foreground font-black text-xl leading-tight">حصّن نفسك<br />قبل أن تحتاج</h2>
              </div>
            </div>

            <p className="text-muted-foreground text-xs leading-relaxed mb-4">
              الوقاية من الإدمان تبدأ بالمعرفة والوعي — اكتشف مستوى خطرك واحصل على خطة وقائية مخصصة
            </p>

            {/* Risk Level */}
            {riskScore !== null ? (
              <div className="flex items-center gap-2 p-3 rounded-2xl bg-secondary/40 border border-border mb-3">
                <Award className="w-4 h-4 text-primary" />
                <div className="flex-1">
                  <div className="text-muted-foreground text-xs">مستوى الوعي الوقائي</div>
                  <div className="text-foreground font-bold text-sm">
                    {riskScore >= 70 ? "ممتاز — استمر!" : riskScore >= 50 ? "متوسط — طوّر مهاراتك" : "يحتاج تحسين — تابع الخطة"}
                  </div>
                </div>
                <Link href="/assessment">
                  <div className="p-1.5 rounded-xl bg-primary/15">
                    <ChevronLeft className="w-4 h-4 text-primary" />
                  </div>
                </Link>
              </div>
            ) : (
              <Link href="/assessment">
                <motion.button
                  whileTap={{ scale: 0.96 }}
                  className="w-full py-3 rounded-2xl font-black text-background text-sm mb-3"
                  style={{ background: "linear-gradient(135deg, #00D4AA, #0EA5E9)" }}
                >
                  ابدأ تقييم مستوى الخطر مجاناً
                </motion.button>
              </Link>
            )}
          </motion.div>
        </div>

        {/* Motivational Quote */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mx-4 mt-4 p-4 rounded-2xl glass-card border border-border"
        >
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-accent/15 flex items-center justify-center flex-shrink-0">
              <Star className="w-4 h-4 text-accent" />
            </div>
            <div>
              <p className="text-foreground text-sm leading-relaxed italic">"{quote.text}"</p>
              <p className="text-primary text-xs mt-1.5 font-bold">— {quote.author}</p>
            </div>
          </div>
        </motion.div>

        {/* Quick Actions Grid */}
        <div className="px-4 mt-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-foreground font-black text-sm">الوصول السريع</h2>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {quickActions.map((action, idx) => (
              <motion.div
                key={action.path}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.06 }}
              >
                <Link href={action.path}>
                  <motion.div
                    whileTap={{ scale: 0.92 }}
                    className={`p-3.5 rounded-2xl border border-border bg-gradient-to-br ${action.bg} flex flex-col items-center gap-2 card-hover`}
                  >
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${action.color}20` }}>
                      <action.icon className="w-5 h-5" style={{ color: action.color }} />
                    </div>
                    <div className="text-center">
                      <div className="text-foreground font-black text-xs">{action.label}</div>
                      <div className="text-muted-foreground/70 text-[10px]">{action.sublabel}</div>
                    </div>
                  </motion.div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>

        {/* أركان الوقاية */}
        <div className="px-4 mt-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-foreground font-black text-sm">أركان الوقاية الأربعة</h2>
            <Link href="/resources">
              <span className="text-primary text-xs font-bold">تفاصيل</span>
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {preventionPillars.map((pillar, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + idx * 0.07 }}
                className="p-4 rounded-2xl glass-card border border-border"
              >
                <div className="text-2xl mb-2">{pillar.icon}</div>
                <div className="text-foreground font-black text-xs mb-1">{pillar.title}</div>
                <div className="text-muted-foreground text-[10px] leading-relaxed">{pillar.desc}</div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* محاضرات توعوية CTA */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mx-4 mt-5"
        >
          <div className="rounded-3xl overflow-hidden border border-border" style={{ background: "linear-gradient(135deg, rgba(139,92,246,0.12), rgba(59,130,246,0.06))" }}>
            <div className="p-5">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 rounded-lg bg-[#8B5CF6]/20 flex items-center justify-center">
                  <BookOpen className="w-3.5 h-3.5 text-[#8B5CF6]" />
                </div>
                <span className="text-[#8B5CF6] font-black text-xs uppercase tracking-wider">محاضرات توعوية</span>
              </div>
              <h3 className="text-foreground font-black text-lg mb-1">٦ محاضرات علمية متخصصة</h3>
              <p className="text-foreground/45 text-xs leading-relaxed mb-4">
                محتوى توعوي بجودة الذكاء الاصطناعي — لجميع الفئات العمرية من الأطفال حتى الآباء
              </p>
              <div className="flex gap-2">
                <Link href="/lectures" className="flex-1">
                  <motion.button
                    whileTap={{ scale: 0.96 }}
                    className="w-full py-3 rounded-2xl font-black text-foreground text-sm"
                    style={{ background: "linear-gradient(135deg, #8B5CF6, #3B82F6)" }}
                  >
                    ابدأ التعلم
                  </motion.button>
                </Link>
                <Link href="/achievements">
                  <motion.button
                    whileTap={{ scale: 0.96 }}
                    className="px-4 py-3 rounded-2xl font-black text-muted-foreground text-sm glass-card border border-border"
                  >
                    شهاداتي
                  </motion.button>
                </Link>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Partners Strip */}
        <div className="px-4 mt-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-foreground font-black text-sm">منظومة الشراكات</h2>
            <Link href="/partners">
              <span className="text-primary text-xs font-bold">عرض الكل</span>
            </Link>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {partnerTypes.map((partner, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.07 }}
                className="flex-shrink-0 flex flex-col items-center gap-1.5 p-3 rounded-2xl glass-card border border-border w-20"
              >
                <span className="text-2xl">{partner.icon}</span>
                <span className="text-foreground/70 font-bold text-[10px] text-center">{partner.label}</span>
                <span className="text-xs font-bold" style={{ color: partner.color }}>{partner.desc}</span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* إحصائية توعوية */}
        <div className="px-4 mt-5">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35 }}
            className="p-4 rounded-2xl border border-[#EF4444]/20"
            style={{ background: "linear-gradient(135deg, rgba(239,68,68,0.08), rgba(249,115,22,0.04))" }}
          >
            <div className="flex items-center gap-2 mb-3">
              <Lightbulb className="w-4 h-4 text-accent" />
              <span className="text-accent font-black text-xs">هل تعلم؟</span>
            </div>
            <p className="text-foreground/70 text-sm leading-relaxed">
              <span className="text-foreground font-black">٧٠٪</span> من حالات الإدمان تبدأ قبل سن <span className="text-foreground font-black">٢٥ عاماً</span> — الوقاية المبكرة تُنقذ مستقبلاً كاملاً
            </p>
            <Link href="/statistics">
              <div className="flex items-center gap-1 mt-2">
                <span className="text-primary text-xs font-bold">اطلع على الإحصائيات الكاملة</span>
                <ChevronLeft className="w-3 h-3 text-primary" />
              </div>
            </Link>
          </motion.div>
        </div>

        {/* Contact */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mx-4 mt-4 mb-4"
        >
          <a
            href={`tel:${CONTACT_PHONE}`}
            className="flex items-center gap-4 p-4 rounded-2xl border border-primary/25 active:scale-98 transition-transform"
            style={{ background: "linear-gradient(135deg, rgba(0,212,170,0.10), rgba(14,165,233,0.05))" }}
          >
            <div className="w-12 h-12 rounded-2xl bg-[#00D4AA]/20 flex items-center justify-center flex-shrink-0 pulse-teal">
              <Phone className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1">
              <div className="text-foreground font-black text-sm">خط الاستشارة الوقائية</div>
              <div className="text-primary font-black text-base font-numbers">{CONTACT_PHONE}</div>
              <div className="text-foreground/30 text-xs">استشارة مجانية — متاح ٢٤/٧</div>
            </div>
            <ChevronLeft className="w-5 h-5 text-primary" />
          </a>
        </motion.div>

      </div>
    </div>
  );
}
