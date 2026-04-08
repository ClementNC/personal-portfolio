import { EXPERIENCE } from "@/constants/experience";
import { SKILLS } from "@/constants/hero";

// ─── Node types ───────────────────────────────────────────────────────────────

export interface FileSystemNode {
  readonly type: "file" | "directory";
  readonly name: string;
  // Full path from root (e.g. "~/notes"). Set by parent.addChild() so it
  // cannot be readonly — it is unknown at construction time. The root node
  // keeps its constructor default of "~"; all other nodes are overwritten
  // before they are ever read.
  path: string;
  parent: Directory | null;
}

export class File implements FileSystemNode {
  readonly type = "file" as const;
  path: string;
  parent: Directory | null = null;

  constructor(
    readonly name: string,
    private content: string,
  ) {
    this.path = name; // overwritten by addChild
  }

  read(): string {
    return this.content;
  }
}

export class Directory implements FileSystemNode {
  readonly type = "directory" as const;
  path: string;
  parent: Directory | null = null;
  readonly children: Map<string, File | Directory> = new Map();

  /** When set, `open <dir>` navigates to this page in the app. */
  readonly navigateTo?: string;

  constructor(
    readonly name: string,
    options?: { navigateTo?: string },
  ) {
    this.path = name; // "~" for root; overwritten by addChild for all others
    this.navigateTo = options?.navigateTo;
  }

  addChild(node: File | Directory): this {
    node.parent = this;
    // Build the child's full path from the parent's — avoids walking the
    // tree on every pwd() call by computing the path once at insertion time.
    node.path = `${this.path}/${node.name}`;
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

// ─── FileSystem ───────────────────────────────────────────────────────────────

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
    return this.cwd.path;
  }

  getCwd(): Directory {
    return this.cwd;
  }

  /** Reset to root directory. */
  reset(): void {
    this.cwd = this.root;
  }
}

// ─── Content formatters ───────────────────────────────────────────────────────

function formatExperience(): string {
  return EXPERIENCE.map(
    (exp) =>
      `${exp.company}  ·  ${exp.role}  ·  ${exp.period}\n  ${exp.description}\n  [${exp.tags.join(", ")}]`,
  ).join("\n\n");
}

function formatStack(): string {
  return [...SKILLS].join("  ·  ");
}

// ─── Tree factory ─────────────────────────────────────────────────────────────

export function createFileSystem(): FileSystem {
  const root = new Directory("~");

  root.addChild(new File("experience.md", formatExperience()));
  root.addChild(new File("stack.md", formatStack()));
  root.addChild(new Directory("notes", { navigateTo: "/notes" }));
  root.addChild(new Directory("about", { navigateTo: "/about" }));

  return new FileSystem(root);
}
