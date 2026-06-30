import { Article, Resource } from "./dummy";

export const SEED_VERSION = "v2";
export const SEED_VERSION_KEY = "zeni_seed_version";

export const seedArticles: Article[] = [
  {
    id: "seed-1",
    title: "If You Understand These 5 AI Terms, You're Ahead of 90% of People",
    description: "Master the core ideas behind AI without getting lost in jargon. These five concepts will change how you think about the technology reshaping the world.",
    author: "Shreyas Naphad",
    authorId: "writer-1",
    date: "Mar 29, 2026",
    readingTime: "7 min read",
    category: "Artificial Intelligence",
    claps: 0,
    responses: 0,
    views: 0,
    status: "published",
    seoKeywords: ["AI terms explained", "machine learning basics", "LLM explained", "AI for beginners", "what is hallucination in AI"],
    tags: ["AI", "Machine Learning", "Beginners", "Technology"],
    content: `Let me be frank.

Most people who talk about AI either sound like they're reciting textbook definitions, or they're completely lost when someone mentions terms like LLMs or neural networks. You don't have to be either of them.

Whether you're a student, a professional, or just someone trying to keep up with the most important technology of our time — understanding the building blocks of AI will give you a real edge.

## 1. Tokens — The Alphabet of AI

When an AI reads your message, it doesn't read it word by word. Instead, it breaks everything into tokens — small chunks of text. A token is roughly a word or word fragment. "Running" is one token. "Anthropomorphization" might be four. Even spaces count.

Why does this matter? Because AI models have a token limit — a cap on how much text they can process at once. This affects how long a document you can summarize, how long a conversation can go before the AI forgets the beginning, and how much code it can review.

Think of tokens as the atomic unit of AI language. Everything you input and everything it outputs is measured in them.

## 2. Context Window — The AI's Working Memory

Imagine you're in a meeting but can only remember the last 15 minutes. Anything before that is gone. That's essentially what a context window is for an AI.

The context window is the total amount of text — measured in tokens — the AI can "see" at one time. This includes your conversation history, your instructions, and any documents you've shared. Early models had context windows of around 4,000 tokens. Modern models handle 100,000 to 200,000 or more — the equivalent of an entire novel.

When people say "the AI forgot what I said earlier," that's a context window problem. The conversation grew longer than what the model could hold in working memory.

## 3. Temperature — The Creativity Dial

Every time an AI generates text, it makes a probabilistic choice: given everything so far, what word comes next? Temperature controls how adventurous those choices are.

Low temperature means the AI picks the most likely, predictable word every time. Output is consistent and precise — good for code, factual summaries, and structured data. High temperature means the AI entertains less probable options. Output becomes more creative and surprising — useful for brainstorming, poetry, and fiction.

Most consumer AI products hide this setting, but it's always there under the hood. Precision requires low temperature. Inspiration needs it turned up.

## 4. Hallucination — When AI Makes Things Up

This is the most misunderstood concept in AI. Hallucination is when a model generates information that sounds completely plausible but is factually wrong or entirely fabricated. The AI isn't lying. It's doing exactly what it was trained to do: predicting the most statistically likely next token.

A hallucinating AI might cite a research paper that doesn't exist, give you a lawyer's name and bar number that are completely made up, or tell you a historical event happened in the wrong year — with total confidence.

Why does this happen? The model learned from text patterns, not from a verified database of facts. It knows how a paper citation looks, so it generates one. It doesn't check if the paper exists.

The lesson: always verify important facts. Use AI as a thinking partner, not an encyclopedia.

## 5. RAG — Teaching AI to Look Things Up

RAG stands for Retrieval-Augmented Generation. Instead of relying entirely on what the model memorized during training, RAG gives the AI access to a real-time knowledge base — your company documents, a database, a website.

Before answering, the AI first retrieves the most relevant information, then generates its response based on those retrieved facts. Think of it as the difference between a consultant who memorized textbooks versus one who actually read your company's financials before the meeting.

RAG is behind almost every enterprise AI product that claims to "chat with your documents." It's what makes AI go from general to genuinely useful for your specific context.

## The Real Edge

Understanding these five terms won't make you an AI engineer. But they'll do something better — they'll help you think clearly about what AI can and can't do, how to prompt it well, why it sometimes fails, and when to trust it.

Most people treat AI like a magic box. The ones ahead of them treat it like a well-understood tool. Now you know which side you're on.`,
  },
  {
    id: "seed-2",
    title: "The Art of Minimalist Design in Modern Web Development",
    description: "How stripping away the unnecessary leads to more powerful user experiences and cleaner codebases that stand the test of time.",
    author: "Arjun Mehta",
    authorId: "writer-3",
    date: "May 14, 2026",
    readingTime: "6 min read",
    category: "Design",
    claps: 0,
    responses: 0,
    views: 0,
    status: "published",
    seoKeywords: ["minimalist web design", "UI design principles", "clean design", "UX best practices"],
    tags: ["Design", "UX", "Web Development", "Minimalism"],
    content: `The most sophisticated design is the one that disappears. When a user completes a task without thinking about the interface, the designer has succeeded.

This principle — that good design is invisible — sounds simple. In practice, it requires relentless subtraction.

## Why We Add Too Much

There's a psychological pull toward addition in design. We add features because they feel like value. We add visual elements because blank space feels wasteful. We add options because more seems like more.

But users don't experience your design as an inventory of features. They experience it as friction — or its absence. Every added element is something the user has to process, understand, and navigate around. The cost is invisible to the designer and very visible to the user.

The classic mistake is the feature-bloated dashboard — a dozen widgets, five navigation levels, notifications competing for attention. It feels productive to build. It's exhausting to use.

## The Three Rules of Subtractive Design

The first rule: every element must earn its place. If you can't articulate in one sentence why an element exists, remove it. This applies to buttons, icons, labels, colors, and entire sections.

The second rule: whitespace is not emptiness. It's the breath between notes — it creates rhythm, focus, and hierarchy. Generous margins and padding don't waste space; they direct the eye and reduce cognitive load.

The third rule: typography is your first and most important design decision. For most digital products, 80 to 90 percent of what a user sees is text. The typeface you choose communicates credibility, emotion, and intent before a single word is consciously processed.

## In Practice

When you apply subtractive design consistently, something counterintuitive happens: the remaining elements become more powerful. Each one matters. Each one communicates. A single call-to-action button on a clean page converts better than three buttons surrounded by competing copy.

The same principle applies to color. A product that uses color sparingly — mostly neutral, with one intentional accent — creates more impact with that accent than a product that uses color everywhere.

## The Code Parallel

Subtractive design translates directly to engineering. The cleanest codebases are not the most clever ones. They're the most ruthlessly simple — where each function does one thing, each file has one purpose, and nothing exists without a clear reason.

The parallel is not coincidental. Design and engineering are both acts of constraint. The best practitioners in both fields have learned the same truth: less, done well, beats more, done adequately. Every time.`,
  },
  {
    id: "seed-3",
    title: "Building for Longevity: Sustainable Software Engineering",
    description: "A deep dive into architectural patterns that stand the test of time, scale gracefully, and don't burn out the team that maintains them.",
    author: "Shreyas Naphad",
    authorId: "writer-1",
    date: "May 8, 2026",
    readingTime: "10 min read",
    category: "Engineering",
    claps: 0,
    responses: 0,
    views: 0,
    status: "published",
    seoKeywords: ["software architecture", "sustainable engineering", "clean code", "technical debt", "software design"],
    tags: ["Engineering", "Architecture", "Best Practices", "Software"],
    content: `Most software is written to solve today's problem. Great software is designed so that tomorrow's problems can be solved without burning everything down.

The difference between these two approaches isn't cleverness. It's restraint.

## The Longevity Problem

Every engineering team eventually confronts it: the codebase that was a joy to work in at year one becomes a minefield at year three. Features that should take an afternoon take a sprint. Every change requires understanding six other systems. Confidence in deployments evaporates.

This is not inevitable. It's the accumulated cost of decisions made under pressure, without a coherent philosophy about what the system should be.

## Patterns That Last

Small, focused modules are the foundation. Each unit of code should do one thing and be independently testable. When a module does one thing well, it can be understood in isolation, changed without cascading effects, and tested with confidence.

Explicit contracts between modules matter as much as the modules themselves. Internal implementations can change freely; interfaces between systems should be stable and documented.

Getting the data model right is the highest-leverage decision an engineering team makes. Everything else can be refactored. Code can be rewritten. Architectures can be restructured. A bad data model infects everything it touches and is almost impossible to fix without a painful migration.

## Write for the Reader

Code is read far more often than it is written. A piece of code might be written once and read a hundred times — by the original author six months later, by colleagues during review, by on-call engineers debugging at 2am.

Optimizing for the reader means choosing clarity over cleverness, descriptive names over abbreviated ones, and explicit logic over compressed expressions.

### The Boy Scout Rule

Treat refactoring as part of the feature development cycle rather than a separate initiative. The Boy Scout Rule — leave the code cleaner than you found it — applied consistently over time produces dramatic improvements with no dedicated refactoring projects required.

## Sustainable Teams

Sustainable engineering is ultimately about sustainable teams. A codebase that only one person understands is a liability. Practices that burn out senior engineers are unsustainable regardless of their short-term output.

The most durable engineering cultures are the ones that invest in legibility — making the system understandable to everyone on the team. They write documentation that explains why decisions were made, not just what was built.

Great software is built by teams that expect to be maintaining it in five years. That expectation changes every decision.`,
  },
  {
    id: "seed-4",
    title: "The Last Time This Happened, Lots of Regular People Became Millionaires",
    description: "A historic wave of wealth creation is unfolding. The people who understand the underlying forces — not just the hype — will be the ones who benefit.",
    author: "Priya Sharma",
    authorId: "writer-2",
    date: "Mar 15, 2026",
    readingTime: "8 min read",
    category: "Finance",
    claps: 0,
    responses: 0,
    views: 0,
    status: "published",
    seoKeywords: ["wealth creation", "AI investment", "financial opportunity", "millionaire mindset", "investing in AI"],
    tags: ["Finance", "Investing", "AI", "Wealth"],
    content: `Every decade or so, the financial tectonic plates shift. Most people miss it entirely. A small number — ordinary people, not Wall Street insiders — position themselves correctly and exit the other side with generational wealth.

We are at one of those moments right now.

## What History Tells Us

The pattern repeats with remarkable consistency. A new technology or economic force creates dislocation. Early adopters who understand it position themselves. The mainstream catches up. Prices reflect the new reality.

The dot-com era. The housing collapse and the buyers who entered in 2009. The equity bull market of the 2010s. Crypto. Each time, a narrative formed. Each time, the people who understood the underlying forces — not the surface story — came out ahead.

The critical insight is this: the wealth isn't created at the peak. It's created when the majority of people don't yet believe in the story, but the fundamentals are already in place.

## Why AI Is Different

AI is not the internet. It's not crypto. It's something structurally different — a general-purpose technology that augments every other industry simultaneously. Electrification is the closest historical analogy.

The productivity gains being unlocked are compounding across sectors. Companies in logistics, healthcare, finance, legal services, and education are beginning to operate with dramatically fewer labor inputs for the same or greater output.

### Where the Opportunity Is

It's not in picking the right AI stocks. That game is mostly over for individual investors — the obvious names are fully priced.

The opportunity is in skills, positioning, and second-order effects. The industries that will be disrupted first are the ones most reliant on knowledge work that follows predictable patterns.

## What to Do With This

Think in decades, not quarters. The AI transition will take longer than optimists expect and shorter than skeptics predict. The five-year window is where most of the accessible opportunity sits.

Audit your skills against what's becoming commoditized. Lean into the things that are getting harder to automate — complex judgment, creative problem-solving, relationship-based work, and domain expertise.

This isn't financial advice. It's a pattern-recognition exercise. Study the history. Zoom out. Then decide where you want to be in five years — and start working backward from there today.`,
  },
  {
    id: "seed-5",
    title: "Attention is the New Oil: How to Reclaim Yours",
    description: "The most valuable resource of the 21st century isn't data or compute power — it's your ability to focus deeply. Here's what the research says about protecting it.",
    author: "Kavya Reddy",
    authorId: "writer-4",
    date: "May 2, 2026",
    readingTime: "6 min read",
    category: "Productivity",
    claps: 0,
    responses: 0,
    views: 0,
    status: "published",
    seoKeywords: ["focus and productivity", "attention economy", "deep work", "digital minimalism", "how to focus better"],
    tags: ["Productivity", "Focus", "Mental Health", "Self-Improvement"],
    content: `In 2026, the most contested resource on the planet is not oil. It's not rare earth minerals. It's not even data.

It's your attention.

Trillion-dollar companies have optimized every pixel of their products to capture and hold it. Entire departments of behavioral scientists work on making apps harder to put down.

## What Attention Actually Is

Attention is not just "what you're looking at." It is the executive function that determines which information gets processed deeply and which gets filtered. It's the gating mechanism of conscious thought.

When you fragment your attention — checking notifications every few minutes, switching between tasks, half-watching while half-scrolling — you're not just losing time. You're degrading your capacity for deep, generative thought.

Research from the University of California Irvine found it takes an average of 23 minutes to return to a task after an interruption. We interrupt ourselves dozens of times per hour.

## The Architecture of Distraction

This is not accidental. The attention economy was designed by engineers who understood operant conditioning. Variable reward schedules — the mechanism that makes slot machines addictive — are the same mechanism that makes social media feeds, notification badges, and infinite scroll compulsive.

Understanding this as a designed system, rather than a personal failing, is the first step to addressing it.

## Three Practices That Actually Work

Time blocking with real commitment is the foundation. Not just scheduling focus time, but treating interruptions of that time with the same seriousness as missing a client meeting.

Input curation is equally important and consistently undervalued. You cannot think clearly on low-quality inputs. Audit what you read, watch, and scroll through. The quality of your thinking is downstream of the quality of what you consume.

### Single-Tasking

Do one thing. Finish it. Then do the next thing. The research on multitasking is unambiguous — it does not exist as a cognitive capability. What people call multitasking is rapid context-switching, and it carries a measurable cognitive tax with each switch.

## The Long Game

The people who will build the most meaningful things in the next decade won't necessarily be the ones with the best tools. They'll be the ones who can sit with a hard problem for three hours without checking their phone.

That capacity is increasingly rare. Which means it's increasingly valuable.

Protecting your attention isn't a productivity hack. It's a competitive advantage — and increasingly, a form of self-defense.`,
  },
  {
    id: "seed-6",
    title: "The Developer Who Stopped Googling",
    description: "How the shift from search engines to AI assistants is quietly changing how we build software — and what skills actually matter now.",
    author: "Shreyas Naphad",
    authorId: "writer-1",
    date: "Apr 18, 2026",
    readingTime: "5 min read",
    category: "Technology",
    claps: 0,
    responses: 0,
    views: 0,
    status: "published",
    seoKeywords: ["AI for developers", "coding with AI", "GitHub Copilot", "future of programming", "software development AI"],
    tags: ["Technology", "AI", "Programming", "Software Development"],
    content: `For the first fifteen years of my career, Stack Overflow was the second tab I opened after my IDE. Not anymore.

Something shifted about two years ago, quietly at first and then all at once. The muscle memory of Cmd+T, "how to X in Y," scan results, find the answer — that loop, repeated thousands of times across a career, started to feel obsolete.

## What Changed

It wasn't just that AI assistants got better at answering programming questions. It's that the nature of what you need when you're stuck changed too.

A Stack Overflow answer gives you a solution to a specific, usually stripped-down version of a problem that someone else had in a different context. An AI assistant that has context about your code gives you something qualitatively different: a collaborator who can work through the problem with you.

## What This Changes About Development

Junior developers who lean heavily on AI assistance can produce working code faster than was previously possible. But they sometimes don't understand why the code works — which makes debugging, extending, and optimizing it significantly harder.

### What Still Matters

Deep understanding of fundamentals has become more valuable, not less. The developers who use AI tools most effectively are the ones who understand the problem space well enough to know when the AI is wrong — and it is wrong, regularly.

Reading code remains as important as writing it. AI will write the first draft. Humans still need to review, understand, and take ownership of it.

## The Honest Assessment

The developers who are thriving in this environment are the ones who use AI as a force multiplier on deep competence, not a substitute for it.

The skill hasn't changed: understand your problem deeply. What's changed is how fast you can execute once you do.`,
  },
  {
    id: "seed-7",
    title: "Why Most Writing Advice Is Wrong",
    description: "Show don't tell, write every day, find your voice — the most repeated writing advice is either misleading, context-dependent, or simply false.",
    author: "Priya Sharma",
    authorId: "writer-2",
    date: "Apr 5, 2026",
    readingTime: "5 min read",
    category: "Writing",
    claps: 0,
    responses: 0,
    views: 0,
    status: "published",
    seoKeywords: ["writing tips", "how to write better", "writing advice", "content writing", "improve writing skills"],
    tags: ["Writing", "Content Creation", "Storytelling", "Advice"],
    content: `The most widely shared writing advice forms a small, familiar canon. Show don't tell. Write every day. Find your voice. Kill your darlings.

Some of these are useful sometimes. Most of them are either misleading, context-dependent, or simply wrong when applied universally.

## "Show Don't Tell" Is Not a Rule

"Show don't tell" is advice about a specific failure mode — over-explaining emotion through exposition instead of dramatizing it through action and detail. It's useful when applied to that specific problem.

As a universal rule, it's counterproductive. Telling is often exactly what the reader needs. Long sequences of scene-level showing without authorial interpretation can be tedious and opaque.

The actual principle is: choose the mode that best serves the sentence, the scene, and the reader. Good writers do both constantly.

## "Write Every Day" Mistakes Habit for Productivity

Forcing output on days when you have nothing to say produces bad writing that has to be discarded. Worse, it conditions you to write mechanically — filling a word-count quota rather than pursuing genuine insight.

### What Actually Works

What works is showing up consistently — but "consistently" doesn't require "daily." It requires honest self-knowledge about when you do your best work and what conditions produce it.

## "Find Your Voice" Is Backwards

Voice is not found. It is built — as a byproduct of reading widely, writing extensively, revising ruthlessly, and developing strong opinions about your subject.

## The One Piece of Advice That Holds Up

Read your work aloud. Every single time, before you consider anything finished.

The ear catches what the eye misses. Awkward rhythm, redundant phrases, sentences that require rereading — all of these reveal themselves immediately when read aloud.

Everything else is context. This one works.`,
  },
  {
    id: "seed-8",
    title: "Why Typography is the Soul of Your Interface",
    description: "Before the first pixel is placed, one decision shapes everything: the typeface. Exploring the psychology and craft of type in editorial design.",
    author: "Arjun Mehta",
    authorId: "writer-3",
    date: "May 12, 2026",
    readingTime: "7 min read",
    category: "Design",
    claps: 0,
    responses: 0,
    views: 0,
    status: "published",
    seoKeywords: ["typography design", "font selection", "UI design typography", "web fonts", "design principles"],
    tags: ["Design", "Typography", "UI", "Visual Design"],
    content: `Before the first component is built, before the first color is chosen, there is one decision that shapes everything else: the typeface.

Typography is not decoration. For most digital products, 80 to 90 percent of what a user encounters is text. The typeface you choose — and how you use it — communicates credibility, emotion, and intent before a single word is consciously read.

## The Serif vs. Sans-Serif Question

The current consensus: for long-form reading at comfortable sizes, a well-designed serif is marginally easier to read because the serifs guide the eye along the baseline. For small text, UI labels, and short interactions, a clean sans-serif wins.

But this misses the more important question: does this typeface carry the right emotional register for this context?

A financial institution using a playful display font isn't making a typography error. It's making a trust error. The letterforms communicate something about the brand before the content does.

## The Four Axes of Type Selection

Personality is the first consideration. What does the letterform convey? Authoritative, warm, technical, playful, serious? This should match the brand's actual character.

Hierarchy support matters enormously in practice. Does the typeface family offer enough weight variation to establish clear levels of visual hierarchy?

### Legibility at Every Size

Test your type at every size and weight you'll actually use it. A typeface that looks stunning in a 48-point headline can become a dense mess at 14 points in a sidebar.

Pairing is the final consideration. Most great editorial products use two typefaces in deliberate contrast: a workhorse sans-serif for UI and navigation, and a more expressive serif for article bodies and headlines.

## What Type Communicates Beyond Words

There is a reason that legal documents, medical journals, and premium newspapers all default to serif typefaces. There is a reason that technology startups overwhelmingly choose geometric sans-serifs.

None of these choices are arbitrary. Each is a claim about the nature of the institution — its values, its audience, its relationship to tradition and innovation.

When you choose a typeface, you are not choosing how words look. You are choosing what kind of organization you are.`,
  },
  {
    id: "seed-9",
    title: "The Hidden Cost of Hustle Culture on Mental Health",
    description: "We've built an economic mythology around overwork. Here's what the data actually says about productivity, burnout, and the illusion of the 80-hour week.",
    author: "Kavya Reddy",
    authorId: "writer-4",
    date: "Apr 22, 2026",
    readingTime: "7 min read",
    category: "Health",
    claps: 0,
    responses: 0,
    views: 0,
    status: "published",
    seoKeywords: ["hustle culture", "burnout prevention", "mental health work", "overwork effects", "work life balance"],
    tags: ["Health", "Mental Health", "Work-Life Balance", "Productivity"],
    content: `The mythology of the 80-hour week is one of the most expensive lies in modern business culture.

We've built entire identities around it. The entrepreneur who sleeps at the office. The banker who hasn't taken a vacation in three years. The tech founder who wears lack of sleep as a badge of honor.

The data is unambiguous. None of this is actually producing more output.

## What the Research Actually Shows

Studies consistently show that cognitive performance begins to degrade significantly after 50 hours of work per week. After 55 hours, the degradation is so severe that the output produced in those extra hours is net negative — it creates errors and poor decisions that have to be undone.

The University of Toronto conducted a multi-year study on knowledge workers and found that the most consistently high-performing individuals worked between 45 and 50 hours per week — and protected their sleep, exercise, and recovery time with the same discipline they applied to their work.

The people logging 70-plus hours were producing about the same output, with significantly more errors.

## What Hustle Culture Actually Does

Chronic overwork produces a predictable cascade. Sleep deprivation impairs executive function — exactly the cognitive capacities required for complex problem-solving, judgment, and creativity. Impaired judgment produces poor decisions. Poor decisions create problems that require additional time to fix.

The hustle culture narrative obscures this loop. Because the failures are distributed and delayed, the exhausted founder doesn't attribute the bad hire or the strategic mistake to their sleep deficit. They attribute it to bad luck or external circumstances — and work harder to compensate.

## The Recovery Illusion

One of the most persistent myths is that recovery time is wasted time. Research in sports science — and increasingly in cognitive performance research — shows that recovery is when adaptation happens.

Elite athletes don't improve during training. They improve during rest, when the physiological adaptations triggered by training are consolidated. The same principle applies to cognitive work. Deep learning, creative insight, and strategic clarity emerge disproportionately during rest — during sleep, during walks, during unstructured time.

The people who seem to have an inexhaustible supply of good ideas are often the ones who are most intentional about recovery.

## Building Differently

The case for sustainable work practices isn't idealistic. It's strategic. The teams that operate sustainably produce higher-quality output over longer periods and retain their best people.

The founders who've built the most durable companies are rarely the ones who slept four hours a night. They're the ones who were thoughtful about energy management, knew when to push and when to recover, and built organizations that didn't depend on heroic individual effort to function.

The hustle narrative serves a purpose: it provides a simple explanation for why some people succeed and others don't. The reality is more uncomfortable — success is more about clarity, judgment, and consistency than it is about raw hours. And clarity and judgment require rest.`,
  },
  {
    id: "seed-10",
    title: "India's Startup Ecosystem Is at an Inflection Point",
    description: "A new generation of founders is building differently — with capital efficiency, global ambition, and a philosophy forged in constraint. What comes next will surprise you.",
    author: "Priya Sharma",
    authorId: "writer-2",
    date: "May 18, 2026",
    readingTime: "9 min read",
    category: "Business",
    claps: 0,
    responses: 0,
    views: 0,
    status: "published",
    seoKeywords: ["India startups", "Indian tech ecosystem", "startup funding India", "entrepreneurship India", "Indian unicorns"],
    tags: ["Business", "Startups", "India", "Technology", "Entrepreneurship"],
    content: `The story of Indian entrepreneurship is being rewritten in real time. And most of the world is only seeing the first chapter.

The decade from 2011 to 2021 produced India's first wave of true technology unicorns — Flipkart, Ola, Zomato, BYJU'S, Paytm. It was a story of capital abundance, rapid user acquisition, and bold bets on a massive consumer market awakening to smartphones and internet access.

That wave peaked. The correction of 2022 and 2023 was brutal for some founders and investors. It was also clarifying.

## What the Correction Created

The founders who survived and are now building the second wave were forged in that correction. They emerged with a different philosophy: capital efficiency is a feature, not a constraint. Revenue matters from day one. Growth without unit economics is not growth.

This sounds obvious in retrospect. In practice, it represents a significant cultural shift in how Indian founders approach company-building.

## The Global Ambition Is Different Now

The first wave of Indian startups built primarily for the Indian market — an enormous, complex, fast-growing market that justified the focus.

The second wave is building for the world from the beginning. The infrastructure for this is now in place: global payment rails, cloud infrastructure that scales seamlessly across regions, and — critically — AI tools that dramatically reduce the cost of building and maintaining global products.

### The AI Advantage

Indian founders have a structural advantage in the current AI moment. They are accustomed to building world-class products under significant cost constraints. The skills required to get the most from AI tools — creative prompt engineering, efficient use of computational resources, building fast with limited teams — are skills that Indian engineering culture has been building for decades.

The Indian startup that builds a globally competitive product with a team of twelve is not a curiosity. It's increasingly the norm.

## What Comes Next

The next five years will see Indian founders capture significant global market share in categories where software and AI are transforming traditional industries: legal tech, healthcare, financial services, education, and enterprise software.

The deals will be quieter than the first wave. The companies will be more profitable earlier. The exits will be less dramatic and more numerous.

The inflection point is real. The founders building through it understand something that the commentary cycle hasn't fully absorbed: the next great technology companies aren't necessarily going to come from Silicon Valley. Some of them are being built right now in Bengaluru, Mumbai, and Hyderabad — by people who learned, through hard experience, to build for the long term.`,
  },
];

