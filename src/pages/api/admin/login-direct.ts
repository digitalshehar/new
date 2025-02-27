import type { APIRoute } from 'astro';
import { validateAdminCredentials } from '../../../data/adminUsers';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this-in-production';

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  try {
    console.log('===== ADMIN LOGIN DEBUG =====');
    console.log('Received direct login request');
    const formData = await request.formData();
    const username = formData.get('username')?.toString() || '';
    const password = formData.get('password')?.toString() || '';
    
    console.log('Login attempt for username:', username);
    console.log('Password entered:', password); // REMOVE THIS IN PRODUCTION - only for debugging
    console.log('Password length:', password.length);

    if (!username || !password) {
      console.log('Missing username or password');
      cookies.set('login_error', 'Username and password are required', {
        path: '/',
        maxAge: 60 // 1 minute
      });
      return redirect('/admin/login');
    }
    
    // Let validateAdminCredentials handle all authentication, including the bypass
    let user = await validateAdminCredentials(username, password);
    console.log('validateAdminCredentials returned:', user ? 'User object' : 'null');
    
    if (!user) {
      console.log('Invalid credentials for user:', username);
      cookies.set('login_error', 'Invalid username or password', {
        path: '/',
        maxAge: 60 // 1 minute
      });
      return redirect('/admin/login');
    }

    console.log('User authenticated successfully:', username);

    // Create JWT token
    const token = jwt.sign(
      { 
        username: user.username, 
        role: user.role,
        name: user.name
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    console.log('JWT token created successfully');

    // Set the cookie - CHANGED FROM admin_session to auth_token for consistency
    cookies.set('auth_token', token, {
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 // 1 day
    });

    console.log('Cookie set successfully');
    console.log('===== END LOGIN DEBUG =====');

    // Redirect to admin dashboard
    return redirect('/admin/dashboard');
  } catch (error) {
    console.error('Login error:', error);
    cookies.set('login_error', 'An internal server error occurred', {
      path: '/',
      maxAge: 60 // 1 minute
    });
    return redirect('/admin/login');
  }
}
