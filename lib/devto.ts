// STEP 3: DEV.to API utility — all fetch helpers live here
// WHY: Isolating network calls in a lib/ module keeps pages thin and makes
//      it trivial to swap the data source (e.g., mock in tests) without touching UI.

import type { Article } from "@/types/article";

const BASE_URL = "https://dev.to/api";

// WHY: A shared fetch wrapper lets us add headers, error handling, or caching
//      in a single place rather than repeating try/catch in every page.
async function devtoFetch<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: {
      // DEV.to public API works without a key, but setting Accept is good practice
      Accept: "application/json",
    },
  });

  if (!res.ok) {
    throw new Error(
      `DEV.to API error: ${res.status} ${res.statusText} — path: ${path}`
    );
  }

  return res.json() as Promise<T>;
}

// WHY: DEV.to API is inconsistent — tag_list can be a comma-separated string
//      ("javascript,react,webdev") or a pre-split array depending on the endpoint.
//      Normalise to string[] here so every consumer always gets a clean array.
function normaliseArticle(raw: Article): Article {
  let tags: string[] = [];
  const tl = raw.tag_list as unknown;
  if (Array.isArray(tl)) {
    tags = tl as string[];
  } else if (typeof tl === "string" && tl) {
    tags = tl.split(",").map((t) => t.trim()).filter(Boolean);
  }
  return { ...raw, tags };
}

function normaliseMany(raw: Article[]): Article[] {
  return raw.map(normaliseArticle);
}

/**
 * Fetch the latest articles.
 * WHY: per_page=20 gives a reasonable first page without hammering the free API.
 */
export async function fetchArticles(perPage = 20): Promise<Article[]> {
  const raw = await devtoFetch<Article[]>(`/articles?per_page=${perPage}`);
  return normaliseMany(raw);
}

/**
 * Fetch a single article by its numeric ID.
 * WHY: SSR pages need the full article including body_html which is only on /articles/{id}.
 */
export async function fetchArticleById(id: number | string): Promise<Article> {
  const raw = await devtoFetch<Article>(`/articles/${id}`);
  return normaliseArticle(raw);
}

/**
 * Fetch articles for a given tag.
 * WHY: Tag pages use SSG; at build time we generate one static page per known tag.
 */
export async function fetchByTag(
  tag: string,
  perPage = 20
): Promise<Article[]> {
  const raw = await devtoFetch<Article[]>(
    `/articles?tag=${encodeURIComponent(tag)}&per_page=${perPage}`
  );
  return normaliseMany(raw);
}

/**
 * Fetch articles by a specific author username.
 * WHY: Author pages are also statically generated — this keeps the author endpoint
 *      consistent with the same per_page convention used elsewhere.
 */
export async function fetchByAuthor(
  username: string,
  perPage = 20
): Promise<Article[]> {
  const raw = await devtoFetch<Article[]>(
    `/articles?username=${encodeURIComponent(username)}&per_page=${perPage}`
  );
  return normaliseMany(raw);
}
