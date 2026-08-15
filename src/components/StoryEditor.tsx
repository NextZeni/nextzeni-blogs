"use client";

import { useEffect, useRef, useState } from "react";
import { useEditor, EditorContent, type Editor } from "@tiptap/react";
import { BubbleMenu } from "@tiptap/react/menus";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Image from "@tiptap/extension-image";
import Highlight from "@tiptap/extension-highlight";
import { TableKit } from "@tiptap/extension-table";
import {
  Heading2, Heading3, Bold, Italic, Underline as UnderlineIcon, Quote, Code,
  Link as LinkIcon, Loader2, List, ListOrdered, Table as TableIcon, ImagePlus,
  Highlighter, Type, ChevronDown, Trash2, Plus, Captions, Baseline,
} from "lucide-react";

import { Skeleton, SkeletonText } from "@/components/Skeleton";
import { ZeniTextStyle } from "@/components/editor/ZeniTextStyle";
import { ZeniTextColor } from "@/components/editor/ZeniTextColor";
import {
  markdownToDoc, serializeToMarkdown, HIGHLIGHT_COLORS, TEXT_STYLES, TEXT_COLORS,
  type TiptapDoc, type HighlightColor, type TextStyleName, type TextColorName,
} from "@/data/dummy";
import { uploadImage } from "@/lib/uploadImage";

interface StoryEditorProps {
  /** Initial content as markdown (the format the reader stores). */
  value?: string;
  /** Emits markdown on every change. */
  onChange: (markdown: string) => void;
}

// Swatch colours for the highlight menu, keyed to the palette in dummy.ts.
const SWATCHES: Record<HighlightColor, string> = {
  yellow: "#fef08a",
  green: "#bbf7d0",
  blue: "#bae6fd",
  pink: "#fbcfe8",
};

const STYLE_LABELS: Record<TextStyleName, string> = {
  lede: "Lede / intro",
  serif: "Serif emphasis",
  small: "Small / caption",
};

// Swatch colours for the text-colour menu, keyed to TEXT_COLORS in dummy.ts.
const INK: Record<TextColorName, string> = {
  red: "#dc2626",
  orange: "#ea580c",
  green: "#15803d",
  blue: "#1d4ed8",
  purple: "#7e22ce",
  gray: "#6b6b6b",
};

