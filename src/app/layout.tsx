import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "@/styles/globals.css";
import { Nav } from "@/components/ui/Nav";
import { Footer } from "@/components/ui/Footer";
import { SITE_NAME } from "@/constants/site";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: SITE_NAME,
  description: `Portfolio and course notes by ${SITE_NAME} — 4th year CS student at the University of Waterloo.`,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable}`}
    >
      <body className="min-h-screen flex flex-col">
        <Nav />
        {children}
        <Footer />
      </body>
    </html>
  );
}
