export const HomePage = {
  render(container) {
    container.innerHTML = `
      <div class="container">
        <div class="row align-items-center my-5">
          <div class="col-lg-6">
            <h1 class="display-4 fw-bold mb-4">Welcome to Dog Haven</h1>
            <p class="lead mb-3">Discover amazing dogs and learn everything about them!</p>
            <p class="mb-4">Our platform allows you to browse beautiful dogs, view their details, and manage a dog database with administrative features.</p>
            <div class="d-flex gap-3">
              <a href="/dogs" class="btn btn-primary btn-lg">Browse Dogs</a>
              <a href="/about" class="btn btn-outline-primary btn-lg">Learn More</a>
            </div>
          </div>
          <div class="col-lg-6">
            <img src="https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=600&h=400&fit=crop" 
                 alt="Dogs" class="img-fluid rounded shadow">
          </div>
        </div>

        <div class="row mt-5 py-5 border-top">
          <div class="col-md-4 text-center mb-4">
            <div class="display-1 text-primary mb-3">🐕</div>
            <h3>Browse Dogs</h3>
            <p>Explore our collection of beautiful dogs with detailed information</p>
          </div>
          <div class="col-md-4 text-center mb-4">
            <div class="display-1 text-success mb-3">✏️</div>
            <h3>Admin Panel</h3>
            <p>Manage dogs with add, edit, and delete functionality</p>
          </div>
          <div class="col-md-4 text-center mb-4">
            <div class="display-1 text-info mb-3">📱</div>
            <h3>Responsive Design</h3>
            <p>Works perfectly on desktop, tablet, and mobile devices</p>
          </div>
        </div>
      </div>
    `;
  }
};
