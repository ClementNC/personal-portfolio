export interface SectionHeaderProps {
  title: string;
}

export function SectionHeader({ title }: SectionHeaderProps) {
  return (
    <div className="flex items-center gap-2 mb-5">
      <span className="font-mono text-[16px] text-(--text-primary)">
        {title}
      </span>
      <div className="flex-1 h-px bg-white/[0.08]" />
    </div>
  );
}
