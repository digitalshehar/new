import jwt from 'jsonwebtoken';
import { adminUsers, validateAdminCredentials, type AdminUser } from '../data/adminUsers';
import { authStore } from '../stores/authStore';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this-in-production';

export async function authenticate(username: string, password: string): Promise<boolean> {
  try {
    console.log('Authenticating user:', username);
    const user = await validateAdminCredentials(username, password);
    
    if (!user) {
      console.log('Invalid credentials');
      return false;
    }

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

    // Set the token in a cookie
    document.cookie = `admin_session=${token}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=86400`;

    // Update auth store
    if (typeof window !== 'undefined') {
      authStore.set({ 
        username: user.username, 
        role: user.role,
        name: user.name,
        isAuthenticated: true 
      });
    }

    return true;
  } catch (error) {
    console.error('Authentication error:', error);
    throw error;
  }
}

export function verifyToken(token: string): AdminUser | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    const user = adminUsers.find(u => u.username === decoded.username);
    return user || null;
  } catch {
    return null;
  }
}

export function isAuthenticated(): boolean {
  if (typeof window === 'undefined') return false;
  
  // Check for valid JWT token in cookie
  const cookies = document.cookie.split(';');
  const tokenCookie = cookies.find(c => c.trim().startsWith('admin_session='));
  if (!tokenCookie) return false;
  
  const token = tokenCookie.split('=')[1];
  const user = verifyToken(token);
  
  return !!user;
}

export function checkAuth(pathname: string): boolean {
  return isAuthenticated() || pathname === '/admin/login';
}

export function logout(): void {
  if (typeof window === 'undefined') return;
  
  // Clear the auth cookie
  document.cookie = 'admin_session=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
  
  // Clear the auth store
  authStore.set({ 
    username: '', 
    role: undefined,
    name: '',
    isAuthenticated: false 
  });
  
  // Redirect to login
  window.location.href = '/admin/login';
}
