import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ cookies, redirect }) => {
  try {
    console.log('Processing logout request');
    
    // Delete the auth_token cookie
    cookies.delete('auth_token', {
      path: '/',
    });
    
    console.log('User logged out successfully');
    
    // Redirect to login page
    return redirect('/admin/login');
  } catch (error) {
    console.error('Logout error:', error);
    
    // Even if there's an error, try to delete the cookie
    cookies.delete('auth_token', {
      path: '/',
    });
    
    return redirect('/admin/login');
  }
};

// Also allow GET requests for simpler logout (optional)
export const GET: APIRoute = async (context) => {
  return POST(context);
};
