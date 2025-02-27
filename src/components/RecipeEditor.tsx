import { useState } from 'react';
import { motion } from 'framer-motion';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import DraggableStep from './DraggableStep';

interface RecipeFormData {
  title: string;
  description: string;
  prepTime: number;
  cookTime: number;
  servings: number;
  difficulty: 'easy' | 'medium' | 'hard';
  cuisine: string;
  ingredients: { item: string; amount: string; unit: string }[];
  method: { step: string; time: number; description: string }[];
  tips: string[];
  variations: { title: string; description: string; changes: string[] }[];
  nutritionInfo: {
    calories: string;
    protein: string;
    carbohydrates: string;
    fat: string;
    fiber: string;
  };
  image: File | null;
  tags: string[];
}

export default function RecipeEditor({ initialData, onSave }: { 
  initialData?: Partial<RecipeFormData>;
  onSave: (data: RecipeFormData) => void;
}) {
  const [formData, setFormData] = useState<RecipeFormData>({
    title: initialData?.title || '',
    description: initialData?.description || '',
    prepTime: initialData?.prepTime || 0,
    cookTime: initialData?.cookTime || 0,
    servings: initialData?.servings || 4,
    difficulty: initialData?.difficulty || 'medium',
    cuisine: initialData?.cuisine || '',
    ingredients: initialData?.ingredients || [{ item: '', amount: '', unit: '' }],
    method: initialData?.method || [{ step: '', time: 0, description: '' }],
    tips: initialData?.tips || [''],
    variations: initialData?.variations || [],
    nutritionInfo: initialData?.nutritionInfo || {
      calories: '',
      protein: '',
      carbohydrates: '',
      fat: '',
      fiber: ''
    },
    image: null,
    tags: initialData?.tags || []
  });

  const [activeTab, setActiveTab] = useState('basic');
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, image: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const addIngredient = () => {
    setFormData({
      ...formData,
      ingredients: [...formData.ingredients, { item: '', amount: '', unit: '' }]
    });
  };

  const addStep = () => {
    setFormData({
      ...formData,
      method: [...formData.method, { step: '', time: 0, description: '' }]
    });
  };

  const addTip = () => {
    setFormData({
      ...formData,
      tips: [...formData.tips, '']
    });
  };

  const addVariation = () => {
    setFormData({
      ...formData,
      variations: [...formData.variations, { title: '', description: '', changes: [''] }]
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Tab Navigation */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {['basic', 'ingredients', 'method', 'extras'].map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`
                  ${activeTab === tab
                    ? 'border-amber-500 text-amber-600'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  }
                  whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium
                `}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </nav>
        </div>

        {/* Basic Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: activeTab === 'basic' ? 1 : 0, y: activeTab === 'basic' ? 0 : 20 }}
          className={activeTab === 'basic' ? 'block' : 'hidden'}
        >
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Cuisine</label>
              <input
                type="text"
                value={formData.cuisine}
                onChange={(e) => setFormData({ ...formData, cuisine: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Prep Time (minutes)</label>
              <input
                type="number"
                value={formData.prepTime}
                onChange={(e) => setFormData({ ...formData, prepTime: parseInt(e.target.value) })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Cook Time (minutes)</label>
              <input
                type="number"
                value={formData.cookTime}
                onChange={(e) => setFormData({ ...formData, cookTime: parseInt(e.target.value) })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Servings</label>
              <input
                type="number"
                value={formData.servings}
                onChange={(e) => setFormData({ ...formData, servings: parseInt(e.target.value) })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Difficulty</label>
              <select
                value={formData.difficulty}
                onChange={(e) => setFormData({ ...formData, difficulty: e.target.value as 'easy' | 'medium' | 'hard' })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500"
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Recipe Image</label>
              <div className="mt-1 flex items-center space-x-4">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-amber-50 file:text-amber-700 hover:file:bg-amber-100"
                />
                {imagePreview && (
                  <img src={imagePreview} alt="Preview" className="h-20 w-20 object-cover rounded-md" />
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Ingredients */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: activeTab === 'ingredients' ? 1 : 0, y: activeTab === 'ingredients' ? 0 : 20 }}
          className={activeTab === 'ingredients' ? 'block' : 'hidden'}
        >
          <div className="space-y-4">
            {formData.ingredients.map((ingredient, index) => (
              <div key={index} className="grid grid-cols-1 gap-4 sm:grid-cols-3 items-center">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Item</label>
                  <input
                    type="text"
                    value={ingredient.item}
                    onChange={(e) => {
                      const newIngredients = [...formData.ingredients];
                      newIngredients[index].item = e.target.value;
                      setFormData({ ...formData, ingredients: newIngredients });
                    }}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Amount</label>
                  <input
                    type="text"
                    value={ingredient.amount}
                    onChange={(e) => {
                      const newIngredients = [...formData.ingredients];
                      newIngredients[index].amount = e.target.value;
                      setFormData({ ...formData, ingredients: newIngredients });
                    }}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Unit</label>
                  <input
                    type="text"
                    value={ingredient.unit}
                    onChange={(e) => {
                      const newIngredients = [...formData.ingredients];
                      newIngredients[index].unit = e.target.value;
                      setFormData({ ...formData, ingredients: newIngredients });
                    }}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500"
                  />
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={addIngredient}
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
            >
              Add Ingredient
            </button>
          </div>
        </motion.div>

        {/* Method */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: activeTab === 'method' ? 1 : 0, y: activeTab === 'method' ? 0 : 20 }}
          className={activeTab === 'method' ? 'block' : 'hidden'}
        >
          <div className="space-y-4">
            {formData.method.map((step, index) => (
              <DraggableStep
                key={index}
                index={index}
                step={step}
                onChange={(newStep) => {
                  const newMethod = [...formData.method];
                  newMethod[index] = newStep;
                  setFormData({ ...formData, method: newMethod });
                }}
                onDelete={() => {
                  const newMethod = formData.method.filter((_, i) => i !== index);
                  setFormData({ ...formData, method: newMethod });
                }}
              />
            ))}
            <button
              type="button"
              onClick={addStep}
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
            >
              Add Step
            </button>
          </div>
        </motion.div>

        {/* Extras */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: activeTab === 'extras' ? 1 : 0, y: activeTab === 'extras' ? 0 : 20 }}
          className={activeTab === 'extras' ? 'block' : 'hidden'}
        >
          {/* Tips */}
          <div className="space-y-4 mb-8">
            <h3 className="text-lg font-medium text-gray-900">Chef's Tips</h3>
            {formData.tips.map((tip, index) => (
              <div key={index} className="flex items-center gap-4">
                <input
                  type="text"
                  value={tip}
                  onChange={(e) => {
                    const newTips = [...formData.tips];
                    newTips[index] = e.target.value;
                    setFormData({ ...formData, tips: newTips });
                  }}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500"
                />
                <button
                  type="button"
                  onClick={() => {
                    const newTips = formData.tips.filter((_, i) => i !== index);
                    setFormData({ ...formData, tips: newTips });
                  }}
                  className="text-red-600 hover:text-red-700"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addTip}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
            >
              Add Tip
            </button>
          </div>

          {/* Nutrition Information */}
          <div className="space-y-4 mb-8">
            <h3 className="text-lg font-medium text-gray-900">Nutrition Information</h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {Object.entries(formData.nutritionInfo).map(([key, value]) => (
                <div key={key}>
                  <label className="block text-sm font-medium text-gray-700 capitalize">{key}</label>
                  <input
                    type="text"
                    value={value}
                    onChange={(e) => {
                      setFormData({
                        ...formData,
                        nutritionInfo: {
                          ...formData.nutritionInfo,
                          [key]: e.target.value
                        }
                      });
                    }}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Tags */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {formData.tags.map((tag, index) => (
                <div
                  key={index}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-amber-100 text-amber-800"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => {
                      const newTags = formData.tags.filter((_, i) => i !== index);
                      setFormData({ ...formData, tags: newTags });
                    }}
                    className="ml-2 text-amber-600 hover:text-amber-700"
                  >
                    ×
                  </button>
                </div>
              ))}
              <input
                type="text"
                placeholder="Add a tag"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && e.currentTarget.value) {
                    e.preventDefault();
                    setFormData({
                      ...formData,
                      tags: [...formData.tags, e.currentTarget.value]
                    });
                    e.currentTarget.value = '';
                  }
                }}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm border-2 border-dashed border-gray-300 focus:border-amber-500 focus:ring-0"
              />
            </div>
          </div>
        </motion.div>

        {/* Submit Button */}
        <div className="flex justify-end pt-8">
          <button
            type="submit"
            className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
          >
            Save Recipe
          </button>
        </div>
      </form>
    </DndProvider>
  );
}
