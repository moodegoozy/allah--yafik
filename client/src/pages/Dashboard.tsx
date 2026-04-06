/**
 * Dashboard - لوحة التحكم الوقائية
 * Design: Dark Luxury Wellness - الله يعافيك
 * الهدف: الوقاية من الإدمان — تتبع الوعي والأنشطة الوقائية
 */
import { Link } from "wouter";
import {
  Shield,
  TrendingUp,
  Heart,
  BookOpen,
  Calendar,
  Brain,
  Award,
  Bell,
  Zap,
  Activity,
  CheckCircle2,
  Circle,
  Sparkles,
  Users,
  Lightbulb,
  Target,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadialBarChart,
  RadialBar,
} from "recharts";

const awarenessData = [
  { day: "السبت", awareness: 6, risk: 4 },
  { day: "الأحد", awareness: 7, risk: 3 },
  { day: "الاثنين", awareness: 8, risk: 3 },
  { day: "الثلاثاء", awareness: 8, risk: 2 },
  { day: "الأربعاء", awareness: 9, risk: 2 },
  { day: "الخميس", awareness: 9, risk: 1 },
  { day: "الجمعة", awareness: 10, risk: 1 },
];

const progressData = [
  { name: "الوعي الوقائي", value: 82, fill: "#00D4AA" },
];

const recentActivities = [
  { icon: BookOpen, text: "أكملت محاضرة: علم الأعصاب والإدمان", time: "منذ ٢ ساعة", color: "text-[#00D4AA]" },
  { icon: Brain, text: "أجريت تقييم مستوى الخطر — نتيجة: منخفض", time: "منذ ٥ ساعات", color: "text-[#F59E0B]" },
  { icon: Award, text: "حصلت على شهادة محاضرة التوعية الدينية", time: "أمس", color: "text-[#8B5CF6]" },
  { icon: Shield, text: "أكملت خطة الوقاية الأسبوعية", time: "أمس", color: "text-[#10B981]" },
];

const todayTasks = [
  { label: "قراءة مقال توعوي يومي", done: true },
  { label: "تمرين مهارة رفض الضغط الاجتماعي", done: true },
  { label: "أذكار الصباح والمساء", done: false },
  { label: "التواصل مع مجتمع الوقاية", done: false },
  { label: "مراجعة خطة الوقاية الأسبوعية", done: false },
];

const quickActions = [
  { label: "تقييمي", icon: Brain, href: "/assessment", color: "from-[#00D4AA] to-[#0EA5E9]" },
  { label: "محاضرة", icon: BookOpen, href: "/lectures", color: "from-[#8B5CF6] to-[#EC4899]" },
  { label: "خطتي الوقائية", icon: Shield, href: "/recovery", color: "from-[#F59E0B] to-[#EF4444]" },
  { label: "إنجازاتي", icon: Award, href: "/achievements", color: "from-[#10B981] to-[#3B82F6]" },
];

