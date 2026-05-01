/**
 * Home - الصفحة الرئيسية
 * Design: Mobile-First PWA Dark Luxury - "الله يعافيك"
 * الهدف: الوقاية من الإدمان قبل الوقوع فيه
 */
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { doc, onSnapshot } from "firebase/firestore";
import {
  Award,
  BarChart3,
  Bell,
  BookOpen,
  Brain,
  ChevronLeft,
  FileText,
  Gamepad2,
  GraduationCap,
  Heart,
  Lightbulb,
  MessageCircle,
  Phone,
  Settings,
  Shield,
  Sparkles,
  Star,
  TrendingUp,
  Users,
  type LucideIcon,
} from "lucide-react";
import { db as firestoreDb } from "@/lib/firebase";
import { lecturesData } from "@/data/lecturesData";
import { ageGroupLabels, type AgeGroup } from "@/data/mentalHealthTestData";
import { auth, getUserProfile } from "@/lib/firebase";

const CONTACT_PHONE = "0546192019";

type HomeAudience = "guest" | "child" | "teen" | "adult";
type Gender = "male" | "female";

interface Quote {
  text: string;
  author: string;
}

interface QuickAction {
  icon: LucideIcon;
  label: string;
  sublabel: string;
  path: string;
  color: string;
  bg: string;
}

interface SpotlightCard {
  icon: string;
  title: string;
  desc: string;
  color: string;
}

interface HomeConfig {
  eyebrow: string;
  title: string;
  subtitle: string;
  accent: string;
  icon: LucideIcon;
  gradient: string;
  borderColor: string;
  radialColor: string;
  noteLabel: string;
  noteText: string;
  noteLinkLabel: string;
  noteLinkPath: string;
  spotlightTitle: string;
  spotlightCards: SpotlightCard[];
  lectureTitle: string;
  lectureDescription: string;
  primaryCtaLabel: string;
  secondaryCtaLabel: string;
  secondaryCtaPath: string;
  supportTitle: string;
  quotes: Quote[];
  quickActions: QuickAction[];
  contactTitle: string;
  contactSubtitle: string;
}

interface CurrentUser {
  name?: string;
  ageGroup?: string;
  gender?: Gender;
  testResult?: {
    total?: number;
  };
}

const genderConfig: Record<
  Gender,
  { label: string; emoji: string; color: string }
> = {
  male: { label: "ذكر", emoji: "♂️", color: "#3B82F6" },
  female: { label: "أنثى", emoji: "♀️", color: "#EC4899" },
};

const genderQuotes: Record<Gender, Quote[]> = {
  male: [
    {
      text: "القوة الحقيقية ليست في التحدي الأعمى، بل في قرار واعٍ يحمي مستقبلك.",
      author: "برنامج الله يعافيك",
    },
    {
      text: "ضبط النفس مهارة تبني شخصية قوية وتمنع القرارات الاندفاعية.",
      author: "فريق الوقاية",
    },
  ],
  female: [
    {
      text: "حماية حدودك الشخصية قوة ووعي، وليست قسوة.",
      author: "برنامج الله يعافيك",
    },
    {
      text: "كل قرار واعٍ اليوم يحميك ويحمي من حولك غداً.",
      author: "فريق الوقاية",
    },
  ],
};

const supportCircles = [
  { icon: "🏥", label: "مستشفيات", desc: "دعم صحي", color: "#EF4444" },
  { icon: "🎓", label: "تعليم", desc: "توعية", color: "#8B5CF6" },
  { icon: "👨‍👩‍👧", label: "أسرة", desc: "احتواء", color: "#0EA5E9" },
  { icon: "🕌", label: "إرشاد", desc: "قيم", color: "#F59E0B" },
  { icon: "🤝", label: "مجتمع", desc: "مساندة", color: "#10B981" },
];

const ADMIN_SETTINGS_KEY = "allah_yafik_admin_settings";
const FIRESTORE_SETTINGS_COLLECTION = "app_settings";
const FIRESTORE_SETTINGS_DOC = "platform";

type AppreciationCardContent = {
  enabled: boolean;
  title: string;
  lines: [string, string, string];
};

const DEFAULT_APPRECIATION_CONTENT: AppreciationCardContent = {
  enabled: true,
  title: "وقفة شكر وتقدير",
  lines: [
    "جامعة جازان",
    "كلية الفنون والعلوم الإنسانية",
    "قسم علم النفس",
  ],
};

function extractPartnersEnabledFromSettings(raw: unknown): boolean {
  if (!raw || typeof raw !== "object") return false;

  const settings = raw as { sectionsEnabled?: unknown };
  if (!settings.sectionsEnabled || typeof settings.sectionsEnabled !== "object") {
    return false;
  }

  const sectionsEnabled = settings.sectionsEnabled as { partners?: unknown };
  return sectionsEnabled.partners === true;
}

function extractAppreciationFromSettings(raw: unknown): AppreciationCardContent {
  if (!raw || typeof raw !== "object") return DEFAULT_APPRECIATION_CONTENT;

  const settings = raw as { appreciation?: unknown };
  if (!settings.appreciation || typeof settings.appreciation !== "object") {
    return DEFAULT_APPRECIATION_CONTENT;
  }

  const appreciation = settings.appreciation as {
    enabled?: unknown;
    title?: unknown;
    lines?: unknown;
  };
  const lines = Array.isArray(appreciation.lines) ? appreciation.lines : [];

  return {
    enabled:
      typeof appreciation.enabled === "boolean"
        ? appreciation.enabled
        : DEFAULT_APPRECIATION_CONTENT.enabled,
    title:
      typeof appreciation.title === "string"
        ? appreciation.title
        : DEFAULT_APPRECIATION_CONTENT.title,
    lines: [
      typeof lines[0] === "string" ? lines[0] : DEFAULT_APPRECIATION_CONTENT.lines[0],
      typeof lines[1] === "string" ? lines[1] : DEFAULT_APPRECIATION_CONTENT.lines[1],
      typeof lines[2] === "string" ? lines[2] : DEFAULT_APPRECIATION_CONTENT.lines[2],
    ],
  };
}

