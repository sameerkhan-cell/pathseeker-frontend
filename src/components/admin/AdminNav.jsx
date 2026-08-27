import { Link, useLocation } from "react-router-dom";
import { 
  ShieldCheck, 
  LayoutDashboard, 
  Briefcase, 
  HelpCircle, 
  Video, 
  BookOpen, 
  FileText, 
  MessageSquare,
  Sparkles
} from "lucide-react";
import BrandLogo from "../ui/BrandLogo";

export const ADMIN_SECTIONS = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { to: "/admin/careers", label: "Careers", icon: Briefcase },
  { to: "/admin/quiz", label: "Quizzes", icon: HelpCircle },
  { to: "/admin/media", label: "Multimedia", icon: Video },
  { to: "/admin/stories", label: "Stories Queue", icon: BookOpen },
  { to: "/admin/resources", label: "Resources", icon: FileText },
  { to: "/admin/feedback", label: "Feedback", icon: MessageSquare },
];

export default function AdminNav({ title, subtitle, badge }) {
  const location = useLocation();

  return (
    <div className="space-y-6 mb-8">
      {/* Top Banner / Header */}
      <div className="bg-card border border-border-subtle rounded-2xl p-6 sm:p-8 shadow-card relative overflow-hidden theme-transition">
        <div 
          className="absolute -top-16 -right-16 w-64 h-64 rounded-full pointer-events-none blur-3xl opacity-20"
          style={{ background: "radial-gradient(circle, #D5BA84 0%, transparent 70%)" }}
        />
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div className="flex items-center gap-4">
            <BrandLogo className="w-12 h-12 shadow-sm" rounded="rounded-xl" />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono uppercase tracking-widest text-accent-gold font-semibold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-accent-gold" />
                  PathSeeker Admin Operations
                </span>
                {badge && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-accent-gold/15 text-accent-gold border border-accent-gold/30">
                    {badge}
                  </span>
                )}
              </div>
              <h1 className="text-2xl sm:text-3xl font-display text-text-primary mt-0.5">
                {title || "Admin Operations"}
              </h1>
              {subtitle && (
                <p className="text-body-sm text-text-muted mt-1">
                  {subtitle}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to="/dashboard"
              className="text-xs font-semibold text-text-muted hover:text-accent-gold px-3 py-1.5 rounded-lg border border-border-subtle hover:border-accent-gold/40 transition-colors"
            >
              Exit to Student App →
            </Link>
          </div>
        </div>

        {/* Sub-Navigation Tabs */}
        <div className="mt-6 pt-4 border-t border-border-subtle/60 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {ADMIN_SECTIONS.map((sec) => {
            const Icon = sec.icon;
            const active = location.pathname === sec.to;
            return (
              <Link
                key={sec.to}
                to={sec.to}
                className={`
                  flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-150
                  ${
                    active
                      ? "bg-accent-gold text-[#14151A] shadow-sm font-bold"
                      : "text-text-muted hover:text-text-primary hover:bg-base border border-transparent hover:border-border-subtle"
                  }
                `}
              >
                <Icon className={`w-4 h-4 ${active ? "text-[#14151A]" : "text-accent-gold"}`} />
                <span>{sec.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
