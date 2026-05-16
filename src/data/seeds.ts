import { Article } from "./dummy";

export const SEED_VERSION = "v1";
export const SEED_VERSION_KEY = "zeni_seed_version";

export const seedArticles: Article[] = [
  {
    id: "seed-1",
    title: "If You Understand These 5 AI Terms, You're Ahead of 90% of People",
    description: "Master the core ideas behind AI without getting lost in jargon. These five concepts will change how you think about the technology reshaping the world.",
    author: "Shreyas Naphad",
    date: "Mar 29, 2026",
    readingTime: "7 min read",
    category: "Artificial Intelligence",
    claps: 17800,
    responses: 369,
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
    author: "Elena Vance",
    date: "May 14, 2026",
    readingTime: "6 min read",
    category: "Design",
    claps: 5200,
    responses: 88,
    content: `The most sophisticated design is the one that disappears. When a user completes a task without thinking about the interface, the designer has succeeded.

This principle — that good design is invisible — sounds simple. In practice, it requires relentless subtraction.

## Why We Add Too Much

There's a psychological pull toward addition in design. We add features because they feel like value. We add visual elements because blank space feels wasteful. We add options because more seems like more.

But users don't experience your design as an inventory of features. They experience it as friction — or its absence. Every added element is something the user has to process, understand, and navigate around. The cost is invisible to the designer and very visible to the user.

The classic mistake is the feature-bloated dashboard — a dozen widgets, five navigation levels, notifications competing for attention. It feels productive to build. It's exhausting to use.

## The Three Rules of Subtractive Design

The first rule: every element must earn its place. If you can't articulate in one sentence why an element exists, remove it. This applies to buttons, icons, labels, colors, and entire sections.

The second rule: whitespace is not emptiness. It's the breath between notes — it creates rhythm, focus, and hierarchy. Generous margins and padding don't waste space; they direct the eye and reduce cognitive load. The most readable books, newspapers, and websites all use whitespace deliberately.

The third rule: typography is your first and most important design decision. For most digital products, 80 to 90 percent of what a user sees is text. The typeface you choose communicates credibility, emotion, and intent before a single word is consciously processed.

## In Practice

When you apply subtractive design consistently, something counterintuitive happens: the remaining elements become more powerful. Each one matters. Each one communicates. A single call-to-action button on a clean page converts better than three buttons surrounded by competing copy, because the user's attention is undivided.

The same principle applies to color. A product that uses color sparingly — mostly neutral, with one intentional accent — creates more impact with that accent than a product that uses color everywhere.

## The Code Parallel

Subtractive design translates directly to engineering. The cleanest codebases are not the most clever ones. They're the most ruthlessly simple — where each function does one thing, each file has one purpose, and nothing exists without a clear reason.

The parallel is not coincidental. Design and engineering are both acts of constraint. The best practitioners in both fields have learned the same truth: less, done well, beats more, done adequately. Every time.`,
  },
  {
    id: "seed-3",
    title: "Building for Longevity: Sustainable Software Engineering",
    description: "A deep dive into architectural patterns that stand the test of time, scale gracefully, and don't burn out the team that maintains them.",
    author: "Sarah Drasner",
    date: "May 8, 2026",
    readingTime: "10 min read",
    category: "Engineering",
    claps: 8900,
    responses: 214,
    content: `Most software is written to solve today's problem. Great software is designed so that tomorrow's problems can be solved without burning everything down.

The difference between these two approaches isn't cleverness. It's restraint.

## The Longevity Problem

Every engineering team eventually confronts it: the codebase that was a joy to work in at year one becomes a minefield at year three. Features that should take an afternoon take a sprint. Every change requires understanding six other systems. Confidence in deployments evaporates.

This is not inevitable. It's the accumulated cost of decisions made under pressure, without a coherent philosophy about what the system should be.

The pattern is predictable: early speed creates technical debt. Technical debt creates fragility. Fragility slows the team. Slowness creates pressure. Pressure creates more debt. The spiral is familiar to anyone who has worked in a fast-moving engineering organization for more than two years.

## Patterns That Last

Small, focused modules are the foundation. Each unit of code should do one thing and be independently testable. When a module does one thing well, it can be understood in isolation, changed without cascading effects, and tested with confidence.

Explicit contracts between modules matter as much as the modules themselves. Internal implementations can change freely; interfaces between systems should be stable and documented. The reason most systems become unmaintainable is not bad internal code — it's undefined boundaries between components that silently couple over time.

Getting the data model right is the highest-leverage decision an engineering team makes. Everything else can be refactored. Code can be rewritten. Architectures can be restructured. A bad data model infects everything it touches and is almost impossible to fix without a painful migration.

## Write for the Reader

Code is read far more often than it is written. A piece of code might be written once and read a hundred times — by the original author six months later, by colleagues during review, by on-call engineers debugging at 2am.

Optimizing for the reader means choosing clarity over cleverness, descriptive names over abbreviated ones, and explicit logic over compressed expressions. It means writing code the way you'd explain a system to a smart colleague — not the way you'd show off to an interviewer.

### The Boy Scout Rule

Treat refactoring as part of the feature development cycle rather than a separate initiative. The Boy Scout Rule — leave the code cleaner than you found it — applied consistently over time produces dramatic improvements with no dedicated refactoring projects required.

Teams that never refactor accumulate debt until the system collapses under its own weight. Teams that refactor constantly never ship. The balance is treating each feature as an opportunity to incrementally improve the code around it.

## Sustainable Teams

Sustainable engineering is ultimately about sustainable teams. A codebase that only one person understands is a liability. Practices that burn out senior engineers are unsustainable regardless of their short-term output.

The most durable engineering cultures are the ones that invest in legibility — making the system understandable to everyone on the team, not just the people who built it. They write documentation that explains why decisions were made, not just what was built. They conduct post-mortems that improve systems, not assign blame.

Great software is built by teams that expect to be maintaining it in five years. That expectation changes every decision.`,
  },
  {
    id: "seed-4",
    title: "The Last Time This Happened, Lots of Regular People Became Millionaires",
    description: "A historic wave of wealth creation is unfolding. The people who understand the underlying forces — not just the hype — will be the ones who benefit.",
    author: "The Curious Finance Girl",
    date: "Mar 15, 2026",
    readingTime: "8 min read",
    category: "Finance",
    claps: 3700,
    responses: 123,
    content: `Every decade or so, the financial tectonic plates shift. Most people miss it entirely. A small number — ordinary people, not Wall Street insiders — position themselves correctly and exit the other side with generational wealth.

We are at one of those moments right now.

## What History Tells Us

The pattern repeats with remarkable consistency. A new technology or economic force creates dislocation. Early adopters who understand it position themselves. The mainstream catches up. Prices reflect the new reality. By that point, the early window has closed.

The dot-com era. The housing collapse and the buyers who entered in 2009. The equity bull market of the 2010s. Crypto. Each time, a narrative formed. Each time, the people who understood the underlying forces — not the surface story — came out ahead.

The critical insight is this: the wealth isn't created at the peak. It's created when the majority of people don't yet believe in the story, but the fundamentals are already in place.

## Why AI Is Different

AI is not the internet. It's not crypto. It's something structurally different — a general-purpose technology that augments every other industry simultaneously. Electrification is the closest historical analogy: a technology so foundational that it doesn't just create new companies, it changes how every existing company operates.

The productivity gains being unlocked are compounding across sectors. Companies in logistics, healthcare, finance, legal services, and education are beginning to operate with dramatically fewer labor inputs for the same or greater output. This is not hype. The data is in the earnings reports.

### Where the Opportunity Is

It's not in picking the right AI stocks. That game is mostly over for individual investors — the obvious names are fully priced.

The opportunity is in skills, positioning, and second-order effects. The industries that will be disrupted first are the ones most reliant on knowledge work that follows predictable patterns. The industries that will benefit most in the near term are the ones that can absorb AI tooling into their workflows fastest.

## The Uncomfortable Truth

The last time a technology of this magnitude emerged, the people who benefited weren't necessarily the ones who built it. They were the ones who understood it early enough to adapt — to build adjacent businesses, acquire the new skills, invest in the picks-and-shovels companies, and reposition their careers and capital.

Most people will wait for certainty before acting. Certainty arrives at peak price, after the wealth transfer has already occurred.

## What to Do With This

Think in decades, not quarters. The AI transition will take longer than optimists expect and shorter than skeptics predict. The five-year window is where most of the accessible opportunity sits.

Audit your skills against what's becoming commoditized. Lean into the things that are getting harder to automate, not easier — complex judgment, creative problem-solving, relationship-based work, and domain expertise that requires deep experience rather than pattern-matching.

This isn't financial advice. It's a pattern-recognition exercise. Study the history. Zoom out. Then decide where you want to be in five years — and start working backward from there today.`,
  },
  {
    id: "seed-5",
    title: "Attention is the New Oil: How to Reclaim Yours",
    description: "The most valuable resource of the 21st century isn't data or compute power — it's your ability to focus deeply. Here's what the research says about protecting it.",
    author: "Priya Mehta",
    date: "May 2, 2026",
    readingTime: "6 min read",
    category: "Productivity",
    claps: 6700,
    responses: 178,
    content: `In 2026, the most contested resource on the planet is not oil. It's not rare earth minerals. It's not even data.

It's your attention.

Trillion-dollar companies have optimized every pixel of their products to capture and hold it. Entire departments of behavioral scientists work on making apps harder to put down. Notification systems are engineered to create Pavlovian responses. And most of us hand our attention over without a second thought.

## What Attention Actually Is

Attention is not just "what you're looking at." It is the executive function that determines which information gets processed deeply and which gets filtered. It's the gating mechanism of conscious thought.

When you fragment your attention — checking notifications every few minutes, switching between tasks, half-watching while half-scrolling — you're not just losing time. You're degrading your capacity for deep, generative thought. Research from the University of California Irvine found it takes an average of 23 minutes to return to a task after an interruption. We interrupt ourselves dozens of times per hour.

The compounding effect of this is profound. Deep work — the kind that produces breakthroughs, high-quality writing, and complex problem-solving — requires sustained focus that the modern information environment systematically destroys.

## The Architecture of Distraction

This is not accidental. The attention economy was designed by engineers who understood operant conditioning. Variable reward schedules — the mechanism that makes slot machines addictive — are the same mechanism that makes social media feeds, notification badges, and infinite scroll compulsive.

The notifications are not informing you. They are training you to check reflexively. The feeds are not keeping you up to date. They are replacing your internal agenda with an externally curated one.

Understanding this as a designed system, rather than a personal failing, is the first step to addressing it.

## Three Practices That Actually Work

Time blocking with real commitment is the foundation. Not just scheduling focus time, but treating interruptions of that time with the same seriousness as missing a client meeting. A two-hour block of uninterrupted deep work produces more than a full day of fragmented effort for most knowledge workers.

Input curation is equally important and consistently undervalued. You cannot think clearly on low-quality inputs. Audit what you read, watch, and scroll through. The quality of your thinking is downstream of the quality of what you consume. Be ruthless about this.

### Single-Tasking

Do one thing. Finish it. Then do the next thing. The research on multitasking is unambiguous — it does not exist as a cognitive capability. What people call multitasking is rapid context-switching, and it carries a measurable cognitive tax with each switch. The myth of the productive multitasker has been repeatedly debunked and is still widely believed.

## The Long Game

The people who will build the most meaningful things in the next decade won't necessarily be the ones with the best tools or the fastest connections. They'll be the ones who can sit with a hard problem for three hours without checking their phone.

That capacity is increasingly rare. Which means it's increasingly valuable.

Protecting your attention isn't a productivity hack. It's a competitive advantage — and increasingly, a form of self-defense.`,
  },
  {
    id: "seed-6",
    title: "The Developer Who Stopped Googling",
    description: "How the shift from search engines to AI assistants is quietly changing how we build software — and what skills actually matter now.",
    author: "Marcus Webb",
    date: "Apr 18, 2026",
    readingTime: "5 min read",
    category: "Technology",
    claps: 4400,
    responses: 97,
    content: `For the first fifteen years of my career, Stack Overflow was the second tab I opened after my IDE. Not anymore.

Something shifted about two years ago, quietly at first and then all at once. The muscle memory of Cmd+T, "how to X in Y," scan results, find the answer — that loop, repeated thousands of times across a career, started to feel obsolete.

## What Changed

It wasn't just that AI assistants got better at answering programming questions. It's that the nature of what you need when you're stuck changed too.

A Stack Overflow answer gives you a solution to a specific, usually stripped-down version of a problem that someone else had in a different context. Sometimes it's exactly what you need. Often, it requires significant adaptation. The answer doesn't know your codebase, your constraints, or what you actually tried before asking.

An AI assistant that has context about your code, your error message, and your architecture gives you something qualitatively different: a collaborator who can work through the problem with you, rather than a database you query.

## What This Changes About Development

The shift has interesting second-order effects on the craft.

Junior developers who lean heavily on AI assistance can produce working code faster than was previously possible. But they sometimes don't understand why the code works — which makes debugging, extending, and optimizing it significantly harder. The understanding gap shows up exactly when you need it most: when something breaks in production at 2am and the AI's suggestion isn't resolving it.

### What Still Matters

Deep understanding of fundamentals has become more valuable, not less. The developers who use AI tools most effectively are the ones who understand the problem space well enough to know when the AI is wrong — and it is wrong, regularly, in ways that are easy to miss if you don't have the foundation.

Reading code remains as important as writing it. AI will write the first draft. Humans still need to review, understand, and take ownership of it.

## The Honest Assessment

The developers who are thriving in this environment are the ones who use AI as a force multiplier on deep competence, not a substitute for it. They leverage it to move faster on the parts they understand well. They stay skeptical of its output in the areas where they're less confident.

The ones struggling are the ones who outsourced their learning to the tool before building the foundation that makes the tool trustworthy.

The skill hasn't changed: understand your problem deeply. What's changed is how fast you can execute once you do.`,
  },
  {
    id: "seed-7",
    title: "Why Most Writing Advice Is Wrong",
    description: "Show don't tell, write every day, find your voice — the most repeated writing advice is either misleading, context-dependent, or simply false.",
    author: "Julian Gomer",
    date: "Apr 5, 2026",
    readingTime: "5 min read",
    category: "Writing",
    claps: 3100,
    responses: 76,
    content: `The most widely shared writing advice forms a small, familiar canon. Show don't tell. Write every day. Find your voice. Kill your darlings. Read widely. Write what you know.

Some of these are useful sometimes. Most of them are either misleading, context-dependent, or simply wrong when applied universally. And the people who repeat them most confidently are often the ones who understand writing least.

## "Show Don't Tell" Is Not a Rule

"Show don't tell" is advice about a specific failure mode — over-explaining emotion through exposition instead of dramatizing it through action and detail. It's useful when applied to that specific problem.

As a universal rule, it's counterproductive. Telling is often exactly what the reader needs. Long sequences of scene-level showing without authorial interpretation can be tedious and opaque. The writers who "show" everything are frequently the hardest to read, because the reader has to do all the work of interpretation without any guidance.

The actual principle is: choose the mode — showing or telling — that best serves the sentence, the scene, and the reader. Good writers do both constantly.

## "Write Every Day" Mistakes Habit for Productivity

The advice to write every day is usually offered to counter the perfectionist tendency to wait for ideal conditions. That's valid. But the prescription itself is too rigid.

Forcing output on days when you have nothing to say produces bad writing that has to be discarded. Worse, it conditions you to write mechanically — filling a word-count quota rather than pursuing genuine insight. Many writers do their most important "writing" while walking, reading, thinking, or doing dishes. The physical act of typing is not the whole of the craft.

### What Actually Works

What works is showing up consistently — but "consistently" doesn't require "daily." It requires honest self-knowledge about when you do your best work and what conditions produce it. It requires having something to say before you sit down to say it.

## "Find Your Voice" Is Backwards

Voice is not found. It is built — as a byproduct of reading widely, writing extensively, revising ruthlessly, and developing strong opinions about your subject.

Writers who spend time "looking for their voice" often end up imitating other writers or defaulting to a kind of performed authenticity that is its own cliché. The writers with distinctive voices got them by writing a great deal about things they cared about deeply, over a long period of time.

## The One Piece of Advice That Holds Up

Read your work aloud. Every single time, before you consider anything finished.

The ear catches what the eye misses. Awkward rhythm, redundant phrases, sentences that require rereading — all of these reveal themselves immediately when read aloud. No other single editing habit produces as reliable an improvement across as wide a range of writing problems.

Everything else is context. This one works.`,
  },
  {
    id: "seed-8",
    title: "Why Typography is the Soul of Your Interface",
    description: "Before the first pixel is placed, one decision shapes everything: the typeface. Exploring the psychology and craft of type in editorial design.",
    author: "Mia Tanaka",
    date: "May 12, 2026",
    readingTime: "7 min read",
    category: "Design",
    claps: 4100,
    responses: 52,
    content: `Before the first component is built, before the first color is chosen, there is one decision that shapes everything else: the typeface.

Typography is not decoration. For most digital products, 80 to 90 percent of what a user encounters is text. The typeface you choose — and how you use it — communicates credibility, emotion, and intent before a single word is consciously read.

## The Serif vs. Sans-Serif Question

This debate has been settled and reopened a dozen times. The current consensus: for long-form reading at comfortable sizes, a well-designed serif is marginally easier to read because the serifs guide the eye along the baseline. For small text, UI labels, and short interactions, a clean sans-serif wins.

But this misses the more important question. It's not serif versus sans-serif. It's: does this typeface carry the right emotional register for this context?

A financial institution using a playful display font isn't making a typography error. It's making a trust error. The letterforms communicate something about the brand before the content does. Misalignment between what the type says and what the brand means destroys credibility faster than almost any other design decision.

## The Four Axes of Type Selection

Personality is the first consideration. What does the letterform convey? Authoritative, warm, technical, playful, serious? This should match the brand's actual character, not its aspirational character.

Hierarchy support matters enormously in practice. Does the typeface family offer enough weight variation — at minimum light, regular, medium, and bold — to establish clear levels of visual hierarchy? A font that looks beautiful at one weight but muddy at others will break the design system.

### Legibility at Every Size

Test your type at every size and weight you'll actually use it. A typeface that looks stunning in a 48-point headline can become a dense mess at 14 points in a sidebar. This is especially true for display and novelty faces, which are designed for impact at large sizes and fall apart at smaller ones.

Pairing is the final consideration. Most great editorial products use two typefaces in deliberate contrast: a workhorse sans-serif for UI and navigation, and a more expressive serif for article bodies and headlines. The contrast between them creates visual interest while maintaining function. The serif says: slow down, read this. The sans-serif says: this is navigation, use it.

## What Type Communicates Beyond Words

There is a reason that legal documents, medical journals, and premium newspapers all default to serif typefaces. There is a reason that technology startups overwhelmingly choose geometric sans-serifs. There is a reason that luxury brands favor high-contrast, optically refined faces with dramatic thick-thin stroke variation.

None of these choices are arbitrary. Each is a claim about the nature of the institution — its values, its audience, its relationship to tradition and innovation.

When you choose a typeface, you are not choosing how words look. You are choosing what kind of organization you are. The decision deserves the same deliberateness you'd bring to writing a mission statement. It communicates as much, and it communicates it first.`,
  },
];
