"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_LINKS } from "@/constants/nav";
import { SITE_NAME, SITE_VERSION } from "@/constants/site";
import { cn } from "@/utils/cn";

export function Nav() {
  const pathname = usePathname();

  return (
    <nav className="sticky top-0 z-50 flex items-center justify-between px-12 py-[0.85rem] border-b-[0.5px] border-white/[0.08] bg-[--bg]">
      {/* Left — name */}
      <span className="text-[15px] font-medium text-[--accent]">
        {SITE_NAME}
      </span>

      <div className="flex">
        {NAV_LINKS.map((link, index) => {
          const isActive = pathname === link.href;
          const isLast = index === NAV_LINKS.length - 1;

          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "inline-flex items-center font-mono text-[12px] px-[16px] py-[4px] transition-colors duration-[150ms]",
                "[border-left:0.5px_solid_rgba(175,169,236,0.07)]",
                isLast && "[border-right:0.5px_solid_rgba(175,169,236,0.07)]",
                isActive
                  ? "text-[--accent] bg-[rgba(175,169,236,0.05)]"
                  : "text-[--text-dim] hover:text-[--text-muted]",
              )}
            >
              {link.label}
            </Link>
          );
        })}
      </div>

      {/* Right — version */}
      <span className="font-mono text-[11px] text-[--accent-ghost]">
        {SITE_VERSION}
      </span>
    </nav>
  );
}
