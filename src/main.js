import { askObjectQuestion } from './troyan-puter.js';

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
  let popoverAnchor = null;
  let aiRequestToken = 0;

  const aiPopover = createAIPopover();

  function createAIPopover() {
    const el = document.createElement('div');
    el.className = 'ai-object-popover is-hidden';
    el.setAttribute('role', 'dialog');
    el.setAttribute('aria-live', 'polite');
    el.setAttribute('aria-hidden', 'true');

    const closeBtn = document.createElement('button');
    closeBtn.type = 'button';
    closeBtn.className = 'ai-object-popover__close';
    closeBtn.setAttribute('aria-label', 'Close AI response');
    closeBtn.textContent = 'x';

    const title = document.createElement('div');
    title.className = 'ai-object-popover__title';

    const body = document.createElement('div');
    body.className = 'ai-object-popover__body';

    closeBtn.addEventListener('click', () => {
      hideAIPopover();
    });

    el.appendChild(closeBtn);
    el.appendChild(title);
    el.appendChild(body);
    document.body.appendChild(el);

    return {
      el,
      title,
      body
    };
  }

  function positionAIPopover(anchor) {
    if (!anchor || aiPopover.el.classList.contains('is-hidden')) return;

    const rect = anchor.getBoundingClientRect();
    const popRect = aiPopover.el.getBoundingClientRect();
    const gap = 10;

    let left = rect.right + gap;
    if (left + popRect.width > window.innerWidth - 12) {
      left = rect.left - popRect.width - gap;
    }

    if (left < 12) {
      left = 12;
    }

    let top = rect.top;
    if (top + popRect.height > window.innerHeight - 12) {
      top = window.innerHeight - popRect.height - 12;
    }

    if (top < 12) {
      top = 12;
    }

    aiPopover.el.style.left = `${Math.round(left)}px`;
    aiPopover.el.style.top = `${Math.round(top)}px`;
  }

  function showAIPopover(anchor, titleText, bodyText, state = 'ready') {
    popoverAnchor = anchor;
    aiPopover.title.textContent = titleText;
    aiPopover.body.textContent = bodyText;
    aiPopover.el.classList.remove('is-hidden', 'is-loading', 'is-error');
    aiPopover.el.classList.add(`is-${state}`);
    aiPopover.el.setAttribute('aria-hidden', 'false');
    positionAIPopover(anchor);
  }

  function hideAIPopover() {
    popoverAnchor = null;
    aiPopover.el.classList.add('is-hidden');
    aiPopover.el.classList.remove('is-loading', 'is-error');
    aiPopover.el.setAttribute('aria-hidden', 'true');
  }

  function getObjectName(questionButton) {
    return (
      questionButton.dataset.aiObject ||
      questionButton.getAttribute('aria-label') ||
      questionButton.closest('[data-ai-object-name]')?.dataset.aiObjectName ||
      'This object'
    );
  }

  function getAIPrompt(questionButton, objectName) {
    const customPrompt = questionButton.dataset.aiPrompt;
    if (customPrompt && customPrompt.trim()) {
      return customPrompt.trim();
    }

    return `In the Troyan lore and RTS gameplay context, answer the question about ${objectName}.

Rules:
- Use a fresh, non-identical wording each time (don’t repeat previous responses).
- Provide the answer as short, clear text.
- Then provide exactly 2 links to the best resources (URLs) relevant to the question.
- Output format:
  ANSWER: <your answer text>
  LINKS:
  1) <url>
  2) <url>

Keep the ANSWER section short (<= 50 words).`;
  }

  async function handleObjectQuestionClick(questionButton) {
    const objectName = getObjectName(questionButton);
    const prompt = getAIPrompt(questionButton, objectName);

    showAIPopover(questionButton, objectName, 'Thinking...', 'loading');

    const token = ++aiRequestToken;
    try {
      const answer = await askObjectQuestion(prompt);
      if (token !== aiRequestToken) return;

      // aiPopover currently shows plain text via textContent.
      // Ensure LINKS appear underneath by keeping a strict text format.
      showAIPopover(questionButton, objectName, answer, 'ready');
    } catch (error) {
      if (token !== aiRequestToken) return;
      const message = error instanceof Error ? error.message : 'Failed to fetch AI response.';
      showAIPopover(questionButton, objectName, message, 'error');
    }
  }

  function updateSidebarWidth() {
    const totalWidth = window.innerWidth;
    const sidebarWidth = Math.round(totalWidth * (1 - (1 / phi)) / 2);
    sidebar.style.width = `${sidebarWidth}px`;
    sidebar.style.minWidth = `${Math.max(sidebarWidth, sidebarMinWidth)}px`;
  }
  updateSidebarWidth();
  window.addEventListener('resize', updateSidebarWidth);
  window.addEventListener('resize', () => {
    positionAIPopover(popoverAnchor);
  });

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

  // --- Theme toggle ---
  const themeToggle = document.getElementById('theme-toggle');
  const themeIcon = document.getElementById('theme-icon');
  const themeLabel = document.getElementById('theme-label');

  function applyTheme(theme) {
    if (theme === 'light') {
      document.documentElement.classList.add('light');
      themeIcon.textContent = 'dark_mode';
      themeLabel.textContent = 'Ug-roo Depths';
    } else {
      document.documentElement.classList.remove('light');
      themeIcon.textContent = 'light_mode';
      themeLabel.textContent = 'EYA Surface';
    }
  }

  const savedTheme = localStorage.getItem('wiki-theme') || 'dark';
  applyTheme(savedTheme);

  themeToggle.addEventListener('click', (e) => {
    e.preventDefault();
    const current = document.documentElement.classList.contains('light') ? 'light' : 'dark';
    const next = current === 'light' ? 'dark' : 'light';
    localStorage.setItem('wiki-theme', next);
    applyTheme(next);
  });
  // --- end theme toggle ---

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
    pageLink.className = 'flex items-center px-2 py-1 rounded-none text-sm hover:bg-[var(--hover-bg)] transition-colors cursor-pointer border-l-2 border-transparent hover:border-[var(--primary)]';
    pageLink.dataset.page = key;
    pageLink.dataset.guide = key;
    pageLink.innerHTML = `<span class="material-icons md-18 text-[var(--primary)]">${guide.icon}</span><span class="ml-2 text-[var(--text)]">${guide.title}</span>`;
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
          link.className = 'flex items-center px-2 py-1 rounded-none text-xs hover:bg-[var(--hover-bg)] transition-colors cursor-pointer toc-link border-l-2 border-transparent';
          link.dataset.target = anchor;
          link.tabIndex = 0;
          link.role = 'link';
          link.innerHTML = `<span class="material-icons md-14 text-[var(--primary)]" style="font-size:14px">chevron_right</span><span class="ml-1 text-[var(--text-soft)]">${heading}</span>`;
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
    hideAIPopover();
    if (advanceHandler) {
      content.removeEventListener('scroll', advanceHandler);
      advanceHandler = null;
    }

    if (page === 'home') {
      pageLoading = false;
      content.innerHTML = `
        <div class="max-w-4xl mx-auto px-4 py-8">
          <div class="text-center mb-12">
            <span class="material-icons text-6xl text-[--toxic] mb-4">public</span>
            <h1 class="text-4xl font-bold text-[--toxic-bright] mb-2 tracking-wider uppercase">Troyan</h1>
            <p class="text-xl text-[--text-soft] font-mono">3226 AD — A World Divided</p>
          </div>

          <div class="bg-[--surface] border-2 border-[--border] p-6 mb-8">
            <p class="text-lg leading-relaxed text-[--text]">
              Centuries after the great cataclysm that shattered civilization, the survivors
              of humanity cling to the scarred surface of a broken Earth — now called
              <strong class="text-[--toxic-bright]">EYA</strong>. The skies are toxic, the soil is poisoned, and the ruins
              of the old world serve as grim monuments to what was lost. But the surface is
              not the only world. Beneath the crust, in the suffocating darkness of ancient
                tunnels and caverns, something else has evolved.
            </p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div class="bg-[--surface] border-2 border-[--border] p-6">
              <div class="flex items-center mb-3">
                <span class="material-icons text-3xl text-[--primary] mr-3">cloud</span>
                <h2 class="text-2xl font-semibold text-[--toxic-bright] uppercase tracking-wider">EYA</h2>
              </div>
              <p class="text-[--text] leading-relaxed">
                The <strong class="text-[--toxic]">Exo-Yuman Alliance</strong> controls the surface: fortified
                fortresses, solar arrays, and gleaming white carbon-fiber structures
                dotting the wasteland. They harness Zehedee alien technology to maintain
                air quality, purify water, and power their war machine. EYA dominates
                the skies with VTOL aircraft and heavy bombers, but their greatest
                strength is also their vulnerability — exposed on the surface,
                their supply lines can be severed from below.
              </p>
            </div>

            <div class="bg-[--surface] border-2 border-[--border] p-6">
              <div class="flex items-center mb-3">
                <span class="material-icons text-3xl text-[--secondary] mr-3">landslide</span>
                <h2 class="text-2xl font-semibold text-[--toxic] uppercase tracking-wider">Ugroo</h2>
              </div>
              <p class="text-[--text] leading-relaxed">
                Deep in the subterranean chasms, the <strong class="text-[--toxic-bright]">Ugroo</strong> have adapted.
                Generations of mutation have forged a race that thrives in darkness and
                toxic air. Their bio-luminescent cities pulse with organic machinery,
                acid-based harvesting, and an economy built on geothermal vents. Ugroo
                warriors can tunnel beneath enemy lines, burst through the crust without
                warning, and dominate the underwater and underground domains that EYA
                cannot reach.
              </p>
            </div>
          </div>

          <div class="bg-[--amber-bg] border-2 border-[--rust] p-6 mb-8">
            <div class="flex items-center mb-3">
              <span class="material-icons text-3xl text-[--hazard] mr-3">flare</span>
              <h2 class="text-2xl font-semibold text-[--hazard] uppercase tracking-wider">The Zehedee</h2>
            </div>
            <p class="text-[--text] leading-relaxed">
              Silent, ancient, and incomprehensible, the <strong class="text-[--hazard]">Zehedee</strong> are
              not a faction you command — they are a force of nature. Their
              derelict data-link arrays and temporal physics engines lie scattered
              across EYA, waiting to be reactivated. Both EYA and Ugroo race to
              decipher Zehedee technology, unlocking chronal time-acceleration,
              energy shields, and weapons that bend the laws of physics. Whoever
              masters the Zehedee legacy will decide the fate of the planet.
            </p>
          </div>

          <div class="bg-[--surface] border-2 border-[--border] p-6 mb-8">
            <div class="flex items-center mb-3">
              <span class="material-icons text-3xl text-[--military] mr-3">layers</span>
              <h2 class="text-2xl font-semibold text-[--text] uppercase tracking-wider">The Conflict</h2>
            </div>
            <p class="text-[--text] leading-relaxed">
              This is not a war of equals. It is a war of dimensions. EYA fights in
              three dimensions — surface, air, and space. Ugroo fights in a
              hidden fourth dimension: <em class="text-[--toxic]">beneath</em>. Every EYA fortress is built
              on ground the Ugroo can claim as their own. Every Ugroo tunnel leads
              to a surface EYA thought it controlled. The battle for EYA is a battle
              of verticality, where victory belongs to the faction that can fight
              across every layer of a broken world.
            </p>
            <p class="text-[--text] leading-relaxed mt-3">
              From the irradiated plains and ruined cities above, to the bioluminescent
              caverns and toxic gas pockets below, the war for EYA will be fought on
              every front — and only one faction will emerge to inherit what
              remains of humanity's cradle.
            </p>
          </div>
        </div>`;
      return;
    }

    try {
      content.innerHTML = '<p class="text-[--text-soft]">Loading...</p>';

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
           <span class="material-icons text-6xl text-[--border] mb-4">error_outline</span>
          <h2 class="text-2xl font-semibold text-[--text] mb-2 uppercase tracking-wider">Page Not Found</h2>
        <p class="text-[--text-soft] mb-6">We couldn't find the page "<span class="font-mono text-[--primary]">${page}</span>". It may have been moved or doesn't exist yet.</p>
        <p class="text-sm text-[--text-soft]">Try selecting a page from the navigation sidebar.</p>
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

  content.addEventListener('click', (e) => {
    const questionButton = e.target.closest('[data-ai-question-btn]');
    if (!questionButton) return;

    e.preventDefault();
    e.stopPropagation();
    handleObjectQuestionClick(questionButton);
  });

  content.addEventListener('scroll', () => {
    positionAIPopover(popoverAnchor);
  }, { passive: true });

  document.addEventListener('click', (e) => {
    if (aiPopover.el.classList.contains('is-hidden')) return;
    if (aiPopover.el.contains(e.target)) return;
    if (e.target.closest('[data-ai-question-btn]')) return;
    hideAIPopover();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      hideAIPopover();
    }
  });

  loadPage('home');
});
