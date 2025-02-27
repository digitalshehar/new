export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  image?: string;
  category?: string;
  tags?: string[];
  author: string;
  date: string;
  status: 'draft' | 'published' | 'archived';
  readTime?: string;
}

export interface Recipe {
  id: string;
  slug: string;
  title: string;
  description: string;
  content: string;
  image?: string;
  category?: string;
  tags?: string[];
  author: string;
  date: string;
  status: 'draft' | 'published' | 'archived';
  prepTime?: string;
  cookTime?: string;
  servings?: number;
  difficulty?: 'easy' | 'medium' | 'hard';
  ingredients: string[];
  instructions: string[];
}
