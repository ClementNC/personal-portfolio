export interface NotesPreviewCard {
  file: string;
  title: string;
  tag: string;
  count: number;
  href: string;
}

// Placeholder cards — replace with real courses once the notes content system is built
export const NOTES_PREVIEW_CARD_DATA: NotesPreviewCard[] = [
  {
    file: "CS 341",
    title: "Algorithms",
    tag: "CS",
    count: 8,
    href: "/notes/cs341",
  },
  {
    file: "CS 350",
    title: "Operating Systems",
    tag: "CS",
    count: 11,
    href: "/notes/cs350",
  },
  {
    file: "CS 451",
    title: "Data-Intensive Distributed Computing",
    tag: "CS",
    count: 12,
    href: "/notes/cs451",
  },
  {
    file: "STAT 341",
    title: "Computational Statistics and Data Analysis",
    tag: "Math Elective",
    count: 14,
    href: "/notes/stat341",
  },
  {
    file: "STAT 443",
    title: "Forecasting",
    tag: "Math Elective",
    count: 9,
    href: "/notes/stat443",
  },
  {
    file: "CO 487",
    title: "Applied Cryptography",
    tag: "Combinatorics & Optimization",
    count: 10,
    href: "/notes/co487",
  },
];
