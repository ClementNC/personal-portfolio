import type { CourseInfo } from "@/types/notes";

export const CS350: CourseInfo = {
  code: "CS350",
  title: "Operating Systems",
  term: "3B",
  termLabel: "3B  Fall 2024",
  lectures: [
    { slug: "01-intro-os", title: "Introduction to Operating Systems", type: "notes" },
    { slug: "02-processes", title: "Processes and Threads", type: "notes" },
  ],
};
