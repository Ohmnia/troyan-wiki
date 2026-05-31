// Wiki functionality with dynamic sidebar width
document.addEventListener('DOMContentLoaded', () => {
  const sidebar = document.getElementById('sidebar');
  const mainContent = document.getElementById('main-content');
  const content = document.getElementById('content');
  const navItems = document.querySelectorAll('.nav-item');
  const sidebarMinWidth = 200;
  
  // Golden ratio
  const phi = (1 + Math.sqrt(5)) / 2;
  
  // Function to calculate and set sidebar width
  function updateSidebarWidth() {
    const totalWidth = window.innerWidth;
    const sidebarWidth = Math.round(totalWidth * (1 - (1 / phi)) / 2);
    sidebar.style.width = `${sidebarWidth}px`;
    sidebar.style.minWidth = `${Math.max(sidebarWidth, sidebarMinWidth)}px`;
  }
  
  // Set initial width
  updateSidebarWidth();
  
  // Update width on resize
  window.addEventListener('resize', updateSidebarWidth);
  
  // Handle navigation clicks
  navItems.forEach(item => {
    item.addEventListener('click', () => {
      // Update active state
      navItems.forEach(i => i.classList.remove('bg-indigo-50', 'text-indigo-600', 'font-medium'));
      item.classList.add('bg-indigo-50', 'text-indigo-600', 'font-medium');
      
      // Load content based on data-page attribute
      const page = item.getAttribute('data-page');
      loadPageContent(page);
    });
  });
  
  // Set first item as active by default
  if (navItems.length > 0) {
    navItems[0].classList.add('bg-indigo-50', 'text-indigo-600', 'font-medium');
    loadPageContent(navItems[0].getAttribute('data-page'));
  }
  
  // Function to load page content
  async function loadPageContent(page) {
    try {
      // Show loading state
      content.innerHTML = '<p class="text-gray-500">Loading...</p>';
      
      // Fetch the markdown file
      const response = await fetch(`/pages/${page}.md`);
      if (!response.ok) {
        throw new Error(`Failed to load ${page}.md`);
      }
      
      const markdown = await response.text();
      
      // Convert markdown to HTML using marked.js
      const html = marked.parse(markdown);
      
      // Update content
      content.innerHTML = `
        <div class="prose prose-indigo max-w-none">
          ${html}
        </div>
      `;
    } catch (error) {
      console.error('Error loading page:', error);
      content.innerHTML = `
        <div class="prose prose-indigo max-w-none">
          <h2 class="text-indigo-800 font-bold mb-4">Error Loading Page</h2>
          <p class="text-gray-600">Failed to load ${page}. Please check if the file exists.</p>
        </div>
      `;
    }
  }
  
  // Make marked available globally for potential use
  window.marked = marked;
});