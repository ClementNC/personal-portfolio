"use client";

import { useRef } from "react";
import { Hero } from "@/components/home/Hero";
import { Skills } from "@/components/home/Skills";
import { ExperienceList } from "@/components/home/ExperienceList";
import { NotesPreview } from "@/components/home/NotesPreview";

// TODO: replace no-op with terminal open handler once Terminal.tsx is built
export default function HomePage() {
  const heroRef = useRef<HTMLElement>(null);

  return (
    <main className="flex-1 max-w-[900px] mx-auto w-full px-12">
      <Hero ref={heroRef} onOpenTerminal={() => {}} />
      <Skills />
      <ExperienceList />
      <NotesPreview />
    </main>
  );
}
