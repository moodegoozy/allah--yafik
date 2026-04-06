/**
 * Community - مجتمع الوعي والوقاية
 * Design: Dark Luxury Wellness - "الله يعافيك"
 * الهدف: مجتمع داعم للوقاية من الإدمان
 */
import { useState } from "react";
import { toast } from "sonner";
import {
  Users, Heart, MessageCircle, Share2, Plus,
  Search, Award, Shield, Send, ThumbsUp, Bookmark,
  Lightbulb, Bell,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const posts = [
  {
    id: 1,
    author: "عبدالله م.",
    avatar: "ع",
    avatarColor: "from-[#00D4AA] to-[#0EA5E9]",
    time: "منذ ٢ ساعة",
    content: "اليوم رفضت ضغط اجتماعي كان صعباً جداً. كنا في تجمع وعُرضت عليّ مواد مشبوهة. قلت 'لا' بثقة وغيّرت الموضوع. الحمد لله على نعمة الوعي والإرادة! 🛡️",
    likes: 47,
    comments: 12,
    liked: false,
    tag: "وعي",
    tagColor: "#00D4AA",
  },
  {
    id: 2,
    author: "سارة أ.",
    avatar: "س",
    avatarColor: "from-[#EC4899] to-[#8B5CF6]",
    time: "منذ ٥ ساعات",
    content: "حضرت محاضرة توعوية رائعة اليوم عن مخاطر الإدمان الرقمي. لم أكن أعلم أن الألعاب والسوشيال ميديا يمكن أن تسبب إدماناً حقيقياً! شاركوا هذه المعلومة مع أبنائكم 📱",
    likes: 63,
    comments: 18,
    liked: true,
    tag: "توعية",
    tagColor: "#8B5CF6",
  },
  {
    id: 3,
    author: "خالد ن.",
    avatar: "خ",
    avatarColor: "from-[#F59E0B] to-[#EF4444]",
    time: "منذ ١ يوم",
    content: "نصيحة وقائية: إذا كنت في بيئة تشعر فيها بالضغط الاجتماعي، ضع خطة هروب مسبقة. قرر مسبقاً ما ستقول وكيف ستتصرف. الاستعداد المسبق يجعل الرفض أسهل بكثير 💪",
    likes: 89,
    comments: 24,
    liked: false,
    tag: "نصيحة",
    tagColor: "#F59E0B",
  },
  {
    id: 4,
    author: "فاطمة ر.",
    avatar: "ف",
    avatarColor: "from-[#10B981] to-[#3B82F6]",
    time: "منذ ٢ أيام",
    content: "شاركت اليوم في تنظيم ورشة توعوية في المدرسة. ٨٠ طالب حضروا وكانت ردود أفعالهم مذهلة! الجيل الجديد يريد المعلومة الصحيحة. نحن المسؤولون عن توصيلها 🎓",
    likes: 134,
    comments: 31,
    liked: false,
    tag: "تطوع",
    tagColor: "#10B981",
  },
];

const groups = [
  { name: "آباء واعون", members: 1240, icon: "👨‍👩‍👧", color: "#00D4AA", desc: "حماية الأبناء من الإدمان" },
  { name: "شباب واعٍ", members: 3560, icon: "🧑‍🎓", color: "#8B5CF6", desc: "وقاية الجيل الجديد" },
  { name: "معلمون وقائيون", members: 892, icon: "📚", color: "#F59E0B", desc: "التوعية في المدارس" },
  { name: "مجتمع صحي", members: 2100, icon: "🌿", color: "#10B981", desc: "حياة صحية بلا إدمان" },
];

export default function Community() {
  const [postsList, setPostsList] = useState(posts);
  const [newPost, setNewPost] = useState("");
  const [showNewPost, setShowNewPost] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const toggleLike = (id: number) => {
    setPostsList(prev => prev.map(p =>
      p.id === id ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 } : p
    ));
  };

  const handlePost = () => {
    if (!newPost.trim()) { toast.error("اكتب شيئاً أولاً"); return; }
    const post = {
      id: Date.now(),
      author: "أنت",
      avatar: "أ",
      avatarColor: "from-[#00D4AA] to-[#0EA5E9]",
      time: "الآن",
      content: newPost,
      likes: 0,
      comments: 0,
      liked: false,
      tag: "وعي",
      tagColor: "#00D4AA",
    };
    setPostsList(prev => [post, ...prev]);
    setNewPost("");
    setShowNewPost(false);
    toast.success("تم نشر مشاركتك! 🎉");
  };

  return (
    <div className="app-container bg-gradient-navy">
      <div className="orb w-72 h-72 opacity-8 top-10 -right-20" style={{ background: "#8B5CF6" }} />

      {/* Header */}
      <div className="mobile-header px-5 py-4">
        <div>
          <div className="text-[#00D4AA] text-xs font-bold uppercase tracking-wider mb-1">المجتمع</div>
          <h1 className="text-white font-black text-xl">مجتمع الوقاية</h1>
          <p className="text-white/40 text-xs mt-0.5">معاً نبني جيلاً واعياً</p>
        </div>
        <div className="flex items-center gap-2 mr-auto">
          <button
            onClick={() => setShowNewPost(!showNewPost)}
            className="w-9 h-9 rounded-xl flex items-center justify-center text-[#060B18]"
            style={{ background: "linear-gradient(135deg, #00D4AA, #0EA5E9)" }}
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="page-content overflow-y-auto">

        {/* Search */}
        <div className="px-4 mt-3">
          <div className="flex items-center gap-2 p-3 rounded-2xl glass-card border border-white/8">
            <Search className="w-4 h-4 text-white/30" />
            <input
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="ابحث في المجتمع..."
              className="flex-1 bg-transparent text-white/70 text-sm outline-none placeholder-white/25"
              dir="rtl"
            />
          </div>
        </div>

        {/* New Post */}
        {showNewPost && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mx-4 mt-3 p-4 rounded-2xl glass-card border border-[#00D4AA]/25"
          >
            <textarea
              value={newPost}
              onChange={e => setNewPost(e.target.value)}
              placeholder="شارك وعيك أو تجربتك الوقائية..."
              className="w-full h-24 bg-transparent text-white/80 text-sm resize-none outline-none placeholder-white/25"
              dir="rtl"
            />
            <div className="flex gap-2 mt-2">
              <button onClick={handlePost} className="flex-1 py-2 rounded-xl font-bold text-xs text-[#060B18]" style={{ background: "linear-gradient(135deg, #00D4AA, #0EA5E9)" }}>
                <Send className="w-3.5 h-3.5 inline ml-1" />نشر
              </button>
              <button onClick={() => setShowNewPost(false)} className="px-4 py-2 rounded-xl glass-card border border-white/10 text-white/50 text-xs font-bold">إلغاء</button>
            </div>
          </motion.div>
        )}

        {/* Groups */}
        <div className="px-4 mt-4">
          <h2 className="text-white font-black text-sm mb-3">مجموعات الوقاية</h2>
          <div className="flex gap-3 overflow-x-auto pb-1">
            {groups.map((group, idx) => (
              <motion.button
                key={idx}
                whileTap={{ scale: 0.95 }}
                onClick={() => toast.success(`انضممت لمجموعة ${group.name}!`)}
                className="flex-shrink-0 w-36 p-3 rounded-2xl glass-card border border-white/8 text-right"
              >
                <div className="text-2xl mb-2">{group.icon}</div>
                <div className="text-white font-black text-xs mb-0.5">{group.name}</div>
                <div className="text-white/40 text-[10px] mb-1.5">{group.desc}</div>
                <div className="text-[10px] font-bold" style={{ color: group.color }}>
                  {group.members.toLocaleString("ar-SA")} عضو
                </div>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Posts Feed */}
        <div className="px-4 mt-4 space-y-4 mb-4">
          <h2 className="text-white font-black text-sm">آخر المشاركات</h2>
          {postsList
            .filter(p => !searchQuery || p.content.includes(searchQuery) || p.author.includes(searchQuery))
            .map((post, idx) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.06 }}
                className="p-4 rounded-2xl glass-card border border-white/8"
              >
                {/* Post Header */}
                <div className="flex items-center gap-2 mb-3">
                  <div className={cn("w-8 h-8 rounded-full flex items-center justify-center font-black text-white text-xs bg-gradient-to-br", post.avatarColor)}>
                    {post.avatar}
                  </div>
                  <div className="flex-1">
                    <div className="text-white font-black text-xs">{post.author}</div>
                    <div className="text-white/30 text-[10px]">{post.time}</div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold" style={{ background: `${post.tagColor}20`, color: post.tagColor }}>
                    {post.tag}
                  </span>
                </div>

                {/* Content */}
                <p className="text-white/70 text-xs leading-relaxed mb-3">{post.content}</p>

                {/* Actions */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => toggleLike(post.id)}
                    className={cn("flex items-center gap-1 text-xs font-bold transition-all", post.liked ? "text-[#EF4444]" : "text-white/30")}
                  >
                    <Heart className={cn("w-3.5 h-3.5", post.liked && "fill-[#EF4444]")} />
                    {post.likes}
                  </button>
                  <button
                    onClick={() => toast.info("خاصية التعليقات قادمة قريباً")}
                    className="flex items-center gap-1 text-xs font-bold text-white/30"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    {post.comments}
                  </button>
                  <button
                    onClick={() => toast.success("تم نسخ الرابط للمشاركة")}
                    className="flex items-center gap-1 text-xs font-bold text-white/30 mr-auto"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.div>
            ))}
        </div>

      </div>
    </div>
  );
}
