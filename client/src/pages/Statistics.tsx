/*
 * Design: Dark Luxury Wellness v2 - Statistics Page
 * Features: Personal + National stats, partner contributions, advanced charts
 * Style: Recharts visualizations, dark theme, teal/gold/purple
 */
import { useState } from "react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
} from "recharts";
import {
  TrendingUp,
  Award,
  Calendar,
  Flame,
  Target,
  Heart,
  Brain,
  Zap,
  Users,
  Shield,
  Hospital,
  BookOpen,
  AlertTriangle,
  Globe,
  BarChart2,
  Phone,
  ArrowUp,
  ArrowDown,
  Activity,
} from "lucide-react";

const CONTACT_PHONE = "0546192019";

// Personal data
const monthlyData = [
  { month: "أكتوبر", mood: 5.2, urge: 6.8 },
  { month: "نوفمبر", mood: 6.1, urge: 5.2 },
  { month: "ديسمبر", mood: 6.8, urge: 4.1 },
  { month: "يناير", mood: 7.2, urge: 3.5 },
  { month: "فبراير", mood: 7.8, urge: 2.8 },
  { month: "مارس", mood: 8.2, urge: 2.1 },
];
const weeklyMood = [
  { day: "السبت", mood: 6, urge: 4, energy: 7 },
  { day: "الأحد", mood: 7, urge: 3, energy: 8 },
  { day: "الاثنين", mood: 5, urge: 6, energy: 5 },
  { day: "الثلاثاء", mood: 8, urge: 2, energy: 9 },
  { day: "الأربعاء", mood: 7, urge: 3, energy: 7 },
  { day: "الخميس", mood: 9, urge: 1, energy: 8 },
  { day: "الجمعة", mood: 8, urge: 2, energy: 8 },
];
const triggerData = [
  { name: "ضغط العمل", value: 35, color: "#EF4444" },
  { name: "الوحدة", value: 25, color: "#F59E0B" },
  { name: "الملل", value: 20, color: "#8B5CF6" },
  { name: "التعب", value: 12, color: "#0EA5E9" },
  { name: "أخرى", value: 8, color: "#10B981" },
];
const exerciseData = [
  { week: "أسبوع ١", breathing: 5, meditation: 3, walking: 2 },
  { week: "أسبوع ٢", breathing: 6, meditation: 4, walking: 3 },
  { week: "أسبوع ٣", breathing: 7, meditation: 5, walking: 4 },
  { week: "أسبوع ٤", breathing: 7, meditation: 6, walking: 5 },
];
const achievements = [
  {
    emoji: "🏆",
    title: "أول ٧ أيام",
    desc: "أكملت أسبوعك الأول",
    date: "٢٠ يناير",
    color: "#F59E0B",
  },
  {
    emoji: "⭐",
    title: "٣٠ يوم نظيف",
    desc: "شهر كامل من القوة",
    date: "١٢ فبراير",
    color: "#00D4AA",
  },
  {
    emoji: "🔥",
    title: "سلسلة ٤٥ يوم",
    desc: "٤٥ يوم متواصل",
    date: "٢٧ فبراير",
    color: "#EF4444",
  },
  {
    emoji: "💪",
    title: "محارب الإغراء",
    desc: "تغلبت على ١٠ إغراءات",
    date: "١ مارس",
    color: "#8B5CF6",
  },
  {
    emoji: "🧘",
    title: "المتأمل المنتظم",
    desc: "٢١ يوم تأمل متواصل",
    date: "٣ مارس",
    color: "#EC4899",
  },
  {
    emoji: "📖",
    title: "كاتب اليومية",
    desc: "٣٠ تسجيل يومي",
    date: "٤ مارس",
    color: "#0EA5E9",
  },
];

