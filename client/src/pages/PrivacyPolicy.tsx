/**
 * PrivacyPolicy - صفحة سياسة الخصوصية (عامة)
 * Design: Dark Luxury Wellness - "صون"
 */
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export default function PrivacyPolicy() {
  const [, navigate] = useLocation();

  const sections: { title: string; text: string }[] = [
    {
      title: "ما البيانات التي نخزنها؟",
      text: "بيانات الحساب (الاسم، البريد، العمر، الجنس)، نتائج التقييم، تقدّمك في الخطط الوقائية والإنجازات، وإعداداتك الشخصية داخل التطبيق.",
    },
    {
      title: "كيف نستخدم البيانات؟",
      text: "نستخدم البيانات داخل التطبيق فقط: تخصيص المحتوى، حفظ تقدّمك، وتقديم توصيات مناسبة لفئتك العمرية واحتياجاتك.",
    },
    {
      title: "أين تُحفظ البيانات؟",
      text: "تُحفظ بياناتك بشكل أساسي على جهازك (Local Storage)، ويتم مزامنة بعض الإعدادات والمحتوى مع Firestore عبر حسابك الموثّق فقط.",
    },
    {
      title: "مشاركة البيانات",
      text: "لا نشارك بياناتك الشخصية مع أي طرف ثالث ضمن النسخة الحالية من التطبيق. لا تُستخدم بياناتك لأي إعلانات.",
    },
    {
      title: "حقوق المستخدم",
      text: "يمكنك تصدير بياناتك أو حذف بيانات التتبع أو حذف الحساب نهائياً في أي وقت من صفحة الإعدادات.",
    },
    {
      title: "أمان البيانات",
      text: "نعتمد على قواعد أمان Firestore التي تقصر القراءة والكتابة على صاحب الحساب فقط، مع فحص دوري لإعدادات الأمان.",
    },
    {
      title: "حالات الطوارئ",
      text: "في حالات الخطر على الحياة، يُنصح دائماً بالتواصل مع الجهات الرسمية (911) أو خط دعم صون 0546192019.",
    },
    {
      title: "التحديثات",
      text: "قد نقوم بتحديث هذه السياسة لتحسين الخدمة. سيظل أحدث إصدار متاحاً دوماً على هذه الصفحة.",
    },
  ];

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <div className="orb orb-teal w-96 h-96 -top-32 -right-32 opacity-15" />
      <div className="orb orb-gold w-72 h-72 -bottom-20 -left-20 opacity-10" />

      <div className="relative z-10 max-w-3xl mx-auto px-4 py-8 md:py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => {
              if (window.history.length > 1) {
                window.history.back();
              } else {
                navigate("/");
              }
            }}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowRight className="w-5 h-5" />
            <span className="text-sm">رجوع</span>
          </button>

          <div className="w-12 h-12" aria-hidden="true" />
        </div>

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
          className="text-center mb-8"
        >
          <img
            src="/logo10.png"
            alt="شعار صون"
            className="w-28 h-28 md:w-32 md:h-32 mx-auto mb-4 object-contain drop-shadow-[0_0_24px_rgba(0,212,170,0.35)]"
          />
          <h1 className="text-3xl md:text-4xl font-black text-foreground mb-2">
            سياسة الخصوصية
          </h1>
          <p className="text-muted-foreground text-sm">
            منصة صون — للوقاية من الإدمان
          </p>
        </motion.div>

        {/* Intro */}
        <div className="glass-card border border-border rounded-2xl p-5 mb-6">
          <p className="text-muted-foreground text-sm leading-relaxed text-right">
            نحترم خصوصيتك ونلتزم بحماية بياناتك. توضّح هذه السياسة كيف نجمع
            بياناتك، ولماذا نستخدمها، وما هي حقوقك تجاهها داخل منصة{" "}
            <span className="text-primary font-bold">صون</span>.
          </p>
        </div>

        {/* Sections */}
        <div className="space-y-4">
          {sections.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04, duration: 0.3 }}
              className="glass-card border border-border rounded-2xl p-5 text-right"
            >
              <h2 className="text-foreground font-black text-base mb-2">
                {s.title}
              </h2>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {s.text}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-10 text-center text-muted-foreground/70 text-xs">
          آخر تحديث: مايو 2026 · للتواصل بشأن الخصوصية: 0546192019
        </div>
      </div>
    </div>
  );
}
