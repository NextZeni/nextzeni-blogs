"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useBlogs } from "@/context/BlogContext";
import { CATEGORIES, calcReadingTime } from "@/data/dummy";
import { X } from "lucide-react";

export default function WritePage() {
  const router = useRouter();
  const { addBlog } = useBlogs();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [content, setContent] = useState("");
  const [author, setAuthor] = useState("");
  const [publishing, setPublishing] = useState(false);
  const [error, setError] = useState("");

  const contentRef = useRef<HTMLTextAreaElement>(null);

  function autoResize(el: HTMLTextAreaElement) {
    el.style.height = "auto";
    el.style.height = el.scrollHeight + "px";
  }

  function handlePublish() {
    setError("");
    if (!title.trim()) return setError("Give your story a title.");
    if (!author.trim()) return setError("Add your name.");
    if (!content.trim()) return setError("Your story needs some content.");

    setPublishing(true);

    const id = Date.now().toString();
    const now = new Date();
    const date = now.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

    addBlog({
      id,
      title: title.trim(),
      description: description.trim() || title.trim(),
      author: author.trim(),
      date,
      readingTime: calcReadingTime(content),
      category,
      claps: 0,
      responses: 0,
      content: content.trim(),
    });

    router.push(`/article/${id}`);
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
            <Link href="/" className="text-xl font-extrabold tracking-tighter">ZENI.</Link>
          </div>

          <div className="flex items-center gap-3">
            {error && (
              <p className="text-sm text-red-500">{error}</p>
            )}
            <button
              onClick={handlePublish}
              disabled={publishing}
              className="bg-accent text-white text-sm font-medium px-5 py-2 rounded-full hover:bg-accent/90 transition-colors disabled:opacity-60"
            >
              {publishing ? "Publishing..." : "Publish"}
            </button>
          </div>
        </div>
      </header>

      {/* Editor */}
      <main className="max-w-[680px] mx-auto px-6 pt-12 pb-32">

        {/* Author + Category row */}
        <div className="flex items-center gap-4 mb-10">
          <input
            type="text"
            placeholder="Your name"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            className="flex-1 text-sm border-b border-border bg-transparent outline-none py-2 placeholder:text-secondary/50 text-foreground"
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="text-sm text-secondary bg-secondary/8 rounded-full px-4 py-2 outline-none border-0 cursor-pointer"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        {/* Title */}
        <textarea
          placeholder="Title"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            autoResize(e.target);
          }}
          rows={2}
          className="serif w-full text-4xl md:text-5xl font-bold text-foreground placeholder:text-foreground/20 bg-transparent border-0 outline-none resize-none leading-tight tracking-tight mb-4 overflow-hidden"
          style={{ height: "auto" }}
        />

        {/* Subtitle / Description */}
        <textarea
          placeholder="Tell your story's key insight... (optional)"
          value={description}
          onChange={(e) => {
            setDescription(e.target.value);
            autoResize(e.target);
          }}
          rows={2}
          className="w-full text-xl text-secondary placeholder:text-secondary/30 bg-transparent border-0 outline-none resize-none leading-relaxed mb-10 font-light overflow-hidden"
          style={{ height: "auto" }}
        />

        {/* Divider */}
        <div className="border-t border-border mb-10" />

        {/* Content */}
        <textarea
          ref={contentRef}
          placeholder="Write your story here...

Use blank lines to separate paragraphs. Your story will be beautifully formatted when published."
          value={content}
          onChange={(e) => {
            setContent(e.target.value);
            autoResize(e.target);
          }}
          rows={20}
          className="w-full text-lg text-foreground placeholder:text-secondary/30 bg-transparent border-0 outline-none resize-none leading-[1.85] font-light overflow-hidden"
          style={{ minHeight: "400px", height: "auto" }}
        />

        {/* Heading hint */}
        {content.length === 0 && (
          <div className="mt-8 p-5 bg-secondary/4 rounded-xl border border-border">
            <p className="text-xs font-semibold text-secondary uppercase tracking-widest mb-3">Formatting tips</p>
            <div className="space-y-2 text-sm text-secondary">
              <p><span className="font-mono bg-secondary/10 px-1.5 py-0.5 rounded text-foreground">## Heading</span> → Section heading (appears in Table of Contents)</p>
              <p><span className="font-mono bg-secondary/10 px-1.5 py-0.5 rounded text-foreground">### Sub-heading</span> → Sub-section heading</p>
              <p>Blank line between paragraphs to separate them.</p>
            </div>
          </div>
        )}

        {/* Word count */}
        {content.length > 0 && (
          <p className="text-xs text-secondary/50 mt-4 text-right">
            {content.trim().split(/\s+/).filter(Boolean).length} words · {calcReadingTime(content)}
          </p>
        )}
      </main>
    </div>
  );
}