export default function Dashboard() {
  const lecturesCompleted = 3;
  const preventionScore = 82;

  return (
    <div className="min-h-screen bg-[#0A0F1E] text-white flex">
      {/* Main Content */}
      <main className="flex-1 p-4 md:p-6 overflow-y-auto min-h-screen pb-24">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="w-5 h-5 text-[#F59E0B]" />
              <span className="text-[#F59E0B] text-sm font-medium">أنت تسير بالاتجاه الصحيح!</span>
            </div>
            <h1 className="text-xl font-black text-white">لوحة الوقاية 🛡️</h1>
            <p className="text-white/50 text-sm mt-1">
              {new Date().toLocaleDateString("ar-SA", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
            </p>
          </div>
          <Link href="/notifications">
            <button className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:border-[#00D4AA]/30 transition-all relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#EF4444]" />
            </button>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <div className="rounded-2xl p-4 border border-white/8" style={{ background: "linear-gradient(135deg, rgba(0,212,170,0.15), rgba(14,165,233,0.08))" }}>
            <div className="flex items-center gap-2 mb-2">
              <Shield className="w-4 h-4 text-[#00D4AA]" />
              <span className="text-white/50 text-xs">مستوى الوقاية</span>
            </div>
            <div className="text-3xl font-black text-white">{preventionScore}%</div>
            <div className="text-[#00D4AA] text-xs mt-1">ممتاز</div>
          </div>

          <div className="rounded-2xl p-4 border border-white/8" style={{ background: "linear-gradient(135deg, rgba(139,92,246,0.15), rgba(59,130,246,0.08))" }}>
            <div className="flex items-center gap-2 mb-2">
              <BookOpen className="w-4 h-4 text-[#8B5CF6]" />
              <span className="text-white/50 text-xs">المحاضرات</span>
            </div>
            <div className="text-3xl font-black text-white">{lecturesCompleted}</div>
            <div className="text-[#8B5CF6] text-xs mt-1">من ٦ محاضرات</div>
          </div>

          <div className="rounded-2xl p-4 border border-white/8" style={{ background: "linear-gradient(135deg, rgba(245,158,11,0.15), rgba(239,68,68,0.08))" }}>
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-[#F59E0B]" />
              <span className="text-white/50 text-xs">أيام الالتزام</span>
            </div>
            <div className="text-3xl font-black text-white">١٤</div>
            <div className="text-[#F59E0B] text-xs mt-1">متواصلة</div>
          </div>

          <div className="rounded-2xl p-4 border border-white/8" style={{ background: "linear-gradient(135deg, rgba(16,185,129,0.15), rgba(5,150,105,0.08))" }}>
            <div className="flex items-center gap-2 mb-2">
              <Award className="w-4 h-4 text-[#10B981]" />
              <span className="text-white/50 text-xs">الشهادات</span>
            </div>
            <div className="text-3xl font-black text-white">٢</div>
            <div className="text-[#10B981] text-xs mt-1">شهادة إتمام</div>
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {/* Awareness Chart */}
          <div className="md:col-span-2 rounded-2xl p-4 border border-white/8 bg-white/3">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-bold text-sm">مستوى الوعي الوقائي الأسبوعي</h3>
              <span className="text-[#00D4AA] text-xs font-bold">↑ تحسّن ٢٣٪</span>
            </div>
            <ResponsiveContainer width="100%" height={160}>
              <AreaChart data={awarenessData}>
                <defs>
                  <linearGradient id="awarenessGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00D4AA" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#00D4AA" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="riskGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#EF4444" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="day" tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis hide />
                <Tooltip
                  contentStyle={{ background: "#0F1629", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px", color: "white", fontSize: "12px" }}
                  formatter={(val, name) => [val, name === "awareness" ? "الوعي" : "مستوى الخطر"]}
                />
                <Area type="monotone" dataKey="awareness" stroke="#00D4AA" strokeWidth={2} fill="url(#awarenessGrad)" />
                <Area type="monotone" dataKey="risk" stroke="#EF4444" strokeWidth={2} fill="url(#riskGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Radial Progress */}
          <div className="rounded-2xl p-4 border border-white/8 bg-white/3 flex flex-col items-center justify-center">
            <h3 className="text-white font-bold text-sm mb-3">درجة الوقاية</h3>
            <RadialBarChart width={120} height={120} innerRadius={35} outerRadius={55} data={progressData} startAngle={90} endAngle={-270}>
              <RadialBar dataKey="value" cornerRadius={10} background={{ fill: "rgba(255,255,255,0.05)" }} />
            </RadialBarChart>
            <div className="text-center -mt-2">
              <div className="text-3xl font-black text-[#00D4AA]">{preventionScore}%</div>
              <div className="text-white/40 text-xs">وقاية ممتازة</div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-4 gap-3 mb-6">
          {quickActions.map((action) => (
            <Link key={action.href} href={action.href}>
              <button className={`w-full py-3 rounded-2xl bg-gradient-to-br ${action.color} flex flex-col items-center gap-1.5 text-white font-bold text-xs transition-all hover:scale-105 active:scale-95`}>
                <action.icon className="w-5 h-5" />
                {action.label}
              </button>
            </Link>
          ))}
        </div>

        {/* Today Tasks + Recent Activity */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Today Tasks */}
          <div className="rounded-2xl p-4 border border-white/8 bg-white/3">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-bold text-sm">مهام الوقاية اليوم</h3>
              <span className="text-[#00D4AA] text-xs font-bold">٢/٥</span>
            </div>
            <div className="space-y-3">
              {todayTasks.map((task, i) => (
                <div key={i} className="flex items-center gap-3">
                  {task.done
                    ? <CheckCircle2 className="w-4 h-4 text-[#00D4AA] flex-shrink-0" />
                    : <Circle className="w-4 h-4 text-white/20 flex-shrink-0" />}
                  <span className={`text-sm ${task.done ? "text-white/40 line-through" : "text-white/80"}`}>{task.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="rounded-2xl p-4 border border-white/8 bg-white/3">
            <h3 className="text-white font-bold text-sm mb-4">آخر الأنشطة الوقائية</h3>
            <div className="space-y-3">
              {recentActivities.map((activity, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center flex-shrink-0">
                    <activity.icon className={`w-4 h-4 ${activity.color}`} />
                  </div>
                  <div>
                    <p className="text-white/80 text-xs">{activity.text}</p>
                    <p className="text-white/30 text-xs mt-0.5">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Prevention Tip */}
        <div className="mt-4 p-4 rounded-2xl border border-[#F59E0B]/20" style={{ background: "linear-gradient(135deg, rgba(245,158,11,0.08), rgba(239,68,68,0.04))" }}>
          <div className="flex items-start gap-3">
            <Lightbulb className="w-5 h-5 text-[#F59E0B] flex-shrink-0 mt-0.5" />
            <div>
              <div className="text-[#F59E0B] font-black text-xs mb-1">نصيحة وقائية اليوم</div>
              <p className="text-white/65 text-sm leading-relaxed">
                تجنّب الجلوس مع رفاق السوء — البيئة المحيطة تؤثر بنسبة <span className="text-white font-bold">٦٠٪</span> على احتمالية الوقوع في الإدمان. اختر أصدقاءك بعناية.
              </p>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}
