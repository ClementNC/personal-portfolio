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
