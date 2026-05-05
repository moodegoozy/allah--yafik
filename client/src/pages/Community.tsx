/**
 * Community - مجتمع الوعي والوقاية
 * Design: Dark Luxury Wellness - "صون"
 * الهدف: مجتمع داعم للوقاية من الإدمان
 */
import { useState } from "react";
import { toast } from "sonner";
import {
  Users,
  Heart,
  MessageCircle,
  Share2,
  Plus,
  Search,
  Award,
  Shield,
  Send,
  ThumbsUp,
  Bookmark,
  Lightbulb,
  Bell,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

// Mock data removed — see git history to restore
const posts: {
  id: number;
  author: string;
  avatar: string;
  avatarColor: string;
  time: string;
  content: string;
  likes: number;
  comments: number;
  liked: boolean;
  tag: string;
  tagColor: string;
}[] = [];

// Mock data removed — see git history to restore
const groups: {
  name: string;
  members: number;
  icon: string;
  color: string;
  desc: string;
}[] = [];

export default function Community() {
  const [postsList, setPostsList] = useState(posts);
  const [newPost, setNewPost] = useState("");
  const [showNewPost, setShowNewPost] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const toggleLike = (id: number) => {
    setPostsList(prev =>
      prev.map(p =>
        p.id === id
          ? {
              ...p,
              liked: !p.liked,
              likes: p.liked ? p.likes - 1 : p.likes + 1,
            }
          : p
      )
    );
  };

  const handlePost = () => {
    if (!newPost.trim()) {
      toast.error("اكتب شيئاً أولاً");
      return;
    }
    const post = {
      id: Date.now(),
      author: "أنت",
      avatar: "أ",
      avatarColor: "from-primary to-sky-500",
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
      <div
        className="orb w-72 h-72 opacity-8 top-10 -right-20"
        style={{ background: "oklch(0.55 0.25 290)" }}
      />

      {/* Header */}
      <div className="mobile-header px-5 py-4">
        <div>
          <div className="text-primary text-xs font-bold uppercase tracking-wider mb-1">
            المجتمع
          </div>
          <h1 className="text-foreground font-black text-xl">مجتمع الوقاية</h1>
          <p className="text-muted-foreground text-xs mt-0.5">معاً نبني جيلاً واعياً</p>
        </div>
        <div className="flex items-center gap-2 mr-auto">
          <button
            onClick={() => setShowNewPost(!showNewPost)}
            className="w-9 h-9 rounded-xl flex items-center justify-center text-primary-foreground bg-gradient-to-br from-primary to-sky-500"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="page-content overflow-y-auto">
        {/* Search */}
        <div className="px-4 mt-3">
          <div className="flex items-center gap-2 p-3 rounded-2xl glass-card border border-border">
            <Search className="w-4 h-4 text-muted-foreground/70" />
            <input
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="ابحث في المجتمع..."
              className="flex-1 bg-transparent text-foreground/70 text-sm outline-none placeholder:text-muted-foreground/50"
              dir="rtl"
            />
          </div>
        </div>

        {/* New Post */}
        {showNewPost && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mx-4 mt-3 p-4 rounded-2xl glass-card border border-primary/25"
          >
            <textarea
              value={newPost}
              onChange={e => setNewPost(e.target.value)}
              placeholder="شارك وعيك أو تجربتك الوقائية..."
              className="w-full h-24 bg-transparent text-foreground/80 text-sm resize-none outline-none placeholder:text-muted-foreground/50"
              dir="rtl"
            />
            <div className="flex gap-2 mt-2">
              <button
                onClick={handlePost}
                className="flex-1 py-2 rounded-xl font-bold text-xs text-primary-foreground"
                style={{
                  background: "linear-gradient(135deg, oklch(0.75 0.18 175), oklch(0.68 0.16 230))",
                }}
              >
                <Send className="w-3.5 h-3.5 inline ml-1" />
                نشر
              </button>
              <button
                onClick={() => setShowNewPost(false)}
                className="px-4 py-2 rounded-xl glass-card border border-border text-muted-foreground text-xs font-bold"
              >
                إلغاء
              </button>
            </div>
          </motion.div>
        )}

        {/* Groups */}
        <div className="px-4 mt-4">
          <h2 className="text-foreground font-black text-sm mb-3">
            مجموعات الوقاية
          </h2>
          {groups.length > 0 ? (
            <div className="flex gap-3 overflow-x-auto pb-1">
              {groups.map((group, idx) => (
                <motion.button
                  key={idx}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => toast.success(`انضممت لمجموعة ${group.name}!`)}
                  className="flex-shrink-0 w-36 p-3 rounded-2xl glass-card border border-border text-right"
                >
                  <div className="text-2xl mb-2">{group.icon}</div>
                  <div className="text-foreground font-black text-xs mb-0.5">
                    {group.name}
                  </div>
                  <div className="text-muted-foreground text-[10px] mb-1.5">
                    {group.desc}
                  </div>
                  <div
                    className="text-[10px] font-bold"
                    style={{ color: group.color }}
                  >
                    {group.members.toLocaleString("ar-SA")} عضو
                  </div>
                </motion.button>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 rounded-2xl glass-card border border-border">
              <Users className="w-8 h-8 text-muted-foreground/40 mx-auto mb-2" />
              <p className="text-muted-foreground/70 text-xs">لا توجد مجموعات بعد</p>
            </div>
          )}
        </div>

        {/* Posts Feed */}
        <div className="px-4 mt-4 space-y-4 mb-4">
          <h2 className="text-foreground font-black text-sm">آخر المشاركات</h2>
          {postsList.filter(
            p =>
              !searchQuery ||
              p.content.includes(searchQuery) ||
              p.author.includes(searchQuery)
          ).length === 0 && (
            <div className="text-center py-12">
              <MessageCircle className="w-10 h-10 text-muted-foreground/40 mx-auto mb-3" />
              <p className="text-muted-foreground/70 text-sm">لا توجد منشورات بعد</p>
              <p className="text-muted-foreground/60 text-xs mt-1">كن أول من يشارك!</p>
            </div>
          )}
          {postsList
            .filter(
              p =>
                !searchQuery ||
                p.content.includes(searchQuery) ||
                p.author.includes(searchQuery)
            )
            .map((post, idx) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.06 }}
                className="p-4 rounded-2xl glass-card border border-border"
              >
                {/* Post Header */}
                <div className="flex items-center gap-2 mb-3">
                  <div
                    className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center font-black text-foreground text-xs bg-gradient-to-br",
                      post.avatarColor
                    )}
                  >
                    {post.avatar}
                  </div>
                  <div className="flex-1">
                    <div className="text-foreground font-black text-xs">
                      {post.author}
                    </div>
                    <div className="text-muted-foreground/70 text-[10px]">{post.time}</div>
                  </div>
                  <span
                    className="px-2 py-0.5 rounded-full text-[10px] font-bold"
                    style={{
                      background: `${post.tagColor}20`,
                      color: post.tagColor,
                    }}
                  >
                    {post.tag}
                  </span>
                </div>

                {/* Content */}
                <p className="text-foreground/70 text-xs leading-relaxed mb-3">
                  {post.content}
                </p>

                {/* Actions */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => toggleLike(post.id)}
                    className={cn(
                      "flex items-center gap-1 text-xs font-bold transition-all",
                      post.liked ? "text-destructive" : "text-muted-foreground/70"
                    )}
                  >
                    <Heart
                      className={cn(
                        "w-3.5 h-3.5",
                        post.liked && "fill-red-500"
                      )}
                    />
                    {post.likes}
                  </button>
                  <button
                    onClick={() => toast.info("خاصية التعليقات قادمة قريباً")}
                    className="flex items-center gap-1 text-xs font-bold text-muted-foreground/70"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    {post.comments}
                  </button>
                  <button
                    onClick={() => toast.success("تم نسخ الرابط للمشاركة")}
                    className="flex items-center gap-1 text-xs font-bold text-muted-foreground/70 mr-auto"
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
