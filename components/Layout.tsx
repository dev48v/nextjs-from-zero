// STEP 4: Layout component — dark header + footer wrapper
// WHY: A shared Layout means every page automatically gets the nav and footer
//      without copy-pasting markup.  Wrapping in _app.tsx keeps page components clean.

import Head from "next/head";
import Link from "next/link";
import type { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
  // WHY: Allow each page to set its own <title> while keeping the site suffix consistent
  title?: string;
}

export default function Layout({ children, title }: LayoutProps) {
  const pageTitle = title ? `${title} | DEV.to Reader` : "DEV.to Reader";

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content="Browse DEV.to articles — built with Next.js + Tailwind v4" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      {/* WHY: min-h-screen + flex column pushes footer to bottom on short pages */}
      <div className="min-h-screen flex flex-col bg-gray-950 text-white">
        {/* ── Header ── */}
        <header className="sticky top-0 z-50 border-b border-gray-800 bg-gray-950/90 backdrop-blur-sm">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
            {/* WHY: Link to / so clicking the logo always goes home */}
            <Link href="/" className="flex items-center gap-2">
              {/* Simple text-based logo — no external icon dependency */}
              <span className="text-xl font-bold tracking-tight">
                <span className="text-emerald-400">DEV</span>
                <span className="text-gray-300">.to</span>
                <span className="ml-1 text-gray-500 text-sm font-normal">Reader</span>
              </span>
            </Link>

            <nav className="flex items-center gap-6 text-sm font-medium">
              <Link
                href="/"
                className="text-gray-400 hover:text-emerald-400 transition-colors"
              >
                Home
              </Link>
              {/* Shortcut to a popular tag so visitors can explore immediately */}
              <Link
                href="/tag/javascript"
                className="text-gray-400 hover:text-emerald-400 transition-colors"
              >
                JavaScript
              </Link>
              <Link
                href="/tag/webdev"
                className="text-gray-400 hover:text-emerald-400 transition-colors"
              >
                Web Dev
              </Link>
              <Link
                href="/tag/beginners"
                className="text-gray-400 hover:text-emerald-400 transition-colors"
              >
                Beginners
              </Link>
            </nav>
          </div>
        </header>

        {/* WHY: flex-1 makes main expand to fill remaining vertical space */}
        <main className="flex-1">
          <div className="mx-auto max-w-6xl px-4 py-8">{children}</div>
        </main>

        {/* ── Footer ── */}
        <footer className="border-t border-gray-800 bg-gray-900 py-6">
          <div className="mx-auto max-w-6xl px-4 text-center text-sm text-gray-500">
            <p>
              Data sourced from{" "}
              <a
                href="https://dev.to"
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-400 hover:underline"
              >
                DEV.to
              </a>{" "}
              public API &mdash; built with Next.js &amp; Tailwind v4
            </p>
          </div>
        </footer>
      </div>
    </>
  );
}
