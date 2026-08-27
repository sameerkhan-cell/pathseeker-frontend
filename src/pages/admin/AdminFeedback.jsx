import { useEffect, useState } from "react";
import { 
  MessageSquare, 
  Send, 
  Bug, 
  Lightbulb, 
  HelpCircle, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Search, 
  Filter, 
  User, 
  ShieldCheck,
  ChevronDown
} from "lucide-react";
import { feedbackApi } from "../../api/feedbackApi";
import Loader from "../../components/Loader";
import AdminNav from "../../components/admin/AdminNav";
import StatusBadge from "../../components/ui/StatusBadge";
import PrimaryButton from "../../components/ui/PrimaryButton";

export default function AdminFeedback() {
  const [items, setItems] = useState(null);
  const [stats, setStats] = useState(null);
  const [statusFilter, setStatusFilter] = useState("");
  const [draftResponses, setDraftResponses] = useState({});
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [respondingId, setRespondingId] = useState(null);

  const load = (f = statusFilter) => {
    feedbackApi
      .adminList({ page: 1, limit: 50, ...(f && { status: f }) })
      .then((res) => {
        console.log("[feedbackApi.adminList] real response:", res);
        setItems(res.data.items || []);
      })
      .catch((err) => setError(err.message));

    feedbackApi
      .adminStats()
      .then((res) => {
        console.log("[feedbackApi.adminStats] real response:", res);
        setStats(res.data);
      })
      .catch((err) => setError(err.message));
  };

  useEffect(() => { load(""); }, []);

  const respond = async (f) => {
    const text = draftResponses[f.id];
    if (!text?.trim()) return;
    setRespondingId(f.id);
    try {
      const res = await feedbackApi.adminRespond(f.id, text.trim());
      console.log("[feedbackApi.adminRespond] real response:", res);
      setStatus(`Administrator response dispatched to ticket #${f.id}!`);
      load();
      setTimeout(() => setStatus(""), 4000);
    } catch (err) {
      setError(err.message);
    } finally {
      setRespondingId(null);
    }
  };

  const changeStatus = async (id, newStatus) => {
    if (!newStatus) return;
    try {
      const res = await feedbackApi.adminSetStatus(id, newStatus);
      console.log("[feedbackApi.adminSetStatus] real response:", res);
      setStatus(`Ticket #${id} status updated to ${newStatus}`);
      load();
      setTimeout(() => setStatus(""), 3000);
    } catch (err) {
      setError(err.message);
    }
  };

  if (!items || !stats) return <Loader />;

  const filteredItems = items.filter((f) => {
    const term = search.toLowerCase();
    return (
      f.message?.toLowerCase().includes(term) ||
      f.userName?.toLowerCase().includes(term) ||
      f.type?.toLowerCase().includes(term) ||
      f.id?.toString().includes(term)
    );
  });

  return (
    <div className="container-app py-8 space-y-8 animate-fade-in">
      <AdminNav 
        title="Feedback & Support Operations" 
        subtitle="Review student bug reports, feature suggestions, and respond directly to user inquiries"
        badge="SUPPORT INBOX"
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

      {/* ─── TELEMETRY OVERVIEW STATS ────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-card border border-border-subtle rounded-2xl p-5 shadow-card theme-transition space-y-1">
          <span className="text-caption text-text-muted font-semibold uppercase">Total Tickets</span>
          <p className="text-2xl font-display text-text-primary">{stats.total || items.length}</p>
          <span className="text-xs text-text-muted">all time submissions</span>
        </div>
        <div className="bg-card border border-border-subtle rounded-2xl p-5 shadow-card theme-transition space-y-1">
          <span className="text-caption text-amber-500 font-semibold uppercase">Open &amp; Pending</span>
          <p className="text-2xl font-display text-amber-500">{stats.open || 0}</p>
          <span className="text-xs text-text-muted">requires administrator triage</span>
        </div>
        <div className="bg-card border border-border-subtle rounded-2xl p-5 shadow-card theme-transition space-y-1">
          <span className="text-caption text-sky-500 font-semibold uppercase">In Progress</span>
          <p className="text-2xl font-display text-sky-500">{stats.inProgress || 0}</p>
          <span className="text-xs text-text-muted">under platform investigation</span>
        </div>
        <div className="bg-card border border-border-subtle rounded-2xl p-5 shadow-card theme-transition space-y-1">
          <span className="text-caption text-emerald-500 font-semibold uppercase">Resolved</span>
          <p className="text-2xl font-display text-emerald-500">{stats.resolved || 0}</p>
          <span className="text-xs text-text-muted">completed &amp; responded</span>
        </div>
      </div>

      {/* ─── FEEDBACK TABLE & TRIAGE CARD ────────────────────────────── */}
      <div className="bg-card border border-border-subtle rounded-2xl shadow-card theme-transition overflow-hidden">
        {/* Table Filter Strip */}
        <div className="p-6 border-b border-border-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            {["", "OPEN", "IN_PROGRESS", "RESOLVED"].map((st) => (
              <button
                key={st}
                onClick={() => { setStatusFilter(st); load(st); }}
                className={`
                  px-3 py-1.5 rounded-lg text-xs font-semibold transition-all
                  ${
                    statusFilter === st
                      ? "bg-accent-gold text-[#14151A] shadow-sm font-bold"
                      : "text-text-muted hover:text-text-primary bg-base border border-border-subtle"
                  }
                `}
              >
                {st === "" ? "All Statuses" : st === "OPEN" ? "Open" : st === "IN_PROGRESS" ? "In Progress" : "Resolved"}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-72">
            <input
              type="text"
              placeholder="Search user, message, type..."
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
                <th className="py-3 px-4 font-semibold">Type</th>
                <th className="py-3 px-4 font-semibold">User Profile</th>
                <th className="py-3 px-4 font-semibold">User Message</th>
                <th className="py-3 px-4 font-semibold">Status</th>
                <th className="py-3 px-4 font-semibold text-right">Admin Response &amp; Triage</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle/50 text-body-sm">
              {filteredItems.length > 0 ? (
                filteredItems.map((f) => (
                  <tr key={f.id} className="hover:bg-accent-gold/5 transition-colors">
                    <td className="py-4 px-4 font-mono text-xs text-text-muted align-top">
                      #{f.id}
                    </td>
                    <td className="py-4 px-4 align-top">
                      <StatusBadge status={f.type} />
                    </td>
                    <td className="py-4 px-4 align-top">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-accent-gold/15 text-accent-gold flex items-center justify-center font-bold text-[10px]">
                          {f.userName ? f.userName.charAt(0).toUpperCase() : "U"}
                        </div>
                        <span className="font-semibold text-text-primary text-xs">{f.userName || "User"}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 align-top max-w-sm">
                      <p className="text-text-primary text-xs leading-relaxed">
                        {f.message}
                      </p>
                      {f.adminResponse && (
                        <div className="mt-2 p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs">
                          <span className="font-semibold text-emerald-600 dark:text-emerald-400 block mb-0.5">
                            Official Staff Response:
                          </span>
                          <p className="text-text-muted">{f.adminResponse}</p>
                        </div>
                      )}
                    </td>
                    <td className="py-4 px-4 align-top">
                      <StatusBadge status={f.status} />
                    </td>
                    <td className="py-4 px-4 text-right align-top">
                      <div className="flex flex-col items-end gap-2 max-w-xs ml-auto">
                        <div className="flex items-center gap-1.5 w-full">
                          <input
                            type="text"
                            placeholder="Type admin response..."
                            value={draftResponses[f.id] ?? ""}
                            onChange={(e) => setDraftResponses((d) => ({ ...d, [f.id]: e.target.value }))}
                            className="w-full px-2.5 py-1 text-xs rounded-lg bg-base border border-border-subtle text-text-primary placeholder:text-text-muted/60 focus:outline-none focus:border-accent-gold"
                          />
                          <button
                            onClick={() => respond(f)}
                            disabled={respondingId === f.id || !draftResponses[f.id]?.trim()}
                            className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-accent-gold text-[#14151A] hover:bg-accent-gold-glow disabled:opacity-40 transition-all flex items-center gap-1 flex-shrink-0"
                            title="Send response to student"
                          >
                            <Send className="w-3 h-3" /> Reply
                          </button>
                        </div>

                        {/* Status Change Selector */}
                        <div className="flex items-center gap-1.5 self-end">
                          <span className="text-[11px] text-text-muted">Set:</span>
                          <select
                            value={f.status}
                            onChange={(e) => changeStatus(f.id, e.target.value)}
                            className="px-2 py-1 text-[11px] rounded-lg bg-base border border-border-subtle text-text-primary focus:outline-none focus:border-accent-gold cursor-pointer"
                          >
                            <option value="OPEN">Open</option>
                            <option value="IN_PROGRESS">In Progress</option>
                            <option value="RESOLVED">Resolved</option>
                          </select>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-text-muted italic">
                    No feedback tickets found matching the active filter.
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
