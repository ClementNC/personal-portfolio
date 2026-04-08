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

// ─── Virtual file system ─────────────────────────────────────────────────────

export interface FileSystemNode {
  readonly type: "file" | "directory";
  readonly name: string;
  parent: Directory | null;
}

export class File implements FileSystemNode {
  readonly type = "file" as const;
  parent: Directory | null = null;

  constructor(
    readonly name: string,
    private content: string,
  ) {}

  read(): string {
    return this.content;
  }
}

export class Directory implements FileSystemNode {
  readonly type = "directory" as const;
  parent: Directory | null = null;
  readonly children: Map<string, File | Directory> = new Map();

  /** When set, `cd` into this directory triggers a page navigation instead. */
  readonly navigateTo?: string;

  constructor(
    readonly name: string,
    options?: { navigateTo?: string },
  ) {
    this.navigateTo = options?.navigateTo;
  }

  addChild(node: File | Directory): this {
    node.parent = this;
    this.children.set(node.name, node);
    return this;
  }

  getChild(name: string): File | Directory | undefined {
    return this.children.get(name);
  }

  list(): string[] {
    return Array.from(this.children.entries()).map(([entryName, node]) =>
      node.type === "directory" ? `${entryName}/` : entryName,
    );
  }
}

export class FileSystem {
  private root: Directory;
  private cwd: Directory;

  constructor(root: Directory) {
    this.root = root;
    this.cwd = root;
  }

  /**
   * Resolve a path string to a node in the tree.
   * Handles absolute (`~/notes`, `/notes`) and relative (`../notes`, `./file`) paths.
   * Files can only appear as the final segment — mid-path files return null.
   */
  resolve(path: string): File | Directory | null {
    const isAbsolute = path.startsWith("/") || path.startsWith("~");
    let cursor: Directory = isAbsolute ? this.root : this.cwd;

    const normalized = path.replace(/^[~\/]+/, "");
    if (!normalized) return cursor;

    const segments = normalized.split("/").filter(Boolean);

    for (let i = 0; i < segments.length; i++) {
      const segment = segments[i];
      const isLast = i === segments.length - 1;

      if (segment === ".") continue;

      if (segment === "..") {
        cursor = cursor.parent ?? cursor;
        continue;
      }

      const child = cursor.getChild(segment);
      if (!child) return null;

      if (child.type === "file") {
        // Files are only valid as the final segment
        return isLast ? child : null;
      }

      cursor = child;
    }

    return cursor;
  }

  /** Change working directory. Returns the resolved Directory, or null if invalid. */
  cd(path: string): Directory | null {
    if (!path || path === "~") {
      this.cwd = this.root;
      return this.root;
    }

    const node = this.resolve(path);
    if (!node || node.type !== "directory") return null;

    this.cwd = node;
    return node;
  }

  /** Returns the absolute path of the current working directory (e.g. `~/notes`). */
  pwd(): string {
    const parts: string[] = [];
    let cursor: Directory | null = this.cwd;
    while (cursor) {
      parts.unshift(cursor.name);
      cursor = cursor.parent;
    }
    return parts.join("/");
  }

  getCwd(): Directory {
    return this.cwd;
  }

  /** Reset to root directory. */
  reset(): void {
    this.cwd = this.root;
  }
}

// ─── Tree factory ────────────────────────────────────────────────────────────

import { EXPERIENCE } from "@/constants/experience";
import { SKILLS } from "@/constants/hero";

function formatExperience(): string {
  return EXPERIENCE.map(
    (exp) =>
      `${exp.company}  ·  ${exp.role}  ·  ${exp.period}\n  ${exp.description}\n  [${exp.tags.join(", ")}]`,
  ).join("\n\n");
}

function formatStack(): string {
  return [...SKILLS].join("  ·  ");
}

export function createFileSystem(): FileSystem {
  const root = new Directory("~");

  root.addChild(new File("experience.md", formatExperience()));
  root.addChild(new File("stack.md", formatStack()));
  root.addChild(new Directory("notes", { navigateTo: "/notes" }));
  root.addChild(new Directory("about", { navigateTo: "/about" }));

  return new FileSystem(root);
}
