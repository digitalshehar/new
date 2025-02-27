import type { APIRoute } from 'astro';
import jwt from 'jsonwebtoken';
import fs from 'fs/promises';
import path from 'path';

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
      return new Response(JSON.stringify({ message: 'Blog post slug is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Prepare file path
    const blogPath = path.join(process.cwd(), 'src', 'pages', 'blog');
    const filePath = path.join(blogPath, `${slug}.md`);
    
    // Check if post exists
    try {
      await fs.access(filePath);
    } catch {
      return new Response(JSON.stringify({ message: 'Blog post not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Delete the file
    await fs.unlink(filePath);
    
    return new Response(JSON.stringify({ 
      message: 'Blog post deleted successfully', 
      slug
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    console.error('Error deleting blog post:', error);
    return new Response(JSON.stringify({ 
      message: 'An error occurred while deleting the blog post',
      error: error instanceof Error ? error.message : String(error)
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