function syncHomeSettingsToLocalStorage(
  partnersEnabled: boolean,
  appreciationContent: AppreciationCardContent
) {
  try {
    const raw = localStorage.getItem(ADMIN_SETTINGS_KEY);
    const parsed = raw ? JSON.parse(raw) : {};
    const baseSettings =
      parsed && typeof parsed === "object"
        ? (parsed as Record<string, unknown>)
        : {};

    const existingSections =
      baseSettings.sectionsEnabled &&
      typeof baseSettings.sectionsEnabled === "object"
        ? (baseSettings.sectionsEnabled as Record<string, unknown>)
        : {};

    const mergedSettings: Record<string, unknown> = {
      ...baseSettings,
      sectionsEnabled: {
        ...existingSections,
        partners: partnersEnabled,
      },
      appreciation: appreciationContent,
    };

    localStorage.setItem(ADMIN_SETTINGS_KEY, JSON.stringify(mergedSettings));
  } catch {
    // Ignore cache sync failures; UI state is already updated.
  }
}

function getPartnersSectionEnabled(): boolean {
  try {
    const raw = localStorage.getItem(ADMIN_SETTINGS_KEY);
    if (!raw) return false;

    const parsed = JSON.parse(raw);
    return extractPartnersEnabledFromSettings(parsed);
  } catch {
    return false;
  }
}

function getAppreciationContent(): AppreciationCardContent {
  try {
    const raw = localStorage.getItem(ADMIN_SETTINGS_KEY);
    if (!raw) return DEFAULT_APPRECIATION_CONTENT;

    const parsed = JSON.parse(raw);
    return extractAppreciationFromSettings(parsed);
  } catch {
    return DEFAULT_APPRECIATION_CONTENT;
  }
}

