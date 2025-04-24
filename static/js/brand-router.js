document.addEventListener('DOMContentLoaded', function() {
  // Get the brand name from the URL
  const currentPath = window.location.pathname;
  const brandMatch = currentPath.match(/\/(.+)-router-login\//);
  const brandName = brandMatch ? brandMatch[1] : null;
  
  // DOM elements
  const brandRouterList = document.getElementById('brand-router-list');
  const brandRouterSearch = document.getElementById('brand-router-search');
  const brandIpList = document.getElementById('brand-ip-list');
  const directIpLoginButtons = document.querySelector('.direct-ip-login-buttons');
  const defaultIpAddress = document.getElementById('default-ip-address');
  
  // Store all routers of this brand
  let brandRouters = [];
  
  // Load all routers data and filter by brand
  if (brandName && (brandRouterList || brandIpList)) {
    loadBrandRoutersData(brandName);
  }
  
  // Search functionality for brand router models
  if (brandRouterSearch) {
    brandRouterSearch.addEventListener('input', filterBrandRouters);
  }
  
  // Load router data for a specific brand
  function loadBrandRoutersData(brand) {
    fetch('/static/data/routers.json')
      .then(response => response.json())
      .then(data => {
        // Filter routers by the specified brand (case-insensitive)
        brandRouters = data.filter(router => 
          router.brand.toLowerCase() === brand.toLowerCase()
        );
        
        // Display brand-specific routers
        if (brandRouterList) {
          if (brandRouters.length === 0) {
            displayNoBrandRoutersMessage();
          } else {
            displayBrandRouters(brandRouters);
          }
        }
        
        // Display common IPs for this brand in sidebar
        if (brandIpList) {
          displayBrandIPs(brandRouters);
        }
        
        // Display direct IP login buttons below the title
        if (directIpLoginButtons) {
          displayDirectLoginButtons(brandRouters);
        }
      })
      .catch(error => {
        console.error('Error loading router data:', error);
        if (brandRouterList) {
          brandRouterList.innerHTML = `
            <div class="col-12">
              <div class="alert alert-danger" role="alert">
                Failed to load router information. Please try again later.
              </div>
            </div>
          `;
        }
      });
  }
  
  // Filter brand routers based on search input
  function filterBrandRouters() {
    if (!brandRouterList || !brandRouterSearch) return;
    
    const searchTerm = brandRouterSearch.value.toLowerCase();
    
    // Filter the routers by search term
    const filteredRouters = brandRouters.filter(router => {
      return searchTerm === '' || 
             router.ip.toLowerCase().includes(searchTerm) || 
             (router.model && router.model.toLowerCase().includes(searchTerm));
    });
    
    if (filteredRouters.length === 0) {
      brandRouterList.innerHTML = `
        <div class="col-12">
          <div class="alert alert-info" role="alert">
            No routers match your search criteria. Please try a different search term.
          </div>
        </div>
      `;
    } else {
      displayBrandRouters(filteredRouters);
    }
  }
  
  // Display message when no routers for this brand are found
  function displayNoBrandRoutersMessage() {
    if (!brandRouterList) return;
    
    brandRouterList.innerHTML = `
      <div class="col-12">
        <div class="alert alert-info" role="alert">
          No ${brandName.charAt(0).toUpperCase() + brandName.slice(1)} routers found in our database. 
          Please check our <a href="/router-guides" class="alert-link">router guides</a> for other brands.
        </div>
      </div>
    `;
  }
  
  // Display routers for the specific brand
  function displayBrandRouters(routers) {
    if (!brandRouterList) return;
    
    brandRouterList.innerHTML = '';
    
    routers.forEach(router => {
      const routerCard = document.createElement('div');
      routerCard.className = 'col-md-6 mb-4';
      routerCard.innerHTML = `
        <div class="card router-card h-100">
          <div class="card-body">
            <h4 class="card-title">${router.model || 'Generic Model'}</h4>
            <h5 class="card-subtitle mb-2 text-muted">${router.ip}</h5>
            <ul class="list-group list-group-flush mb-3">
              <li class="list-group-item">Default Username: <strong>${router.username || 'admin'}</strong></li>
              <li class="list-group-item">Default Password: <strong>${router.password || 'admin'}</strong></li>
            </ul>
            <a href="/router-guides/${router.ip.replace(/\./g, '-')}" class="btn btn-primary">View Detailed Guide</a>
          </div>
        </div>
      `;
      
      brandRouterList.appendChild(routerCard);
    });
  }
  
  // Display common IPs for this brand in sidebar with direct login buttons
  function displayBrandIPs(routers) {
    if (!brandIpList) return;
    
    // Clear loading placeholder
    brandIpList.innerHTML = '';
    
    if (routers.length === 0) {
      const noIpItem = document.createElement('div');
      noIpItem.className = 'list-group-item';
      noIpItem.innerHTML = 'No IP addresses found for this brand.';
      brandIpList.appendChild(noIpItem);
      return;
    }
    
    // Get unique IPs
    const uniqueIPs = [...new Set(routers.map(router => router.ip))];
    
    // Add IPs to the list with direct login buttons
    uniqueIPs.forEach(ip => {
      const ipItem = document.createElement('div');
      ipItem.className = 'list-group-item';
      
      // Create IP address display
      const ipDisplay = document.createElement('div');
      ipDisplay.className = 'd-flex justify-content-between align-items-center mb-2';
      ipDisplay.innerHTML = `
        <span class="fw-bold">${ip}</span>
        <a href="/router-guides/${ip.replace(/\./g, '-')}" class="btn btn-sm btn-outline-primary">Details</a>
      `;
      
      // Create direct login button
      const loginButton = document.createElement('a');
      loginButton.href = `http://${ip}`;
      loginButton.target = '_blank';
      loginButton.rel = 'noopener noreferrer';
      loginButton.className = 'btn btn-primary d-block mt-2';
      loginButton.innerHTML = `<i class="fas fa-sign-in-alt me-2"></i> Direct Login to ${ip}`;
      
      // Add elements to the item
      ipItem.appendChild(ipDisplay);
      ipItem.appendChild(loginButton);
      
      brandIpList.appendChild(ipItem);
    });
  }
  
  // Display direct IP login buttons below the title
  function displayDirectLoginButtons(routers) {
    if (!directIpLoginButtons) return;
    
    // Clear loading placeholder
    directIpLoginButtons.innerHTML = '';
    
    if (routers.length === 0) {
      directIpLoginButtons.innerHTML = '<div class="alert alert-info">No IP addresses found for this brand.</div>';
      return;
    }
    
    // Get unique IPs
    const uniqueIPs = [...new Set(routers.map(router => router.ip))];
    
    // Create direct login buttons for each unique IP
    uniqueIPs.forEach((ip, index) => {
      const loginButton = document.createElement('a');
      loginButton.href = `http://${ip}`;
      loginButton.target = '_blank';
      loginButton.rel = 'noopener noreferrer';
      loginButton.className = 'btn btn-lg btn-primary me-2 mb-2';
      loginButton.innerHTML = `<i class="fas fa-sign-in-alt me-2"></i> ${ip}`;
      
      directIpLoginButtons.appendChild(loginButton);
      
      // Update the default IP address in the instructions with the first IP
      if (index === 0 && defaultIpAddress) {
        defaultIpAddress.textContent = ip;
        defaultIpAddress.innerHTML = `<a href="http://${ip}" target="_blank" rel="noopener noreferrer">${ip}</a>`;
      }
    });
  }
});