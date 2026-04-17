import Link from "next/link";
import { HiArrowLongLeft } from "react-icons/hi2";

// Next.js convention — `not-found.tsx` must use a default export.
export default function NotFound() {
  return (
    <main className="min-h-[calc(100vh-var(--nav-height))] bg-(--bg) flex flex-col items-center justify-center px-6">
      <h1
        className="glitch-text font-inter text-[clamp(96px,16vw,144px)] leading-none text-(--accent) select-none"
        data-text="404"
      >
        404
      </h1>
      <p className="font-mono text-[11px] text-(--text-dim) mt-3 mb-6 tracking-widest uppercase">
        // page_not_found
      </p>
      <p className="text-[14px] text-(--text-body) text-center max-w-85 mb-8 leading-relaxed">
        This page doesn't exist — you might have followed a broken link or
        mistyped the URL.
      </p>
      <div className="flex items-center gap-3">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 font-mono text-[12px] text-(--text-muted) rounded-md [border:var(--border-strong)] hover:border-(--border-color-hover) hover:text-(--accent) px-4 py-2 transition-colors duration-180 ease-linear"
        >
          <HiArrowLongLeft size={14} />
          Back to home
        </Link>
        <Link
          href="/notes"
          className="inline-flex items-center gap-1.5 font-mono text-[12px] text-(--text-muted) rounded-md [border:var(--border-strong)] hover:border-(--border-color-hover) hover:text-(--accent) px-4 py-2 transition-colors duration-180 ease-linear"
        >
          browse notes
        </Link>
      </div>
    </main>
  );
}
