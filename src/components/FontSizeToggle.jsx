import { ALargeSmall } from "lucide-react";
import { useFontSize } from "../context/FontSizeContext";

const SIZE_LABELS = {
  small: "Small (14px)",
  medium: "Medium (16px)",
  large: "Large (18px)",
};

export default function FontSizeToggle() {
  const { fontSize, cycleFontSize } = useFontSize();

  return (
    <button
      onClick={cycleFontSize}
      aria-label={`Font size: ${SIZE_LABELS[fontSize]}. Click to cycle.`}
      title={`Font size: ${SIZE_LABELS[fontSize]}`}
      className="
        inline-flex items-center justify-center gap-1.5
        h-11 min-h-[44px] px-3 min-w-[44px]
        rounded-full
        bg-card border border-border-subtle
        text-text-primary
        hover:bg-accent-gold hover:text-navy-900
        active:scale-95
        theme-transition
        cursor-pointer
        text-body-sm font-medium
      "
    >
      <ALargeSmall className="w-5 h-5 shrink-0" strokeWidth={2} />
      <span className="hidden sm:inline uppercase tracking-wide">
        {fontSize.charAt(0).toUpperCase()}
      </span>
    </button>
  );
}
