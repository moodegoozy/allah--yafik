/*
 * Design: Dark Luxury Wellness v2 - Lectures & Awareness Center
 * مركز المحاضرات والتوعية التفاعلية لجميع الفئات العمرية
 * Style: Age-group cards, lecture library, live sessions
 */
import { useState } from "react";
import { useLocation } from "wouter";
import Sidebar from "@/components/Sidebar";
import {
  Play, BookOpen, Users, Clock, Star, Calendar,
  ChevronLeft, Download, Share2, Phone, Mic,
  Baby, School, GraduationCap, Briefcase, Heart,
  Video, FileText, Headphones, Globe, Sparkles,
  Award, TrendingUp, Filter, Search, Bell, ArrowLeft,
  Brain, CheckCircle2, Eye
} from "lucide-react";
import { lecturesData } from "@/data/lecturesData";

const CONTACT_PHONE = "0546192019";

const ageGroups = [
  {
    id: "children",
    icon: Baby,
    label: "الأطفال",
    range: "٦ - ١٢ سنة",
    color: "#10B981",
    desc: "توعية مبكرة بأسلوب قصصي وتفاعلي",
    count: "٢٤ محاضرة",
  },
  {
    id: "teens",
    icon: School,
    label: "المراهقون",
    range: "١٣ - ١٨ سنة",
    color: "#3B82F6",
    desc: "تعزيز المناعة النفسية ومهارات الرفض",
    count: "٣٨ محاضرة",
  },
  {
    id: "youth",
    icon: GraduationCap,
    label: "الشباب",
    range: "١٩ - ٣٠ سنة",
    color: "#00D4AA",
    desc: "الوقاية في مرحلة الجامعة والعمل",
    count: "٤٥ محاضرة",
  },
  {
    id: "adults",
    icon: Briefcase,
    label: "البالغون",
    range: "٣١ - ٥٠ سنة",
    color: "#F59E0B",
    desc: "إدارة الضغوط والوقاية من الانتكاسة",
    count: "٣٢ محاضرة",
  },
  {
    id: "parents",
    icon: Heart,
    label: "الآباء والأمهات",
    range: "جميع الأعمار",
    color: "#EC4899",
    desc: "كيف تحمي أسرتك وتتعرف على المخاطر",
    count: "٢٨ محاضرة",
  },
];

