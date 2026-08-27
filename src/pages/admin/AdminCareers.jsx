import { useEffect, useState } from "react";
import { 
  Briefcase, 
  Plus, 
  Edit3, 
  Trash2, 
  RotateCcw, 
  AlertCircle, 
  CheckCircle2, 
  Search, 
  DollarSign, 
  Tag, 
  TrendingUp,
  X
} from "lucide-react";
import { careerApi } from "../../api/careerApi";
import Loader from "../../components/Loader";
import AdminNav from "../../components/admin/AdminNav";
import StatusBadge from "../../components/ui/StatusBadge";
import TextField from "../../components/ui/TextField";
import PrimaryButton from "../../components/ui/PrimaryButton";
import GoldOutlineButton from "../../components/ui/GoldOutlineButton";

const EMPTY_FORM = {
  title: "",
  domain: "",
  description: "",
  skills: "",
  salaryMin: "",
  salaryMax: "",
  demand: "MEDIUM",
  tags: "",
};

export default function AdminCareers() {
  const [items, setItems] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");

  const loadAll = () => {
    careerApi
      .adminListCareers({ page: 1, limit: 50 })
      .then((res) => {
        console.log("[careerApi.adminListCareers] real response:", res);
        setItems(res.data.items || []);
      })
      .catch((err) => setError(err.message));
  };

  useEffect(loadAll, []);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const toList = (s) => s.split(",").map((x) => x.trim()).filter(Boolean);

  const buildPayload = () => ({
    title: form.title,
    domain: form.domain,
    description: form.description,
    skills: toList(form.skills),
    salaryMin: Number(form.salaryMin),
    salaryMax: Number(form.salaryMax),
    demand: form.demand,
    ...(form.tags && { tags: toList(form.tags) }),
  });

  const startEdit = (c) => {
    setEditingId(c.id);
    setForm({
      title: c.title,
      domain: c.domain,
      description: c.description,
      skills: (c.skills || []).join(", "),
      salaryMin: c.salaryMin ?? "",
      salaryMax: c.salaryMax ?? "",
      demand: c.demandLevel || "MEDIUM",
      tags: (c.tags || []).join(", "),
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
  };

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setStatus("");
    setError("");
    try {
      const res = editingId
        ? await careerApi.updateCareer(editingId, buildPayload())
        : await careerApi.createCareer(buildPayload());
      console.log("[AdminCareers] real save response:", res);
      setStatus(editingId ? `Career #${editingId} successfully updated!` : "New career successfully created!");
      cancelEdit();
      loadAll();
      setTimeout(() => setStatus(""), 4000);
    } catch (err) {
      setError(err.message || "Failed to save career record");
    } finally {
      setSaving(false);
    }
  };

  const deactivate = async (id) => {
    if (!window.confirm("Are you sure you want to deactivate this career profile?")) return;
    try {
      const res = await careerApi.deleteCareer(id);
      console.log("[careerApi.deleteCareer] real response:", res);
      setStatus(`Career #${id} deactivated`);
      loadAll();
      setTimeout(() => setStatus(""), 3000);
    } catch (err) {
      setError(err.message);
    }
  };

  const restore = async (id) => {
    try {
      const res = await careerApi.restoreCareer(id);
      console.log("[careerApi.restoreCareer] real response:", res);
      setStatus(`Career #${id} restored to active catalog`);
      loadAll();
      setTimeout(() => setStatus(""), 3000);
    } catch (err) {
      setError(err.message);
    }
  };

  if (!items) return <Loader />;

  const filteredItems = items.filter((c) => {
    const term = search.toLowerCase();
    return (
      c.title?.toLowerCase().includes(term) ||
      c.domain?.toLowerCase().includes(term) ||
      c.id?.toString().includes(term)
    );
  });

  return (
    <div className="container-app py-8 space-y-8 animate-fade-in">
      <AdminNav 
        title="Career Bank Management" 
        subtitle="Author, configure salary benchmarks, manage skills taxonomies and catalog statuses"
        badge="CURATION"
      />

      {/* Status & Error Alerts */}
      {status && (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-body-sm animate-fade-in">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          <span>{status}</span>
        </div>
      )}
      {error && (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 text-body-sm animate-fade-in">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* ─── CREATE / EDIT FORM CARD ─────────────────────────────────── */}
      <div className="bg-card border border-border-subtle rounded-2xl p-6 sm:p-8 shadow-card theme-transition space-y-6">
        <div className="flex items-center justify-between border-b border-border-subtle/60 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-accent-gold/10 text-accent-gold flex items-center justify-center">
              {editingId ? <Edit3 className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
            </div>
            <div>
              <h2 className="text-xl font-display text-text-primary">
                {editingId ? `Edit Career Trajectory #${editingId}` : "Create New Career Trajectory"}
              </h2>
              <p className="text-body-sm text-text-muted">
                {editingId ? "Update role description, salary bands, and market demand" : "Add a new verified profession to the PathSeeker discovery catalog"}
              </p>
            </div>
          </div>
          {editingId && (
            <button
              onClick={cancelEdit}
              className="flex items-center gap-1.5 text-xs font-semibold text-text-muted hover:text-text-primary px-3 py-1.5 rounded-lg border border-border-subtle hover:bg-base transition-colors"
            >
              <X className="w-3.5 h-3.5" /> Cancel Edit
            </button>
          )}
        </div>

        <form onSubmit={submit} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            <TextField
              label="Career Title"
              name="title"
              placeholder="e.g. AI Research Scientist"
              value={form.title}
              onChange={onChange}
              required
            />
            <TextField
              label="Domain / Industry"
              name="domain"
              placeholder="e.g. Engineering, Data, Design"
              value={form.domain}
              onChange={onChange}
              required
            />
            <div className="flex flex-col gap-1.5">
              <label className="text-body-sm font-medium text-text-primary">
                Market Demand Level <span className="text-red-500">*</span>
              </label>
              <select
                name="demand"
                value={form.demand}
                onChange={onChange}
                className="w-full px-4 py-2.5 text-body-base text-text-primary bg-[var(--bg-input)] border border-border-subtle rounded-button focus:outline-none focus:border-accent-gold focus:ring-2 focus:ring-[var(--ring-focus)] theme-transition cursor-pointer"
              >
                <option value="HIGH">🔥 High Demand</option>
                <option value="MEDIUM">⚡ Medium Demand</option>
                <option value="LOW">🌱 Low / Emerging Demand</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <TextField
              label="Minimum Salary Benchmark (USD / year)"
              name="salaryMin"
              type="number"
              placeholder="e.g. 75000"
              value={form.salaryMin}
              onChange={onChange}
              required
            />
            <TextField
              label="Maximum Salary Benchmark (USD / year)"
              name="salaryMax"
              type="number"
              placeholder="e.g. 150000"
              value={form.salaryMax}
              onChange={onChange}
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-body-sm font-medium text-text-primary">
              Role Description (Min 10 characters) <span className="text-red-500">*</span>
            </label>
            <textarea
              name="description"
              rows={3}
              placeholder="Provide an overview of day-to-day responsibilities, industry scope, and career impact..."
              value={form.description}
              onChange={onChange}
              required
              className="w-full px-4 py-2.5 text-body-base text-text-primary bg-[var(--bg-input)] border border-border-subtle rounded-button focus:outline-none focus:border-accent-gold focus:ring-2 focus:ring-[var(--ring-focus)] theme-transition"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <TextField
              label="Key Required Skills (Comma Separated)"
              name="skills"
              placeholder="Python, PyTorch, Linear Algebra, Machine Learning"
              value={form.skills}
              onChange={onChange}
              required
            />
            <TextField
              label="Keywords & Tags (Optional, Comma Separated)"
              name="tags"
              placeholder="AI, Deep Learning, NLP, Remote"
              value={form.tags}
              onChange={onChange}
            />
          </div>

          <div className="flex items-center gap-3 pt-2">
            <PrimaryButton type="submit" disabled={saving}>
              {saving ? "Saving Record..." : editingId ? "Update Career Trajectory" : "Publish to Career Bank"}
            </PrimaryButton>
            {editingId && (
              <GoldOutlineButton type="button" onClick={cancelEdit}>
                Cancel
              </GoldOutlineButton>
            )}
          </div>
        </form>
      </div>

      {/* ─── DATA TABLE CARD ─────────────────────────────────────────── */}
      <div className="bg-card border border-border-subtle rounded-2xl shadow-card theme-transition overflow-hidden">
        {/* Table Header & Filter Strip */}
        <div className="p-6 border-b border-border-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-display text-text-primary">
              Career Trajectories Repository ({filteredItems.length})
            </h3>
            <p className="text-body-sm text-text-muted">
              Complete inventory of active and deactivated careers
            </p>
          </div>

          {/* Search box */}
          <div className="relative w-full sm:w-72">
            <input
              type="text"
              placeholder="Filter by title, domain, ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-4 py-2 pl-9 text-xs rounded-xl bg-base border border-border-subtle text-text-primary placeholder:text-text-muted/60 focus:outline-none focus:border-accent-gold"
            />
            <Search className="w-3.5 h-3.5 text-text-muted absolute left-3 top-1/2 -translate-y-1/2" />
          </div>
        </div>

        {/* Responsive Table Wrapper */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border-subtle bg-base/50 text-[11px] font-mono uppercase tracking-wider text-accent-gold">
                <th className="py-3 px-4 font-semibold">ID</th>
                <th className="py-3 px-4 font-semibold">Career Title</th>
                <th className="py-3 px-4 font-semibold">Domain</th>
                <th className="py-3 px-4 font-semibold">Salary Range</th>
                <th className="py-3 px-4 font-semibold">Demand</th>
                <th className="py-3 px-4 font-semibold">Status</th>
                <th className="py-3 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle/50 text-body-sm">
              {filteredItems.length > 0 ? (
                filteredItems.map((c) => (
                  <tr 
                    key={c.id} 
                    className={`hover:bg-accent-gold/5 transition-colors ${!c.isActive ? "opacity-60 bg-base/40" : ""}`}
                  >
                    <td className="py-3.5 px-4 font-mono text-xs text-text-muted">
                      #{c.id}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-text-primary">
                      <div className="flex flex-col">
                        <span className={!c.isActive ? "line-through text-text-muted" : ""}>{c.title}</span>
                        {c.skills?.length > 0 && (
                          <span className="text-[11px] text-text-muted font-normal truncate max-w-xs">
                            {c.skills.slice(0, 3).join(", ")}{c.skills.length > 3 ? "..." : ""}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-text-muted">
                      <span className="px-2.5 py-0.5 rounded-lg bg-base text-text-primary text-xs font-medium border border-border-subtle">
                        {c.domain}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-accent-gold font-mono text-xs font-semibold">
                      ${Math.round(c.salaryMin / 1000)}k – ${Math.round(c.salaryMax / 1000)}k
                    </td>
                    <td className="py-3.5 px-4">
                      <StatusBadge status={c.demandLevel} />
                    </td>
                    <td className="py-3.5 px-4">
                      <StatusBadge status={c.isActive ? "ACTIVE" : "INACTIVE"} label={c.isActive ? "Active" : "Deactivated"} />
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => startEdit(c)}
                          className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-accent-gold/10 text-accent-gold hover:bg-accent-gold hover:text-[#14151A] transition-colors"
                          title="Edit career profile"
                        >
                          Edit
                        </button>
                        {c.isActive ? (
                          <button
                            onClick={() => deactivate(c.id)}
                            className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400 hover:bg-rose-500 hover:text-white transition-colors"
                            title="Deactivate career profile"
                          >
                            Deactivate
                          </button>
                        ) : (
                          <button
                            onClick={() => restore(c.id)}
                            className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500 hover:text-white transition-colors flex items-center gap-1"
                            title="Restore career profile"
                          >
                            <RotateCcw className="w-3 h-3" /> Restore
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-text-muted italic">
                    No matching career records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
