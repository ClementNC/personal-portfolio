import { Hero } from "@/components/home/Hero";
import { Skills } from "@/components/home/Skills";
import { ExperienceList } from "@/components/home/ExperienceList";
import { NotesPreview } from "@/components/home/NotesPreview";

export default function HomePage() {
  return (
    <main className="flex-1 max-w-[900px] mx-auto w-full px-12">
      <section id="hero"><Hero /></section>
      <section id="skills"><Skills /></section>
      <section id="experience"><ExperienceList /></section>
      <section id="notes"><NotesPreview /></section>
    </main>
  );
}
