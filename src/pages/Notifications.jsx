import { useEffect, useState } from "react";
import {
  Bell,
  CheckCheck,
  Check,
  Clock,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Inbox,
  AlertCircle
} from "lucide-react";
import { notificationsApi } from "../api/notificationsApi";
import PrimaryButton from "../components/ui/PrimaryButton";
import GoldOutlineButton from "../components/ui/GoldOutlineButton";
import Loader from "../components/Loader";

export default function Notifications() {
  const [items, setItems] = useState(null);
  const [pagination, setPagination] = useState(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [markingAll, setMarkingAll] = useState(false);

  const loadNotifications = (p = page) => {
    setLoading(true);
    setError("");
    notificationsApi
      .list(p)
      .then((res) => {
        setItems(res.data.items || []);
        setPagination(res.data.pagination || null);
      })
      .catch((err) => setError(err.message || "Failed to load notifications"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadNotifications(1);
  }, []);

  const handleMarkRead = async (n) => {
    if (n.isRead) return;
    try {
      await notificationsApi.markRead(n.id);
      setItems((prev) =>
        prev.map((item) => (item.id === n.id ? { ...item, isRead: true } : item))
      );
    } catch (err) {
      console.error("Failed to mark notification read:", err);
    }
  };

  const handleMarkAllRead = async () => {
    setMarkingAll(true);
    try {
      await notificationsApi.markAllRead();
      setItems((prev) => prev.map((item) => ({ ...item, isRead: true })));
    } catch (err) {
      setError(err.message || "Failed to mark all notifications as read");
    } finally {
      setMarkingAll(false);
    }
  };

  const goToPage = (p) => {
    setPage(p);
    loadNotifications(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const formatTimeAgo = (dateStr) => {
    const d = new Date(dateStr);
    const now = new Date();
    const diffHours = Math.round((now - d) / (1000 * 60 * 60));
    if (diffHours < 1) return "Just now";
    if (diffHours < 24) return `${diffHours} hour(s) ago`;
    return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
  };

  if (loading && !items) {
    return (
      <div className="container-app py-16 flex flex-col items-center justify-center min-h-[50vh]">
        <Loader />
        <p className="mt-4 text-body-sm text-text-muted">Loading notification stream...</p>
      </div>
    );
  }

  const unreadCount = items ? items.filter((n) => !n.isRead).length : 0;

  return (
    <div className="container-app py-8 md:py-12 space-y-8 max-w-3xl">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-border-subtle pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-gold/10 border border-accent-gold/20 text-accent-gold text-xs font-semibold uppercase tracking-wider mb-2">
            <Bell className="w-3.5 h-3.5" /> Activity & System Stream
          </div>
          <h1 className="text-3xl sm:text-4xl font-display font-bold text-text-primary">
            Notifications Center
          </h1>
          <p className="text-body-sm text-text-muted mt-1">
            Stay updated with aptitude results, new career roadmap updates, and community alerts.
          </p>
        </div>

        {unreadCount > 0 && (
          <GoldOutlineButton size="md" onClick={handleMarkAllRead} disabled={markingAll}>
            <CheckCheck className="w-4 h-4 mr-1.5" />
            {markingAll ? "Marking..." : "Mark All as Read"}
          </GoldOutlineButton>
        )}
      </div>

      {error && (
        <div className="p-4 rounded-button bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 flex items-center gap-3 text-body-sm animate-fade-in">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {items && items.length > 0 ? (
        <div className="space-y-3">
          {items.map((n) => (
            <div
              key={n.id}
              onClick={() => handleMarkRead(n)}
              className={`
                p-5 rounded-card border transition-all duration-200 cursor-pointer flex items-start gap-4 theme-transition relative overflow-hidden
                ${
                  n.isRead
                    ? "bg-card border-border-subtle opacity-85 hover:opacity-100"
                    : "bg-card border-accent-gold/50 shadow-md shadow-accent-gold/5 ring-1 ring-accent-gold/20"
                }
              `}
            >
              {!n.isRead && (
                <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-accent-gold" />
              )}

              <div className="mt-1 shrink-0">
                {n.isRead ? (
                  <div className="w-2.5 h-2.5 rounded-full bg-border-subtle" />
                ) : (
                  <div className="w-2.5 h-2.5 rounded-full bg-accent-gold shadow-[0_0_8px_rgba(243,221,165,0.8)]" />
                )}
              </div>

              <div className="space-y-1 min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-base text-accent-gold uppercase font-mono border border-border-subtle">
                      {n.type || "INFO"}
                    </span>
                    <h3 className={`text-body-base leading-snug truncate ${n.isRead ? "text-text-primary font-medium" : "text-text-primary font-bold"}`}>
                      {n.title}
                    </h3>
                  </div>

                  <span className="text-caption text-text-muted shrink-0 font-mono">
                    {formatTimeAgo(n.createdAt)}
                  </span>
                </div>

                <p className="text-body-sm text-text-muted leading-relaxed">
                  {n.message}
                </p>
              </div>
            </div>
          ))}

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
        </div>
      ) : (
        <div className="bg-card border border-border-subtle rounded-card p-12 text-center space-y-4 theme-transition">
          <div className="w-16 h-16 mx-auto rounded-full bg-accent-gold/10 text-accent-gold flex items-center justify-center">
            <Inbox className="w-8 h-8" />
          </div>
          <h2 className="text-heading-2 font-heading text-text-primary">
            No Notifications Right Now
          </h2>
          <p className="text-body-sm text-text-muted max-w-md mx-auto">
            You're all caught up! When you complete aptitude quizzes, receive feedback replies, or save bookmarks, updates will show here.
          </p>
        </div>
      )}
    </div>
  );
}
