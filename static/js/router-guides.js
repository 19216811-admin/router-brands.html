document.addEventListener('DOMContentLoaded', function() {
  const routerList = document.getElementById('router-list');
  const routerSearchInput = document.getElementById('router-search');
  const routerBrandFilter = document.getElementById('brand-filter');
  let allRouters = [];
  
  // Get router ID from URL if on detail page
  const currentPath = window.location.pathname;
  const routerDetailMatch = currentPath.match(/\/router-guides\/(.+)/);
  const routerId = routerDetailMatch ? routerDetailMatch[1].replace(/-/g, '.') : null;
  
  // Load routers data
  if (routerList || routerId) {
    loadRoutersData();
  }
  
  // Search functionality
  if (routerSearchInput) {
    routerSearchInput.addEventListener('input', filterRouters);
  }
  
  // Brand filter functionality
  if (routerBrandFilter) {
    routerBrandFilter.addEventListener('change', filterRouters);
  }
  
  // Get search term from URL if provided
  function getUrlParam(param) {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    return urlParams.get(param);
  }
  
  // Load router data
  function loadRoutersData() {
    fetch('/static/data/routers.json')
      .then(response => response.json())
      .then(data => {
        allRouters = data;
        
        // Check if we need to display a single router or the list
        if (routerId) {
          displayRouterDetails(routerId);
        } else if (routerList) {
          populateBrandFilter(data);
          
          // Check if search term is in URL
          const searchTerm = getUrlParam('search');
          if (searchTerm) {
            routerSearchInput.value = searchTerm;
          }
          
          filterRouters();
        }
      })
      .catch(error => {
        console.error('Error loading router data:', error);
        if (routerList) {
          routerList.innerHTML = `
            <div class="alert alert-danger" role="alert">
              Failed to load router information. Please try again later.
            </div>
          `;
        }
      });
  }
  
  // Populate brand filter dropdown
  function populateBrandFilter(routers) {
    if (!routerBrandFilter) return;
    
    // Get unique brands
    const brands = [...new Set(routers.map(router => router.brand))].sort();
    
    // Clear dropdown except first option
    routerBrandFilter.innerHTML = '<option value="">All Brands</option>';
    
    // Add brands to dropdown
    brands.forEach(brand => {
      const option = document.createElement('option');
      option.value = brand;
      option.textContent = brand;
      routerBrandFilter.appendChild(option);
    });
  }
  
  // Filter routers based on search and brand filter
  function filterRouters() {
    if (!routerList) return;
    
    const searchTerm = routerSearchInput ? routerSearchInput.value.toLowerCase() : '';
    const brandFilter = routerBrandFilter ? routerBrandFilter.value : '';
    
    // Filter the routers
    const filteredRouters = allRouters.filter(router => {
      const matchesSearch = searchTerm === '' || 
                           router.ip.toLowerCase().includes(searchTerm) || 
                           router.brand.toLowerCase().includes(searchTerm) || 
                           (router.model && router.model.toLowerCase().includes(searchTerm));
      
      const matchesBrand = brandFilter === '' || router.brand === brandFilter;
      
      return matchesSearch && matchesBrand;
    });
    
    displayRouters(filteredRouters);
  }
  
  // Display routers in the list
  function displayRouters(routers) {
    if (!routerList) return;
    
    if (routers.length === 0) {
      routerList.innerHTML = `
        <div class="col-12">
          <div class="alert alert-info" role="alert">
            No routers match your search criteria. Please try a different search term or filter.
          </div>
        </div>
      `;
      return;
    }
    
    routerList.innerHTML = '';
    
    routers.forEach(router => {
      const routerCard = document.createElement('div');
      routerCard.className = 'col-md-4 mb-4';
      routerCard.innerHTML = `
        <div class="card router-card h-100">
          <div class="card-body">
            <h3 class="router-ip">${router.ip}</h3>
            <h4 class="router-brand">${router.brand}</h4>
            ${router.model && `<p class="card-text">Model: ${router.model}</p>`}
            <ul class="list-group list-group-flush mb-3">
              <li class="list-group-item">Default Username: <strong>${router.username || 'admin'}</strong></li>
              <li class="list-group-item">Default Password: <strong>${router.password || 'admin'}</strong></li>
            </ul>
            <a href="/router-guides/${router.ip.replace(/\./g, '-')}" class="btn btn-primary">View Login Guide</a>
          </div>
        </div>
      `;
      
      routerList.appendChild(routerCard);
    });
  }
  
  // Display detailed information for a specific router
  function displayRouterDetails(routerId) {
    const routerDetailContainer = document.getElementById('router-detail');
    if (!routerDetailContainer) return;
    
    const router = allRouters.find(r => r.ip === routerId);
    
    if (!router) {
      routerDetailContainer.innerHTML = `
        <div class="alert alert-danger" role="alert">
          Router information not found. <a href="/router-guides" class="alert-link">Return to router guides</a>.
        </div>
      `;
      return;
    }
    
    // Update page title
    document.title = `${router.ip} - Router Login Guide`;
    
    routerDetailContainer.innerHTML = `
      <div class="router-details">
        <h1 class="router-ip mb-4">${router.ip}</h1>
        <div class="row">
          <div class="col-md-8">
            <div class="card mb-4">
              <div class="card-header">
                <h2>Router Information</h2>
              </div>
              <div class="card-body">
                <table class="table">
                  <tbody>
                    <tr>
                      <th>Brand</th>
                      <td>${router.brand}</td>
                    </tr>
                    ${router.model ? `
                    <tr>
                      <th>Model</th>
                      <td>${router.model}</td>
                    </tr>
                    ` : ''}
                    <tr>
                      <th>Default Username</th>
                      <td><strong>${router.username || 'admin'}</strong></td>
                    </tr>
                    <tr>
                      <th>Default Password</th>
                      <td><strong>${router.password || 'admin'}</strong></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            
            <div class="card mb-4">
              <div class="card-header">
                <h2>Login Instructions</h2>
              </div>
              <div class="card-body">
                <div class="login-instructions">
                  <h3>Steps to Access Your Router:</h3>
                  <ol>
                    <li>Connect your computer to the router via Wi-Fi or Ethernet cable.</li>
                    <li>Open a web browser (Chrome, Firefox, Safari, etc.).</li>
                    <li>Type <strong>${router.ip}</strong> in the address bar and press Enter.</li>
                    <li>When prompted for login credentials, enter:
                      <ul>
                        <li>Username: <strong>${router.username || 'admin'}</strong></li>
                        <li>Password: <strong>${router.password || 'admin'}</strong></li>
                      </ul>
                    </li>
                    <li>Click "Login" or "Submit" to access your router's admin panel.</li>
                  </ol>
                </div>
                
                <div class="default-credentials mt-4">
                  <h3>Important Notes:</h3>
                  <ul>
                    <li>If the default credentials don't work, the router might have been previously configured with custom login information.</li>
                    <li>For security reasons, it's recommended to change the default password after logging in.</li>
                    <li>If you've forgotten a custom password, you may need to reset your router to factory defaults.</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          
          <div class="col-md-4">
            <div class="card mb-4">
              <div class="card-header">
                <h3>Troubleshooting</h3>
              </div>
              <div class="card-body">
                <h4>Can't access ${router.ip}?</h4>
                <ul>
                  <li>Ensure your device is connected to the router's network.</li>
                  <li>Try disabling VPN or proxy services.</li>
                  <li>Clear your browser cache or try a different browser.</li>
                  <li>Check if your router has a different IP address (common alternatives: 192.168.0.1, 10.0.0.1)</li>
                  <li>Restart your router and try again.</li>
                </ul>
                <a href="/blog/common-router-issues" class="btn btn-outline-secondary mt-2">More Troubleshooting Tips</a>
              </div>
            </div>
            
            <div class="card">
              <div class="card-header">
                <h3>Related Guides</h3>
              </div>
              <ul class="list-group list-group-flush">
                <li class="list-group-item"><a href="/blog/how-to-change-wifi-password">How to Change WiFi Password</a></li>
                <li class="list-group-item"><a href="/blog/router-security-tips">Router Security Tips</a></li>
                <li class="list-group-item"><a href="/blog/port-forwarding-guide">Port Forwarding Guide</a></li>
                <li class="list-group-item"><a href="/blog/wifi-channel-optimization">WiFi Channel Optimization</a></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    `;
  }
});
