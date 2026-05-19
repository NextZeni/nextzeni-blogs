"use client";

import { useState, useRef, useCallback } from "react";
import Link from "next/link";
import {
  PenLine, FileSearch, CheckCircle2, XCircle,
  ChevronRight, UploadCloud, FileText, X, Loader2,
} from "lucide-react";
import { analyzeResume, type ResumeResult } from "@/lib/ats";

/* ─── File → plain text ─────────────────────────────────────────────────────── */

async function extractText(file: File): Promise<string> {
  const ext = file.name.split(".").pop()?.toLowerCase();

  if (ext === "txt") return file.text();

  if (ext === "pdf") {
    const { getDocument, GlobalWorkerOptions } = await import("pdfjs-dist");
    GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";
    const buf = await file.arrayBuffer();
    const pdf = await getDocument({ data: buf }).promise;
    let text = "";
    for (let i = 1; i <= pdf.numPages; i++) {
      const page    = await pdf.getPage(i);
      const content = await page.getTextContent();
      text += content.items.map((it: unknown) => (it as { str: string }).str).join(" ") + "\n";
    }
    return text;
  }

  if (ext === "docx") {
    const mammoth = await import("mammoth");
    const buf     = await file.arrayBuffer();
    return (await mammoth.extractRawText({ arrayBuffer: buf })).value;
  }

  throw new Error(`Unsupported file type .${ext} — use PDF, DOCX, or TXT.`);
}

/* ─── Score palette ─────────────────────────────────────────────────────────── */

const SCORE_NUM: Record<ResumeResult["level"], string> = {
  poor: "text-red-500", fair: "text-amber-500", good: "text-accent", excellent: "text-accent",
};
const SCORE_BAR: Record<ResumeResult["level"], string> = {
  poor: "bg-red-400", fair: "bg-amber-400", good: "bg-accent", excellent: "bg-accent",
};
const SCORE_WRAP: Record<ResumeResult["level"], string> = {
  poor: "border-red-200 bg-red-50", fair: "border-amber-200 bg-amber-50",
  good: "border-accent/20 bg-accent/5", excellent: "border-accent/20 bg-accent/5",
};

/* ─── Drop zone ─────────────────────────────────────────────────────────────── */

function DropZone({ file, onFile, onClear }: { file: File | null; onFile: (f: File) => void; onClear: () => void }) {
  const ref = useRef<HTMLInputElement>(null);
  const [over, setOver] = useState(false);

  const drop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setOver(false);
    const f = e.dataTransfer.files[0];
    if (f) onFile(f);
  }, [onFile]);

  if (file) {
    return (
      <div className="border border-accent/30 bg-accent/5 rounded-2xl px-6 py-5 flex items-center gap-3">
        <FileText size={22} className="text-accent flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold truncate">{file.name}</p>
          <p className="text-xs text-secondary mt-0.5">
            {(file.size / 1024).toFixed(1)} KB · {file.name.split(".").pop()?.toUpperCase()}
          </p>
        </div>
        <button onClick={onClear} className="text-secondary hover:text-foreground transition-colors p-1">
          <X size={15} />
        </button>
      </div>
    );
  }

  return (
    <>
      <div
        onDragOver={(e) => { e.preventDefault(); setOver(true); }}
        onDragLeave={() => setOver(false)}
        onDrop={drop}
        onClick={() => ref.current?.click()}
        className={`border-2 border-dashed rounded-2xl px-8 py-14 flex flex-col items-center gap-4 cursor-pointer transition-all text-center ${
          over ? "border-accent bg-accent/5" : "border-border hover:border-accent/40 hover:bg-secondary/5"
        }`}
      >
        <UploadCloud size={36} className={over ? "text-accent" : "text-secondary/30"} />
        <div>
          <p className="text-base font-semibold">Drop your resume here</p>
          <p className="text-sm text-secondary mt-1">or click to browse</p>
        </div>
        <span className="text-[11px] text-secondary/50 uppercase tracking-widest font-medium">
          PDF · DOCX · TXT
        </span>
      </div>
      <p className="text-center text-xs text-secondary/50 mt-2">
        Parsed locally in your browser — nothing is uploaded to any server.
      </p>
      <input
        ref={ref}
        type="file"
        accept=".pdf,.docx,.txt"
        className="hidden"
        onChange={(e) => { const f = e.target.files?.[0]; if (f) onFile(f); }}
      />
    </>
  );
}

