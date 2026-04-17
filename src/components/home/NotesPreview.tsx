"use client";

import Link from "next/link";
import { HiArrowLongRight } from "react-icons/hi2";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { useIntersection } from "@/hooks/useIntersection";
import {
  NOTES_PREVIEW_CARD_DATA,
  type NotesPreviewCard,
} from "@/constants/notes-preview";

// ── Sub-component ────────────────────────────────────────────────────────────

interface NoteCardProps {
  card: NotesPreviewCard;
}

function NoteCard({ card }: NoteCardProps) {
  return (
    <Link
      href={card.href}
      className="shrink-0 w-46.25 bg-(--bg-card) [border:var(--border-default)] hover:border-(--border-color-hover) rounded-md px-4 py-3.5 transition-colors duration-200 cursor-pointer"
    >
      <p className="font-mono text-[10px] text-(--accent-mid) mb-1.25">
        {card.file}
      </p>
      <p className="text-[12px] font-medium text-(--text-primary) leading-[1.4]">
        {card.title}
      </p>
      <span className="inline-block font-mono text-[10px] px-1.75 py-0.5 rounded-[3px] bg-[rgba(127,119,221,0.1)] text-(--accent-mid) mt-1.5">
        {card.tag}
      </span>
      <p className="font-mono text-[10px] text-(--text-dim) mt-1.25">
        {`// ${card.count} notes`}
      </p>
    </Link>
  );
}

// ── Main component ───────────────────────────────────────────────────────────

export function NotesPreview() {
  const ref = useIntersection<HTMLElement>();

  return (
    <section ref={ref} className="fade-in py-8">
      <SectionHeader title="notes" />

      <p className="text-[13px] text-(--text-body) leading-[1.75] mb-4 max-w-125">
        Notes compiled throughout my degree at Waterloo — algorithms, systems,
        databases and more. Notion-style with diagrams, code snippets, and LaTeX
        where it counts.
      </p>

      {/* Horizontal scroll — relative wrapper lets the fade overlay position against this container */}
      <div className="relative">
        <div className="flex gap-2 overflow-x-auto pb-2 [scrollbar-width:thin] [scrollbar-color:rgba(175,169,236,0.15)_transparent]">
          {NOTES_PREVIEW_CARD_DATA.map((card) => (
            <NoteCard key={card.file} card={card} />
          ))}
        </div>
        {/* Right-edge fade — signals to the visitor that the row scrolls horizontally.
            pointer-events-none so it doesn't block clicks on the cards beneath it. */}
        <div className="absolute top-0 right-0 h-full w-16 pointer-events-none bg-linear-to-l from-(--bg) to-transparent" />
      </div>

      <Link
        href="/notes"
        className="inline-block mt-3.5 text-[13px] text-(--accent-mid) hover:text-(--accent) transition-colors duration-150"
      >
        <HiArrowLongRight
          size={15}
          className="inline mr-1.5 translate-y-[-1px]"
        />
        browse all notes
      </Link>
    </section>
  );
}