// National data
const yearlyTrend = [
  { year: "٢٠١٩", cases: 28000, recovered: 8000, prevented: 15000 },
  { year: "٢٠٢٠", cases: 31000, recovered: 10000, prevented: 18000 },
  { year: "٢٠٢١", cases: 35000, recovered: 13000, prevented: 22000 },
  { year: "٢٠٢٢", cases: 38000, recovered: 16000, prevented: 28000 },
  { year: "٢٠٢٣", cases: 40000, recovered: 19000, prevented: 35000 },
  { year: "٢٠٢٤", cases: 42000, recovered: 22000, prevented: 44000 },
  { year: "٢٠٢٥", cases: 39000, recovered: 26000, prevented: 58000 },
];
const ageDistribution = [
  { age: "١٢-١٨", value: 18, color: "#3B82F6" },
  { age: "١٩-٢٥", value: 32, color: "#00D4AA" },
  { age: "٢٦-٣٥", value: 28, color: "#F59E0B" },
  { age: "٣٦-٤٥", value: 14, color: "#8B5CF6" },
  { age: "٤٦+", value: 8, color: "#EF4444" },
];
const substanceTypes = [
  { name: "الحشيش", value: 35, color: "#10B981" },
  { name: "الأمفيتامين", value: 28, color: "#EF4444" },
  { name: "الكحول", value: 18, color: "#F59E0B" },
  { name: "المهدئات", value: 12, color: "#8B5CF6" },
  { name: "أخرى", value: 7, color: "#6B7280" },
];
const radarData = [
  { subject: "الصحة النفسية", A: 72, B: 45 },
  { subject: "العلاقات الأسرية", A: 68, B: 38 },
  { subject: "الأداء الوظيفي", A: 81, B: 52 },
  { subject: "الاستقرار المالي", A: 65, B: 41 },
  { subject: "الصحة الجسدية", A: 78, B: 49 },
  { subject: "التكيف الاجتماعي", A: 74, B: 43 },
];
const partnerContrib = [
  { label: "القطاع الصحي", value: 38, color: "#EF4444", icon: Hospital },
  { label: "القطاع الأكاديمي", value: 22, color: "#3B82F6", icon: BookOpen },
  { label: "القطاع الأمني", value: 18, color: "#10B981", icon: Shield },
  { label: "القطاع الديني", value: 14, color: "#F59E0B", icon: BookOpen },
  { label: "مكافحة المخدرات", value: 8, color: "#8B5CF6", icon: AlertTriangle },
];

const tooltipStyle = {
  contentStyle: {
    background: "var(--card)",
    border: "1px solid var(--border)",
    borderRadius: "12px",
    color: "var(--foreground)",
    direction: "rtl" as const,
    fontSize: "12px",
  },
  labelStyle: { color: "#00D4AA" },
};