export const seedResources: Resource[] = [
  {
    id: "res-1",
    title: "ATS-Optimized Resume Template",
    description: "A professional resume template crafted to pass Applicant Tracking Systems. Includes 3 variants for tech, finance, and management roles.",
    type: "template",
    price: 0,
    authorId: "writer-1",
    authorName: "Shreyas Naphad",
    downloadCount: 8420,
    tags: ["Resume", "ATS", "Career", "Job Search"],
    category: "Career",
    date: "Mar 10, 2026",
    featured: true,
  },
  {
    id: "res-2",
    title: "The Complete AI Prompt Engineering Guide",
    description: "100+ proven prompts for ChatGPT, Claude, and Gemini. Organized by use case: writing, coding, research, marketing, and productivity.",
    type: "pdf",
    price: 199,
    authorId: "writer-1",
    authorName: "Shreyas Naphad",
    downloadCount: 3240,
    tags: ["AI", "Prompts", "ChatGPT", "Productivity"],
    category: "Artificial Intelligence",
    date: "Apr 5, 2026",
    featured: true,
  },
  {
    id: "res-3",
    title: "Personal Finance Tracker — Excel & Google Sheets",
    description: "Track income, expenses, investments, and net worth with this comprehensive spreadsheet. Includes budget planner and goal tracker.",
    type: "template",
    price: 99,
    authorId: "writer-2",
    authorName: "Priya Sharma",
    downloadCount: 5610,
    tags: ["Finance", "Budget", "Excel", "Spreadsheet"],
    category: "Finance",
    date: "Feb 20, 2026",
    featured: true,
  },
  {
    id: "res-4",
    title: "UX Research Interview Script Pack",
    description: "10 ready-to-use interview scripts for user research. Covers usability testing, discovery interviews, and concept validation sessions.",
    type: "template",
    price: 149,
    authorId: "writer-3",
    authorName: "Arjun Mehta",
    downloadCount: 1870,
    tags: ["UX", "Research", "Interview", "Design"],
    category: "Design",
    date: "Apr 18, 2026",
    featured: false,
  },
  {
    id: "res-5",
    title: "Wellness & Habit Tracker 2026",
    description: "A minimal but powerful daily tracker for habits, water, sleep, mood, and gratitude. Available in PDF and Notion template formats.",
    type: "template",
    price: 0,
    authorId: "writer-4",
    authorName: "Kavya Reddy",
    downloadCount: 12400,
    tags: ["Health", "Habits", "Wellness", "Productivity"],
    category: "Health",
    date: "Jan 15, 2026",
    featured: true,
  },
  {
    id: "res-6",
    title: "System Design Interview Masterclass Notes",
    description: "Comprehensive notes covering distributed systems, databases, caching, and scalability patterns. Perfect for FAANG interview prep.",
    type: "study",
    price: 299,
    authorId: "writer-1",
    authorName: "Shreyas Naphad",
    downloadCount: 2890,
    tags: ["Engineering", "Interview", "System Design", "Tech"],
    category: "Technology",
    date: "Mar 28, 2026",
    featured: false,
  },
];
