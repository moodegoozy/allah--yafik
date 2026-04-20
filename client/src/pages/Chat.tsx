/**
 * Chat - نظام الدردشة المباشرة
 * Design: Dark Luxury Wellness - "الله يعافيك"
 * Features: دردشة مع متخصصين، مجموعات دعم، رسائل طوارئ
 */
import { useState, useRef, useEffect } from "react";
import {
  Send,
  Phone,
  Video,
  MoreVertical,
  Search,
  MessageSquare,
  Shield,
  Heart,
  Star,
  Clock,
  CheckCheck,
  Check,
  Smile,
  Paperclip,
  Mic,
  ArrowRight,
  AlertTriangle,
  Users,
  UserCheck,
  Sparkles,
  Bot,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

const CONTACT_PHONE = "0546192019";

type Message = {
  id: string;
  text: string;
  sender: "me" | "other";
  time: string;
  status?: "sent" | "delivered" | "read";
};

type Chat = {
  id: string;
  name: string;
  role: string;
  avatar: string;
  online: boolean;
  lastMsg: string;
  lastTime: string;
  unread: number;
  type: "specialist" | "group" | "ai";
  messages: Message[];
};

// Mock data removed — see git history to restore
const initialChats: Chat[] = [];

// Mock data removed — see git history to restore
const aiResponses: string[] = [];

export default function Chat() {
  const [chats, setChats] = useState<Chat[]>(initialChats);
  const [activeChat, setActiveChat] = useState<Chat | null>(
    initialChats[0] ?? null
  );
  const [inputText, setInputText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showMobileList, setShowMobileList] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeChat?.messages]);

  const sendMessage = () => {
    if (!inputText.trim() || !activeChat) return;

    const newMsg: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: "me",
      time: new Date().toLocaleTimeString("ar-SA", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      status: "sent",
    };

    const updatedChats = chats.map(c => {
      if (c.id === activeChat.id) {
        return {
          ...c,
          messages: [...c.messages, newMsg],
          lastMsg: inputText,
          lastTime: "الآن",
        };
      }
      return c;
    });
    setChats(updatedChats);
    setActiveChat(prev =>
      prev
        ? { ...prev, messages: [...prev.messages, newMsg], lastMsg: inputText }
        : prev
    );
    setInputText("");

    // AI auto-response
    if (activeChat.type === "ai") {
      setTimeout(() => {
        const aiMsg: Message = {
          id: (Date.now() + 1).toString(),
          text: aiResponses[Math.floor(Math.random() * aiResponses.length)],
          sender: "other",
          time: new Date().toLocaleTimeString("ar-SA", {
            hour: "2-digit",
            minute: "2-digit",
          }),
        };
        setChats(prev =>
          prev.map(c =>
            c.id === "ai" ? { ...c, messages: [...c.messages, aiMsg] } : c
          )
        );
        setActiveChat(prev =>
          prev ? { ...prev, messages: [...prev.messages, aiMsg] } : prev
        );
      }, 1200);
    } else if (activeChat.type === "specialist") {
      setTimeout(() => {
        const replies = [
          "شكراً لمشاركتي. هذا مهم جداً.",
          "أسمعك جيداً. دعنا نتحدث عن هذا بالتفصيل.",
          "أنت تسير في الاتجاه الصحيح. استمر.",
          "هل يمكنك إخباري أكثر عن هذا الشعور؟",
        ];
        const reply: Message = {
          id: (Date.now() + 1).toString(),
          text: replies[Math.floor(Math.random() * replies.length)],
          sender: "other",
          time: new Date().toLocaleTimeString("ar-SA", {
            hour: "2-digit",
            minute: "2-digit",
          }),
        };
        setChats(prev =>
          prev.map(c =>
            c.id === activeChat.id
              ? { ...c, messages: [...c.messages, reply] }
              : c
          )
        );
        setActiveChat(prev =>
          prev ? { ...prev, messages: [...prev.messages, reply] } : prev
        );
      }, 2000);
    }
  };

  const selectChat = (chat: Chat) => {
    const updatedChat = { ...chat, unread: 0 };
    setActiveChat(updatedChat);
    setChats(prev => prev.map(c => (c.id === chat.id ? updatedChat : c)));
    setShowMobileList(false);
  };

  const filteredChats = chats.filter(
    c => c.name.includes(searchQuery) || c.role.includes(searchQuery)
  );

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Chat List Sidebar */}
      <div
        className={`w-80 flex-shrink-0 bg-background border-l border-border flex flex-col ${showMobileList ? "flex" : "hidden md:flex"}`}
      >
        {/* Header */}
        <div className="p-5 border-b border-border">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-foreground font-black text-lg">الدردشة</h2>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-emerald-500 text-xs font-bold">متصل</span>
            </div>
          </div>
          <div className="relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/70" />
            <input
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="بحث في المحادثات..."
              className="w-full bg-secondary/50 border border-border rounded-xl pr-10 pl-4 py-2.5 text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-border text-sm"
            />
          </div>
        </div>

        {/* Emergency Button */}
        <div className="px-4 py-3 border-b border-border">
          <a
            href={`tel:${CONTACT_PHONE}`}
            className="flex items-center gap-3 p-3 rounded-xl bg-destructive/10 border border-destructive/25 hover:bg-destructive/20 transition-all group"
          >
            <div className="w-9 h-9 rounded-xl bg-destructive/20 flex items-center justify-center group-hover:scale-110 transition-transform">
              <AlertTriangle className="w-4.5 h-4.5 text-destructive" />
            </div>
            <div>
              <div className="text-destructive font-black text-sm">
                خط الطوارئ
              </div>
              <div className="text-muted-foreground/70 text-xs font-numbers">
                {CONTACT_PHONE}
              </div>
            </div>
            <Phone className="w-4 h-4 text-destructive mr-auto" />
          </a>
        </div>

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {filteredChats.map(chat => (
            <button
              key={chat.id}
              onClick={() => selectChat(chat)}
              className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all text-right ${
                activeChat?.id === chat.id
                  ? "bg-primary/10 border border-primary/20"
                  : "hover:bg-secondary/50"
              }`}
            >
              {/* Avatar */}
              <div className="relative flex-shrink-0">
                <div
                  className={`w-11 h-11 rounded-xl flex items-center justify-center font-black text-lg ${
                    chat.type === "ai"
                      ? "bg-gradient-to-br from-violet-500 to-blue-500 text-foreground"
                      : chat.type === "group"
                        ? "bg-gradient-to-br from-amber-500 to-red-500 text-foreground"
                        : "bg-gradient-to-br from-primary/30 to-sky-500/30 text-primary"
                  }`}
                >
                  {chat.type === "ai" ? (
                    <Bot className="w-5 h-5" />
                  ) : (
                    chat.avatar
                  )}
                </div>
                {chat.online && (
                  <div className="absolute -bottom-0.5 -left-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-background" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-0.5">
                  <span className="text-foreground font-bold text-sm truncate">
                    {chat.name}
                  </span>
                  <span className="text-muted-foreground/70 text-xs flex-shrink-0 mr-2">
                    {chat.lastTime}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground text-xs truncate">
                    {chat.lastMsg}
                  </span>
                  {chat.unread > 0 && (
                    <span className="flex-shrink-0 mr-2 w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs font-black flex items-center justify-center font-numbers">
                      {chat.unread}
                    </span>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Chat Window */}
      <div
        className={`flex-1 flex flex-col ${!showMobileList ? "flex" : "hidden md:flex"}`}
      >
        {!activeChat ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
            <MessageSquare className="w-16 h-16 text-muted-foreground/40 mb-4" />
            <h3 className="text-muted-foreground font-bold text-lg mb-2">
              لا توجد محادثات
            </h3>
            <p className="text-muted-foreground/60 text-sm">ستتوفر المحادثات قريباً</p>
          </div>
        ) : (
          <>
            {/* Chat Header */}
            <div className="flex items-center gap-4 px-6 py-4 border-b border-border bg-background/50 backdrop-blur-sm">
              <button
                onClick={() => setShowMobileList(true)}
                className="md:hidden text-muted-foreground hover:text-foreground"
              >
                <ArrowRight className="w-5 h-5" />
              </button>

              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center font-black ${
                  activeChat.type === "ai"
                    ? "bg-gradient-to-br from-violet-500 to-blue-500 text-foreground"
                    : activeChat.type === "group"
                      ? "bg-gradient-to-br from-amber-500 to-red-500 text-foreground"
                      : "bg-gradient-to-br from-primary/30 to-sky-500/30 text-primary"
                }`}
              >
                {activeChat.type === "ai" ? (
                  <Bot className="w-5 h-5" />
                ) : (
                  activeChat.avatar
                )}
              </div>

              <div className="flex-1">
                <div className="text-foreground font-bold text-sm">
                  {activeChat.name}
                </div>
                <div className="flex items-center gap-1.5">
                  {activeChat.online && (
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  )}
                  <span className="text-muted-foreground/70 text-xs">
                    {activeChat.role}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => toast.info("جاري الاتصال...")}
                  className="p-2 rounded-xl glass-card border border-border text-muted-foreground hover:text-primary transition-colors"
                >
                  <Phone className="w-4 h-4" />
                </button>
                <button
                  onClick={() => toast.info("جاري بدء مكالمة فيديو...")}
                  className="p-2 rounded-xl glass-card border border-border text-muted-foreground hover:text-primary transition-colors"
                >
                  <Video className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {/* AI Disclaimer */}
              {activeChat.type === "ai" && (
                <div className="flex justify-center">
                  <div className="px-4 py-2 rounded-xl bg-violet-500/10 border border-violet-500/20 text-violet-500 text-xs flex items-center gap-2">
                    <Bot className="w-3.5 h-3.5" />
                    مساعد ذكاء اصطناعي - للحالات الطارئة اتصل بـ {CONTACT_PHONE}
                  </div>
                </div>
              )}

              <AnimatePresence>
                {activeChat.messages.map((msg, i) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.02 }}
                    className={`flex ${msg.sender === "me" ? "justify-start" : "justify-end"}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md ${msg.sender === "me" ? "items-start" : "items-end"} flex flex-col gap-1`}
                    >
                      <div
                        className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                          msg.sender === "me"
                            ? "bg-gradient-to-br from-primary to-sky-500 text-primary-foreground font-medium rounded-tr-sm"
                            : activeChat.type === "ai"
                              ? "bg-violet-500/15 border border-violet-500/20 text-foreground rounded-tl-sm"
                              : "bg-secondary/80 border border-border text-foreground rounded-tl-sm"
                        }`}
                      >
                        {msg.text}
                      </div>
                      <div
                        className={`flex items-center gap-1 text-muted-foreground/60 text-xs ${msg.sender === "me" ? "" : "flex-row-reverse"}`}
                      >
                        <span>{msg.time}</span>
                        {msg.sender === "me" &&
                          (msg.status === "read" ? (
                            <CheckCheck className="w-3 h-3 text-primary" />
                          ) : (
                            <Check className="w-3 h-3" />
                          ))}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Replies for AI */}
            {activeChat.type === "ai" && (
              <div className="px-6 pb-2 flex gap-2 overflow-x-auto">
                {[
                  "أشعر بالإغراء",
                  "أحتاج تمرين تنفس",
                  "كيف أتعامل مع الضغط؟",
                  "أريد التحدث",
                ].map(q => (
                  <button
                    key={q}
                    onClick={() => {
                      setInputText(q);
                    }}
                    className="flex-shrink-0 px-3 py-1.5 rounded-xl bg-violet-500/10 border border-violet-500/20 text-violet-500 text-xs font-bold hover:bg-violet-500/20 transition-colors"
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}

            {/* Input Area */}
            <div className="px-6 py-4 border-t border-border bg-background/30">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => toast.info("ميزة الملفات قادمة قريباً")}
                  className="p-2.5 rounded-xl glass-card border border-border text-muted-foreground/70 hover:text-muted-foreground transition-colors flex-shrink-0"
                >
                  <Paperclip className="w-4 h-4" />
                </button>

                <div className="flex-1 relative">
                  <input
                    value={inputText}
                    onChange={e => setInputText(e.target.value)}
                    onKeyDown={e =>
                      e.key === "Enter" && !e.shiftKey && sendMessage()
                    }
                    placeholder="اكتب رسالتك..."
                    className="w-full bg-secondary/60 border border-border rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-border text-sm pr-4 pl-10"
                  />
                  <button
                    onClick={() => toast.info("الرموز التعبيرية قادمة قريباً")}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/60 hover:text-muted-foreground"
                  >
                    <Smile className="w-4 h-4" />
                  </button>
                </div>

                <button
                  onClick={sendMessage}
                  disabled={!inputText.trim()}
                  className="p-2.5 rounded-xl flex items-center justify-center transition-all hover:scale-110 disabled:opacity-40 disabled:scale-100 flex-shrink-0"
                  style={{
                    background: inputText.trim()
                      ? "linear-gradient(135deg, oklch(0.75 0.18 175), oklch(0.68 0.16 230))"
                      : "var(--secondary)",
                  }}
                >
                  <Send
                    className={`w-4 h-4 ${inputText.trim() ? "text-primary-foreground" : "text-muted-foreground/70"}`}
                  />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
