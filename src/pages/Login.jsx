import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { 
  ShieldCheck, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  Sparkles, 
  AlertCircle, 
  Loader2, 
  KeyRound,
  TrendingUp,
  Award,
  Zap,
  CheckCircle2,
  ArrowLeft
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import BrandLogo from "../components/ui/BrandLogo";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const demoAccounts = [
    { role: "Student", email: "student@pathseeker.com", pass: "StudentPass123", badge: "🎓" },
    { role: "Professional", email: "pro@pathseeker.com", pass: "ProPass123", badge: "💼" },
    { role: "Admin", email: "admin@pathseeker.com", pass: "AdminPass123", badge: "🛡️" },
  ];

  const setDemo = (acc) => {
    setForm({ email: acc.email, password: acc.pass });
    setError("");
  };

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const res = await login(form);
      console.log("[Login] real backend response:", res);
      navigate(res.data.user.role === "ADMIN" ? "/admin" : "/dashboard");
    } catch (err) {
      setError(err.message || "Invalid credentials. Please check your email and password.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-[#0D1117] text-white selection:bg-accent-gold selection:text-[#14151A]">
      {/* ─── LEFT HALF: BRAND SHOWCASE (INSPIRED BY REFERENCE DESIGN) ─── */}
      <div className="lg:w-1/2 w-full bg-[#0D131F] border-b lg:border-b-0 lg:border-r border-white/10 p-8 sm:p-12 lg:p-16 flex flex-col justify-between relative overflow-hidden">
        {/* Subtle Ambient Radial Glow */}
        <div 
          className="absolute top-1/4 left-1/4 w-[480px] h-[480px] rounded-full pointer-events-none blur-[140px] opacity-25"
          style={{ background: "radial-gradient(circle, #D5BA84 0%, transparent 70%)" }}
        />
        <div 
          className="absolute bottom-10 right-10 w-64 h-64 rounded-full pointer-events-none blur-[100px] opacity-15"
          style={{ background: "radial-gradient(circle, #38BDF8 0%, transparent 70%)" }}
        />

        {/* Top Header: Logo + Brand + Official Tag */}
        <div className="relative z-10 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group" style={{ textDecoration: "none" }}>
            <BrandLogo className="w-10 h-10 shadow-sm group-hover:scale-105 transition-transform" rounded="rounded-xl" />
            <div className="flex items-center gap-2">
              <span className="font-display text-2xl tracking-wide text-white">PathSeeker</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                2026 OFFICIAL
              </span>
            </div>
          </Link>

          <Link
            to="/"
            className="text-xs font-semibold text-white/60 hover:text-accent-gold flex items-center gap-1.5 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Return Home
          </Link>
        </div>

        {/* Center Content: Headline & Feature Pillars */}
        <div className="relative z-10 my-10 lg:my-0 max-w-lg space-y-8">
          {/* Tag Pill */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-white/5 border border-white/10 text-accent-gold backdrop-blur-sm">
            <Sparkles className="w-3.5 h-3.5 text-accent-gold" />
            <span>AI + Trajectory &bull; Career Passport Platform</span>
          </div>

          {/* Main Headline */}
          <div className="space-y-3">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display text-white leading-tight">
              Chart Your True <br />
              <span className="text-accent-gold">Career Trajectory</span>
            </h1>
            <p className="text-sm sm:text-base text-white/70 leading-relaxed">
              Join 15,000+ students, graduates, and professionals on South Asia's most trusted AI-powered career discovery and passport verification system.
            </p>
          </div>

          {/* Feature List (4 Icon Pills matching the reference screenshot style) */}
          <div className="space-y-4 pt-2">
            {[
              {
                icon: ShieldCheck,
                title: "AI-Powered Aptitude & Readiness Assessment",
              },
              {
                icon: Zap,
                title: "Real-Time Salary & Market Demand Benchmarks",
              },
              {
                icon: Award,
                title: "Verified Industry Trajectories & Milestones",
              },
              {
                icon: Lock,
                title: "256-Bit Encrypted Career Passport Credential",
              },
            ].map((feat, idx) => {
              const Icon = feat.icon;
              return (
                <div key={idx} className="flex items-center gap-3.5 text-sm text-white/90">
                  <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-accent-gold flex-shrink-0">
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="font-medium">{feat.title}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom Tagline */}
        <div className="relative z-10 text-xs text-white/40 font-mono flex items-center justify-between pt-4 border-t border-white/5">
          <span>PATHSEEKER // CAREER PASSPORT</span>
          <span>SEC-2026</span>
        </div>
      </div>

      {/* ─── RIGHT HALF: CRISP ELEVATED SIGN-IN CARD ──────────────────── */}
      <div className="lg:w-1/2 w-full bg-[#FAF1EC] dark:bg-[#14151A] text-[#14151A] dark:text-white p-6 sm:p-12 flex items-center justify-center relative theme-transition">
        <div className="w-full max-w-md bg-white dark:bg-[#1B212D] border border-[#E5DCD0] dark:border-white/10 rounded-2xl shadow-xl p-8 sm:p-10 space-y-6 theme-transition">
          
          {/* Card Header */}
          <div className="space-y-1.5">
            <h2 className="text-2xl sm:text-3xl font-display text-[#14151A] dark:text-white">
              Welcome back
            </h2>
            <p className="text-xs sm:text-body-sm text-[#666] dark:text-white/60">
              Sign in to your PathSeeker account to continue your career roadmap.
            </p>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="flex items-start gap-3 p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 text-body-sm animate-fade-in">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <div className="leading-snug text-xs font-medium">{error}</div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={submit} className="space-y-4">
            {/* Email field */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#333] dark:text-white/80 block">
                Email address
              </label>
              <div className="relative">
                <input
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                  disabled={busy}
                  className="w-full px-4 py-2.5 text-sm bg-[#F8F5F2] dark:bg-[#0D1117] border border-[#D9D1C7] dark:border-white/15 rounded-xl text-[#14151A] dark:text-white placeholder:text-[#999] focus:outline-none focus:border-accent-gold focus:ring-2 focus:ring-accent-gold/20 transition-all"
                />
              </div>
            </div>

            {/* Password field */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-[#333] dark:text-white/80">
                  Password
                </label>
                <Link
                  to="/feedback"
                  className="text-xs font-semibold text-accent-gold-deep dark:text-accent-gold hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••••••"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  required
                  disabled={busy}
                  className="w-full px-4 py-2.5 pr-10 text-sm bg-[#F8F5F2] dark:bg-[#0D1117] border border-[#D9D1C7] dark:border-white/15 rounded-xl text-[#14151A] dark:text-white placeholder:text-[#999] focus:outline-none focus:border-accent-gold focus:ring-2 focus:ring-accent-gold/20 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#777] hover:text-[#14151A] dark:text-white/60 dark:hover:text-white p-1 focus:outline-none"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me Checkbox */}
            <div className="flex items-center gap-2 pt-1">
              <input
                id="rememberMe"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-accent-gold focus:ring-accent-gold cursor-pointer"
              />
              <label htmlFor="rememberMe" className="text-xs text-[#555] dark:text-white/70 select-none cursor-pointer">
                Keep me signed in for 7 days
              </label>
            </div>

            {/* Sign In Button */}
            <button
              type="submit"
              disabled={busy}
              className="w-full py-3 px-6 rounded-xl font-display text-lg tracking-wider uppercase text-[#14151A] bg-accent-gold hover:bg-accent-gold-glow active:scale-[0.98] border border-accent-gold shadow-md hover:shadow-gold-glow flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed leading-none mt-2"
            >
              {busy ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Signing In...</span>
                </>
              ) : (
                <span>Sign in</span>
              )}
            </button>
          </form>

          {/* Quick Demo Access Divider */}
          <div className="relative flex py-1 items-center">
            <div className="flex-grow border-t border-[#E0D8CE] dark:border-white/10" />
            <span className="flex-shrink mx-3 text-[11px] font-mono text-[#888] dark:text-white/50 uppercase tracking-wider">
              or quick test access with
            </span>
            <div className="flex-grow border-t border-[#E0D8CE] dark:border-white/10" />
          </div>

          {/* Quick Demo 3-Role Grid */}
          <div className="grid grid-cols-3 gap-2.5">
            {demoAccounts.map((acc) => (
              <button
                key={acc.role}
                type="button"
                onClick={() => setDemo(acc)}
                className="p-2.5 rounded-xl border border-[#D9D1C7] dark:border-white/10 bg-[#FAF7F4] dark:bg-[#0D1117] hover:border-accent-gold hover:bg-accent-gold/10 flex flex-col items-center gap-1 text-center transition-all group cursor-pointer"
                title={`Click to fill ${acc.role} account`}
              >
                <span className="text-base">{acc.badge}</span>
                <span className="text-xs font-semibold text-[#222] dark:text-white group-hover:text-accent-gold">{acc.role}</span>
              </button>
            ))}
          </div>

          {/* Register Link */}
          <div className="pt-2 text-center text-xs text-[#666] dark:text-white/60">
            Don't have a passport yet?{" "}
            <Link
              to="/register"
              className="font-bold text-accent-gold-deep dark:text-accent-gold hover:underline"
            >
              Issue New Passport
            </Link>
          </div>

          {/* SSL Footer Note */}
          <div className="pt-3 border-t border-[#EAE3DA] dark:border-white/5 flex items-center justify-center gap-1.5 text-[11px] text-[#888] dark:text-white/40">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            <span>256-bit SSL encrypted &bull; PathSeeker Verified</span>
          </div>

        </div>
      </div>
    </div>
  );
}
