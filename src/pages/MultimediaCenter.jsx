import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Video,
  Headphones,
  Film,
  Sparkles,
  Filter,
  Search,
  ArrowRight,
  RotateCcw,
  SlidersHorizontal,
  Star,
  Clock,
  Play,
  Layers,
  ChevronLeft,
  ChevronRight,
  X
} from "lucide-react";
import { mediaApi } from "../api/mediaApi";
import PrimaryButton from "../components/ui/PrimaryButton";
import GoldOutlineButton from "../components/ui/GoldOutlineButton";
import Loader from "../components/Loader";
import useCardGridEntrance from "../hooks/useCardGridEntrance";

export default function MultimediaCenter() {
  const navigate = useNavigate();
  const gridRef = useCardGridEntrance(".animate-card-item", []);

  const [items, setItems] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Filters State
  const [type, setType] = useState("");
  const [category, setCategory] = useState("");
  const [page, setPage] = useState(1);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const mediaTypes = [
    { label: "All Media Types", value: "" },
    { label: "Day-in-the-Life Videos", value: "VIDEO" },
    { label: "Expert Audio Podcasts", value: "PODCAST" },
    { label: "Animated Concept Explainers", value: "ANIMATED_EXPLAINER" },
  ];

  const loadMedia = (pageNum = page) => {
    setLoading(true);
    setError("");
    mediaApi
      .getMedia({
        page: pageNum,
        limit: 9,
        ...(type && { type }),
        ...(category.trim() && { category: category.trim() }),
      })
      .then((res) => {
        setItems(res.data.items || []);
        setPagination(res.data.pagination || null);
      })
      .catch((err) => setError(err.message || "Failed to load multimedia items"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadMedia(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleApply = (e) => {
    if (e) e.preventDefault();
    setPage(1);
    loadMedia(1);
    setIsMobileFilterOpen(false);
  };

  const handleReset = () => {
    setType("");
    setCategory("");
    setPage(1);
    setLoading(true);
    mediaApi
      .getMedia({ page: 1, limit: 9 })
      .then((res) => {
        setItems(res.data.items || []);
        setPagination(res.data.pagination || null);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  const goToPage = (p) => {
    setPage(p);
    loadMedia(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const getMediaIcon = (t) => {
    switch (t) {
      case "PODCAST":
        return <Headphones className="w-5 h-5" />;
      case "ANIMATED_EXPLAINER":
        return <Film className="w-5 h-5" />;
      default:
        return <Video className="w-5 h-5" />;
    }
  };

  const formatMediaType = (t) => {
    switch (t) {
      case "PODCAST":
        return "Podcast";
      case "ANIMATED_EXPLAINER":
        return "Explainer";
      default:
        return "Video";
    }
  };

  const hasActiveFilters = Boolean(type || category);

  // Filter Form Content
  const FilterControls = () => (
    <form onSubmit={handleApply} className="space-y-5">
      <div>
        <label htmlFor="media-category-input" className="text-body-sm font-medium text-text-primary block mb-1.5">
          Category / Topic
        </label>
        <div className="relative">
          <input
            id="media-category-input"
            type="text"
            placeholder="e.g. Engineering, AI, Design"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="
              w-full pl-9 pr-4 py-2.5 text-body-base text-text-primary
              placeholder:text-text-muted/60 bg-[var(--bg-input)] border border-border-subtle rounded-button
              focus:outline-none focus:ring-2 focus:ring-[var(--ring-focus)] focus:border-accent-gold
              theme-transition
            "
          />
          <Search className="w-4 h-4 text-text-muted absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>

      <div>
        <label htmlFor="media-type-select" className="text-body-sm font-medium text-text-primary block mb-1.5">
          Content Format
        </label>
        <select
          id="media-type-select"
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="
            w-full px-4 py-2.5 text-body-base text-text-primary
            bg-[var(--bg-input)] border border-border-subtle rounded-button
            focus:outline-none focus:ring-2 focus:ring-[var(--ring-focus)] focus:border-accent-gold
            theme-transition cursor-pointer
          "
        >
          {mediaTypes.map((mt) => (
            <option key={mt.value} value={mt.value}>
              {mt.label}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-2 pt-2">
        <PrimaryButton type="submit" size="md" className="w-full">
          <Filter className="w-4 h-4 mr-1" /> Apply Filters
        </PrimaryButton>

        {hasActiveFilters && (
          <button
            type="button"
            onClick={handleReset}
            className="
              w-full flex items-center justify-center gap-1.5 py-2 text-body-sm
              text-text-muted hover:text-text-primary rounded-button
              border border-border-subtle hover:bg-base/60 transition-colors cursor-pointer
            "
          >
            <RotateCcw className="w-3.5 h-3.5" /> Reset Filters
          </button>
        )}
      </div>
    </form>
  );

  return (
    <div className="container-app py-8 md:py-12 space-y-8">
      {/* ─── HEADER ────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-border-subtle pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-gold/10 border border-accent-gold/20 text-accent-gold text-xs font-semibold uppercase tracking-wider mb-2">
            <Video className="w-3.5 h-3.5" /> Audio, Video & Explainers
          </div>
          <h1 className="text-3xl sm:text-4xl font-display font-bold text-text-primary">
            Multimedia Learning Center
          </h1>
          <p className="text-body-sm text-text-muted mt-1">
            Watch day-in-the-life career documentations, listen to podcasts with industry practitioners, and explore animated concepts.
          </p>
        </div>

        {/* Mobile Filter Button */}
        <div className="md:hidden">
          <GoldOutlineButton size="md" onClick={() => setIsMobileFilterOpen(true)} className="w-full">
            <SlidersHorizontal className="w-4 h-4 mr-2" />
            Filters {hasActiveFilters && "• Active"}
          </GoldOutlineButton>
        </div>
      </div>

      {/* ─── TWO COLUMN LAYOUT: STICKY FILTERS + MEDIA GRID ────────── */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* DESKTOP FILTER PANEL (3 cols) */}
        <aside className="hidden md:block md:col-span-4 lg:col-span-3 bg-card border border-border-subtle rounded-card p-6 shadow-[var(--shadow-card)] sticky top-24 space-y-6 theme-transition">
          <div className="flex items-center justify-between border-b border-border-subtle pb-3">
            <h2 className="text-heading-3 font-heading text-text-primary flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-accent-gold" />
              Filter Media
            </h2>
            {hasActiveFilters && (
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

        {/* MEDIA CARDS GRID (9 cols) */}
        <main className="md:col-span-8 lg:col-span-9 space-y-6">
          <div className="flex items-center justify-between text-body-sm text-text-muted border-b border-border-subtle pb-3">
            <span>
              Showing{" "}
              <strong className="text-text-primary">
                {items.length} of {pagination?.total || items.length}
              </strong>{" "}
              multimedia resources
            </span>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div
                  key={n}
                  className="bg-card border border-border-subtle rounded-card p-6 h-64 animate-pulse space-y-4"
                >
                  <div className="w-10 h-10 bg-border-subtle rounded-lg" />
                  <div className="h-6 bg-border-subtle rounded w-3/4" />
                  <div className="h-4 bg-border-subtle rounded w-full" />
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="p-8 bg-card border border-red-500/20 rounded-card text-center space-y-3">
              <p className="text-red-500 font-semibold">{error}</p>
              <GoldOutlineButton size="sm" onClick={() => loadMedia(1)}>
                Try Again
              </GoldOutlineButton>
            </div>
          ) : items.length > 0 ? (
            <div ref={gridRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {items.map((m) => (
                <div
                  key={m.id}
                  onClick={() => navigate(`/media/${m.id}`)}
                  className="
                    animate-card-item
                    group relative flex flex-col justify-between
                    bg-card border border-border-subtle hover:border-accent-gold/50
                    rounded-2xl p-5 sm:p-6 shadow-card hover:shadow-card-hover hover:shadow-gold-glow
                    hover:-translate-y-1.5 hover:scale-[1.015] transition-all duration-300 ease-out cursor-pointer theme-transition
                  "
                >
                  {/* Thumbnail / Header Area */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-accent-gold/15 text-accent-gold border border-accent-gold/20">
                        {getMediaIcon(m.type)}
                        {formatMediaType(m.type)}
                      </span>
                      <span className="text-caption text-text-muted font-medium">
                        {m.category}
                      </span>
                    </div>

                    <h3 className="text-heading-3 font-heading text-text-primary group-hover:text-accent-gold transition-colors leading-snug">
                      {m.title}
                    </h3>
                  </div>

                  {/* Card Footer */}
                  <div className="pt-4 mt-4 border-t border-border-subtle flex items-center justify-between text-body-sm">
                    <div className="flex items-center gap-1 text-accent-gold font-semibold text-xs">
                      <Play className="w-3.5 h-3.5 fill-accent-gold" />
                      <span>Watch & Learn</span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-text-muted group-hover:text-accent-gold transition-colors" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-card border border-border-subtle rounded-card p-12 text-center space-y-4 theme-transition">
              <div className="w-16 h-16 mx-auto rounded-full bg-accent-gold/10 text-accent-gold flex items-center justify-center">
                <Video className="w-8 h-8" />
              </div>
              <h2 className="text-heading-2 font-heading text-text-primary">
                No Media Found
              </h2>
              <p className="text-body-sm text-text-muted max-w-md mx-auto">
                No multimedia lessons matched your current filter criteria.
              </p>
              <PrimaryButton size="md" onClick={handleReset}>
                <RotateCcw className="w-4 h-4 mr-1" /> Reset All Filters
              </PrimaryButton>
            </div>
          )}

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="flex items-center justify-between pt-6 border-t border-border-subtle">
              <GoldOutlineButton
                size="sm"
                disabled={pagination.page <= 1}
                onClick={() => goToPage(pagination.page - 1)}
              >
                <ChevronLeft className="w-4 h-4 mr-1" /> Previous
              </GoldOutlineButton>

              <span className="text-body-sm text-text-muted">
                Page {pagination.page} of {pagination.totalPages}
              </span>

              <GoldOutlineButton
                size="sm"
                disabled={pagination.page >= pagination.totalPages}
                onClick={() => goToPage(pagination.page + 1)}
              >
                Next <ChevronRight className="w-4 h-4 ml-1" />
              </GoldOutlineButton>
            </div>
          )}
        </main>
      </div>

      {/* ─── MOBILE FILTER DRAWER ──────────────────────────────────── */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end bg-black/60 backdrop-blur-sm md:hidden animate-fade-in">
          <div className="bg-card border-t border-border-subtle rounded-t-2xl p-6 max-h-[85vh] overflow-y-auto space-y-6 animate-slide-up shadow-2xl">
            <div className="flex items-center justify-between border-b border-border-subtle pb-3">
              <h2 className="text-heading-2 font-heading text-text-primary flex items-center gap-2">
                <Filter className="w-5 h-5 text-accent-gold" /> Filter Media
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
