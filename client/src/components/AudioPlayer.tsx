/**
 * AudioPlayer - مشغّل صوت تفاعلي للمحاضرات
 * Design: Dark Luxury Wellness - "صون"
 * Features: تشغيل/إيقاف، شريط تقدم، سرعة التشغيل، تقليب الصوت
 */
import { useState, useRef, useEffect } from "react";
import {
  Play, Pause, Volume2, VolumeX, SkipBack, SkipForward,
  Rewind, FastForward, Music2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface AudioPlayerProps {
  title: string;
  speaker: string;
  duration: string;
  color: string;
}

export default function AudioPlayer({ title, speaker, duration, color }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(80);
  const [isMuted, setIsMuted] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [elapsed, setElapsed] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // تحويل مدة المحاضرة إلى ثوانٍ (تقريبي)
  const totalSeconds = (() => {
    const match = duration.match(/(\d+)/);
    return match ? parseInt(match[1]) * 60 : 2700;
  })();

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setElapsed(prev => {
          if (prev >= totalSeconds) {
            setIsPlaying(false);
            return totalSeconds;
          }
          const next = prev + speed;
          setProgress((next / totalSeconds) * 100);
          return next;
        });
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [isPlaying, speed, totalSeconds]);

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const pct = x / rect.width;
    const newElapsed = Math.floor(pct * totalSeconds);
    setElapsed(newElapsed);
    setProgress(pct * 100);
  };

  const skip = (secs: number) => {
    setElapsed(prev => {
      const next = Math.max(0, Math.min(totalSeconds, prev + secs));
      setProgress((next / totalSeconds) * 100);
      return next;
    });
  };

  const speeds = [0.75, 1, 1.25, 1.5, 2];

  return (
    <div
      className="glass-card p-5 border rounded-2xl relative overflow-hidden"
      style={{ borderColor: `${color}25` }}
    >
      {/* خلفية متوهجة */}
      <div
        className="absolute inset-0 opacity-5 rounded-2xl"
        style={{ background: `radial-gradient(ellipse at center, ${color}, transparent)` }}
      />

      <div className="relative z-10">
        {/* معلومات المحاضرة */}
        <div className="flex items-center gap-4 mb-5">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
            style={{ background: `${color}20`, border: `1px solid ${color}30` }}
          >
            {/* موجة صوت متحركة */}
            <AnimatePresence mode="wait">
              {isPlaying ? (
                <motion.div
                  key="wave"
                  className="flex items-end gap-0.5"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  {[1, 2, 3, 4, 3].map((h, i) => (
                    <motion.div
                      key={i}
                      className="w-1 rounded-full"
                      style={{ background: color }}
                      animate={{ height: [h * 4, h * 8, h * 4] }}
                      transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.1 }}
                    />
                  ))}
                </motion.div>
              ) : (
                <motion.div key="icon" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <Music2 className="w-6 h-6" style={{ color }} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-foreground font-bold text-sm leading-snug line-clamp-1">{title}</h4>
            <p className="text-muted-foreground text-xs mt-0.5">{speaker}</p>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-muted-foreground/60 text-xs font-numbers">{formatTime(elapsed)}</span>
              <span className="text-muted-foreground/40 text-xs">/</span>
              <span className="text-muted-foreground/60 text-xs">{duration}</span>
            </div>
          </div>
        </div>

        {/* شريط التقدم */}
        <div
          className="h-2 bg-secondary/80 rounded-full mb-4 cursor-pointer relative group"
          onClick={handleProgressClick}
        >
          <div
            className="h-full rounded-full transition-all duration-300 relative"
            style={{ width: `${progress}%`, background: `linear-gradient(to right, ${color}, oklch(0.75 0.18 175))` }}
          >
            <div
              className="absolute left-0 top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-white shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
              style={{ boxShadow: `0 0 8px ${color}` }}
            />
          </div>
        </div>

        {/* أزرار التحكم */}
        <div className="flex items-center justify-between">
          {/* سرعة التشغيل */}
          <div className="flex items-center gap-1">
            {speeds.map(s => (
              <button
                key={s}
                onClick={() => setSpeed(s)}
                className={`px-2 py-1 rounded-lg text-xs font-bold transition-all ${
                  speed === s
                    ? "text-foreground"
                    : "text-muted-foreground/70 hover:text-muted-foreground"
                }`}
                style={speed === s ? { background: `${color}25`, color } : {}}
              >
                {s}x
              </button>
            ))}
          </div>

          {/* أزرار التشغيل */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => skip(-15)}
              className="w-8 h-8 rounded-xl glass-card flex items-center justify-center text-muted-foreground hover:text-foreground transition-all"
            >
              <Rewind className="w-4 h-4" />
            </button>
            <button
              onClick={() => skip(-5)}
              className="w-8 h-8 rounded-xl glass-card flex items-center justify-center text-muted-foreground hover:text-foreground transition-all"
            >
              <SkipBack className="w-4 h-4" />
            </button>

            {/* زر التشغيل الرئيسي */}
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="w-12 h-12 rounded-full flex items-center justify-center transition-all hover:scale-105 active:scale-95"
              style={{ background: `linear-gradient(135deg, ${color}, oklch(0.75 0.18 175))` }}
            >
              {isPlaying ? (
                <Pause className="w-5 h-5 text-primary-foreground" />
              ) : (
                <Play className="w-5 h-5 text-primary-foreground mr-0.5" />
              )}
            </button>

            <button
              onClick={() => skip(5)}
              className="w-8 h-8 rounded-xl glass-card flex items-center justify-center text-muted-foreground hover:text-foreground transition-all"
            >
              <SkipForward className="w-4 h-4" />
            </button>
            <button
              onClick={() => skip(15)}
              className="w-8 h-8 rounded-xl glass-card flex items-center justify-center text-muted-foreground hover:text-foreground transition-all"
            >
              <FastForward className="w-4 h-4" />
            </button>
          </div>

          {/* التحكم في الصوت */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
            <div
              className="w-16 h-1.5 bg-secondary/80 rounded-full cursor-pointer relative"
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const x = e.clientX - rect.left;
                setVolume(Math.round((x / rect.width) * 100));
                setIsMuted(false);
              }}
            >
              <div
                className="h-full rounded-full"
                style={{ width: `${isMuted ? 0 : volume}%`, background: `${color}80` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
