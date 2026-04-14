/**
 * AdminDashboard - لوحة إدارة المشرف الشاملة
 * Design: Dark Luxury Wellness - "الله يعافيك"
 * Features: إحصائيات حقيقية، إدارة المستخدمين، طلبات الشراكة، تقارير
 */
import { useState } from "react";
import {
  LayoutDashboard,
  Users,
  Building2,
  MessageSquare,
  TrendingUp,
  BarChart3,
  Bell,
  Settings,
  Shield,
  CheckCircle2,
  XCircle,
  Clock,
  Eye,
  Trash2,
  Download,
  Filter,
  Search,
  Phone,
  Mail,
  Star,
  Heart,
  BookOpen,
  AlertTriangle,
  Sparkles,
  ChevronDown,
  RefreshCw,
  UserCheck,
  UserX,
} from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Link } from "wouter";
// Recharts imports removed — mock chart data cleared (see git history to restore)

const CONTACT_PHONE = "0546192019";

const adminSections = [
  { id: "overview", icon: LayoutDashboard, label: "نظرة عامة" },
  { id: "users", icon: Users, label: "المستخدمون" },
  { id: "partners", icon: Building2, label: "طلبات الشراكة" },
  { id: "messages", icon: MessageSquare, label: "الرسائل" },
  { id: "reports", icon: BarChart3, label: "التقارير" },
  { id: "alerts", icon: Bell, label: "التنبيهات" },
];

// Mock data removed — see git history to restore
const statsData: {
  month: string;
  users: number;
  active: number;
  recovered: number;
}[] = [];

// Mock data removed — see git history to restore
const addictionTypes: { name: string; value: number; color: string }[] = [];

// Mock data removed — see git history to restore
const mockUsers: {
  id: string;
  name: string;
  phone: string;
  addictionType: string;
  soberDays: number;
  status: string;
  joinDate: string;
  riskLevel: string;
}[] = [];

// Mock data removed — see git history to restore
const partnerRequests: {
  id: string;
  org: string;
  type: string;
  city: string;
  contact: string;
  phone: string;
  status: string;
  date: string;
}[] = [];

// Mock data removed — see git history to restore
const recentMessages: {
  id: string;
  from: string;
  msg: string;
  time: string;
  urgent: boolean;
  read: boolean;
}[] = [];

const riskColors: Record<string, string> = {
  "منخفض جداً": "#10B981",
  منخفض: "#00D4AA",
  متوسط: "#F59E0B",
  مرتفع: "#EF4444",
  "عالٍ جداً": "#DC2626",
};

const statusColors: Record<string, string> = {
  نشط: "#00D4AA",
  متعافٍ: "#10B981",
  خطر: "#EF4444",
};

