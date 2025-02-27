# Fresh Food Weekly - Admin Authentication System

## Overview

This document describes the authentication system for the Fresh Food Weekly admin panel, how it works, available login methods, and best practices for security.

## Authentication Flow

1. **Login Page**: Users access the admin area through `/admin/login`
2. **Credentials**: The system validates credentials against stored user data
3. **Session**: Upon successful login, a JWT token is stored in a HTTP-only cookie
4. **Page Access**: All admin pages verify the presence of this cookie before rendering content
5. **Logout**: Users can logout via the navbar button, which clears the session cookie

## Available Login Methods

### Standard Authentication
- **Username**: `admin` 
- **Password**: `admin123`
- Regular authentication using bcrypt password hashing

### Test User
- **Username**: `test`
- **Password**: `test123`
- Regular user with admin privileges

### Development Bypass (Development Environment Only)
- **Username**: `admin`
- **Password**: `supersecretadmin`
- Special bypass that skips password hashing verification
- **WARNING**: For development use only, should be removed in production

## Security Implementation

### JWT Authentication
- Uses JSON Web Tokens for session management
- Tokens are signed with a secret key
- Contains user details like username, role, and name
- Set to expire after 24 hours

### Cookie Security
- Cookies are HTTP-only to prevent JavaScript access
- Uses secure flag in production to require HTTPS
- Implements same-site policy to prevent CSRF attacks

### Server-Side Validation
- All admin pages implement authentication checks before rendering
- No client-side route protection that could be bypassed
- All sensitive operations require valid session

## Best Practices

1. **Change Default Credentials**: Update the default admin password in production
2. **Set Strong JWT Secret**: Update the JWT secret key in production
3. **Remove Development Bypass**: Delete or disable the development bypass in production
4. **Implement Rate Limiting**: Add rate limiting to prevent brute force attacks
5. **Regular Token Rotation**: Implement token refresh mechanisms for longer sessions

## Architecture

- `src/data/adminUsers.ts`: Manages user data and credential validation
- `src/pages/admin/login.astro`: Login page interface
- `src/pages/api/admin/login-direct.ts`: Server-side login processing
- `src/pages/api/admin/logout.ts`: Session termination endpoint
- `src/layouts/AdminLayout.astro`: Admin area layout with logout functionality

## Troubleshooting

If you encounter login issues:

1. Check the server logs for authentication errors
2. Verify that cookies are enabled in the browser
3. Clear browser cookies and try again
4. Ensure the JWT_SECRET environment variable is set correctly
