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
  savedArticles?: string[];
  likedArticles?: string[];
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
  type: "h2" | "h3" | "paragraph" | "quote" | "code" | "image";
  text: string;
  id: string;
  src?: string;
  alt?: string;
}

// A markdown line that is exactly an image: ![alt](url)
const IMAGE_LINE = /^!\[([^\]]*)\]\(([^)]+)\)$/;

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
    } else if (IMAGE_LINE.test(line.trim())) {
      flushPara();
      const [, alt, src] = line.trim().match(IMAGE_LINE)!;
      blocks.push({ type: "image", text: alt, id: "", src, alt });
    } else if (line.trim() === "") {
      flushPara();
    } else {
      paraLines.push(line);
    }
  }
  flushPara();
  return blocks;
}

// Only allow safe link protocols — blocks javascript:, data:, etc.
function safeHref(url: string): string | null {
  const u = url.trim();
  if (/^(https?:|mailto:)/i.test(u)) return u;
  if (u.startsWith("/") || u.startsWith("#")) return u;
  return null;
}

export function renderInline(text: string): string {
  // Escape HTML first (content is used with dangerouslySetInnerHTML), then
  // apply the inline markdown tokens. Escaping doesn't touch * ` [ ] ( ) so the
  // token replacements below are unaffected.
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/`(.+?)`/g, '<code class="inline-code">$1</code>')
    // Links: [text](url) — the (?<!!) skips image syntax ![alt](url).
    .replace(/(?<!!)\[([^\]]+)\]\(([^)]+)\)/g, (_m, label, url) => {
      const href = safeHref(url);
      if (!href) return label; // drop unsafe links, keep the text
      return `<a href="${href.replace(/"/g, "&quot;")}" target="_blank" rel="noopener noreferrer nofollow" class="story-link">${label}</a>`;
    });
}

/* ── Tiptap ⇆ markdown bridge ────────────────────────────────────────────
   The editor is WYSIWYG but we keep storing the same markdown that
   parseContent() reads, so the reader (ToC / audio / speed-reader) and all
   existing articles are untouched. These are pure functions — no Tiptap
   import — so they're framework-agnostic and easy to test.                  */

export interface TiptapMark { type: string; attrs?: { href?: string } }
export interface TiptapNode {
  type: string;
  text?: string;
  attrs?: { level?: number; src?: string; alt?: string };
  marks?: TiptapMark[];
  content?: TiptapNode[];
}
export interface TiptapDoc { type: "doc"; content?: TiptapNode[] }

// Inline nodes → markdown (`code`, **bold**, *italic*, [link](url)).
function serializeInline(nodes?: TiptapNode[]): string {
  return (nodes ?? [])
    .map((n) => {
      if (n.type === "hardBreak") return "\n";
      let t = n.text ?? "";
      const marks = n.marks ?? [];
      const has = (type: string) => marks.some((m) => m.type === type);
      if (has("code")) t = "`" + t + "`";
      if (has("bold")) t = "**" + t + "**";
      if (has("italic")) t = "*" + t + "*";
      const link = marks.find((m) => m.type === "link");
      if (link?.attrs?.href) t = "[" + t + "](" + link.attrs.href + ")"; // link wraps outermost
      return t;
    })
    .join("");
}

// Editor JSON (editor.getJSON()) → the markdown format parseContent() expects.
export function serializeToMarkdown(doc: TiptapDoc): string {
  const out: string[] = [];
  for (const node of doc.content ?? []) {
    switch (node.type) {
      case "heading":
        out.push((node.attrs?.level === 3 ? "### " : "## ") + serializeInline(node.content));
        break;
      case "blockquote":
        out.push((node.content ?? []).map((p) => "> " + serializeInline(p.content)).join("\n"));
        break;
      case "codeBlock":
        out.push("```\n" + serializeInline(node.content) + "\n```");
        break;
      case "image":
        out.push("![" + (node.attrs?.alt ?? "") + "](" + (node.attrs?.src ?? "") + ")");
        break;
      default: // paragraph & anything else
        out.push(serializeInline(node.content));
    }
  }
  return out.join("\n\n").replace(/\n{3,}/g, "\n\n").trim();
}

// Split a markdown string into inline text nodes with marks.
function parseInline(text: string): TiptapNode[] {
  const nodes: TiptapNode[] = [];
  const regex = /(\*\*([^*]+)\*\*|\*([^*]+)\*|`([^`]+)`|(?<!!)\[([^\]]+)\]\(([^)]+)\))/g;
  let last = 0;
  let m: RegExpExecArray | null;
  const push = (t: string, mark?: string) => {
    if (!t) return;
    nodes.push(mark ? { type: "text", text: t, marks: [{ type: mark }] } : { type: "text", text: t });
  };
  while ((m = regex.exec(text))) {
    push(text.slice(last, m.index));
    if (m[2] !== undefined) push(m[2], "bold");
    else if (m[3] !== undefined) push(m[3], "italic");
    else if (m[4] !== undefined) push(m[4], "code");
    else if (m[5] !== undefined) nodes.push({ type: "text", text: m[5], marks: [{ type: "link", attrs: { href: m[6] } }] });
    last = m.index + m[0].length;
  }
  push(text.slice(last));
  return nodes;
}

// Stored markdown → editor JSON (reuses parseContent so it stays in lockstep
// with the reader). Lets a future edit flow load an existing article.
export function markdownToDoc(raw: string): TiptapDoc {
  const content: TiptapNode[] = parseContent(raw).map((b) => {
    if (b.type === "h2") return { type: "heading", attrs: { level: 2 }, content: parseInline(b.text) };
    if (b.type === "h3") return { type: "heading", attrs: { level: 3 }, content: parseInline(b.text) };
    if (b.type === "quote")
      return { type: "blockquote", content: [{ type: "paragraph", content: parseInline(b.text) }] };
    if (b.type === "code")
      return { type: "codeBlock", content: b.text ? [{ type: "text", text: b.text }] : [] };
    if (b.type === "image")
      return { type: "image", attrs: { src: b.src ?? "", alt: b.alt ?? "" } };
    return { type: "paragraph", content: parseInline(b.text) };
  });
  return { type: "doc", content: content.length ? content : [{ type: "paragraph" }] };
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
