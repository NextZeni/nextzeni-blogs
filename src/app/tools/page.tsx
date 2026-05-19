import Link from "next/link";
import { FileSearch, BookOpen, Gauge, AlignLeft, ArrowRight, PenLine, Wrench } from "lucide-react";

const tools = [
  {
    href: "/tools/ats-checker",
    icon: FileSearch,
    label: "ATS Resume Checker",
    description: "Paste a job description and your resume. Get a keyword match score, section analysis, and tips to beat applicant tracking systems.",
    badge: "Live",
  },
  {
    href: "#",
    icon: BookOpen,
    label: "Readability Scorer",
    description: "Analyze your writing's clarity, grade level, and sentence complexity against editorial standards.",
    badge: "Soon",
  },
  {
    href: "#",
    icon: Gauge,
    label: "Headline Analyzer",
    description: "Score your article or blog headline for clarity, emotion, and click-through potential.",
    badge: "Soon",
  },
  {
    href: "#",
    icon: AlignLeft,
    label: "Cover Letter Builder",
    description: "Generate a tailored cover letter from your resume and job description in seconds.",
    badge: "Soon",
  },
];

export default function ToolsPage() {
  return (
    <div className="min-h-screen">
      {/* ── Header ── */}
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

      <main className="max-w-[1200px] mx-auto px-6 pt-14 pb-28">
        {/* Hero */}
        <div className="mb-12">
          <div className="flex items-center gap-2 text-accent mb-4">
            <Wrench size={16} />
            <span className="text-xs font-semibold uppercase tracking-widest">Tools</span>
          </div>
          <h1 className="serif text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Tools for writers &amp; job seekers.
          </h1>
          <p className="text-secondary text-lg max-w-xl leading-relaxed">
            Free, no-account utilities to sharpen your resume, writing, and content — built for people who care about craft.
          </p>
        </div>

        {/* Tool cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {tools.map(({ href, icon: Icon, label, description, badge }) => {
            const isLive = badge === "Live";
            return (
              <Link
                key={label}
                href={href}
                className={`group block border border-border rounded-2xl p-7 transition-all duration-200 ${
                  isLive
                    ? "hover:border-accent/40 hover:shadow-sm cursor-pointer"
                    : "opacity-60 cursor-default pointer-events-none"
                }`}
              >
                <div className="flex items-start justify-between mb-5">
                  <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center flex-shrink-0">
                    <Icon size={20} className="text-accent" />
                  </div>
                  <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full uppercase tracking-wide ${
                    isLive
                      ? "bg-accent/10 text-accent"
                      : "bg-secondary/10 text-secondary"
                  }`}>
                    {badge}
                  </span>
                </div>

                <h2 className="font-bold text-lg mb-2 group-hover:text-accent transition-colors">
                  {label}
                </h2>
                <p className="text-secondary text-sm leading-relaxed mb-5">
                  {description}
                </p>

                {isLive && (
                  <span className="flex items-center gap-1.5 text-sm text-accent font-medium group-hover:gap-2.5 transition-all">
                    Open tool <ArrowRight size={14} />
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </main>
    </div>
  );
}
