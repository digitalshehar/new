import React, { useState, useEffect } from 'react';
import { userStore } from '../stores/userStore';
import { useRecipeStore } from '../stores/recipeStore';

interface RecipeRatingProps {
  recipeSlug: string;
  initialRating?: number;
  totalRatings?: number;
}

export default function RecipeRating({ recipeSlug, initialRating = 0, totalRatings = 0 }: RecipeRatingProps) {
  const { addRating: addUserRating } = userStore;
  const { addRating: addRecipeRating, ratings, totalRatings: recipeTotalRatings } = useRecipeStore();
  const [hoveredRating, setHoveredRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get the current rating for this recipe
  const currentRating = ratings[recipeSlug] || initialRating;
  const currentTotalRatings = recipeTotalRatings[recipeSlug] || totalRatings;

  const handleRate = async (rating: number) => {
    if (rating < 1 || rating > 5) {
      setError('Invalid rating value');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // First update the UI optimistically
      addRecipeRating(recipeSlug, rating);
      
      // Then try to save to the backend
      await addUserRating(recipeSlug, rating);
    } catch (err) {
      // If backend save fails, revert the optimistic update
      addRecipeRating(recipeSlug, currentRating);
      setError('Failed to submit rating. Please try again.');
      console.error('Rating submission error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center space-x-1" onMouseLeave={() => setHoveredRating(0)}>
        {[1, 2, 3, 4, 5].map((rating) => (
          <button
            key={rating}
            onClick={() => handleRate(rating)}
            onMouseEnter={() => setHoveredRating(rating)}
            className="focus:outline-none"
            disabled={isSubmitting}
            aria-label={`Rate ${rating} out of 5 stars`}
          >
            <svg
              className={`w-6 h-6 ${
                rating <= (hoveredRating || currentRating)
                  ? 'text-yellow-400'
                  : 'text-gray-300 dark:text-gray-600'
              } ${isSubmitting ? 'opacity-50' : ''} transition-colors duration-150`}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          </button>
        ))}
        <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
          {isSubmitting ? 'Submitting...' : `(${currentTotalRatings} ${currentTotalRatings === 1 ? 'rating' : 'ratings'})`}
        </span>
      </div>
      {error && (
        <p className="text-sm text-red-600 dark:text-red-400">
          {error}
        </p>
      )}
      {!error && currentRating > 0 && (
        <p className="text-sm text-green-600 dark:text-green-400">
          You rated this recipe {currentRating.toFixed(1)} {currentRating === 1 ? 'star' : 'stars'}
        </p>
      )}
    </div>
  );
}