/* ─── Page ──────────────────────────────────────────────────────────────────── */

export default function ATSCheckerPage() {
  const [file,    setFile]    = useState<File | null>(null);
  const [result,  setResult]  = useState<ResumeResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState<string | null>(null);

  async function scan() {
    if (!file) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const text = await extractText(file);
      setResult(analyzeResume(text));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not read file.");
    } finally {
      setLoading(false);
    }
  }

  function reset() {
    setFile(null);
    setResult(null);
    setError(null);
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-border">
        <div className="max-w-[1200px] mx-auto px-6 h-16 flex items-center justify-between gap-6">
          <Link href="/" className="text-2xl font-extrabold tracking-tighter flex items-baseline flex-shrink-0">
            <span className="font-light text-secondary">Next</span><span className="text-foreground">Zeni</span>
          </Link>
          <nav className="hidden md:flex items-center gap-5 text-sm font-medium">
            <Link href="/" className="text-secondary hover:text-foreground transition-colors">Stories</Link>
            <Link href="/tools" className="text-accent font-semibold">Tools</Link>
            <Link href="/write" className="flex items-center gap-1.5 text-secondary hover:text-foreground transition-colors">
              <PenLine size={16} /> Write
            </Link>
            <button className="bg-button text-white px-5 py-2 rounded-full hover:bg-button/90 transition-colors">
              Sign In
            </button>
          </nav>
        </div>
      </header>

      <main className="max-w-[860px] mx-auto px-6 pt-10 pb-28">

        {/* Breadcrumb */}
        <div className="flex items-center gap-1.5 text-xs text-secondary mb-8">
          <Link href="/tools" className="hover:text-accent transition-colors">Tools</Link>
          <ChevronRight size={12} />
          <span className="text-foreground font-medium">ATS Resume Checker</span>
        </div>

        {/* Hero */}
        <div className="mb-10">
          <div className="flex items-center gap-2 text-accent mb-3">
            <FileSearch size={16} />
            <span className="text-xs font-semibold uppercase tracking-widest">ATS Resume Checker</span>
          </div>
          <h1 className="serif text-3xl md:text-4xl font-bold tracking-tight mb-3">
            Is your resume ATS-ready?
          </h1>
          <p className="text-secondary text-base max-w-lg leading-relaxed">
            Upload your resume and instantly see your ATS score, which sections are detected, top keywords, and tips to improve.
          </p>
        </div>

        {/* Upload */}
        {!result && (
          <div className="mb-8">
            <DropZone
              file={file}
              onFile={(f) => { setFile(f); setResult(null); setError(null); }}
              onClear={reset}
            />
            {error && <p className="text-sm text-red-500 mt-3 text-center">{error}</p>}
            {file && (
              <div className="flex justify-center mt-6">
                <button
                  onClick={scan}
                  disabled={loading}
                  className="flex items-center gap-2 bg-button text-white px-10 py-3 rounded-full text-sm font-semibold hover:bg-button/90 disabled:opacity-50 transition-all"
                >
                  {loading && <Loader2 size={15} className="animate-spin" />}
                  {loading ? "Scanning resume…" : "Scan Resume"}
                </button>
              </div>
            )}
          </div>
        )}

        {/* Results */}
        {result && (
          <div className="space-y-6">

            {/* Score banner */}
            <div className={`border rounded-2xl p-7 ${SCORE_WRAP[result.level]}`}>
              <div className="flex flex-col sm:flex-row sm:items-center gap-6 mb-6">
                <div className="text-center sm:text-left">
                  <div className={`text-7xl font-extrabold leading-none tabular-nums ${SCORE_NUM[result.level]}`}>
                    {result.score}<span className="text-4xl">%</span>
                  </div>
                  <div className="text-[11px] font-semibold uppercase tracking-widest text-secondary mt-1.5">
                    ATS Score
                  </div>
                </div>
                <div className="flex-1">
                  <div className="font-bold text-xl mb-1">
                    {result.level === "excellent" ? "Excellent — highly ATS-ready"  :
                     result.level === "good"      ? "Good — solid structure"         :
                     result.level === "fair"      ? "Fair — needs a few fixes"       :
                                                    "Poor — major gaps detected"}
                  </div>
                  <p className="text-secondary text-sm leading-relaxed mb-3">
                    {Object.values(result.sections).filter(Boolean).length} of {Object.keys(result.sections).length} key sections detected · {result.wordCount.toLocaleString()} words · ~{result.pageEst} page{result.pageEst !== 1 ? "s" : ""}
                  </p>
                  <div className="h-2.5 bg-white/60 rounded-full overflow-hidden w-full max-w-sm border border-border">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${SCORE_BAR[result.level]}`}
                      style={{ width: `${result.score}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Stat pills */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {([
                  { label: "ATS score",        value: `${result.score}%`,                                                                              color: SCORE_NUM[result.level] },
                  { label: "Sections found",   value: `${Object.values(result.sections).filter(Boolean).length} / ${Object.keys(result.sections).length}`, color: "text-foreground" },
                  { label: "Word count",       value: result.wordCount.toLocaleString(),                                                               color: "text-foreground" },
                  { label: "Est. pages",       value: `~${result.pageEst}`,                                                                            color: "text-foreground" },
                ] as const).map(({ label, value, color }) => (
                  <div key={label} className="bg-white/70 rounded-xl px-4 py-3 border border-border">
                    <div className={`text-lg font-bold ${color}`}>{value}</div>
                    <div className="text-[11px] text-secondary mt-0.5">{label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Sections + Keywords */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

              {/* Sections */}
              <div className="border border-border rounded-2xl p-5">
                <div className="text-xs font-semibold uppercase tracking-widest text-secondary mb-4">
                  Resume sections
                </div>
                <ul className="space-y-3">
                  {Object.entries(result.sections).map(([name, found]) => (
                    <li key={name} className="flex items-center gap-3 text-sm">
                      {found
                        ? <CheckCircle2 size={16} className="text-accent flex-shrink-0" />
                        : <XCircle     size={16} className="text-secondary/40 flex-shrink-0" />}
                      <span className={found ? "text-foreground font-medium" : "text-secondary/60"}>{name}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Top keywords */}
              <div className="border border-border rounded-2xl p-5">
                <div className="text-xs font-semibold uppercase tracking-widest text-secondary mb-4">
                  Top keywords in your resume
                </div>
                <div className="flex flex-wrap gap-1.5 max-h-52 overflow-y-auto">
                  {result.topKeywords.map((kw) => (
                    <span key={kw} className="text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-accent/10 text-accent whitespace-nowrap">
                      {kw}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Tips */}
            {result.tips.length > 0 && (
              <div className="border border-border rounded-2xl p-6">
                <div className="text-xs font-semibold uppercase tracking-widest text-secondary mb-5">
                  How to improve
                </div>
                <ul className="space-y-3">
                  {result.tips.map((tip, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-foreground leading-relaxed">
                      <span className="mt-0.5 w-5 h-5 rounded-full bg-accent/10 text-accent text-[10px] font-bold flex items-center justify-center flex-shrink-0">
                        {i + 1}
                      </span>
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Scan another */}
            <div className="flex justify-center pt-2">
              <button
                onClick={reset}
                className="text-sm text-accent font-medium hover:underline"
              >
                Scan a different resume
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
