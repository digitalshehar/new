import React, { useState, useCallback } from 'react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import { useEditor } from '@tiptap/react';
import { ImageUploader } from './ImageUploader';

interface BlogPost {
  title: string;
  excerpt: string;
  content: string;
  category: string;
  tags: string[];
  status: 'draft' | 'published' | 'archived';
  image?: string;
}

interface BlogPostEditorProps {
  initialPost?: BlogPost;
  onSave: (post: BlogPost) => Promise<void>;
  categories: string[];
}

const defaultPost: BlogPost = {
  title: '',
  excerpt: '',
  content: '',
  category: '',
  tags: [],
  status: 'draft',
};

export function BlogPostEditor({ initialPost = defaultPost, onSave, categories }: BlogPostEditorProps) {
  const [post, setPost] = useState<BlogPost>(initialPost);
  const [saving, setSaving] = useState(false);
  const [newTag, setNewTag] = useState('');

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image,
      Link.configure({
        openOnClick: false,
      }),
    ],
    content: initialPost.content,
    onUpdate: ({ editor }) => {
      setPost(prev => ({
        ...prev,
        content: editor.getHTML(),
      }));
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onSave(post);
    } catch (error) {
      console.error('Failed to save post:', error);
      alert('Failed to save post. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = useCallback((url: string) => {
    setPost(prev => ({
      ...prev,
      image: url,
    }));
  }, []);

  const addTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && newTag.trim()) {
      e.preventDefault();
      if (!post.tags.includes(newTag.trim())) {
        setPost(prev => ({
          ...prev,
          tags: [...prev.tags, newTag.trim()],
        }));
      }
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setPost(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove),
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Title */}
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Title
        </label>
        <input
          type="text"
          id="title"
          value={post.title}
          onChange={e => setPost(prev => ({ ...prev, title: e.target.value }))}
          className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 shadow-sm focus:border-jamie-orange focus:ring-jamie-orange sm:text-sm dark:bg-gray-800 dark:text-white"
          required
        />
      </div>

      {/* Excerpt */}
      <div>
        <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Excerpt
        </label>
        <textarea
          id="excerpt"
          rows={3}
          value={post.excerpt}
          onChange={e => setPost(prev => ({ ...prev, excerpt: e.target.value }))}
          className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 shadow-sm focus:border-jamie-orange focus:ring-jamie-orange sm:text-sm dark:bg-gray-800 dark:text-white"
          required
        />
      </div>

      {/* Featured Image */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Featured Image
        </label>
        <ImageUploader onUpload={handleImageUpload} currentImage={post.image} />
      </div>

      {/* Category */}
      <div>
        <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Category
        </label>
        <select
          id="category"
          value={post.category}
          onChange={e => setPost(prev => ({ ...prev, category: e.target.value }))}
          className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 shadow-sm focus:border-jamie-orange focus:ring-jamie-orange sm:text-sm dark:bg-gray-800 dark:text-white"
          required
        >
          <option value="">Select a category</option>
          {categories.map(category => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      {/* Tags */}
      <div>
        <label htmlFor="tags" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Tags
        </label>
        <div className="mt-1">
          <input
            type="text"
            id="tags"
            value={newTag}
            onChange={e => setNewTag(e.target.value)}
            onKeyDown={addTag}
            placeholder="Press Enter to add tags"
            className="block w-full rounded-md border-gray-300 dark:border-gray-700 shadow-sm focus:border-jamie-orange focus:ring-jamie-orange sm:text-sm dark:bg-gray-800 dark:text-white"
          />
          <div className="mt-2 flex flex-wrap gap-2">
            {post.tags.map(tag => (
              <span
                key={tag}
                className="inline-flex items-center rounded-full bg-jamie-orange/10 px-2.5 py-0.5 text-sm font-medium text-jamie-orange"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="ml-1 inline-flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full hover:bg-jamie-orange/20 focus:bg-jamie-orange/20 focus:outline-none"
                >
                  <span className="sr-only">Remove tag</span>
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Content Editor */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Content
        </label>
        <div className="mt-1 prose prose-sm dark:prose-invert max-w-none">
          <div className="min-h-[500px] w-full rounded-md border border-gray-300 dark:border-gray-700 dark:bg-gray-800">
            {editor && (
              <div className="bg-white dark:bg-gray-800 p-4">
                <div className="border-b border-gray-300 dark:border-gray-700 pb-4 mb-4">
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => editor.chain().focus().toggleBold().run()}
                      className={`p-2 rounded ${
                        editor.isActive('bold')
                          ? 'bg-jamie-orange/10 text-jamie-orange'
                          : 'text-gray-600 dark:text-gray-400'
                      }`}
                    >
                      Bold
                    </button>
                    <button
                      type="button"
                      onClick={() => editor.chain().focus().toggleItalic().run()}
                      className={`p-2 rounded ${
                        editor.isActive('italic')
                          ? 'bg-jamie-orange/10 text-jamie-orange'
                          : 'text-gray-600 dark:text-gray-400'
                      }`}
                    >
                      Italic
                    </button>
                    <button
                      type="button"
                      onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                      className={`p-2 rounded ${
                        editor.isActive('heading', { level: 2 })
                          ? 'bg-jamie-orange/10 text-jamie-orange'
                          : 'text-gray-600 dark:text-gray-400'
                      }`}
                    >
                      H2
                    </button>
                    <button
                      type="button"
                      onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                      className={`p-2 rounded ${
                        editor.isActive('heading', { level: 3 })
                          ? 'bg-jamie-orange/10 text-jamie-orange'
                          : 'text-gray-600 dark:text-gray-400'
                      }`}
                    >
                      H3
                    </button>
                    <button
                      type="button"
                      onClick={() => editor.chain().focus().toggleBulletList().run()}
                      className={`p-2 rounded ${
                        editor.isActive('bulletList')
                          ? 'bg-jamie-orange/10 text-jamie-orange'
                          : 'text-gray-600 dark:text-gray-400'
                      }`}
                    >
                      Bullet List
                    </button>
                    <button
                      type="button"
                      onClick={() => editor.chain().focus().toggleOrderedList().run()}
                      className={`p-2 rounded ${
                        editor.isActive('orderedList')
                          ? 'bg-jamie-orange/10 text-jamie-orange'
                          : 'text-gray-600 dark:text-gray-400'
                      }`}
                    >
                      Numbered List
                    </button>
                  </div>
                </div>
                <EditorContent editor={editor} />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Status */}
      <div>
        <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Status
        </label>
        <select
          id="status"
          value={post.status}
          onChange={e => setPost(prev => ({ ...prev, status: e.target.value as BlogPost['status'] }))}
          className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 shadow-sm focus:border-jamie-orange focus:ring-jamie-orange sm:text-sm dark:bg-gray-800 dark:text-white"
        >
          <option value="draft">Draft</option>
          <option value="published">Published</option>
          <option value="archived">Archived</option>
        </select>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-jamie-orange hover:bg-jamie-orange/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-jamie-orange disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Save Post'}
        </button>
      </div>
    </form>
  );
}

export default BlogPostEditor;
