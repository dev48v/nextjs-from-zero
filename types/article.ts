// STEP 2: TypeScript types for DEV.to API responses
// WHY: Centralising types here means every page and component shares the same
//      shape — if the API changes, we fix it in one place, not scattered across files.

export interface ArticleUser {
  name: string;
  username: string;
  twitter_username: string | null;
  github_username: string | null;
  // WHY: website_url can be absent on some accounts — make it nullable
  website_url: string | null;
  profile_image: string;
  profile_image_90: string;
}

export interface ArticleTag {
  // DEV.to returns tags as plain strings in the tags_list field,
  // but the tag_list field is a string[] we define here for convenience
  name: string;
}

export interface Article {
  id: number;
  title: string;
  description: string;
  // WHY: cover_image is frequently null — guard against this everywhere
  cover_image: string | null;
  social_image: string;
  readable_publish_date: string;
  slug: string;
  path: string;
  url: string;
  comments_count: number;
  public_reactions_count: number;
  // WHY: reading_time_minutes is an int provided by DEV.to so we don't have to compute it
  reading_time_minutes: number;
  // tag_list is a comma-separated string; tags is a string array parsed from it
  tag_list: string;
  tags: string[];
  user: ArticleUser;
  // WHY: body_html is only present on the single-article endpoint, mark optional
  body_html?: string;
  body_markdown?: string;
  published_at: string;
  // WHY: canonical_url may differ from DEV.to url (cross-posted articles)
  canonical_url: string;
}
