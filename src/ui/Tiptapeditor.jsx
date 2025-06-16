import React, { useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import BulletList from "@tiptap/extension-bullet-list";
import OrderedList from "@tiptap/extension-ordered-list";
import ListItem from "@tiptap/extension-list-item";
import { Plugin, PluginKey } from "prosemirror-state";

// Configure StarterKit without lists, as we'll add them explicitly
const CustomStarterKit = StarterKit.configure({
  bulletList: false,
  orderedList: false,
  listItem: false,
});

// Updated space handler plugin
const spaceHandlerPlugin = new Plugin({
  key: new PluginKey("spaceHandler"),
  props: {
    handleKeyDown(view, event) {
      if (event.key === " ") {
        const { state, dispatch } = view;
        const { selection } = state;
        const { $from } = selection;

        // Check if the cursor is inside a text node with a character before it
        if ($from.parent.isText && $from.parentOffset > 0) {
          const text = $from.parent.text;
          const charBefore = text[$from.parentOffset - 1];
          if (charBefore === " ") {
            // Insert a non-breaking space
            dispatch(state.tr.insertText("\u00A0", $from.pos));
            return true;
          } else {
            // Insert a regular space
            dispatch(state.tr.insertText(" ", $from.pos));
            return true;
          }
        } else {
          // Insert a regular space for non-text nodes or start of text
          dispatch(state.tr.insertText(" ", $from.pos));
          return true;
        }
      }
      return false;
    },
  },
});

const TiptapEditor = ({ content, setContent }) => {
  const editor = useEditor({
    extensions: [
      CustomStarterKit,
      Underline,
      Link,
      BulletList.configure({
        keepMarks: true,
        keepAttributes: false,
      }),
      OrderedList.configure({
        keepMarks: true,
        keepAttributes: false,
      }),
      ListItem,
    ],
    content,
    editorProps: {
      plugins: [spaceHandlerPlugin],
    },
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      setContent(html);
    },
  });

  useEffect(() => {
    if (editor && content) {
      editor.commands.setContent(content, false);
    }
  }, [content, editor]);

  if (!editor) return null;

  // Helper button component with Tailwind classes
  const MenuButton = ({ onClick, isActive, children, title }) => (
    <button
      onClick={onClick}
      type="button"
      title={title}
      className={`px-2 py-1 mr-1 text-sm border border-gray-300 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 ${
        isActive
          ? "bg-orange-500 text-white font-medium"
          : "bg-white text-gray-700 hover:bg-gray-50"
      }`}
    >
      {children}
    </button>
  );

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden">
      <div className="bg-gray-50 border-b border-gray-300 p-2">
        <div className="flex flex-wrap gap-1">
          <MenuButton
            onClick={() => editor.chain().focus().toggleBold().run()}
            isActive={editor.isActive("bold")}
            title="Bold (Ctrl+B)"
          >
            <b>B</b>
          </MenuButton>

          <MenuButton
            onClick={() => editor.chain().focus().toggleItalic().run()}
            isActive={editor.isActive("italic")}
            title="Italic (Ctrl+I)"
          >
            <i>I</i>
          </MenuButton>

          <MenuButton
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            isActive={editor.isActive("underline")}
            title="Underline (Ctrl+U)"
          >
            <u>U</u>
          </MenuButton>

          <MenuButton
            onClick={() => editor.chain().focus().toggleStrike().run()}
            isActive={editor.isActive("strike")}
            title="Strike"
          >
            <s>S</s>
          </MenuButton>

          <MenuButton
            onClick={() => editor.chain().focus().toggleCode().run()}
            isActive={editor.isActive("code")}
            title="Code"
          >
            {"</>"}
          </MenuButton>

          <MenuButton
            onClick={() => {
              editor.chain().focus().toggleBulletList().run();
            }}
            isActive={editor.isActive("bulletList")}
            title="Bullet List"
          >
            • List
          </MenuButton>

          <MenuButton
            onClick={() => {
              editor.chain().focus().toggleOrderedList().run();
            }}
            isActive={editor.isActive("orderedList")}
            title="Ordered List"
          >
            1. List
          </MenuButton>

          <MenuButton
            onClick={() => editor.chain().focus().setParagraph().run()}
            isActive={editor.isActive("paragraph")}
            title="Paragraph"
          >
            ¶
          </MenuButton>

          {[1, 2, 3, 4, 5, 6].map((level) => (
            <MenuButton
              key={level}
              onClick={() =>
                editor.chain().focus().toggleHeading({ level }).run()
              }
              isActive={editor.isActive("heading", { level })}
              title={`Heading ${level}`}
            >
              H{level}
            </MenuButton>
          ))}

          <MenuButton
            onClick={() => {
              const url = prompt("Enter URL");
              if (url)
                editor
                  .chain()
                  .focus()
                  .extendMarkRange("link")
                  .setLink({ href: url })
                  .run();
            }}
            isActive={editor.isActive("link")}
            title="Add Link"
          >
            🔗
          </MenuButton>

          <MenuButton
            onClick={() => editor.chain().focus().unsetLink().run()}
            title="Remove Link"
          >
            ❌
          </MenuButton>

          <MenuButton
            onClick={() => editor.chain().focus().undo().run()}
            title="Undo"
            disabled={!editor.can().undo()}
          >
            ↺
          </MenuButton>

          <MenuButton
            onClick={() => editor.chain().focus().redo().run()}
            title="Redo"
            disabled={!editor.can().redo()}
          >
            ↻
          </MenuButton>
        </div>
      </div>

      <div className="p-3">
        <div className="min-h-[120px] max-h-[300px] overflow-y-auto">
          <EditorContent
            editor={editor}
            className="prose prose-sm max-w-none focus:outline-none"
          />
        </div>
      </div>

      <style jsx>{`
        .ProseMirror {
          min-height: 120px;
          font-family: system-ui, -apple-system, sans-serif;
          font-size: 14px;
          line-height: 1.5;
          outline: none;
          padding: 0;
        }
        .ProseMirror p {
          margin: 0 0 1em 0;
          white-space: pre-wrap; /* Preserve multiple spaces and non-breaking spaces */
        }
        .ProseMirror:focus {
          outline: none;
        }
        .ProseMirror ul,
        .ProseMirror ol {
          padding-left: 1.5rem;
        }
        .ProseMirror h1 {
          font-size: 1.5rem;
          font-weight: bold;
          margin: 0.5rem 0;
        }
        .ProseMirror h2 {
          font-size: 1.25rem;
          font-weight: bold;
          margin: 0.5rem 0;
        }
        .ProseMirror h3 {
          font-size: 1.125rem;
          font-weight: bold;
          margin: 0.5rem 0;
        }
        .ProseMirror h4,
        .ProseMirror h5,
        .ProseMirror h6 {
          font-weight: bold;
          margin: 0.5rem 0;
        }
        .ProseMirror code {
          background-color: #f3f4f6;
          padding: 0.125rem 0.25rem;
          border-radius: 0.25rem;
          font-family: ui-monospace, monospace;
        }
        .ProseMirror a {
          color: #f97316;
          text-decoration: underline;
        }
        .ProseMirror strong {
          font-weight: bold;
        }
        .ProseMirror em {
          font-style: italic;
        }
      `}</style>
    </div>
  );
};

export default TiptapEditor;
