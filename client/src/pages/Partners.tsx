/*
 * Design: Dark Luxury Wellness v2 - Partners & Institutions Page
 * منظومة الشراكات المتخصصة: مستشفيات، جامعات، عسكري، ديني، مكافحة مخدرات
 * Style: Partner cards with color-coded sectors, stats, contact info
 */
import { useState } from "react";
import {
  Hospital,
  GraduationCap,
  Shield,
  BookOpen,
  AlertTriangle,
  Phone,
  Mail,
  Users,
  FileText,
  Award,
  ChevronLeft,
  CheckCircle2,
  ArrowRight,
  Building2,
  Star,
  TrendingUp,
  Heart,
  Sparkles,
  Zap,
} from "lucide-react";
import { Link } from "wouter";

const CONTACT_PHONE = "0546192019";

const partnerSectors = [
  {
    id: "health",
    icon: Hospital,
    title: "القطاع الصحي",
    subtitle: "الدعم الطبي والعلاجي",
    color: "#EF4444",
    gradient: "from-red-500 to-orange-500",
    bgGlow: "rgba(239, 68, 68, 0.08)",
    borderColor: "rgba(239, 68, 68, 0.3)",
    description:
      "تقدم المستشفيات والمراكز الصحية الدعم الطبي المتكامل لمرضى الإدمان من خلال برامج إعادة التأهيل والعلاج السريري",
    services: [
      "برامج إزالة السموم الطبية (Detox)",
      "العلاج النفسي والدوائي المتخصص",
      "وحدات التعافي المقيم والخارجي",
      "فحوصات دورية ومتابعة طبية",
      "خط طوارئ طبي متخصص ٢٤/٧",
      "تقارير طبية لدعم القضايا القانونية",
    ],
    partners: [
      { name: "وزارة الصحة السعودية", type: "حكومي", status: "شريك رسمي" },
      {
        name: "مستشفى الأمل للصحة النفسية",
        type: "متخصص",
        status: "شريك رسمي",
      },
      {
        name: "مراكز الرعاية الصحية الأولية",
        type: "حكومي",
        status: "شريك فعال",
      },
      {
        name: "الجمعية السعودية للطب النفسي",
        type: "أكاديمي",
        status: "داعم علمي",
      },
    ],
    stats: [
      { label: "مستشفى شريك", value: "٤٨" },
      { label: "طبيب متخصص", value: "٣٢٠" },
      { label: "حالة علاج سنوياً", value: "١٢٠٠٠" },
    ],
  },
  {
    id: "academic",
    icon: GraduationCap,
    title: "القطاع الأكاديمي",
    subtitle: "الدعم التعليمي والبحثي",
    color: "#3B82F6",
    gradient: "from-blue-500 to-violet-500",
    bgGlow: "rgba(59, 130, 246, 0.08)",
    borderColor: "rgba(59, 130, 246, 0.3)",
    description:
      "تُسهم الجامعات والمدارس في التوعية الوقائية وتقديم الدعم الأكاديمي للطلاب المعرضين للخطر وتطوير البحث العلمي",
    services: [
      "برامج توعية في المدارس والجامعات",
      "مرشدون أكاديميون متخصصون بالإدمان",
      "أبحاث علمية في مجال الوقاية",
      "دورات تدريبية للمعلمين والمرشدين",
      "مجموعات دعم داخل الحرم الجامعي",
      "منح دراسية لمتعافي الإدمان",
    ],
    partners: [
      { name: "جامعة الملك سعود", type: "جامعة", status: "شريك رسمي" },
      { name: "جامعة الملك عبدالعزيز", type: "جامعة", status: "شريك رسمي" },
      { name: "وزارة التعليم", type: "حكومي", status: "شريك استراتيجي" },
      { name: "مدارس التعليم العام", type: "تعليمي", status: "شريك فعال" },
    ],
    stats: [
      { label: "جامعة شريكة", value: "٢٣" },
      { label: "مدرسة مشاركة", value: "٤٥٠" },
      { label: "طالب مستفيد", value: "٨٠٠٠٠" },
    ],
  },
  {
    id: "military",
    icon: Shield,
    title: "القطاع الأمني والعسكري",
    subtitle: "الدعم الأمني والحماية",
    color: "#10B981",
    gradient: "from-emerald-500 to-sky-500",
    bgGlow: "rgba(16, 185, 129, 0.08)",
    borderColor: "rgba(16, 185, 129, 0.3)",
    description:
      "يُقدم الجهاز الأمني والعسكري الحماية والردع وإنفاذ القانون، مع برامج إعادة التأهيل للمنتسبين",
    services: [
      "برامج إعادة تأهيل للمنتسبين",
      "تدريب على التعامل مع متعاطي المخدرات",
      "وحدات متخصصة في مكافحة الاتجار",
      "دعم قانوني وتحويل للعلاج بدل العقوبة",
      "حملات توعية في المناطق الحدودية",
      "تبادل المعلومات الاستخباراتية",
    ],
    partners: [
      { name: "وزارة الداخلية", type: "حكومي", status: "شريك استراتيجي" },
      { name: "هيئة مكافحة المخدرات", type: "حكومي", status: "شريك رئيسي" },
      { name: "الأمن الوطني", type: "أمني", status: "شريك فعال" },
      { name: "الدفاع المدني", type: "أمني", status: "شريك داعم" },
    ],
    stats: [
      { label: "جهة أمنية شريكة", value: "١٥" },
      { label: "ضابط مدرب", value: "٢٤٠٠" },
      { label: "قضية محولة للعلاج", value: "٣٢٠٠" },
    ],
  },
  {
    id: "religious",
    icon: BookOpen,
    title: "القطاع الديني",
    subtitle: "التوعية الدينية والروحية",
    color: "#F59E0B",
    gradient: "from-amber-500 to-amber-400",
    bgGlow: "rgba(245, 158, 11, 0.08)",
    borderColor: "rgba(245, 158, 11, 0.3)",
    description:
      "يُعزز القطاع الديني الوقاية من خلال التوعية الدينية والإرشاد الروحي، مستنداً إلى القيم الإسلامية في تعزيز الصحة النفسية",
    services: [
      "خطب جمعة توعوية عن أضرار الإدمان",
      "حلقات قرآنية علاجية للمتعافين",
      "إرشاد ديني فردي وجماعي",
      "برامج تقوية الإيمان والصبر",
      "دروس في الفقه الطبي والنفسي",
      "مراكز إيواء دينية للمتعافين",
    ],
    partners: [
      { name: "وزارة الشؤون الإسلامية", type: "حكومي", status: "شريك رسمي" },
      { name: "رابطة العالم الإسلامي", type: "دولي", status: "شريك داعم" },
      { name: "هيئة كبار العلماء", type: "ديني", status: "مرجعية علمية" },
      { name: "جمعيات تحفيظ القرآن", type: "أهلي", status: "شريك فعال" },
    ],
    stats: [
      { label: "مسجد مشارك", value: "١٢٠٠" },
      { label: "إمام مدرب", value: "٣٥٠" },
      { label: "جلسة إرشاد شهرياً", value: "٤٨٠٠" },
    ],
  },
  {
    id: "narcotics",
    icon: AlertTriangle,
    title: "مكافحة المخدرات",
    subtitle: "الدعم والإحصائيات الرسمية",
    color: "#8B5CF6",
    gradient: "from-violet-500 to-pink-500",
    bgGlow: "rgba(139, 92, 246, 0.08)",
    borderColor: "rgba(139, 92, 246, 0.3)",
    description:
      "تُقدم هيئة مكافحة المخدرات الدعم المؤسسي والإحصائيات الرسمية وبرامج الوقاية الوطنية الشاملة",
    services: [
      "الإحصائيات الوطنية المحدّثة",
      "برامج الوقاية الوطنية (نزاهة)",
      "خط نجدة المخدرات ١٩١١",
      "برامج إعادة التأهيل المجتمعي",
      "حملات التوعية الإعلامية",
      "تقارير الاتجاهات والأنماط",
    ],
    partners: [
      { name: "هيئة مكافحة المخدرات", type: "حكومي", status: "شريك رئيسي" },
      { name: "الأمم المتحدة - UNODC", type: "دولي", status: "شريك دولي" },
      { name: "مركز الدراسات والبحوث", type: "بحثي", status: "شريك بحثي" },
      { name: "برنامج نزاهة الوطني", type: "وطني", status: "شريك استراتيجي" },
    ],
    stats: [
      { label: "حملة توعوية سنوياً", value: "٨٥" },
      { label: "مركز إعادة تأهيل", value: "٣٢" },
      { label: "مستفيد من البرامج", value: "٢٥٠٠٠" },
    ],
  },
];

