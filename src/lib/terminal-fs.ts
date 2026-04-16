import { EXPERIENCE } from "@/constants/experience";
import { SOCIAL_LINKS } from "@/constants/site";
import { SKILLS } from "@/constants/hero";

// ─── Node types ───────────────────────────────────────────────────────────────

export interface FileSystemNode {
  readonly type: "file" | "directory";
  readonly name: string;
  /** When set, `open <name>` navigates to this page in the app. */
  readonly href?: string;
  // Full path from root (e.g. "~/notes"). Set by parent.addChild() so it
  // cannot be readonly — it is unknown at construction time. The root node
  // keeps its constructor default of "~"; all other nodes are overwritten
  // before they are ever read.
  path: string;
  parent: Directory | null;
}

export class File implements FileSystemNode {
  readonly type = "file" as const;
  readonly href?: string;
  path: string;
  parent: Directory | null = null;

  constructor(
    readonly name: string,
    private content: string,
    options?: { href?: string },
  ) {
    this.path = name; // overwritten by addChild
    this.href = options?.href;
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

  readonly href?: string;

  constructor(
    readonly name: string,
    options?: { href?: string },
  ) {
    this.path = name; // "~" for root; overwritten by addChild for all others
    this.href = options?.href;
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

function formatContacts(): string {
  return Object.entries(SOCIAL_LINKS)
    .map(([social, link]) => `${social}: ${link}`)
    .join("\n");
}

function formatExperience(): string {
  return EXPERIENCE.map(
    (exp) =>
      `${exp.company}  ·  ${exp.role}  ·  ${exp.period}\n  ${exp.description}\n  [${exp.tags.join(", ")}]`,
  ).join("\n\n");
}

function formatSkills(): string {
  return Object.entries(SKILLS)
    .map(([category, skills]) => `${category}: ${skills.join(", ")}`)
    .join("\n");
}

// ─── Tree factory ─────────────────────────────────────────────────────────────

export function createFileSystem(): FileSystem {
  const about = new Directory("about", { href: "/about" });
  about.addChild(new File("contacts", formatContacts(), { href: "/#contact" }));
  about.addChild(new File("skills", formatSkills(), { href: "/#skills" }));
  about.addChild(
    new File("experiences", formatExperience(), { href: "/#experience" }),
  );

  const notes = new Directory("notes", { href: "/notes" });
  
  const chem120 = new Directory("chem120", { href: "/notes/chem120" });
  notes.addChild(chem120);
  
  const co487 = new Directory("co487", { href: "/notes/co487" });
  notes.addChild(co487);
  
  const cs136 = new Directory("cs136", { href: "/notes/cs136" });
  notes.addChild(cs136);
  const cs240 = new Directory("cs240", { href: "/notes/cs240" });
  notes.addChild(cs240);
  const cs241 = new Directory("cs241", { href: "/notes/cs241" });
  notes.addChild(cs241);
  const cs245 = new Directory("cs245", { href: "/notes/cs245" });
  notes.addChild(cs245);
  const cs246 = new Directory("cs246", { href: "/notes/cs246" });
  notes.addChild(cs246);
  const cs251 = new Directory("cs251", { href: "/notes/cs251" });
  notes.addChild(cs251);
  const cs341 = new Directory("cs341", { href: "/notes/cs341" });
  notes.addChild(cs341);
  const cs348 = new Directory("cs348", { href: "/notes/cs348" });
  notes.addChild(cs348);
  const cs350 = new Directory("cs350", { href: "/notes/cs350" });
  notes.addChild(cs350);
  const cs451 = new Directory("cs451", { href: "/notes/cs451" });
  notes.addChild(cs451);

  const math135 = new Directory("math135", { href: "/notes/math135" });
  notes.addChild(math135);
  const math136 = new Directory("math136", { href: "/notes/math136" });
  notes.addChild(math136);
  const math137 = new Directory("math137", { href: "/notes/math137" });
  notes.addChild(math137);
  const math138 = new Directory("math138", { href: "/notes/math138" });
  notes.addChild(math138);
  const math235 = new Directory("math235", { href: "/notes/math235" });
  notes.addChild(math235);
  const math237 = new Directory("math237", { href: "/notes/math237" });
  notes.addChild(math237);
  const math239 = new Directory("math239", { href: "/notes/math239" });
  notes.addChild(math239);

  const stat230 = new Directory("stat230", { href: "/notes/stat230" });
  notes.addChild(stat230);
  const stat231 = new Directory("stat231", { href: "/notes/stat231" });
  notes.addChild(stat231);
  const stat331 = new Directory("stat331", { href: "/notes/stat331" });
  notes.addChild(stat331);
  const stat341 = new Directory("stat341", { href: "/notes/stat341" });
  notes.addChild(stat341);
  const stat443 = new Directory("stat443", { href: "/notes/stat443" });
  notes.addChild(stat443);

  const root = new Directory("~");
  root.addChild(about);
  root.addChild(notes);

  return new FileSystem(root);
}
