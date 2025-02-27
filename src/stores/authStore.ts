import { atom } from 'nanostores';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

// Load environment variables from a .env file
dotenv.config();

// In a real application, these would be stored in a secure database
// and the password would be properly hashed
const ADMIN_CREDENTIALS = {
  username: process.env.ADMIN_USERNAME || 'admin',
  // This is a hashed version of 'admin123'
  passwordHash: process.env.ADMIN_PASSWORD_HASH || '$2a$10$8K1p/a0dL1LXMrHF/1t3O.ZHr7.n/K9EqP5XkxFKE4TzKVSGIz.Oi'
};

interface AuthState {
  username: string;
  role: 'admin' | 'editor' | '';
  name: string;
  isAuthenticated: boolean;
}

// Initialize auth store from cookie if it exists
const initializeAuthState = (): AuthState => {
  if (typeof document === 'undefined') {
    return {
      username: '',
      role: '',
      name: '',
      isAuthenticated: false
    };
  }

  const token = document.cookie
    .split('; ')
    .find(row => row.startsWith('admin_session='));

  if (!token) {
    return {
      username: '',
      role: '',
      name: '',
      isAuthenticated: false
    };
  }

  try {
    // Note: This is a simple check. The actual validation happens server-side.
    return {
      username: '',
      role: '',
      name: '',
      isAuthenticated: true
    };
  } catch (error) {
    console.error('Error parsing auth token:', error);
    return {
      username: '',
      role: '',
      name: '',
      isAuthenticated: false
    };
  }
};

export const authStore = atom<AuthState>(initializeAuthState());

export async function login(username: string, password: string): Promise<boolean> {
  console.log('Login attempt:', { username });
  
  try {
    if (!username || !password) {
      console.log('Missing credentials');
      return false;
    }

    if (username !== ADMIN_CREDENTIALS.username) {
      console.log('Invalid username');
      return false;
    }

    console.log('Comparing passwords...');
    const isValidPassword = await bcrypt.compare(password, ADMIN_CREDENTIALS.passwordHash);
    console.log('Password valid:', isValidPassword);

    if (isValidPassword) {
      // Set the cookie
      document.cookie = `admin_session=true; Path=/; Expires=${new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toUTCString()};`;
      
      // Update the store
      authStore.set({ isAuthenticated: true, username, role: 'admin', name: 'Admin User' });
      return true;
    }

    return false;
  } catch (error) {
    console.error('Login error:', error);
    throw new Error(`Login failed due to an unexpected error: ${error.message}`);
  }
}

export const logout = () => {
  // Clear the cookie
  document.cookie = 'admin_session=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
  
  // Reset the store
  authStore.set({
    username: '',
    role: '',
    name: '',
    isAuthenticated: false
  });
  
  // Redirect to login
  window.location.href = '/admin/login';
};
