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
  followingUsers?: string[];
  socials?: {
    twitter?: string;
    linkedin?: string;
    github?: string;
    website?: string;
    instagram?: string;
    facebook?: string;
    pinterest?: string;
    threads?: string;
  };
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
  /** SEO-only fields — never rendered in the story, only in <head>. */
  seoKeywords?: string[];
  tags?: string[];
  metaTitle?: string;
  metaDescription?: string;
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
  type: "h2" | "h3" | "paragraph" | "quote" | "code" | "image" | "table" | "list";
  text: string;
  id: string;
  src?: string;
  alt?: string;
  /** Image caption, from the markdown title slot: ![alt](src "caption") */
  caption?: string;
  /** For type "list": one entry per item, each still holding inline markdown. */
  items?: string[];
  /** For type "list": ordered (1.) vs bullet (-). */
  ordered?: boolean;
}

// A markdown line that is exactly an image, with an optional "caption":
//   ![alt](url)  |  ![alt](url "caption")
const IMAGE_LINE = /^!\[([^\]]*)\]\(\s*([^)\s"]+)(?:\s+"([^"]*)")?\s*\)$/;

// Highlight colours an author can pick from. Keys appear in the markdown
// (`==green:text==`), values are the classes the reader paints with.
export const HIGHLIGHT_COLORS = {
  yellow: "bg-yellow-200/70",
  green: "bg-green-200/70",
  blue: "bg-sky-200/70",
  pink: "bg-pink-200/70",
} as const;

export type HighlightColor = keyof typeof HIGHLIGHT_COLORS;

// Curated text styles, offered instead of a raw font picker so articles stay
// on-brand. Keys appear in the markdown (`[[lede|text]]`).
export const TEXT_STYLES = {
  lede: "text-xl leading-relaxed text-foreground/90",
  serif: "serif italic",
  small: "text-sm text-secondary",
} as const;

export type TextStyleName = keyof typeof TEXT_STYLES;

// Text colours an author can pick from. Keys appear in the markdown
// (`{{red|text}}`); a fixed palette keeps articles on-brand and means the
// class can never be author-controlled.
export const TEXT_COLORS = {
  red: "text-red-600",
  orange: "text-orange-600",
  green: "text-green-700",
  blue: "text-blue-700",
  purple: "text-purple-700",
  gray: "text-secondary",
} as const;

export type TextColorName = keyof typeof TEXT_COLORS;

const BULLET_LINE = /^[-*]\s+(.*)$/;
const ORDERED_LINE = /^\d+[.)]\s+(.*)$/;

export function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9\s-]/g, "").trim().replace(/\s+/g, "-");
}

