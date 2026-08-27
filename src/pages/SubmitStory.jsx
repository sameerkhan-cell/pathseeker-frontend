import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Award,
  Sparkles,
  Send,
  CheckCircle2,
  Clock,
  AlertCircle,
  XCircle,
  ArrowLeft,
  FileText,
  GraduationCap
} from "lucide-react";
import { storiesApi } from "../api/storiesApi";
import TextField from "../components/ui/TextField";
import PrimaryButton from "../components/ui/PrimaryButton";
import GoldOutlineButton from "../components/ui/GoldOutlineButton";
import Loader from "../components/Loader";

const EMPTY = { title: "", domain: "", educationPath: "", challenges: "", outcome: "" };

export default function SubmitStory() {
  const [form, setForm] = useState(EMPTY);
  const [myStories, setMyStories] = useState([]);
  const [loadingMine, setLoadingMine] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");

  const domains = [
    { label: "Select a Career Domain", value: "" },
    { label: "Engineering", value: "Engineering" },
    { label: "Data & AI", value: "Data" },
    { label: "Design & UX", value: "Design" },
    { label: "Business & Management", value: "Business" },
    { label: "Healthcare", value: "Healthcare" },
  ];

  const loadMyStories = () => {
    setLoadingMine(true);
    storiesApi
      .getMyStories()
      .then((res) => {
        setMyStories(res.data.stories || []);
      })
      .catch(() => {})
      .finally(() => setLoadingMine(false));
  };

  useEffect(() => {
    loadMyStories();
  }, []);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setStatus("");
    setSubmitting(true);

    try {
      const res = await storiesApi.submitStory(form);
      setStatus("Your success story has been submitted successfully! It is now pending administrative review.");
      setForm(EMPTY);
      loadMyStories();
    } catch (err) {
      setError(err.message || "Failed to submit story");
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusBadge = (st) => {
    switch (st) {
      case "APPROVED":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
            <CheckCircle2 className="w-3.5 h-3.5" /> Approved & Published
          </span>
        );
      case "REJECTED":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-500/10 text-red-500 border border-red-500/20">
            <XCircle className="w-3.5 h-3.5" /> Rejected
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-500 border border-amber-500/20">
            <Clock className="w-3.5 h-3.5" /> Pending Review
          </span>
        );
    }
  };

  return (
    <div className="container-app py-8 md:py-12 space-y-10 max-w-3xl">
      {/* Back Navigation */}
      <div>
        <Link
          to="/stories"
          className="inline-flex items-center gap-1.5 text-body-sm font-semibold text-accent-gold hover:underline"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Success Stories
        </Link>
      </div>

      {/* Page Header */}
      <div className="bg-card border border-border-subtle rounded-card p-6 sm:p-8 shadow-[var(--shadow-card)] space-y-3 theme-transition">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-gold/10 border border-accent-gold/20 text-accent-gold text-xs font-semibold uppercase tracking-wider">
          <Award className="w-3.5 h-3.5" /> Career Journey Submission
        </div>
        <h1 className="text-2xl sm:text-3xl font-heading font-bold text-text-primary">
          Share Your Career Success Story
        </h1>
        <p className="text-body-sm text-text-muted">
          Your path can guide thousands of students and career switchers. Detail your academic background, the challenges you navigated, and where you are today.
        </p>
      </div>

      {/* Status Notifications */}
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

      {/* Submission Form */}
      <form onSubmit={submit} className="bg-card border border-border-subtle rounded-card p-6 sm:p-8 shadow-xl space-y-6 theme-transition">
        <TextField
          label="Story Headline / Title"
          name="title"
          placeholder="e.g. From Non-Tech Background to Junior Full-Stack Engineer in 14 Months"
          value={form.title}
          onChange={onChange}
          required
        />

        <div>
          <label htmlFor="story-domain" className="text-body-sm font-medium text-text-primary block mb-1.5">
            Career Domain *
          </label>
          <select
            id="story-domain"
            name="domain"
            value={form.domain}
            onChange={onChange}
            required
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

        <div className="space-y-1.5">
          <label htmlFor="education-path-input" className="text-body-sm font-medium text-text-primary block">
            1. Your Academic / Learning Pathway *
          </label>
          <textarea
            id="education-path-input"
            name="educationPath"
            rows={3}
            placeholder="Describe your degrees, bootcamps, online certifications, or self-taught routines..."
            value={form.educationPath}
            onChange={onChange}
            required
            className="
              w-full px-4 py-2.5 text-body-base text-text-primary
              placeholder:text-text-muted/60 bg-[var(--bg-input)] border border-border-subtle rounded-button
              focus:outline-none focus:ring-2 focus:ring-[var(--ring-focus)] focus:border-accent-gold
              theme-transition resize-none
            "
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="challenges-input" className="text-body-sm font-medium text-text-primary block">
            2. Obstacles & Challenges Faced *
          </label>
          <textarea
            id="challenges-input"
            name="challenges"
            rows={3}
            placeholder="What were the hardest parts? (e.g. impostor syndrome, interview rejections, portfolio gaps)..."
            value={form.challenges}
            onChange={onChange}
            required
            className="
              w-full px-4 py-2.5 text-body-base text-text-primary
              placeholder:text-text-muted/60 bg-[var(--bg-input)] border border-border-subtle rounded-button
              focus:outline-none focus:ring-2 focus:ring-[var(--ring-focus)] focus:border-accent-gold
              theme-transition resize-none
            "
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="outcome-input" className="text-body-sm font-medium text-text-primary block">
            3. Final Outcome & Current Position *
          </label>
          <textarea
            id="outcome-input"
            name="outcome"
            rows={3}
            placeholder="Where are you working now? What is your current title and top piece of advice?"
            value={form.outcome}
            onChange={onChange}
            required
            className="
              w-full px-4 py-2.5 text-body-base text-text-primary
              placeholder:text-text-muted/60 bg-[var(--bg-input)] border border-border-subtle rounded-button
              focus:outline-none focus:ring-2 focus:ring-[var(--ring-focus)] focus:border-accent-gold
              theme-transition resize-none
            "
          />
        </div>

        <div className="pt-4 flex justify-end">
          <PrimaryButton type="submit" size="lg" disabled={submitting}>
            <Send className="w-4 h-4 mr-1.5" />
            {submitting ? "Submitting..." : "Submit for Moderation"}
          </PrimaryButton>
        </div>
      </form>

      {/* My Past Submissions Section */}
      <section className="bg-card border border-border-subtle rounded-card p-6 sm:p-8 shadow-[var(--shadow-card)] space-y-6 theme-transition">
        <div className="border-b border-border-subtle pb-4 flex items-center justify-between">
          <h2 className="text-heading-2 font-heading text-text-primary">
            My Submitted Stories
          </h2>
          <span className="text-caption text-text-muted">
            {myStories.length} Submissions Total
          </span>
        </div>

        {loadingMine ? (
          <p className="text-body-sm text-text-muted">Loading your submissions...</p>
        ) : myStories.length > 0 ? (
          <div className="space-y-4">
            {myStories.map((s) => (
              <div
                key={s.id}
                className="p-4 sm:p-5 rounded-xl bg-base border border-border-subtle space-y-2"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <h3 className="text-body-base font-semibold text-text-primary">
                    {s.title}
                  </h3>
                  {getStatusBadge(s.status)}
                </div>

                <p className="text-caption text-text-muted">
                  Domain: <strong className="text-text-primary">{s.domain}</strong> • Submitted on{" "}
                  {new Date(s.createdAt).toLocaleDateString()}
                </p>

                {s.rejectionReason && (
                  <p className="text-caption text-red-500 bg-red-500/10 p-2 rounded border border-red-500/20 mt-2">
                    Feedback from admin: {s.rejectionReason}
                  </p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-body-sm text-text-muted text-center py-4">
            You haven't submitted any stories yet. Fill out the form above to share your journey!
          </p>
        )}
      </section>
    </div>
  );
}
