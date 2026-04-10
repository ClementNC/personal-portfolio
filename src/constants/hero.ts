export const TYPEWRITER_TIMING = {
  keystrokeMs: 58,
  deletionMs: 28,
  holdMs: 1900,
  pauseMs: 320,
} as const;

export const SKILLS: Record<string, string[]> = {
  Languages:  ["Python", "Java", "TypeScript", "C / C++", "Bash"],
  Frameworks: ["React", "Node.js"],
  Tools:      ["Git", "Linux", "SQL"],
};

// Phrases cycled by the typewriter on the hero section
export const TYPEWRITER_PHRASES = [
  "software engineer in training",
  "cs341 survivor",
  "always hungry. always.",
  "// TODO: finish side projects",
  "git commit -m 'building cool stuff'",
  "open to new opportunities",
  "one piece is real",
] as const;
