/**
 * GoldOutlineButton — Transparent button with gold border and high-contrast text.
 * In Light Mode: crisp dark text with gold border.
 * In Dark Mode: luminous gold text with gold border.
 * Fills gold on hover.
 */
export default function GoldOutlineButton({
  children,
  onClick,
  disabled = false,
  type = "button",
  size = "md",
  className = "",
  ...rest
}) {
  const sizeClasses = {
    sm: "px-4 py-1.5 text-base tracking-wider",
    md: "px-6 py-2 text-lg tracking-wider",
    lg: "px-8 py-2.5 text-xl tracking-wider",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        inline-flex items-center justify-center gap-2
        ${sizeClasses[size] || sizeClasses.md}
        font-display uppercase leading-none
        bg-transparent
        text-text-primary dark:text-accent-gold
        border-2 border-accent-gold
        rounded-button
        hover:bg-accent-gold hover:text-navy-900 dark:hover:bg-accent-gold dark:hover:text-navy-900
        active:scale-[0.98]
        focus-visible:ring-2 focus-visible:ring-accent-gold focus-visible:ring-offset-2
        focus-visible:ring-offset-base
        disabled:opacity-50 disabled:cursor-not-allowed
        disabled:hover:bg-transparent disabled:hover:text-text-primary
        disabled:active:scale-100
        transition-all duration-200 ease-out
        cursor-pointer
        ${className}
      `.trim()}
      {...rest}
    >
      {children}
    </button>
  );
}