export default function Statistics() {
  const [activeTab, setActiveTab] = useState<"personal" | "national">(
    "personal"
  );

  return (
    <div className="app-container bg-gradient-navy overflow-hidden">
      <div className="orb w-72 h-72 opacity-8 -top-20 -right-20" style={{ background: "oklch(0.55 0.25 290)" }} />

      {/* Header */}
      <div className="mobile-header px-5 py-4">
        <div>
          <div className="text-violet-500 text-xs font-bold uppercase tracking-wider mb-1">
            لوحة الإحصائيات
          </div>
          <h1 className="text-foreground font-black text-xl">البيانات والإحصائيات</h1>
          <p className="text-muted-foreground text-xs mt-0.5">تتبع تقدمك والإحصائيات الوطنية</p>
        </div>
        <div className="flex gap-2 mt-3">
          <button
            onClick={() => setActiveTab("personal")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${activeTab === "personal" ? "bg-primary text-primary-foreground" : "glass-card text-muted-foreground border border-border"}`}
          >
            <Activity className="w-3.5 h-3.5" />
            تقدمي الشخصي
          </button>
          <button
            onClick={() => setActiveTab("national")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${activeTab === "national" ? "bg-primary text-primary-foreground" : "glass-card text-muted-foreground border border-border"}`}
          >
            <Globe className="w-3.5 h-3.5" />
            الوطنية
          </button>
        </div>
      </div>

      <div className="page-content overflow-y-auto">
        <div className="px-4 pt-3">
          {activeTab === "personal" ? (
            <>
              {/* Personal Stats */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {[
                  {
                    label: "أيام نظيفة",
                    value: "١٤٥",
                    icon: Calendar,
                    color: "from-primary to-sky-500",
                    sub: "منذ البداية",
                  },
                  {
                    label: "أعلى سلسلة",
                    value: "٤٧",
                    icon: Flame,
                    color: "from-red-500 to-amber-500",
                    sub: "يوم متواصل",
                  },
                  {
                    label: "متوسط المزاج",
                    value: "٧.٢",
                    icon: Heart,
                    color: "from-pink-500 to-violet-500",
                    sub: "من ١٠",
                  },
                  {
                    label: "تمارين مكتملة",
                    value: "٨٩",
                    icon: Brain,
                    color: "from-violet-500 to-blue-500",
                    sub: "تمرين",
                  },
                ].map((stat, i) => (
                  <div key={i} className="stat-card p-4">
                    <div
                      className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-4`}
                    >
                      <stat.icon className="w-5 h-5 text-foreground" />
                    </div>
                    <div className="text-2xl font-black text-foreground font-numbers mb-1">
                      {stat.value}
                    </div>
                    <div className="text-muted-foreground text-xs mb-1">
                      {stat.label}
                    </div>
                    <div className="text-primary text-xs">{stat.sub}</div>
                  </div>
                ))}
              </div>

              <div className="grid gap-4 mb-4">
                <div className="lg:col-span-2 glass-card p-4 border border-border">
                  <div className="flex items-center justify-between mb-5">
                    <h3 className="text-foreground font-bold">التقدم الشهري</h3>
                    <TrendingUp className="w-5 h-5 text-primary" />
                  </div>
                  <ResponsiveContainer width="100%" height={220}>
                    <AreaChart data={monthlyData}>
                      <defs>
                        <linearGradient id="moodG" x1="0" y1="0" x2="0" y2="1">
                          <stop
                            offset="5%"
                            stopColor="#00D4AA"
                            stopOpacity={0.3}
                          />
                          <stop
                            offset="95%"
                            stopColor="#00D4AA"
                            stopOpacity={0}
                          />
                        </linearGradient>
                        <linearGradient id="urgeG" x1="0" y1="0" x2="0" y2="1">
                          <stop
                            offset="5%"
                            stopColor="#EF4444"
                            stopOpacity={0.3}
                          />
                          <stop
                            offset="95%"
                            stopColor="#EF4444"
                            stopOpacity={0}
                          />
                        </linearGradient>
                      </defs>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="var(--secondary)"
                      />
                      <XAxis
                        dataKey="month"
                        tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <YAxis
                        tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
                        axisLine={false}
                        tickLine={false}
                        domain={[0, 10]}
                      />
                      <Tooltip {...tooltipStyle} />
                      <Area
                        type="monotone"
                        dataKey="mood"
                        name="المزاج"
                        stroke="#00D4AA"
                        strokeWidth={2}
                        fill="url(#moodG)"
                      />
                      <Area
                        type="monotone"
                        dataKey="urge"
                        name="الإغراء"
                        stroke="#EF4444"
                        strokeWidth={2}
                        fill="url(#urgeG)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
                <div className="glass-card p-4 border border-border">
                  <h3 className="text-foreground font-bold mb-5">أسباب الإغراء</h3>
                  <ResponsiveContainer width="100%" height={160}>
                    <PieChart>
                      <Pie
                        data={triggerData}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={70}
                        dataKey="value"
                        paddingAngle={3}
                      >
                        {triggerData.map((entry, i) => (
                          <Cell key={i} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={tooltipStyle.contentStyle} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="space-y-2 mt-3">
                    {triggerData.map((item, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between text-xs"
                      >
                        <div className="flex items-center gap-2">
                          <div
                            className="w-2.5 h-2.5 rounded-full"
                            style={{ background: item.color }}
                          />
                          <span className="text-muted-foreground">{item.name}</span>
                        </div>
                        <span className="text-foreground/80 font-medium">
                          {item.value}٪
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid gap-4 mb-4">
                <div className="glass-card p-4 border border-border">
                  <h3 className="text-foreground font-bold mb-5">
                    المزاج والطاقة - هذا الأسبوع
                  </h3>
                  <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={weeklyMood}>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="var(--secondary)"
                      />
                      <XAxis
                        dataKey="day"
                        tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <YAxis
                        tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
                        axisLine={false}
                        tickLine={false}
                        domain={[0, 10]}
                      />
                      <Tooltip {...tooltipStyle} />
                      <Line
                        type="monotone"
                        dataKey="mood"
                        name="المزاج"
                        stroke="#00D4AA"
                        strokeWidth={2.5}
                        dot={{ fill: "#00D4AA", r: 4 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="energy"
                        name="الطاقة"
                        stroke="#F59E0B"
                        strokeWidth={2.5}
                        dot={{ fill: "#F59E0B", r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <div className="glass-card p-4 border border-border">
                  <h3 className="text-foreground font-bold mb-5">
                    التمارين الأسبوعية
                  </h3>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={exerciseData}>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="var(--secondary)"
                      />
                      <XAxis
                        dataKey="week"
                        tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <YAxis
                        tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <Tooltip {...tooltipStyle} />
                      <Bar
                        dataKey="breathing"
                        name="تنفس"
                        fill="#00D4AA"
                        radius={[4, 4, 0, 0]}
                      />
                      <Bar
                        dataKey="meditation"
                        name="تأمل"
                        fill="#8B5CF6"
                        radius={[4, 4, 0, 0]}
                      />
                      <Bar
                        dataKey="walking"
                        name="مشي"
                        fill="#F59E0B"
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="glass-card p-4 border border-border">
                <div className="flex items-center gap-3 mb-5">
                  <Award className="w-5 h-5 text-accent" />
                  <h3 className="text-foreground font-bold">الإنجازات المحققة</h3>
                  <span className="text-muted-foreground/70 text-sm mr-auto">
                    {achievements.length} إنجاز
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {achievements.map((ach, i) => (
                    <div
                      key={i}
                      className="text-center p-4 rounded-xl bg-secondary/40 border border-border hover:border-border transition-all"
                    >
                      <div className="text-3xl mb-2">{ach.emoji}</div>
                      <div className="text-foreground text-xs font-bold mb-1">
                        {ach.title}
                      </div>
                      <div className="text-muted-foreground text-xs mb-2">
                        {ach.desc}
                      </div>
                      <div
                        className="text-xs font-medium"
                        style={{ color: ach.color }}
                      >
                        {ach.date}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <>
              {/* National Stats */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {[
                  {
                    label: "مؤشرات الحالات",
                    value: "متابعة دورية",
                    change: "بيانات وصفية",
                    up: true,
                    color: "#EF4444",
                    icon: Users,
                  },
                  {
                    label: "مسار التعافي",
                    value: "تحسن تدريجي",
                    change: "وفق الخطة",
                    up: true,
                    color: "#10B981",
                    icon: Heart,
                  },
                  {
                    label: "برامج الوقاية",
                    value: "تفعيل مستمر",
                    change: "تطوير متواصل",
                    up: true,
                    color: "#00D4AA",
                    icon: Shield,
                  },
                  {
                    label: "استخدام التطبيق",
                    value: "نشاط مستمر",
                    change: "مراجعة دورية",
                    up: true,
                    color: "#F59E0B",
                    icon: Activity,
                  },
                ].map((kpi, i) => (
                  <div key={i} className="stat-card p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div
                        className="w-9 h-9 rounded-xl flex items-center justify-center"
                        style={{ background: `${kpi.color}20` }}
                      >
                        <kpi.icon
                          className="w-4 h-4"
                          style={{ color: kpi.color }}
                        />
                      </div>
                      <div
                        className={`flex items-center gap-0.5 text-xs font-bold ${kpi.up ? "text-emerald-500" : "text-destructive"}`}
                      >
                        {kpi.up ? (
                          <ArrowUp className="w-3 h-3" />
                        ) : (
                          <ArrowDown className="w-3 h-3" />
                        )}
                        {kpi.change}
                      </div>
                    </div>
                    <div className="text-2xl font-black text-foreground font-numbers mb-1">
                      {kpi.value}
                    </div>
                    <div className="text-muted-foreground text-xs">{kpi.label}</div>
                  </div>
                ))}
              </div>

              <div className="grid gap-4 mb-4">
                <div className="lg:col-span-2 glass-card p-4 border border-border">
                  <h3 className="text-foreground font-bold mb-1">
                    الاتجاه السنوي ٢٠١٩ - ٢٠٢٥
                  </h3>
                  <div className="flex gap-3 text-xs mb-4">
                    {[
                      { color: "#EF4444", label: "حالات" },
                      { color: "#00D4AA", label: "تعافي" },
                      { color: "#F59E0B", label: "وقاية" },
                    ].map((l, i) => (
                      <div key={i} className="flex items-center gap-1.5">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ background: l.color }}
                        />
                        <span className="text-muted-foreground">{l.label}</span>
                      </div>
                    ))}
                  </div>
                  <ResponsiveContainer width="100%" height={220}>
                    <AreaChart data={yearlyTrend}>
                      <defs>
                        {[
                          { id: "nc", color: "#EF4444" },
                          { id: "nr", color: "#00D4AA" },
                          { id: "np", color: "#F59E0B" },
                        ].map(g => (
                          <linearGradient
                            key={g.id}
                            id={g.id}
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                          >
                            <stop
                              offset="5%"
                              stopColor={g.color}
                              stopOpacity={0.25}
                            />
                            <stop
                              offset="95%"
                              stopColor={g.color}
                              stopOpacity={0}
                            />
                          </linearGradient>
                        ))}
                      </defs>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="var(--secondary)"
                      />
                      <XAxis
                        dataKey="year"
                        tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <YAxis
                        tick={{ fill: "var(--muted-foreground)", fontSize: 10 }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <Tooltip {...tooltipStyle} />
                      <Area
                        type="monotone"
                        dataKey="cases"
                        name="الحالات"
                        stroke="#EF4444"
                        strokeWidth={2}
                        fill="url(#nc)"
                      />
                      <Area
                        type="monotone"
                        dataKey="recovered"
                        name="التعافي"
                        stroke="#00D4AA"
                        strokeWidth={2}
                        fill="url(#nr)"
                      />
                      <Area
                        type="monotone"
                        dataKey="prevented"
                        name="الوقاية"
                        stroke="#F59E0B"
                        strokeWidth={2}
                        fill="url(#np)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
                <div className="glass-card p-4 border border-border">
                  <h3 className="text-foreground font-bold mb-1">
                    توزيع الفئات العمرية
                  </h3>
                  <p className="text-muted-foreground text-xs mb-3">
                    نسبة الإدمان حسب العمر
                  </p>
                  <ResponsiveContainer width="100%" height={160}>
                    <PieChart>
                      <Pie
                        data={ageDistribution}
                        cx="50%"
                        cy="50%"
                        innerRadius={45}
                        outerRadius={70}
                        dataKey="value"
                        paddingAngle={3}
                      >
                        {ageDistribution.map((entry, i) => (
                          <Cell key={i} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={tooltipStyle.contentStyle} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="space-y-1.5 mt-2">
                    {ageDistribution.map((item, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2">
                          <div
                            className="w-2.5 h-2.5 rounded-full"
                            style={{ background: item.color }}
                          />
                          <span className="text-muted-foreground text-xs">
                            {item.age} سنة
                          </span>
                        </div>
                        <span className="text-foreground font-bold text-xs font-numbers">
                          {item.value}٪
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid gap-4 mb-4">
                <div className="glass-card p-4 border border-border">
                  <h3 className="text-foreground font-bold mb-4">
                    أنواع المواد المخدرة
                  </h3>
                  <div className="space-y-3">
                    {substanceTypes.map((item, i) => (
                      <div key={i}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-foreground/70 text-sm">
                            {item.name}
                          </span>
                          <span className="text-foreground font-bold text-sm font-numbers">
                            {item.value}٪
                          </span>
                        </div>
                        <div className="h-2 bg-secondary/60 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full progress-bar-animated"
                            style={{
                              width: `${item.value}%`,
                              background: item.color,
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="glass-card p-4 border border-border">
                  <h3 className="text-foreground font-bold mb-1">
                    مؤشرات جودة الحياة
                  </h3>
                  <div className="flex gap-3 text-xs mb-2">
                    <div className="flex items-center gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-primary" />
                      <span className="text-muted-foreground">بعد التعافي</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-destructive" />
                      <span className="text-muted-foreground">قبل التعافي</span>
                    </div>
                  </div>
                  <ResponsiveContainer width="100%" height={200}>
                    <RadarChart data={radarData}>
                      <PolarGrid stroke="var(--border)" />
                      <PolarAngleAxis
                        dataKey="subject"
                        tick={{ fill: "var(--muted-foreground)", fontSize: 9 }}
                      />
                      <Radar
                        name="بعد"
                        dataKey="A"
                        stroke="#00D4AA"
                        fill="#00D4AA"
                        fillOpacity={0.2}
                      />
                      <Radar
                        name="قبل"
                        dataKey="B"
                        stroke="#EF4444"
                        fill="#EF4444"
                        fillOpacity={0.15}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Partner Contribution */}
              <div className="glass-card p-4 border border-border">
                <h3 className="text-foreground font-bold mb-6 flex items-center gap-2">
                  <Globe className="w-4 h-4 text-primary" />
                  مساهمة قطاعات الشراكة في التعافي
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {partnerContrib.map((sector, i) => (
                    <div
                      key={i}
                      className="text-center p-4 rounded-2xl"
                      style={{
                        background: `${sector.color}08`,
                        border: `1px solid ${sector.color}15`,
                      }}
                    >
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-3"
                        style={{ background: `${sector.color}20` }}
                      >
                        <sector.icon
                          className="w-5 h-5"
                          style={{ color: sector.color }}
                        />
                      </div>
                      <div
                        className="text-2xl font-black font-numbers mb-1"
                        style={{ color: sector.color }}
                      >
                        {sector.value}٪
                      </div>
                      <div className="text-muted-foreground text-xs leading-tight">
                        {sector.label}
                      </div>
                      <div className="mt-2 h-1.5 bg-secondary/60 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${sector.value * 2.5}%`,
                            background: sector.color,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
