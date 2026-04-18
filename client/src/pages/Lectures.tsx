/*
 * Design: Dark Luxury Wellness v2 - Lectures & Awareness Center
 * مركز المحاضرات والتوعية التفاعلية لجميع الفئات العمرية
 * Style: Age-group cards, lecture library, live sessions
 */
import { useState } from "react";
import { useLocation } from "wouter";
import { toast } from "sonner";
import { motion } from "framer-motion";
import {
  Play,
  BookOpen,
  Users,
  Clock,
  Star,
  Calendar,
  ChevronLeft,
  Download,
  Share2,
  Phone,
  Mic,
  Baby,
  School,
  Briefcase,
  Video,
  FileText,
  Headphones,
  Globe,
  Sparkles,
  Award,
  TrendingUp,
  Filter,
  Search,
  Bell,
  ArrowLeft,
  Brain,
  CheckCircle2,
  Eye,
} from "lucide-react";
import { lecturesData } from "@/data/lecturesData";
import Sidebar from "@/components/Sidebar";

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
    id: "adults",
    icon: Briefcase,
    label: "البالغون",
    range: "٣١ - ٥٠ سنة",
    color: "#F59E0B",
    desc: "إدارة الضغوط والوقاية من الانتكاسة",
    count: "٣٢ محاضرة",
  },
];

