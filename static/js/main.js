// Initialize when document is ready
document.addEventListener('DOMContentLoaded', function() {
  // Theme toggle functionality
  const themeToggle = document.getElementById('theme-toggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      document.documentElement.setAttribute('data-bs-theme', 
        document.documentElement.getAttribute('data-bs-theme') === 'dark' ? 'light' : 'dark'
      );
    });
  }

  // Highlight current navigation item
  const path = window.location.pathname;
  document.querySelectorAll('.nav-link').forEach(link => {
    if (link.getAttribute('href') === path) {
      link.classList.add('active');
    }
  });

  // Quick IP display
  const ipDisplay = document.getElementById('ip-quick-display');
  if (ipDisplay) {
    fetch('https://ipinfo.io/json?token=56ce5f0209ac39')
      .then(response => response.json())
      .then(data => {
        ipDisplay.textContent = data.ip || 'Unable to detect';
      })
      .catch(() => {
        ipDisplay.textContent = 'Unable to detect';
      });
  }

  // Load common elements from data files
  loadPopularRouters();
});

// Function to load popular routers in footer
function loadPopularRouters() {
  const routersList = document.querySelector('.popular-routers-list');
  if (!routersList) return;

  fetch('/static/data/routers.json')
    .then(response => response.json())
    .then(data => {
      // Get most popular routers
      const popularRouters = data.slice(0, 4);
      
      // Clear existing list
      routersList.innerHTML = '';
      
      // Add each router to the list
      popularRouters.forEach(router => {
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = `/router-guides/${router.ip.replace(/\./g, '-')}`;
        a.className = 'text-light';
        a.textContent = router.ip;
        li.appendChild(a);
        routersList.appendChild(li);
      });
    })
    .catch(error => {
      console.error('Error loading popular routers:', error);
    });
}