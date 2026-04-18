"use client";

import {
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
  type RefObject,
} from "react";
import Link from "next/link";
import { HiSearch } from "react-icons/hi";
import { HiChevronDown, HiChevronUp, HiXMark } from "react-icons/hi2";
import Fuse, { type FuseResultMatch } from "fuse.js";
import type { SearchEntry } from "@/lib/search-index";

// ── DOM helpers ───────────────────────────────────────────────────────────────

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function clearHighlights(root: HTMLElement): void {
  root.querySelectorAll("mark[data-find]").forEach((mark) => {
    const parent = mark.parentNode;
    if (!parent) return;
    parent.replaceChild(document.createTextNode(mark.textContent ?? ""), mark);
    parent.normalize();
  });
}

function applyHighlights(root: HTMLElement, query: string): HTMLElement[] {
  const regex = new RegExp(escapeRegex(query), "gi");
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode(node): number {
      const el = node.parentElement;
      if (!el) return NodeFilter.FILTER_REJECT;
      if (el.closest("pre") || el.closest(".katex") || el.tagName === "MARK")
        return NodeFilter.FILTER_REJECT;
      return NodeFilter.FILTER_ACCEPT;
    },
  });

  const textNodes: Text[] = [];
  let curr: Node | null;
  while ((curr = walker.nextNode())) textNodes.push(curr as Text);

  const highlights: HTMLElement[] = [];

  for (const textNode of textNodes) {
    const text = textNode.textContent ?? "";
    const parts: (string | HTMLElement)[] = [];
    let lastIndex = 0;
    let m: RegExpExecArray | null;

    regex.lastIndex = 0;
    while ((m = regex.exec(text)) !== null) {
      if (m.index > lastIndex) parts.push(text.slice(lastIndex, m.index));
      const mark = document.createElement("mark");
      mark.setAttribute("data-find", "");
      mark.textContent = m[0];
      parts.push(mark);
      highlights.push(mark);
      lastIndex = m.index + m[0].length;
    }

    if (!parts.length) continue;
    if (lastIndex < text.length) parts.push(text.slice(lastIndex));

    const fragment = document.createDocumentFragment();
    for (const part of parts) {
      fragment.appendChild(
        typeof part === "string" ? document.createTextNode(part) : part,
      );
    }
    textNode.parentNode!.replaceChild(fragment, textNode);
  }

  return highlights;
}

function updateActiveHighlight(marks: HTMLElement[], idx: number): void {
  marks.forEach((el, i) => {
    el.toggleAttribute("data-find-active", i === idx);
  });
  marks[idx]?.scrollIntoView({ block: "center", behavior: "smooth" });
}

// ── Snippet helpers ───────────────────────────────────────────────────────────

function getSnippet(
  plaintext: string,
  query: string,
  fuseMatches: ReadonlyArray<FuseResultMatch> = [],
): string {
  if (!plaintext) return "";

  // Prefer Fuse's matched position in plaintext — works for fuzzy matches
  // where indexOf would return -1.
  const fuseIdx =
    fuseMatches.find((m) => m.key === "plaintext")?.indices[0]?.[0] ?? -1;
  const idx =
    fuseIdx !== -1
      ? fuseIdx
      : plaintext.toLowerCase().indexOf(query.toLowerCase());

  if (idx === -1)
    return plaintext.slice(0, 120) + (plaintext.length > 120 ? "…" : "");

  const start = Math.max(0, idx - 60);
  const end = Math.min(plaintext.length, idx + query.length + 60);
  return (
    (start > 0 ? "…" : "") +
    plaintext.slice(start, end) +
    (end < plaintext.length ? "…" : "")
  );
}

