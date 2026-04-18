/**
 * AdminDashboard - لوحة إدارة المشرف الشاملة
 * Design: Dark Luxury Wellness - "الله يعافيك"
 * Features: إحصائيات حقيقية من localStorage، إدارة المحتوى، تصدير CSV، إعدادات المنصة
 */
import { useState, useEffect, useMemo, useCallback, useRef } from "react";
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
  ChevronRight,
  Menu,
  RefreshCw,
  UserCheck,
  UserX,
  FileText,
  Plus,
  Edit3,
  Save,
  X,
  ToggleLeft,
  ToggleRight,
  Megaphone,
  Activity,
  Brain,
  Target,
  Dumbbell,
  Trophy,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { Link } from "wouter";
import { lecturesData, type Lecture } from "@/data/lecturesData";
import { rehabPhases } from "@/data/rehabData";

// ─── Types ───────────────────────────────────────────────────────────────────

interface StoredUser {
  id: string;
  name: string;
  phone: string;
  email?: string;
  age: number;
  ageGroup: "young" | "teenage" | "adult";
  addictionType?: string;
  soberDays?: number;
  joinDate: string;
  testCompleted: boolean;
  testResult?: {
    mentalHealth: number;
    awareness: number;
    stillness: number;
    total: number;
    level: string;
    label: string;
    color: string;
    recommendation: string;
  };
  achievements?: string[];
  completedLectures?: string[];
}

interface PlatformSettings {
  emergencyPhone1: string;
  emergencyPhone2: string;
  emergencyPhone3: string;
  welcomeMessage: string;
  sectionsEnabled: Record<string, boolean>;
}

interface StoryItem {
  id: string;
  title: string;
  author: string;
  summary: string;
  category: string;
  date: string;
}

interface ExerciseItem {
  id: string;
  title: string;
  description: string;
  duration: string;
  category: string;
  difficulty: "سهل" | "متوسط" | "صعب";
}

/** Minimal lecture shape for admin-created lectures */
interface CustomLecture {
  id: string;
  title: string;
  subtitle: string;
  speaker: string;
  speakerTitle: string;
  category: string;
  ageGroup: string;
  ageLabel: string;
  duration: string;
  type: "video" | "audio" | "workshop" | "article";
  color: string;
  featured: boolean;
  custom: true;
  /** Media content source */
  mediaSource: "youtube" | "upload" | "ai";
  /** YouTube URL when mediaSource === "youtube" */
  youtubeUrl: string;
  /** Key in IndexedDB for uploaded file blob */
  uploadedFileKey: string;
  /** Original filename for display */
  uploadedFileName: string;
  /** MIME type of uploaded file */
  uploadedFileMime: string;
}

const DEFAULT_SETTINGS: PlatformSettings = {
  emergencyPhone1: "0546192019",
  emergencyPhone2: "920033360",
  emergencyPhone3: "911",
  welcomeMessage: "مرحباً بك في الله يعافيك — معاً نحو حياة أفضل",
  sectionsEnabled: {
    lectures: true,
    recovery: true,
    exercises: true,
    community: true,
    chat: false,
    partners: true,
    assessment: true,
    achievements: true,
  },
};

const SETTINGS_KEY = "allah_yafik_admin_settings";

// ─── IndexedDB for file storage ──────────────────────────────────────────────

const IDB_NAME = "allah_yafik_files";
const IDB_STORE = "media";

function openFilesDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(IDB_NAME, 1);
    req.onupgradeneeded = () => req.result.createObjectStore(IDB_STORE);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function saveFileBlob(key: string, blob: Blob): Promise<void> {
  const db = await openFilesDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(IDB_STORE, "readwrite");
    tx.objectStore(IDB_STORE).put(blob, key);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

async function loadFileBlob(key: string): Promise<Blob | null> {
  const db = await openFilesDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(IDB_STORE, "readonly");
    const req = tx.objectStore(IDB_STORE).get(key);
    req.onsuccess = () => resolve(req.result ?? null);
    req.onerror = () => reject(req.error);
  });
}

