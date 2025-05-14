// This file helps with SPA routing in Netlify
console.log('Netlify SPA support loaded (Node.js 20)');

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

// Log Node.js info
console.info('Node.js info', {
  env: typeof process !== 'undefined' ? process.env.NODE_ENV : 'browser',
  pageUrl: window.location.href
});

// Run on load
window.addEventListener('load', handleRouteForSPA);

// Expose globally to be used in index.html
window.netlifyHelper = {
  handleRouteForSPA
};

// This script helps with Next.js static export on Netlify
// It's included in the build output and helps with client-side navigation and fallbacks

(function() {
  // Detect if this is a 404 error page on Netlify
  var isErrorPage = document.location.pathname.includes('/404') ||
                   document.location.pathname.includes('/404.html');

  // Handle client-side navigation for SPA
  document.addEventListener('click', function(event) {
    var target = event.target;
    // Find closest anchor tag if the click was on a child element
    while (target && target.tagName !== 'A') {
      target = target.parentNode;
      if (!target) return;
    }
    
    // Only handle internal links
    if (target && target.href && 
        target.hostname === window.location.hostname && 
        !target.hasAttribute('download') &&
        target.getAttribute('target') !== '_blank') {
      
      // Prevent default link behavior
      event.preventDefault();
      
      // Update history and navigate
      var href = target.getAttribute('href');
      window.history.pushState({}, '', href);
      
      // For SPA navigation, we could trigger a custom event that the app listens for
      var navEvent = new CustomEvent('netlifyNavigate', { detail: { path: href } });
      window.dispatchEvent(navEvent);
      
      // Fallback to reload if the app doesn't handle the event
      setTimeout(function() {
        window.location.reload();
      }, 100);
    }
  });
  
  // Handle the back/forward browser buttons
  window.addEventListener('popstate', function() {
    window.location.reload();
  });
})(); 