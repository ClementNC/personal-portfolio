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
    <nav className="sticky top-0 z-50 flex items-center justify-between px-12 py-[0.85rem] border-b-[0.5px] border-white/[0.08] bg-[rgba(10,9,20,0.6)] backdrop-blur-md">
      {/* Left — name; navigates home or scrolls to top if already there */}
      <Link
        href="/"
        onClick={handleNameClick}
        className="text-[15px] font-medium text-(--accent) hover:opacity-80 transition-opacity duration-150"
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
              className={`inline-flex items-center font-mono text-[12px] px-[16px] py-[4px] transition-colors duration-[150ms] [border-left:0.5px_solid_rgba(175,169,236,0.07)] text-(--text-dim) hover:text-(--accent) hover:bg-[rgba(175,169,236,0.05)] ${isLast ? "[border-right:0.5px_solid_rgba(175,169,236,0.07)]" : ""}`}
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
        className="flex items-center gap-[6px] font-mono text-[12px] px-[12px] py-[4px] rounded-[4px] text-(--text-dim) hover:text-(--accent) hover:bg-[rgba(175,169,236,0.05)] transition-colors duration-[150ms] cursor-pointer"
      >
        <VscTerminal size={13} />
        Terminal
      </button>
    </nav>
  );
}
