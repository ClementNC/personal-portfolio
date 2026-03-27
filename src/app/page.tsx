"use client";

import { useRef } from "react";
import { Hero } from "@/components/home/Hero";

// TODO: replace no-op with terminal open handler once Terminal.tsx is built
export default function HomePage() {
  const heroRef = useRef<HTMLElement>(null);

  return (
    <main className="flex-1 max-w-[900px] mx-auto w-full px-12">
      <Hero ref={heroRef} onOpenTerminal={() => {}} />
    </main>
  );
}
