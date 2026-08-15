"use client";

import { Suspense, useCallback, useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

import { useBlogs } from "@/context/BlogContext";
import { useAuth } from "@/context/AuthContext";
import { calcReadingTime, type Article } from "@/data/dummy";
import StoryEditor from "@/components/StoryEditor";
import TagInput from "@/components/TagInput";
import { EditorSkeleton } from "@/components/PageSkeletons";
import SmartImage from "@/components/SmartImage";
import StoryPreview from "@/components/StoryPreview";
import { X, ImagePlus, Loader2, CheckCircle, Info, ChevronDown, Search, Eye, Pencil, Check } from "lucide-react";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "@/lib/firebase";
import {
  MAX_TAGS, META_DESCRIPTION_LIMIT, META_TITLE_LIMIT, SITE_URL, normalizeTags,
} from "@/lib/seo";

/** Every field autosave persists, flattened for a cheap "has this changed?" compare. */
type DraftFields = {
  title: string;
  description: string;
  category: string;
  content: string;
  tags: string[];
  seoKeywords: string[];
  metaTitle: string;
  metaDescription: string;
};

function snapshotOf(f: DraftFields, coverKey: string) {
  return JSON.stringify({ ...f, cover: coverKey });
}

function fileKey(file: File) {
  return `${file.name}:${file.size}:${file.lastModified}`;
}

const STATUS_LABEL: Record<Article["status"], string> = {
  draft: "Draft",
  pending: "In review",
  rejected: "Needs changes",
  published: "Published",
};

/** Quiet autosave state, in the header next to Submit. */
function SaveIndicator({
  autosaveOn,
  saving,
  unsaved,
  saveError,
  lastSavedAt,
}: {
  autosaveOn: boolean;
  saving: boolean;
  unsaved: boolean;
  saveError: boolean;
  lastSavedAt: Date | null;
}) {
  if (!autosaveOn) return null;

  if (saveError) {
    return (
      <span className="text-xs text-red-500 hidden sm:block">
        Couldn&apos;t save — retrying
      </span>
    );
  }
  if (saving) {
    return (
      <span className="flex items-center gap-1.5 text-xs text-secondary/70">
        <Loader2 size={12} className="animate-spin" />
        <span className="hidden sm:inline">Saving…</span>
      </span>
    );
  }
  if (unsaved) {
    return <span className="text-xs text-secondary/60 hidden sm:block">Unsaved changes</span>;
  }
  if (lastSavedAt) {
    return (
      <span className="flex items-center gap-1.5 text-xs text-secondary/70">
        <Check size={12} className="text-green-600" />
        <span className="hidden sm:inline">
          Draft saved {lastSavedAt.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}
        </span>
      </span>
    );
  }
  return null;
}

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
  const [wentLive, setWentLive] = useState(false);
  const [error, setError] = useState("");
  const [preview, setPreview] = useState(false);

  // The Firestore doc this session writes to. For a new story it stays null
  // until the first autosave creates the draft.
  const [docId, setDocId] = useState<string | null>(editId);
  // Live status of that doc — anything not yet submitted is a draft.
  const [status, setStatus] = useState<Article["status"]>("draft");

  // Autosave bookkeeping. `savedSnapshot` is the serialized form of everything
  // already persisted, so "is there unsaved work?" is a plain render-time compare.
  const [savedSnapshot, setSavedSnapshot] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);
  const [saveError, setSaveError] = useState(false);

  // SEO fields — these never render inside the story, only in the page <head>.
  const [tags, setTags] = useState<string[]>([]);
  const [seoKeywords, setSeoKeywords] = useState<string[]>([]);
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [seoOpen, setSeoOpen] = useState(false);

  // Edit mode: hydrate the form from the existing story once it loads.
  const [hydrated, setHydrated] = useState(!editId); // new post is ready immediately
  const [notFound, setNotFound] = useState(false);
  // Publication date of the doc being edited — shown in the reader preview.
  const [docDate, setDocDate] = useState<string | null>(null);

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
        setTags(blog.tags ?? []);
        setSeoKeywords(blog.seoKeywords ?? []);
        setMetaTitle(blog.metaTitle ?? "");
        setMetaDescription(blog.metaDescription ?? "");
        // Open the panel when there's something already in it.
        setSeoOpen(
          Boolean(blog.tags?.length || blog.seoKeywords?.length || blog.metaTitle || blog.metaDescription)
        );
        setStatus(blog.status);
        setDocDate(blog.date);
        // What's already stored counts as saved, so simply opening a draft
        // doesn't trigger a pointless write.
        setSavedSnapshot(
          snapshotOf(
            {
              title: blog.title,
              description: blog.description,
              category: blog.category,
              content: blog.content,
              tags: blog.tags ?? [],
              seoKeywords: blog.seoKeywords ?? [],
              metaTitle: blog.metaTitle ?? "",
              metaDescription: blog.metaDescription ?? "",
            },
            blog.coverImage ?? ""
          )
        );
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
  const seoTagCount = tags.length + seoKeywords.length;
  const previewUrl = `${SITE_URL.replace(/^https?:\/\//, "")}/article/${docId ?? "…"}`;

  /* ── Autosave ──────────────────────────────────────────────────────────────
     Everything typed is persisted as a draft shortly after the writer pauses,
     so closing the tab can't lose work. A published story is deliberately
     excluded: its edits are public the moment they're written, so those still
     go out only when the writer presses Update.                              */

  const AUTOSAVE_MS = 1200;
  const RETRY_MS = 5000;

  const hasSomething = Boolean(title.trim() || content.trim());
  const autosaveOn =
    Boolean(user) && hydrated && !submitted && !notFound && status !== "published";

  // Serialized form of every persisted field; a not-yet-uploaded cover is keyed
  // by file identity, and by its URL once stored.
  const snapshot = snapshotOf(
    { title, description, category, content, tags, seoKeywords, metaTitle, metaDescription },
    coverFile ? fileKey(coverFile) : existingCover ?? ""
  );

  // A blank new canvas isn't worth a doc, but an existing draft always saves —
  // including edits that empty a field.
  const unsaved = autosaveOn && (hasSomething || Boolean(docId)) && snapshot !== savedSnapshot;

  // Timers read the newest values through this ref rather than a stale closure.
  const liveRef = useRef({ user, docId, status, snapshot, autosaveOn, hasSomething });
  useEffect(() => {
    liveRef.current = { user, docId, status, snapshot, autosaveOn, hasSomething };
  });

  const formRef = useRef<{ fields: DraftFields; coverFile: File | null; existingCover?: string }>({
    fields: { title, description, category, content, tags, seoKeywords, metaTitle, metaDescription },
    coverFile,
    existingCover,
  });
  useEffect(() => {
    formRef.current = {
      fields: { title, description, category, content, tags, seoKeywords, metaTitle, metaDescription },
      coverFile,
      existingCover,
    };
  });

  const savingRef = useRef(false);

  /** Uploads a freshly picked cover once, then reuses the stored URL. */
  const uploadCoverIfNeeded = useCallback(async () => {
    const { coverFile: file, existingCover: current } = formRef.current;
    if (!file) return current;
    const storageRef = ref(storage, `covers/${Date.now()}_${file.name}`);
    const snap = await uploadBytes(storageRef, file);
    const url = await getDownloadURL(snap.ref);
    setExistingCover(url);
    setCoverPreview(url);
    setCoverFile(null);
    return url;
  }, []);

  /** Fields shared by autosave and submit. Undefined is never sent to Firestore. */
  const buildPayload = useCallback((coverImage: string | undefined) => {
    const f = formRef.current.fields;
    return {
      title: f.title.trim(),
      description: f.description.trim() || f.title.trim(),
      category: f.category,
      content: f.content.trim(),
      readingTime: calcReadingTime(f.content),
      tags: normalizeTags(f.tags),
      seoKeywords: normalizeTags(f.seoKeywords, MAX_TAGS * 2),
      metaTitle: f.metaTitle.trim(),
      metaDescription: f.metaDescription.trim(),
      ...(coverImage ? { coverImage } : {}),
    };
  }, []);

  const saveDraft = useCallback(async () => {
    const live = liveRef.current;
    if (savingRef.current) return;
    if (!live.user || !live.autosaveOn) return;
    // An untouched blank canvas isn't a draft worth creating.
    if (!live.docId && !live.hasSomething) return;
    if (live.snapshot === savedSnapshot) return;

    savingRef.current = true;
    setSaving(true);
    setSaveError(false);
    try {
      const coverImage = await uploadCoverIfNeeded();
      const payload = buildPayload(coverImage);
      // Computed after the upload so the stored cover URL — not the local file
      // — is what counts as saved, otherwise the swap looks like a fresh edit.
      const pending = snapshotOf(formRef.current.fields, coverImage ?? "");

      if (live.docId) {
        // Status is left alone: a draft stays a draft, a story already in
        // review keeps its place in the queue.
        await updateBlog(live.docId, payload);
      } else {
        const date = new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
        const newId = await addBlog({
          ...payload,
          author: `${live.user.firstName} ${live.user.lastName}`,
          authorId: live.user.id,
          date,
          claps: 0,
          responses: 0,
          views: 0,
          status: "draft",
        });
        setDocId(newId);
        setStatus("draft");
        setDocDate(date);
        // Keep the URL pointing at the draft so a refresh resumes it instead
        // of starting a second one.
        window.history.replaceState(null, "", `/write?id=${newId}`);
      }

      setSavedSnapshot(pending);
      setLastSavedAt(new Date());
    } catch (err) {
      console.error("Autosave failed:", err);
      setSaveError(true);
    } finally {
      savingRef.current = false;
      setSaving(false);
    }
  }, [addBlog, updateBlog, buildPayload, uploadCoverIfNeeded, savedSnapshot]);

  // Debounce: every edit restarts the clock. After a failed save the same
  // effect backs off and retries, so a dropped connection recovers on its own.
  useEffect(() => {
    if (!unsaved) return;
    const t = setTimeout(() => { void saveDraft(); }, saveError ? RETRY_MS : AUTOSAVE_MS);
    return () => clearTimeout(t);
  }, [unsaved, snapshot, saveDraft, saveError]);

  // Navigating away mid-debounce shouldn't drop the last few keystrokes:
  // the Firestore write outlives this component.
  const saveDraftRef = useRef(saveDraft);
  useEffect(() => { saveDraftRef.current = saveDraft; });
  useEffect(() => () => { void saveDraftRef.current(); }, []);

  // Leaving the tab shouldn't wait out the debounce either.
  useEffect(() => {
    function flush() {
      void saveDraft();
    }
    function onVisibility() {
      if (document.visibilityState === "hidden") flush();
    }
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("pagehide", flush);
    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pagehide", flush);
    };
  }, [saveDraft]);

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
      const coverImage = await uploadCoverIfNeeded();
      // Written as plain strings/arrays (never undefined) so clearing a field
      // in edit mode actually clears it in Firestore.
      const payload = buildPayload(coverImage);

      // Medium behavior: editing a published story updates it live; anything
      // not yet published (draft, rejected, in review) goes to pending review.
      const nextStatus: Article["status"] = status === "published" ? "published" : "pending";

      if (docId) {
        // The autosaved draft is the same doc — submitting just moves it on.
        await updateBlog(docId, { ...payload, status: nextStatus });
      } else {
        const now = new Date();
        const newId = await addBlog({
          ...payload,
          author: `${user.firstName} ${user.lastName}`,
          authorId: user.id,
          date: now.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
          claps: 0,
          responses: 0,
          views: 0,
          status: nextStatus,
        });
        setDocId(newId);
      }

      setWentLive(status === "published");
      setStatus(nextStatus);
      setSavedSnapshot(snapshot);
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
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center max-w-sm px-6">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
            <CheckCircle size={32} className="text-green-600" />
          </div>
          <h2 className="text-2xl font-bold mb-3">{wentLive ? "Story updated!" : "Story submitted!"}</h2>
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
    return <EditorSkeleton withHeader />;
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
              <span className="text-xs text-secondary/60 hidden md:block">
                {wordCount} {wordCount === 1 ? "word" : "words"} · {calcReadingTime(content)}
              </span>
            )}

            <SaveIndicator
              autosaveOn={autosaveOn}
              saving={saving}
              unsaved={unsaved}
              saveError={saveError}
              lastSavedAt={lastSavedAt}
            />

            <button
              type="button"
              onClick={() => setPreview((p) => !p)}
              className="flex items-center gap-1.5 text-sm font-medium text-secondary hover:text-foreground transition-colors px-2 py-1.5 cursor-pointer"
              title={preview ? "Back to editing" : "See it as a reader will"}
            >
              {preview ? <Pencil size={15} /> : <Eye size={15} />}
              <span className="hidden sm:inline">{preview ? "Edit" : "Preview"}</span>
            </button>

            {error && <p className="text-sm text-red-500 max-w-[160px] truncate">{error}</p>}
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="bg-button text-white text-sm font-medium px-5 py-2 rounded-full hover:bg-button/90 transition-colors disabled:opacity-60 flex items-center gap-2"
            >
              {submitting && <Loader2 size={14} className="animate-spin" />}
              {submitting ? "Submitting…" : status === "published" ? "Update" : "Submit"}
            </button>
          </div>
        </div>
      </header>

      {/* Editor — a clean, distraction-free writing canvas */}
      <main className="max-w-[720px] mx-auto px-6 pt-10 pb-40">

        {preview ? (
          <div className="animate-fade-in">
            <div className="flex items-center gap-2 mb-8 text-xs text-secondary">
              <Eye size={13} />
              <span>Preview · this is how your story will look to readers</span>
              <button
                type="button"
                onClick={() => setPreview(false)}
                className="ml-auto flex items-center gap-1.5 font-medium text-accent hover:underline cursor-pointer"
              >
                <Pencil size={12} /> Keep writing
              </button>
            </div>
            <StoryPreview
              title={title}
              description={description}
              content={content}
              coverImage={coverPreview}
              author={`${user.firstName} ${user.lastName}`}
              date={docDate ?? new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
              readingTime={calcReadingTime(content)}
              category={category}
            />
          </div>
        ) : (
        <div className="animate-fade-in">

        {/* Author + category — borderless, quiet */}
        <div className="flex items-center gap-3 mb-10">
          <div className="w-9 h-9 rounded-full bg-accent/15 flex items-center justify-center text-sm font-bold text-accent">
            {user.firstName[0]}
          </div>
          <div className="leading-tight">
            <p className="text-sm font-medium">{user.firstName} {user.lastName}</p>
            <p className="text-xs text-secondary">{STATUS_LABEL[status]}</p>
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
            <SmartImage
              src={coverPreview}
              alt="Cover"
              loading="eager"
              wrapperClassName="w-full rounded-2xl"
              placeholderClassName="h-60"
              className="w-full h-60 object-cover rounded-2xl"
            />
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

        {/* SEO & meta tags — collapsed by default, invisible to readers */}
        <section className="mt-20 pt-6 border-t border-border">
          <button
            type="button"
            onClick={() => setSeoOpen((o) => !o)}
            aria-expanded={seoOpen}
            className="w-full flex items-center gap-2 text-left group"
          >
            <Search size={15} className="text-secondary" />
            <span className="text-sm font-medium">SEO &amp; meta tags</span>
            {seoTagCount > 0 && (
              <span className="text-xs text-secondary bg-secondary/8 rounded-full px-2 py-0.5">
                {seoTagCount}
              </span>
            )}
            <ChevronDown
              size={16}
              className={`ml-auto text-secondary transition-transform ${seoOpen ? "rotate-180" : ""}`}
            />
          </button>
          <p className="mt-1.5 text-xs text-secondary leading-relaxed">
            Optional. Nothing here appears in your story — it only goes into the page&apos;s meta tags,
            for search engines and link previews.
          </p>

          {seoOpen && (
            <div className="mt-6 space-y-6">
              <div>
                <label htmlFor="seo-tags" className="block text-xs font-medium mb-2">
                  Tags <span className="text-secondary font-normal">· topics this story is about</span>
                </label>
                <TagInput
                  id="seo-tags"
                  value={tags}
                  onChange={setTags}
                  placeholder="Productivity, Deep Work…"
                />
                <p className="mt-1.5 text-xs text-secondary/70">
                  Up to {MAX_TAGS}. Press Enter or comma after each one.
                </p>
              </div>

              <div>
                <label htmlFor="seo-keywords" className="block text-xs font-medium mb-2">
                  Search keywords <span className="text-secondary font-normal">· phrases people would search for</span>
                </label>
                <TagInput
                  id="seo-keywords"
                  value={seoKeywords}
                  onChange={setSeoKeywords}
                  max={MAX_TAGS * 2}
                  placeholder="how to focus better…"
                />
              </div>

              <div>
                <div className="flex items-baseline justify-between mb-2">
                  <label htmlFor="meta-title" className="text-xs font-medium">
                    Meta title <span className="text-secondary font-normal">· defaults to your title</span>
                  </label>
                  <span className={`text-xs ${metaTitle.length > META_TITLE_LIMIT ? "text-amber-600" : "text-secondary/60"}`}>
                    {metaTitle.length}/{META_TITLE_LIMIT}
                  </span>
                </div>
                <input
                  id="meta-title"
                  value={metaTitle}
                  onChange={(e) => setMetaTitle(e.target.value)}
                  placeholder={title || "Title shown in search results"}
                  className="w-full rounded-xl border border-border px-3 py-2.5 text-sm bg-transparent outline-none focus:border-secondary/40 transition-colors placeholder:text-secondary/40"
                />
              </div>

              <div>
                <div className="flex items-baseline justify-between mb-2">
                  <label htmlFor="meta-description" className="text-xs font-medium">
                    Meta description <span className="text-secondary font-normal">· defaults to your subtitle</span>
                  </label>
                  <span className={`text-xs ${metaDescription.length > META_DESCRIPTION_LIMIT ? "text-amber-600" : "text-secondary/60"}`}>
                    {metaDescription.length}/{META_DESCRIPTION_LIMIT}
                  </span>
                </div>
                <textarea
                  id="meta-description"
                  value={metaDescription}
                  onChange={(e) => setMetaDescription(e.target.value)}
                  rows={3}
                  placeholder={description || "The one- or two-line summary shown under the title in search results"}
                  className="w-full rounded-xl border border-border px-3 py-2.5 text-sm bg-transparent outline-none focus:border-secondary/40 transition-colors resize-none leading-relaxed placeholder:text-secondary/40"
                />
              </div>

              {/* How the story will look in a search result */}
              <div className="rounded-xl bg-secondary/5 p-4">
                <p className="text-[11px] uppercase tracking-wide text-secondary/60 mb-3">Search preview</p>
                <p className="text-xs text-secondary truncate">{previewUrl}</p>
                <p className="text-[15px] text-blue-700 leading-snug mt-0.5 line-clamp-2">
                  {metaTitle.trim() || title || "Your story title"}
                </p>
                <p className="text-xs text-secondary leading-relaxed mt-1 line-clamp-2">
                  {metaDescription.trim() || description || "Your story's summary will appear here."}
                </p>
              </div>
            </div>
          )}
        </section>

        {/* Review notice — quiet, single line */}
        <div className="mt-20 pt-6 border-t border-border flex items-start gap-2 text-xs text-secondary">
          <Info size={14} className="mt-0.5 flex-shrink-0" />
          <p>
            {status === "published"
              ? "Changes to a published story go live as soon as you press Update — they aren't autosaved."
              : "Your work is saved as a draft automatically. It stays private until you submit it, and an admin reviews it before it appears publicly."}
          </p>
        </div>

        </div>
        )}
      </main>
    </div>
  );
}

export default function WritePage() {
  return (
    <Suspense
      fallback={<EditorSkeleton withHeader />}
    >
      <WritePageInner />
    </Suspense>
  );
}
