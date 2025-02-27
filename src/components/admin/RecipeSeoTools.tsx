import React, { useState, useEffect } from 'react';

interface RecipeSEOProps {
  title: string;
  description: string;
  keywords: string[];
  ingredients: { name: string }[];
  cuisine?: string;
  course?: string;
  prepTime?: number;
  cookTime?: number;
  onSeoUpdate: (data: { 
    keywords: string[], 
    seoTitle: string, 
    seoDescription: string,
    schemaMarkup: string
  }) => void;
}

const RecipeSeoTools: React.FC<RecipeSEOProps> = ({
  title,
  description,
  keywords = [],
  ingredients,
  cuisine,
  course,
  prepTime,
  cookTime,
  onSeoUpdate
}) => {
  const [seoTitle, setSeoTitle] = useState(title);
  const [seoDescription, setSeoDescription] = useState(description);
  const [keywordList, setKeywordList] = useState<string[]>(keywords);
  const [newKeyword, setNewKeyword] = useState('');
  const [seoScore, setSeoScore] = useState(0);
  const [seoSuggestions, setSeoSuggestions] = useState<string[]>([]);
  const [suggestedKeywords, setSuggestedKeywords] = useState<string[]>([]);
  const [schemaMarkup, setSchemaMarkup] = useState('');

  // Generate Schema.org markup for the recipe
  useEffect(() => {
    generateSchemaMarkup();
  }, [title, description, keywordList, ingredients, cuisine, course, prepTime, cookTime]);

  // SEO analysis whenever key data changes
  useEffect(() => {
    analyzeSeo();
  }, [seoTitle, seoDescription, keywordList]);

  // Update parent component with SEO data
  useEffect(() => {
    onSeoUpdate({
      keywords: keywordList,
      seoTitle,
      seoDescription,
      schemaMarkup
    });
  }, [seoTitle, seoDescription, keywordList, schemaMarkup]);

  // Generate recipe Schema.org markup in JSON-LD format
  const generateSchemaMarkup = () => {
    const schema = {
      "@context": "https://schema.org/",
      "@type": "Recipe",
      "name": title,
      "description": description,
      "keywords": keywordList.join(", "),
      "author": {
        "@type": "Organization",
        "name": "Fresh Food Weekly"
      },
      "image": "https://www.freshfoodweekly.com/images/placeholder.jpg", // Placeholder - would be dynamic in production
      "recipeIngredient": ingredients.map(i => i.name),
      "recipeCategory": course || "",
      "recipeCuisine": cuisine || "",
      "prepTime": prepTime ? `PT${prepTime}M` : undefined,
      "cookTime": cookTime ? `PT${cookTime}M` : undefined,
      "totalTime": (prepTime && cookTime) ? `PT${prepTime + cookTime}M` : undefined,
    };

    // Convert to JSON-LD string
    const jsonLd = JSON.stringify(schema, null, 2);
    setSchemaMarkup(jsonLd);
  };

  // Analyze SEO and generate score + suggestions
  const analyzeSeo = () => {
    const suggestions: string[] = [];
    let score = 0;
    const totalPoints = 100;
    let earnedPoints = 0;

    // Check title
    if (seoTitle.length > 0) earnedPoints += 10;
    if (seoTitle.length >= 30 && seoTitle.length <= 60) earnedPoints += 10;
    else suggestions.push("Optimize title length (30-60 characters)");

    // Check description
    if (seoDescription.length > 0) earnedPoints += 10;
    if (seoDescription.length >= 120 && seoDescription.length <= 160) earnedPoints += 10;
    else suggestions.push("Optimize description length (120-160 characters)");

    // Check keywords
    if (keywordList.length >= 3) earnedPoints += 10;
    else suggestions.push("Add at least 3 keywords");

    // Check if primary keyword is in title
    if (keywordList.length > 0 && seoTitle.toLowerCase().includes(keywordList[0].toLowerCase())) {
      earnedPoints += 10;
    } else if (keywordList.length > 0) {
      suggestions.push("Include primary keyword in title");
    }

    // Check if primary keyword is in description
    if (keywordList.length > 0 && seoDescription.toLowerCase().includes(keywordList[0].toLowerCase())) {
      earnedPoints += 10;
    } else if (keywordList.length > 0) {
      suggestions.push("Include primary keyword in description");
    }

    // Check structured data
    if (schemaMarkup) {
      earnedPoints += 10;
      
      // Check schema completeness
      const schemaObj = JSON.parse(schemaMarkup);
      if (schemaObj.recipeIngredient?.length > 0) earnedPoints += 5;
      if (schemaObj.prepTime && schemaObj.cookTime) earnedPoints += 5;
      if (schemaObj.recipeCategory) earnedPoints += 5;
      if (schemaObj.recipeCuisine) earnedPoints += 5;
    } else {
      suggestions.push("Generate schema markup for better visibility");
    }

    // Set final score
    const finalScore = Math.round((earnedPoints / totalPoints) * 100);
    setSeoScore(finalScore);
    setSeoSuggestions(suggestions);

    // Generate keyword suggestions based on recipe content
    generateKeywordSuggestions();
  };

  // Generate keyword suggestions based on recipe data
  const generateKeywordSuggestions = () => {
    const possibleKeywords: string[] = [];

    // Add cuisine as suggestion if not already in keywords
    if (cuisine && !keywordList.includes(cuisine)) {
      possibleKeywords.push(cuisine);
    }

    // Add course as suggestion if not already in keywords
    if (course && !keywordList.includes(course)) {
      possibleKeywords.push(course);
    }

    // Add "easy" or "quick" if prep time is low
    if (prepTime && prepTime <= 15 && !keywordList.includes('quick')) {
      possibleKeywords.push('quick recipe');
      possibleKeywords.push('easy recipe');
    }

    // Add "healthy" if description contains health-related terms
    if (description.toLowerCase().includes('healthy') || 
        description.toLowerCase().includes('nutritious') ||
        description.toLowerCase().includes('low-calorie')) {
      possibleKeywords.push('healthy recipe');
    }

    // Combinations for long-tail keywords
    if (cuisine && course) {
      possibleKeywords.push(`${cuisine} ${course}`);
    }

    // Set suggested keywords (filter out any already in the list)
    setSuggestedKeywords(possibleKeywords.filter(kw => 
      !keywordList.includes(kw)
    ));
  };

  // Add a keyword to the list
  const addKeyword = (keyword: string) => {
    if (keyword.trim() === '') return;
    if (keywordList.includes(keyword.trim())) return;
    
    setKeywordList([...keywordList, keyword.trim()]);
    setNewKeyword('');
  };

  // Remove a keyword from the list
  const removeKeyword = (keywordToRemove: string) => {
    setKeywordList(keywordList.filter(k => k !== keywordToRemove));
  };

  // Get SEO score color
  const getSeoScoreColor = () => {
    if (seoScore >= 80) return 'text-green-500';
    if (seoScore >= 50) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <div className="space-y-6 bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white">Recipe SEO Tools</h3>
      
      {/* SEO Score Indicator */}
      <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
        <div>
          <h4 className="font-medium text-gray-900 dark:text-white">SEO Score</h4>
          <p className="text-sm text-gray-600 dark:text-gray-400">Based on best practices for recipe content</p>
        </div>
        <div className={`text-3xl font-bold ${getSeoScoreColor()}`}>
          {seoScore}%
        </div>
      </div>
      
      {/* SEO Suggestions */}
      {seoSuggestions.length > 0 && (
        <div className="bg-yellow-50 dark:bg-yellow-900/30 border-l-4 border-yellow-400 p-4 rounded">
          <h4 className="font-medium text-yellow-800 dark:text-yellow-200 mb-2">Improvement Suggestions</h4>
          <ul className="list-disc pl-5 space-y-1 text-sm text-yellow-700 dark:text-yellow-300">
            {seoSuggestions.map((suggestion, index) => (
              <li key={index}>{suggestion}</li>
            ))}
          </ul>
        </div>
      )}
      
      {/* SEO Title */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          SEO Title
        </label>
        <input
          type="text"
          value={seoTitle}
          onChange={(e) => setSeoTitle(e.target.value)}
          className="shadow-sm focus:ring-jamie-orange focus:border-jamie-orange block w-full sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md"
          placeholder="Title optimized for search engines"
        />
        <div className="mt-1 flex justify-between">
          <span className="text-xs text-gray-500 dark:text-gray-400">
            Optimal length: 30-60 characters
          </span>
          <span className={`text-xs ${seoTitle.length > 60 ? 'text-red-500' : 'text-gray-500 dark:text-gray-400'}`}>
            {seoTitle.length} characters
          </span>
        </div>
      </div>
      
      {/* SEO Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Meta Description
        </label>
        <textarea
          value={seoDescription}
          onChange={(e) => setSeoDescription(e.target.value)}
          rows={3}
          className="shadow-sm focus:ring-jamie-orange focus:border-jamie-orange block w-full sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md"
          placeholder="Description that appears in search results"
        ></textarea>
        <div className="mt-1 flex justify-between">
          <span className="text-xs text-gray-500 dark:text-gray-400">
            Optimal length: 120-160 characters
          </span>
          <span className={`text-xs ${
            seoDescription.length > 160 ? 'text-red-500' : 'text-gray-500 dark:text-gray-400'
          }`}>
            {seoDescription.length} characters
          </span>
        </div>
      </div>
      
      {/* Keywords */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Recipe Keywords
        </label>
        <div className="flex">
          <input
            type="text"
            value={newKeyword}
            onChange={(e) => setNewKeyword(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addKeyword(newKeyword);
              }
            }}
            className="shadow-sm focus:ring-jamie-orange focus:border-jamie-orange block w-full sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-l-md"
            placeholder="Add keyword (e.g., vegetarian, dinner, pasta)"
          />
          <button
            type="button"
            onClick={() => addKeyword(newKeyword)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-r-md text-white bg-jamie-orange hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-jamie-orange"
          >
            Add
          </button>
        </div>
        
        {/* Keyword Display */}
        {keywordList.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {keywordList.map((keyword, index) => (
              <span 
                key={index}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
              >
                {keyword}
                <button
                  type="button"
                  onClick={() => removeKeyword(keyword)}
                  className="ml-1.5 inline-flex text-green-500 hover:text-green-700 dark:text-green-300 dark:hover:text-white focus:outline-none"
                >
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </span>
            ))}
          </div>
        )}
        
        {/* Keyword Suggestions */}
        {suggestedKeywords.length > 0 && (
          <div className="mt-4">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Suggested Keywords
            </h4>
            <div className="flex flex-wrap gap-2">
              {suggestedKeywords.map((keyword, index) => (
                <button
                  key={index}
                  onClick={() => addKeyword(keyword)}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                >
                  + {keyword}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
      
      {/* Schema.org Markup Preview */}
      <div>
        <div className="flex justify-between items-center">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Schema.org Markup (JSON-LD)
          </label>
          <button
            type="button"
            onClick={() => {
              navigator.clipboard.writeText(schemaMarkup);
              alert('Schema markup copied to clipboard!');
            }}
            className="text-sm text-jamie-orange hover:text-amber-600"
          >
            Copy to Clipboard
          </button>
        </div>
        <div className="mt-1 bg-gray-50 dark:bg-gray-900 p-3 rounded-md border border-gray-300 dark:border-gray-600 overflow-auto max-h-60">
          <pre className="text-xs text-gray-800 dark:text-gray-200 whitespace-pre-wrap">
            {schemaMarkup}
          </pre>
        </div>
      </div>
      
      {/* Search Preview */}
      <div>
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Search Result Preview
        </h4>
        <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800">
          <div className="text-xl text-blue-600 dark:text-blue-400 font-medium truncate">
            {seoTitle || title}
          </div>
          <div className="text-xs text-green-700 dark:text-green-500 truncate mt-1">
            www.freshfoodweekly.com/recipes/{title.toLowerCase().replace(/\s+/g, '-')}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
            {seoDescription || description}
          </div>
          <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
            {cuisine && course ? `${cuisine} · ${course}` : cuisine || course || 'Recipe'}
            {prepTime && cookTime ? ` · ${prepTime + cookTime} min` : ''}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeSeoTools;
