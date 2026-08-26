// ============================================================================
// CODERTECH (Isaac) — Core Application Script
// Pure Vanilla JavaScript (ES6+) — Zero runtime dependencies needed
// Works immediately in Acode Editor, VS Code, and any Web Browser
// ============================================================================

(function () {
  'use strict';

  // --- STATE ---
  const state = {
    activeProjectCategory: 'all',
    activeBlogCategory: 'all',
    activeMonetizationTab: 'store',
    searchQuery: '',
    likedBlogs: JSON.parse(localStorage.getItem('codertech_liked_blogs') || '[]'),
    bookmarkedBlogs: JSON.parse(localStorage.getItem('codertech_bookmarked_blogs') || '[]'),
    customAvatar: localStorage.getItem('codertech_custom_avatar') || '',
    activeModal: null,
    currentBlogArticleId: null,
  };

  // Cache data
  const data = window.PORTFOLIO_DATA || {};

  // --- INITIALIZATION ---
  document.addEventListener('DOMContentLoaded', () => {
    initProfile();
    renderProjects();
    renderServices();
    renderProcessSteps();
    renderTestimonials();
    renderMonetizationStore();
    renderBlogPosts();
    renderFAQ();
    renderSocialLinks();
    initEstimator();
    initGlobalSearch();
    initKeyboardShortcuts();
    initModals();
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
    toast.className = 'toast-item px-4 py-3 rounded-xl shadow-lg border text-sm font-medium flex items-center gap-3 bg-white text-stone-800 border-stone-200';
    
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

  // --- PROFILE & AVATAR ---
  function initProfile() {
    const avatarUrl = state.customAvatar || data.profile.avatar;
    const heroAvatars = document.querySelectorAll('.dynamic-avatar-img');
    heroAvatars.forEach(img => {
      img.src = avatarUrl;
    });

    const emailLinks = document.querySelectorAll('.dynamic-email-link');
    emailLinks.forEach(link => {
      link.href = `mailto:${data.profile.email}`;
      if (link.dataset.showText === 'true') {
        link.textContent = data.profile.email;
      }
    });
  }

  // --- PROJECTS SECTION ---
  function renderProjects() {
    const grid = document.getElementById('projects-grid');
    if (!grid) return;

    const filtered = state.activeProjectCategory === 'all'
      ? data.projects
      : data.projects.filter(p => p.category === state.activeProjectCategory);

    grid.innerHTML = filtered.map(p => {
      const techTags = p.techStack.slice(0, 4).map(t => 
        `<span class="px-2.5 py-1 bg-stone-100/90 text-stone-700 text-xs font-semibold rounded-lg border border-stone-200/60">${t}</span>`
      ).join('');

      const metricsList = p.metrics.map(m => `
        <div class="bg-stone-50/90 rounded-xl p-2.5 text-center border border-stone-200/50">
          <div class="text-sm font-bold text-stone-800">${m.value}</div>
          <div class="text-[11px] text-stone-500 font-medium">${m.label}</div>
        </div>
      `).join('');

      return `
        <article class="bg-[#FFFDFB] rounded-2xl border border-stone-200/80 p-5 md:p-6 shadow-sm hover-lift flex flex-col justify-between" id="project-${p.id}">
          <div>
            <div class="flex items-center justify-between gap-2 mb-3">
              <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${p.badgeBg} ${p.badgeText}">
                ${p.tag}
              </span>
              <span class="text-xs font-semibold text-stone-400 font-mono">CASE STUDY</span>
            </div>

            <h3 class="text-xl font-bold text-stone-900 mb-2 font-display">
              ${p.title}
            </h3>

            <p class="text-sm text-stone-600 mb-4 leading-relaxed line-clamp-2">
              ${p.shortDescription}
            </p>

            <div class="grid grid-cols-3 gap-2 mb-4">
              ${metricsList}
            </div>

            <div class="flex flex-wrap gap-1.5 mb-6">
              ${techTags}
            </div>
          </div>

          <div class="pt-4 border-t border-stone-100 flex items-center justify-between gap-3">
            <button onclick="window.openProjectModal('${p.id}')" class="px-4 py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold transition flex items-center gap-2">
              <span>View Details</span>
              <i data-lucide="arrow-right" class="w-3.5 h-3.5"></i>
            </button>
            <div class="flex items-center gap-2">
              <a href="${p.liveUrl}" target="_blank" rel="noopener noreferrer" class="p-2.5 text-stone-600 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 rounded-xl transition" title="Live Preview">
                <i data-lucide="external-link" class="w-4 h-4"></i>
              </a>
              <a href="${p.githubUrl}" target="_blank" rel="noopener noreferrer" class="p-2.5 text-stone-600 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 rounded-xl transition" title="Source Code">
                <i data-lucide="github" class="w-4 h-4"></i>
              </a>
            </div>
          </div>
        </article>
      `;
    }).join('');

    refreshIcons();
  }

  window.filterProjects = function (category) {
    state.activeProjectCategory = category;
    document.querySelectorAll('.project-filter-btn').forEach(btn => {
      if (btn.dataset.category === category) {
        btn.className = 'project-filter-btn px-4 py-2 rounded-full text-xs font-bold bg-stone-900 text-white shadow-sm transition';
      } else {
        btn.className = 'project-filter-btn px-4 py-2 rounded-full text-xs font-bold bg-white text-stone-600 hover:bg-stone-100 border border-stone-200 transition';
      }
    });
    renderProjects();
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
        <div class="bg-[#FFFDFB] rounded-2xl border border-stone-200/80 p-6 shadow-sm hover-lift flex flex-col justify-between" id="service-${s.id}">
          <div>
            <div class="flex items-center justify-between mb-4">
              <div class="w-12 h-12 rounded-xl flex items-center justify-center bg-stone-100 text-stone-800" style="color: ${s.accentColor}">
                <i data-lucide="${s.iconName}" class="w-6 h-6"></i>
              </div>
              <span class="px-3 py-1 rounded-full text-xs font-bold ${s.badgeColor}">
                ${s.startingPrice}
              </span>
            </div>

            <h3 class="text-lg font-bold text-stone-900 mb-2 font-display">${s.title}</h3>
            <p class="text-xs text-stone-600 mb-4 leading-relaxed">${s.description}</p>

            <div class="mb-4 text-[11px] font-semibold text-stone-500 bg-stone-50 px-3 py-1.5 rounded-lg border border-stone-200/50">
              Est. Timeline: <span class="text-stone-800 font-bold">${s.estimatedTimeline}</span>
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

  // --- PROCESS SECTION ---
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
        <div class="bg-[#FFFDFB] rounded-2xl border border-stone-200/80 p-6 shadow-sm hover-lift flex flex-col justify-between">
          <div>
            <div class="flex items-center justify-between mb-4">
              <span class="w-10 h-10 rounded-xl bg-stone-900 text-white font-bold text-sm flex items-center justify-center font-mono">
                0${step.stepNumber}
              </span>
              <div class="p-2 rounded-lg bg-stone-100" style="color: ${step.color}">
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

  // --- MONETIZATION HUB (STORE, ESTIMATOR, SIMULATOR) ---
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

  function renderMonetizationStore() {
    const grid = document.getElementById('monetization-products-grid');
    if (!grid) return;

    grid.innerHTML = data.monetizationProducts.map(prod => {
      const featHtml = prod.features.map(f => `
        <li class="flex items-start gap-2 text-xs text-stone-600">
          <i data-lucide="check" class="w-3.5 h-3.5 text-emerald-500 mt-0.5 shrink-0"></i>
          <span>${f}</span>
        </li>
      `).join('');

      return `
        <div class="bg-[#FFFDFB] rounded-2xl border border-stone-200/80 p-6 shadow-sm hover-lift flex flex-col justify-between">
          <div>
            <div class="flex items-center justify-between mb-3">
              <span class="px-2.5 py-1 bg-amber-50 text-amber-700 text-xs font-bold rounded-full">
                ${prod.badge}
              </span>
              <span class="text-xs font-mono text-stone-400">${prod.type}</span>
            </div>

            <h3 class="text-lg font-bold text-stone-900 mb-2 font-display">${prod.title}</h3>
            <p class="text-xs text-stone-600 mb-4 leading-relaxed">${prod.description}</p>

            <div class="flex items-baseline gap-2 mb-4">
              <span class="text-3xl font-extrabold text-stone-900 font-display">${prod.price}</span>
              <span class="text-xs text-stone-400 font-medium">one-time payment</span>
            </div>

            <ul class="space-y-2 mb-6">
              ${featHtml}
            </ul>
          </div>

          <div class="pt-4 border-t border-stone-100">
            <button onclick="window.openCheckoutModal('${prod.id}')" class="w-full py-3 bg-[#e17055] hover:bg-[#d65d40] text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 shadow-sm">
              <i data-lucide="shopping-bag" class="w-4 h-4"></i>
              <span>Get Instant Access (${prod.price})</span>
            </button>
            <div class="text-center mt-2 text-[11px] text-stone-400">
              ⚡ ${prod.deliveryTime}
            </div>
          </div>
        </div>
      `;
    }).join('');

    refreshIcons();
  }

  // --- PROJECT PRICE ESTIMATOR ---
  function initEstimator() {
    const typeSelect = document.getElementById('calc-project-type');
    const urgencySelect = document.getElementById('calc-urgency');
    const featureCheckboxes = document.querySelectorAll('.calc-feature-check');

    function recalculate() {
      let baseMin = 1200;
      let baseMax = 1800;
      let weeksMin = 2;
      let weeksMax = 3;

      if (typeSelect) {
        const type = typeSelect.value;
        if (type === 'mobile') {
          baseMin = 1500; baseMax = 2400; weeksMin = 2; weeksMax = 4;
        } else if (type === 'saas') {
          baseMin = 2200; baseMax = 3500; weeksMin = 3; weeksMax = 5;
        } else if (type === 'backend') {
          baseMin = 950; baseMax = 1600; weeksMin = 1; weeksMax = 3;
        }
      }

      let extraCost = 0;
      let extraWeeks = 0;

      featureCheckboxes.forEach(cb => {
        if (cb.checked) {
          extraCost += parseInt(cb.dataset.price || '0', 10);
          extraWeeks += parseFloat(cb.dataset.weeks || '0');
        }
      });

      let mult = 1.0;
      if (urgencySelect && urgencySelect.value === 'rush') {
        mult = 1.35;
        weeksMin = Math.max(1, Math.round(weeksMin * 0.7));
        weeksMax = Math.max(1, Math.round(weeksMax * 0.7));
      }

      const finalMin = Math.round((baseMin + extraCost) * mult);
      const finalMax = Math.round((baseMax + extraCost * 1.2) * mult);
      const finalWeeksMin = Math.round(weeksMin + extraWeeks);
      const finalWeeksMax = Math.round(weeksMax + extraWeeks);

      const priceDisplay = document.getElementById('calc-price-result');
      const timeDisplay = document.getElementById('calc-timeline-result');

      if (priceDisplay) {
        priceDisplay.textContent = `$${finalMin.toLocaleString()} – $${finalMax.toLocaleString()}`;
      }
      if (timeDisplay) {
        timeDisplay.textContent = `${finalWeeksMin}–${finalWeeksMax} Weeks`;
      }
    }

    if (typeSelect) typeSelect.addEventListener('change', recalculate);
    if (urgencySelect) urgencySelect.addEventListener('change', recalculate);
    featureCheckboxes.forEach(cb => cb.addEventListener('change', recalculate));

    const requestProposalBtn = document.getElementById('calc-request-btn');
    if (requestProposalBtn) {
      requestProposalBtn.addEventListener('click', () => {
        const typeText = typeSelect ? typeSelect.options[typeSelect.selectedIndex].text : 'Web Project';
        const priceText = document.getElementById('calc-price-result')?.textContent || '$1,500';
        window.openContactModal({
          subject: `Proposal Request: ${typeText}`,
          message: `Hi Isaac, I used your project price calculator for a ${typeText} (Estimated range: ${priceText}). I would love to discuss the full scope and get a formal proposal.`
        });
      });
    }

    recalculate();
  }

  // --- BLOG POSTS SECTION ---
  function renderBlogPosts() {
    const grid = document.getElementById('blog-grid');
    if (!grid) return;

    const filtered = state.activeBlogCategory === 'all'
      ? data.blogPosts
      : data.blogPosts.filter(b => b.category === state.activeBlogCategory);

    grid.innerHTML = filtered.map(post => {
      const isLiked = state.likedBlogs.includes(post.id);
      const isBookmarked = state.bookmarkedBlogs.includes(post.id);
      const currentLikes = post.likesCount + (isLiked ? 1 : 0);

      const tagsHtml = post.tags.slice(0, 3).map(t => 
        `<span class="px-2 py-0.5 bg-stone-100 text-stone-600 text-[11px] font-semibold rounded-md">#${t}</span>`
      ).join('');

      return `
        <article class="bg-[#FFFDFB] rounded-2xl border border-stone-200/80 p-5 md:p-6 shadow-sm hover-lift flex flex-col justify-between" id="blog-${post.id}">
          <div>
            <div class="flex items-center justify-between gap-2 mb-3">
              <span class="px-3 py-1 bg-stone-100 text-stone-700 text-xs font-bold rounded-full">
                ${post.category}
              </span>
              <span class="text-xs text-stone-400 font-mono">${post.readTime}</span>
            </div>

            <h3 class="text-lg font-bold text-stone-900 mb-2 font-display hover:text-rose-600 transition cursor-pointer" onclick="window.openBlogModal('${post.id}')">
              ${post.title}
            </h3>

            <p class="text-xs text-stone-600 mb-4 leading-relaxed line-clamp-3">
              ${post.excerpt}
            </p>

            <div class="flex flex-wrap gap-1.5 mb-4">
              ${tagsHtml}
            </div>
          </div>

          <div class="pt-4 border-t border-stone-100 flex items-center justify-between">
            <div class="flex items-center gap-2">
              <img src="${post.author.avatar}" alt="${post.author.name}" class="w-6 h-6 rounded-full object-cover">
              <span class="text-xs font-semibold text-stone-700">${post.publishedAt}</span>
            </div>

            <div class="flex items-center gap-3">
              <button onclick="window.toggleBlogLike('${post.id}')" class="flex items-center gap-1 text-xs font-bold ${isLiked ? 'text-rose-600' : 'text-stone-400 hover:text-stone-600'} transition">
                <i data-lucide="heart" class="w-4 h-4 ${isLiked ? 'fill-rose-500' : ''}"></i>
                <span>${currentLikes}</span>
              </button>

              <button onclick="window.toggleBlogBookmark('${post.id}')" class="p-1 text-stone-400 hover:text-stone-800 transition">
                <i data-lucide="bookmark" class="w-4 h-4 ${isBookmarked ? 'fill-stone-800 text-stone-800' : ''}"></i>
              </button>

              <button onclick="window.openBlogModal('${post.id}')" class="px-3 py-1.5 bg-stone-900 hover:bg-stone-800 text-white rounded-lg text-xs font-bold transition">
                Read
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

  window.toggleBlogLike = function (id) {
    const idx = state.likedBlogs.indexOf(id);
    if (idx > -1) {
      state.likedBlogs.splice(idx, 1);
    } else {
      state.likedBlogs.push(id);
      showToast('Liked this article!', 'heart');
    }
    localStorage.setItem('codertech_liked_blogs', JSON.stringify(state.likedBlogs));
    renderBlogPosts();
    if (state.activeModal === 'blog-modal' && state.currentBlogArticleId === id) {
      updateBlogModalLikeButton(id);
    }
  };

  window.toggleBlogBookmark = function (id) {
    const idx = state.bookmarkedBlogs.indexOf(id);
    if (idx > -1) {
      state.bookmarkedBlogs.splice(idx, 1);
      showToast('Bookmark removed', 'info');
    } else {
      state.bookmarkedBlogs.push(id);
      showToast('Article saved to bookmarks!');
    }
    localStorage.setItem('codertech_bookmarked_blogs', JSON.stringify(state.bookmarkedBlogs));
    renderBlogPosts();
  };

  // --- FAQ SECTION ---
  function renderFAQ() {
    const container = document.getElementById('faq-accordion');
    if (!container) return;

    container.innerHTML = data.faq.map((item, idx) => `
      <div class="border border-stone-200/80 rounded-2xl bg-[#FFFDFB] overflow-hidden transition shadow-sm" id="faq-${item.id}">
        <button onclick="window.toggleFaq('${item.id}')" class="w-full p-5 text-left font-bold text-stone-800 flex items-center justify-between gap-4 hover:bg-stone-50/50 transition">
          <span class="text-sm md:text-base font-display">${item.question}</span>
          <i data-lucide="chevron-down" class="w-5 h-5 text-stone-400 transition-transform duration-200 shrink-0 faq-icon"></i>
        </button>
        <div class="faq-content hidden px-5 pb-5 text-xs md:text-sm text-stone-600 leading-relaxed border-t border-stone-100 pt-3">
          ${item.answer}
        </div>
      </div>
    `).join('');

    refreshIcons();
  }

  window.toggleFaq = function (id) {
    const el = document.getElementById(`faq-${id}`);
    if (!el) return;
    const content = el.querySelector('.faq-content');
    const icon = el.querySelector('.faq-icon');

    if (content.classList.contains('hidden')) {
      content.classList.remove('hidden');
      if (icon) icon.style.transform = 'rotate(180deg)';
    } else {
      content.classList.add('hidden');
      if (icon) icon.style.transform = 'rotate(0deg)';
    }
  };

  // --- TESTIMONIALS ---
  function renderTestimonials() {
    const grid = document.getElementById('testimonials-grid');
    if (!grid) return;

    grid.innerHTML = data.testimonials.map(t => `
      <div class="bg-[#FFFDFB] rounded-2xl border border-stone-200/80 p-6 shadow-sm hover-lift flex flex-col justify-between">
        <div>
          <div class="flex items-center gap-1 text-amber-400 mb-4">
            ★★★★★
          </div>
          <p class="text-xs md:text-sm text-stone-700 leading-relaxed italic mb-6">
            "${t.quote}"
          </p>
        </div>

        <div class="flex items-center gap-3 pt-4 border-t border-stone-100">
          <img src="${t.avatarUrl}" alt="${t.author}" class="w-10 h-10 rounded-full object-cover border border-stone-200">
          <div>
            <div class="text-xs font-bold text-stone-900">${t.author}</div>
            <div class="text-[11px] text-stone-500">${t.role}, ${t.company}</div>
          </div>
        </div>
      </div>
    `).join('');
  }

  // --- SOCIAL MEDIA LINKS ---
  function renderSocialLinks() {
    const grid = document.getElementById('social-links-grid');
    if (!grid) return;

    grid.innerHTML = data.socialLinks.map(s => `
      <div class="bg-[#FFFDFB] rounded-2xl border border-stone-200/80 p-5 shadow-sm hover-lift flex flex-col justify-between">
        <div>
          <div class="flex items-center justify-between mb-3">
            <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-stone-100 text-stone-700 font-mono">
              ${s.badge}
            </span>
            <span class="text-xs text-stone-400 font-medium">${s.stats}</span>
          </div>

          <div class="flex items-center gap-3 mb-2">
            <div class="w-9 h-9 rounded-xl flex items-center justify-center bg-stone-100 text-stone-800">
              <i data-lucide="${s.iconName}" class="w-4 h-4"></i>
            </div>
            <div>
              <h4 class="text-sm font-bold text-stone-900 font-display">${s.name}</h4>
              <div class="text-xs text-stone-500 font-mono">${s.handle}</div>
            </div>
          </div>

          <p class="text-xs text-stone-600 mb-4 leading-relaxed">
            ${s.description}
          </p>
        </div>

        <div class="flex items-center gap-2 pt-3 border-t border-stone-100">
          <a href="${s.url}" target="_blank" rel="noopener noreferrer" class="flex-1 py-2 px-3 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold text-center transition">
            Visit ${s.name}
          </a>
          <button onclick="window.copyText('${s.handle}', '${s.name} Handle')" class="p-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl transition" title="Copy Handle">
            <i data-lucide="copy" class="w-4 h-4"></i>
          </button>
        </div>
      </div>
    `).join('');

    refreshIcons();
  }

  // --- MODALS SYSTEM ---
  function initModals() {
    // Backdrop click close
    document.querySelectorAll('.modal-overlay').forEach(modal => {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          window.closeModal();
        }
      });
    });

    // Close buttons
    document.querySelectorAll('.modal-close-btn').forEach(btn => {
      btn.addEventListener('click', () => window.closeModal());
    });
  }

  window.openModal = function (modalId) {
    window.closeModal();
    const modal = document.getElementById(modalId);
    if (!modal) return;
    modal.classList.remove('modal-hidden');
    state.activeModal = modalId;
    document.body.style.overflow = 'hidden';
    refreshIcons();
  };

  window.closeModal = function () {
    document.querySelectorAll('.modal-overlay').forEach(m => {
      m.classList.add('modal-hidden');
    });
    state.activeModal = null;
    document.body.style.overflow = 'auto';
  };

  // 1. Project Modal
  window.openProjectModal = function (projectId) {
    const project = data.projects.find(p => p.id === projectId);
    if (!project) return;

    const modal = document.getElementById('project-modal');
    if (!modal) return;

    document.getElementById('pm-tag').textContent = project.tag;
    document.getElementById('pm-title').textContent = project.title;
    document.getElementById('pm-full-desc').textContent = project.fullDescription;
    document.getElementById('pm-live-btn').href = project.liveUrl;
    document.getElementById('pm-code-btn').href = project.githubUrl;

    const highlightsList = document.getElementById('pm-highlights');
    if (highlightsList) {
      highlightsList.innerHTML = project.highlights.map(h => `
        <li class="flex items-start gap-2.5 text-xs md:text-sm text-stone-700">
          <i data-lucide="check-circle-2" class="w-4 h-4 text-emerald-500 mt-0.5 shrink-0"></i>
          <span>${h}</span>
        </li>
      `).join('');
    }

    const techStackList = document.getElementById('pm-tech-stack');
    if (techStackList) {
      techStackList.innerHTML = project.techStack.map(t => `
        <span class="px-3 py-1 bg-stone-100 text-stone-800 text-xs font-bold rounded-lg border border-stone-200">${t}</span>
      `).join('');
    }

    const metricsList = document.getElementById('pm-metrics');
    if (metricsList) {
      metricsList.innerHTML = project.metrics.map(m => `
        <div class="bg-stone-50 rounded-xl p-3 text-center border border-stone-200/60">
          <div class="text-base font-extrabold text-stone-900">${m.value}</div>
          <div class="text-xs text-stone-500 font-medium">${m.label}</div>
        </div>
      `).join('');
    }

    window.openModal('project-modal');
  };

  // 2. Blog Article Modal
  window.openBlogModal = function (blogId) {
    const post = data.blogPosts.find(b => b.id === blogId);
    if (!post) return;

    state.currentBlogArticleId = blogId;

    document.getElementById('bm-category').textContent = post.category;
    document.getElementById('bm-readtime').textContent = post.readTime;
    document.getElementById('bm-date').textContent = post.publishedAt;
    document.getElementById('bm-title').textContent = post.title;
    document.getElementById('bm-author-name').textContent = post.author.name;
    document.getElementById('bm-author-role').textContent = post.author.role;
    document.getElementById('bm-author-img').src = post.author.avatar;

    const contentDiv = document.getElementById('bm-content');
    if (contentDiv) {
      contentDiv.innerHTML = parseSimpleMarkdown(post.contentMarkdown);
    }

    updateBlogModalLikeButton(blogId);
    renderBlogComments(post);

    window.openModal('blog-modal');
  };

  function updateBlogModalLikeButton(blogId) {
    const post = data.blogPosts.find(b => b.id === blogId);
    if (!post) return;
    const isLiked = state.likedBlogs.includes(blogId);
    const likeBtn = document.getElementById('bm-like-btn');
    if (likeBtn) {
      const count = post.likesCount + (isLiked ? 1 : 0);
      likeBtn.innerHTML = `
        <i data-lucide="heart" class="w-4 h-4 ${isLiked ? 'fill-rose-500 text-rose-500' : ''}"></i>
        <span>${count} Likes</span>
      `;
      likeBtn.onclick = () => window.toggleBlogLike(blogId);
    }
  }

  function renderBlogComments(post) {
    const list = document.getElementById('bm-comments-list');
    if (!list) return;

    if (!post.comments || post.comments.length === 0) {
      list.innerHTML = `<div class="text-xs text-stone-400 py-3 italic">Be the first to share your thoughts on this article!</div>`;
      return;
    }

    list.innerHTML = post.comments.map(c => `
      <div class="bg-stone-50 rounded-xl p-3 border border-stone-200/60 mb-2">
        <div class="flex items-center justify-between mb-1">
          <div class="flex items-center gap-2">
            <img src="${c.avatar}" class="w-5 h-5 rounded-full object-cover">
            <span class="text-xs font-bold text-stone-800">${c.author}</span>
          </div>
          <span class="text-[10px] text-stone-400 font-mono">${c.createdAt}</span>
        </div>
        <p class="text-xs text-stone-600 pl-7 leading-relaxed">${c.content}</p>
      </div>
    `).join('');
  }

  window.postBlogComment = function (e) {
    e.preventDefault();
    const input = document.getElementById('bm-comment-input');
    if (!input || !input.value.trim() || !state.currentBlogArticleId) return;

    const post = data.blogPosts.find(b => b.id === state.currentBlogArticleId);
    if (!post) return;

    if (!post.comments) post.comments = [];
    post.comments.unshift({
      id: 'c_' + Date.now(),
      author: 'You (Visitor)',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
      content: input.value.trim(),
      createdAt: 'Just now',
      likes: 0
    });

    input.value = '';
    renderBlogComments(post);
    showToast('Comment posted successfully!');
  };

  // Simple Markdown Converter
  function parseSimpleMarkdown(md) {
    if (!md) return '';
    let html = md
      // Code blocks with syntax highlighting wrapper
      .replace(/```(typescript|javascript|json|html|css)?\n([\s\S]*?)```/g, (match, lang, code) => {
        const escaped = escapeHtml(code.trim());
        return `<pre><div class="flex justify-between items-center text-xs text-stone-400 pb-2 border-b border-stone-700 mb-2 font-mono"><span>${lang || 'code'}</span><button onclick="window.copyText(\`${escapeJsString(code.trim())}\`, 'Code Snippet')" class="hover:text-white transition">Copy</button></div><code>${escaped}</code></pre>`;
      })
      // Headings
      .replace(/^### (.*$)/gim, '<h3>$1</h3>')
      .replace(/^## (.*$)/gim, '<h2>$1</h2>')
      .replace(/^# (.*$)/gim, '<h1>$1</h1>')
      // Inline code
      .replace(/`([^`]+)`/g, '<code>$1</code>')
      // Bold
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
      // Bullet list items
      .replace(/^\s*-\s+([^\n]+)/gim, '<li>$1</li>')
      // Paragraphs
      .replace(/\n\n/g, '</p><p>');

    return `<p>${html}</p>`.replace(/<p><\/p>/g, '');
  }

  function escapeHtml(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  function escapeJsString(str) {
    return str.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$/g, '\\$');
  }

  // 3. Service Modal
  window.openServiceModal = function (serviceId) {
    const service = data.services.find(s => s.id === serviceId);
    if (!service) return;

    document.getElementById('sm-title').textContent = service.title;
    document.getElementById('sm-price').textContent = service.startingPrice;
    document.getElementById('sm-timeline').textContent = service.estimatedTimeline;
    document.getElementById('sm-desc').textContent = service.description;
    document.getElementById('sm-ideal').textContent = service.idealFor;

    const featList = document.getElementById('sm-features');
    if (featList) {
      featList.innerHTML = service.features.map(f => `
        <li class="flex items-center gap-2 text-xs md:text-sm text-stone-700">
          <i data-lucide="check" class="w-4 h-4 text-emerald-500 shrink-0"></i>
          <span>${f}</span>
        </li>
      `).join('');
    }

    const bookBtn = document.getElementById('sm-book-btn');
    if (bookBtn) {
      bookBtn.onclick = () => {
        window.openContactModal({
          subject: `Service Inquiry: ${service.title}`,
          message: `Hi Isaac, I would like to hire you for ${service.title} (Starting at ${service.startingPrice}). Here are some details about my project:`
        });
      };
    }

    window.openModal('service-modal');
  };

  // 4. Contact / Proposal Modal
  window.openContactModal = function (prefilled) {
    const modal = document.getElementById('contact-modal');
    if (!modal) return;

    if (prefilled) {
      const subjInput = document.getElementById('contact-subject');
      const msgInput = document.getElementById('contact-message');
      if (subjInput && prefilled.subject) subjInput.value = prefilled.subject;
      if (msgInput && prefilled.message) msgInput.value = prefilled.message;
    }

    window.openModal('contact-modal');
  };

  window.handleContactSubmit = function (e) {
    e.preventDefault();
    const name = document.getElementById('contact-name')?.value || '';
    const email = document.getElementById('contact-email')?.value || '';
    const message = document.getElementById('contact-message')?.value || '';

    showToast(`Thank you, ${name || 'friend'}! Your message has been sent to Isaac.`);
    window.closeModal();
    e.target.reset();
  };

  // 5. Digital Product Checkout Modal Simulation
  window.openCheckoutModal = function (productId) {
    const prod = data.monetizationProducts.find(p => p.id === productId);
    if (!prod) return;

    document.getElementById('cm-prod-title').textContent = prod.title;
    document.getElementById('cm-prod-price').textContent = prod.price;
    document.getElementById('cm-prod-type').textContent = prod.type;
    document.getElementById('cm-prod-delivery').textContent = prod.deliveryTime;

    const licenseBox = document.getElementById('cm-license-box');
    if (licenseBox) licenseBox.classList.add('hidden');

    const form = document.getElementById('checkout-form');
    if (form) {
      form.classList.remove('hidden');
      form.onsubmit = (e) => {
        e.preventDefault();
        const email = document.getElementById('checkout-email')?.value || 'dev@example.com';
        form.classList.add('hidden');
        if (licenseBox) {
          licenseBox.classList.remove('hidden');
          const key = `CT-${Math.random().toString(36).substring(2, 8).toUpperCase()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
          document.getElementById('cm-license-key').textContent = key;
        }
        showToast('Order confirmed! Simulated license key generated.');
      };
    }

    window.openModal('checkout-modal');
  };

  // 6. Photo Settings Modal
  window.openPhotoSettingsModal = function () {
    const input = document.getElementById('photo-url-input');
    if (input) input.value = state.customAvatar || data.profile.avatar;
    window.openModal('photo-modal');
  };

  window.selectAvatarPreset = function (url) {
    const input = document.getElementById('photo-url-input');
    if (input) input.value = url;
    saveCustomAvatar(url);
  };

  window.saveCustomAvatar = function (url) {
    const finalUrl = url || document.getElementById('photo-url-input')?.value || data.profile.avatar;
    state.customAvatar = finalUrl;
    localStorage.setItem('codertech_custom_avatar', finalUrl);
    initProfile();
    showToast('Profile photo updated successfully!');
    window.closeModal();
  };

  window.resetDefaultAvatar = function () {
    state.customAvatar = '';
    localStorage.removeItem('codertech_custom_avatar');
    initProfile();
    showToast('Reset to default avatar!');
    window.closeModal();
  };

  // --- GLOBAL SEARCH (⌘K / Ctrl+K) ---
  function initGlobalSearch() {
    const searchInput = document.getElementById('global-search-input');
    if (!searchInput) return;

    searchInput.addEventListener('input', (e) => {
      performSearch(e.target.value);
    });
  }

  window.openSearchModal = function () {
    window.openModal('search-modal');
    setTimeout(() => {
      const input = document.getElementById('global-search-input');
      if (input) {
        input.focus();
        input.select();
      }
      performSearch('');
    }, 50);
  };

  function performSearch(query) {
    const q = query.toLowerCase().trim();
    const resultsContainer = document.getElementById('search-results-list');
    if (!resultsContainer) return;

    const projectMatches = data.projects.filter(p => 
      !q || p.title.toLowerCase().includes(q) || p.shortDescription.toLowerCase().includes(q) || p.techStack.some(t => t.toLowerCase().includes(q))
    ).map(p => ({
      type: 'Project',
      title: p.title,
      desc: p.shortDescription,
      badge: p.tag,
      action: () => { window.closeModal(); window.openProjectModal(p.id); }
    }));

    const blogMatches = data.blogPosts.filter(b => 
      !q || b.title.toLowerCase().includes(q) || b.excerpt.toLowerCase().includes(q) || b.tags.some(t => t.toLowerCase().includes(q))
    ).map(b => ({
      type: 'Blog Article',
      title: b.title,
      desc: b.excerpt,
      badge: b.category,
      action: () => { window.closeModal(); window.openBlogModal(b.id); }
    }));

    const serviceMatches = data.services.filter(s => 
      !q || s.title.toLowerCase().includes(q) || s.description.toLowerCase().includes(q)
    ).map(s => ({
      type: 'Service',
      title: s.title,
      desc: s.description,
      badge: s.startingPrice,
      action: () => { window.closeModal(); window.openServiceModal(s.id); }
    }));

    const allMatches = [...projectMatches, ...blogMatches, ...serviceMatches];

    if (allMatches.length === 0) {
      resultsContainer.innerHTML = `
        <div class="py-8 text-center text-xs text-stone-400">
          No matches found for "<span class="text-stone-700 font-bold">${q}</span>". Try searching for "React", "Mobile", "SaaS", or "Monetization".
        </div>
      `;
      return;
    }

    resultsContainer.innerHTML = allMatches.map((m, i) => `
      <div class="search-item p-3.5 rounded-xl hover:bg-stone-100 transition cursor-pointer border border-transparent hover:border-stone-200 flex items-start justify-between gap-3" data-idx="${i}">
        <div>
          <div class="flex items-center gap-2 mb-1">
            <span class="px-2 py-0.5 bg-stone-200 text-stone-700 rounded text-[10px] font-bold uppercase font-mono">${m.type}</span>
            <span class="text-xs font-bold text-stone-900">${m.title}</span>
          </div>
          <p class="text-xs text-stone-500 line-clamp-1">${m.desc}</p>
        </div>
        <span class="text-xs font-mono text-stone-400 shrink-0 font-semibold">${m.badge}</span>
      </div>
    `).join('');

    resultsContainer.querySelectorAll('.search-item').forEach((item, idx) => {
      item.addEventListener('click', () => {
        allMatches[idx].action();
      });
    });
  }

  // --- KEYBOARD SHORTCUTS ---
  function initKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        window.openSearchModal();
      }
      if (e.key === 'Escape' && state.activeModal) {
        window.closeModal();
      }
    });
  }

  // Mobile Menu Toggle
  window.toggleMobileNav = function () {
    const nav = document.getElementById('mobile-nav-drawer');
    if (!nav) return;
    nav.classList.toggle('hidden');
  };

})();
