export function initFooter() {
  const footerEl = document.getElementById('footer');
  
  const footer = document.createElement('footer');
  footer.className = 'bg-dark text-white mt-5 py-4';
  footer.innerHTML = `
    <div class="container text-center">
      <p class="mb-2">&copy; 2026 Dog Haven. All rights reserved.</p>
      <p class="mb-0 small text-muted">Built with Vite, Bootstrap and vanilla JavaScript</p>
    </div>
  `;
  
  footerEl.appendChild(footer);
}
