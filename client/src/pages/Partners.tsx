/*
 * Design: Dark Luxury Wellness v2 - Partners & Institutions Page
 * منظومة الشراكات المتخصصة: مستشفيات، جامعات، عسكري، ديني، مكافحة مخدرات
 * Style: Partner cards with color-coded sectors, stats, contact info
 */
import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import {
  Hospital, GraduationCap, Shield, BookOpen, AlertTriangle,
  Phone, Mail, Globe, MapPin, Users, FileText, Award,
  ChevronLeft, ExternalLink, CheckCircle2, ArrowLeft,
  Building2, Star, TrendingUp, Heart, Sparkles, Zap
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
    gradient: "from-[#EF4444] to-[#F97316]",
    bgGlow: "rgba(239, 68, 68, 0.08)",
    borderColor: "rgba(239, 68, 68, 0.3)",
    description: "تقدم المستشفيات والمراكز الصحية الدعم الطبي المتكامل لمرضى الإدمان من خلال برامج إعادة التأهيل والعلاج السريري",
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
      { name: "مستشفى الأمل للصحة النفسية", type: "متخصص", status: "شريك رسمي" },
      { name: "مراكز الرعاية الصحية الأولية", type: "حكومي", status: "شريك فعال" },
      { name: "الجمعية السعودية للطب النفسي", type: "أكاديمي", status: "داعم علمي" },
    ],
    stats: [{ label: "مستشفى شريك", value: "٤٨" }, { label: "طبيب متخصص", value: "٣٢٠" }, { label: "حالة علاج سنوياً", value: "١٢٠٠٠" }],
  },
  {
    id: "academic",
    icon: GraduationCap,
    title: "القطاع الأكاديمي",
    subtitle: "الدعم التعليمي والبحثي",
    color: "#3B82F6",
    gradient: "from-[#3B82F6] to-[#8B5CF6]",
    bgGlow: "rgba(59, 130, 246, 0.08)",
    borderColor: "rgba(59, 130, 246, 0.3)",
    description: "تُسهم الجامعات والمدارس في التوعية الوقائية وتقديم الدعم الأكاديمي للطلاب المعرضين للخطر وتطوير البحث العلمي",
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
    stats: [{ label: "جامعة شريكة", value: "٢٣" }, { label: "مدرسة مشاركة", value: "٤٥٠" }, { label: "طالب مستفيد", value: "٨٠٠٠٠" }],
  },
  {
    id: "military",
    icon: Shield,
    title: "القطاع الأمني والعسكري",
    subtitle: "الدعم الأمني والحماية",
    color: "#10B981",
    gradient: "from-[#10B981] to-[#0EA5E9]",
    bgGlow: "rgba(16, 185, 129, 0.08)",
    borderColor: "rgba(16, 185, 129, 0.3)",
    description: "يُقدم الجهاز الأمني والعسكري الحماية والردع وإنفاذ القانون، مع برامج إعادة التأهيل للمنتسبين",
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
    stats: [{ label: "جهة أمنية شريكة", value: "١٥" }, { label: "ضابط مدرب", value: "٢٤٠٠" }, { label: "قضية محولة للعلاج", value: "٣٢٠٠" }],
  },
  {
    id: "religious",
    icon: BookOpen,
    title: "القطاع الديني",
    subtitle: "التوعية الدينية والروحية",
    color: "#F59E0B",
    gradient: "from-[#F59E0B] to-[#FBBF24]",
    bgGlow: "rgba(245, 158, 11, 0.08)",
    borderColor: "rgba(245, 158, 11, 0.3)",
    description: "يُعزز القطاع الديني الوقاية من خلال التوعية الدينية والإرشاد الروحي، مستنداً إلى القيم الإسلامية في تعزيز الصحة النفسية",
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
    stats: [{ label: "مسجد مشارك", value: "١٢٠٠" }, { label: "إمام مدرب", value: "٣٥٠" }, { label: "جلسة إرشاد شهرياً", value: "٤٨٠٠" }],
  },
  {
    id: "narcotics",
    icon: AlertTriangle,
    title: "مكافحة المخدرات",
    subtitle: "الدعم والإحصائيات الرسمية",
    color: "#8B5CF6",
    gradient: "from-[#8B5CF6] to-[#EC4899]",
    bgGlow: "rgba(139, 92, 246, 0.08)",
    borderColor: "rgba(139, 92, 246, 0.3)",
    description: "تُقدم هيئة مكافحة المخدرات الدعم المؤسسي والإحصائيات الرسمية وبرامج الوقاية الوطنية الشاملة",
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
    stats: [{ label: "حملة توعوية سنوياً", value: "٨٥" }, { label: "مركز إعادة تأهيل", value: "٣٢" }, { label: "مستفيد من البرامج", value: "٢٥٠٠٠" }],
  },
];

