/*
 * Design: Dark Luxury Wellness - SOS Emergency Button
 * Purpose: Always-visible emergency help button
 * Style: Pulsing red button, modal overlay
 */
import { useState } from "react";
import { Phone, X, AlertTriangle, Heart, Wind, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const emergencySteps = [
  {
    icon: Wind,
    title: "تنفس ببطء",
    desc: "خذ نفساً عميقاً لمدة 4 ثوانٍ، احبسه 4 ثوانٍ، أخرجه 4 ثوانٍ",
    color: "#00D4AA",
  },
  {
    icon: Heart,
    title: "ذكّر نفسك",
    desc: "هذا الإغراء مؤقت وسيمر. أنت أقوى منه. فكّر في سبب بدء رحلتك",
    color: "#F59E0B",
  },
  {
    icon: MessageCircle,
    title: "تواصل مع شخص",
    desc: "اتصل بشخص تثق به الآن، أو تواصل مع مجتمع الدعم",
    color: "#8B5CF6",
  },
];

export default function SOSButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* SOS Floating Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 left-6 z-40 w-14 h-14 rounded-full bg-[#EF4444] flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
        style={{ boxShadow: '0 0 0 0 rgba(239, 68, 68, 0.7)', animation: 'sos-pulse 2s infinite' }}
        title="مساعدة طارئة"
      >
        <AlertTriangle className="w-6 h-6 text-white" />
      </button>

      {/* SOS Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsOpen(false)} />
          <div className="relative glass-card border border-[#EF4444]/30 p-6 max-w-md w-full z-10">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 left-4 w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-white/50 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-[#EF4444]/20 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-[#EF4444]" />
              </div>
              <div>
                <h3 className="text-white font-black text-lg">مساعدة فورية</h3>
                <p className="text-white/50 text-xs">أنت لست وحدك - نحن هنا معك</p>
              </div>
            </div>

            {/* Emergency Steps */}
            <div className="space-y-3 mb-6">
              {emergencySteps.map((step, i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-white/3 border border-white/5">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: `${step.color}20` }}>
                    <step.icon className="w-4 h-4" style={{ color: step.color }} />
                  </div>
                  <div>
                    <div className="text-white text-sm font-bold mb-0.5">{step.title}</div>
                    <div className="text-white/50 text-xs leading-relaxed">{step.desc}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Emergency Numbers */}
            <div className="border-t border-white/10 pt-4">
              <p className="text-white/40 text-xs mb-3">أرقام الطوارئ</p>
              <div className="space-y-2">
                <a
                  href="tel:0546192019"
                  className="flex items-center gap-2 p-3 rounded-xl bg-[#00D4AA]/10 border border-[#00D4AA]/20 hover:bg-[#00D4AA]/20 transition-all w-full"
                >
                  <Phone className="w-4 h-4 text-[#00D4AA]" />
                  <div>
                    <div className="text-white text-xs font-bold">خط الدعم المباشر</div>
                    <div className="text-[#00D4AA] text-xs font-numbers">0546192019</div>
                  </div>
                </a>
                <div className="grid grid-cols-2 gap-2">
                <a
                  href="tel:920033360"
                  className="flex items-center gap-2 p-3 rounded-xl bg-[#EF4444]/10 border border-[#EF4444]/20 hover:bg-[#EF4444]/20 transition-all"
                >
                  <Phone className="w-4 h-4 text-[#EF4444]" />
                  <div>
                    <div className="text-white text-xs font-bold">خط الإدمان</div>
                    <div className="text-[#EF4444] text-xs font-numbers">920033360</div>
                  </div>
                </a>
                <a
                  href="tel:911"
                  className="flex items-center gap-2 p-3 rounded-xl bg-[#F59E0B]/10 border border-[#F59E0B]/20 hover:bg-[#F59E0B]/20 transition-all"
                >
                  <Phone className="w-4 h-4 text-[#F59E0B]" />
                  <div>
                    <div className="text-white text-xs font-bold">الطوارئ</div>
                    <div className="text-[#F59E0B] text-xs font-numbers">911</div>
                  </div>
                </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes sos-pulse {
          0% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7); }
          70% { box-shadow: 0 0 0 15px rgba(239, 68, 68, 0); }
          100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
        }
      `}</style>
    </>
  );
}
