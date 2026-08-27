import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  Trophy,
  BrainCircuit,
  Sparkles,
  ArrowRight,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Compass,
  LayoutDashboard,
  Clock,
  Layers
} from "lucide-react";
import { quizApi } from "../api/quizApi";
import { careerApi } from "../api/careerApi";
import CareerCard from "../components/ui/CareerCard";
import PrimaryButton from "../components/ui/PrimaryButton";
import GoldOutlineButton from "../components/ui/GoldOutlineButton";
import Loader from "../components/Loader";

export default function QuizResults() {
  const { attemptId } = useParams();
  const navigate = useNavigate();

  const [attempt, setAttempt] = useState(null);
  const [recommendedCareers, setRecommendedCareers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    setError("");

    quizApi
      .getAttempt(attemptId)
      .then(async (res) => {
        const att = res.data.attempt;
        setAttempt(att);

        // Parse recommendation domains to fetch live career cards
        const recDomains = att.recommendations?.domains || [];
        if (recDomains.length > 0) {
          try {
            const careersRes = await careerApi.getCareers({
              domain: recDomains[0],
              limit: 3,
            });
            setRecommendedCareers(careersRes.data?.items || []);
          } catch {
            setRecommendedCareers([]);
          }
        }
      })
      .catch((err) => setError(err.message || "Failed to load quiz results"))
      .finally(() => setLoading(false));
  }, [attemptId]);

  if (loading) {
    return (
      <div className="container-app py-16 flex flex-col items-center justify-center min-h-[50vh]">
        <Loader />
        <p className="mt-4 text-body-sm text-text-muted">Evaluating aptitude results and trajectories...</p>
      </div>
    );
  }

  if (error || !attempt) {
    return (
      <div className="container-app py-16 text-center space-y-4">
        <p className="text-red-500 font-semibold">{error || "Assessment record not found"}</p>
        <Link to="/quiz">
          <GoldOutlineButton size="md">Back to Quizzes</GoldOutlineButton>
        </Link>
      </div>
    );
  }

  const maxPossible = attempt.totalQuestions * 20;
  const scorePercent = Math.min(100, Math.round((attempt.score / maxPossible) * 100));

  return (
    <div className="container-app py-8 md:py-12 max-w-4xl space-y-10">
      {/* ─── HERO SCORE CARD ───────────────────────────────────────── */}
      <div className="bg-card border border-border-subtle rounded-card p-6 sm:p-10 shadow-[var(--shadow-card)] theme-transition relative overflow-hidden text-center space-y-6">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-80 bg-accent-gold/10 rounded-full blur-3xl pointer-events-none -z-0" />

        <div className="relative z-10 space-y-4 max-w-xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-gold/10 border border-accent-gold/20 text-accent-gold text-xs font-semibold uppercase tracking-wider">
            <Trophy className="w-3.5 h-3.5" /> Assessment Evaluation Complete
          </div>

          <h1 className="text-3xl sm:text-4xl font-display font-bold text-text-primary">
            {attempt.quizTitle || "Career Aptitude Report"}
          </h1>

          {/* Visual Score Ring / Badge */}
          <div className="py-4">
            <div className="inline-flex flex-col items-center justify-center w-36 h-36 sm:w-40 sm:h-40 rounded-full border-4 border-accent-gold/30 bg-gradient-to-br from-navy-800 to-navy-900 text-white shadow-xl shadow-accent-gold/10">
              <span className="font-display font-bold text-4xl sm:text-5xl text-accent-gold">
                {attempt.score}
              </span>
              <span className="text-[11px] text-gray-300 font-mono mt-0.5">
                POINTS SCORED
              </span>
            </div>
          </div>

          {/* Timed out flag */}
          {attempt.timedOut && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-semibold border border-amber-500/20">
              <AlertTriangle className="w-3.5 h-3.5" /> Submitted automatically when timer expired
            </div>
          )}

          <p className="text-body-sm text-text-muted">
            Completed on{" "}
            {new Date(attempt.completedAt).toLocaleDateString(undefined, {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}{" "}
            • {attempt.totalQuestions} Questions Evaluated
          </p>
        </div>
      </div>

      {/* ─── RECOMMENDATIONS BREAKDOWN ─────────────────────────────── */}
      <section className="bg-card border border-border-subtle rounded-card p-6 sm:p-8 shadow-[var(--shadow-card)] space-y-6 theme-transition">
        <div className="border-b border-border-subtle pb-4 space-y-1">
          <div className="flex items-center gap-2 text-heading-2 font-heading text-text-primary">
            <Sparkles className="w-5 h-5 text-accent-gold" />
            <h2>Matched Career Domains & Insights</h2>
          </div>
          <p className="text-body-sm text-text-muted">
            Based on your psychometric preferences and aptitude weights:
          </p>
        </div>

        <div className="p-4 sm:p-6 rounded-xl bg-base border border-border-subtle space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-caption font-medium text-text-muted">Recommended Focus Areas:</span>
            {attempt.recommendations?.domains?.length > 0 ? (
              attempt.recommendations.domains.map((dom, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 rounded-full bg-accent-gold/15 text-accent-gold border border-accent-gold/30 font-semibold text-xs uppercase"
                >
                  {dom}
                </span>
              ))
            ) : (
              <span className="text-body-sm font-semibold text-text-primary">Explore All Domains</span>
            )}
          </div>

          {attempt.recommendations?.note && (
            <p className="text-body-sm text-text-primary font-medium">
              Analysis: <span className="text-text-muted">{attempt.recommendations.note}</span>
            </p>
          )}
        </div>

        {/* Live Matched Career Cards */}
        {recommendedCareers.length > 0 && (
          <div className="space-y-4 pt-4">
            <h3 className="text-heading-3 font-heading text-text-primary">
              Matched Career Pathways
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommendedCareers.map((c) => (
                <CareerCard
                  key={c.id}
                  title={c.title}
                  description={c.description}
                  onClick={() => navigate(`/careers/${c.id}`)}
                  footer={
                    <div className="flex items-center justify-between text-body-sm">
                      <span className="text-accent-gold font-semibold">
                        ${Math.round(c.salaryMin / 1000)}k – ${Math.round(c.salaryMax / 1000)}k
                      </span>
                      <span className="text-caption font-semibold px-2 py-0.5 rounded bg-accent-gold/10 text-accent-gold">
                        {c.domain}
                      </span>
                    </div>
                  }
                />
              ))}
            </div>
          </div>
        )}
      </section>

      {/* ─── ACTION BUTTONS ────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-border-subtle">
        <Link to="/quiz">
          <GoldOutlineButton size="md">
            <RotateCcw className="w-4 h-4 mr-1.5" /> Retake Another Quiz
          </GoldOutlineButton>
        </Link>

        <div className="flex flex-wrap items-center gap-3">
          <Link to="/careers">
            <GoldOutlineButton size="md">
              <Compass className="w-4 h-4 mr-1.5" /> Explore Career Bank
            </GoldOutlineButton>
          </Link>
          <Link to="/dashboard">
            <PrimaryButton size="md">
              <LayoutDashboard className="w-4 h-4 mr-1.5" /> Return to Dashboard
            </PrimaryButton>
          </Link>
        </div>
      </div>
    </div>
  );
}
