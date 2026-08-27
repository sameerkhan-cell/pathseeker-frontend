/**
 * PrimaryButton — Navy/deep-blue filled button with gold hover accent.
 *
 * Props:
 * - children: React node
 * - onClick: click handler
 * - disabled: boolean
 * - type: "button" | "submit" | "reset"
 * - size: "sm" | "md" | "lg"
 * - className: extra Tailwind classes
 * - ...rest: forwarded to <button>
 */
export default function PrimaryButton({
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
        bg-navy-800 text-white
        dark:bg-accent-gold dark:text-navy-900
        rounded-button
        border border-transparent
        hover:bg-accent-gold hover:text-navy-900
        dark:hover:bg-white dark:hover:text-navy-900
        active:scale-[0.98]
        focus-visible:ring-2 focus-visible:ring-accent-gold focus-visible:ring-offset-2
        focus-visible:ring-offset-base
        disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-navy-800
        disabled:dark:hover:bg-accent-gold disabled:active:scale-100
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
