import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Sparkles,
  Award,
  GraduationCap,
  AlertCircle,
  CheckCircle2,
  Filter,
  PlusCircle,
  ArrowRight,
  RotateCcw,
  SlidersHorizontal,
  Briefcase,
  User,
  Quote,
  X
} from "lucide-react";
import { storiesApi } from "../api/storiesApi";
import PrimaryButton from "../components/ui/PrimaryButton";
import GoldOutlineButton from "../components/ui/GoldOutlineButton";
import Loader from "../components/Loader";

export default function SuccessStories() {
  const navigate = useNavigate();

  const [items, setItems] = useState([]);
  const [domain, setDomain] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const domains = [
    { label: "All Career Domains", value: "" },
    { label: "Engineering", value: "Engineering" },
    { label: "Data & AI", value: "Data" },
    { label: "Design & UX", value: "Design" },
    { label: "Business & Management", value: "Business" },
    { label: "Healthcare", value: "Healthcare" },
  ];

  const loadStories = () => {
    setLoading(true);
    setError("");
    storiesApi
      .getStories({ page: 1, limit: 20, ...(domain && { domain }) })
      .then((res) => {
        setItems(res.data.items || []);
      })
      .catch((err) => setError(err.message || "Failed to load success stories"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadStories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleApply = (e) => {
    if (e) e.preventDefault();
    loadStories();
    setIsMobileFilterOpen(false);
  };

  const handleReset = () => {
    setDomain("");
    setLoading(true);
    storiesApi
      .getStories({ page: 1, limit: 20 })
      .then((res) => {
        setItems(res.data.items || []);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  const FilterControls = () => (
    <form onSubmit={handleApply} className="space-y-4">
      <div>
        <label htmlFor="domain-filter-select" className="text-body-sm font-medium text-text-primary block mb-1.5">
          Select Domain
        </label>
        <select
          id="domain-filter-select"
          value={domain}
          onChange={(e) => setDomain(e.target.value)}
          className="
            w-full px-4 py-2.5 text-body-base text-text-primary
            bg-[var(--bg-input)] border border-border-subtle rounded-button
            focus:outline-none focus:ring-2 focus:ring-[var(--ring-focus)] focus:border-accent-gold
            theme-transition cursor-pointer
          "
        >
          {domains.map((d) => (
            <option key={d.value} value={d.value}>
              {d.label}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-2 pt-2">
        <PrimaryButton type="submit" size="md" className="w-full">
          <Filter className="w-4 h-4 mr-1" /> Filter Stories
        </PrimaryButton>

        {domain && (
          <button
            type="button"
            onClick={handleReset}
            className="
              w-full flex items-center justify-center gap-1.5 py-2 text-body-sm
              text-text-muted hover:text-text-primary rounded-button
              border border-border-subtle hover:bg-base/60 transition-colors cursor-pointer
            "
          >
            <RotateCcw className="w-3.5 h-3.5" /> Show All Stories
          </button>
        )}
      </div>
    </form>
  );

  return (
    <div className="container-app py-8 md:py-12 space-y-8">
      {/* ─── HEADER ────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-border-subtle pb-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-gold/10 border border-accent-gold/20 text-accent-gold text-xs font-semibold uppercase tracking-wider">
            <Award className="w-3.5 h-3.5" /> Inspiring Career Journeys
          </div>
          <h1 className="text-3xl sm:text-4xl font-heading font-bold text-text-primary">
            Alumni & Practitioner Success Stories
          </h1>
          <p className="text-body-sm text-text-muted max-w-2xl">
            Real stories from individuals who navigated aptitude pivots, academic hurdles, and career milestones using structured roadmaps.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link to="/stories/submit">
            <PrimaryButton size="md">
              <PlusCircle className="w-4 h-4 mr-1.5" /> Share Your Story
            </PrimaryButton>
          </Link>

          <div className="md:hidden">
            <GoldOutlineButton size="md" onClick={() => setIsMobileFilterOpen(true)}>
              <SlidersHorizontal className="w-4 h-4" />
            </GoldOutlineButton>
          </div>
        </div>
      </div>

      {/* ─── TWO-COLUMN LAYOUT: STICKY FILTERS + STORIES TIMELINE ──── */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Left Sticky Filter Panel */}
        <aside className="hidden md:block md:col-span-4 lg:col-span-3 bg-card border border-border-subtle rounded-card p-6 shadow-[var(--shadow-card)] sticky top-24 space-y-6 theme-transition">
          <div className="flex items-center justify-between border-b border-border-subtle pb-3">
            <h2 className="text-heading-3 font-heading text-text-primary flex items-center gap-2">
              <Filter className="w-4 h-4 text-accent-gold" /> Filter Domain
            </h2>
            {domain && (
              <button
                type="button"
                onClick={handleReset}
                className="text-[11px] text-accent-gold hover:underline"
              >
                Reset
              </button>
            )}
          </div>
          <FilterControls />
        </aside>

        {/* Stories Timeline Grid */}
        <main className="md:col-span-8 lg:col-span-9 space-y-6">
          {loading ? (
            <div className="space-y-6">
              {[1, 2, 3].map((n) => (
                <div key={n} className="bg-card border border-border-subtle rounded-card p-6 h-56 animate-pulse space-y-4">
                  <div className="h-6 bg-border-subtle rounded w-1/3" />
                  <div className="h-4 bg-border-subtle rounded w-2/3" />
                  <div className="h-4 bg-border-subtle rounded w-full" />
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="p-8 bg-card border border-red-500/20 rounded-card text-center space-y-3">
              <p className="text-red-500 font-semibold">{error}</p>
              <GoldOutlineButton size="sm" onClick={loadStories}>
                Try Again
              </GoldOutlineButton>
            </div>
          ) : items.length > 0 ? (
            <div className="space-y-6">
              {items.map((story) => (
                <article
                  key={story.id}
                  className="
                    bg-card border border-border-subtle rounded-card p-6 sm:p-8
                    shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)]
                    transition-all duration-200 theme-transition relative overflow-hidden space-y-6
                  "
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border-subtle pb-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-caption font-semibold px-2.5 py-0.5 rounded-full bg-accent-gold/15 text-accent-gold">
                          {story.domain}
                        </span>
                      </div>
                      <h3 className="text-xl sm:text-2xl font-heading font-bold text-text-primary">
                        {story.title}
                      </h3>
                    </div>

                    <div className="flex items-center gap-2 text-body-sm text-text-muted font-medium shrink-0">
                      <div className="w-8 h-8 rounded-full bg-accent-gold/10 text-accent-gold flex items-center justify-center font-bold text-xs">
                        {story.authorName?.[0]?.toUpperCase() || "A"}
                      </div>
                      <span>{story.authorName}</span>
                    </div>
                  </div>

                  {/* 3-Step Journey Timeline Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                    {/* Education */}
                    <div className="p-4 rounded-xl bg-base border border-border-subtle space-y-2">
                      <div className="flex items-center gap-2 text-xs font-semibold text-accent-gold uppercase font-mono">
                        <GraduationCap className="w-4 h-4" /> 1. Academic Pathway
                      </div>
                      <p className="text-body-sm text-text-muted leading-relaxed">
                        {story.educationPath}
                      </p>
                    </div>

                    {/* Challenges */}
                    <div className="p-4 rounded-xl bg-base border border-border-subtle space-y-2">
                      <div className="flex items-center gap-2 text-xs font-semibold text-amber-500 uppercase font-mono">
                        <AlertCircle className="w-4 h-4" /> 2. Obstacles Faced
                      </div>
                      <p className="text-body-sm text-text-muted leading-relaxed">
                        {story.challenges}
                      </p>
                    </div>

                    {/* Outcome */}
                    <div className="p-4 rounded-xl bg-base border border-border-subtle space-y-2">
                      <div className="flex items-center gap-2 text-xs font-semibold text-emerald-500 uppercase font-mono">
                        <CheckCircle2 className="w-4 h-4" /> 3. Career Outcome
                      </div>
                      <p className="text-body-sm text-text-muted leading-relaxed">
                        {story.outcome}
                      </p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="bg-card border border-border-subtle rounded-card p-12 text-center space-y-4 theme-transition">
              <div className="w-16 h-16 mx-auto rounded-full bg-accent-gold/10 text-accent-gold flex items-center justify-center">
                <Quote className="w-8 h-8" />
              </div>
              <h2 className="text-heading-2 font-heading text-text-primary">
                No Stories Found in this Domain
              </h2>
              <p className="text-body-sm text-text-muted max-w-md mx-auto">
                Be the first to share your journey and inspire other aspiring professionals in this track.
              </p>
              <Link to="/stories/submit">
                <PrimaryButton size="md">
                  <PlusCircle className="w-4 h-4 mr-1.5" /> Submit a Success Story
                </PrimaryButton>
              </Link>
            </div>
          )}
        </main>
      </div>

      {/* Mobile Filter Drawer */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end bg-black/60 backdrop-blur-sm md:hidden animate-fade-in">
          <div className="bg-card border-t border-border-subtle rounded-t-2xl p-6 max-h-[85vh] overflow-y-auto space-y-6 animate-slide-up shadow-2xl">
            <div className="flex items-center justify-between border-b border-border-subtle pb-3">
              <h2 className="text-heading-2 font-heading text-text-primary flex items-center gap-2">
                <Filter className="w-5 h-5 text-accent-gold" /> Filter Domain
              </h2>
              <button
                type="button"
                onClick={() => setIsMobileFilterOpen(false)}
                className="p-1 rounded-full text-text-muted hover:text-text-primary"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <FilterControls />
          </div>
        </div>
      )}
    </div>
  );
}
