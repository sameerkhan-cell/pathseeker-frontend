import React from "react";

/**
 * CareerCard — Versatile card component for careers, media, resources, stories.
 * Refined with subtle GPU-accelerated hover lift, scale, gold-glow shadow,
 * and rotating stamp accent.
 *
 * Props:
 * - title: string (card heading)
 * - description: string (body text, auto-clamped to 3 lines)
 * - icon: React node (optional icon/illustration rendered top-left)
 * - footer: React node (optional slot rendered at bottom — tags, buttons, etc.)
 * - onClick: click handler (makes card interactive)
 * - className: extra Tailwind classes
 */
export default function CareerCard({
  title,
  description,
  icon,
  footer,
  onClick,
  className = "",
}) {
  const Component = onClick ? "button" : "div";

  return (
    <Component
      onClick={onClick}
      type={onClick ? "button" : undefined}
      className={`
        group
        relative flex flex-col
        w-full text-left
        bg-card
        border border-border-subtle
        rounded-2xl
        p-5 sm:p-6
        shadow-card
        hover:shadow-card-hover hover:shadow-gold-glow
        hover:border-accent-gold/50
        hover:-translate-y-1.5 hover:scale-[1.015]
        transition-all duration-300 ease-out
        theme-transition
        overflow-hidden
        ${onClick ? "cursor-pointer" : ""}
        ${className}
      `.trim()}
    >
      {/* Icon + Title row */}
      <div className="flex items-start gap-3 mb-3">
        {icon && (
          <span className="shrink-0 flex items-center justify-center w-10 h-10 rounded-xl bg-accent-gold/10 text-accent-gold border border-accent-gold/20 group-hover:scale-110 group-hover:rotate-3 group-hover:bg-accent-gold/20 transition-all duration-300">
            {icon}
          </span>
        )}
        <h3 className="text-lg sm:text-xl font-display text-text-primary group-hover:text-accent-gold transition-colors duration-200 leading-snug">
          {title}
        </h3>
      </div>

      {/* Description */}
      {description && (
        <p className="text-body-sm text-text-muted line-clamp-3 mb-4 flex-1 leading-relaxed">
          {description}
        </p>
      )}

      {/* Footer slot */}
      {footer && (
        <div className="mt-auto pt-4 border-t border-border-subtle/70">
          {footer}
        </div>
      )}

      {/* Subtle gold accent line expanding on hover */}
      <span
        className="
          absolute bottom-0 left-0 right-0 h-[2.5px]
          bg-gradient-to-r from-accent-gold via-accent-gold-glow to-accent-gold
          scale-x-0 group-hover:scale-x-100
          transition-transform duration-300 ease-out origin-left
        "
        aria-hidden="true"
      />
    </Component>
  );
}
