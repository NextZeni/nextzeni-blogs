/**
 * Page-level shimmer skeletons.
 *
 * Each one mirrors the real layout of its screen (same widths, same rhythm)
 * so content swaps in without the page jumping. Used both as in-page loading
 * states and as route-level `loading.tsx` fallbacks.
 */

import { Skeleton, SkeletonCircle, SkeletonText, SkeletonChips, SkeletonRegion } from "./Skeleton";

/* ────────────────────────── shared pieces ────────────────────────── */

/** Neutral top bar used by route-level fallbacks (real headers need context). */
export function HeaderSkeleton({ maxWidth = "max-w-[1200px]" }: { maxWidth?: string }) {
  return (
    <div className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-border">
      <div className={`${maxWidth} mx-auto px-6 h-16 flex items-center justify-between gap-6`}>
        <Skeleton className="h-6 w-28" />
        <Skeleton className="hidden md:block h-8 w-full max-w-sm rounded-full" />
        <div className="flex items-center gap-4">
          <Skeleton className="hidden md:block h-4 w-14" />
          <Skeleton className="hidden md:block h-4 w-14" />
          <Skeleton className="h-9 w-24 rounded-full" />
        </div>
      </div>
    </div>
  );
}

/* ────────────────────────── home feed ────────────────────────── */

export function FeaturedCardSkeleton() {
  return (
    <div className="rounded-2xl border border-border p-8 mb-12">
      <div className="flex items-center gap-2 mb-5">
        <SkeletonCircle className="w-6 h-6" />
        <Skeleton className="h-3.5 w-28" />
        <Skeleton className="h-3.5 w-20" />
        <Skeleton className="h-5 w-20 rounded-full ml-auto" />
      </div>
      <Skeleton className="h-9 w-11/12 mb-3" />
      <Skeleton className="h-9 w-7/12 mb-5" />
      <SkeletonText lines={2} lineClassName="h-4" lastLineWidth="w-5/6" className="mb-6" />
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Skeleton className="h-6 w-24 rounded-full" />
          <Skeleton className="h-3.5 w-16" />
          <Skeleton className="h-3.5 w-10" />
        </div>
        <Skeleton className="h-4 w-16" />
      </div>
    </div>
  );
}

export function ArticleRowSkeleton() {
  return (
    <div className="py-6">
      <div className="flex gap-5 items-start">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2.5">
            <SkeletonCircle className="w-5 h-5" />
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-3 w-16" />
          </div>
          <Skeleton className="h-5 w-10/12 mb-2" />
          <SkeletonText lines={2} lineClassName="h-3" lastLineWidth="w-1/2" className="mb-3" />
          <div className="flex items-center gap-3">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-3 w-10" />
            <Skeleton className="h-3 w-10" />
          </div>
        </div>
        <Skeleton className="hidden sm:block w-20 h-14 flex-shrink-0" />
      </div>
    </div>
  );
}

export function FeedSkeleton({ withFeatured = true, sections = 2 }: { withFeatured?: boolean; sections?: number }) {
  return (
    <SkeletonRegion label="Loading stories">
      <SkeletonChips count={6} className="mb-8 pb-5 border-b border-border" />

      {withFeatured && <FeaturedCardSkeleton />}

      {Array.from({ length: sections }).map((_, s) => (
        <section key={s} className="mb-12">
          <div className="flex items-center justify-between mb-5">
            <Skeleton className="h-3 w-28" />
            <Skeleton className="h-3 w-12" />
          </div>
          <div className="divide-y divide-border border-t border-border shimmer-group">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i}>
                <ArticleRowSkeleton />
              </div>
            ))}
          </div>
        </section>
      ))}
    </SkeletonRegion>
  );
}

export function SidebarSkeleton() {
  return (
    <div className="space-y-10" aria-hidden>
      <div className="p-5 border border-border rounded-2xl">
        <Skeleton className="h-4 w-32 mb-3" />
        <SkeletonText lines={2} lineClassName="h-3" className="mb-4" />
        <Skeleton className="h-10 w-full rounded-full" />
      </div>
      <div>
        <Skeleton className="h-3 w-28 mb-4" />
        <SkeletonChips count={7} />
      </div>
    </div>
  );
}

export function HomeSkeleton() {
  return (
    <div className="min-h-screen">
      <HeaderSkeleton />
      <div className="max-w-[1200px] mx-auto px-6 pt-8 pb-28 flex gap-14">
        <main className="flex-1 min-w-0 max-w-[720px]">
          <FeedSkeleton />
        </main>
        <aside className="hidden lg:block w-[250px] flex-shrink-0">
          <SidebarSkeleton />
        </aside>
      </div>
    </div>
  );
}

/* ────────────────────────── article ────────────────────────── */

