import type { Metadata } from "next";
import type { Article } from "@/data/dummy";

/** The public origin, used to build canonical + Open Graph URLs. */
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://nextzeni.com";
export const SITE_NAME = "NextZeni";

/** Recommended limits — the UI warns past these, it never truncates the writer's input. */
export const META_TITLE_LIMIT = 60;
export const META_DESCRIPTION_LIMIT = 160;
export const MAX_TAGS = 10;
export const MAX_TAG_LENGTH = 40;

/**
 * Split a raw text entry into individual tags. Writers paste comma-separated
 * lists as often as they type one tag at a time, so both work.
 */
export function splitTagInput(raw: string): string[] {
  return raw.split(",").map((t) => t.trim()).filter(Boolean);
}

/** Trim, collapse whitespace, drop case-insensitive duplicates, and cap the list. */
export function normalizeTags(tags: string[], max = MAX_TAGS): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const tag of tags) {
    const clean = tag.replace(/\s+/g, " ").trim().slice(0, MAX_TAG_LENGTH);
    if (!clean) continue;
    const key = clean.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(clean);
    if (out.length >= max) break;
  }
  return out;
}

function stripMarkdown(text: string): string {
  return text
    .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/^>\s?/gm, "")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
    .replace(/_([^_]+)_/g, "$1")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/~~([^~]+)~~/g, "$1")
    .replace(/\s+/g, " ")
    .trim();
}

/** Cut to a length limit on a word boundary, with an ellipsis. */
function clamp(text: string, limit: number): string {
  if (text.length <= limit) return text;
  const cut = text.slice(0, limit - 1);
  const lastSpace = cut.lastIndexOf(" ");
  return (lastSpace > limit * 0.6 ? cut.slice(0, lastSpace) : cut).trimEnd() + "…";
}

/** "Jul 17, 2026" → ISO 8601, or undefined when the stored date is unparseable. */
function toIsoDate(date?: string): string | undefined {
  if (!date) return undefined;
  const parsed = new Date(date);
  return Number.isNaN(parsed.getTime()) ? undefined : parsed.toISOString();
}

/** Everything a search engine should index for this story, deduped. */
export function articleKeywords(article: Pick<Article, "tags" | "seoKeywords" | "category">): string[] {
  return normalizeTags(
    [...(article.tags ?? []), ...(article.seoKeywords ?? []), article.category].filter(Boolean) as string[],
    MAX_TAGS * 3,
  );
}

/**
 * Build the <head> metadata for a story. The writer's meta title/description
 * override the on-page title/subtitle; when they're blank we fall back to the
 * visible copy so every story still ships a sensible preview.
 */
export function buildArticleMetadata(article: Article | null, id: string): Metadata {
  const url = `${SITE_URL}/article/${id}`;

  if (!article) {
    return {
      title: `Story not found — ${SITE_NAME}`,
      robots: { index: false, follow: false },
      alternates: { canonical: url },
    };
  }

  const title = article.metaTitle?.trim() || article.title;
  const rawDescription = article.metaDescription?.trim() || article.description || article.content;
  const description = clamp(stripMarkdown(rawDescription), META_DESCRIPTION_LIMIT);
  const keywords = articleKeywords(article);
  const images = article.coverImage ? [{ url: article.coverImage, alt: title }] : undefined;
  const published = article.status === "published";

  return {
    title,
    description,
    keywords: keywords.length ? keywords : undefined,
    authors: article.author ? [{ name: article.author }] : undefined,
    category: article.category,
    alternates: { canonical: url },
    // Drafts, pending and rejected stories stay out of search results.
    robots: published ? undefined : { index: false, follow: false },
    openGraph: {
      type: "article",
      title,
      description,
      url,
      siteName: SITE_NAME,
      images,
      authors: article.author ? [article.author] : undefined,
      publishedTime: toIsoDate(article.date),
      section: article.category,
      tags: article.tags?.length ? article.tags : undefined,
    },
    twitter: {
      card: images ? "summary_large_image" : "summary",
      title,
      description,
      images: images?.map((i) => i.url),
    },
  };
}
