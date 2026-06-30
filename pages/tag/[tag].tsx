// STEP 8: Tag filter page — SSG with getStaticPaths
// WHY: Popular tags are finite and known at build time.  SSG means the tag pages
//      are pre-rendered HTML — instant load for the most-requested paths.
//      fallback: "blocking" handles any tag not in the seed list by SSR-ing on demand
//      and then caching the result.

import type { GetStaticPaths, GetStaticProps, NextPage } from "next";
import Link from "next/link";
import Layout from "@/components/Layout";
import ArticleCard from "@/components/ArticleCard";
import TagBadge from "@/components/TagBadge";
import type { Article } from "@/types/article";
import { fetchByTag } from "@/lib/devto";

interface TagPageProps {
  tag: string;
  articles: Article[];
}

const TagPage: NextPage<TagPageProps> = ({ tag, articles }) => {
  return (
    <Layout title={`#${tag}`}>
      <Link
        href="/"
        className="mb-6 inline-flex items-center gap-1 text-sm text-gray-400 hover:text-emerald-400 transition-colors"
      >
        ← Back to Home
      </Link>

      {/* ── Tag heading ── */}
      <div className="mb-8 flex items-center gap-4">
        {/* WHY: asLink=false because we are already on this tag's page */}
        <TagBadge tag={tag} asLink={false} />
        <h1 className="text-2xl font-bold text-white">
          Articles tagged{" "}
          <span className="text-emerald-400">#{tag}</span>
        </h1>
      </div>

      {articles.length === 0 ? (
        <p className="text-gray-500 text-sm">
          No articles found for tag &ldquo;{tag}&rdquo;.
        </p>
      ) : (
        <>
          <p className="mb-6 text-sm text-gray-500">
            {articles.length} articles
          </p>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {articles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        </>
      )}
    </Layout>
  );
};

// WHY: We seed a handful of popular tags so the most-visited pages are pre-built.
//      Any other tag resolves via fallback: "blocking" (SSR on first hit, cached after).
const SEED_TAGS = [
  "javascript",
  "typescript",
  "webdev",
  "beginners",
  "react",
  "node",
  "python",
  "css",
  "nextjs",
  "opensource",
];

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = SEED_TAGS.map((tag) => ({ params: { tag } }));
  return {
    paths,
    // WHY: blocking means non-seeded tags are server-rendered on first request
    //      then stored as static HTML — better UX than showing a loading skeleton
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps<TagPageProps> = async (context) => {
  const tag = (context.params?.tag as string) ?? "";

  if (!tag) {
    return { notFound: true };
  }

  try {
    const articles = await fetchByTag(tag, 20);
    return {
      props: { tag, articles },
      // WHY: Tag feeds change slowly — 1-day revalidation keeps the CDN cache warm
      //      (no per-visit function invocation / ISR write).
      revalidate: 86400,
    };
  } catch (err) {
    console.error(`getStaticProps /tag/${tag} failed:`, err);
    return { props: { tag, articles: [] }, revalidate: 3600 };
  }
};

export default TagPage;
