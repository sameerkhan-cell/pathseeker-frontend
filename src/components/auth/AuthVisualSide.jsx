import { Compass, ShieldCheck, Award, Sparkles, CheckCircle2 } from "lucide-react";
import BrandLogo from "../ui/BrandLogo";

const PASSPORT_STAMPS = [
  { label: "ENGINEERING & CLOUD", code: "ENG-808", stamp: "VERIFIED" },
  { label: "AI & DATA SCIENCE", code: "ML-942", stamp: "ACCREDITED" },
  { label: "PRODUCT & UX DESIGN", code: "DES-110", stamp: "CERTIFIED" },
  { label: "FINANCE & STRATEGY", code: "FIN-339", stamp: "ENDORSED" },
];

export default function AuthVisualSide({ 
  headline = "Your Career Journey, Verified.",
  subheadline = "Official credentialing, psychometric assessment battery, and AI-powered professional trajectory mapping."
}) {
  return (
    <div className="hidden lg:flex lg:w-1/2 relative min-h-[calc(100vh-4.5rem)] bg-base border-l border-border-subtle overflow-hidden items-center justify-center p-12 theme-transition">
      {/* Ambient background glows */}
      <div 
        className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full pointer-events-none blur-[120px] opacity-35 dark:opacity-20"
        style={{ background: "radial-gradient(circle, #D5BA84 0%, transparent 70%)" }}
      />
      <div 
        className="absolute bottom-12 right-12 w-64 h-64 rounded-full pointer-events-none blur-[90px] opacity-20"
        style={{ background: "radial-gradient(circle, #1B2132 0%, transparent 70%)" }}
      />

      {/* Center Visual Passport Stage */}
      <div className="relative z-10 max-w-lg w-full space-y-8 text-center flex flex-col items-center">
        {/* Monogram Seal with rotating orbit */}
        <div className="relative flex items-center justify-center">
          <div className="w-32 h-32 rounded-3xl bg-card border-2 border-accent-gold/50 shadow-gold-glow flex items-center justify-center p-4 relative group hover:scale-105 transition-transform duration-300">
            <BrandLogo className="w-20 h-20 shadow-sm" rounded="rounded-2xl" />
            <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-accent-gold text-[#14151A] flex items-center justify-center font-bold shadow-md">
              <Award className="w-4 h-4" />
            </div>
          </div>

          {/* Compass badge */}
          <div className="absolute -bottom-4 bg-navy-900 border border-accent-gold/40 text-accent-gold px-3.5 py-1 rounded-full text-[11px] font-mono tracking-widest flex items-center gap-1.5 shadow-sm">
            <Compass className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: "16s" }} />
            <span>PASSPORT HQ // 2026</span>
          </div>
        </div>

        {/* Headings */}
        <div className="space-y-3 pt-4">
          <h2 className="text-3xl xl:text-4xl font-display text-text-primary leading-tight">
            {headline}
          </h2>
          <p className="text-body-sm text-text-muted leading-relaxed max-w-md mx-auto">
            {subheadline}
          </p>
        </div>

        {/* Passport Domain Stamps Grid */}
        <div className="grid grid-cols-2 gap-3 w-full pt-2">
          {PASSPORT_STAMPS.map((s, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-xl bg-card/80 backdrop-blur-sm border border-border-subtle hover:border-accent-gold/50 transition-all text-left space-y-1 group"
            >
              <div className="flex items-center justify-between text-[10px] font-mono text-accent-gold">
                <span>{s.code}</span>
                <span className="px-1.5 py-0.5 rounded bg-accent-gold/15 border border-accent-gold/30 text-[9px] font-bold">
                  {s.stamp}
                </span>
              </div>
              <p className="text-xs font-semibold text-text-primary group-hover:text-accent-gold transition-colors">
                {s.label}
              </p>
            </div>
          ))}
        </div>

        {/* Bottom Official Security Stamp */}
        <div className="pt-4 flex items-center justify-center gap-6 text-[11px] font-mono text-text-muted">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            256-Bit TLS Encryption
          </span>
          <span>&bull;</span>
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-accent-gold" />
            Verified Career Credentials
          </span>
        </div>
      </div>
    </div>
  );
}
