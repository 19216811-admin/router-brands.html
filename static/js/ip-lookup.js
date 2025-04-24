document.addEventListener('DOMContentLoaded', function() {
  const ipDisplay = document.getElementById('ip-address');
  const ipDetails = document.getElementById('ip-details');
  const lookupBtn = document.getElementById('lookup-btn');
  const loadingSpinner = document.getElementById('loading-spinner');

  if (lookupBtn) {
    fetchIpInfo();
    lookupBtn.addEventListener('click', fetchIpInfo);
  }

  function fetchIpInfo() {
    ipDisplay.textContent = 'Loading...';
    loadingSpinner?.classList.remove('d-none');
    ipDetails.innerHTML = '';

    fetch('https://ipinfo.io/json?token=56ce5f0209ac39') // Replace with your token if needed
      .then(response => {
        if (!response.ok) throw new Error('Network response was not ok');
        return response.json();
      })
      .then(data => {
        loadingSpinner?.classList.add('d-none');
        ipDisplay.textContent = data.ip || 'Unknown';

        const [lat, lon] = (data.loc || '').split(',');
        const ipType = data.ip.includes(':') ? 'IPv6' : 'IPv4';

        ipDetails.innerHTML = `
          <div class="card mb-3">
            <div class="card-body">
              <h5 class="card-title">IP Information</h5>
              <table class="table table-striped">
                <tbody>
                  <tr>
                    <th scope="row">IP Address</th>
                    <td>${data.ip || 'N/A'}</td>
                  </tr>
                  <tr>
                    <th scope="row">IP Type</th>
                    <td>${ipType}</td>
                  </tr>
                  <tr>
                    <th scope="row">Location</th>
                    <td>${data.city || ''}, ${data.region || ''}, ${data.country || ''}</td>
                  </tr>
                  <tr>
                    <th scope="row">Latitude</th>
                    <td>${lat || 'Unknown'}</td>
                  </tr>
                  <tr>
                    <th scope="row">Longitude</th>
                    <td>${lon || 'Unknown'}</td>
                  </tr>
                  <tr>
                    <th scope="row">ISP / Organization</th>
                    <td>${data.org || 'Unknown'}</td>
                  </tr>
                  <tr>
                    <th scope="row">Hostname</th>
                    <td>${data.hostname || 'Unknown'}</td>
                  </tr>
                  <tr>
                    <th scope="row">Timezone</th>
                    <td>${data.timezone || 'Unknown'}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        `;
      })
      .catch(error => {
        console.error('Error fetching IP info:', error);
        loadingSpinner?.classList.add('d-none');
        ipDisplay.textContent = 'Error loading IP';
        ipDetails.innerHTML = `
          <div class="alert alert-danger" role="alert">
            Failed to load IP information. Please try again later.
          </div>
        `;
      });
  }
});
