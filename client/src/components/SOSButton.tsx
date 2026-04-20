/*
 * Design: Dark Luxury Wellness - SOS Emergency Button
 * Purpose: Always-visible emergency help button
 * Style: Pulsing red button, modal overlay
 */
import { useState } from "react";
import {
  Phone,
  X,
  AlertTriangle,
  Heart,
  Wind,
  MessageCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

const emergencySteps = [
  {
    icon: Wind,
    title: "تنفس ببطء",
    desc: "خذ نفساً عميقاً لمدة 4 ثوانٍ، احبسه 4 ثوانٍ، أخرجه 4 ثوانٍ",
    color: "oklch(0.75 0.18 175)",
  },
  {
    icon: Heart,
    title: "ذكّر نفسك",
    desc: "هذا الإغراء مؤقت وسيمر. أنت أقوى منه. فكّر في سبب بدء رحلتك",
    color: "oklch(0.80 0.18 80)",
  },
  {
    icon: MessageCircle,
    title: "تواصل مع شخص",
    desc: "اتصل بشخص تثق به الآن، أو تواصل مع مجتمع الدعم",
    color: "#8B5CF6",
  },
];

export default function SOSButton() {
  // Hide SOS button on admin pages
  const isAdmin = typeof window !== "undefined" && window.location.pathname.startsWith("/admin");
  if (isAdmin) return null;
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* SOS Floating Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-24 left-4 z-[110] w-14 h-14 rounded-full bg-destructive flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
        style={{
          boxShadow: "0 0 0 0 rgba(239, 68, 68, 0.7)",
          animation: "sos-pulse 2s infinite",
        }}
        title="مساعدة طارئة"
      >
        <AlertTriangle className="w-6 h-6 text-foreground" />
      </button>

      {/* SOS Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />
          <div className="relative glass-card border border-destructive/30 p-6 max-w-md w-full z-10">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 left-4 w-8 h-8 rounded-lg bg-secondary/60 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-destructive/20 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-destructive" />
              </div>
              <div>
                <h3 className="text-foreground font-black text-lg">مساعدة فورية</h3>
                <p className="text-muted-foreground text-xs">
                  أنت لست وحدك - نحن هنا معك
                </p>
              </div>
            </div>

            {/* Emergency Steps */}
            <div className="space-y-3 mb-6">
              {emergencySteps.map((step, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 p-3 rounded-xl bg-secondary/40 border border-border"
                >
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: `${step.color}20` }}
                  >
                    <step.icon
                      className="w-4 h-4"
                      style={{ color: step.color }}
                    />
                  </div>
                  <div>
                    <div className="text-foreground text-sm font-bold mb-0.5">
                      {step.title}
                    </div>
                    <div className="text-muted-foreground text-xs leading-relaxed">
                      {step.desc}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Emergency Numbers */}
            <div className="border-t border-border pt-4">
              <p className="text-muted-foreground text-xs mb-3">أرقام الطوارئ</p>
              <div className="space-y-2">
                <a
                  href="tel:0546192019"
                  className="flex items-center gap-2 p-3 rounded-xl bg-primary/10 border border-primary/20 hover:bg-primary/20 transition-all w-full"
                >
                  <Phone className="w-4 h-4 text-primary" />
                  <div>
                    <div className="text-foreground text-xs font-bold">
                      خط الدعم المباشر
                    </div>
                    <div className="text-primary text-xs font-numbers">
                      0546192019
                    </div>
                  </div>
                </a>
                <div className="grid grid-cols-2 gap-2">
                  <a
                    href="tel:920033360"
                    className="flex items-center gap-2 p-3 rounded-xl bg-destructive/10 border border-destructive/20 hover:bg-destructive/20 transition-all"
                  >
                    <Phone className="w-4 h-4 text-destructive" />
                    <div>
                      <div className="text-foreground text-xs font-bold">
                        خط الإدمان
                      </div>
                      <div className="text-destructive text-xs font-numbers">
                        920033360
                      </div>
                    </div>
                  </a>
                  <a
                    href="tel:911"
                    className="flex items-center gap-2 p-3 rounded-xl bg-accent/10 border border-accent/20 hover:bg-accent/20 transition-all"
                  >
                    <Phone className="w-4 h-4 text-accent" />
                    <div>
                      <div className="text-foreground text-xs font-bold">
                        الطوارئ
                      </div>
                      <div className="text-accent text-xs font-numbers">
                        911
                      </div>
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
