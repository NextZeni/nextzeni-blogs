"use client";

import { useState, useMemo } from "react";
import { useBlogs } from "@/context/BlogContext";
import { useAuth } from "@/context/AuthContext";
import { Bookmark, Search, Heart, PenLine, ArrowRight, LayoutDashboard, ShieldCheck, Eye } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

function formatNum(n: number) {
  if (n >= 1000) return (n / 1000).toFixed(1).replace(/\.0$/, "") + "K";
  return String(n);
}

export default function Home() {
  const { blogs, categories, incrementClaps, decrementClaps } = useBlogs();
  const { user, logout, toggleSaveArticle, toggleLikeArticle } = useAuth();
  const router = useRouter();

  function handleLikeArticle(articleId: string) {
    if (!user) {
      router.push("/auth/login");
      return;
    }
    const isNowLiked = toggleLikeArticle(articleId);
    if (isNowLiked) {
      incrementClaps(articleId).catch(console.error);
    } else {
      decrementClaps(articleId).catch(console.error);
    }
  }
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return blogs.filter((b) => {
      if (b.status !== "published") return false;
      const matchCat = !activeCategory || b.category === activeCategory;
      const matchSearch =
        !q ||
        b.title.toLowerCase().includes(q) ||
        b.description.toLowerCase().includes(q) ||
        b.author.toLowerCase().includes(q);
      return matchCat && matchSearch;
    });
  }, [blogs, activeCategory, search]);

  // Group filtered articles by category (preserve categories order)
  const grouped = useMemo(() => {
    const map = new Map<string, typeof filtered>();
    for (const cat of categories) {
      const articles = filtered.filter((b) => b.category === cat);
      if (articles.length) map.set(cat, articles);
    }
    // catch any category not in categories list
    for (const b of filtered) {
      if (!categories.includes(b.category) && !map.has(b.category)) {
        map.set(b.category, filtered.filter((x) => x.category === b.category));
      }
    }
    return map;
  }, [filtered, categories]);

  const usedCategories = useMemo(() => {
    return categories.filter((c) =>
      blogs.some((b) => b.category === c && b.status === "published")
    );
  }, [categories, blogs]);

  // Featured = most claps among all blogs
  const featured = useMemo(() =>
    [...blogs].sort((a, b) => b.claps - a.claps)[0] ?? null
  , [blogs]);

  const showFeatured = !activeCategory && !search && featured;

  return (
    <div className="min-h-screen">
      {/* ── Header ── */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-border">
        <div className="max-w-[1200px] mx-auto px-6 h-16 flex items-center justify-between gap-6">
          <Link href="/" className="text-2xl font-extrabold tracking-tighter flex-shrink-0 flex items-baseline gap-0">
            <span className="font-light text-secondary">Next</span><span className="text-foreground">Zeni</span>
          </Link>

          <div className="hidden md:flex flex-1 max-w-sm">
            <div className="relative w-full">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary" />
              <input
                type="text"
                placeholder="Search stories, topics, authors…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-sm bg-secondary/8 rounded-full border-0 outline-none focus:ring-1 focus:ring-border placeholder:text-secondary/40"
              />
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-5 text-sm font-medium">
            <Link href="/tools" className="text-secondary hover:text-foreground transition-colors">
              Tools
            </Link>
            <Link
              href="/write"
              className="flex items-center gap-1.5 text-secondary hover:text-foreground transition-colors"
            >
              <PenLine size={16} />
              Write
            </Link>
            {user?.role === "admin" && (
              <Link
                href="/admin/blogs"
                className="flex items-center gap-1.5 text-secondary hover:text-foreground transition-colors"
              >
                <ShieldCheck size={16} />
                Review
              </Link>
            )}
            {user && user.role !== "admin" && (
              <Link
                href="/dashboard"
                className="flex items-center gap-1.5 text-secondary hover:text-foreground transition-colors"
              >
                <LayoutDashboard size={16} />
                Dashboard
              </Link>
            )}
            {user ? (
              <div className="flex items-center gap-3">
                <Link
                  href={user.role === "admin" ? "/admin/blogs" : "/dashboard"}
                  className="bg-button text-white px-5 py-2 rounded-full hover:bg-button/90 transition-colors font-medium text-sm flex items-center justify-center"
                >
                  {user.firstName}
                </Link>
                <button
                  onClick={() => logout()}
                  className="text-secondary hover:text-red-500 font-medium text-sm transition-colors px-3 py-1.5 cursor-pointer"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <Link
                href="/auth/login"
                className="bg-button text-white px-5 py-2 rounded-full hover:bg-button/90 transition-colors font-medium text-sm flex items-center justify-center"
              >
                Sign In
              </Link>
            )}
          </nav>

          <Link href="/write" className="md:hidden p-1 text-foreground">
            <PenLine size={20} />
          </Link>
        </div>
      </header>

      <div className="max-w-[1200px] mx-auto px-6 pt-8 pb-28 flex gap-14">
        {/* ── Feed ── */}
        <main className="flex-1 min-w-0 max-w-[720px]">

          {/* ── Category filter tabs ── */}
          <div className="flex gap-2 flex-wrap mb-8 pb-5 border-b border-border">
            <button
              onClick={() => setActiveCategory(null)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
                !activeCategory
                  ? "bg-button text-white"
                  : "bg-secondary/8 text-secondary hover:bg-secondary/15"
              }`}
            >
              All
            </button>
            {usedCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(activeCategory === cat ? null : cat)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
                  activeCategory === cat
                    ? "bg-button text-white"
                    : "bg-secondary/8 text-secondary hover:bg-secondary/15"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* ── No results ── */}
          {filtered.length === 0 && (
            <div className="py-24 text-center">
              <p className="text-secondary mb-3">No stories match your search.</p>
              <button
                onClick={() => { setSearch(""); setActiveCategory(null); }}
                className="text-sm text-accent hover:underline"
              >
                Clear filters
              </button>
            </div>
          )}

          {/* ── Featured hero (only on "All" with no search) ── */}
          {showFeatured && (
            <Link href={`/article/${featured.id}`} className="block group mb-12">
              <div className="rounded-2xl border border-border p-8 hover:border-foreground/20 transition-colors">
                <div className="flex items-center gap-2 mb-5 text-sm">
                  <div className="w-6 h-6 rounded-full bg-accent/15 flex items-center justify-center text-[11px] font-bold text-accent">
                    {featured.author[0]?.toUpperCase()}
                  </div>
                  <span className="font-medium">{featured.author}</span>
                  <span className="text-secondary">·</span>
                  <span className="text-secondary">{featured.date}</span>
                  <span className="ml-auto bg-accent/10 text-accent text-xs font-semibold px-3 py-0.5 rounded-full">
                    Featured
                  </span>
                </div>
                <h2 className="serif text-3xl md:text-4xl font-bold leading-tight tracking-tight mb-3 group-hover:underline underline-offset-4 decoration-1">
                  {featured.title}
                </h2>
                <p className="text-secondary text-lg leading-relaxed mb-6 line-clamp-3">
                  {featured.description}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="bg-secondary/8 px-3 py-1 rounded-full text-xs font-medium text-secondary">
                      {featured.category}
                    </span>
                    <span className="text-xs text-secondary">{featured.readingTime}</span>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        handleLikeArticle(featured.id);
                      }}
                      className={`flex items-center gap-1 text-xs transition-colors cursor-pointer ${
                        user?.likedArticles?.includes(featured.id)
                          ? "text-accent font-semibold"
                          : "text-secondary hover:text-foreground"
                      }`}
                      title={user ? (user.likedArticles?.includes(featured.id) ? "Unlike this story" : "Like this story") : "Sign in to like"}
                    >
                      <Heart
                        size={12}
                        fill={user?.likedArticles?.includes(featured.id) ? "currentColor" : "none"}
                      />{" "}
                      {formatNum(featured.claps)}
                    </button>
                    <span className="flex items-center gap-1 text-xs text-secondary/70">
                      <Eye size={12} /> {formatNum(featured.views ?? 0)}
                    </span>
                  </div>
                  <span className="text-sm text-accent font-medium flex items-center gap-1.5 group-hover:gap-2.5 transition-all">
                    Read <ArrowRight size={14} />
                  </span>
                </div>
              </div>
            </Link>
          )}

          {/* ── Category-wise sections ── */}
          {Array.from(grouped.entries()).map(([cat, articles]) => (
            <section key={cat} className="mb-12">
              {/* Category heading — only show when "All" or multiple categories */}
              {(!activeCategory || grouped.size > 1) && (
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-xs font-semibold uppercase tracking-widest text-accent">
                    {cat}
                  </h2>
                  {!activeCategory && (
                    <button
                      onClick={() => setActiveCategory(cat)}
                      className="text-xs text-accent hover:underline"
                    >
                      See all
                    </button>
                  )}
                </div>
              )}

              <div className="divide-y divide-border border-t border-border">
                {articles.map((article) => (
                  <article key={article.id} className="group py-6">
                    <div className="flex gap-5 items-start">
                      <div className="flex-1 min-w-0">
                        {/* Author */}
                        <div className="flex items-center gap-2 mb-2.5 text-sm">
                          <div className="w-5 h-5 rounded-full bg-secondary/15 flex items-center justify-center text-[10px] font-bold flex-shrink-0">
                            {article.author[0]?.toUpperCase()}
                          </div>
                          <span className="font-medium text-sm">{article.author}</span>
                          <span className="text-secondary/60">·</span>
                          <span className="text-secondary text-xs">{article.date}</span>
                        </div>

                        {/* Title + description */}
                        <Link href={`/article/${article.id}`} className="block">
                          <h3 className="serif text-lg font-bold mb-1 leading-snug group-hover:underline underline-offset-4 decoration-1">
                            {article.title}
                          </h3>
                          <p className="text-secondary text-sm line-clamp-2 mb-3 leading-relaxed">
                            {article.description}
                          </p>
                        </Link>

                        {/* Meta */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-secondary">{article.readingTime}</span>
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                handleLikeArticle(article.id);
                              }}
                              className={`flex items-center gap-1 text-xs transition-colors cursor-pointer ${
                                user?.likedArticles?.includes(article.id)
                                  ? "text-accent font-semibold"
                                  : "text-secondary hover:text-foreground"
                              }`}
                              title={user ? (user.likedArticles?.includes(article.id) ? "Unlike this story" : "Like this story") : "Sign in to like"}
                            >
                              <Heart
                                size={11}
                                fill={user?.likedArticles?.includes(article.id) ? "currentColor" : "none"}
                              />{" "}
                              {formatNum(article.claps)}
                            </button>
                            <span className="flex items-center gap-1 text-xs text-secondary/70">
                              <Eye size={11} /> {formatNum(article.views ?? 0)}
                            </span>
                          </div>
                          <button
                            onClick={() => toggleSaveArticle(article.id)}
                            disabled={!user}
                            className={`transition-colors opacity-0 group-hover:opacity-100 cursor-pointer ${
                              user?.savedArticles?.includes(article.id)
                                ? "text-accent"
                                : "text-secondary hover:text-foreground"
                            }`}
                            title={user ? (user.savedArticles?.includes(article.id) ? "Remove bookmark" : "Bookmark this story") : "Sign in to bookmark"}
                          >
                            <Bookmark
                              size={16}
                              fill={user?.savedArticles?.includes(article.id) ? "currentColor" : "none"}
                            />
                          </button>
                        </div>
                      </div>

                      {/* Thumbnail */}
                      <Link
                        href={`/article/${article.id}`}
                        className="hidden sm:flex w-20 h-14 flex-shrink-0 rounded-lg bg-secondary/6 hover:bg-secondary/12 transition-colors items-center justify-center overflow-hidden"
                      >
                        {article.coverImage ? (
                          <img
                            src={article.coverImage}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="serif text-3xl font-bold text-secondary/15 select-none">
                            {article.title[0]}
                          </span>
                        )}
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          ))}
        </main>

        {/* ── Sidebar ── */}
        <aside className="hidden lg:block w-[250px] flex-shrink-0">
          <div className="sticky top-24 space-y-10">

            {/* Write CTA */}
            <div className="p-5 border border-border rounded-2xl">
              <h3 className="font-bold text-sm mb-1.5">Write your story</h3>
              <p className="text-sm text-secondary leading-relaxed mb-4">
                Publish instantly. No sign-up. Stories live in your browser.
              </p>
              <Link
                href="/write"
                className="flex items-center justify-center gap-2 w-full bg-button text-white text-sm font-medium py-2.5 rounded-full hover:bg-button/90 transition-colors"
              >
                <PenLine size={14} />
                New story
              </Link>
            </div>

            {/* Topics */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-accent mb-4">
                Explore topics
              </p>
              <div className="flex flex-wrap gap-2">
                {usedCategories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(activeCategory === cat ? null : cat)}
                    className={`px-3.5 py-1.5 rounded-full text-sm font-medium transition-colors ${
                      activeCategory === cat
                        ? "bg-button text-white"
                        : "bg-secondary/8 text-foreground hover:bg-secondary/15"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="text-xs text-secondary/40 leading-relaxed">
              <div className="flex flex-wrap gap-x-3 gap-y-1 mb-2">
                {["Help", "About", "Privacy", "Terms"].map((l) => (
                  <a key={l} href="#" className="hover:text-secondary transition-colors">{l}</a>
                ))}
              </div>
              <p>© 2026 NextZeni</p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