export default function AdminDashboard() {
  const [activeSection, setActiveSection] = useState("overview");
  const [searchQuery, setSearchQuery] = useState("");
  const [partnerStatuses, setPartnerStatuses] = useState<
    Record<string, string>
  >(Object.fromEntries(partnerRequests.map(p => [p.id, p.status])));

  const approvePartner = (id: string) => {
    setPartnerStatuses(prev => ({ ...prev, [id]: "approved" }));
    toast.success("تمت الموافقة على طلب الشراكة");
  };

  const rejectPartner = (id: string) => {
    setPartnerStatuses(prev => ({ ...prev, [id]: "rejected" }));
    toast.error("تم رفض طلب الشراكة");
  };

  const filteredUsers = mockUsers.filter(
    u => u.name.includes(searchQuery) || u.phone.includes(searchQuery)
  );

  const totalUsers = 0;
  const activeUsers = 0;
  const recoveredUsers = 0;
  const pendingPartners = partnerRequests.filter(
    p => partnerStatuses[p.id] === "pending"
  ).length;

  return (
    <div className="min-h-screen bg-[#060B18] text-white flex">
      {/* Admin Sidebar */}
      <aside className="fixed right-0 top-0 h-full w-60 bg-[#0A0F1E] border-l border-white/5 z-30 flex flex-col">
        <div className="flex items-center gap-3 p-5 border-b border-white/5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#F59E0B] to-[#EF4444] flex items-center justify-center">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-white font-black text-sm">لوحة الإدارة</h1>
            <p className="text-[#F59E0B] text-xs">الله يعافيك</p>
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          {adminSections.map(sec => (
            <button
              key={sec.id}
              onClick={() => setActiveSection(sec.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-right ${
                activeSection === sec.id
                  ? "bg-[#F59E0B]/15 text-[#F59E0B] border border-[#F59E0B]/25"
                  : "text-white/40 hover:text-white hover:bg-white/5"
              }`}
            >
              <sec.icon className="w-4 h-4 flex-shrink-0" />
              <span className="text-sm font-medium">{sec.label}</span>
              {sec.id === "partners" && pendingPartners > 0 && (
                <span className="mr-auto px-1.5 py-0.5 rounded-md bg-[#EF4444] text-white text-xs font-numbers">
                  {pendingPartners}
                </span>
              )}
              {sec.id === "messages" && (
                <span className="mr-auto px-1.5 py-0.5 rounded-md bg-[#EF4444] text-white text-xs font-numbers">
                  2
                </span>
              )}
            </button>
          ))}
        </nav>

        <div className="p-3 border-t border-white/5 space-y-2">
          <Link href="/dashboard">
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl text-white/40 hover:text-white hover:bg-white/5 transition-all cursor-pointer">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm">العودة للتطبيق</span>
            </div>
          </Link>
          <a
            href={`tel:${CONTACT_PHONE}`}
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#00D4AA]/8 border border-[#00D4AA]/20 text-[#00D4AA] text-xs font-numbers"
          >
            <Phone className="w-3.5 h-3.5" />
            {CONTACT_PHONE}
          </a>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 mr-60 overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-[#060B18]/95 backdrop-blur-sm border-b border-white/5 px-8 py-4 flex items-center justify-between z-20">
          <div>
            <h2 className="text-white font-black text-lg">
              {adminSections.find(s => s.id === activeSection)?.label}
            </h2>
            <p className="text-white/35 text-xs">آخر تحديث: الآن</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => toast.success("تم تحديث البيانات")}
              className="p-2 rounded-xl glass-card border border-white/8 text-white/40 hover:text-white transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              onClick={() => toast.info("جاري تصدير التقرير...")}
              className="flex items-center gap-2 px-4 py-2 rounded-xl glass-card border border-white/8 text-white/50 hover:text-white text-sm font-bold transition-all"
            >
              <Download className="w-4 h-4" />
              تصدير
            </button>
          </div>
        </div>

        <div className="p-8">
          {/* Overview Section */}
          {activeSection === "overview" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {/* KPI Cards */}
              <div className="grid grid-cols-4 gap-4 mb-7">
                {[
                  {
                    label: "إجمالي المستخدمين",
                    value: totalUsers.toLocaleString("ar"),
                    change: "+٨٩ هذا الشهر",
                    icon: Users,
                    color: "#00D4AA",
                  },
                  {
                    label: "المستخدمون النشطون",
                    value: activeUsers.toLocaleString("ar"),
                    change: `${Math.round((activeUsers / totalUsers) * 100)}٪ من الإجمالي`,
                    icon: UserCheck,
                    color: "#10B981",
                  },
                  {
                    label: "المتعافون",
                    value: recoveredUsers.toLocaleString("ar"),
                    change: "+٣٣ هذا الشهر",
                    icon: Heart,
                    color: "#F59E0B",
                  },
                  {
                    label: "طلبات شراكة معلقة",
                    value: pendingPartners.toString(),
                    change: "تحتاج مراجعة",
                    icon: Building2,
                    color: "#EF4444",
                  },
                ].map((kpi, i) => (
                  <div key={i} className="glass-card p-5 border border-white/7">
                    <div className="flex items-start justify-between mb-3">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center"
                        style={{ background: `${kpi.color}15` }}
                      >
                        <kpi.icon
                          className="w-5 h-5"
                          style={{ color: kpi.color }}
                        />
                      </div>
                      <TrendingUp className="w-4 h-4 text-[#10B981]" />
                    </div>
                    <div className="text-white font-black text-2xl font-numbers mb-1">
                      {kpi.value}
                    </div>
                    <div className="text-white/50 text-xs mb-1">
                      {kpi.label}
                    </div>
                    <div className="text-xs" style={{ color: kpi.color }}>
                      {kpi.change}
                    </div>
                  </div>
                ))}
              </div>

              {/* Charts Row */}
              <div className="grid grid-cols-3 gap-5 mb-7">
                <div className="col-span-2 glass-card p-5 border border-white/7">
                  <h3 className="text-white font-bold mb-4 text-sm">
                    نمو المستخدمين
                  </h3>
                  <div className="flex items-center justify-center h-[200px]">
                    <div className="text-center">
                      <BarChart3 className="w-10 h-10 text-white/10 mx-auto mb-2" />
                      <p className="text-white/30 text-xs">
                        لا توجد بيانات بعد
                      </p>
                    </div>
                  </div>
                </div>
                <div className="glass-card p-5 border border-white/7">
                  <h3 className="text-white font-bold mb-4 text-sm">
                    توزيع أنواع الإدمان
                  </h3>
                  <div className="flex items-center justify-center h-[200px]">
                    <div className="text-center">
                      <BarChart3 className="w-10 h-10 text-white/10 mx-auto mb-2" />
                      <p className="text-white/30 text-xs">
                        لا توجد بيانات بعد
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Urgent Alerts */}
              <div className="glass-card p-5 border border-white/5">
                <h3 className="text-white font-bold mb-3 flex items-center gap-2 text-sm">
                  <AlertTriangle className="w-4 h-4 text-[#EF4444]" />
                  تنبيهات عاجلة
                </h3>
                <div className="text-center py-4">
                  <p className="text-white/30 text-xs">لا توجد تنبيهات عاجلة</p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Users Section */}
          {activeSection === "users" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="flex items-center gap-3 mb-5">
                <div className="relative flex-1 max-w-sm">
                  <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                  <input
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="بحث بالاسم أو الجوال..."
                    className="w-full bg-white/4 border border-white/10 rounded-xl pr-10 pl-4 py-2.5 text-white placeholder-white/25 focus:outline-none focus:border-white/25 text-sm"
                  />
                </div>
                <div className="text-white/40 text-sm">
                  {filteredUsers.length} مستخدم
                </div>
              </div>

              {filteredUsers.length > 0 ? (
                <div className="space-y-2">
                  {filteredUsers.map(user => (
                    <div
                      key={user.id}
                      className="glass-card p-4 border border-white/7 flex items-center gap-4"
                    >
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#00D4AA]/20 to-[#0EA5E9]/20 flex items-center justify-center font-black text-[#00D4AA]">
                        {user.name.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="text-white font-bold text-sm">
                            {user.name}
                          </span>
                          <span
                            className="px-2 py-0.5 rounded-lg text-xs font-bold"
                            style={{
                              background: `${statusColors[user.status] || "#666"}15`,
                              color: statusColors[user.status] || "#666",
                            }}
                          >
                            {user.status}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-white/35 text-xs">
                          <span className="font-numbers">{user.phone}</span>
                          <span>·</span>
                          <span>{user.addictionType}</span>
                          <span>·</span>
                          <span className="font-numbers">
                            {user.soberDays} يوم تعافٍ
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span
                          className="px-2.5 py-1 rounded-lg text-xs font-bold"
                          style={{
                            background: `${riskColors[user.riskLevel] || "#666"}15`,
                            color: riskColors[user.riskLevel] || "#666",
                          }}
                        >
                          {user.riskLevel}
                        </span>
                        <a
                          href={`tel:${user.phone}`}
                          className="p-1.5 rounded-lg glass-card border border-white/8 text-white/40 hover:text-[#00D4AA] transition-colors"
                        >
                          <Phone className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Users className="w-10 h-10 text-white/10 mx-auto mb-3" />
                  <p className="text-white/30 text-sm">لا يوجد مستخدمون بعد</p>
                </div>
              )}
            </motion.div>
          )}

          {/* Partner Requests Section */}
          {activeSection === "partners" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {partnerRequests.length > 0 ? (
                <div className="space-y-3">
                  {partnerRequests.map(req => (
                    <div
                      key={req.id}
                      className="glass-card p-5 border border-white/7"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-11 h-11 rounded-xl bg-[#00D4AA]/15 flex items-center justify-center">
                            <Building2 className="w-5 h-5 text-[#00D4AA]" />
                          </div>
                          <div>
                            <div className="text-white font-bold">
                              {req.org}
                            </div>
                            <div className="text-white/40 text-xs">
                              {req.type} · {req.city}
                            </div>
                          </div>
                        </div>
                        <span
                          className={`px-3 py-1 rounded-xl text-xs font-bold ${
                            partnerStatuses[req.id] === "approved"
                              ? "bg-[#10B981]/15 text-[#10B981]"
                              : partnerStatuses[req.id] === "rejected"
                                ? "bg-[#EF4444]/15 text-[#EF4444]"
                                : "bg-[#F59E0B]/15 text-[#F59E0B]"
                          }`}
                        >
                          {partnerStatuses[req.id] === "approved"
                            ? "مقبول"
                            : partnerStatuses[req.id] === "rejected"
                              ? "مرفوض"
                              : "معلق"}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-white/40 mb-3">
                        <span className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          {req.contact}
                        </span>
                        <span className="flex items-center gap-1 font-numbers">
                          <Phone className="w-3 h-3" />
                          {req.phone}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {req.date}
                        </span>
                      </div>
                      {partnerStatuses[req.id] === "pending" && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => approvePartner(req.id)}
                            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/25 font-bold text-sm hover:bg-[#10B981]/25 transition-all"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                            قبول
                          </button>
                          <button
                            onClick={() => rejectPartner(req.id)}
                            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-[#EF4444]/15 text-[#EF4444] border border-[#EF4444]/25 font-bold text-sm hover:bg-[#EF4444]/25 transition-all"
                          >
                            <XCircle className="w-4 h-4" />
                            رفض
                          </button>
                          <a
                            href={`tel:${req.phone}`}
                            className="px-4 py-2 rounded-xl glass-card border border-white/8 text-white/40 hover:text-white transition-colors"
                          >
                            <Phone className="w-4 h-4" />
                          </a>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Building2 className="w-10 h-10 text-white/10 mx-auto mb-3" />
                  <p className="text-white/30 text-sm">
                    لا توجد طلبات شراكة بعد
                  </p>
                </div>
              )}
            </motion.div>
          )}

          {/* Messages Section */}
          {activeSection === "messages" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {recentMessages.length > 0 ? (
                <div className="space-y-3">
                  {recentMessages.map(msg => (
                    <div
                      key={msg.id}
                      className={`glass-card p-4 border transition-all ${msg.urgent ? "border-[#EF4444]/30 bg-[#EF4444]/5" : !msg.read ? "border-white/12" : "border-white/5"}`}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center font-black ${msg.urgent ? "bg-[#EF4444]/20 text-[#EF4444]" : "bg-[#00D4AA]/15 text-[#00D4AA]"}`}
                        >
                          {msg.from.charAt(0)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-0.5">
                            <span className="text-white font-bold text-sm">
                              {msg.from}
                            </span>
                            {msg.urgent && (
                              <span className="px-2 py-0.5 rounded-lg text-xs font-bold bg-[#EF4444]/15 text-[#EF4444]">
                                عاجل
                              </span>
                            )}
                            {!msg.read && (
                              <div className="w-2 h-2 rounded-full bg-[#00D4AA]" />
                            )}
                          </div>
                          <p className="text-white/60 text-sm mb-1">
                            {msg.msg}
                          </p>
                          <span className="text-white/25 text-xs">
                            {msg.time}
                          </span>
                        </div>
                        <button
                          onClick={() => toast.success("تم الرد على الرسالة")}
                          className="px-3 py-1.5 rounded-xl glass-card border border-white/8 text-white/40 hover:text-white text-xs font-bold transition-colors"
                        >
                          رد
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <MessageSquare className="w-10 h-10 text-white/10 mx-auto mb-3" />
                  <p className="text-white/30 text-sm">لا توجد رسائل بعد</p>
                </div>
              )}
            </motion.div>
          )}

          {/* Reports Section */}
          {activeSection === "reports" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="text-center py-16">
                <BarChart3 className="w-12 h-12 text-white/10 mx-auto mb-3" />
                <p className="text-white/30 text-sm">لا توجد تقارير بعد</p>
                <p className="text-white/20 text-xs mt-1">
                  ستظهر التقارير عند توفر بيانات كافية
                </p>
              </div>
            </motion.div>
          )}

          {/* Alerts Section */}
          {activeSection === "alerts" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="text-center py-16">
                <Bell className="w-12 h-12 text-white/10 mx-auto mb-3" />
                <p className="text-white/30 text-sm">لا توجد تنبيهات بعد</p>
              </div>
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
}
