/**
 * TopBar — Shared top navigation bar
 * Used across all pages with contextual right-slot content.
 */

import Link from "next/link";

interface TopBarProps {
  /** Page title or breadcrumb shown center/left */
  title?: string;
  /** Optional subtitle/badge */
  subtitle?: string;
  /** Right-side action slot */
  actions?: React.ReactNode;
}

export function TopBar({ title, subtitle, actions }: TopBarProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-16 flex items-center justify-between px-8 bg-surface-container-lowest/80 backdrop-blur-xl border-b border-outline-variant/10">
      {/* Brand */}
      <div className="flex items-center gap-6">
        <Link href="/" className="flex items-center gap-2">
          <span className="font-headline font-extrabold text-xl tracking-tighter text-on-surface">
            LEAD
          </span>
          <span className="font-headline font-light text-xl tracking-wide text-primary">
            Design
          </span>
        </Link>

        {title && (
          <>
            <div className="w-px h-5 bg-outline-variant/40" />
            <div className="flex items-center gap-2">
              <span className="font-body font-semibold text-sm text-on-surface">
                {title}
              </span>
              {subtitle && (
                <span className="px-2 py-0.5 bg-surface-container-highest text-[10px] font-bold rounded-md text-on-surface-variant uppercase tracking-wider">
                  {subtitle}
                </span>
              )}
            </div>
          </>
        )}
      </div>

      {/* Actions slot */}
      <div className="flex items-center gap-3">{actions}</div>
    </header>
  );
}
