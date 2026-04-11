import { codeToHtml } from "shiki";

interface CodeBlockProps {
  children?: React.ReactNode;
}

export async function CodeBlock({ children }: CodeBlockProps) {
  const code = extractCode(children);
  const lang = extractLang(children);

  const html = await codeToHtml(code, {
    lang: lang ?? "text",
    theme: "github-dark",
  });

  return (
    <div className="my-5 overflow-x-auto rounded-[4px] bg-(--bg-card) [border:0.5px_solid_rgba(175,169,236,0.1)] text-[13px] [&>pre]:p-4 [&>pre]:leading-[1.65]">
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
}

// ── Helpers ───────────────────────────────────────────────────────────────────

// MDX compiles ```lang\ncode\n``` into <pre><code className="language-lang">code</code></pre>
// These helpers extract the raw code string and language from that structure.

function extractCode(children: React.ReactNode): string {
  if (!children) return "";
  const child = Array.isArray(children) ? children[0] : children;
  if (typeof child === "object" && child !== null && "props" in child) {
    const props = (child as React.ReactElement).props as { children?: string };
    return props.children?.trim() ?? "";
  }
  return String(children).trim();
}

function extractLang(children: React.ReactNode): string | undefined {
  if (!children) return undefined;
  const child = Array.isArray(children) ? children[0] : children;
  if (typeof child === "object" && child !== null && "props" in child) {
    const props = (child as React.ReactElement).props as { className?: string };
    const match = props.className?.match(/language-(\w+)/);
    return match?.[1];
  }
  return undefined;
}
