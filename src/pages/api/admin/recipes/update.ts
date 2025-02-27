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
    if (!recipeData.slug) {
      return new Response(JSON.stringify({ message: 'Missing recipe slug' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    const { slug } = recipeData;
    
    // Check if recipe exists
    if (!recipesData[slug]) {
      return new Response(JSON.stringify({ message: 'Recipe not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // If title changed, generate new slug
    let newSlug = slug;
    if (recipeData.title && recipeData.title !== recipesData[slug].title) {
      newSlug = slugify(recipeData.title, { lower: true, strict: true });
      
      // Check if the new slug would conflict with an existing recipe
      if (newSlug !== slug && recipesData[newSlug]) {
        return new Response(JSON.stringify({ message: 'A recipe with this title already exists' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        });
      }
    }
    
    // Update recipe object
    const updatedRecipe = {
      ...recipesData[slug],
      title: recipeData.title || recipesData[slug].title,
      description: recipeData.description || recipesData[slug].description,
      image: recipeData.image || recipesData[slug].image,
      cookingTime: recipeData.cookingTime || recipesData[slug].cookingTime,
      timeCategory: recipeData.timeCategory || recipesData[slug].timeCategory,
      difficulty: recipeData.difficulty || recipesData[slug].difficulty,
      serves: recipeData.serves || recipesData[slug].serves,
      category: recipeData.category || recipesData[slug].category,
      slug: newSlug,
      ingredients: recipeData.ingredients || recipesData[slug].ingredients,
      method: recipeData.method || recipesData[slug].method,
      tips: recipeData.tips || recipesData[slug].tips,
      nutritionInfo: recipeData.nutritionInfo || recipesData[slug].nutritionInfo,
      dietaryPreferences: recipeData.dietaryPreferences || recipesData[slug].dietaryPreferences,
      season: recipeData.season || recipesData[slug].season,
      prepTime: recipeData.prepTime || recipesData[slug].prepTime,
      totalTime: recipeData.totalTime || recipesData[slug].totalTime
    };
    
    // Create updated recipes data
    const updatedRecipes = { ...recipesData };
    
    // If slug changed, remove old entry
    if (newSlug !== slug) {
      delete updatedRecipes[slug];
    }
    
    // Add updated recipe
    updatedRecipes[newSlug] = updatedRecipe;
    
    // Save updated recipes data
    await saveRecipes(updatedRecipes);
    
    return new Response(JSON.stringify({ 
      message: 'Recipe updated successfully', 
      slug: newSlug,
      recipe: updatedRecipe
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    console.error('Error updating recipe:', error);
    return new Response(JSON.stringify({ 
      message: 'An error occurred while updating the recipe',
      error: error instanceof Error ? error.message : String(error)
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
