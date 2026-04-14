/**
 * Dashboard - لوحة التحكم الوقائية
 * Design: Dark Luxury Wellness - الله يعافيك
 * الهدف: الوقاية من الإدمان — تتبع الوعي والأنشطة الوقائية
 * يعرض محتوى مختلف حسب الفئة العمرية: ناشئين / شباب / بالغين
 */
import { Link } from "wouter";
import {
  Shield,
  TrendingUp,
  Heart,
  BookOpen,
  Brain,
  Award,
  Bell,
  Activity,
  Sparkles,
  Users,
  Gamepad2,
  GraduationCap,
} from "lucide-react";
import { RadialBarChart, RadialBar } from "recharts";
import type { AgeGroup, TestResult } from "@/data/mentalHealthTestData";
import { ageGroupLabels } from "@/data/mentalHealthTestData";

// ==================== Per-age-group data ====================

// Mock data removed — see git history to restore

const quickActionsByAge: Record<
  AgeGroup,
  { label: string; icon: typeof Brain; href: string; color: string }[]
> = {
  young: [
    {
      label: "العب وتعلم",
      icon: Gamepad2,
      href: "/lectures",
      color: "from-[#00D4AA] to-[#0EA5E9]",
    },
    {
      label: "قصص ملهمة",
      icon: Heart,
      href: "/success-stories",
      color: "from-[#EC4899] to-[#8B5CF6]",
    },
    {
      label: "تحدياتي",
      icon: Award,
      href: "/achievements",
      color: "from-[#F59E0B] to-[#EF4444]",
    },
    {
      label: "أصدقائي",
      icon: Users,
      href: "/community",
      color: "from-[#10B981] to-[#3B82F6]",
    },
  ],
  teenage: [
    {
      label: "تقييمي",
      icon: Brain,
      href: "/assessment",
      color: "from-[#F59E0B] to-[#EF4444]",
    },
    {
      label: "محاضرة",
      icon: BookOpen,
      href: "/lectures",
      color: "from-[#8B5CF6] to-[#EC4899]",
    },
    {
      label: "خطتي",
      icon: Shield,
      href: "/recovery",
      color: "from-[#00D4AA] to-[#0EA5E9]",
    },
    {
      label: "إنجازاتي",
      icon: Award,
      href: "/achievements",
      color: "from-[#10B981] to-[#3B82F6]",
    },
  ],
  adult: [
    {
      label: "التقييم",
      icon: Brain,
      href: "/assessment",
      color: "from-[#8B5CF6] to-[#EC4899]",
    },
    {
      label: "المحاضرات",
      icon: GraduationCap,
      href: "/lectures",
      color: "from-[#0EA5E9] to-[#00D4AA]",
    },
    {
      label: "خطة الوقاية",
      icon: Shield,
      href: "/recovery",
      color: "from-[#F59E0B] to-[#EF4444]",
    },
    {
      label: "الإحصائيات",
      icon: TrendingUp,
      href: "/statistics",
      color: "from-[#10B981] to-[#3B82F6]",
    },
  ],
};

// Mock data removed — see git history to restore

const greetingByAge: Record<AgeGroup, string> = {
  young: "يا بطل! أنت رائع 🌟",
  teenage: "أنت تسير بالاتجاه الصحيح!",
  adult: "مرحباً بك، نحن فخورون بالتزامك",
};

const titleByAge: Record<AgeGroup, string> = {
  young: "لوحة البطل 🦸",
  teenage: "لوحة الوقاية 🛡️",
  adult: "لوحة المتابعة 📊",
};

