import type { ReactNode } from "react";
import { Footer } from "@/components/ui/Footer";

export default function MainLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <>
      {children}
      <Footer />
    </>
  );
}