const lectures = [
  {
    id: 1,
    title: "أضرار المخدرات على الجهاز العصبي",
    speaker: "د. محمد الحارثي",
    speakerTitle: "استشاري طب الإدمان",
    category: "صحي",
    ageGroup: "youth",
    duration: "٤٥ دقيقة",
    views: "١٢,٤٠٠",
    rating: 4.9,
    type: "video",
    color: "#EF4444",
    tags: ["علمي", "طبي", "وقائي"],
    featured: true,
    description: "شرح علمي مبسط لكيفية تأثير المخدرات على خلايا الدماغ والجهاز العصبي المركزي",
  },
  {
    id: 2,
    title: "مهارات قول لا: كيف ترفض بثقة",
    speaker: "أ. سارة المطيري",
    speakerTitle: "مرشدة نفسية معتمدة",
    category: "نفسي",
    ageGroup: "teens",
    duration: "٣٠ دقيقة",
    views: "٩,٨٠٠",
    rating: 4.8,
    type: "video",
    color: "#3B82F6",
    tags: ["مهارات", "شباب", "تفاعلي"],
    featured: true,
    description: "ورشة عملية لتطوير مهارات الرفض الاجتماعي ومقاومة ضغط الأقران",
  },
  {
    id: 3,
    title: "الإدمان في الإسلام: الحكم والعلاج",
    speaker: "الشيخ عبدالله القرني",
    speakerTitle: "داعية إسلامي",
    category: "ديني",
    ageGroup: "adults",
    duration: "٦٠ دقيقة",
    views: "٢٣,٥٠٠",
    rating: 5.0,
    type: "audio",
    color: "#F59E0B",
    tags: ["ديني", "إسلامي", "توعوي"],
    featured: false,
    description: "محاضرة شاملة عن الموقف الشرعي من المخدرات وطرق العلاج الروحي",
  },
  {
    id: 4,
    title: "كيف تحمي طفلك من الإدمان",
    speaker: "د. نورة السبيعي",
    speakerTitle: "طبيبة أطفال ونفسية",
    category: "أسري",
    ageGroup: "parents",
    duration: "٥٠ دقيقة",
    views: "١٨,٢٠٠",
    rating: 4.9,
    type: "video",
    color: "#EC4899",
    tags: ["أسري", "وقاية", "أطفال"],
    featured: true,
    description: "دليل عملي للوالدين للتعرف على علامات الإدمان المبكرة وكيفية التدخل",
  },
  {
    id: 5,
    title: "إحصائيات الإدمان في السعودية ٢٠٢٥",
    speaker: "م. خالد الدوسري",
    speakerTitle: "باحث اجتماعي",
    category: "إحصائي",
    ageGroup: "adults",
    duration: "٣٥ دقيقة",
    views: "٧,٦٠٠",
    rating: 4.7,
    type: "presentation",
    color: "#8B5CF6",
    tags: ["إحصائيات", "بحثي", "وطني"],
    featured: false,
    description: "تقرير شامل بأحدث الإحصائيات والاتجاهات في مجال الإدمان بالمملكة",
  },
  {
    id: 6,
    title: "الألعاب الإلكترونية وإدمان الشاشات",
    speaker: "د. أحمد الزهراني",
    speakerTitle: "أخصائي نفسي",
    category: "رقمي",
    ageGroup: "teens",
    duration: "٤٠ دقيقة",
    views: "١٥,١٠٠",
    rating: 4.8,
    type: "video",
    color: "#0EA5E9",
    tags: ["رقمي", "مراهقون", "تقني"],
    featured: false,
    description: "فهم إدمان الألعاب الإلكترونية وطرق الوقاية والعلاج للمراهقين",
  },
];

const upcomingLive = [
  {
    title: "ندوة: الوقاية المجتمعية من المخدرات",
    date: "١٥ مارس ٢٠٢٦",
    time: "٨:٠٠ مساءً",
    speaker: "فريق الله يعافيك",
    platform: "مباشر عبر التطبيق",
    color: "#00D4AA",
    registered: "٣٤٠",
  },
  {
    title: "محاضرة: دور الأسرة في التعافي",
    date: "٢٢ مارس ٢٠٢٦",
    time: "٧:٠٠ مساءً",
    speaker: "د. فاطمة العمري",
    platform: "مباشر عبر التطبيق",
    color: "#EC4899",
    registered: "٢١٨",
  },
  {
    title: "ورشة: مهارات التعامل مع الإغراء",
    date: "٢٩ مارس ٢٠٢٦",
    time: "٩:٠٠ مساءً",
    speaker: "أ. عمر الشهري",
    platform: "مباشر عبر التطبيق",
    color: "#F59E0B",
    registered: "١٨٥",
  },
];

const typeIcons: Record<string, React.ElementType> = {
  video: Video,
  audio: Headphones,
  presentation: FileText,
};

