import { AlertCircle, Home, ArrowRight } from "lucide-react";
import { Link } from "wouter";

export default function NotFound() {
  return (
    <div className="app-container bg-gradient-navy overflow-hidden">
      <div
        className="orb w-72 h-72 opacity-10 -top-16 -right-16"
        style={{ background: "oklch(0.63 0.24 25)" }}
      />
      <div
        className="orb w-56 h-56 opacity-6 bottom-20 -left-16"
        style={{ background: "oklch(0.55 0.25 290)" }}
      />

      <div className="flex flex-col items-center justify-center min-h-screen px-6 text-center">
        <div className="relative mb-6">
          <div className="w-20 h-20 rounded-2xl bg-destructive/15 flex items-center justify-center border border-destructive/25">
            <AlertCircle className="w-10 h-10 text-destructive" />
          </div>
        </div>

        <h1 className="text-6xl font-black text-foreground mb-2 font-numbers">
          404
        </h1>
        <h2 className="text-lg font-bold text-muted-foreground mb-3">
          الصفحة غير موجودة
        </h2>
        <p className="text-muted-foreground/70 text-sm mb-8 leading-relaxed max-w-xs">
          عذراً، الصفحة التي تبحث عنها غير موجودة.
          <br />
          ربما تم نقلها أو حذفها.
        </p>

        <div className="flex gap-3">
          <Link href="/">
            <button className="bg-primary text-primary-foreground px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 hover:scale-105 transition-transform">
              <Home className="w-4 h-4" />
              الرئيسية
            </button>
          </Link>
          <Link href="/dashboard">
            <button className="glass-card border border-border text-muted-foreground px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 hover:text-foreground transition-colors">
              <ArrowRight className="w-4 h-4" />
              لوحة التحكم
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