export default function StoryEditor({ value, onChange }: StoryEditorProps) {
  // Handlers are created once at editor init, so they read the live editor
  // through a ref rather than closing over a stale instance.
  const editorRef = useRef<Editor | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [uploading, setUploading] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [openMenu, setOpenMenu] = useState<"highlight" | "style" | "color" | null>(null);

  async function insertImageFiles(files: File[], at?: number) {
    const images = files.filter((f) => f.type.startsWith("image/"));
    if (images.length === 0) return false;
    setUploading(true);
    try {
      for (const file of images) {
        const url = await uploadImage(file);
        const chain = editorRef.current?.chain().focus();
        if (at != null) chain?.setTextSelection(at);
        chain?.setImage({ src: url, alt: file.name.replace(/\.[^.]+$/, "") }).run();
      }
    } catch (err) {
      console.error("Image upload failed:", err);
    } finally {
      setUploading(false);
    }
    return true;
  }

  const editor = useEditor({
    immediatelyRender: false, // avoid SSR hydration mismatch in Next.js
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
        // Restrict to what the reader supports; re-enable Link.
        strike: false,
        horizontalRule: false,
        link: {
          openOnClick: false,
          autolink: true,
          HTMLAttributes: { rel: "noopener noreferrer nofollow", target: "_blank", class: "story-link" },
        },
      }),
      Placeholder.configure({ placeholder: "Write your story here…" }),
      Image.configure({ inline: false, allowBase64: false, HTMLAttributes: { class: "story-image" } }),
      Highlight.configure({ multicolor: true }),
      ZeniTextStyle,
      ZeniTextColor,
      TableKit.configure({ table: { resizable: true } }),
    ],
    editorProps: {
      // Paste an image from anywhere → upload + insert at the caret.
      handlePaste(_view, event) {
        const files = Array.from(event.clipboardData?.files ?? []);
        if (!files.some((f) => f.type.startsWith("image/"))) return false;
        event.preventDefault();
        void insertImageFiles(files);
        return true;
      },
      // Drop an image file → upload + insert where it was dropped.
      handleDrop(view, event) {
        const files = Array.from((event as DragEvent).dataTransfer?.files ?? []);
        if (!files.some((f) => f.type.startsWith("image/"))) return false;
        event.preventDefault();
        const coords = view.posAtCoords({ left: (event as DragEvent).clientX, top: (event as DragEvent).clientY });
        void insertImageFiles(files, coords?.pos);
        return true;
      },
    },
    content: value ? (markdownToDoc(value) as TiptapDoc) : undefined,
    onUpdate: ({ editor }) => onChange(serializeToMarkdown(editor.getJSON() as TiptapDoc)),
  });

  useEffect(() => {
    editorRef.current = editor;
  }, [editor]);

  // Any click outside the toolbar closes an open dropdown.
  useEffect(() => {
    if (!openMenu) return;
    const close = () => setOpenMenu(null);
    window.addEventListener("click", close);
    return () => window.removeEventListener("click", close);
  }, [openMenu]);

  // Tiptap mounts client-side only — shimmer the writing surface until it's up.
  if (!editor) {
    return (
      <div role="status" aria-busy="true" className="min-h-[400px]">
        <span className="sr-only">Loading editor</span>
        <SkeletonText lines={4} lineClassName="h-4" lastLineWidth="w-3/5" className="mb-8" />
        <SkeletonText lines={3} lineClassName="h-4" lastLineWidth="w-2/5" className="mb-8" />
        <SkeletonText lines={2} lineClassName="h-4" lastLineWidth="w-1/2" />
      </div>
    );
  }

  const btn = (active: boolean) =>
    `w-9 h-9 flex items-center justify-center rounded-lg transition-colors ${
      active ? "bg-accent/15 text-accent" : "text-white/80 hover:bg-white/10 hover:text-white"
    }`;

  // Light-background equivalent, for the sticky bar.
  const barBtn = (active: boolean) =>
    `h-9 px-2 flex items-center justify-center gap-1.5 rounded-lg text-sm transition-colors ${
      active ? "bg-accent/12 text-accent" : "text-secondary hover:bg-secondary/8 hover:text-foreground"
    }`;

  const toggleLink = () => {
    if (editor.isActive("link")) {
      editor.chain().focus().unsetLink().run();
      return;
    }
    const prev = editor.getAttributes("link").href as string | undefined;
    const url = window.prompt("Link URL", prev ?? "https://");
    if (url === null) return; // cancelled
    if (url.trim() === "") {
      editor.chain().focus().unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url.trim() }).run();
  };

  // Captions live in the image's `title` attribute and serialize as
  // ![alt](src "caption").
  const editCaption = () => {
    const current = (editor.getAttributes("image").title as string | undefined) ?? "";
    const next = window.prompt("Image caption", current);
    if (next === null) return; // cancelled
    editor.chain().focus().updateAttributes("image", { title: next.trim() }).run();
  };

  const activeStyle = (Object.keys(TEXT_STYLES) as TextStyleName[]).find((name) =>
    editor.isActive("zeniTextStyle", { styleName: name })
  );
  const activeColor = (Object.keys(TEXT_COLORS) as TextColorName[]).find((name) =>
    editor.isActive("zeniTextColor", { colorName: name })
  );

  return (
    <div className="relative">
      {/* Sticky toolbar ------------------------------------------------ */}
      <div className="sticky top-0 z-20 -mx-2 mb-4 bg-white/95 backdrop-blur border-b border-border">
        <div className="flex flex-wrap items-center gap-0.5 px-2 py-1.5">
          <button type="button" title="Heading" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={barBtn(editor.isActive("heading", { level: 2 }))}>
            <Heading2 size={18} />
          </button>
          <button type="button" title="Sub-heading" onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} className={barBtn(editor.isActive("heading", { level: 3 }))}>
            <Heading3 size={18} />
          </button>

          <span className="w-px h-5 bg-border mx-1.5" />

          <button type="button" title="Bold" onClick={() => editor.chain().focus().toggleBold().run()} className={barBtn(editor.isActive("bold"))}>
            <Bold size={18} />
          </button>
          <button type="button" title="Italic" onClick={() => editor.chain().focus().toggleItalic().run()} className={barBtn(editor.isActive("italic"))}>
            <Italic size={18} />
          </button>
          <button type="button" title="Underline" onClick={() => editor.chain().focus().toggleUnderline().run()} className={barBtn(editor.isActive("underline"))}>
            <UnderlineIcon size={18} />
          </button>

          {/* Text colour picker */}
          <div className="relative" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              title="Text colour"
              onClick={() => setOpenMenu(openMenu === "color" ? null : "color")}
              className={barBtn(editor.isActive("zeniTextColor"))}
            >
              <Baseline size={18} style={activeColor ? { color: INK[activeColor] } : undefined} />
              <ChevronDown size={13} />
            </button>
            {openMenu === "color" && (
              <div className="absolute left-0 top-full mt-1 flex items-center gap-1 rounded-xl border border-border bg-white p-1.5 shadow-lg">
                {(Object.keys(TEXT_COLORS) as TextColorName[]).map((name) => (
                  <button
                    key={name}
                    type="button"
                    title={name}
                    onClick={() => {
                      editor.chain().focus().setZeniTextColor(name).run();
                      setOpenMenu(null);
                    }}
                    className="w-7 h-7 flex items-center justify-center rounded-md border border-border/70 text-sm font-bold transition-transform hover:scale-110"
                    style={{ color: INK[name] }}
                  >
                    A
                  </button>
                ))}
                <span className="w-px h-6 bg-border mx-0.5" />
                <button
                  type="button"
                  title="Default colour"
                  onClick={() => {
                    editor.chain().focus().unsetZeniTextColor().run();
                    setOpenMenu(null);
                  }}
                  className="w-7 h-7 flex items-center justify-center rounded-md text-secondary hover:bg-secondary/10"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            )}
          </div>

          {/* Highlight colour picker */}
          <div className="relative" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              title="Highlight"
              onClick={() => setOpenMenu(openMenu === "highlight" ? null : "highlight")}
              className={barBtn(editor.isActive("highlight"))}
            >
              <Highlighter size={18} />
              <ChevronDown size={13} />
            </button>
            {openMenu === "highlight" && (
              <div className="absolute left-0 top-full mt-1 flex items-center gap-1 rounded-xl border border-border bg-white p-1.5 shadow-lg">
                {(Object.keys(HIGHLIGHT_COLORS) as HighlightColor[]).map((color) => (
                  <button
                    key={color}
                    type="button"
                    title={color}
                    onClick={() => {
                      editor.chain().focus().setHighlight({ color }).run();
                      setOpenMenu(null);
                    }}
                    className="w-7 h-7 rounded-md border border-border/70 transition-transform hover:scale-110"
                    style={{ backgroundColor: SWATCHES[color] }}
                  />
                ))}
                <span className="w-px h-6 bg-border mx-0.5" />
                <button
                  type="button"
                  title="Remove highlight"
                  onClick={() => {
                    editor.chain().focus().unsetHighlight().run();
                    setOpenMenu(null);
                  }}
                  className="w-7 h-7 flex items-center justify-center rounded-md text-secondary hover:bg-secondary/10"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            )}
          </div>

          <span className="w-px h-5 bg-border mx-1.5" />

          <button type="button" title="Link" onClick={toggleLink} className={barBtn(editor.isActive("link"))}>
            <LinkIcon size={18} />
          </button>
          <button type="button" title="Quote" onClick={() => editor.chain().focus().toggleBlockquote().run()} className={barBtn(editor.isActive("blockquote"))}>
            <Quote size={18} />
          </button>

          <span className="flex-1" />

          <button
            type="button"
            onClick={() => setShowAdvanced((v) => !v)}
            className={barBtn(showAdvanced)}
            aria-expanded={showAdvanced}
          >
            <Plus size={15} className={showAdvanced ? "rotate-45 transition-transform" : "transition-transform"} />
            <span className="hidden sm:inline">Advanced</span>
          </button>
        </div>

        {/* Advanced row ------------------------------------------------ */}
        {showAdvanced && (
          <div className="flex flex-wrap items-center gap-0.5 border-t border-border/70 bg-surface/60 px-2 py-1.5">
            <button type="button" onClick={() => fileInputRef.current?.click()} className={barBtn(false)}>
              <ImagePlus size={17} /> <span className="text-xs">Image</span>
            </button>
            <button type="button" onClick={editCaption} disabled={!editor.isActive("image")} className={`${barBtn(false)} disabled:opacity-40`}>
              <Captions size={17} /> <span className="text-xs">Caption</span>
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}
              className={barBtn(editor.isActive("table"))}
            >
              <TableIcon size={17} /> <span className="text-xs">Table</span>
            </button>

            <span className="w-px h-5 bg-border mx-1.5" />

            <button type="button" title="Bullet list" onClick={() => editor.chain().focus().toggleBulletList().run()} className={barBtn(editor.isActive("bulletList"))}>
              <List size={17} />
            </button>
            <button type="button" title="Numbered list" onClick={() => editor.chain().focus().toggleOrderedList().run()} className={barBtn(editor.isActive("orderedList"))}>
              <ListOrdered size={17} />
            </button>
            <button type="button" title="Code block" onClick={() => editor.chain().focus().toggleCodeBlock().run()} className={barBtn(editor.isActive("codeBlock"))}>
              <Code size={17} />
            </button>

            <span className="w-px h-5 bg-border mx-1.5" />

            {/* Curated text styles, in place of a raw font picker */}
            <div className="relative" onClick={(e) => e.stopPropagation()}>
              <button
                type="button"
                onClick={() => setOpenMenu(openMenu === "style" ? null : "style")}
                className={barBtn(Boolean(activeStyle))}
              >
                <Type size={17} />
                <span className="text-xs">{activeStyle ? STYLE_LABELS[activeStyle] : "Style"}</span>
                <ChevronDown size={13} />
              </button>
              {openMenu === "style" && (
                <div className="absolute left-0 top-full mt-1 w-48 rounded-xl border border-border bg-white p-1 shadow-lg">
                  <button
                    type="button"
                    onClick={() => { editor.chain().focus().unsetZeniTextStyle().run(); setOpenMenu(null); }}
                    className="w-full rounded-lg px-3 py-2 text-left text-sm text-secondary hover:bg-secondary/8"
                  >
                    Body (default)
                  </button>
                  {(Object.keys(TEXT_STYLES) as TextStyleName[]).map((name) => (
                    <button
                      key={name}
                      type="button"
                      onClick={() => { editor.chain().focus().setZeniTextStyle(name).run(); setOpenMenu(null); }}
                      className={`w-full rounded-lg px-3 py-2 text-left text-sm hover:bg-secondary/8 ${
                        activeStyle === name ? "text-accent" : "text-foreground"
                      }`}
                    >
                      {STYLE_LABELS[name]}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {editor.isActive("table") && (
              <>
                <span className="w-px h-5 bg-border mx-1.5" />
                <button type="button" onClick={() => editor.chain().focus().addColumnAfter().run()} className={barBtn(false)}>
                  <span className="text-xs">+ Col</span>
                </button>
                <button type="button" onClick={() => editor.chain().focus().addRowAfter().run()} className={barBtn(false)}>
                  <span className="text-xs">+ Row</span>
                </button>
                <button type="button" onClick={() => editor.chain().focus().deleteTable().run()} className={`${barBtn(false)} hover:text-red-600`}>
                  <Trash2 size={15} />
                </button>
              </>
            )}
          </div>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        hidden
        onChange={(e) => {
          void insertImageFiles(Array.from(e.target.files ?? []));
          e.target.value = ""; // let the same file be picked again
        }}
      />

      <BubbleMenu
        editor={editor}
        className="flex items-center gap-0.5 rounded-xl bg-foreground text-white px-1.5 py-1 shadow-xl"
      >
        <button type="button" title="Heading" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={btn(editor.isActive("heading", { level: 2 }))}>
          <Heading2 size={18} />
        </button>
        <button type="button" title="Sub-heading" onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} className={btn(editor.isActive("heading", { level: 3 }))}>
          <Heading3 size={18} />
        </button>
        <span className="w-px h-5 bg-white/20 mx-1" />
        <button type="button" title="Bold" onClick={() => editor.chain().focus().toggleBold().run()} className={btn(editor.isActive("bold"))}>
          <Bold size={18} />
        </button>
        <button type="button" title="Italic" onClick={() => editor.chain().focus().toggleItalic().run()} className={btn(editor.isActive("italic"))}>
          <Italic size={18} />
        </button>
        <button type="button" title="Underline" onClick={() => editor.chain().focus().toggleUnderline().run()} className={btn(editor.isActive("underline"))}>
          <UnderlineIcon size={18} />
        </button>
        <button type="button" title="Link" onClick={toggleLink} className={btn(editor.isActive("link"))}>
          <LinkIcon size={18} />
        </button>
        <span className="w-px h-5 bg-white/20 mx-1" />
        <button type="button" title="Quote" onClick={() => editor.chain().focus().toggleBlockquote().run()} className={btn(editor.isActive("blockquote"))}>
          <Quote size={18} />
        </button>
        <button type="button" title="Code block" onClick={() => editor.chain().focus().toggleCodeBlock().run()} className={btn(editor.isActive("codeBlock"))}>
          <Code size={18} />
        </button>
      </BubbleMenu>

      <EditorContent editor={editor} className="prose-zeni" />

      {uploading && (
        <div role="status" aria-busy="true" className="my-4">
          {/* Stands in for the image being uploaded, at roughly its final size */}
          <Skeleton className="w-full h-56 rounded-xl" />
          <p className="mt-2 flex items-center gap-1.5 text-xs text-secondary">
            <Loader2 size={13} className="animate-spin" /> Uploading image…
          </p>
        </div>
      )}
    </div>
  );
}