export function parseContent(raw: string): ContentBlock[] {
  const lines = raw.split("\n");
  const blocks: ContentBlock[] = [];
  let paraLines: string[] = [];
  let inCode = false;
  let codeLines: string[] = [];
  let inTable = false;
  let tableLines: string[] = [];
  let listItems: string[] = [];
  let listOrdered = false;

  function flushPara() {
    const text = paraLines.join(" ").trim();
    if (text) blocks.push({ type: "paragraph", text, id: "" });
    paraLines = [];
  }

  function flushTable() {
    const text = tableLines.join("\n").trim();
    if (text) blocks.push({ type: "table", text, id: "" });
    tableLines = [];
    inTable = false;
  }

  function flushList() {
    if (listItems.length) {
      blocks.push({ type: "list", text: listItems.join("\n"), id: "", items: listItems, ordered: listOrdered });
    }
    listItems = [];
  }

  for (const line of lines) {
    if (line.startsWith("```")) {
      flushPara();
      flushList();
      flushTable();
      if (inCode) {
        blocks.push({ type: "code", text: codeLines.join("\n"), id: "" });
        codeLines = [];
        inCode = false;
      } else {
        inCode = true;
      }
    } else if (inCode) {
      codeLines.push(line);
    } else if (line.trim().startsWith("|") && line.trim().endsWith("|")) {
      flushPara();
      flushList();
      inTable = true;
      tableLines.push(line.trim());
    } else {
      flushTable();
      const trimmed = line.trim();
      const bullet = trimmed.match(BULLET_LINE);
      const ordered = trimmed.match(ORDERED_LINE);

      if (line.startsWith("## ")) {
        flushPara();
        flushList();
        const text = line.slice(3).trim();
        blocks.push({ type: "h2", text, id: slugify(text) });
      } else if (line.startsWith("### ")) {
        flushPara();
        flushList();
        const text = line.slice(4).trim();
        blocks.push({ type: "h3", text, id: slugify(text) });
      } else if (line.startsWith("> ")) {
        flushPara();
        flushList();
        blocks.push({ type: "quote", text: line.slice(2).trim(), id: "" });
      } else if (IMAGE_LINE.test(trimmed)) {
        flushPara();
        flushList();
        const [, alt, src, caption] = trimmed.match(IMAGE_LINE)!;
        blocks.push({ type: "image", text: alt, id: "", src, alt, caption: caption || undefined });
      } else if (bullet || ordered) {
        // A run of consecutive item lines becomes one list block. Switching
        // marker style (- → 1.) starts a new list.
        flushPara();
        const isOrdered = Boolean(ordered);
        if (listItems.length && listOrdered !== isOrdered) flushList();
        listOrdered = isOrdered;
        listItems.push((bullet ?? ordered)![1].trim());
      } else if (trimmed === "") {
        flushPara();
        flushList();
      } else {
        flushList();
        paraLines.push(line);
      }
    }
  }
  flushPara();
  flushList();
  flushTable();
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
    // Underline: __text__
    .replace(/__(.+?)__/g, '<span class="story-underline">$1</span>')
    // Curated text style: [[lede|text]] — only whitelisted names match, so the
    // class can never come from author input.
    .replace(
      new RegExp(`\\[\\[(${Object.keys(TEXT_STYLES).join("|")})\\|(.+?)\\]\\]`, "g"),
      (_m, name: TextStyleName, body: string) => `<span class="${TEXT_STYLES[name]}">${body}</span>`
    )
    // Text colour: {{red|text}}. Same whitelist guarantee.
    .replace(
      new RegExp(`\\{\\{(${Object.keys(TEXT_COLORS).join("|")})\\|(.+?)\\}\\}`, "g"),
      (_m, name: TextColorName, body: string) => `<span class="${TEXT_COLORS[name]}">${body}</span>`
    )
    // Highlight: ==text== (yellow) or ==green:text==. Same whitelist guarantee.
    .replace(
      new RegExp(`==(?:(${Object.keys(HIGHLIGHT_COLORS).join("|")}):)?(.+?)==`, "g"),
      (_m, color: HighlightColor | undefined, body: string) =>
        `<mark class="${HIGHLIGHT_COLORS[color ?? "yellow"]} rounded px-0.5">${body}</mark>`
    )
    // Links: [text](url) — the (?<!!) skips image syntax ![alt](url).
    .replace(/(?<!!)\[([^\]]+)\]\(([^)]+)\)/g, (_m, label, url) => {
      const href = safeHref(url);
      if (!href) return label; // drop unsafe links, keep the text
      return `<a href="${href.replace(/"/g, "&quot;")}" target="_blank" rel="noopener noreferrer nofollow" class="story-link">${label}</a>`;
    });
}

export function renderTable(tableMarkdown: string): string {
  const lines = tableMarkdown.trim().split("\n");
  if (lines.length < 2) return "";
  
  const headers = splitTableRow(lines[0]);
  // Skip separator line (lines[1])
  const rows = lines.slice(2).map(splitTableRow);
  
  let html = `<div class="overflow-x-auto my-6 border border-border/80 rounded-xl bg-white"><table class="w-full text-sm text-left border-collapse">`;
  
  // Header
  html += `<thead><tr class="border-b border-border/80 bg-secondary/3">`;
  headers.forEach(h => {
    html += `<th class="px-4 py-3 font-semibold text-foreground text-xs uppercase tracking-wider">${h}</th>`;
  });
  html += `</tr></thead>`;
  
  // Body
  html += `<tbody class="divide-y divide-border/60">`;
  rows.forEach(row => {
    html += `<tr class="hover:bg-secondary/1">`;
    row.forEach(cell => {
      html += `<td class="px-4 py-3 text-secondary">${renderInline(cell)}</td>`;
    });
    html += `</tr>`;
  });
  html += `</tbody></table></div>`;
  
  return html;
}

/* ── Tiptap ⇆ markdown bridge ────────────────────────────────────────────
   The editor is WYSIWYG but we keep storing the same markdown that
   parseContent() reads, so the reader (ToC / audio / speed-reader) and all
   existing articles are untouched. These are pure functions — no Tiptap
   import — so they're framework-agnostic and easy to test.                  */

export interface TiptapMark {
  type: string;
  attrs?: { href?: string; color?: string; styleName?: string; colorName?: string };
}
export interface TiptapNode {
  type: string;
  text?: string;
  attrs?: { level?: number; src?: string; alt?: string; title?: string };
  marks?: TiptapMark[];
  content?: TiptapNode[];
}
export interface TiptapDoc { type: "doc"; content?: TiptapNode[] }