function HighlightedSnippet({ text, query }: { text: string; query: string }) {
  const segments: { str: string; hl: boolean }[] = [];
  const lower = text.toLowerCase();
  const qLower = query.toLowerCase();
  let i = 0;
  while (i < text.length) {
    const idx = lower.indexOf(qLower, i);
    if (idx === -1) {
      segments.push({ str: text.slice(i), hl: false });
      break;
    }
    if (idx > i) segments.push({ str: text.slice(i, idx), hl: false });
    segments.push({ str: text.slice(idx, idx + query.length), hl: true });
    i = idx + query.length;
  }
  return (
    <>
      {segments.map((s, index) =>
        s.hl ? (
          <span key={index} className="text-(--accent) font-medium not-italic">
            {s.str}
          </span>
        ) : (
          <span key={index}>{s.str}</span>
        ),
      )}
    </>
  );
}

// ── SearchBar ─────────────────────────────────────────────────────────────────

interface SearchBarProps {
  courseCode: string;
  isPdf: boolean;
  searchEntries: SearchEntry[];
  contentRef: RefObject<HTMLDivElement | null>;
  onOpenChange: (open: boolean) => void;
}

export function SearchBar({
  courseCode,
  isPdf,
  searchEntries,
  contentRef,
  onOpenChange,
}: SearchBarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [scope, setScope] = useState<"note" | "all">(isPdf ? "all" : "note");
  const [scopeMenuOpen, setScopeMenuOpen] = useState(false);
  const [matchCount, setMatchCount] = useState(0);
  const [activeMatchIdx, setActiveMatchIdx] = useState(0);

  const inputRef = useRef<HTMLInputElement>(null);
  const scopeRef = useRef<HTMLDivElement>(null);
  const scopeToggleBtnRef = useRef<HTMLButtonElement>(null);
  const scopeMenuRef = useRef<HTMLDivElement>(null);
  const highlightsRef = useRef<HTMLElement[]>([]);

  const fuse = useMemo(
    () =>
      new Fuse(searchEntries, {
        keys: [
          { name: "title", weight: 0.3 },
          { name: "plaintext", weight: 0.7 },
        ],
        includeScore: true,
        includeMatches: true,
        minMatchCharLength: 2,
        threshold: 0.4,
        ignoreLocation: true,
      }),
    [searchEntries],
  );

  const allResults = useMemo(() => {
    if (scope !== "all" || !query.trim()) return [];
    return fuse.search(query);
  }, [fuse, query, scope]);

  const open = useCallback(() => {
    setIsOpen(true);
    onOpenChange(true);
    requestAnimationFrame(() => inputRef.current?.focus());
  }, [onOpenChange]);

  const close = useCallback(() => {
    setIsOpen(false);
    setQuery("");
    setScopeMenuOpen(false);
    onOpenChange(false);
  }, [onOpenChange]);

  // Within-note highlight pass
  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;
    clearHighlights(el);
    highlightsRef.current = [];
    setMatchCount(0);
    setActiveMatchIdx(0);

    if (!isOpen || scope !== "note" || !query.trim()) return;

    const marks = applyHighlights(el, query);
    highlightsRef.current = marks;
    setMatchCount(marks.length);
    if (marks.length > 0) updateActiveHighlight(marks, 0);
  }, [query, scope, isOpen, contentRef]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      const el = contentRef.current;
      if (el) clearHighlights(el);
    };
  }, [contentRef]);

  // Close scope menu on outside click
  useEffect(() => {
    if (!scopeMenuOpen) return;
    const handler = (e: MouseEvent) => {
      if (!scopeRef.current?.contains(e.target as Node))
        setScopeMenuOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [scopeMenuOpen]);

  // Focus first enabled item when scope menu opens
  useEffect(() => {
    if (!scopeMenuOpen) return;
    requestAnimationFrame(() => {
      scopeMenuRef.current
        ?.querySelector<HTMLElement>('[role="menuitemradio"]:not([disabled])')
        ?.focus();
    });
  }, [scopeMenuOpen]);

  function handleScopeMenuKeyDown(e: React.KeyboardEvent) {
    const items = Array.from(
      scopeMenuRef.current?.querySelectorAll<HTMLElement>(
        '[role="menuitemradio"]:not([disabled])',
      ) ?? [],
    );
    const currentIdx = items.indexOf(document.activeElement as HTMLElement);
    if (e.key === "ArrowDown") {
      e.preventDefault();
      items[(currentIdx + 1) % items.length]?.focus();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      items[(currentIdx - 1 + items.length) % items.length]?.focus();
    } else if (e.key === "Escape") {
      e.preventDefault();
      setScopeMenuOpen(false);
      scopeToggleBtnRef.current?.focus();
    }
  }

  const goToMatch = useCallback((dir: 1 | -1) => {
    const marks = highlightsRef.current;
    if (!marks.length) return;
    setActiveMatchIdx((prev) => {
      const next = (prev + dir + marks.length) % marks.length;
      updateActiveHighlight(marks, next);
      return next;
    });
  }, []);

  const hasQuery = query.length > 0;

  if (!isOpen) {
    return (
      <button
        onClick={open}
        className="w-7 h-7 flex items-center justify-center text-(--text-dim) hover:text-(--accent) transition-colors duration-150 cursor-pointer"
        aria-label="Search"
      >
        <HiSearch size={14} />
      </button>
    );
  }

  return (
    <div className="flex items-center gap-1.5">
      {/* ── Input wrapper ── */}
      <div
        className="relative flex items-center gap-1 h-7 px-2 rounded-md"
        style={{ width: 220, border: "0.5px solid var(--accent-mid)" }}
      >
        <HiSearch size={11} className="shrink-0 text-(--text-dim)" />

        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="search..."
          aria-label="Search notes"
          className="flex-1 bg-transparent font-mono text-[11px] text-(--text-primary) placeholder:text-(--text-dim) outline-none min-w-0"
          onKeyDown={(e) => {
            if (e.key === "Escape") close();
            if (e.key === "Enter" && scope === "note" && matchCount > 0)
              goToMatch(1);
          }}
        />

        {/* Within-note counter + nav */}
        {scope === "note" &&
          hasQuery &&
          (matchCount > 0 ? (
            <div className="flex items-center gap-0.5 shrink-0">
              <span className="font-mono text-[10px] text-(--text-dim)">
                {activeMatchIdx + 1}/{matchCount}
              </span>
              <button
                onClick={() => goToMatch(-1)}
                className="text-(--text-dim) hover:text-(--accent) transition-colors cursor-pointer"
                aria-label="Previous match"
              >
                <HiChevronUp size={12} />
              </button>
              <button
                onClick={() => goToMatch(1)}
                className="text-(--text-dim) hover:text-(--accent) transition-colors cursor-pointer"
                aria-label="Next match"
              >
                <HiChevronDown size={12} />
              </button>
            </div>
          ) : (
            <span className="font-mono text-[10px] text-(--text-dim) shrink-0">
              0/0
            </span>
          ))}

        {/* ── Scope toggle ── */}
        <div ref={scopeRef} className="relative shrink-0">
          <button
            ref={scopeToggleBtnRef}
            onClick={() => setScopeMenuOpen((v) => !v)}
            aria-haspopup="menu"
            aria-expanded={scopeMenuOpen}
            aria-label={`Search scope: ${scope === "note" ? "This note" : "All lectures"}. Change scope`}
            className="flex items-center gap-0.5 font-mono text-[10px] text-(--text-dim) hover:text-(--text-body) transition-colors cursor-pointer"
          >
            {!hasQuery && <span>{scope === "note" ? "This note" : "All"}</span>}
            <HiChevronDown size={10} />
          </button>

          {scopeMenuOpen && (
            <div
              ref={scopeMenuRef}
              role="menu"
              aria-label="Search scope"
              onKeyDown={handleScopeMenuKeyDown}
              className="absolute top-full right-0 mt-1 z-50 bg-(--bg-card) [border:var(--border-default)] rounded-md shadow-lg overflow-hidden min-w-32.5"
            >
              <button
                role="menuitemradio"
                aria-checked={scope === "note"}
                aria-disabled={isPdf}
                onClick={() => {
                  if (!isPdf) {
                    setScope("note");
                    setScopeMenuOpen(false);
                  }
                }}
                disabled={isPdf}
                className={`w-full text-left px-3 py-1.5 font-mono text-[11px] transition-colors ${
                  isPdf
                    ? "text-(--text-dim) cursor-not-allowed"
                    : scope === "note"
                      ? "text-(--accent) bg-(--bg-deep)"
                      : "text-(--text-muted) hover:text-(--text-primary) hover:bg-[rgba(175,169,236,0.04)]"
                }`}
              >
                This note
                {isPdf && (
                  <span className="ml-1 text-[9px]">(unavailable)</span>
                )}
              </button>
              <button
                role="menuitemradio"
                aria-checked={scope === "all"}
                onClick={() => {
                  setScope("all");
                  setScopeMenuOpen(false);
                }}
                className={`w-full text-left px-3 py-1.5 font-mono text-[11px] transition-colors ${
                  scope === "all"
                    ? "text-(--accent) bg-(--bg-deep)"
                    : "text-(--text-muted) hover:text-(--text-primary) hover:bg-[rgba(175,169,236,0.04)]"
                }`}
              >
                All lectures
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ── Close ── */}
      <button
        onClick={close}
        className="w-7 h-7 flex items-center justify-center text-(--text-dim) hover:text-(--accent) transition-colors cursor-pointer"
        aria-label="Close search"
      >
        <HiXMark size={14} />
      </button>

      {/* Screen reader announcement for result count */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {scope === "all" &&
          query.trim() &&
          (allResults.length > 0
            ? `Found in ${allResults.length} ${allResults.length === 1 ? "lecture" : "lectures"}`
            : "No results")}
      </div>

      {/* ── All-lectures results dropdown ── */}
      {scope === "all" && query.trim() && (
        <div
          role="region"
          aria-label="Search results"
          className="absolute top-12 right-0 z-50 w-80 bg-(--bg-card) [border:var(--border-default)] rounded-lg shadow-xl overflow-hidden"
        >
          {allResults.length > 0 ? (
            <>
              <div className="px-3 py-2 [border-bottom:var(--border-subtle)]">
                <span className="font-mono text-[11px] text-(--text-dim)">
                  Found in{" "}
                  <span className="font-semibold text-(--text-body)">
                    {allResults.length}
                  </span>{" "}
                  {allResults.length === 1 ? "lecture" : "lectures"}
                </span>
              </div>
              <div className="max-h-96 overflow-y-auto">
                {allResults.map((result) => {
                  const entry = result.item;
                  const snippet = getSnippet(
                    entry.plaintext,
                    query,
                    result.matches,
                  );
                  return (
                    <Link
                      key={entry.id}
                      href={`/notes/${courseCode.toLowerCase()}/${entry.id}`}
                      onClick={close}
                      className="flex flex-col gap-1 px-3 py-2.5 [border-bottom:var(--border-subtle)] last:[border-bottom:none] hover:bg-[rgba(175,169,236,0.04)] transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[12px] text-(--text-primary) truncate flex-1">
                          {entry.title}
                        </span>
                        <span
                          className={`font-mono text-[10px] shrink-0 px-1.5 py-0.5 rounded [border:var(--border-strong)] ${
                            entry.type === "pdf"
                              ? "text-(--amber) border-[rgba(186,117,23,0.3)]"
                              : "text-(--text-dim)"
                          }`}
                        >
                          {entry.type === "pdf" ? "pdf" : "md"}
                        </span>
                      </div>
                      {entry.type === "notes" && snippet && (
                        <p className="font-mono text-[10px] text-(--text-dim) leading-relaxed line-clamp-2">
                          <HighlightedSnippet text={snippet} query={query} />
                        </p>
                      )}
                    </Link>
                  );
                })}
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center gap-2 py-6 px-4">
              <HiSearch size={16} className="text-(--text-dim)" />
              <div className="text-center">
                <p className="font-mono text-[11px] text-(--text-body)">
                  No results for &ldquo;{query}&rdquo;
                </p>
                <p className="font-mono text-[10px] text-(--text-dim) mt-1">
                  Try a different term or check your spelling
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
