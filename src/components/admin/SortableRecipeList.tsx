import React, { useState, useEffect } from 'react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface Recipe {
  title: string;
  slug: string;
  category: string;
  cookingTime: string;
  difficulty: string;
  imageUrl?: string;
  tags?: string[];
  featured?: boolean;
  position?: number;
}

interface SortableRecipeListProps {
  recipes: Recipe[];
  onReorder: (recipes: Recipe[]) => void;
  onFeatureToggle: (recipe: Recipe) => void;
}

interface SortableItemProps {
  recipe: Recipe;
  onFeatureToggle: (recipe: Recipe) => void;
}

// Individual sortable recipe item
function SortableRecipeItem({ recipe, onFeatureToggle }: SortableItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: recipe.slug,
  });
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
  };
  
  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      className={`bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-2 transition-colors
                ${isDragging ? 'shadow-lg bg-amber-50 dark:bg-amber-900/10 border-2 border-amber-500 dark:border-amber-400' : ''}
                hover:bg-gray-50 dark:hover:bg-gray-700`}
    >
      <div className="flex items-center gap-3">
        {/* Drag handle */}
        <div 
          {...attributes} 
          {...listeners}
          className="flex-shrink-0 cursor-grab text-gray-400 hover:text-amber-500 dark:text-gray-500 dark:hover:text-amber-400"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8h16M4 16h16" />
          </svg>
        </div>
        
        {/* Recipe content */}
        <div className="flex-grow">
          <div className="flex items-center">
            <h3 className="text-md font-medium text-gray-900 dark:text-white">
              {recipe.title}
            </h3>
            {recipe.featured && (
              <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200">
                Featured
              </span>
            )}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400 mt-1 flex gap-2">
            <span className="bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded">
              {recipe.category}
            </span>
            <span>{recipe.cookingTime}</span>
          </div>
        </div>
        
        {/* Feature toggle */}
        <button
          onClick={() => onFeatureToggle(recipe)}
          className={`ml-2 p-1 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500
                    ${recipe.featured 
                      ? 'text-amber-500 hover:text-amber-600 dark:text-amber-400 dark:hover:text-amber-500' 
                      : 'text-gray-400 hover:text-amber-500 dark:text-gray-500 dark:hover:text-amber-400'}`}
          title={recipe.featured ? 'Remove from featured' : 'Add to featured'}
        >
          <svg className="w-5 h-5" fill={recipe.featured ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default function SortableRecipeList({ 
  recipes, 
  onReorder,
  onFeatureToggle
}: SortableRecipeListProps) {
  const [items, setItems] = useState<Recipe[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);
  
  // Initialize with provided recipes
  useEffect(() => {
    if (initialLoad && recipes.length > 0) {
      setItems(recipes);
      setInitialLoad(false);
    }
  }, [recipes, initialLoad]);
  
  // Set up sensors for drag/drop + keyboard accessibility
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );
  
  // Handle drag end
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setIsDragging(false);
    
    if (over && active.id !== over.id) {
      setItems((currentItems) => {
        const oldIndex = currentItems.findIndex(item => item.slug === active.id);
        const newIndex = currentItems.findIndex(item => item.slug === over.id);
        
        // Update positions in the sorted array
        const newItems = arrayMove(currentItems, oldIndex, newIndex);
        newItems.forEach((item, index) => {
          item.position = index;
        });
        
        // Call parent callback with the new order
        onReorder(newItems);
        
        return newItems;
      });
    }
  };
  
  // Handle drag start
  const handleDragStart = () => {
    setIsDragging(true);
  };
  
  // Feature toggle handler
  const handleFeatureToggle = (recipe: Recipe) => {
    onFeatureToggle(recipe);
    setItems(currentItems => 
      currentItems.map(item => 
        item.slug === recipe.slug 
          ? { ...item, featured: !item.featured }
          : item
      )
    );
  };

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow p-4 ${isDragging ? 'ring-2 ring-amber-400' : ''}`}>
      <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Recipe Order & Featured Items</h2>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
        Drag and drop to reorder recipes. Star items to feature them on the homepage.
      </p>
      
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={items.map(recipe => recipe.slug)} strategy={verticalListSortingStrategy}>
          <div>
            {items.map((recipe) => (
              <SortableRecipeItem 
                key={recipe.slug} 
                recipe={recipe} 
                onFeatureToggle={handleFeatureToggle} 
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
      
      {items.length === 0 && (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          No recipes available to sort
        </div>
      )}
    </div>
  );
}