export function ArticleSkeleton({ withHeader = false }: { withHeader?: boolean }) {
  return (
    <div className="min-h-screen bg-background">
      {withHeader && <HeaderSkeleton maxWidth="max-w-[1300px]" />}
      <SkeletonRegion label="Loading story" className="max-w-[1300px] mx-auto px-6 flex gap-12 pt-10 pb-24">
        <article className="flex-1 min-w-0 max-w-[720px] mx-auto">
          <Skeleton className="h-6 w-28 rounded-full mb-6" />
          <Skeleton className="h-10 w-full mb-3" />
          <Skeleton className="h-10 w-8/12 mb-6" />
          <SkeletonText lines={2} lineClassName="h-4" lastLineWidth="w-3/4" className="mb-8" />

          <div className="flex items-center gap-3 mb-8 pb-6 border-b border-border">
            <SkeletonCircle className="w-11 h-11" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-3.5 w-40" />
              <Skeleton className="h-3 w-28" />
            </div>
            <Skeleton className="h-8 w-24 rounded-full" />
          </div>

          <Skeleton className="w-full aspect-video rounded-2xl mb-10" />

          <div className="space-y-8">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i}>
                <Skeleton className="h-6 w-1/2 mb-4" />
                <SkeletonText lines={4} lineClassName="h-4" lastLineWidth="w-4/6" />
              </div>
            ))}
          </div>
        </article>

        <aside className="hidden xl:block w-[220px] flex-shrink-0">
          <div className="sticky top-24 space-y-3">
            <Skeleton className="h-3 w-24 mb-4" />
            {["w-full", "w-5/6", "w-4/6", "w-3/4", "w-2/3"].map((w, i) => (
              <Skeleton key={i} className={`h-3 ${w}`} />
            ))}
          </div>
        </aside>
      </SkeletonRegion>
    </div>
  );
}

/* ────────────────────────── profile ────────────────────────── */

export function StoryRowSkeleton() {
  return (
    <div className="p-5 flex items-start gap-4">
      <Skeleton className="w-16 h-12 flex-shrink-0" />
      <div className="flex-1 min-w-0 space-y-2.5">
        <div className="flex items-start justify-between gap-3">
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-5 w-20 rounded-full flex-shrink-0" />
        </div>
        <Skeleton className="h-3 w-11/12" />
        <div className="flex items-center gap-3">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-3 w-12" />
          <Skeleton className="h-3 w-12" />
        </div>
      </div>
    </div>
  );
}

export function StoryListSkeleton({ rows = 4 }: { rows?: number }) {
  return (
    <SkeletonRegion
      label="Loading stories"
      className="divide-y divide-border border border-border rounded-2xl overflow-hidden bg-white shadow-xs shimmer-group"
    >
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i}>
          <StoryRowSkeleton />
        </div>
      ))}
    </SkeletonRegion>
  );
}

/** Profile body only — the caller supplies the real Header/Footer chrome. */
export function ProfileSkeleton() {
  return (
      <SkeletonRegion label="Loading profile" className="flex-1 max-w-[950px] mx-auto w-full px-6 pt-10 pb-24">
        <div className="border-b border-border pb-10 mb-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <SkeletonCircle className="w-20 h-20 md:w-24 md:h-24 flex-shrink-0" />
              <div className="space-y-3">
                <Skeleton className="h-7 w-52" />
                <Skeleton className="h-3.5 w-64" />
                <div className="flex gap-4">
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="h-3 w-20" />
                </div>
              </div>
            </div>
            <Skeleton className="h-9 w-32 rounded-full" />
          </div>
        </div>

        <div className="flex gap-3 mb-8">
          <Skeleton className="h-8 w-24 rounded-full" />
          <Skeleton className="h-8 w-28 rounded-full" />
        </div>

        <StoryListSkeleton rows={4} />
      </SkeletonRegion>
  );
}

/** Full profile screen incl. chrome — used by the route-level fallback. */
export function ProfilePageSkeleton() {
  return (
    <div className="min-h-screen bg-background flex flex-col font-sans">
      <HeaderSkeleton maxWidth="max-w-[1280px]" />
      <ProfileSkeleton />
    </div>
  );
}

/* ────────────────────────── admin review ────────────────────────── */

export function AdminRowSkeleton() {
  return (
    <div className="border border-border rounded-2xl p-5">
      <div className="flex gap-4 items-start">
        <Skeleton className="w-20 h-14 flex-shrink-0 rounded-xl" />
        <div className="flex-1 min-w-0 space-y-2.5">
          <div className="flex items-start justify-between gap-3">
            <Skeleton className="h-4 w-2/5" />
            <Skeleton className="h-5 w-24 rounded-full flex-shrink-0" />
          </div>
          <Skeleton className="h-3 w-11/12" />
          <div className="flex flex-wrap gap-4">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-3 w-16" />
          </div>
          <div className="flex gap-2 pt-1">
            <Skeleton className="h-8 w-24 rounded-full" />
            <Skeleton className="h-8 w-20 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function AdminListSkeleton({ rows = 3 }: { rows?: number }) {
  return (
    <SkeletonRegion label="Loading submissions" className="space-y-4 shimmer-group">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i}>
          <AdminRowSkeleton />
        </div>
      ))}
    </SkeletonRegion>
  );
}

