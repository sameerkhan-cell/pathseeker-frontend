/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        /* Core token mapping — CSS variable references */
        base: "var(--bg-base)",
        card: "var(--bg-card)",
        "text-primary": "var(--text-primary)",
        "text-muted": "var(--text-muted)",
        "border-subtle": "var(--border-subtle)",
        "accent-gold": "var(--accent-gold)",
        "accent-gold-glow": "var(--accent-gold-glow)",
        "accent-gold-deep": "var(--accent-gold-deep)",
        "accent-gold-badge": "var(--accent-gold-badge)",
        "bg-void": "var(--bg-void)",
        "bg-glass": "var(--bg-glass)",
        /* Navy palette — final dark values */
        navy: {
          700: "#1B2132",
          800: "#1B2132",
          900: "#14151A",
        },
      },
      fontFamily: {
        /* Headings, Hero titles, and Display elements */
        display: ['"DM Serif Display"', "Georgia", "serif"],
        /* Sub-headings, nav links, buttons, labels */
        heading: ['"DM Serif Display"', "Georgia", "serif"],
        serif: ['"DM Serif Display"', "Georgia", "serif"],
        /* Body text, form fields, descriptions — DEFAULT */
        sans: ['"Inter"', "system-ui", "-apple-system", "sans-serif"],
        /* Decorative passport detail only (1-2 spots) */
        mrz: ['"VT323"', "monospace"],
      },
      fontSize: {
        /* Design guide Section 2 type scale */
        "display-xl": ["3.5rem", { lineHeight: "1.1", letterSpacing: "0.04em", fontWeight: "400" }],
        "display-lg": ["2.75rem", { lineHeight: "1.15", letterSpacing: "0.03em", fontWeight: "400" }],
        "heading-1": ["2.25rem", { lineHeight: "1.2", letterSpacing: "0.01em", fontWeight: "400" }],
        "heading-2": ["1.75rem", { lineHeight: "1.25", letterSpacing: "0.01em", fontWeight: "400" }],
        "heading-3": ["1.375rem", { lineHeight: "1.3", fontWeight: "400" }],
        "body-lg": ["1.125rem", { lineHeight: "1.6", fontWeight: "400" }],
        "body-base": ["1rem", { lineHeight: "1.6", fontWeight: "400" }],
        "body-sm": ["0.875rem", { lineHeight: "1.5", fontWeight: "400" }],
        "caption": ["0.75rem", { lineHeight: "1.4", fontWeight: "500" }],
      },
      borderRadius: {
        "card": "1rem",
        "button": "0.625rem",
      },
      boxShadow: {
        "card": "0 2px 12px rgba(0, 0, 0, 0.06)",
        "card-hover": "0 8px 30px rgba(0, 0, 0, 0.12)",
        "card-dark": "0 2px 12px rgba(0, 0, 0, 0.25)",
        "card-dark-hover": "0 8px 30px rgba(0, 0, 0, 0.4)",
        "gold-glow": "0 0 24px rgba(243, 221, 165, 0.25)",
        "gold-glow-lg": "0 0 40px rgba(243, 221, 165, 0.35)",
      },
      transitionDuration: {
        DEFAULT: "200ms",
      },
      animation: {
        "fade-in": "fadeIn 0.3s ease-out",
        "slide-up": "slideUp 0.4s ease-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};
