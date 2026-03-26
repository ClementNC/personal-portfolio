export interface SectionHeaderProps {
  title: string;
  comment: string;
}

export function SectionHeader({ title, comment }: SectionHeaderProps) {
  return (
    <div className="flex items-center gap-2 mb-5">
      <span className="font-mono text-[13px] text-[--accent]">{title}</span>
      <span className="font-mono text-[11px] text-[--accent-ghost]">
        {comment}
      </span>
      <div className="flex-1 h-px bg-white/5" />
    </div>
  );
}
