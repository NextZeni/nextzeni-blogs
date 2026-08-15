"use client";

import { useRef, useState } from "react";
import { X } from "lucide-react";

import { MAX_TAGS, normalizeTags, splitTagInput } from "@/lib/seo";

interface TagInputProps {
  value: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
  max?: number;
  /** Ties the field to its label in the surrounding form. */
  id?: string;
}

/**
 * Chip-style tag entry. Enter, Tab or a comma commits the current word;
 * Backspace on an empty field removes the last chip.
 */
export default function TagInput({
  value,
  onChange,
  placeholder = "Add a tag…",
  max = MAX_TAGS,
  id,
}: TagInputProps) {
  const [draft, setDraft] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const full = value.length >= max;

  function commit(raw: string) {
    const next = normalizeTags([...value, ...splitTagInput(raw)], max);
    if (next.length !== value.length) onChange(next);
    setDraft("");
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" || e.key === "," || e.key === "Tab") {
      if (!draft.trim()) return; // let Tab move focus when there's nothing to commit
      e.preventDefault();
      commit(draft);
    } else if (e.key === "Backspace" && !draft && value.length > 0) {
      onChange(value.slice(0, -1));
    }
  }

  return (
    <div
      onClick={() => inputRef.current?.focus()}
      className="flex flex-wrap items-center gap-2 rounded-xl border border-border px-3 py-2.5 cursor-text focus-within:border-secondary/40 transition-colors"
    >
      {value.map((tag) => (
        <span
          key={tag}
          className="inline-flex items-center gap-1.5 bg-secondary/8 text-foreground text-xs rounded-full pl-3 pr-2 py-1"
        >
          {tag}
          <button
            type="button"
            aria-label={`Remove ${tag}`}
            onClick={(e) => {
              e.stopPropagation();
              onChange(value.filter((t) => t !== tag));
            }}
            className="text-secondary hover:text-foreground transition-colors"
          >
            <X size={12} />
          </button>
        </span>
      ))}
      <input
        id={id}
        ref={inputRef}
        value={draft}
        disabled={full}
        onChange={(e) => {
          // A pasted "a, b, c" commits every complete tag and keeps the tail.
          if (e.target.value.includes(",")) {
            const parts = e.target.value.split(",");
            const tail = parts.pop() ?? "";
            commit(parts.join(","));
            setDraft(tail.trim());
          } else {
            setDraft(e.target.value);
          }
        }}
        onKeyDown={handleKeyDown}
        onBlur={() => draft.trim() && commit(draft)}
        placeholder={full ? `Limit of ${max} reached` : placeholder}
        className="flex-1 min-w-[120px] bg-transparent text-sm outline-none placeholder:text-secondary/40 disabled:cursor-not-allowed"
      />
    </div>
  );
}
