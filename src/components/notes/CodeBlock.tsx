"use client";

import { useState, useRef } from "react";
import type { ReactNode } from "react";
import { GoCopy, GoCheck } from "react-icons/go";

interface CodeBlockProps {
  children?: ReactNode;
  "data-language"?: string;
}

export function CodeBlock({
  children,
  "data-language": language,
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const preRef = useRef<HTMLPreElement>(null);

  const showLanguage = language && language !== "text";

  const handleCopy = async () => {
    const text = preRef.current?.textContent ?? "";
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="group my-5 rounded-md [border:var(--border-strong)] hover:border-(--border-color-hover) hover:bg-[rgba(175,169,236,0.03)] transition-[border-color,background-color] duration-150 text-[13px]">
      {showLanguage && (
        <div className="px-3 py-2 bg-(--bg-deep) [border-bottom:var(--border-strong)]">
          <span className="font-mono text-[12px] text-(--text-muted)">
            {language}
          </span>
        </div>
      )}
      <div className="relative overflow-x-auto">
        <pre ref={preRef} className="p-4 leading-[1.65]">
          {children}
        </pre>
        <button
          onClick={handleCopy}
          className="absolute top-2 right-2 p-1 rounded-sm bg-(--bg) [border:var(--border-strong)] hover:text-(--accent) hover:border-(--border-color-hover) text-(--text-dim) opacity-0 group-hover:opacity-100 transition-[color,border-color,opacity] duration-150 cursor-pointer"
          aria-label="Copy code"
        >
          {copied ? <GoCheck size={18} /> : <GoCopy size={18} />}
        </button>
      </div>
    </div>
  );
}