const nationalStats = [
  { label: "حالة إدمان مسجلة", value: "٤٢٠٠٠", change: "+٣٪", icon: Users, color: "#EF4444" },
  { label: "نسبة الشباب (١٥-٢٩)", value: "٦٨٪", change: "الأعلى خطراً", icon: TrendingUp, color: "#F59E0B" },
  { label: "نسبة التعافي الناجح", value: "٤٥٪", change: "+١٢٪ مع برامجنا", icon: Heart, color: "#10B981" },
  { label: "مليار ريال تكلفة سنوية", value: "٨.٥", change: "على الاقتصاد", icon: Building2, color: "#8B5CF6" },
];

export default function Partners() {
  const [activeTab, setActiveTab] = useState("all");
  const [expandedSector, setExpandedSector] = useState<string | null>(null);

  const filteredSectors = activeTab === "all"
    ? partnerSectors
    : partnerSectors.filter(s => s.id === activeTab);

  return (
    <div className="min-h-screen bg-[#060B18] text-white flex">
      <Sidebar />
      <main className="flex-1 mr-64 overflow-y-auto">
        {/* Hero Header */}
        <div className="relative overflow-hidden px-8 pt-10 pb-8 border-b border-white/5">
          <div className="orb orb-purple w-96 h-96 top-0 left-0 opacity-60" />
          <div className="orb orb-teal w-64 h-64 bottom-0 right-0 opacity-40" />
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-6">
              <div>
                <div className="section-tag bg-[#8B5CF6]/10 border border-[#8B5CF6]/25 text-[#8B5CF6] mb-3">
                  <Building2 className="w-3.5 h-3.5" />
                  منظومة الشراكات الوطنية
                </div>
                <h1 className="text-4xl font-black text-white mb-2">
                  شبكة الدعم
                  <span className="gradient-text-purple"> المؤسسي المتكامل</span>
                </h1>
                <p className="text-white/55 text-base max-w-2xl">
                  خمسة قطاعات متخصصة تعمل معاً لتوفير منظومة شاملة من الدعم الصحي، الأكاديمي، الأمني، الديني، والوقائي
                </p>
              </div>
              <a
                href={`tel:${CONTACT_PHONE}`}
                className="flex items-center gap-3 glass-card px-5 py-3 border border-[#00D4AA]/25 hover:border-[#00D4AA]/50 transition-all group"
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#00D4AA] to-[#0EA5E9] flex items-center justify-center glow-teal group-hover:scale-110 transition-transform">
                  <Phone className="w-5 h-5 text-[#060B18]" />
                </div>
                <div className="text-right">
                  <div className="text-[#00D4AA] font-black font-numbers text-lg">{CONTACT_PHONE}</div>
                  <div className="text-white/40 text-xs">تواصل مع المنسق</div>
                </div>
              </a>
            </div>

            {/* National Stats */}
            <div className="grid grid-cols-4 gap-4">
              {nationalStats.map((stat, i) => (
                <div key={i} className="counter-card p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: `${stat.color}20` }}>
                      <stat.icon className="w-3.5 h-3.5" style={{ color: stat.color }} />
                    </div>
                    <span className="text-white/40 text-xs">{stat.label}</span>
                  </div>
                  <div className="text-2xl font-black text-white font-numbers">{stat.value}</div>
                  <div className="text-xs mt-1" style={{ color: stat.color }}>{stat.change}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sector Filter Tabs */}
        <div className="px-8 py-5 border-b border-white/5">
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setActiveTab("all")}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === "all" ? "btn-teal" : "glass-card text-white/50 hover:text-white"}`}
            >
              جميع القطاعات
            </button>
            {partnerSectors.map(s => (
              <button
                key={s.id}
                onClick={() => setActiveTab(s.id)}
                className={`px-4 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-1.5 ${activeTab === s.id ? "text-white" : "glass-card text-white/50 hover:text-white"}`}
                style={activeTab === s.id ? { background: `linear-gradient(135deg, ${s.color}30, ${s.color}15)`, border: `1px solid ${s.color}50`, color: s.color } : {}}
              >
                <s.icon className="w-3.5 h-3.5" />
                {s.title.split(" ")[1] || s.title}
              </button>
            ))}
          </div>
        </div>

        {/* Sectors Grid */}
        <div className="p-8 space-y-6">
          {filteredSectors.map((sector) => (
            <div
              key={sector.id}
              className="partner-card overflow-hidden"
              style={{ '--partner-color': sector.bgGlow } as React.CSSProperties}
            >
              {/* Sector Header */}
              <div
                className="p-6 cursor-pointer"
                onClick={() => setExpandedSector(expandedSector === sector.id ? null : sector.id)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div
                      className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
                      style={{ background: `linear-gradient(135deg, ${sector.color}30, ${sector.color}15)`, border: `1px solid ${sector.color}40` }}
                    >
                      <sector.icon className="w-7 h-7" style={{ color: sector.color }} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="text-xl font-black text-white">{sector.title}</h3>
                        <span className="badge-teal">{sector.subtitle}</span>
                      </div>
                      <p className="text-white/55 text-sm leading-relaxed max-w-2xl">{sector.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 flex-shrink-0">
                    {/* Mini Stats */}
                    <div className="flex gap-3">
                      {sector.stats.map((st, i) => (
                        <div key={i} className="text-center px-3 py-2 rounded-xl" style={{ background: `${sector.color}10`, border: `1px solid ${sector.color}20` }}>
                          <div className="text-lg font-black font-numbers" style={{ color: sector.color }}>{st.value}</div>
                          <div className="text-white/35 text-xs">{st.label}</div>
                        </div>
                      ))}
                    </div>
                    <div className={`w-8 h-8 rounded-xl glass-card flex items-center justify-center transition-transform ${expandedSector === sector.id ? 'rotate-90' : ''}`}>
                      <ChevronLeft className="w-4 h-4 text-white/50" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Expanded Content */}
              {expandedSector === sector.id && (
                <div className="px-6 pb-6 border-t border-white/5">
                  <div className="grid lg:grid-cols-2 gap-6 mt-6">
                    {/* Services */}
                    <div>
                      <h4 className="text-white font-bold mb-4 flex items-center gap-2">
                        <Zap className="w-4 h-4" style={{ color: sector.color }} />
                        الخدمات المقدمة
                      </h4>
                      <div className="space-y-2.5">
                        {sector.services.map((service, i) => (
                          <div key={i} className="flex items-center gap-3 p-3 rounded-xl" style={{ background: `${sector.color}08`, border: `1px solid ${sector.color}15` }}>
                            <CheckCircle2 className="w-4 h-4 flex-shrink-0" style={{ color: sector.color }} />
                            <span className="text-white/75 text-sm">{service}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Partners */}
                    <div>
                      <h4 className="text-white font-bold mb-4 flex items-center gap-2">
                        <Building2 className="w-4 h-4" style={{ color: sector.color }} />
                        الجهات الشريكة
                      </h4>
                      <div className="space-y-3">
                        {sector.partners.map((partner, i) => (
                          <div key={i} className="flex items-center justify-between p-3 rounded-xl glass-card border border-white/5">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${sector.color}15` }}>
                                <Star className="w-3.5 h-3.5" style={{ color: sector.color }} />
                              </div>
                              <div>
                                <div className="text-white text-sm font-bold">{partner.name}</div>
                                <div className="text-white/35 text-xs">{partner.type}</div>
                              </div>
                            </div>
                            <span className="text-xs px-2.5 py-1 rounded-full font-medium" style={{ background: `${sector.color}15`, color: sector.color, border: `1px solid ${sector.color}25` }}>
                              {partner.status}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Contact CTA */}
                      <div className="mt-4 p-4 rounded-xl" style={{ background: `${sector.color}08`, border: `1px solid ${sector.color}20` }}>
                        <p className="text-white/60 text-xs mb-3">للتواصل والانضمام كشريك في هذا القطاع</p>
                        <div className="flex gap-2">
                          <a
                            href={`tel:${CONTACT_PHONE}`}
                            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all flex-1 justify-center"
                            style={{ background: `${sector.color}20`, color: sector.color, border: `1px solid ${sector.color}30` }}
                          >
                            <Phone className="w-3.5 h-3.5" />
                            {CONTACT_PHONE}
                          </a>
                          <button
                            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold glass-card text-white/60 hover:text-white transition-all"
                            onClick={() => { window.location.href = `mailto:info@allahyeafik.sa`; }}
                          >
                            <Mail className="w-3.5 h-3.5" />
                            راسلنا
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Partnership CTA Banner */}
        <div className="px-8 pb-10">
          <div className="glass-card p-8 border border-[#00D4AA]/20 relative overflow-hidden">
            <div className="orb orb-teal w-80 h-80 -top-20 -right-20 opacity-50" />
            <div className="orb orb-purple w-60 h-60 -bottom-10 -left-10 opacity-40" />
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <div className="section-tag bg-[#00D4AA]/10 border border-[#00D4AA]/25 text-[#00D4AA] mb-3">
                  <Sparkles className="w-3.5 h-3.5" />
                  انضم إلى المنظومة
                </div>
                <h3 className="text-2xl font-black text-white mb-2">هل مؤسستك مهتمة بالشراكة؟</h3>
                <p className="text-white/55 text-sm max-w-xl">
                  نرحب بجميع المؤسسات الحكومية والخاصة والأهلية للانضمام إلى منظومة الوقاية الوطنية من الإدمان
                </p>
              </div>
              <div className="flex flex-col gap-3 flex-shrink-0">
                <a
                  href={`tel:${CONTACT_PHONE}`}
                  className="btn-teal px-6 py-3 rounded-xl font-bold flex items-center gap-2 text-sm"
                >
                  <Phone className="w-4 h-4" />
                  اتصل الآن: {CONTACT_PHONE}
                </a>
                <Link href="/lectures">
                  <button className="btn-outline-teal px-6 py-3 rounded-xl font-bold flex items-center gap-2 text-sm w-full justify-center">
                    <FileText className="w-4 h-4" />
                    استعرض البرامج التوعوية
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
