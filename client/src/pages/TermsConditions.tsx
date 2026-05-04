/**
 * TermsConditions — الشروط والأحكام
 * Public route — required for Google Play Store listing
 */
import { useLocation } from "wouter";
import { ArrowRight, FileText, UserCheck, AlertTriangle, Ban, RefreshCw, Scale } from "lucide-react";
import { motion } from "framer-motion";

const sections = [
  {
    icon: UserCheck,
    title: "القبول بالشروط",
    content: [
      "باستخدامك لتطبيق «الله يعافيك» فأنت توافق على الالتزام بهذه الشروط والأحكام.",
      "إذا كنت لا توافق على هذه الشروط، يرجى عدم استخدام التطبيق.",
      "يُتاح التطبيق لمن هم بعمر 13 عاماً فأكثر. من هم دون 18 عاماً يحتاجون لإذن وليّ أمرهم.",
      "نحتفظ بالحق في تعديل هذه الشروط في أي وقت مع إشعار المستخدمين.",
    ],
  },
  {
    icon: FileText,
    title: "طبيعة الخدمة",
    content: [
      "التطبيق أداة دعم وتوعية فقط وليس بديلاً عن الرعاية الطبية أو النفسية المتخصصة.",
      "المحتوى التعليمي والتوجيهي المقدَّم للأغراض التثقيفية العامة.",
      "ننصح دائماً بالتواصل مع متخصصين معتمدين في حالات الإدمان الحادة.",
      "التطبيق مجاني للاستخدام الشخصي غير التجاري.",
    ],
  },
  {
    icon: UserCheck,
    title: "حساب المستخدم",
    content: [
      "أنت مسؤول عن سرية بيانات حسابك وكلمة المرور.",
      "أنت مسؤول عن جميع الأنشطة التي تتم عبر حسابك.",
      "يجب إبلاغنا فوراً عند أي استخدام غير مصرَّح به لحسابك.",
      "يُحظر إنشاء أكثر من حساب شخصي واحد لنفس الشخص.",
    ],
  },
  {
    icon: Ban,
    title: "الاستخدام المحظور",
    content: [
      "يُحظر نشر أي محتوى مسيء أو مضلِّل أو غير قانوني.",
      "يُحظر انتحال شخصية أشخاص آخرين أو جهات رسمية.",
      "يُحظر محاولة اختراق أو تعطيل خوادم التطبيق.",
      "يُحظر استخدام التطبيق لأغراض تجارية بدون إذن كتابي.",
      "يُحظر نشر محتوى يروّج للمواد المخدرة أو يشجع على الإدمان.",
    ],
  },
  {
    icon: AlertTriangle,
    title: "إخلاء المسؤولية",
    content: [
      "التطبيق لا يضمن نتائج محددة في رحلة التعافي.",
      "لسنا مسؤولين عن أي قرارات تتخذها بناءً على محتوى التطبيق.",
      "في حالات الطوارئ النفسية يرجى التواصل مع الجهات المختصة فوراً.",
      "خدمة الطوارئ السعودية: 911 | خط الصحة النفسية: 920033360",
    ],
  },
  {
    icon: RefreshCw,
    title: "إنهاء الخدمة",
    content: [
      "يمكنك حذف حسابك في أي وقت من إعدادات التطبيق.",
      "نحتفظ بالحق في إيقاف أي حساب يخالف هذه الشروط.",
      "عند إنهاء الحساب تُحذف جميع بياناتك الشخصية خلال 30 يوماً.",
    ],
  },
  {
    icon: Scale,
    title: "الحقوق القانونية",
    content: [
      "تخضع هذه الشروط لأنظمة المملكة العربية السعودية.",
      "جميع حقوق الملكية الفكرية للتطبيق محفوظة لفريق «الله يعافيك».",
      "يُحظر نسخ أو إعادة توزيع محتوى التطبيق بدون إذن.",
      "للتواصل القانوني: legal@allah-yaafek.app",
    ],
  },
];

export default function TermsConditions() {
  return (
    <div className="min-h-screen bg-background" dir="rtl">
      {/* Header */}
      <div
        className="sticky top-0 z-10 border-b border-border/40 backdrop-blur-xl"
        style={{ background: "oklch(0.1 0.04 255 / 0.9)" }}
      >
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-3">
          <button
            onClick={() => window.history.back()}
            className="text-muted-foreground hover:text-foreground transition-colors p-1"
          >
            <ArrowRight className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-foreground font-black text-lg leading-tight">الشروط والأحكام</h1>
            <p className="text-muted-foreground text-xs">Terms &amp; Conditions</p>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
        {/* Intro */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
          className="glass-card p-6 border border-border"
        >
          <div className="flex items-center gap-3 mb-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: "oklch(0.82 0.18 80 / 0.15)" }}
            >
              <FileText className="w-5 h-5" style={{ color: "oklch(0.82 0.18 80)" }} />
            </div>
            <h2 className="text-foreground font-black text-lg">اتفاقية الاستخدام</h2>
          </div>
          <p className="text-muted-foreground text-sm leading-relaxed">
            مرحباً بك في تطبيق <strong className="text-foreground">الله يعافيك</strong>. يرجى قراءة هذه الشروط والأحكام بعناية قبل استخدام التطبيق، إذ تُشكّل اتفاقية قانونية بينك وبين الفريق المطوِّر.
          </p>
          <p className="text-muted-foreground/60 text-xs mt-3">
            آخر تحديث: مايو 2026
          </p>
        </motion.div>

        {/* Sections */}
        {sections.map((section, i) => (
          <motion.div
            key={section.title}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", bounce: 0.2, duration: 0.4, delay: i * 0.05 }}
            className="glass-card p-6 border border-border"
          >
            <div className="flex items-center gap-3 mb-4">
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                style={{ background: "oklch(0.82 0.18 80 / 0.1)" }}
              >
                <section.icon className="w-4 h-4" style={{ color: "oklch(0.82 0.18 80)" }} />
              </div>
              <h3 className="text-foreground font-bold text-base">{section.title}</h3>
            </div>
            <ul className="space-y-2">
              {section.content.map((item, j) => (
                <li key={j} className="flex items-start gap-2 text-muted-foreground text-sm leading-relaxed">
                  <span
                    className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0"
                    style={{ background: "oklch(0.82 0.18 80)" }}
                  />
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>
        ))}

        {/* Footer note */}
        <p className="text-center text-muted-foreground/50 text-xs pb-8">
          باستخدامك للتطبيق فأنت توافق على هذه الشروط والأحكام.
        </p>
      </div>
    </div>
  );
}
