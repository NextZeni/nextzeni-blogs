"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useBlogs } from "@/context/BlogContext";
import { useAuth } from "@/context/AuthContext";
import { Eye, Clock, PenLine, CheckCircle, XCircle, Hourglass, BarChart2 } from "lucide-react";
import { formatNum } from "@/data/dummy";

const STATUS_CONFIG = {
  published: {
    label: "Published",
    icon: CheckCircle,
    classes: "bg-green-100 text-green-700",
  },
  pending: {
    label: "Pending Review",
    icon: Hourglass,
    classes: "bg-amber-100 text-amber-700",
  },
  rejected: {
    label: "Rejected",
    icon: XCircle,
    classes: "bg-red-100 text-red-700",
  },
  draft: {
    label: "Draft",
    icon: Clock,
    classes: "bg-secondary/10 text-secondary",
  },
};

export default function DashboardPage() {
  const { user } = useAuth();
  const { blogs, loading } = useBlogs();

  const myBlogs = useMemo(
    () => blogs.filter((b) => b.authorId === user?.id),
    [blogs, user]
  );

  const totalViews = useMemo(
    () => myBlogs.reduce((sum, b) => sum + (b.views ?? 0), 0),
    [myBlogs]
  );

  const publishedCount = myBlogs.filter((b) => b.status === "published").length;
  const pendingCount = myBlogs.filter((b) => b.status === "pending").length;

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-sm px-6">
          <h2 className="text-2xl font-bold mb-3">Sign in to view dashboard</h2>
          <Link href="/" className="bg-button text-white px-6 py-2.5 rounded-full text-sm font-medium">
            Back to home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-border">
        <div className="max-w-[1100px] mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="text-xl font-extrabold tracking-tighter flex items-baseline">
            <span className="font-light text-secondary">Next</span><span>Zeni</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/write" className="flex items-center gap-2 bg-button text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-button/90 transition-colors">
              <PenLine size={14} /> New Story
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-[1100px] mx-auto px-6 pt-10 pb-24">
        {/* Page title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">My Dashboard</h1>
          <p className="text-secondary mt-1">
            Welcome back, {user.firstName} — here's how your stories are performing.
          </p>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {[
            { label: "Total Views", value: formatNum(totalViews), icon: Eye, color: "text-blue-600 bg-blue-50" },
            { label: "Published", value: publishedCount, icon: CheckCircle, color: "text-green-600 bg-green-50" },
            { label: "Pending", value: pendingCount, icon: Hourglass, color: "text-amber-600 bg-amber-50" },
            { label: "Total Stories", value: myBlogs.length, icon: BarChart2, color: "text-violet-600 bg-violet-50" },
          ].map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="border border-border rounded-2xl p-5">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${color}`}>
                <Icon size={18} />
              </div>
              <p className="text-2xl font-bold">{value}</p>
              <p className="text-sm text-secondary mt-0.5">{label}</p>
            </div>
          ))}
        </div>

        {/* Stories list */}
        <div>
          <h2 className="text-lg font-bold mb-4">Your Stories</h2>

          {loading && (
            <div className="py-16 text-center text-secondary">Loading…</div>
          )}

          {!loading && myBlogs.length === 0 && (
            <div className="py-16 text-center border border-dashed border-border rounded-2xl">
              <PenLine size={32} className="text-secondary/30 mx-auto mb-3" />
              <p className="text-secondary mb-4">You haven&apos;t written anything yet.</p>
              <Link href="/write" className="bg-button text-white px-5 py-2.5 rounded-full text-sm font-medium hover:bg-button/90 transition-colors">
                Write your first story
              </Link>
            </div>
          )}

          <div className="divide-y divide-border border border-border rounded-2xl overflow-hidden">
            {myBlogs.map((blog) => {
              const cfg = STATUS_CONFIG[blog.status] ?? STATUS_CONFIG.draft;
              const Icon = cfg.icon;
              return (
                <div key={blog.id} className="p-5 flex items-start gap-4 hover:bg-secondary/3 transition-colors">
                  {/* Cover thumbnail or initial */}
                  <div className="w-16 h-12 flex-shrink-0 rounded-lg overflow-hidden bg-secondary/8 flex items-center justify-center">
                    {blog.coverImage ? (
                      <img src={blog.coverImage} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <span className="serif text-2xl font-bold text-secondary/20">{blog.title[0]}</span>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        {blog.status === "published" ? (
                          <Link href={`/article/${blog.id}`} className="font-semibold text-sm hover:underline line-clamp-1">
                            {blog.title}
                          </Link>
                        ) : (
                          <p className="font-semibold text-sm line-clamp-1">{blog.title}</p>
                        )}
                        <p className="text-xs text-secondary mt-0.5 line-clamp-1">{blog.description}</p>
                      </div>

                      {/* Status badge */}
                      <span className={`flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full flex-shrink-0 ${cfg.classes}`}>
                        <Icon size={11} />
                        {cfg.label}
                      </span>
                    </div>

                    {/* Meta row */}
                    <div className="flex items-center gap-4 mt-2">
                      <span className="text-xs text-secondary">{blog.date}</span>
                      <span className="text-xs text-secondary">{blog.readingTime}</span>
                      <span className="flex items-center gap-1 text-xs text-secondary">
                        <Eye size={11} /> {formatNum(blog.views ?? 0)} views
                      </span>
                    </div>

                    {/* Rejection reason */}
                    {blog.status === "rejected" && blog.rejectionReason && (
                      <p className="mt-2 text-xs text-red-600 bg-red-50 px-3 py-1.5 rounded-lg">
                        Reason: {blog.rejectionReason}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}
