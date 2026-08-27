import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { 
  Users, 
  HelpCircle, 
  MessageSquare, 
  AlertTriangle, 
  Bookmark, 
  Eye, 
  ArrowRight, 
  TrendingUp, 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  Layers, 
  Briefcase, 
  Video, 
  BookOpen, 
  FileText,
  BarChart3,
  Award
} from "lucide-react";
import { adminApi } from "../../api/adminApi";
import Loader from "../../components/Loader";
import AdminNav, { ADMIN_SECTIONS } from "../../components/admin/AdminNav";
import StatusBadge from "../../components/ui/StatusBadge";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    adminApi
      .getOverviewStats()
      .then((res) => {
        console.log("[adminApi.getOverviewStats] real response:", res);
        setStats(res.data);
      })
      .catch((err) => setError(err.message));
  }, []);

  if (error) {
    return (
      <div className="container-app py-8">
        <AdminNav title="Admin Operations Overview" />
        <div className="p-6 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400">
          <p className="font-semibold">Failed to load overview telemetry: {error}</p>
        </div>
      </div>
    );
  }

  if (!stats) return <Loader />;

  const {
    needsAttention = {},
    activeUsersByRole = {},
    contentCounts = {},
    quizAttemptsLast30Days = {},
    averageQuizScore = {},
    popularContent = { mostBookmarked: [], mostViewed: [] },
    feedbackVolume = {}
  } = stats;

  const totalUsers = Object.values(activeUsersByRole).reduce((a, b) => a + Number(b || 0), 0);
  const pendingStories = Number(needsAttention.pendingStoriesCount || 0);
  const pendingFeedback = Number(needsAttention.pendingFeedbackCount || 0);
  const totalContent = Object.values(contentCounts).reduce((a, b) => a + Number(b || 0), 0);

  const sectionDescriptions = {
    "/admin/careers": "Create, edit salary bands, tags and toggle active career trajectories",
    "/admin/quiz": "Build aptitude quizzes, Likert scales, multiple choice & slider items",
    "/admin/media": "Curate videos, podcasts, animated explainers and transcripts",
    "/admin/stories": "Review, approve or reject community peer transition submissions",
    "/admin/resources": "Upload guides, career checklists, infographics and templates",
    "/admin/feedback": "Triage bug reports, feature suggestions and queries from users",
  };

  return (
    <div className="container-app py-8 space-y-8 animate-fade-in">
      <AdminNav 
        title="Admin Operations & Telemetry" 
        subtitle="Platform-wide KPIs, queue telemetry, activity trends, and management portals"
        badge="HQ CONTROL"
      />

      {/* ─── SECTION 1: ATTENTION CALLOUTS (IF PENDING) ─────────────── */}
      {(pendingStories > 0 || pendingFeedback > 0) && (
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-body-base font-bold text-text-primary">
                Action Items Requiring Administrator Attention
              </h2>
              <p className="text-body-sm text-text-muted">
                {pendingStories} pending community stories &bull; {pendingFeedback} unresolved user feedback items
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {pendingStories > 0 && (
              <Link
                to="/admin/stories"
                className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-accent-gold text-[#14151A] hover:bg-accent-gold-glow transition-all"
              >
                Review Stories ({pendingStories}) →
              </Link>
            )}
            {pendingFeedback > 0 && (
              <Link
                to="/admin/feedback"
                className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-card border border-border-subtle text-text-primary hover:border-accent-gold transition-all"
              >
                Feedback Inbox ({pendingFeedback}) →
              </Link>
            )}
          </div>
        </div>
      )}

      {/* ─── SECTION 2: TOP-TIER KPI GLASS PANELS ───────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* KPI 1: Active Users */}
        <div className="bg-card border border-border-subtle rounded-2xl p-6 shadow-card hover:border-accent-gold/40 transition-all theme-transition space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-caption font-semibold uppercase tracking-wider text-accent-gold">
              Total Verified Users
            </span>
            <div className="w-9 h-9 rounded-lg bg-accent-gold/10 text-accent-gold flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-display text-text-primary">{totalUsers}</span>
            <span className="text-caption text-text-muted">active across 4 roles</span>
          </div>
          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-border-subtle/50 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-text-muted">Students:</span>
              <span className="font-semibold text-text-primary">{activeUsersByRole.STUDENT || 0}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-text-muted">Grads:</span>
              <span className="font-semibold text-text-primary">{activeUsersByRole.GRADUATE || 0}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-text-muted">Pros:</span>
              <span className="font-semibold text-text-primary">{activeUsersByRole.PROFESSIONAL || 0}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-text-muted">Admins:</span>
              <span className="font-semibold text-accent-gold">{activeUsersByRole.ADMIN || 0}</span>
            </div>
          </div>
        </div>

        {/* KPI 2: Quiz Telemetry */}
        <div className="bg-card border border-border-subtle rounded-2xl p-6 shadow-card hover:border-accent-gold/40 transition-all theme-transition space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-caption font-semibold uppercase tracking-wider text-accent-gold">
              Quiz Attempts (30D)
            </span>
            <div className="w-9 h-9 rounded-lg bg-accent-gold/10 text-accent-gold flex items-center justify-center">
              <HelpCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-display text-text-primary">
              {quizAttemptsLast30Days.count || 0}
            </span>
            <span className="text-caption text-text-muted">assessments taken</span>
          </div>
          <div className="pt-2 border-t border-border-subtle/50 flex items-center justify-between text-xs">
            <span className="text-text-muted">Avg Readiness Score:</span>
            <span className="font-semibold text-accent-gold">
              {averageQuizScore.value || 0}%
            </span>
          </div>
        </div>

        {/* KPI 3: Content Repository */}
        <div className="bg-card border border-border-subtle rounded-2xl p-6 shadow-card hover:border-accent-gold/40 transition-all theme-transition space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-caption font-semibold uppercase tracking-wider text-accent-gold">
              Content Catalog
            </span>
            <div className="w-9 h-9 rounded-lg bg-accent-gold/10 text-accent-gold flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-display text-text-primary">{totalContent}</span>
            <span className="text-caption text-text-muted">published artifacts</span>
          </div>
          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-border-subtle/50 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-text-muted">Careers:</span>
              <span className="font-semibold text-text-primary">{contentCounts.careers || 0}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-text-muted">Media:</span>
              <span className="font-semibold text-text-primary">{contentCounts.media || 0}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-text-muted">Stories:</span>
              <span className="font-semibold text-text-primary">{contentCounts.stories || 0}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-text-muted">Resources:</span>
              <span className="font-semibold text-text-primary">{contentCounts.resources || 0}</span>
            </div>
          </div>
        </div>

        {/* KPI 4: Feedback Volume */}
        <div className="bg-card border border-border-subtle rounded-2xl p-6 shadow-card hover:border-accent-gold/40 transition-all theme-transition space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-caption font-semibold uppercase tracking-wider text-accent-gold">
              Feedback Volume
            </span>
            <div className="w-9 h-9 rounded-lg bg-accent-gold/10 text-accent-gold flex items-center justify-center">
              <MessageSquare className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-display text-text-primary">
              {feedbackVolume.total || 0}
            </span>
            <span className="text-caption text-text-muted">tickets logged</span>
          </div>
          <div className="flex items-center justify-between pt-2 border-t border-border-subtle/50 text-xs">
            <span className="text-text-muted">Resolved:</span>
            <span className="font-semibold text-emerald-500">{feedbackVolume.resolved || 0}</span>
            <span className="text-text-muted">Open:</span>
            <span className="font-semibold text-amber-500">{feedbackVolume.open || 0}</span>
          </div>
        </div>
      </div>

      {/* ─── SECTION 3: ADMIN MANAGEMENT SECTIONS GRID ───────────────── */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-heading-2 font-display text-text-primary">
              Management Portals
            </h2>
            <p className="text-body-sm text-text-muted">
              Direct access to configure career data, review queues, questions, and media
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {ADMIN_SECTIONS.filter(s => s.to !== "/admin").map((sec) => {
            const Icon = sec.icon;
            const desc = sectionDescriptions[sec.to];
            return (
              <Link
                key={sec.to}
                to={sec.to}
                className="bg-card border border-border-subtle rounded-2xl p-6 shadow-card hover:border-accent-gold/60 hover:shadow-card-hover group transition-all theme-transition flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-xl bg-accent-gold/10 text-accent-gold flex items-center justify-center group-hover:scale-105 transition-transform">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-display text-text-primary group-hover:text-accent-gold transition-colors">
                    {sec.label}
                  </h3>
                  <p className="text-body-sm text-text-muted leading-relaxed">
                    {desc}
                  </p>
                </div>
                <div className="pt-4 mt-4 border-t border-border-subtle/40 flex items-center justify-between text-xs font-semibold text-accent-gold">
                  <span>Open Portal</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* ─── SECTION 4: POPULAR CONTENT INSIGHTS ──────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Most Bookmarked */}
        <div className="bg-card border border-border-subtle rounded-2xl p-6 sm:p-8 shadow-card space-y-6 theme-transition">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-accent-gold/10 text-accent-gold flex items-center justify-center">
                <Bookmark className="w-4 h-4" />
              </div>
              <h3 className="text-lg font-display text-text-primary">
                Most Bookmarked Content
              </h3>
            </div>
            <span className="text-xs font-mono text-accent-gold">TOP SAVED</span>
          </div>

          {popularContent.mostBookmarked?.length > 0 ? (
            <div className="space-y-3">
              {popularContent.mostBookmarked.map((x, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-3.5 rounded-xl bg-base border border-border-subtle/60 hover:border-accent-gold/30 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="w-6 h-6 rounded-full bg-accent-gold/15 text-accent-gold text-xs font-mono font-bold flex items-center justify-center flex-shrink-0">
                      #{i + 1}
                    </span>
                    <div className="truncate">
                      <p className="text-body-sm font-semibold text-text-primary truncate">
                        {x.title}
                      </p>
                      <StatusBadge status={x.itemType} className="mt-1" />
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-accent-gold pl-3 flex-shrink-0">
                    <Bookmark className="w-3.5 h-3.5" />
                    <span>{x.count} bookmarks</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-body-sm text-text-muted italic">No bookmark records found yet.</p>
          )}
        </div>

        {/* Most Viewed */}
        <div className="bg-card border border-border-subtle rounded-2xl p-6 sm:p-8 shadow-card space-y-6 theme-transition">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-accent-gold/10 text-accent-gold flex items-center justify-center">
                <Eye className="w-4 h-4" />
              </div>
              <h3 className="text-lg font-display text-text-primary">
                Most Viewed Content
              </h3>
            </div>
            <span className="text-xs font-mono text-accent-gold">TOP TRAFFIC</span>
          </div>

          {popularContent.mostViewed?.length > 0 ? (
            <div className="space-y-3">
              {popularContent.mostViewed.map((x, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-3.5 rounded-xl bg-base border border-border-subtle/60 hover:border-accent-gold/30 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="w-6 h-6 rounded-full bg-accent-gold/15 text-accent-gold text-xs font-mono font-bold flex items-center justify-center flex-shrink-0">
                      #{i + 1}
                    </span>
                    <div className="truncate">
                      <p className="text-body-sm font-semibold text-text-primary truncate">
                        {x.title}
                      </p>
                      <StatusBadge status={x.itemType} className="mt-1" />
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-text-muted pl-3 flex-shrink-0">
                    <Eye className="w-3.5 h-3.5 text-accent-gold" />
                    <span className="text-text-primary font-semibold">{x.views} views</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-body-sm text-text-muted italic">No view records found yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
