"use client";

import { useEffect, useRef, useState } from "react";
import { Hero } from "@/components/home/Hero";
import { Skills } from "@/components/home/Skills";
import { ExperienceList } from "@/components/home/ExperienceList";
import { NotesPreview } from "@/components/home/NotesPreview";
import { Terminal, type TerminalHandle } from "@/components/home/Terminal";
import { useMediaQuery } from "@/hooks/useMediaQuery";

export default function HomePage() {
  const heroRef = useRef<HTMLElement>(null);
  const terminalRef = useRef<TerminalHandle>(null);
  const isDesktop = useMediaQuery("(min-width: 1024px)");

  // Terminal mounts the first time isDesktop becomes true and stays mounted
  // thereafter. This lets Terminal.tsx handle resize gracefully (auto-minimise)
  // rather than losing session state when the viewport briefly dips below 1024px.
  const [terminalEnabled, setTerminalEnabled] = useState(false);
  useEffect(() => {
    if (isDesktop) setTerminalEnabled(true);
  }, [isDesktop]);

  return (
    <main className="flex-1 max-w-[900px] mx-auto w-full px-12">
      <Hero
        ref={heroRef}
        onOpenTerminal={() => terminalRef.current?.open("fullscreen")}
      />
      <Skills />
      <ExperienceList />
      <NotesPreview />
      {terminalEnabled && (
        <Terminal ref={terminalRef} isDesktop={isDesktop} heroRef={heroRef} />
      )}
    </main>
  );
}
