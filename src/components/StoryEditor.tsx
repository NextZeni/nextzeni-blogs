"use client";

import { useEffect, useRef, useState } from "react";
import { useEditor, EditorContent, type Editor } from "@tiptap/react";
import { BubbleMenu } from "@tiptap/react/menus";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Image from "@tiptap/extension-image";
import { Heading2, Heading3, Bold, Italic, Quote, Code, Link as LinkIcon, Loader2 } from "lucide-react";

import { markdownToDoc, serializeToMarkdown, type TiptapDoc } from "@/data/dummy";
import { uploadImage } from "@/lib/uploadImage";

interface StoryEditorProps {
  /** Initial content as markdown (the format the reader stores). */
  value?: string;
  /** Emits markdown on every change. */
  onChange: (markdown: string) => void;
}

export default function StoryEditor({ value, onChange }: StoryEditorProps) {
  // Handlers are created once at editor init, so they read the live editor
  // through a ref rather than closing over a stale instance.
  const editorRef = useRef<Editor | null>(null);
  const [uploading, setUploading] = useState(false);

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
        bulletList: false,
        orderedList: false,
        listItem: false,
        listKeymap: false,
        strike: false,
        horizontalRule: false,
        underline: false,
        link: {
          openOnClick: false,
          autolink: true,
          HTMLAttributes: { rel: "noopener noreferrer nofollow", target: "_blank", class: "story-link" },
        },
      }),
      Placeholder.configure({ placeholder: "Write your story here…" }),
      Image.configure({ inline: false, allowBase64: false, HTMLAttributes: { class: "story-image" } }),
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

  if (!editor) return null;

  const btn = (active: boolean) =>
    `w-9 h-9 flex items-center justify-center rounded-lg transition-colors ${
      active ? "bg-accent/15 text-accent" : "text-white/80 hover:bg-white/10 hover:text-white"
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

  return (
    <div className="relative">
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
        <div className="absolute top-0 right-0 flex items-center gap-1.5 text-xs text-secondary bg-white/90 rounded-full px-3 py-1 shadow-sm">
          <Loader2 size={13} className="animate-spin" /> Uploading image…
        </div>
      )}
    </div>
  );
}
