import Link from "next/link";
import { HiArrowLongLeft } from "react-icons/hi2";

// Next.js convention — `not-found.tsx` must use a default export.
export default function NotFound() {
  return (
    <main className="min-h-[calc(100vh-var(--nav-height))] bg-(--bg) flex flex-col items-center justify-center px-6">
      <p className="font-mono text-[12px] text-(--text-dim) mb-4">
        // route not found
      </p>
      <h1 className="font-mono text-[72px] leading-none text-(--accent) mb-4">
        404
      </h1>
      <p className="text-[14px] text-(--text-body) text-center max-w-sm mb-8">
        This page doesn&apos;t exist, or it may have been moved. Head back home
        and try again.
      </p>
      <Link
        href="/"
        className="inline-flex items-center gap-[6px] font-mono text-[12px] text-(--text-muted) rounded-[6px] [border:var(--border-strong)] hover:[border-color:var(--border-color-hover)] hover:text-(--accent) px-[16px] py-[8px] transition-colors duration-[180ms] ease-linear"
      >
        <HiArrowLongLeft size={14} />
        Back to home
      </Link>
    </main>
  );
}
