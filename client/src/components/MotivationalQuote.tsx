/*
 * Design: Dark Luxury Wellness - Daily Motivational Quote
 * Purpose: Show rotating motivational quotes
 * Style: Glassmorphism, gradient text
 */
import { useState, useEffect } from "react";
import { Sparkles, RefreshCw } from "lucide-react";

const quotes = [
  { text: "القوة لا تأتي من الجسد، بل تأتي من الإرادة التي لا تُكسر.", author: "مجهول" },
  { text: "كل يوم تصحو فيه نظيفاً هو انتصار يستحق الاحتفال.", author: "برنامج الله يعافيك" },
  { text: "الشجاعة ليست غياب الخوف، بل هي القرار بأن شيئاً آخر أهم من الخوف.", author: "أمبروز ريدمون" },
  { text: "لا تقيس نجاحك بعدد مرات السقوط، بل بعدد مرات النهوض.", author: "مجهول" },
  { text: "التعافي هو رحلة، وليس وجهة. كل خطوة إلى الأمام تُحسب.", author: "برنامج الله يعافيك" },
  { text: "أنت أقوى مما تعتقد، وأشجع مما تظن، وأذكى مما تتخيل.", author: "ملهم" },
  { text: "الحرية الحقيقية هي أن تكون سيد نفسك.", author: "مجهول" },
];

export default function MotivationalQuote() {
  const [index, setIndex] = useState(0);
  const [fade, setFade] = useState(true);

  const nextQuote = () => {
    setFade(false);
    setTimeout(() => {
      setIndex(i => (i + 1) % quotes.length);
      setFade(true);
    }, 300);
  };

  useEffect(() => {
    const timer = setInterval(nextQuote, 8000);
    return () => clearInterval(timer);
  }, []);

  const quote = quotes[index];

  return (
    <div className="glass-card p-5 border border-violet-500/20 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 to-transparent" />
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-violet-500" />
            <span className="text-violet-500 text-xs font-medium">اقتباس اليوم</span>
          </div>
          <button
            onClick={nextQuote}
            className="w-7 h-7 rounded-lg bg-secondary/60 flex items-center justify-center text-muted-foreground/70 hover:text-violet-500 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
        <p
          className="text-foreground/80 text-sm leading-relaxed mb-2 transition-opacity duration-300"
          style={{ opacity: fade ? 1 : 0 }}
        >
          "{quote.text}"
        </p>
        <p className="text-muted-foreground/70 text-xs">— {quote.author}</p>
      </div>
    </div>
  );
}
