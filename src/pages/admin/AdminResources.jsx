import { useEffect, useState } from "react";
import { 
  FileText, 
  Upload, 
  Trash2, 
  CheckCircle2, 
  AlertCircle, 
  Search, 
  Download, 
  Tag, 
  Users, 
  FileCheck,
  Paperclip
} from "lucide-react";
import { resourceApi } from "../../api/resourceApi";
import Loader from "../../components/Loader";
import AdminNav from "../../components/admin/AdminNav";
import StatusBadge from "../../components/ui/StatusBadge";
import TextField from "../../components/ui/TextField";
import PrimaryButton from "../../components/ui/PrimaryButton";

export default function AdminResources() {
  const [items, setItems] = useState(null);
  const [title, setTitle] = useState("");
  const [type, setType] = useState("PDF");
  const [audience, setAudience] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [search, setSearch] = useState("");

  const loadAll = () => {
    resourceApi
      .getResources({ page: 1, limit: 50 })
      .then((res) => {
        console.log("[resourceApi.getResources] admin list:", res);
        setItems(res.data.items || []);
      })
      .catch((err) => setError(err.message));
  };

  useEffect(loadAll, []);

  const submit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError("Please select a valid document or PDF asset to upload.");
      return;
    }
    setError("");
    setStatus("");
    setUploading(true);

    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("title", title);
      fd.append("type", type);
      fd.append("audience", audience);
      if (description) fd.append("description", description);
      if (tags) fd.append("tags", JSON.stringify(tags.split(",").map((t) => t.trim()).filter(Boolean)));
      
      const res = await resourceApi.adminCreateResource(fd);
      console.log("[resourceApi.adminCreateResource] real response:", res);
      setStatus(`Resource "${res.data.resource.title}" successfully uploaded!`);
      setTitle(""); 
      setAudience(""); 
      setDescription(""); 
      setTags(""); 
      setFile(null);
      loadAll();
      setTimeout(() => setStatus(""), 4000);
    } catch (err) {
      setError(err.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const deactivate = async (id) => {
    if (!window.confirm("Deactivate this download resource from the student library?")) return;
    try {
      const res = await resourceApi.adminDeleteResource(id);
      console.log("[resourceApi.adminDeleteResource] real response:", res);
      setStatus(`Resource #${id} deactivated.`);
      loadAll();
      setTimeout(() => setStatus(""), 3000);
    } catch (err) {
      setError(err.message);
    }
  };

  if (!items) return <Loader />;

  const filteredItems = items.filter((r) => {
    const term = search.toLowerCase();
    return (
      r.title?.toLowerCase().includes(term) ||
      r.audience?.toLowerCase().includes(term) ||
      r.type?.toLowerCase().includes(term) ||
      r.id?.toString().includes(term)
    );
  });

  return (
    <div className="container-app py-8 space-y-8 animate-fade-in">
      <AdminNav 
        title="Resource Library & Downloads" 
        subtitle="Upload downloadable guides, career transition checklists, and infographic toolkits"
        badge="DOWNLOADS"
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

      {/* ─── UPLOAD FORM CARD ────────────────────────────────────────── */}
      <div className="bg-card border border-border-subtle rounded-2xl p-6 sm:p-8 shadow-card theme-transition space-y-6">
        <div className="flex items-center gap-3 border-b border-border-subtle/60 pb-4">
          <div className="w-10 h-10 rounded-xl bg-accent-gold/10 text-accent-gold flex items-center justify-center">
            <Upload className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-display text-text-primary">
              Upload New Career Resource
            </h2>
            <p className="text-body-sm text-text-muted">
              Add PDF guides, checklists, or infographics for student downloads
            </p>
          </div>
        </div>

        <form onSubmit={submit} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            <TextField
              label="Resource Title"
              placeholder="e.g. 2026 Tech Resume & Portfolio Checklist"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />

            <div className="flex flex-col gap-1.5">
              <label className="text-body-sm font-medium text-text-primary">
                Resource Category / Format <span className="text-red-500">*</span>
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full px-4 py-2.5 text-body-base text-text-primary bg-[var(--bg-input)] border border-border-subtle rounded-button focus:outline-none focus:border-accent-gold focus:ring-2 focus:ring-[var(--ring-focus)] theme-transition cursor-pointer"
              >
                <option value="PDF">📄 Comprehensive PDF Guide</option>
                <option value="CHECKLIST">☑️ Actionable Checklist</option>
                <option value="INFOGRAPHIC">📊 Visual Infographic</option>
              </select>
            </div>

            <TextField
              label="Target Audience"
              placeholder="e.g. Undergraduate Students, Career Switchers"
              value={audience}
              onChange={(e) => setAudience(e.target.value)}
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-body-sm font-medium text-text-primary">
              Resource Summary / Overview (Optional)
            </label>
            <textarea
              rows={2}
              placeholder="Provide a brief synopsis of what tools or skills this resource equips the reader with..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2.5 text-body-base text-text-primary bg-[var(--bg-input)] border border-border-subtle rounded-button focus:outline-none focus:border-accent-gold focus:ring-2 focus:ring-[var(--ring-focus)] theme-transition"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <TextField
              label="Search Tags (Comma Separated)"
              placeholder="resume, interview, roadmap, templates"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
            />

            {/* File Dropzone / Selector */}
            <div className="flex flex-col gap-1.5">
              <label className="text-body-sm font-medium text-text-primary flex items-center gap-1">
                <Paperclip className="w-3.5 h-3.5 text-accent-gold" />
                Upload Document Asset (.pdf, .docx, .png, .jpg) <span className="text-red-500">*</span>
              </label>
              <input
                type="file"
                accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                onChange={(e) => setFile(e.target.files[0])}
                required
                className="w-full px-3 py-2 text-xs text-text-primary bg-[var(--bg-input)] border border-border-subtle rounded-button focus:outline-none focus:border-accent-gold file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-accent-gold file:text-[#14151A] hover:file:bg-accent-gold-glow cursor-pointer"
              />
            </div>
          </div>

          <PrimaryButton type="submit" disabled={uploading}>
            {uploading ? "Uploading Resource..." : "Upload & Publish to Library"}
          </PrimaryButton>
        </form>
      </div>

      {/* ─── DATA TABLE CARD ─────────────────────────────────────────── */}
      <div className="bg-card border border-border-subtle rounded-2xl shadow-card theme-transition overflow-hidden">
        <div className="p-6 border-b border-border-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-display text-text-primary">
              Downloadable Artifacts ({filteredItems.length})
            </h3>
            <p className="text-body-sm text-text-muted">
              Active repository of guides, templates, and infographics
            </p>
          </div>

          <div className="relative w-full sm:w-72">
            <input
              type="text"
              placeholder="Search title, type, audience..."
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
                <th className="py-3 px-4 font-semibold">Title</th>
                <th className="py-3 px-4 font-semibold">Format</th>
                <th className="py-3 px-4 font-semibold">Target Audience</th>
                <th className="py-3 px-4 font-semibold">Downloads</th>
                <th className="py-3 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle/50 text-body-sm">
              {filteredItems.length > 0 ? (
                filteredItems.map((r) => (
                  <tr key={r.id} className="hover:bg-accent-gold/5 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-text-primary">
                      <div className="flex flex-col">
                        <span>{r.title}</span>
                        {r.fileUrl && (
                          <a
                            href={r.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[11px] text-accent-gold hover:underline font-normal inline-flex items-center gap-1"
                          >
                            <Download className="w-3 h-3" /> Download Asset
                          </a>
                        )}
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <StatusBadge status={r.type} />
                    </td>
                    <td className="py-3.5 px-4 text-text-muted text-xs">
                      <span className="px-2.5 py-0.5 rounded-lg bg-base text-text-primary border border-border-subtle">
                        {r.audience}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-xs text-accent-gold font-semibold">
                      {r.downloadCount || 0} downloads
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => deactivate(r.id)}
                        className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400 hover:bg-rose-500 hover:text-white transition-colors"
                        title="Deactivate resource"
                      >
                        Deactivate
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-text-muted italic">
                    No resource records found.
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
