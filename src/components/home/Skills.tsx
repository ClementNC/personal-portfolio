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
      className="fade-in py-10 [border-bottom:0.5px_solid_rgba(175,169,236,0.07)]"
    >
      <SectionHeader
        title="technical skills"
        comment="languages, frameworks & tools"
      />
      <div className="flex flex-wrap gap-[7px]">
        {SKILLS.map((skill) => (
          <Tag key={skill} label={skill} />
        ))}
      </div>
    </section>
  );
}
