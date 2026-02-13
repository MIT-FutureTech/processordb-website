// middleware/authGuard.js
// #region agent log
fetch('http://127.0.0.1:7253/ingest/65e8388e-fc0b-44e5-9ecd-bf527d204089',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'middleware/authGuard.js:2',message:'Middleware file loaded and exported',data:{timestamp:Date.now(),fileExists:true},timestamp:Date.now(),runId:'debug-1',hypothesisId:'A'})}).catch(()=>{});
// #endregion

export default defineNuxtRouteMiddleware((to) => {
  // #region agent log
  fetch('http://127.0.0.1:7253/ingest/65e8388e-fc0b-44e5-9ecd-bf527d204089',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'middleware/authGuard.js:5',message:'Middleware function executed',data:{path:to.path,hasTo:!!to},timestamp:Date.now(),runId:'debug-1',hypothesisId:'B'})}).catch(()=>{});
  // #endregion

  const config = useRuntimeConfig();
  const enableAuth = config.public.enableAuth || false;

  // #region agent log
  fetch('http://127.0.0.1:7253/ingest/65e8388e-fc0b-44e5-9ecd-bf527d204089',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'middleware/authGuard.js:10',message:'Runtime config accessed',data:{enableAuth:enableAuth,hasConfig:!!config},timestamp:Date.now(),runId:'debug-1',hypothesisId:'C'})}).catch(()=>{});
  // #endregion

  // If auth is disabled, redirect protected routes to home
  if (!enableAuth) {
    const protectedRoutes = [
      '/login',
      '/register',
      '/cpu/list',
      '/gpu/list',
      '/fpga/list',
      '/soc/list'
    ];

    if (protectedRoutes.includes(to.path)) {
      // #region agent log
      fetch('http://127.0.0.1:7253/ingest/65e8388e-fc0b-44e5-9ecd-bf527d204089',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'middleware/authGuard.js:25',message:'Redirecting protected route',data:{path:to.path,enableAuth:enableAuth},timestamp:Date.now(),runId:'debug-1',hypothesisId:'D'})}).catch(()=>{});
      // #endregion
      return navigateTo('/', { replace: true });
    }
  }
});
