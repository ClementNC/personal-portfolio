export interface TagProps {
  label: string;
  size?: "sm" | "md";
}

const SIZE_CLASSES: Record<NonNullable<TagProps["size"]>, string> = {
  md: "text-[11px] px-[12px] py-[5px] rounded-[8px]",
  sm: "text-[10px] px-[8px] py-[4px] rounded-[6px]",
};

export function Tag({ label, size = "md" }: TagProps) {
  return (
    <span
      className={`font-mono text-(--accent) bg-(--bg-card) [border:var(--border-strong)] hover:[border-color:var(--border-color-hover)] transition-colors duration-150 ease-linear ${SIZE_CLASSES[size]}`}
    >
      {label}
    </span>
  );
}
