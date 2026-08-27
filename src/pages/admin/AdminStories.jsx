import { useEffect, useState } from "react";
import { 
  BookOpen, 
  Check, 
  X, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Search, 
  User, 
  Building2, 
  MessageSquare,
  Filter
} from "lucide-react";
import { storiesApi } from "../../api/storiesApi";
import Loader from "../../components/Loader";
import AdminNav from "../../components/admin/AdminNav";
import StatusBadge from "../../components/ui/StatusBadge";

export default function AdminStories() {
  const [queue, setQueue] = useState(null);
  const [filter, setFilter] = useState("PENDING");
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const load = (f = filter) => {
    storiesApi
      .adminListStories({ status: f || undefined, page: 1, limit: 50 })
      .then((res) => {
        console.log("[storiesApi.adminListStories] real response:", res);
        setQueue(res.data.items || []);
      })
      .catch((err) => setError(err.message));
  };

  useEffect(() => { load("PENDING"); }, []);

  const approve = async (id) => {
    try {
      const res = await storiesApi.adminApproveStory(id);
      console.log("[storiesApi.adminApproveStory] real response:", res);
      setStatus(`Story #${id} approved and published to community feed!`);
      load();
      setTimeout(() => setStatus(""), 4000);
    } catch (err) {
      setError(err.message);
    }
  };

  const reject = async (id) => {
    const reason = window.prompt("Please state the reason for rejecting this story submission:");
    if (!reason || !reason.trim()) return;
    try {
      const res = await storiesApi.adminRejectStory(id, reason.trim());
      console.log("[storiesApi.adminRejectStory] real response:", res);
      setStatus(`Story #${id} marked as rejected.`);
      load();
      setTimeout(() => setStatus(""), 4000);
    } catch (err) {
      setError(err.message);
    }
  };

  if (!queue) return <Loader />;

  const filteredQueue = queue.filter((s) => {
    const term = search.toLowerCase();
    return (
      s.title?.toLowerCase().includes(term) ||
      s.authorName?.toLowerCase().includes(term) ||
      s.domain?.toLowerCase().includes(term) ||
      s.id?.toString().includes(term)
    );
  });

  return (
    <div className="container-app py-8 space-y-8 animate-fade-in">
      <AdminNav 
        title="Community Stories Review Queue" 
        subtitle="Evaluate, approve, or reject student and professional career transition stories"
        badge="MODERATION"
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

      {/* ─── TABLE & MODERATION CARD ─────────────────────────────────── */}
      <div className="bg-card border border-border-subtle rounded-2xl shadow-card theme-transition overflow-hidden">
        {/* Filter Strip */}
        <div className="p-6 border-b border-border-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 p-1 bg-base border border-border-subtle rounded-xl">
              {["PENDING", "APPROVED", "REJECTED"].map((st) => (
                <button
                  key={st}
                  onClick={() => { setFilter(st); load(st); }}
                  className={`
                    px-3 py-1.5 rounded-lg text-xs font-semibold transition-all
                    ${
                      filter === st
                        ? "bg-accent-gold text-[#14151A] shadow-sm font-bold"
                        : "text-text-muted hover:text-text-primary"
                    }
                  `}
                >
                  {st === "PENDING" ? "⏳ Pending Review" : st === "APPROVED" ? "✅ Approved" : "❌ Rejected"}
                </button>
              ))}
            </div>
          </div>

          <div className="relative w-full sm:w-72">
            <input
              type="text"
              placeholder="Search author, title, domain..."
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
                <th className="py-3 px-4 font-semibold">Story Title</th>
                <th className="py-3 px-4 font-semibold">Domain</th>
                <th className="py-3 px-4 font-semibold">Author Profile</th>
                <th className="py-3 px-4 font-semibold">Status</th>
                <th className="py-3 px-4 font-semibold text-right">Moderation Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle/50 text-body-sm">
              {filteredQueue.length > 0 ? (
                filteredQueue.map((s) => (
                  <tr key={s.id} className="hover:bg-accent-gold/5 transition-colors">
                    <td className="py-3.5 px-4 font-mono text-xs text-text-muted">
                      #{s.id}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-text-primary">
                      <div className="space-y-1 max-w-sm">
                        <p className="leading-snug">{s.title}</p>
                        {s.summary && (
                          <p className="text-xs text-text-muted font-normal line-clamp-2">
                            {s.summary}
                          </p>
                        )}
                        {s.status === "REJECTED" && s.rejectionReason && (
                          <p className="text-[11px] text-rose-500 bg-rose-500/10 p-1.5 rounded border border-rose-500/20 font-normal">
                            <strong>Rejection Note:</strong> {s.rejectionReason}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-text-muted text-xs">
                      <span className="px-2.5 py-0.5 rounded-lg bg-base text-text-primary border border-border-subtle">
                        {s.domain}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-text-muted text-xs">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-accent-gold/15 text-accent-gold flex items-center justify-center font-bold text-[10px]">
                          {s.authorName ? s.authorName.charAt(0).toUpperCase() : "U"}
                        </div>
                        <span className="font-medium text-text-primary">{s.authorName || "Anonymous"}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <StatusBadge status={s.status} />
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      {s.status === "PENDING" ? (
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => approve(s.id)}
                            className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500 hover:text-white transition-all flex items-center gap-1"
                            title="Approve story"
                          >
                            <Check className="w-3.5 h-3.5" /> Approve
                          </button>
                          <button
                            onClick={() => reject(s.id)}
                            className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-rose-500/15 text-rose-600 dark:text-rose-400 hover:bg-rose-500 hover:text-white transition-all flex items-center gap-1"
                            title="Reject story"
                          >
                            <X className="w-3.5 h-3.5" /> Reject
                          </button>
                        </div>
                      ) : (
                        <span className="text-xs text-text-muted italic">
                          {s.status === "APPROVED" ? "Live on Community Feed" : "Archived (Rejected)"}
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-text-muted italic">
                    No submissions currently found in the {filter.toLowerCase()} queue.
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
