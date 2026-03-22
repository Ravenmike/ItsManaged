"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";

interface TipTapEditorProps {
  content: string;
  onChange: (html: string) => void;
}

export function TipTapEditor({ content, onChange }: TipTapEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({ openOnClick: false }),
      Image,
      Placeholder.configure({ placeholder: "Start writing your article..." }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          "prose prose-sm max-w-none min-h-[300px] rounded-b-md border border-t-0 border-gray-300 px-4 py-3 focus:outline-none",
      },
    },
  });

  if (!editor) return null;

  return (
    <div>
      <div className="flex flex-wrap gap-1 rounded-t-md border border-gray-300 bg-gray-50 px-2 py-1.5">
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          active={editor.isActive("bold")}
          label="B"
          className="font-bold"
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          active={editor.isActive("italic")}
          label="I"
          className="italic"
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleStrike().run()}
          active={editor.isActive("strike")}
          label="S"
          className="line-through"
        />
        <div className="mx-1 w-px bg-gray-300" />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          active={editor.isActive("heading", { level: 2 })}
          label="H2"
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          active={editor.isActive("heading", { level: 3 })}
          label="H3"
        />
        <div className="mx-1 w-px bg-gray-300" />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          active={editor.isActive("bulletList")}
          label="List"
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          active={editor.isActive("orderedList")}
          label="1."
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          active={editor.isActive("codeBlock")}
          label="Code"
        />
        <div className="mx-1 w-px bg-gray-300" />
        <ToolbarButton
          onClick={() => {
            const url = window.prompt("Link URL:");
            if (url) editor.chain().focus().setLink({ href: url }).run();
          }}
          active={editor.isActive("link")}
          label="Link"
        />
        <ToolbarButton
          onClick={() => {
            const url = window.prompt("Image URL:");
            if (url) editor.chain().focus().setImage({ src: url }).run();
          }}
          active={false}
          label="Image"
        />
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}

function ToolbarButton({
  onClick,
  active,
  label,
  className = "",
}: {
  onClick: () => void;
  active: boolean;
  label: string;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded px-2 py-1 text-xs transition-colors ${className} ${
        active
          ? "bg-blue-100 text-blue-700"
          : "text-gray-600 hover:bg-gray-200"
      }`}
    >
      {label}
    </button>
  );
}