// Tiptap's Highlight stores a CSS colour; map it back to our palette name.
function highlightName(mark?: TiptapMark): HighlightColor {
  const raw = (mark?.attrs?.color ?? "").toLowerCase();
  const hit = (Object.keys(HIGHLIGHT_COLORS) as HighlightColor[]).find((c) => raw.includes(c));
  return hit ?? "yellow";
}

// Marks that enclose a run of text, outermost first. These are emitted once
// around a whole run rather than per text node, so [link](url) with a bold word
// inside stays one link instead of splitting into several.
const WRAPPER_MARKS = ["link", "highlight", "zeniTextStyle", "zeniTextColor"] as const;

// Identifies a wrapper mark so consecutive nodes sharing it can be grouped.
function wrapperKey(mark?: TiptapMark): string | null {
  if (!mark) return null;
  if (mark.type === "link") return "link:" + (mark.attrs?.href ?? "");
  if (mark.type === "highlight") return "highlight:" + highlightName(mark);
  if (mark.type === "zeniTextColor") return "color:" + (mark.attrs?.colorName ?? "");
  return "style:" + (mark.attrs?.styleName ?? "");
}

// The character-level marks, applied innermost.
function serializeLeaf(node: TiptapNode): string {
  if (node.type === "hardBreak") return "\n";
  let t = node.text ?? "";
  if (!t) return "";
  const has = (type: string) => (node.marks ?? []).some((m) => m.type === type);
  if (has("code")) t = "`" + t + "`";
  if (has("bold")) t = "**" + t + "**";
  if (has("italic")) t = "*" + t + "*";
  if (has("underline")) t = "__" + t + "__";
  return t;
}

// Inline nodes → markdown (`code`, **bold**, *italic*, __underline__,
// ==highlight==, [[style|text]], [link](url)).
function serializeInline(nodes?: TiptapNode[], depth = 0): string {
  const list = nodes ?? [];
  if (depth >= WRAPPER_MARKS.length) return list.map(serializeLeaf).join("");

  const type = WRAPPER_MARKS[depth];
  const markOf = (n: TiptapNode) => (n.marks ?? []).find((m) => m.type === type);

  let out = "";
  let i = 0;
  while (i < list.length) {
    const mark = markOf(list[i]);
    const key = wrapperKey(mark);
    // Extend over every following node with the same mark — including a run of
    // nodes that all lack it, so the deeper levels still see their neighbours.
    let j = i + 1;
    while (j < list.length && wrapperKey(markOf(list[j])) === key) j++;

    if (!key) {
      out += serializeInline(list.slice(i, j), depth + 1);
      i = j;
      continue;
    }
    const inner = serializeInline(list.slice(i, j), depth + 1);

    if (type === "link") out += "[" + inner + "](" + (mark!.attrs?.href ?? "") + ")";
    else if (type === "highlight") {
      const color = highlightName(mark);
      out += color === "yellow" ? "==" + inner + "==" : "==" + color + ":" + inner + "==";
    } else if (type === "zeniTextColor") {
      const name = mark!.attrs?.colorName;
      out += name && name in TEXT_COLORS ? "{{" + name + "|" + inner + "}}" : inner;
    } else if (mark!.attrs?.styleName && mark!.attrs.styleName in TEXT_STYLES) {
      out += "[[" + mark!.attrs.styleName + "|" + inner + "]]";
    } else out += inner;

    i = j;
  }
  return out;
}

// One table row of Tiptap cells → `| a | b |`. Pipes inside a cell are escaped
// so they don't split the row when it's read back.
function serializeRow(row: TiptapNode): string {
  const cells = (row.content ?? []).map((cell) =>
    (cell.content ?? []).map((p) => serializeInline(p.content)).join(" ").replace(/\|/g, "\\|").trim()
  );
  return "| " + cells.join(" | ") + " |";
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
      case "image": {
        const caption = (node.attrs?.title ?? "").replace(/"/g, "'").trim();
        const tail = caption ? ' "' + caption + '"' : "";
        out.push("![" + (node.attrs?.alt ?? "") + "](" + (node.attrs?.src ?? "") + tail + ")");
        break;
      }
      case "bulletList":
      case "orderedList": {
        const ordered = node.type === "orderedList";
        const items = (node.content ?? []).map((li, i) => {
          const body = (li.content ?? []).map((p) => serializeInline(p.content)).join(" ").trim();
          return (ordered ? `${i + 1}. ` : "- ") + body;
        });
        out.push(items.join("\n"));
        break;
      }
      case "table": {
        const rows = node.content ?? [];
        if (rows.length === 0) break;
        const colCount = (rows[0].content ?? []).length;
        const lines = [serializeRow(rows[0]), "| " + Array(colCount).fill("---").join(" | ") + " |"];
        for (const row of rows.slice(1)) lines.push(serializeRow(row));
        out.push(lines.join("\n"));
        break;
      }
      default: // paragraph & anything else
        out.push(serializeInline(node.content));
    }
  }
  return out.join("\n\n").replace(/\n{3,}/g, "\n\n").trim();
}

