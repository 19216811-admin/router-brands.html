document.addEventListener('DOMContentLoaded', function() {
  const articleSearch = document.getElementById('article-search');
  const articleList = document.getElementById('article-list');
  let allArticles = [];
  
  // Load articles data if on blog page
  if (articleList) {
    loadArticlesData();
  }
  
  // Get article ID from URL if on detail page
  const currentPath = window.location.pathname;
  const articleMatch = currentPath.match(/\/blog\/(.+)/);
  const articleId = articleMatch ? articleMatch[1] : null;
  
  // Load article detail if on article page
  if (articleId && document.getElementById('article-detail')) {
    loadArticleDetail(articleId);
  }
  
  // Search functionality for articles
  if (articleSearch) {
    articleSearch.addEventListener('input', function() {
      filterArticles(articleSearch.value.toLowerCase());
    });
    
    // Check if search term is in URL
    const searchTerm = getUrlParam('search');
    if (searchTerm) {
      articleSearch.value = searchTerm;
      filterArticles(searchTerm.toLowerCase());
    }
  }
  
  // Get search term from URL if provided
  function getUrlParam(param) {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    return urlParams.get(param);
  }
  
  // Load articles data
  function loadArticlesData() {
    fetch('/static/data/articles.json')
      .then(response => response.json())
      .then(data => {
        allArticles = data;
        displayArticles(allArticles);
      })
      .catch(error => {
        console.error('Error loading articles:', error);
        if (articleList) {
          articleList.innerHTML = `
            <div class="alert alert-danger" role="alert">
              Failed to load articles. Please try again later.
            </div>
          `;
        }
      });
  }
  
  // Filter articles based on search term
  function filterArticles(searchTerm) {
    if (!articleList) return;
    
    const filteredArticles = allArticles.filter(article => {
      return article.title.toLowerCase().includes(searchTerm) || 
             article.category.toLowerCase().includes(searchTerm) || 
             article.preview.toLowerCase().includes(searchTerm);
    });
    
    displayArticles(filteredArticles);
  }
  
  // Display articles in the list
  function displayArticles(articles) {
    if (!articleList) return;
    
    if (articles.length === 0) {
      articleList.innerHTML = `
        <div class="alert alert-info" role="alert">
          No articles match your search criteria. Please try a different search term.
        </div>
      `;
      return;
    }
    
    articleList.innerHTML = '';
    
    articles.forEach(article => {
      const articleCard = document.createElement('div');
      articleCard.className = 'col-md-6 mb-4';
      articleCard.innerHTML = `
        <div class="card h-100">
          <div class="card-body">
            <h3 class="card-title">${article.title}</h3>
            <p class="article-date">${article.date} - <span class="badge bg-secondary">${article.category}</span></p>
            <p class="article-preview">${article.preview}</p>
            <a href="/blog/${article.id}" class="btn btn-primary">Read More</a>
          </div>
        </div>
      `;
      
      articleList.appendChild(articleCard);
    });
  }
  
  // Load detailed information for a specific article
  function loadArticleDetail(articleId) {
    const articleDetailContainer = document.getElementById('article-detail');
    if (!articleDetailContainer) return;
    
    fetch('/static/data/articles.json')
      .then(response => response.json())
      .then(data => {
        const article = data.find(a => a.id === articleId);
        
        if (!article) {
          articleDetailContainer.innerHTML = `
            <div class="alert alert-danger" role="alert">
              Article not found. <a href="/blog" class="alert-link">Return to blog</a>.
            </div>
          `;
          return;
        }
        
        // Update page title
        document.title = `${article.title} - Router Login Guide`;
        
        articleDetailContainer.innerHTML = `
          <div class="article-container">
            <h1 class="display-4 mb-3">${article.title}</h1>
            <p class="article-date mb-4">
              Published on ${article.date} - 
              <span class="badge bg-secondary">${article.category}</span>
            </p>
            
            <div class="article-content">
              ${article.content}
            </div>
            
            <hr class="my-4">
            
            <div class="article-footer">
              <div class="row">
                <div class="col-md-6">
                  <h4>Related Articles:</h4>
                  <ul class="list-group list-group-flush mb-4">
                    ${article.related.map(relatedId => {
                      const relatedArticle = data.find(a => a.id === relatedId);
                      return relatedArticle ? 
                        `<li class="list-group-item"><a href="/blog/${relatedArticle.id}">${relatedArticle.title}</a></li>` :
                        '';
                    }).join('')}
                  </ul>
                </div>
                
                <div class="col-md-6">
                  <h4>Tags:</h4>
                  <div class="mb-4">
                    ${article.tags.map(tag => 
                      `<a href="/blog?search=${encodeURIComponent(tag)}" class="badge bg-primary text-decoration-none me-2 mb-2">${tag}</a>`
                    ).join('')}
                  </div>
                </div>
              </div>
              
              <a href="/blog" class="btn btn-outline-secondary">← Back to All Articles</a>
            </div>
          </div>
        `;
      })
      .catch(error => {
        console.error('Error loading article details:', error);
        if (articleDetailContainer) {
          articleDetailContainer.innerHTML = `
            <div class="alert alert-danger" role="alert">
              Failed to load article details. Please try again later.
            </div>
          `;
        }
      });
  }
});
