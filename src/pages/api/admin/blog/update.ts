import type { APIRoute } from 'astro';
import jwt from 'jsonwebtoken';
import fs from 'fs/promises';
import path from 'path';
import slugify from 'slugify';
import matter from 'gray-matter';

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
    
    // Parse blog post data
    const postData = await request.json();
    
    // Validate required fields
    if (!postData.slug) {
      return new Response(JSON.stringify({ message: 'Missing post slug' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    const { slug } = postData;
    
    // Prepare file paths
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
    
    // Read the existing file
    const fileContent = await fs.readFile(filePath, 'utf8');
    const { data: frontmatter, content } = matter(fileContent);
    
    // If title changed, generate new slug
    let newSlug = slug;
    if (postData.title && postData.title !== frontmatter.title) {
      newSlug = slugify(postData.title, { lower: true, strict: true });
      
      // Check if the new slug would conflict with an existing post
      if (newSlug !== slug) {
        const newFilePath = path.join(blogPath, `${newSlug}.md`);
        try {
          await fs.access(newFilePath);
          return new Response(JSON.stringify({ message: 'A blog post with this title already exists' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
          });
        } catch {
          // File doesn't exist, which is what we want
        }
      }
    }
    
    // Update frontmatter
    const updatedFrontmatter = {
      ...frontmatter,
      title: postData.title || frontmatter.title,
      slug: newSlug,
      excerpt: postData.excerpt || frontmatter.excerpt,
      category: postData.category || frontmatter.category,
      status: postData.status || frontmatter.status,
      image: postData.image || frontmatter.image,
      tags: postData.tags || frontmatter.tags,
      updated: new Date().toISOString()
    };
    
    // Update content if provided
    const updatedContent = postData.content !== undefined ? postData.content : content;
    
    // Rebuild the markdown file
    const updatedFileContent = matter.stringify(updatedContent, updatedFrontmatter);
    
    // Write the updated file
    await fs.writeFile(filePath, updatedFileContent, 'utf8');
    
    // If slug changed, rename the file
    if (newSlug !== slug) {
      const newFilePath = path.join(blogPath, `${newSlug}.md`);
      await fs.rename(filePath, newFilePath);
    }
    
    return new Response(JSON.stringify({ 
      message: 'Blog post updated successfully', 
      slug: newSlug,
      post: {
        ...updatedFrontmatter,
        content: updatedContent
      }
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    console.error('Error updating blog post:', error);
    return new Response(JSON.stringify({ 
      message: 'An error occurred while updating the blog post',
      error: error instanceof Error ? error.message : String(error)
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
