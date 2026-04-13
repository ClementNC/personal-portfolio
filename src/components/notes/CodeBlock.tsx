interface CodeBlockProps {
  children?: React.ReactNode;
  className?: string; // shiki injects "shiki github-dark" — ignored, styled via wrapper
  style?: React.CSSProperties; // shiki injects background-color inline — overridden below
}

export function CodeBlock({ children }: CodeBlockProps) {
  return (
    <div className="my-5 overflow-x-auto rounded-[4px] bg-(--bg-card) [border:0.5px_solid_rgba(175,169,236,0.1)] text-[13px]">
      <pre className="p-4 leading-[1.65]">{children}</pre>
    </div>
  );
}
