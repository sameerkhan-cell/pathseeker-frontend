import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

/**
 * Breadcrumbs — reusable breadcrumb trail component.
 *
 * @param {{ items: Array<{ label: string, path?: string }> }} props
 *   - Last item is rendered as plain text (current page).
 *   - Other items render as links.
 *
 * Example:
 *   <Breadcrumbs items={[
 *     { label: "Home", path: "/" },
 *     { label: "Career Bank", path: "/careers" },
 *     { label: "Full Stack Engineer" }
 *   ]} />
 */
export default function Breadcrumbs({ items = [] }) {
  if (!items.length) return null;

  return (
    <nav aria-label="Breadcrumb" className="mb-4">
      <ol className="flex items-center flex-wrap gap-1 text-body-sm">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li key={index} className="inline-flex items-center gap-1">
              {index > 0 && (
                <ChevronRight
                  className="w-3.5 h-3.5 text-text-muted shrink-0"
                  strokeWidth={2}
                  aria-hidden="true"
                />
              )}
              {isLast || !item.path ? (
                <span
                  className="text-text-primary font-medium"
                  aria-current={isLast ? "page" : undefined}
                >
                  {item.label}
                </span>
              ) : (
                <Link
                  to={item.path}
                  className="text-text-muted hover:text-accent-gold transition-colors"
                >
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
