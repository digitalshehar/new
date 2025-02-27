import type { APIRoute } from 'astro';
import jwt from 'jsonwebtoken';
import fs from 'fs/promises';
import path from 'path';
import slugify from 'slugify';

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
    const requiredFields = ['title', 'content', 'author', 'excerpt', 'category'];
    for (const field of requiredFields) {
      if (!postData[field]) {
        return new Response(JSON.stringify({ message: `Missing required field: ${field}` }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        });
      }
    }
    
    // Generate slug
    const slug = slugify(postData.title, { lower: true, strict: true });
    
    // Prepare folder and file paths
    const blogPath = path.join(process.cwd(), 'src', 'pages', 'blog');
    
    // Create blog directory if it doesn't exist
    try {
      await fs.access(blogPath);
    } catch {
      await fs.mkdir(blogPath, { recursive: true });
    }
    
    // Check if a post with this slug already exists
    const filePath = path.join(blogPath, `${slug}.md`);
    try {
      await fs.access(filePath);
      return new Response(JSON.stringify({ message: 'A blog post with this title already exists' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    } catch {
      // File doesn't exist, which is what we want
    }
    
    // Create post content with frontmatter
    const date = new Date().toISOString();
    const tags = postData.tags ? postData.tags.join(', ') : '';
    
    const frontmatter = `---
title: "${postData.title}"
slug: ${slug}
date: ${date}
author: ${postData.author}
excerpt: "${postData.excerpt}"
category: ${postData.category}
status: ${postData.status || 'published'}
image: "${postData.image || ''}"
tags: [${tags}]
---

${postData.content}`;
    
    // Write the file
    await fs.writeFile(filePath, frontmatter, 'utf8');
    
    return new Response(JSON.stringify({ 
      message: 'Blog post created successfully', 
      slug,
      post: {
        ...postData,
        slug,
        date
      }
    }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    console.error('Error creating blog post:', error);
    return new Response(JSON.stringify({ 
      message: 'An error occurred while creating the blog post',
      error: error instanceof Error ? error.message : String(error)
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
