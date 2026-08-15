"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, ArrowRight, Heart, Eye } from "lucide-react";
import { Article } from "@/data/dummy";
import SmartImage from "@/components/SmartImage";

const AUTOPLAY_MS = 6000;

function formatNum(n: number) {
  if (n >= 1000) return (n / 1000).toFixed(1).replace(/\.0$/, "") + "K";
  return String(n);
}

interface Props {
  articles: Article[];
  likedIds?: string[];
  onLike: (id: string) => void;
}

export default function FeaturedSlider({ articles, likedIds = [], onLike }: Props) {
  const [rawIndex, setRawIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const touchStartX = useRef<number | null>(null);

  const count = articles.length;
  // Derived, so a shrinking article list can never leave us on a dead slide
  const index = count ? rawIndex % count : 0;

  const goTo = useCallback((i: number) => {
    if (count === 0) return;
    setRawIndex(((i % count) + count) % count);
  }, [count]);

  const next = useCallback(() => goTo(index + 1), [goTo, index]);
  const prev = useCallback(() => goTo(index - 1), [goTo, index]);

  // Respect the reader's motion preference — no autoplay for them
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setReduceMotion(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  // Autoplay
  useEffect(() => {
    if (paused || reduceMotion || count < 2) return;
    const t = setTimeout(() => goTo(index + 1), AUTOPLAY_MS);
    return () => clearTimeout(t);
  }, [index, paused, reduceMotion, count, goTo]);

  if (count === 0) return null;

  const mostClapped = articles.reduce((a, b) => (b.claps > a.claps ? b : a));

  function badgeFor(article: Article, i: number) {
    if (i === 0) return "Latest";
    if (article.id === mostClapped.id) return "Trending";
    return null;
  }

  return (
    <section
      className="mb-12"
      aria-roledescription="carousel"
      aria-label="Featured stories"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") { e.preventDefault(); next(); }
        if (e.key === "ArrowLeft") { e.preventDefault(); prev(); }
      }}
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-accent">
          Fresh on NextZeni
        </h2>
        <span className="text-xs text-secondary tabular-nums">
          {String(index + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}
        </span>
      </div>

      <div className="relative rounded-2xl border border-border overflow-hidden group">
        {/* ── Track ── */}
        <div
          className="flex transition-transform duration-500 ease-out motion-reduce:transition-none"
          style={{ transform: `translateX(-${index * 100}%)` }}
          onTouchStart={(e) => { touchStartX.current = e.touches[0].clientX; }}
          onTouchEnd={(e) => {
            if (touchStartX.current === null) return;
            const delta = e.changedTouches[0].clientX - touchStartX.current;
            if (Math.abs(delta) > 50) (delta < 0 ? next : prev)();
            touchStartX.current = null;
          }}
        >
          {articles.map((article, i) => {
            const badge = badgeFor(article, i);
            const liked = likedIds.includes(article.id);
            return (
              <div
                key={article.id}
                className="w-full flex-shrink-0"
                aria-hidden={i !== index}
                inert={i !== index}
              >
                {/* Cover */}
                <Link
                  href={`/article/${article.id}`}
                  tabIndex={i === index ? undefined : -1}
                  className="block relative h-[200px] sm:h-[280px] bg-secondary/6 overflow-hidden"
                >
                  <SmartImage
                    src={article.coverImage}
                    className="w-full h-full object-cover"
                    loading={i === 0 ? "eager" : "lazy"}
                    fallback={
                      <span className="w-full h-full flex items-center justify-center bg-gradient-to-br from-accent/10 via-secondary/5 to-transparent">
                        <span className="serif text-[120px] leading-none font-bold text-accent/15 select-none">
                          {article.title[0]}
                        </span>
                      </span>
                    }
                  />


                  <div className="absolute top-4 left-4 flex items-center gap-2">
                    <span className="bg-white/95 backdrop-blur-sm text-foreground text-[11px] font-semibold px-3 py-1 rounded-full shadow-sm">
                      {article.category}
                    </span>
                    {badge && (
                      <span className="bg-accent text-white text-[11px] font-semibold px-3 py-1 rounded-full shadow-sm">
                        {badge}
                      </span>
                    )}
                  </div>
                </Link>

                {/* Body */}
                <div className="p-6 sm:p-8">
                  <div className="flex items-center gap-2 mb-4 text-sm">
                    <Link
                      href={`/profile/${article.authorId}`}
                      tabIndex={i === index ? undefined : -1}
                      className="flex items-center gap-2 hover:opacity-85 transition-opacity"
                    >
                      <div className="w-6 h-6 rounded-full bg-accent/15 flex items-center justify-center text-[11px] font-bold text-accent">
                        {article.author[0]?.toUpperCase()}
                      </div>
                      <span className="font-medium text-foreground hover:text-accent transition-colors">
                        {article.author}
                      </span>
                    </Link>
                    <span className="text-secondary">·</span>
                    <span className="text-secondary">{article.date}</span>
                  </div>

                  <Link
                    href={`/article/${article.id}`}
                    tabIndex={i === index ? undefined : -1}
                    className="block"
                  >
                    <h3 className="serif text-2xl sm:text-3xl md:text-4xl font-bold leading-tight tracking-tight mb-3 hover:underline underline-offset-4 decoration-1">
                      {article.title}
                    </h3>
                    <p className="text-secondary text-base sm:text-lg leading-relaxed mb-6 line-clamp-2">
                      {article.description}
                    </p>
                  </Link>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-secondary">{article.readingTime}</span>
                      <button
                        onClick={() => onLike(article.id)}
                        tabIndex={i === index ? undefined : -1}
                        className={`flex items-center gap-1 text-xs transition-colors cursor-pointer ${
                          liked ? "text-accent font-semibold" : "text-secondary hover:text-foreground"
                        }`}
                        title={liked ? "Unlike this story" : "Like this story"}
                      >
                        <Heart size={12} fill={liked ? "currentColor" : "none"} />{" "}
                        {formatNum(article.claps)}
                      </button>
                      <span className="flex items-center gap-1 text-xs text-secondary/70">
                        <Eye size={12} /> {formatNum(article.views ?? 0)}
                      </span>
                    </div>
                    <Link
                      href={`/article/${article.id}`}
                      tabIndex={i === index ? undefined : -1}
                      className="text-sm text-accent font-medium flex items-center gap-1.5 hover:gap-2.5 transition-all"
                    >
                      Read <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ── Arrows ── */}
        {count > 1 && (
          <>
            <button
              onClick={prev}
              aria-label="Previous story"
              className="absolute left-3 top-[100px] sm:top-[140px] -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm border border-border shadow-sm flex items-center justify-center text-foreground hover:bg-white transition-all opacity-0 group-hover:opacity-100 focus-visible:opacity-100 max-sm:opacity-100 cursor-pointer"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={next}
              aria-label="Next story"
              className="absolute right-3 top-[100px] sm:top-[140px] -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm border border-border shadow-sm flex items-center justify-center text-foreground hover:bg-white transition-all opacity-0 group-hover:opacity-100 focus-visible:opacity-100 max-sm:opacity-100 cursor-pointer"
            >
              <ChevronRight size={18} />
            </button>
          </>
        )}
      </div>

      {/* ── Dots ── */}
      {count > 1 && (
        <div className="flex items-center justify-center gap-2 mt-4">
          {articles.map((article, i) => (
            <button
              key={article.id}
              onClick={() => goTo(i)}
              aria-label={`Go to story ${i + 1}: ${article.title}`}
              aria-current={i === index}
              className={`h-1.5 rounded-full transition-all cursor-pointer ${
                i === index ? "w-7 bg-accent" : "w-1.5 bg-secondary/25 hover:bg-secondary/50"
              }`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