const nationalStats = [
  {
    label: "مؤشرات الحالات",
    value: "قيد المتابعة",
    change: "تحديث دوري",
    icon: Users,
    color: "#EF4444",
  },
  {
    label: "فئة الشباب",
    value: "أولوية وقائية",
    change: "تركيز مستمر",
    icon: TrendingUp,
    color: "#F59E0B",
  },
  {
    label: "مسارات التعافي",
    value: "تقدم تدريجي",
    change: "وفق الالتزام",
    icon: Heart,
    color: "#10B981",
  },
  {
    label: "الأثر المجتمعي",
    value: "يتطلب وقاية",
    change: "جهد تشاركي",
    icon: Building2,
    color: "#8B5CF6",
  },
];

export default function Partners() {
  const [activeTab, setActiveTab] = useState("all");
  const [expandedSector, setExpandedSector] = useState<string | null>(null);

  const filteredSectors =
    activeTab === "all"
      ? partnerSectors
      : partnerSectors.filter(s => s.id === activeTab);

  return (
    <div className="app-container bg-gradient-navy overflow-hidden">
      {/* Ambient Orbs */}
      <div className="orb w-72 h-72 opacity-10 -top-16 -right-16" style={{ background: "oklch(0.55 0.25 290)" }} />
      <div className="orb w-56 h-56 opacity-6 top-40 -left-16" style={{ background: "oklch(0.75 0.18 175)" }} />

      {/* Mobile Header */}
      <div className="mobile-header px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/dashboard">
              <div className="p-2 rounded-xl glass-card border border-border">
                <ArrowRight className="w-4 h-4 text-muted-foreground" />
              </div>
            </Link>
            <div>
              <h1 className="text-foreground font-black text-base">شبكة الدعم المؤسسي</h1>
              <p className="text-muted-foreground text-[10px]">٥ قطاعات متخصصة</p>
            </div>
          </div>
          <a
            href={`tel:${CONTACT_PHONE}`}
            className="p-2.5 rounded-xl glass-card border border-primary/25"
          >
            <Phone className="w-4 h-4 text-primary" />
          </a>
        </div>
      </div>

      {/* Page Content */}
      <div className="page-content px-4 space-y-4 pt-3 pb-6">
        {/* National Stats - 2x2 grid */}
        <div className="grid grid-cols-2 gap-2.5">
          {nationalStats.map((stat, i) => (
            <div key={i} className="glass-card p-3 rounded-xl border border-border">
              <div className="flex items-center gap-2 mb-1.5">
                <div
                  className="w-6 h-6 rounded-lg flex items-center justify-center"
                  style={{ background: `${stat.color}20` }}
                >
                  <stat.icon className="w-3 h-3" style={{ color: stat.color }} />
                </div>
                <span className="text-muted-foreground text-[10px] leading-tight">{stat.label}</span>
              </div>
              <div className="text-lg font-black text-foreground font-numbers">{stat.value}</div>
              <div className="text-[10px] mt-0.5" style={{ color: stat.color }}>{stat.change}</div>
            </div>
          ))}
        </div>

        {/* Sector Filter - horizontal scroll */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide -mx-4 px-4">
          <button
            onClick={() => setActiveTab("all")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap flex-shrink-0 ${activeTab === "all" ? "bg-primary text-primary-foreground" : "glass-card text-muted-foreground"}`}
          >
            الكل
          </button>
          {partnerSectors.map(s => (
            <button
              key={s.id}
              onClick={() => setActiveTab(s.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 whitespace-nowrap flex-shrink-0 ${activeTab === s.id ? "text-foreground" : "glass-card text-muted-foreground"}`}
              style={
                activeTab === s.id
                  ? {
                      background: `${s.color}25`,
                      border: `1px solid ${s.color}40`,
                      color: s.color,
                    }
                  : {}
              }
            >
              <s.icon className="w-3 h-3" />
              {s.title.split(" ").slice(1).join(" ") || s.title}
            </button>
          ))}
        </div>

        {/* Sector Cards */}
        <div className="space-y-3">
          {filteredSectors.map(sector => (
            <div
              key={sector.id}
              className="glass-card rounded-xl border border-border overflow-hidden"
            >
              {/* Sector Header */}
              <div
                className="p-3.5 cursor-pointer active:bg-secondary/30"
                onClick={() =>
                  setExpandedSector(expandedSector === sector.id ? null : sector.id)
                }
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{
                      background: `linear-gradient(135deg, ${sector.color}30, ${sector.color}15)`,
                      border: `1px solid ${sector.color}40`,
                    }}
                  >
                    <sector.icon className="w-5 h-5" style={{ color: sector.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <h3 className="text-sm font-black text-foreground truncate">{sector.title}</h3>
                    </div>
                    <p className="text-muted-foreground text-[10px] leading-snug line-clamp-1">
                      {sector.subtitle}
                    </p>
                  </div>
                  <div
                    className={`w-7 h-7 rounded-lg glass-card flex items-center justify-center transition-transform flex-shrink-0 ${expandedSector === sector.id ? "rotate-90" : ""}`}
                  >
                    <ChevronLeft className="w-3.5 h-3.5 text-muted-foreground" />
                  </div>
                </div>

                {/* Mini stats row */}
                <div className="flex gap-2 mt-2.5">
                  {sector.stats.map((st, i) => (
                    <div
                      key={i}
                      className="flex-1 text-center py-1.5 px-1 rounded-lg"
                      style={{
                        background: `${sector.color}08`,
                        border: `1px solid ${sector.color}15`,
                      }}
                    >
                      <div className="text-sm font-black font-numbers" style={{ color: sector.color }}>
                        {st.value}
                      </div>
                      <div className="text-muted-foreground/70 text-[9px] leading-tight">{st.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Expanded Content */}
              {expandedSector === sector.id && (
                <div className="px-3.5 pb-3.5 border-t border-border">
                  {/* Description */}
                  <p className="text-muted-foreground text-xs leading-relaxed mt-3 mb-3">
                    {sector.description}
                  </p>

                  {/* Services */}
                  <div className="mb-3">
                    <h4 className="text-foreground text-xs font-bold mb-2 flex items-center gap-1.5">
                      <Zap className="w-3 h-3" style={{ color: sector.color }} />
                      الخدمات المقدمة
                    </h4>
                    <div className="space-y-1.5">
                      {sector.services.map((service, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-2 p-2 rounded-lg"
                          style={{
                            background: `${sector.color}06`,
                            border: `1px solid ${sector.color}12`,
                          }}
                        >
                          <CheckCircle2
                            className="w-3 h-3 flex-shrink-0"
                            style={{ color: sector.color }}
                          />
                          <span className="text-muted-foreground text-[11px]">{service}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Partners */}
                  <div className="mb-3">
                    <h4 className="text-foreground text-xs font-bold mb-2 flex items-center gap-1.5">
                      <Building2 className="w-3 h-3" style={{ color: sector.color }} />
                      الجهات الشريكة
                    </h4>
                    <div className="space-y-1.5">
                      {sector.partners.map((partner, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between p-2.5 rounded-lg glass-card border border-border"
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <div
                              className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                              style={{ background: `${sector.color}15` }}
                            >
                              <Star className="w-3 h-3" style={{ color: sector.color }} />
                            </div>
                            <div className="min-w-0">
                              <div className="text-foreground text-[11px] font-bold truncate">
                                {partner.name}
                              </div>
                              <div className="text-muted-foreground/70 text-[9px]">{partner.type}</div>
                            </div>
                          </div>
                          <span
                            className="text-[9px] px-2 py-0.5 rounded-full font-medium flex-shrink-0"
                            style={{
                              background: `${sector.color}15`,
                              color: sector.color,
                              border: `1px solid ${sector.color}25`,
                            }}
                          >
                            {partner.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Contact CTA */}
                  <div
                    className="p-3 rounded-xl"
                    style={{
                      background: `${sector.color}08`,
                      border: `1px solid ${sector.color}20`,
                    }}
                  >
                    <p className="text-muted-foreground text-[10px] mb-2">
                      للتواصل والانضمام كشريك في هذا القطاع
                    </p>
                    <div className="flex gap-2">
                      <a
                        href={`tel:${CONTACT_PHONE}`}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-[11px] font-bold transition-all flex-1 justify-center"
                        style={{
                          background: `${sector.color}20`,
                          color: sector.color,
                          border: `1px solid ${sector.color}30`,
                        }}
                      >
                        <Phone className="w-3 h-3" />
                        اتصل
                      </a>
                      <button
                        className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-[11px] font-bold glass-card text-muted-foreground transition-all flex-1 justify-center"
                        onClick={() => {
                          window.location.href = `mailto:info@allahyeafik.sa`;
                        }}
                      >
                        <Mail className="w-3 h-3" />
                        راسلنا
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Partnership CTA Banner */}
        <div className="glass-card p-4 rounded-xl border border-primary/20 relative overflow-hidden">
          <div className="orb w-40 h-40 opacity-20 -top-10 -right-10" style={{ background: "oklch(0.75 0.18 175)" }} />
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              <span className="text-primary text-[10px] font-bold">انضم إلى المنظومة</span>
            </div>
            <h3 className="text-sm font-black text-foreground mb-1">
              هل مؤسستك مهتمة بالشراكة؟
            </h3>
            <p className="text-muted-foreground text-[11px] mb-3 leading-relaxed">
              نرحب بجميع المؤسسات الحكومية والخاصة والأهلية للانضمام إلى منظومة الوقاية
            </p>
            <div className="flex gap-2">
              <a
                href={`tel:${CONTACT_PHONE}`}
                className="bg-primary text-primary-foreground px-4 py-2.5 rounded-xl font-bold flex items-center gap-1.5 text-xs flex-1 justify-center"
              >
                <Phone className="w-3.5 h-3.5" />
                اتصل الآن
              </a>
              <Link href="/join-partner">
                <button className="glass-card border border-primary/25 text-primary px-4 py-2.5 rounded-xl font-bold flex items-center gap-1.5 text-xs">
                  <FileText className="w-3.5 h-3.5" />
                  تقديم طلب
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
