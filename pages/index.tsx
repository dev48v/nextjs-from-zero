// STEP 6: Home page — SSG (getStaticProps + revalidate) with client-side search
// WHY: SSG gives us a pre-rendered HTML page on the first visit (fast, SEO-friendly).
//      revalidate: 60 means Next.js regenerates the page in the background at most
//      once per minute — we get fresh content without hammering the API on every request.

import { useState, useMemo } from "react";
import type { GetStaticProps, NextPage } from "next";
import Layout from "@/components/Layout";
import ArticleCard from "@/components/ArticleCard";
import type { Article } from "@/types/article";
import { fetchArticles } from "@/lib/devto";

interface HomeProps {
  articles: Article[];
}

const Home: NextPage<HomeProps> = ({ articles }) => {
  // WHY: Search state lives in the component, not on the server — filtering by
  //      title/tag is instant with no extra network round-trips.
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    if (!query.trim()) return articles;
    const q = query.toLowerCase();
    return articles.filter(
      (a) =>
        a.title.toLowerCase().includes(q) ||
        (a.tags && a.tags.some((t) => t.toLowerCase().includes(q))) ||
        a.description.toLowerCase().includes(q)
    );
    // WHY: useMemo prevents the filter running on every keystroke render cycle
  }, [query, articles]);

  return (
    <Layout title="Latest Articles">
      {/* ── Hero / Search bar ── */}
      <section className="mb-10">
        <h1 className="mb-2 text-3xl font-bold text-white">
          Latest on{" "}
          <span className="text-emerald-400">DEV.to</span>
        </h1>
        <p className="mb-6 text-gray-400 text-sm">
          {articles.length} articles fetched &bull; statically generated, revalidates every 60 s
        </p>

        {/* WHY: Controlled input keeps the query in sync with React state */}
        <div className="relative max-w-lg">
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by title or tag…"
            className="w-full rounded-lg border border-gray-700 bg-gray-900 px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
          {/* Simple clear button so users don't have to triple-click */}
          {query && (
            <button
              onClick={() => setQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white text-lg leading-none"
              aria-label="Clear search"
            >
              ×
            </button>
          )}
        </div>
      </section>

      {/* ── Results ── */}
      {filtered.length === 0 ? (
        <p className="text-gray-500 text-sm">
          No articles match &ldquo;{query}&rdquo;. Try a different keyword.
        </p>
      ) : (
        <>
          {query && (
            <p className="mb-4 text-xs text-gray-500">
              Showing {filtered.length} of {articles.length} articles
            </p>
          )}
          {/* WHY: responsive grid — 1 col on mobile, 2 on md, 3 on lg */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        </>
      )}
    </Layout>
  );
};

export const getStaticProps: GetStaticProps<HomeProps> = async () => {
  // WHY: Fetching at build time means the HTML is ready before the user even
  //      requests it.  Any error here should not crash production silently.
  try {
    const articles = await fetchArticles(20);
    return {
      props: { articles },
      // WHY: ISR — regenerate at most every 60 seconds so content stays reasonably fresh
      revalidate: 60,
    };
  } catch (err) {
    console.error("getStaticProps /index failed:", err);
    // Return empty list rather than throwing, so the page still builds
    return { props: { articles: [] }, revalidate: 60 };
  }
};

export default Home;
