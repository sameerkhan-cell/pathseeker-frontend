import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  Compass,
  ArrowLeft,
  ArrowRight,
  Bookmark,
  BookmarkCheck,
  CheckCircle2,
  DollarSign,
  TrendingUp,
  GraduationCap,
  Sparkles,
  Layers,
  Share2,
  Code2,
  Cpu,
  Database,
  Palette,
  LineChart,
  Stethoscope,
  Briefcase,
  ExternalLink,
  BookOpen
} from "lucide-react";
import { careerApi } from "../api/careerApi";
import { bookmarksApi } from "../api/bookmarksApi";
import { useAuth } from "../context/AuthContext";
import CareerCard from "../components/ui/CareerCard";
import PrimaryButton from "../components/ui/PrimaryButton";
import GoldOutlineButton from "../components/ui/GoldOutlineButton";
import Loader from "../components/Loader";

export default function CareerDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [career, setCareer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [relatedCareersList, setRelatedCareersList] = useState([]);

  // Bookmark State
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [bookmarkId, setBookmarkId] = useState(null);
  const [bookmarkLoading, setBookmarkLoading] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError("");

    careerApi
      .getCareerById(id)
      .then(async (res) => {
        const c = res.data.career;
        setCareer(c);

        // Fetch related careers if any exist
        if (c.relatedCareers && c.relatedCareers.length > 0) {
          try {
            const relRes = await careerApi.getCareers({ limit: 4 });
            const all = relRes.data?.items || [];
            // Filter out current career and match related titles/domain
            const filtered = all.filter((item) => item.id !== c.id).slice(0, 3);
            setRelatedCareersList(filtered);
          } catch {
            setRelatedCareersList([]);
          }
        }

        // Check if bookmarked (if user is logged in)
        if (user) {
          try {
            const bRes = await bookmarksApi.list({ itemType: "CAREER" });
            const list = bRes.data?.items || bRes.data?.bookmarks || [];
            const found = list.find((b) => b.itemId === c.id || b.careerId === c.id);
            if (found) {
              setIsBookmarked(true);
              setBookmarkId(found.id);
            } else {
              setIsBookmarked(false);
              setBookmarkId(null);
            }
          } catch {
            // Ignored if unauthenticated
          }
        }
      })
      .catch((err) => setError(err.message || "Failed to load career details"))
      .finally(() => setLoading(false));
  }, [id, user]);

  const handleBookmarkToggle = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    setBookmarkLoading(true);
    try {
      if (isBookmarked && bookmarkId) {
        await bookmarksApi.remove(bookmarkId);
        setIsBookmarked(false);
        setBookmarkId(null);
      } else {
        const res = await bookmarksApi.create("CAREER", career.id);
        setIsBookmarked(true);
        setBookmarkId(res.data?.bookmark?.id || null);
      }
    } catch (err) {
      console.error("Bookmark toggle failed:", err);
    } finally {
      setBookmarkLoading(false);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2500);
  };

  const getDomainIcon = (d) => {
    switch (d?.toLowerCase()) {
      case "engineering":
        return <Code2 className="w-6 h-6" />;
      case "data":
        return <Database className="w-6 h-6" />;
      case "design":
        return <Palette className="w-6 h-6" />;
      case "business":
        return <LineChart className="w-6 h-6" />;
      case "healthcare":
        return <Stethoscope className="w-6 h-6" />;
      default:
        return <Briefcase className="w-6 h-6" />;
    }
  };

  if (loading) {
    return (
      <div className="container-app py-16 flex flex-col items-center justify-center min-h-[50vh]">
        <Loader />
        <p className="mt-4 text-body-sm text-text-muted">Loading verified career details...</p>
      </div>
    );
  }

  if (error || !career) {
    return (
      <div className="container-app py-16 text-center space-y-4">
        <p className="text-red-500 font-semibold">{error || "Career not found"}</p>
        <Link to="/careers">
          <GoldOutlineButton size="md">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Career Bank
          </GoldOutlineButton>
        </Link>
      </div>
    );
  }

  return (
    <div className="container-app py-8 md:py-12 space-y-10 max-w-5xl">
      {/* ─── TOP NAVIGATION & BREADCRUMB ───────────────────────────── */}
      <div className="flex items-center justify-between">
        <Link
          to="/careers"
          className="inline-flex items-center gap-1.5 text-body-sm font-semibold text-accent-gold hover:underline"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Career Bank
        </Link>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleShare}
            className="
              inline-flex items-center gap-1.5 px-3 py-1.5 rounded-button text-xs font-semibold
              bg-card border border-border-subtle hover:border-accent-gold text-text-muted hover:text-text-primary
              transition-colors cursor-pointer
            "
          >
            <Share2 className="w-3.5 h-3.5" />
            {copySuccess ? "Link Copied!" : "Share"}
          </button>
        </div>
      </div>

      {/* ─── CAREER HERO HEADER CARD ───────────────────────────────── */}
      <div className="bg-card border border-border-subtle rounded-card p-6 sm:p-10 shadow-[var(--shadow-card)] theme-transition relative overflow-hidden space-y-6">
        <div className="absolute top-0 right-0 w-64 h-64 bg-accent-gold/10 rounded-full blur-3xl pointer-events-none -z-0" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent-gold/15 border border-accent-gold/30 text-accent-gold text-xs font-semibold uppercase tracking-wider">
                {getDomainIcon(career.domain)}
                {career.domain}
              </span>

              <span
                className={`
                  text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider
                  ${
                    career.demandLevel === "HIGH"
                      ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
                      : career.demandLevel === "MEDIUM"
                      ? "bg-accent-gold/10 text-accent-gold border border-accent-gold/20"
                      : "bg-text-muted/10 text-text-muted border border-border-subtle"
                  }
                `}
              >
                <TrendingUp className="w-3.5 h-3.5 inline mr-1" />
                {career.demandLevel} Demand
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-text-primary leading-tight">
              {career.title}
            </h1>
          </div>

          {/* Bookmark CTA */}
          <div className="shrink-0 flex items-center gap-3">
            <button
              type="button"
              onClick={handleBookmarkToggle}
              disabled={bookmarkLoading}
              className={`
                inline-flex items-center gap-2 px-5 py-3 rounded-button font-semibold text-body-base
                transition-all duration-200 cursor-pointer shadow-sm active:scale-95
                ${
                  isBookmarked
                    ? "bg-emerald-500 text-white hover:bg-emerald-600 border border-transparent"
                    : "bg-accent-gold/10 text-accent-gold hover:bg-accent-gold hover:text-navy-900 border border-accent-gold/30"
                }
              `}
            >
              {isBookmarked ? (
                <>
                  <BookmarkCheck className="w-5 h-5" /> Saved in Bookmarks
                </>
              ) : (
                <>
                  <Bookmark className="w-5 h-5" /> Save Career
                </>
              )}
            </button>
          </div>
        </div>

        {/* Salary & Metrics Banner */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-border-subtle">
          <div className="p-4 rounded-xl bg-base border border-border-subtle">
            <span className="text-caption text-text-muted font-medium uppercase">Salary Compensation</span>
            <p className="text-2xl font-bold font-display text-accent-gold mt-1">
              ${Math.round(career.salaryMin / 1000)}k – ${Math.round(career.salaryMax / 1000)}k
            </p>
            <p className="text-caption text-text-muted">Estimated annual national range</p>
          </div>

          <div className="p-4 rounded-xl bg-base border border-border-subtle">
            <span className="text-caption text-text-muted font-medium uppercase">Industry Field</span>
            <p className="text-2xl font-bold font-display text-text-primary mt-1">
              {career.domain}
            </p>
            <p className="text-caption text-text-muted">Primary occupational cluster</p>
          </div>

          <div className="p-4 rounded-xl bg-base border border-border-subtle">
            <span className="text-caption text-text-muted font-medium uppercase">Passport Compatibility</span>
            <p className="text-2xl font-bold font-display text-emerald-500 flex items-center gap-1.5 mt-1">
              <CheckCircle2 className="w-5 h-5" /> Verified
            </p>
            <p className="text-caption text-text-muted">Direct aptitude alignment available</p>
          </div>
        </div>
      </div>

      {/* ─── CAREER SPECIFICATION BREAKDOWN ────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Specification Column (8 cols) */}
        <div className="lg:col-span-8 space-y-8">
          {/* Overview Description */}
          <section className="bg-card border border-border-subtle rounded-card p-6 sm:p-8 shadow-[var(--shadow-card)] space-y-4 theme-transition">
            <h2 className="text-heading-2 font-heading text-text-primary flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-accent-gold" />
              Role Overview & Responsibilities
            </h2>
            <p className="text-body-base text-text-muted leading-relaxed whitespace-pre-line">
              {career.description}
            </p>
          </section>

          {/* Required Skills & Competencies */}
          <section className="bg-card border border-border-subtle rounded-card p-6 sm:p-8 shadow-[var(--shadow-card)] space-y-4 theme-transition">
            <h2 className="text-heading-2 font-heading text-text-primary flex items-center gap-2">
              <Layers className="w-5 h-5 text-accent-gold" />
              Required Skills & Technologies
            </h2>
            <p className="text-body-sm text-text-muted">
              Mastering these competencies will prepare you directly for roles in this field.
            </p>

            {career.skills && career.skills.length > 0 ? (
              <div className="flex flex-wrap gap-2 pt-2">
                {career.skills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="
                      inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full
                      bg-base border border-border-subtle text-text-primary font-medium text-body-sm
                      hover:border-accent-gold transition-colors
                    "
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-accent-gold" />
                    {skill}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-body-sm text-text-muted">No specific skills listed.</p>
            )}
          </section>

          {/* Education & Career Path */}
          {career.educationPath && (
            <section className="bg-card border border-border-subtle rounded-card p-6 sm:p-8 shadow-[var(--shadow-card)] space-y-4 theme-transition">
              <h2 className="text-heading-2 font-heading text-text-primary flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-accent-gold" />
                Recommended Educational Roadmap
              </h2>
              <p className="text-body-base text-text-muted leading-relaxed whitespace-pre-line">
                {career.educationPath}
              </p>
            </section>
          )}

          {/* Growth Outlook */}
          {career.growthOutlook && (
            <section className="bg-card border border-border-subtle rounded-card p-6 sm:p-8 shadow-[var(--shadow-card)] space-y-4 theme-transition">
              <h2 className="text-heading-2 font-heading text-text-primary flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-accent-gold" />
                Market Growth & Industry Outlook
              </h2>
              <p className="text-body-base text-text-muted leading-relaxed whitespace-pre-line">
                {career.growthOutlook}
              </p>
            </section>
          )}
        </div>

        {/* Right Sidebar: Quick Actions & Tags (4 cols) */}
        <aside className="lg:col-span-4 space-y-6">
          {/* Aptitude CTA */}
          <div className="bg-gradient-to-br from-navy-800 to-navy-900 text-white rounded-card p-6 border-2 border-accent-gold/40 shadow-xl space-y-4">
            <span className="text-[10px] font-bold text-accent-gold uppercase tracking-widest font-mono">
              Aptitude Alignment
            </span>
            <h3 className="text-heading-3 font-heading text-white">
              Is This Career Right For You?
            </h3>
            <p className="text-body-sm text-gray-300">
              Take our interactive assessment to evaluate your personality, problem-solving style, and technical readiness for this track.
            </p>
            <Link to="/quiz" className="block">
              <PrimaryButton size="md" className="w-full">
                Take Career Assessment <ArrowRight className="w-4 h-4 ml-1" />
              </PrimaryButton>
            </Link>
          </div>

          {/* Category Tags */}
          {career.tags && career.tags.length > 0 && (
            <div className="bg-card border border-border-subtle rounded-card p-6 space-y-3 theme-transition">
              <h3 className="text-body-sm font-semibold uppercase tracking-wider text-text-muted">
                Category Tags
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {career.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="text-xs px-2.5 py-1 rounded bg-base text-text-muted border border-border-subtle"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </aside>
      </div>

      {/* ─── RELATED CAREER PATHWAYS ───────────────────────────────── */}
      {relatedCareersList.length > 0 && (
        <section className="pt-8 border-t border-border-subtle space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-heading-2 font-heading text-text-primary">
              Related Career Pathways
            </h2>
            <Link to="/careers" className="text-body-sm font-semibold text-accent-gold hover:underline flex items-center gap-1">
              Explore All <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedCareersList.map((c) => (
              <CareerCard
                key={c.id}
                title={c.title}
                description={c.description}
                icon={getDomainIcon(c.domain)}
                onClick={() => navigate(`/careers/${c.id}`)}
                footer={
                  <div className="flex items-center justify-between text-body-sm">
                    <span className="text-accent-gold font-semibold">
                      ${Math.round(c.salaryMin / 1000)}k – ${Math.round(c.salaryMax / 1000)}k
                    </span>
                    <span className="text-caption font-semibold px-2 py-0.5 rounded bg-accent-gold/10 text-accent-gold">
                      {c.domain}
                    </span>
                  </div>
                }
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
