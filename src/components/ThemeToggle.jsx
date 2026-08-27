import { Sun, Moon } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      onClick={toggleTheme}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className="
        inline-flex items-center justify-center
        w-11 h-11 min-w-[44px] min-h-[44px]
        rounded-full
        bg-card border border-border-subtle
        text-text-primary
        hover:bg-accent-gold hover:text-navy-900
        active:scale-95
        theme-transition
        cursor-pointer
      "
    >
      {isDark ? (
        <Sun className="w-5 h-5" strokeWidth={2} />
      ) : (
        <Moon className="w-5 h-5" strokeWidth={2} />
      )}
    </button>
  );
}
