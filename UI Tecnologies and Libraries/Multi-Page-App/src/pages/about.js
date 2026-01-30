export const AboutPage = {
  render(container) {
    container.innerHTML = `
      <div class="container py-5">
        <h1 class="mb-4">About Dog Haven</h1>
        
        <div class="row">
          <div class="col-lg-8">
            <div class="card shadow-sm mb-4">
              <div class="card-body">
                <h2 class="card-title mb-3">Our Mission</h2>
                <p class="card-text">
                  Dog Haven is dedicated to helping people learn about different dog breeds, find their perfect 
                  companion, and maintain a comprehensive dog database. We believe in connecting dog lovers with 
                  information that helps them make informed decisions.
                </p>
              </div>
            </div>

            <div class="card shadow-sm mb-4">
              <div class="card-body">
                <h2 class="card-title mb-3">What We Offer</h2>
                <ul class="list-group list-group-flush">
                  <li class="list-group-item">📚 Detailed information about different dog breeds</li>
                  <li class="list-group-item">🔍 Browse and search through our dog database</li>
                  <li class="list-group-item">⚙️ Administrative tools to manage dog information</li>
                  <li class="list-group-item">📱 Responsive design for all devices</li>
                  <li class="list-group-item">🚀 Fast and reliable web application</li>
                </ul>
              </div>
            </div>

            <div class="card shadow-sm">
              <div class="card-body">
                <h2 class="card-title mb-3">Technology Stack</h2>
                <p class="card-text">
                  Built with modern web technologies:
                </p>
                <div class="d-flex flex-wrap gap-2">
                  <span class="badge bg-primary">HTML5</span>
                  <span class="badge bg-success">CSS3</span>
                  <span class="badge bg-info">JavaScript</span>
                  <span class="badge bg-warning text-dark">Bootstrap 5</span>
                  <span class="badge bg-danger">Vite</span>
                </div>
              </div>
            </div>
          </div>

          <div class="col-lg-4">
            <div class="card shadow-sm">
              <div class="card-body text-center">
                <h3 class="display-1 mb-3">🎯</h3>
                <h5 class="card-title">Our Goal</h5>
                <p class="card-text">To provide the best dog information and management platform for enthusiasts and professionals.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }
};
