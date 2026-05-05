/**
 * DeleteAccount - صفحة طلب حذف الحساب والبيانات (عامة)
 * Design: Dark Luxury Wellness - "صون"
 */
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { ArrowRight, Trash2, MessageCircle, Phone, Mail } from "lucide-react";

const CONTACT_PHONE = "0546192019";
// Saudi Arabia country code (966) + number without leading zero
const WHATSAPP_NUMBER = "966546192019";
const WHATSAPP_MESSAGE = encodeURIComponent(
  "السلام عليكم،\nأرغب في طلب حذف حسابي وجميع البيانات المرتبطة به في تطبيق صون.\n\nالاسم: \nالبريد الإلكتروني المسجل: \nرقم الجوال: \n\nشكراً لكم."
);
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MESSAGE}`;
const EMAIL = "support@meem-38f4b.web.app";

export default function DeleteAccount() {
  const [, navigate] = useLocation();

  const items: { title: string; text: string }[] = [
    {
      title: "ما الذي سيتم حذفه؟",
      text: "حسابك في صون، بياناتك الشخصية (الاسم، البريد، الجوال، العمر، الجنس)، نتائج التقييم، تقدّمك في الخطط الوقائية والإنجازات، وجميع الإعدادات والملاحظات المرتبطة بحسابك.",
    },
    {
      title: "أين تُحذف البيانات؟",
      text: "نقوم بحذف بياناتك من قواعد بيانات Firebase (Authentication و Firestore) ومن أي نسخ محلية على الأجهزة المرتبطة بحسابك.",
    },
    {
      title: "كم يستغرق التنفيذ؟",
      text: "نلتزم بمعالجة طلبات الحذف خلال مدة أقصاها 14 يوم عمل من تاريخ استلام الطلب والتحقق من ملكية الحساب.",
    },
    {
      title: "هل يمكن التراجع؟",
      text: "بعد إتمام الحذف لا يمكن استرجاع البيانات. يمكنك إنشاء حساب جديد لاحقاً، لكن الحساب الجديد لن يتضمن أي من بياناتك السابقة.",
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
            طلب حذف الحساب والبيانات
          </h1>
          <p className="text-muted-foreground text-sm">
            منصة صون — للوقاية من الإدمان
          </p>
        </motion.div>

        {/* Intro */}
        <div className="glass-card border border-border rounded-2xl p-5 mb-6 text-right">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center flex-shrink-0">
              <Trash2 className="w-5 h-5 text-red-500" />
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed">
              يحق لك في أي وقت طلب حذف حسابك وجميع البيانات المرتبطة به في
              تطبيق <span className="text-primary font-bold">صون</span>. يمكنك
              إرسال طلبك مباشرة عبر واتساب أو الاتصال بنا.
            </p>
          </div>
        </div>

        {/* CTA: WhatsApp */}
        <a
          href={WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="block mb-3 rounded-2xl p-5 text-right transition-all hover:scale-[1.01]"
          style={{
            background: "linear-gradient(135deg, #25D366, #128C7E)",
          }}
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
              <MessageCircle className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-white font-black text-base mb-0.5">
                إرسال طلب الحذف عبر واتساب
              </div>
              <div className="text-white/85 text-xs">
                {CONTACT_PHONE} — استجابة سريعة
              </div>
            </div>
            <ArrowRight className="w-5 h-5 text-white rotate-180" />
          </div>
        </a>

        {/* CTA: Phone */}
        <a
          href={`tel:${CONTACT_PHONE}`}
          className="block mb-6 rounded-2xl glass-card border border-border p-5 text-right transition-all hover:bg-secondary/40"
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Phone className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-foreground font-black text-base mb-0.5">
                الاتصال المباشر
              </div>
              <div
                className="text-muted-foreground text-xs font-numbers"
                dir="ltr"
              >
                {CONTACT_PHONE}
              </div>
            </div>
            <ArrowRight className="w-5 h-5 text-muted-foreground rotate-180" />
          </div>
        </a>

        {/* Sections */}
        <div className="space-y-4">
          {items.map((s, i) => (
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

        {/* Info note */}
        <div className="mt-6 rounded-2xl border border-border bg-secondary/30 p-4 text-right">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-lg bg-amber-500/10 flex items-center justify-center flex-shrink-0">
              <Mail className="w-4 h-4 text-amber-500" />
            </div>
            <p className="text-muted-foreground text-xs leading-relaxed">
              لتأكيد ملكيتك للحساب قد نطلب منك إرسال البريد الإلكتروني أو رقم
              الجوال المسجّل في التطبيق. لا تشارك كلمة المرور مع أي شخص.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-10 text-center text-muted-foreground/70 text-xs">
          آخر تحديث: مايو 2026 · {CONTACT_PHONE}
        </div>
      </div>
    </div>
  );
}
