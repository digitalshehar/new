import React, { useState } from 'react';
import { userStore } from '../stores/userStore';
import type { Collection, Note } from '../types/user';

interface RecipeActionsProps {
  recipeSlug: string;
  title: string;
}

export default function RecipeActions({ recipeSlug, title }: RecipeActionsProps) {
  const store = userStore;
  const [showNoteInput, setShowNoteInput] = useState(false);
  const [noteText, setNoteText] = useState('');
  const [showCollectionModal, setShowCollectionModal] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState('');

  const isFavorite = store.favoriteRecipes?.includes(recipeSlug) || false;
  const existingNote = store.notes?.find(note => note.recipeSlug === recipeSlug);

  const handleFavoriteToggle = () => {
    if (isFavorite) {
      store.removeFavorite(recipeSlug);
    } else {
      store.addFavorite(recipeSlug);
    }
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (noteText.trim()) {
      const newNote: Note = {
        id: `note_${Date.now()}`,
        recipeSlug,
        text: noteText.trim(),
        createdAt: new Date().toISOString()
      };
      store.addNote(newNote);
      setNoteText('');
      setShowNoteInput(false);
    }
  };

  const handleCreateCollection = () => {
    if (newCollectionName.trim()) {
      const newCollection: Collection = {
        id: `col_${Date.now()}`,
        name: newCollectionName.trim(),
        description: '',
        recipes: [recipeSlug],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      store.createCollection(newCollection);
      setShowCollectionModal(false);
      setNewCollectionName('');
    }
  };

  const handleSaveToCollection = (collectionId: string) => {
    store.addRecipeToCollection(collectionId, recipeSlug);
    setShowCollectionModal(false);
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title,
          text: `Check out this recipe for ${title}!`,
          url: window.location.href
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        alert('Link copied to clipboard!');
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4">
        <button
          onClick={handleFavoriteToggle}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
            isFavorite
              ? 'bg-red-500 text-white hover:bg-red-600'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" />
          </svg>
          <span>{isFavorite ? 'Favorited' : 'Favorite'}</span>
        </button>

        <button
          onClick={() => setShowNoteInput(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-gray-200 text-gray-700 hover:bg-gray-300 rounded-lg"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
            />
          </svg>
          <span>{existingNote ? 'Edit Note' : 'Add Note'}</span>
        </button>

        <button
          onClick={() => setShowCollectionModal(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-gray-200 text-gray-700 hover:bg-gray-300 rounded-lg"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 19a2 2 0 01-2-2V7a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1M5 19h14a2 2 0 002-2v-5a2 2 0 00-2-2H9a2 2 0 00-2 2v5a2 2 0 01-2 2z"
            />
          </svg>
          <span>Save to Collection</span>
        </button>

        <button
          onClick={handleShare}
          className="flex items-center space-x-2 px-4 py-2 bg-gray-200 text-gray-700 hover:bg-gray-300 rounded-lg"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
            />
          </svg>
          <span>Share</span>
        </button>
      </div>

      {showNoteInput && (
        <form onSubmit={handleAddNote} className="space-y-2">
          <textarea
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
            placeholder="Add your notes here..."
            className="w-full p-2 border rounded-lg"
            rows={3}
          />
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={() => setShowNoteInput(false)}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Save Note
            </button>
          </div>
        </form>
      )}

      {existingNote && !showNoteInput && (
        <div className="bg-gray-100 p-4 rounded-lg">
          <div className="flex justify-between items-start">
            <p className="text-gray-700">{existingNote.text}</p>
            <button
              onClick={() => store.removeNote(recipeSlug)}
              className="text-red-500 hover:text-red-600"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>
      )}

      {showCollectionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">Save to Collection</h3>
            
            {store.collections?.length > 0 && (
              <div className="mb-4">
                <h4 className="text-sm font-medium mb-2">Your Collections</h4>
                <div className="space-y-2">
                  {store.collections.map((collection) => (
                    <button
                      key={collection.id}
                      onClick={() => handleSaveToCollection(collection.id)}
                      className="w-full text-left px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200"
                    >
                      {collection.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label htmlFor="newCollection" className="block text-sm font-medium mb-1">
                  Create New Collection
                </label>
                <input
                  id="newCollection"
                  type="text"
                  value={newCollectionName}
                  onChange={(e) => setNewCollectionName(e.target.value)}
                  placeholder="Collection name"
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>
              
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => setShowCollectionModal(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateCollection}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                  disabled={!newCollectionName.trim()}
                >
                  Create & Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
