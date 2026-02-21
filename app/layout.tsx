import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Brain, Search, PlusCircle, MessageSquare } from "lucide-react";
import Link from "next/link";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Second Brain AI",
  description: "Capture, organize, and query your knowledge.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} font-sans antialiased bg-neutral-50 text-neutral-900 dark:bg-neutral-950 dark:text-neutral-50 h-[100dvh] flex flex-col md:flex-row overflow-hidden`}
      >
        {/* Sidebar Nav (Desktop) / Top Nav (Mobile) */}
        <nav className="w-full md:w-64 border-b md:border-b-0 md:border-r border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 p-4 shrink-0 flex flex-col z-10">
          <div className="flex items-center gap-3 mb-4 md:mb-8 font-semibold text-lg shrink-0">
            <div className="bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 p-1.5 rounded-lg">
              <Brain className="w-5 h-5" />
            </div>
            Second Brain
          </div>

          <div className="flex flex-row md:flex-col gap-2 overflow-x-auto pb-2 md:pb-0 shrink-0">
            <Link href="/" className="flex shrink-0 items-center gap-3 px-3 py-2 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors">
              <Search className="w-4 h-4" />
              <span>Dashboard</span>
            </Link>
            <Link href="/capture" className="flex shrink-0 items-center gap-3 px-3 py-2 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors">
              <PlusCircle className="w-4 h-4" />
              <span>Capture</span>
            </Link>
            <Link href="/docs" className="flex shrink-0 items-center gap-3 px-3 py-2 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" /></svg>
              <span>Architecture Docs</span>
            </Link>
          </div>
        </nav>

        {/* Main Content Area */}
        <main className="flex-1 min-w-0 p-4 sm:p-6 md:p-8 lg:p-12 overflow-y-auto relative bg-neutral-50 dark:bg-neutral-950">
          <div className="max-w-5xl mx-auto w-full h-full">
            {children}
          </div>
        </main>
      </body>
    </html>
  );
}
