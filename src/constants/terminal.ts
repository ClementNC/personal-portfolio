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

// Terminal panel — available commands and their descriptions
export const TERMINAL_COMMANDS = {
  "cat <file>": "Display contents of a file",
  "cd <directory>": "Change directory",
  clear: "Clear the terminal",
  "echo <text>": "Print text to the terminal",
  exit: "Close terminal and return to page",
  help: "List available commands",
  "ls [path]": "List directory contents",
  "open <directory>": "Close terminal and return to page",
  pwd: "Print working directory",
} as const;
