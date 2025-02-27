// Path: c:\files\astro\ffw\src\components\admin\StructuredIngredientEditor.tsx

import React, { useState, useEffect } from 'react';

export interface Ingredient {
  id: string;
  amount: string;
  unit: string;
  name: string;
  notes?: string;
  isHeading?: boolean;
  groupId?: string;
}

interface IngredientGroup {
  id: string;
  name: string;
}

interface Props {
  ingredients: Ingredient[];
  onChange: (ingredients: Ingredient[]) => void;
}

const COMMON_UNITS = [
  '',
  'cup',
  'tablespoon',
  'teaspoon',
  'ounce',
  'pound',
  'gram',
  'kilogram',
  'milliliter',
  'liter',
  'pinch',
  'slice',
  'clove',
  'bunch',
  'piece',
  'package',
  'can',
  'jar'
];

const StructuredIngredientEditor: React.FC<Props> = ({ ingredients = [], onChange }) => {
  const [localIngredients, setLocalIngredients] = useState<Ingredient[]>(ingredients);
  const [groups, setGroups] = useState<IngredientGroup[]>([]);
  const [showAddGroup, setShowAddGroup] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');

  // Initialize with at least one empty ingredient if none provided
  useEffect(() => {
    if (ingredients.length === 0) {
      setLocalIngredients([createEmptyIngredient()]);
    } else {
      setLocalIngredients(ingredients);
    }

    // Extract groups from ingredients
    const extractedGroups: IngredientGroup[] = [];
    ingredients.forEach(ing => {
      if (ing.isHeading && ing.id) {
        extractedGroups.push({ id: ing.id, name: ing.name });
      }
    });
    setGroups(extractedGroups);
  }, []);

  // Helper to create a unique ID
  const createId = () => `ing_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

  // Create an empty ingredient
  const createEmptyIngredient = (groupId?: string): Ingredient => ({
    id: createId(),
    amount: '',
    unit: '',
    name: '',
    notes: '',
    groupId
  });

  // Create a heading ingredient
  const createHeading = (name: string): Ingredient => ({
    id: createId(),
    amount: '',
    unit: '',
    name,
    isHeading: true
  });

  // Update a specific ingredient
  const updateIngredient = (id: string, updates: Partial<Ingredient>) => {
    const updatedIngredients = localIngredients.map(ing => 
      ing.id === id ? { ...ing, ...updates } : ing
    );
    setLocalIngredients(updatedIngredients);
    onChange(updatedIngredients);
  };

  // Add a new ingredient
  const addIngredient = (index: number, groupId?: string) => {
    const newIngredients = [...localIngredients];
    newIngredients.splice(index + 1, 0, createEmptyIngredient(groupId));
    setLocalIngredients(newIngredients);
    onChange(newIngredients);
  };

  // Remove an ingredient
  const removeIngredient = (id: string) => {
    const updatedIngredients = localIngredients.filter(ing => ing.id !== id);
    
    // If we removed the last ingredient, add an empty one
    if (updatedIngredients.length === 0) {
      updatedIngredients.push(createEmptyIngredient());
    }
    
    setLocalIngredients(updatedIngredients);
    onChange(updatedIngredients);
  };

  // Add a new group
  const addGroup = () => {
    if (!newGroupName.trim()) return;
    
    const groupId = createId();
    const newHeading = createHeading(newGroupName);
    newHeading.id = groupId;
    
    const newGroups = [...groups, { id: groupId, name: newGroupName }];
    setGroups(newGroups);
    
    // Add heading and one empty ingredient in the group
    const updatedIngredients = [
      ...localIngredients,
      newHeading,
      createEmptyIngredient(groupId)
    ];
    
    setLocalIngredients(updatedIngredients);
    onChange(updatedIngredients);
    setNewGroupName('');
    setShowAddGroup(false);
  };

  // Remove a group and all its ingredients
  const removeGroup = (groupId: string) => {
    const updatedIngredients = localIngredients.filter(ing => ing.id !== groupId && ing.groupId !== groupId);
    const updatedGroups = groups.filter(group => group.id !== groupId);
    
    setLocalIngredients(updatedIngredients);
    setGroups(updatedGroups);
    onChange(updatedIngredients);
  };

  // Get ingredients for a specific group or ungrouped ingredients
  const getGroupIngredients = (groupId?: string) => {
    return localIngredients.filter(ing => !ing.isHeading && ing.groupId === groupId);
  };

  return (
    <div className="space-y-4">
      {/* Ungrouped ingredients */}
      <div className="space-y-2">
        {getGroupIngredients(undefined).map((ingredient, index) => (
          <div 
            key={ingredient.id} 
            className="grid grid-cols-12 gap-2 items-center bg-white dark:bg-gray-800 p-2 rounded-lg border border-gray-200 dark:border-gray-700"
          >
            {/* Amount */}
            <div className="col-span-2">
              <input
                type="text"
                value={ingredient.amount}
                onChange={e => updateIngredient(ingredient.id, { amount: e.target.value })}
                placeholder="Amount"
                className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
              />
            </div>
            
            {/* Unit */}
            <div className="col-span-2">
              <div className="relative">
                <input
                  type="text"
                  value={ingredient.unit}
                  onChange={e => updateIngredient(ingredient.id, { unit: e.target.value })}
                  placeholder="Unit"
                  className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                  list={`units-${ingredient.id}`}
                />
                <datalist id={`units-${ingredient.id}`}>
                  {COMMON_UNITS.map((unit, i) => (
                    <option key={i} value={unit} />
                  ))}
                </datalist>
              </div>
            </div>
            
            {/* Ingredient name */}
            <div className="col-span-4">
              <input
                type="text"
                value={ingredient.name}
                onChange={e => updateIngredient(ingredient.id, { name: e.target.value })}
                placeholder="Ingredient name"
                className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
              />
            </div>
            
            {/* Notes */}
            <div className="col-span-3">
              <input
                type="text"
                value={ingredient.notes || ''}
                onChange={e => updateIngredient(ingredient.id, { notes: e.target.value })}
                placeholder="Notes (optional)"
                className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
              />
            </div>
            
            {/* Actions */}
            <div className="col-span-1 flex justify-end">
              <button
                type="button"
                onClick={() => removeIngredient(ingredient.id)}
                className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                title="Remove ingredient"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        ))}
        
        {getGroupIngredients(undefined).length > 0 && (
          <button
            type="button"
            onClick={() => addIngredient(getGroupIngredients(undefined).length - 1)}
            className="mt-1 text-jamie-orange hover:text-amber-600 text-sm flex items-center"
          >
            <svg className="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Add ingredient
          </button>
        )}
      </div>
      
      {/* Grouped ingredients */}
      {groups.map(group => (
        <div key={group.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-3 bg-gray-50 dark:bg-gray-800/50">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-medium text-gray-900 dark:text-white">{group.name}</h3>
            <button
              type="button"
              onClick={() => removeGroup(group.id)}
              className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
              title="Remove group"
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
          
          <div className="space-y-2">
            {getGroupIngredients(group.id).map((ingredient, index) => (
              <div 
                key={ingredient.id} 
                className="grid grid-cols-12 gap-2 items-center bg-white dark:bg-gray-800 p-2 rounded-lg border border-gray-200 dark:border-gray-700"
              >
                {/* Amount */}
                <div className="col-span-2">
                  <input
                    type="text"
                    value={ingredient.amount}
                    onChange={e => updateIngredient(ingredient.id, { amount: e.target.value })}
                    placeholder="Amount"
                    className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                  />
                </div>
                
                {/* Unit */}
                <div className="col-span-2">
                  <div className="relative">
                    <input
                      type="text"
                      value={ingredient.unit}
                      onChange={e => updateIngredient(ingredient.id, { unit: e.target.value })}
                      placeholder="Unit"
                      className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                      list={`units-${ingredient.id}`}
                    />
                    <datalist id={`units-${ingredient.id}`}>
                      {COMMON_UNITS.map((unit, i) => (
                        <option key={i} value={unit} />
                      ))}
                    </datalist>
                  </div>
                </div>
                
                {/* Ingredient name */}
                <div className="col-span-4">
                  <input
                    type="text"
                    value={ingredient.name}
                    onChange={e => updateIngredient(ingredient.id, { name: e.target.value })}
                    placeholder="Ingredient name"
                    className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                  />
                </div>
                
                {/* Notes */}
                <div className="col-span-3">
                  <input
                    type="text"
                    value={ingredient.notes || ''}
                    onChange={e => updateIngredient(ingredient.id, { notes: e.target.value })}
                    placeholder="Notes (optional)"
                    className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                  />
                </div>
                
                {/* Actions */}
                <div className="col-span-1 flex justify-end">
                  <button
                    type="button"
                    onClick={() => removeIngredient(ingredient.id)}
                    className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                    title="Remove ingredient"
                  >
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
            
            <button
              type="button"
              onClick={() => addIngredient(
                localIngredients.findIndex(ing => ing.groupId === group.id) + 
                getGroupIngredients(group.id).length - 1,
                group.id
              )}
              className="mt-1 text-jamie-orange hover:text-amber-600 text-sm flex items-center"
            >
              <svg className="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              Add ingredient to {group.name}
            </button>
          </div>
        </div>
      ))}
      
      {/* Add Group Form */}
      {showAddGroup ? (
        <div className="mt-4 p-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800/50">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Add Ingredient Group</h3>
          <div className="flex">
            <input
              type="text"
              value={newGroupName}
              onChange={e => setNewGroupName(e.target.value)}
              placeholder="Group name (e.g., 'For the sauce')"
              className="flex-1 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-l-md dark:bg-gray-700 dark:text-white"
            />
            <button
              type="button"
              onClick={addGroup}
              disabled={!newGroupName.trim()}
              className="bg-jamie-orange hover:bg-amber-600 text-white py-2 px-4 rounded-r-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Add
            </button>
          </div>
          <div className="mt-2 flex justify-end">
            <button
              type="button"
              onClick={() => setShowAddGroup(false)}
              className="text-gray-700 dark:text-gray-300 text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setShowAddGroup(true)}
          className="mt-4 text-jamie-orange hover:text-amber-600 text-sm flex items-center"
        >
          <svg className="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          Add Ingredient Group
        </button>
      )}
      
      {/* Bulk Import Instructions */}
      <div className="mt-6 border-t border-gray-200 dark:border-gray-700 pt-4">
        <details className="text-sm text-gray-700 dark:text-gray-300">
          <summary className="cursor-pointer font-medium">Bulk Import Instructions</summary>
          <div className="mt-2 pl-4">
            <p>To bulk import ingredients, use the following format:</p>
            <ul className="list-disc pl-5 mt-1">
              <li>One ingredient per line</li>
              <li>Format: <code>[amount] [unit] [name], [notes]</code></li>
              <li>Group headings should start with <code>## </code></li>
              <li>
                Example:
                <pre className="mt-1 bg-gray-100 dark:bg-gray-800 p-2 rounded text-xs">
                  2 cups flour, sifted{'\n'}
                  1 tsp salt{'\n'}
                  ## For the sauce{'\n'}
                  3 tbsp olive oil{'\n'}
                  2 cloves garlic, minced
                </pre>
              </li>
            </ul>
          </div>
        </details>
      </div>
    </div>
  );
};

export default StructuredIngredientEditor;
