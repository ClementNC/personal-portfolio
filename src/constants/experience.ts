export interface ExperienceEntry {
  role: string;
  company: string;
  period: string;
  description: string;
  tags: string[];
}

export const EXPERIENCE: ExperienceEntry[] = [
  {
    role: "Software Developer Intern",
    company: "D2L",
    period: "Jan 2026 – Apr 2026",
    description: "One-line summary of what you built and the impact it had.",
    tags: ["React", "TypeScript", "AWS"],
  },
  {
    role: "Software Developer Intern",
    company: "Geotab",
    period: "Jan 2025 – Aug 2025",
    description: "One-line summary of what you built and the impact it had.",
    tags: ["Python", "Django", "PostgreSQL"],
  },
  {
    role: "Software Engineer Intern",
    company: "Constant Contact",
    period: "May 2024 – Aug 2024",
    description: "One-line summary of what you built and the impact it had.",
    tags: ["Java", "Spring", "SQL"],
  },
  {
    role: "Software Developer Intern",
    company: "Bank of America Merrill Lynch",
    period: "Sep 2023 – Dec 2023",
    description: "One-line summary of what you built and the impact it had.",
    tags: ["Node.js", "Express", "MongoDB"],
  },
  {
    role: "Software Engineer Intern",
    company: "Constant Contact",
    period: "Jan 2023 – Apr 2023",
    description: "One-line summary of what you built and the impact it had.",
    tags: ["Java", "Spring", "SQL"],
  },
];

// Number of entries shown before the "show more" toggle
export const EXPERIENCE_VISIBLE_COUNT = 2;
