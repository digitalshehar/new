import React, { useState } from 'react';
import { userStore } from '../stores/userStore';
import type { Review } from '../data/recipes';

interface RecipeCommentsProps {
  recipeSlug: string;
}

export default function RecipeComments({ recipeSlug }: RecipeCommentsProps) {
  const [comments, setComments] = useState<Review[]>([]);
  const [newComment, setNewComment] = useState('');
  const { profile } = userStore;

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile || !newComment.trim()) return;

    const comment: Review = {
      userId: profile.id,
      comment: newComment.trim(),
      rating: 0, // Rating is handled separately
      date: new Date().toISOString()
    };

    // TODO: Add API call to save comment
    setComments(prev => [...prev, comment]);
    setNewComment('');
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Comments</h2>
      
      {profile ? (
        <form onSubmit={handleSubmitComment} className="space-y-4">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Share your thoughts about this recipe..."
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
            rows={3}
          />
          <button
            type="submit"
            disabled={!newComment.trim()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            Post Comment
          </button>
        </form>
      ) : (
        <p className="text-gray-600 dark:text-gray-400">
          Please <a href="/login" className="text-blue-600 dark:text-blue-400">login</a> to leave a comment.
        </p>
      )}

      <div className="space-y-4">
        {comments.map((comment, index) => (
          <div key={index} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-900 dark:text-white">{comment.comment}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {new Date(comment.date).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        ))}
        {comments.length === 0 && (
          <p className="text-gray-600 dark:text-gray-400">No comments yet. Be the first to share your thoughts!</p>
        )}
      </div>
    </div>
  );
}
