import React, { useRef, useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';
import { Table, TableRow, TableCell, TableHeader } from '@tiptap/extension-table';
import {
  Bold,
  Italic,
  Strikethrough,
  List,
  ListOrdered,
  Heading2,
  Heading3,
  Quote,
  Undo,
  Redo,
  Link as LinkIcon,
  ImageIcon,
  Code,
  Table as TableIcon,
  Trash2,
  Plus,
  Rows,
  Columns,
  Upload,
} from 'lucide-react';

import { compressAndConvertToBase64 } from '../../utils/imageUtils';

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
  onImageUpload?: (file: File) => Promise<string>;
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  content,
  onChange,
  placeholder = 'এখানে আপনার ব্লগের বিস্তারিত লেখা লিখুন...',
  onImageUpload,
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder,
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-primary-600 underline font-medium',
        },
      }),
      Image.configure({
        allowBase64: true,
        inline: false,
        HTMLAttributes: {
          class: 'block max-w-full max-h-[400px] h-auto object-cover my-4 mx-auto rounded-xl border border-gray-200',
        },
      }),
      Table.configure({
        resizable: true,
        HTMLAttributes: {
          class: 'border-collapse table-auto w-full my-4 border border-gray-200 rounded-lg overflow-hidden',
        },
      }),
      TableRow,
      TableHeader.configure({
        HTMLAttributes: {
          class: 'border border-gray-200 bg-gray-100 p-2 font-bold text-left text-xs text-gray-700',
        },
      }),
      TableCell.configure({
        HTMLAttributes: {
          class: 'border border-gray-200 p-2 text-xs text-gray-600',
        },
      }),
    ],
    content,
    editorProps: {
      attributes: {
        // হেডিং (h2, h3) স্টাইল দেওয়ার জন্য TailWind Arbitrary Selectors যুক্ত করা হয়েছে
        class:
          'prose max-w-none p-4 min-h-[220px] focus:outline-none text-gray-800 text-sm leading-relaxed [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-gray-900 [&_h2]:my-3 [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:text-gray-800 [&_h3]:my-2 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_blockquote]:border-l-4 [&_blockquote]:border-primary-500 [&_blockquote]:pl-4 [&_blockquote]:italic [&_pre]:bg-gray-900 [&_pre]:text-white [&_pre]:p-3 [&_pre]:rounded-xl [&_p.is-editor-empty:first-child::before]:text-gray-400 [&_p.is-editor-empty:first-child::before]:content-[attr(data-placeholder)] [&_p.is-editor-empty:first-child::before]:float-left [&_p.is-editor-empty:first-child::before]:pointer-events-none',
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content, { emitUpdate: false });
    }
  }, [content, editor]);

  if (!editor) {
    return null;
  }

  const setLink = () => {
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('ইউআরএল (URL) লিখুন:', previousUrl);

    if (url === null) return;
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      let imageUrl = '';

      // ১. যদি parent component থেকে API-ভিত্তিক onImageUpload ফাংশন দেওয়া থাকে
      if (onImageUpload) {
        imageUrl = await onImageUpload(file);
      } 
      // ২. অন্যথায় Local compression helper ব্যবহার করবে
      else if (compressAndConvertToBase64) {
        imageUrl = await compressAndConvertToBase64(file);
      } 
      // ৩. দুটিই না থাকলে Native FileReader ব্যবহার করবে
      else {
        imageUrl = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
      }

      if (imageUrl && editor) {
        editor.chain().focus().setImage({ src: imageUrl }).run();
      }
    } catch (error) {
      console.error('Image upload/conversion failed:', error);
      
      // কম্প্রেশন ইউটিলিটিতে সমস্যা হলে ডাইরেক্ট FileReader এ ফলব্যাক
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result && editor) {
          editor.chain().focus().setImage({ src: reader.result as string }).run();
        }
      };
      reader.readAsDataURL(file);
    } finally {
      e.target.value = '';
    }
  };

  const addImageByUrl = () => {
    const url = window.prompt('ছবির ইউআরএল (Image URL) লিখুন:');
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  const insertTable = () => {
    editor.chain().focus().insertTable({ rows: 2, cols: 2, withHeaderRow: true }).run();
  };

  return (
    <div className="border border-gray-200 rounded-2xl overflow-hidden bg-white shadow-xs focus-within:border-primary-500 transition-colors">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />

      <div className="flex flex-wrap items-center gap-1 p-2 bg-gray-50 border-b border-gray-200">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-2 rounded-lg text-gray-600 hover:bg-gray-200/70 transition-colors cursor-pointer ${
            editor.isActive('bold') ? 'bg-gray-200 text-primary-600 font-bold' : ''
          }`}
          title="Bold"
        >
          <Bold className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-2 rounded-lg text-gray-600 hover:bg-gray-200/70 transition-colors cursor-pointer ${
            editor.isActive('italic') ? 'bg-gray-200 text-primary-600' : ''
          }`}
          title="Italic"
        >
          <Italic className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={`p-2 rounded-lg text-gray-600 hover:bg-gray-200/70 transition-colors cursor-pointer ${
            editor.isActive('strike') ? 'bg-gray-200 text-primary-600' : ''
          }`}
          title="Strikethrough"
        >
          <Strikethrough className="w-4 h-4" />
        </button>

        <div className="w-[1px] h-5 bg-gray-300 mx-1" />

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`p-2 rounded-lg text-gray-600 hover:bg-gray-200/70 transition-colors cursor-pointer ${
            editor.isActive('heading', { level: 2 }) ? 'bg-gray-200 text-primary-600 font-bold' : ''
          }`}
          title="Heading 2"
        >
          <Heading2 className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={`p-2 rounded-lg text-gray-600 hover:bg-gray-200/70 transition-colors cursor-pointer ${
            editor.isActive('heading', { level: 3 }) ? 'bg-gray-200 text-primary-600 font-bold' : ''
          }`}
          title="Heading 3"
        >
          <Heading3 className="w-4 h-4" />
        </button>

        <div className="w-[1px] h-5 bg-gray-300 mx-1" />

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-2 rounded-lg text-gray-600 hover:bg-gray-200/70 transition-colors cursor-pointer ${
            editor.isActive('bulletList') ? 'bg-gray-200 text-primary-600' : ''
          }`}
          title="Bullet List"
        >
          <List className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-2 rounded-lg text-gray-600 hover:bg-gray-200/70 transition-colors cursor-pointer ${
            editor.isActive('orderedList') ? 'bg-gray-200 text-primary-600' : ''
          }`}
          title="Ordered List"
        >
          <ListOrdered className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`p-2 rounded-lg text-gray-600 hover:bg-gray-200/70 transition-colors cursor-pointer ${
            editor.isActive('blockquote') ? 'bg-gray-200 text-primary-600' : ''
          }`}
          title="Quote"
        >
          <Quote className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={`p-2 rounded-lg text-gray-600 hover:bg-gray-200/70 transition-colors cursor-pointer ${
            editor.isActive('codeBlock') ? 'bg-gray-200 text-primary-600' : ''
          }`}
          title="Code Block"
        >
          <Code className="w-4 h-4" />
        </button>

        <div className="w-[1px] h-5 bg-gray-300 mx-1" />

        {!editor.isActive('table') ? (
          <button
            type="button"
            onClick={insertTable}
            className="p-2 rounded-lg text-gray-600 hover:bg-gray-200/70 transition-colors cursor-pointer"
            title="Insert Table"
          >
            <TableIcon className="w-4 h-4" />
          </button>
        ) : (
          <div className="flex items-center gap-1 bg-gray-200/60 p-0.5 rounded-lg">
            <button
              type="button"
              onClick={() => editor.chain().focus().addRowAfter().run()}
              className="p-1 text-xs text-gray-700 hover:bg-white rounded cursor-pointer flex items-center gap-1"
              title="Add Row Below"
            >
              <Rows className="w-3.5 h-3.5" />
              <Plus className="w-3 h-3" />
            </button>

            <button
              type="button"
              onClick={() => editor.chain().focus().addColumnAfter().run()}
              className="p-1 text-xs text-gray-700 hover:bg-white rounded cursor-pointer flex items-center gap-1"
              title="Add Column Right"
            >
              <Columns className="w-3.5 h-3.5" />
              <Plus className="w-3 h-3" />
            </button>

            <button
              type="button"
              onClick={() => editor.chain().focus().deleteRow().run()}
              className="p-1 text-xs text-red-600 hover:bg-white rounded cursor-pointer"
              title="Delete Row"
            >
              Row-
            </button>

            <button
              type="button"
              onClick={() => editor.chain().focus().deleteColumn().run()}
              className="p-1 text-xs text-red-600 hover:bg-white rounded cursor-pointer"
              title="Delete Column"
            >
              Col-
            </button>

            <button
              type="button"
              onClick={() => editor.chain().focus().deleteTable().run()}
              className="p-1 text-red-600 hover:bg-white rounded cursor-pointer"
              title="Delete Table"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        <div className="w-[1px] h-5 bg-gray-300 mx-1" />

        <button
          type="button"
          onClick={setLink}
          className={`p-2 rounded-lg text-gray-600 hover:bg-gray-200/70 transition-colors cursor-pointer ${
            editor.isActive('link') ? 'bg-gray-200 text-primary-600' : ''
          }`}
          title="Add Link"
        >
          <LinkIcon className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="p-2 rounded-lg text-gray-600 hover:bg-gray-200/70 transition-colors cursor-pointer"
          title="Upload Image File"
        >
          <Upload className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={addImageByUrl}
          className="p-2 rounded-lg text-gray-600 hover:bg-gray-200/70 transition-colors cursor-pointer"
          title="Add Image URL"
        >
          <ImageIcon className="w-4 h-4" />
        </button>

        <div className="w-[1px] h-5 bg-gray-300 mx-1" />

        <button
          type="button"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          className="p-2 rounded-lg text-gray-600 hover:bg-gray-200/70 disabled:opacity-30 transition-colors cursor-pointer"
          title="Undo"
        >
          <Undo className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          className="p-2 rounded-lg text-gray-600 hover:bg-gray-200/70 disabled:opacity-30 transition-colors cursor-pointer"
          title="Redo"
        >
          <Redo className="w-4 h-4" />
        </button>
      </div>

      <EditorContent editor={editor} />
    </div>
  );
};