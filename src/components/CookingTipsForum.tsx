import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useStore } from '@nanostores/react';
import { userStore } from '../stores/userStore';

interface Tip {
  id: string;
  userId: string;
  userName: string;
  content: string;
  likes: number;
  createdAt: string;
  comments: Comment[];
}

interface Comment {
  id: string;
  userId: string;
  userName: string;
  content: string;
  createdAt: string;
}

export default function CookingTipsForum() {
  const user = useStore(userStore);
  const [tips, setTips] = useState<Tip[]>([]);
  const [newTip, setNewTip] = useState('');
  const [selectedTip, setSelectedTip] = useState<Tip | null>(null);
  const [newComment, setNewComment] = useState('');

  const handleSubmitTip = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newTip.trim()) return;

    const tip: Tip = {
      id: Date.now().toString(),
      userId: user.id,
      userName: user.name,
      content: newTip.trim(),
      likes: 0,
      createdAt: new Date().toISOString(),
      comments: [],
    };

    setTips([tip, ...tips]);
    setNewTip('');
  };

  const handleLike = (tipId: string) => {
    setTips(
      tips.map((tip) =>
        tip.id === tipId ? { ...tip, likes: tip.likes + 1 } : tip
      )
    );
  };

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !selectedTip || !newComment.trim()) return;

    const comment: Comment = {
      id: Date.now().toString(),
      userId: user.id,
      userName: user.name,
      content: newComment.trim(),
      createdAt: new Date().toISOString(),
    };

    setTips(
      tips.map((tip) =>
        tip.id === selectedTip.id
          ? { ...tip, comments: [...tip.comments, comment] }
          : tip
      )
    );
    setNewComment('');
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">
          Cooking Tips Forum
        </h1>

        {user ? (
          <form onSubmit={handleSubmitTip} className="mb-8">
            <div className="flex gap-4">
              <textarea
                value={newTip}
                onChange={(e) => setNewTip(e.target.value)}
                placeholder="Share your cooking tip..."
                className="flex-1 p-3 rounded-lg border dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                rows={3}
              />
              <button
                type="submit"
                className="px-6 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors duration-200"
              >
                Share
              </button>
            </div>
          </form>
        ) : (
          <div className="mb-8 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg text-center">
            Please sign in to share your cooking tips
          </div>
        )}

        <div className="space-y-6">
          {tips.map((tip) => (
            <motion.div
              key={tip.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    {tip.userName}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {new Date(tip.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <button
                  onClick={() => handleLike(tip.id)}
                  className="flex items-center gap-2 text-gray-500 hover:text-amber-600 transition-colors duration-200"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                  <span>{tip.likes}</span>
                </button>
              </div>

              <p className="text-gray-700 dark:text-gray-300 mb-4">
                {tip.content}
              </p>

              <div className="border-t dark:border-gray-700 pt-4 mt-4">
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                  Comments ({tip.comments.length})
                </h4>
                <div className="space-y-3">
                  {tip.comments.map((comment) => (
                    <div
                      key={comment.id}
                      className="bg-gray-50 dark:bg-gray-700 rounded p-3"
                    >
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium text-gray-900 dark:text-white">
                          {comment.userName}
                        </span>
                        <span className="text-sm text-gray-500">
                          {new Date(comment.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-gray-700 dark:text-gray-300">
                        {comment.content}
                      </p>
                    </div>
                  ))}
                </div>

                {user && (
                  <form onSubmit={handleSubmitComment} className="mt-4">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Add a comment..."
                        className="flex-1 p-2 rounded border dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                      />
                      <button
                        type="submit"
                        className="px-4 py-2 bg-amber-600 text-white rounded hover:bg-amber-700 transition-colors duration-200"
                      >
                        Post
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
