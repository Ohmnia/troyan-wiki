document.addEventListener('DOMContentLoaded', async () => {
  const sidebar = document.getElementById('sidebar');
  const content = document.getElementById('content');
  const sidebarMinWidth = 200;
  const phi = (1 + Math.sqrt(5)) / 2;

  function updateSidebarWidth() {
    const totalWidth = window.innerWidth;
    const sidebarWidth = Math.round(totalWidth * (1 - (1 / phi)) / 2);
    sidebar.style.width = `${sidebarWidth}px`;
    sidebar.style.minWidth = `${Math.max(sidebarWidth, sidebarMinWidth)}px`;
  }
  updateSidebarWidth();
  window.addEventListener('resize', updateSidebarWidth);

  const guides = {
    'environment-development-guide': {
      title: 'Environment Development',
      file: 'Environment-Development-Guide',
      toc: [
        'Philosophy of Browser RTS Rendering',
        'Recommended Stack',
        'Architecture for Massive RTS Worlds',
        'Rendering Strategy',
        'Procedural Environments vs Textures',
        'Terrain Rendering Techniques',
        'Texture Optimization',
        'Bump Maps, Normal Maps, Parallax & PBR',
        'Shader Languages Explained',
        'WebGL vs WebGPU',
        'Best Environment Techniques',
        'Performance Optimization',
        'Instancing & Draw Call Reduction',
        'Streaming & LOD Systems',
        'Atmospheric Effects',
        'Fog of War Techniques',
        'Asset Pipeline',
        'TypeScript Architecture',
        'Production Rendering Pipeline',
        'Best Professional Three.js References',
        'Example Code',
        'Final Recommendations'
      ]
    }
  };

  const navResp = await fetch('/pages/links.html');
  const navHtml = await navResp.text();
  sidebar.innerHTML = navHtml;

  const guidesChildren = document.getElementById('guides-children');
  const guidesToggle = document.getElementById('guides-toggle');
  const guidesIcon = document.getElementById('guides-icon');
  let guidesOpen = false;

  const guideKeys = Object.keys(guides);
  guideKeys.forEach(key => {
    const guide = guides[key];
    const wrapper = document.createElement('div');
    wrapper.className = 'guide-wrapper';

    const pageLink = document.createElement('a');
    pageLink.href = '#';
    pageLink.className = 'flex items-center px-2 py-1 rounded-md text-sm hover:bg-cyan-700 transition-colors cursor-pointer';
    pageLink.dataset.page = key;
    pageLink.dataset.guide = key;
    pageLink.innerHTML = `<span class="material-icons md-18 text-white">menu_book</span><span class="ml-2 text-white">${guide.title}</span>`;
    wrapper.appendChild(pageLink);

    const tocContainer = document.createElement('div');
    tocContainer.className = 'toc-links ml-4 space-y-1 hidden';
    tocContainer.id = `toc-${key}`;
    wrapper.appendChild(tocContainer);
    guidesChildren.appendChild(wrapper);
  });

  guidesToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    guidesOpen = !guidesOpen;
    guidesChildren.classList.toggle('hidden', !guidesOpen);
    guidesIcon.textContent = guidesOpen ? 'expand_circle_down' : 'expand_circle_right';
  });

  function collapseGuides() {
    guidesOpen = false;
    guidesChildren.classList.add('hidden');
    guidesIcon.textContent = 'expand_circle_right';
    document.querySelectorAll('.toc-links').forEach(el => el.classList.add('hidden'));
  }

  document.addEventListener('click', (e) => {
    if (guidesOpen && !e.target.closest('#guides-section')) {
      collapseGuides();
    }
  });

  function slugify(text) {
    return text.toLowerCase()
      .replace(/&/g, 'and')
      .replace(/\./g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }

  async function loadGuidePage(pageKey) {
    document.querySelectorAll('.toc-links').forEach(el => el.classList.add('hidden'));

    const guide = guides[pageKey];
    const resp = await fetch(`/pages/${guide.file}.html`);
    if (!resp.ok) throw new Error(`Failed to load ${pageKey}.html`);
    const html = await resp.text();
    content.innerHTML = html;

    const tocEl = document.getElementById(`toc-${pageKey}`);
    if (tocEl) {
      const guide = guides[pageKey];
      if (guide) {
        tocEl.innerHTML = '';
        guide.toc.forEach(heading => {
          const anchor = slugify(heading);
          const link = document.createElement('span');
          link.className = 'flex items-center px-2 py-1 rounded-md text-xs hover:bg-cyan-700 transition-colors cursor-pointer toc-link';
          link.dataset.target = anchor;
          link.tabIndex = 0;
          link.role = 'link';
          link.innerHTML = `<span class="material-icons md-14 text-cyan-300" style="font-size:14px">chevron_right</span><span class="ml-1 text-gray-300">${heading}</span>`;
          link.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const target = document.querySelector(`[name="${anchor}"]`);
            if (target) {
              target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
          });
          tocEl.appendChild(link);
        });
        tocEl.classList.remove('hidden');
      }
    }

    if (!guidesOpen) {
      guidesOpen = true;
      guidesChildren.classList.remove('hidden');
      guidesIcon.textContent = 'expand_circle_down';
    }
  }

  async function loadPage(page) {
    if (page === 'home') {
      content.innerHTML = `
        <div class="prose prose-cyan max-w-none">
          <h1 class="text-gray-500">Welcome</h1>
          <p class="text-blue-500">Select a page from the navigation to view content.</p>
        </div>`;
      return;
    }

    try {
      content.innerHTML = '<p class="text-gray-500">Loading...</p>';

      if (guides[page]) {
        await loadGuidePage(page);
        return;
      }

      const resp = await fetch(`/pages/${page}.html`);
      if (!resp.ok) throw new Error(`Failed to load ${page}`);
      const html = await resp.text();
      content.innerHTML = html;
    } catch (error) {
      console.error('Error loading page:', error);
      content.innerHTML = `
        <div class="prose prose-indigo max-w-none">
          <h2 class="text-indigo-800 font-bold mb-4">Error Loading Page</h2>
          <p class="text-gray-600">Failed to load ${page}.</p>
        </div>`;
    }
  }

  sidebar.addEventListener('click', (e) => {
    if (e.target.closest('.toc-links')) return;

    const link = e.target.closest('[data-page]');
    if (!link) return;
    e.preventDefault();

    const page = link.dataset.page;

    if (!link.dataset.guide) {
      collapseGuides();
    }

    loadPage(page);
  });

  loadPage('home');
});
