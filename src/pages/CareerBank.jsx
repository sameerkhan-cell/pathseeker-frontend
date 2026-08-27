import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Compass,
  Search,
  Filter,
  X,
  Bookmark,
  BookmarkPlus,
  ArrowRight,
  Sparkles,
  DollarSign,
  Briefcase,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  SlidersHorizontal,
  Code2,
  Cpu,
  Database,
  Palette,
  LineChart,
  Stethoscope
} from "lucide-react";
import { careerApi } from "../api/careerApi";
import CareerCard from "../components/ui/CareerCard";
import PrimaryButton from "../components/ui/PrimaryButton";
import GoldOutlineButton from "../components/ui/GoldOutlineButton";
import TextField from "../components/ui/TextField";
import Loader from "../components/Loader";
import useCardGridEntrance from "../hooks/useCardGridEntrance";

export default function CareerBank() {
  const navigate = useNavigate();
  const gridRef = useCardGridEntrance(".animate-card-item", []);

  const [items, setItems] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [savedFilters, setSavedFilters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");

  // Filters State
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [domain, setDomain] = useState("");
  const [minSalary, setMinSalary] = useState("");
  const [maxSalary, setMaxSalary] = useState("");
  const [demand, setDemand] = useState("");

  // Mobile / Tablet Filter Drawer State
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [saveModalOpen, setSaveModalOpen] = useState(false);
  const [filterNameInput, setFilterNameInput] = useState("");

  const domains = [
    { label: "All Domains", value: "" },
    { label: "Engineering", value: "Engineering" },
    { label: "Data & AI", value: "Data" },
    { label: "Design & UX", value: "Design" },
    { label: "Business & Management", value: "Business" },
    { label: "Healthcare", value: "Healthcare" },
  ];

  const demandLevels = [
    { label: "Any Demand", value: "" },
    { label: "High Demand", value: "HIGH" },
    { label: "Medium Demand", value: "MEDIUM" },
    { label: "Low Demand", value: "LOW" },
  ];

  const getDomainIcon = (d) => {
    switch (d?.toLowerCase()) {
      case "engineering":
        return <Code2 className="w-5 h-5" />;
      case "data":
        return <Database className="w-5 h-5" />;
      case "design":
        return <Palette className="w-5 h-5" />;
      case "business":
        return <LineChart className="w-5 h-5" />;
      case "healthcare":
        return <Stethoscope className="w-5 h-5" />;
      default:
        return <Briefcase className="w-5 h-5" />;
    }
  };

  const loadCareers = (pageNum = page) => {
    setLoading(true);
    setError("");
    const filters = {
      page: pageNum,
      limit: 9,
      ...(search.trim() && { search: search.trim() }),
      ...(domain && { domain }),
      ...(minSalary && { minSalary: Number(minSalary) }),
      ...(maxSalary && { maxSalary: Number(maxSalary) }),
      ...(demand && { demand }),
    };

    careerApi
      .getCareers(filters)
      .then((res) => {
        setItems(res.data.items || []);
        setPagination(res.data.pagination || null);
      })
      .catch((err) => setError(err.message || "Failed to load career listings"))
      .finally(() => setLoading(false));
  };

  const loadSavedFilters = () => {
    careerApi
      .getSavedFilters()
      .then((res) => {
        setSavedFilters(res.data.savedFilters || []);
      })
      .catch(() => {});
  };

  useEffect(() => {
    loadCareers(1);
    loadSavedFilters();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleApply = (e) => {
    if (e) e.preventDefault();
    setPage(1);
    loadCareers(1);
    setIsMobileFilterOpen(false);
  };

  const handleReset = () => {
    setSearch("");
    setDomain("");
    setMinSalary("");
    setMaxSalary("");
    setDemand("");
    setPage(1);
    setLoading(true);

    careerApi
      .getCareers({ page: 1, limit: 9 })
      .then((res) => {
        setItems(res.data.items || []);
        setPagination(res.data.pagination || null);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  const goToPage = (p) => {
    setPage(p);
    loadCareers(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSaveFilter = async (e) => {
    e.preventDefault();
    if (!filterNameInput.trim()) return;
    try {
      await careerApi.saveFilter(filterNameInput.trim(), {
        search,
        domain,
        minSalary,
        maxSalary,
        demand,
      });
      setStatus(`Saved filter "${filterNameInput}" successfully!`);
      setFilterNameInput("");
      setSaveModalOpen(false);
      loadSavedFilters();
      setTimeout(() => setStatus(""), 4000);
    } catch (err) {
      setError(err.message || "Could not save filter");
    }
  };

  const applySavedFilter = async (f) => {
    const c = f.filterConfig || {};
    setSearch(c.search || "");
    setDomain(c.domain || "");
    setMinSalary(c.minSalary || "");
    setMaxSalary(c.maxSalary || "");
    setDemand(c.demand || "");
    setPage(1);

    try {
      const filters = {
        page: 1,
        limit: 9,
        ...(c.search && { search: c.search }),
        ...(c.domain && { domain: c.domain }),
        ...(c.minSalary && { minSalary: Number(c.minSalary) }),
        ...(c.maxSalary && { maxSalary: Number(c.maxSalary) }),
        ...(c.demand && { demand: c.demand }),
      };
      setLoading(true);
      const res = await careerApi.getCareers(filters);
      setItems(res.data.items || []);
      setPagination(res.data.pagination || null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const removeSavedFilter = async (id, name, e) => {
    e.stopPropagation();
    try {
      await careerApi.deleteSavedFilter(id);
      loadSavedFilters();
    } catch (err) {
      setError(err.message);
    }
  };

  const hasActiveFilters = Boolean(search || domain || minSalary || maxSalary || demand);

  // Filter Form Content (Shared between desktop sidebar & mobile drawer)
  const FilterControls = () => (
    <form onSubmit={handleApply} className="space-y-5">
      {/* Search Field */}
      <div>
        <label htmlFor="search-input" className="text-body-sm font-medium text-text-primary block mb-1.5">
          Keyword Search
        </label>
        <div className="relative">
          <input
            id="search-input"
            type="text"
            placeholder="e.g. Software, Data, Figma"
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

      {/* Domain Dropdown */}
      <div>
        <label htmlFor="domain-select" className="text-body-sm font-medium text-text-primary block mb-1.5">
          Career Domain
        </label>
        <select
          id="domain-select"
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

      {/* Demand Level */}
      <div>
        <label htmlFor="demand-select" className="text-body-sm font-medium text-text-primary block mb-1.5">
          Industry Demand
        </label>
        <select
          id="demand-select"
          value={demand}
          onChange={(e) => setDemand(e.target.value)}
          className="
            w-full px-4 py-2.5 text-body-base text-text-primary
            bg-[var(--bg-input)] border border-border-subtle rounded-button
            focus:outline-none focus:ring-2 focus:ring-[var(--ring-focus)] focus:border-accent-gold
            theme-transition cursor-pointer
          "
        >
          {demandLevels.map((dl) => (
            <option key={dl.value} value={dl.value}>
              {dl.label}
            </option>
          ))}
        </select>
      </div>

      {/* Salary Range */}
      <div>
        <span className="text-body-sm font-medium text-text-primary block mb-1.5">
          Annual Salary Range ($)
        </span>
        <div className="grid grid-cols-2 gap-2">
          <input
            type="number"
            placeholder="Min (e.g. 50000)"
            value={minSalary}
            onChange={(e) => setMinSalary(e.target.value)}
            className="
              w-full px-3 py-2 text-body-sm text-text-primary
              placeholder:text-text-muted/60 bg-[var(--bg-input)] border border-border-subtle rounded-button
              focus:outline-none focus:ring-2 focus:ring-[var(--ring-focus)] focus:border-accent-gold
              theme-transition
            "
          />
          <input
            type="number"
            placeholder="Max (e.g. 150000)"
            value={maxSalary}
            onChange={(e) => setMaxSalary(e.target.value)}
            className="
              w-full px-3 py-2 text-body-sm text-text-primary
              placeholder:text-text-muted/60 bg-[var(--bg-input)] border border-border-subtle rounded-button
              focus:outline-none focus:ring-2 focus:ring-[var(--ring-focus)] focus:border-accent-gold
              theme-transition
            "
          />
        </div>
      </div>

      {/* Actions */}
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
            <RotateCcw className="w-3.5 h-3.5" /> Clear All Filters
          </button>
        )}

        <button
          type="button"
          onClick={() => setSaveModalOpen(true)}
          className="
            w-full flex items-center justify-center gap-1.5 py-2 text-body-sm font-semibold
            text-accent-gold hover:text-accent-gold/80 rounded-button
            bg-accent-gold/10 hover:bg-accent-gold/15 border border-accent-gold/20 transition-colors cursor-pointer
          "
        >
          <BookmarkPlus className="w-4 h-4" /> Save This Filter
        </button>
      </div>
    </form>
  );

  return (
    <div className="container-app py-8 md:py-12 space-y-8">
      {/* ─── PAGE HEADER ───────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-border-subtle pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-gold/10 border border-accent-gold/20 text-accent-gold text-xs font-semibold uppercase tracking-wider mb-2">
            <Compass className="w-3.5 h-3.5" /> Verified Career Database
          </div>
          <h1 className="text-3xl sm:text-4xl font-display font-bold text-text-primary">
            Career Bank & Roadmap
          </h1>
          <p className="text-body-sm text-text-muted mt-1">
            Explore verified career paths, real-world salary ranges, required technical stacks, and market demand levels.
          </p>
        </div>

        {/* Mobile Filter Trigger Button */}
        <div className="md:hidden">
          <GoldOutlineButton size="md" onClick={() => setIsMobileFilterOpen(true)} className="w-full">
            <SlidersHorizontal className="w-4 h-4 mr-2" />
            Filters {hasActiveFilters && "• Active"}
          </GoldOutlineButton>
        </div>
      </div>

      {/* Status feedback */}
      {status && (
        <div className="p-3.5 rounded-button bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-body-sm animate-fade-in">
          {status}
        </div>
      )}

      {/* ─── SAVED FILTERS CHIPS ROW ───────────────────────────────── */}
      {savedFilters.length > 0 && (
        <div className="space-y-2">
          <span className="text-caption text-text-muted font-medium uppercase tracking-wider">
            Your Saved Filters:
          </span>
          <div className="flex flex-wrap gap-2">
            {savedFilters.map((f) => (
              <div
                key={f.id}
                onClick={() => applySavedFilter(f)}
                className="
                  inline-flex items-center gap-2 px-3 py-1.5 rounded-full
                  bg-card border border-border-subtle hover:border-accent-gold text-body-sm
                  text-text-primary transition-all duration-200 cursor-pointer shadow-sm group
                "
              >
                <Bookmark className="w-3.5 h-3.5 text-accent-gold" />
                <span className="font-semibold text-xs">{f.name}</span>
                <button
                  type="button"
                  title="Remove saved filter"
                  onClick={(e) => removeSavedFilter(f.id, f.name, e)}
                  className="p-0.5 rounded-full hover:bg-red-500/20 text-text-muted hover:text-red-500 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─── MAIN TWO-COLUMN LAYOUT: STICKY FILTERS (LEFT) + CARDS (RIGHT) */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* DESKTOP STICKY FILTER PANEL (280px / 4 cols) */}
        <aside className="hidden md:block md:col-span-4 lg:col-span-3 bg-card border border-border-subtle rounded-card p-6 shadow-[var(--shadow-card)] sticky top-24 space-y-6 theme-transition">
          <div className="flex items-center justify-between border-b border-border-subtle pb-3">
            <h2 className="text-heading-3 font-heading text-text-primary flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-accent-gold" />
              Filter Careers
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

        {/* CAREER CARDS GRID (8 cols / 9 cols) */}
        <main className="md:col-span-8 lg:col-span-9 space-y-6">
          {/* Results Summary Bar */}
          <div className="flex items-center justify-between text-body-sm text-text-muted border-b border-border-subtle pb-3">
            <span>
              Showing{" "}
              <strong className="text-text-primary">
                {items.length} of {pagination?.total || items.length}
              </strong>{" "}
              career pathways
            </span>
            {pagination && pagination.totalPages > 1 && (
              <span>
                Page {pagination.page} of {pagination.totalPages}
              </span>
            )}
          </div>

          {/* Cards Display */}
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
                  <div className="h-4 bg-border-subtle rounded w-2/3" />
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="p-8 bg-card border border-red-500/20 rounded-card text-center space-y-3">
              <p className="text-red-500 font-semibold">{error}</p>
              <GoldOutlineButton size="sm" onClick={() => loadCareers(1)}>
                Try Again
              </GoldOutlineButton>
            </div>
          ) : items.length > 0 ? (
            <div ref={gridRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {items.map((career) => (
                <div key={career.id} className="animate-card-item">
                  <CareerCard
                    title={career.title}
                    description={career.description}
                    icon={getDomainIcon(career.domain)}
                    onClick={() => navigate(`/careers/${career.id}`)}
                    footer={
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-body-sm">
                          <span className="text-accent-gold font-semibold">
                            ${Math.round(career.salaryMin / 1000)}k – ${Math.round(career.salaryMax / 1000)}k
                          </span>
                          <span
                            className={`
                              text-caption font-bold px-2 py-0.5 rounded uppercase
                              ${
                                career.demandLevel === "HIGH"
                                  ? "bg-emerald-500/10 text-emerald-500"
                                  : career.demandLevel === "MEDIUM"
                                  ? "bg-accent-gold/10 text-accent-gold"
                                  : "bg-text-muted/10 text-text-muted"
                              }
                            `}
                          >
                            {career.demandLevel} Demand
                          </span>
                        </div>

                        <div className="flex items-center justify-between text-caption text-text-muted pt-1 border-t border-border-subtle">
                          <span className="font-semibold text-text-primary">{career.domain}</span>
                          <span className="flex items-center gap-1 text-accent-gold group-hover:underline">
                            View Track <ArrowRight className="w-3 h-3" />
                          </span>
                        </div>
                      </div>
                    }
                  />
                </div>
              ))}
            </div>
          ) : (
            /* Friendly Empty State */
            <div className="bg-card border border-border-subtle rounded-card p-12 text-center space-y-4 theme-transition">
              <div className="w-16 h-16 mx-auto rounded-full bg-accent-gold/10 text-accent-gold flex items-center justify-center">
                <Compass className="w-8 h-8" />
              </div>
              <h2 className="text-heading-2 font-heading text-text-primary">
                No Careers Match Your Filters
              </h2>
              <p className="text-body-sm text-text-muted max-w-md mx-auto">
                We couldn't find any career tracks matching your current combination of keyword, domain, and salary criteria.
              </p>
              <PrimaryButton size="md" onClick={handleReset}>
                <RotateCcw className="w-4 h-4 mr-1" /> Reset All Filters
              </PrimaryButton>
            </div>
          )}

          {/* ─── PAGINATION CONTROLS ───────────────────────────────── */}
          {pagination && pagination.totalPages > 1 && (
            <div className="flex items-center justify-between pt-6 border-t border-border-subtle">
              <GoldOutlineButton
                size="sm"
                disabled={pagination.page <= 1}
                onClick={() => goToPage(pagination.page - 1)}
              >
                <ChevronLeft className="w-4 h-4 mr-1" /> Previous
              </GoldOutlineButton>

              <div className="flex items-center gap-1.5 text-body-sm">
                {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((pNum) => (
                  <button
                    key={pNum}
                    onClick={() => goToPage(pNum)}
                    className={`
                      w-8 h-8 rounded-button font-medium text-xs transition-colors
                      ${
                        pNum === pagination.page
                          ? "bg-navy-800 text-white dark:bg-accent-gold dark:text-navy-900 font-bold"
                          : "text-text-muted hover:bg-base"
                      }
                    `}
                  >
                    {pNum}
                  </button>
                ))}
              </div>

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

      {/* ─── MOBILE FILTER DRAWER / MODAL ──────────────────────────── */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end bg-black/60 backdrop-blur-sm md:hidden animate-fade-in">
          <div className="bg-card border-t border-border-subtle rounded-t-2xl p-6 max-h-[85vh] overflow-y-auto space-y-6 animate-slide-up shadow-2xl">
            <div className="flex items-center justify-between border-b border-border-subtle pb-3">
              <h2 className="text-heading-2 font-heading text-text-primary flex items-center gap-2">
                <Filter className="w-5 h-5 text-accent-gold" /> Filter Careers
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

      {/* ─── SAVE FILTER MODAL ─────────────────────────────────────── */}
      {saveModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-card border border-border-subtle rounded-card p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-5 animate-slide-up">
            <div className="flex items-center justify-between border-b border-border-subtle pb-3">
              <h3 className="text-heading-3 font-heading text-text-primary flex items-center gap-2">
                <BookmarkPlus className="w-5 h-5 text-accent-gold" />
                Save Custom Filter
              </h3>
              <button
                type="button"
                onClick={() => setSaveModalOpen(false)}
                className="p-1 rounded-full text-text-muted hover:text-text-primary"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-body-sm text-text-muted">
              Save your current search and criteria parameters to reapply them anytime with one click.
            </p>

            <form onSubmit={handleSaveFilter} className="space-y-4">
              <TextField
                label="Filter Name"
                placeholder="e.g. High Salary AI Roles"
                value={filterNameInput}
                onChange={(e) => setFilterNameInput(e.target.value)}
                required
                autoFocus
              />

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setSaveModalOpen(false)}
                  className="px-4 py-2 rounded-button text-body-sm text-text-muted hover:bg-base"
                >
                  Cancel
                </button>
                <PrimaryButton type="submit" size="md">
                  Save Filter
                </PrimaryButton>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
