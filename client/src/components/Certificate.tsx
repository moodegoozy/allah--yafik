/**
 * Certificate - شهادة إتمام المحاضرة الرقمية
 * Design: Dark Luxury Wellness - "الله يعافيك"
 * Features: شهادة جميلة قابلة للطباعة، رقم تسلسلي، تاريخ، نتيجة الاختبار
 */
import { useRef } from "react";
import { Award, Download, Share2, CheckCircle2, Star, Shield, Printer } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

interface CertificateProps {
  lectureTitle: string;
  speaker: string;
  speakerTitle: string;
  score: number;
  totalQuestions: number;
  color: string;
  category: string;
  duration: string;
  onClose: () => void;
}

export default function Certificate({
  lectureTitle,
  speaker,
  speakerTitle,
  score,
  totalQuestions,
  color,
  category,
  duration,
  onClose,
}: CertificateProps) {
  const certRef = useRef<HTMLDivElement>(null);
  const today = new Date();
  const dateStr = today.toLocaleDateString("ar-SA", { year: "numeric", month: "long", day: "numeric" });
  const certId = `LLYK-${today.getFullYear()}-${Math.random().toString(36).substr(2, 8).toUpperCase()}`;
  const percentage = Math.round((score / totalQuestions) * 100);

  const grade =
    percentage === 100 ? "امتياز" :
    percentage >= 80 ? "جيد جداً" :
    percentage >= 60 ? "جيد" : "مقبول";

  const gradeColor =
    percentage === 100 ? "oklch(0.80 0.18 80)" :
    percentage >= 80 ? "oklch(0.75 0.18 175)" :
    percentage >= 60 ? "#3B82F6" : "#8B5CF6";

  const handlePrint = () => {
    window.print();
    toast.success("جارٍ فتح نافذة الطباعة...");
  };

  const handleShare = async () => {
    const text = `حصلت على شهادة إتمام محاضرة "${lectureTitle}" من برنامج الله يعافيك بتقدير ${grade} (${percentage}%) 🎓\n\nرقم الشهادة: ${certId}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: "شهادة إتمام - الله يعافيك", text });
      } catch {
        navigator.clipboard.writeText(text);
        toast.success("تم نسخ نص الشهادة للمشاركة");
      }
    } else {
      navigator.clipboard.writeText(text);
      toast.success("تم نسخ نص الشهادة للمشاركة");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
    >
      <div className="absolute inset-0 bg-background/95 backdrop-blur-sm" onClick={onClose} />

      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        className="relative z-10 w-full max-w-2xl"
      >
        {/* أزرار الإجراءات */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground text-sm transition-colors"
          >
            ✕ إغلاق
          </button>
          <div className="flex gap-2">
            <button
              onClick={handleShare}
              className="flex items-center gap-2 px-4 py-2 rounded-xl glass-card border border-border text-muted-foreground hover:text-foreground text-sm transition-all"
            >
              <Share2 className="w-4 h-4" />
              مشاركة
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 rounded-xl glass-card border border-border text-muted-foreground hover:text-foreground text-sm transition-all"
            >
              <Printer className="w-4 h-4" />
              طباعة
            </button>
          </div>
        </div>

        {/* الشهادة */}
        <div
          ref={certRef}
          className="relative overflow-hidden rounded-3xl p-1"
          style={{ background: `linear-gradient(135deg, ${color}60, oklch(0.75 0.18 175)40, ${color}30)` }}
        >
          <div className="bg-background rounded-[22px] p-8 relative overflow-hidden">
            {/* خلفية زخرفية */}
            <div className="absolute inset-0 opacity-5">
              <div className="absolute top-0 right-0 w-64 h-64 rounded-full" style={{ background: `radial-gradient(circle, ${color}, transparent)` }} />
              <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full" style={{ background: "radial-gradient(circle, oklch(0.75 0.18 175), transparent)" }} />
            </div>

            {/* نمط هندسي */}
            <div className="absolute inset-0 opacity-3">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="absolute border border-border rounded-full"
                  style={{
                    width: `${(i + 1) * 80}px`,
                    height: `${(i + 1) * 80}px`,
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                  }}
                />
              ))}
            </div>

            <div className="relative z-10">
              {/* الرأس */}
              <div className="text-center mb-6">
                <div className="flex items-center justify-center gap-3 mb-3">
                  <div className="h-px flex-1" style={{ background: `linear-gradient(to right, transparent, ${color}50)` }} />
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center"
                    style={{ background: `linear-gradient(135deg, ${color}30, oklch(0.75 0.18 175)20)`, border: `1px solid ${color}40` }}
                  >
                    <Award className="w-7 h-7" style={{ color }} />
                  </div>
                  <div className="h-px flex-1" style={{ background: `linear-gradient(to left, transparent, ${color}50)` }} />
                </div>
                <div className="text-muted-foreground/70 text-xs tracking-widest uppercase mb-1">برنامج الله يعافيك</div>
                <h2 className="text-2xl font-black text-foreground">شهادة إتمام</h2>
                <div className="text-muted-foreground text-xs mt-1">Certificate of Completion</div>
              </div>

              {/* المحتوى */}
              <div className="text-center mb-6">
                <p className="text-muted-foreground text-sm mb-2">تُمنح هذه الشهادة تقديراً لإتمام محاضرة</p>
                <div
                  className="inline-block px-6 py-3 rounded-2xl mb-4"
                  style={{ background: `${color}12`, border: `1px solid ${color}25` }}
                >
                  <h3 className="text-foreground font-black text-lg leading-snug">{lectureTitle}</h3>
                </div>
                <p className="text-muted-foreground text-sm">
                  بإشراف <span className="text-foreground font-bold">{speaker}</span>
                </p>
                <p className="text-muted-foreground/70 text-xs">{speakerTitle}</p>
              </div>

              {/* الإحصائيات */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="text-center p-3 rounded-xl" style={{ background: `${gradeColor}10`, border: `1px solid ${gradeColor}20` }}>
                  <div className="text-2xl font-black font-numbers mb-0.5" style={{ color: gradeColor }}>{percentage}%</div>
                  <div className="text-muted-foreground text-xs">النتيجة</div>
                </div>
                <div className="text-center p-3 rounded-xl" style={{ background: `${gradeColor}10`, border: `1px solid ${gradeColor}20` }}>
                  <div className="text-2xl font-black mb-0.5" style={{ color: gradeColor }}>{grade}</div>
                  <div className="text-muted-foreground text-xs">التقدير</div>
                </div>
                <div className="text-center p-3 rounded-xl" style={{ background: "var(--secondary)", border: "1px solid var(--border)" }}>
                  <div className="text-2xl font-black text-foreground mb-0.5">{score}/{totalQuestions}</div>
                  <div className="text-muted-foreground text-xs">الاختبار</div>
                </div>
              </div>

              {/* التفاصيل */}
              <div className="flex items-center justify-between py-4 border-t border-b border-border mb-5">
                <div className="flex items-center gap-2 text-muted-foreground/70 text-xs">
                  <Shield className="w-3.5 h-3.5" />
                  <span>رقم الشهادة: <span className="font-numbers text-muted-foreground">{certId}</span></span>
                </div>
                <div className="text-muted-foreground/70 text-xs">{dateStr}</div>
              </div>

              {/* النجوم والتحقق */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4"
                      style={{ color: i < Math.round(percentage / 20) ? "oklch(0.80 0.18 80)" : "var(--border)" }}
                      fill={i < Math.round(percentage / 20) ? "oklch(0.80 0.18 80)" : "none"}
                    />
                  ))}
                </div>
                <div className="flex items-center gap-1.5 text-emerald-500 text-xs">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>شهادة موثّقة</span>
                </div>
                <div className="text-muted-foreground/60 text-xs">{category} · {duration}</div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
