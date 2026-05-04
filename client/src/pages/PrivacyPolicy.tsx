/**
 * PrivacyPolicy — سياسة الخصوصية
 * Public route — required for Google Play Store listing
 */
import { ArrowRight, Shield, Lock, Eye, Database, Bell, Mail, Clock, Trash2 } from "lucide-react";
import { motion } from "framer-motion";

const sections = [
  {
    icon: Database,
    title: "البيانات التي نجمعها",
    content: [
      "الاسم والبريد الإلكتروني عند التسجيل.",
      "العمر والجنس ونوع الإدمان المُعلَن (اختياري).",
      "بيانات التقدم في برنامج التعافي المُدخَلة يدوياً.",
      "إحصائيات استخدام التطبيق (عدد أيام الصحو، المحاضرات المكتملة).",
      "لا نجمع بيانات الموقع الجغرافي الدقيق أو جهات الاتصال أو الرسائل الخاصة.",
    ],
  },
  {
    icon: Eye,
    title: "كيف نستخدم بياناتك",
    content: [
      "تقديم خدمات التطبيق وتخصيص تجربة التعافي.",
      "تتبع تقدمك وإرسال تذكيرات تحفيزية.",
      "تحسين خوارزميات التوصية بالمحتوى.",
      "لا نبيع بياناتك لأي طرف ثالث تحت أي ظرف.",
      "لا نستخدم بياناتك لأغراض إعلانية مع جهات خارجية.",
    ],
  },
  {
    icon: Database,
    title: "مشاركة البيانات ومعالجو الخدمة",
    content: [
      "نستخدم Firebase من Google لتقديم المصادقة وتخزين بيانات الحساب.",
      "قد تتم معالجة البيانات عبر مزودي البنية التحتية المرتبطين بـ Google Cloud.",
      "لا نبيع بياناتك ولا نؤجرها لأي طرف ثالث.",
      "أي مشاركة تكون فقط لتشغيل الخدمة أو للالتزام القانوني عند الطلب الرسمي.",
    ],
  },
  {
    icon: Clock,
    title: "مدة الاحتفاظ بالبيانات",
    content: [
      "نحتفظ ببيانات الحساب ما دام الحساب نشطاً.",
      "عند طلب حذف الحساب، نبدأ إجراءات الحذف فوراً، ويكتمل حذف البيانات التشغيلية خلال مدة لا تتجاوز 30 يوماً.",
      "قد تبقى نسخ احتياطية أو سجلات أمنية لمدة تصل إلى 90 يوماً ثم تُزال تلقائياً.",
      "بعد انتهاء فترات الاحتفاظ، لا نحتفظ ببيانات تعريفية شخصية مرتبطة بالحساب المحذوف.",
    ],
  },
  {
    icon: Trash2,
    title: "حذف البيانات وكيفية الطلب",
    content: [
      "يمكنك حذف حسابك من داخل التطبيق عبر: الإعدادات ← البيانات ← حذف الحساب.",
      "تشمل عملية الحذف بيانات الجلسة المحلية وبيانات الحساب المخزنة في Firebase Auth وFirestore حسب الإمكانات التقنية المتاحة.",
      "إذا تعذر الحذف الفوري (مثل طلب إعادة توثيق)، يمكنك مراسلتنا على privacy@allah-yaafek.app لاستكمال الطلب.",
      "نلتزم بإكمال طلبات حذف البيانات خلال مدة لا تتجاوز 30 يوماً من تاريخ الطلب.",
    ],
  },
  {
    icon: Lock,
    title: "حماية بياناتك",
    content: [
      "جميع البيانات مشفَّرة أثناء النقل عبر بروتوكول HTTPS.",
      "كلمات المرور مشفَّرة ولا يمكن لأحد الاطلاع عليها.",
      "نطبق مبدأ أقل صلاحية ممكنة للوصول إلى البيانات.",
      "نراجع إعدادات الأمان بشكل دوري لتحسين الحماية.",
    ],
  },
  {
    icon: Bell,
    title: "الإشعارات",
    content: [
      "نرسل إشعارات تحفيزية وتذكيرات يومية إذا منحتنا الإذن.",
      "يمكنك إيقاف الإشعارات في أي وقت من إعدادات جهازك أو التطبيق.",
      "لا نرسل إشعارات تجارية أو إعلانية.",
    ],
  },
  {
    icon: Shield,
    title: "حقوقك",
    content: [
      "الحق في الاطلاع على بياناتك الشخصية المخزَّنة.",
      "الحق في تصحيح أي معلومات غير دقيقة.",
      "الحق في حذف حسابك وجميع بياناتك نهائياً.",
      "الحق في سحب موافقتك على استخدام بياناتك في أي وقت.",
      "للتواصل بشأن بياناتك: privacy@allah-yaafek.app",
    ],
  },
  {
    icon: Mail,
    title: "التواصل معنا",
    content: [
      "إذا كان لديك أي استفسار حول سياسة الخصوصية يمكنك التواصل عبر:",
      "البريد الإلكتروني: privacy@allah-yaafek.app",
      "سنرد على استفساراتك خلال 7 أيام عمل.",
    ],
  },
];

export default function PrivacyPolicy() {
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
            <h1 className="text-foreground font-black text-lg leading-tight">سياسة الخصوصية</h1>
            <p className="text-muted-foreground text-xs">Privacy Policy</p>
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
              style={{ background: "oklch(0.75 0.18 175 / 0.15)" }}
            >
              <Shield className="w-5 h-5" style={{ color: "oklch(0.75 0.18 175)" }} />
            </div>
            <h2 className="text-foreground font-black text-lg">خصوصيتك أمانة</h2>
          </div>
          <p className="text-muted-foreground text-sm leading-relaxed">
            نحن في <strong className="text-foreground">الله يعافيك</strong> نُدرك حساسية المعلومات المتعلقة بمسيرة التعافي، ونلتزم بحماية خصوصيتك بأعلى المعايير. هذه السياسة توضح ما نجمعه وكيف نستخدمه وكيف نحميه.
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
                style={{ background: "oklch(0.75 0.18 175 / 0.1)" }}
              >
                <section.icon className="w-4 h-4" style={{ color: "oklch(0.75 0.18 175)" }} />
              </div>
              <h3 className="text-foreground font-bold text-base">{section.title}</h3>
            </div>
            <ul className="space-y-2">
              {section.content.map((item, j) => (
                <li key={j} className="flex items-start gap-2 text-muted-foreground text-sm leading-relaxed">
                  <span
                    className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0"
                    style={{ background: "oklch(0.75 0.18 175)" }}
                  />
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>
        ))}

        {/* Footer note */}
        <p className="text-center text-muted-foreground/50 text-xs pb-8">
          باستخدامك للتطبيق فأنت توافق على هذه السياسة.
        </p>
      </div>
    </div>
  );
}
