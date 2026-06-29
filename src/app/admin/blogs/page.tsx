"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useBlogs } from "@/context/BlogContext";
import { useAuth } from "@/context/AuthContext";
import { CheckCircle, XCircle, Eye, Clock, Hourglass, LayoutDashboard } from "lucide-react";

type FilterTab = "pending" | "published" | "rejected" | "all";

export default function AdminBlogsPage() {
  const { user } = useAuth();
  const { blogs, loading, approveBlog, rejectBlog } = useBlogs();

  const [tab, setTab] = useState<FilterTab>("pending");
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [actionId, setActionId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    if (tab === "all") return blogs;
    return blogs.filter((b) => b.status === tab);
  }, [blogs, tab]);

  const counts = useMemo(() => ({
    pending: blogs.filter((b) => b.status === "pending").length,
    published: blogs.filter((b) => b.status === "published").length,
    rejected: blogs.filter((b) => b.status === "rejected").length,
    all: blogs.length,
  }), [blogs]);

  async function handleApprove(id: string) {
    setActionId(id);
    await approveBlog(id);
    setActionId(null);
  }

  async function handleReject() {
    if (!rejectingId || !rejectReason.trim()) return;
    setActionId(rejectingId);
    await rejectBlog(rejectingId, rejectReason.trim());
    setRejectingId(null);
    setRejectReason("");
    setActionId(null);
  }

  if (!user || user.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-sm px-6">
          <h2 className="text-2xl font-bold mb-3">Access denied</h2>
          <p className="text-secondary mb-6">This page is for admins only.</p>
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
          <div className="flex items-center gap-2 text-sm text-secondary">
            <LayoutDashboard size={15} />
            Admin Panel
          </div>
        </div>
      </header>

      <main className="max-w-[1100px] mx-auto px-6 pt-10 pb-24">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Blog Review</h1>
          <p className="text-secondary mt-1">Approve or reject user-submitted stories before they go public.</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {(["pending", "published", "rejected", "all"] as FilterTab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors capitalize ${
                tab === t ? "bg-button text-white" : "bg-secondary/8 text-secondary hover:bg-secondary/15"
              }`}
            >
              {t} <span className="ml-1 opacity-70">({counts[t]})</span>
            </button>
          ))}
        </div>

        {/* List */}
        {loading && <div className="py-16 text-center text-secondary">Loading…</div>}

        {!loading && filtered.length === 0 && (
          <div className="py-16 text-center border border-dashed border-border rounded-2xl">
            <p className="text-secondary">No stories in this category.</p>
          </div>
        )}

        <div className="space-y-4">
          {filtered.map((blog) => (
            <div key={blog.id} className="border border-border rounded-2xl p-5">
              <div className="flex gap-4 items-start">
                {/* Cover */}
                <div className="w-20 h-14 flex-shrink-0 rounded-xl overflow-hidden bg-secondary/8 flex items-center justify-center">
                  {blog.coverImage ? (
                    <img src={blog.coverImage} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <span className="serif text-3xl font-bold text-secondary/20">{blog.title[0]}</span>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3 mb-1">
                    <h3 className="font-bold text-base line-clamp-1">{blog.title}</h3>
                    <StatusBadge status={blog.status} />
                  </div>
                  <p className="text-sm text-secondary line-clamp-2 mb-2">{blog.description}</p>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-secondary">
                    <span>By <strong className="text-foreground">{blog.author}</strong></span>
                    <span>{blog.date}</span>
                    <span>{blog.readingTime}</span>
                    <span className="flex items-center gap-1"><Eye size={11} /> {blog.views ?? 0} views</span>
                    <span className="bg-secondary/8 px-2 py-0.5 rounded-full">{blog.category}</span>
                  </div>

                  {blog.status === "rejected" && blog.rejectionReason && (
                    <p className="mt-2 text-xs text-red-600 bg-red-50 px-3 py-1.5 rounded-lg">
                      Rejection reason: {blog.rejectionReason}
                    </p>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="mt-4 flex items-center gap-3 pt-4 border-t border-border">
                <Link
                  href={`/article/${blog.id}`}
                  className="flex items-center gap-1.5 text-sm text-secondary hover:text-foreground transition-colors"
                  target="_blank"
                >
                  <Eye size={14} /> Preview
                </Link>

                <div className="flex-1" />

                {blog.status !== "published" && (
                  <button
                    onClick={() => handleApprove(blog.id)}
                    disabled={actionId === blog.id}
                    className="flex items-center gap-1.5 bg-green-600 text-white text-sm font-medium px-4 py-2 rounded-full hover:bg-green-700 transition-colors disabled:opacity-60"
                  >
                    <CheckCircle size={14} />
                    {actionId === blog.id ? "Approving…" : "Approve"}
                  </button>
                )}

                {blog.status !== "rejected" && (
                  <button
                    onClick={() => { setRejectingId(blog.id); setRejectReason(""); }}
                    disabled={actionId === blog.id}
                    className="flex items-center gap-1.5 bg-red-50 text-red-600 border border-red-200 text-sm font-medium px-4 py-2 rounded-full hover:bg-red-100 transition-colors disabled:opacity-60"
                  >
                    <XCircle size={14} />
                    Reject
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Reject modal */}
      {rejectingId && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <h3 className="font-bold text-lg mb-1">Reject story</h3>
            <p className="text-secondary text-sm mb-4">
              Provide a reason so the author knows what to improve.
            </p>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="e.g. Content needs more depth, please add sources…"
              rows={3}
              className="w-full text-sm border border-border rounded-xl p-3 outline-none focus:ring-1 focus:ring-border resize-none"
            />
            <div className="flex gap-3 mt-4 justify-end">
              <button
                onClick={() => { setRejectingId(null); setRejectReason(""); }}
                className="px-4 py-2 text-sm text-secondary hover:text-foreground transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                disabled={!rejectReason.trim() || actionId !== null}
                className="flex items-center gap-1.5 bg-red-600 text-white text-sm font-medium px-5 py-2 rounded-full hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                <XCircle size={14} />
                {actionId ? "Rejecting…" : "Confirm Reject"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; classes: string; icon: React.ReactNode }> = {
    pending: { label: "Pending", classes: "bg-amber-100 text-amber-700", icon: <Hourglass size={11} /> },
    published: { label: "Published", classes: "bg-green-100 text-green-700", icon: <CheckCircle size={11} /> },
    rejected: { label: "Rejected", classes: "bg-red-100 text-red-700", icon: <XCircle size={11} /> },
    draft: { label: "Draft", classes: "bg-secondary/10 text-secondary", icon: <Clock size={11} /> },
  };
  const cfg = map[status] ?? map.draft;
  return (
    <span className={`flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full flex-shrink-0 ${cfg.classes}`}>
      {cfg.icon} {cfg.label}
    </span>
  );
}
