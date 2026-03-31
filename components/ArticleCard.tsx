// STEP 5b: ArticleCard — card UI for a single article in list views
// WHY: Cards are used on Home, Tag pages, and Author pages — one component
//      ensures visual consistency and makes style tweaks a single-file change.

import Link from "next/link";
import type { Article } from "@/types/article";
import TagBadge from "@/components/TagBadge";

interface ArticleCardProps {
  article: Article;
}

export default function ArticleCard({ article }: ArticleCardProps) {
  return (
    <article className="flex flex-col rounded-xl border border-gray-800 bg-gray-900 overflow-hidden hover:border-emerald-800 transition-colors">
      {/* Cover image — gracefully skipped when null */}
      {article.cover_image ? (
        <div className="relative h-48 w-full overflow-hidden">
          {/* WHY: plain <img> avoids next/image remotePatterns whitelist issues —
                   DEV.to serves cover images from many unpredictable CDN hostnames */}
          <img
            src={article.cover_image}
            alt={article.title}
            className="w-full h-full object-cover"
          />
        </div>
      ) : (
        // WHY: Placeholder keeps card height consistent even without a cover image
        <div className="h-2 w-full bg-gradient-to-r from-emerald-900 to-gray-800" />
      )}

      <div className="flex flex-1 flex-col gap-3 p-5">
        {/* ── Tags row ── */}
        {article.tags && article.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {/* WHY: Slice to 3 so the card doesn't overflow with many tags */}
            {article.tags.slice(0, 3).map((tag) => (
              <TagBadge key={tag} tag={tag} />
            ))}
          </div>
        )}

        {/* ── Title ── */}
        <Link href={`/articles/${article.id}`}>
          <h2 className="text-lg font-semibold leading-snug text-white hover:text-emerald-400 transition-colors line-clamp-2">
            {article.title}
          </h2>
        </Link>

        {/* ── Description ── */}
        <p className="text-sm text-gray-400 line-clamp-2 flex-1">
          {article.description}
        </p>

        {/* ── Footer row: author + meta ── */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-800">
          {/* Author */}
          <Link
            href={`/author/${article.user.username}`}
            className="flex items-center gap-2 group"
          >
            {/* WHY: author avatar uses a regular <img> tag because it comes from
                     an external domain that may not be in next.config domains list */}
            <img
              src={article.user.profile_image_90}
              alt={article.user.name}
              width={28}
              height={28}
              className="rounded-full"
            />
            <span className="text-xs text-gray-400 group-hover:text-emerald-400 transition-colors">
              {article.user.name}
            </span>
          </Link>

          {/* Meta: reactions + read time */}
          <div className="flex items-center gap-3 text-xs text-gray-500">
            <span title="Reactions">
              ❤ {article.public_reactions_count}
            </span>
            <span>{article.reading_time_minutes} min read</span>
          </div>
        </div>
      </div>
    </article>
  );
}
