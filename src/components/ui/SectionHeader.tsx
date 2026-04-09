import { Comment } from "@/components/ui/Comment";

export interface SectionHeaderProps {
  title: string;
  comment: string;
}

export function SectionHeader({ title, comment }: SectionHeaderProps) {
  return (
    <div className="flex items-center gap-2 mb-5">
      <span className="font-mono text-[13px] text-(--accent)">{title}</span>
      <Comment lines={[comment]} style="line" className="text-[11px] mb-0" />
      <div className="flex-1 h-px bg-white/5" />
    </div>
  );
}