async function deleteFileBlob(key: string): Promise<void> {
  const db = await openFilesDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(IDB_STORE, "readwrite");
    tx.objectStore(IDB_STORE).delete(key);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function loadUsers(): StoredUser[] {
  try {
    const raw = localStorage.getItem("allah_yafik_users");
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function loadRecoveryGoals(): Record<number, boolean[]> {
  try {
    const raw = localStorage.getItem("allah_yafik_recovery_goals");
    if (!raw) return {};
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

function loadSettings(): PlatformSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

function saveSettings(s: PlatformSettings) {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(s));
}

const CUSTOM_LECTURES_KEY = "allah_yafik_custom_lectures";
const STORIES_KEY = "allah_yafik_stories";
const EXERCISES_KEY = "allah_yafik_exercises";

function loadCustomLectures(): CustomLecture[] {
  try {
    const raw = localStorage.getItem(CUSTOM_LECTURES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}
function saveCustomLectures(items: CustomLecture[]) {
  localStorage.setItem(CUSTOM_LECTURES_KEY, JSON.stringify(items));
}

function loadStories(): StoryItem[] {
  try {
    const raw = localStorage.getItem(STORIES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}
function saveStories(items: StoryItem[]) {
  localStorage.setItem(STORIES_KEY, JSON.stringify(items));
}

function loadExercises(): ExerciseItem[] {
  try {
    const raw = localStorage.getItem(EXERCISES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}
function saveExercises(items: ExerciseItem[]) {
  localStorage.setItem(EXERCISES_KEY, JSON.stringify(items));
}

// ─── Recovery Plan (Prevention Phases) ───────────────────────────────────────

const ADMIN_PHASES_KEY = "allah_yafik_admin_prevention_phases";

interface AdminPreventionPhase {
  id: number;
  title: string;
  subtitle: string;
  iconName: string;
  color: string;
  description: string;
  goals: { text: string; link: string }[];
  reward: string;
}

const PHASE_ICON_OPTIONS = [
  { name: "Brain", label: "🧠 دماغ" },
  { name: "Shield", label: "🛡️ درع" },
  { name: "Heart", label: "❤️ قلب" },
  { name: "TrendingUp", label: "📈 نمو" },
  { name: "Target", label: "🎯 هدف" },
  { name: "Star", label: "⭐ نجمة" },
  { name: "BookOpen", label: "📖 كتاب" },
  { name: "Users", label: "👥 مجتمع" },
  { name: "Zap", label: "⚡ طاقة" },
  { name: "Lightbulb", label: "💡 فكرة" },
];

const PHASE_COLOR_OPTIONS = [
  { value: "from-[#00D4AA] to-[#0EA5E9]", label: "تركوازي → أزرق" },
  { value: "from-[#F59E0B] to-[#EF4444]", label: "ذهبي → أحمر" },
  { value: "from-[#8B5CF6] to-[#EC4899]", label: "بنفسجي → وردي" },
  { value: "from-[#10B981] to-[#3B82F6]", label: "أخضر → أزرق" },
  { value: "from-[#F59E0B] to-[#10B981]", label: "ذهبي → أخضر" },
  { value: "from-[#EF4444] to-[#8B5CF6]", label: "أحمر → بنفسجي" },
];

const GOAL_LINK_OPTIONS = [
  { value: "/assessment", label: "التقييم" },
  { value: "/lectures", label: "المحاضرات" },
  { value: "/resources", label: "الموارد" },
  { value: "/exercises", label: "التمارين" },
  { value: "/community", label: "المجتمع" },
  { value: "/tracker", label: "التتبع" },
  { value: "/partners", label: "الشركاء" },
  { value: "/rehab-plan", label: "خطة التأهيل" },
  { value: "/achievements", label: "الإنجازات" },
  { value: "/chat", label: "المحادثة" },
];

const defaultAdminPhases: AdminPreventionPhase[] = [
  {
    id: 1, title: "مرحلة الوعي والمعرفة", subtitle: "الأسبوع ١-٢", iconName: "Brain",
    color: "from-[#00D4AA] to-[#0EA5E9]",
    description: "اكتساب المعرفة الكاملة بمخاطر الإدمان وعوامل الخطر الشخصية",
    goals: [
      { text: "إكمال تقييم مستوى الخطر الشخصي", link: "/assessment" },
      { text: "قراءة محاضرة: علم الأعصاب والإدمان", link: "/lectures" },
      { text: "تحديد عوامل الخطر في بيئتك", link: "/assessment" },
      { text: "تعلم أعراض الإدمان المبكرة", link: "/resources" },
      { text: "إكمال اختبار الوعي الوقائي", link: "/assessment" },
    ],
    reward: "شارة الواعي",
  },
  {
    id: 2, title: "مرحلة بناء المهارات", subtitle: "الأسبوع ٣-٤", iconName: "Shield",
    color: "from-[#F59E0B] to-[#EF4444]",
    description: "تطوير مهارات الرفض والمقاومة وبناء الحصانة الشخصية",
    goals: [
      { text: "تعلم تقنية الرفض الاجتماعي الحازم", link: "/exercises" },
      { text: "ممارسة سيناريوهات الضغط الاجتماعي", link: "/exercises" },
      { text: "تطوير خطة الهروب من المواقف الخطرة", link: "/rehab-plan" },
      { text: "حضور جلسة توعية جماعية", link: "/community" },
      { text: "إكمال تمارين الوقاية الأسبوعية", link: "/exercises" },
    ],
    reward: "شارة المحصّن",
  },
  {
    id: 3, title: "مرحلة التحصين الروحي", subtitle: "الأسبوع ٥-٦", iconName: "Heart",
    color: "from-[#8B5CF6] to-[#EC4899]",
    description: "تعزيز الجانب الروحي والديني كدرع واقٍ قوي من الإدمان",
    goals: [
      { text: "الالتزام بأذكار الصباح والمساء يومياً", link: "/tracker" },
      { text: "حضور محاضرة التوعية الدينية", link: "/lectures" },
      { text: "قراءة آيات الوقاية والتحصين", link: "/resources" },
      { text: "التواصل مع إمام أو مرشد ديني", link: "/partners" },
      { text: "إكمال برنامج التحصين الروحي", link: "/exercises" },
    ],
    reward: "شارة المحصّن روحياً",
  },
  {
    id: 4, title: "مرحلة الوقاية المستدامة", subtitle: "الأسبوع ٧+", iconName: "TrendingUp",
    color: "from-[#10B981] to-[#3B82F6]",
    description: "الحفاظ على مستوى الوقاية ونشر الوعي في المجتمع",
    goals: [
      { text: "مشاركة تجربتك الوقائية مع الآخرين", link: "/community" },
      { text: "الانضمام لفريق التوعية المجتمعية", link: "/community" },
      { text: "إكمال ٣ محاضرات توعوية", link: "/lectures" },
      { text: "تدريب شخص آخر على مهارات الوقاية", link: "/community" },
      { text: "الحصول على شهادة السفير الوقائي", link: "/achievements" },
    ],
    reward: "شهادة سفير الوقاية",
  },
];

function loadAdminPhases(): AdminPreventionPhase[] {
  try {
    const raw = localStorage.getItem(ADMIN_PHASES_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {}
  return defaultAdminPhases;
}

function saveAdminPhases(phases: AdminPreventionPhase[]) {
  localStorage.setItem(ADMIN_PHASES_KEY, JSON.stringify(phases));
}

function exportCSV(filename: string, headers: string[], rows: string[][]) {
  const bom = "\uFEFF";
  const csvContent =
    bom +
    [headers.join(","), ...rows.map(r => r.map(c => `"${c.replace(/"/g, '""')}"`).join(","))].join(
      "\n"
    );
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

// ─── Section Labels ──────────────────────────────────────────────────────────

const sectionLabels: Record<string, string> = {
  lectures: "المحاضرات",
  recovery: "خطة التعافي",
  exercises: "التمارين",
  community: "المجتمع",
  chat: "المحادثة",
  partners: "الشركاء",
  assessment: "التقييم",
  achievements: "الإنجازات",
};

const adminSections = [
  { id: "overview", icon: LayoutDashboard, label: "نظرة عامة" },
  { id: "users", icon: Users, label: "المستخدمون" },
  { id: "content", icon: FileText, label: "إدارة المحتوى" },
  { id: "recovery-plan", icon: Target, label: "الخطة الوقائية" },
  { id: "partners", icon: Building2, label: "طلبات الشراكة" },
  { id: "messages", icon: MessageSquare, label: "الرسائل" },
  { id: "reports", icon: BarChart3, label: "التقارير" },
  { id: "settings", icon: Settings, label: "الإعدادات" },
  { id: "alerts", icon: Bell, label: "التنبيهات" },
];

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

const testLevelColors: Record<string, string> = {
  excellent: "#00D4AA",
  good: "#0EA5E9",
  moderate: "#F59E0B",
  low: "#EF4444",
  critical: "#DC2626",
};

// ─── Component ───────────────────────────────────────────────────────────────

export default function AdminDashboard() {
  const [activeSection, setActiveSection] = useState("overview");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);
  const [contentTab, setContentTab] = useState<"lectures" | "stories" | "exercises">("lectures");
  const [settings, setSettings] = useState<PlatformSettings>(loadSettings);
  const [editingSettings, setEditingSettings] = useState(false);
  const [settingsDraft, setSettingsDraft] = useState<PlatformSettings>(settings);

  // Content CRUD state
  const [customLectures, setCustomLectures] = useState<CustomLecture[]>(loadCustomLectures);
  const [stories, setStories] = useState<StoryItem[]>(loadStories);
  const [exercises, setExercises] = useState<ExerciseItem[]>(loadExercises);
  const [editingContent, setEditingContent] = useState<string | null>(null); // id being edited
  const [showAddForm, setShowAddForm] = useState(false);

  // Lecture form
  const emptyLecture: Omit<CustomLecture, "id" | "custom"> = {
    title: "", subtitle: "", speaker: "", speakerTitle: "", category: "وقائي",
    ageGroup: "all", ageLabel: "الكل", duration: "", type: "article",
    color: "#00D4AA", featured: false,
    mediaSource: "youtube", youtubeUrl: "", uploadedFileKey: "", uploadedFileName: "", uploadedFileMime: "",
  };
  const [lectureForm, setLectureForm] = useState(emptyLecture);
  // Temporary blob URL for file preview (not persisted)
  const [uploadBlobUrl, setUploadBlobUrl] = useState<string | null>(null);
  const [uploadBlobMime, setUploadBlobMime] = useState<string>("");
  // Preview modal
  const [previewLecture, setPreviewLecture] = useState<(Lecture | CustomLecture) | null>(null);
  const [previewBlobUrl, setPreviewBlobUrl] = useState<string | null>(null);

  // Story form
  const emptyStory: Omit<StoryItem, "id" | "date"> = {
    title: "", author: "", summary: "", category: "تعافي",
  };
  const [storyForm, setStoryForm] = useState(emptyStory);

  // Exercise form
  const emptyExercise: Omit<ExerciseItem, "id"> = {
    title: "", description: "", duration: "", category: "تنفس", difficulty: "سهل",
  };
  const [exerciseForm, setExerciseForm] = useState(emptyExercise);

  // Recovery plan (prevention phases) state
  const [adminPhases, setAdminPhases] = useState<AdminPreventionPhase[]>(loadAdminPhases);
  const [editingPhaseId, setEditingPhaseId] = useState<number | null>(null);
  const [showAddPhase, setShowAddPhase] = useState(false);
  const emptyPhase: Omit<AdminPreventionPhase, "id"> = {
    title: "", subtitle: "", iconName: "Brain",
    color: "from-[#00D4AA] to-[#0EA5E9]", description: "",
    goals: [{ text: "", link: "/assessment" }], reward: "",
  };
  const [phaseForm, setPhaseForm] = useState<Omit<AdminPreventionPhase, "id">>(emptyPhase);

  // Load real data from localStorage
  const users = useMemo(() => loadUsers(), [refreshKey]);
  const recoveryGoals = useMemo(() => loadRecoveryGoals(), [refreshKey]);

  // Partner requests from localStorage
  const [partnerStatuses, setPartnerStatuses] = useState<Record<string, string>>({});

  const partnerRequests = useMemo(() => {
    try {
      const raw = localStorage.getItem("allah_yafik_partner_requests");
      if (!raw) return [];
      return JSON.parse(raw) as {
        id: string;
        org: string;
        type: string;
        city: string;
        contact: string;
        phone: string;
        status: string;
        date: string;
      }[];
    } catch {
      return [];
    }
  }, [refreshKey]);

  useEffect(() => {
    setPartnerStatuses(Object.fromEntries(partnerRequests.map(p => [p.id, p.status])));
  }, [partnerRequests]);

  const recentMessages = useMemo(() => {
    try {
      const raw = localStorage.getItem("allah_yafik_messages");
      if (!raw) return [];
      return JSON.parse(raw) as {
        id: string;
        from: string;
        msg: string;
        time: string;
        urgent: boolean;
        read: boolean;
      }[];
    } catch {
      return [];
    }
  }, [refreshKey]);

  // ─── Real Statistics ─────────────────────────────────────────────────────────

  const totalUsers = users.length;
  const usersWithTest = users.filter(u => u.testCompleted);
  const ageGroups = useMemo(() => {
    const groups = { young: 0, teenage: 0, adult: 0 };
    users.forEach(u => {
      if (u.ageGroup in groups) groups[u.ageGroup as keyof typeof groups]++;
    });
    return groups;
  }, [users]);

  const testLevels = useMemo(() => {
    const levels: Record<string, number> = {
      excellent: 0,
      good: 0,
      moderate: 0,
      low: 0,
      critical: 0,
    };
    usersWithTest.forEach(u => {
      if (u.testResult?.level && u.testResult.level in levels) {
        levels[u.testResult.level]++;
      }
    });
    return levels;
  }, [usersWithTest]);

  const avgTestScore = useMemo(() => {
    if (usersWithTest.length === 0) return 0;
    const sum = usersWithTest.reduce((acc, u) => acc + (u.testResult?.total || 0), 0);
    return Math.round(sum / usersWithTest.length);
  }, [usersWithTest]);

  const recoveryStats = useMemo(() => {
    const entries = Object.entries(recoveryGoals);
    let totalGoals = 0;
    let completedGoals = 0;
    entries.forEach(([, goals]) => {
      totalGoals += goals.length;
      completedGoals += goals.filter(Boolean).length;
    });
    const phasesStarted = entries.length;
    const phasesCompleted = entries.filter(([, goals]) => goals.length > 0 && goals.every(Boolean)).length;
    return { totalGoals, completedGoals, phasesStarted, phasesCompleted };
  }, [recoveryGoals]);

  const pendingPartners = partnerRequests.filter(
    p => (partnerStatuses[p.id] || p.status) === "pending"
  ).length;

  // ─── Actions ─────────────────────────────────────────────────────────────────

  const refresh = () => {
    setRefreshKey(k => k + 1);
    toast.success("تم تحديث البيانات");
  };

  const approvePartner = (id: string) => {
    setPartnerStatuses(prev => ({ ...prev, [id]: "approved" }));
    toast.success("تمت الموافقة على طلب الشراكة");
  };

  const rejectPartner = (id: string) => {
    setPartnerStatuses(prev => ({ ...prev, [id]: "rejected" }));
    toast.error("تم رفض طلب الشراكة");
  };

  const handleExport = () => {
    if (activeSection === "users" || activeSection === "overview") {
      exportUsersCSV();
    } else if (activeSection === "reports") {
      exportReportCSV();
    } else {
      exportUsersCSV();
    }
  };

  const exportUsersCSV = () => {
    if (users.length === 0) {
      toast.error("لا توجد بيانات للتصدير");
      return;
    }
    const headers = [
      "الاسم",
      "الجوال",
      "البريد",
      "العمر",
      "الفئة العمرية",
      "تاريخ التسجيل",
      "اكتمل الاختبار",
      "نتيجة الاختبار",
      "مستوى الاختبار",
      "الصحة النفسية",
      "الوعي",
      "الاستقرار",
    ];
    const rows = users.map(u => [
      u.name,
      u.phone,
      u.email || "",
      String(u.age),
      u.ageGroup === "young" ? "أطفال" : u.ageGroup === "teenage" ? "مراهقين" : "بالغين",
      u.joinDate ? new Date(u.joinDate).toLocaleDateString("ar-SA") : "",
      u.testCompleted ? "نعم" : "لا",
      u.testResult ? String(u.testResult.total) + "%" : "",
      u.testResult?.label || "",
      u.testResult ? String(u.testResult.mentalHealth) : "",
      u.testResult ? String(u.testResult.awareness) : "",
      u.testResult ? String(u.testResult.stillness) : "",
    ]);
    exportCSV(`allah-yafik-users-${new Date().toISOString().slice(0, 10)}.csv`, headers, rows);
    toast.success(`تم تصدير ${users.length} مستخدم`);
  };

  const exportReportCSV = () => {
    const headers = ["المؤشر", "القيمة"];
    const rows = [
      ["إجمالي المستخدمين", String(totalUsers)],
      ["أكملوا الاختبار", String(usersWithTest.length)],
      ["متوسط نتيجة الاختبار", avgTestScore + "%"],
      ["أطفال (أقل من 18)", String(ageGroups.young)],
      ["مراهقين (18-25)", String(ageGroups.teenage)],
      ["بالغين (26+)", String(ageGroups.adult)],
      ["ممتاز", String(testLevels.excellent)],
      ["جيد", String(testLevels.good)],
      ["متوسط", String(testLevels.moderate)],
      ["يحتاج تحسين", String(testLevels.low)],
      ["حرج", String(testLevels.critical)],
      ["مراحل التعافي بدأت", String(recoveryStats.phasesStarted)],
      ["مراحل التعافي مكتملة", String(recoveryStats.phasesCompleted)],
      ["أهداف مكتملة", String(recoveryStats.completedGoals) + "/" + String(recoveryStats.totalGoals)],
    ];
    exportCSV(`allah-yafik-report-${new Date().toISOString().slice(0, 10)}.csv`, headers, rows);
    toast.success("تم تصدير التقرير");
  };

  const saveSettingsHandler = () => {
    saveSettings(settingsDraft);
    setSettings(settingsDraft);
    setEditingSettings(false);
    toast.success("تم حفظ الإعدادات");
  };

  // ─── Content CRUD ──────────────────────────────────────────────────────────

  const resetForms = () => {
    setShowAddForm(false);
    setEditingContent(null);
    setLectureForm({ ...emptyLecture });
    setStoryForm({ ...emptyStory });
    setExerciseForm({ ...emptyExercise });
    if (uploadBlobUrl) URL.revokeObjectURL(uploadBlobUrl);
    setUploadBlobUrl(null);
    setUploadBlobMime("");
  };

  const addLecture = async () => {
    if (!lectureForm.title || !lectureForm.speaker) {
      toast.error("العنوان والمحاضر مطلوبان"); return;
    }
    if (lectureForm.mediaSource === "youtube" && lectureForm.youtubeUrl) {
      const m = lectureForm.youtubeUrl.match(/(?:youtu\.be\/|[?&]v=)([\w-]{11})/);
      if (!m) { toast.error("رابط يوتيوب غير صالح"); return; }
    }
    const id = crypto.randomUUID();
    // Save uploaded file to IndexedDB if present
    if (lectureForm.mediaSource === "upload" && uploadBlobUrl) {
      try {
        const resp = await fetch(uploadBlobUrl);
        const blob = await resp.blob();
        await saveFileBlob(`lecture_${id}`, blob);
      } catch {
        toast.error("فشل حفظ الملف"); return;
      }
    }
    const item: CustomLecture = {
      ...lectureForm,
      id,
      custom: true,
      uploadedFileKey: lectureForm.mediaSource === "upload" ? `lecture_${id}` : "",
    };
    const updated = [...customLectures, item];
    setCustomLectures(updated);
    saveCustomLectures(updated);
    resetForms();
    toast.success("تمت إضافة المحاضرة");
  };

  const updateLecture = async (id: string) => {
    // Save uploaded file to IndexedDB if changed
    if (lectureForm.mediaSource === "upload" && uploadBlobUrl) {
      try {
        const resp = await fetch(uploadBlobUrl);
        const blob = await resp.blob();
        await saveFileBlob(`lecture_${id}`, blob);
      } catch {
        toast.error("فشل حفظ الملف"); return;
      }
    }
    const updated = customLectures.map(l => l.id === id ? {
      ...l, ...lectureForm,
      uploadedFileKey: lectureForm.mediaSource === "upload" ? `lecture_${id}` : l.uploadedFileKey,
    } : l);
    setCustomLectures(updated);
    saveCustomLectures(updated);
    resetForms();
    toast.success("تم تعديل المحاضرة");
  };

  const deleteLecture = async (id: string) => {
    // Clean up file from IndexedDB
    const lecture = customLectures.find(l => l.id === id);
    if (lecture?.uploadedFileKey) {
      try { await deleteFileBlob(lecture.uploadedFileKey); } catch { /* ignore */ }
    }
    const updated = customLectures.filter(l => l.id !== id);
    setCustomLectures(updated);
    saveCustomLectures(updated);
    toast.success("تم حذف المحاضرة");
  };

  // Open preview modal for a lecture
  const openPreview = async (lecture: Lecture | CustomLecture) => {
    setPreviewLecture(lecture);
    if ((lecture as CustomLecture).custom && (lecture as CustomLecture).mediaSource === "upload" && (lecture as CustomLecture).uploadedFileKey) {
      try {
        const blob = await loadFileBlob((lecture as CustomLecture).uploadedFileKey);
        if (blob) setPreviewBlobUrl(URL.createObjectURL(blob));
      } catch { /* ignore */ }
    }
  };

  const closePreview = () => {
    if (previewBlobUrl) URL.revokeObjectURL(previewBlobUrl);
    setPreviewBlobUrl(null);
    setPreviewLecture(null);
  };

  const addStory = () => {
    if (!storyForm.title || !storyForm.author) {
      toast.error("العنوان والكاتب مطلوبان"); return;
    }
    const item: StoryItem = { ...storyForm, id: crypto.randomUUID(), date: new Date().toISOString() };
    const updated = [...stories, item];
    setStories(updated);
    saveStories(updated);
    resetForms();
    toast.success("تمت إضافة القصة");
  };

  const updateStory = (id: string) => {
    const updated = stories.map(s => s.id === id ? { ...s, ...storyForm, id } : s);
    setStories(updated);
    saveStories(updated);
    resetForms();
    toast.success("تم تعديل القصة");
  };

  const deleteStory = (id: string) => {
    const updated = stories.filter(s => s.id !== id);
    setStories(updated);
    saveStories(updated);
    toast.success("تم حذف القصة");
  };

  const addExercise = () => {
    if (!exerciseForm.title) {
      toast.error("العنوان مطلوب"); return;
    }
    const item: ExerciseItem = { ...exerciseForm, id: crypto.randomUUID() };
    const updated = [...exercises, item];
    setExercises(updated);
    saveExercises(updated);
    resetForms();
    toast.success("تمت إضافة التمرين");
  };

  const updateExercise = (id: string) => {
    const updated = exercises.map(e => e.id === id ? { ...e, ...exerciseForm, id } : e);
    setExercises(updated);
    saveExercises(updated);
    resetForms();
    toast.success("تم تعديل التمرين");
  };

  const deleteExercise = (id: string) => {
    const updated = exercises.filter(e => e.id !== id);
    setExercises(updated);
    saveExercises(updated);
    toast.success("تم حذف التمرين");
  };

  const startEditLecture = async (l: CustomLecture) => {
    setEditingContent(l.id);
    setShowAddForm(true);
    setLectureForm({
      title: l.title, subtitle: l.subtitle, speaker: l.speaker,
      speakerTitle: l.speakerTitle, category: l.category, ageGroup: l.ageGroup,
      ageLabel: l.ageLabel, duration: l.duration, type: l.type,
      color: l.color, featured: l.featured,
      mediaSource: l.mediaSource || "youtube",
      youtubeUrl: l.youtubeUrl || "",
      uploadedFileKey: l.uploadedFileKey || "",
      uploadedFileName: l.uploadedFileName || "",
      uploadedFileMime: l.uploadedFileMime || "",
    });
    // Load blob from IndexedDB for preview
    if (l.mediaSource === "upload" && l.uploadedFileKey) {
      try {
        const blob = await loadFileBlob(l.uploadedFileKey);
        if (blob) {
          const url = URL.createObjectURL(blob);
          setUploadBlobUrl(url);
          setUploadBlobMime(l.uploadedFileMime || blob.type);
        }
      } catch { /* ignore */ }
    }
  };

  const startEditStory = (s: StoryItem) => {
    setEditingContent(s.id);
    setShowAddForm(true);
    setStoryForm({ title: s.title, author: s.author, summary: s.summary, category: s.category });
  };

  const startEditExercise = (e: ExerciseItem) => {
    setEditingContent(e.id);
    setShowAddForm(true);
    setExerciseForm({
      title: e.title, description: e.description, duration: e.duration,
      category: e.category, difficulty: e.difficulty,
    });
  };

  // All lectures = built-in + custom
  const allLectures = useMemo(() => {
    const builtIn = lecturesData.map(l => ({ ...l, custom: false as const }));
    const custom = customLectures.map(l => ({ ...l, custom: true as const }));
    return [...builtIn, ...custom];
  }, [customLectures]);

  const deleteUser = (userId: string) => {
    const allUsers = loadUsers();
    const filtered = allUsers.filter(u => u.id !== userId);
    localStorage.setItem(
      "allah_yafik_users",
      JSON.stringify(filtered.map(u => ({ ...u })))
    );
    refresh();
    toast.success("تم حذف المستخدم");
  };

  const filteredUsers = users.filter(
    u =>
      u.name.includes(searchQuery) ||
      u.phone.includes(searchQuery) ||
      (u.email && u.email.includes(searchQuery))
  );

  return (
    <div className="min-h-screen bg-[#060B18] text-white md:flex">
      {/* Mobile Header */}
      <div className="md:hidden sticky top-0 z-40 bg-[#0A0F1E] border-b border-white/5">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#F59E0B] to-[#EF4444] flex items-center justify-center">
              <Shield className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="text-white font-black text-sm">لوحة الإدارة</h1>
              <p className="text-[#F59E0B] text-[10px]">الله يعافيك</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/dashboard">
              <div className="p-2 rounded-lg text-white/40 hover:text-white">
                <ChevronRight className="w-5 h-5" />
              </div>
            </Link>
          </div>
        </div>
        {/* Mobile section tabs — horizontal scroll */}
        <div className="overflow-x-auto scrollbar-hide">
          <div className="flex gap-1 px-3 pb-2 min-w-max">
            {adminSections.map(sec => (
              <button
                key={sec.id}
                onClick={() => setActiveSection(sec.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                  activeSection === sec.id
                    ? "bg-[#F59E0B]/15 text-[#F59E0B] border border-[#F59E0B]/25"
                    : "text-white/40 hover:text-white bg-white/3"
                }`}
              >
                <sec.icon className="w-3.5 h-3.5 flex-shrink-0" />
                {sec.label}
                {sec.id === "partners" && pendingPartners > 0 && (
                  <span className="px-1 py-0.5 rounded bg-[#EF4444] text-white text-[10px] font-numbers">
                    {pendingPartners}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex fixed right-0 top-0 h-full w-60 bg-[#0A0F1E] border-l border-white/5 z-30 flex-col">
        <div className="flex items-center gap-3 p-5 border-b border-white/5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#F59E0B] to-[#EF4444] flex items-center justify-center">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-white font-black text-sm">لوحة الإدارة</h1>
            <p className="text-[#F59E0B] text-xs">الله يعافيك</p>
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
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
              {sec.id === "users" && totalUsers > 0 && (
                <span className="mr-auto px-1.5 py-0.5 rounded-md bg-[#00D4AA]/20 text-[#00D4AA] text-xs font-numbers">
                  {totalUsers}
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
            href={`tel:${settings.emergencyPhone1}`}
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#00D4AA]/8 border border-[#00D4AA]/20 text-[#00D4AA] text-xs font-numbers"
          >
            <Phone className="w-3.5 h-3.5" />
            {settings.emergencyPhone1}
          </a>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:mr-60 overflow-y-auto">
        {/* Header */}
        {/* Header */}
        <div className="hidden md:flex sticky top-0 bg-[#060B18]/95 backdrop-blur-sm border-b border-white/5 px-4 md:px-8 py-3 md:py-4 items-center justify-between z-20">
          <div>
            <h2 className="text-white font-black text-lg">
              {adminSections.find(s => s.id === activeSection)?.label}
            </h2>
            <p className="text-white/35 text-xs">
              آخر تحديث: {new Date().toLocaleTimeString("ar-SA")}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={refresh}
              className="p-2 rounded-xl glass-card border border-white/8 text-white/40 hover:text-white transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              onClick={handleExport}
              className="flex items-center gap-2 px-4 py-2 rounded-xl glass-card border border-white/8 text-white/50 hover:text-white text-sm font-bold transition-all"
            >
              <Download className="w-4 h-4" />
              تصدير CSV
            </button>
          </div>
        </div>

        <div className="p-4 md:p-8">
          {/* ═══════════════ OVERVIEW ═══════════════ */}
          {activeSection === "overview" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {/* KPI Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-7">
                {[
                  {
                    label: "إجمالي المستخدمين",
                    value: totalUsers,
                    sub: `${usersWithTest.length} أكملوا الاختبار`,
                    icon: Users,
                    color: "#00D4AA",
                  },
                  {
                    label: "متوسط نتيجة الاختبار",
                    value: avgTestScore ? `${avgTestScore}%` : "—",
                    sub: `${usersWithTest.length} نتيجة`,
                    icon: Brain,
                    color: "#0EA5E9",
                  },
                  {
                    label: "تقدم التعافي",
                    value: recoveryStats.phasesCompleted,
                    sub: `${recoveryStats.completedGoals}/${recoveryStats.totalGoals} هدف مكتمل`,
                    icon: Target,
                    color: "#F59E0B",
                  },
                  {
                    label: "طلبات شراكة معلقة",
                    value: pendingPartners,
                    sub: "تحتاج مراجعة",
                    icon: Building2,
                    color: "#EF4444",
                  },
                ].map((kpi, i) => (
                  <div key={i} className="glass-card p-4 md:p-5 border border-white/7">
                    <div className="flex items-start justify-between mb-2 md:mb-3">
                      <div
                        className="w-8 h-8 md:w-10 md:h-10 rounded-xl flex items-center justify-center"
                        style={{ background: `${kpi.color}15` }}
                      >
                        <kpi.icon className="w-4 h-4 md:w-5 md:h-5" style={{ color: kpi.color }} />
                      </div>
                      <TrendingUp className="w-4 h-4 text-[#10B981]" />
                    </div>
                    <div className="text-white font-black text-xl md:text-2xl font-numbers mb-1">
                      {typeof kpi.value === "number" ? kpi.value.toLocaleString("ar") : kpi.value}
                    </div>
                    <div className="text-white/50 text-xs mb-1">{kpi.label}</div>
                    <div className="text-xs" style={{ color: kpi.color }}>
                      {kpi.sub}
                    </div>
                  </div>
                ))}
              </div>

              {/* Age & Test Distribution */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5 mb-7">
                {/* Age Groups */}
                <div className="glass-card p-5 border border-white/7">
                  <h3 className="text-white font-bold mb-4 text-sm flex items-center gap-2">
                    <Users className="w-4 h-4 text-[#00D4AA]" />
                    الفئات العمرية
                  </h3>
                  {totalUsers > 0 ? (
                    <div className="space-y-3">
                      {[
                        { label: "أطفال (أقل من 18)", count: ageGroups.young, color: "#0EA5E9" },
                        { label: "مراهقين (18-25)", count: ageGroups.teenage, color: "#F59E0B" },
                        { label: "بالغين (26+)", count: ageGroups.adult, color: "#00D4AA" },
                      ].map(g => (
                        <div key={g.label}>
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-white/60">{g.label}</span>
                            <span className="font-numbers" style={{ color: g.color }}>
                              {g.count}
                            </span>
                          </div>
                          <div className="h-2 rounded-full bg-white/5">
                            <div
                              className="h-full rounded-full transition-all"
                              style={{
                                width: `${totalUsers > 0 ? (g.count / totalUsers) * 100 : 0}%`,
                                background: g.color,
                              }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-[120px]">
                      <p className="text-white/30 text-xs">لا توجد بيانات بعد</p>
                    </div>
                  )}
                </div>

                {/* Test Results Distribution */}
                <div className="glass-card p-5 border border-white/7">
                  <h3 className="text-white font-bold mb-4 text-sm flex items-center gap-2">
                    <Brain className="w-4 h-4 text-[#0EA5E9]" />
                    نتائج الاختبار النفسي
                  </h3>
                  {usersWithTest.length > 0 ? (
                    <div className="space-y-2.5">
                      {[
                        { key: "excellent", label: "ممتاز" },
                        { key: "good", label: "جيد" },
                        { key: "moderate", label: "متوسط" },
                        { key: "low", label: "يحتاج تحسين" },
                        { key: "critical", label: "حرج" },
                      ].map(l => (
                        <div key={l.key} className="flex items-center gap-3">
                          <div
                            className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                            style={{ background: testLevelColors[l.key] }}
                          />
                          <span className="text-white/50 text-xs flex-1">{l.label}</span>
                          <span
                            className="font-numbers text-sm font-bold"
                            style={{ color: testLevelColors[l.key] }}
                          >
                            {testLevels[l.key]}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-[120px]">
                      <p className="text-white/30 text-xs">لا توجد نتائج بعد</p>
                    </div>
                  )}
                </div>

                {/* Recovery Progress */}
                <div className="glass-card p-5 border border-white/7">
                  <h3 className="text-white font-bold mb-4 text-sm flex items-center gap-2">
                    <Target className="w-4 h-4 text-[#F59E0B]" />
                    تقدم خطة التعافي
                  </h3>
                  {recoveryStats.totalGoals > 0 ? (
                    <div className="space-y-3">
                      {rehabPhases.map(phase => {
                        const goals = recoveryGoals[phase.order] || [];
                        const done = goals.filter(Boolean).length;
                        const total = goals.length || phase.goals.length;
                        const pct = total > 0 ? Math.round((done / total) * 100) : 0;
                        return (
                          <div key={phase.id}>
                            <div className="flex justify-between text-xs mb-1">
                              <span className="text-white/60 truncate ml-2">{phase.title}</span>
                              <span className="font-numbers" style={{ color: phase.color }}>
                                {pct}%
                              </span>
                            </div>
                            <div className="h-2 rounded-full bg-white/5">
                              <div
                                className="h-full rounded-full transition-all"
                                style={{ width: `${pct}%`, background: phase.color }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-[120px]">
                      <p className="text-white/30 text-xs">لم يبدأ أحد بعد</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Recent Users */}
              <div className="glass-card p-5 border border-white/5">
                <h3 className="text-white font-bold mb-3 flex items-center gap-2 text-sm">
                  <UserCheck className="w-4 h-4 text-[#00D4AA]" />
                  آخر المسجلين
                </h3>
                {users.length > 0 ? (
                  <div className="space-y-2">
                    {users
                      .slice()
                      .sort((a, b) => new Date(b.joinDate).getTime() - new Date(a.joinDate).getTime())
                      .slice(0, 5)
                      .map(u => (
                        <div
                          key={u.id}
                          className="flex items-center gap-3 p-3 rounded-xl bg-white/3"
                        >
                          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#00D4AA]/20 to-[#0EA5E9]/20 flex items-center justify-center font-black text-[#00D4AA] text-sm">
                            {u.name.charAt(0)}
                          </div>
                          <div className="flex-1">
                            <span className="text-white text-sm font-bold">{u.name}</span>
                            <span className="text-white/30 text-xs mr-2 font-numbers">{u.phone}</span>
                          </div>
                          {u.testResult && (
                            <span
                              className="px-2 py-0.5 rounded-lg text-xs font-bold"
                              style={{
                                background: `${u.testResult.color}15`,
                                color: u.testResult.color,
                              }}
                            >
                              {u.testResult.label} {u.testResult.total}%
                            </span>
                          )}
                          <span className="text-white/25 text-xs">
                            {u.joinDate ? new Date(u.joinDate).toLocaleDateString("ar-SA") : ""}
                          </span>
                        </div>
                      ))}
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-white/30 text-xs">لا يوجد مستخدمون مسجلون بعد</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* ═══════════════ USERS ═══════════════ */}
          {activeSection === "users" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="flex items-center gap-3 mb-5 flex-wrap">
                <div className="relative flex-1 min-w-[200px]">
                  <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                  <input
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="بحث بالاسم أو الجوال أو البريد..."
                    className="w-full bg-white/4 border border-white/10 rounded-xl pr-10 pl-4 py-2.5 text-white placeholder-white/25 focus:outline-none focus:border-white/25 text-sm"
                  />
                </div>
                <div className="text-white/40 text-sm">{filteredUsers.length} مستخدم</div>
                <button
                  onClick={exportUsersCSV}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl glass-card border border-white/8 text-white/40 hover:text-white text-xs font-bold transition-all"
                >
                  <Download className="w-3.5 h-3.5" />
                  تصدير
                </button>
              </div>

              {filteredUsers.length > 0 ? (
                <div className="space-y-2">
                  {filteredUsers.map(user => (
                    <div
                      key={user.id}
                      className="glass-card p-3 md:p-4 border border-white/7 flex items-start md:items-center gap-3 md:gap-4"
                    >
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#00D4AA]/20 to-[#0EA5E9]/20 flex items-center justify-center font-black text-[#00D4AA]">
                        {user.name.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                          <span className="text-white font-bold text-sm">{user.name}</span>
                          <span className="px-2 py-0.5 rounded-lg text-xs font-bold bg-[#00D4AA]/10 text-[#00D4AA]">
                            {user.ageGroup === "young"
                              ? "طفل"
                              : user.ageGroup === "teenage"
                                ? "مراهق"
                                : "بالغ"}
                          </span>
                          {user.testCompleted && user.testResult && (
                            <span
                              className="px-2 py-0.5 rounded-lg text-xs font-bold"
                              style={{
                                background: `${user.testResult.color}15`,
                                color: user.testResult.color,
                              }}
                            >
                              {user.testResult.label} {user.testResult.total}%
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 md:gap-3 text-white/35 text-xs flex-wrap">
                          <span className="font-numbers">{user.phone}</span>
                          {user.email && (
                            <>
                              <span>·</span>
                              <span>{user.email}</span>
                            </>
                          )}
                          <span>·</span>
                          <span>عمر {user.age}</span>
                          <span>·</span>
                          <span>
                            {user.joinDate
                              ? new Date(user.joinDate).toLocaleDateString("ar-SA")
                              : ""}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <a
                          href={`tel:${user.phone}`}
                          className="p-1.5 rounded-lg glass-card border border-white/8 text-white/40 hover:text-[#00D4AA] transition-colors"
                        >
                          <Phone className="w-3.5 h-3.5" />
                        </a>
                        <button
                          onClick={() => deleteUser(user.id)}
                          className="p-1.5 rounded-lg glass-card border border-white/8 text-white/40 hover:text-[#EF4444] transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Users className="w-10 h-10 text-white/10 mx-auto mb-3" />
                  <p className="text-white/30 text-sm">
                    {searchQuery ? "لا توجد نتائج للبحث" : "لا يوجد مستخدمون بعد"}
                  </p>
                </div>
              )}
            </motion.div>
          )}

          {/* ═══════════════ CONTENT MANAGEMENT ═══════════════ */}
          {activeSection === "content" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {/* Sub-tabs */}
              <div className="flex gap-2 mb-6 flex-wrap">
                {[
                  { id: "lectures" as const, label: "المحاضرات", icon: BookOpen, count: allLectures.length },
                  { id: "stories" as const, label: "قصص النجاح", icon: Trophy, count: stories.length },
                  { id: "exercises" as const, label: "التمارين", icon: Dumbbell, count: exercises.length },
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => { setContentTab(tab.id); resetForms(); }}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${
                      contentTab === tab.id
                        ? "bg-[#00D4AA]/15 text-[#00D4AA] border border-[#00D4AA]/25"
                        : "glass-card border border-white/8 text-white/40 hover:text-white"
                    }`}
                  >
                    <tab.icon className="w-4 h-4" />
                    {tab.label}
                    <span className="font-numbers text-xs opacity-60">{tab.count}</span>
                  </button>
                ))}
              </div>

              {/* ── LECTURES TAB ── */}
              {contentTab === "lectures" && (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-white/40 text-sm">
                      {lecturesData.length} مدمجة + {customLectures.length} مضافة
                    </p>
                    <button
                      onClick={() => { resetForms(); setShowAddForm(true); }}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#00D4AA]/15 text-[#00D4AA] border border-[#00D4AA]/25 text-sm font-bold hover:bg-[#00D4AA]/25 transition-all"
                    >
                      <Plus className="w-4 h-4" />
                      إضافة محاضرة
                    </button>
                  </div>

                  {/* Add/Edit Lecture Form */}
                  <AnimatePresence>
                    {showAddForm && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="glass-card p-5 border border-[#00D4AA]/20 mb-4 overflow-hidden"
                      >
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="text-white font-bold text-sm">
                            {editingContent ? "تعديل محاضرة" : "إضافة محاضرة جديدة"}
                          </h4>
                          <button onClick={resetForms} className="text-white/30 hover:text-white">
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <input
                            placeholder="العنوان *"
                            value={lectureForm.title}
                            onChange={e => setLectureForm(f => ({ ...f, title: e.target.value }))}
                            className="px-3 py-2.5 rounded-xl glass-card border border-white/10 bg-transparent text-white text-sm placeholder-white/25"
                          />
                          <input
                            placeholder="العنوان الفرعي"
                            value={lectureForm.subtitle}
                            onChange={e => setLectureForm(f => ({ ...f, subtitle: e.target.value }))}
                            className="px-3 py-2.5 rounded-xl glass-card border border-white/10 bg-transparent text-white text-sm placeholder-white/25"
                          />
                          <input
                            placeholder="المحاضر *"
                            value={lectureForm.speaker}
                            onChange={e => setLectureForm(f => ({ ...f, speaker: e.target.value }))}
                            className="px-3 py-2.5 rounded-xl glass-card border border-white/10 bg-transparent text-white text-sm placeholder-white/25"
                          />
                          <input
                            placeholder="لقب المحاضر"
                            value={lectureForm.speakerTitle}
                            onChange={e => setLectureForm(f => ({ ...f, speakerTitle: e.target.value }))}
                            className="px-3 py-2.5 rounded-xl glass-card border border-white/10 bg-transparent text-white text-sm placeholder-white/25"
                          />
                          <select
                            value={lectureForm.category}
                            onChange={e => setLectureForm(f => ({ ...f, category: e.target.value }))}
                            className="px-3 py-2.5 rounded-xl glass-card border border-white/10 bg-[#111827] text-white text-sm"
                          >
                            <option value="وقائي">وقائي</option>
                            <option value="نفسي">نفسي</option>
                            <option value="اجتماعي">اجتماعي</option>
                            <option value="طبي">طبي</option>
                            <option value="ديني">ديني</option>
                          </select>
                          <select
                            value={lectureForm.type}
                            onChange={e => setLectureForm(f => ({ ...f, type: e.target.value as CustomLecture["type"] }))}
                            className="px-3 py-2.5 rounded-xl glass-card border border-white/10 bg-[#111827] text-white text-sm"
                          >
                            <option value="video">فيديو</option>
                            <option value="audio">صوتي</option>
                            <option value="workshop">ورشة</option>
                            <option value="article">مقال</option>
                          </select>
                          <select
                            value={lectureForm.ageGroup}
                            onChange={e => {
                              const v = e.target.value;
                              const label = v === "young" ? "أطفال" : v === "teens" ? "مراهقين" : v === "adults" ? "بالغين" : "الكل";
                              setLectureForm(f => ({ ...f, ageGroup: v, ageLabel: label }));
                            }}
                            className="px-3 py-2.5 rounded-xl glass-card border border-white/10 bg-[#111827] text-white text-sm"
                          >
                            <option value="all">الكل</option>
                            <option value="young">أطفال</option>
                            <option value="teens">مراهقين</option>
                            <option value="adults">بالغين</option>
                          </select>
                          <input
                            placeholder="المدة (مثال: 45 دقيقة)"
                            value={lectureForm.duration}
                            onChange={e => setLectureForm(f => ({ ...f, duration: e.target.value }))}
                            className="px-3 py-2.5 rounded-xl glass-card border border-white/10 bg-transparent text-white text-sm placeholder-white/25"
                          />
                          <div className="flex items-center gap-3">
                            <label className="text-white/40 text-xs">اللون:</label>
                            <input
                              type="color"
                              value={lectureForm.color}
                              onChange={e => setLectureForm(f => ({ ...f, color: e.target.value }))}
                              className="w-8 h-8 rounded-lg border-0 cursor-pointer bg-transparent"
                            />
                            <label className="flex items-center gap-2 text-white/40 text-xs cursor-pointer mr-auto">
                              <input
                                type="checkbox"
                                checked={lectureForm.featured}
                                onChange={e => setLectureForm(f => ({ ...f, featured: e.target.checked }))}
                                className="rounded"
                              />
                              مميز
                            </label>
                          </div>
                        </div>

                        {/* ── Media Source ── */}
                        <div className="mt-4 p-4 rounded-xl bg-white/3 border border-white/7">
                          <label className="text-white/50 text-xs font-bold mb-3 block">مصدر المحتوى</label>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-4">
                            {([
                              { value: "youtube" as const, label: "رابط يوتيوب", icon: "▶", desc: "فيديو من يوتيوب" },
                              { value: "upload" as const, label: "رفع ملف", icon: "📁", desc: "ملف من جهازك" },
                              { value: "ai" as const, label: "مكتبة AI", icon: "🤖", desc: "قريباً" },
                            ]).map(opt => (
                              <button
                                key={opt.value}
                                type="button"
                                onClick={() => setLectureForm(f => ({ ...f, mediaSource: opt.value }))}
                                className={`p-3 rounded-xl border text-center transition-all ${
                                  lectureForm.mediaSource === opt.value
                                    ? "border-[#00D4AA]/40 bg-[#00D4AA]/10 text-white"
                                    : opt.value === "ai"
                                      ? "border-white/8 bg-white/2 text-white/25 cursor-not-allowed"
                                      : "border-white/8 bg-white/2 text-white/50 hover:border-white/20 hover:text-white"
                                }`}
                                disabled={opt.value === "ai"}
                              >
                                <div className="text-xl mb-1">{opt.icon}</div>
                                <div className="text-xs font-bold">{opt.label}</div>
                                <div className="text-[10px] opacity-50 mt-0.5">{opt.desc}</div>
                              </button>
                            ))}
                          </div>

                          {/* YouTube URL input */}
                          {lectureForm.mediaSource === "youtube" && (
                            <div>
                              <input
                                placeholder="https://www.youtube.com/watch?v=... أو https://youtu.be/..."
                                value={lectureForm.youtubeUrl}
                                onChange={e => setLectureForm(f => ({ ...f, youtubeUrl: e.target.value }))}
                                className="w-full px-3 py-2.5 rounded-xl glass-card border border-white/10 bg-transparent text-white text-sm placeholder-white/25 font-numbers"
                                dir="ltr"
                              />
                              {lectureForm.youtubeUrl && (() => {
                                const m = lectureForm.youtubeUrl.match(/(?:youtu\.be\/|[?&]v=)([\w-]{11})/);
                                if (!m) return <p className="text-[#EF4444]/70 text-xs mt-2">رابط يوتيوب غير صالح</p>;
                                const videoId = m[1];
                                return (
                                  <div className="mt-3">
                                    <div className="rounded-xl overflow-hidden border border-white/10 aspect-video relative">
                                      <iframe
                                        src={`https://www.youtube-nocookie.com/embed/${videoId}?rel=0&modestbranding=1`}
                                        className="w-full h-full"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                        title="YouTube preview"
                                        referrerPolicy="no-referrer-when-downgrade"
                                      />
                                    </div>
                                    <a
                                      href={`https://www.youtube.com/watch?v=${videoId}`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="inline-flex items-center gap-1.5 mt-2 text-[#EF4444]/60 hover:text-[#EF4444] text-xs transition-colors"
                                    >
                                      <Eye className="w-3 h-3" />
                                      إذا لم يظهر الفيديو — اضغط لفتحه في يوتيوب مباشرة
                                    </a>
                                  </div>
                                );
                              })()}
                            </div>
                          )}

                          {/* File upload */}
                          {lectureForm.mediaSource === "upload" && (
                            <div>
                              <label className="flex flex-col items-center justify-center w-full py-6 rounded-xl border-2 border-dashed border-white/15 hover:border-[#00D4AA]/30 cursor-pointer transition-colors bg-white/2">
                                <input
                                  type="file"
                                  accept="video/*,audio/*"
                                  className="hidden"
                                  onChange={e => {
                                    const file = e.target.files?.[0];
                                    if (!file) return;
                                    if (file.size > 500 * 1024 * 1024) {
                                      toast.error("الحد الأقصى لحجم الملف 500 ميجا");
                                      return;
                                    }
                                    // Revoke old blob URL
                                    if (uploadBlobUrl) URL.revokeObjectURL(uploadBlobUrl);
                                    const url = URL.createObjectURL(file);
                                    setUploadBlobUrl(url);
                                    setUploadBlobMime(file.type);
                                    setLectureForm(f => ({
                                      ...f,
                                      uploadedFileName: file.name,
                                      uploadedFileMime: file.type,
                                    }));
                                  }}
                                />
                                {lectureForm.uploadedFileName ? (
                                  <div className="text-center">
                                    <div className="text-[#00D4AA] text-2xl mb-1">✓</div>
                                    <p className="text-white text-sm font-bold">{lectureForm.uploadedFileName}</p>
                                    <p className="text-white/30 text-xs mt-1">اضغط لاستبدال الملف</p>
                                  </div>
                                ) : (
                                  <div className="text-center">
                                    <div className="text-white/20 text-3xl mb-2">📁</div>
                                    <p className="text-white/40 text-sm">اضغط لرفع ملف فيديو أو صوتي</p>
                                    <p className="text-white/20 text-xs mt-1">MP4, MP3, WebM — حتى 500 ميجا</p>
                                  </div>
                                )}
                              </label>
                              {uploadBlobUrl && uploadBlobMime.startsWith("video") && (
                                <div className="mt-3 rounded-xl overflow-hidden border border-white/10">
                                  <video src={uploadBlobUrl} controls className="w-full" />
                                </div>
                              )}
                              {uploadBlobUrl && uploadBlobMime.startsWith("audio") && (
                                <div className="mt-3">
                                  <audio src={uploadBlobUrl} controls className="w-full" />
                                </div>
                              )}
                              {!uploadBlobUrl && lectureForm.uploadedFileName && (
                                <p className="text-white/30 text-xs mt-2">الملف محفوظ — سيظهر عند المعاينة</p>
                              )}
                            </div>
                          )}

                          {/* AI placeholder */}
                          {lectureForm.mediaSource === "ai" && (
                            <div className="text-center py-6">
                              <div className="text-3xl mb-2">🤖</div>
                              <p className="text-white/30 text-sm">مكتبة المحتوى الذكي</p>
                              <p className="text-white/20 text-xs mt-1">سيتم تفعيل هذه الخاصية قريباً — إنشاء محتوى توعوي بالذكاء الاصطناعي</p>
                            </div>
                          )}
                        </div>

                        <div className="flex gap-2 mt-4">
                          <button
                            onClick={() => editingContent ? updateLecture(editingContent) : addLecture()}
                            className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#00D4AA]/15 text-[#00D4AA] border border-[#00D4AA]/25 text-sm font-bold hover:bg-[#00D4AA]/25 transition-all"
                          >
                            <Save className="w-4 h-4" />
                            {editingContent ? "حفظ التعديل" : "إضافة"}
                          </button>
                          <button
                            onClick={resetForms}
                            className="px-4 py-2.5 rounded-xl glass-card border border-white/8 text-white/40 text-sm font-bold hover:text-white transition-all"
                          >
                            إلغاء
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Lecture list */}
                  <div className="space-y-3">
                    {allLectures.map(lecture => (
                      <div key={lecture.id} className="glass-card p-4 border border-white/7">
                        <div className="flex items-start gap-4">
                          <div
                            className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                            style={{ background: `${lecture.color}20` }}
                          >
                            <BookOpen className="w-5 h-5" style={{ color: lecture.color }} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="text-white font-bold text-sm">{lecture.title}</h4>
                              {lecture.custom ? (
                                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-[#8B5CF6]/15 text-[#8B5CF6]">مضاف</span>
                              ) : (
                                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-white/5 text-white/25">مدمج</span>
                              )}
                            </div>
                            <p className="text-white/40 text-xs mb-2 line-clamp-1">{lecture.subtitle}</p>
                            <div className="flex items-center gap-3 text-white/30 text-xs flex-wrap">
                              <span className="flex items-center gap-1">
                                <Users className="w-3 h-3" />{lecture.speaker}
                              </span>
                              <span>·</span>
                              <span>{lecture.category}</span>
                              <span>·</span>
                              <span>{lecture.ageLabel}</span>
                              {lecture.duration && <><span>·</span><span>{lecture.duration}</span></>}
                              {!lecture.custom && "rating" in lecture && (
                                <>
                                  <span>·</span>
                                  <span className="flex items-center gap-1">
                                    <Star className="w-3 h-3 text-[#F59E0B]" />
                                    <span className="font-numbers">{(lecture as Lecture).rating}</span>
                                  </span>
                                  <span>·</span>
                                  <span className="flex items-center gap-1">
                                    <Eye className="w-3 h-3" />{(lecture as Lecture).views}
                                  </span>
                                </>
                              )}
                            </div>
                          </div>
                          <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                            <span
                              className="px-2 py-0.5 rounded-lg text-xs font-bold"
                              style={{ background: `${lecture.color}15`, color: lecture.color }}
                            >
                              {lecture.type === "video" ? "فيديو" : lecture.type === "audio" ? "صوتي" : lecture.type === "workshop" ? "ورشة" : "مقال"}
                            </span>
                            {lecture.featured && (
                              <span className="px-2 py-0.5 rounded-lg text-xs font-bold bg-[#F59E0B]/15 text-[#F59E0B]">مميز</span>
                            )}
                            {lecture.custom && (lecture as CustomLecture).mediaSource && (
                              <span className={`px-2 py-0.5 rounded-lg text-xs font-bold ${
                                (lecture as CustomLecture).mediaSource === "youtube"
                                  ? "bg-[#FF0000]/12 text-[#FF4444]"
                                  : (lecture as CustomLecture).mediaSource === "upload"
                                    ? "bg-[#3B82F6]/12 text-[#60A5FA]"
                                    : "bg-[#8B5CF6]/12 text-[#A78BFA]"
                              }`}>
                                {(lecture as CustomLecture).mediaSource === "youtube" ? "▶ يوتيوب"
                                  : (lecture as CustomLecture).mediaSource === "upload" ? "📁 مرفوع"
                                    : "🤖 AI"}
                              </span>
                            )}
                            {lecture.custom && (
                              <div className="flex gap-1 mt-1">
                                <button
                                  onClick={() => openPreview(lecture)}
                                  className="p-1.5 rounded-lg glass-card border border-white/8 text-white/40 hover:text-[#00D4AA] transition-colors"
                                  title="معاينة"
                                >
                                  <Eye className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => startEditLecture(lecture as CustomLecture)}
                                  className="p-1.5 rounded-lg glass-card border border-white/8 text-white/40 hover:text-[#F59E0B] transition-colors"
                                >
                                  <Edit3 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => deleteLecture(lecture.id)}
                                  className="p-1.5 rounded-lg glass-card border border-white/8 text-white/40 hover:text-[#EF4444] transition-colors"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            )}
                            {!lecture.custom && (
                              <button
                                onClick={() => openPreview(lecture)}
                                className="p-1.5 rounded-lg glass-card border border-white/8 text-white/40 hover:text-[#00D4AA] transition-colors mt-1"
                                title="معاينة"
                              >
                                <Eye className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </div>
                        {/* Built-in lecture stats */}
                        {!lecture.custom && (
                          <div className="mt-3 pt-3 border-t border-white/5 grid grid-cols-2 md:grid-cols-4 gap-3">
                            {[
                              { label: "الأقسام", value: (lecture as Lecture).sections.length },
                              { label: "أسئلة الاختبار", value: (lecture as Lecture).quiz.length },
                              { label: "الأهداف", value: (lecture as Lecture).objectives.length },
                              { label: "المصادر", value: (lecture as Lecture).resources.length },
                            ].map(s => (
                              <div key={s.label} className="text-center">
                                <div className="text-white/25 text-xs mb-0.5">{s.label}</div>
                                <div className="text-white font-numbers text-sm font-bold">{s.value}</div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ── STORIES TAB ── */}
              {contentTab === "stories" && (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-white/40 text-sm">{stories.length} قصة نجاح</p>
                    <button
                      onClick={() => { resetForms(); setShowAddForm(true); }}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#00D4AA]/15 text-[#00D4AA] border border-[#00D4AA]/25 text-sm font-bold hover:bg-[#00D4AA]/25 transition-all"
                    >
                      <Plus className="w-4 h-4" />
                      إضافة قصة
                    </button>
                  </div>

                  {/* Add/Edit Story Form */}
                  <AnimatePresence>
                    {showAddForm && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="glass-card p-5 border border-[#00D4AA]/20 mb-4 overflow-hidden"
                      >
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="text-white font-bold text-sm">
                            {editingContent ? "تعديل قصة" : "إضافة قصة جديدة"}
                          </h4>
                          <button onClick={resetForms} className="text-white/30 hover:text-white">
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <input
                            placeholder="عنوان القصة *"
                            value={storyForm.title}
                            onChange={e => setStoryForm(f => ({ ...f, title: e.target.value }))}
                            className="px-3 py-2.5 rounded-xl glass-card border border-white/10 bg-transparent text-white text-sm placeholder-white/25"
                          />
                          <input
                            placeholder="اسم الكاتب *"
                            value={storyForm.author}
                            onChange={e => setStoryForm(f => ({ ...f, author: e.target.value }))}
                            className="px-3 py-2.5 rounded-xl glass-card border border-white/10 bg-transparent text-white text-sm placeholder-white/25"
                          />
                          <select
                            value={storyForm.category}
                            onChange={e => setStoryForm(f => ({ ...f, category: e.target.value }))}
                            className="px-3 py-2.5 rounded-xl glass-card border border-white/10 bg-[#111827] text-white text-sm"
                          >
                            <option value="تعافي">تعافي</option>
                            <option value="وعي">وعي</option>
                            <option value="وقاية">وقاية</option>
                            <option value="إلهام">إلهام</option>
                          </select>
                        </div>
                        <textarea
                          placeholder="ملخص القصة"
                          value={storyForm.summary}
                          onChange={e => setStoryForm(f => ({ ...f, summary: e.target.value }))}
                          rows={3}
                          className="w-full mt-3 px-3 py-2.5 rounded-xl glass-card border border-white/10 bg-transparent text-white text-sm placeholder-white/25 resize-none"
                        />
                        <div className="flex gap-2 mt-4">
                          <button
                            onClick={() => editingContent ? updateStory(editingContent) : addStory()}
                            className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#00D4AA]/15 text-[#00D4AA] border border-[#00D4AA]/25 text-sm font-bold hover:bg-[#00D4AA]/25 transition-all"
                          >
                            <Save className="w-4 h-4" />
                            {editingContent ? "حفظ التعديل" : "إضافة"}
                          </button>
                          <button onClick={resetForms} className="px-4 py-2.5 rounded-xl glass-card border border-white/8 text-white/40 text-sm font-bold hover:text-white transition-all">
                            إلغاء
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Stories list */}
                  {stories.length > 0 ? (
                    <div className="space-y-3">
                      {stories.map(story => (
                        <div key={story.id} className="glass-card p-4 border border-white/7">
                          <div className="flex items-start gap-3">
                            <div className="w-10 h-10 rounded-xl bg-[#F59E0B]/15 flex items-center justify-center flex-shrink-0">
                              <Trophy className="w-5 h-5 text-[#F59E0B]" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="text-white font-bold text-sm mb-0.5">{story.title}</h4>
                              <div className="flex items-center gap-2 text-white/30 text-xs mb-2">
                                <span>{story.author}</span>
                                <span>·</span>
                                <span className="px-1.5 py-0.5 rounded bg-[#F59E0B]/10 text-[#F59E0B] text-[10px] font-bold">{story.category}</span>
                                <span>·</span>
                                <span>{new Date(story.date).toLocaleDateString("ar-SA")}</span>
                              </div>
                              {story.summary && <p className="text-white/40 text-xs line-clamp-2">{story.summary}</p>}
                            </div>
                            <div className="flex gap-1 flex-shrink-0">
                              <button
                                onClick={() => startEditStory(story)}
                                className="p-1.5 rounded-lg glass-card border border-white/8 text-white/40 hover:text-[#F59E0B] transition-colors"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => deleteStory(story.id)}
                                className="p-1.5 rounded-lg glass-card border border-white/8 text-white/40 hover:text-[#EF4444] transition-colors"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : !showAddForm ? (
                    <div className="text-center py-12">
                      <Trophy className="w-10 h-10 text-white/10 mx-auto mb-3" />
                      <p className="text-white/30 text-sm">لا توجد قصص نجاح بعد</p>
                      <p className="text-white/20 text-xs mt-1">اضغط "إضافة قصة" لإضافة أول قصة</p>
                    </div>
                  ) : null}
                </div>
              )}

              {/* ── EXERCISES TAB ── */}
              {contentTab === "exercises" && (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-white/40 text-sm">{exercises.length} تمرين</p>
                    <button
                      onClick={() => { resetForms(); setShowAddForm(true); }}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#00D4AA]/15 text-[#00D4AA] border border-[#00D4AA]/25 text-sm font-bold hover:bg-[#00D4AA]/25 transition-all"
                    >
                      <Plus className="w-4 h-4" />
                      إضافة تمرين
                    </button>
                  </div>

                  {/* Add/Edit Exercise Form */}
                  <AnimatePresence>
                    {showAddForm && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="glass-card p-5 border border-[#00D4AA]/20 mb-4 overflow-hidden"
                      >
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="text-white font-bold text-sm">
                            {editingContent ? "تعديل تمرين" : "إضافة تمرين جديد"}
                          </h4>
                          <button onClick={resetForms} className="text-white/30 hover:text-white">
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <input
                            placeholder="عنوان التمرين *"
                            value={exerciseForm.title}
                            onChange={e => setExerciseForm(f => ({ ...f, title: e.target.value }))}
                            className="px-3 py-2.5 rounded-xl glass-card border border-white/10 bg-transparent text-white text-sm placeholder-white/25"
                          />
                          <input
                            placeholder="المدة (مثال: 10 دقائق)"
                            value={exerciseForm.duration}
                            onChange={e => setExerciseForm(f => ({ ...f, duration: e.target.value }))}
                            className="px-3 py-2.5 rounded-xl glass-card border border-white/10 bg-transparent text-white text-sm placeholder-white/25"
                          />
                          <select
                            value={exerciseForm.category}
                            onChange={e => setExerciseForm(f => ({ ...f, category: e.target.value }))}
                            className="px-3 py-2.5 rounded-xl glass-card border border-white/10 bg-[#111827] text-white text-sm"
                          >
                            <option value="تنفس">تنفس</option>
                            <option value="تأمل">تأمل</option>
                            <option value="رياضي">رياضي</option>
                            <option value="ذهني">ذهني</option>
                            <option value="اجتماعي">اجتماعي</option>
                          </select>
                          <select
                            value={exerciseForm.difficulty}
                            onChange={e => setExerciseForm(f => ({ ...f, difficulty: e.target.value as ExerciseItem["difficulty"] }))}
                            className="px-3 py-2.5 rounded-xl glass-card border border-white/10 bg-[#111827] text-white text-sm"
                          >
                            <option value="سهل">سهل</option>
                            <option value="متوسط">متوسط</option>
                            <option value="صعب">صعب</option>
                          </select>
                        </div>
                        <textarea
                          placeholder="وصف التمرين"
                          value={exerciseForm.description}
                          onChange={e => setExerciseForm(f => ({ ...f, description: e.target.value }))}
                          rows={3}
                          className="w-full mt-3 px-3 py-2.5 rounded-xl glass-card border border-white/10 bg-transparent text-white text-sm placeholder-white/25 resize-none"
                        />
                        <div className="flex gap-2 mt-4">
                          <button
                            onClick={() => editingContent ? updateExercise(editingContent) : addExercise()}
                            className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#00D4AA]/15 text-[#00D4AA] border border-[#00D4AA]/25 text-sm font-bold hover:bg-[#00D4AA]/25 transition-all"
                          >
                            <Save className="w-4 h-4" />
                            {editingContent ? "حفظ التعديل" : "إضافة"}
                          </button>
                          <button onClick={resetForms} className="px-4 py-2.5 rounded-xl glass-card border border-white/8 text-white/40 text-sm font-bold hover:text-white transition-all">
                            إلغاء
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Exercises list */}
                  {exercises.length > 0 ? (
                    <div className="space-y-3">
                      {exercises.map(ex => {
                        const diffColor = ex.difficulty === "سهل" ? "#10B981" : ex.difficulty === "متوسط" ? "#F59E0B" : "#EF4444";
                        return (
                          <div key={ex.id} className="glass-card p-4 border border-white/7">
                            <div className="flex items-start gap-3">
                              <div className="w-10 h-10 rounded-xl bg-[#8B5CF6]/15 flex items-center justify-center flex-shrink-0">
                                <Dumbbell className="w-5 h-5 text-[#8B5CF6]" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="text-white font-bold text-sm mb-0.5">{ex.title}</h4>
                                <div className="flex items-center gap-2 text-white/30 text-xs mb-2 flex-wrap">
                                  <span className="px-1.5 py-0.5 rounded bg-[#8B5CF6]/10 text-[#8B5CF6] text-[10px] font-bold">{ex.category}</span>
                                  <span className="px-1.5 py-0.5 rounded text-[10px] font-bold" style={{ background: `${diffColor}15`, color: diffColor }}>
                                    {ex.difficulty}
                                  </span>
                                  {ex.duration && <><span>·</span><span>{ex.duration}</span></>}
                                </div>
                                {ex.description && <p className="text-white/40 text-xs line-clamp-2">{ex.description}</p>}
                              </div>
                              <div className="flex gap-1 flex-shrink-0">
                                <button
                                  onClick={() => startEditExercise(ex)}
                                  className="p-1.5 rounded-lg glass-card border border-white/8 text-white/40 hover:text-[#F59E0B] transition-colors"
                                >
                                  <Edit3 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => deleteExercise(ex.id)}
                                  className="p-1.5 rounded-lg glass-card border border-white/8 text-white/40 hover:text-[#EF4444] transition-colors"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : !showAddForm ? (
                    <div className="text-center py-12">
                      <Dumbbell className="w-10 h-10 text-white/10 mx-auto mb-3" />
                      <p className="text-white/30 text-sm">لا توجد تمارين بعد</p>
                      <p className="text-white/20 text-xs mt-1">اضغط "إضافة تمرين" لإضافة أول تمرين</p>
                    </div>
                  ) : null}
                </div>
              )}
            </motion.div>
          )}

          {/* ═══════════════ RECOVERY PLAN (PREVENTION PHASES) ═══════════════ */}
          {activeSection === "recovery-plan" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h3 className="text-white font-black text-lg">الخطة الوقائية</h3>
                  <p className="text-white/40 text-sm mt-1">{adminPhases.length} مراحل · التعديلات تظهر مباشرة في صفحة /recovery</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setAdminPhases(defaultAdminPhases);
                      saveAdminPhases(defaultAdminPhases);
                      toast.success("تم إعادة الخطة للوضع الافتراضي");
                    }}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl glass-card border border-white/8 text-white/40 text-sm font-bold hover:text-white transition-all"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    استعادة الأصلية
                  </button>
                  <button
                    onClick={() => {
                      setPhaseForm({ ...emptyPhase });
                      setEditingPhaseId(null);
                      setShowAddPhase(true);
                    }}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#00D4AA]/15 text-[#00D4AA] border border-[#00D4AA]/25 text-sm font-bold hover:bg-[#00D4AA]/25 transition-all"
                  >
                    <Plus className="w-4 h-4" />
                    إضافة مرحلة
                  </button>
                </div>
              </div>

              {/* Add / Edit Phase Form */}
              <AnimatePresence>
                {showAddPhase && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="glass-card p-5 border border-[#00D4AA]/20 mb-5 overflow-hidden"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-white font-bold text-sm">
                        {editingPhaseId !== null ? "تعديل المرحلة" : "إضافة مرحلة جديدة"}
                      </h4>
                      <button onClick={() => { setShowAddPhase(false); setEditingPhaseId(null); }} className="text-white/30 hover:text-white">
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                      <input
                        placeholder="عنوان المرحلة *"
                        value={phaseForm.title}
                        onChange={e => setPhaseForm(f => ({ ...f, title: e.target.value }))}
                        className="px-3 py-2.5 rounded-xl glass-card border border-white/10 bg-transparent text-white text-sm placeholder-white/25"
                      />
                      <input
                        placeholder="العنوان الفرعي (مثل: الأسبوع ١-٢)"
                        value={phaseForm.subtitle}
                        onChange={e => setPhaseForm(f => ({ ...f, subtitle: e.target.value }))}
                        className="px-3 py-2.5 rounded-xl glass-card border border-white/10 bg-transparent text-white text-sm placeholder-white/25"
                      />
                      <select
                        value={phaseForm.iconName}
                        onChange={e => setPhaseForm(f => ({ ...f, iconName: e.target.value }))}
                        className="px-3 py-2.5 rounded-xl glass-card border border-white/10 bg-[#111827] text-white text-sm"
                      >
                        {PHASE_ICON_OPTIONS.map(o => (
                          <option key={o.name} value={o.name}>{o.label}</option>
                        ))}
                      </select>
                      <select
                        value={phaseForm.color}
                        onChange={e => setPhaseForm(f => ({ ...f, color: e.target.value }))}
                        className="px-3 py-2.5 rounded-xl glass-card border border-white/10 bg-[#111827] text-white text-sm"
                      >
                        {PHASE_COLOR_OPTIONS.map(o => (
                          <option key={o.value} value={o.value}>{o.label}</option>
                        ))}
                      </select>
                      <input
                        placeholder="المكافأة (مثل: شارة الواعي)"
                        value={phaseForm.reward}
                        onChange={e => setPhaseForm(f => ({ ...f, reward: e.target.value }))}
                        className="px-3 py-2.5 rounded-xl glass-card border border-white/10 bg-transparent text-white text-sm placeholder-white/25"
                      />
                    </div>
                    <textarea
                      placeholder="وصف المرحلة *"
                      value={phaseForm.description}
                      onChange={e => setPhaseForm(f => ({ ...f, description: e.target.value }))}
                      rows={2}
                      className="w-full px-3 py-2.5 rounded-xl glass-card border border-white/10 bg-transparent text-white text-sm placeholder-white/25 mb-4 resize-none"
                    />

                    {/* Goals editor */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-white/60 text-sm font-bold">الأهداف</span>
                        <button
                          onClick={() => setPhaseForm(f => ({ ...f, goals: [...f.goals, { text: "", link: "/assessment" }] }))}
                          className="text-[#00D4AA] text-xs font-bold hover:underline flex items-center gap-1"
                        >
                          <Plus className="w-3 h-3" />
                          إضافة هدف
                        </button>
                      </div>
                      <div className="space-y-2">
                        {phaseForm.goals.map((goal, gi) => (
                          <div key={gi} className="flex gap-2 items-center">
                            <input
                              placeholder="نص الهدف *"
                              value={goal.text}
                              onChange={e => {
                                const goals = [...phaseForm.goals];
                                goals[gi] = { ...goals[gi], text: e.target.value };
                                setPhaseForm(f => ({ ...f, goals }));
                              }}
                              className="flex-1 px-3 py-2 rounded-xl glass-card border border-white/10 bg-transparent text-white text-sm placeholder-white/25"
                            />
                            <select
                              value={goal.link}
                              onChange={e => {
                                const goals = [...phaseForm.goals];
                                goals[gi] = { ...goals[gi], link: e.target.value };
                                setPhaseForm(f => ({ ...f, goals }));
                              }}
                              className="px-2 py-2 rounded-xl glass-card border border-white/10 bg-[#111827] text-white text-xs w-28"
                            >
                              {GOAL_LINK_OPTIONS.map(o => (
                                <option key={o.value} value={o.value}>{o.label}</option>
                              ))}
                            </select>
                            {phaseForm.goals.length > 1 && (
                              <button
                                onClick={() => setPhaseForm(f => ({ ...f, goals: f.goals.filter((_, i) => i !== gi) }))}
                                className="text-red-400/60 hover:text-red-400 flex-shrink-0"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-2 justify-end">
                      <button
                        onClick={() => { setShowAddPhase(false); setEditingPhaseId(null); }}
                        className="px-4 py-2.5 rounded-xl glass-card border border-white/8 text-white/40 text-sm font-bold hover:text-white transition-all"
                      >
                        إلغاء
                      </button>
                      <button
                        onClick={() => {
                          if (!phaseForm.title || !phaseForm.description) {
                            toast.error("العنوان والوصف مطلوبان");
                            return;
                          }
                          const validGoals = phaseForm.goals.filter(g => g.text.trim());
                          if (validGoals.length === 0) {
                            toast.error("أضف هدفاً واحداً على الأقل");
                            return;
                          }
                          if (editingPhaseId !== null) {
                            const updated = adminPhases.map(p =>
                              p.id === editingPhaseId ? { ...phaseForm, id: editingPhaseId, goals: validGoals } : p
                            );
                            setAdminPhases(updated);
                            saveAdminPhases(updated);
                            toast.success("تم تعديل المرحلة");
                          } else {
                            const newId = adminPhases.length > 0 ? Math.max(...adminPhases.map(p => p.id)) + 1 : 1;
                            const updated = [...adminPhases, { ...phaseForm, id: newId, goals: validGoals }];
                            setAdminPhases(updated);
                            saveAdminPhases(updated);
                            toast.success("تمت إضافة مرحلة جديدة");
                          }
                          setShowAddPhase(false);
                          setEditingPhaseId(null);
                        }}
                        className="px-6 py-2.5 rounded-xl bg-[#00D4AA]/20 text-[#00D4AA] border border-[#00D4AA]/25 text-sm font-bold hover:bg-[#00D4AA]/30 transition-all flex items-center gap-1.5"
                      >
                        <Save className="w-4 h-4" />
                        {editingPhaseId !== null ? "حفظ التعديلات" : "إضافة المرحلة"}
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Phases list */}
              <div className="space-y-3">
                {adminPhases.map((phase, idx) => (
                  <motion.div
                    key={phase.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="glass-card p-5 border border-white/7"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${phase.color} flex items-center justify-center`}>
                          <span className="text-lg">{PHASE_ICON_OPTIONS.find(o => o.name === phase.iconName)?.label.split(" ")[0] || "🧠"}</span>
                        </div>
                        <div>
                          <div className="text-white font-bold">{phase.title}</div>
                          <div className="text-white/40 text-xs">{phase.subtitle} · {phase.goals.length} أهداف · المكافأة: {phase.reward}</div>
                        </div>
                      </div>
                      <div className="flex gap-1.5">
                        {idx > 0 && (
                          <button
                            onClick={() => {
                              const arr = [...adminPhases];
                              [arr[idx - 1], arr[idx]] = [arr[idx], arr[idx - 1]];
                              setAdminPhases(arr);
                              saveAdminPhases(arr);
                            }}
                            className="w-8 h-8 rounded-lg glass-card border border-white/8 flex items-center justify-center text-white/30 hover:text-white transition-all"
                            title="تحريك لأعلى"
                          >
                            <ChevronDown className="w-3.5 h-3.5 rotate-180" />
                          </button>
                        )}
                        {idx < adminPhases.length - 1 && (
                          <button
                            onClick={() => {
                              const arr = [...adminPhases];
                              [arr[idx], arr[idx + 1]] = [arr[idx + 1], arr[idx]];
                              setAdminPhases(arr);
                              saveAdminPhases(arr);
                            }}
                            className="w-8 h-8 rounded-lg glass-card border border-white/8 flex items-center justify-center text-white/30 hover:text-white transition-all"
                            title="تحريك لأسفل"
                          >
                            <ChevronDown className="w-3.5 h-3.5" />
                          </button>
                        )}
                        <button
                          onClick={() => {
                            setPhaseForm({
                              title: phase.title,
                              subtitle: phase.subtitle,
                              iconName: phase.iconName,
                              color: phase.color,
                              description: phase.description,
                              goals: [...phase.goals],
                              reward: phase.reward,
                            });
                            setEditingPhaseId(phase.id);
                            setShowAddPhase(true);
                          }}
                          className="w-8 h-8 rounded-lg glass-card border border-white/8 flex items-center justify-center text-white/30 hover:text-[#00D4AA] transition-all"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            if (adminPhases.length <= 1) {
                              toast.error("يجب أن تبقى مرحلة واحدة على الأقل");
                              return;
                            }
                            const updated = adminPhases.filter(p => p.id !== phase.id);
                            setAdminPhases(updated);
                            saveAdminPhases(updated);
                            toast.success("تم حذف المرحلة");
                          }}
                          className="w-8 h-8 rounded-lg glass-card border border-white/8 flex items-center justify-center text-white/30 hover:text-red-400 transition-all"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                    <p className="text-white/50 text-xs leading-relaxed mb-3">{phase.description}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {phase.goals.map((g, gi) => (
                        <span key={gi} className="px-2.5 py-1 rounded-lg bg-white/5 text-white/50 text-xs border border-white/5">
                          {g.text}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* ═══════════════ PARTNERS ═══════════════ */}
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

          {/* ═══════════════ REPORTS ═══════════════ */}
          {activeSection === "reports" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {/* Users Report */}
                <div className="glass-card p-5 border border-white/7">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-white font-bold text-sm flex items-center gap-2">
                      <Users className="w-4 h-4 text-[#00D4AA]" />
                      تقرير المستخدمين
                    </h4>
                    <button
                      onClick={() => exportUsersCSV()}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg glass-card border border-white/8 text-white/40 hover:text-white text-xs transition-colors"
                    >
                      <Download className="w-3 h-3" />
                      CSV
                    </button>
                  </div>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-white/40">إجمالي المستخدمين</span>
                      <span className="text-white font-numbers font-bold">{totalUsers}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/40">أكملوا الاختبار</span>
                      <span className="text-white font-numbers font-bold">{usersWithTest.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/40">معدل إتمام الاختبار</span>
                      <span className="text-white font-numbers font-bold">
                        {totalUsers ? Math.round((usersWithTest.length / totalUsers) * 100) : 0}%
                      </span>
                    </div>
                    {Object.entries(ageGroups).map(([key, val]) => (
                      <div key={key} className="flex justify-between">
                        <span className="text-white/40">
                          {key === "young" ? "أطفال" : key === "teenage" ? "مراهقون" : "بالغون"}
                        </span>
                        <span className="text-white font-numbers font-bold">{val}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Mental Health Report */}
                <div className="glass-card p-5 border border-white/7">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-white font-bold text-sm flex items-center gap-2">
                      <Brain className="w-4 h-4 text-[#F59E0B]" />
                      تقرير الصحة النفسية
                    </h4>
                    <button
                      onClick={() => exportReportCSV()}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg glass-card border border-white/8 text-white/40 hover:text-white text-xs transition-colors"
                    >
                      <Download className="w-3 h-3" />
                      CSV
                    </button>
                  </div>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-white/40">متوسط الدرجات</span>
                      <span className="text-white font-numbers font-bold">
                        {avgTestScore.toFixed(1)}%
                      </span>
                    </div>
                    {Object.entries(testLevels).map(([level, count]) => (
                      <div key={level} className="flex justify-between">
                        <span className="text-white/40">{level}</span>
                        <span className="text-white font-numbers font-bold">{count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Recovery Report */}
              <div className="glass-card p-5 border border-white/7">
                <h4 className="text-white font-bold text-sm flex items-center gap-2 mb-4">
                  <Activity className="w-4 h-4 text-[#8B5CF6]" />
                  تقرير التعافي
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { label: "أهداف كلية", value: recoveryStats.totalGoals },
                    { label: "أهداف مكتملة", value: recoveryStats.completedGoals },
                    { label: "مراحل بدأت", value: recoveryStats.phasesStarted },
                    { label: "مراحل مكتملة", value: recoveryStats.phasesCompleted },
                  ].map(item => (
                    <div key={item.label} className="text-center p-3 rounded-xl bg-white/3">
                      <div className="text-white font-numbers text-2xl font-black mb-1">{item.value}</div>
                      <div className="text-white/40 text-xs">{item.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* ═══════════════ SETTINGS ═══════════════ */}
          {activeSection === "settings" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="glass-card p-6 border border-white/7">
                <div className="flex items-center justify-between mb-6">
                  <h4 className="text-white font-bold text-sm">إعدادات المنصة</h4>
                  {!editingSettings ? (
                    <button
                      onClick={() => { setEditingSettings(true); setSettingsDraft({ ...settings }); }}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#00D4AA]/15 text-[#00D4AA] border border-[#00D4AA]/25 text-sm font-bold hover:bg-[#00D4AA]/25 transition-all"
                    >
                      <Edit3 className="w-4 h-4" />
                      تعديل
                    </button>
                  ) : (
                    <div className="flex gap-2">
                      <button
                        onClick={saveSettingsHandler}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/25 text-sm font-bold hover:bg-[#10B981]/25 transition-all"
                      >
                        <Save className="w-4 h-4" />
                        حفظ
                      </button>
                      <button
                        onClick={() => setEditingSettings(false)}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-xl glass-card border border-white/8 text-white/40 text-sm font-bold hover:text-white transition-all"
                      >
                        <X className="w-4 h-4" />
                        إلغاء
                      </button>
                    </div>
                  )}
                </div>

                <div className="space-y-5">
                  {/* Emergency phones */}
                  <div>
                    <label className="text-white/40 text-xs mb-2 block">أرقام الطوارئ</label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <span className="text-white/25 text-xs">الرقم الأول</span>
                        <input
                          type="tel"
                          dir="ltr"
                          value={editingSettings ? settingsDraft.emergencyPhone1 : settings.emergencyPhone1}
                          onChange={e => setSettingsDraft(d => ({ ...d, emergencyPhone1: e.target.value }))}
                          disabled={!editingSettings}
                          className="w-full mt-1 px-4 py-2.5 rounded-xl glass-card border border-white/10 bg-transparent text-white font-numbers text-sm disabled:opacity-40"
                        />
                      </div>
                      <div>
                        <span className="text-white/25 text-xs">الرقم الثاني</span>
                        <input
                          type="tel"
                          dir="ltr"
                          value={editingSettings ? settingsDraft.emergencyPhone2 : settings.emergencyPhone2}
                          onChange={e => setSettingsDraft(d => ({ ...d, emergencyPhone2: e.target.value }))}
                          disabled={!editingSettings}
                          className="w-full mt-1 px-4 py-2.5 rounded-xl glass-card border border-white/10 bg-transparent text-white font-numbers text-sm disabled:opacity-40"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Welcome message */}
                  <div>
                    <label className="text-white/40 text-xs mb-2 block">رسالة الترحيب</label>
                    <textarea
                      value={editingSettings ? settingsDraft.welcomeMessage : settings.welcomeMessage}
                      onChange={e => setSettingsDraft(d => ({ ...d, welcomeMessage: e.target.value }))}
                      disabled={!editingSettings}
                      rows={3}
                      className="w-full px-4 py-2.5 rounded-xl glass-card border border-white/10 bg-transparent text-white text-sm disabled:opacity-40 resize-none"
                    />
                  </div>

                  {/* Section toggles */}
                  <div>
                    <label className="text-white/40 text-xs mb-3 block">الأقسام النشطة</label>
                    <div className="space-y-2">
                      {[
                        { key: "chat", label: "المحادثة" },
                        { key: "community", label: "المجتمع" },
                        { key: "exercises", label: "التمارين" },
                        { key: "partners", label: "الشركاء" },
                      ].map(item => {
                        const src = editingSettings ? settingsDraft : settings;
                        const val = src.sectionsEnabled[item.key] ?? true;
                        return (
                          <button
                            key={item.key}
                            onClick={() => editingSettings && setSettingsDraft(d => ({
                              ...d,
                              sectionsEnabled: { ...d.sectionsEnabled, [item.key]: !d.sectionsEnabled[item.key] },
                            }))}
                            disabled={!editingSettings}
                            className="w-full flex items-center justify-between px-4 py-3 rounded-xl glass-card border border-white/7 disabled:opacity-60"
                          >
                            <span className="text-white text-sm">{item.label}</span>
                            {val ? (
                              <ToggleRight className="w-6 h-6 text-[#00D4AA]" />
                            ) : (
                              <ToggleLeft className="w-6 h-6 text-white/20" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* ═══════════════ ALERTS ═══════════════ */}
          {activeSection === "alerts" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {(() => {
                const alerts: { id: string; msg: string; severity: "warning" | "danger" | "info" }[] = [];
                const noTest = users.filter(u => !u.testCompleted);
                if (noTest.length > 0) {
                  alerts.push({
                    id: "no-test",
                    msg: `${noTest.length} مستخدم لم يكمل اختبار التقييم الذاتي`,
                    severity: "warning",
                  });
                }
                const critical = users.filter(
                  u => u.testResult && u.testResult.level === "critical"
                );
                if (critical.length > 0) {
                  alerts.push({
                    id: "critical",
                    msg: `${critical.length} مستخدم في مستوى حرج ويحتاج متابعة فورية`,
                    severity: "danger",
                  });
                }
                const lowScore = users.filter(
                  u => u.testResult && u.testResult.total < 40
                );
                if (lowScore.length > 0) {
                  alerts.push({
                    id: "low-score",
                    msg: `${lowScore.length} مستخدم حصل على درجة أقل من 40%`,
                    severity: "warning",
                  });
                }
                const noRecovery = users.filter(u => {
                  const goals: Record<string, unknown>[] = JSON.parse(localStorage.getItem("allah_yafik_recovery_goals") || "[]");
                  return !goals.some(g => (g as { id?: string }).id === u.id);
                });
                if (noRecovery.length > 0) {
                  alerts.push({
                    id: "no-recovery",
                    msg: `${noRecovery.length} مستخدم ليس لديه خطة تعافي`,
                    severity: "info",
                  });
                }

                if (alerts.length === 0) {
                  return (
                    <div className="text-center py-16">
                      <CheckCircle2 className="w-12 h-12 text-[#10B981]/30 mx-auto mb-3" />
                      <p className="text-white/30 text-sm">لا توجد تنبيهات — كل شيء يعمل بشكل جيد</p>
                    </div>
                  );
                }

                const sev: Record<string, { bg: string; border: string; text: string; icon: typeof AlertTriangle }> = {
                  danger: { bg: "bg-[#EF4444]/8", border: "border-[#EF4444]/25", text: "text-[#EF4444]", icon: AlertTriangle },
                  warning: { bg: "bg-[#F59E0B]/8", border: "border-[#F59E0B]/25", text: "text-[#F59E0B]", icon: AlertTriangle },
                  info: { bg: "bg-[#3B82F6]/8", border: "border-[#3B82F6]/25", text: "text-[#3B82F6]", icon: Bell },
                };

                return (
                  <div className="space-y-3">
                    {alerts.map(a => {
                      const s = sev[a.severity];
                      return (
                        <div key={a.id} className={`p-4 rounded-xl border ${s.bg} ${s.border}`}>
                          <div className="flex items-start gap-3">
                            <s.icon className={`w-5 h-5 mt-0.5 flex-shrink-0 ${s.text}`} />
                            <p className="text-white text-sm">{a.msg}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })()}
            </motion.div>
          )}
        </div>
      </main>

      {/* ═══════════════ PREVIEW MODAL ═══════════════ */}
      <AnimatePresence>
        {previewLecture && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center p-4"
          >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={closePreview} />

            {/* Modal */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl bg-[#0A0F1E] border border-white/10 shadow-2xl"
            >
              {/* Header */}
              <div className="sticky top-0 z-10 flex items-center justify-between p-4 border-b border-white/8 bg-[#0A0F1E]/95 backdrop-blur-sm">
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4 text-[#00D4AA]" />
                  <span className="text-white/50 text-xs font-bold">معاينة — كما يراها المستخدم</span>
                </div>
                <button onClick={closePreview} className="text-white/30 hover:text-white transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Content preview */}
              <div className="p-5">
                {/* Hero */}
                <div className="flex items-start gap-4 mb-5">
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
                    style={{ background: `${previewLecture.color}20` }}
                  >
                    <BookOpen className="w-7 h-7" style={{ color: previewLecture.color }} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-white font-black text-lg mb-1">{previewLecture.title}</h3>
                    {previewLecture.subtitle && (
                      <p className="text-white/40 text-sm">{previewLecture.subtitle}</p>
                    )}
                    <div className="flex items-center gap-2 mt-2 flex-wrap">
                      <span
                        className="px-2.5 py-1 rounded-lg text-xs font-bold"
                        style={{ background: `${previewLecture.color}15`, color: previewLecture.color }}
                      >
                        {previewLecture.type === "video" ? "فيديو" : previewLecture.type === "audio" ? "صوتي" : previewLecture.type === "workshop" ? "ورشة" : "مقال"}
                      </span>
                      <span className="text-white/25 text-xs">{previewLecture.category}</span>
                      {previewLecture.duration && <span className="text-white/25 text-xs">· {previewLecture.duration}</span>}
                      <span className="text-white/25 text-xs">· {previewLecture.ageLabel}</span>
                    </div>
                  </div>
                </div>

                {/* Speaker info */}
                <div className="glass-card p-4 border border-white/7 rounded-xl mb-5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#00D4AA] to-[#0EA5E9] flex items-center justify-center">
                      <span className="text-[#060B18] font-black text-sm">
                        {previewLecture.speaker.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="text-white font-bold text-sm">{previewLecture.speaker}</p>
                      {previewLecture.speakerTitle && (
                        <p className="text-white/40 text-xs">{previewLecture.speakerTitle}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Media preview */}
                {(previewLecture as CustomLecture).custom && (() => {
                  const cl = previewLecture as CustomLecture;
                  if (cl.mediaSource === "youtube" && cl.youtubeUrl) {
                    const m = cl.youtubeUrl.match(/(?:youtu\.be\/|[?&]v=)([\w-]{11})/);
                    if (m) {
                      return (
                        <div className="mb-5">
                          <div className="rounded-xl overflow-hidden border border-white/10 aspect-video">
                            <iframe
                              src={`https://www.youtube-nocookie.com/embed/${m[1]}?rel=0&modestbranding=1`}
                              className="w-full h-full"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                              title={cl.title}
                              referrerPolicy="no-referrer-when-downgrade"
                            />
                          </div>
                        </div>
                      );
                    }
                  }
                  if (cl.mediaSource === "upload" && previewBlobUrl) {
                    const mime = cl.uploadedFileMime || "";
                    if (mime.startsWith("video")) {
                      return (
                        <div className="mb-5 rounded-xl overflow-hidden border border-white/10">
                          <video src={previewBlobUrl} controls className="w-full" />
                        </div>
                      );
                    }
                    if (mime.startsWith("audio")) {
                      return (
                        <div className="mb-5">
                          <audio src={previewBlobUrl} controls className="w-full" />
                        </div>
                      );
                    }
                  }
                  if (cl.mediaSource === "upload" && cl.uploadedFileName && !previewBlobUrl) {
                    return (
                      <div className="mb-5 p-4 rounded-xl glass-card border border-white/7 text-center">
                        <p className="text-white/40 text-sm">📁 {cl.uploadedFileName}</p>
                        <p className="text-white/20 text-xs mt-1">جاري تحميل الملف...</p>
                      </div>
                    );
                  }
                  return null;
                })()}

                {/* Built-in lecture details */}
                {!("custom" in previewLecture) && "sections" in previewLecture && (
                  <div>
                    <h4 className="text-white font-bold text-sm mb-3">محتوى المحاضرة</h4>
                    <div className="space-y-2">
                      {(previewLecture as Lecture).sections.map((section, i) => (
                        <div key={i} className="glass-card p-3 border border-white/5 rounded-lg">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-lg bg-white/5 flex items-center justify-center text-white/30 text-xs font-numbers font-bold">
                              {i + 1}
                            </div>
                            <span className="text-white text-sm">{section.title}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {previewLecture.featured && (
                  <div className="mt-4 p-3 rounded-xl bg-[#F59E0B]/8 border border-[#F59E0B]/20 text-center">
                    <span className="text-[#F59E0B] text-sm font-bold">⭐ محاضرة مميزة</span>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
