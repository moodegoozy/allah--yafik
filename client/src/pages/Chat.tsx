/**
 * Chat - نظام الدردشة المباشرة
 * Design: Dark Luxury Wellness - "الله يعافيك"
 * Features: دردشة مع متخصصين، مجموعات دعم، رسائل طوارئ
 */
import { useState, useRef, useEffect } from "react";
import {
  Send, Phone, Video, MoreVertical, Search,
  Shield, Heart, Star, Clock, CheckCheck,
  Check, Smile, Paperclip, Mic, ArrowRight,
  AlertTriangle, Users, UserCheck, Sparkles, Bot
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

const initialChats: Chat[] = [
  {
    id: "ai",
    name: "مساعد الله يعافيك",
    role: "ذكاء اصطناعي • متاح ٢٤/٧",
    avatar: "🤖",
    online: true,
    lastMsg: "كيف حالك اليوم؟ أنا هنا للمساعدة",
    lastTime: "الآن",
    unread: 1,
    type: "ai",
    messages: [
      { id: "1", text: "أهلاً بك في برنامج الله يعافيك! أنا مساعدك الذكي، كيف يمكنني مساعدتك اليوم؟", sender: "other", time: "٩:٠٠ ص" },
      { id: "2", text: "يمكنني مساعدتك في: التعامل مع الإغراء، تمارين الاسترخاء، معلومات عن التعافي، أو مجرد الحديث عندما تحتاج أحداً يستمع.", sender: "other", time: "٩:٠١ ص" },
    ],
  },
  {
    id: "dr-ahmed",
    name: "د. أحمد الشمري",
    role: "أخصائي نفسي • معالج إدمان",
    avatar: "أ",
    online: true,
    lastMsg: "كيف مرّ أسبوعك؟ هل التزمت بالخطة؟",
    lastTime: "١٠:٣٠ ص",
    unread: 2,
    type: "specialist",
    messages: [
      { id: "1", text: "أهلاً! أنا د. أحمد، معالجك المخصص في البرنامج.", sender: "other", time: "٨:٠٠ ص" },
      { id: "2", text: "كيف مرّ أسبوعك؟ هل التزمت بالخطة التي وضعناها معاً؟", sender: "other", time: "١٠:٣٠ ص" },
    ],
  },
  {
    id: "group-riyadh",
    name: "مجموعة دعم الرياض",
    role: "١٢ عضو • مجموعة دعم",
    avatar: "م",
    online: true,
    lastMsg: "خالد: اليوم ٣٠ من التعافي! الحمد لله",
    lastTime: "أمس",
    unread: 5,
    type: "group",
    messages: [
      { id: "1", text: "أهلاً بالجميع في مجموعة دعم الرياض 🌟", sender: "other", time: "أمس" },
      { id: "2", text: "خالد: اليوم ٣٠ من التعافي! الحمد لله على هذا الإنجاز", sender: "other", time: "أمس" },
      { id: "3", text: "ما شاء الله خالد! نفخر بك 💪", sender: "other", time: "أمس" },
    ],
  },
  {
    id: "dr-sara",
    name: "أ. سارة المطيري",
    role: "مرشدة اجتماعية • متخصصة أسرة",
    avatar: "س",
    online: false,
    lastMsg: "موعدنا القادم الأربعاء ٣ عصراً",
    lastTime: "٢ أمس",
    unread: 0,
    type: "specialist",
    messages: [
      { id: "1", text: "أهلاً! موعدنا القادم الأربعاء ٣ عصراً. هل هذا مناسب؟", sender: "other", time: "٢ أمس" },
    ],
  },
];

const aiResponses = [
  "أفهم ما تشعر به. الإغراء شعور طبيعي، وأنت قادر على تجاوزه. جرّب تمرين التنفس ٤-٧-٨ الآن.",
  "أنت لست وحدك في هذه الرحلة. كل يوم تصمد فيه هو انتصار حقيقي يستحق الاحتفال.",
  "عندما تشعر بالإغراء، حاول تغيير البيئة فوراً. اخرج للمشي، اتصل بصديق، أو افتح تطبيق التمارين.",
  "تذكر سبب بدئك لهذه الرحلة. ما الذي تريد تحقيقه بعد التعافي؟",
  "هل جربت تقنية التأريض؟ انظر حولك وسمّ ٥ أشياء تراها، ٤ تلمسها، ٣ تسمعها.",
  "أنصحك بالتواصل مع د. أحمد مباشرة إذا كان الإغراء شديداً. يمكنك الضغط على زر الطوارئ.",
  "إحصائياً، الإغراء يبلغ ذروته في ٢٠ دقيقة ثم يتراجع. صمود ٢٠ دقيقة يكفي!",
];

export default function Chat() {
  const [chats, setChats] = useState<Chat[]>(initialChats);
  const [activeChat, setActiveChat] = useState<Chat>(initialChats[0]);
  const [inputText, setInputText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showMobileList, setShowMobileList] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeChat.messages]);

  const sendMessage = () => {
    if (!inputText.trim()) return;

    const newMsg: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: "me",
      time: new Date().toLocaleTimeString("ar-SA", { hour: "2-digit", minute: "2-digit" }),
      status: "sent",
    };

    const updatedChats = chats.map(c => {
      if (c.id === activeChat.id) {
        return { ...c, messages: [...c.messages, newMsg], lastMsg: inputText, lastTime: "الآن" };
      }
      return c;
    });
    setChats(updatedChats);
    setActiveChat(prev => ({ ...prev, messages: [...prev.messages, newMsg], lastMsg: inputText }));
    setInputText("");

    // AI auto-response
    if (activeChat.type === "ai") {
      setTimeout(() => {
        const aiMsg: Message = {
          id: (Date.now() + 1).toString(),
          text: aiResponses[Math.floor(Math.random() * aiResponses.length)],
          sender: "other",
          time: new Date().toLocaleTimeString("ar-SA", { hour: "2-digit", minute: "2-digit" }),
        };
        setChats(prev => prev.map(c => c.id === "ai" ? { ...c, messages: [...c.messages, aiMsg] } : c));
        setActiveChat(prev => ({ ...prev, messages: [...prev.messages, aiMsg] }));
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
          time: new Date().toLocaleTimeString("ar-SA", { hour: "2-digit", minute: "2-digit" }),
        };
        setChats(prev => prev.map(c => c.id === activeChat.id ? { ...c, messages: [...c.messages, reply] } : c));
        setActiveChat(prev => ({ ...prev, messages: [...prev.messages, reply] }));
      }, 2000);
    }
  };

  const selectChat = (chat: Chat) => {
    const updatedChat = { ...chat, unread: 0 };
    setActiveChat(updatedChat);
    setChats(prev => prev.map(c => c.id === chat.id ? updatedChat : c));
    setShowMobileList(false);
  };

  const filteredChats = chats.filter(c =>
    c.name.includes(searchQuery) || c.role.includes(searchQuery)
  );

  return (
    <div className="flex h-screen bg-[#060B18] overflow-hidden">
      {/* Chat List Sidebar */}
      <div className={`w-80 flex-shrink-0 bg-[#0A0F1E] border-l border-white/5 flex flex-col ${showMobileList ? "flex" : "hidden md:flex"}`}>
        {/* Header */}
        <div className="p-5 border-b border-white/5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white font-black text-lg">الدردشة</h2>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
              <span className="text-[#10B981] text-xs font-bold">متصل</span>
            </div>
          </div>
          <div className="relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <input
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="بحث في المحادثات..."
              className="w-full bg-white/4 border border-white/10 rounded-xl pr-10 pl-4 py-2.5 text-white placeholder-white/25 focus:outline-none focus:border-white/20 text-sm"
            />
          </div>
        </div>

        {/* Emergency Button */}
        <div className="px-4 py-3 border-b border-white/5">
          <a
            href={`tel:${CONTACT_PHONE}`}
            className="flex items-center gap-3 p-3 rounded-xl bg-[#EF4444]/10 border border-[#EF4444]/25 hover:bg-[#EF4444]/20 transition-all group"
          >
            <div className="w-9 h-9 rounded-xl bg-[#EF4444]/20 flex items-center justify-center group-hover:scale-110 transition-transform">
              <AlertTriangle className="w-4.5 h-4.5 text-[#EF4444]" />
            </div>
            <div>
              <div className="text-[#EF4444] font-black text-sm">خط الطوارئ</div>
              <div className="text-white/35 text-xs font-numbers">{CONTACT_PHONE}</div>
            </div>
            <Phone className="w-4 h-4 text-[#EF4444] mr-auto" />
          </a>
        </div>

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {filteredChats.map(chat => (
            <button
              key={chat.id}
              onClick={() => selectChat(chat)}
              className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all text-right ${
                activeChat.id === chat.id
                  ? "bg-[#00D4AA]/10 border border-[#00D4AA]/20"
                  : "hover:bg-white/4"
              }`}
            >
              {/* Avatar */}
              <div className="relative flex-shrink-0">
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center font-black text-lg ${
                  chat.type === "ai" ? "bg-gradient-to-br from-[#8B5CF6] to-[#3B82F6] text-white" :
                  chat.type === "group" ? "bg-gradient-to-br from-[#F59E0B] to-[#EF4444] text-white" :
                  "bg-gradient-to-br from-[#00D4AA]/30 to-[#0EA5E9]/30 text-[#00D4AA]"
                }`}>
                  {chat.type === "ai" ? <Bot className="w-5 h-5" /> : chat.avatar}
                </div>
                {chat.online && (
                  <div className="absolute -bottom-0.5 -left-0.5 w-3 h-3 rounded-full bg-[#10B981] border-2 border-[#0A0F1E]" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-0.5">
                  <span className="text-white font-bold text-sm truncate">{chat.name}</span>
                  <span className="text-white/30 text-xs flex-shrink-0 mr-2">{chat.lastTime}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/40 text-xs truncate">{chat.lastMsg}</span>
                  {chat.unread > 0 && (
                    <span className="flex-shrink-0 mr-2 w-5 h-5 rounded-full bg-[#00D4AA] text-[#060B18] text-xs font-black flex items-center justify-center font-numbers">
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
      <div className={`flex-1 flex flex-col ${!showMobileList ? "flex" : "hidden md:flex"}`}>
        {/* Chat Header */}
        <div className="flex items-center gap-4 px-6 py-4 border-b border-white/5 bg-[#0A0F1E]/50 backdrop-blur-sm">
          <button onClick={() => setShowMobileList(true)} className="md:hidden text-white/40 hover:text-white">
            <ArrowRight className="w-5 h-5" />
          </button>

          <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black ${
            activeChat.type === "ai" ? "bg-gradient-to-br from-[#8B5CF6] to-[#3B82F6] text-white" :
            activeChat.type === "group" ? "bg-gradient-to-br from-[#F59E0B] to-[#EF4444] text-white" :
            "bg-gradient-to-br from-[#00D4AA]/30 to-[#0EA5E9]/30 text-[#00D4AA]"
          }`}>
            {activeChat.type === "ai" ? <Bot className="w-5 h-5" /> : activeChat.avatar}
          </div>

          <div className="flex-1">
            <div className="text-white font-bold text-sm">{activeChat.name}</div>
            <div className="flex items-center gap-1.5">
              {activeChat.online && <div className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />}
              <span className="text-white/35 text-xs">{activeChat.role}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button onClick={() => toast.info("جاري الاتصال...")} className="p-2 rounded-xl glass-card border border-white/8 text-white/40 hover:text-[#00D4AA] transition-colors">
              <Phone className="w-4 h-4" />
            </button>
            <button onClick={() => toast.info("جاري بدء مكالمة فيديو...")} className="p-2 rounded-xl glass-card border border-white/8 text-white/40 hover:text-[#00D4AA] transition-colors">
              <Video className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {/* AI Disclaimer */}
          {activeChat.type === "ai" && (
            <div className="flex justify-center">
              <div className="px-4 py-2 rounded-xl bg-[#8B5CF6]/10 border border-[#8B5CF6]/20 text-[#8B5CF6] text-xs flex items-center gap-2">
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
                <div className={`max-w-xs lg:max-w-md ${msg.sender === "me" ? "items-start" : "items-end"} flex flex-col gap-1`}>
                  <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                    msg.sender === "me"
                      ? "bg-gradient-to-br from-[#00D4AA] to-[#0EA5E9] text-[#060B18] font-medium rounded-tr-sm"
                      : activeChat.type === "ai"
                        ? "bg-[#8B5CF6]/15 border border-[#8B5CF6]/20 text-white rounded-tl-sm"
                        : "bg-white/8 border border-white/8 text-white rounded-tl-sm"
                  }`}>
                    {msg.text}
                  </div>
                  <div className={`flex items-center gap-1 text-white/25 text-xs ${msg.sender === "me" ? "" : "flex-row-reverse"}`}>
                    <span>{msg.time}</span>
                    {msg.sender === "me" && (
                      msg.status === "read" ? <CheckCheck className="w-3 h-3 text-[#00D4AA]" /> : <Check className="w-3 h-3" />
                    )}
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
            {["أشعر بالإغراء", "أحتاج تمرين تنفس", "كيف أتعامل مع الضغط؟", "أريد التحدث"].map(q => (
              <button
                key={q}
                onClick={() => { setInputText(q); }}
                className="flex-shrink-0 px-3 py-1.5 rounded-xl bg-[#8B5CF6]/10 border border-[#8B5CF6]/20 text-[#8B5CF6] text-xs font-bold hover:bg-[#8B5CF6]/20 transition-colors"
              >
                {q}
              </button>
            ))}
          </div>
        )}

        {/* Input Area */}
        <div className="px-6 py-4 border-t border-white/5 bg-[#0A0F1E]/30">
          <div className="flex items-center gap-3">
            <button onClick={() => toast.info("ميزة الملفات قادمة قريباً")} className="p-2.5 rounded-xl glass-card border border-white/8 text-white/30 hover:text-white/60 transition-colors flex-shrink-0">
              <Paperclip className="w-4 h-4" />
            </button>

            <div className="flex-1 relative">
              <input
                value={inputText}
                onChange={e => setInputText(e.target.value)}
                onKeyDown={e => e.key === "Enter" && !e.shiftKey && sendMessage()}
                placeholder="اكتب رسالتك..."
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/25 focus:outline-none focus:border-white/20 text-sm pr-4 pl-10"
              />
              <button onClick={() => toast.info("الرموز التعبيرية قادمة قريباً")} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/25 hover:text-white/50">
                <Smile className="w-4 h-4" />
              </button>
            </div>

            <button
              onClick={sendMessage}
              disabled={!inputText.trim()}
              className="p-2.5 rounded-xl flex items-center justify-center transition-all hover:scale-110 disabled:opacity-40 disabled:scale-100 flex-shrink-0"
              style={{ background: inputText.trim() ? "linear-gradient(135deg, #00D4AA, #0EA5E9)" : "rgba(255,255,255,0.05)" }}
            >
              <Send className={`w-4 h-4 ${inputText.trim() ? "text-[#060B18]" : "text-white/30"}`} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
