import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { 
  ShieldCheck, 
  User, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  Sparkles, 
  AlertCircle, 
  Loader2, 
  Briefcase,
  KeyRound,
  CheckCircle2,
  Zap,
  Award,
  ArrowLeft
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import BrandLogo from "../components/ui/BrandLogo";

export default function Register() {
  const { register, verifyEmail } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "STUDENT" });
  const [showPassword, setShowPassword] = useState(false);
  const [otpStage, setOtpStage] = useState(false);
  const [devCode, setDevCode] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submitRegister = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const res = await register(form);
      setDevCode(res.devCode || "");
      setOtpStage(true);
    } catch (err) {
      setError(err.message || "Registration failed. Please review your details.");
    } finally {
      setBusy(false);
    }
  };

  const submitVerify = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      await verifyEmail({ email: form.email, code });
      navigate("/login");
    } catch (err) {
      setError(err.message || "Invalid OTP code. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-[#0D1117] text-white selection:bg-accent-gold selection:text-[#14151A]">
      {/* ─── LEFT HALF: BRAND SHOWCASE ────────────────────────────────── */}
      <div className="lg:w-1/2 w-full bg-[#0D131F] border-b lg:border-b-0 lg:border-r border-white/10 p-8 sm:p-12 lg:p-16 flex flex-col justify-between relative overflow-hidden">
        {/* Subtle Ambient Glows */}
        <div 
          className="absolute top-1/4 left-1/4 w-[480px] h-[480px] rounded-full pointer-events-none blur-[140px] opacity-25"
          style={{ background: "radial-gradient(circle, #D5BA84 0%, transparent 70%)" }}
        />
        <div 
          className="absolute bottom-10 right-10 w-64 h-64 rounded-full pointer-events-none blur-[100px] opacity-15"
          style={{ background: "radial-gradient(circle, #38BDF8 0%, transparent 70%)" }}
        />

        {/* Top Header */}
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
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-white/5 border border-white/10 text-accent-gold backdrop-blur-sm">
            <Sparkles className="w-3.5 h-3.5 text-accent-gold" />
            <span>AI + Credential &bull; Official Registration</span>
          </div>

          <div className="space-y-3">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display text-white leading-tight">
              Begin Your Verified <br />
              <span className="text-accent-gold">Career Journey</span>
            </h1>
            <p className="text-sm sm:text-base text-white/70 leading-relaxed">
              Create your official Career Passport to unlock AI-powered psychometric matching, verified career roadmaps, and salary intelligence.
            </p>
          </div>

          <div className="space-y-4 pt-2">
            {[
              { icon: ShieldCheck, title: "Psychometric Assessment & Strengths Analysis" },
              { icon: Zap, title: "Curated Step-by-Step Transition Milestones" },
              { icon: Award, title: "Personalized Trajectory Scoring & Insights" },
              { icon: Lock, title: "100% Free & Privacy-Protected Passport" },
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
          <span>REG-2026</span>
        </div>
      </div>

      {/* ─── RIGHT HALF: CRISP ELEVATED REGISTRATION CARD ─────────────── */}
      <div className="lg:w-1/2 w-full bg-[#FAF1EC] dark:bg-[#14151A] text-[#14151A] dark:text-white p-6 sm:p-12 flex items-center justify-center relative theme-transition">
        <div className="w-full max-w-md bg-white dark:bg-[#1B212D] border border-[#E5DCD0] dark:border-white/10 rounded-2xl shadow-xl p-8 sm:p-10 space-y-6 theme-transition">
          
          {!otpStage ? (
            <>
              {/* Card Header */}
              <div className="space-y-1.5">
                <h2 className="text-2xl sm:text-3xl font-display text-[#14151A] dark:text-white">
                  Issue your passport
                </h2>
                <p className="text-xs sm:text-body-sm text-[#666] dark:text-white/60">
                  Fill in your details below to create your official account.
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
              <form onSubmit={submitRegister} className="space-y-4">
                {/* Full Legal Name */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#333] dark:text-white/80 block">
                    Full Legal Name
                  </label>
                  <input
                    name="name"
                    type="text"
                    placeholder="Ali Raza"
                    value={form.name}
                    onChange={onChange}
                    required
                    disabled={busy}
                    className="w-full px-4 py-2.5 text-sm bg-[#F8F5F2] dark:bg-[#0D1117] border border-[#D9D1C7] dark:border-white/15 rounded-xl text-[#14151A] dark:text-white placeholder:text-[#999] focus:outline-none focus:border-accent-gold focus:ring-2 focus:ring-accent-gold/20 transition-all"
                  />
                </div>

                {/* Email address */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#333] dark:text-white/80 block">
                    Email address
                  </label>
                  <input
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={onChange}
                    required
                    disabled={busy}
                    className="w-full px-4 py-2.5 text-sm bg-[#F8F5F2] dark:bg-[#0D1117] border border-[#D9D1C7] dark:border-white/15 rounded-xl text-[#14151A] dark:text-white placeholder:text-[#999] focus:outline-none focus:border-accent-gold focus:ring-2 focus:ring-accent-gold/20 transition-all"
                  />
                </div>

                {/* Passkey */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#333] dark:text-white/80 block">
                    Security Passkey (8+ characters)
                  </label>
                  <div className="relative">
                    <input
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••••••"
                      value={form.password}
                      onChange={onChange}
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

                {/* Current Status */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#333] dark:text-white/80 block">
                    Current Profile Status
                  </label>
                  <select
                    name="role"
                    value={form.role}
                    onChange={onChange}
                    disabled={busy}
                    className="w-full px-4 py-2.5 text-sm bg-[#F8F5F2] dark:bg-[#0D1117] border border-[#D9D1C7] dark:border-white/15 rounded-xl text-[#14151A] dark:text-white focus:outline-none focus:border-accent-gold focus:ring-2 focus:ring-accent-gold/20 transition-all cursor-pointer"
                  >
                    <option value="STUDENT">🎓 Student (High School / University)</option>
                    <option value="GRADUATE">🏛️ Recent Graduate</option>
                    <option value="PROFESSIONAL">💼 Working Professional</option>
                  </select>
                </div>

                {/* Submit Registration Button */}
                <button
                  type="submit"
                  disabled={busy}
                  className="w-full py-3 px-6 rounded-xl font-display text-lg tracking-wider uppercase text-[#14151A] bg-accent-gold hover:bg-accent-gold-glow active:scale-[0.98] border border-accent-gold shadow-md hover:shadow-gold-glow flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed leading-none mt-2"
                >
                  {busy ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Issuing Passport...</span>
                    </>
                  ) : (
                    <span>Create Career Passport</span>
                  )}
                </button>
              </form>

              {/* Login Link */}
              <div className="pt-2 text-center text-xs text-[#666] dark:text-white/60">
                Already hold a Career Passport?{" "}
                <Link
                  to="/login"
                  className="font-bold text-accent-gold-deep dark:text-accent-gold hover:underline"
                >
                  Sign in here
                </Link>
              </div>
            </>
          ) : (
            /* OTP Verification Stage */
            <div className="space-y-6 animate-fade-in">
              <div className="space-y-2">
                <h2 className="text-2xl sm:text-3xl font-display text-[#14151A] dark:text-white">
                  Verify passport
                </h2>
                <p className="text-xs text-[#666] dark:text-white/60">
                  Enter the 6-digit verification code sent to <br />
                  <span className="font-semibold text-accent-gold-deep dark:text-accent-gold">{form.email}</span>
                </p>
              </div>

              {devCode && (
                <div className="p-3 rounded-xl bg-accent-gold/15 border border-accent-gold/30 text-accent-gold-deep dark:text-accent-gold text-xs font-mono flex items-center justify-between">
                  <span>⚡ DEV CODE:</span>
                  <button
                    type="button"
                    onClick={() => setCode(devCode)}
                    className="underline font-bold hover:opacity-80"
                  >
                    {devCode} (Auto-Fill)
                  </button>
                </div>
              )}

              {error && (
                <div className="flex items-start gap-3 p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 text-body-sm animate-fade-in">
                  <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <div className="leading-snug text-xs font-medium">{error}</div>
                </div>
              )}

              <form onSubmit={submitVerify} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#333] dark:text-white/80 block">
                    6-Digit Security Token
                  </label>
                  <input
                    name="code"
                    type="text"
                    maxLength={6}
                    placeholder="123456"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    required
                    disabled={busy}
                    className="w-full text-center tracking-[0.5em] text-2xl font-mono px-4 py-2.5 bg-[#F8F5F2] dark:bg-[#0D1117] border border-[#D9D1C7] dark:border-white/15 rounded-xl text-[#14151A] dark:text-white focus:outline-none focus:border-accent-gold focus:ring-2 focus:ring-accent-gold/20 transition-all"
                  />
                </div>

                <button
                  type="submit"
                  disabled={busy}
                  className="w-full py-3 px-6 rounded-xl font-display text-lg tracking-wider uppercase text-[#14151A] bg-accent-gold hover:bg-accent-gold-glow active:scale-[0.98] border border-accent-gold shadow-md hover:shadow-gold-glow flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed leading-none mt-2"
                >
                  {busy ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Verifying...</span>
                    </>
                  ) : (
                    <span>Verify &amp; Activate</span>
                  )}
                </button>

                <div className="text-center pt-2">
                  <button
                    type="button"
                    onClick={() => setOtpStage(false)}
                    className="text-xs text-[#777] hover:text-accent-gold underline"
                  >
                    ← Edit registration email
                  </button>
                </div>
              </form>
            </div>
          )}

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
