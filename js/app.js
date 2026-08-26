// ============================================================================
// CODERTECH (Isaac) — Core Application Script
// Pure Vanilla JavaScript (ES6+) — Zero runtime build dependencies needed
// Works immediately in Acode Editor, VS Code, and any Web Browser
// ============================================================================

(function () {
  'use strict';

  // --- STATE ---
  const state = {
    currentRoute: 'home',
    currentBlogSlug: null,
    activeProjectCategory: 'all',
    activeBlogCategory: 'all',
    activeBlogListCategory: 'all',
    activeMonetizationTab: 'store',
    projectCarouselIndex: 0,
    testimonialCarouselIndex: 0,
    searchQuery: '',
    likedBlogs: JSON.parse(localStorage.getItem('codertech_liked_blogs') || '[]'),
    bookmarkedBlogs: JSON.parse(localStorage.getItem('codertech_bookmarked_blogs') || '[]'),
    customAvatar: localStorage.getItem('codertech_custom_avatar') || '',
    activeModal: null,
    searchActiveIndex: -1,
  };

  // Cache data
  const data = window.PORTFOLIO_DATA || {};

  // --- INITIALIZATION ---
  document.addEventListener('DOMContentLoaded', () => {
    initRouter();
    initProfile();
    renderFeaturedProjectsCarousel();
    renderServices();
    renderProcessSteps();
    renderTestimonials();
    renderSocialLinks();
    renderMonetizationStore();
    renderBlogPosts();
    renderFAQ();
    initEstimator();
    initGlobalSearch();
    initKeyboardShortcuts();
    initScrollProgress();
    refreshIcons();
  });

  // --- ICONS HELPER ---
  function refreshIcons() {
    if (window.lucide && typeof window.lucide.createIcons === 'function') {
      window.lucide.createIcons();
    }
  }

  // --- TOAST NOTIFICATION ---
  window.showToast = function (message, type = 'success') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = 'toast-item px-4 py-3 rounded-2xl shadow-lg border text-xs font-bold flex items-center gap-3 bg-white text-stone-800 border-stone-200';
    
    let iconHtml = '<span class="text-emerald-500 font-bold">✓</span>';
    if (type === 'info') iconHtml = '<span class="text-blue-500 font-bold">ℹ</span>';
    if (type === 'heart') iconHtml = '<span class="text-rose-500 font-bold">❤️</span>';

    toast.innerHTML = `
      <div>${iconHtml}</div>
      <div class="flex-1">${message}</div>
    `;

    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      setTimeout(() => toast.remove(), 300);
    }, 3200);
  };

  // --- CLIPBOARD ---
  window.copyText = function (text, label = 'Text') {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(() => {
        showToast(`Copied ${label} to clipboard!`);
      }).catch(() => fallbackCopy(text, label));
    } else {
      fallbackCopy(text, label);
    }
  };

  function fallbackCopy(text, label) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.opacity = '0';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand('copy');
      showToast(`Copied ${label} to clipboard!`);
    } catch (err) {
      showToast(`Failed to copy ${label}`, 'info');
    }
    document.body.removeChild(textArea);
  }

  // --- ROUTER (SPA HASH ROUTING) ---
  function initRouter() {
    window.addEventListener('hashchange', handleRoute);
    handleRoute();
  }

  function handleRoute() {
    const hash = window.location.hash || '#home';

    // Check for blog post route: #/blog/:slug
    if (hash.startsWith('#/blog/')) {
      const slug = hash.replace('#/blog/', '');
      renderBlogPostPage(slug);
      switchView('blog-post-view');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // Check for blog list route: #/blog
    if (hash === '#/blog') {
      renderBlogListPage();
      switchView('blog-list-view');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // Check for projects showcase route: #/projects
    if (hash === '#/projects') {
      renderProjectsListPage();
      switchView('projects-list-view');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // Home or anchor section on home
    switchView('home-view');

    // Handle scroll to anchor if needed
    if (hash.startsWith('#') && hash.length > 1 && !hash.startsWith('#/')) {
      const targetId = hash.substring(1);
      const targetEl = document.getElementById(targetId);
      if (targetEl) {
        setTimeout(() => {
          targetEl.scrollIntoView({ behavior: 'smooth' });
        }, 50);
      }
    }
  }

  function switchView(viewId) {
    document.querySelectorAll('.spa-view').forEach(v => {
      v.classList.remove('active');
    });

    const activeView = document.getElementById(viewId);
    if (activeView) {
      activeView.classList.add('active');
    }

    // Toggle reading progress bar visibility
    const progressBar = document.getElementById('reading-progress-bar');
    if (progressBar) {
      if (viewId === 'blog-post-view') {
        progressBar.style.display = 'block';
      } else {
        progressBar.style.display = 'none';
      }
    }

    refreshIcons();
  }

  // --- SCROLL PROGRESS FOR ARTICLES ---
  function initScrollProgress() {
    window.addEventListener('scroll', () => {
      const progressBar = document.getElementById('reading-progress-bar');
      if (!progressBar || progressBar.style.display === 'none') return;

      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight <= 0) return;
      const progress = (window.scrollY / totalHeight) * 100;
      progressBar.style.width = `${Math.min(100, Math.max(0, progress))}%`;
    });
  }

  // --- PROFILE & AVATARS ---
  function initProfile() {
    const avatarUrl = state.customAvatar || data.profile.avatar;
    document.querySelectorAll('.dynamic-avatar-img').forEach(img => {
      img.src = avatarUrl;
    });
  }

  // --- FEATURED PROJECTS CAROUSEL (PURPLE SECTION) ---
  function renderFeaturedProjectsCarousel() {
    const container = document.getElementById('projects-carousel-container');
    const dotsContainer = document.getElementById('projects-carousel-dots');
    if (!container || !data.projects) return;

    // Show projects
    container.innerHTML = data.projects.map(p => {
      // Mockup generation based on device type
      let mockupHtml = '';

      if (p.deviceType === 'mobile') {
        mockupHtml = `
          <div class="h-44 bg-gradient-to-tr from-rose-50 to-pink-100 rounded-2xl p-4 flex items-center justify-center relative overflow-hidden border border-rose-100/60 mb-5">
            <div class="w-32 h-40 bg-stone-900 rounded-2xl p-2 shadow-lg border border-stone-800 flex flex-col justify-between transform -rotate-3 hover:rotate-0 transition-transform">
              <div class="flex items-center justify-between text-[8px] text-white font-mono px-1">
                <span>9:41</span>
                <span>📶 100%</span>
              </div>
              <div class="bg-white rounded-xl p-2 text-center text-stone-800">
                <div class="text-xl mb-1">🌿</div>
                <div class="text-[9px] font-bold">Fiora Plant</div>
                <div class="text-[8px] text-emerald-600 font-semibold">84% Optimal</div>
              </div>
              <div class="w-10 h-1 bg-stone-700 rounded-full mx-auto"></div>
            </div>
          </div>
        `;
      } else if (p.deviceType === 'dashboard') {
        mockupHtml = `
          <div class="h-44 bg-gradient-to-tr from-purple-50 to-indigo-100 rounded-2xl p-3 flex flex-col justify-between relative overflow-hidden border border-purple-100/60 mb-5">
            <div class="flex items-center justify-between bg-white/80 backdrop-blur-sm px-2.5 py-1 rounded-lg">
              <span class="text-[9px] font-bold text-stone-700 font-mono">Finova Cloud</span>
              <span class="text-[9px] font-bold text-emerald-600">+$120,450 MRR</span>
            </div>
            <div class="bg-white rounded-xl p-2.5 shadow-sm space-y-1.5">
              <div class="flex justify-between text-[10px] text-stone-600 font-semibold">
                <span>Active Throughput</span>
                <span class="text-purple-600 font-bold">45.2k req/s</span>
              </div>
              <div class="w-full h-2 bg-stone-100 rounded-full overflow-hidden">
                <div class="w-4/5 h-full bg-gradient-to-r from-purple-500 to-[#FF7675] rounded-full"></div>
              </div>
            </div>
          </div>
        `;
      } else {
        mockupHtml = `
          <div class="h-44 bg-gradient-to-tr from-amber-50 to-orange-100 rounded-2xl p-3 flex flex-col justify-between relative overflow-hidden border border-amber-100/60 mb-5">
            <div class="flex items-center gap-1.5 bg-white/80 px-2 py-1 rounded-lg w-fit">
              <span class="w-2 h-2 rounded-full bg-rose-400"></span>
              <span class="w-2 h-2 rounded-full bg-amber-400"></span>
              <span class="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span class="text-[8px] font-mono text-stone-500 ml-1">wanderly.ai</span>
            </div>
            <div class="bg-white/90 rounded-xl p-2 shadow-sm text-center">
              <div class="text-[10px] font-extrabold text-stone-800">Kyoto Autumn Journey</div>
              <div class="text-[9px] text-amber-600 font-semibold">AI Route Generated ✈️</div>
            </div>
          </div>
        `;
      }

      return `
        <article class="bg-[#FFFDFB] text-stone-800 rounded-3xl p-6 shadow-xl border border-white/80 flex flex-col justify-between hover-lift">
          <div>
            ${mockupHtml}

            <div class="flex items-center justify-between gap-2 mb-2">
              <span class="px-3 py-1 rounded-full text-xs font-extrabold font-mono ${p.badgeBg} ${p.badgeText}">
                ${p.tag}
              </span>
            </div>

            <h3 class="text-xl font-extrabold text-stone-900 mb-2 font-display">
              ${p.title}
            </h3>

            <p class="text-xs text-stone-600 mb-4 leading-relaxed line-clamp-2">
              ${p.shortDescription}
            </p>

            <div class="flex flex-wrap gap-1.5 mb-6">
              ${p.techStack.slice(0, 3).map(t => `<span class="px-2 py-0.5 bg-stone-100 rounded-md text-[11px] font-bold text-stone-600">${t}</span>`).join('')}
            </div>
          </div>

          <div class="pt-4 border-t border-stone-100 flex items-center justify-between gap-3">
            <button onclick="window.openProjectModal('${p.id}')" class="px-4 py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold transition flex items-center gap-2">
              <span>View Case Study</span>
              <i data-lucide="arrow-right" class="w-3.5 h-3.5"></i>
            </button>
            <div class="flex items-center gap-2">
              <a href="${p.liveUrl}" target="_blank" rel="noopener noreferrer" class="p-2 text-stone-600 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 rounded-xl transition" title="Live Preview">
                <i data-lucide="external-link" class="w-4 h-4"></i>
              </a>
              <a href="${p.githubUrl}" target="_blank" rel="noopener noreferrer" class="p-2 text-stone-600 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 rounded-xl transition" title="GitHub Code">
                <i data-lucide="github" class="w-4 h-4"></i>
              </a>
            </div>
          </div>
        </article>
      `;
    }).join('');

    // Render Dots
    if (dotsContainer) {
      dotsContainer.innerHTML = data.projects.map((_, idx) => `
        <button onclick="window.setProjectIndex(${idx})" class="w-2.5 h-2.5 rounded-full transition-all ${idx === 0 ? 'bg-white w-6' : 'bg-white/40'}"></button>
      `).join('');
    }

    refreshIcons();
  }

  window.slideProjectsNext = function () {
    const container = document.getElementById('projects-carousel-container');
    if (!container) return;
    container.scrollBy({ left: 320, behavior: 'smooth' });
  };

  window.slideProjectsPrev = function () {
    const container = document.getElementById('projects-carousel-container');
    if (!container) return;
    container.scrollBy({ left: -320, behavior: 'smooth' });
  };

  // --- SERVICES SECTION ---
  function renderServices() {
    const grid = document.getElementById('services-grid');
    if (!grid) return;

    grid.innerHTML = data.services.map(s => {
      const featList = s.features.map(f => `
        <li class="flex items-start gap-2 text-xs text-stone-600">
          <i data-lucide="check" class="w-3.5 h-3.5 text-emerald-500 mt-0.5 shrink-0"></i>
          <span>${f}</span>
        </li>
      `).join('');

      return `
        <div class="bg-[#FFFDFB] rounded-3xl border border-stone-200/80 p-6 shadow-sm hover-lift flex flex-col justify-between" id="service-${s.id}">
          <div>
            <div class="flex items-center justify-between mb-4">
              <div class="w-12 h-12 rounded-2xl flex items-center justify-center bg-stone-100 text-stone-800" style="color: ${s.accentColor}">
                <i data-lucide="${s.iconName}" class="w-6 h-6"></i>
              </div>
              <span class="px-3 py-1 rounded-full text-xs font-bold ${s.badgeColor}">
                ${s.startingPrice}
              </span>
            </div>

            <h3 class="text-lg font-bold text-stone-900 mb-2 font-display">${s.title}</h3>
            <p class="text-xs text-stone-600 mb-4 leading-relaxed">${s.description}</p>

            <div class="mb-4 text-[11px] font-semibold text-stone-500 bg-stone-50 px-3 py-1.5 rounded-xl border border-stone-200/50">
              Timeline: <span class="text-stone-800 font-bold">${s.estimatedTimeline}</span>
            </div>

            <ul class="space-y-2 mb-6">
              ${featList}
            </ul>
          </div>

          <button onclick="window.openServiceModal('${s.id}')" class="w-full py-2.5 px-4 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2">
            <span>Inquire for ${s.title.split(' ')[0]}</span>
            <i data-lucide="arrow-right" class="w-3.5 h-3.5"></i>
          </button>
        </div>
      `;
    }).join('');

    refreshIcons();
  }

  // --- PROCESS STEPS ---
  function renderProcessSteps() {
    const grid = document.getElementById('process-grid');
    if (!grid) return;

    grid.innerHTML = data.processSteps.map(step => {
      const delivs = step.deliverables.map(d => `
        <li class="flex items-center gap-2 text-xs text-stone-600">
          <span class="w-1.5 h-1.5 rounded-full bg-stone-400"></span>
          <span>${d}</span>
        </li>
      `).join('');

      return `
        <div class="bg-[#FFFDFB] rounded-3xl border border-stone-200/80 p-6 shadow-sm hover-lift flex flex-col justify-between">
          <div>
            <div class="flex items-center justify-between mb-4">
              <span class="w-10 h-10 rounded-2xl bg-stone-900 text-white font-bold text-sm flex items-center justify-center font-mono">
                0${step.stepNumber}
              </span>
              <div class="p-2 rounded-xl bg-stone-100" style="color: ${step.color}">
                <i data-lucide="${step.iconName}" class="w-5 h-5"></i>
              </div>
            </div>

            <h3 class="text-lg font-bold text-stone-900 mb-1 font-display">${step.title}</h3>
            <p class="text-xs font-semibold text-stone-500 mb-3">${step.subtitle}</p>
            <p class="text-xs text-stone-600 mb-4 leading-relaxed">${step.description}</p>
          </div>

          <div class="pt-4 border-t border-stone-100">
            <div class="text-[11px] font-bold text-stone-400 uppercase tracking-wider mb-2 font-mono">Key Deliverables</div>
            <ul class="space-y-1.5">
              ${delivs}
            </ul>
          </div>
        </div>
      `;
    }).join('');

    refreshIcons();
  }

  // --- TESTIMONIALS ---
  function renderTestimonials() {
    const grid = document.getElementById('testimonials-grid');
    if (!grid || !data.testimonials) return;

    grid.innerHTML = data.testimonials.map(t => `
      <div class="bg-white p-6 rounded-3xl border border-stone-200/80 shadow-sm flex flex-col justify-between hover-lift">
        <div>
          <div class="text-3xl font-serif text-[#FF7675] leading-none mb-2">“</div>
          <p class="text-xs sm:text-sm text-stone-700 leading-relaxed italic mb-6">
            ${t.quote}
          </p>
        </div>

        <div class="flex items-center gap-3 pt-4 border-t border-stone-100">
          <img src="${t.avatarUrl}" alt="${t.author}" class="w-10 h-10 rounded-full object-cover border border-stone-200 shadow-2xs" />
          <div>
            <div class="text-xs font-bold text-stone-900">${t.author}</div>
            <div class="text-[11px] text-stone-500 font-medium">${t.role} • <strong class="text-stone-700 font-semibold">${t.company}</strong></div>
          </div>
        </div>
      </div>
    `).join('');

    refreshIcons();
  }

  window.slideTestimonialsNext = function () {
    const grid = document.getElementById('testimonials-grid');
    if (grid) grid.scrollBy({ left: 300, behavior: 'smooth' });
  };

  window.slideTestimonialsPrev = function () {
    const grid = document.getElementById('testimonials-grid');
    if (grid) grid.scrollBy({ left: -300, behavior: 'smooth' });
  };

  // --- SOCIAL LINKS ---
  function renderSocialLinks() {
    const grid = document.getElementById('social-links-grid');
    if (!grid || !data.socialLinks) return;

    grid.innerHTML = data.socialLinks.map(s => `
      <div class="bg-white rounded-3xl border border-stone-200/80 p-6 shadow-sm hover-lift flex flex-col justify-between relative overflow-hidden">
        <div class="absolute top-0 left-0 right-0 h-1.5" style="background-color: ${s.color}"></div>
        
        <div>
          <div class="flex items-center justify-between mb-3 pt-1">
            <span class="text-[10px] font-extrabold font-mono tracking-wider px-2.5 py-0.5 rounded-full bg-stone-100 text-stone-700">
              ${s.badge}
            </span>
            <span class="text-xs font-semibold text-stone-400 font-mono">${s.stats}</span>
          </div>

          <h3 class="text-lg font-bold text-stone-900 font-display mb-0.5">${s.name}</h3>
          <p class="text-xs font-mono text-stone-500 mb-3">${s.handle}</p>
          <p class="text-xs text-stone-600 leading-relaxed mb-6">${s.description}</p>
        </div>

        <div class="flex items-center gap-2 pt-4 border-t border-stone-100">
          <a href="${s.url}" target="_blank" rel="noopener noreferrer" class="flex-1 py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5">
            <span>Connect</span>
            <i data-lucide="external-link" class="w-3.5 h-3.5"></i>
          </a>
          <button onclick="window.copyText('${s.handle}', '${s.name} Handle')" class="p-2.5 bg-stone-100 hover:bg-stone-200 rounded-xl text-stone-700 transition" title="Copy Handle">
            <i data-lucide="copy" class="w-4 h-4"></i>
          </button>
        </div>
      </div>
    `).join('');

    refreshIcons();
  }

  // --- BLOG POSTS (HOME SECTION) ---
  function renderBlogPosts() {
    const grid = document.getElementById('blog-grid');
    if (!grid || !data.blogPosts) return;

    const filtered = state.activeBlogCategory === 'all'
      ? data.blogPosts
      : data.blogPosts.filter(b => b.category === state.activeBlogCategory);

    grid.innerHTML = filtered.map(post => {
      const isLiked = state.likedBlogs.includes(post.id);
      const isBookmarked = state.bookmarkedBlogs.includes(post.id);

      return `
        <article class="bg-white rounded-3xl border border-stone-200/80 p-5 sm:p-6 shadow-sm hover-lift flex flex-col justify-between" id="blog-${post.id}">
          <div>
            <div class="rounded-2xl overflow-hidden aspect-16/9 mb-4 border border-stone-100 relative">
              <img src="${post.coverImage}" alt="${post.title}" class="w-full h-full object-cover" />
              <span class="absolute top-3 left-3 px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-[11px] font-extrabold text-stone-800 font-mono shadow-2xs">
                ${post.category}
              </span>
            </div>

            <div class="flex items-center gap-2 text-[11px] text-stone-400 font-mono mb-2">
              <span>${post.publishedAt}</span>
              <span>•</span>
              <span>${post.readTime}</span>
            </div>

            <h3 class="text-base sm:text-lg font-bold text-stone-900 font-display mb-2 leading-snug hover:text-[#6C5CE7] transition">
              <a href="#/blog/${post.slug}">${post.title}</a>
            </h3>

            <p class="text-xs text-stone-600 leading-relaxed mb-4 line-clamp-2">
              ${post.excerpt}
            </p>
          </div>

          <div class="pt-4 border-t border-stone-100 flex items-center justify-between text-xs">
            <a href="#/blog/${post.slug}" class="font-bold text-[#6C5CE7] hover:underline flex items-center gap-1">
              <span>Read Article</span>
              <i data-lucide="arrow-right" class="w-3.5 h-3.5"></i>
            </a>

            <div class="flex items-center gap-2">
              <button onclick="window.toggleBlogLike('${post.id}')" class="flex items-center gap-1 text-stone-500 hover:text-rose-500 transition">
                <span class="${isLiked ? 'text-rose-500' : ''}">❤️</span>
                <span class="text-[11px] font-bold">${post.likesCount + (isLiked ? 1 : 0)}</span>
              </button>
              <button onclick="window.toggleBlogBookmark('${post.id}')" class="text-stone-400 hover:text-stone-800 transition" title="Bookmark">
                <i data-lucide="bookmark" class="w-4 h-4 ${isBookmarked ? 'fill-stone-800 text-stone-800' : ''}"></i>
              </button>
            </div>
          </div>
        </article>
      `;
    }).join('');

    refreshIcons();
  }

  window.filterBlog = function (category) {
    state.activeBlogCategory = category;
    document.querySelectorAll('.blog-filter-btn').forEach(btn => {
      if (btn.dataset.category === category) {
        btn.className = 'blog-filter-btn px-4 py-2 rounded-full text-xs font-bold bg-stone-900 text-white shadow-sm transition';
      } else {
        btn.className = 'blog-filter-btn px-4 py-2 rounded-full text-xs font-bold bg-white text-stone-600 hover:bg-stone-100 border border-stone-200 transition';
      }
    });
    renderBlogPosts();
  };

  // --- BLOG LIKE & BOOKMARK ---
  window.toggleBlogLike = function (postId) {
    const idx = state.likedBlogs.indexOf(postId);
    if (idx > -1) {
      state.likedBlogs.splice(idx, 1);
      showToast('Removed like from article', 'info');
    } else {
      state.likedBlogs.push(postId);
      showToast('Liked article! ❤️', 'heart');
    }
    localStorage.setItem('codertech_liked_blogs', JSON.stringify(state.likedBlogs));
    renderBlogPosts();
    if (state.currentBlogSlug) renderBlogPostPage(state.currentBlogSlug);
  };

  window.toggleBlogBookmark = function (postId) {
    const idx = state.bookmarkedBlogs.indexOf(postId);
    if (idx > -1) {
      state.bookmarkedBlogs.splice(idx, 1);
      showToast('Removed from reading list', 'info');
    } else {
      state.bookmarkedBlogs.push(postId);
      showToast('Saved to reading list! 📑', 'info');
    }
    localStorage.setItem('codertech_bookmarked_blogs', JSON.stringify(state.bookmarkedBlogs));
    renderBlogPosts();
    if (state.currentBlogSlug) renderBlogPostPage(state.currentBlogSlug);
  };

  // --- DEDICATED BLOG LIST PAGE (SPA: #/blog) ---
  function renderBlogListPage() {
    const grid = document.getElementById('full-blog-grid');
    if (!grid || !data.blogPosts) return;

    let filtered = data.blogPosts;
    if (state.activeBlogListCategory !== 'all') {
      filtered = filtered.filter(b => b.category === state.activeBlogListCategory);
    }
    if (state.searchQuery) {
      const q = state.searchQuery.toLowerCase();
      filtered = filtered.filter(b => b.title.toLowerCase().includes(q) || b.excerpt.toLowerCase().includes(q) || b.tags.some(t => t.toLowerCase().includes(q)));
    }

    grid.innerHTML = filtered.map(post => {
      const isLiked = state.likedBlogs.includes(post.id);
      return `
        <article class="bg-white rounded-3xl border border-stone-200 p-6 shadow-sm hover-lift flex flex-col justify-between">
          <div>
            <div class="rounded-2xl overflow-hidden aspect-16/9 mb-4 border border-stone-100">
              <img src="${post.coverImage}" alt="${post.title}" class="w-full h-full object-cover" />
            </div>
            <div class="flex items-center gap-2 text-[11px] text-stone-400 font-mono mb-2">
              <span class="px-2.5 py-0.5 bg-purple-50 text-purple-700 font-bold rounded-full">${post.category}</span>
              <span>•</span>
              <span>${post.readTime}</span>
            </div>
            <h3 class="text-lg font-bold text-stone-900 font-display mb-2">
              <a href="#/blog/${post.slug}" class="hover:text-[#6C5CE7] transition">${post.title}</a>
            </h3>
            <p class="text-xs text-stone-600 leading-relaxed mb-4 line-clamp-2">${post.excerpt}</p>
          </div>
          <div class="pt-4 border-t border-stone-100 flex items-center justify-between text-xs">
            <a href="#/blog/${post.slug}" class="font-bold text-[#6C5CE7] hover:underline flex items-center gap-1">
              <span>Read Full Deep-Dive</span>
              <i data-lucide="arrow-right" class="w-3.5 h-3.5"></i>
            </a>
            <span class="text-stone-400 font-mono">${post.viewsCount} views</span>
          </div>
        </article>
      `;
    }).join('');

    refreshIcons();
  }

  window.filterBlogList = function (cat) {
    state.activeBlogListCategory = cat;
    document.querySelectorAll('.blog-list-cat-btn').forEach(btn => {
      if (btn.dataset.blogcat === cat) {
        btn.className = 'blog-list-cat-btn px-3.5 py-1.5 rounded-xl text-xs font-bold bg-stone-900 text-white transition';
      } else {
        btn.className = 'blog-list-cat-btn px-3.5 py-1.5 rounded-xl text-xs font-bold bg-stone-100 text-stone-600 hover:bg-stone-200 transition';
      }
    });
    renderBlogListPage();
  };

  window.handleBlogSearchInput = function (val) {
    state.searchQuery = val;
    renderBlogListPage();
  };

  // --- DEDICATED BLOG POST PAGE (SPA: #/blog/:slug) ---
  function renderBlogPostPage(slug) {
    state.currentBlogSlug = slug;
    const post = (data.blogPosts || []).find(b => b.slug === slug || b.id === slug);
    if (!post) {
      window.location.hash = '#/blog';
      return;
    }

    document.getElementById('post-breadcrumb-category').textContent = post.category;
    document.getElementById('post-category-badge').textContent = post.category;
    document.getElementById('post-readtime').textContent = post.readTime;
    document.getElementById('post-date').textContent = post.publishedAt;
    document.getElementById('post-title').textContent = post.title;
    document.getElementById('post-author-avatar').src = state.customAvatar || post.author.avatar;
    document.getElementById('post-author-name').textContent = post.author.name;
    document.getElementById('post-author-role').textContent = post.author.role;
    document.getElementById('post-cover-image').src = post.coverImage;
    
    // Likes
    const isLiked = state.likedBlogs.includes(post.id);
    document.getElementById('post-likes-count').textContent = post.likesCount + (isLiked ? 1 : 0);
    const likeBtn = document.getElementById('post-like-btn');
    likeBtn.onclick = () => window.toggleBlogLike(post.id);
    if (isLiked) {
      likeBtn.className = 'px-3.5 py-2 rounded-xl bg-rose-50 border border-rose-200 text-xs font-bold text-rose-600 flex items-center gap-1.5 shadow-2xs transition';
    } else {
      likeBtn.className = 'px-3.5 py-2 rounded-xl bg-white border border-stone-200 hover:border-stone-300 text-xs font-bold text-stone-700 flex items-center gap-1.5 shadow-2xs transition';
    }

    // Bookmarks
    const isBookmarked = state.bookmarkedBlogs.includes(post.id);
    const bookmarkBtn = document.getElementById('post-bookmark-btn');
    bookmarkBtn.onclick = () => window.toggleBlogBookmark(post.id);
    bookmarkBtn.innerHTML = `<i data-lucide="bookmark" class="w-4 h-4 ${isBookmarked ? 'fill-stone-800 text-stone-800' : ''}"></i>`;

    // Render markdown content
    document.getElementById('post-markdown-content').innerHTML = parseSimpleMarkdown(post.contentMarkdown);

    // Render tags
    const tagsContainer = document.getElementById('post-tags-container');
    tagsContainer.innerHTML = post.tags.map(t => `
      <span class="px-3 py-1 bg-stone-100 rounded-lg text-xs font-bold text-stone-700 font-mono">#${t}</span>
    `).join('');

    // Comments
    renderPostComments(post);

    refreshIcons();
  }

  function renderPostComments(post) {
    const list = document.getElementById('post-comments-container');
    if (!list) return;

    if (!post.comments || post.comments.length === 0) {
      list.innerHTML = `<div class="text-xs text-stone-500 italic">No comments yet. Be the first to share your thoughts!</div>`;
      return;
    }

    list.innerHTML = post.comments.map(c => `
      <div class="p-4 bg-white rounded-2xl border border-stone-200/80 shadow-2xs flex items-start gap-3">
        <img src="${c.avatar}" alt="${c.author}" class="w-8 h-8 rounded-full object-cover border border-stone-200 shrink-0" />
        <div class="flex-1 space-y-1">
          <div class="flex items-center justify-between">
            <span class="text-xs font-bold text-stone-900">${c.author}</span>
            <span class="text-[10px] text-stone-400 font-mono">${c.createdAt}</span>
          </div>
          <p class="text-xs text-stone-600 leading-relaxed">${c.content}</p>
        </div>
      </div>
    `).join('');
  }

  window.handleArticleCommentSubmit = function (e) {
    e.preventDefault();
    const input = document.getElementById('post-comment-textarea');
    if (!input || !input.value.trim()) return;

    const post = (data.blogPosts || []).find(b => b.slug === state.currentBlogSlug || b.id === state.currentBlogSlug);
    if (!post) return;

    if (!post.comments) post.comments = [];
    post.comments.unshift({
      id: 'c_' + Date.now(),
      author: 'You (Dev Visitor)',
      avatar: state.customAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      content: input.value.trim(),
      createdAt: 'Just now',
      likes: 0
    });

    input.value = '';
    showToast('Comment submitted successfully!');
    renderPostComments(post);
  };

  window.copyCurrentArticleLink = function () {
    window.copyText(window.location.href, 'Article Link');
  };

  // --- DEDICATED PROJECTS LIST PAGE (SPA: #/projects) ---
  function renderProjectsListPage() {
    const grid = document.getElementById('full-projects-directory-grid');
    if (!grid || !data.projects) return;

    grid.innerHTML = data.projects.map(p => `
      <article class="bg-white rounded-3xl border border-stone-200 p-6 shadow-sm hover-lift flex flex-col justify-between">
        <div>
          <div class="flex items-center justify-between mb-3">
            <span class="px-3 py-1 rounded-full text-xs font-extrabold font-mono ${p.badgeBg} ${p.badgeText}">${p.tag}</span>
            <span class="text-xs text-stone-400 font-mono">EST. 2026</span>
          </div>
          <h3 class="text-xl font-bold text-stone-900 font-display mb-2">${p.title}</h3>
          <p class="text-xs text-stone-600 leading-relaxed mb-4">${p.fullDescription || p.shortDescription}</p>
          
          <div class="mb-4">
            <div class="text-[11px] font-bold text-stone-400 uppercase font-mono mb-2">Metrics & Results</div>
            <div class="grid grid-cols-3 gap-2">
              ${p.metrics.map(m => `
                <div class="bg-stone-50 p-2 rounded-xl text-center border border-stone-100">
                  <div class="text-xs font-bold text-stone-800">${m.value}</div>
                  <div class="text-[10px] text-stone-500">${m.label}</div>
                </div>
              `).join('')}
            </div>
          </div>
        </div>

        <div class="pt-4 border-t border-stone-100 flex items-center justify-between gap-3">
          <button onclick="window.openProjectModal('${p.id}')" class="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold transition flex items-center gap-2">
            <span>Detailed Specs</span>
            <i data-lucide="arrow-right" class="w-3.5 h-3.5"></i>
          </button>
          <div class="flex items-center gap-2">
            <a href="${p.liveUrl}" target="_blank" rel="noopener noreferrer" class="p-2 text-stone-600 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 rounded-xl transition" title="Live Preview">
              <i data-lucide="external-link" class="w-4 h-4"></i>
            </a>
            <a href="${p.githubUrl}" target="_blank" rel="noopener noreferrer" class="p-2 text-stone-600 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 rounded-xl transition" title="Code">
              <i data-lucide="github" class="w-4 h-4"></i>
            </a>
          </div>
        </div>
      </article>
    `).join('');

    refreshIcons();
  }

  // --- MONETIZATION HUB TABS ---
  function renderMonetizationStore() {
    const grid = document.getElementById('monetization-products-grid');
    if (!grid || !data.monetizationProducts) return;

    grid.innerHTML = data.monetizationProducts.map(prod => `
      <div class="bg-white rounded-3xl border border-stone-200/80 p-6 shadow-sm hover-lift flex flex-col justify-between relative overflow-hidden">
        <div>
          <div class="flex items-center justify-between mb-3">
            <span class="px-3 py-1 rounded-full text-xs font-extrabold font-mono bg-orange-100 text-[#e17055]">
              ${prod.badge}
            </span>
            <div class="flex items-center gap-1 text-xs font-bold text-amber-500 font-mono">
              <span>★</span>
              <span>${prod.popularityRating}</span>
            </div>
          </div>

          <h3 class="text-lg font-bold text-stone-900 font-display mb-1">${prod.title}</h3>
          
          <div class="flex items-baseline gap-1 my-3">
            <span class="text-3xl font-extrabold text-stone-900 font-display">${prod.price}</span>
            <span class="text-xs text-stone-500 font-mono">/ one-time</span>
          </div>

          <p class="text-xs text-stone-600 leading-relaxed mb-4">${prod.description}</p>

          <ul class="space-y-2 mb-6">
            ${prod.features.map(f => `
              <li class="flex items-start gap-2 text-xs text-stone-600">
                <i data-lucide="check" class="w-3.5 h-3.5 text-emerald-500 mt-0.5 shrink-0"></i>
                <span>${f}</span>
              </li>
            `).join('')}
          </ul>
        </div>

        <button onclick="window.openCheckoutModal('${prod.id}')" class="w-full py-3 bg-[#e17055] hover:bg-[#d65d40] text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 shadow-sm">
          <span>Get Instant Access</span>
          <i data-lucide="arrow-right" class="w-3.5 h-3.5"></i>
        </button>
      </div>
    `).join('');

    refreshIcons();
  }

  window.switchMonetizationTab = function (tabName) {
    state.activeMonetizationTab = tabName;

    document.querySelectorAll('.monetization-tab-btn').forEach(btn => {
      if (btn.dataset.tab === tabName) {
        btn.className = 'monetization-tab-btn px-5 py-2.5 rounded-xl text-xs font-bold bg-stone-900 text-white shadow-sm transition';
      } else {
        btn.className = 'monetization-tab-btn px-5 py-2.5 rounded-xl text-xs font-bold bg-white text-stone-600 hover:bg-stone-100 border border-stone-200 transition';
      }
    });

    const storeView = document.getElementById('monetization-store-view');
    const calcView = document.getElementById('monetization-calc-view');
    const metricsView = document.getElementById('monetization-metrics-view');

    if (storeView) storeView.style.display = tabName === 'store' ? 'block' : 'none';
    if (calcView) calcView.style.display = tabName === 'calculator' ? 'block' : 'none';
    if (metricsView) metricsView.style.display = tabName === 'metrics' ? 'block' : 'none';

    refreshIcons();
  };

  // --- PROJECT ESTIMATOR CALCULATION ---
  function initEstimator() {
    const typeSelect = document.getElementById('calc-project-type');
    const urgencySelect = document.getElementById('calc-urgency');
    const checkBoxes = document.querySelectorAll('.calc-feature-check');

    if (typeSelect) typeSelect.addEventListener('change', updateEstimator);
    if (urgencySelect) urgencySelect.addEventListener('change', updateEstimator);
    checkBoxes.forEach(cb => cb.addEventListener('change', updateEstimator));

    updateEstimator();
  }

  function updateEstimator() {
    const typeSelect = document.getElementById('calc-project-type');
    const urgencySelect = document.getElementById('calc-urgency');
    if (!typeSelect || !urgencySelect) return;

    let baseMin = 1200;
    let baseMax = 1800;
    let baseWeeksMin = 2;
    let baseWeeksMax = 3;

    if (typeSelect.value === 'mobile') {
      baseMin = 1500;
      baseMax = 2200;
      baseWeeksMin = 3;
      baseWeeksMax = 4;
    } else if (typeSelect.value === 'saas') {
      baseMin = 2200;
      baseMax = 3200;
      baseWeeksMin = 3;
      baseWeeksMax = 5;
    } else if (typeSelect.value === 'backend') {
      baseMin = 950;
      baseMax = 1500;
      baseWeeksMin = 1;
      baseWeeksMax = 2;
    }

    let extraPrice = 0;
    let extraWeeks = 0;
    document.querySelectorAll('.calc-feature-check:checked').forEach(cb => {
      extraPrice += parseInt(cb.dataset.price || '0', 10);
      extraWeeks += parseFloat(cb.dataset.weeks || '0');
    });

    let totalMin = baseMin + extraPrice;
    let totalMax = baseMax + extraPrice;
    let totalWeeksMin = Math.max(1, Math.round(baseWeeksMin + extraWeeks));
    let totalWeeksMax = Math.max(2, Math.round(baseWeeksMax + extraWeeks));

    if (urgencySelect.value === 'rush') {
      totalMin = Math.round(totalMin * 1.35);
      totalMax = Math.round(totalMax * 1.35);
      totalWeeksMin = Math.max(1, Math.round(totalWeeksMin * 0.65));
      totalWeeksMax = Math.max(1, Math.round(totalWeeksMax * 0.7));
    }

    const priceResult = document.getElementById('calc-price-result');
    const timelineResult = document.getElementById('calc-timeline-result');

    if (priceResult) {
      priceResult.textContent = `$${totalMin.toLocaleString()} – $${totalMax.toLocaleString()}`;
    }
    if (timelineResult) {
      timelineResult.textContent = `${totalWeeksMin}–${totalWeeksMax} Weeks`;
    }
  }

  window.requestEstimatedScope = function () {
    const priceText = document.getElementById('calc-price-result')?.textContent || '$2,000+';
    const timelineText = document.getElementById('calc-timeline-result')?.textContent || '2-4 Weeks';
    const typeText = document.getElementById('calc-project-type')?.selectedOptions[0]?.text || 'Full-Stack Web';

    window.openContactModal(`Estimated Scope: ${typeText} | Budget: ${priceText} | Target Timeline: ${timelineText}`);
  };

  // --- FAQ ACCORDION ---
  function renderFAQ() {
    const acc = document.getElementById('faq-accordion');
    if (!acc || !data.faq) return;

    acc.innerHTML = data.faq.map((item, idx) => `
      <div class="bg-white rounded-2xl border border-stone-200/80 overflow-hidden shadow-2xs">
        <button onclick="window.toggleFAQ('faq-item-${idx}')" class="w-full px-5 py-4 text-left font-bold text-xs sm:text-sm text-stone-900 flex items-center justify-between gap-4 hover:bg-stone-50/80 transition">
          <span>${item.question}</span>
          <span id="faq-icon-${idx}" class="text-stone-400 font-mono text-base">＋</span>
        </button>
        <div id="faq-item-${idx}" class="hidden px-5 pb-4 text-xs text-stone-600 leading-relaxed border-t border-stone-100 pt-3">
          ${item.answer}
        </div>
      </div>
    `).join('');

    refreshIcons();
  }

  window.toggleFAQ = function (id) {
    const content = document.getElementById(id);
    const idx = id.replace('faq-item-', '');
    const icon = document.getElementById(`faq-icon-${idx}`);
    if (!content) return;

    if (content.classList.contains('hidden')) {
      content.classList.remove('hidden');
      if (icon) icon.textContent = '－';
    } else {
      content.classList.add('hidden');
      if (icon) icon.textContent = '＋';
    }
  };

  // --- MODALS ENGINE ---
  window.openModal = function (modalId) {
    window.closeModal();
    const modal = document.getElementById(modalId);
    if (!modal) return;

    modal.classList.remove('modal-hidden');
    // Force reflow
    void modal.offsetWidth;
    modal.classList.add('active');
    state.activeModal = modalId;
    document.body.style.overflow = 'hidden';
    refreshIcons();
  };

  window.closeModal = function () {
    document.querySelectorAll('.modal-overlay').forEach(m => {
      m.classList.remove('active');
      setTimeout(() => {
        if (!m.classList.contains('active')) {
          m.classList.add('modal-hidden');
        }
      }, 250);
    });
    state.activeModal = null;
    document.body.style.overflow = '';
  };

  // Project Modal
  window.openProjectModal = function (projectId) {
    const p = (data.projects || []).find(x => x.id === projectId);
    if (!p) return;

    document.getElementById('pm-tag').textContent = p.tag;
    document.getElementById('pm-title').textContent = p.title;
    document.getElementById('pm-full-desc').textContent = p.fullDescription || p.shortDescription;

    document.getElementById('pm-metrics').innerHTML = p.metrics.map(m => `
      <div class="bg-stone-50 p-2.5 rounded-2xl text-center border border-stone-200/50">
        <div class="text-sm font-bold text-stone-900">${m.value}</div>
        <div class="text-[11px] text-stone-500">${m.label}</div>
      </div>
    `).join('');

    document.getElementById('pm-highlights').innerHTML = (p.highlights || []).map(h => `
      <li class="flex items-start gap-2 text-xs text-stone-600">
        <span class="text-emerald-500 font-bold">✓</span>
        <span>${h}</span>
      </li>
    `).join('');

    document.getElementById('pm-tech-stack').innerHTML = p.techStack.map(t => `
      <span class="px-2.5 py-1 bg-stone-100 rounded-lg text-xs font-bold text-stone-700 font-mono">${t}</span>
    `).join('');

    document.getElementById('pm-live-btn').href = p.liveUrl;
    document.getElementById('pm-code-btn').href = p.githubUrl;

    window.openModal('project-modal');
  };

  // Service Modal
  window.openServiceModal = function (serviceId) {
    const s = (data.services || []).find(x => x.id === serviceId);
    if (!s) return;

    document.getElementById('sm-title').textContent = s.title;
    document.getElementById('sm-price').textContent = s.startingPrice;
    document.getElementById('sm-timeline').textContent = s.estimatedTimeline;
    document.getElementById('sm-desc').textContent = s.description;
    document.getElementById('sm-ideal').textContent = s.idealFor;
    document.getElementById('sm-features').innerHTML = s.features.map(f => `
      <li class="flex items-center gap-2 text-xs text-stone-600">
        <span class="text-emerald-500 font-bold">✓</span>
        <span>${f}</span>
      </li>
    `).join('');

    document.getElementById('sm-book-btn').onclick = () => {
      window.openContactModal(`Service Inquiry: ${s.title} (${s.startingPrice})`);
    };

    window.openModal('service-modal');
  };

  // Contact Modal
  window.openContactModal = function (prefillMessage = '') {
    const msgInput = document.getElementById('contact-message');
    if (msgInput && prefillMessage) {
      msgInput.value = prefillMessage;
    }
    window.openModal('contact-modal');
  };

  window.handleContactSubmit = function (e) {
    e.preventDefault();
    const name = document.getElementById('contact-name').value;
    const email = document.getElementById('contact-email').value;
    
    showToast(`Thanks ${name}! Your inquiry has been sent to Isaac.`);
    window.closeModal();
    e.target.reset();
  };

  // Checkout Modal
  window.openCheckoutModal = function (productId) {
    const prod = (data.monetizationProducts || []).find(p => p.id === productId);
    if (!prod) return;

    document.getElementById('cm-prod-title').textContent = prod.title;
    document.getElementById('cm-prod-price').textContent = prod.price;
    document.getElementById('cm-prod-type').textContent = prod.type;
    document.getElementById('cm-prod-delivery').textContent = prod.deliveryTime;

    document.getElementById('checkout-form').classList.remove('hidden');
    document.getElementById('cm-license-box').classList.add('hidden');

    window.openModal('checkout-modal');
  };

  window.handleCheckoutSubmit = function (e) {
    e.preventDefault();
    const email = document.getElementById('checkout-email').value;
    
    // Generate simulated license key
    const randKey = 'CT-' + Math.floor(1000 + Math.random() * 9000) + '-' + Math.random().toString(36).substring(2, 6).toUpperCase();
    document.getElementById('cm-license-key').textContent = randKey;

    document.getElementById('checkout-form').classList.add('hidden');
    document.getElementById('cm-license-box').classList.remove('hidden');

    showToast(`License generated and simulated email sent to ${email}!`);
  };

  // Photo Customizer Modal
  window.openPhotoSettingsModal = function () {
    window.openModal('photo-modal');
  };

  window.selectAvatarPreset = function (url) {
    state.customAvatar = url;
    localStorage.setItem('codertech_custom_avatar', url);
    initProfile();
    showToast('Updated profile photo!');
    window.closeModal();
  };

  window.saveCustomAvatar = function () {
    const input = document.getElementById('photo-url-input');
    if (!input || !input.value.trim()) return;

    state.customAvatar = input.value.trim();
    localStorage.setItem('codertech_custom_avatar', state.customAvatar);
    initProfile();
    showToast('Custom photo saved!');
    window.closeModal();
  };

  window.resetDefaultAvatar = function () {
    state.customAvatar = '';
    localStorage.removeItem('codertech_custom_avatar');
    initProfile();
    showToast('Reset to default photo');
    window.closeModal();
  };

  // --- GLOBAL SEARCH (⌘K) ---
  window.openSearchModal = function () {
    window.openModal('search-modal');
    setTimeout(() => {
      const input = document.getElementById('global-search-input');
      if (input) {
        input.focus();
        input.value = '';
        renderSearchResults('');
      }
    }, 50);
  };

  function initGlobalSearch() {
    const input = document.getElementById('global-search-input');
    if (!input) return;

    input.addEventListener('input', (e) => {
      renderSearchResults(e.target.value);
    });
  }

  function renderSearchResults(query) {
    const list = document.getElementById('search-results-list');
    if (!list) return;

    if (!query || !query.trim()) {
      list.innerHTML = `
        <div class="p-3 text-xs text-stone-400 font-medium text-center">
          Type keywords to search projects, services, blog guides, or tech tags...
        </div>
      `;
      return;
    }

    const q = query.toLowerCase().trim();
    const results = [];

    // Search projects
    (data.projects || []).forEach(p => {
      if (p.title.toLowerCase().includes(q) || p.shortDescription.toLowerCase().includes(q) || p.techStack.some(t => t.toLowerCase().includes(q))) {
        results.push({
          type: 'Project',
          title: p.title,
          sub: p.shortDescription,
          action: () => { window.closeModal(); window.openProjectModal(p.id); }
        });
      }
    });

    // Search blog posts
    (data.blogPosts || []).forEach(b => {
      if (b.title.toLowerCase().includes(q) || b.excerpt.toLowerCase().includes(q) || b.tags.some(t => t.toLowerCase().includes(q))) {
        results.push({
          type: 'Blog Article',
          title: b.title,
          sub: b.excerpt,
          action: () => { window.closeModal(); window.location.hash = `#/blog/${b.slug}`; }
        });
      }
    });

    // Search services
    (data.services || []).forEach(s => {
      if (s.title.toLowerCase().includes(q) || s.description.toLowerCase().includes(q)) {
        results.push({
          type: 'Service',
          title: s.title,
          sub: s.startingPrice + ' • ' + s.description,
          action: () => { window.closeModal(); window.openServiceModal(s.id); }
        });
      }
    });

    if (results.length === 0) {
      list.innerHTML = `
        <div class="p-6 text-center text-xs text-stone-500">
          No matches found for "<span class="font-bold text-stone-800">${query}</span>"
        </div>
      `;
      return;
    }

    list.innerHTML = results.map((r, i) => `
      <div onclick="window.executeSearchResult(${i})" class="p-3 rounded-xl hover:bg-stone-100 cursor-pointer transition flex items-center justify-between gap-3">
        <div class="overflow-hidden">
          <div class="flex items-center gap-2">
            <span class="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-stone-200 text-stone-700">${r.type}</span>
            <span class="text-xs font-bold text-stone-900 truncate">${r.title}</span>
          </div>
          <p class="text-[11px] text-stone-500 truncate mt-0.5">${r.sub}</p>
        </div>
        <i data-lucide="arrow-up-right" class="w-4 h-4 text-stone-400 shrink-0"></i>
      </div>
    `).join('');

    window._currentSearchResults = results;
    refreshIcons();
  }

  window.executeSearchResult = function (idx) {
    if (window._currentSearchResults && window._currentSearchResults[idx]) {
      window._currentSearchResults[idx].action();
    }
  };

  // --- KEYBOARD SHORTCUTS (⌘K, ESC) ---
  function initKeyboardShortcuts() {
    window.addEventListener('keydown', (e) => {
      // ⌘K or Ctrl+K or '/'
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        window.openSearchModal();
      } else if (e.key === 'Escape') {
        window.closeModal();
      }
    });
  }

  // --- MOBILE NAV TOGGLE ---
  window.toggleMobileNav = function () {
    const drawer = document.getElementById('mobile-nav-drawer');
    if (!drawer) return;
    drawer.classList.toggle('hidden');
    refreshIcons();
  };

  // --- NEWSLETTER SUBMIT ---
  window.handleNewsletterSubmit = function (e) {
    e.preventDefault();
    const input = document.getElementById('footer-newsletter-email');
    if (!input || !input.value.trim()) return;
    showToast(`Thanks! We'll keep ${input.value} updated on new toolkits.`);
    input.value = '';
  };

  // --- SIMPLE MARKDOWN PARSER FOR ARTICLE BODY ---
  function parseSimpleMarkdown(md) {
    if (!md) return '';

    let html = md;

    // Code blocks with syntax formatting & copy button
    html = html.replace(/```(typescript|javascript|html|css|json)?([\s\S]*?)```/g, (match, lang, code) => {
      const escapedCode = code.trim().replace(/</g, '&lt;').replace(/>/g, '&gt;');
      return `
        <div class="relative my-4 rounded-2xl overflow-hidden bg-[#1e1e2e] text-[#cdd6f4] p-4 text-xs font-mono border border-stone-800">
          <div class="flex items-center justify-between pb-2 mb-2 border-b border-stone-700/60 text-[10px] text-stone-400">
            <span>${lang || 'code'}</span>
            <button onclick="window.copyText(\`${escapedCode.replace(/`/g, '\\`')}\`, 'Code snippet')" class="hover:text-white transition">Copy</button>
          </div>
          <pre><code>${escapedCode}</code></pre>
        </div>
      `;
    });

    // Headers
    html = html.replace(/^### (.*$)/gim, '<h3 class="text-base font-bold text-stone-900 mt-6 mb-2 font-display">$1</h3>');
    html = html.replace(/^## (.*$)/gim, '<h2 class="text-xl font-extrabold text-stone-900 mt-8 mb-3 font-display">$1</h2>');
    html = html.replace(/^# (.*$)/gim, '<h1 class="text-2xl font-extrabold text-stone-900 mt-10 mb-4 font-display">$1</h1>');

    // Bold and italics
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-stone-900">$1</strong>');
    html = html.replace(/\*(.*?)\*/g, '<em class="italic">$1</em>');

    // Inline code
    html = html.replace(/`([^`]+)`/g, '<code class="px-1.5 py-0.5 bg-stone-100 text-[#e17055] rounded text-xs font-mono">$1</code>');

    // Lists
    html = html.replace(/^\- (.*$)/gim, '<li class="flex items-start gap-2 my-1 text-xs sm:text-sm text-stone-600"><span class="text-[#FF7675] font-bold mt-0.5">•</span><span>$1</span></li>');

    // Paragraphs
    html = html.split('\n\n').map(para => {
      if (para.startsWith('<h') || para.startsWith('<div') || para.startsWith('<li')) {
        return para;
      }
      return `<p class="text-xs sm:text-sm text-stone-600 leading-relaxed mb-4">${para}</p>`;
    }).join('');

    return html;
  }

})();
