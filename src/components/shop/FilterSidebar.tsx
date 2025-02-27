import { useState } from 'react';
import type { Filter, Category } from '../../types/shop';
import { motion } from 'framer-motion';
import RangeSlider from '../../components/ui/RangeSlider';

interface FilterSidebarProps {
  categories: Category[];
  currentFilter: Filter;
  onFilterChange: (filter: Filter) => void;
  availableTags: string[];
}

const FilterContent = ({
  categories,
  currentFilter,
  onFilterChange,
  availableTags
}: FilterSidebarProps) => {
  const [localFilter, setLocalFilter] = useState<Filter>(currentFilter);

  const handleFilterChange = (updates: Partial<Filter>) => {
    const newFilter = { ...localFilter, ...updates };
    setLocalFilter(newFilter);
    onFilterChange(newFilter);
  };

  return (
    <div className="w-full lg:w-64 space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-3">Categories</h3>
        <div className="space-y-2">
          {categories.map((category) => (
            <label key={category.id} className="flex items-center">
              <input
                type="checkbox"
                checked={localFilter.categories.includes(category.id)}
                onChange={(e) => {
                  const newCategories = e.target.checked
                    ? [...localFilter.categories, category.id]
                    : localFilter.categories.filter((id) => id !== category.id);
                  handleFilterChange({ categories: newCategories });
                }}
                className="form-checkbox"
              />
              <span className="ml-2">{category.name}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-3">Price Range</h3>
        <RangeSlider
          min={0}
          max={1000}
          value={[localFilter.minPrice, localFilter.maxPrice]}
          onChange={([min, max]) =>
            handleFilterChange({ minPrice: min, maxPrice: max })
          }
        />
        <div className="flex justify-between mt-2">
          <span>${localFilter.minPrice}</span>
          <span>${localFilter.maxPrice}</span>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-3">Tags</h3>
        <div className="flex flex-wrap gap-2">
          {availableTags.map((tag) => (
            <button
              key={tag}
              onClick={() => {
                const newTags = localFilter.tags.includes(tag)
                  ? localFilter.tags.filter((t) => t !== tag)
                  : [...localFilter.tags, tag];
                handleFilterChange({ tags: newTags });
              }}
              className={`px-3 py-1 rounded-full text-sm ${
                localFilter.tags.includes(tag)
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-200 text-gray-700'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default function FilterSidebar(props: FilterSidebarProps) {
  return (
    <motion.div
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg"
    >
      <FilterContent {...props} />
    </motion.div>
  );
}
