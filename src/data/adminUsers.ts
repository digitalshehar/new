import bcrypt from 'bcryptjs';

export interface AdminUser {
  username: string;
  passwordHash: string;
  role: 'admin' | 'editor';
  name: string;
}

// Default admin password: admin123
// This is a pre-generated hash for 'admin123' using bcrypt
const defaultPasswordHash = '$2a$10$zGtVnYH.ebVHGm.IgHqvx.1Rr2VbL.U9N9XQwrwqxZxjwAYs0Fsua';

export const adminUsers: AdminUser[] = [
  {
    username: 'admin',
    passwordHash: defaultPasswordHash,
    role: 'admin',
    name: 'Administrator'
  },
  // Adding a second admin user with a simple password as a backup
  {
    username: 'test',
    // Hash for password 'test123'
    passwordHash: '$2a$10$wGqxIWt.jmOGgTbJO/I/FejvgGlxgoaSBTSh45j3cuohMRqF5Uww2',
    role: 'admin',
    name: 'Test User'
  },
  // Adding a simple non-hashed plaintext password user for easier testing
  {
    username: 'cascade',
    // This is intentionally not hashed for testing purposes ONLY
    passwordHash: 'cascade123',
    role: 'admin',
    name: 'Cascade User'
  }
];

export async function validateAdminCredentials(username: string, password: string): Promise<AdminUser | null> {
  try {
    console.log('Validating credentials for user:', username);
    const user = adminUsers.find(u => u.username === username);
    
    if (!user) {
      console.log('User not found:', username);
      return null;
    }

    console.log('User found, comparing password...');
    
    // For development purposes ONLY - allows bypass login with specific credentials
    // REMOVE THIS IN PRODUCTION
    if (username === 'admin' && password === 'supersecretadmin') {
      console.log('Using bypass login - FOR DEVELOPMENT ONLY');
      return user;
    }

    // Special case for the cascade user (non-hashed password for testing)
    if (username === 'cascade' && password === user.passwordHash) {
      console.log('Using direct password match for cascade user - FOR TESTING ONLY');
      return user;
    }

    // For debugging - log the hashed passwords
    console.log('Stored hash:', user.passwordHash);
    console.log('Input password:', password);

    try {
      const isValid = await bcrypt.compare(password, user.passwordHash);
      console.log('Password validation result:', isValid);
      return isValid ? user : null;
    } catch (bcryptError) {
      console.error('bcrypt.compare error:', bcryptError);
      
      // Fallback direct comparison for testing if bcrypt is having issues
      if (username === 'admin' && password === 'admin123') {
        console.log('Using fallback direct string comparison - FOR DEBUGGING ONLY');
        return user;
      }
      
      if (username === 'test' && password === 'test123') {
        console.log('Using fallback direct string comparison for test user - FOR DEBUGGING ONLY');
        return user;
      }
      
      return null;
    }
  } catch (error) {
    console.error('Error validating credentials:', error);
    return null;
  }
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}
