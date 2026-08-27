import React from "react";

/**
 * BrandLogo — Adaptive logo component
 * Automatically switches between:
 * - Light / Saadi Theme: /brand/only-logo.jpg.jpeg
 * - Dark Theme: /brand/only-logo-1.jpg.jpeg
 *
 * Props:
 * - className: size and container wrapper classes
 * - imgClassName: additional classes for the <img> elements
 */
export default function BrandLogo({ 
  className = "w-10 h-10", 
  imgClassName = "",
  rounded = "rounded-xl",
  border = true
}) {
  return (
    <div 
      className={`
        relative flex-shrink-0 flex items-center justify-center overflow-hidden
        ${rounded}
        ${border ? "border border-accent-gold/30 shadow-sm" : ""}
        ${className}
      `.trim()}
    >
      {/* Light / Saadi Theme Logo */}
      <img
        src="/brand/only-logo.jpg.jpeg"
        alt="PathSeeker"
        className={`w-full h-full object-cover block dark:hidden select-none pointer-events-none ${imgClassName}`}
        draggable={false}
        loading="eager"
      />
      
      {/* Dark Theme Logo */}
      <img
        src="/brand/only-logo-1.jpg.jpeg"
        alt="PathSeeker"
        className={`w-full h-full object-cover hidden dark:block select-none pointer-events-none ${imgClassName}`}
        draggable={false}
        loading="eager"
      />
    </div>
  );
}
