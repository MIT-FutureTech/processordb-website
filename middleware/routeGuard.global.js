// middleware/routeGuard.global.js
export default defineNuxtRouteMiddleware((to) => {
  if (import.meta.server) return;

  // Prevent navigation to routes with null/undefined parameters
  if (to.path.includes('/null') || to.path.includes('/undefined')) {
    // Silently redirect to a safe route based on the pattern
    // Don't log warning as this is expected behavior for invalid routes
    if (to.path.startsWith('/admin/')) {
      return navigateTo('/admin/profile', { replace: true });
    }
    
    // For other routes, redirect to home
    return navigateTo('/', { replace: true });
  }
});




