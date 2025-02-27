import type { APIRoute } from 'astro';
import jwt from 'jsonwebtoken';
import { recipes as recipesData } from '../../../../data/recipes';
import fs from 'fs/promises';
import path from 'path';
import slugify from 'slugify';

// Helper to save recipes data
async function saveRecipes(recipes: any) {
  const filePath = path.join(process.cwd(), 'src', 'data', 'recipes.ts');
  
  // Read the current file to preserve imports and type definitions
  const currentFile = await fs.readFile(filePath, 'utf-8');
  
  // Find the position where recipes data starts
  const recipesStartIdx = currentFile.indexOf('export const recipes: Record<string, Recipe> = {');
  if (recipesStartIdx === -1) {
    throw new Error('Could not find recipes data in file');
  }
  
  // Find the position where recipes data ends
  const recipesEndIdx = currentFile.indexOf('};', recipesStartIdx) + 2;
  
  // Format the recipes object as a string
  const recipesString = `export const recipes: Record<string, Recipe> = ${JSON.stringify(recipes, null, 2)};`;
  
  // Create the new file content
  const newContent = currentFile.substring(0, recipesStartIdx) + 
                    recipesString + 
                    currentFile.substring(recipesEndIdx);
  
  await fs.writeFile(filePath, newContent, 'utf-8');
}

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    // Check authentication
    const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this-in-production';
    const token = cookies.get('auth_token')?.value;
    
    if (!token) {
      return new Response(JSON.stringify({ message: 'Authentication required' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    try {
      jwt.verify(token, JWT_SECRET);
    } catch (err) {
      return new Response(JSON.stringify({ message: 'Invalid or expired token' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Parse recipe data
    const recipeData = await request.json();
    
    // Validate required fields
    const requiredFields = ['title', 'description', 'category', 'ingredients', 'method'];
    for (const field of requiredFields) {
      if (!recipeData[field]) {
        return new Response(JSON.stringify({ message: `Missing required field: ${field}` }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        });
      }
    }
    
    // Generate slug
    const slug = slugify(recipeData.title, { lower: true, strict: true });
    
    // Check if recipe with this slug already exists
    if (recipesData[slug]) {
      return new Response(JSON.stringify({ message: 'A recipe with this title already exists' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Create recipe object
    const newRecipe = {
      title: recipeData.title,
      description: recipeData.description,
      image: recipeData.image || '/images/recipes/default.jpg',
      cookingTime: recipeData.cookingTime && !recipeData.cookingTime.includes('minute') ? 
                 `${recipeData.cookingTime} minutes` : recipeData.cookingTime,
      timeCategory: recipeData.timeCategory || 'Under 30 mins',
      difficulty: recipeData.difficulty || 'Medium',
      serves: recipeData.serves || '4',
      category: recipeData.category,
      slug,
      featured: false,
      ingredients: recipeData.ingredients,
      method: recipeData.method,
      tips: recipeData.tips || [],
      nutritionInfo: recipeData.nutritionInfo || {
        calories: '',
        protein: '',
        carbs: '',
        fat: ''
      },
      dietaryPreferences: recipeData.dietaryPreferences || [],
      season: recipeData.season || 'All',
      reviews: [],
      prepTime: recipeData.prepTime && !recipeData.prepTime.includes('minute') ? 
              `${recipeData.prepTime} minutes` : recipeData.prepTime,
      totalTime: recipeData.totalTime || recipeData.cookingTime
    };
    
    // Add to recipes data
    const updatedRecipes = {
      ...recipesData,
      [slug]: newRecipe
    };
    
    // Save updated recipes data
    await saveRecipes(updatedRecipes);
    
    return new Response(JSON.stringify({ 
      message: 'Recipe created successfully', 
      slug,
      recipe: newRecipe
    }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    console.error('Error creating recipe:', error);
    return new Response(JSON.stringify({ 
      message: 'An error occurred while creating the recipe',
      error: error instanceof Error ? error.message : String(error)
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
