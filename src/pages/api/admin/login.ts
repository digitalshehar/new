import type { APIRoute } from 'astro';
import { validateAdminCredentials } from '../../../data/adminUsers';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this-in-production';

export const POST: APIRoute = async ({ request, redirect }) => {
  try {
    console.log('Received login request');
    const data = await request.json().catch(() => null);
    console.log('Request data:', data ? 'Valid JSON' : 'Invalid JSON');

    if (!data || !data.username || !data.password) {
      console.log('Missing username or password');
      return new Response(JSON.stringify({ 
        error: 'Username and password are required' 
      }), { 
        status: 400,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }

    const { username, password } = data;
    console.log('Attempting login for user:', username);
    
    // For debugging in development - log the password length
    console.log('Password length:', password ? password.length : 0);
    
    const user = await validateAdminCredentials(username, password);
    
    if (!user) {
      console.log('Invalid credentials for user:', username);
      return new Response(JSON.stringify({ 
        error: 'Invalid credentials' 
      }), { 
        status: 401,
        headers: {
          'Content-Type': 'application/json'
        }
      });
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

    // Create the response
    const response = new Response(
      JSON.stringify({
        success: true,
        user: {
          username: user.username,
          role: user.role,
          name: user.name
        }
      }),
      { 
        status: 200,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    // Set the cookie
    response.headers.append(
      'Set-Cookie',
      `admin_session=${token}; Path=/; HttpOnly; SameSite=Strict; Max-Age=86400`
    );

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return new Response(JSON.stringify({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }), { 
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
}
