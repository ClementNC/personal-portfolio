"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { VscTerminal } from "react-icons/vsc";
import { NAV_LINKS } from "@/constants/nav";
import { SITE_NAME } from "@/constants/site";
import { useTerminalContext } from "@/context/TerminalContext";

export function Nav() {
  const pathname = usePathname();
  const { openTerminal } = useTerminalContext();

  function handleNameClick() {
    if (pathname === "/") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  return (
    <nav className="sticky top-0 z-50 flex items-center justify-between px-12 h-(--nav-height) border-b-[0.5px] border-white/[0.08] bg-[rgba(10,9,20,0.6)] backdrop-blur-md">
      {/* Left — name; navigates home or scrolls to top if already there */}
      <Link
        href="/"
        onClick={handleNameClick}
        className="text-[16px] font-medium text-(--accent) hover:opacity-80 transition-opacity duration-150"
      >
        {SITE_NAME}
      </Link>

      <div className="flex">
        {NAV_LINKS.map((link, index) => {
          const isLast = index === NAV_LINKS.length - 1;

          return (
            <Link
              key={link.href}
              href={link.href}
              className={`inline-flex items-center font-mono text-[13px] px-4 py-1 transition-colors duration-150 [border-left:var(--border-subtle)] text-(--text-dim) hover:text-(--accent) hover:bg-[rgba(175,169,236,0.05)] ${isLast ? "[border-right:var(--border-subtle)]" : ""}`}
            >
              {link.label}
            </Link>
          );
        })}
      </div>

      {/* Right — terminal button */}
      <button
        onClick={() => openTerminal("panel")}
        aria-label="Open terminal"
        className="flex items-center gap-1.5 font-mono text-[13px] px-3 py-1 rounded-sm text-(--text-dim) hover:text-(--accent) hover:bg-[rgba(175,169,236,0.05)] transition-colors duration-150 cursor-pointer"
      >
        <VscTerminal size={15} />
        Terminal
      </button>
    </nav>
  );
}
