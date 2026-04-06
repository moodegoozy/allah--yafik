/**
 * SuccessStories - قصص الوعي والوقاية
 * Design: Dark Luxury Wellness - "الله يعافيك"
 * الهدف: قصص أشخاص نجحوا في الوقاية وتجنب الإدمان
 */
import { useState } from "react";
import {
  Heart, Star, ChevronLeft, Shield,
  Award, Users, Sparkles, BookOpen, Phone, MessageSquare
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

const CONTACT_PHONE = "0546192019";

const stories = [
  {
    id: 1,
    name: "عبدالله م.",
    age: 22,
    city: "الرياض",
    type: "وقاية مبكرة",
    color: "#00D4AA",
    rating: 5,
    shortQuote: "الوعي المبكر أنقذني من طريق كان يمكن أن يدمر مستقبلي كله.",
    story: `في سن الثامنة عشرة، كنت في بيئة جامعية محاطاً بأصدقاء يجربون المخدرات. الضغط الاجتماعي كان هائلاً — "جرّب مرة واحدة فقط"، "لن يضرك"، "الكل يفعل ذلك".

ما أنقذني كان محاضرة توعوية حضرتها في الجامعة. للمرة الأولى فهمت علمياً كيف تؤثر المخدرات على الدماغ وكيف تبدأ الإدمان من أول تجربة. تلك المعلومات غيّرت نظرتي تماماً.

تعلمت كيف أرفض بحزم وأحافظ على علاقاتي في نفس الوقت. قلت لنفسي: "أنا لا أرفض الأصدقاء، أنا أرفض الخطر."

اليوم أنا طالب دكتوراه، ومتطوع في برامج التوعية الجامعية. أشارك تجربتي مع الطلاب الجدد لأساعدهم على اتخاذ القرار الصحيح قبل أن يجدوا أنفسهم في موقف صعب.`,
    milestones: ["حضور محاضرة توعوية", "تعلم مهارة الرفض", "الانضمام لمجموعة وقاية", "التطوع في التوعية"],
    tags: ["وقاية جامعية", "ضغط اجتماعي", "وعي مبكر"],
    likes: 312,
    category: "شباب",
  },
  {
    id: 2,
    name: "سارة أ.",
    age: 28,
    city: "جدة",
    type: "وقاية أسرية",
    color: "#EC4899",
    rating: 5,
    shortQuote: "حمايتي لأبنائي بدأت بتعليمهم الحقيقة عن الإدمان قبل أن يسمعوها من مصادر خاطئة.",
    story: `حين أصبحت أماً، أدركت أن أكبر مسؤولية لديّ هي تحصين أبنائي. لم أكن أريد أن أنتظر حتى يواجهوا الخطر — أردت أن أبني الدرع الواقي قبل ذلك.

بدأت بتثقيف نفسي أولاً. قرأت، حضرت محاضرات، وتعلمت كيف أتحدث مع أطفالي عن المخدرات بطريقة مناسبة لأعمارهم — بدون تخويف مبالغ فيه، لكن بوضوح كافٍ.

أنشأت في منزلنا ثقافة الحوار المفتوح. أبنائي يعرفون أنهم يستطيعون أن يسألوني أي شيء دون خوف من العقاب. هذا الأمان جعلهم يأتون إليّ حين واجهوا ضغطاً من أصدقائهم.

اليوم ابني الأكبر (١٦ سنة) يساعد في تنظيم فعاليات توعوية في مدرسته. الوقاية أصبحت ثقافة عائلية.`,
    milestones: ["تثقيف ذاتي", "حوار مفتوح مع الأبناء", "ثقافة أسرية وقائية", "تطوع مجتمعي"],
    tags: ["وقاية أسرية", "تربية واعية", "حوار مفتوح"],
    likes: 245,
    category: "أسرة",
  },
  {
    id: 3,
    name: "محمد ع.",
    age: 35,
    city: "الدمام",
    type: "وقاية مهنية",
    color: "#8B5CF6",
    rating: 5,
    shortQuote: "بيئة العمل الضاغطة كانت خطراً حقيقياً — الوعي بذلك كان أول خطوة في الحماية.",
    story: `كنت أعمل في بيئة عمل شديدة الضغط. بعض الزملاء كانوا يلجؤون للمهدئات والمسكنات "للتحمل". كنت أرى الطريق أمامي واضحاً نحو الإدمان.

ما أنقذني كان قراري الواعي بأن أبحث عن بدائل صحية للتعامل مع الضغط. بدأت بالرياضة، تعلمت تقنيات إدارة الضغط، وانضممت لمجموعة دعم للمهنيين.

الأهم من ذلك — تعلمت أن أضع حدوداً واضحة في العمل. لا أعمل بعد ساعات معينة، ولا أقبل ضغطاً يتجاوز طاقتي. هذه الحدود أنقذت صحتي.

اليوم أنا مدير ناجح وأساعد فريقي على بناء بيئة عمل صحية. الوقاية من الإدمان جزء من ثقافة فريقي.`,
    milestones: ["تحديد عوامل الخطر", "بدائل صحية للضغط", "وضع حدود واضحة", "ثقافة عمل صحية"],
    tags: ["وقاية مهنية", "إدارة الضغط", "بيئة عمل صحية"],
    likes: 198,
    category: "مهنيون",
  },
  {
    id: 4,
    name: "خالد ن.",
    age: 17,
    city: "مكة المكرمة",
    type: "وقاية مدرسية",
    color: "#F59E0B",
    rating: 5,
    shortQuote: "حين عرفت الحقيقة عن المخدرات، لم أعد أراها 'مغامرة' بل رأيتها 'كارثة'.",
    story: `في المرحلة الثانوية، كان بعض زملائي يتحدثون عن المخدرات كأنها شيء عادي. كنت فضولياً ومحيراً في نفس الوقت.

حضرت محاضرة في المدرسة قدّمها طبيب متخصص. شرح لنا بالصور والأرقام ماذا تفعل المخدرات بالدماغ — كيف تدمر الخلايا العصبية، كيف تسرق الإرادة، وكيف تحول الإنسان إلى عبد لمادة كيميائية.

تلك الصور لم تفارق ذهني. في المرة الأولى التي عُرضت عليّ فيها مخدرات، كانت إجابتي "لا" سهلة جداً — لأنني كنت أرى في ذهني ما رأيته في تلك المحاضرة.

اليوم أنا في الجامعة أدرس الطب. أريد أن أكون الطبيب الذي يُقدّم تلك المحاضرات التي أنقذتني.`,
    milestones: ["محاضرة توعوية مدرسية", "رفض أول عرض", "اختيار مسار الطب", "تطوع في التوعية"],
    tags: ["وقاية مدرسية", "توعية علمية", "قرار واعٍ"],
    likes: 421,
    category: "شباب",
  },
  {
    id: 5,
    name: "فاطمة ر.",
    age: 45,
    city: "الطائف",
    type: "وقاية مجتمعية",
    color: "#10B981",
    rating: 5,
    shortQuote: "حين يعرف المجتمع كله الخطر، يصبح الجميع درعاً لبعضهم.",
    story: `بعد أن رأيت ما فعله الإدمان بعائلة جارتي، قررت أن أفعل شيئاً. لم أكن طبيبة أو معالجة — كنت أماً قلقة على مجتمعها.

بدأت بتنظيم جلسات توعوية صغيرة في حيّنا. ثم تعاونت مع المسجد المحلي لتنظيم محاضرات أكبر. ثم تواصلت مع المدرسة لتضمين التوعية في برامجها.

ما تعلمته: الوقاية لا تحتاج متخصصين فقط — تحتاج أفراداً واعين يتكلمون بصدق مع محيطهم. كل شخص يُعلّم شخصاً آخر يُنقذ حياة.

اليوم لدينا شبكة توعية في ٣ أحياء. ونخطط للتوسع. الوقاية مسؤولية الجميع.`,
    milestones: ["جلسات حي صغيرة", "تعاون مع المسجد", "شراكة مع المدرسة", "شبكة توعية ٣ أحياء"],
    tags: ["وقاية مجتمعية", "تطوع", "شبكة توعية"],
    likes: 367,
    category: "مجتمع",
  },
];

export default function SuccessStories() {
  const [selectedStory, setSelectedStory] = useState<typeof stories[0] | null>(null);
  const [activeCategory, setActiveCategory] = useState("الكل");
  const [likedStories, setLikedStories] = useState<number[]>([]);

  const categories = ["الكل", "شباب", "أسرة", "مهنيون", "مجتمع"];

  const filteredStories = activeCategory === "الكل"
    ? stories
    : stories.filter(s => s.category === activeCategory);

  const toggleLike = (id: number) => {
    setLikedStories(prev =>
      prev.includes(id) ? prev.filter(l => l !== id) : [...prev, id]
    );
    toast.success("شكراً لتفاعلك! هذه القصص تُلهم الآخرين 💚");
  };

  return (
    <div className="app-container bg-gradient-navy">
      <div className="orb w-72 h-72 opacity-8 -top-20 -left-20" style={{ background: "#EC4899" }} />

      {/* Header */}
      <div className="mobile-header px-5 py-4">
        <div>
          <div className="text-[#00D4AA] text-xs font-bold uppercase tracking-wider mb-1">قصص ملهِمة</div>
          <h1 className="text-white font-black text-xl">قصص الوعي والوقاية</h1>
          <p className="text-white/40 text-xs mt-0.5">تجارب حقيقية لأشخاص اختاروا الوقاية</p>
        </div>
      </div>

      <div className="page-content overflow-y-auto">

        {/* Stats */}
        <div className="px-4 mt-3 grid grid-cols-3 gap-3">
          <div className="p-3 rounded-2xl glass-card border border-white/8 text-center">
            <div className="text-[#00D4AA] font-black text-xl">{stories.length}</div>
            <div className="text-white/40 text-[10px]">قصة وقاية</div>
          </div>
          <div className="p-3 rounded-2xl glass-card border border-white/8 text-center">
            <div className="text-[#F59E0B] font-black text-xl">١٢٠٠+</div>
            <div className="text-white/40 text-[10px]">إعجاب</div>
          </div>
          <div className="p-3 rounded-2xl glass-card border border-white/8 text-center">
            <div className="text-[#8B5CF6] font-black text-xl">٥</div>
            <div className="text-white/40 text-[10px]">فئات</div>
          </div>
        </div>

        {/* Category Filter */}
        <div className="px-4 mt-4">
          <div className="flex gap-2 overflow-x-auto pb-1">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`flex-shrink-0 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  activeCategory === cat
                    ? "bg-[#00D4AA] text-[#060B18]"
                    : "glass-card border border-white/10 text-white/50"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Stories List */}
        <div className="px-4 mt-4 space-y-4 mb-4">
          {filteredStories.map((story, idx) => (
            <motion.div
              key={story.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.08 }}
              className="rounded-2xl border border-white/8 glass-card overflow-hidden"
            >
              {/* Story Header */}
              <div className="p-4 border-b border-white/6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center font-black text-white text-sm" style={{ background: `${story.color}30`, border: `2px solid ${story.color}40` }}>
                    {story.name[0]}
                  </div>
                  <div>
                    <div className="text-white font-black text-sm">{story.name}</div>
                    <div className="text-white/40 text-xs">{story.age} عاماً — {story.city}</div>
                  </div>
                  <div className="mr-auto flex">
                    {[...Array(story.rating)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 text-[#F59E0B] fill-[#F59E0B]" />
                    ))}
                  </div>
                </div>

                <div className="px-3 py-2.5 rounded-xl" style={{ background: `${story.color}10`, borderRight: `3px solid ${story.color}` }}>
                  <p className="text-white/75 text-xs italic leading-relaxed">"{story.shortQuote}"</p>
                </div>
              </div>

              {/* Story Preview */}
              <div className="p-4">
                <p className="text-white/50 text-xs leading-relaxed line-clamp-3 mb-3">
                  {story.story.split('\n')[0]}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {story.tags.map(tag => (
                    <span key={tag} className="px-2 py-0.5 rounded-full text-[10px] font-bold" style={{ background: `${story.color}15`, color: story.color }}>
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSelectedStory(story)}
                    className="flex-1 py-2 rounded-xl text-xs font-bold text-[#060B18]"
                    style={{ background: `linear-gradient(135deg, ${story.color}, ${story.color}99)` }}
                  >
                    اقرأ القصة كاملة
                  </button>
                  <button
                    onClick={() => toggleLike(story.id)}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-bold transition-all ${
                      likedStories.includes(story.id)
                        ? "border-[#EF4444]/40 bg-[#EF4444]/10 text-[#EF4444]"
                        : "border-white/10 glass-card text-white/50"
                    }`}
                  >
                    <Heart className={`w-3.5 h-3.5 ${likedStories.includes(story.id) ? "fill-[#EF4444]" : ""}`} />
                    {story.likes + (likedStories.includes(story.id) ? 1 : 0)}
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Share Your Story CTA */}
        <div className="px-4 mb-4">
          <div className="p-4 rounded-2xl border border-[#00D4AA]/20" style={{ background: "linear-gradient(135deg, rgba(0,212,170,0.10), rgba(14,165,233,0.05))" }}>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-[#00D4AA]" />
              <span className="text-white font-black text-sm">شارك قصة وقايتك</span>
            </div>
            <p className="text-white/50 text-xs leading-relaxed mb-3">
              قصتك في الوقاية قد تُنقذ شخصاً آخر. شارك تجربتك لتُلهم الآخرين.
            </p>
            <a
              href={`tel:${CONTACT_PHONE}`}
              className="flex items-center gap-2 py-2.5 px-4 rounded-xl font-bold text-sm text-[#060B18]"
              style={{ background: "linear-gradient(135deg, #00D4AA, #0EA5E9)" }}
            >
              <Phone className="w-4 h-4" />
              تواصل معنا: {CONTACT_PHONE}
            </a>
          </div>
        </div>

      </div>

      {/* Story Detail Modal */}
      <AnimatePresence>
        {selectedStory && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 flex items-end"
            onClick={() => setSelectedStory(null)}
          >
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25 }}
              className="w-full max-h-[85vh] rounded-t-3xl overflow-hidden"
              style={{ background: "#0A0F1E", border: "1px solid rgba(255,255,255,0.08)" }}
              onClick={e => e.stopPropagation()}
            >
              <div className="p-5 border-b border-white/8 flex items-center justify-between">
                <div>
                  <div className="text-white font-black">{selectedStory.name}</div>
                  <div className="text-white/40 text-xs">{selectedStory.type}</div>
                </div>
                <button onClick={() => setSelectedStory(null)} className="p-2 rounded-xl glass-card border border-white/10">
                  <ChevronLeft className="w-4 h-4 text-white/50" />
                </button>
              </div>
              <div className="overflow-y-auto max-h-[70vh] p-5">
                <div className="space-y-4">
                  {selectedStory.story.split('\n\n').map((para, i) => (
                    para.trim() && (
                      <p key={i} className="text-white/70 text-sm leading-relaxed">{para}</p>
                    )
                  ))}
                </div>
                <div className="mt-5">
                  <h3 className="text-white font-black text-sm mb-3">محطات رحلة الوقاية</h3>
                  <div className="space-y-2">
                    {selectedStory.milestones.map((m, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-full flex items-center justify-center" style={{ background: `${selectedStory.color}20` }}>
                          <Award className="w-3 h-3" style={{ color: selectedStory.color }} />
                        </div>
                        <span className="text-white/65 text-xs">{m}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
