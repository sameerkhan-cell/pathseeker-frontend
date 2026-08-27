import { useEffect, useState } from "react";
import {
  User,
  GraduationCap,
  Briefcase,
  UploadCloud,
  FileText,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Save,
  Clock,
  BookOpen
} from "lucide-react";
import { profileApi } from "../api/profileApi";
import { useAuth } from "../context/AuthContext";
import TextField from "../components/ui/TextField";
import PrimaryButton from "../components/ui/PrimaryButton";
import GoldOutlineButton from "../components/ui/GoldOutlineButton";
import Loader from "../components/Loader";

export default function Profile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [deletingResume, setDeletingResume] = useState(false);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");

  const [form, setForm] = useState({
    educationLevel: "",
    fieldOfStudy: "",
    institution: "",
    graduationYear: "",
    skills: "",
    interests: "",
    experienceYears: "",
    currentRole: "",
    bio: "",
    phone: "",
  });

  const [file, setFile] = useState(null);

  useEffect(() => {
    profileApi
      .getMyProfile()
      .then((res) => {
        const p = res.data.profile;
        setProfile(p);
        setForm({
          educationLevel: p.educationLevel || "",
          fieldOfStudy: p.fieldOfStudy || "",
          institution: p.institution || "",
          graduationYear: p.graduationYear !== null && p.graduationYear !== undefined ? String(p.graduationYear) : "",
          skills: (p.skills || []).join(", "),
          interests: (p.interests || []).join(", "),
          experienceYears: p.experienceYears !== null && p.experienceYears !== undefined ? String(p.experienceYears) : "",
          currentRole: p.currentRole || "",
          bio: p.bio || "",
          phone: p.phone || "",
        });
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const toList = (s) =>
    s
      .split(",")
      .map((x) => x.trim())
      .filter(Boolean);

  const buildPayload = () => ({
    educationLevel: form.educationLevel || null,
    fieldOfStudy: form.fieldOfStudy || null,
    institution: form.institution || null,
    graduationYear: form.graduationYear === "" ? null : Number(form.graduationYear),
    skills: toList(form.skills),
    interests: toList(form.interests),
    experienceYears: form.experienceYears === "" ? null : Number(form.experienceYears),
    currentRole: form.currentRole || null,
    bio: form.bio || null,
    phone: form.phone || null,
  });

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    setStatus("");
    setError("");
    try {
      const res = await profileApi.updateProfile(buildPayload());
      setProfile(res.data.profile);
      setStatus("Passport profile updated successfully!");
    } catch (err) {
      setError(err.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const uploadResume = async () => {
    if (!file) return;
    setUploading(true);
    setStatus("");
    setError("");
    try {
      const res = await profileApi.uploadResume(file);
      setStatus("Resume uploaded successfully!");
      setProfile((prev) => ({ ...prev, resumeUrl: res.data.resumeUrl }));
      setFile(null);
    } catch (err) {
      setError(err.message || "Failed to upload resume");
    } finally {
      setUploading(false);
    }
  };

  const deleteResume = async () => {
    if (!window.confirm("Are you sure you want to delete your uploaded resume?")) return;
    setDeletingResume(true);
    setStatus("");
    setError("");
    try {
      await profileApi.deleteResume();
      setProfile((prev) => ({ ...prev, resumeUrl: null }));
      setStatus("Resume removed successfully.");
    } catch (err) {
      setError(err.message || "Failed to delete resume");
    } finally {
      setDeletingResume(false);
    }
  };

  if (loading) {
    return (
      <div className="container-app py-16 flex flex-col items-center justify-center min-h-[50vh]">
        <Loader />
        <p className="mt-4 text-body-sm text-text-muted">Loading your profile passport...</p>
      </div>
    );
  }

  const getInitials = (name) => {
    if (!name) return "PS";
    return name
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  return (
    <div className="container-app py-8 md:py-12 space-y-10 max-w-4xl">
      {/* ─── PASSPORT PROFILE HEADER ───────────────────────────────── */}
      <div className="bg-card border border-border-subtle rounded-card p-6 sm:p-8 shadow-[var(--shadow-card)] theme-transition relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-accent-gold/10 rounded-full blur-2xl pointer-events-none -z-0" />

        <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
          {/* Avatar Monogram */}
          <div className="relative flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-br from-navy-800 to-navy-900 border-2 border-accent-gold text-accent-gold font-display font-bold text-2xl sm:text-3xl shadow-lg shrink-0">
            {getInitials(user?.name)}
            <span className="absolute -bottom-1.5 -right-1.5 p-1 rounded-full bg-emerald-500 text-white border-2 border-card">
              <CheckCircle2 className="w-3.5 h-3.5" />
            </span>
          </div>

          <div className="space-y-1.5 flex-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-gold/10 border border-accent-gold/20 text-accent-gold text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="w-3 h-3" /> Verified Passport Profile
            </div>
            <h1 className="text-2xl sm:text-3xl font-display font-bold text-text-primary">
              {user?.name || "Career Seeker"}
            </h1>
            <p className="text-body-sm text-text-muted">
              {user?.email} • Role:{" "}
              <span className="px-2 py-0.5 rounded bg-accent-gold/15 text-accent-gold font-semibold uppercase text-xs">
                {user?.role || "STUDENT"}
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* ─── STATUS NOTIFICATIONS ──────────────────────────────────── */}
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

      {/* ─── SECTION 1: RESUME MANAGEMENT ─────────────────────────── */}
      <section className="bg-card border border-border-subtle rounded-card p-6 sm:p-8 shadow-[var(--shadow-card)] space-y-6 theme-transition">
        <div className="border-b border-border-subtle pb-4">
          <h2 className="text-heading-2 font-heading text-text-primary flex items-center gap-2">
            <FileText className="w-5 h-5 text-accent-gold" />
            Resume Document
          </h2>
          <p className="text-body-sm text-text-muted mt-1">
            Upload your latest CV/Resume (PDF, DOC, or DOCX format, max 5MB) for AI career skill alignment.
          </p>
        </div>

        {profile?.resumeUrl ? (
          <div className="p-4 sm:p-5 rounded-xl bg-base border border-border-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-12 h-12 rounded-lg bg-accent-gold/10 text-accent-gold flex items-center justify-center shrink-0">
                <FileText className="w-6 h-6" />
              </div>
              <div className="min-w-0">
                <span className="text-caption text-emerald-500 font-semibold uppercase flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Active Resume on File
                </span>
                <p className="text-body-sm font-semibold text-text-primary truncate">
                  {profile.resumeUrl.split("/").pop()}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <a
                href={`http://localhost:5000${profile.resumeUrl}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex"
              >
                <GoldOutlineButton size="sm">View / Download</GoldOutlineButton>
              </a>
              <button
                type="button"
                onClick={deleteResume}
                disabled={deletingResume}
                className="
                  inline-flex items-center gap-1.5 px-3 py-2 text-body-sm font-medium
                  text-red-500 hover:bg-red-500/10 rounded-button border border-red-500/20
                  transition-colors cursor-pointer disabled:opacity-50
                "
              >
                <Trash2 className="w-4 h-4" />
                {deletingResume ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="border-2 border-dashed border-border-subtle hover:border-accent-gold/50 rounded-xl p-6 sm:p-8 text-center bg-base/50 transition-colors">
              <UploadCloud className="w-10 h-10 mx-auto text-accent-gold mb-2" />
              <p className="text-body-sm font-semibold text-text-primary">
                Choose a resume file to attach to your passport
              </p>
              <p className="text-caption text-text-muted mt-1">
                Accepted: .pdf, .doc, .docx (Max 5MB)
              </p>
              <input
                id="resume-file-input"
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="mt-4 text-body-sm text-text-muted file:mr-4 file:py-2 file:px-4 file:rounded-button file:border-0 file:text-body-sm file:font-semibold file:bg-navy-800 file:text-white dark:file:bg-accent-gold dark:file:text-navy-900 hover:file:bg-accent-gold cursor-pointer"
              />
            </div>

            {file && (
              <div className="flex items-center justify-between p-3 rounded-lg bg-base border border-border-subtle">
                <span className="text-body-sm text-text-primary font-medium truncate">
                  Selected: {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                </span>
                <PrimaryButton size="sm" onClick={uploadResume} disabled={uploading}>
                  {uploading ? "Uploading..." : "Confirm & Upload"}
                </PrimaryButton>
              </div>
            )}
          </div>
        )}
      </section>

      {/* ─── SECTION 2: ACADEMIC & PROFESSIONAL DETAILS ──────────── */}
      <section className="bg-card border border-border-subtle rounded-card p-6 sm:p-8 shadow-[var(--shadow-card)] space-y-6 theme-transition">
        <div className="border-b border-border-subtle pb-4">
          <h2 className="text-heading-2 font-heading text-text-primary flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-accent-gold" />
            Education & Background
          </h2>
          <p className="text-body-sm text-text-muted mt-1">
            Specify your academic qualifications and current professional status.
          </p>
        </div>

        <form onSubmit={save} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <TextField
              label="Education Level"
              name="educationLevel"
              placeholder="e.g. Bachelor's, Master's, High School"
              value={form.educationLevel}
              onChange={onChange}
            />

            <TextField
              label="Field of Study / Major"
              name="fieldOfStudy"
              placeholder="e.g. Computer Science, Business, Biology"
              value={form.fieldOfStudy}
              onChange={onChange}
            />

            <TextField
              label="University / Institution"
              name="institution"
              placeholder="e.g. Stanford University, FAST NUCES"
              value={form.institution}
              onChange={onChange}
            />

            <TextField
              label="Graduation Year"
              name="graduationYear"
              type="number"
              placeholder="e.g. 2026"
              value={form.graduationYear}
              onChange={onChange}
            />

            <TextField
              label="Current Role / Target Role"
              name="currentRole"
              placeholder="e.g. Frontend Developer, Student, Data Analyst"
              value={form.currentRole}
              onChange={onChange}
            />

            <TextField
              label="Years of Experience"
              name="experienceYears"
              type="number"
              placeholder="e.g. 2"
              value={form.experienceYears}
              onChange={onChange}
            />
          </div>

          <div className="space-y-6 pt-4 border-t border-border-subtle">
            <div>
              <TextField
                label="Core Skills (comma-separated)"
                name="skills"
                placeholder="e.g. React, Node.js, Python, Figma, Cloud Architecture"
                value={form.skills}
                onChange={onChange}
              />
              <p className="text-caption text-text-muted mt-1">
                Enter your technical and soft competencies separated by commas.
              </p>
            </div>

            <div>
              <TextField
                label="Career Interests & Passions (comma-separated)"
                name="interests"
                placeholder="e.g. Artificial Intelligence, Web3, FinTech, UX Research"
                value={form.interests}
                onChange={onChange}
              />
              <p className="text-caption text-text-muted mt-1">
                Used to tailor aptitude quizzes and career recommendations to your goals.
              </p>
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="bio-input" className="text-body-sm font-medium text-text-primary">
                Professional Bio / Objective
              </label>
              <textarea
                id="bio-input"
                name="bio"
                rows={3}
                placeholder="Brief description of your background and professional aspirations..."
                value={form.bio}
                onChange={onChange}
                className="
                  w-full px-4 py-2.5 text-body-base text-text-primary
                  placeholder:text-text-muted/60 bg-[var(--bg-input)] border border-border-subtle rounded-button
                  focus:outline-none focus:ring-2 focus:ring-[var(--ring-focus)] focus:border-accent-gold
                  theme-transition resize-none
                "
              />
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <PrimaryButton type="submit" size="lg" disabled={saving}>
              <Save className="w-4 h-4 mr-1" />
              {saving ? "Saving Changes..." : "Save Passport Profile"}
            </PrimaryButton>
          </div>
        </form>
      </section>
    </div>
  );
}