const homeConfigs: Record<HomeAudience, HomeConfig> = {
  guest: {
    eyebrow: "برنامج الوقاية",
    title: "حصّن نفسك قبل أن تحتاج",
    subtitle:
      "ابدأ بخطوات بسيطة لفهم المخاطر وبناء خطة وقائية تناسبك وتناسب أسرتك.",
    accent: "#00D4AA",
    icon: Shield,
    gradient:
      "linear-gradient(135deg, rgba(0,212,170,0.15), rgba(14,165,233,0.08))",
    borderColor: "rgba(0,212,170,0.2)",
    radialColor: "#00D4AA",
    noteLabel: "هل تعلم؟",
    noteText:
      "٧٠٪ من حالات الإدمان تبدأ قبل سن ٢٥ عاماً، لذلك الوقاية المبكرة تصنع الفرق الأكبر.",
    noteLinkLabel: "اطلع على الإحصائيات الكاملة",
    noteLinkPath: "/statistics",
    spotlightTitle: "أركان الوقاية الأربعة",
    spotlightCards: [
      {
        icon: "🧠",
        title: "الوعي الذاتي",
        desc: "اعرف المخاطر قبل أن تتعرض لها.",
        color: "#8B5CF6",
      },
      {
        icon: "💪",
        title: "مهارات الرفض",
        desc: "قل لا بثقة في المواقف الصعبة.",
        color: "#00D4AA",
      },
      {
        icon: "🕌",
        title: "التحصين القيمي",
        desc: "القيم والالتزام الشخصي درع يومي.",
        color: "#F59E0B",
      },
      {
        icon: "👨‍👩‍👧",
        title: "دعم الأسرة",
        desc: "الأسرة الواعية تحمي أبناءها مبكراً.",
        color: "#EC4899",
      },
    ],
    lectureTitle: "محاضرات توعوية للجميع",
    lectureDescription:
      "محتوى علمي مبسّط يغطي الأطفال والشباب والبالغين بلغات تناسب كل فئة.",
    primaryCtaLabel: "ابدأ التعلم",
    secondaryCtaLabel: "أنشئ حساباً",
    secondaryCtaPath: "/login",
    supportTitle: "منظومة الشراكات",
    quotes: [
      {
        text: "الوقاية خير من ألف علاج — حصّن نفسك قبل أن تحتاج للعلاج",
        author: "برنامج الله يعافيك",
      },
      {
        text: "العلم بالمخاطر هو أول خطوة في طريق الوقاية",
        author: "منظمة الصحة العالمية",
      },
      {
        text: "الشباب الواعي هو درع المجتمع ضد الإدمان",
        author: "برنامج الله يعافيك",
      },
    ],
    quickActions: [
      {
        icon: Shield,
        label: "الوقاية",
        sublabel: "خطة عملية",
        path: "/recovery",
        color: "#00D4AA",
        bg: "from-[#00D4AA]/20 to-[#0EA5E9]/10",
      },
      {
        icon: Brain,
        label: "التقييم",
        sublabel: "مستوى الوعي",
        path: "/assessment",
        color: "#8B5CF6",
        bg: "from-[#8B5CF6]/20 to-[#3B82F6]/10",
      },
      {
        icon: BookOpen,
        label: "محاضرات",
        sublabel: "محتوى علمي",
        path: "/lectures",
        color: "#F59E0B",
        bg: "from-[#F59E0B]/20 to-[#EF4444]/10",
      },
      {
        icon: Users,
        label: "مجتمع",
        sublabel: "قصص ووعي",
        path: "/community",
        color: "#EC4899",
        bg: "from-[#EC4899]/20 to-[#F97316]/10",
      },
      {
        icon: BarChart3,
        label: "إحصائيات",
        sublabel: "بيانات وطنية",
        path: "/statistics",
        color: "#0EA5E9",
        bg: "from-[#0EA5E9]/20 to-[#6366F1]/10",
      },
      {
        icon: FileText,
        label: "موارد",
        sublabel: "أدوات مساعدة",
        path: "/resources",
        color: "#10B981",
        bg: "from-[#10B981]/20 to-[#059669]/10",
      },
    ],
    contactTitle: "خط الاستشارة الوقائية",
    contactSubtitle: "استشارة مجانية وسريعة على مدار الساعة.",
  },
  child: {
    eyebrow: "المسار الآمن للصغار",
    title: "يا بطل، وعيك يحميك",
    subtitle:
      "تعلم كيف تميّز الخطر، وكيف تتكلم مع أهلك، وكيف تقول لا بثقة وبساطة.",
    accent: "#14B8A6",
    icon: Gamepad2,
    gradient:
      "linear-gradient(135deg, rgba(20,184,166,0.18), rgba(56,189,248,0.08))",
    borderColor: "rgba(20,184,166,0.25)",
    radialColor: "#14B8A6",
    noteLabel: "تذكير مهم",
    noteText:
      "القوة ليست في التجربة، بل في أن تعرف ما ينفعك وما يضرك وتطلب المساعدة مبكراً.",
    noteLinkLabel: "تصفح أدوات الحماية",
    noteLinkPath: "/resources",
    spotlightTitle: "خطواتي اليومية للحماية",
    spotlightCards: [
      {
        icon: "🛡️",
        title: "أعرف الخطر",
        desc: "اسأل عندما لا تفهم شيئاً يخص جسمك أو صحتك.",
        color: "#14B8A6",
      },
      {
        icon: "🗣️",
        title: "أتكلم فوراً",
        desc: "إذا أقلقك شيء، تحدث مع شخص كبير تثق به.",
        color: "#38BDF8",
      },
      {
        icon: "👫",
        title: "أختار صحبتي",
        desc: "الأصدقاء الجيدون لا يضغطون عليك لتفعل الخطأ.",
        color: "#F59E0B",
      },
      {
        icon: "💪",
        title: "أقول لا",
        desc: "من حقي أن أرفض أي شيء يضرني أو يخيفني.",
        color: "#EC4899",
      },
    ],
    lectureTitle: "محاضرات مبسطة للناشئين",
    lectureDescription:
      "قصص ومحاضرات سهلة الفهم تساعدك على معرفة الصح من الخطأ بطريقة مناسبة لعمرك.",
    primaryCtaLabel: "شاهد محاضراتي",
    secondaryCtaLabel: "قصص تشجعني",
    secondaryCtaPath: "/success-stories",
    supportTitle: "من يساعدني عندما أحتاج؟",
    quotes: [
      {
        text: "الشجاع هو من يطلب المساعدة عندما يحتاجها.",
        author: "برنامج الله يعافيك",
      },
      {
        text: "من عرف الخطر مبكراً استطاع أن يحمي نفسه بسهولة.",
        author: "حكمة تربوية",
      },
      {
        text: "قولك لا في الوقت الصحيح بطولة حقيقية.",
        author: "فريق التوعية",
      },
    ],
    quickActions: [
      {
        icon: Gamepad2,
        label: "تعلم والعب",
        sublabel: "محتوى مناسب",
        path: "/lectures",
        color: "#14B8A6",
        bg: "from-[#14B8A6]/20 to-[#38BDF8]/10",
      },
      {
        icon: Heart,
        label: "قصص ملهمة",
        sublabel: "أبطال مثلي",
        path: "/success-stories",
        color: "#EC4899",
        bg: "from-[#EC4899]/20 to-[#F472B6]/10",
      },
      {
        icon: Shield,
        label: "خطة الأمان",
        sublabel: "خطوات سهلة",
        path: "/recovery",
        color: "#F59E0B",
        bg: "from-[#F59E0B]/20 to-[#FB7185]/10",
      },
      {
        icon: Users,
        label: "أسرتي",
        sublabel: "دعم قريب",
        path: "/partners",
        color: "#0EA5E9",
        bg: "from-[#0EA5E9]/20 to-[#6366F1]/10",
      },
      {
        icon: Award,
        label: "إنجازاتي",
        sublabel: "أتقدم كل يوم",
        path: "/achievements",
        color: "#10B981",
        bg: "from-[#10B981]/20 to-[#14B8A6]/10",
      },
      {
        icon: MessageCircle,
        label: "أطلب مساعدة",
        sublabel: "لست وحدك",
        path: "/resources",
        color: "#8B5CF6",
        bg: "from-[#8B5CF6]/20 to-[#A855F7]/10",
      },
    ],
    contactTitle: "إذا أزعجك شيء",
    contactSubtitle: "اتصل فوراً أو أخبر شخصاً كبيراً تثق به.",
  },
  teen: {
    eyebrow: "مسار الشباب الواعي",
    title: "قراراتك اليوم تبني قوتك",
    subtitle:
      "هذا وقت تثبت فيه نفسك وتتعلم كيف تواجه الضغط وتختار ما يحمي مستقبلك.",
    accent: "#F59E0B",
    icon: Sparkles,
    gradient:
      "linear-gradient(135deg, rgba(245,158,11,0.18), rgba(239,68,68,0.08))",
    borderColor: "rgba(245,158,11,0.25)",
    radialColor: "#F59E0B",
    noteLabel: "قاعدة مهمة",
    noteText:
      "كل مرة تقول فيها لا لضغط الأقران، أنت لا ترفض فقط، بل تبني شخصيتك أيضاً.",
    noteLinkLabel: "اطلع على التقييم",
    noteLinkPath: "/assessment",
    spotlightTitle: "ما يقويني في هذه المرحلة",
    spotlightCards: [
      {
        icon: "⚡",
        title: "هوية واضحة",
        desc: "اعرف ما الذي تريده لنفسك قبل أن يقرره غيرك.",
        color: "#F59E0B",
      },
      {
        icon: "🚫",
        title: "رفض بثقة",
        desc: "تعلم جمل الرفض ولا تبرر قرارك الخاطئ للآخرين.",
        color: "#EF4444",
      },
      {
        icon: "🎯",
        title: "هدف واضح",
        desc: "كل هدف حقيقي يقلل فرص الوقوع في العادات الضارة.",
        color: "#8B5CF6",
      },
      {
        icon: "🤝",
        title: "صحبة قوية",
        desc: "اختر من يرفعك للأفضل لا من يسحبك للأسوأ.",
        color: "#10B981",
      },
    ],
    lectureTitle: "محتوى يناسب ضغط هذه المرحلة",
    lectureDescription:
      "محاضرات عملية عن الرفض، الثقة بالنفس، والتعامل مع تأثير الأصدقاء والمجتمع.",
    primaryCtaLabel: "ابدأ بالمحاضرات",
    secondaryCtaLabel: "إنجازاتي",
    secondaryCtaPath: "/achievements",
    supportTitle: "منظومة الدعم حولك",
    quotes: [
      {
        text: "قوتك الحقيقية تظهر عندما تختار الصح رغم الضغط.",
        author: "برنامج الله يعافيك",
      },
      {
        text: "لا تجعل لحظة اندفاع تحدد شكل مستقبلك.",
        author: "فريق الوقاية",
      },
      {
        text: "الرفض الواثق لا يحتاج اعتذاراً.",
        author: "ورشة مهارات الرفض",
      },
    ],
    quickActions: [
      {
        icon: Brain,
        label: "تقييمي",
        sublabel: "اعرف مستواي",
        path: "/assessment",
        color: "#F59E0B",
        bg: "from-[#F59E0B]/20 to-[#EF4444]/10",
      },
      {
        icon: BookOpen,
        label: "محاضرة",
        sublabel: "خبرة عملية",
        path: "/lectures",
        color: "#8B5CF6",
        bg: "from-[#8B5CF6]/20 to-[#EC4899]/10",
      },
      {
        icon: Shield,
        label: "خطتي",
        sublabel: "مسار حماية",
        path: "/recovery",
        color: "#00D4AA",
        bg: "from-[#00D4AA]/20 to-[#0EA5E9]/10",
      },
      {
        icon: Award,
        label: "إنجازاتي",
        sublabel: "أتقدم",
        path: "/achievements",
        color: "#EF4444",
        bg: "from-[#EF4444]/20 to-[#F97316]/10",
      },
      {
        icon: Users,
        label: "مجتمعي",
        sublabel: "دعم وتفاعل",
        path: "/community",
        color: "#10B981",
        bg: "from-[#10B981]/20 to-[#22C55E]/10",
      },
      {
        icon: TrendingUp,
        label: "إحصائيات",
        sublabel: "صورة أوضح",
        path: "/statistics",
        color: "#0EA5E9",
        bg: "from-[#0EA5E9]/20 to-[#6366F1]/10",
      },
    ],
    contactTitle: "إذا واجهت ضغطاً",
    contactSubtitle: "اطلب دعماً فورياً قبل أن تتحول اللحظة إلى قرار سيئ.",
  },
  adult: {
    eyebrow: "مسار البالغين",
    title: "الوقاية تبدأ من القرار الواعي",
    subtitle:
      "مسار هادئ وعملي يساعدك على حماية نفسك وأسرتك وبناء بيئة صحية مستقرة.",
    accent: "#8B5CF6",
    icon: GraduationCap,
    gradient:
      "linear-gradient(135deg, rgba(139,92,246,0.18), rgba(236,72,153,0.08))",
    borderColor: "rgba(139,92,246,0.24)",
    radialColor: "#8B5CF6",
    noteLabel: "مؤشر مهم",
    noteText:
      "الوقاية لدى البالغين لا تخص الفرد فقط، بل تنعكس مباشرة على الأسرة والأبناء والبيئة المحيطة.",
    noteLinkLabel: "اكتشف الموارد",
    noteLinkPath: "/resources",
    spotlightTitle: "أولويات الوقاية للبالغين",
    spotlightCards: [
      {
        icon: "🏛️",
        title: "قرار ثابت",
        desc: "وضوح القرار الشخصي يقلل مساحة التردد والضغط الخارجي.",
        color: "#8B5CF6",
      },
      {
        icon: "👨‍👩‍👧",
        title: "قدوة للأسرة",
        desc: "سلوكك اليومي يصنع بيئة أكثر أماناً لمن حولك.",
        color: "#F59E0B",
      },
      {
        icon: "📊",
        title: "متابعة عملية",
        desc: "التقييم والخطة والمتابعة أدوات تمنع التراخي المبكر.",
        color: "#10B981",
      },
      {
        icon: "🧭",
        title: "موارد موثوقة",
        desc: "اختر المعرفة الموثوقة بدلاً من النصائح المتفرقة.",
        color: "#0EA5E9",
      },
    ],
    lectureTitle: "محاضرات عملية للبالغين والأسر",
    lectureDescription:
      "محتوى علمي يساعدك على فهم الإدمان، الوقاية الأسرية، وبناء خطط دعم أكثر نضجاً.",
    primaryCtaLabel: "تصفح المحاضرات",
    secondaryCtaLabel: "الموارد",
    secondaryCtaPath: "/resources",
    supportTitle: "شبكة الدعم الوقائي",
    quotes: [
      {
        text: "الوقاية الناجحة تبدأ بقرار هادئ وواضح يستمر كل يوم.",
        author: "برنامج الله يعافيك",
      },
      {
        text: "الأسرة الواعية تقلل الخطر قبل أن يظهر.",
        author: "إرشاد أسري",
      },
      {
        text: "المعرفة الموثوقة هي أول استثمار في سلامتك وسلامة من تحب.",
        author: "فريق التوعية",
      },
    ],
    quickActions: [
      {
        icon: Brain,
        label: "التقييم",
        sublabel: "صورة واضحة",
        path: "/assessment",
        color: "#8B5CF6",
        bg: "from-[#8B5CF6]/20 to-[#EC4899]/10",
      },
      {
        icon: GraduationCap,
        label: "المحاضرات",
        sublabel: "تعلم موثوق",
        path: "/lectures",
        color: "#0EA5E9",
        bg: "from-[#0EA5E9]/20 to-[#6366F1]/10",
      },
      {
        icon: Shield,
        label: "خطة الوقاية",
        sublabel: "تنفيذ يومي",
        path: "/recovery",
        color: "#F59E0B",
        bg: "from-[#F59E0B]/20 to-[#EF4444]/10",
      },
      {
        icon: FileText,
        label: "الموارد",
        sublabel: "أدوات مساعدة",
        path: "/resources",
        color: "#10B981",
        bg: "from-[#10B981]/20 to-[#14B8A6]/10",
      },
      {
        icon: BarChart3,
        label: "الإحصائيات",
        sublabel: "وعي أوسع",
        path: "/statistics",
        color: "#06B6D4",
        bg: "from-[#06B6D4]/20 to-[#3B82F6]/10",
      },
      {
        icon: Users,
        label: "الشراكات",
        sublabel: "دعم مجتمعي",
        path: "/partners",
        color: "#EC4899",
        bg: "from-[#EC4899]/20 to-[#8B5CF6]/10",
      },
    ],
    contactTitle: "استشارة لك ولأسرتك",
    contactSubtitle:
      "دعم سريع لمساعدتك في القرار المبكر وبناء بيئة أكثر أماناً.",
  },
};

