import { readFile, writeFile, readdir } from 'fs/promises';
import { join } from 'path';
import matter from 'gray-matter';
import { z } from 'zod';

// Schema definitions
const RecipeSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  prepTime: z.number(),
  cookTime: z.number(),
  servings: z.number(),
  difficulty: z.enum(['easy', 'medium', 'hard']),
  ingredients: z.array(z.object({
    item: z.string(),
    amount: z.number(),
    unit: z.string(),
  })),
  instructions: z.array(z.string()),
  image: z.string().optional(),
  category: z.string(),
  tags: z.array(z.string()),
  createdAt: z.string(),
  updatedAt: z.string(),
});

const BlogPostSchema = z.object({
  slug: z.string(),
  title: z.string(),
  excerpt: z.string(),
  content: z.string(),
  author: z.string(),
  date: z.string(),
  image: z.string().optional(),
  category: z.string().optional(),
  tags: z.array(z.string()).optional(),
  status: z.enum(['draft', 'published', 'archived']),
});

type Recipe = z.infer<typeof RecipeSchema>;
type BlogPost = z.infer<typeof BlogPostSchema>;

interface QueryOptions {
  limit?: number;
  offset?: number;
  category?: string;
  tag?: string;
  search?: string;
}

// Helper functions
async function readMarkdownFile(filePath: string) {
  try {
    const fileContent = await readFile(filePath, 'utf-8');
    const { data, content } = matter(fileContent);
    return { ...data, content };
  } catch (error) {
    console.error(`Error reading file ${filePath}:`, error);
    return null;
  }
}

async function readMarkdownFiles(directory: string) {
  try {
    const files = await readdir(join(process.cwd(), directory));
    const markdownFiles = files.filter(file => file.endsWith('.md'));
    
    const contents = await Promise.all(
      markdownFiles.map(async file => {
        const filePath = join(process.cwd(), directory, file);
        const content = await readMarkdownFile(filePath);
        if (content) {
          return {
            ...content,
            slug: file.replace('.md', '')
          };
        }
        return null;
      })
    );

    return contents.filter((content): content is BlogPost => content !== null);
  } catch (error) {
    console.error(`Error reading files from ${directory}:`, error);
    return [];
  }
}

async function writeMarkdownFile(directory: string, filename: string, content: any) {
  try {
    const filePath = join(process.cwd(), directory, `${filename}.md`);
    const { data, content: markdown } = matter.stringify(content.content, {
      title: content.title,
      excerpt: content.excerpt,
      date: content.date,
      author: content.author,
      image: content.image,
      category: content.category,
      tags: content.tags,
      status: content.status
    });
    await writeFile(filePath, markdown);
    return true;
  } catch (error) {
    console.error(`Error writing file ${filename}:`, error);
    return false;
  }
}

// Recipe functions
export async function getRecipes(options: QueryOptions = {}) {
  // Import the recipes data
  const { recipes } = await import('../data/recipes');
  
  // Convert recipes object to array and add slug to each
  const recipeArray = Object.entries(recipes).map(([slug, recipe]) => ({
    ...recipe,
    slug,
    date: new Date().toISOString() // Add a date for compatibility
  }));
  
  let filtered = recipeArray;

  if (options.category) {
    filtered = filtered.filter(recipe => recipe.category === options.category);
  }

  if (options.tag) {
    filtered = filtered.filter(recipe => recipe.tags?.includes(options.tag));
  }

  if (options.search) {
    const searchLower = options.search.toLowerCase();
    filtered = filtered.filter(recipe => 
      recipe.title.toLowerCase().includes(searchLower) ||
      recipe.description.toLowerCase().includes(searchLower)
    );
  }

  if (options.limit) {
    filtered = filtered.slice(options.offset || 0, options.limit);
  }

  return filtered;
}

export async function getRecipe(slug: string) {
  // Import the recipes data
  const { recipes } = await import('../data/recipes');
  
  // Get the recipe by slug and add the slug property
  const recipe = recipes[slug];
  if (!recipe) return null;
  
  return {
    ...recipe,
    slug,
    date: new Date().toISOString() // Add a date for compatibility
  };
}

export async function createRecipe(recipe: Omit<Recipe, 'id' | 'createdAt' | 'updatedAt'>) {
  const slug = recipe.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

  const success = await writeMarkdownFile('content/recipes', slug, {
    ...recipe,
    date: new Date().toISOString(),
  });

  return success ? { ...recipe, slug } : null;
}

export async function updateRecipe(slug: string, recipe: Partial<Recipe>) {
  const existing = await getRecipe(slug);
  if (!existing) return null;

  const updated = {
    ...existing,
    ...recipe,
    updatedAt: new Date().toISOString(),
  };

  const success = await writeMarkdownFile('content/recipes', slug, updated);
  return success ? updated : null;
}

// Blog post functions
export async function getBlogPosts(options: QueryOptions = {}) {
  const posts = await readMarkdownFiles('src/content/blog');
  let filtered = posts.filter(post => post.status === 'published');

  if (options.category) {
    filtered = filtered.filter(post => post.category === options.category);
  }

  if (options.tag) {
    filtered = filtered.filter(post => post.tags?.includes(options.tag));
  }

  if (options.search) {
    const searchLower = options.search.toLowerCase();
    filtered = filtered.filter(post => 
      post.title.toLowerCase().includes(searchLower) ||
      post.excerpt.toLowerCase().includes(searchLower) ||
      post.content.toLowerCase().includes(searchLower)
    );
  }

  // Sort by date, newest first
  filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  if (options.limit) {
    filtered = filtered.slice(options.offset || 0, options.limit);
  }

  return filtered;
}

export async function getBlogPost(slug: string) {
  const posts = await readMarkdownFiles('src/content/blog');
  return posts.find(post => post.slug === slug) || null;
}

export async function createBlogPost(post: Omit<BlogPost, 'slug'>) {
  const slug = post.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

  const success = await writeMarkdownFile('src/content/blog', slug, {
    ...post,
    date: new Date().toISOString(),
  });

  return success ? { ...post, slug } : null;
}

export async function updateBlogPost(slug: string, post: Partial<BlogPost>) {
  const existing = await getBlogPost(slug);
  if (!existing) return null;

  const updated = {
    ...existing,
    ...post,
    date: new Date().toISOString(),
  };

  const success = await writeMarkdownFile('src/content/blog', slug, updated);
  return success ? updated : null;
}

// Category and tag functions
export async function getCategories() {
  const posts = await getBlogPosts();
  const categories = new Set(posts.map(post => post.category).filter(Boolean));
  return Array.from(categories);
}

export async function getTags() {
  const posts = await getBlogPosts();
  const tags = new Set(posts.flatMap(post => post.tags || []));
  return Array.from(tags);
}
