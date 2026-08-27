import React from "react";

/**
 * StatusBadge — Reusable color-coded token badge for Admin tables & cards.
 * Provides guaranteed visual consistency across all 7 admin modules.
 */
export default function StatusBadge({ status, label, className = "" }) {
  const normalized = (status || label || "").toString().toUpperCase();
  const displayLabel = label || status || "N/A";

  let colorClasses = "bg-border-subtle/40 text-text-muted border-border-subtle";

  // Constructive / Active / Published / Approved / Resolved
  if (
    normalized === "ACTIVE" ||
    normalized === "TRUE" ||
    normalized === "PUBLISHED" ||
    normalized === "APPROVED" ||
    normalized === "RESOLVED"
  ) {
    colorClasses = "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30";
  }
  // Pending / In Progress / Medium Demand / Checklist / Podcast
  else if (
    normalized === "PENDING" ||
    normalized === "IN_PROGRESS" ||
    normalized === "IN PROGRESS" ||
    normalized === "MEDIUM" ||
    normalized === "PODCAST" ||
    normalized === "CHECKLIST"
  ) {
    colorClasses = "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30";
  }
  // High Demand / Bug / Video / Important / Admin
  else if (
    normalized === "HIGH" ||
    normalized === "BUG" ||
    normalized === "VIDEO" ||
    normalized === "ADMIN" ||
    normalized === "PDF"
  ) {
    colorClasses = "bg-accent-gold/15 text-accent-gold-deep dark:text-accent-gold border-accent-gold/40";
  }
  // Inactive / Draft / Low / Rejected / Suggestion
  else if (
    normalized === "INACTIVE" ||
    normalized === "FALSE" ||
    normalized === "DRAFT" ||
    normalized === "LOW"
  ) {
    colorClasses = "bg-text-muted/10 text-text-muted border-border-subtle/60";
  }
  // Destructive / Rejected / Error
  else if (
    normalized === "REJECTED" ||
    normalized === "CLOSED" ||
    normalized === "ERROR"
  ) {
    colorClasses = "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30";
  }
  // Query / Infographic / Info
  else if (
    normalized === "QUERY" ||
    normalized === "INFOGRAPHIC" ||
    normalized === "STUDENT" ||
    normalized === "GRADUATE" ||
    normalized === "PROFESSIONAL"
  ) {
    colorClasses = "bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/30";
  }

  return (
    <span
      className={`
        inline-flex items-center gap-1.5
        px-2.5 py-0.5
        rounded-full text-xs font-semibold
        border
        tracking-wide
        ${colorClasses}
        ${className}
      `.trim()}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-80" />
      <span>{displayLabel}</span>
    </span>
  );
}
