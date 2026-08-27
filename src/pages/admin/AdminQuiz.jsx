import { useEffect, useState } from "react";
import { 
  HelpCircle, 
  Plus, 
  Send, 
  Trash2, 
  AlertCircle, 
  CheckCircle2, 
  Sliders, 
  ListChecks, 
  BarChart2,
  Sparkles,
  Layers,
  ChevronRight
} from "lucide-react";
import { quizApi } from "../../api/quizApi";
import Loader from "../../components/Loader";
import AdminNav from "../../components/admin/AdminNav";
import StatusBadge from "../../components/ui/StatusBadge";
import TextField from "../../components/ui/TextField";
import PrimaryButton from "../../components/ui/PrimaryButton";
import GoldOutlineButton from "../../components/ui/GoldOutlineButton";

const EMPTY_QUIZ = { 
  title: "", 
  category: "", 
  description: "", 
  durationMinutes: 10, 
  status: "DRAFT" 
};

const EMPTY_Q = { 
  type: "MULTIPLE_CHOICE", 
  questionText: "", 
  order: 1, 
  options: "Very confident | 20\nModerately confident | 10\nBeginner / Learning | 0", 
  sliderMin: 0, 
  sliderMax: 100, 
  sliderStep: 10 
};

export default function AdminQuiz() {
  const [quizForm, setQuizForm] = useState(EMPTY_QUIZ);
  const [createdQuizId, setCreatedQuizId] = useState(null);
  const [quizDetails, setQuizDetails] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [qForm, setQForm] = useState(EMPTY_Q);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const loadQuestions = (quizId) => {
    quizApi
      .adminListQuestions(quizId)
      .then((res) => {
        console.log("[quizApi.adminListQuestions] real response:", res);
        setQuestions(res.data.questions || []);
      })
      .catch((err) => setError(err.message));
  };

  const createQuiz = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setStatus("");
    try {
      const res = await quizApi.adminCreateQuiz({ 
        ...quizForm, 
        durationMinutes: Number(quizForm.durationMinutes) 
      });
      console.log("[quizApi.adminCreateQuiz] real response:", res);
      const created = res.data.quiz;
      setCreatedQuizId(created.id);
      setQuizDetails(created);
      setStatus(`Quiz #${created.id} successfully initialized as ${created.status}! Now add questions below.`);
      loadQuestions(created.id);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const publishQuiz = async () => {
    if (!createdQuizId) return;
    setError("");
    try {
      const res = await quizApi.adminUpdateQuiz(createdQuizId, { status: "PUBLISHED" });
      console.log("[quizApi.adminUpdateQuiz] real response:", res);
      setQuizDetails((q) => ({ ...q, status: "PUBLISHED" }));
      setStatus(`Quiz #${createdQuizId} is now live and published to students!`);
    } catch (err) {
      setError(err.message);
    }
  };

  const toOptions = () =>
    qForm.options
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line, i) => {
        const [text, weight] = line.split("|").map((x) => x.trim());
        return { id: `o${i + 1}`, text, weight: Number(weight || 0) };
      });

  const addQuestion = async (e) => {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      const payload =
        qForm.type === "SLIDER"
          ? {
              type: "SLIDER",
              questionText: qForm.questionText,
              order: Number(qForm.order),
              sliderMin: Number(qForm.sliderMin),
              sliderMax: Number(qForm.sliderMax),
              sliderStep: Number(qForm.sliderStep),
            }
          : { 
              type: qForm.type, 
              questionText: qForm.questionText, 
              order: Number(qForm.order), 
              options: toOptions() 
            };

      const res = await quizApi.adminAddQuestion(createdQuizId, payload);
      console.log("[quizApi.adminAddQuestion] real response:", res);
      setStatus(`Question #${res.data.question.id} (${res.data.question.type}) added successfully!`);
      setQForm({ 
        ...EMPTY_Q, 
        type: qForm.type,
        order: questions.length + 2,
        questionText: "" 
      });
      loadQuestions(createdQuizId);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const deleteQuestion = async (id) => {
    if (!window.confirm("Delete this question from the quiz?")) return;
    try {
      const res = await quizApi.adminDeleteQuestion(id);
      console.log("[quizApi.adminDeleteQuestion] real response:", res);
      setStatus(`Question #${id} deleted.`);
      loadQuestions(createdQuizId);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="container-app py-8 space-y-8 animate-fade-in">
      <AdminNav 
        title="Quiz & Psychometric Assessment Manager" 
        subtitle="Configure assessment batteries, scoring rubrics, Likert questions, and slider weights"
        badge="ASSESSMENT HQ"
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

      {/* ─── STAGE 1: QUIZ CREATION CARD ─────────────────────────────── */}
      <div className="bg-card border border-border-subtle rounded-2xl p-6 sm:p-8 shadow-card theme-transition space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border-subtle/60 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-accent-gold/10 text-accent-gold flex items-center justify-center">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-display text-text-primary">
                {createdQuizId ? `Active Quiz: #${createdQuizId} — ${quizForm.title || "Custom Quiz"}` : "Create New Quiz Definition"}
              </h2>
              <p className="text-body-sm text-text-muted">
                Define the assessment metadata, target career category, and duration
              </p>
            </div>
          </div>
          {createdQuizId && (
            <div className="flex items-center gap-2">
              <StatusBadge status={quizDetails?.status || "DRAFT"} />
              {quizDetails?.status !== "PUBLISHED" && (
                <PrimaryButton size="sm" onClick={publishQuiz}>
                  <Send className="w-3.5 h-3.5" /> Publish Quiz Live
                </PrimaryButton>
              )}
            </div>
          )}
        </div>

        {!createdQuizId ? (
          <form onSubmit={createQuiz} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              <TextField
                label="Quiz Title"
                placeholder="e.g. Software Engineering Aptitude"
                value={quizForm.title}
                onChange={(e) => setQuizForm({ ...quizForm, title: e.target.value })}
                required
              />
              <TextField
                label="Category / Domain"
                placeholder="e.g. Technical, Analytical, Creative"
                value={quizForm.category}
                onChange={(e) => setQuizForm({ ...quizForm, category: e.target.value })}
                required
              />
              <TextField
                label="Estimated Duration (Minutes)"
                type="number"
                min="1"
                max="180"
                value={quizForm.durationMinutes}
                onChange={(e) => setQuizForm({ ...quizForm, durationMinutes: e.target.value })}
                required
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-body-sm font-medium text-text-primary">
                Description & Instructions
              </label>
              <textarea
                rows={2}
                placeholder="Explain what this assessment tests and how results guide career mapping..."
                value={quizForm.description}
                onChange={(e) => setQuizForm({ ...quizForm, description: e.target.value })}
                className="w-full px-4 py-2.5 text-body-base text-text-primary bg-[var(--bg-input)] border border-border-subtle rounded-button focus:outline-none focus:border-accent-gold focus:ring-2 focus:ring-[var(--ring-focus)] theme-transition"
              />
            </div>
            <PrimaryButton type="submit" disabled={saving}>
              {saving ? "Creating Quiz..." : "Initialize Quiz Battery"}
            </PrimaryButton>
          </form>
        ) : (
          <div className="p-4 rounded-xl bg-base border border-border-subtle/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-body-sm">
            <div className="space-y-1">
              <p className="font-semibold text-text-primary">
                Category: <span className="text-accent-gold">{quizForm.category}</span> &bull; Duration: {quizForm.durationMinutes} mins
              </p>
              <p className="text-text-muted text-xs">{quizForm.description || "No description specified"}</p>
            </div>
            <button
              onClick={() => { setCreatedQuizId(null); setQuizForm(EMPTY_QUIZ); setQuestions([]); }}
              className="text-xs text-text-muted hover:text-accent-gold underline self-start sm:self-auto"
            >
              + Create Another Quiz
            </button>
          </div>
        )}
      </div>

      {/* ─── STAGE 2: QUESTION BUILDER (IF QUIZ CREATED) ─────────────── */}
      {createdQuizId && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Builder Form */}
          <div className="lg:col-span-6 bg-card border border-border-subtle rounded-2xl p-6 sm:p-8 shadow-card theme-transition space-y-6">
            <div className="flex items-center gap-3 border-b border-border-subtle/60 pb-4">
              <div className="w-9 h-9 rounded-xl bg-accent-gold/10 text-accent-gold flex items-center justify-center">
                <Plus className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-lg font-display text-text-primary">
                  Question Builder
                </h3>
                <p className="text-body-sm text-text-muted">
                  Choose question archetype and configure scoring weights
                </p>
              </div>
            </div>

            <form onSubmit={addQuestion} className="space-y-5">
              {/* Type selector cards */}
              <div className="space-y-2">
                <label className="text-body-sm font-medium text-text-primary">
                  Question Format / Archetype
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { type: "MULTIPLE_CHOICE", label: "Multiple Choice", icon: ListChecks },
                    { type: "LIKERT", label: "Likert Scale", icon: BarChart2 },
                    { type: "SLIDER", label: "Value Slider", icon: Sliders },
                  ].map((t) => {
                    const Icon = t.icon;
                    const isSelected = qForm.type === t.type;
                    return (
                      <button
                        key={t.type}
                        type="button"
                        onClick={() => setQForm({ ...qForm, type: t.type })}
                        className={`
                          p-3 rounded-xl border flex flex-col items-center gap-2 text-center transition-all text-xs font-semibold
                          ${
                            isSelected
                              ? "bg-accent-gold/15 border-accent-gold text-accent-gold shadow-sm"
                              : "bg-base border-border-subtle text-text-muted hover:text-text-primary hover:border-accent-gold/40"
                          }
                        `}
                      >
                        <Icon className="w-4 h-4" />
                        <span>{t.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Question Text */}
              <div className="flex flex-col gap-1.5">
                <label className="text-body-sm font-medium text-text-primary">
                  Question Prompt / Text <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. How comfortable are you writing algorithms from scratch?"
                  value={qForm.questionText}
                  onChange={(e) => setQForm({ ...qForm, questionText: e.target.value })}
                  required
                  className="w-full px-4 py-2.5 text-body-base text-text-primary bg-[var(--bg-input)] border border-border-subtle rounded-button focus:outline-none focus:border-accent-gold focus:ring-2 focus:ring-[var(--ring-focus)] theme-transition"
                />
              </div>

              <TextField
                label="Display Order (Sequence Index)"
                type="number"
                min="1"
                value={qForm.order}
                onChange={(e) => setQForm({ ...qForm, order: e.target.value })}
                required
              />

              {/* Specific Sub-View: Slider Controls */}
              {qForm.type === "SLIDER" ? (
                <div className="p-4 rounded-xl bg-base border border-border-subtle space-y-4">
                  <span className="text-xs font-mono uppercase text-accent-gold font-semibold flex items-center gap-1.5">
                    <Sliders className="w-3.5 h-3.5" /> Slider Bounds Configuration
                  </span>
                  <div className="grid grid-cols-3 gap-3">
                    <TextField
                      label="Minimum Value"
                      type="number"
                      value={qForm.sliderMin}
                      onChange={(e) => setQForm({ ...qForm, sliderMin: e.target.value })}
                      required
                    />
                    <TextField
                      label="Maximum Value"
                      type="number"
                      value={qForm.sliderMax}
                      onChange={(e) => setQForm({ ...qForm, sliderMax: e.target.value })}
                      required
                    />
                    <TextField
                      label="Step Interval"
                      type="number"
                      value={qForm.sliderStep}
                      onChange={(e) => setQForm({ ...qForm, sliderStep: e.target.value })}
                      required
                    />
                  </div>
                </div>
              ) : (
                /* Specific Sub-View: Multi-choice / Likert Options */
                <div className="p-4 rounded-xl bg-base border border-border-subtle space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono uppercase text-accent-gold font-semibold flex items-center gap-1.5">
                      <ListChecks className="w-3.5 h-3.5" /> Options &amp; Score Weights
                    </span>
                    <span className="text-[11px] text-text-muted font-mono">Format: Text | Weight</span>
                  </div>
                  <textarea
                    rows={4}
                    placeholder={"Strongly Agree | 25\nAgree | 15\nNeutral | 5\nDisagree | 0"}
                    value={qForm.options}
                    onChange={(e) => setQForm({ ...qForm, options: e.target.value })}
                    required
                    className="w-full px-4 py-2.5 font-mono text-xs text-text-primary bg-[var(--bg-input)] border border-border-subtle rounded-button focus:outline-none focus:border-accent-gold focus:ring-2 focus:ring-[var(--ring-focus)] theme-transition"
                  />
                </div>
              )}

              <PrimaryButton type="submit" disabled={saving} className="w-full">
                {saving ? "Adding Question..." : "+ Add Question to Quiz"}
              </PrimaryButton>
            </form>
          </div>

          {/* Questions Inventory Table */}
          <div className="lg:col-span-6 bg-card border border-border-subtle rounded-2xl shadow-card theme-transition overflow-hidden flex flex-col">
            <div className="p-6 border-b border-border-subtle flex items-center justify-between">
              <div>
                <h3 className="text-lg font-display text-text-primary">
                  Configured Questions ({questions.length})
                </h3>
                <p className="text-body-sm text-text-muted">
                  Sequence of questions currently attached to Quiz #{createdQuizId}
                </p>
              </div>
              <StatusBadge status={`${questions.length} items`} />
            </div>

            <div className="overflow-x-auto flex-1 p-2">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-border-subtle bg-base/50 text-[11px] font-mono uppercase tracking-wider text-accent-gold">
                    <th className="py-3 px-3 font-semibold">#</th>
                    <th className="py-3 px-3 font-semibold">Type</th>
                    <th className="py-3 px-3 font-semibold">Question Prompt</th>
                    <th className="py-3 px-3 font-semibold text-right">Delete</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-subtle/50 text-body-sm">
                  {questions.length > 0 ? (
                    questions.map((qq, idx) => (
                      <tr key={qq.id} className="hover:bg-accent-gold/5 transition-colors">
                        <td className="py-3 px-3 font-mono text-xs text-text-muted">
                          #{qq.order || idx + 1}
                        </td>
                        <td className="py-3 px-3">
                          <StatusBadge status={qq.type} />
                        </td>
                        <td className="py-3 px-3 text-text-primary font-medium">
                          <p className="line-clamp-2 text-xs leading-relaxed">
                            {qq.questionText}
                          </p>
                          {qq.options?.length > 0 && (
                            <span className="text-[10px] text-text-muted font-mono block mt-0.5">
                              {qq.options.length} weighted options
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-3 text-right">
                          <button
                            onClick={() => deleteQuestion(qq.id)}
                            className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-500/10 transition-colors"
                            title="Delete question"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="py-12 text-center text-text-muted italic">
                        No questions added yet. Use the builder on the left to add items.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
