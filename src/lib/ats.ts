const STOP_WORDS = new Set([
  "a","an","the","and","or","but","in","on","at","to","for","of","with","by","from",
  "is","are","was","were","be","been","being","have","has","had","do","does","did",
  "will","would","could","should","may","might","must","shall","can","need",
  "that","this","these","those","we","you","he","she","it","they","i","me","him",
  "her","us","them","what","which","who","when","where","why","how","all","any",
  "both","each","few","more","most","other","some","such","than","too","very",
  "just","about","above","after","also","as","before","between","during","into",
  "no","not","our","their","your","its","my","own","so","if",
  "then","up","out","over","under","again","further","once","here","there","same",
  "only","while","per","via","etc","ie","eg","e","g","s","re","new","use","used",
  "using","well","like","able","get","got","work","working","worked","make","made",
  "good","great","strong","excellent","ability","highly","including","related",
]);

const SECTION_PATTERNS: Record<string, RegExp> = {
  "Contact Info":        /email|phone|linkedin|github|@[\w]+\.|tel:|mobile|\d{3}[-.\s]?\d{3}[-.\s]?\d{4}/i,
  "Summary / Objective": /\b(summary|objective|profile|about me|career goal)/i,
  "Work Experience":     /\b(experience|employment|work history|career|position|roles?)\b/i,
  "Education":           /\b(education|degree|university|college|bachelor|master|phd|diploma|graduated)\b/i,
  "Skills":              /\b(skills|technologies|tools|competencies|expertise|proficienc)\b/i,
  "Certifications":      /\b(certif|licen[sc]e|credential|accredit)/i,
  "Projects":            /\b(projects?|portfolio|built|developed|created)\b/i,
};

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9+#.\s-]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 2 && !STOP_WORDS.has(w));
}

export function extractKeywords(text: string): string[] {
  const tokens = tokenize(text);
  const freq = new Map<string, number>();
  for (const t of tokens) freq.set(t, (freq.get(t) ?? 0) + 1);
  return [...freq.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([w]) => w)
    .slice(0, 60);
}

export interface ResumeResult {
  score:       number;
  level:       "poor" | "fair" | "good" | "excellent";
  wordCount:   number;
  pageEst:     number;
  topKeywords: string[];
  sections:    Record<string, boolean>;
  tips:        string[];
}

export function analyzeResume(resume: string): ResumeResult {
  const words     = resume.trim().split(/\s+/).filter(Boolean);
  const wordCount = words.length;
  const pageEst   = Math.max(1, Math.round(wordCount / 400));

  const sections: Record<string, boolean> = {};
  for (const [name, regex] of Object.entries(SECTION_PATTERNS)) {
    sections[name] = regex.test(resume);
  }

  const topKeywords = extractKeywords(resume);

  // Score: section presence (70%) + word count adequacy (30%)
  const totalSections  = Object.keys(sections).length;
  const foundSections  = Object.values(sections).filter(Boolean).length;
  const sectionScore   = Math.round((foundSections / totalSections) * 70);

  const wordScore =
    wordCount >= 500 ? 30 :
    wordCount >= 350 ? 22 :
    wordCount >= 200 ? 14 : 5;

  const score = sectionScore + wordScore;
  const level = score >= 85 ? "excellent" : score >= 65 ? "good" : score >= 40 ? "fair" : "poor";

  const tips: string[] = [];
  if (!sections["Contact Info"])        tips.push("Add clear contact info: email, phone number, and LinkedIn URL.");
  if (!sections["Summary / Objective"]) tips.push("Add a 2–3 sentence professional summary at the top.");
  if (!sections["Work Experience"])     tips.push("Label your experience section 'Work Experience' or 'Employment History' so ATS can find it.");
  if (!sections["Education"])           tips.push("Include education: degree, institution, and graduation year.");
  if (!sections["Skills"])              tips.push("Add a Skills section listing your tools, languages, and competencies.");
  if (!sections["Projects"])            tips.push("Add a Projects section to showcase hands-on work and outcomes.");
  if (!sections["Certifications"])      tips.push("List any certifications or licenses — even short courses help.");
  if (wordCount < 300)                  tips.push("Resume is too short. Expand to at least 400–600 words covering your full experience.");
  if (wordCount > 1000)                 tips.push("Resume may be too long. Aim to keep it under 700 words for most roles.");
  if (tips.length === 0)                tips.push("Great structure! Your resume covers all the key sections ATS systems look for.");

  return { score, level, wordCount, pageEst, topKeywords, sections, tips };
}
