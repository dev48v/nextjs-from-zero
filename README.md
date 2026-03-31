# Day 5 — DEV.to Blog Reader

A dark-themed blog reader built with **Next.js 16**, **TypeScript**, and **Tailwind v4**.
Data comes from the [DEV.to public API](https://dev.to/api) — no API key needed.

## Quickstart

```bash
npm install
npm run dev
# open http://localhost:3000
```

## Pages

| Route | Rendering | Description |
|---|---|---|
| `/` | SSG + ISR (60 s) | Latest 20 articles with client-side search |
| `/articles/[id]` | SSR | Full article with `body_html` rendered |
| `/tag/[tag]` | SSG + ISR (5 min) | Articles filtered by tag |
| `/author/[username]` | SSG + ISR (10 min) | Articles by a specific author |

## Project structure

```
types/
  article.ts          Step 2 — DEV.to TypeScript types
lib/
  devto.ts            Step 3 — API fetch helpers
components/
  Layout.tsx          Step 4 — dark header + footer
  ArticleCard.tsx     Step 5 — article list card
  TagBadge.tsx        Step 5 — clickable tag chip
pages/
  index.tsx           Step 6 — Home (SSG + search)
  articles/[id].tsx   Step 7 — Article detail (SSR)
  tag/[tag].tsx       Step 8 — Tag filter (SSG)
  author/[username].tsx Step 9 — Author profile (SSG)
styles/
  globals.css         Dark theme base + prose styles
```

## Step-by-step guide

1. **Types** (`types/article.ts`) — define the `Article` and `ArticleUser` interfaces
   matching the DEV.to API response shape.

2. **API lib** (`lib/devto.ts`) — four thin functions (`fetchArticles`,
   `fetchArticleById`, `fetchByTag`, `fetchByAuthor`) all sharing one `devtoFetch`
   wrapper for error handling.

3. **Layout** — sticky dark header with nav links; footer with attribution.

4. **ArticleCard** — cover image (nullable), title, description, tags, author avatar,
   reactions, read time.  Uses `next/image` for cover and a plain `<img>` for avatar
   (external CDN with unknown dimensions).

5. **Home page** — `getStaticProps` fetches 20 articles at build time with
   `revalidate: 60`.  Client-side `useMemo` filters by title/tag as the user types.

6. **Article detail** — `getServerSideProps` fetches the single article (has
   `body_html`) on every request; renders it with `dangerouslySetInnerHTML` inside
   `.prose-dark` (custom CSS class in `globals.css`).

7. **Tag page** — `getStaticPaths` seeds 10 popular tags; `fallback: "blocking"`
   handles the long tail.

8. **Author page** — same pattern; author info is derived from the first article
   returned so no extra `/users` call is needed.

## DEV.to API endpoints used

```
GET https://dev.to/api/articles?per_page=20
GET https://dev.to/api/articles/{id}
GET https://dev.to/api/articles?tag={tag}&per_page=20
GET https://dev.to/api/articles?username={username}&per_page=20
```

## Tech choices

- **Tailwind v4** — uses `@import "tailwindcss"` (no config file needed)
- **Pages Router** — demonstrates `getStaticProps`, `getServerSideProps`, `getStaticPaths`
- **TypeScript strict** — all types defined in `types/article.ts`
- **ISR** — stale-while-revalidate so content stays fresh without full rebuilds
