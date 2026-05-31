document.addEventListener('DOMContentLoaded', async () => {



  const sidebar = document.getElementById('sidebar');
  const content = document.getElementById('content');
  const sidebarMinWidth = 200;
  const phi = (1 + Math.sqrt(5)) / 2;

  // THEME LOGIC
  function setTheme(mode) {
    if (mode === 'dark') {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
    const icon = document.getElementById('theme-icon');
    if (icon) icon.textContent = mode === 'dark' ? 'light_mode' : 'dark_mode';
  }

  function getSystemTheme() {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  const savedTheme = localStorage.getItem('theme');
  setTheme(savedTheme || getSystemTheme());

  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
    if (!localStorage.getItem('theme')) setTheme(e.matches ? 'dark' : 'light');
  });

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
    },
    'entity-architecture-guide': {
      title: 'Entity Architecture',
      file: 'Entity-Architecture-Guide',
      toc: [
        'Core RTS Architecture Philosophy',
        'The Biggest RTS Mistakes',
        'Recommended Architecture',
        'Why ECS Is The Best Choice',
        'Entity Design',
        'Component Design',
        'Health Systems',
        'Damage Systems',
        'Ability Systems',
        'Tech Tree Architecture',
        'Upgrade Systems',
        'Buffs & Debuffs',
        'State Machines',
        'Networking Architecture',
        'Deterministic Simulation',
        'Performance Scaling',
        'Memory Optimization',
        'Serialization',
        'Rendering Separation',
        'Example ECS Layout',
        'Recommended Project Structure',
        'Example TypeScript Code',
        'Best Practices',
        'Scaling Strategy',
        'Final Recommendations'
      ]
    }
  };

  const navResp = await fetch('/pages/links.html');
  const navHtml = await navResp.text();

  sidebar.innerHTML = navHtml;

  const themeBtn = document.querySelector('.theme-toggle-btn');
  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      const current = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
      setTheme(current === 'dark' ? 'light' : 'dark');
    });
  }

  const guidesChildren = document.getElementById('guides-children');
  const guidesToggle = document.getElementById('guides-toggle');
  const guidesIcon = document.getElementById('guides-icon1');
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

    pageLink.addEventListener('click', () => {
      const toc = document.getElementById(`toc-${key}`);
      if (toc) toc.classList.toggle('hidden');
    });
  });

  guidesToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    guidesOpen = !guidesOpen;
    guidesChildren.classList.toggle('hidden', !guidesOpen);
    guidesIcon.textContent = guidesOpen ? 'arrow_drop_up' : 'arrow_right';
  });

  function slugify(text) {
    return text.toLowerCase()
      .replace(/&/g, 'and')
      .replace(/\./g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }

  async function loadGuidePage(pageKey) {
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
      }
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
        <div class="max-w-2xl mx-auto mt-16 text-center">
          <span class="material-icons text-6xl text-gray-300 mb-4">error_outline</span>
          <h2 class="text-2xl font-semibold text-gray-600 mb-2">Page Not Found</h2>
          <p class="text-gray-400 mb-6">We couldn't find the page "<span class="font-mono text-gray-500">${page}</span>". It may have been moved or doesn't exist yet.</p>
          <p class="text-sm text-gray-400">Try selecting a page from the navigation sidebar.</p>
        </div>`;
    }
  }

  sidebar.addEventListener('click', (e) => {
    if (e.target.closest('.toc-links')) return;

    const link = e.target.closest('[data-page]');
    if (!link) return;
    e.preventDefault();

    const page = link.dataset.page;

    loadPage(page);
  });

  loadPage('home');
});
