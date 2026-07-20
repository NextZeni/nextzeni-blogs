"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import { useBlogs } from "@/context/BlogContext";
import { parseContent, renderInline, renderTable } from "@/data/dummy";
import {
  ArrowLeft, Bookmark, Heart, MessageCircle, Share2, Trash2,
  Volume2, Play, Pause, Square, ChevronUp, ChevronDown, Gauge,
  Send, ThumbsUp, Trash, X,
} from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

// Custom Social Icon SVGs to bypass legacy Lucide-React version constraints & lock dimensions safely
const TwitterIcon = ({ className = "" }: { className?: string }) => (
  <svg className={`w-4 h-4 flex-shrink-0 ${className}`} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const LinkedinIcon = ({ className = "" }: { className?: string }) => (
  <svg className={`w-4 h-4 flex-shrink-0 ${className}`} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" />
  </svg>
);

const GithubIcon = ({ className = "" }: { className?: string }) => (
  <svg className={`w-4 h-4 flex-shrink-0 ${className}`} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.577.688.479C19.138 20.162 22 16.418 22 12c0-5.523-4.477-10-10-10z" clipRule="evenodd" />
  </svg>
);

const WebsiteIcon = ({ className = "" }: { className?: string }) => (
  <svg className={`w-4 h-4 flex-shrink-0 ${className}`} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" aria-hidden="true">
    <circle cx="12" cy="12" r="10" />
    <line x1="2" y1="12" x2="22" y2="12" />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>
);

const InstagramIcon = ({ className = "" }: { className?: string }) => (
  <svg className={`w-4 h-4 flex-shrink-0 ${className}`} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" aria-hidden="true">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

const FacebookIcon = ({ className = "" }: { className?: string }) => (
  <svg className={`w-4 h-4 flex-shrink-0 ${className}`} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
  </svg>
);

const PinterestIcon = ({ className = "" }: { className?: string }) => (
  <svg className={`w-4 h-4 flex-shrink-0 ${className}`} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.41 7.61 11.162-.102-.947-.19-2.399.04-3.43.207-.887 1.334-5.642 1.334-5.642s-.34-.68-.34-1.686c0-1.58.917-2.76 2.06-2.76 1.016 0 1.507.76 1.507 1.67 0 1.02-.65 2.54-.985 3.96-.28 1.18.599 2.146 1.762 2.146 2.115 0 3.743-2.23 3.743-5.449 0-2.848-2.048-4.84-4.966-4.84-3.38 0-5.36 2.53-5.36 5.148 0 1.02.393 2.117.88 2.709.097.118.11.22.08.344l-.34 1.385c-.055.22-.18.268-.415.158-1.55-.72-2.518-2.985-2.518-4.793 0-3.899 2.833-7.482 8.18-7.482 4.293 0 7.63 3.06 7.63 7.15 0 4.268-2.69 7.707-6.42 7.707-1.254 0-2.433-.651-2.837-1.42l-.773 2.94c-.28 1.066-1.037 2.404-1.543 3.228 1.127.35 2.32.54 3.555.54 6.622 0 11.988-5.366 11.988-11.987C24.004 5.367 18.638 0 12.017 0z" />
  </svg>
);

const ThreadsIcon = ({ className = "" }: { className?: string }) => (
  <svg className={`w-4 h-4 flex-shrink-0 ${className}`} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M13.56 12.38c-.1-.76-.66-1.28-1.46-1.28-.76 0-1.34.52-1.48 1.28h2.94zm2.14 0c-.1 1.74-1.38 3.12-3.34 3.12-1.42 0-2.64-.78-3.14-2h6.58c.04-.38.08-.74.08-1.12 0-3.04-2.18-5.18-5.24-5.18-3.14 0-5.24 2.2-5.24 5.18 0 3.06 2.18 5.24 5.24 5.24 1.34 0 2.58-.46 3.58-1.3l.08.08c1.38 1.38 3.32 1.66 4.96.8a8.3 8.3 0 0 0 4.46-7.38c0-5.18-4.22-9.4-9.4-9.4S2.6 6.82 2.6 12s4.22 9.4 9.4 9.4c1.92 0 3.76-.58 5.3-1.68l-1.3-1.64A9.5 9.5 0 0 1 12 19.34c-4.08 0-7.4-3.32-7.4-7.4s3.32-7.4 7.4-7.4 7.4 3.32 7.4 7.4c0 2.42-1.34 4.36-3.4 4.36-1 0-1.78-.54-2.16-1.32-.4.8-.96 1.32-1.92 1.32-1.8 0-2.92-1.42-2.92-3.34 0-1.94 1.12-3.36 2.92-3.36.96 0 1.52.52 1.92 1.3.16-.76.78-1.3 1.78-1.3.94 0 1.84.48 2.22 1.26a5.55 5.55 0 0 1 .1 1.26h.02z" />
  </svg>
);

function fmt(n: number) {
  return n >= 1000 ? (n / 1000).toFixed(1).replace(/\.0$/, "") + "K" : String(n);
}
function fmtTime(s: number) {
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}
function stripMarkdown(text: string): string {
  return text
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
    .replace(/_([^_]+)_/g, "$1")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/~~([^~]+)~~/g, "$1")
    .trim();
}


export default function ArticlePage() {
  const { id } = useParams<{ id: string }>();
  const {
    getBlog, deleteBlog, blogs, incrementViews,
    incrementClaps, decrementClaps, comments, addComment, deleteComment, likeComment
  } = useBlogs();
  const { user, users, toggleSaveArticle, toggleLikeArticle } = useAuth();
  const router = useRouter();
  const article = getBlog(id);

  const authorUser = useMemo(() => {
    if (!article) return null;
    return users.find((u) => u.id === article.authorId);
  }, [users, article]);

  useEffect(() => {
    if (!id) return;
    const sessionKey = `viewed_${id}`;
    if (sessionStorage.getItem(sessionKey)) return;

    const timer = setTimeout(() => {
      incrementViews(id)
        .then(() => {
          sessionStorage.setItem(sessionKey, "true");
        })
        .catch(console.error);
    }, 10000);

    return () => clearTimeout(timer);
  }, [id, incrementViews]);

  // — basic —
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [activeHeading, setActiveHeading] = useState("");

  const clapped = useMemo(() => {
    return user?.likedArticles?.includes(id as string) ?? false;
  }, [id, user?.likedArticles]);

  const [commentsOpen, setCommentsOpen] = useState(false);
  const [newCommentText, setNewCommentText] = useState("");
  const [submittingComment, setSubmittingComment] = useState(false);

  const articleComments = useMemo(() => {
    return comments
      .filter((c) => c.articleId === id)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [id, comments]);

  const isSaved = useMemo(() => {
    return user?.savedArticles?.includes(id as string) ?? false;
  }, [id, user?.savedArticles]);

  // — audio —
  const [audioOpen, setAudioOpen] = useState(false);
  const [audioState, setAudioState] = useState<"idle" | "playing" | "paused">("idle");
  const [audioRate, setAudioRate] = useState(1);
  const [readPos, setReadPos] = useState(0); // char index in fullText
  const utterRef = useRef<SpeechSynthesisUtterance | null>(null);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<string>("");

  // — speed test —
  const [speedWpm, setSpeedWpm] = useState(250);
  const [speedActive, setSpeedActive] = useState(false);
  const [speedOpen, setSpeedOpen] = useState(false);
  const [speedWords, setSpeedWords] = useState<string[]>([]);
  const [speedIdx, setSpeedIdx] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const speedRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const blocks = useMemo(() => (article ? parseContent(article.content) : []), [article?.id]);
  const headings = useMemo(() => blocks.filter((b) => b.type === "h2" || b.type === "h3"), [blocks]);

  // char offsets per block for audio highlight
  const blocksWithPos = useMemo(() => {
    let pos = 0;
    return blocks.map((b) => {
      const start = pos;
      pos += b.text.length + 1;
      return { ...b, start, end: pos };
    });
  }, [blocks]);

  const fullText = useMemo(() => blocks.map((b) => b.text).join(" "), [blocks]);

  // all paragraph words for speed reader
  const allWords = useMemo(
    () => blocks.filter((b) => b.type === "paragraph").flatMap((b) => b.text.split(/\s+/).filter(Boolean)),
    [blocks]
  );

  // words per flash based on WPM
  const wpc = speedWpm < 200 ? 1 : speedWpm < 350 ? 2 : speedWpm < 500 ? 3 : 4;

  // ToC observer
  useEffect(() => {
    if (!headings.length) return;
    const els = headings.map((h) => document.getElementById(h.id)).filter(Boolean) as HTMLElement[];
    const obs = new IntersectionObserver(
      (entries) => { for (const e of entries) { if (e.isIntersecting) { setActiveHeading(e.target.id); break; } } },
      { rootMargin: "-10% 0% -60% 0%" }
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, [article?.id]);

  // load available voices
  useEffect(() => {
    if (typeof window === "undefined") return;
    function loadVoices() {
      const all = window.speechSynthesis.getVoices();
      if (!all.length) return;
      // English-first, then everything else
      const sorted = [
        ...all.filter((v) => v.lang.startsWith("en")),
        ...all.filter((v) => !v.lang.startsWith("en")),
      ];
      setVoices(sorted);
      if (!selectedVoice) setSelectedVoice(sorted[0]?.name ?? "");
    }
    loadVoices();
    window.speechSynthesis.addEventListener("voiceschanged", loadVoices);
    return () => window.speechSynthesis.removeEventListener("voiceschanged", loadVoices);
  }, []);

  // cleanup
  useEffect(() => () => {
    if (typeof window !== "undefined") window.speechSynthesis?.cancel();
    if (speedRef.current) clearInterval(speedRef.current);
    if (timerRef.current) clearInterval(timerRef.current);
  }, []);

  if (!article) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-secondary">Story not found.</p>
        <Link href="/" className="text-sm text-accent hover:underline">← Back to home</Link>
      </div>
    );
  }

  // ── audio ──
  function audioPlay() {
    if (audioState === "paused") { window.speechSynthesis.resume(); setAudioState("playing"); return; }
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(fullText);
    u.rate = audioRate;
    const voice = voices.find((v) => v.name === selectedVoice);
    if (voice) u.voice = voice;
    u.onboundary = (e) => setReadPos(e.charIndex + (e.charLength ?? 0));
    u.onend = () => { setAudioState("idle"); setReadPos(fullText.length); };
    utterRef.current = u;
    window.speechSynthesis.speak(u);
    setAudioState("playing");
    setReadPos(0);
  }
  function audioPause() { window.speechSynthesis.pause(); setAudioState("paused"); }
  function audioStop() { window.speechSynthesis.cancel(); setAudioState("idle"); setReadPos(0); }
  function changeRate(r: number) {
    setAudioRate(r);
    if (audioState === "playing") { window.speechSynthesis.cancel(); setAudioState("idle"); }
  }

  // ── speed reader ──
  function doStart(wpm: number) {
    if (speedRef.current) clearInterval(speedRef.current);
    if (timerRef.current) clearInterval(timerRef.current);
    if (!allWords.length) return;
    const chunk = wpm < 200 ? 1 : wpm < 350 ? 2 : wpm < 500 ? 3 : 4;
    const ms = (60000 / wpm) * chunk;
    setSpeedWords(allWords);
    setSpeedIdx(0);
    setElapsed(0);
    setSpeedWpm(wpm);
    setSpeedActive(true);
    speedRef.current = setInterval(() => {
      setSpeedIdx((prev) => {
        const next = prev + chunk;
        if (next >= allWords.length) {
          clearInterval(speedRef.current!);
          clearInterval(timerRef.current!);
          setSpeedActive(false);
          return 0;
        }
        return next;
      });
    }, ms);
    timerRef.current = setInterval(() => setElapsed((s) => s + 1), 1000);
  }
  function stopSpeed() {
    if (speedRef.current) clearInterval(speedRef.current);
    if (timerRef.current) clearInterval(timerRef.current);
    setSpeedActive(false);
    setSpeedIdx(0);
    setElapsed(0);
  }

  function handleClap() {
    if (!article) return;
    if (!user) {
      router.push("/auth/login");
      return;
    }
    const isNowLiked = toggleLikeArticle(article.id);
    if (isNowLiked) {
      incrementClaps(article.id).catch(console.error);
    } else {
      decrementClaps(article.id).catch(console.error);
    }
  }

  async function handleSubmitComment(e: React.FormEvent) {
    e.preventDefault();
    if (!user || !newCommentText.trim() || !article) return;
    
    setSubmittingComment(true);
    try {
      await addComment({
        articleId: article.id,
        authorId: user.id,
        authorName: `${user.firstName} ${user.lastName}`,
        content: newCommentText.trim(),
        date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
        likes: 0,
      });
      setNewCommentText("");
    } catch (err) {
      console.error("Error adding comment:", err);
    } finally {
      setSubmittingComment(false);
    }
  }
  function handleDelete() { deleteBlog(article!.id); router.push("/"); }
  function scrollTo(hId: string) { document.getElementById(hId)?.scrollIntoView({ behavior: "smooth", block: "start" }); }

  const related = blogs.filter((b) => b.id !== article.id).slice(0, 3);
  const speedProgress = speedWords.length ? Math.round((speedIdx / speedWords.length) * 100) : 0;
  const audioProgress = fullText.length ? (readPos / fullText.length) * 100 : 0;

  return (
    <div className="min-h-screen bg-background">
      {/* ── Header ── */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-border">
        <div className="max-w-[1300px] mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-5">
            <Link href="/" className="text-secondary hover:text-foreground transition-colors"><ArrowLeft size={20} /></Link>
            <Link href="/" className="text-xl font-extrabold tracking-tighter flex items-baseline"><span className="font-light text-secondary">Next</span><span>Zeni</span></Link>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => { if (article) toggleSaveArticle(article.id); }}
              disabled={!user}
              className={`transition-colors cursor-pointer ${isSaved ? "text-accent" : "text-secondary hover:text-foreground"}`}
              title={user ? (isSaved ? "Remove bookmark" : "Bookmark this story") : "Sign in to bookmark"}
            >
              <Bookmark size={19} fill={isSaved ? "currentColor" : "none"} />
            </button>
            <button className="hover:text-foreground transition-colors text-secondary cursor-pointer">
              <Share2 size={19} />
            </button>
            {confirmDelete ? (
              <div className="flex items-center gap-2">
                <span className="text-xs">Delete?</span>
                <button onClick={handleDelete} className="text-xs text-red-500 font-semibold hover:underline">Yes</button>
                <button onClick={() => setConfirmDelete(false)} className="text-xs hover:underline">No</button>
              </div>
            ) : (
              <button onClick={() => setConfirmDelete(true)} className="hover:text-red-500 transition-colors">
                <Trash2 size={17} />
              </button>
            )}
          </div>
        </div>
      </header>

      {/* ── Three-column layout ── */}
      <div className="max-w-[1300px] mx-auto px-6 pt-12 pb-28 flex justify-between items-start">

        {/* ── LEFT: Table of Contents ── */}
        <aside className="hidden xl:block w-[190px] flex-shrink-0 sticky top-24">
          <div>
            {headings.length > 0 ? (
              <>
                <p className="text-[10px] font-semibold uppercase tracking-widest text-accent mb-4">
                  On this page
                </p>
                <nav className="space-y-0.5">
                  {headings.map((h) => (
                    <button
                      key={h.id}
                      onClick={() => scrollTo(h.id)}
                      className={`w-full text-left leading-snug py-1.5 transition-all duration-150 border-l-2 ${
                        h.type === "h3" ? "pl-5 text-[11px]" : "pl-3 text-xs"
                      } ${
                        activeHeading === h.id
                          ? "border-foreground text-foreground font-semibold"
                          : "border-transparent text-secondary/70 hover:text-foreground hover:border-secondary/40"
                      }`}
                    >
                      {stripMarkdown(h.text)}
                    </button>
                  ))}
                </nav>
              </>
            ) : (
              <p className="text-[11px] text-secondary/30 italic">No sections</p>
            )}
          </div>
        </aside>

        {/* ── CENTER: Article or Speed Reader ── */}
        <main className="flex-1 min-w-0 max-w-[660px]">
          {speedActive ? (
            /* ── SPEED READER ── */
            <div className="flex flex-col items-center justify-center min-h-[70vh] py-12 select-none">
              {/* top progress bar */}
              <div className="w-full h-0.5 bg-secondary/10 rounded-full mb-12 overflow-hidden">
                <div className="h-full bg-accent transition-all duration-150" style={{ width: `${speedProgress}%` }} />
              </div>

              <p className="text-[10px] uppercase tracking-widest text-accent mb-8">
                {speedWpm} WPM · {speedIdx} / {speedWords.length} words
              </p>

              {/* word display */}
              <div className="min-h-[90px] flex items-center justify-center mb-8 w-full">
                <span className="serif text-5xl md:text-6xl font-bold text-center leading-tight tracking-tight text-foreground">
                  {speedWords.slice(speedIdx, speedIdx + wpc).join(" ")}
                </span>
              </div>

              {/* focus dot */}
              <div className="w-1 h-1 rounded-full bg-accent/60 mb-8" />

              <p className="text-xs text-secondary/40 mb-10">
                {fmtTime(elapsed)} elapsed · {speedWords.length - speedIdx} words left
              </p>

              {/* speed selector */}
              <div className="flex items-center gap-2 mb-8">
                <span className="text-xs text-secondary mr-1">Speed</span>
                {[100, 200, 300, 400, 600].map((w) => (
                  <button
                    key={w}
                    onClick={() => doStart(w)}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                      speedWpm === w ? "bg-button text-white" : "bg-secondary/8 text-secondary hover:bg-secondary/20"
                    }`}
                  >
                    {w}
                  </button>
                ))}
              </div>

              <button
                onClick={stopSpeed}
                className="flex items-center gap-2 text-sm text-secondary hover:text-foreground border border-border px-6 py-2.5 rounded-full transition-colors"
              >
                <Square size={14} fill="currentColor" />
                Stop reading
              </button>
            </div>
          ) : (
            /* ── ARTICLE ── */
            <>
              <p className="text-xs font-semibold text-accent mb-4 uppercase tracking-widest">{article.category}</p>

              <h1 className="serif text-4xl md:text-5xl font-bold leading-tight tracking-tight mb-5">
                {article.title}
              </h1>

              {article.description !== article.title && (
                <p className="text-xl text-secondary leading-relaxed mb-8 font-light">{article.description}</p>
              )}

              {/* author + listen + speed read */}
              <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-border">
                <Link href={`/profile/${article.authorId}`} className="flex items-center gap-4 hover:opacity-85 transition-opacity group">
                  <div className="w-10 h-10 rounded-full bg-accent/15 flex items-center justify-center font-bold text-accent text-sm flex-shrink-0 group-hover:scale-102 transition-transform duration-200">
                    {article.author[0]?.toUpperCase()}
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-foreground group-hover:text-accent transition-colors">{article.author}</p>
                    <p className="text-xs text-secondary mt-0.5">
                      {article.readingTime} · {article.date} · {fmt(article.views ?? 0)} views
                    </p>
                  </div>
                </Link>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setAudioOpen((v) => !v);
                      setSpeedOpen(false);
                    }}
                    className={`flex items-center gap-1.5 text-sm px-4 py-1.5 rounded-full border transition-colors cursor-pointer ${
                      audioOpen ? "border-accent text-accent bg-accent/5" : "border-border text-secondary hover:text-foreground"
                    }`}
                  >
                    <Volume2 size={14} />
                    Listen
                  </button>
                  <button
                    onClick={() => {
                      setSpeedOpen((v) => !v);
                      setAudioOpen(false);
                    }}
                    className={`flex items-center gap-1.5 text-sm px-4 py-1.5 rounded-full border transition-colors cursor-pointer ${
                      speedOpen ? "border-accent text-accent bg-accent/5" : "border-border text-secondary hover:text-foreground"
                    }`}
                  >
                    <Gauge size={14} />
                    Speed Read
                  </button>
                </div>
              </div>

              {/* ── Audio Player ── */}
              {audioOpen && (
                <div className="mt-4 mb-1 p-4 rounded-xl border border-border bg-secondary/3">
                  <div className="flex items-center gap-3">
                    {/* play/pause */}
                    <button
                      onClick={audioState === "playing" ? audioPause : audioPlay}
                      className="w-8 h-8 rounded-full bg-button text-white flex items-center justify-center hover:bg-button/80 transition-colors flex-shrink-0 cursor-pointer"
                    >
                      {audioState === "playing"
                        ? <Pause size={13} fill="currentColor" />
                        : <Play size={13} fill="currentColor" className="ml-0.5" />
                      }
                    </button>
                    {/* stop */}
                    <button onClick={audioStop} className="text-secondary hover:text-foreground transition-colors flex-shrink-0 cursor-pointer">
                      <Square size={15} fill="currentColor" />
                    </button>
                    {/* progress bar */}
                    <div className="flex-1 h-1 bg-secondary/15 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-accent rounded-full transition-all duration-300"
                        style={{ width: `${audioProgress}%` }}
                      />
                    </div>
                    {/* speed */}
                    <div className="flex items-center gap-0.5 flex-shrink-0">
                      {[0.75, 1, 1.25, 1.5, 2].map((r) => (
                        <button
                          key={r}
                          onClick={() => changeRate(r)}
                          className={`text-[11px] px-1.5 py-0.5 rounded transition-colors font-medium cursor-pointer ${
                            audioRate === r ? "bg-button text-white" : "text-secondary hover:text-foreground"
                          }`}
                        >
                          {r}×
                        </button>
                      ))}
                    </div>
                  </div>
                  {audioState === "idle" && readPos === 0 && (
                    <p className="text-[11px] text-secondary/40 mt-2.5">
                      Press play — unread text dims, clears as it is spoken aloud.
                    </p>
                  )}

                  {/* Voice selector */}
                  {voices.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-border">
                      <p className="text-[10px] uppercase tracking-widest text-accent mb-2">Voice</p>
                      <div className="flex flex-wrap gap-1.5">
                        {voices.slice(0, 8).map((v) => (
                          <button
                            key={v.name}
                            onClick={() => {
                              setSelectedVoice(v.name);
                              if (audioState === "playing") {
                                window.speechSynthesis.cancel();
                                setAudioState("idle");
                              }
                            }}
                            title={`${v.name} (${v.lang})`}
                            className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition-colors max-w-[120px] truncate cursor-pointer ${
                              selectedVoice === v.name
                                ? "bg-button text-white"
                                : "bg-secondary/8 text-secondary hover:bg-secondary/20"
                            }`}
                          >
                            {v.name.replace(/\s*\(.*?\)/g, "").trim()}
                          </button>
                        ))}
                        {voices.length > 8 && (
                          <select
                            value={selectedVoice}
                            onChange={(e) => {
                              setSelectedVoice(e.target.value);
                              if (audioState === "playing") {
                                window.speechSynthesis.cancel();
                                setAudioState("idle");
                              }
                            }}
                            className="px-2.5 py-1 rounded-full text-[11px] bg-secondary/8 text-secondary border-0 outline-none cursor-pointer"
                          >
                            {voices.slice(8).map((v) => (
                              <option key={v.name} value={v.name}>{v.name} ({v.lang})</option>
                            ))}
                          </select>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* ── Collapsible Mobile Speed Reader Settings ── */}
              {speedOpen && (
                <div className="lg:hidden mt-4 mb-4 p-5 rounded-xl border border-border bg-secondary/3">
                  <div className="flex items-center gap-2.5 mb-3">
                    <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                      <Gauge size={16} className="text-accent" />
                    </div>
                    <h3 className="font-bold text-sm">Speed Reading Settings</h3>
                  </div>
                  <p className="text-xs text-secondary leading-relaxed mb-5">
                    Words flash one at a time. Read as fast as you can — then push higher.
                  </p>

                  {/* WPM slider */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-secondary">Speed</span>
                      <span className="text-sm font-bold text-accent">{speedWpm} WPM</span>
                    </div>
                    <input
                      type="range" min={100} max={600} step={50}
                      value={speedWpm}
                      onChange={(e) => setSpeedWpm(Number(e.target.value))}
                      className="w-full accent-foreground h-1 cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-secondary/40 mt-1">
                      <span>100</span><span>600</span>
                    </div>
                  </div>

                  {/* words/flash indicator */}
                  <div className="flex items-center justify-between mb-4 px-3 py-2 bg-white border border-border rounded-lg">
                    <span className="text-xs text-secondary">Words per flash</span>
                    <span className="text-sm font-bold">{wpc}</span>
                  </div>

                  {/* preset buttons */}
                  <div className="grid grid-cols-4 gap-1 mb-4">
                    {[150, 250, 350, 500].map((w) => (
                      <button
                        key={w}
                        onClick={() => setSpeedWpm(w)}
                        className={`py-1.5 rounded-lg text-[11px] font-semibold transition-colors cursor-pointer ${
                          speedWpm === w ? "bg-button text-white" : "bg-white border border-border text-secondary hover:bg-secondary/10"
                        }`}
                      >
                        {w}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => {
                      setSpeedOpen(false);
                      doStart(speedWpm);
                    }}
                    className="w-full bg-button text-white text-sm font-medium py-2.5 rounded-full hover:bg-button/90 transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Play size={13} fill="currentColor" />
                    Start reading
                  </button>
                </div>
              )}

              {article.coverImage && (
                <div className="mt-6 rounded-2xl overflow-hidden aspect-video relative max-w-full bg-secondary/5 border border-border/40">
                  <img
                    src={article.coverImage}
                    alt={article.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* reaction bar */}
              <div className="flex items-center gap-5 py-4 mb-10 border-b border-border text-secondary">
                <button
                  onClick={handleClap}
                  className={`flex items-center gap-2 text-sm transition-colors ${clapped ? "text-accent" : "hover:text-foreground"}`}
                >
                  <Heart size={18} fill={clapped ? "currentColor" : "none"} />
                  <span>{fmt(article?.claps ?? 0)}</span>
                </button>
                <button
                  onClick={() => setCommentsOpen(true)}
                  className="flex items-center gap-2 hover:text-foreground transition-colors text-sm cursor-pointer"
                >
                  <MessageCircle size={18} /><span>{articleComments.length}</span>
                </button>
                <div className="flex-1" />
                <button
                  onClick={() => { if (article) toggleSaveArticle(article.id); }}
                  disabled={!user}
                  className={`transition-colors cursor-pointer ${isSaved ? "text-accent" : "text-secondary hover:text-foreground"}`}
                  title={user ? (isSaved ? "Remove bookmark" : "Bookmark this story") : "Sign in to bookmark"}
                >
                  <Bookmark size={18} fill={isSaved ? "currentColor" : "none"} />
                </button>
                <button className="hover:text-foreground transition-colors text-secondary cursor-pointer">
                  <Share2 size={18} />
                </button>
              </div>

              {/* ── Content with audio highlighting ── */}
              <div className="space-y-4">
                {blocksWithPos.map((block, i) => {
                  const audioOn = audioState !== "idle" || readPos > 0;
                  const isRead = audioOn && readPos >= block.end;
                  const isUnread = audioOn && readPos < block.start;
                  const color = !audioOn
                    ? "text-foreground"
                    : isRead
                    ? "text-foreground"
                    : isUnread
                    ? "text-foreground/20"
                    : "text-foreground/55";

                  if (block.type === "h2")
                    return (
                      <h2
                        key={i}
                        id={block.id}
                        className={`serif text-2xl font-bold mt-10 mb-2 tracking-tight scroll-mt-24 transition-colors duration-700 ${color}`}
                        dangerouslySetInnerHTML={{ __html: renderInline(block.text) }}
                      />
                    );
                  if (block.type === "h3")
                    return (
                      <h3
                        key={i}
                        id={block.id}
                        className={`serif text-xl font-semibold mt-8 mb-2 tracking-tight scroll-mt-24 transition-colors duration-700 ${color}`}
                        dangerouslySetInnerHTML={{ __html: renderInline(block.text) }}
                      />
                    );
                  if (block.type === "image")
                    return (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        key={i}
                        src={block.src}
                        alt={block.alt ?? ""}
                        className="story-image w-full rounded-xl my-4"
                      />
                    );
                  if (block.type === "table")
                    return (
                      <div
                        key={i}
                        className={`transition-colors duration-700 ${color}`}
                        dangerouslySetInnerHTML={{ __html: renderTable(block.text) }}
                      />
                    );
                  return (
                    <p
                      key={i}
                      className={`text-lg leading-[1.7] font-light transition-colors duration-700 ${color}`}
                      dangerouslySetInnerHTML={{ __html: renderInline(block.text) }}
                    />
                  );
                })}
              </div>

              {/* bottom reactions */}
              <div className="flex items-center gap-5 mt-16 pt-8 border-t border-border text-secondary">
                <button
                  onClick={handleClap}
                  className={`flex items-center gap-2 text-sm transition-colors ${clapped ? "text-accent" : "hover:text-foreground"}`}
                >
                  <Heart size={18} fill={clapped ? "currentColor" : "none"} />
                  <span>{fmt(article?.claps ?? 0)}</span>
                </button>
                <button
                  onClick={() => setCommentsOpen(true)}
                  className="flex items-center gap-2 hover:text-foreground transition-colors text-sm cursor-pointer"
                >
                  <MessageCircle size={18} /><span>{articleComments.length} responses</span>
                </button>
              </div>

              {/* author card */}
              <div className="mt-12 p-7 border border-border rounded-2xl">
                <div className="flex items-start gap-4">
                  <Link href={`/profile/${article.authorId}`} className="hover:opacity-85 transition-opacity flex-shrink-0">
                    <div className="w-14 h-14 rounded-full bg-accent/15 flex items-center justify-center font-bold text-accent text-xl shadow-sm hover:scale-102 transition-transform duration-200">
                      {article.author[0]?.toUpperCase()}
                    </div>
                  </Link>
                  <div>
                    <p className="text-xs text-accent uppercase tracking-widest mb-1 font-medium">Written by</p>
                    <Link href={`/profile/${article.authorId}`} className="hover:underline">
                      <h4 className="font-bold text-lg mb-1.5 text-foreground hover:text-accent transition-colors">{article.author}</h4>
                    </Link>

                    {/* author socials */}
                    {authorUser?.socials && Object.values(authorUser.socials).some(Boolean) && (
                      <div className="flex items-center gap-2.5 mb-3.5 mt-1.5 text-secondary flex-wrap">
                        {authorUser.socials.twitter && (
                          <a href={authorUser.socials.twitter} target="_blank" rel="noopener noreferrer" className="hover:text-accent p-1 transition-colors" title="Twitter / X">
                            <TwitterIcon />
                          </a>
                        )}
                        {authorUser.socials.linkedin && (
                          <a href={authorUser.socials.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-accent p-1 transition-colors" title="LinkedIn">
                            <LinkedinIcon />
                          </a>
                        )}
                        {authorUser.socials.github && (
                          <a href={authorUser.socials.github} target="_blank" rel="noopener noreferrer" className="hover:text-accent p-1 transition-colors" title="GitHub">
                            <GithubIcon />
                          </a>
                        )}
                        {authorUser.socials.website && (
                          <a href={authorUser.socials.website} target="_blank" rel="noopener noreferrer" className="hover:text-accent p-1 transition-colors" title="Website">
                            <WebsiteIcon />
                          </a>
                        )}
                        {authorUser.socials.instagram && (
                          <a href={authorUser.socials.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-accent p-1 transition-colors" title="Instagram">
                            <InstagramIcon />
                          </a>
                        )}
                        {authorUser.socials.facebook && (
                          <a href={authorUser.socials.facebook} target="_blank" rel="noopener noreferrer" className="hover:text-accent p-1 transition-colors" title="Facebook">
                            <FacebookIcon />
                          </a>
                        )}
                        {authorUser.socials.pinterest && (
                          <a href={authorUser.socials.pinterest} target="_blank" rel="noopener noreferrer" className="hover:text-accent p-1 transition-colors" title="Pinterest">
                            <PinterestIcon />
                          </a>
                        )}
                        {authorUser.socials.threads && (
                          <a href={authorUser.socials.threads} target="_blank" rel="noopener noreferrer" className="hover:text-accent p-1 transition-colors" title="Threads">
                            <ThreadsIcon />
                          </a>
                        )}
                      </div>
                    )}

                    <Link href="/write" className="inline-block bg-button text-white text-sm px-5 py-2 rounded-full hover:bg-button/90 transition-colors mt-1">
                      Write a story
                    </Link>
                  </div>
                </div>
              </div>

              {/* related */}
              {related.length > 0 && (
                <div className="mt-14">
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-accent mb-6">More stories</p>
                  <div className="space-y-6">
                    {related.map((b) => (
                      <Link key={b.id} href={`/article/${b.id}`} className="block group">
                        <div className="flex items-start gap-3">
                          <div className="w-7 h-7 rounded-full bg-secondary/10 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                            {b.author[0]?.toUpperCase()}
                          </div>
                          <div>
                            <p className="text-sm font-medium mb-0.5">{b.author}</p>
                            <h4 className="serif font-bold text-base leading-snug group-hover:underline underline-offset-2 decoration-1 mb-1">{b.title}</h4>
                            <p className="text-xs text-secondary">{b.readingTime} · {b.date}</p>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </main>

        {/* ── RIGHT: Speed Test Card ── */}
        <aside className="hidden lg:block w-[240px] flex-shrink-0 sticky top-24">
          <div>
            {!speedActive ? (
              /* idle card */
              <div className="border border-border rounded-2xl p-5">
                <div className="flex items-center gap-2.5 mb-3">
                  <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                    <Gauge size={16} className="text-accent" />
                  </div>
                  <h3 className="font-bold text-sm">Reading Speed</h3>
                </div>
                <p className="text-xs text-secondary leading-relaxed mb-5">
                  Words flash one at a time. Read as fast as you can — then push higher.
                </p>

                {/* WPM slider */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-secondary">Speed</span>
                    <span className="text-sm font-bold text-accent">{speedWpm} WPM</span>
                  </div>
                  <input
                    type="range" min={100} max={600} step={50}
                    value={speedWpm}
                    onChange={(e) => setSpeedWpm(Number(e.target.value))}
                    className="w-full accent-foreground h-1"
                  />
                  <div className="flex justify-between text-[10px] text-secondary/40 mt-1">
                    <span>100</span><span>600</span>
                  </div>
                </div>

                {/* words/flash indicator */}
                <div className="flex items-center justify-between mb-4 px-3 py-2 bg-secondary/5 rounded-lg">
                  <span className="text-xs text-secondary">Words per flash</span>
                  <span className="text-sm font-bold">{wpc}</span>
                </div>

                {/* preset buttons */}
                <div className="grid grid-cols-4 gap-1 mb-4">
                  {[150, 250, 350, 500].map((w) => (
                    <button
                      key={w}
                      onClick={() => setSpeedWpm(w)}
                      className={`py-1.5 rounded-lg text-[11px] font-semibold transition-colors ${
                        speedWpm === w ? "bg-button text-white" : "bg-secondary/8 text-secondary hover:bg-secondary/15"
                      }`}
                    >
                      {w}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => doStart(speedWpm)}
                  className="w-full bg-button text-white text-sm font-medium py-2.5 rounded-full hover:bg-button/90 transition-colors flex items-center justify-center gap-2"
                >
                  <Play size={13} fill="currentColor" />
                  Start test
                </button>
              </div>
            ) : (
              /* active card */
              <div className="border border-accent/40 rounded-2xl p-5 bg-accent/3">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-sm">Speed Reading</h3>
                  <span className="text-xs bg-accent/15 text-accent px-2 py-0.5 rounded-full font-semibold">{speedWpm} WPM</span>
                </div>

                {/* stats */}
                <div className="grid grid-cols-2 gap-2 mb-4">
                  <div className="text-center p-2.5 bg-white rounded-xl border border-border">
                    <p className="text-xl font-bold">{speedIdx}</p>
                    <p className="text-[10px] text-secondary mt-0.5">words read</p>
                  </div>
                  <div className="text-center p-2.5 bg-white rounded-xl border border-border">
                    <p className="text-xl font-bold">{fmtTime(elapsed)}</p>
                    <p className="text-[10px] text-secondary mt-0.5">elapsed</p>
                  </div>
                </div>

                {/* progress */}
                <div className="mb-4">
                  <div className="flex justify-between text-[11px] text-secondary mb-1">
                    <span>Progress</span><span>{speedProgress}%</span>
                  </div>
                  <div className="h-1.5 bg-secondary/10 rounded-full overflow-hidden">
                    <div className="h-full bg-accent rounded-full transition-all duration-200" style={{ width: `${speedProgress}%` }} />
                  </div>
                </div>

                {/* slower / faster */}
                <div className="flex gap-2 mb-4">
                  <button
                    onClick={() => doStart(Math.max(100, speedWpm - 50))}
                    className="flex-1 flex items-center justify-center gap-1 py-2 rounded-lg text-xs font-medium bg-secondary/8 text-secondary hover:bg-secondary/15 transition-colors"
                  >
                    <ChevronDown size={12} /> Slower
                  </button>
                  <button
                    onClick={() => doStart(Math.min(600, speedWpm + 50))}
                    className="flex-1 flex items-center justify-center gap-1 py-2 rounded-lg text-xs font-medium bg-secondary/8 text-secondary hover:bg-secondary/15 transition-colors"
                  >
                    <ChevronUp size={12} /> Faster
                  </button>
                </div>

                <button
                  onClick={stopSpeed}
                  className="w-full border border-border text-secondary text-sm font-medium py-2 rounded-full hover:text-foreground transition-colors flex items-center justify-center gap-2"
                >
                  <Square size={13} fill="currentColor" />
                  Stop
                </button>
              </div>
            )}
          </div>
        </aside>
      </div>

      {/* ── Comments/Responses Drawer ── */}
      {commentsOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden font-sans">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/30 backdrop-blur-xs transition-opacity animate-fade-in"
            onClick={() => setCommentsOpen(false)}
          />

          <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col h-full border-l border-border relative animate-slide-in-right">
              {/* Header */}
              <div className="px-6 py-5 border-b border-border flex items-center justify-between">
                <h2 className="text-lg font-bold text-foreground">
                  Responses ({articleComments.length})
                </h2>
                <button
                  onClick={() => setCommentsOpen(false)}
                  className="p-2 text-secondary hover:text-foreground hover:bg-surface rounded-full transition-colors cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Comment input & list */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {/* Form to add response */}
                {user ? (
                  <form onSubmit={handleSubmitComment} className="space-y-3">
                    <div className="card p-4 border border-border bg-surface focus-within:ring-1 focus-within:ring-accent focus-within:border-accent transition-shadow">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-6 h-6 rounded-full bg-accent/15 flex items-center justify-center text-[10px] font-bold text-accent">
                          {user.firstName[0]}
                        </div>
                        <span className="text-xs font-semibold">{user.firstName} {user.lastName}</span>
                      </div>
                      <textarea
                        rows={3}
                        value={newCommentText}
                        onChange={(e) => setNewCommentText(e.target.value)}
                        placeholder="What are your thoughts?"
                        className="w-full text-sm bg-transparent border-0 outline-none resize-none placeholder:text-secondary/40 text-foreground"
                        required
                      />
                    </div>
                    <div className="flex justify-end">
                      <button
                        type="submit"
                        disabled={submittingComment || !newCommentText.trim()}
                        className="btn-primary flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                      >
                        {submittingComment ? "Responding..." : "Respond"}
                        <Send size={12} />
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="card p-5 border border-border text-center bg-surface">
                    <p className="text-sm text-secondary mb-3">Sign in to share your thoughts on this story.</p>
                    <Link
                      href="/auth/login"
                      className="inline-block bg-button text-white text-xs font-semibold px-4 py-2 rounded-full hover:bg-button/90 transition-colors"
                    >
                      Sign In to Respond
                    </Link>
                  </div>
                )}

                {/* Responses List */}
                <div className="space-y-4 pt-4 border-t border-border">
                  {articleComments.length === 0 ? (
                    <p className="text-sm text-secondary text-center py-6">
                      No responses yet. Be the first to share your thoughts!
                    </p>
                  ) : (
                    articleComments.map((comment) => (
                      <div key={comment.id} className="p-4 border border-border/60 rounded-2xl bg-white shadow-xs space-y-2.5">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center text-xs font-bold text-accent flex-shrink-0">
                              {comment.authorName[0]?.toUpperCase()}
                            </div>
                            <div>
                              <span className="block text-xs font-semibold text-foreground leading-tight">
                                {comment.authorName}
                              </span>
                              <span className="block text-[10px] text-secondary mt-0.5">
                                {comment.date}
                              </span>
                            </div>
                          </div>
                          
                          {/* Delete option if author or admin */}
                          {(user?.id === comment.authorId || user?.role === "admin") && (
                            <button
                              type="button"
                              onClick={() => deleteComment(comment.id, article.id)}
                              className="text-secondary hover:text-red-500 p-1.5 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                              title="Delete comment"
                            >
                              <Trash size={13} />
                            </button>
                          )}
                        </div>

                        <p className="text-sm leading-relaxed text-foreground whitespace-pre-wrap pl-0.5">
                          {comment.content}
                        </p>

                        <div className="flex items-center gap-2 pt-1">
                          <button
                            type="button"
                            onClick={() => likeComment(comment.id)}
                            className="flex items-center gap-1.5 text-xs text-secondary hover:text-accent transition-colors p-1 rounded hover:bg-surface cursor-pointer"
                          >
                            <ThumbsUp size={12} />
                            <span>{comment.likes}</span>
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
