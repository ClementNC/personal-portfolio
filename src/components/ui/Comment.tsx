export type CommentStyle = "line" | "block";

export interface CommentProps {
  lines: string[];
  style?: CommentStyle;
  className?: string;
}

/**
 * Renders decorative code-comment text in the Indigo Night design system.
 *
 * style="line"  → // prefix on each line (single-line comments)
 * style="block" → /* ... *\/ wrapper (block comment)
 */
export function Comment({
  lines,
  style = "line",
  className = "",
}: CommentProps) {
  const base = `font-mono text-(--accent-ghost) opacity-60 leading-[1.8] ${className}`;

  if (style === "line") {
    return (
      <div className={base}>
        {lines.map((line, i) => (
          <p key={i}>{`// ${line}`}</p>
        ))}
      </div>
    );
  }

  return (
    <div className={base}>
      <p>{"/*"}</p>
      {lines.map((line, i) => (
        <p key={i}>{`   ${line}`}</p>
      ))}
      <p>{"   */"}</p>
    </div>
  );
}