export default function Lectures() {
  const [selectedAge, setSelectedAge] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [playingId, setPlayingId] = useState<number | null>(null);
  const [, navigate] = useLocation();

  const filtered = lectures.filter(l => {
    const matchAge = selectedAge === "all" || l.ageGroup === selectedAge;
    const matchSearch = l.title.includes(searchQuery) || l.speaker.includes(searchQuery) || l.tags.some(t => t.includes(searchQuery));
    return matchAge && matchSearch;
  });

  // فلترة محاضرات AI الحقيقية
  const aiLectures = lecturesData.filter(l => {
    const matchAge = selectedAge === "all" || l.ageGroup === selectedAge;
    const matchSearch = !searchQuery || l.title.includes(searchQuery) || l.speaker.includes(searchQuery) || l.tags.some(t => t.includes(searchQuery));
    return matchAge && matchSearch;
  });

  return (
    <div className="min-h-screen bg-[#060B18] text-white flex">
      <Sidebar />
      <main className="flex-1 mr-64 overflow-y-auto">
        {/* Header */}
        <div className="relative overflow-hidden px-8 pt-10 pb-8 border-b border-white/5">
          <div className="orb orb-teal w-80 h-80 -top-20 -left-20 opacity-50" />
          <div className="orb orb-gold w-60 h-60 -bottom-10 -right-10 opacity-40" />
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="section-tag bg-[#00D4AA]/10 border border-[#00D4AA]/25 text-[#00D4AA] mb-3">
                  <BookOpen className="w-3.5 h-3.5" />
                  مركز التوعية والمحاضرات
                </div>
                <h1 className="text-4xl font-black text-white mb-2">
                  مكتبة التوعية
                  <span className="gradient-text-teal"> التفاعلية</span>
                </h1>
                <p className="text-white/55 text-sm">
                  محاضرات متخصصة لجميع الفئات العمرية من خبراء معتمدين في الصحة والتعليم والدين
                </p>
              </div>
              <a
                href={`tel:${CONTACT_PHONE}`}
                className="flex items-center gap-3 glass-card px-4 py-3 border border-[#00D4AA]/25 hover:border-[#00D4AA]/50 transition-all group"
              >
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#00D4AA] to-[#0EA5E9] flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Phone className="w-4 h-4 text-[#060B18]" />
                </div>
                <div className="text-right">
                  <div className="text-[#00D4AA] font-black font-numbers">{CONTACT_PHONE}</div>
                  <div className="text-white/35 text-xs">طلب محاضرة</div>
                </div>
              </a>
            </div>

            {/* Quick Stats */}
            <div className="flex gap-4">
              {[
                { icon: Video, label: "محاضرة متاحة", value: "١٦٧", color: "#00D4AA" },
                { icon: Users, label: "مستفيد", value: "٨٥,٠٠٠+", color: "#F59E0B" },
                { icon: Star, label: "متوسط التقييم", value: "٤.٨", color: "#8B5CF6" },
                { icon: Globe, label: "لغة", value: "٣", color: "#EC4899" },
              ].map((s, i) => (
                <div key={i} className="flex items-center gap-2 glass-card px-4 py-2.5 border border-white/5">
                  <s.icon className="w-4 h-4" style={{ color: s.color }} />
                  <span className="text-white font-black font-numbers">{s.value}</span>
                  <span className="text-white/40 text-xs">{s.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="p-8">
          {/* Age Group Filter */}
          <div className="mb-8">
            <h3 className="text-white font-bold mb-4 flex items-center gap-2">
              <Filter className="w-4 h-4 text-[#00D4AA]" />
              اختر الفئة العمرية
            </h3>
            <div className="grid grid-cols-5 gap-3">
              <button
                onClick={() => setSelectedAge("all")}
                className={`p-4 rounded-2xl text-center transition-all border ${selectedAge === "all" ? "border-[#00D4AA]/50 bg-[#00D4AA]/10" : "border-white/7 glass-card hover:border-white/15"}`}
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#00D4AA] to-[#0EA5E9] flex items-center justify-center mx-auto mb-2">
                  <Users className="w-5 h-5 text-[#060B18]" />
                </div>
                <div className={`text-sm font-bold ${selectedAge === "all" ? "text-[#00D4AA]" : "text-white/70"}`}>الكل</div>
                <div className="text-white/30 text-xs">١٦٧ محاضرة</div>
              </button>
              {ageGroups.map(group => (
                <button
                  key={group.id}
                  onClick={() => setSelectedAge(group.id)}
                  className={`p-4 rounded-2xl text-center transition-all border ${selectedAge === group.id ? "border-opacity-50 bg-opacity-10" : "border-white/7 glass-card hover:border-white/15"}`}
                  style={selectedAge === group.id ? { borderColor: `${group.color}50`, background: `${group.color}10` } : {}}
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-2"
                    style={{ background: `${group.color}20`, border: `1px solid ${group.color}30` }}
                  >
                    <group.icon className="w-5 h-5" style={{ color: group.color }} />
                  </div>
                  <div className="text-sm font-bold" style={selectedAge === group.id ? { color: group.color } : { color: 'rgba(255,255,255,0.7)' }}>{group.label}</div>
                  <div className="text-white/30 text-xs">{group.range}</div>
                  <div className="text-white/20 text-xs">{group.count}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Search */}
          <div className="relative mb-6">
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <input
              type="text"
              placeholder="ابحث عن محاضرة، متحدث، أو موضوع..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full glass-card border border-white/7 rounded-xl px-4 py-3 pr-11 text-white placeholder-white/30 text-sm focus:outline-none focus:border-[#00D4AA]/40 bg-transparent"
            />
          </div>

          {/* AI-Powered Lectures Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-bold flex items-center gap-2">
                <Brain className="w-4 h-4 text-[#8B5CF6]" />
                محاضرات تفاعلية بمحتوى الذكاء الاصطناعي
                <span className="section-tag bg-[#8B5CF6]/15 border border-[#8B5CF6]/30 text-[#8B5CF6]">جديد</span>
              </h3>
              <span className="text-white/30 text-xs">{aiLectures.length} محاضرة متاحة</span>
            </div>
            <div className="grid lg:grid-cols-2 gap-4">
              {aiLectures.map(lec => (
                <div
                  key={lec.id}
                  className="glass-card p-5 border border-white/7 hover:border-white/15 transition-all cursor-pointer group relative overflow-hidden"
                  onClick={() => navigate(`/lectures/${lec.id}`)}
                >
                  <div className="orb w-40 h-40 -top-10 -right-10 opacity-30" style={{ background: `${lec.color}20` }} />
                  <div className="relative z-10">
                    <div className="flex items-start gap-4">
                      <div
                        className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform"
                        style={{ background: `${lec.color}20`, border: `1px solid ${lec.color}30` }}
                      >
                        <BookOpen className="w-6 h-6" style={{ color: lec.color }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span className="section-tag border text-xs" style={{ background: `${lec.color}10`, borderColor: `${lec.color}25`, color: lec.color }}>{lec.category}</span>
                          <span className="badge-teal">{lec.ageLabel}</span>
                          {lec.featured && <span className="badge-gold">مميز</span>}
                        </div>
                        <h4 className="text-white font-black text-sm mb-1 leading-snug">{lec.title}</h4>
                        <p className="text-white/40 text-xs mb-3">{lec.speaker} · {lec.speakerTitle}</p>
                        <div className="flex items-center gap-4 text-white/30 text-xs">
                          <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{lec.duration}</span>
                          <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{lec.views}</span>
                          <span className="flex items-center gap-1"><Star className="w-3 h-3 text-[#F59E0B] fill-[#F59E0B]" />{lec.rating}</span>
                          <span className="flex items-center gap-1"><Brain className="w-3 h-3 text-[#8B5CF6]" />{lec.quiz.length} أسئلة</span>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex gap-1.5 flex-wrap">
                        {lec.tags.slice(0, 3).map((tag, ti) => (
                          <span key={ti} className="badge-teal">{tag}</span>
                        ))}
                      </div>
                      <button
                        className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg transition-all"
                        style={{ background: `${lec.color}15`, color: lec.color, border: `1px solid ${lec.color}25` }}
                      >
                        <ArrowLeft className="w-3 h-3" />
                        ابدأ المحاضرة
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Featured Lectures */}
          {selectedAge === "all" && searchQuery === "" && (
            <div className="mb-8">
              <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                <Award className="w-4 h-4 text-[#F59E0B]" />
                المحاضرات المميزة
              </h3>
              <div className="grid lg:grid-cols-3 gap-4">
                {lectures.filter(l => l.featured).map(lecture => {
                  const TypeIcon = typeIcons[lecture.type] || Video;
                  return (
                    <div key={lecture.id} className="lecture-card group cursor-pointer" onClick={() => setPlayingId(lecture.id)}>
                      {/* Thumbnail */}
                      <div className="relative h-40 overflow-hidden rounded-t-2xl" style={{ background: `linear-gradient(135deg, ${lecture.color}25, ${lecture.color}10)` }}>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-16 h-16 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center border border-white/20 group-hover:scale-110 transition-transform">
                            <Play className="w-7 h-7 text-white mr-1" />
                          </div>
                        </div>
                        <div className="absolute top-3 right-3">
                          <span className="badge-gold">{lecture.category}</span>
                        </div>
                        <div className="absolute bottom-3 left-3 flex items-center gap-1.5 text-white/70 text-xs">
                          <Clock className="w-3 h-3" />
                          {lecture.duration}
                        </div>
                        <div className="absolute bottom-3 right-3">
                          <TypeIcon className="w-4 h-4 text-white/50" />
                        </div>
                      </div>
                      {/* Info */}
                      <div className="p-4">
                        <h4 className="text-white font-bold text-sm mb-1 line-clamp-2">{lecture.title}</h4>
                        <p className="text-white/40 text-xs mb-3">{lecture.speaker} · {lecture.speakerTitle}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1">
                            <Star className="w-3.5 h-3.5 text-[#F59E0B] fill-[#F59E0B]" />
                            <span className="text-white/60 text-xs font-numbers">{lecture.rating}</span>
                          </div>
                          <div className="flex items-center gap-1 text-white/30 text-xs">
                            <Users className="w-3 h-3" />
                            {lecture.views}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* All Lectures */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-bold flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-[#00D4AA]" />
                {selectedAge === "all" ? "جميع المحاضرات" : `محاضرات ${ageGroups.find(g => g.id === selectedAge)?.label}`}
                <span className="badge-teal">{filtered.length}</span>
              </h3>
            </div>
            <div className="space-y-3">
              {filtered.map(lecture => {
                const TypeIcon = typeIcons[lecture.type] || Video;
                return (
                  <div
                    key={lecture.id}
                    className="glass-card p-4 border border-white/5 hover:border-white/12 transition-all cursor-pointer group flex items-center gap-4"
                    onClick={() => setPlayingId(lecture.id)}
                  >
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform"
                      style={{ background: `${lecture.color}20`, border: `1px solid ${lecture.color}30` }}
                    >
                      <TypeIcon className="w-5 h-5" style={{ color: lecture.color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <h4 className="text-white font-bold text-sm">{lecture.title}</h4>
                        {lecture.featured && <span className="badge-gold">مميز</span>}
                      </div>
                      <p className="text-white/40 text-xs">{lecture.speaker} · {lecture.speakerTitle}</p>
                    </div>
                    <div className="flex items-center gap-4 flex-shrink-0">
                      <div className="flex gap-1">
                        {lecture.tags.slice(0, 2).map((tag, i) => (
                          <span key={i} className="badge-teal">{tag}</span>
                        ))}
                      </div>
                      <div className="text-white/30 text-xs flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {lecture.duration}
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 text-[#F59E0B] fill-[#F59E0B]" />
                        <span className="text-white/60 text-xs">{lecture.rating}</span>
                      </div>
                      <button className="w-8 h-8 rounded-lg glass-card flex items-center justify-center text-white/30 hover:text-[#00D4AA] transition-colors">
                        <Play className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Upcoming Live Sessions */}
          <div>
            <h3 className="text-white font-bold mb-4 flex items-center gap-2">
              <Bell className="w-4 h-4 text-[#EF4444]" />
              الجلسات المباشرة القادمة
              <span className="badge-red">مباشر</span>
            </h3>
            <div className="grid lg:grid-cols-3 gap-4">
              {upcomingLive.map((session, i) => (
                <div key={i} className="glass-card p-5 border border-white/5 hover:border-white/12 transition-all">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: session.color }} />
                    <span className="text-xs font-bold" style={{ color: session.color }}>قادم قريباً</span>
                  </div>
                  <h4 className="text-white font-bold text-sm mb-2">{session.title}</h4>
                  <div className="space-y-1.5 mb-4">
                    <div className="flex items-center gap-2 text-white/40 text-xs">
                      <Calendar className="w-3.5 h-3.5" />
                      {session.date} · {session.time}
                    </div>
                    <div className="flex items-center gap-2 text-white/40 text-xs">
                      <Mic className="w-3.5 h-3.5" />
                      {session.speaker}
                    </div>
                    <div className="flex items-center gap-2 text-white/40 text-xs">
                      <Users className="w-3.5 h-3.5" />
                      {session.registered} مسجل
                    </div>
                  </div>
                  <button
                    className="w-full py-2.5 rounded-xl text-sm font-bold transition-all"
                    style={{ background: `${session.color}15`, color: session.color, border: `1px solid ${session.color}30` }}
                  >
                    سجّل الآن
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Request Lecture CTA */}
          <div className="mt-8 glass-card p-6 border border-[#F59E0B]/20 relative overflow-hidden">
            <div className="orb orb-gold w-60 h-60 -top-10 -right-10 opacity-40" />
            <div className="relative z-10 flex items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#F59E0B] to-[#FBBF24] flex items-center justify-center glow-gold">
                  <Mic className="w-6 h-6 text-[#060B18]" />
                </div>
                <div>
                  <h4 className="text-white font-black">هل تريد محاضرة لمؤسستك؟</h4>
                  <p className="text-white/50 text-sm">نقدم محاضرات توعوية مخصصة للمدارس والجامعات والشركات والمساجد</p>
                </div>
              </div>
              <a
                href={`tel:${CONTACT_PHONE}`}
                className="btn-gold px-6 py-3 rounded-xl font-bold flex items-center gap-2 text-sm flex-shrink-0"
              >
                <Phone className="w-4 h-4" />
                اطلب الآن: {CONTACT_PHONE}
              </a>
            </div>
          </div>
        </div>

        {/* Video Player Modal */}
        {playingId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" onClick={() => setPlayingId(null)} />
            <div className="relative glass-deep p-6 max-w-2xl w-full z-10">
              <button onClick={() => setPlayingId(null)} className="absolute top-4 left-4 w-8 h-8 rounded-lg glass-card flex items-center justify-center text-white/50 hover:text-white">
                ✕
              </button>
              {(() => {
                const lecture = lectures.find(l => l.id === playingId);
                if (!lecture) return null;
                return (
                  <>
                    <div className="h-64 rounded-xl mb-4 flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${lecture.color}20, ${lecture.color}08)` }}>
                      <div className="text-center">
                        <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-3">
                          <Play className="w-8 h-8 text-white mr-1" />
                        </div>
                        <p className="text-white/50 text-sm">محاكاة تشغيل المحاضرة</p>
                      </div>
                    </div>
                    <h3 className="text-white font-black text-lg mb-1">{lecture.title}</h3>
                    <p className="text-white/50 text-sm mb-3">{lecture.speaker} · {lecture.speakerTitle}</p>
                    <p className="text-white/60 text-sm leading-relaxed mb-4">{lecture.description}</p>
                    <div className="flex gap-3">
                      <button className="flex-1 btn-teal py-3 rounded-xl font-bold flex items-center justify-center gap-2">
                        <Play className="w-4 h-4" />
                        تشغيل المحاضرة
                      </button>
                      <button className="w-12 h-12 glass-card rounded-xl flex items-center justify-center text-white/50 hover:text-white border border-white/7">
                        <Download className="w-4 h-4" />
                      </button>
                      <button className="w-12 h-12 glass-card rounded-xl flex items-center justify-center text-white/50 hover:text-white border border-white/7">
                        <Share2 className="w-4 h-4" />
                      </button>
                    </div>
                  </>
                );
              })()}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
