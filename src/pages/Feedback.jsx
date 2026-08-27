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
  ShieldCheck,
  RotateCcw
} from "lucide-react";
import { feedbackApi } from "../api/feedbackApi";
import PrimaryButton from "../components/ui/PrimaryButton";
import GoldOutlineButton from "../components/ui/GoldOutlineButton";
import Loader from "../components/Loader";

export default function Feedback() {
  const [type, setType] = useState("BUG");
  const [message, setMessage] = useState("");
  const [mine, setMine] = useState(null);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const feedbackTypes = [
    { label: "Bug Report (Issue or Glitch)", value: "BUG", icon: <Bug className="w-4 h-4" /> },
    { label: "Feature Suggestion (Idea or Enhancement)", value: "SUGGESTION", icon: <Lightbulb className="w-4 h-4" /> },
    { label: "General Query or Question", value: "QUERY", icon: <HelpCircle className="w-4 h-4" /> },
  ];

  const loadFeedbacks = () => {
    feedbackApi
      .mine()
      .then((res) => {
        setMine(res.data.feedbacks || []);
      })
      .catch((err) => setError(err.message || "Failed to load feedback records"));
  };

  useEffect(() => {
    loadFeedbacks();
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    if (!message.trim() || message.trim().length < 10) {
      setError("Please provide a detailed message (minimum 10 characters).");
      return;
    }

    setError("");
    setStatus("");
    setSubmitting(true);

    try {
      await feedbackApi.submit(type, message.trim());
      setStatus("Thank you! Your feedback has been recorded and submitted to the platform team.");
      setMessage("");
      loadFeedbacks();
      setTimeout(() => setStatus(""), 4000);
    } catch (err) {
      setError(err.message || "Submission failed");
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusBadge = (st) => {
    switch (st) {
      case "RESOLVED":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
            <CheckCircle2 className="w-3.5 h-3.5" /> Resolved
          </span>
        );
      case "IN_PROGRESS":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-accent-gold/15 text-accent-gold border border-accent-gold/30">
            <RotateCcw className="w-3.5 h-3.5" /> In Progress
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-text-muted/15 text-text-muted border border-border-subtle">
            <Clock className="w-3.5 h-3.5" /> Open
          </span>
        );
    }
  };

  const getTypeIcon = (t) => {
    switch (t) {
      case "BUG":
        return <Bug className="w-4 h-4 text-red-500" />;
      case "SUGGESTION":
        return <Lightbulb className="w-4 h-4 text-accent-gold" />;
      default:
        return <HelpCircle className="w-4 h-4 text-blue-400" />;
    }
  };

  if (!mine) {
    return (
      <div className="container-app py-16 flex flex-col items-center justify-center min-h-[50vh]">
        <Loader />
        <p className="mt-4 text-body-sm text-text-muted">Loading feedback dashboard...</p>
      </div>
    );
  }

  return (
    <div className="container-app py-8 md:py-12 space-y-10 max-w-4xl">
      {/* ─── HEADER ────────────────────────────────────────────────── */}
      <div className="border-b border-border-subtle pb-6 space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-gold/10 border border-accent-gold/20 text-accent-gold text-xs font-semibold uppercase tracking-wider">
          <MessageSquare className="w-3.5 h-3.5" /> Platform Continuous Improvement
        </div>
        <h1 className="text-3xl sm:text-4xl font-heading font-bold text-text-primary">
          User Feedback & Support Desk
        </h1>
        <p className="text-body-sm text-text-muted max-w-2xl">
          Report technical issues, propose roadmap features, or ask guidance queries directly to the platform engineering and advisory team.
        </p>
      </div>

      {status && (
        <div className="p-4 rounded-button bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 flex items-center gap-3 text-body-sm animate-fade-in">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>{status}</span>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-button bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 flex items-center gap-3 text-body-sm animate-fade-in">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* ─── SUBMISSION FORM ───────────────────────────────────────── */}
      <form onSubmit={submit} className="bg-card border border-border-subtle rounded-card p-6 sm:p-8 shadow-xl space-y-6 theme-transition">
        <div>
          <label htmlFor="feedback-type" className="text-body-sm font-medium text-text-primary block mb-1.5">
            Feedback Category *
          </label>
          <select
            id="feedback-type"
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="
              w-full px-4 py-2.5 text-body-base text-text-primary
              bg-[var(--bg-input)] border border-border-subtle rounded-button
              focus:outline-none focus:ring-2 focus:ring-[var(--ring-focus)] focus:border-accent-gold
              theme-transition cursor-pointer
            "
          >
            {feedbackTypes.map((ft) => (
              <option key={ft.value} value={ft.value}>
                {ft.label}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1.5">
          <label htmlFor="feedback-message" className="text-body-sm font-medium text-text-primary block">
            Your Feedback / Description *
          </label>
          <textarea
            id="feedback-message"
            rows={4}
            placeholder="Please detail what you experienced or what feature you would love to see..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
            className="
              w-full px-4 py-2.5 text-body-base text-text-primary
              placeholder:text-text-muted/60 bg-[var(--bg-input)] border border-border-subtle rounded-button
              focus:outline-none focus:ring-2 focus:ring-[var(--ring-focus)] focus:border-accent-gold
              theme-transition resize-none
            "
          />
          <span className="text-caption text-text-muted">Minimum 10 characters required.</span>
        </div>

        <div className="pt-2 flex justify-end">
          <PrimaryButton type="submit" size="lg" disabled={submitting}>
            <Send className="w-4 h-4 mr-1.5" />
            {submitting ? "Submitting..." : "Send Feedback"}
          </PrimaryButton>
        </div>
      </form>

      {/* ─── PREVIOUS SUBMISSIONS & ADMIN REPLIES ─────────────────── */}
      <section className="bg-card border border-border-subtle rounded-card p-6 sm:p-8 shadow-[var(--shadow-card)] space-y-6 theme-transition">
        <div className="border-b border-border-subtle pb-4 flex items-center justify-between">
          <h2 className="text-heading-2 font-heading text-text-primary">
            My Feedback Submissions
          </h2>
          <span className="text-caption text-text-muted">
            {mine.length} Total Tickets
          </span>
        </div>

        {mine.length > 0 ? (
          <div className="space-y-4">
            {mine.map((f) => (
              <div
                key={f.id}
                className="p-5 rounded-xl bg-base border border-border-subtle space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    {getTypeIcon(f.type)}
                    <span className="text-xs font-bold uppercase font-mono text-text-primary">
                      {f.type}
                    </span>
                    <span className="text-caption text-text-muted">• Ticket #{f.id}</span>
                  </div>
                  {getStatusBadge(f.status)}
                </div>

                <p className="text-body-sm text-text-primary leading-relaxed whitespace-pre-wrap">
                  {f.message}
                </p>

                {/* Admin Reply Callout */}
                {f.adminResponse && (
                  <div className="p-3.5 rounded-lg bg-card border-l-4 border-accent-gold shadow-sm space-y-1 mt-3">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-accent-gold">
                      <ShieldCheck className="w-3.5 h-3.5" /> Official Admin Response
                    </div>
                    <p className="text-body-sm text-text-primary italic">
                      "{f.adminResponse}"
                    </p>
                  </div>
                )}

                <div className="text-[11px] text-text-muted pt-1">
                  Submitted on {new Date(f.createdAt).toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-body-sm text-text-muted text-center py-6">
            You haven't submitted any feedback tickets yet. We welcome your ideas!
          </p>
        )}
      </section>
    </div>
  );
}
