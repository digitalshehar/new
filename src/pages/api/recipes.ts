import type { APIRoute } from 'astro';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import slugify from 'slugify';

export const post: APIRoute = async ({ request }) => {
  try {
    const recipe = await request.json();
    
    // Validate required fields
    if (!recipe.title || !recipe.description || !recipe.ingredients || !recipe.instructions) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Generate slug from title
    const slug = slugify(recipe.title, { lower: true, strict: true });
    
    // Create recipe file content
    const recipeContent = `---
layout: ../../layouts/RecipeLayout.astro
title: "${recipe.title}"
description: "${recipe.description}"
pubDate: "${new Date().toISOString()}"
prepTime: ${recipe.prepTime}
cookTime: ${recipe.cookTime}
servings: ${recipe.servings}
ingredients:
${recipe.ingredients.map((ingredient: string) => `  - "${ingredient}"`).join('\n')}
instructions:
${recipe.instructions.map((instruction: string) => `  - "${instruction}"`).join('\n')}
nutrition:
  calories: ${recipe.nutrition.calories}
  protein: ${recipe.nutrition.protein}
  carbs: ${recipe.nutrition.carbs}
  fat: ${recipe.nutrition.fat}
---

${recipe.description}
`;

    // Write recipe file
    const recipePath = join(process.cwd(), 'src', 'pages', 'recipes', `${slug}.astro`);
    await writeFile(recipePath, recipeContent, 'utf-8');

    return new Response(JSON.stringify({ success: true, slug }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error creating recipe:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
