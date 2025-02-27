import type { APIRoute } from 'astro';

export const post: APIRoute = async ({ request, cookies }) => {
  const body = await request.json();
  const { username, password } = body;

  // Simple auth check
  if (username === 'admin' && password === 'admin') {
    // Set auth cookie
    cookies.set('auth', JSON.stringify({ 
      username, 
      isAuthenticated: true 
    }), {
      path: '/',
      httpOnly: true,
      secure: true,
      sameSite: 'strict'
    });

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  return new Response(JSON.stringify({ success: false }), {
    status: 401,
    headers: {
      'Content-Type': 'application/json'
    }
  });
};
