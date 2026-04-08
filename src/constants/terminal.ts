// ─── Prompt identity ──────────────────────────────────────────────────────────

export const TERMINAL_USER = "clement";
export const TERMINAL_HOST = "portfolio";

// ─── Help text ────────────────────────────────────────────────────────────────

export const TERMINAL_COMMANDS: Record<string, string> = {
  help:          "list available commands",
  ls:            "list directory contents",
  "ls <path>":   "list contents at path",
  pwd:           "print working directory",
  "cat <file>":  "display file contents",
  "cd <path>":   "change directory",
  "open <dir>":  "open directory in browser",
  clear:         "clear the terminal",
  exit:          "close terminal",
} as const;
