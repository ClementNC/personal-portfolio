"use client";

import { SectionHeader } from "@/components/ui/SectionHeader";
import { Tag } from "@/components/ui/Tag";
import { useIntersection } from "@/hooks/useIntersection";
import { SKILLS } from "@/constants/hero";

export function Skills() {
  const ref = useIntersection<HTMLElement>();

  return (
    <section
      ref={ref}
      className="fade-in py-8"
    >
      <SectionHeader title="technical skills" />
      <div className="flex flex-col gap-4">
        {Object.entries(SKILLS).map(([category, skills]) => (
          <div key={category}>
            <p className="font-mono text-[11px] text-(--text-dim) mb-2">{category}</p>
            <div className="flex flex-wrap gap-[7px]">
              {skills.map((skill) => (
                <Tag key={skill} label={skill} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
