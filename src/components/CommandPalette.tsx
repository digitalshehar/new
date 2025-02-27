import React, { useState, useEffect } from 'react';
import { recipes } from '../data/recipes';

interface Command {
  id: string;
  name: string;
  shortcut?: string;
  action: () => void;
}

export default function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');

  const navigate = (path: string) => {
    window.location.href = path;
  };

  const commands: Command[] = [
    {
      id: 'home',
      name: 'Go to Home',
      shortcut: '⌘H',
      action: () => navigate('/')
    },
    {
      id: 'recipes',
      name: 'All Recipes',
      shortcut: '⌘R',
      action: () => navigate('/recipes')
    },
    {
      id: 'collections',
      name: 'Recipe Collections',
      shortcut: '⌘C',
      action: () => navigate('/collections')
    },
    {
      id: 'favorites',
      name: 'My Favorites',
      shortcut: '⌘F',
      action: () => navigate('/favorites')
    },
    {
      id: 'theme',
      name: 'Toggle Theme',
      shortcut: '⌘T',
      action: () => {
        const html = document.documentElement;
        const currentTheme = html.classList.contains('dark') ? 'light' : 'dark';
        html.classList.remove('light', 'dark');
        html.classList.add(currentTheme);
        localStorage.setItem('theme', currentTheme);
      }
    },
    ...Object.values(recipes).map(recipe => ({
      id: `recipe-${recipe.slug}`,
      name: `View Recipe: ${recipe.title}`,
      action: () => navigate(`/recipes/${recipe.slug}`)
    }))
  ];

  const filteredCommands = commands.filter(command =>
    command.name.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsOpen(true);
      } else if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="min-h-screen px-4 text-center">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setIsOpen(false)} />

        <div className="inline-block w-full max-w-2xl my-8 overflow-hidden text-left align-middle transition-all transform bg-white dark:bg-gray-800 shadow-xl rounded-2xl">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <div className="relative">
              <input
                type="text"
                className="w-full px-4 py-4 text-gray-900 dark:text-white placeholder-gray-500 bg-transparent border-0 focus:ring-0 focus:outline-none text-lg"
                placeholder="Search commands..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                autoFocus
              />
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                <kbd className="px-2 py-1 text-xs font-semibold text-gray-500 bg-gray-100 dark:bg-gray-700 dark:text-gray-400 rounded">
                  esc
                </kbd>
              </div>
            </div>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {filteredCommands.map((command) => (
              <button
                key={command.id}
                className="w-full px-4 py-3 text-left hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none"
                onClick={() => {
                  command.action();
                  setIsOpen(false);
                }}
              >
                <div className="flex items-center justify-between">
                  <span className="text-gray-900 dark:text-white">{command.name}</span>
                  {command.shortcut && (
                    <kbd className="px-2 py-1 text-xs font-semibold text-gray-500 bg-gray-100 dark:bg-gray-700 dark:text-gray-400 rounded">
                      {command.shortcut}
                    </kbd>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
