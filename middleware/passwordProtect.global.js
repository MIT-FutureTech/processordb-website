// middleware/passwordProtect.global.js
export default defineNuxtRouteMiddleware((to) => {
    if (import.meta.server) return

    // Define the password
    const PASSWORD = 'processorDB-2024';
  
    // Check if the route has `requiresAuth` in its meta
    if (to.meta.requiresAuth) {
      // Check if password is in localStorage (you can use sessionStorage if you prefer)
      const enteredPassword = localStorage.getItem('protectedPassword');
  
      // If password does not match, redirect to password page
      if (enteredPassword !== PASSWORD) {
        console.log('Password mismatch, redirecting to login');
        const redirectPath = to.path || '/';
        return navigateTo(`/login?redirect=${encodeURIComponent(redirectPath)}`);
      }
    }
  });
  