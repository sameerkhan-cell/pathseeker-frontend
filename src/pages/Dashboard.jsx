import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Compass,
  Sparkles,
  ArrowRight,
  Briefcase,
  BrainCircuit,
  Bookmark as BookmarkIcon,
  User as UserIcon,
  BookOpen,
  Video,
  Trophy,
  CheckCircle2,
  FileText,
  Clock,
  TrendingUp,
  LayoutDashboard,
  ExternalLink,
  PlusCircle,
  HelpCircle,
  AlertCircle
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { authApi } from "../api/authApi";
import { profileApi } from "../api/profileApi";
import { quizApi } from "../api/quizApi";
import { bookmarksApi } from "../api/bookmarksApi";
import { careerApi } from "../api/careerApi";
import PrimaryButton from "../components/ui/PrimaryButton";
import GoldOutlineButton from "../components/ui/GoldOutlineButton";
import CareerCard from "../components/ui/CareerCard";
import Loader from "../components/Loader";

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState(null);
  const [quizHistory, setQuizHistory] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);
  const [trendingCareers, setTrendingCareers] = useState([]);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    Promise.allSettled([
      profileApi.getMyProfile(),
      quizApi.getHistory(),
      bookmarksApi.list({ limit: 4 }),
      careerApi.getTrendingCareers(),
    ]).then(([profileRes, quizRes, bookmarkRes, careersRes]) => {
      if (!isMounted) return;

      if (profileRes.status === "fulfilled" && profileRes.value?.data?.profile) {
        setProfileData(profileRes.value.data.profile);
      }
      if (quizRes.status === "fulfilled" && quizRes.value?.data?.attempts) {
        setQuizHistory(quizRes.value.data.attempts);
      }
      if (bookmarkRes.status === "fulfilled") {
        const bList = bookmarkRes.value?.data?.items || bookmarkRes.value?.data?.bookmarks || [];
        setBookmarks(bList);
      }
      if (careersRes.status === "fulfilled" && careersRes.value?.data?.careers) {
        setTrendingCareers(careersRes.value.data.careers.slice(0, 3));
      }

      setLoading(false);
    });

    return () => {
      isMounted = false;
    };
  }, []);

  // Calculate profile completion percentage
  const calculateCompleteness = (prof) => {
    if (!prof) return 20;
    let score = 20; // base account exists
    if (prof.educationLevel) score += 15;
    if (prof.fieldOfStudy) score += 15;
    if (prof.institution) score += 10;
    if (prof.skills && prof.skills.length > 0) score += 15;
    if (prof.interests && prof.interests.length > 0) score += 10;
    if (prof.resumeUrl) score += 15;
    return Math.min(100, score);
  };

  const completeness = calculateCompleteness(profileData);
  const latestQuiz = quizHistory.length > 0 ? quizHistory[0] : null;

  const navItems = [
    { id: "overview", label: "Dashboard", icon: <LayoutDashboard className="w-5 h-5" />, path: "/dashboard" },
    { id: "careers", label: "Career Bank", icon: <Compass className="w-5 h-5" />, path: "/careers" },
    { id: "quiz", label: "Aptitude Quiz", icon: <BrainCircuit className="w-5 h-5" />, path: "/quiz" },
    { id: "bookmarks", label: "Saved Bookmarks", icon: <BookmarkIcon className="w-5 h-5" />, path: "/bookmarks" },
    { id: "profile", label: "Passport Profile", icon: <UserIcon className="w-5 h-5" />, path: "/profile" },
    { id: "resources", label: "Resources", icon: <BookOpen className="w-5 h-5" />, path: "/resources" },
    { id: "media", label: "Multimedia", icon: <Video className="w-5 h-5" />, path: "/media" },
  ];

  if (loading) {
    return (
      <div className="container-app py-16 flex flex-col items-center justify-center min-h-[50vh]">
        <Loader />
        <p className="mt-4 text-body-sm text-text-muted">Loading your career dashboard...</p>
      </div>
    );
  }

  return (
    <div className="container-app py-6 md:py-10">
      <div className="flex flex-col md:flex-row gap-8 items-start">
        {/* ─── DESKTOP / TABLET SIDEBAR ─────────────────────────────── */}
        <aside className="hidden md:flex flex-col w-16 lg:w-60 shrink-0 bg-card border border-border-subtle rounded-card p-3 lg:p-4 sticky top-24 shadow-[var(--shadow-card)] theme-transition">
          <div className="px-3 py-2 mb-2 hidden lg:block border-b border-border-subtle pb-3">
            <span className="text-[11px] font-bold text-accent-gold uppercase tracking-wider font-mono">
              Navigation
            </span>
          </div>

          <nav className="space-y-1.5" aria-label="Dashboard Navigation">
            {navItems.map((item) => {
              const isActive = item.id === activeTab;
              return (
                <Link
                  key={item.id}
                  to={item.path}
                  title={item.label}
                  className={`
                    flex items-center gap-3 px-3 py-2.5 rounded-button text-body-sm font-medium
                    transition-all duration-200
                    ${
                      isActive
                        ? "bg-accent-gold/15 text-accent-gold font-semibold shadow-sm border border-accent-gold/30"
                        : "text-text-muted hover:text-text-primary hover:bg-base/60"
                    }
                  `}
                >
                  <span className="shrink-0">{item.icon}</span>
                  <span className="hidden lg:inline">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Sidebar Mini Passport badge for Large screens */}
          <div className="hidden lg:block mt-8 pt-4 border-t border-border-subtle">
            <div className="p-3 rounded-lg bg-base border border-border-subtle text-xs space-y-2">
              <div className="flex items-center gap-1.5 text-accent-gold font-semibold font-mono">
                <Sparkles className="w-3.5 h-3.5" /> PASSPORT ACTIVE
              </div>
              <p className="text-text-muted text-[11px] leading-snug">
                Tier: <strong className="text-text-primary capitalize">{user?.role?.toLowerCase() || "Student"}</strong>
              </p>
              <div className="w-full bg-border-subtle h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-accent-gold h-full rounded-full transition-all duration-500"
                  style={{ width: `${completeness}%` }}
                />
              </div>
              <span className="text-[10px] text-text-muted">{completeness}% Complete</span>
            </div>
          </div>
        </aside>

        {/* ─── MAIN DASHBOARD CONTENT AREA ─────────────────────────── */}
        <main className="flex-1 w-full space-y-8">
          {/* 1. Header Greeting & Quick Stats */}
          <header className="bg-card border border-border-subtle rounded-card p-6 sm:p-8 shadow-[var(--shadow-card)] theme-transition relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-accent-gold/5 rounded-full blur-3xl pointer-events-none -z-0" />

            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-gold/10 border border-accent-gold/20 text-accent-gold text-xs font-semibold uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5" />
                  Career Passport Dashboard
                </div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold text-text-primary">
                  Welcome back, {user?.name || "Explorer"}!
                </h1>
                <p className="text-body-sm text-text-muted">
                  Logged in as <span className="font-semibold text-text-primary">{user?.email}</span> •{" "}
                  <span className="px-2 py-0.5 rounded bg-accent-gold/15 text-accent-gold font-semibold uppercase text-xs">
                    {user?.role || "STUDENT"}
                  </span>
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <Link to="/quiz">
                  <PrimaryButton size="md">
                    <BrainCircuit className="w-4 h-4 mr-1" /> Take Quiz
                  </PrimaryButton>
                </Link>
                <Link to="/profile">
                  <GoldOutlineButton size="md">
                    <UserIcon className="w-4 h-4 mr-1" /> Edit Profile
                  </GoldOutlineButton>
                </Link>
              </div>
            </div>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-6 border-t border-border-subtle">
              <div className="p-3 rounded-lg bg-base border border-border-subtle">
                <p className="text-xs text-text-muted font-medium">Passport Status</p>
                <p className="text-xl font-bold font-display text-accent-gold mt-0.5">{completeness}%</p>
                <p className="text-[11px] text-text-muted">Profile Complete</p>
              </div>

              <div className="p-3 rounded-lg bg-base border border-border-subtle">
                <p className="text-xs text-text-muted font-medium">Assessments</p>
                <p className="text-xl font-bold font-display text-text-primary mt-0.5">{quizHistory.length}</p>
                <p className="text-[11px] text-text-muted">Quizzes Completed</p>
              </div>

              <div className="p-3 rounded-lg bg-base border border-border-subtle">
                <p className="text-xs text-text-muted font-medium">Saved Items</p>
                <p className="text-xl font-bold font-display text-text-primary mt-0.5">{bookmarks.length}</p>
                <p className="text-[11px] text-text-muted">Active Bookmarks</p>
              </div>

              <div className="p-3 rounded-lg bg-base border border-border-subtle">
                <p className="text-xs text-text-muted font-medium">Resume File</p>
                <p className="text-sm font-semibold text-emerald-500 flex items-center gap-1 mt-1.5">
                  {profileData?.resumeUrl ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 shrink-0" /> Uploaded
                    </>
                  ) : (
                    <span className="text-text-muted font-normal">Not uploaded</span>
                  )}
                </p>
                <p className="text-[11px] text-text-muted">PDF / Word</p>
              </div>
            </div>
          </header>

          {/* 2. Main 2-Column Grid: Left Column (Passport & Quiz) + Right Column (Bookmarks & Trending) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column (7 cols) */}
            <div className="lg:col-span-7 space-y-8">
              {/* Widget: Passport Profile Summary */}
              <section className="bg-card border border-border-subtle rounded-card p-6 shadow-[var(--shadow-card)] space-y-4 theme-transition">
                <div className="flex items-center justify-between border-b border-border-subtle pb-3">
                  <div className="flex items-center gap-2 text-heading-3 font-heading">
                    <UserIcon className="w-5 h-5 text-accent-gold" />
                    <h2>Career Passport Summary</h2>
                  </div>
                  <Link to="/profile" className="text-caption font-semibold text-accent-gold hover:underline flex items-center gap-1">
                    Manage <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

                <div className="space-y-3 text-body-sm">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <span className="text-caption text-text-muted block">Education Level</span>
                      <span className="font-semibold text-text-primary">
                        {profileData?.educationLevel || "Not specified"}
                      </span>
                    </div>
                    <div>
                      <span className="text-caption text-text-muted block">Field of Study</span>
                      <span className="font-semibold text-text-primary">
                        {profileData?.fieldOfStudy || "Not specified"}
                      </span>
                    </div>
                    <div>
                      <span className="text-caption text-text-muted block">Institution</span>
                      <span className="font-semibold text-text-primary">
                        {profileData?.institution || "Not specified"}
                      </span>
                    </div>
                    <div>
                      <span className="text-caption text-text-muted block">Current Role / Target</span>
                      <span className="font-semibold text-text-primary">
                        {profileData?.currentRole || "Career Explorer"}
                      </span>
                    </div>
                  </div>

                  {/* Skills tags */}
                  <div className="pt-2">
                    <span className="text-caption text-text-muted block mb-2">Verified Skills</span>
                    {profileData?.skills && profileData.skills.length > 0 ? (
                      <div className="flex flex-wrap gap-1.5">
                        {profileData.skills.map((skill, idx) => (
                          <span
                            key={idx}
                            className="text-xs px-2.5 py-1 rounded-full bg-accent-gold/10 text-accent-gold border border-accent-gold/20"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <div className="p-3 rounded-lg bg-base border border-dashed border-border-subtle text-text-muted text-xs flex items-center justify-between">
                        <span>No skills added yet. Add your core competencies.</span>
                        <Link to="/profile">
                          <GoldOutlineButton size="sm">Add Skills</GoldOutlineButton>
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              </section>

              {/* Widget: Latest Aptitude Assessment */}
              <section className="bg-card border border-border-subtle rounded-card p-6 shadow-[var(--shadow-card)] space-y-4 theme-transition">
                <div className="flex items-center justify-between border-b border-border-subtle pb-3">
                  <div className="flex items-center gap-2 text-heading-3 font-heading">
                    <BrainCircuit className="w-5 h-5 text-accent-gold" />
                    <h2>Aptitude Assessment</h2>
                  </div>
                  <Link to="/quiz" className="text-caption font-semibold text-accent-gold hover:underline flex items-center gap-1">
                    Take Quiz <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

                {latestQuiz ? (
                  <div className="space-y-4">
                    <div className="p-4 rounded-xl bg-base border border-border-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="space-y-1">
                        <span className="text-caption text-accent-gold font-semibold uppercase tracking-wider">
                          Latest Attempt
                        </span>
                        <h3 className="text-body-base font-semibold text-text-primary">
                          {latestQuiz.quizTitle || "Comprehensive Assessment"}
                        </h3>
                        <p className="text-caption text-text-muted flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {new Date(latestQuiz.completedAt).toLocaleDateString(undefined, {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </p>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <p className="text-2xl font-bold font-display text-accent-gold">
                            {latestQuiz.score}
                            <span className="text-xs text-text-muted font-normal"> pts</span>
                          </p>
                          <span className="text-[11px] text-emerald-500 font-semibold flex items-center justify-end gap-1">
                            <CheckCircle2 className="w-3 h-3" /> Evaluated
                          </span>
                        </div>
                        <Link to={`/quiz/results/${latestQuiz.id}`}>
                          <GoldOutlineButton size="sm">Report</GoldOutlineButton>
                        </Link>
                      </div>
                    </div>

                    {quizHistory.length > 1 && (
                      <p className="text-caption text-text-muted text-right">
                        + {quizHistory.length - 1} previous assessment attempt(s) saved in history
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="p-6 rounded-xl bg-base border border-dashed border-border-subtle text-center space-y-3">
                    <div className="w-12 h-12 mx-auto rounded-full bg-accent-gold/10 text-accent-gold flex items-center justify-center">
                      <BrainCircuit className="w-6 h-6" />
                    </div>
                    <h3 className="text-body-base font-semibold text-text-primary">
                      No Aptitude Assessments Taken Yet
                    </h3>
                    <p className="text-body-sm text-text-muted max-w-sm mx-auto">
                      Discover your psychological profile, technical strengths, and matched career trajectories by taking your first quiz.
                    </p>
                    <Link to="/quiz" className="inline-block pt-1">
                      <PrimaryButton size="sm">
                        Start Aptitude Quiz <ArrowRight className="w-3.5 h-3.5 ml-1" />
                      </PrimaryButton>
                    </Link>
                  </div>
                )}
              </section>
            </div>

            {/* Right Column (5 cols) */}
            <div className="lg:col-span-5 space-y-8">
              {/* Widget: Saved Bookmarks Preview */}
              <section className="bg-card border border-border-subtle rounded-card p-6 shadow-[var(--shadow-card)] space-y-4 theme-transition">
                <div className="flex items-center justify-between border-b border-border-subtle pb-3">
                  <div className="flex items-center gap-2 text-heading-3 font-heading">
                    <BookmarkIcon className="w-5 h-5 text-accent-gold" />
                    <h2>Saved Bookmarks</h2>
                  </div>
                  <Link to="/bookmarks" className="text-caption font-semibold text-accent-gold hover:underline flex items-center gap-1">
                    All ({bookmarks.length}) <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

                {bookmarks.length > 0 ? (
                  <div className="space-y-2.5">
                    {bookmarks.map((b) => (
                      <div
                        key={b.id}
                        onClick={() => {
                          if (b.itemType === "CAREER") navigate(`/careers/${b.itemId}`);
                          else if (b.itemType === "MEDIA") navigate(`/media/${b.itemId}`);
                          else if (b.itemType === "RESOURCE") navigate(`/resources`);
                          else if (b.itemType === "STORY") navigate(`/stories`);
                        }}
                        className="
                          p-3 rounded-lg bg-base border border-border-subtle hover:border-accent-gold/40
                          transition-all duration-200 cursor-pointer flex items-center justify-between gap-3 group
                        "
                      >
                        <div className="space-y-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-accent-gold/15 text-accent-gold uppercase font-mono">
                              {b.itemType}
                            </span>
                            <span className="text-caption text-text-muted">
                              {new Date(b.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-body-sm font-semibold text-text-primary truncate group-hover:text-accent-gold transition-colors">
                            {b.title}
                          </p>
                        </div>
                        <ArrowRight className="w-4 h-4 text-text-muted group-hover:text-accent-gold transition-colors shrink-0" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-6 rounded-xl bg-base border border-dashed border-border-subtle text-center space-y-3">
                    <div className="w-10 h-10 mx-auto rounded-full bg-accent-gold/10 text-accent-gold flex items-center justify-center">
                      <BookmarkIcon className="w-5 h-5" />
                    </div>
                    <p className="text-body-sm font-medium text-text-primary">
                      No bookmarks saved yet
                    </p>
                    <p className="text-caption text-text-muted">
                      Save interesting careers, guides, and stories as you explore to access them quickly here.
                    </p>
                    <Link to="/careers" className="inline-block pt-1">
                      <GoldOutlineButton size="sm">Explore Careers</GoldOutlineButton>
                    </Link>
                  </div>
                )}
              </section>

              {/* Widget: High Growth Top Picks */}
              <section className="bg-card border border-border-subtle rounded-card p-6 shadow-[var(--shadow-card)] space-y-4 theme-transition">
                <div className="flex items-center justify-between border-b border-border-subtle pb-3">
                  <div className="flex items-center gap-2 text-heading-3 font-heading">
                    <TrendingUp className="w-5 h-5 text-accent-gold" />
                    <h2>Top Picks for You</h2>
                  </div>
                  <Link to="/careers" className="text-caption font-semibold text-accent-gold hover:underline flex items-center gap-1">
                    Career Bank <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

                <div className="space-y-3">
                  {trendingCareers.length > 0 ? (
                    trendingCareers.map((c) => (
                      <div
                        key={c.id}
                        onClick={() => navigate(`/careers/${c.id}`)}
                        className="
                          p-3.5 rounded-xl bg-base border border-border-subtle hover:border-accent-gold/50
                          transition-all duration-200 cursor-pointer space-y-1.5 group
                        "
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-caption font-semibold px-2 py-0.5 rounded bg-accent-gold/10 text-accent-gold">
                            {c.domain}
                          </span>
                          <span className="text-caption font-bold text-emerald-500 uppercase">
                            {c.demand} DEMAND
                          </span>
                        </div>
                        <h3 className="text-body-sm font-semibold text-text-primary group-hover:text-accent-gold transition-colors">
                          {c.title}
                        </h3>
                        <p className="text-caption text-text-muted">
                          Salary: ${Math.round(c.salaryMin / 1000)}k – ${Math.round(c.salaryMax / 1000)}k / yr
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="text-caption text-text-muted text-center py-4">No top picks currently available.</p>
                  )}
                </div>
              </section>
            </div>
          </div>
        </main>
      </div>

      {/* ─── MOBILE BOTTOM NAVIGATION BAR (< md screens) ─────────── */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-card/95 backdrop-blur-md border-t border-border-subtle px-4 py-2 flex items-center justify-around text-center shadow-lg">
        {navItems.slice(0, 5).map((item) => {
          const isActive = item.id === activeTab;
          return (
            <Link
              key={item.id}
              to={item.path}
              className={`flex flex-col items-center gap-0.5 py-1 px-2 text-[10px] font-medium transition-colors ${
                isActive ? "text-accent-gold font-bold" : "text-text-muted hover:text-text-primary"
              }`}
            >
              <span>{item.icon}</span>
              <span>{item.label.split(" ")[0]}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
