import { useEffect, useState } from "react";
import {
  BookOpen,
  FileText,
  CheckSquare,
  Image,
  Download,
  Eye,
  Search,
  Filter,
  Sparkles,
  RotateCcw,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  X,
  ExternalLink,
  Users,
  CheckCircle2
} from "lucide-react";
import { resourceApi } from "../api/resourceApi";
import PrimaryButton from "../components/ui/PrimaryButton";
import GoldOutlineButton from "../components/ui/GoldOutlineButton";
import Loader from "../components/Loader";

export default function ResourceLibrary() {
  const [items, setItems] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [type, setType] = useState("");
  const [audience, setAudience] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");

  // Modal State
  const [previewResource, setPreviewResource] = useState(null);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const resourceTypes = [
    { label: "All Formats", value: "" },
    { label: "PDF Roadmaps & Guides", value: "PDF" },
    { label: "Checklists & Templates", value: "CHECKLIST" },
    { label: "Infographics & Visuals", value: "INFOGRAPHIC" },
  ];

  const loadResources = (pageNum = page) => {
    setLoading(true);
    setError("");
    resourceApi
      .getResources({
        page: pageNum,
        limit: 9,
        ...(type && { type }),
        ...(audience.trim() && { audience: audience.trim() }),
        ...(search.trim() && { search: search.trim() }),
      })
      .then((res) => {
        setItems(res.data.items || []);
        setPagination(res.data.pagination || null);
      })
      .catch((err) => setError(err.message || "Failed to load resources"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadResources(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleApply = (e) => {
    if (e) e.preventDefault();
    setPage(1);
    loadResources(1);
    setIsMobileFilterOpen(false);
  };

  const handleReset = () => {
    setType("");
    setAudience("");
    setSearch("");
    setPage(1);
    setLoading(true);
    resourceApi
      .getResources({ page: 1, limit: 9 })
      .then((res) => {
        setItems(res.data.items || []);
        setPagination(res.data.pagination || null);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  const goToPage = (p) => {
    setPage(p);
    loadResources(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDownload = async (r) => {
    try {
      const res = await resourceApi.downloadResource(r.id);
      setStatus(`Download started for "${r.title}". (Total downloads: ${res.data.downloadCount})`);
      // Update local item download count
      setItems((prev) =>
        prev.map((item) =>
          item.id === r.id ? { ...item, downloadCount: res.data.downloadCount } : item
        )
      );
      if (previewResource?.id === r.id) {
        setPreviewResource((prev) => ({ ...prev, downloadCount: res.data.downloadCount }));
      }
      setTimeout(() => setStatus(""), 4000);
    } catch (err) {
      setError(err.message || "Failed to download resource");
    }
  };

  const getTypeIcon = (t) => {
    switch (t) {
      case "CHECKLIST":
        return <CheckSquare className="w-5 h-5" />;
      case "INFOGRAPHIC":
        return <Image className="w-5 h-5" />;
      default:
        return <FileText className="w-5 h-5" />;
    }
  };

  const hasActiveFilters = Boolean(type || audience || search);

  const FilterControls = () => (
    <form onSubmit={handleApply} className="space-y-5">
      <div>
        <label htmlFor="res-search" className="text-body-sm font-medium text-text-primary block mb-1.5">
          Keyword Search
        </label>
        <div className="relative">
          <input
            id="res-search"
            type="text"
            placeholder="e.g. Roadmap, Resume, Cloud"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
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
        <label htmlFor="res-type" className="text-body-sm font-medium text-text-primary block mb-1.5">
          Resource Type
        </label>
        <select
          id="res-type"
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="
            w-full px-4 py-2.5 text-body-base text-text-primary
            bg-[var(--bg-input)] border border-border-subtle rounded-button
            focus:outline-none focus:ring-2 focus:ring-[var(--ring-focus)] focus:border-accent-gold
            theme-transition cursor-pointer
          "
        >
          {resourceTypes.map((rt) => (
            <option key={rt.value} value={rt.value}>
              {rt.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="res-audience" className="text-body-sm font-medium text-text-primary block mb-1.5">
          Target Audience
        </label>
        <input
          id="res-audience"
          type="text"
          placeholder="e.g. Student, Graduate, All"
          value={audience}
          onChange={(e) => setAudience(e.target.value)}
          className="
            w-full px-4 py-2.5 text-body-base text-text-primary
            placeholder:text-text-muted/60 bg-[var(--bg-input)] border border-border-subtle rounded-button
            focus:outline-none focus:ring-2 focus:ring-[var(--ring-focus)] focus:border-accent-gold
            theme-transition
          "
        />
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
            <RotateCcw className="w-3.5 h-3.5" /> Clear Filters
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
            <BookOpen className="w-3.5 h-3.5" /> Curated Career Documents
          </div>
          <h1 className="text-3xl sm:text-4xl font-heading font-bold text-text-primary">
            Resource Library & Toolkits
          </h1>
          <p className="text-body-sm text-text-muted mt-1">
            Download verified roadmaps, interview checklists, technical skill frameworks, and curriculum guidelines.
          </p>
        </div>

        <div className="md:hidden">
          <GoldOutlineButton size="md" onClick={() => setIsMobileFilterOpen(true)} className="w-full">
            <SlidersHorizontal className="w-4 h-4 mr-2" />
            Filters {hasActiveFilters && "• Active"}
          </GoldOutlineButton>
        </div>
      </div>

      {status && (
        <div className="p-3.5 rounded-button bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-body-sm animate-fade-in flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{status}</span>
        </div>
      )}

      {/* ─── TWO-COLUMN LAYOUT ─────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Left Sticky Filter Panel */}
        <aside className="hidden md:block md:col-span-4 lg:col-span-3 bg-card border border-border-subtle rounded-card p-6 shadow-[var(--shadow-card)] sticky top-24 space-y-6 theme-transition">
          <div className="flex items-center justify-between border-b border-border-subtle pb-3">
            <h2 className="text-heading-3 font-heading text-text-primary flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-accent-gold" /> Filter Resources
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

        {/* Resource Cards Grid */}
        <main className="md:col-span-8 lg:col-span-9 space-y-6">
          <div className="flex items-center justify-between text-body-sm text-text-muted border-b border-border-subtle pb-3">
            <span>
              Showing{" "}
              <strong className="text-text-primary">
                {items.length} of {pagination?.total || items.length}
              </strong>{" "}
              toolkits
            </span>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div
                  key={n}
                  className="bg-card border border-border-subtle rounded-card p-6 h-60 animate-pulse space-y-4"
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
              <GoldOutlineButton size="sm" onClick={() => loadResources(1)}>
                Try Again
              </GoldOutlineButton>
            </div>
          ) : items.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {items.map((r) => (
                <div
                  key={r.id}
                  className="
                    group relative flex flex-col justify-between
                    bg-card border border-border-subtle hover:border-accent-gold/50
                    rounded-card p-6 shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)]
                    hover:-translate-y-1 transition-all duration-200 theme-transition
                  "
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-accent-gold/15 text-accent-gold border border-accent-gold/20">
                        {getTypeIcon(r.type)}
                        {r.type}
                      </span>
                      <span className="text-caption text-text-muted flex items-center gap-1">
                        <Users className="w-3 h-3" /> {r.audience}
                      </span>
                    </div>

                    <h3 className="text-lg font-heading font-bold text-text-primary leading-snug">
                      {r.title}
                    </h3>

                    {r.description && (
                      <p className="text-body-sm text-text-muted line-clamp-2">
                        {r.description}
                      </p>
                    )}
                  </div>

                  <div className="pt-4 mt-4 border-t border-border-subtle flex items-center justify-between text-body-sm">
                    <span className="text-caption text-text-muted flex items-center gap-1">
                      <Download className="w-3.5 h-3.5 text-accent-gold" />
                      <strong>{r.downloadCount}</strong> downloads
                    </span>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setPreviewResource(r)}
                        className="p-2 rounded-button bg-base hover:bg-card border border-border-subtle text-text-muted hover:text-accent-gold transition-colors"
                        title="Preview resource"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDownload(r)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-button text-xs font-semibold bg-navy-800 text-white dark:bg-accent-gold dark:text-navy-900 hover:opacity-90 transition-opacity"
                      >
                        <Download className="w-3.5 h-3.5" /> Download
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-card border border-border-subtle rounded-card p-12 text-center space-y-4 theme-transition">
              <div className="w-16 h-16 mx-auto rounded-full bg-accent-gold/10 text-accent-gold flex items-center justify-center">
                <BookOpen className="w-8 h-8" />
              </div>
              <h2 className="text-heading-2 font-heading text-text-primary">
                No Resources Found
              </h2>
              <p className="text-body-sm text-text-muted max-w-md mx-auto">
                No toolkits matched your current keyword or audience selection.
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

      {/* ─── RESOURCE PREVIEW MODAL ─────────────────────────────────── */}
      {previewResource && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-card border border-border-subtle rounded-card p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-6 animate-slide-up">
            <div className="flex items-start justify-between border-b border-border-subtle pb-4">
              <div className="space-y-1">
                <span className="text-caption font-semibold px-2.5 py-0.5 rounded-full bg-accent-gold/15 text-accent-gold uppercase font-mono">
                  {previewResource.type}
                </span>
                <h3 className="text-xl font-heading font-bold text-text-primary">
                  {previewResource.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setPreviewResource(null)}
                className="p-1 rounded-full text-text-muted hover:text-text-primary"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-body-sm">
              <p className="text-text-muted leading-relaxed">
                {previewResource.description || "Comprehensive verified career document and roadmap guideline."}
              </p>

              <div className="grid grid-cols-2 gap-3 p-3 rounded-lg bg-base border border-border-subtle text-xs">
                <div>
                  <span className="text-text-muted block">Target Audience</span>
                  <span className="font-semibold text-text-primary">{previewResource.audience}</span>
                </div>
                <div>
                  <span className="text-text-muted block">Total Downloads</span>
                  <span className="font-semibold text-accent-gold">{previewResource.downloadCount} verified</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-border-subtle">
              <GoldOutlineButton size="md" onClick={() => setPreviewResource(null)}>
                Close Preview
              </GoldOutlineButton>
              <PrimaryButton size="md" onClick={() => handleDownload(previewResource)}>
                <Download className="w-4 h-4 mr-1.5" /> Download Toolkit
              </PrimaryButton>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Filter Drawer */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end bg-black/60 backdrop-blur-sm md:hidden animate-fade-in">
          <div className="bg-card border-t border-border-subtle rounded-t-2xl p-6 max-h-[85vh] overflow-y-auto space-y-6 animate-slide-up shadow-2xl">
            <div className="flex items-center justify-between border-b border-border-subtle pb-3">
              <h2 className="text-heading-2 font-heading text-text-primary flex items-center gap-2">
                <Filter className="w-5 h-5 text-accent-gold" /> Filter Resources
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