const lectures = [
  {
    id: 1,
    title: "أضرار المخدرات على الجهاز العصبي",
    speaker: "د. محمد الحارثي",
    speakerTitle: "استشاري طب الإدمان",
    category: "صحي",
    ageGroup: "adults",
    duration: "٤٥ دقيقة",
    views: "١٢,٤٠٠",
    rating: 4.9,
    type: "video",
    color: "#EF4444",
    tags: ["علمي", "طبي", "وقائي"],
    featured: true,
    description:
      "شرح علمي مبسط لكيفية تأثير المخدرات على خلايا الدماغ والجهاز العصبي المركزي",
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
    ageGroup: "children",
    duration: "٥٠ دقيقة",
    views: "١٨,٢٠٠",
    rating: 4.9,
    type: "video",
    color: "#EC4899",
    tags: ["أسري", "وقاية", "أطفال"],
    featured: true,
    description:
      "دليل عملي للوالدين للتعرف على علامات الإدمان المبكرة وكيفية التدخل",
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
    description:
      "تقرير شامل بأحدث الإحصائيات والاتجاهات في مجال الإدمان بالمملكة",
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

const RATINGS_KEY = "allah_yafik_lecture_ratings";

function loadRatings(): Record<string, { score: number; feedback: string[] }> {
  try {
    const raw = localStorage.getItem(RATINGS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch { return {}; }
}

function saveRating(lectureId: string | number, score: number, feedback: string[]) {
  const all = loadRatings();
  all[String(lectureId)] = { score, feedback };
  localStorage.setItem(RATINGS_KEY, JSON.stringify(all));
}

const ratingFeedbackOptions = [
  "محتوى علمي ممتاز",
  "سهل الفهم",
  "مفيد جداً",
  "يستحق المشاركة",
  "غيّر تفكيري",
  "أريد المزيد",
];

export default function Lectures() {
  const [selectedAge, setSelectedAge] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [playingId, setPlayingId] = useState<string | number | null>(null);
  const [, navigate] = useLocation();

  // Rating state
  const [ratings, setRatings] = useState(loadRatings);
  const [ratingScore, setRatingScore] = useState(0);
  const [ratingHover, setRatingHover] = useState(0);
  const [ratingFeedback, setRatingFeedback] = useState<string[]>([]);
  const [ratingSubmitted, setRatingSubmitted] = useState(false);

  const openLecture = (id: string | number) => {
    const existing = loadRatings()[String(id)];
    if (existing) {
      setRatingScore(existing.score);
      setRatingFeedback(existing.feedback);
      setRatingSubmitted(true);
    } else {
      setRatingScore(0);
      setRatingFeedback([]);
      setRatingSubmitted(false);
    }
    setRatingHover(0);
    setPlayingId(id);
  };

  const submitRating = () => {
    if (ratingScore === 0 || !playingId) {
      toast.error("يرجى اختيار تقييم أولاً");
      return;
    }
    saveRating(playingId, ratingScore, ratingFeedback);
    setRatings(loadRatings());
    setRatingSubmitted(true);
    toast.success("شكراً على تقييمك! رأيك يساعدنا على التحسين ⭐");
  };

  // Merge admin-created lectures from localStorage
  const allLectures = (() => {
    try {
      const raw = localStorage.getItem("allah_yafik_custom_lectures");
      if (!raw) return lectures;
      const custom = JSON.parse(raw) as {
        id: string;
        title: string;
        speaker: string;
        speakerTitle: string;
        category: string;
        ageGroup: string;
        duration: string;
        type: string;
        color: string;
        featured: boolean;
        subtitle?: string;
      }[];
      const mapped = custom.map(c => ({
        id: `custom-${c.id}`,
        title: c.title,
        speaker: c.speaker,
        speakerTitle: c.speakerTitle,
        category: c.category,
        ageGroup: c.ageGroup,
        duration: c.duration,
        views: "جديد",
        rating: 0,
        type: c.type,
        color: c.color,
        tags: [c.category],
        featured: c.featured,
        description: c.subtitle || "",
      }));
      return [...lectures, ...mapped];
    } catch {
      return lectures;
    }
  })();

  const filtered = allLectures.filter(l => {
    const matchAge = selectedAge === "all" || l.ageGroup === selectedAge;
    const matchSearch =
      l.title.includes(searchQuery) ||
      l.speaker.includes(searchQuery) ||
      l.tags.some(t => t.includes(searchQuery));
    return matchAge && matchSearch;
  });

  // فلترة محاضرات AI الحقيقية
  const aiLectures = lecturesData.filter(l => {
    const matchAge = selectedAge === "all" || l.ageGroup === selectedAge;
    const matchSearch =
      !searchQuery ||
      l.title.includes(searchQuery) ||
      l.speaker.includes(searchQuery) ||
      l.tags.some(t => t.includes(searchQuery));
    return matchAge && matchSearch;
  });

  return (
    <div className="app-container bg-gradient-navy">
      <Sidebar />
      {/* Ambient */}
      <div
        className="orb w-72 h-72 opacity-8 -top-20 -right-20"
        style={{ background: "#00D4AA" }}
      />

      {/* Header */}
      <div className="mobile-header px-5 py-4">
        <div>
          <div className="text-[#00D4AA] text-xs font-bold uppercase tracking-wider mb-1">
            مركز التوعية
          </div>
          <h1 className="text-white font-black text-xl">مكتبة المحاضرات</h1>
          <p className="text-white/40 text-xs mt-0.5">
            محاضرات متخصصة لجميع الفئات العمرية
          </p>
        </div>
      </div>

      <div className="page-content overflow-y-auto">
        <div className="px-4 pt-3 pb-6 space-y-5">
          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-2">
            {[
              {
                icon: Video,
                label: "محاضرة متاحة",
                value: "١٦٧",
                color: "#00D4AA",
              },
              {
                icon: Users,
                label: "مستفيد",
                value: "٨٥,٠٠٠+",
                color: "#F59E0B",
              },
              {
                icon: Star,
                label: "متوسط التقييم",
                value: "٤.٨",
                color: "#8B5CF6",
              },
              { icon: Globe, label: "لغة", value: "٣", color: "#EC4899" },
            ].map((s, i) => (
              <div
                key={i}
                className="flex items-center gap-2 rounded-xl bg-white/5 px-3 py-2.5 border border-white/5"
              >
                <s.icon className="w-4 h-4" style={{ color: s.color }} />
                <span className="text-white font-black text-sm">{s.value}</span>
                <span className="text-white/40 text-xs">{s.label}</span>
              </div>
            ))}
          </div>

          {/* Age Group Filter */}
          <div>
            <h3 className="text-white font-bold mb-3 flex items-center gap-2 text-sm">
              <Filter className="w-4 h-4 text-[#00D4AA]" />
              اختر الفئة العمرية
            </h3>
            <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
              <button
                onClick={() => setSelectedAge("all")}
                className={`flex-shrink-0 px-4 py-2.5 rounded-xl text-center transition-all border ${selectedAge === "all" ? "border-[#00D4AA]/50 bg-[#00D4AA]/10" : "border-white/7 bg-white/5"}`}
              >
                <div
                  className={`text-xs font-bold ${selectedAge === "all" ? "text-[#00D4AA]" : "text-white/70"}`}
                >
                  الكل
                </div>
              </button>
              {ageGroups.map(group => (
                <button
                  key={group.id}
                  onClick={() => setSelectedAge(group.id)}
                  className="flex-shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-xl text-center transition-all border"
                  style={
                    selectedAge === group.id
                      ? {
                          borderColor: `${group.color}50`,
                          background: `${group.color}10`,
                        }
                      : {
                          borderColor: "rgba(255,255,255,0.07)",
                          background: "rgba(255,255,255,0.05)",
                        }
                  }
                >
                  <group.icon
                    className="w-4 h-4"
                    style={{ color: group.color }}
                  />
                  <span
                    className="text-xs font-bold"
                    style={
                      selectedAge === group.id
                        ? { color: group.color }
                        : { color: "rgba(255,255,255,0.7)" }
                    }
                  >
                    {group.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <input
              type="text"
              placeholder="ابحث عن محاضرة، متحدث، أو موضوع..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/7 rounded-xl px-4 py-3 pr-11 text-white placeholder-white/30 text-sm focus:outline-none focus:border-[#00D4AA]/40"
            />
          </div>

          {/* AI-Powered Lectures */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-white font-bold text-sm flex items-center gap-2">
                <Brain className="w-4 h-4 text-[#8B5CF6]" />
                محاضرات تفاعلية
                <span className="px-2 py-0.5 rounded-full bg-[#8B5CF6]/15 border border-[#8B5CF6]/30 text-[#8B5CF6] text-[10px] font-bold">
                  جديد
                </span>
              </h3>
              <span className="text-white/30 text-xs">
                {aiLectures.length} محاضرة
              </span>
            </div>
            <div className="space-y-3">
              {aiLectures.map(lec => (
                <div
                  key={lec.id}
                  className="p-4 rounded-2xl border border-white/7 bg-white/3 transition-all cursor-pointer active:scale-[0.98]"
                  onClick={() => navigate(`/lectures/${lec.id}`)}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{
                        background: `${lec.color}20`,
                        border: `1px solid ${lec.color}30`,
                      }}
                    >
                      <BookOpen
                        className="w-5 h-5"
                        style={{ color: lec.color }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                        <span
                          className="px-1.5 py-0.5 rounded text-[10px] border font-bold"
                          style={{
                            background: `${lec.color}10`,
                            borderColor: `${lec.color}25`,
                            color: lec.color,
                          }}
                        >
                          {lec.category}
                        </span>
                        {lec.featured && (
                          <span className="px-1.5 py-0.5 rounded text-[10px] bg-[#F59E0B]/15 text-[#F59E0B] font-bold">
                            مميز
                          </span>
                        )}
                      </div>
                      <h4 className="text-white font-bold text-sm mb-0.5 leading-snug">
                        {lec.title}
                      </h4>
                      <p className="text-white/40 text-xs">{lec.speaker}</p>
                      <div className="flex items-center gap-3 text-white/30 text-xs mt-2">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {lec.duration}
                        </span>
                        <span className="flex items-center gap-1">
                          <Star className="w-3 h-3 text-[#F59E0B] fill-[#F59E0B]" />
                          {lec.rating}
                        </span>
                        <span className="flex items-center gap-1">
                          <Brain className="w-3 h-3 text-[#8B5CF6]" />
                          {lec.quiz.length} أسئلة
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Featured Lectures */}
          {selectedAge === "all" && searchQuery === "" && (
            <div>
              <h3 className="text-white font-bold text-sm mb-3 flex items-center gap-2">
                <Award className="w-4 h-4 text-[#F59E0B]" />
                المحاضرات المميزة
              </h3>
              <div className="space-y-3">
                {lectures
                  .filter(l => l.featured)
                  .map(lecture => {
                    const TypeIcon = typeIcons[lecture.type] || Video;
                    return (
                      <div
                        key={lecture.id}
                        className="rounded-2xl border border-white/7 bg-white/3 overflow-hidden cursor-pointer active:scale-[0.98] transition-all"
                        onClick={() => openLecture(lecture.id)}
                      >
                        {/* Thumbnail */}
                        <div
                          className="relative h-32 overflow-hidden"
                          style={{
                            background: `linear-gradient(135deg, ${lecture.color}25, ${lecture.color}10)`,
                          }}
                        >
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-12 h-12 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center border border-white/20">
                              <Play className="w-5 h-5 text-white mr-0.5" />
                            </div>
                          </div>
                          <div className="absolute top-2 right-2">
                            <span className="px-2 py-0.5 rounded text-[10px] bg-[#F59E0B]/20 text-[#F59E0B] font-bold">
                              {lecture.category}
                            </span>
                          </div>
                          <div className="absolute bottom-2 left-2 flex items-center gap-1 text-white/70 text-xs">
                            <Clock className="w-3 h-3" />
                            {lecture.duration}
                          </div>
                        </div>
                        <div className="p-3">
                          <h4 className="text-white font-bold text-sm mb-0.5">
                            {lecture.title}
                          </h4>
                          <p className="text-white/40 text-xs mb-2">
                            {lecture.speaker}
                          </p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1">
                              <Star className="w-3 h-3 text-[#F59E0B] fill-[#F59E0B]" />
                              <span className="text-white/60 text-xs">
                                {lecture.rating}
                              </span>
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
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-white font-bold text-sm flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-[#00D4AA]" />
                {selectedAge === "all"
                  ? "جميع المحاضرات"
                  : `محاضرات ${ageGroups.find(g => g.id === selectedAge)?.label}`}
                <span className="px-2 py-0.5 rounded-full bg-[#00D4AA]/15 text-[#00D4AA] text-[10px] font-bold">
                  {filtered.length}
                </span>
              </h3>
            </div>
            <div className="space-y-2">
              {filtered.map(lecture => {
                const TypeIcon = typeIcons[lecture.type] || Video;
                return (
                  <div
                    key={lecture.id}
                    className="p-3 rounded-xl border border-white/5 bg-white/3 flex items-center gap-3 cursor-pointer active:scale-[0.98] transition-all"
                    onClick={() => openLecture(lecture.id)}
                  >
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{
                        background: `${lecture.color}20`,
                        border: `1px solid ${lecture.color}30`,
                      }}
                    >
                      <TypeIcon
                        className="w-4 h-4"
                        style={{ color: lecture.color }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-white font-bold text-sm truncate">
                        {lecture.title}
                      </h4>
                      <p className="text-white/40 text-xs">
                        {lecture.speaker} · {lecture.duration}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <Star className="w-3 h-3 text-[#F59E0B] fill-[#F59E0B]" />
                      <span className="text-white/50 text-xs">
                        {ratings[String(lecture.id)]?.score || lecture.rating || "—"}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Upcoming Live Sessions */}
          <div>
            <h3 className="text-white font-bold text-sm mb-3 flex items-center gap-2">
              <Bell className="w-4 h-4 text-[#EF4444]" />
              الجلسات المباشرة القادمة
              <span className="px-2 py-0.5 rounded-full bg-[#EF4444]/15 text-[#EF4444] text-[10px] font-bold">
                مباشر
              </span>
            </h3>
            <div className="space-y-3">
              {upcomingLive.map((session, i) => (
                <div
                  key={i}
                  className="p-4 rounded-2xl border border-white/5 bg-white/3"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div
                      className="w-2 h-2 rounded-full animate-pulse"
                      style={{ background: session.color }}
                    />
                    <span
                      className="text-xs font-bold"
                      style={{ color: session.color }}
                    >
                      قادم قريباً
                    </span>
                  </div>
                  <h4 className="text-white font-bold text-sm mb-2">
                    {session.title}
                  </h4>
                  <div className="space-y-1 mb-3">
                    <div className="flex items-center gap-2 text-white/40 text-xs">
                      <Calendar className="w-3 h-3" />
                      {session.date} · {session.time}
                    </div>
                    <div className="flex items-center gap-2 text-white/40 text-xs">
                      <Mic className="w-3 h-3" />
                      {session.speaker}
                    </div>
                    <div className="flex items-center gap-2 text-white/40 text-xs">
                      <Users className="w-3 h-3" />
                      {session.registered} مسجل
                    </div>
                  </div>
                  <button
                    className="w-full py-2.5 rounded-xl text-sm font-bold transition-all"
                    style={{
                      background: `${session.color}15`,
                      color: session.color,
                      border: `1px solid ${session.color}30`,
                    }}
                  >
                    سجّل الآن
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Request Lecture CTA */}
          <div className="p-4 rounded-2xl border border-[#F59E0B]/20 bg-[#F59E0B]/5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#F59E0B] to-[#FBBF24] flex items-center justify-center flex-shrink-0">
                <Mic className="w-5 h-5 text-[#060B18]" />
              </div>
              <div>
                <h4 className="text-white font-black text-sm">
                  محاضرة لمؤسستك؟
                </h4>
                <p className="text-white/50 text-xs">
                  نقدم محاضرات توعوية مخصصة
                </p>
              </div>
            </div>
            <a
              href={`tel:${CONTACT_PHONE}`}
              className="w-full block text-center py-2.5 rounded-xl text-sm font-bold bg-[#F59E0B]/15 text-[#F59E0B] border border-[#F59E0B]/30"
            >
              <Phone className="w-4 h-4 inline ml-1" />
              اطلب الآن: {CONTACT_PHONE}
            </a>
          </div>
        </div>
      </div>

      {/* Video Player Modal */}
      {playingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/90 backdrop-blur-sm"
            onClick={() => setPlayingId(null)}
          />
          <div className="relative rounded-2xl border border-white/10 bg-[#0A0F1E] p-5 max-w-lg w-full z-10">
            <button
              onClick={() => setPlayingId(null)}
              className="absolute top-3 left-3 w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-white/50 hover:text-white"
            >
              ✕
            </button>
            {(() => {
              const lecture = allLectures.find(l => l.id === playingId);
              if (!lecture) return null;
              return (
                <>
                  <div
                    className="h-48 rounded-xl mb-4 flex items-center justify-center"
                    style={{
                      background: `linear-gradient(135deg, ${lecture.color}20, ${lecture.color}08)`,
                    }}
                  >
                    <div className="text-center">
                      <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-2">
                        <Play className="w-6 h-6 text-white mr-0.5" />
                      </div>
                      <p className="text-white/50 text-xs">
                        محاكاة تشغيل المحاضرة
                      </p>
                    </div>
                  </div>
                  <h3 className="text-white font-black text-base mb-1">
                    {lecture.title}
                  </h3>
                  <p className="text-white/50 text-xs mb-2">
                    {lecture.speaker} · {lecture.speakerTitle}
                  </p>
                  <p className="text-white/60 text-xs leading-relaxed mb-4">
                    {lecture.description}
                  </p>
                  <div className="flex gap-2">
                    <button className="flex-1 py-3 rounded-xl font-bold text-sm bg-[#00D4AA]/15 text-[#00D4AA] border border-[#00D4AA]/30 flex items-center justify-center gap-2">
                      <Play className="w-4 h-4" />
                      تشغيل
                    </button>
                    <button className="w-11 h-11 rounded-xl bg-white/5 flex items-center justify-center text-white/50 border border-white/7">
                      <Download className="w-4 h-4" />
                    </button>
                    <button className="w-11 h-11 rounded-xl bg-white/5 flex items-center justify-center text-white/50 border border-white/7">
                      <Share2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Rating Section */}
                  <div className="mt-5 pt-4 border-t border-white/8">
                    {ratingSubmitted ? (
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-1 mb-2">
                          {[1, 2, 3, 4, 5].map(s => (
                            <Star
                              key={s}
                              className={`w-5 h-5 ${s <= ratingScore ? "text-[#F59E0B] fill-[#F59E0B]" : "text-white/15"}`}
                            />
                          ))}
                        </div>
                        <p className="text-[#00D4AA] text-xs font-bold mb-1">تم التقييم — شكراً لك!</p>
                        {ratingFeedback.length > 0 && (
                          <div className="flex flex-wrap gap-1 justify-center mt-2">
                            {ratingFeedback.map(f => (
                              <span key={f} className="px-2 py-0.5 rounded-full bg-[#F59E0B]/10 text-[#F59E0B] text-[10px]">{f}</span>
                            ))}
                          </div>
                        )}
                        <button
                          onClick={() => setRatingSubmitted(false)}
                          className="mt-2 text-white/30 text-xs hover:text-white/60 transition-colors"
                        >
                          تعديل التقييم
                        </button>
                      </div>
                    ) : (
                      <div>
                        <p className="text-white/60 text-sm font-bold text-center mb-3">قيّم هذه المحاضرة</p>
                        <div className="flex items-center justify-center gap-2 mb-3">
                          {[1, 2, 3, 4, 5].map(s => (
                            <button
                              key={s}
                              onMouseEnter={() => setRatingHover(s)}
                              onMouseLeave={() => setRatingHover(0)}
                              onClick={() => setRatingScore(s)}
                              className="transition-transform hover:scale-110"
                            >
                              <Star
                                className={`w-7 h-7 transition-colors ${
                                  s <= (ratingHover || ratingScore)
                                    ? "text-[#F59E0B] fill-[#F59E0B]"
                                    : "text-white/15"
                                }`}
                              />
                            </button>
                          ))}
                        </div>
                        {ratingScore > 0 && (
                          <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}>
                            <div className="flex flex-wrap gap-1.5 justify-center mb-3">
                              {ratingFeedbackOptions.map(opt => (
                                <button
                                  key={opt}
                                  onClick={() =>
                                    setRatingFeedback(prev =>
                                      prev.includes(opt) ? prev.filter(f => f !== opt) : [...prev, opt]
                                    )
                                  }
                                  className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition-all border ${
                                    ratingFeedback.includes(opt)
                                      ? "bg-[#F59E0B]/15 text-[#F59E0B] border-[#F59E0B]/25"
                                      : "bg-white/5 text-white/40 border-white/8 hover:text-white"
                                  }`}
                                >
                                  {opt}
                                </button>
                              ))}
                            </div>
                            <button
                              onClick={submitRating}
                              className="w-full py-2.5 rounded-xl font-bold text-sm bg-[#F59E0B]/15 text-[#F59E0B] border border-[#F59E0B]/25 hover:bg-[#F59E0B]/25 transition-all"
                            >
                              إرسال التقييم
                            </button>
                          </motion.div>
                        )}
                      </div>
                    )}
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
}
