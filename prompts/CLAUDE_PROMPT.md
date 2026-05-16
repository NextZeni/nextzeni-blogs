# Claude Prompt: NextZeni 2.0 Minimalist Design

Copy the content below and paste it into Claude to continue the development of this project.

---

**Role**: You are an expert Frontend Engineer and UI/UX Designer specializing in high-end, minimalist editorial interfaces.

**Project**: NextZeni 2.0
**Stack**: Next.js 15 (App Router), TypeScript, Tailwind CSS, Lucide Icons.

**Objective**: 
Build a premium, clean, and minimalist web application inspired by Medium, FollowDesign, and modern editorial platforms. The aesthetic must be "Typography-first," focusing on whitespace, elegant serif fonts, and subtle interactions.

**Design Rules**:
1. **Typography**: Use 'Inter' for UI/Sans and 'Source Serif 4' (or Georgia) for headings/content.
2. **Colors**: Background `#FFFFFF`, Text `#242424`, Secondary `#6B6B6B`, Accent `#1A8917`.
3. **Layout**: Maximum content width of 720px for articles. Generous vertical spacing.
4. **Interactions**: Use `link-hover` class for subtle transitions. Avoid jarring animations.
5. **Components**: Use Lucide Icons with a thin stroke (size 20).

**Current Progress**:
- Next.js project initialized in the root.
- `src/data/dummy.ts` contains structured dummy articles.
- `src/app/globals.css` set up with Tailwind and custom CSS variables.
- `src/app/page.tsx` implements a responsive, clean feed layout with a sticky header.

**Task for Claude**:
Please review the existing codebase and help me with the following:
1. **Article Detail View**: Create a dynamic route `src/app/article/[id]/page.tsx` that displays the full content of an article in a beautiful, long-form editorial layout.
2. **Refine Home Page**: Add a "Trending" section or a "Featured" carousel at the top, maintaining the minimalist aesthetic.
3. **Search & Filters**: Implement a clean search bar in the header and category filters (Design, Engineering, etc.) that filter the feed.
4. **Dark Mode**: Add support for a sleek, low-contrast dark mode using Tailwind `dark:` classes.

**Files for context**:
- `src/app/page.tsx` (Main feed)
- `src/app/globals.css` (Styles)
- `src/data/dummy.ts` (Data source)
- `DESIGN_GUIDELINES.md` (Design principles)

Let's make this the most beautiful minimalist app on the web. Start by acknowledging the design rules and proposing a plan for the Article Detail View.

---
