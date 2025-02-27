import type { APIRoute } from 'astro';
import jwt from 'jsonwebtoken';
import { recipes as recipesData } from '../../../../data/recipes';
import fs from 'fs/promises';
import path from 'path';

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
    
    // Parse request data
    const data = await request.json();
    const { slug } = data;
    
    if (!slug) {
      return new Response(JSON.stringify({ message: 'Recipe slug is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Check if recipe exists
    if (!recipesData[slug]) {
      return new Response(JSON.stringify({ message: 'Recipe not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Create a copy of recipes without the deleted one
    const updatedRecipes = { ...recipesData };
    delete updatedRecipes[slug];
    
    // Save updated recipes data
    await saveRecipes(updatedRecipes);
    
    return new Response(JSON.stringify({ 
      message: 'Recipe deleted successfully', 
      slug
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    console.error('Error deleting recipe:', error);
    return new Response(JSON.stringify({ 
      message: 'An error occurred while deleting the recipe',
      error: error instanceof Error ? error.message : String(error)
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