function isAgeGroup(value: unknown): value is AgeGroup {
  return value === "young" || value === "teenage" || value === "adult";
}

function getHomeAudience(ageGroup?: string): HomeAudience {
  if (ageGroup === "young") return "child";
  if (ageGroup === "teenage") return "teen";
  if (ageGroup === "adult") return "adult";
  return "guest";
}

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "صباح النور";
  if (hour < 17) return "مساء الخير";
  return "مساء النور";
}

function getRandomItem<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

function getLectureAudienceGroup(audience: HomeAudience) {
  if (audience === "child") return "children";
  if (audience === "teen") return "teens";
  if (audience === "adult") return "adults";
  return null;
}

function isGender(value: unknown): value is Gender {
  return value === "male" || value === "female";
}

export default function Home() {
  const [greeting, setGreeting] = useState(getGreeting());
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [quote, setQuote] = useState<Quote>(homeConfigs.guest.quotes[0]);
  const [partnersSectionEnabled, setPartnersSectionEnabled] = useState(
    getPartnersSectionEnabled
  );
  const [appreciationContent, setAppreciationContent] =
    useState<AppreciationCardContent>(getAppreciationContent);

  useEffect(() => {
    const loadHomeState = async () => {
      setGreeting(getGreeting());
      setPartnersSectionEnabled(getPartnersSectionEnabled());
      setAppreciationContent(getAppreciationContent());
    };

    loadHomeState();

    const unsubscribe = onAuthStateChanged(auth, async firebaseUser => {
      try {
        if (!firebaseUser) {
          setCurrentUser(null);
          setQuote(getRandomItem(homeConfigs.guest.quotes));
          return;
        }

        const profile = (await getUserProfile(firebaseUser.uid)) as CurrentUser | null;
        setCurrentUser(profile);

        const audience = getHomeAudience(profile?.ageGroup);
        const quotePool = [
          ...homeConfigs[audience].quotes,
          ...(isGender(profile?.gender) ? genderQuotes[profile.gender] : []),
        ];
        setQuote(getRandomItem(quotePool));
      } catch {
        setCurrentUser(null);
        setQuote(getRandomItem(homeConfigs.guest.quotes));
      }
    });

    window.addEventListener("focus", loadHomeState);

    return () => {
      unsubscribe();
      window.removeEventListener("focus", loadHomeState);
    };
  }, []);

  useEffect(() => {
    if (!firestoreDb) return;

    const settingsRef = doc(
      firestoreDb,
      FIRESTORE_SETTINGS_COLLECTION,
      FIRESTORE_SETTINGS_DOC
    );

    const unsubscribe = onSnapshot(
      settingsRef,
      snapshot => {
        const partnersEnabled = snapshot.exists()
          ? extractPartnersEnabledFromSettings(snapshot.data())
          : false;
        const nextAppreciation = snapshot.exists()
          ? extractAppreciationFromSettings(snapshot.data())
          : DEFAULT_APPRECIATION_CONTENT;

        setPartnersSectionEnabled(partnersEnabled);
        setAppreciationContent(nextAppreciation);
        syncHomeSettingsToLocalStorage(partnersEnabled, nextAppreciation);
      },
      error => {
        console.warn(
          "Failed to subscribe to platform settings from Firestore.",
          error
        );
      }
    );

    return unsubscribe;
  }, []);

  const userAgeGroup = isAgeGroup(currentUser?.ageGroup)
    ? currentUser.ageGroup
    : null;
  const audience = getHomeAudience(userAgeGroup ?? undefined);
  const config = homeConfigs[audience];
  const ageMeta = userAgeGroup ? ageGroupLabels[userAgeGroup] : null;
  const userGender = isGender(currentUser?.gender) ? currentUser.gender : null;
  const genderMeta = userGender ? genderConfig[userGender] : null;
  const riskScore = currentUser?.testResult?.total ?? null;

  const lectureAudienceGroup = getLectureAudienceGroup(audience);
  const recommendedLectures = (
    lectureAudienceGroup
      ? lecturesData.filter(
          lecture => lecture.ageGroup === lectureAudienceGroup
        )
      : lecturesData.filter(lecture => lecture.featured)
  ).slice(0, 2);

  const visibleLectures =
    recommendedLectures.length > 0
      ? recommendedLectures
      : lecturesData.slice(0, 2);
  const isChild = audience === "child";
  const isTeen = audience === "teen";
  const isAdult = audience === "adult";
  const baseQuickActions = isChild
    ? config.quickActions.slice(0, 4)
    : isAdult
      ? config.quickActions.slice(0, 4)
      : config.quickActions;
  const visibleQuickActions = partnersSectionEnabled
    ? baseQuickActions
    : baseQuickActions.filter(action => action.path !== "/partners");
  const visibleSpotlightCards = isChild
    ? config.spotlightCards.slice(0, 3)
    : isAdult
      ? config.spotlightCards.slice(0, 2)
      : config.spotlightCards;
  const visibleLectureCards = isChild
    ? visibleLectures.slice(0, 1)
    : visibleLectures;
  const visibleSupportCircles = isChild
    ? supportCircles.slice(0, 3)
    : isAdult
      ? supportCircles.slice(0, 4)
      : supportCircles;

  const displayName = currentUser?.name
    ? `${greeting} يا ${currentUser.name}`
    : greeting;
  const HeroIcon = config.icon;

  return (
    <div className="app-container bg-gradient-navy overflow-hidden">
      <div
        className="orb w-80 h-80 opacity-10 -top-20 -right-20"
        style={{ background: config.accent }}
      />
      <div
        className="orb w-60 h-60 opacity-6 top-40 -left-20"
        style={{ background: genderMeta?.color ?? ageMeta?.color ?? "#8B5CF6" }}
      />

      <div className="mobile-header px-5 py-4">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="text-muted-foreground text-xs">{displayName}</p>
            <div className="flex items-center gap-2 mt-0.5 flex-wrap">
              <h1 className="text-foreground font-black text-lg">
                الله يعافيك
              </h1>
              {ageMeta && (
                <span
                  className={`px-2.5 py-1 rounded-full text-[10px] font-black bg-gradient-to-r ${ageMeta.gradient}`}
                >
                  {ageMeta.emoji} {ageMeta.label}
                </span>
              )}
              {genderMeta && (
                <span
                  className="px-2.5 py-1 rounded-full text-[10px] font-black"
                  style={{
                    background: `${genderMeta.color}22`,
                    color: genderMeta.color,
                  }}
                >
                  {genderMeta.emoji} {genderMeta.label}
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Link href="/settings">
              <div className="p-2 rounded-xl glass-card border border-border">
                <Settings className="w-4 h-4 text-muted-foreground" />
              </div>
            </Link>
            <Link href="/notifications">
              <div className="relative p-2 rounded-xl glass-card border border-border">
                <Bell className="w-4 h-4 text-muted-foreground" />
                <div className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-destructive" />
              </div>
            </Link>
            <a
              href={`tel:${CONTACT_PHONE}`}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-primary/15 border border-primary/25"
            >
              <Phone className="w-3.5 h-3.5 text-primary" />
              <span className="text-primary text-xs font-black">تواصل</span>
            </a>
          </div>
        </div>
      </div>

      <div className="page-content overflow-y-auto">
        <div className="px-4 mt-2">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-3xl p-5 relative overflow-hidden"
            style={{
              background: config.gradient,
              border: `1px solid ${config.borderColor}`,
            }}
          >
            <div
              className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-20"
              style={{
                background: `radial-gradient(circle, ${config.radialColor}, transparent)`,
              }}
            />

            <div className="flex items-start gap-3 mb-4">
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
                style={{
                  background: `linear-gradient(135deg, ${config.accent}, ${genderMeta?.color ?? ageMeta?.color ?? "#0EA5E9"})`,
                }}
              >
                <HeroIcon className="w-6 h-6 text-background" />
              </div>
              <div>
                <div
                  className="font-black text-xs uppercase tracking-wider mb-1"
                  style={{ color: config.accent }}
                >
                  {config.eyebrow}
                </div>
                <h2 className="text-foreground font-black text-xl leading-tight">
                  {config.title}
                </h2>
              </div>
            </div>

            <p className="text-muted-foreground text-xs leading-relaxed mb-4">
              {config.subtitle}
            </p>

            {riskScore !== null ? (
              <div className="flex items-center gap-2 p-3 rounded-2xl bg-secondary/40 border border-border mb-3">
                <Award className="w-4 h-4" style={{ color: config.accent }} />
                <div className="flex-1 min-w-0">
                  <div className="text-muted-foreground text-xs">
                    مستوى الوعي الوقائي
                  </div>
                  <div className="text-foreground font-bold text-sm">
                    {riskScore >= 70
                      ? "ممتاز — استمر"
                      : riskScore >= 50
                        ? "متوسط — طوّر مهاراتك"
                        : "يحتاج تحسين — تابع الخطة"}
                  </div>
                </div>
                <Link href="/assessment">
                  <div className="p-1.5 rounded-xl bg-primary/15">
                    <ChevronLeft className="w-4 h-4 text-primary" />
                  </div>
                </Link>
              </div>
            ) : (
              <Link href="/assessment">
                <motion.button
                  whileTap={{ scale: 0.96 }}
                  className="w-full py-3 rounded-2xl font-black text-background text-sm mb-3"
                  style={{
                    background: `linear-gradient(135deg, ${config.accent}, ${ageMeta?.color ?? "#0EA5E9"})`,
                  }}
                >
                  {audience === "guest"
                    ? "ابدأ تقييم مستوى الخطر مجاناً"
                    : "حدّث تقييمك الوقائي"}
                </motion.button>
              </Link>
            )}
          </motion.div>
        </div>

        {genderMeta && audience !== "guest" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.13 }}
            className="mx-4 mt-4 p-4 rounded-2xl border"
            style={{
              borderColor: `${genderMeta.color}35`,
              background: `linear-gradient(135deg, ${genderMeta.color}16, rgba(15,23,42,0.05))`,
            }}
          >
            <div className="text-foreground font-black text-sm mb-2">
              تركيز مناسب لك
            </div>
            <div className="space-y-1.5">
              {(userGender === "female"
                ? [
                    "تعزيز الحدود الشخصية والقدرة على الرفض بثقة",
                    "إدارة الضغوط العاطفية عبر خطوات حماية واضحة",
                  ]
                : [
                    "تقوية ضبط النفس أمام ضغط الأصدقاء والاندفاع",
                    "بناء روتين يومي يقلل فرص السلوكيات الخطرة",
                  ]
              ).map(item => (
                <div key={item} className="flex items-center gap-2">
                  <div
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ background: genderMeta.color }}
                  />
                  <span className="text-foreground/80 text-xs leading-relaxed">
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {isAdult && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.14 }}
            className="mx-4 mt-4 p-4 rounded-2xl border"
            style={{
              borderColor: "rgba(139,92,246,0.28)",
              background:
                "linear-gradient(135deg, rgba(139,92,246,0.14), rgba(99,102,241,0.07))",
            }}
          >
            <div className="flex items-center gap-2 mb-2.5">
              <Shield className="w-4 h-4 text-[#8B5CF6]" />
              <h3 className="text-foreground font-black text-sm">
                خطة هادئة لهذا الأسبوع
              </h3>
            </div>
            <p className="text-foreground/70 text-xs mb-3">
              خطوات قصيرة ومنظمة تساعدك على حماية نفسك وأسرتك بدون ضغط.
            </p>
            <div className="grid grid-cols-1 gap-2.5">
              {[
                { label: "تحديث التقييم الشخصي", path: "/assessment" },
                { label: "مراجعة خطة الوقاية", path: "/recovery" },
                { label: "اختيار مورد عملي للأسرة", path: "/resources" },
              ].map(item => (
                <Link key={item.label} href={item.path}>
                  <div className="flex items-center justify-between rounded-xl bg-background/45 p-3 border border-border active:scale-[0.99] transition-transform">
                    <span className="text-foreground/85 text-xs font-semibold">
                      {item.label}
                    </span>
                    <ChevronLeft className="w-3.5 h-3.5 text-[#8B5CF6]" />
                  </div>
                </Link>
              ))}
            </div>
          </motion.div>
        )}

        {!isTeen && !isAdult && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15 }}
            className="mx-4 mt-4 p-4 rounded-2xl glass-card border border-border"
          >
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-accent/15 flex items-center justify-center flex-shrink-0">
                <Star className="w-4 h-4 text-accent" />
              </div>
              <div>
                <p className="text-foreground text-sm leading-relaxed italic">
                  "{quote.text}"
                </p>
                <p className="text-primary text-xs mt-1.5 font-bold">
                  — {quote.author}
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {false && isTeen && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.18 }}
            className="mx-4 mt-4 p-4 rounded-2xl border"
            style={{
              borderColor: "rgba(245,158,11,0.3)",
              background:
                "linear-gradient(135deg, rgba(245,158,11,0.16), rgba(239,68,68,0.08))",
            }}
          >
            <div className="flex items-center gap-2 mb-2.5">
              <Sparkles className="w-4 h-4 text-[#F59E0B]" />
              <h3 className="text-foreground font-black text-sm">
                تحدي هذا الأسبوع
              </h3>
            </div>
            <p className="text-foreground/70 text-xs mb-3">
              جرّب تنفيذ 3 خطوات بسيطة تقوّي قرارك وثقتك بنفسك.
            </p>
            <div className="space-y-2">
              {[
                "شاهد محاضرة واحدة عن مهارات الرفض",
                "اكتب جملة رفض واضحة تستخدمها عند الضغط",
                "شارك إنجازاً صغيراً في نهاية اليوم",
              ].map(item => (
                <div
                  key={item}
                  className="flex items-center gap-2 rounded-xl bg-background/40 p-2.5 border border-border"
                >
                  <div className="w-2 h-2 rounded-full bg-[#F59E0B] shrink-0" />
                  <span className="text-foreground/80 text-xs leading-relaxed">
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {false && isAdult && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.18 }}
            className="mx-4 mt-4 p-4 rounded-2xl border"
            style={{
              borderColor: "rgba(139,92,246,0.28)",
              background:
                "linear-gradient(135deg, rgba(139,92,246,0.14), rgba(99,102,241,0.07))",
            }}
          >
            <div className="flex items-center gap-2 mb-2.5">
              <Shield className="w-4 h-4 text-[#8B5CF6]" />
              <h3 className="text-foreground font-black text-sm">
                خطة هادئة لهذا الأسبوع
              </h3>
            </div>
            <p className="text-foreground/70 text-xs mb-3">
              خطوات قصيرة ومنظمة تساعدك على حماية نفسك وأسرتك بدون ضغط.
            </p>
            <div className="grid grid-cols-1 gap-2.5">
              {[
                { label: "تحديث التقييم الشخصي", path: "/assessment" },
                { label: "مراجعة خطة الوقاية", path: "/recovery" },
                { label: "اختيار مورد عملي للأسرة", path: "/resources" },
              ].map(item => (
                <Link key={item.label} href={item.path}>
                  <div className="flex items-center justify-between rounded-xl bg-background/45 p-3 border border-border active:scale-[0.99] transition-transform">
                    <span className="text-foreground/85 text-xs font-semibold">
                      {item.label}
                    </span>
                    <ChevronLeft className="w-3.5 h-3.5 text-[#8B5CF6]" />
                  </div>
                </Link>
              ))}
            </div>
          </motion.div>
        )}

        <div className="px-4 mt-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-foreground font-black text-sm">
              الوصول السريع
            </h2>
            {audience !== "guest" && (
              <Link href="/dashboard">
                <span className="text-primary text-xs font-bold">لوحتي</span>
              </Link>
            )}
          </div>
          <div
            className={
              isChild || isAdult
                ? "grid grid-cols-2 gap-3.5"
                : "grid grid-cols-3 gap-3"
            }
          >
            {visibleQuickActions.map((action, idx) => (
              <motion.div
                key={action.path}
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.04 * idx }}
              >
                <Link href={action.path}>
                  <motion.div
                    whileTap={{ scale: 0.92 }}
                    className={`rounded-2xl border border-border bg-gradient-to-br ${action.bg} flex flex-col gap-2 card-hover justify-center ${isChild ? "p-4 min-h-[128px] items-center" : isAdult ? "p-4 min-h-[118px] items-start" : "p-3.5 min-h-[110px] items-center"}`}
                  >
                    <div
                      className={`${isAdult ? "w-11 h-11" : "w-10 h-10"} rounded-xl flex items-center justify-center`}
                      style={{ background: `${action.color}20` }}
                    >
                      <action.icon
                        className="w-5 h-5"
                        style={{ color: action.color }}
                      />
                    </div>
                    <div
                      className={isAdult ? "text-right w-full" : "text-center"}
                    >
                      <div className="text-foreground font-black text-xs">
                        {action.label}
                      </div>
                      <div className="text-muted-foreground/70 text-[10px] leading-tight mt-0.5">
                        {action.sublabel}
                      </div>
                    </div>
                  </motion.div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>

        {isTeen && (
          <>
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.18 }}
              className="mx-4 mt-4 p-4 rounded-2xl border"
              style={{
                borderColor: "rgba(245,158,11,0.3)",
                background:
                  "linear-gradient(135deg, rgba(245,158,11,0.16), rgba(239,68,68,0.08))",
              }}
            >
              <div className="flex items-center gap-2 mb-2.5">
                <Sparkles className="w-4 h-4 text-[#F59E0B]" />
                <h3 className="text-foreground font-black text-sm">
                  تحدي هذا الأسبوع
                </h3>
              </div>
              <p className="text-foreground/70 text-xs mb-3">
                جرّب تنفيذ 3 خطوات بسيطة تقوّي قرارك وثقتك بنفسك.
              </p>
              <div className="space-y-2">
                {[
                  "شاهد محاضرة واحدة عن مهارات الرفض",
                  "اكتب جملة رفض واضحة تستخدمها عند الضغط",
                  "شارك إنجازاً صغيراً في نهاية اليوم",
                ].map(item => (
                  <div
                    key={item}
                    className="flex items-center gap-2 rounded-xl bg-background/40 p-2.5 border border-border"
                  >
                    <div className="w-2 h-2 rounded-full bg-[#F59E0B] shrink-0" />
                    <span className="text-foreground/80 text-xs leading-relaxed">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.21 }}
              className="mx-4 mt-4 p-4 rounded-2xl glass-card border border-border"
            >
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-accent/15 flex items-center justify-center flex-shrink-0">
                  <Star className="w-4 h-4 text-accent" />
                </div>
                <div>
                  <p className="text-foreground text-sm leading-relaxed italic">
                    "{quote.text}"
                  </p>
                  <p className="text-primary text-xs mt-1.5 font-bold">
                    — {quote.author}
                  </p>
                </div>
              </div>
            </motion.div>
          </>
        )}

        <div className="px-4 mt-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-foreground font-black text-sm">
              {config.spotlightTitle}
            </h2>
            <Link href="/resources">
              <span className="text-primary text-xs font-bold">تفاصيل</span>
            </Link>
          </div>
          <div
            className={
              isChild ? "grid grid-cols-1 gap-3.5" : "grid grid-cols-2 gap-3"
            }
          >
            {visibleSpotlightCards.map((card, idx) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.08 + idx * 0.05 }}
                className={`rounded-2xl glass-card border border-border ${isAdult ? "p-5" : "p-4"}`}
              >
                <div className="text-2xl mb-2">{card.icon}</div>
                <div
                  className={`text-foreground font-black mb-1 ${isAdult ? "text-sm" : "text-xs"}`}
                >
                  {card.title}
                </div>
                <div
                  className={`text-muted-foreground leading-relaxed ${isAdult ? "text-xs" : "text-[10px]"}`}
                >
                  {card.desc}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="mx-4 mt-5"
        >
          <div
            className="rounded-3xl overflow-hidden border border-border"
            style={{
              background:
                audience === "child"
                  ? "linear-gradient(135deg, rgba(20,184,166,0.12), rgba(56,189,248,0.06))"
                  : audience === "teen"
                    ? "linear-gradient(135deg, rgba(245,158,11,0.12), rgba(239,68,68,0.06))"
                    : "linear-gradient(135deg, rgba(139,92,246,0.12), rgba(59,130,246,0.06))",
            }}
          >
            <div className="p-5">
              <div className="flex items-center gap-2 mb-2">
                <div
                  className="w-6 h-6 rounded-lg flex items-center justify-center"
                  style={{ background: `${config.accent}20` }}
                >
                  <BookOpen
                    className="w-3.5 h-3.5"
                    style={{ color: config.accent }}
                  />
                </div>
                <span
                  className="font-black text-xs uppercase tracking-wider"
                  style={{ color: config.accent }}
                >
                  {config.lectureTitle}
                </span>
              </div>
              <p className="text-foreground/55 text-xs leading-relaxed mb-4">
                {config.lectureDescription}
              </p>
              <div className="space-y-2.5 mb-4">
                {visibleLectureCards.map(lecture => (
                  <Link key={lecture.id} href={`/lectures/${lecture.id}`}>
                    <div className="glass-card border border-border rounded-2xl p-3 active:scale-[0.99] transition-transform">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <span
                              className="px-2 py-0.5 rounded-full text-[10px] font-black"
                              style={{
                                background: `${lecture.color}20`,
                                color: lecture.color,
                              }}
                            >
                              {lecture.ageLabel}
                            </span>
                            <span className="text-muted-foreground text-[10px]">
                              {lecture.duration}
                            </span>
                          </div>
                          <h3 className="text-foreground font-black text-sm leading-snug line-clamp-2">
                            {lecture.title}
                          </h3>
                          <p className="text-muted-foreground text-[11px] mt-1 line-clamp-2">
                            {lecture.subtitle}
                          </p>
                          <div className="flex items-center gap-2 mt-2 text-[10px] text-muted-foreground">
                            <span>{lecture.speaker}</span>
                            <span>•</span>
                            <span>{lecture.rating.toFixed(1)}★</span>
                          </div>
                        </div>
                        <ChevronLeft className="w-4 h-4 text-primary shrink-0 mt-1" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
              <div className="flex gap-2">
                <Link href="/lectures" className="flex-1">
                  <motion.button
                    whileTap={{ scale: 0.96 }}
                    className="w-full py-3 rounded-2xl font-black text-background text-sm"
                    style={{
                      background: `linear-gradient(135deg, ${config.accent}, ${ageMeta?.color ?? "#3B82F6"})`,
                    }}
                  >
                    {config.primaryCtaLabel}
                  </motion.button>
                </Link>
                <Link href={config.secondaryCtaPath}>
                  <motion.button
                    whileTap={{ scale: 0.96 }}
                    className="px-4 py-3 rounded-2xl font-black text-muted-foreground text-sm glass-card border border-border"
                  >
                    {config.secondaryCtaLabel}
                  </motion.button>
                </Link>
              </div>
            </div>
          </div>
        </motion.div>

        {partnersSectionEnabled && (
          <div className="px-4 mt-5">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-foreground font-black text-sm">
                {config.supportTitle}
              </h2>
              <Link href="/partners">
                <span className="text-primary text-xs font-bold">عرض الكل</span>
              </Link>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-1">
              {visibleSupportCircles.map((partner, idx) => (
                <motion.div
                  key={partner.label}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className={`flex-shrink-0 flex flex-col items-center gap-1.5 rounded-2xl glass-card border border-border ${isChild ? "p-3.5 w-24" : isAdult ? "p-3.5 w-24" : "p-3 w-20"}`}
                >
                  <span className="text-2xl">{partner.icon}</span>
                  <span className="text-foreground/70 font-bold text-[10px] text-center">
                    {partner.label}
                  </span>
                  {!isChild && !isAdult && (
                    <span
                      className="text-xs font-bold"
                      style={{ color: partner.color }}
                    >
                      {partner.desc}
                    </span>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        )}

        <div className="px-4 mt-5">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="p-4 rounded-2xl border"
            style={{
              borderColor: `${config.accent}30`,
              background: `linear-gradient(135deg, ${config.accent}14, rgba(249,115,22,0.04))`,
            }}
          >
            <div className="flex items-center gap-2 mb-3">
              <Lightbulb className="w-4 h-4" style={{ color: config.accent }} />
              <span
                className="font-black text-xs"
                style={{ color: config.accent }}
              >
                {config.noteLabel}
              </span>
            </div>
            <p className="text-foreground/75 text-sm leading-relaxed">
              {config.noteText}
            </p>
            <Link href={config.noteLinkPath}>
              <div className="flex items-center gap-1 mt-2">
                <span className="text-primary text-xs font-bold">
                  {config.noteLinkLabel}
                </span>
                <ChevronLeft className="w-3 h-3 text-primary" />
              </div>
            </Link>
          </motion.div>
        </div>

        {appreciationContent.enabled && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.34 }}
            className="mx-4 mt-4"
          >
            <div className="p-4 rounded-2xl glass-card border border-border">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 rounded-lg bg-primary/15 flex items-center justify-center">
                  <Heart className="w-4 h-4 text-primary" />
                </div>
                <h3 className="text-foreground font-black text-sm">
                  {appreciationContent.title}
                </h3>
              </div>
              <div className="space-y-1 text-foreground/80 text-sm leading-relaxed">
                {appreciationContent.lines
                  .map(line => line.trim())
                  .filter(Boolean)
                  .map(line => (
                    <p key={line}>{line}</p>
                  ))}
              </div>
            </div>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35 }}
          className="mx-4 mt-4 mb-4"
        >
          <a
            href={`tel:${CONTACT_PHONE}`}
            className="flex items-center gap-4 p-4 rounded-2xl border border-primary/25 active:scale-98 transition-transform"
            style={{
              background: `linear-gradient(135deg, ${config.accent}12, rgba(14,165,233,0.05))`,
            }}
          >
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 pulse-teal"
              style={{ background: `${config.accent}20` }}
            >
              <Phone className="w-5 h-5" style={{ color: config.accent }} />
            </div>
            <div className="flex-1">
              <div className="text-foreground font-black text-sm">
                {config.contactTitle}
              </div>
              <div className="text-primary font-black text-base font-numbers">
                {CONTACT_PHONE}
              </div>
              <div className="text-foreground/40 text-xs">
                {config.contactSubtitle}
              </div>
            </div>
            <ChevronLeft className="w-5 h-5 text-primary" />
          </a>
        </motion.div>
      </div>
    </div>
  );
}
