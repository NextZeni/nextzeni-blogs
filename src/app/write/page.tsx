"use client";

import { useState, useRef } from "react";
import Link from "next/link";

import { useBlogs } from "@/context/BlogContext";
import { useAuth } from "@/context/AuthContext";
import { CATEGORIES, calcReadingTime } from "@/data/dummy";
import { X, ImagePlus, Loader2, CheckCircle } from "lucide-react";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "@/lib/firebase";

export default function WritePage() {
  const { addBlog } = useBlogs();
  const { user } = useAuth();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [content, setContent] = useState("");
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const contentRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function autoResize(el: HTMLTextAreaElement) {
    el.style.height = "auto";
    el.style.height = el.scrollHeight + "px";
  }

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
      let coverImage: string | undefined;

      if (coverFile) {
        const storageRef = ref(storage, `covers/${Date.now()}_${coverFile.name}`);
        const snapshot = await uploadBytes(storageRef, coverFile);
        coverImage = await getDownloadURL(snapshot.ref);
      }

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

      setSubmitted(true);
    } catch (err) {
      console.error(err);
      setError("Failed to submit. Please try again.");
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
          <Link href="/" className="bg-button text-white px-6 py-2.5 rounded-full text-sm font-medium hover:bg-button/90 transition-colors">
            Back to home
          </Link>
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
          <h2 className="text-2xl font-bold mb-3">Story submitted!</h2>
          <p className="text-secondary mb-2 leading-relaxed">
            Your story is now <span className="font-semibold text-amber-600">pending review</span> by the admin.
          </p>
          <p className="text-secondary text-sm mb-8">
            Once approved, it will appear on the home feed. You can track its status in your dashboard.
          </p>
          <div className="flex gap-3 justify-center">
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

          <div className="flex items-center gap-3">
            {error && <p className="text-sm text-red-500 max-w-xs truncate">{error}</p>}
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="bg-button text-white text-sm font-medium px-5 py-2 rounded-full hover:bg-button/90 transition-colors disabled:opacity-60 flex items-center gap-2"
            >
              {submitting && <Loader2 size={14} className="animate-spin" />}
              {submitting ? "Submitting…" : "Submit for Review"}
            </button>
          </div>
        </div>
      </header>

      {/* Editor */}
      <main className="max-w-[680px] mx-auto px-6 pt-12 pb-32">

        {/* Author info (read-only from auth) */}
        <div className="flex items-center gap-3 mb-8 p-3 bg-secondary/5 rounded-xl border border-border">
          <div className="w-8 h-8 rounded-full bg-accent/15 flex items-center justify-center text-sm font-bold text-accent">
            {user.firstName[0]}
          </div>
          <div>
            <p className="text-sm font-medium">{user.firstName} {user.lastName}</p>
            <p className="text-xs text-secondary">{user.role}</p>
          </div>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="ml-auto text-sm text-secondary bg-secondary/8 rounded-full px-4 py-2 outline-none border-0 cursor-pointer"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        {/* Cover image upload */}
        <div
          onClick={() => fileInputRef.current?.click()}
          className="mb-8 cursor-pointer group"
        >
          {coverPreview ? (
            <div className="relative">
              <img src={coverPreview} alt="Cover" className="w-full h-48 object-cover rounded-xl" />
              <div className="absolute inset-0 rounded-xl bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <p className="text-white text-sm font-medium">Change cover</p>
              </div>
            </div>
          ) : (
            <div className="w-full h-36 rounded-xl border-2 border-dashed border-border hover:border-accent transition-colors flex flex-col items-center justify-center gap-2 text-secondary hover:text-accent">
              <ImagePlus size={24} />
              <p className="text-sm">Add cover image (optional)</p>
            </div>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleCoverChange}
            className="hidden"
          />
        </div>

        {/* Title */}
        <textarea
          placeholder="Title"
          value={title}
          onChange={(e) => { setTitle(e.target.value); autoResize(e.target); }}
          rows={2}
          className="serif w-full text-4xl md:text-5xl font-bold text-foreground placeholder:text-foreground/20 bg-transparent border-0 outline-none resize-none leading-tight tracking-tight mb-4 overflow-hidden"
          style={{ height: "auto" }}
        />

        {/* Subtitle */}
        <textarea
          placeholder="Tell your story's key insight… (optional)"
          value={description}
          onChange={(e) => { setDescription(e.target.value); autoResize(e.target); }}
          rows={2}
          className="w-full text-xl text-secondary placeholder:text-secondary/30 bg-transparent border-0 outline-none resize-none leading-relaxed mb-10 font-light overflow-hidden"
          style={{ height: "auto" }}
        />

        <div className="border-t border-border mb-10" />

        {/* Content */}
        <textarea
          ref={contentRef}
          placeholder={`Write your story here…\n\nUse blank lines to separate paragraphs.`}
          value={content}
          onChange={(e) => { setContent(e.target.value); autoResize(e.target); }}
          rows={20}
          className="w-full text-lg text-foreground placeholder:text-secondary/30 bg-transparent border-0 outline-none resize-none leading-[1.85] font-light overflow-hidden"
          style={{ minHeight: "400px", height: "auto" }}
        />

        {content.length === 0 && (
          <div className="mt-8 p-5 bg-secondary/4 rounded-xl border border-border">
            <p className="text-xs font-semibold text-accent uppercase tracking-widest mb-3">Formatting tips</p>
            <div className="space-y-2 text-sm text-secondary">
              <p><span className="font-mono bg-secondary/10 px-1.5 py-0.5 rounded text-foreground">## Heading</span> → Section heading</p>
              <p><span className="font-mono bg-secondary/10 px-1.5 py-0.5 rounded text-foreground">### Sub-heading</span> → Sub-section</p>
              <p>Blank line between paragraphs to separate them.</p>
            </div>
          </div>
        )}

        {content.length > 0 && (
          <p className="text-xs text-secondary/50 mt-4 text-right">
            {content.trim().split(/\s+/).filter(Boolean).length} words · {calcReadingTime(content)}
          </p>
        )}

        {/* Review notice */}
        <div className="mt-10 p-4 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-800">
          <span className="font-semibold">Note:</span> Your story will be reviewed by an admin before it appears publicly. You can track the status in your dashboard.
        </div>
      </main>
    </div>
  );
}