export function AdminPageSkeleton() {
  return (
    <div className="min-h-screen bg-background">
      <HeaderSkeleton maxWidth="max-w-[1100px]" />
      <div className="max-w-[1100px] mx-auto px-6 pt-10 pb-24">
        <div className="mb-8 space-y-3">
          <Skeleton className="h-8 w-56" />
          <Skeleton className="h-4 w-96 max-w-full" />
        </div>
        <SkeletonChips count={4} className="mb-6" />
        <AdminListSkeleton rows={3} />
      </div>
    </div>
  );
}

/* ────────────────────────── writer / editor ────────────────────────── */

export function EditorSkeleton({ withHeader = false }: { withHeader?: boolean }) {
  return (
    <div className="min-h-screen bg-background">
      {withHeader && <HeaderSkeleton maxWidth="max-w-[860px]" />}
      <SkeletonRegion label="Loading editor" className="max-w-[860px] mx-auto px-6 pt-12 pb-24">
        <Skeleton className="h-8 w-40 rounded-full mb-8" />
        <Skeleton className="h-11 w-10/12 mb-4" />
        <Skeleton className="h-6 w-7/12 mb-8" />
        <Skeleton className="w-full h-60 rounded-2xl mb-8" />
        <div className="space-y-8">
          <SkeletonText lines={4} lineClassName="h-4" lastLineWidth="w-3/5" />
          <SkeletonText lines={3} lineClassName="h-4" lastLineWidth="w-2/5" />
        </div>
      </SkeletonRegion>
    </div>
  );
}

/* ────────────────────────── auth ────────────────────────── */

export function AuthFormSkeleton() {
  return (
    <div className="min-h-screen bg-surface flex items-center justify-center font-sans px-6">
      <SkeletonRegion label="Loading" className="w-full max-w-md card p-8">
        <Skeleton className="h-7 w-44 mx-auto mb-3" />
        <Skeleton className="h-3.5 w-64 max-w-full mx-auto mb-8" />
        <Skeleton className="h-11 w-full rounded-full mb-6" />
        <div className="flex items-center gap-3 mb-6">
          <Skeleton className="h-px flex-1 rounded-none" />
          <Skeleton className="h-3 w-8" />
          <Skeleton className="h-px flex-1 rounded-none" />
        </div>
        <div className="space-y-4 mb-6">
          <Skeleton className="h-11 w-full rounded-xl" />
          <Skeleton className="h-11 w-full rounded-xl" />
        </div>
        <Skeleton className="h-11 w-full rounded-full mb-5" />
        <Skeleton className="h-3.5 w-52 mx-auto" />
      </SkeletonRegion>
    </div>
  );
}

/* ────────────────────────── tools ────────────────────────── */

export function ScanResultSkeleton() {
  return (
    <SkeletonRegion label="Scanning resume" className="space-y-6">
      <div className="border border-border rounded-2xl p-7">
        <div className="flex flex-col sm:flex-row sm:items-center gap-6 mb-6">
          <div className="space-y-2">
            <Skeleton className="h-16 w-32" />
            <Skeleton className="h-3 w-20" />
          </div>
          <div className="flex-1 space-y-3">
            <Skeleton className="h-6 w-2/3" />
            <SkeletonText lines={2} lineClassName="h-3" lastLineWidth="w-1/2" />
          </div>
        </div>
        <Skeleton className="h-2.5 w-full rounded-full" />
      </div>

      <div className="grid sm:grid-cols-2 gap-4 shimmer-group">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="border border-border rounded-2xl p-5">
            <Skeleton className="h-4 w-32 mb-4" />
            <SkeletonText lines={3} lineClassName="h-3" lastLineWidth="w-3/5" />
          </div>
        ))}
      </div>
    </SkeletonRegion>
  );
}

export function ToolsPageSkeleton() {
  return (
    <div className="min-h-screen bg-background">
      <HeaderSkeleton maxWidth="max-w-[1100px]" />
      <SkeletonRegion label="Loading tools" className="max-w-[1100px] mx-auto px-6 pt-10 pb-24">
        <Skeleton className="h-8 w-52 mb-3" />
        <Skeleton className="h-4 w-96 max-w-full mb-10" />
        <div className="grid sm:grid-cols-2 gap-5 shimmer-group">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="border border-border rounded-2xl p-6">
              <Skeleton className="w-10 h-10 rounded-xl mb-4" />
              <Skeleton className="h-4 w-40 mb-3" />
              <SkeletonText lines={3} lineClassName="h-3" lastLineWidth="w-2/3" />
            </div>
          ))}
        </div>
      </SkeletonRegion>
    </div>
  );
}

