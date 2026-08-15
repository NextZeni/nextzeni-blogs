import { parseContent, renderInline, renderTable } from "@/data/dummy";
import SmartImage from "./SmartImage";

type StoryPreviewProps = {
  title: string;
  description: string;
  content: string;
  coverImage?: string | null;
  author: string;
  date: string;
  readingTime: string;
  category: string;
};

/**
 * The story as a reader will see it, rendered from the same markdown the
 * article page parses. Kept in step with the reader's block rendering in
 * `app/article/[id]/ArticleView.tsx` — a preview that flatters the draft is
 * worse than no preview.
 */
export default function StoryPreview({
  title,
  description,
  content,
  coverImage,
  author,
  date,
  readingTime,
  category,
}: StoryPreviewProps) {
  const blocks = parseContent(content);

  return (
    <article className="max-w-[720px] mx-auto">
      {category && (
        <span className="inline-block bg-secondary/8 text-secondary text-xs font-medium px-3 py-1 rounded-full mb-5">
          {category}
        </span>
      )}

      <h1 className="serif text-4xl md:text-5xl font-bold leading-tight tracking-tight mb-4">
        {title.trim() || <span className="text-foreground/25">Untitled story</span>}
      </h1>

      {description.trim() && (
        <p className="text-xl text-secondary font-light leading-relaxed mb-8">
          {description}
        </p>
      )}

      <div className="flex items-center gap-3 py-5 border-y border-border mb-8">
        <div className="w-10 h-10 rounded-full bg-accent/15 flex items-center justify-center text-sm font-bold text-accent">
          {author.trim()[0]?.toUpperCase() ?? "?"}
        </div>
        <div className="leading-tight">
          <p className="text-sm font-medium">{author}</p>
          <p className="text-xs text-secondary">{date} · {readingTime}</p>
        </div>
      </div>

      {coverImage && (
        <div className="rounded-2xl overflow-hidden aspect-video relative bg-secondary/5 border border-border/40 mb-10">
          <SmartImage
            src={coverImage}
            alt={title}
            loading="eager"
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {blocks.length === 0 ? (
        <p className="py-16 text-center text-secondary/60 text-sm">
          Nothing to preview yet — write something first.
        </p>
      ) : (
        <div className="space-y-4">
          {blocks.map((block, i) => {
            if (block.type === "h2")
              return (
                <h2
                  key={i}
                  id={block.id}
                  className="serif text-2xl font-bold mt-10 mb-2 tracking-tight text-foreground"
                  dangerouslySetInnerHTML={{ __html: renderInline(block.text) }}
                />
              );
            if (block.type === "h3")
              return (
                <h3
                  key={i}
                  id={block.id}
                  className="serif text-xl font-semibold mt-8 mb-2 tracking-tight text-foreground"
                  dangerouslySetInnerHTML={{ __html: renderInline(block.text) }}
                />
              );
            if (block.type === "image")
              return (
                <SmartImage
                  key={i}
                  src={block.src}
                  alt={block.alt ?? ""}
                  className="w-full h-auto rounded-xl"
                  wrapperClassName="w-full rounded-xl my-4"
                  placeholderClassName="min-h-[220px]"
                />
              );
            if (block.type === "table")
              return (
                <div
                  key={i}
                  className="text-foreground"
                  dangerouslySetInnerHTML={{ __html: renderTable(block.text) }}
                />
              );
            return (
              <p
                key={i}
                className="text-lg leading-[1.7] font-light text-foreground"
                dangerouslySetInnerHTML={{ __html: renderInline(block.text) }}
              />
            );
          })}
        </div>
      )}
    </article>
  );
}
