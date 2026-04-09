import Link from "next/link";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { SITE_NAME, SITE_YEAR, SOCIAL_LINKS } from "@/constants/site";

const ICON_LINK_CLASSES =
  "flex items-center justify-center w-7 h-7 rounded-md border-[0.5px] border-white/[0.10] text-(--text-dim) transition-colors duration-150 hover:text-(--accent) hover:border-white/[0.28]";

export function Footer() {
  return (
    <footer className="bottom-0 flex items-center justify-between px-12 py-4 border-t-[0.5px] border-white/[0.06] bg-[rgba(10,9,20,0.6)] backdrop-blur-md">
      {/* Left — credit */}
      <span className="font-mono text-[11px] text-(--accent-ghost)">
        // built by {SITE_NAME} · {SITE_YEAR}
      </span>

      {/* Right — social icons */}
      <div className="flex items-center gap-3">
        <Link
          href={SOCIAL_LINKS.GitHub}
          target="_blank"
          rel="noopener noreferrer"
          className={ICON_LINK_CLASSES}
          title="GitHub"
          aria-label="GitHub profile"
        >
          <FaGithub size={14} />
        </Link>
        <Link
          href={SOCIAL_LINKS.LinkedIn}
          target="_blank"
          rel="noopener noreferrer"
          className={ICON_LINK_CLASSES}
          title="LinkedIn"
          aria-label="LinkedIn profile"
        >
          <FaLinkedin size={14} />
        </Link>
        <Link
          href={SOCIAL_LINKS.Email}
          className={ICON_LINK_CLASSES}
          title="Email"
          aria-label="Send email"
        >
          <MdEmail size={14} />
        </Link>
      </div>
    </footer>
  );
}
