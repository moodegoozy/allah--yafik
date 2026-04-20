/**
 * LectureSummaryExport - تصدير ملخص المحاضرة ومشاركتها
 * Design: Dark Luxury Wellness - "الله يعافيك"
 * Features: نسخ الملخص، مشاركة عبر الشبكات، طباعة
 */
import { useState } from "react";
import { Share2, Copy, Check, Printer, MessageCircle, Mail, Link2, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

interface LectureSummaryExportProps {
  title: string;
  speaker: string;
  speakerTitle: string;
  keyTakeaways: string[];
  tags: string[];
  color: string;
  duration: string;
  rating: number;
}

export default function LectureSummaryExport({
  title,
  speaker,
  speakerTitle,
  keyTakeaways,
  tags,
  color,
  duration,
  rating,
}: LectureSummaryExportProps) {
  const [showPanel, setShowPanel] = useState(false);
  const [copied, setCopied] = useState(false);

  const summaryText = `📚 ملخص محاضرة: ${title}
👨‍🏫 المحاضر: ${speaker} - ${speakerTitle}
⏱ المدة: ${duration} | ⭐ التقييم: ${rating}/5

🔑 النقاط الرئيسية:
${keyTakeaways.map((k, i) => `${i + 1}. ${k}`).join("\n")}

🏷 الوسوم: ${tags.join(" · ")}

📱 برنامج الله يعافيك - للوقاية من الإدمان
📞 0546192019`;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(summaryText);
    setCopied(true);
    toast.success("تم نسخ الملخص بنجاح!");
    setTimeout(() => setCopied(false), 2500);
  };

  const handleWhatsApp = () => {
    const encoded = encodeURIComponent(summaryText);
    window.open(`https://wa.me/?text=${encoded}`, "_blank");
    toast.success("جارٍ فتح واتساب...");
  };

  const handleEmail = () => {
    const subject = encodeURIComponent(`ملخص محاضرة: ${title}`);
    const body = encodeURIComponent(summaryText);
    window.open(`mailto:?subject=${subject}&body=${body}`, "_blank");
  };

  const handlePrint = () => {
    const printContent = `
      <html dir="rtl">
      <head>
        <meta charset="UTF-8">
        <title>ملخص: ${title}</title>
        <style>
          body { font-family: 'Cairo', Arial, sans-serif; padding: 40px; color: #1a1a2e; direction: rtl; }
          h1 { color: #0a0f1e; font-size: 22px; border-bottom: 3px solid ${color}; padding-bottom: 10px; }
          .meta { color: #666; font-size: 14px; margin-bottom: 20px; }
          .section { margin: 20px 0; }
          .section h2 { font-size: 16px; color: ${color}; margin-bottom: 10px; }
          .point { display: flex; gap: 10px; margin: 8px 0; font-size: 14px; line-height: 1.6; }
          .num { background: ${color}20; color: ${color}; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; flex-shrink: 0; }
          .tags { display: flex; gap: 8px; flex-wrap: wrap; margin-top: 10px; }
          .tag { background: ${color}15; color: ${color}; padding: 4px 12px; border-radius: 20px; font-size: 12px; }
          .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee; color: #999; font-size: 12px; text-align: center; }
        </style>
      </head>
      <body>
        <h1>${title}</h1>
        <div class="meta">المحاضر: ${speaker} · ${speakerTitle} | المدة: ${duration} | التقييم: ${rating}/5</div>
        <div class="section">
          <h2>🔑 النقاط الرئيسية</h2>
          ${keyTakeaways.map((k, i) => `<div class="point"><div class="num">${i + 1}</div><span>${k}</span></div>`).join("")}
        </div>
        <div class="section">
          <h2>🏷 الوسوم</h2>
          <div class="tags">${tags.map(t => `<span class="tag">${t}</span>`).join("")}</div>
        </div>
        <div class="footer">برنامج الله يعافيك للوقاية من الإدمان | 0546192019</div>
      </body>
      </html>
    `;
    const win = window.open("", "_blank");
    if (win) {
      win.document.write(printContent);
      win.document.close();
      win.print();
    }
    toast.success("جارٍ فتح نافذة الطباعة...");
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: `ملخص: ${title}`, text: summaryText });
      } catch {
        handleCopy();
      }
    } else {
      handleCopy();
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowPanel(!showPanel)}
        className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all"
        style={{
          background: showPanel ? `${color}20` : "var(--secondary)",
          border: `1px solid ${showPanel ? color + "40" : "var(--border)"}`,
          color: showPanel ? color : "var(--foreground)",
        }}
      >
        <Share2 className="w-4 h-4" />
        مشاركة الملخص
      </button>

      <AnimatePresence>
        {showPanel && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute left-0 top-full mt-2 z-50 w-72 glass-deep rounded-2xl border border-border p-4 shadow-2xl"
          >
            {/* رأس اللوحة */}
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-foreground font-bold text-sm">مشاركة وتصدير</h4>
              <button onClick={() => setShowPanel(false)} className="text-muted-foreground/70 hover:text-foreground transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* معاينة الملخص */}
            <div className="bg-secondary/50 rounded-xl p-3 mb-4 max-h-28 overflow-y-auto">
              <p className="text-muted-foreground text-xs leading-relaxed whitespace-pre-line">{summaryText.split("\n").slice(0, 5).join("\n")}...</p>
            </div>

            {/* أزرار المشاركة */}
            <div className="grid grid-cols-2 gap-2 mb-3">
              <button
                onClick={handleCopy}
                className="flex items-center gap-2 p-3 rounded-xl transition-all text-sm"
                style={{ background: copied ? "oklch(0.70 0.17 160 / 0.1)" : "var(--secondary)", border: `1px solid ${copied ? "oklch(0.70 0.17 160 / 0.2)" : "var(--border)"}`, color: copied ? "oklch(0.70 0.17 160)" : "var(--foreground)" }}
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied ? "تم النسخ!" : "نسخ"}
              </button>

              <button
                onClick={handleWhatsApp}
                className="flex items-center gap-2 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/15 text-emerald-500 text-sm transition-all hover:bg-emerald-500/15"
              >
                <MessageCircle className="w-4 h-4" />
                واتساب
              </button>

              <button
                onClick={handleEmail}
                className="flex items-center gap-2 p-3 rounded-xl bg-secondary/60 border border-border text-muted-foreground text-sm transition-all hover:bg-secondary/80"
              >
                <Mail className="w-4 h-4" />
                بريد
              </button>

              <button
                onClick={handlePrint}
                className="flex items-center gap-2 p-3 rounded-xl text-sm transition-all"
                style={{ background: `${color}12`, border: `1px solid ${color}25`, color }}
              >
                <Printer className="w-4 h-4" />
                طباعة
              </button>
            </div>

            {/* مشاركة عامة */}
            <button
              onClick={handleNativeShare}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all"
              style={{ background: `linear-gradient(135deg, ${color}20, oklch(0.75 0.18 175)15)`, border: `1px solid ${color}25`, color }}
            >
              <Link2 className="w-4 h-4" />
              مشاركة عبر التطبيقات
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
