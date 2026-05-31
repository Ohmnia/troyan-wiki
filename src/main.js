document.addEventListener('DOMContentLoaded', async () => {

  const hljsModule = await import('highlight.js');
  const hljs = hljsModule.default;

  const sidebar = document.getElementById('sidebar');
  const content = document.getElementById('content');
  let scrollSpyHandler = null;
  let advanceHandler = null;
  let currentGuideIndex = -1;
  let advanceTriggered = false;
  let pageLoading = false;
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
      icon: 'terrain',
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
      icon: 'hub',
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
    },
    'character-animation-guide': {
      title: 'Character Animation',
      icon: 'directions_run',
      file: 'Character-Animation-Guide',
      toc: [
        'RTS Animation Philosophy',
        'Biggest Animation Mistakes',
        'Best RTS Animation Strategy',
        'Skeletal Animation vs Vertex Animation',
        'Why RTS Animation Is Different',
        'The Illusion of Motion',
        'Best Unit Animation Architecture',
        'Animation LOD Systems',
        'GPU Animation Techniques',
        'Animation Compression',
        'Instanced Animation',
        'Root Motion vs Simulated Movement',
        'Blend Trees',
        'Animation State Machines',
        'Crowd Animation Techniques',
        'Procedural Animation',
        'Animation Timing Tricks',
        'Unit Turning',
        'Terrain Adaptation',
        'Foot Sliding Prevention',
        'Wind, Secondary Motion & Microanimation',
        'Best RTS Readability Practices',
        'Memory Optimization',
        'Best File Formats',
        'Networking Animation',
        'Recommended Animation Pipeline',
        'Three.js Animation Best Practices',
        'Example TypeScript Code',
        'Best Professional References',
        'Free/Open Source Resources',
        'Final Recommendations'
      ]
    },
    'high-performance-guide': {
      title: 'High Performance',
      icon: 'bolt',
      file: 'High-Performance-Guide',
      toc: [
        'Why GLB Is the Preferred Format',
        'Asset Pipeline',
        'Blender Export Settings',
        'Compression',
        'Gold Standard Loader Setup',
        'Asset Cache System',
        'Clone Correctly',
        'InstancedMesh: The RTS Superpower',
        'GPU-Friendly RTS Unit Design',
        'Level of Detail (LOD)',
        'Frustum Culling',
        'Texture Best Practices',
        'Animation Optimization',
        'Shadow Optimization',
        'Object Pooling',
        'Worker-Based Pathfinding',
        'Massive Army Architecture',
        'Asset Streaming',
        'Production-Grade Renderer Settings',
        'Ultra-Fast Asset Manager',
        'Performance Targets',
        'Elite RTS Checklist',
        'Architecture Used by the Fastest Browser RTS Games',
        'The Single Most Important Rule'
      ]
    },
    'strategy-game-engineering-bible': {
      title: 'Strategy Engineering Bible',
      icon: 'auto_stories',
      file: 'Strategy-Game-Engineering-Bible',
      toc: [
        'Purpose of This Document',
        'The First Law of Game Development',
        'The Second Law of RTS Development',
        'The Third Law of Solo Development',
        'Core Engineering Philosophy',
        'Delta Time',
        'Fixed Timestep',
        'Collision Detection',
        'Pathfinding',
        'AI Engineering',
        'Performance Engineering',
        'Object Pooling',
        'Memory Management',
        'Entity Component Systems (ECS)',
        'Rendering Philosophy',
        'Shadows',
        'Particle Systems',
        'Networking',
        'Game Feel',
        'Strategy Game UX',
        'RTS Camera Rules',
        'Content Pipelines',
        'Modularity',
        'Art Direction',
        'The Biggest RTS Development Trap',
        'Solo Developer Survival Rules',
        'Final Engineering Doctrine',
        'Final Thought'
      ]
    }
  };

  const guideOrder = Object.keys(guides);

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
  const guidesSection = document.getElementById('guides-section');
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
    pageLink.innerHTML = `<span class="material-icons md-18 text-white">${guide.icon}</span><span class="ml-2 text-white">${guide.title}</span>`;
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
    guidesIcon.textContent = guidesOpen ? 'arrow_drop_down' : 'arrow_right';
    guidesSection.classList.toggle('section-expanded', guidesOpen);
  });

  const docsToggle = document.getElementById('docs-toggle');
  const docsChildren = document.getElementById('docs-children');
  const docsIcon = document.getElementById('docs-icon');
  const docsSection = document.getElementById('docs-section');
  let docsOpen = false;

  docsToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    docsOpen = !docsOpen;
    docsChildren.classList.toggle('hidden', !docsOpen);
    docsIcon.textContent = docsOpen ? 'arrow_drop_down' : 'arrow_right';
    docsSection.classList.toggle('section-expanded', docsOpen);
  });

  const assetsToggle = document.getElementById('assets-toggle');
  const assetsChildren = document.getElementById('assets-children');
  const assetsIcon = document.getElementById('assets-icon');
  const assetsSection = document.getElementById('assets-section');
  let assetsOpen = false;

  assetsToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    assetsOpen = !assetsOpen;
    assetsChildren.classList.toggle('hidden', !assetsOpen);
    assetsIcon.textContent = assetsOpen ? 'arrow_drop_down' : 'arrow_right';
    assetsSection.classList.toggle('section-expanded', assetsOpen);
  });

  function slugify(text) {
    return text.toLowerCase()
      .replace(/&/g, 'and')
      .replace(/\./g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }

  function highlightCode() {
    const pres = content.querySelectorAll('pre');
    pres.forEach(pre => {
      if (pre.querySelector('.hljs')) return;
      const text = pre.textContent.trim();
      if (!text) return;
      const code = document.createElement('code');
      code.textContent = pre.textContent;
      pre.innerHTML = '';
      pre.appendChild(code);

      let lang = 'plaintext';
      if (/\b(THREE\.|new THREE\.|from\s+['"]three['"]|renderer\.|scene\.|camera\.|mesh\.|geometry\.|material\.)/.test(text)) lang = 'javascript';
      else if (
        /^(import|export|const|let|var|function|class|interface|type|enum|abstract|namespace|async|await)\b/.test(text) ||
        /:\s*(string|number|boolean|void|any|never|unknown)\b/.test(text)
      ) lang = 'typescript';
      else if (/^(def |class\s+\w+:|import\s+\w+|from\s+\w+|print\()/m.test(text)) lang = 'python';
      else if (/\b(vec[234]|float|texture|uniform|varying|gl_|sampler|mat[34])\b/.test(text)) lang = 'glsl';
      else if (/^(npm|yarn|pnpm|npx|cd\s|mkdir\s|rm\s|cp\s|git\s|curl|wget|chmod|ls\s)/m.test(text)) lang = 'bash';
      else if (/^\s*[#.][\w-]+\s*\{/.test(text)) lang = 'css';
      else if ((/^\s*\{/.test(text) && /\}\s*$/.test(text)) || (/^\s*\[/.test(text) && /\]\s*$/.test(text))) lang = 'json';

      try {
        code.innerHTML = hljs.highlight(text, { language: lang, ignoreIllegals: true }).value;
      } catch {
        code.textContent = pre.textContent;
      }
    });
  }

  async function loadGuidePage(pageKey, scrollToFirst) {
    pageLoading = true;
    const guide = guides[pageKey];
    const resp = await fetch(`/pages/${guide.file}.html`);
    if (!resp.ok) throw new Error(`Failed to load ${pageKey}.html`);
    const html = await resp.text();
    content.innerHTML = html;
    highlightCode();

    const tocEl = document.getElementById(`toc-${pageKey}`);
    if (tocEl) {
      document.querySelectorAll('.toc-link').forEach(l => l.classList.remove('active-toc-link'));
      const guide = guides[pageKey];
      if (guide) {
        tocEl.innerHTML = '';
        guide.toc.forEach(heading => {
          const anchor = pageKey + '-' + slugify(heading);
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
            } else {
              const tocContainer = link.closest('[id^="toc-"]');
              if (tocContainer) {
                const guideKey = tocContainer.id.replace('toc-', '');
                loadGuidePage(guideKey, false).then(() => {
                  const newTarget = document.querySelector(`[name="${anchor}"]`);
                  if (newTarget) {
                    newTarget.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }
                });
              }
            }
          });
          tocEl.appendChild(link);
        });
      }
    }

    setupScrollSpy(pageKey);
    setupAutoAdvance(pageKey);

    pageLoading = false;

    if (scrollToFirst) {
      const firstAnchor = content.querySelector('section a[name]');
      if (firstAnchor) {
        requestAnimationFrame(() => {
          firstAnchor.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
      }
    }
  }

  function setupScrollSpy(pageKey) {
    const tocLinks = document.querySelectorAll(`#toc-${pageKey} .toc-link`);
    const anchors = [];
    tocLinks.forEach(link => {
      const anchor = link.dataset.target;
      const el = content.querySelector(`[name="${anchor}"]`);
      if (el) anchors.push({ el, link });
    });
    if (!anchors.length) return;

    function update() {
      const contentTop = content.getBoundingClientRect().top;
      const threshold = contentTop + 120;
      let current = anchors[0];
      for (const a of anchors) {
        if (a.el.getBoundingClientRect().top <= threshold) current = a;
      }
      tocLinks.forEach(l => l.classList.remove('active-toc-link'));
      if (current) {
        current.link.classList.add('active-toc-link');
        current.link.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      }
    }

    if (scrollSpyHandler) {
      content.removeEventListener('scroll', scrollSpyHandler);
    }
    scrollSpyHandler = update;
    content.addEventListener('scroll', scrollSpyHandler, { passive: true });
    update();
  }

  function setupAutoAdvance(pageKey) {
    if (advanceHandler) {
      content.removeEventListener('scroll', advanceHandler);
    }

    currentGuideIndex = guideOrder.indexOf(pageKey);
    advanceTriggered = false;

    advanceHandler = () => {
      if (advanceTriggered || pageLoading) return;

      const atBottom = content.scrollTop + content.clientHeight >= content.scrollHeight - 120;
      const atTop = content.scrollTop <= 120;

      if (atBottom) {
        const nextIdx = currentGuideIndex + 1;
        if (nextIdx >= guideOrder.length) return;

        advanceTriggered = true;
        const nextKey = guideOrder[nextIdx];
        loadGuidePage(nextKey, true).catch(() => {
          advanceTriggered = false;
        });
      } else if (atTop) {
        const prevIdx = currentGuideIndex - 1;
        if (prevIdx < 0) return;

        advanceTriggered = true;
        const prevKey = guideOrder[prevIdx];
        loadGuidePage(prevKey, false).then(() => {
          const lastAnchor = content.querySelector('section:last-child a[name]');
          if (lastAnchor) {
            requestAnimationFrame(() => {
              lastAnchor.scrollIntoView({ behavior: 'smooth', block: 'end' });
            });
          }
          setTimeout(() => { advanceTriggered = false; }, 600);
        }).catch(() => {
          advanceTriggered = false;
        });
      }
    };

    content.addEventListener('scroll', advanceHandler, { passive: true });
  }

  async function loadPage(page) {
    pageLoading = true;
    if (advanceHandler) {
      content.removeEventListener('scroll', advanceHandler);
      advanceHandler = null;
    }

    if (page === 'home') {
      pageLoading = false;
      content.innerHTML = `
        <div class="max-w-4xl mx-auto px-4 py-8">
          <div class="text-center mb-12">
            <span class="material-icons text-6xl text-cyan-500 mb-4">public</span>
            <h1 class="text-4xl font-bold text-gray-700 dark:text-cyan-300 mb-2">Troyan</h1>
            <p class="text-xl text-gray-500 dark:text-gray-400">3226 AD &mdash; A World Divided</p>
          </div>

          <div class="bg-indigo-50 dark:bg-indigo-950 rounded-xl p-6 mb-8 border border-indigo-200 dark:border-indigo-800">
            <p class="text-lg leading-relaxed text-gray-700 dark:text-gray-200">
              Centuries after the great cataclysm that shattered civilization, the survivors
              of humanity cling to the scarred surface of a broken Earth &mdash; now called
              <strong>EYA</strong>. The skies are toxic, the soil is poisoned, and the ruins
              of the old world serve as grim monuments to what was lost. But the surface is
              not the only world. Beneath the crust, in the suffocating darkness of ancient
                tunnels and caverns, something else has evolved.
            </p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div class="bg-white dark:bg-slate-900 rounded-xl p-6 shadow-sm border border-blue-200 dark:border-slate-700">
              <div class="flex items-center mb-3">
                <span class="material-icons text-3xl text-blue-500 mr-3">cloud</span>
                <h2 class="text-2xl font-semibold text-gray-700 dark:text-blue-300">EYA</h2>
              </div>
              <p class="text-gray-600 dark:text-gray-300 leading-relaxed">
                The <strong>Exo-Yuman Alliance</strong> controls the surface: fortified
                fortresses, solar arrays, and gleaming white carbon-fiber structures
                dotting the wasteland. They harness Zehedee alien technology to maintain
                air quality, purify water, and power their war machine. EYA dominates
                the skies with VTOL aircraft and heavy bombers, but their greatest
                strength is also their vulnerability &mdash; exposed on the surface,
                their supply lines can be severed from below.
              </p>
            </div>

            <div class="bg-white dark:bg-slate-900 rounded-xl p-6 shadow-sm border border-green-200 dark:border-slate-700">
              <div class="flex items-center mb-3">
                <span class="material-icons text-3xl text-green-500 mr-3">landslide</span>
                <h2 class="text-2xl font-semibold text-gray-700 dark:text-green-300">Ugroo</h2>
              </div>
              <p class="text-gray-600 dark:text-gray-300 leading-relaxed">
                Deep in the subterranean chasms, the <strong>Ugroo</strong> have adapted.
                Generations of mutation have forged a race that thrives in darkness and
                toxic air. Their bio-luminescent cities pulse with organic machinery,
                acid-based harvesting, and an economy built on geothermal vents. Ugroo
                warriors can tunnel beneath enemy lines, burst through the crust without
                warning, and dominate the underwater and underground domains that EYA
                cannot reach.
              </p>
            </div>
          </div>

          <div class="bg-amber-50 dark:bg-amber-950 rounded-xl p-6 mb-8 border border-amber-200 dark:border-amber-800">
            <div class="flex items-center mb-3">
              <span class="material-icons text-3xl text-amber-500 mr-3">flare</span>
              <h2 class="text-2xl font-semibold text-gray-700 dark:text-amber-300">The Zehedee</h2>
            </div>
            <p class="text-gray-700 dark:text-gray-200 leading-relaxed">
              Silent, ancient, and incomprehensible, the <strong>Zehedee</strong> are
              not a faction you command &mdash; they are a force of nature. Their
              derelict data-link arrays and temporal physics engines lie scattered
              across EYA, waiting to be reactivated. Both EYA and Ugroo race to
              decipher Zehedee technology, unlocking chronal time-acceleration,
              energy shields, and weapons that bend the laws of physics. Whoever
              masters the Zehedee legacy will decide the fate of the planet.
            </p>
          </div>

          <div class="bg-white dark:bg-slate-900 rounded-xl p-6 shadow-sm border border-purple-200 dark:border-slate-700 mb-8">
            <div class="flex items-center mb-3">
              <span class="material-icons text-3xl text-purple-500 mr-3">layers</span>
              <h2 class="text-2xl font-semibold text-gray-700 dark:text-purple-300">The Conflict</h2>
            </div>
            <p class="text-gray-600 dark:text-gray-300 leading-relaxed">
              This is not a war of equals. It is a war of dimensions. EYA fights in
              three dimensions &mdash; surface, air, and space. Ugroo fights in a
              hidden fourth dimension: <em>beneath</em>. Every EYA fortress is built
              on ground the Ugroo can claim as their own. Every Ugroo tunnel leads
              to a surface EYA thought it controlled. The battle for EYA is a battle
              of verticality, where victory belongs to the faction that can fight
              across every layer of a broken world.
            </p>
            <p class="text-gray-600 dark:text-gray-300 leading-relaxed mt-3">
              From the irradiated plains and ruined cities above, to the bioluminescent
              caverns and toxic gas pockets below, the war for EYA will be fought on
              every front &mdash; and only one faction will emerge to inherit what
              remains of humanity's cradle.
            </p>
          </div>
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
      highlightCode();
      pageLoading = false;
    } catch (error) {
      pageLoading = false;
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
