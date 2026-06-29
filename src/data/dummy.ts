export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  mobile?: string;
  country?: string;
  profilePic?: string;
  about?: string;
  bio?: string;
  role: "reader" | "writer" | "admin";
  followers: number;
  following: number;
  joinDate: string;
  isActive: boolean;
}

export interface Article {
  id: string;
  title: string;
  description: string;
  author: string;
  authorId: string;
  date: string;
  readingTime: string;
  category: string;
  claps: number;
  responses: number;
  content: string;
  coverImage?: string;
  seoKeywords?: string[];
  tags?: string[];
  views: number;
  status: "published" | "draft" | "pending" | "rejected";
  rejectionReason?: string;
}

export interface Comment {
  id: string;
  articleId: string;
  authorId: string;
  authorName: string;
  content: string;
  date: string;
  likes: number;
}

export interface Resource {
  id: string;
  title: string;
  description: string;
  type: "template" | "pdf" | "study" | "tool";
  price: number;
  authorId: string;
  authorName: string;
  downloadCount: number;
  tags: string[];
  category: string;
  date: string;
  featured: boolean;
}

export const CATEGORIES = [
  "Technology",
  "Artificial Intelligence",
  "Design",
  "Engineering",
  "Finance",
  "Productivity",
  "Science",
  "Health",
  "Culture",
  "Writing",
  "Business",
  "Education",
];

export const CATEGORY_COLORS: Record<string, string> = {
  "Technology": "#2563eb",
  "Artificial Intelligence": "#7c3aed",
  "Design": "#db2777",
  "Engineering": "#0891b2",
  "Finance": "#2E6F40",
  "Productivity": "#d97706",
  "Science": "#dc2626",
  "Health": "#16a34a",
  "Culture": "#9333ea",
  "Writing": "#c2410c",
  "Business": "#1d4ed8",
  "Education": "#0369a1",
};

export const CATEGORY_BG: Record<string, string> = {
  "Technology": "bg-blue-100 text-blue-700",
  "Artificial Intelligence": "bg-purple-100 text-purple-700",
  "Design": "bg-pink-100 text-pink-700",
  "Engineering": "bg-cyan-100 text-cyan-700",
  "Finance": "bg-green-100 text-green-700",
  "Productivity": "bg-amber-100 text-amber-700",
  "Science": "bg-red-100 text-red-700",
  "Health": "bg-emerald-100 text-emerald-700",
  "Culture": "bg-violet-100 text-violet-700",
  "Writing": "bg-orange-100 text-orange-700",
  "Business": "bg-blue-100 text-blue-700",
  "Education": "bg-sky-100 text-sky-700",
};

export const CATEGORY_GRADIENT: Record<string, string> = {
  "Technology": "from-blue-600 to-blue-400",
  "Artificial Intelligence": "from-violet-600 to-purple-400",
  "Design": "from-pink-600 to-rose-400",
  "Engineering": "from-cyan-600 to-teal-400",
  "Finance": "from-green-700 to-emerald-500",
  "Productivity": "from-amber-500 to-yellow-400",
  "Science": "from-red-600 to-orange-400",
  "Health": "from-emerald-600 to-green-400",
  "Culture": "from-violet-500 to-purple-400",
  "Writing": "from-orange-600 to-amber-500",
  "Business": "from-blue-700 to-blue-500",
  "Education": "from-sky-600 to-cyan-400",
};

export interface ContentBlock {
  type: "h2" | "h3" | "paragraph" | "quote" | "code";
  text: string;
  id: string;
}

export function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9\s-]/g, "").trim().replace(/\s+/g, "-");
}

export function parseContent(raw: string): ContentBlock[] {
  const lines = raw.split("\n");
  const blocks: ContentBlock[] = [];
  let paraLines: string[] = [];
  let inCode = false;
  let codeLines: string[] = [];

  function flushPara() {
    const text = paraLines.join(" ").trim();
    if (text) blocks.push({ type: "paragraph", text, id: "" });
    paraLines = [];
  }

  for (const line of lines) {
    if (line.startsWith("```")) {
      if (inCode) {
        blocks.push({ type: "code", text: codeLines.join("\n"), id: "" });
        codeLines = [];
        inCode = false;
      } else {
        flushPara();
        inCode = true;
      }
    } else if (inCode) {
      codeLines.push(line);
    } else if (line.startsWith("## ")) {
      flushPara();
      const text = line.slice(3).trim();
      blocks.push({ type: "h2", text, id: slugify(text) });
    } else if (line.startsWith("### ")) {
      flushPara();
      const text = line.slice(4).trim();
      blocks.push({ type: "h3", text, id: slugify(text) });
    } else if (line.startsWith("> ")) {
      flushPara();
      blocks.push({ type: "quote", text: line.slice(2).trim(), id: "" });
    } else if (line.trim() === "") {
      flushPara();
    } else {
      paraLines.push(line);
    }
  }
  flushPara();
  return blocks;
}

export function renderInline(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/`(.+?)`/g, '<code class="inline-code">$1</code>');
}

export function calcReadingTime(text: string): string {
  const words = text.trim().split(/\s+/).length;
  const minutes = Math.max(1, Math.round(words / 200));
  return `${minutes} min read`;
}

export function formatNum(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(1).replace(/\.0$/, "") + "K";
  return String(n);
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0] ?? "")
    .join("")
    .toUpperCase()
    .slice(0, 2);
}
