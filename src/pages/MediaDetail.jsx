import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  Video,
  Headphones,
  Film,
  Star,
  Play,
  ArrowLeft,
  ArrowRight,
  FileText,
  CheckCircle2,
  AlertCircle,
  Share2,
  Sparkles,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { mediaApi } from "../api/mediaApi";
import CareerCard from "../components/ui/CareerCard";
import PrimaryButton from "../components/ui/PrimaryButton";
import GoldOutlineButton from "../components/ui/GoldOutlineButton";
import Loader from "../components/Loader";

export default function MediaDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [summary, setSummary] = useState(null);
  const [showTranscript, setShowTranscript] = useState(false);
  const [myRating, setMyRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [ratingBusy, setRatingBusy] = useState(false);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [copySuccess, setCopySuccess] = useState(false);

  useEffect(() => {
    setError("");
    setData(null);
    setSummary(null);

    mediaApi
      .getMediaById(id)
      .then((res) => {
        setData(res.data);
        return mediaApi.getRatingSummary(id);
      })
      .then((res) => {
        setSummary(res.data);
      })
      .catch((err) => setError(err.message || "Failed to load media"));
  }, [id]);

  const handleRate = async (rating) => {
    setRatingBusy(true);
    setMyRating(rating);
    try {
      await mediaApi.rateMedia(id, rating);
      setStatus(`Your rating (${rating}/5) has been submitted!`);
      const s = await mediaApi.getRatingSummary(id);
      setSummary(s.data);
      setTimeout(() => setStatus(""), 4000);
    } catch (err) {
      setError(err.message || "Could not submit rating");
    } finally {
      setRatingBusy(false);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2500);
  };

  const getMediaIcon = (t) => {
    switch (t) {
      case "PODCAST":
        return <Headphones className="w-5 h-5" />;
      case "ANIMATED_EXPLAINER":
        return <Film className="w-5 h-5" />;
      default:
        return <Video className="w-5 h-5" />;
    }
  };

  if (error && !data) {
    return (
      <div className="container-app py-16 text-center space-y-4">
        <p className="text-red-500 font-semibold">{error}</p>
        <Link to="/media">
          <GoldOutlineButton size="md">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Multimedia Center
          </GoldOutlineButton>
        </Link>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="container-app py-16 flex flex-col items-center justify-center min-h-[50vh]">
        <Loader />
        <p className="mt-4 text-body-sm text-text-muted">Loading multimedia presentation...</p>
      </div>
    );
  }

  const { media, related } = data;

  return (
    <div className="container-app py-8 md:py-12 max-w-5xl space-y-10">
      {/* ─── NAVIGATION BAR ────────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <Link
          to="/media"
          className="inline-flex items-center gap-1.5 text-body-sm font-semibold text-accent-gold hover:underline"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Multimedia Center
        </Link>

        <button
          type="button"
          onClick={handleShare}
          className="
            inline-flex items-center gap-1.5 px-3 py-1.5 rounded-button text-xs font-semibold
            bg-card border border-border-subtle hover:border-accent-gold text-text-muted hover:text-text-primary
            transition-colors cursor-pointer
          "
        >
          <Share2 className="w-3.5 h-3.5" />
          {copySuccess ? "Link Copied!" : "Share"}
        </button>
      </div>

      {/* ─── MEDIA PLAYER CONTAINER ────────────────────────────────── */}
      <div className="bg-card border border-border-subtle rounded-card overflow-hidden shadow-2xl space-y-6 theme-transition">
        {/* Visual Media Placeholder Box */}
        <div className="relative aspect-video w-full bg-gradient-to-br from-[#14151A] to-[#1B2132] flex flex-col items-center justify-center text-center p-6 border-b border-border-subtle">
          <div className="absolute inset-0 bg-accent-gold/5 blur-2xl pointer-events-none" />

          {/* Central Play Badge */}
          <div className="relative z-10 flex flex-col items-center space-y-4">
            <div className="w-20 h-20 rounded-full bg-accent-gold/20 border-2 border-accent-gold flex items-center justify-center text-accent-gold shadow-[0_0_30px_rgba(243,221,165,0.4)] cursor-pointer hover:scale-105 transition-transform duration-200">
              <Play className="w-8 h-8 fill-accent-gold ml-1" />
            </div>

            <div className="space-y-1">
              <span className="text-caption font-mono uppercase tracking-widest text-accent-gold font-bold">
                {media.type} • {media.category}
              </span>
              <h2 className="text-xl sm:text-2xl font-heading font-bold text-text-primary max-w-xl">
                {media.title}
              </h2>
            </div>
          </div>

          <div className="absolute bottom-4 right-4 text-xs font-mono text-text-muted bg-navy-900/80 px-3 py-1 rounded border border-border-subtle">
            PathSeeker Media Hub
          </div>
        </div>

        {/* Media Info & Header */}
        <div className="p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border-subtle pb-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent-gold/15 border border-accent-gold/30 text-accent-gold text-xs font-semibold uppercase tracking-wider">
                  {getMediaIcon(media.type)}
                  {media.type.replace("_", " ")}
                </span>
                <span className="text-body-sm font-semibold text-text-primary">
                  {media.category}
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-display font-bold text-text-primary">
                {media.title}
              </h1>
            </div>

            {/* Average Rating Widget */}
            {summary && (
              <div className="p-3 rounded-xl bg-base border border-border-subtle shrink-0 text-center sm:text-right">
                <div className="flex items-center justify-center sm:justify-end gap-1 text-accent-gold font-bold text-lg">
                  <Star className="w-5 h-5 fill-accent-gold" />
                  <span>{summary.average !== null && summary.average !== undefined ? Number(summary.average).toFixed(1) : "0.0"}</span>
                  <span className="text-xs text-text-muted font-normal">/ 5.0</span>
                </div>
                <p className="text-[11px] text-text-muted mt-0.5">
                  {summary.count} {summary.count === 1 ? "rating" : "ratings"} recorded
                </p>
              </div>
            )}
          </div>

          {/* ─── 5-STAR INTERACTIVE RATING INPUT ───────────────────── */}
          <div className="p-6 rounded-xl bg-base border border-border-subtle space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-body-base font-semibold text-text-primary flex items-center gap-2">
                  <Star className="w-4 h-4 text-accent-gold" />
                  Rate this lesson
                </h3>
                <p className="text-caption text-text-muted">
                  How valuable was this material for your career pathway?
                </p>
              </div>

              {/* Star Rating Buttons */}
              <div className="flex items-center gap-1" role="radiogroup" aria-label="Rate this content 1 to 5 stars">
                {[1, 2, 3, 4, 5].map((starNum) => {
                  const isFilled = (hoverRating || myRating) >= starNum;
                  return (
                    <button
                      key={starNum}
                      type="button"
                      disabled={ratingBusy}
                      onMouseEnter={() => setHoverRating(starNum)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => handleRate(starNum)}
                      aria-label={`Rate ${starNum} out of 5 stars`}
                      className="p-1 text-2xl transition-transform hover:scale-125 cursor-pointer disabled:cursor-not-allowed"
                    >
                      <Star
                        className={`w-7 h-7 transition-colors ${
                          isFilled
                            ? "text-accent-gold fill-accent-gold"
                            : "text-border-subtle hover:text-accent-gold/50"
                        }`}
                      />
                    </button>
                  );
                })}
              </div>
            </div>

            {status && (
              <p className="text-body-sm text-emerald-500 font-semibold flex items-center gap-1.5 pt-1 animate-fade-in">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                {status}
              </p>
            )}
          </div>

          {/* ─── TRANSCRIPT ACCORDION ──────────────────────────────── */}
          <div className="border border-border-subtle rounded-xl overflow-hidden bg-base">
            <button
              type="button"
              onClick={() => setShowTranscript(!showTranscript)}
              className="w-full p-4 flex items-center justify-between font-semibold text-body-sm text-text-primary hover:bg-card/50 transition-colors text-left"
            >
              <span className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-accent-gold" />
                Lesson Transcript & Notes
              </span>
              {showTranscript ? (
                <ChevronUp className="w-4 h-4 text-text-muted" />
              ) : (
                <ChevronDown className="w-4 h-4 text-text-muted" />
              )}
            </button>

            {showTranscript && (
              <div className="p-6 border-t border-border-subtle bg-card/60 animate-fade-in text-body-sm text-text-muted leading-relaxed whitespace-pre-line font-sans">
                {media.transcript || "No transcript has been attached for this media item yet."}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ─── RELATED MULTIMEDIA CONTENT ────────────────────────────── */}
      {related && related.length > 0 && (
        <section className="pt-8 border-t border-border-subtle space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-heading-2 font-heading text-text-primary">
              Related Multimedia Lessons
            </h2>
            <Link to="/media" className="text-body-sm font-semibold text-accent-gold hover:underline flex items-center gap-1">
              View All Media <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {related.map((r) => (
              <CareerCard
                key={r.id}
                title={r.title}
                description={`Format: ${r.type.replace("_", " ")} in ${r.category}.`}
                icon={getMediaIcon(r.type)}
                onClick={() => navigate(`/media/${r.id}`)}
                footer={
                  <div className="flex items-center justify-between text-body-sm">
                    <span className="text-caption font-semibold px-2 py-0.5 rounded bg-accent-gold/10 text-accent-gold">
                      {r.type}
                    </span>
                    <span className="text-caption text-text-muted flex items-center gap-1 text-accent-gold font-medium">
                      Watch Lesson <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                }
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
