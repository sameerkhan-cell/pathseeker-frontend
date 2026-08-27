import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Compass,
  Sparkles,
  ArrowRight,
  Briefcase,
  BrainCircuit,
  Video,
  BookOpen,
  Trophy,
  TrendingUp,
  Shield,
  Layers,
  FolderGit2,
  HelpCircle,
  Code2,
  Cpu,
  Database,
  Palette,
  LineChart,
  CheckCircle2,
} from "lucide-react";
import { careerApi } from "../api/careerApi";
import { useAuth } from "../context/AuthContext";
import GoldOutlineButton from "../components/ui/GoldOutlineButton";
import CareerCard from "../components/ui/CareerCard";
import PassportScrollSequence from "../components/PassportScrollSequence";

export default function Home() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [careers, setCareers] = useState([]);
  const [loadingCareers, setLoadingCareers] = useState(true);

  useEffect(() => {
    careerApi
      .getTrendingCareers()
      .then((res) => {
        const list = res.data?.careers || (Array.isArray(res.data) ? res.data : []);
        setCareers(list);
        setLoadingCareers(false);
      })
      .catch((err) => {
        console.error("Failed to load trending careers:", err);
        setLoadingCareers(false);
      });
  }, []);

  const getDomainIcon = (domain) => {
    switch (domain?.toLowerCase()) {
      case "engineering": return <Code2 className="w-5 h-5" />;
      case "data":        return <Database className="w-5 h-5" />;
      case "design":      return <Palette className="w-5 h-5" />;
      case "business":    return <LineChart className="w-5 h-5" />;
      default:            return <Briefcase className="w-5 h-5" />;
    }
  };

  return (
    <div>
      {/* ─── SECTION 1: FULL-VIEWPORT PASSPORT SCROLL HERO ───────── */}
      {/*
          PassportScrollSequence now IS the hero:
          - Its own minimal nav (wordmark + CTA) overlaid inside
          - Pinned canvas scroll sequence (desktop)
          - Static fade-in frame (mobile)
          Layout's Navbar is hidden for the hero section via CSS below.
      */}
      <PassportScrollSequence />

      {/* ─── SECTIONS BELOW HERO ─────────────────────────────────── */}
      <div className="space-y-20 pb-16 pt-16">

        {/* ─── SECTION 2: CORE VALUE PILLARS ────────────────────── */}
        <section className="container-app">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
            <h2 className="text-heading-2 font-heading text-text-primary">
              How PathSeeker Shapes Your Journey
            </h2>
            <p className="text-body-sm text-text-muted">
              A comprehensive, data-backed ecosystem designed to guide you from exploration to mastery.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {/* Pillar 1 */}
            <div className="bg-card border border-border-subtle rounded-card p-6 lg:p-8 space-y-4 hover:border-accent-gold/40 shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)] transition-all theme-transition">
              <div className="w-12 h-12 rounded-xl bg-accent-gold/10 text-accent-gold flex items-center justify-center">
                <BrainCircuit className="w-6 h-6" />
              </div>
              <h3 className="text-heading-3 font-heading text-text-primary">
                1. Aptitude Assessment
              </h3>
              <p className="text-body-sm text-text-muted leading-relaxed">
                Take comprehensive psychometric and technical readiness assessments to uncover matching career pathways tailored to your strengths.
              </p>
              <Link to="/quiz" className="inline-flex items-center gap-1.5 text-body-sm font-semibold text-accent-gold hover:underline">
                Take the Quiz <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Pillar 2 */}
            <div className="bg-card border border-border-subtle rounded-card p-6 lg:p-8 space-y-4 hover:border-accent-gold/40 shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)] transition-all theme-transition">
              <div className="w-12 h-12 rounded-xl bg-accent-gold/10 text-accent-gold flex items-center justify-center">
                <Compass className="w-6 h-6" />
              </div>
              <h3 className="text-heading-3 font-heading text-text-primary">
                2. Career Bank &amp; Roadmap
              </h3>
              <p className="text-body-sm text-text-muted leading-relaxed">
                Explore exhaustive job profiles with real-time salary benchmarks, required technical stacks, educational paths, and growth outlooks.
              </p>
              <Link to="/careers" className="inline-flex items-center gap-1.5 text-body-sm font-semibold text-accent-gold hover:underline">
                Explore Career Bank <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Pillar 3 */}
            <div className="bg-card border border-border-subtle rounded-card p-6 lg:p-8 space-y-4 hover:border-accent-gold/40 shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)] transition-all theme-transition">
              <div className="w-12 h-12 rounded-xl bg-accent-gold/10 text-accent-gold flex items-center justify-center">
                <Video className="w-6 h-6" />
              </div>
              <h3 className="text-heading-3 font-heading text-text-primary">
                3. Multimedia &amp; Stories
              </h3>
              <p className="text-body-sm text-text-muted leading-relaxed">
                Watch day-in-the-life video documentations, listen to podcasts from industry leaders, and learn from real peer career transition stories.
              </p>
              <Link to="/media" className="inline-flex items-center gap-1.5 text-body-sm font-semibold text-accent-gold hover:underline">
                Watch Media <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </section>

        {/* ─── SECTION 3: TRENDING CAREERS ──────────────────────── */}
        <section className="container-app">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <span className="text-caption uppercase font-semibold text-accent-gold tracking-wider">
                High Growth Fields
              </span>
              <h2 className="text-heading-2 font-heading text-text-primary mt-1">
                Trending Career Trajectories
              </h2>
            </div>
            <Link to="/careers">
              <GoldOutlineButton size="sm">
                View All Careers ({careers.length ? "10+" : "..."}) <ArrowRight className="w-4 h-4" />
              </GoldOutlineButton>
            </Link>
          </div>

          {loadingCareers ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-card border border-border-subtle rounded-card p-6 h-64 animate-pulse space-y-4">
                  <div className="w-10 h-10 bg-border-subtle rounded-lg" />
                  <div className="h-6 bg-border-subtle rounded w-3/4" />
                  <div className="h-4 bg-border-subtle rounded w-full" />
                  <div className="h-4 bg-border-subtle rounded w-5/6" />
                </div>
              ))}
            </div>
          ) : careers.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {careers.map((career) => (
                <CareerCard
                  key={career.id}
                  title={career.title}
                  description={career.description}
                  icon={getDomainIcon(career.domain)}
                  onClick={() => navigate(`/careers/${career.id}`)}
                  footer={
                    <div className="flex items-center justify-between text-body-sm">
                      <span className="text-accent-gold font-semibold">
                        ${Math.round(career.salaryMin / 1000)}k – ${Math.round(career.salaryMax / 1000)}k
                      </span>
                      <span className="text-caption font-semibold px-2 py-0.5 rounded bg-accent-gold/10 text-accent-gold">
                        {career.domain}
                      </span>
                    </div>
                  }
                />
              ))}
            </div>
          ) : (
            <div className="bg-card border border-border-subtle rounded-card p-8 text-center text-text-muted">
              <p>No careers found. Check that the backend server is running.</p>
            </div>
          )}
        </section>

        {/* ─── SECTION 4: SRS SITEMAP ───────────────────────────── */}
        <section className="container-app">
          <div className="bg-card border border-border-subtle rounded-2xl p-8 sm:p-10 lg:p-12 shadow-[var(--shadow-card)] theme-transition">
            <div className="max-w-2xl mb-8 space-y-2">
              <span className="text-caption uppercase font-semibold text-accent-gold tracking-wider">
                SRS Mandatory Specification
              </span>
              <h2 className="text-heading-2 font-heading text-text-primary">
                Platform Sitemap &amp; Navigation Directory
              </h2>
              <p className="text-body-sm text-text-muted">
                Quick access directory for all core modules, career discovery tools, multimedia resources, and administrative interfaces.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Explore */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-accent-gold font-semibold text-body-base">
                  <Compass className="w-5 h-5" /><h3>Explore Careers</h3>
                </div>
                <ul className="space-y-2.5 text-body-sm">
                  {[["Career Bank", "/careers"], ["Career Assessment Quiz", "/quiz"], ["Multimedia Center", "/media"]].map(([label, path]) => (
                    <li key={path}>
                      <Link to={path} className="text-text-muted hover:text-accent-gold transition-colors flex items-center justify-between group">
                        <span>{label}</span>
                        <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Growth */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-accent-gold font-semibold text-body-base">
                  <Trophy className="w-5 h-5" /><h3>Growth &amp; Community</h3>
                </div>
                <ul className="space-y-2.5 text-body-sm">
                  {[["Success Stories", "/stories"], ["Submit Your Story", "/stories/submit"], ["Resource Library", "/resources"]].map(([label, path]) => (
                    <li key={path}>
                      <Link to={path} className="text-text-muted hover:text-accent-gold transition-colors flex items-center justify-between group">
                        <span>{label}</span>
                        <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Tools */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-accent-gold font-semibold text-body-base">
                  <Layers className="w-5 h-5" /><h3>Passport &amp; Tools</h3>
                </div>
                <ul className="space-y-2.5 text-body-sm">
                  {[["Student Dashboard", "/dashboard"], ["Passport Profile", "/profile"], ["Saved Bookmarks", "/bookmarks"], ["Feedback & Support", "/feedback"]].map(([label, path]) => (
                    <li key={path}>
                      <Link to={path} className="text-text-muted hover:text-accent-gold transition-colors flex items-center justify-between group">
                        <span>{label}</span>
                        <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Admin */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-accent-gold font-semibold text-body-base">
                  <Shield className="w-5 h-5" /><h3>Platform &amp; Admin</h3>
                </div>
                <ul className="space-y-2.5 text-body-sm">
                  {[["Design Preview (FD-1)", "/design-preview"], ["Admin Operations Portal", "/admin"], ["User Login", "/login"], ["New Account Registration", "/register"]].map(([label, path]) => (
                    <li key={path}>
                      <Link to={path} className="text-text-muted hover:text-accent-gold transition-colors flex items-center justify-between group">
                        <span>{label}</span>
                        <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
