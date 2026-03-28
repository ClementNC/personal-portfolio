import Link from "next/link";
import { HiArrowLongRight } from "react-icons/hi2";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { useIntersection } from "@/hooks/useIntersection";
import { NOTES_PREVIEW_CARD_DATA, type NotesPreviewCard } from "@/constants/notes-preview";

// ── Sub-component ────────────────────────────────────────────────────────────

interface NoteCardProps {
  card: NotesPreviewCard;
}

function NoteCard({ card }: NoteCardProps) {
  return (
    <Link
      href={card.href}
      className="flex-shrink-0 w-[160px] bg-[var(--bg-card)] [border:0.5px_solid_rgba(175,169,236,0.1)] hover:[border-color:rgba(175,169,236,0.28)] rounded-[6px] px-4 py-[14px] transition-colors duration-200 cursor-pointer"
    >
      <p className="font-mono text-[10px] text-[--accent-dark] mb-[5px]">{card.file}</p>
      <p className="text-[12px] font-medium text-[--text-primary] leading-[1.4]">{card.title}</p>
      <span className="inline-block font-mono text-[10px] px-[7px] py-[2px] rounded-[3px] bg-[rgba(127,119,221,0.1)] text-[--accent-mid] mt-[6px]">
        {card.tag}
      </span>
      <p className="font-mono text-[10px] text-[--accent-ghost] mt-[5px]">
        {`// ${card.count} notes`}
      </p>
    </Link>
  );
}

// ── Main component ───────────────────────────────────────────────────────────

export function NotesPreview() {
  const ref = useIntersection<HTMLElement>();

  return (
    <section
      ref={ref}
      className="fade-in py-10 [border-bottom:0.5px_solid_rgba(175,169,236,0.07)]"
    >
      <SectionHeader title="notes" comment="// course notes" />

      <p className="text-[13px] text-[--text-muted] leading-[1.75] mb-4 max-w-[500px]">
        Notes compiled throughout my degree at Waterloo — algorithms, systems, databases and more.{" "}
        <span className="text-[--text-body]">
          Notion-style with diagrams, code snippets, and LaTeX where it counts.
        </span>
      </p>

      {/* Horizontal scroll — custom scrollbar to match the design system */}
      <div className="flex gap-2 overflow-x-auto pb-2 [scrollbar-width:thin] [scrollbar-color:rgba(175,169,236,0.15)_transparent]">
        {NOTES_PREVIEW_CARD_DATA.map((card) => (
          <NoteCard key={card.file} card={card} />
        ))}
      </div>

      <Link
        href="/notes"
        className="inline-block mt-[14px] text-[13px] text-[--accent-mid] hover:text-[--accent] transition-colors duration-150"
      >
        <HiArrowLongRight size={15} className="inline mr-[6px] translate-y-[-1px]" />browse all notes
      </Link>
    </section>
  );
}
