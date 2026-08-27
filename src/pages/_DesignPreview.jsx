import { useState } from "react";
import { Briefcase, Code, Palette, BarChart3, Heart, Rocket } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { useFontSize } from "../context/FontSizeContext";
import ThemeToggle from "../components/ThemeToggle";
import FontSizeToggle from "../components/FontSizeToggle";
import Breadcrumbs from "../components/Breadcrumbs";
import PrimaryButton from "../components/ui/PrimaryButton";
import GoldOutlineButton from "../components/ui/GoldOutlineButton";
import CareerCard from "../components/ui/CareerCard";
import TextField from "../components/ui/TextField";

export default function DesignPreview() {
  const { theme } = useTheme();
  const { fontSize } = useFontSize();
  const [formValues, setFormValues] = useState({
    name: "",
    email: "",
    errorDemo: "bad-value",
  });

  const handleChange = (e) => {
    setFormValues((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="container-app py-8 space-y-12">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border-subtle">
        <div>
          <h1 className="text-heading-1 font-display text-accent-gold">
            PathSeeker Design System Preview
          </h1>
          <p className="text-body-sm text-text-muted mt-1">
            Foundation tokens, type scale, core UI components, and theme verification (Phase FD-1).
          </p>
        </div>
      </div>

      {/* Status Banner */}
      <div className="bg-card border border-border-subtle rounded-card p-4 flex flex-wrap items-center gap-4 text-body-sm theme-transition">
        <span>
          <strong>Theme:</strong>{" "}
          <span className="text-accent-gold font-semibold uppercase">{theme}</span>
        </span>
        <span>
          <strong>Font Size:</strong>{" "}
          <span className="text-accent-gold font-semibold uppercase">{fontSize}</span>
        </span>
        <span className="text-text-muted">
          Toggle controls above to test persistence across refresh.
        </span>
      </div>

      {/* ─── Section 1: Typography Scale ─────────────────────────── */}
      <section>
        <h2 className="text-heading-2 font-heading mb-6 pb-2 border-b border-border-subtle">
          Typography Scale
        </h2>
        <div className="space-y-4 bg-card rounded-card p-6 border border-border-subtle theme-transition">
          <p className="text-display-xl font-display">Display XL — 3.5rem</p>
          <p className="text-display-lg font-display">Display LG — 2.75rem</p>
          <p className="text-heading-1 font-display">Heading 1 — 2.25rem</p>
          <p className="text-heading-2 font-display">Heading 2 — 1.75rem</p>
          <p className="text-heading-3 font-display">Heading 3 — 1.375rem</p>
          <p className="text-body-lg">Body Large — 1.125rem (Inter)</p>
          <p className="text-body-base">Body Base — 1rem (Inter)</p>
          <p className="text-body-sm">Body Small — 0.875rem (Inter)</p>
          <p className="text-caption text-text-muted">Caption — 0.75rem muted</p>
        </div>
      </section>

      {/* ─── Section 2: Color Tokens ─────────────────────────────── */}
      <section>
        <h2 className="text-heading-2 font-heading mb-6 pb-2 border-b border-border-subtle">
          Color Tokens
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
          {[
            { name: "bg-base", cls: "bg-base border border-border-subtle" },
            { name: "bg-card", cls: "bg-card border border-border-subtle" },
            { name: "text-primary", cls: "bg-text-primary" },
            { name: "text-muted", cls: "bg-text-muted" },
            { name: "border-subtle", cls: "bg-border-subtle" },
            { name: "accent-gold", cls: "bg-accent-gold" },
          ].map((token) => (
            <div key={token.name} className="flex flex-col items-center gap-2">
              <div className={`w-16 h-16 rounded-lg ${token.cls} theme-transition`} />
              <span className="text-caption text-text-muted">{token.name}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Section 3: Breadcrumbs ──────────────────────────────── */}
      <section>
        <h2 className="text-heading-2 font-heading mb-6 pb-2 border-b border-border-subtle">
          Breadcrumbs
        </h2>
        <div className="bg-card rounded-card p-6 border border-border-subtle space-y-4 theme-transition">
          <Breadcrumbs
            items={[
              { label: "Home", path: "/" },
              { label: "Career Bank", path: "/careers" },
              { label: "Full Stack Engineer" },
            ]}
          />
          <Breadcrumbs
            items={[
              { label: "Home", path: "/" },
              { label: "Resources" },
            ]}
          />
          <Breadcrumbs
            items={[
              { label: "Home", path: "/" },
              { label: "Quiz", path: "/quiz" },
              { label: "Results", path: "/quiz/results/1" },
              { label: "Career Recommendations" },
            ]}
          />
        </div>
      </section>

      {/* ─── Section 4: Buttons ──────────────────────────────────── */}
      <section>
        <h2 className="text-heading-2 font-heading mb-6 pb-2 border-b border-border-subtle">
          Buttons
        </h2>
        <div className="bg-card rounded-card p-6 border border-border-subtle space-y-6 theme-transition">
          {/* Primary */}
          <div>
            <h3 className="text-heading-3 mb-4">PrimaryButton</h3>
            <div className="flex flex-wrap items-center gap-4">
              <PrimaryButton size="sm">Small</PrimaryButton>
              <PrimaryButton size="md">Medium</PrimaryButton>
              <PrimaryButton size="lg">Large</PrimaryButton>
              <PrimaryButton disabled>Disabled</PrimaryButton>
            </div>
          </div>

          {/* Gold Outline */}
          <div>
            <h3 className="text-heading-3 mb-4">GoldOutlineButton</h3>
            <div className="flex flex-wrap items-center gap-4">
              <GoldOutlineButton size="sm">Small</GoldOutlineButton>
              <GoldOutlineButton size="md">Medium</GoldOutlineButton>
              <GoldOutlineButton size="lg">Large</GoldOutlineButton>
              <GoldOutlineButton disabled>Disabled</GoldOutlineButton>
            </div>
          </div>

          {/* With Icons */}
          <div>
            <h3 className="text-heading-3 mb-4">Buttons with Icons</h3>
            <div className="flex flex-wrap items-center gap-4">
              <PrimaryButton>
                <Rocket className="w-4 h-4" /> Explore Careers
              </PrimaryButton>
              <GoldOutlineButton>
                <Heart className="w-4 h-4" /> Save Bookmark
              </GoldOutlineButton>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Section 5: Career Cards ─────────────────────────────── */}
      <section>
        <h2 className="text-heading-2 font-heading mb-6 pb-2 border-b border-border-subtle">
          CareerCard
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <CareerCard
            title="Full Stack Engineer"
            description="Build modern web applications using React, Node.js, and cloud services. High demand across tech, fintech, and SaaS industries."
            icon={<Code className="w-5 h-5" />}
            footer={
              <div className="flex items-center justify-between text-body-sm">
                <span className="text-accent-gold font-semibold">$70k – $135k</span>
                <span className="text-text-muted">High Demand</span>
              </div>
            }
            onClick={() => {}}
          />
          <CareerCard
            title="UI/UX Product Designer"
            description="Create user-centered digital experiences through research, wireframing, prototyping, and visual design with tools like Figma."
            icon={<Palette className="w-5 h-5" />}
            footer={
              <div className="flex items-center justify-between text-body-sm">
                <span className="text-accent-gold font-semibold">$60k – $115k</span>
                <span className="text-text-muted">High Demand</span>
              </div>
            }
            onClick={() => {}}
          />
          <CareerCard
            title="Data Scientist & ML Engineer"
            description="Leverage machine learning, statistical modeling, and big data to extract insights and build intelligent systems."
            icon={<BarChart3 className="w-5 h-5" />}
            footer={
              <div className="flex items-center justify-between text-body-sm">
                <span className="text-accent-gold font-semibold">$85k – $155k</span>
                <span className="text-text-muted">High Demand</span>
              </div>
            }
            onClick={() => {}}
          />
          {/* Card without onClick (non-interactive) */}
          <CareerCard
            title="Technical Product Manager"
            description="Bridge the gap between engineering and business by defining product strategy, managing roadmaps, and aligning cross-functional teams."
            icon={<Briefcase className="w-5 h-5" />}
            footer={
              <div className="flex items-center justify-between text-body-sm">
                <span className="text-accent-gold font-semibold">$90k – $160k</span>
                <span className="text-text-muted">High Demand</span>
              </div>
            }
          />
        </div>
      </section>

      {/* ─── Section 6: Text Fields ──────────────────────────────── */}
      <section>
        <h2 className="text-heading-2 font-heading mb-6 pb-2 border-b border-border-subtle">
          TextField
        </h2>
        <div className="bg-card rounded-card p-6 border border-border-subtle theme-transition">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl">
            <TextField
              label="Full Name"
              name="name"
              placeholder="Enter your name"
              value={formValues.name}
              onChange={handleChange}
              required
            />
            <TextField
              label="Email Address"
              name="email"
              type="email"
              placeholder="you@example.com"
              value={formValues.email}
              onChange={handleChange}
              required
            />
            <TextField
              label="With Error"
              name="errorDemo"
              value={formValues.errorDemo}
              onChange={handleChange}
              error="This field has a validation error"
            />
            <TextField
              label="Disabled Field"
              name="disabled"
              value="Cannot edit this"
              onChange={() => {}}
              disabled
            />
          </div>
        </div>
      </section>

      {/* ─── Section 7: Accessibility Controls ───────────────────── */}
      <section>
        <h2 className="text-heading-2 font-heading mb-6 pb-2 border-b border-border-subtle">
          Accessibility Controls
        </h2>
        <div className="bg-card rounded-card p-6 border border-border-subtle space-y-6 theme-transition">
          <div>
            <h3 className="text-heading-3 mb-3">Theme Toggle</h3>
            <p className="text-body-sm text-text-muted mb-3">
              Click to switch between light and dark mode. The preference persists in localStorage.
            </p>
            <ThemeToggle />
          </div>
          <div>
            <h3 className="text-heading-3 mb-3">Font Size Toggle</h3>
            <p className="text-body-sm text-text-muted mb-3">
              Click to cycle through Small (14px) → Medium (16px) → Large (18px). The preference persists in localStorage.
            </p>
            <FontSizeToggle />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center text-body-sm text-text-muted py-8 border-t border-border-subtle">
        <p>PathSeeker Design System Preview — Phase FD-1</p>
        <p className="mt-1">This page is for internal verification only.</p>
      </footer>
    </div>
  );
}
