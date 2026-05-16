export interface Article {
  id: string;
  title: string;
  description: string;
  author: string;
  date: string;
  readingTime: string;
  category: string;
  claps: number;
  responses: number;
  content: string;
}

export interface ContentBlock {
  type: "h2" | "h3" | "paragraph";
  text: string;
  id: string;
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
];

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

export function parseContent(raw: string): ContentBlock[] {
  const lines = raw.split("\n");
  const blocks: ContentBlock[] = [];
  let paraLines: string[] = [];

  function flushPara() {
    const text = paraLines.join(" ").trim();
    if (text) blocks.push({ type: "paragraph", text, id: "" });
    paraLines = [];
  }

  for (const line of lines) {
    if (line.startsWith("### ")) {
      flushPara();
      const text = line.slice(4).trim();
      blocks.push({ type: "h3", text, id: slugify(text) });
    } else if (line.startsWith("## ")) {
      flushPara();
      const text = line.slice(3).trim();
      blocks.push({ type: "h2", text, id: slugify(text) });
    } else if (line.trim() === "") {
      flushPara();
    } else {
      paraLines.push(line);
    }
  }
  flushPara();

  return blocks;
}

export function calcReadingTime(text: string): string {
  const words = text.trim().split(/\s+/).length;
  const minutes = Math.max(1, Math.round(words / 200));
  return `${minutes} min read`;
}