// Split a markdown string into inline text nodes with marks. Recursive, so a
// combination like ==green:**bold**== keeps both marks.
function parseInline(text: string): TiptapNode[] {
  const styleNames = Object.keys(TEXT_STYLES).join("|");
  const markerNames = Object.keys(HIGHLIGHT_COLORS).join("|");
  const inkNames = Object.keys(TEXT_COLORS).join("|");
  // Alternation order matters: the bracket forms are tried before the
  // single-character ones so [[style|x]] isn't mistaken for a link.
  const regex = new RegExp(
    `\\[\\[(${styleNames})\\|(.+?)\\]\\]` +          // 1 style,  2 body
      `|\\{\\{(${inkNames})\\|(.+?)\\}\\}` +         // 3 colour, 4 body
      "|(?<!!)\\[([^\\]]+)\\]\\(([^)]+)\\)" +        // 5 label,  6 href
      `|==(?:(${markerNames}):)?(.+?)==` +           // 7 marker, 8 body
      "|\\*\\*([^*]+)\\*\\*" +                       // 9 bold
      "|__(.+?)__" +                                 // 10 underline
      "|\\*([^*]+)\\*" +                             // 11 italic
      "|`([^`]+)`",                                  // 12 code
    "g"
  );

  const nodes: TiptapNode[] = [];
  const plain = (t: string) => { if (t) nodes.push({ type: "text", text: t }); };
  // Re-parse the inner text, then add this mark to everything it produced.
  const wrap = (body: string, mark: TiptapMark) => {
    for (const child of parseInline(body)) {
      nodes.push({ ...child, marks: [...(child.marks ?? []), mark] });
    }
  };

  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = regex.exec(text))) {
    plain(text.slice(last, m.index));
    if (m[2] !== undefined) wrap(m[2], { type: "zeniTextStyle", attrs: { styleName: m[1] } });
    else if (m[4] !== undefined) wrap(m[4], { type: "zeniTextColor", attrs: { colorName: m[3] } });
    else if (m[5] !== undefined) wrap(m[5], { type: "link", attrs: { href: m[6] } });
    else if (m[8] !== undefined) wrap(m[8], { type: "highlight", attrs: { color: m[7] ?? "yellow" } });
    else if (m[9] !== undefined) wrap(m[9], { type: "bold" });
    else if (m[10] !== undefined) wrap(m[10], { type: "underline" });
    else if (m[11] !== undefined) wrap(m[11], { type: "italic" });
    else if (m[12] !== undefined) wrap(m[12], { type: "code" });
    last = m.index + m[0].length;
  }
  plain(text.slice(last));
  return nodes;
}

// `| a | b |` → cell strings, honouring \| escapes. The outer pipes produce
// leading/trailing empties, which are dropped; interior empties are kept so
// columns stay aligned.
export function splitTableRow(line: string): string[] {
  const cells: string[] = [];
  let cur = "";
  for (let i = 0; i < line.length; i++) {
    if (line[i] === "\\" && line[i + 1] === "|") { cur += "|"; i++; continue; }
    if (line[i] === "|") { cells.push(cur); cur = ""; continue; }
    cur += line[i];
  }
  cells.push(cur);
  if (cells.length && cells[0].trim() === "") cells.shift();
  if (cells.length && cells[cells.length - 1].trim() === "") cells.pop();
  return cells.map((c) => c.trim());
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
      return { type: "image", attrs: { src: b.src ?? "", alt: b.alt ?? "", title: b.caption ?? "" } };
    if (b.type === "list")
      return {
        type: b.ordered ? "orderedList" : "bulletList",
        content: (b.items ?? []).map((item) => ({
          type: "listItem",
          content: [{ type: "paragraph", content: parseInline(item) }],
        })),
      };
    if (b.type === "table") {
      const lines = b.text.split("\n").filter((l) => l.trim());
      // Drop the |---|---| separator; it carries no content.
      const isSeparator = (l: string) => /^[|\s:-]+$/.test(l) && l.includes("-");
      const rows = lines.filter((l) => !isSeparator(l.trim()));
      return {
        type: "table",
        content: rows.map((line, rowIndex) => ({
          type: "tableRow",
          content: splitTableRow(line).map((cell) => ({
            type: rowIndex === 0 ? "tableHeader" : "tableCell",
            content: [{ type: "paragraph", content: parseInline(cell) }],
          })),
        })),
      };
    }
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
