// STEP 9: Author profile page — SSG with getStaticPaths
// WHY: Author pages follow the same SSG+fallback pattern as tag pages.
//      We seed a small list of well-known DEV.to authors to pre-build the most-visited
//      profiles; any other username resolves on-demand via fallback: "blocking".

import type { GetStaticPaths, GetStaticProps, NextPage } from "next";
import Link from "next/link";
import Layout from "@/components/Layout";
import ArticleCard from "@/components/ArticleCard";
import type { Article } from "@/types/article";
import { fetchByAuthor } from "@/lib/devto";

interface AuthorPageProps {
  username: string;
  articles: Article[];
}

const AuthorPage: NextPage<AuthorPageProps> = ({ username, articles }) => {
  // WHY: Pull author data from the first article — avoids a separate /users API call.
  //      If there are no articles we just show the username.
  const author = articles[0]?.user ?? null;

  return (
    <Layout title={author ? author.name : `@${username}`}>
      <Link
        href="/"
        className="mb-6 inline-flex items-center gap-1 text-sm text-gray-400 hover:text-emerald-400 transition-colors"
      >
        ← Back to Home
      </Link>

      {/* ── Author header ── */}
      <div className="mb-10 flex items-center gap-5 rounded-xl border border-gray-800 bg-gray-900 p-6">
        {author ? (
          <>
            <img
              src={author.profile_image}
              alt={author.name}
              width={72}
              height={72}
              className="rounded-full border-2 border-emerald-700"
            />
            <div>
              <h1 className="text-2xl font-bold text-white">{author.name}</h1>
              <p className="text-sm text-gray-400">@{author.username}</p>
              {/* WHY: Conditionally show external links only when the author has set them */}
              <div className="mt-2 flex gap-3">
                {author.twitter_username && (
                  <a
                    href={`https://twitter.com/${author.twitter_username}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-emerald-400 hover:underline"
                  >
                    Twitter
                  </a>
                )}
                {author.github_username && (
                  <a
                    href={`https://github.com/${author.github_username}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-emerald-400 hover:underline"
                  >
                    GitHub
                  </a>
                )}
                {author.website_url && (
                  <a
                    href={author.website_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-emerald-400 hover:underline"
                  >
                    Website
                  </a>
                )}
              </div>
            </div>
            {/* Article count badge */}
            <div className="ml-auto text-center">
              <span className="text-3xl font-bold text-emerald-400">
                {articles.length}
              </span>
              <p className="text-xs text-gray-500">articles</p>
            </div>
          </>
        ) : (
          <h1 className="text-2xl font-bold text-white">@{username}</h1>
        )}
      </div>

      {/* ── Article grid ── */}
      {articles.length === 0 ? (
        <p className="text-gray-500 text-sm">
          No articles found for author &ldquo;{username}&rdquo;.
        </p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      )}
    </Layout>
  );
};

// WHY: We seed a handful of well-known DEV.to community authors.
//      All other usernames are resolved lazily via fallback: "blocking".
const SEED_AUTHORS = ["ben", "jess", "peter", "graciegregory", "devteam"];

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = SEED_AUTHORS.map((username) => ({ params: { username } }));
  return {
    paths,
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps<AuthorPageProps> = async (
  context
) => {
  const username = (context.params?.username as string) ?? "";

  if (!username) {
    return { notFound: true };
  }

  try {
    const articles = await fetchByAuthor(username, 20);
    return {
      props: { username, articles },
      // WHY: Author feeds change infrequently — 10 minutes revalidation is fine
      revalidate: 600,
    };
  } catch (err) {
    console.error(`getStaticProps /author/${username} failed:`, err);
    return { props: { username, articles: [] }, revalidate: 600 };
  }
};

export default AuthorPage;
