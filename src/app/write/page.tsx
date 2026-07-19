"use client";

import { Suspense, useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

import { useBlogs } from "@/context/BlogContext";
import { useAuth } from "@/context/AuthContext";
import { calcReadingTime, type Article } from "@/data/dummy";
import StoryEditor from "@/components/StoryEditor";
import { X, ImagePlus, Loader2, CheckCircle, Info } from "lucide-react";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "@/lib/firebase";

function WritePageInner() {
  const { addBlog, updateBlog, getBlog, categories, loading } = useBlogs();
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const editId = searchParams.get("id");
  const isEditing = !!editId;

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");

  // Set default category when categories list loads (new posts only)
  useEffect(() => {
    if (!isEditing && categories.length > 0 && !category) {
      setCategory(categories[0]);
    }
  }, [categories, category, isEditing]);
  const [content, setContent] = useState("");
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [existingCover, setExistingCover] = useState<string | undefined>(undefined);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  // Edit mode: hydrate the form from the existing story once it loads.
  const [hydrated, setHydrated] = useState(!editId); // new post is ready immediately
  const [notFound, setNotFound] = useState(false);
  const originalStatus = useRef<Article["status"] | null>(null);
  const originalDate = useRef<string | null>(null);

  useEffect(() => {
    if (!editId || hydrated || !user) return;
    const blog = getBlog(editId);
    if (blog) {
      if (blog.authorId !== user.id) {
        setNotFound(true);
      } else {
        setTitle(blog.title);
        setDescription(blog.description);
        setCategory(blog.category);
        setContent(blog.content);
        setCoverPreview(blog.coverImage ?? null);
        setExistingCover(blog.coverImage);
        originalStatus.current = blog.status;
        originalDate.current = blog.date;
      }
      setHydrated(true);
    } else if (!loading) {
      setNotFound(true);
      setHydrated(true);
    }
  }, [editId, hydrated, user, loading, getBlog]);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const titleRef = useRef<HTMLTextAreaElement>(null);
  const subtitleRef = useRef<HTMLTextAreaElement>(null);

  function autoResize(el: HTMLTextAreaElement) {
    el.style.height = "auto";
    el.style.height = el.scrollHeight + "px";
  }

  // Grow the title/subtitle textareas to fit content loaded in edit mode.
  useEffect(() => {
    if (titleRef.current) autoResize(titleRef.current);
    if (subtitleRef.current) autoResize(subtitleRef.current);
  }, [hydrated]);

  const wordCount = content.trim() ? content.trim().split(/\s+/).filter(Boolean).length : 0;

  function handleCoverChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Please select an image file.");
      return;
    }
    setCoverFile(file);
    setCoverPreview(URL.createObjectURL(file));
  }

  async function handleSubmit() {
    setError("");
    if (!user) return setError("Please sign in to publish a story.");
    if (!title.trim()) return setError("Give your story a title.");
    if (!content.trim()) return setError("Your story needs some content.");

    setSubmitting(true);
    try {
      // Keep the existing cover unless a new file was chosen.
      let coverImage: string | undefined = existingCover;
      if (coverFile) {
        const storageRef = ref(storage, `covers/${Date.now()}_${coverFile.name}`);
        const snapshot = await uploadBytes(storageRef, coverFile);
        coverImage = await getDownloadURL(snapshot.ref);
      }

      if (isEditing && editId) {
        // Medium behavior: editing a published story updates it live; anything
        // not yet published goes (back) to pending review.
        await updateBlog(editId, {
          title: title.trim(),
          description: description.trim() || title.trim(),
          category,
          content: content.trim(),
          readingTime: calcReadingTime(content),
          coverImage,
          status: originalStatus.current === "published" ? "published" : "pending",
        });
      } else {
        const now = new Date();
        const date = now.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
        await addBlog({
          title: title.trim(),
          description: description.trim() || title.trim(),
          author: `${user.firstName} ${user.lastName}`,
          authorId: user.id,
          date,
          readingTime: calcReadingTime(content),
          category,
          claps: 0,
          responses: 0,
          content: content.trim(),
          coverImage,
          views: 0,
          status: "pending",
        });
      }

      setSubmitted(true);
    } catch (err) {
      console.error(err);
      setError("Failed to save. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center max-w-sm px-6">
          <h2 className="text-2xl font-bold mb-3">Sign in to write</h2>
          <p className="text-secondary mb-6">You need an account to submit stories for review.</p>
          <div className="flex justify-center gap-3">
            <Link href="/auth/login" className="bg-button text-white px-6 py-2.5 rounded-full text-sm font-medium hover:bg-button/90 transition-colors">
              Sign In
            </Link>
            <Link href="/" className="btn-ghost px-6 py-2.5 rounded-full text-sm font-medium transition-colors">
              Back to home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (submitted) {
    const wentLive = isEditing && originalStatus.current === "published";
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center max-w-sm px-6">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
            <CheckCircle size={32} className="text-green-600" />
          </div>
          <h2 className="text-2xl font-bold mb-3">{isEditing ? "Story updated!" : "Story submitted!"}</h2>
          {wentLive ? (
            <p className="text-secondary mb-2 leading-relaxed">
              Your changes are now <span className="font-semibold text-green-600">live</span>.
            </p>
          ) : (
            <>
              <p className="text-secondary mb-2 leading-relaxed">
                Your story is now <span className="font-semibold text-amber-600">pending review</span> by the admin.
              </p>
              <p className="text-secondary text-sm mb-8">
                Once approved, it will appear on the home feed. You can track its status in your dashboard.
              </p>
            </>
          )}
          <div className="flex gap-3 justify-center mt-6">
            <Link href="/dashboard" className="bg-button text-white px-5 py-2.5 rounded-full text-sm font-medium hover:bg-button/90 transition-colors">
              My Dashboard
            </Link>
            <Link href="/" className="border border-border text-foreground px-5 py-2.5 rounded-full text-sm font-medium hover:bg-secondary/8 transition-colors">
              Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (isEditing && notFound) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center max-w-sm px-6">
          <h2 className="text-2xl font-bold mb-3">Story not available</h2>
          <p className="text-secondary mb-6">This story doesn&apos;t exist, or it isn&apos;t yours to edit.</p>
          <Link href="/dashboard" className="bg-button text-white px-6 py-2.5 rounded-full text-sm font-medium hover:bg-button/90 transition-colors">
            Back to dashboard
          </Link>
        </div>
      </div>
    );
  }

  if (isEditing && !hydrated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 size={22} className="animate-spin text-secondary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-border">
        <div className="max-w-[860px] mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/" className="text-secondary hover:text-foreground transition-colors">
              <X size={20} />
            </Link>
            <Link href="/" className="text-xl font-extrabold tracking-tighter flex items-baseline">
              <span className="font-light text-secondary">Next</span><span>Zeni</span>
            </Link>
          </div>

          <div className="flex items-center gap-4">
            {wordCount > 0 && (
              <span className="text-xs text-secondary/60 hidden sm:block">
                {wordCount} {wordCount === 1 ? "word" : "words"} · {calcReadingTime(content)}
              </span>
            )}
            {error && <p className="text-sm text-red-500 max-w-[160px] truncate">{error}</p>}
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="bg-button text-white text-sm font-medium px-5 py-2 rounded-full hover:bg-button/90 transition-colors disabled:opacity-60 flex items-center gap-2"
            >
              {submitting && <Loader2 size={14} className="animate-spin" />}
              {submitting ? "Saving…" : isEditing ? "Update" : "Submit"}
            </button>
          </div>
        </div>
      </header>

      {/* Editor — a clean, distraction-free writing canvas */}
      <main className="max-w-[720px] mx-auto px-6 pt-10 pb-40">

        {/* Author + category — borderless, quiet */}
        <div className="flex items-center gap-3 mb-10">
          <div className="w-9 h-9 rounded-full bg-accent/15 flex items-center justify-center text-sm font-bold text-accent">
            {user.firstName[0]}
          </div>
          <div className="leading-tight">
            <p className="text-sm font-medium">{user.firstName} {user.lastName}</p>
            <p className="text-xs text-secondary capitalize">{isEditing ? `Editing · ${originalStatus.current ?? ""}` : "Draft"}</p>
          </div>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="ml-auto text-sm text-secondary bg-transparent hover:bg-secondary/8 rounded-full px-3 py-1.5 outline-none border border-border cursor-pointer transition-colors"
          >
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        {/* Cover image — a subtle affordance, not a big box */}
        {coverPreview ? (
          <div
            onClick={() => fileInputRef.current?.click()}
            className="mb-10 cursor-pointer group relative"
          >
            <img src={coverPreview} alt="Cover" className="w-full h-60 object-cover rounded-2xl" />
            <div className="absolute inset-0 rounded-2xl bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <p className="text-white text-sm font-medium">Change cover</p>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="mb-8 inline-flex items-center gap-2 text-sm text-secondary hover:text-accent transition-colors"
          >
            <ImagePlus size={18} /> Add cover image
          </button>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleCoverChange}
          className="hidden"
        />

        {/* Title */}
        <textarea
          ref={titleRef}
          placeholder="Title"
          value={title}
          onChange={(e) => { setTitle(e.target.value); autoResize(e.target); }}
          rows={1}
          className="serif w-full text-4xl md:text-5xl font-bold text-foreground placeholder:text-foreground/15 bg-transparent border-0 outline-none resize-none leading-tight tracking-tight mb-3 overflow-hidden"
          style={{ height: "auto" }}
        />

        {/* Subtitle */}
        <textarea
          ref={subtitleRef}
          placeholder="Tell your story's key insight… (optional)"
          value={description}
          onChange={(e) => { setDescription(e.target.value); autoResize(e.target); }}
          rows={1}
          className="w-full text-xl text-secondary placeholder:text-secondary/25 bg-transparent border-0 outline-none resize-none leading-relaxed mb-8 font-light overflow-hidden"
          style={{ height: "auto" }}
        />

        {/* Content — Medium-style WYSIWYG editor */}
        <StoryEditor key={editId ?? "new"} value={content} onChange={setContent} />

        {content.length === 0 && (
          <p className="mt-6 text-sm text-secondary/45">
            Select any text to format it, paste an image, or just start writing.
          </p>
        )}

        {/* Review notice — quiet, single line */}
        <div className="mt-20 pt-6 border-t border-border flex items-start gap-2 text-xs text-secondary">
          <Info size={14} className="mt-0.5 flex-shrink-0" />
          <p>
            {isEditing && originalStatus.current === "published"
              ? "Changes to a published story go live immediately."
              : "Your story will be reviewed by an admin before it appears publicly. Track its status in your dashboard."}
          </p>
        </div>
      </main>
    </div>
  );
}

export default function WritePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background flex items-center justify-center">
          <Loader2 size={22} className="animate-spin text-secondary" />
        </div>
      }
    >
      <WritePageInner />
    </Suspense>
  );
}
