// This file helps with SPA routing in Netlify
console.log('Netlify SPA support loaded');

// Handle route changes and redirect to index.html if needed
function handleRouteForSPA() {
  // Only run in production on Netlify
  if (!window.location.hostname.includes('netlify.app') && !window.location.hostname.includes('netlify.com')) {
    return;
  }
  
  // If we're on a non-existing route, render the app
  const isNotFoundPage = document.title.includes('404') || 
                         document.body.textContent.includes('404') ||
                         document.body.textContent.includes('not found');
  
  if (isNotFoundPage) {
    window.location.href = '/';
  }
}

// Run on load
window.addEventListener('load', handleRouteForSPA);

// Expose globally to be used in index.html
window.netlifyHelper = {
  handleRouteForSPA
}; 