export default function Dashboard() {
  // Read current user from localStorage
  const raw = localStorage.getItem("allah_yafik_current_user");
  const user = raw ? JSON.parse(raw) : null;
  const ageGroup: AgeGroup = user?.ageGroup ?? "teenage";
  const testResult: TestResult | null = user?.testResult ?? null;
  const userName: string = user?.name ?? "مستخدم";

  const groupMeta = ageGroupLabels[ageGroup];
  const quickActions = quickActionsByAge[ageGroup];
  const greeting = greetingByAge[ageGroup];
  const title = titleByAge[ageGroup];

  const preventionScore = testResult?.total ?? 75;
  const progressData = [
    { name: "الوعي الوقائي", value: preventionScore, fill: groupMeta.color },
  ];
  const lecturesCompleted = user?.completedLectures?.length ?? 0;
  const soberDays = user?.soberDays ?? 0;

  const levelLabel = testResult?.label ?? "جيد";

  return (
    <div className="min-h-screen bg-[#0A0F1E] text-white flex">
      {/* Main Content */}
      <main className="flex-1 p-4 md:p-6 overflow-y-auto min-h-screen pb-24">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Sparkles
                className="w-5 h-5"
                style={{ color: groupMeta.color }}
              />
              <span
                className="text-sm font-medium"
                style={{ color: groupMeta.color }}
              >
                {greeting}
              </span>
            </div>
            <h1 className="text-xl font-black text-white">{title}</h1>
            <p className="text-white/50 text-sm mt-1">
              {new Date().toLocaleDateString("ar-SA", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {/* Age group badge */}
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r ${groupMeta.gradient} text-white`}
            >
              {groupMeta.emoji} {groupMeta.label}
            </span>
            <Link href="/notifications">
              <button
                className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:text-white transition-all relative"
                style={{ borderColor: `${groupMeta.color}20` }}
              >
                <Bell className="w-5 h-5" />
                <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#EF4444]" />
              </button>
            </Link>
          </div>
        </div>

        {/* Test Result Summary Banner (if available) */}
        {testResult && (
          <div
            className="mb-6 p-4 rounded-2xl border"
            style={{
              borderColor: `${testResult.color}30`,
              background: `linear-gradient(135deg, ${testResult.color}15, ${testResult.color}05)`,
            }}
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-white font-bold text-sm">
                نتيجة تقييمك النفسي
              </h3>
              <span
                className="px-2 py-0.5 rounded-full text-xs font-bold"
                style={{
                  color: testResult.color,
                  background: `${testResult.color}20`,
                }}
              >
                {testResult.label}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {[
                {
                  label: "الصحة النفسية",
                  value: testResult.mentalHealth,
                  icon: Heart,
                },
                { label: "الوعي", value: testResult.awareness, icon: Brain },
                { label: "الثبات", value: testResult.stillness, icon: Shield },
              ].map(dim => (
                <div key={dim.label} className="text-center">
                  <dim.icon
                    className="w-4 h-4 mx-auto mb-1"
                    style={{ color: testResult.color }}
                  />
                  <div className="text-lg font-black text-white">
                    {dim.value}%
                  </div>
                  <div className="text-white/40 text-[10px]">{dim.label}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <div
            className="rounded-2xl p-4 border border-white/8"
            style={{
              background: `linear-gradient(135deg, ${groupMeta.color}25, ${groupMeta.color}08)`,
            }}
          >
            <div className="flex items-center gap-2 mb-2">
              <Shield className="w-4 h-4" style={{ color: groupMeta.color }} />
              <span className="text-white/50 text-xs">
                {ageGroup === "young" ? "درجة القوة" : "مستوى الوقاية"}
              </span>
            </div>
            <div className="text-3xl font-black text-white">
              {preventionScore}%
            </div>
            <div className="text-xs mt-1" style={{ color: groupMeta.color }}>
              {levelLabel}
            </div>
          </div>

          <div
            className="rounded-2xl p-4 border border-white/8"
            style={{
              background:
                "linear-gradient(135deg, rgba(139,92,246,0.15), rgba(59,130,246,0.08))",
            }}
          >
            <div className="flex items-center gap-2 mb-2">
              <BookOpen className="w-4 h-4 text-[#8B5CF6]" />
              <span className="text-white/50 text-xs">
                {ageGroup === "young" ? "الدروس" : "المحاضرات"}
              </span>
            </div>
            <div className="text-3xl font-black text-white">
              {lecturesCompleted}
            </div>
            <div className="text-[#8B5CF6] text-xs mt-1">
              {ageGroup === "young" ? "درس مكتمل" : "من ٦ محاضرات"}
            </div>
          </div>

          <div
            className="rounded-2xl p-4 border border-white/8"
            style={{
              background:
                "linear-gradient(135deg, rgba(245,158,11,0.15), rgba(239,68,68,0.08))",
            }}
          >
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-[#F59E0B]" />
              <span className="text-white/50 text-xs">
                {ageGroup === "young" ? "أيام البطولة" : "أيام الالتزام"}
              </span>
            </div>
            <div className="text-3xl font-black text-white">
              {soberDays || "٠"}
            </div>
            <div className="text-[#F59E0B] text-xs mt-1">متواصلة</div>
          </div>

          <div
            className="rounded-2xl p-4 border border-white/8"
            style={{
              background:
                "linear-gradient(135deg, rgba(16,185,129,0.15), rgba(5,150,105,0.08))",
            }}
          >
            <div className="flex items-center gap-2 mb-2">
              <Award className="w-4 h-4 text-[#10B981]" />
              <span className="text-white/50 text-xs">
                {ageGroup === "young" ? "النجوم ⭐" : "الشهادات"}
              </span>
            </div>
            <div className="text-3xl font-black text-white">
              {user?.achievements?.length ?? 0}
            </div>
            <div className="text-[#10B981] text-xs mt-1">
              {ageGroup === "young" ? "نجمة" : "شهادة إتمام"}
            </div>
          </div>
        </div>

        {/* Progress Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {/* Radial Progress */}
          <div className="md:col-span-2 rounded-2xl p-4 border border-white/8 bg-white/3 flex flex-col items-center justify-center">
            <h3 className="text-white font-bold text-sm mb-3">
              {ageGroup === "young" ? "مستوى البطولة" : "درجة الوقاية"}
            </h3>
            <RadialBarChart
              width={120}
              height={120}
              innerRadius={35}
              outerRadius={55}
              data={progressData}
              startAngle={90}
              endAngle={-270}
            >
              <RadialBar
                dataKey="value"
                cornerRadius={10}
                background={{ fill: "rgba(255,255,255,0.05)" }}
              />
            </RadialBarChart>
            <div className="text-center -mt-2">
              <div
                className="text-3xl font-black"
                style={{ color: groupMeta.color }}
              >
                {preventionScore}%
              </div>
              <div className="text-white/40 text-xs">{levelLabel}</div>
            </div>
          </div>

          {/* Empty state for chart */}
          <div className="rounded-2xl p-4 border border-white/8 bg-white/3 flex flex-col items-center justify-center text-center">
            <Activity className="w-8 h-8 text-white/10 mb-2" />
            <p className="text-white/30 text-xs">
              ستظهر إحصائياتك الأسبوعية هنا
            </p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-4 gap-3 mb-6">
          {quickActions.map(action => (
            <Link key={action.href} href={action.href}>
              <button
                className={`w-full py-3 rounded-2xl bg-gradient-to-br ${action.color} flex flex-col items-center gap-1.5 text-white font-bold text-xs transition-all hover:scale-105 active:scale-95`}
              >
                <action.icon className="w-5 h-5" />
                {action.label}
              </button>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
