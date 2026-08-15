import { cache } from "react";
import type { Article } from "@/data/dummy";

/**
 * Server-side read of a single story.
 *
 * The app talks to Firestore through the client SDK everywhere else, but
 * `generateMetadata` runs on the server before any of that mounts — so the
 * REST endpoint is used here to get the story into <head> for crawlers, which
 * never execute our JavaScript.
 */
const PROJECT_ID = "nextzeni";
const REST_BASE = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents`;

interface FirestoreValue {
  stringValue?: string;
  integerValue?: string;
  doubleValue?: number;
  booleanValue?: boolean;
  nullValue?: null;
  timestampValue?: string;
  arrayValue?: { values?: FirestoreValue[] };
  mapValue?: { fields?: Record<string, FirestoreValue> };
}

function decodeValue(value: FirestoreValue): unknown {
  if (value.stringValue !== undefined) return value.stringValue;
  if (value.integerValue !== undefined) return Number(value.integerValue);
  if (value.doubleValue !== undefined) return value.doubleValue;
  if (value.booleanValue !== undefined) return value.booleanValue;
  if (value.timestampValue !== undefined) return value.timestampValue;
  if (value.arrayValue !== undefined) return (value.arrayValue.values ?? []).map(decodeValue);
  if (value.mapValue !== undefined) return decodeFields(value.mapValue.fields ?? {});
  return undefined;
}

function decodeFields(fields: Record<string, FirestoreValue>): Record<string, unknown> {
  return Object.fromEntries(Object.entries(fields).map(([k, v]) => [k, decodeValue(v)]));
}

/**
 * Returned when Firestore couldn't be reached at all — distinct from a story
 * that genuinely doesn't exist, so a blip never marks live stories `noindex`.
 */
export const ARTICLE_UNAVAILABLE = Symbol("article-unavailable");
export type ArticleLookup = Article | null | typeof ARTICLE_UNAVAILABLE;

/**
 * Cached per request so `generateMetadata` and the page share one fetch.
 * Metadata is best-effort: this never throws.
 */
export const getArticle = cache(async (id: string): Promise<ArticleLookup> => {
  try {
    const res = await fetch(`${REST_BASE}/articles/${encodeURIComponent(id)}`, {
      next: { revalidate: 60 },
    });
    if (res.status === 404) return null;
    if (!res.ok) return ARTICLE_UNAVAILABLE;
    const doc = (await res.json()) as { fields?: Record<string, FirestoreValue> };
    if (!doc.fields) return null;
    return { id, ...decodeFields(doc.fields) } as Article;
  } catch (err) {
    console.error("Metadata fetch failed for article", id, err);
    return ARTICLE_UNAVAILABLE;
  }
});
