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
    tags: ["C#", "PostgreSQL", "React.js", "TypeScript", "Google Cloud Platform (GCP)", "Google BigQuery"],
  },
  {
    role: "Software Engineer Intern",
    company: "Constant Contact",
    period: "May 2024 – Aug 2024",
    description: "One-line summary of what you built and the impact it had.",
    tags: ["Java", "SQL", "React.js", "Playwright", "AWS"],
  },
  {
    role: "Full Stack Developer Intern",
    company: "Bank of America Merrill Lynch",
    period: "Sep 2023 – Dec 2023",
    description: "One-line summary of what you built and the impact it had.",
    tags: ["C#", "Windows Presentation Foundation (WPF)", "DevExpress", "Scala", "Autofac"],
  },
  {
    role: "DevOps Engineer Intern",
    company: "Constant Contact",
    period: "Jan 2023 – Apr 2023",
    description: "One-line summary of what you built and the impact it had.",
    tags: ["Docker", "Kubernetes", "Helm", "Tilt", "Jenkins", "Go (Golang)"],
  },
];

// Number of entries shown before the "show more" toggle
export const EXPERIENCE_VISIBLE_COUNT = 3;
