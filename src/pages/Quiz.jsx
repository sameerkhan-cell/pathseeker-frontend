import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  BrainCircuit,
  Clock,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Trophy,
  HelpCircle,
  RotateCcw,
  SlidersHorizontal,
  FileCheck2,
  Calendar,
  Compass
} from "lucide-react";
import { quizApi } from "../api/quizApi";
import PrimaryButton from "../components/ui/PrimaryButton";
import GoldOutlineButton from "../components/ui/GoldOutlineButton";
import Loader from "../components/Loader";

export default function Quiz() {
  const navigate = useNavigate();

  const [quizzes, setQuizzes] = useState(null);
  const [history, setHistory] = useState([]);
  const [session, setSession] = useState(null); // { quiz, questions, answers, startedAt }
  const [step, setStep] = useState(0);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [timeLeft, setTimeLeft] = useState(null); // in seconds

  // Fetch available quizzes and history on load
  useEffect(() => {
    Promise.allSettled([
      quizApi.getActiveQuizzes(),
      quizApi.getHistory()
    ]).then(([activeRes, historyRes]) => {
      if (activeRes.status === "fulfilled" && activeRes.value?.data?.quizzes) {
        setQuizzes(activeRes.value.data.quizzes);
      }
      if (historyRes.status === "fulfilled" && historyRes.value?.data?.attempts) {
        setHistory(historyRes.value.data.attempts);
      }
    }).catch((err) => setError(err.message));
  }, []);

  // Timer countdown hook for active quiz session
  useEffect(() => {
    if (!session || timeLeft === null) return;
    if (timeLeft <= 0) {
      // Auto-submit when time expires
      submitQuizAuto();
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session, timeLeft]);

  const start = async (quizId) => {
    setBusy(true);
    setError("");
    try {
      const res = await quizApi.startQuiz(quizId);
      const qz = res.data.quiz;
      const questions = res.data.questions;

      // Prefill sliders with their midpoint
      const initialAnswers = {};
      questions.forEach((q) => {
        if (q.type === "SLIDER") {
          initialAnswers[q.id] = Math.round((q.sliderMin + q.sliderMax) / 2);
        }
      });

      setSession({
        quiz: qz,
        questions,
        answers: initialAnswers,
        startedAt: new Date().toISOString(),
      });
      setStep(0);
      setTimeLeft(qz.durationMinutes ? qz.durationMinutes * 60 : null);
    } catch (err) {
      setError(err.message || "Failed to start quiz");
    } finally {
      setBusy(false);
    }
  };

  const setAnswer = (questionId, value) => {
    setSession((s) => ({
      ...s,
      answers: { ...s.answers, [questionId]: value },
    }));
  };

  const submitQuizAuto = async () => {
    if (!session || busy) return;
    await submit();
  };

  const submit = async () => {
    setBusy(true);
    setError("");
    try {
      const payload = {
        startedAt: session.startedAt,
        submittedAt: new Date().toISOString(),
        answers: Object.entries(session.answers).map(([questionId, v]) => {
          const q = session.questions.find((quest) => quest.id === Number(questionId));
          return typeof v === "number" && q?.type === "SLIDER"
            ? { questionId: Number(questionId), sliderValue: v }
            : { questionId: Number(questionId), selectedOptionId: v };
        }),
      };

      if (payload.answers.length !== session.questions.length) {
        setError("Please answer all questions before submitting your assessment.");
        setBusy(false);
        return;
      }

      const res = await quizApi.submitQuiz(session.quiz.id, payload);
      navigate(`/quiz/results/${res.data.attempt.id}`);
    } catch (err) {
      setError(err.message || "Submission failed");
      setBusy(false);
    }
  };

  // Format timer mm:ss
  const formatTime = (secs) => {
    if (secs === null) return null;
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  if (error && !quizzes && !session) {
    return (
      <div className="container-app py-16 text-center space-y-4">
        <p className="text-red-500 font-semibold">{error}</p>
        <GoldOutlineButton size="md" onClick={() => window.location.reload()}>
          Try Again
        </GoldOutlineButton>
      </div>
    );
  }

  if (!quizzes && !session) {
    return (
      <div className="container-app py-16 flex flex-col items-center justify-center min-h-[50vh]">
        <Loader />
        <p className="mt-4 text-body-sm text-text-muted">Loading aptitude assessments...</p>
      </div>
    );
  }

  // ─── VIEW 1: AVAILABLE QUIZZES LIST + PAST HISTORY ───────────────
  if (!session) {
    return (
      <div className="container-app py-8 md:py-12 space-y-12 max-w-4xl">
        {/* Page Header */}
        <div className="border-b border-border-subtle pb-6 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-gold/10 border border-accent-gold/20 text-accent-gold text-xs font-semibold uppercase tracking-wider">
            <BrainCircuit className="w-3.5 h-3.5" /> Aptitude & Psychometric Intelligence
          </div>
          <h1 className="text-3xl sm:text-4xl font-display font-bold text-text-primary">
            Career Aptitude Assessments
          </h1>
          <p className="text-body-sm text-text-muted max-w-2xl">
            Evaluate your analytical tendencies, cognitive strengths, and technical readiness to unlock verified career roadmap recommendations.
          </p>
        </div>

        {error && (
          <div className="p-4 rounded-button bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 flex items-center gap-3 text-body-sm animate-fade-in">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Active Quizzes Grid */}
        <section className="space-y-6">
          <h2 className="text-heading-2 font-heading text-text-primary">
            Available Assessment Tracks
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {quizzes.map((q) => (
              <div
                key={q.id}
                className="
                  bg-card border border-border-subtle hover:border-accent-gold/50
                  rounded-card p-6 sm:p-8 shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)]
                  flex flex-col justify-between space-y-6 transition-all duration-300 theme-transition relative overflow-hidden
                "
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-caption font-semibold px-2.5 py-0.5 rounded-full bg-accent-gold/15 text-accent-gold">
                      {q.category}
                    </span>
                    <span className="text-caption text-text-muted flex items-center gap-1 font-medium">
                      <Clock className="w-3.5 h-3.5" /> {q.durationMinutes} mins
                    </span>
                  </div>

                  <h3 className="text-xl font-heading font-bold text-text-primary">
                    {q.title}
                  </h3>

                  {q.description && (
                    <p className="text-body-sm text-text-muted line-clamp-3">
                      {q.description}
                    </p>
                  )}
                </div>

                <div className="pt-4 border-t border-border-subtle flex items-center justify-between">
                  <span className="text-caption text-text-muted">
                    {q.questionCount || 3} Multi-Format Questions
                  </span>

                  <PrimaryButton size="md" disabled={busy} onClick={() => start(q.id)}>
                    {busy ? "Loading..." : "Start Assessment"} <ArrowRight className="w-4 h-4 ml-1" />
                  </PrimaryButton>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Past Assessment History Table */}
        {history.length > 0 && (
          <section className="bg-card border border-border-subtle rounded-card p-6 sm:p-8 shadow-[var(--shadow-card)] space-y-6 theme-transition">
            <div className="flex items-center justify-between border-b border-border-subtle pb-4">
              <h2 className="text-heading-2 font-heading text-text-primary flex items-center gap-2">
                <FileCheck2 className="w-5 h-5 text-accent-gold" />
                Assessment History & Records
              </h2>
              <span className="text-caption text-text-muted">
                {history.length} Completed Attempt(s)
              </span>
            </div>

            <div className="divide-y divide-border-subtle">
              {history.map((att) => (
                <div
                  key={att.id}
                  className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 first:pt-0 last:pb-0"
                >
                  <div className="space-y-1">
                    <h3 className="text-body-base font-semibold text-text-primary">
                      {att.quizTitle}
                    </h3>
                    <p className="text-caption text-text-muted flex items-center gap-2">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {new Date(att.completedAt).toLocaleDateString(undefined, {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                      {att.timedOut && (
                        <span className="text-amber-500 font-semibold">• Timed Out</span>
                      )}
                    </p>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <span className="text-caption text-text-muted block">Score</span>
                      <span className="text-lg font-bold font-display text-accent-gold">
                        {att.score}
                        <span className="text-xs text-text-muted font-normal"> pts</span>
                      </span>
                    </div>

                    <Link to={`/quiz/results/${att.id}`}>
                      <GoldOutlineButton size="sm">
                        View Report <ArrowRight className="w-3.5 h-3.5 ml-1" />
                      </GoldOutlineButton>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    );
  }

  // ─── VIEW 2: MULTI-STEP ASSESSMENT QUESTIONNAIRE ─────────────────
  const qs = session.questions;
  const q = qs[step];
  const progressPercent = Math.round(((step + 1) / qs.length) * 100);
  const currentAnswer = session.answers[q.id];
  const isLastQuestion = step === qs.length - 1;

  return (
    <div className="container-app py-8 md:py-12 max-w-2xl mx-auto space-y-6 animate-fade-in">
      {/* Quiz Progress & Timer Header */}
      <div className="bg-card border border-border-subtle rounded-card p-4 sm:p-6 shadow-[var(--shadow-card)] space-y-4 theme-transition">
        <div className="flex items-center justify-between text-body-sm">
          <div>
            <span className="text-caption uppercase font-semibold text-accent-gold font-mono tracking-wider">
              {session.quiz.title}
            </span>
            <p className="text-xs text-text-muted mt-0.5">
              Question <strong>{step + 1}</strong> of <strong>{qs.length}</strong>
            </p>
          </div>

          {timeLeft !== null && (
            <div
              className={`
                flex items-center gap-1.5 px-3 py-1.5 rounded-full font-mono text-xs font-bold border
                ${
                  timeLeft < 120
                    ? "bg-red-500/10 text-red-500 border-red-500/30 animate-pulse"
                    : "bg-base text-accent-gold border-border-subtle"
                }
              `}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>{formatTime(timeLeft)}</span>
            </div>
          )}
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-base h-2 rounded-full overflow-hidden border border-border-subtle">
          <div
            className="bg-accent-gold h-full rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Main Question Card */}
      <div className="bg-card border border-border-subtle rounded-card p-6 sm:p-8 shadow-xl space-y-8 theme-transition">
        <div className="space-y-2">
          <span className="text-caption font-semibold px-2.5 py-0.5 rounded bg-accent-gold/15 text-accent-gold uppercase font-mono">
            {q.type.replace("_", " ")}
          </span>
          <h2 className="text-xl sm:text-2xl font-heading font-bold text-text-primary leading-snug">
            {q.questionText}
          </h2>
        </div>

        {/* 1. Multiple Choice Options */}
        {q.type === "MULTIPLE_CHOICE" && (
          <div className="space-y-3" role="radiogroup" aria-label={q.questionText}>
            {q.options.map((opt) => {
              const isSelected = currentAnswer === opt.id;
              return (
                <div
                  key={opt.id}
                  onClick={() => setAnswer(q.id, opt.id)}
                  className={`
                    p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer flex items-start gap-3.5 group
                    ${
                      isSelected
                        ? "bg-accent-gold/10 border-accent-gold shadow-sm"
                        : "bg-base border-border-subtle hover:border-accent-gold/40 hover:bg-base/80"
                    }
                  `}
                >
                  <div
                    className={`
                      w-5 h-5 rounded-full border-2 mt-0.5 flex items-center justify-center shrink-0 transition-colors
                      ${isSelected ? "border-accent-gold bg-accent-gold" : "border-text-muted/40 group-hover:border-accent-gold"}
                    `}
                  >
                    {isSelected && <div className="w-2 h-2 rounded-full bg-navy-900" />}
                  </div>
                  <span
                    className={`text-body-sm font-medium ${
                      isSelected ? "text-text-primary font-semibold" : "text-text-muted group-hover:text-text-primary"
                    }`}
                  >
                    {opt.text}
                  </span>
                </div>
              );
            })}
          </div>
        )}

        {/* 2. Likert Scale (1 - 5 Pills) */}
        {q.type === "LIKERT" && (
          <div className="space-y-4" role="radiogroup" aria-label={q.questionText}>
            <div className="space-y-2.5">
              {q.options.map((opt) => {
                const isSelected = currentAnswer === opt.id;
                return (
                  <div
                    key={opt.id}
                    onClick={() => setAnswer(q.id, opt.id)}
                    className={`
                      p-3.5 sm:p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer flex items-center justify-between gap-3 group
                      ${
                        isSelected
                          ? "bg-accent-gold/15 border-accent-gold shadow-sm"
                          : "bg-base border-border-subtle hover:border-accent-gold/40"
                      }
                    `}
                  >
                    <span
                      className={`text-body-sm font-medium ${
                        isSelected ? "text-text-primary font-bold" : "text-text-muted group-hover:text-text-primary"
                      }`}
                    >
                      {opt.text}
                    </span>
                    <div
                      className={`
                        w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0
                        ${isSelected ? "border-accent-gold bg-accent-gold" : "border-text-muted/40"}
                      `}
                    >
                      {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-navy-900" />}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 3. Slider Numeric Input */}
        {q.type === "SLIDER" && (
          <div className="space-y-6 py-4">
            <div className="flex items-center justify-between">
              <span className="text-caption text-text-muted">Min: {q.sliderMin}</span>
              <div className="text-center">
                <span className="text-3xl font-display font-bold text-accent-gold block">
                  {currentAnswer ?? Math.round((q.sliderMin + q.sliderMax) / 2)}
                </span>
                <span className="text-caption text-text-muted">Selected Rating</span>
              </div>
              <span className="text-caption text-text-muted">Max: {q.sliderMax}</span>
            </div>

            <input
              type="range"
              min={q.sliderMin}
              max={q.sliderMax}
              step={q.sliderStep || 1}
              value={currentAnswer ?? Math.round((q.sliderMin + q.sliderMax) / 2)}
              onChange={(e) => setAnswer(q.id, Number(e.target.value))}
              className="
                w-full h-2.5 bg-base rounded-lg appearance-none cursor-pointer accent-accent-gold border border-border-subtle
                focus:outline-none focus:ring-2 focus:ring-accent-gold/50
              "
            />
          </div>
        )}

        {error && (
          <p className="text-caption text-red-500 flex items-center gap-1.5 pt-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            {error}
          </p>
        )}

        {/* Step Navigation Controls */}
        <div className="pt-6 border-t border-border-subtle flex items-center justify-between gap-4">
          <GoldOutlineButton
            size="md"
            disabled={step === 0 || busy}
            onClick={() => setStep(step - 1)}
          >
            <ArrowLeft className="w-4 h-4 mr-1" /> Back
          </GoldOutlineButton>

          {isLastQuestion ? (
            <PrimaryButton size="md" disabled={busy} onClick={submit}>
              {busy ? "Evaluating Score..." : "Submit Assessment"} <CheckCircle2 className="w-4 h-4 ml-1" />
            </PrimaryButton>
          ) : (
            <PrimaryButton
              size="md"
              disabled={busy || !currentAnswer}
              onClick={() => {
                setError("");
                setStep(step + 1);
              }}
            >
              Next Question <ArrowRight className="w-4 h-4 ml-1" />
            </PrimaryButton>
          )}
        </div>
      </div>
    </div>
  );
}
