// STEP 7: Article detail page — SSR via getServerSideProps
// WHY: The article ID space is effectively unbounded and heavily crawled. SSR renders
//      per request and writes NOTHING to the ISR store. The SSG + fallback:"blocking"
//      alternative caches each page — but on this route that means ONE ISR write per
//      distinct id a crawler touches (plus 404 placeholders for bogus ids), which blew
//      the Vercel free ISR-Writes cap (200K/mo) hard on 2026-07-01. SSR spends the far
//      roomier Function-Invocations budget (1M/mo) instead. Correct tradeoff here.

import type { GetServerSideProps, NextPage } from "next";
import Link from "next/link";
import Layout from "@/components/Layout";
import TagBadge from "@/components/TagBadge";
import type { Article } from "@/types/article";
import { fetchArticleById } from "@/lib/devto";

interface ArticlePageProps {
  article: Article;
}

const ArticlePage: NextPage<ArticlePageProps> = ({ article }) => {
  return (
    <Layout title={article.title}>
      {/* Back navigation */}
      <Link
        href="/"
        className="mb-6 inline-flex items-center gap-1 text-sm text-gray-400 hover:text-emerald-400 transition-colors"
      >
        ← Back to Home
      </Link>

      <article className="mx-auto max-w-3xl">
        {/* Cover image — nullable guard */}
        {/* WHY: plain <img> avoids next/image remotePatterns whitelist issues —
                 DEV.to cover images come from many unpredictable CDN hostnames */}
        {article.cover_image && (
          <div className="mb-8 h-64 w-full overflow-hidden rounded-xl">
            <img
              src={article.cover_image}
              alt={article.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* ── Tags ── */}
        {article.tags && article.tags.length > 0 && (
          <div className="mb-4 flex flex-wrap gap-2">
            {article.tags.map((tag) => (
              <TagBadge key={tag} tag={tag} />
            ))}
          </div>
        )}

        {/* ── Title ── */}
        <h1 className="mb-4 text-3xl font-bold leading-tight text-white md:text-4xl">
          {article.title}
        </h1>

        {/* ── Author bar ── */}
        <div className="mb-8 flex items-center gap-3 rounded-lg border border-gray-800 bg-gray-900 p-4">
          <img
            src={article.user.profile_image_90}
            alt={article.user.name}
            width={44}
            height={44}
            className="rounded-full"
          />
          <div className="flex flex-col">
            {/* WHY: Linking the author name lets readers explore more articles by them */}
            <Link
              href={`/author/${article.user.username}`}
              className="font-semibold text-white hover:text-emerald-400 transition-colors"
            >
              {article.user.name}
            </Link>
            <span className="text-xs text-gray-500">
              {article.readable_publish_date} &bull;{" "}
              {article.reading_time_minutes} min read &bull;{" "}
              ❤ {article.public_reactions_count}
            </span>
          </div>
          {/* External link to original DEV.to article */}
          <a
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-auto rounded-md border border-emerald-700 px-3 py-1.5 text-xs text-emerald-400 hover:bg-emerald-900/40 transition-colors"
          >
            Read on DEV.to ↗
          </a>
        </div>

        {/* ── Article body ── */}
        {article.body_html ? (
          // WHY: dangerouslySetInnerHTML is acceptable here because the content
          //      comes from DEV.to (trusted source) and is already sanitised by them.
          //      The prose-dark class (defined in globals.css) handles all typography.
          <div
            className="prose-dark"
            dangerouslySetInnerHTML={{ __html: article.body_html }}
          />
        ) : (
          <p className="text-gray-400">
            Full article body not available. Read it on{" "}
            <a
              href={article.url}
              className="text-emerald-400 underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              DEV.to
            </a>
            .
          </p>
        )}
      </article>
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps<ArticlePageProps> = async (
  context
) => {
  // WHY: context.params.id is the dynamic segment — could be a string or array,
  //      so we coerce it and validate before calling the API.
  const { id } = context.params as { id: string };

  if (!id || isNaN(Number(id))) {
    return { notFound: true };
  }

  try {
    const article = await fetchArticleById(id);
    return { props: { article } };
  } catch (err) {
    console.error(`getServerSideProps /articles/${id} failed:`, err);
    // WHY: notFound shows Next.js 404 page instead of an error boundary crash.
    return { notFound: true };
  }
};

export default ArticlePage;
