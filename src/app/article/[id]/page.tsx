import type { Metadata } from "next";

import ArticleView from "./ArticleView";
import { ARTICLE_UNAVAILABLE, getArticle } from "@/lib/serverArticle";
import { buildArticleMetadata } from "@/lib/seo";

type Props = { params: Promise<{ id: string }> };

/**
 * Server-rendered <head> for the story: the writer's meta title, description
 * and tags land here, plus the Open Graph / Twitter preview. The story itself
 * stays a client component below.
 */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const article = await getArticle(id);
  // Couldn't reach Firestore: fall back to the site-wide metadata rather than
  // telling crawlers a live story is missing.
  if (article === ARTICLE_UNAVAILABLE) return {};
  return buildArticleMetadata(article, id);
}

export default function ArticlePage() {
  return <ArticleView />;
}
