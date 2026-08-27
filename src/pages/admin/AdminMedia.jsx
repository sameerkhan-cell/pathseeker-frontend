import { useEffect, useState } from "react";
import { 
  Video, 
  Plus, 
  Edit3, 
  Trash2, 
  EyeOff, 
  CheckCircle2, 
  AlertCircle, 
  Search, 
  ExternalLink, 
  Radio, 
  Film, 
  Mic, 
  X
} from "lucide-react";
import { mediaApi } from "../../api/mediaApi";
import Loader from "../../components/Loader";
import AdminNav from "../../components/admin/AdminNav";
import StatusBadge from "../../components/ui/StatusBadge";
import TextField from "../../components/ui/TextField";
import PrimaryButton from "../../components/ui/PrimaryButton";
import GoldOutlineButton from "../../components/ui/GoldOutlineButton";

const EMPTY = { 
  title: "", 
  type: "VIDEO", 
  url: "", 
  category: "", 
  transcript: "", 
  tags: "", 
  status: "DRAFT" 
};

export default function AdminMedia() {
  const [items, setItems] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [editingId, setEditingId] = useState(null);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");

  const loadAll = () => {
    mediaApi
      .getMedia({ page: 1, limit: 50 })
      .then((res) => {
        console.log("[mediaApi.getMedia] admin list response:", res);
        setItems(res.data.items || []);
      })
      .catch((err) => setError(err.message));
  };

  useEffect(loadAll, []);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const buildPayload = () => ({
    title: form.title,
    type: form.type,
    url: form.url,
    category: form.category,
    ...(form.transcript && { transcript: form.transcript }),
    ...(form.tags && { tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean) }),
    status: form.status,
  });

  const startEdit = (m) => {
    setEditingId(m.id);
    setForm({
      title: m.title || "",
      type: m.type || "VIDEO",
      url: m.url || "",
      category: m.category || "",
      transcript: m.transcript || "",
      tags: Array.isArray(m.tags) ? m.tags.join(", ") : (m.tags || ""),
      status: m.status || "DRAFT",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm(EMPTY);
  };

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setStatus("");
    try {
      const res = editingId
        ? await mediaApi.adminUpdateMedia(editingId, buildPayload())
        : await mediaApi.adminCreateMedia(buildPayload());
      console.log("[AdminMedia] real save response:", res);
      setStatus(editingId ? `Media artifact #${editingId} updated!` : "New media artifact published!");
      cancelEdit();
      loadAll();
      setTimeout(() => setStatus(""), 4000);
    } catch (err) {
      setError(err.message || "Failed to save media artifact");
    } finally {
      setSaving(false);
    }
  };

  const unpublish = async (id) => {
    if (!window.confirm("Are you sure you want to unpublish this media item?")) return;
    try {
      const res = await mediaApi.adminDeleteMedia(id);
      console.log("[mediaApi.adminDeleteMedia] real response:", res);
      setStatus(`Media #${id} unpublished`);
      loadAll();
      setTimeout(() => setStatus(""), 3000);
    } catch (err) {
      setError(err.message);
    }
  };

  if (!items) return <Loader />;

  const filteredItems = items.filter((m) => {
    const term = search.toLowerCase();
    return (
      m.title?.toLowerCase().includes(term) ||
      m.category?.toLowerCase().includes(term) ||
      m.type?.toLowerCase().includes(term) ||
      m.id?.toString().includes(term)
    );
  });

  return (
    <div className="container-app py-8 space-y-8 animate-fade-in">
      <AdminNav 
        title="Multimedia & Content Hub" 
        subtitle="Manage Day-in-the-Life video documentaries, industry podcasts, and animated career explainers"
        badge="MEDIA CURATION"
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
                {editingId ? `Edit Media Artifact #${editingId}` : "Curate New Media Resource"}
              </h2>
              <p className="text-body-sm text-text-muted">
                {editingId ? "Update media streaming link, transcripts, and visibility status" : "Add immersive multimedia content to the PathSeeker media center"}
              </p>
            </div>
          </div>
          {editingId && (
            <button
              onClick={cancelEdit}
              className="flex items-center gap-1.5 text-xs font-semibold text-text-muted hover:text-text-primary px-3 py-1.5 rounded-lg border border-border-subtle hover:bg-base transition-colors"
            >
              <X className="w-3.5 h-3.5" /> Cancel
            </button>
          )}
        </div>

        <form onSubmit={submit} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            <TextField
              label="Media Title"
              name="title"
              placeholder="e.g. Day in the Life: Cloud Architect"
              value={form.title}
              onChange={onChange}
              required
            />
            
            <div className="flex flex-col gap-1.5">
              <label className="text-body-sm font-medium text-text-primary">
                Media Format <span className="text-red-500">*</span>
              </label>
              <select
                name="type"
                value={form.type}
                onChange={onChange}
                className="w-full px-4 py-2.5 text-body-base text-text-primary bg-[var(--bg-input)] border border-border-subtle rounded-button focus:outline-none focus:border-accent-gold focus:ring-2 focus:ring-[var(--ring-focus)] theme-transition cursor-pointer"
              >
                <option value="VIDEO">🎬 Video Documentary</option>
                <option value="PODCAST">🎙️ Audio Podcast Episode</option>
                <option value="ANIMATED_EXPLAINER">✨ Animated Explainer</option>
              </select>
            </div>

            <TextField
              label="Category / Industry"
              name="category"
              placeholder="e.g. Tech, Healthcare, Business"
              value={form.category}
              onChange={onChange}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <TextField
              label="Resource Stream / Embed URL"
              name="url"
              placeholder="https://youtube.com/watch?v=... or https://cdn..."
              value={form.url}
              onChange={onChange}
              required
            />
            <div className="flex flex-col gap-1.5">
              <label className="text-body-sm font-medium text-text-primary">
                Publication Status <span className="text-red-500">*</span>
              </label>
              <select
                name="status"
                value={form.status}
                onChange={onChange}
                className="w-full px-4 py-2.5 text-body-base text-text-primary bg-[var(--bg-input)] border border-border-subtle rounded-button focus:outline-none focus:border-accent-gold focus:ring-2 focus:ring-[var(--ring-focus)] theme-transition cursor-pointer"
              >
                <option value="DRAFT">Draft (Admin View Only)</option>
                <option value="PUBLISHED">Published (Live to Students)</option>
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-body-sm font-medium text-text-primary">
              Full Transcript & Key Takeaways (Optional)
            </label>
            <textarea
              name="transcript"
              rows={3}
              placeholder="Paste conversational audio transcript or key discussion bullet points..."
              value={form.transcript}
              onChange={onChange}
              className="w-full px-4 py-2.5 text-body-base text-text-primary bg-[var(--bg-input)] border border-border-subtle rounded-button focus:outline-none focus:border-accent-gold focus:ring-2 focus:ring-[var(--ring-focus)] theme-transition"
            />
          </div>

          <TextField
            label="Tags (Comma Separated)"
            name="tags"
            placeholder="interview, daily-work, salary, tech-stack"
            value={form.tags}
            onChange={onChange}
          />

          <div className="flex items-center gap-3 pt-2">
            <PrimaryButton type="submit" disabled={saving}>
              {saving ? "Saving Media..." : editingId ? "Update Media Artifact" : "Publish to Media Center"}
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
        <div className="p-6 border-b border-border-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-display text-text-primary">
              Media Catalog ({filteredItems.length})
            </h3>
            <p className="text-body-sm text-text-muted">
              Live collection of career documentaries and interviews
            </p>
          </div>

          <div className="relative w-full sm:w-72">
            <input
              type="text"
              placeholder="Search by title, format, category..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-4 py-2 pl-9 text-xs rounded-xl bg-base border border-border-subtle text-text-primary placeholder:text-text-muted/60 focus:outline-none focus:border-accent-gold"
            />
            <Search className="w-3.5 h-3.5 text-text-muted absolute left-3 top-1/2 -translate-y-1/2" />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border-subtle bg-base/50 text-[11px] font-mono uppercase tracking-wider text-accent-gold">
                <th className="py-3 px-4 font-semibold">ID</th>
                <th className="py-3 px-4 font-semibold">Title</th>
                <th className="py-3 px-4 font-semibold">Type</th>
                <th className="py-3 px-4 font-semibold">Category</th>
                <th className="py-3 px-4 font-semibold">Status</th>
                <th className="py-3 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle/50 text-body-sm">
              {filteredItems.length > 0 ? (
                filteredItems.map((m) => (
                  <tr key={m.id} className="hover:bg-accent-gold/5 transition-colors">
                    <td className="py-3.5 px-4 font-mono text-xs text-text-muted">
                      #{m.id}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-text-primary">
                      <div className="flex flex-col">
                        <span>{m.title}</span>
                        {m.url && (
                          <a
                            href={m.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[11px] text-accent-gold hover:underline inline-flex items-center gap-1 font-normal truncate max-w-xs"
                          >
                            <ExternalLink className="w-3 h-3" /> View Stream
                          </a>
                        )}
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <StatusBadge status={m.type} />
                    </td>
                    <td className="py-3.5 px-4 text-text-muted text-xs">
                      <span className="px-2.5 py-0.5 rounded-lg bg-base text-text-primary border border-border-subtle">
                        {m.category}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <StatusBadge status={m.status || "PUBLISHED"} />
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => startEdit(m)}
                          className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-accent-gold/10 text-accent-gold hover:bg-accent-gold hover:text-[#14151A] transition-colors"
                        >
                          Edit
                        </button>
                        {m.status === "PUBLISHED" && (
                          <button
                            onClick={() => unpublish(m.id)}
                            className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400 hover:bg-rose-500 hover:text-white transition-colors"
                          >
                            Unpublish
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-text-muted italic">
                    No matching multimedia entries found.
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
