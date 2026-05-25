import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SATWordle",
  description: "Learn SAT vocabulary the Wordle way",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-white text-[#1a1a1b] min-h-screen">{children}</body>
    </html>
  );
}
