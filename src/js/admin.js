/**
 * Fresh Food Weekly Admin JavaScript
 * Handles client-side admin functionality
 */

/**
 * Handle admin logout
 * @returns {Promise<void>}
 */
export async function handleLogout() {
  try {
    // Call the logout API endpoint
    await fetch('/api/admin/logout', {
      method: 'POST',
      credentials: 'same-origin'
    });
    
    // Redirect to login page
    window.location.href = '/admin/login';
  } catch (error) {
    console.error('Logout failed:', error);
    // Fallback to direct redirect
    window.location.href = '/admin/login';
  }
}

/**
 * Initialize admin page
 * Sets up event listeners and other admin functionality
 */
export function initAdminPage() {
  // Setup logout buttons
  const logoutBtn = document.getElementById('logoutBtn');
  const mobileLogoutBtn = document.getElementById('mobileLogoutBtn');
  
  logoutBtn?.addEventListener('click', handleLogout);
  mobileLogoutBtn?.addEventListener('click', handleLogout);
  
  // Setup mobile menu toggle
  const mobileMenuButton = document.getElementById('mobile-menu-button');
  const mobileMenu = document.getElementById('mobile-menu');

  if (mobileMenuButton && mobileMenu) {
    mobileMenuButton.addEventListener('click', () => {
      const expanded = mobileMenuButton.getAttribute('aria-expanded') === 'true';
      mobileMenuButton.setAttribute('aria-expanded', (!expanded).toString());
      mobileMenu.classList.toggle('hidden');
    });
  }
  
  console.log('Admin page initialized');
}

// Execute initialization when the DOM is fully loaded
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', initAdminPage);
}
