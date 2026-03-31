// STEP 5a: TagBadge — clickable tag chip that links to /tag/[tag]
// WHY: Extracting this into its own component means ArticleCard, the tag page,
//      and the article detail page all render tags identically without duplication.

import Link from "next/link";

interface TagBadgeProps {
  tag: string;
  // WHY: Some callers (tag detail page heading) want a non-link badge — support that
  asLink?: boolean;
}

export default function TagBadge({ tag, asLink = true }: TagBadgeProps) {
  const classes =
    "inline-block rounded-full bg-gray-800 px-3 py-0.5 text-xs font-medium text-emerald-400 hover:bg-gray-700 transition-colors";

  if (!asLink) {
    return <span className={classes}>#{tag}</span>;
  }

  return (
    // WHY: Wrapping the Link around the span (rather than using <a>) keeps
    //      Next.js client-side routing working even inside server-rendered pages.
    <Link href={`/tag/${encodeURIComponent(tag)}`} className={classes}>
      #{tag}
    </Link>
  );
}
