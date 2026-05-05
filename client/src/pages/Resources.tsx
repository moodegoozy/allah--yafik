/**
 * Resources - الموارد الوقائية
 * Design: Dark Luxury Wellness - "صون"
 * الهدف: مقالات وأدوات الوقاية من الإدمان
 */
import { useState } from "react";
import { toast } from "sonner";
import {
  BookOpen, Phone, AlertTriangle, Heart, Brain,
  Shield, ChevronRight, Search, ExternalLink,
  Clock, Star, Zap, Users, FileText, Lightbulb,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const CONTACT_PHONE = "0546192019";

const articles = [
  {
    id: 1,
    title: "كيف تحمي نفسك من الإدمان؟ دليل علمي",
    category: "علمي",
    readTime: "٥ دقائق",
    icon: Brain,
    color: "from-violet-500 to-pink-500",
    excerpt: "فهم آليات الإدمان العصبية يمنحك سلاحاً قوياً للوقاية منه قبل الوقوع فيه...",
    popular: true,
  },
  {
    id: 2,
    title: "١٠ مهارات وقائية يجب أن يتعلمها كل شاب",
    category: "عملي",
    readTime: "٧ دقائق",
    icon: Shield,
    color: "from-primary to-sky-500",
    excerpt: "مهارات الرفض والوعي الذاتي وإدارة الضغط — أدوات الوقاية الأساسية...",
    popular: true,
  },
  {
    id: 3,
    title: "دور الأسرة في الوقاية من الإدمان",
    category: "أسري",
    readTime: "٦ دقائق",
    icon: Users,
    color: "from-amber-500 to-red-500",
    excerpt: "كيف تبني أسرتك درعاً واقياً لأبنائك قبل أن يواجهوا الخطر...",
    popular: false,
  },
  {
    id: 4,
    title: "الإدمان الرقمي: الوباء الصامت",
    category: "رقمي",
    readTime: "٨ دقائق",
    icon: Zap,
    color: "from-pink-500 to-violet-500",
    excerpt: "الألعاب والسوشيال ميديا والإنترنت — كيف تحمي نفسك وأبناءك...",
    popular: true,
  },
  {
    id: 5,
    title: "التحصين الإسلامي من الإدمان",
    category: "ديني",
    readTime: "٦ دقائق",
    icon: Heart,
    color: "from-emerald-500 to-blue-500",
    excerpt: "القرآن والسنة والأذكار — سلاح روحي قوي في مواجهة الإغراءات...",
    popular: false,
  },
  {
    id: 6,
    title: "كيف تتعرف على أصدقاء السوء وتتجنبهم؟",
    category: "اجتماعي",
    readTime: "٥ دقائق",
    icon: Lightbulb,
    color: "from-amber-500 to-emerald-500",
    excerpt: "البيئة الاجتماعية أكبر عامل خطر — تعلم كيف تختار محيطك بحكمة...",
    popular: false,
  },
];

const emergencyContacts = [
  { name: "برنامج صون", number: CONTACT_PHONE, icon: "🛡️", color: "#00D4AA", desc: "تواصل مباشر مع المتخصصين" },
  { name: "هيئة مكافحة المخدرات", number: "1955", icon: "🚨", color: "#EF4444", desc: "الخط الساخن الوطني" },
  { name: "الصحة النفسية", number: "920033360", icon: "🧠", color: "#8B5CF6", desc: "دعم نفسي متخصص" },
  { name: "خط الطوارئ", number: "911", icon: "🆘", color: "#F59E0B", desc: "للحالات الطارئة" },
];

const preventionTools = [
  { title: "اختبار تقييم الخطر", desc: "قيّم مستوى خطورة وضعك الحالي", icon: "📊", color: "#00D4AA", link: "/assessment" },
  { title: "خطة الوقاية الشخصية", desc: "ابنِ خطتك الوقائية المخصصة", icon: "📋", color: "#8B5CF6", link: "/rehab-plan" },
  { title: "تمارين الوقاية", desc: "تمارين يومية لبناء الحصانة", icon: "🛡️", color: "#F59E0B", link: "/exercises" },
  { title: "المحاضرات التوعوية", desc: "محاضرات علمية بجودة AI", icon: "🎓", color: "#EC4899", link: "/lectures" },
];

export default function Resources() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("الكل");

  const categories = ["الكل", "علمي", "عملي", "أسري", "رقمي", "ديني", "اجتماعي"];

  const filteredArticles = articles.filter(a => {
    const matchCategory = activeCategory === "الكل" || a.category === activeCategory;
    const matchSearch = !searchQuery || a.title.includes(searchQuery) || a.excerpt.includes(searchQuery);
    return matchCategory && matchSearch;
  });

  return (
    <div className="app-container bg-gradient-navy">
      <div className="orb w-64 h-64 opacity-8 top-10 -left-20" style={{ background: "oklch(0.80 0.18 80)" }} />

      {/* Header */}
      <div className="mobile-header px-5 py-4">
        <div>
          <div className="text-primary text-xs font-bold uppercase tracking-wider mb-1">الموارد</div>
          <h1 className="text-foreground font-black text-xl">مكتبة الوقاية</h1>
          <p className="text-muted-foreground text-xs mt-0.5">معلومات وأدوات وقائية متخصصة</p>
        </div>
      </div>

      <div className="page-content overflow-y-auto">

        {/* Search */}
        <div className="px-4 mt-3">
          <div className="flex items-center gap-2 p-3 rounded-2xl glass-card border border-border">
            <Search className="w-4 h-4 text-muted-foreground/70" />
            <input
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="ابحث في المكتبة الوقائية..."
              className="flex-1 bg-transparent text-foreground/70 text-sm outline-none placeholder:text-muted-foreground/50"
              dir="rtl"
            />
          </div>
        </div>

        {/* Prevention Tools */}
        <div className="px-4 mt-4">
          <h2 className="text-foreground font-black text-sm mb-3">أدوات الوقاية</h2>
          <div className="grid grid-cols-2 gap-3">
            {preventionTools.map((tool, idx) => (
              <motion.a
                key={idx}
                href={tool.link}
                whileTap={{ scale: 0.95 }}
                className="p-3 rounded-2xl glass-card border border-border block"
              >
                <div className="text-2xl mb-2">{tool.icon}</div>
                <div className="text-foreground font-black text-xs mb-1">{tool.title}</div>
                <div className="text-muted-foreground text-[10px] leading-relaxed">{tool.desc}</div>
              </motion.a>
            ))}
          </div>
        </div>

        {/* Emergency Contacts */}
        <div className="px-4 mt-5">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="w-4 h-4 text-destructive" />
            <h2 className="text-foreground font-black text-sm">أرقام الدعم والطوارئ</h2>
          </div>
          <div className="space-y-2">
            {emergencyContacts.map((contact, idx) => (
              <motion.a
                key={idx}
                href={`tel:${contact.number}`}
                whileTap={{ scale: 0.97 }}
                className="flex items-center gap-3 p-3 rounded-2xl glass-card border border-border"
              >
                <span className="text-xl">{contact.icon}</span>
                <div className="flex-1">
                  <div className="text-foreground font-black text-xs">{contact.name}</div>
                  <div className="text-muted-foreground text-[10px]">{contact.desc}</div>
                </div>
                <div className="text-right">
                  <div className="font-black text-sm font-numbers" style={{ color: contact.color }}>{contact.number}</div>
                  <div className="text-muted-foreground/70 text-[10px]">اتصل الآن</div>
                </div>
              </motion.a>
            ))}
          </div>
        </div>

        {/* Articles */}
        <div className="px-4 mt-5">
          <h2 className="text-foreground font-black text-sm mb-3">مقالات توعوية</h2>

          {/* Category Filter */}
          <div className="flex gap-2 overflow-x-auto pb-2 mb-3">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={cn(
                  "flex-shrink-0 px-3 py-1.5 rounded-xl text-xs font-bold transition-all",
                  activeCategory === cat
                    ? "bg-primary text-primary-foreground"
                    : "glass-card border border-border text-muted-foreground"
                )}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="space-y-3 mb-4">
            {filteredArticles.map((article, idx) => (
              <motion.button
                key={article.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.06 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => toast.info("المقال كامل قادم قريباً")}
                className="w-full flex items-start gap-3 p-4 rounded-2xl glass-card border border-border text-right"
              >
                <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 bg-gradient-to-br", article.color)}>
                  <article.icon className="w-5 h-5 text-foreground" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-foreground font-black text-xs">{article.title}</span>
                    {article.popular && (
                      <Star className="w-3 h-3 text-accent fill-amber-500 flex-shrink-0" />
                    )}
                  </div>
                  <p className="text-muted-foreground text-[11px] leading-relaxed mb-2">{article.excerpt}</p>
                  <div className="flex items-center gap-3">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-secondary/80 text-muted-foreground">{article.category}</span>
                    <div className="flex items-center gap-1 text-muted-foreground/70 text-[10px]">
                      <Clock className="w-3 h-3" />
                      {article.readTime}
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground/60 flex-shrink-0 mt-1" />
              </motion.button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
