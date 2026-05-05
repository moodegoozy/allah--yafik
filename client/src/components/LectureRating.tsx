/**
 * LectureRating - نظام تقييم المحاضرة والتوصيات الذكية
 * Design: Dark Luxury Wellness - "صون"
 */
import { useState } from "react";
import { Star, ThumbsUp, MessageSquare, ChevronLeft, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { useLocation } from "wouter";
import { lecturesData } from "@/data/lecturesData";

interface LectureRatingProps {
  lectureId: string;
  color: string;
}

const feedbackOptions = [
  "محتوى علمي ممتاز",
  "سهل الفهم",
  "مفيد جداً",
  "يستحق المشاركة",
  "غيّر تفكيري",
  "أريد المزيد",
];

export default function LectureRating({ lectureId, color }: LectureRatingProps) {
  const [, navigate] = useLocation();
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [comment, setComment] = useState("");
  const [selectedFeedback, setSelectedFeedback] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [showForm, setShowForm] = useState(false);

  // توصيات ذكية بناءً على المحاضرة الحالية
  const relatedLectures = lecturesData
    .filter(l => l.id !== lectureId)
    .slice(0, 3);

  const handleSubmit = () => {
    if (rating === 0) {
      toast.error("يرجى اختيار تقييم أولاً");
      return;
    }
    setSubmitted(true);
    toast.success("شكراً على تقييمك! رأيك يساعدنا على التحسين");
  };

  const toggleFeedback = (item: string) => {
    setSelectedFeedback(prev =>
      prev.includes(item) ? prev.filter(f => f !== item) : [...prev, item]
    );
  };

  return (
    <div className="space-y-5">
      {/* Rating Section */}
      <div className="glass-card p-6 border border-border">
        <AnimatePresence mode="wait">
          {!submitted ? (
            <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <h4 className="text-foreground font-bold mb-1 flex items-center gap-2">
                <Star className="w-4 h-4 text-accent" />
                قيّم هذه المحاضرة
              </h4>
              <p className="text-muted-foreground text-xs mb-4">رأيك يساعدنا على تحسين المحتوى</p>

              {/* Stars */}
              <div className="flex items-center gap-2 mb-4">
                {[1, 2, 3, 4, 5].map(star => (
                  <button
                    key={star}
                    onMouseEnter={() => setHovered(star)}
                    onMouseLeave={() => setHovered(0)}
                    onClick={() => { setRating(star); setShowForm(true); }}
                    className="transition-transform hover:scale-110"
                  >
                    <Star
                      className="w-8 h-8 transition-all"
                      style={{
                        color: star <= (hovered || rating) ? "oklch(0.80 0.18 80)" : "var(--muted-foreground)",
                        fill: star <= (hovered || rating) ? "oklch(0.80 0.18 80)" : "none",
                      }}
                    />
                  </button>
                ))}
                {rating > 0 && (
                  <span className="text-muted-foreground text-sm mr-2">
                    {["", "ضعيف", "مقبول", "جيد", "جيد جداً", "ممتاز"][rating]}
                  </span>
                )}
              </div>

              {/* Feedback Tags */}
              <AnimatePresence>
                {showForm && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <div className="flex flex-wrap gap-2 mb-4">
                      {feedbackOptions.map(opt => (
                        <button
                          key={opt}
                          onClick={() => toggleFeedback(opt)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                            selectedFeedback.includes(opt)
                              ? "text-foreground"
                              : "glass-card text-muted-foreground border border-border hover:text-foreground/70"
                          }`}
                          style={selectedFeedback.includes(opt) ? { background: `${color}20`, border: `1px solid ${color}40`, color } : {}}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>

                    <textarea
                      value={comment}
                      onChange={e => setComment(e.target.value)}
                      placeholder="أضف تعليقاً (اختياري)..."
                      className="w-full bg-secondary/50 border border-border rounded-xl p-3 text-foreground/80 text-sm placeholder:text-muted-foreground/50 resize-none focus:outline-none focus:border-border mb-4"
                      rows={2}
                    />

                    <button
                      onClick={handleSubmit}
                      className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all"
                      style={{ background: `linear-gradient(135deg, ${color}, oklch(0.75 0.18 175))`, color: "var(--primary-foreground)" }}
                    >
                      <ThumbsUp className="w-4 h-4" />
                      إرسال التقييم
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ) : (
            <motion.div
              key="thanks"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-2"
            >
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 flex items-center justify-center mx-auto mb-3">
                <ThumbsUp className="w-6 h-6 text-emerald-500" />
              </div>
              <h4 className="text-foreground font-bold mb-1">شكراً على تقييمك!</h4>
              <div className="flex justify-center gap-1 mb-2">
                {[1, 2, 3, 4, 5].map(s => (
                  <Star key={s} className="w-4 h-4" style={{ color: s <= rating ? "oklch(0.80 0.18 80)" : "var(--border)", fill: s <= rating ? "oklch(0.80 0.18 80)" : "none" }} />
                ))}
              </div>
              <p className="text-muted-foreground text-xs">تقييمك يساعدنا على تحسين البرنامج</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Smart Recommendations */}
      <div className="glass-card p-5 border border-border">
        <h4 className="text-foreground font-bold mb-4 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-primary" />
          محاضرات مقترحة لك
        </h4>
        <div className="space-y-3">
          {relatedLectures.map((lec, i) => (
            <motion.button
              key={lec.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              onClick={() => navigate(`/lectures/${lec.id}`)}
              className="w-full flex items-center gap-3 p-3 rounded-xl glass-card border border-border hover:border-border transition-all group text-right"
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: `${lec.color}20`, border: `1px solid ${lec.color}25` }}
              >
                <span className="text-sm font-black font-numbers" style={{ color: lec.color }}>{i + 1}</span>
              </div>
              <div className="flex-1 min-w-0">
                <h5 className="text-foreground/80 font-bold text-xs line-clamp-1 group-hover:text-foreground transition-colors">{lec.title}</h5>
                <p className="text-muted-foreground/70 text-xs">{lec.speaker} · {lec.duration}</p>
              </div>
              <div className="flex items-center gap-1 text-muted-foreground/60 group-hover:text-muted-foreground transition-colors">
                <ChevronLeft className="w-4 h-4" />
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}
