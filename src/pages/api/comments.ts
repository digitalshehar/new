import type { APIRoute } from 'astro';

interface Comment {
  id: string;
  author: string;
  content: string;
  date: string;
}

let comments: Comment[] = [];

export const post: APIRoute = async ({ request }) => {
  try {
    const { author, content } = await request.json();
    const newComment: Comment = {
      id: (comments.length + 1).toString(),
      author,
      content,
      date: new Date().toISOString(),
    };
    comments.push(newComment);
    return new Response(JSON.stringify(newComment), { status: 201 });
  } catch (error) {
    return new Response('Failed to add comment', { status: 500 });
  }
};

export const get: APIRoute = async () => {
  return new Response(JSON.stringify(comments), { status: 200 });
};
