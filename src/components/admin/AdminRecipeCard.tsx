import { useState } from 'react';

interface Tag {
  id: string;
  name: string;
  color: string;
}

interface Recipe {
  title: string;
  slug: string;
  category: string;
  cookingTime: string;
  difficulty: string;
  imageUrl?: string;
  tags?: string[];
}

interface AdminRecipeCardProps {
  recipe: Recipe;
  onEdit: (slug: string) => void;
  onDelete: (slug: string, title: string) => void;
  onToggleSelect?: (recipe: Recipe) => void;
  isSelected?: boolean;
  tags?: Tag[];
}

export default function AdminRecipeCard({ 
  recipe, 
  onEdit, 
  onDelete,
  onToggleSelect,
  isSelected = false,
  tags = []
}: AdminRecipeCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [animateOut, setAnimateOut] = useState(false);

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    // Trigger the delete animation first
    setAnimateOut(true);
    
    // Use setTimeout to allow animation to play before removing
    setTimeout(() => {
      onDelete(recipe.slug, recipe.title);
    }, 300);
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit(recipe.slug);
  };

  const handleCardClick = () => {
    if (onToggleSelect) {
      onToggleSelect(recipe);
    }
  };

  // Generate a random gradient for recipes without images
  const getRandomGradient = () => {
    const colors = [
      ['#F59E0B', '#D97706'],
      ['#10B981', '#059669'],
      ['#3B82F6', '#2563EB'],
      ['#8B5CF6', '#7C3AED'],
      ['#EC4899', '#DB2777'],
    ];
    const randomIndex = Math.floor(recipe.title.length % colors.length);
    const [color1, color2] = colors[randomIndex];
    return `linear-gradient(135deg, ${color1}, ${color2})`;
  };

  // Get tag color classes
  const getTagColorClasses = (colorName: string) => {
    const colorMap: Record<string, string> = {
      'red': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
      'blue': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      'green': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      'yellow': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      'purple': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      'pink': 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200',
      'indigo': 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200',
    };
    
    return colorMap[colorName] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
  };

  const recipeTags = recipe.tags 
    ? tags.filter(tag => recipe.tags?.includes(tag.id))
    : [];

  return (
    <div 
      className={`card-3d transition-all duration-300 bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden
                ${isHovered ? 'scale-[1.02]' : 'scale-100'}
                ${animateOut ? 'opacity-0 transform -translate-y-8' : 'opacity-100'}
                ${isSelected ? 'ring-2 ring-amber-500 dark:ring-amber-400' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleCardClick}
    >
      {/* Selection checkbox */}
      {onToggleSelect && (
        <div className="absolute top-2 left-2 z-10">
          <div 
            className={`transition-all duration-200 w-5 h-5 rounded border flex items-center justify-center 
                      ${isSelected 
                        ? 'bg-amber-500 border-amber-500' 
                        : 'bg-white/80 border-gray-300 dark:bg-gray-700/80 dark:border-gray-500'}
                      ${isHovered || isSelected ? 'opacity-100' : 'opacity-0'}`}
          >
            {isSelected && (
              <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            )}
          </div>
        </div>
      )}
      
      <div 
        className="h-32 bg-cover bg-center transition-all duration-500"
        style={{ 
          backgroundImage: recipe.imageUrl ? `url(${recipe.imageUrl})` : getRandomGradient(),
          transform: isHovered ? 'scale(1.05)' : 'scale(1)'
        }}
      />
      
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 transition-transform duration-300"
            style={{ transform: isHovered ? 'translateY(-2px)' : 'translateY(0)' }}>
          {recipe.title}
        </h3>
        
        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-3 space-x-3">
          <span className="bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 px-2 py-1 rounded">
            {recipe.category}
          </span>
          <span>{recipe.cookingTime}</span>
          <span>{recipe.difficulty}</span>
        </div>
        
        {/* Tags */}
        {recipeTags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3 transition-all duration-300">
            {recipeTags.map(tag => (
              <span 
                key={tag.id}
                className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium
                          ${getTagColorClasses(tag.color)}`}
              >
                {tag.name}
              </span>
            ))}
          </div>
        )}
        
        <div className={`flex justify-end space-x-2 transition-all duration-300 
                        ${isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
          <button 
            onClick={handleEditClick}
            className="btn-pulse text-jamie-orange hover:text-amber-700 font-medium py-1 px-3 rounded transition-all"
          >
            Edit
          </button>
          <button 
            onClick={handleDeleteClick}
            className="btn-pulse text-red-600 hover:text-red-900 font-medium py-1 px-3 rounded transition-all"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
