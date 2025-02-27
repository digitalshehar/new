import React from 'react';

interface RecipeHeaderProps {
  title: string;
  description: string;
  image: string;
  prepTime: string;
  cookTime: string;
  totalTime: string;
  servings: number;
  difficulty: string;
  author: string;
}

export default function RecipeHeader({
  title,
  description,
  image,
  prepTime,
  cookTime,
  totalTime,
  servings,
  difficulty,
  author,
}: RecipeHeaderProps) {
  return (
    <header className="space-y-4">
      <h1 className="text-4xl font-bold text-gray-900 dark:text-white">{title}</h1>
      <p className="text-xl text-gray-600 dark:text-gray-300">{description}</p>
      
      <div className="relative aspect-video rounded-lg overflow-hidden">
        <img
          src={image}
          alt={title}
          className="object-cover w-full h-full"
        />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-4">
        <div>
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Prep Time</h3>
          <p className="mt-1 text-lg font-semibold text-gray-900 dark:text-white">{prepTime}</p>
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Cook Time</h3>
          <p className="mt-1 text-lg font-semibold text-gray-900 dark:text-white">{cookTime}</p>
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Time</h3>
          <p className="mt-1 text-lg font-semibold text-gray-900 dark:text-white">{totalTime}</p>
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Servings</h3>
          <p className="mt-1 text-lg font-semibold text-gray-900 dark:text-white">{servings}</p>
        </div>
      </div>

      <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
        <div className="flex items-center">
          <span className="font-medium mr-2">Difficulty:</span>
          <span className="capitalize">{difficulty}</span>
        </div>
        <div className="flex items-center">
          <span className="font-medium mr-2">By:</span>
          <span>{author}</span>
        </div>
      </div>
    </header>
  );
}
