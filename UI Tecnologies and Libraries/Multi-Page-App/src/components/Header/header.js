export function initHeader() {
  const headerEl = document.getElementById('header');
  
  // Create header element
  const header = document.createElement('header');
  header.className = 'bg-dark text-white sticky-top shadow-sm';
  header.innerHTML = `
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
      <div class="container">
        <a class="navbar-brand" href="/">🐕 Dog Haven</a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav ms-auto">
            <li class="nav-item">
              <a class="nav-link" href="/">Home</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="/dogs">Dogs</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="/adoptions">Adoptions</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="/purchases">Purchases</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="/about">About</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="/contact">Contact</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="/admin">Admin</a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  `;
  
  headerEl.appendChild(header);

  // Update active nav links
  updateActiveNav();
}

export function updateActiveNav() {
  const currentPath = window.location.pathname;
  document.querySelectorAll('.navbar-nav .nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === '/' && currentPath === '/') {
      link.classList.add('active');
    } else if (href !== '/' && currentPath.startsWith(href)) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}
