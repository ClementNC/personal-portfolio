"use client";

import { TbSend } from "react-icons/tb";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { SOCIAL_LINKS } from "@/constants/site";
import { useIntersection } from "@/hooks/useIntersection";

export function Contact() {
  const ref = useIntersection<HTMLElement>();

  return (
    <section ref={ref} className="fade-in py-8">
      <SectionHeader title="Contacts" />

      <p className="text-[14px] text-(--text-body) leading-[1.9] max-w-130 mb-6">
        I'm a 4th-year CS student at Waterloo with experience across full-stack,
        DevOps, and distributed systems. I'm currently open to new grad roles
        starting Summer/Fall 2026 — if you think we'd work well together, I'd
        love to hear from you.
      </p>

      <a
        href={`mailto:${SOCIAL_LINKS.Email}`}
        className="inline-flex items-center gap-1.5 font-mono text-[12px] text-(--text-muted) rounded-md [border:var(--border-strong)] hover:border-(--border-color-hover) hover:text-(--accent) px-4 py-2 transition-colors duration-180 ease-linear"
      >
        <TbSend size={13} />
        Contact me
      </a>
    </section>
  );
}
