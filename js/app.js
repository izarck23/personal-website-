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
    currentUser: JSON.parse(localStorage.getItem('codertech_user') || 'null') || {
      isLoggedIn: true,
      name: 'Isaac',
      handle: '@isaac_codertech',
      email: 'isaacapptech23developer@gmail.com',
      role: 'Full-Stack Engineer & Kotlin Android Developer',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
      bio: 'Software engineer building modern native Kotlin Android apps and lightweight, ultra-fast web architectures. Passionate about developer tools and tech blogging.',
      location: 'Global / Remote',
      github: 'https://github.com',
      twitter: 'https://twitter.com'
    },
    activeModal: null,
    searchActiveIndex: -1,
    cameraStream: null,
    cameraFacingMode: 'user',
    isCameraMirrored: true,
    capturedSnapshotData: null,
    otpTimerInterval: null,
    otpTimeRemaining: 45,
    modalAuthMode: 'signin',
  };

  // Cache data
  const data = window.PORTFOLIO_DATA || {};

  // --- INITIALIZATION ---
  function initializeApp() {
    try {
      initTheme();
      initRouter();
      initProfile();
      updateNavbarAuthState();
      renderUserProfileView();
      initOtpInputListeners();
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
      checkInitialAuthGateway();
    } catch (err) {
      console.error('Error during app initialization:', err);
    }
  }

  function checkInitialAuthGateway() {
    const user = state.currentUser;
    const isBypassed = sessionStorage.getItem('codertech_auth_bypassed');
    const hash = window.location.hash || '';

    // If navigated specifically to #/auth or #/auth/:tab
    if (hash === '#/auth' || hash.startsWith('#/auth/')) {
      const tab = hash.replace('#/auth/', '').replace('#/auth', '') || 'welcome';
      showAuthGatewayScreen(tab === 'signup' ? 'signup' : (tab === 'verify' ? 'verify' : (tab === 'forgot' ? 'forgot' : (tab === 'signin' ? 'signin' : 'welcome'))));
      window.openModal('auth-modal');
      return;
    }

    // When the user opens the website, it starts with auth screens (welcome, create account, login or sign up)
    if ((!user || !user.isLoggedIn) && !isBypassed) {
      setTimeout(() => {
        showAuthGatewayScreen('welcome');
        window.openModal('auth-modal');
      }, 120);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
  } else {
    initializeApp();
  }

  // --- THEME MANAGEMENT (DARK / LIGHT MODE) ---
  function initTheme() {
    try {
      const savedTheme = localStorage.getItem('codertech_theme');
      const isDark = savedTheme === 'dark';
      applyTheme(isDark ? 'dark' : 'light', false);
    } catch (e) {
      console.warn('Theme initialization warning:', e);
    }
  }

  function applyTheme(theme, showNotification = true) {
    const isDark = theme === 'dark';
    const root = document.documentElement;
    
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    const moonIcon = document.getElementById('theme-icon-moon');
    const sunIcon = document.getElementById('theme-icon-sun');
    const mobileThemeText = document.getElementById('mobile-theme-text');

    if (moonIcon && sunIcon) {
      if (isDark) {
        moonIcon.classList.add('hidden');
        moonIcon.classList.remove('block');
        sunIcon.classList.remove('hidden');
        sunIcon.classList.add('block');
      } else {
        sunIcon.classList.add('hidden');
        sunIcon.classList.remove('block');
        moonIcon.classList.remove('hidden');
        moonIcon.classList.add('block');
      }
    }

    if (mobileThemeText) {
      mobileThemeText.textContent = isDark ? 'Light Mode' : 'Dark Mode';
    }

    const cardLight = document.getElementById('theme-card-light');
    const cardDark = document.getElementById('theme-card-dark');
    const badgeLight = document.getElementById('badge-light-active');
    const badgeDark = document.getElementById('badge-dark-active');
    const profThemeCheckbox = document.getElementById('prof-theme-switch');

    if (cardLight && cardDark) {
      if (isDark) {
        cardLight.className = 'p-5 rounded-3xl border-2 cursor-pointer transition border-stone-200 bg-stone-50 hover:border-stone-400';
        cardDark.className = 'p-5 rounded-3xl border-2 cursor-pointer transition border-[#6C5CE7] bg-stone-900 text-white shadow-xs';
        if (badgeLight) badgeLight.classList.add('hidden');
        if (badgeDark) badgeDark.classList.remove('hidden');
      } else {
        cardLight.className = 'p-5 rounded-3xl border-2 cursor-pointer transition border-[#6C5CE7] bg-purple-50/40 shadow-xs';
        cardDark.className = 'p-5 rounded-3xl border-2 cursor-pointer transition border-stone-200 bg-stone-900 text-white hover:border-stone-400';
        if (badgeLight) badgeLight.classList.remove('hidden');
        if (badgeDark) badgeDark.classList.add('hidden');
      }
    }

    if (profThemeCheckbox) {
      profThemeCheckbox.checked = isDark;
    }

    if (showNotification && typeof showToast === 'function') {
      showToast(isDark ? '🌙 Dark theme enabled' : '☀️ Light theme enabled', 'info');
    }

    refreshIcons();
  }
  window.applyTheme = applyTheme;

  function toggleTheme() {
    const isCurrentlyDark = document.documentElement.classList.contains('dark');
    const newTheme = isCurrentlyDark ? 'light' : 'dark';
    
    try {
      localStorage.setItem('codertech_theme', newTheme);
    } catch (e) {}

    applyTheme(newTheme, true);

    if (typeof window.trackEvent === 'function') {
      window.trackEvent('theme_toggle', { theme: newTheme });
    }
  }
  window.toggleTheme = toggleTheme;

  // --- ANALYTICS TRACKING ---
  function trackEvent(eventName, params = {}) {
    try {
      if (typeof window.gtag === 'function') {
        window.gtag('event', eventName, params);
      }
    } catch (e) {}
  }
  window.trackEvent = trackEvent;

  function trackPageView(pagePath, pageTitle) {
    try {
      if (typeof window.gtag === 'function' && window.GA_MEASUREMENT_ID) {
        window.gtag('config', window.GA_MEASUREMENT_ID, {
          page_path: pagePath,
          page_title: pageTitle
        });
      }
    } catch (e) {}
  }
  window.trackPageView = trackPageView;

  // --- ICONS HELPER ---
  function refreshIcons() {
    if (window.lucide && typeof window.lucide.createIcons === 'function') {
      window.lucide.createIcons();
    }
  }
  window.refreshIcons = refreshIcons;

  // --- TOAST NOTIFICATION ---
  function showToast(message, type = 'success') {
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
  }
  window.showToast = showToast;

  // --- CLIPBOARD ---
  function copyText(text, label = 'Text') {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(() => {
        showToast(`Copied ${label} to clipboard!`);
      }).catch(() => fallbackCopy(text, label));
    } else {
      fallbackCopy(text, label);
    }
  }
  window.copyText = copyText;

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

    // Track SPA Pageview in Google Analytics 4
    if (typeof window.trackPageView === 'function') {
      let pageTitle = 'Isaac (codertech) — Portfolio & Blog';
      if (hash.startsWith('#/blog/')) {
        const slug = hash.replace('#/blog/', '');
        const post = (data.blogPosts || []).find(b => b.slug === slug || b.id === slug);
        pageTitle = post ? `${post.title} — codertech Blog` : 'Article — codertech Blog';
      } else if (hash === '#/blog') {
        pageTitle = 'Technical Blog & Playbook — codertech';
      } else if (hash === '#/projects') {
        pageTitle = 'Projects Showcase — codertech';
      }
      window.trackPageView(hash, pageTitle);
    }

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

    // Check for auth routes: #/auth or #/auth/:tab
    if (hash === '#/auth' || hash.startsWith('#/auth/')) {
      const tab = hash.replace('#/auth/', '').replace('#/auth', '') || 'signin';
      if (typeof window.switchAuthTab === 'function') {
        window.switchAuthTab(tab === 'signup' ? 'signup' : (tab === 'verify' ? 'verify' : (tab === 'forgot' ? 'forgot' : 'signin')));
      }
      switchView('auth-view');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // Check for user profile route: #/profile
    if (hash === '#/profile' || hash.startsWith('#/profile/')) {
      const pTab = hash.replace('#/profile/', '').replace('#/profile', '') || 'info';
      if (typeof window.switchProfileTab === 'function') {
        window.switchProfileTab(['info', 'avatar', 'settings', 'bookmarks'].includes(pTab) ? pTab : 'info');
      }
      if (typeof renderUserProfileView === 'function') {
        renderUserProfileView();
      }
      switchView('profile-view');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // Home or anchor section on home
    switchView('home-view');

    // Handle scroll to anchor if needed
    if (hash.startsWith('#') && hash.length > 1 && !hash.startsWith('#/')) {
      const targetId = hash.substring(1);
      const targetEl = document.getElementById(targetId);
      if (targetEl && typeof targetEl.scrollIntoView === 'function') {
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
    const defaultAvatar = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80';
    const avatarUrl = state.customAvatar || (state.currentUser && state.currentUser.avatar) || (data.profile && data.profile.avatar) || defaultAvatar;
    document.querySelectorAll('.dynamic-avatar-img').forEach(img => {
      img.src = avatarUrl;
    });
    document.querySelectorAll('.dynamic-user-avatar').forEach(img => {
      img.src = avatarUrl;
    });
    const userAvatarEl = document.getElementById('user-profile-avatar');
    if (userAvatarEl) {
      userAvatarEl.src = avatarUrl;
    }
  }

  // --- FEATURED PROJECTS CAROUSEL (PURPLE SECTION) ---
  function renderFeaturedProjectsCarousel() {
    const container = document.getElementById('projects-carousel-container');
    const dotsContainer = document.getElementById('projects-carousel-dots');
    if (!container || !data.projects) return;

    // Show projects
    container.innerHTML = data.projects.map(p => {
      // Mockup generation based on specific project ID or device type
      let mockupHtml = '';

      if (p.id === 'auth-screens-project') {
        mockupHtml = `
          <div class="h-48 bg-gradient-to-br from-[#1e3c72] via-[#2a5298] to-[#5c7aea] rounded-2xl p-3 flex items-center justify-center relative overflow-hidden border border-blue-300/40 mb-5 shadow-inner select-none">
            <!-- Concentric bubble circles in background matching screenshots -->
            <div class="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-white/20 blur-[1px]"></div>
            <div class="absolute top-8 right-8 w-14 h-14 rounded-full bg-white/30"></div>
            <div class="absolute top-2 left-6 w-16 h-16 rounded-full bg-blue-900/30"></div>
            <div class="absolute -bottom-8 -left-4 w-28 h-28 rounded-full bg-white/15"></div>

            <!-- Mobile phone shell preview -->
            <div class="w-44 h-42 bg-stone-900/90 rounded-2xl p-2.5 shadow-2xl border border-white/20 flex flex-col justify-between relative z-10 backdrop-blur-sm transform hover:scale-[1.02] transition-transform">
              <div class="flex items-center justify-between text-[8px] text-white/80 font-mono px-1">
                <span>‹ Back</span>
                <span class="font-bold text-amber-300 font-mono text-[7px] bg-amber-400/20 px-1.5 py-0.5 rounded">5 SCREENS</span>
              </div>
              <div class="text-center py-1">
                <div class="text-xs font-black text-white tracking-tight font-display">Welcome Back!</div>
                <div class="text-[8px] text-blue-200 font-medium">Enter details to the account</div>
              </div>
              <!-- Interactive pill buttons preview -->
              <div class="space-y-1">
                <div class="flex items-center justify-center gap-1.5 py-1 px-2 bg-white/10 rounded-lg text-[8px] font-bold text-white">
                  <span>Sign in</span>
                </div>
                <div class="flex items-center justify-center gap-1.5 py-1 px-2 bg-white rounded-lg text-[8px] font-extrabold text-blue-900 shadow-sm">
                  <span>Sign up</span>
                </div>
              </div>
              <!-- Social auth mini dots -->
              <div class="flex items-center justify-center gap-2 pt-0.5 text-[8px] text-white/70 font-mono">
                <span class="text-[7px]">f</span>
                <span class="text-[7px]">𝕏</span>
                <span class="text-[7px]">G</span>
                <span class="text-[7px]"></span>
              </div>
            </div>
          </div>
        `;
      } else if (p.id === 'luxe-salon-website') {
        mockupHtml = `
          <div class="h-48 bg-gradient-to-br from-[#1a1a1a] via-[#2d241e] to-[#4a3928] rounded-2xl p-3 flex flex-col justify-between relative overflow-hidden border border-amber-500/30 mb-5 shadow-inner">
            <div class="flex items-center justify-between bg-stone-900/80 backdrop-blur-sm px-2.5 py-1 rounded-lg border border-amber-500/20">
              <span class="text-[9px] font-extrabold text-amber-400 font-serif tracking-wider">LUXE SALON</span>
              <span class="text-[8px] font-mono text-emerald-400 bg-emerald-950/60 px-1.5 py-0.5 rounded">100/100 SPEED</span>
            </div>
            <div class="bg-stone-900/90 rounded-xl p-2.5 border border-amber-500/20 text-center shadow-lg">
              <div class="text-[11px] font-bold text-stone-100 font-serif">Artistry in Every Strand</div>
              <div class="text-[8px] text-amber-300 font-mono mt-0.5">Booking Modal • Filter Gallery • Express API</div>
            </div>
            <div class="flex items-center justify-between text-[8px] text-stone-400 px-1 font-mono">
              <span>ZERO BUILD STEP</span>
              <span class="text-amber-400 font-bold">FREE FRONTEND</span>
            </div>
          </div>
        `;
      } else if (p.deviceType === 'mobile') {
        mockupHtml = `
          <div class="h-48 bg-gradient-to-tr from-rose-50 to-pink-100 rounded-2xl p-4 flex items-center justify-center relative overflow-hidden border border-rose-100/60 mb-5">
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
          <div class="h-48 bg-gradient-to-tr from-purple-50 to-indigo-100 rounded-2xl p-3 flex flex-col justify-between relative overflow-hidden border border-purple-100/60 mb-5">
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
          <div class="h-48 bg-gradient-to-tr from-amber-50 to-orange-100 rounded-2xl p-3 flex flex-col justify-between relative overflow-hidden border border-amber-100/60 mb-5">
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

      // Card action footer customized for downloadable templates vs standard apps
      let actionFooterHtml = '';

      if (p.isFreeFrontend && p.downloadZipId) {
        const backendPrice = p.downloadZipId === 'prod-auth-screens' ? '$1.99' : '$2.99';
        actionFooterHtml = `
          <div class="pt-4 border-t border-stone-100 flex flex-col gap-2">
            <div class="grid grid-cols-2 gap-2">
              <button onclick="window.openTemplateDemoModal('${p.liveUrl}', '${p.title}', '${p.tag}', '${p.downloadZipId}')" class="px-3 py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-extrabold transition flex items-center justify-center gap-1.5 shadow-sm transform active:scale-95 cursor-pointer">
                <i data-lucide="play" class="w-3.5 h-3.5 text-amber-300 fill-amber-300"></i>
                <span>Live Demo</span>
              </button>
              <button onclick="window.openCheckoutModal('${p.downloadZipId}')" class="px-3 py-2.5 bg-[#e17055] hover:bg-[#d65d40] text-white rounded-xl text-xs font-extrabold transition flex items-center justify-center gap-1.5 shadow-sm transform active:scale-95 cursor-pointer">
                <i data-lucide="zap" class="w-3.5 h-3.5 text-amber-300"></i>
                <span>Get Full Access (${backendPrice})</span>
              </button>
            </div>
            <div class="flex items-center justify-between gap-2">
              <button onclick="window.downloadProjectZip('${p.downloadZipId}', false)" class="px-3 py-1.5 bg-gradient-to-r from-emerald-50 to-teal-50 hover:from-emerald-100 hover:to-teal-100 text-emerald-800 border border-emerald-200/80 rounded-xl text-[11px] font-extrabold transition flex items-center gap-1.5 cursor-pointer">
                <i data-lucide="download" class="w-3.5 h-3.5 text-emerald-600"></i>
                <span>Free .ZIP</span>
              </button>
              <button onclick="window.openProjectModal('${p.id}')" class="px-3 py-1.5 text-stone-600 hover:text-stone-900 font-bold text-[11px] flex items-center gap-1 transition">
                <span>Details & Case Study</span>
                <i data-lucide="chevron-right" class="w-3.5 h-3.5"></i>
              </button>
            </div>
          </div>
        `;
      } else {
        actionFooterHtml = `
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

          ${actionFooterHtml}
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

    grid.innerHTML = data.monetizationProducts.map(prod => {
      const isBundle = prod.id === 'prod-fullstack-bundle';
      const screensHtml = (prod.projectScreens || []).map((s, idx) => `
        <div class="flex items-center gap-2 p-2 bg-stone-50 rounded-xl border border-stone-100 text-stone-700">
          <span class="w-5 h-5 rounded-lg bg-stone-200 text-stone-700 font-mono font-bold text-[10px] flex items-center justify-center shrink-0">${idx + 1}</span>
          <div class="overflow-hidden">
            <div class="text-[11px] font-bold text-stone-900 truncate">${s.name}</div>
            <div class="text-[10px] text-stone-500 truncate">${s.desc}</div>
          </div>
        </div>
      `).join('');

      const featuresHtml = (prod.features || []).map(f => `
        <li class="flex items-start gap-2 text-xs text-stone-600">
          <i data-lucide="check-circle-2" class="w-3.5 h-3.5 text-emerald-500 mt-0.5 shrink-0"></i>
          <span>${f}</span>
        </li>
      `).join('');

      return `
        <div class="bg-white rounded-3xl border ${isBundle ? 'border-purple-300 shadow-md ring-2 ring-purple-100' : 'border-stone-200/90 shadow-sm'} p-6 sm:p-7 hover-lift flex flex-col justify-between relative overflow-hidden">
          
          <div>
            <!-- Top Badges & Rating -->
            <div class="flex items-center justify-between gap-2 mb-3">
              <span class="px-3 py-1 rounded-full text-xs font-extrabold font-mono ${prod.badgeBg || 'bg-orange-100'} ${prod.badgeText || 'text-[#e17055]'}">
                ${prod.badge}
              </span>
              <div class="flex items-center gap-1 text-xs font-bold text-amber-500 font-mono bg-amber-50 px-2.5 py-1 rounded-full border border-amber-100">
                <span>★</span>
                <span>${prod.popularityRating}</span>
                <span class="text-stone-400 text-[10px]">(${prod.salesCount}+ downloads)</span>
              </div>
            </div>

            <!-- Title & Type -->
            <h3 class="text-xl font-extrabold text-stone-900 font-display mb-1.5 leading-snug">${prod.title}</h3>
            <p class="text-[11px] font-mono text-stone-500 uppercase tracking-wider mb-3">${prod.type}</p>

            <!-- Dual Pricing Badges (Free Frontend vs Premium Backend) -->
            <div class="grid grid-cols-2 gap-2.5 p-3 bg-stone-50 rounded-2xl border border-stone-200/60 mb-4">
              <div class="bg-white p-2.5 rounded-xl border border-emerald-100 text-center shadow-2xs">
                <div class="text-[10px] font-bold uppercase font-mono text-emerald-700">Frontend (HTML/CSS/JS)</div>
                <div class="text-lg font-black text-emerald-600 font-display">FREE</div>
                <div class="text-[9px] text-stone-500">Zero-build client code</div>
              </div>
              <div class="bg-white p-2.5 rounded-xl border border-amber-100 text-center shadow-2xs">
                <div class="text-[10px] font-bold uppercase font-mono text-[#e17055]">Backend Server</div>
                <div class="text-lg font-black text-stone-900 font-display">${prod.backendPrice}</div>
                <div class="text-[9px] text-stone-500">Node.js Express API</div>
              </div>
            </div>

            <p class="text-xs text-stone-600 leading-relaxed mb-4">${prod.description}</p>

            <!-- Project Screens Review Section -->
            <div class="mb-5">
              <div class="flex items-center justify-between mb-2">
                <span class="text-[11px] font-bold text-stone-700 uppercase font-mono flex items-center gap-1.5">
                  <i data-lucide="layout-grid" class="w-3.5 h-3.5 text-stone-500"></i>
                  <span>Included Project Screens (${prod.projectScreens?.length || 0})</span>
                </span>
                ${prod.previewUrl ? `
                  <button onclick="window.openTemplateDemoModal('${prod.previewUrl}', '${prod.title.replace(/'/g, "\\'")}', '${prod.type.replace(/'/g, "\\'")}', '${prod.id}')" class="text-[11px] font-bold text-[#6C5CE7] hover:underline flex items-center gap-1 cursor-pointer">
                    <span>Live Interactive Demo</span>
                    <i data-lucide="external-link" class="w-3 h-3"></i>
                  </button>
                ` : ''}
              </div>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
                ${screensHtml}
              </div>
            </div>

            <!-- Features Review Checklist -->
            <div class="mb-6">
              <div class="text-[11px] font-bold text-stone-700 uppercase font-mono mb-2 flex items-center gap-1.5">
                <i data-lucide="check-square" class="w-3.5 h-3.5 text-emerald-500"></i>
                <span>Technical Specifications & Features</span>
              </div>
              <ul class="space-y-2">
                ${featuresHtml}
              </ul>
            </div>

          </div>

          <!-- Bottom Action Buttons Group -->
          <div class="space-y-2.5 pt-4 border-t border-stone-100">
            
            <!-- Download Free Frontend Code (.ZIP) Button -->
            <button onclick="window.downloadProjectZip('${prod.id}')" class="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl text-xs font-extrabold transition flex items-center justify-center gap-2 shadow-sm transform active:scale-[0.99] cursor-pointer" title="Download Free Frontend Code">
              <i data-lucide="download" class="w-4 h-4"></i>
              <span>Download Frontend Code (.ZIP) — FREE</span>
            </button>

            <!-- Unlock Full-Stack Backend Button -->
            <button onclick="window.openCheckoutModal('${prod.id}')" class="w-full py-3 px-4 ${isBundle ? 'btn-sunset-gradient' : 'bg-stone-900 hover:bg-stone-800'} text-white rounded-2xl text-xs font-extrabold transition flex items-center justify-center gap-2 shadow-sm transform active:scale-[0.99] cursor-pointer" title="Unlock Backend API">
              <i data-lucide="zap" class="w-4 h-4 text-amber-300"></i>
              <span>Get Full-Stack Backend (${prod.backendPrice})</span>
            </button>

            <!-- Interactive Live Preview & Code Viewer Row -->
            <div class="flex items-center gap-2 pt-1">
              ${prod.previewUrl ? `
                <button onclick="window.openTemplateDemoModal('${prod.previewUrl}', '${prod.title.replace(/'/g, "\\'")}', '${prod.type.replace(/'/g, "\\'")}', '${prod.id}')" class="flex-1 py-2 px-3 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-[11px] font-bold transition flex items-center justify-center gap-1.5 cursor-pointer">
                  <i data-lucide="eye" class="w-3.5 h-3.5"></i>
                  <span>Live Sandbox Demo</span>
                </button>
              ` : `
                <button onclick="window.openTemplateDemoModal('templates/luxe-salon/index.html', 'Luxe Salon Suite', 'Web Platform', 'prod-luxe-salon')" class="flex-1 py-2 px-3 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-[11px] font-bold transition flex items-center justify-center gap-1.5 cursor-pointer">
                  <i data-lucide="eye" class="w-3.5 h-3.5"></i>
                  <span>Preview Suite</span>
                </button>
              `}
              
              <button onclick="window.openProjectCodeModal('${prod.id}')" class="flex-1 py-2 px-3 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-[11px] font-bold transition flex items-center justify-center gap-1.5 cursor-pointer">
                <i data-lucide="code-2" class="w-3.5 h-3.5"></i>
                <span>Inspect Source</span>
              </button>
            </div>

          </div>

        </div>
      `;
    }).join('');

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
  state.currentOpenProject = null;

  window.openProjectModal = function (projectId) {
    const p = (data.projects || []).find(x => x.id === projectId);
    if (!p) return;

    state.currentOpenProject = p;

    document.getElementById('pm-tag').textContent = p.tag;
    document.getElementById('pm-title').textContent = p.title;
    document.getElementById('pm-full-desc').textContent = p.fullDescription || p.shortDescription;

    document.getElementById('pm-metrics').innerHTML = p.metrics.map(m => `
      <div class="bg-stone-50 p-2.5 rounded-2xl text-center border border-stone-200/50">
        <div class="text-sm font-bold text-stone-900">${m.value}</div>
        <div class="text-[11px] text-stone-500">${m.label}</div>
      </div>
    `).join('');

    // Render interactive Screen Preview Studio inside Project Modal
    window.renderProjectModalScreens(p);

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

    const sandboxBtn = document.getElementById('pm-sandbox-btn');
    const downloadFreeBtn = document.getElementById('pm-download-free-btn');
    const unlockBackendBtn = document.getElementById('pm-unlock-backend-btn');
    const unlockBackendText = document.getElementById('pm-unlock-backend-text');

    if (p.isFreeFrontend && p.downloadZipId) {
      if (sandboxBtn) sandboxBtn.classList.remove('hidden');
      if (downloadFreeBtn) downloadFreeBtn.classList.remove('hidden');
      if (unlockBackendBtn) {
        unlockBackendBtn.classList.remove('hidden');
        if (unlockBackendText) {
          const price = p.downloadZipId === 'prod-auth-screens' ? '$1.99' : '$2.99';
          unlockBackendText.textContent = `Get Full Access (${price})`;
        }
      }
    } else {
      if (sandboxBtn) sandboxBtn.classList.add('hidden');
      if (downloadFreeBtn) downloadFreeBtn.classList.add('hidden');
      if (unlockBackendBtn) unlockBackendBtn.classList.add('hidden');
    }

    window.openModal('project-modal');
    refreshIcons();
  };

  window.openModalBackendCheckout = function () {
    const p = state.currentOpenProject;
    if (!p) return;
    window.closeModal();
    setTimeout(() => {
      window.openCheckoutModal(p.downloadZipId || 'prod-auth-screens');
    }, 150);
  };

  window.openCurrentProjectSandbox = function () {
    const p = state.currentOpenProject;
    if (!p) return;
    window.closeModal();
    setTimeout(() => {
      window.openTemplateDemoModal(p.liveUrl, p.title, p.tag, p.downloadZipId);
    }, 150);
  };

  window.downloadCurrentProjectModalZip = function () {
    const p = state.currentOpenProject;
    if (!p || !p.downloadZipId) return;
    window.downloadProjectZip(p.downloadZipId, false);
  };

  // --------------------------------------------------------------------------
  // INTERACTIVE PROJECT MODAL SCREENS PREVIEW & SWITCHER STUDIO
  // --------------------------------------------------------------------------
  state.currentProjectScreensData = [];
  state.activeProjectScreenIdx = 0;

  window.renderProjectModalScreens = function (project) {
    const section = document.getElementById('pm-screen-preview-section');
    const tabsContainer = document.getElementById('pm-screen-tabs');
    const viewport = document.getElementById('pm-screen-viewport');
    const countBadge = document.getElementById('pm-screen-count-badge');
    const hintText = document.getElementById('pm-screen-hint-text');

    if (!section || !tabsContainer || !viewport) return;

    let screens = [];

    if (project.id === 'auth-screens-project') {
      screens = [
        {
          id: 'welcome',
          name: '1. Welcome Gateway',
          shortName: 'Welcome =)',
          badge: 'ONBOARDING',
          badgeColor: 'bg-blue-500/20 text-blue-300',
          title: 'Welcome Screen (Gateway Entry)',
          subtitle: 'Concentric pastel wave gradients with geometric badge and dual action buttons.',
          html: `
            <div class="w-full max-w-sm mx-auto bg-gradient-to-br from-[#1e3c72] via-[#2a5298] to-[#5c7aea] rounded-3xl p-4 sm:p-5 shadow-2xl border border-white/20 relative overflow-hidden text-white flex flex-col justify-between min-h-[380px]">
              <!-- Concentric bubbles background -->
              <div class="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-white/15 blur-[1px]"></div>
              <div class="absolute top-12 right-6 w-16 h-16 rounded-full bg-white/20"></div>
              <div class="absolute top-4 left-4 w-20 h-20 rounded-full bg-blue-900/30"></div>
              <div class="absolute -bottom-10 -left-6 w-36 h-36 rounded-full bg-white/10"></div>

              <!-- Top Bar -->
              <div class="flex items-center justify-between text-[9px] font-mono text-white/80 relative z-10 px-1">
                <span class="font-bold flex items-center gap-1"><i data-lucide="shield-check" class="w-3 h-3 text-amber-300"></i> AUTH GATEWAY</span>
                <span class="px-2 py-0.5 rounded-full bg-white/20 font-bold">SCREEN 1 OF 5</span>
              </div>

              <!-- Title & Greeting -->
              <div class="text-center my-auto py-3 relative z-10">
                <div class="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md mx-auto flex items-center justify-center text-xl text-amber-300 shadow-lg border border-white/30 mb-2.5">
                  ✦
                </div>
                <h3 class="text-2xl font-black text-white font-display tracking-tight">Welcome =)</h3>
                <p class="text-[11px] text-blue-100 mt-1 max-w-xs mx-auto leading-relaxed">
                  Hi there! We're here to help you learn new skills.<br>
                  The choice is yours: <strong class="text-white">Log in</strong> or <strong class="text-white">create an account</strong>.
                </p>
              </div>

              <!-- Bottom Action Card -->
              <div class="bg-white rounded-2xl p-3.5 space-y-2 shadow-xl relative z-10 text-stone-900">
                <button onclick="window.switchProjectModalScreen(1)" class="w-full py-2.5 bg-gradient-to-r from-[#e17055] to-[#f0932b] hover:from-[#d65d40] hover:to-[#e0831b] text-white rounded-xl text-xs font-extrabold transition flex items-center justify-center gap-1.5 shadow-sm transform active:scale-98 cursor-pointer">
                  <span>Log In</span>
                  <i data-lucide="arrow-right" class="w-3.5 h-3.5"></i>
                </button>
                <button onclick="window.switchProjectModalScreen(2)" class="w-full py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-xs font-extrabold transition flex items-center justify-center gap-1.5 cursor-pointer">
                  <span>Create an Account</span>
                </button>
              </div>
            </div>
          `
        },
        {
          id: 'login',
          name: '2. Sign In (Social)',
          shortName: 'Sign In',
          badge: 'OAUTH & REVEAL',
          badgeColor: 'bg-emerald-500/20 text-emerald-300',
          title: 'Sign In Screen (Welcome Back)',
          subtitle: 'Clean email input, password field with live show/hide toggle, and OAuth social sign-in row.',
          html: `
            <div class="w-full max-w-sm mx-auto bg-gradient-to-br from-[#1e3c72] via-[#2a5298] to-[#5c7aea] rounded-3xl p-4 sm:p-5 shadow-2xl border border-white/20 relative overflow-hidden text-white flex flex-col justify-between min-h-[380px]">
              <!-- Concentric bubbles background -->
              <div class="absolute -top-8 -right-8 w-28 h-28 rounded-full bg-white/15"></div>
              
              <div class="flex items-center justify-between text-[9px] font-mono text-white/80 relative z-10 px-1 mb-2">
                <button onclick="window.switchProjectModalScreen(0)" class="text-white hover:text-amber-300 flex items-center gap-1 cursor-pointer font-bold">
                  ‹ Back
                </button>
                <span class="px-2 py-0.5 rounded-full bg-white/20 font-bold">SCREEN 2 OF 5</span>
              </div>

              <!-- Header -->
              <div class="text-center mb-2 relative z-10">
                <h3 class="text-xl font-black text-white font-display">Welcome Back</h3>
                <p class="text-[10px] text-blue-100">Enter your credentials to access your account</p>
              </div>

              <!-- Form Card -->
              <div class="bg-white rounded-2xl p-3.5 space-y-2.5 shadow-xl relative z-10 text-stone-800 text-xs">
                <div>
                  <label class="block text-[10px] font-bold text-stone-500 uppercase font-mono mb-1">Email Address</label>
                  <div class="flex items-center gap-2 px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl">
                    <i data-lucide="mail" class="w-3.5 h-3.5 text-stone-400"></i>
                    <input type="email" readonly value="alex.morgan@company.com" class="w-full bg-transparent text-xs text-stone-800 font-semibold focus:outline-none" />
                  </div>
                </div>

                <div>
                  <div class="flex items-center justify-between mb-1">
                    <label class="text-[10px] font-bold text-stone-500 uppercase font-mono">Password</label>
                    <button onclick="window.switchProjectModalScreen(4)" class="text-[10px] text-[#e17055] font-bold hover:underline cursor-pointer">Forgot?</button>
                  </div>
                  <div class="flex items-center justify-between px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl">
                    <div class="flex items-center gap-2">
                      <i data-lucide="lock" class="w-3.5 h-3.5 text-stone-400"></i>
                      <span class="font-mono text-xs text-stone-800">••••••••••••</span>
                    </div>
                    <span class="text-[10px] text-stone-400 font-bold cursor-pointer">👁 Toggle</span>
                  </div>
                </div>

                <div class="flex items-center justify-between text-[10px] text-stone-500">
                  <label class="flex items-center gap-1.5 cursor-pointer font-medium">
                    <input type="checkbox" checked class="accent-[#e17055]" />
                    <span>Remember me</span>
                  </label>
                </div>

                <button onclick="window.switchProjectModalScreen(3)" class="w-full py-2.5 bg-gradient-to-r from-[#e17055] to-[#f0932b] text-white rounded-xl text-xs font-extrabold transition flex items-center justify-center gap-1.5 shadow-sm cursor-pointer">
                  <span>Log In</span>
                </button>

                <!-- Social Icons -->
                <div class="flex items-center justify-center gap-3 pt-1 border-t border-stone-100 text-[10px]">
                  <span class="w-6 h-6 rounded-full bg-stone-100 flex items-center justify-center font-bold text-blue-600">G</span>
                  <span class="w-6 h-6 rounded-full bg-stone-100 flex items-center justify-center font-bold text-stone-800"><i data-lucide="github" class="w-3 h-3"></i></span>
                  <span class="w-6 h-6 rounded-full bg-stone-100 flex items-center justify-center font-bold text-stone-900"></span>
                </div>
              </div>
            </div>
          `
        },
        {
          id: 'signup',
          name: '3. Sign Up & Strength',
          shortName: 'Sign Up',
          badge: 'STRENGTH METER',
          badgeColor: 'bg-amber-500/20 text-amber-300',
          title: 'Sign Up & Live Password Strength Meter',
          subtitle: 'Name, email, password fields with dynamic entropy progress bar and terms checkbox.',
          html: `
            <div class="w-full max-w-sm mx-auto bg-gradient-to-br from-[#1e3c72] via-[#2a5298] to-[#5c7aea] rounded-3xl p-4 sm:p-5 shadow-2xl border border-white/20 relative overflow-hidden text-white flex flex-col justify-between min-h-[380px]">
              <div class="flex items-center justify-between text-[9px] font-mono text-white/80 relative z-10 px-1 mb-2">
                <button onclick="window.switchProjectModalScreen(0)" class="text-white hover:text-amber-300 flex items-center gap-1 cursor-pointer font-bold">
                  ‹ Back
                </button>
                <span class="px-2 py-0.5 rounded-full bg-white/20 font-bold">SCREEN 3 OF 5</span>
              </div>

              <!-- Header -->
              <div class="text-center mb-2 relative z-10">
                <h3 class="text-xl font-black text-white font-display">Create Account</h3>
                <p class="text-[10px] text-blue-100">Join in seconds to build your digital products</p>
              </div>

              <!-- Form Card -->
              <div class="bg-white rounded-2xl p-3.5 space-y-2 shadow-xl relative z-10 text-stone-800 text-xs">
                <div>
                  <label class="block text-[10px] font-bold text-stone-500 uppercase font-mono mb-1">Full Name</label>
                  <div class="flex items-center gap-2 px-3 py-1.5 bg-stone-50 border border-stone-200 rounded-xl">
                    <i data-lucide="user" class="w-3.5 h-3.5 text-stone-400"></i>
                    <input type="text" readonly value="Isaac Dev" class="w-full bg-transparent text-xs text-stone-800 font-semibold focus:outline-none" />
                  </div>
                </div>

                <div>
                  <label class="block text-[10px] font-bold text-stone-500 uppercase font-mono mb-1">Email Address</label>
                  <div class="flex items-center gap-2 px-3 py-1.5 bg-stone-50 border border-stone-200 rounded-xl">
                    <i data-lucide="mail" class="w-3.5 h-3.5 text-stone-400"></i>
                    <input type="email" readonly value="isaac@codertech.dev" class="w-full bg-transparent text-xs text-stone-800 font-semibold focus:outline-none" />
                  </div>
                </div>

                <div>
                  <div class="flex items-center justify-between mb-1">
                    <label class="text-[10px] font-bold text-stone-500 uppercase font-mono">Password</label>
                    <span class="text-[10px] text-emerald-600 font-bold font-mono">STRONG 100%</span>
                  </div>
                  <div class="flex items-center justify-between px-3 py-1.5 bg-stone-50 border border-stone-200 rounded-xl">
                    <div class="flex items-center gap-2">
                      <i data-lucide="lock" class="w-3.5 h-3.5 text-stone-400"></i>
                      <span class="font-mono text-xs text-stone-800">CoderTech#2026!</span>
                    </div>
                    <i data-lucide="check" class="w-3.5 h-3.5 text-emerald-500"></i>
                  </div>
                  <!-- Dynamic Strength Bar Preview -->
                  <div class="w-full h-1.5 bg-stone-100 rounded-full mt-1 overflow-hidden">
                    <div class="h-full w-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full"></div>
                  </div>
                </div>

                <div class="flex items-center gap-1.5 text-[10px] text-stone-500">
                  <input type="checkbox" checked class="accent-[#e17055]" />
                  <span>I agree to Terms & Privacy Policy</span>
                </div>

                <button onclick="window.switchProjectModalScreen(3)" class="w-full py-2.5 bg-gradient-to-r from-[#e17055] to-[#f0932b] text-white rounded-xl text-xs font-extrabold transition flex items-center justify-center gap-1.5 shadow-sm cursor-pointer">
                  <span>Get Started (Continue to 2FA)</span>
                  <i data-lucide="arrow-right" class="w-3.5 h-3.5"></i>
                </button>
              </div>
            </div>
          `
        },
        {
          id: 'otp',
          name: '4. 2FA (OTP) Verification',
          shortName: '2FA OTP',
          badge: 'AUTO-FOCUS 6-DIGIT',
          badgeColor: 'bg-purple-500/20 text-purple-300',
          title: '2FA Verification Screen (Auto-Advancing OTP)',
          subtitle: '6-digit isolated input slots with auto-advance, backspace handling, and resend timer.',
          html: `
            <div class="w-full max-w-sm mx-auto bg-gradient-to-br from-[#1e3c72] via-[#2a5298] to-[#5c7aea] rounded-3xl p-4 sm:p-5 shadow-2xl border border-white/20 relative overflow-hidden text-white flex flex-col justify-between min-h-[380px]">
              <div class="flex items-center justify-between text-[9px] font-mono text-white/80 relative z-10 px-1 mb-2">
                <button onclick="window.switchProjectModalScreen(2)" class="text-white hover:text-amber-300 flex items-center gap-1 cursor-pointer font-bold">
                  ‹ Back
                </button>
                <span class="px-2 py-0.5 rounded-full bg-white/20 font-bold">SCREEN 4 OF 5</span>
              </div>

              <!-- Header -->
              <div class="text-center mb-2 relative z-10">
                <h3 class="text-xl font-black text-white font-display">Verify Code</h3>
                <p class="text-[10px] text-blue-100">Enter the 6-digit code sent to your email</p>
              </div>

              <!-- OTP Form Card -->
              <div class="bg-white rounded-2xl p-4 space-y-3 shadow-xl relative z-10 text-stone-800 text-xs">
                <!-- 6-digit slot grid -->
                <div class="grid grid-cols-6 gap-1.5 py-1">
                  <div class="h-10 rounded-xl bg-stone-50 border-2 border-[#6C5CE7] flex items-center justify-center font-extrabold text-base font-mono text-stone-900 shadow-inner">2</div>
                  <div class="h-10 rounded-xl bg-stone-50 border-2 border-[#6C5CE7] flex items-center justify-center font-extrabold text-base font-mono text-stone-900 shadow-inner">0</div>
                  <div class="h-10 rounded-xl bg-stone-50 border-2 border-[#6C5CE7] flex items-center justify-center font-extrabold text-base font-mono text-stone-900 shadow-inner">2</div>
                  <div class="h-10 rounded-xl bg-stone-50 border-2 border-[#6C5CE7] flex items-center justify-center font-extrabold text-base font-mono text-stone-900 shadow-inner">6</div>
                  <div class="h-10 rounded-xl bg-stone-50 border-2 border-stone-200 flex items-center justify-center font-extrabold text-base font-mono text-stone-400">8</div>
                  <div class="h-10 rounded-xl bg-stone-50 border-2 border-stone-200 flex items-center justify-center font-extrabold text-base font-mono text-stone-400">9</div>
                </div>

                <div class="p-2 bg-purple-50 rounded-xl border border-purple-100 text-center text-[10px] text-[#6C5CE7] font-semibold">
                  <span>✨ Auto-Focus Next • Backspace Jumps • Paste All 6</span>
                </div>

                <div class="text-center text-[10px] text-stone-500">
                  <span>Didn't receive OTP?</span>
                  <span class="text-[#e17055] font-bold ml-1 cursor-pointer">Resend code</span>
                  <span class="text-stone-400 ml-1 font-mono">(45s)</span>
                </div>

                <button onclick="window.switchProjectModalScreen(0)" class="w-full py-2.5 bg-gradient-to-r from-[#e17055] to-[#f0932b] text-white rounded-xl text-xs font-extrabold transition flex items-center justify-center gap-1.5 shadow-sm cursor-pointer">
                  <i data-lucide="check" class="w-3.5 h-3.5"></i>
                  <span>Verify & Unlock Dashboard</span>
                </button>
              </div>
            </div>
          `
        },
        {
          id: 'forgot',
          name: '5. Password Recovery',
          shortName: 'Recovery',
          badge: 'RESET FLOW',
          badgeColor: 'bg-rose-500/20 text-rose-300',
          title: 'Password Recovery Screen (Reset Dispatcher)',
          subtitle: 'Single-field recovery email input with feedback notice and shortcut back to login.',
          html: `
            <div class="w-full max-w-sm mx-auto bg-gradient-to-br from-[#1e3c72] via-[#2a5298] to-[#5c7aea] rounded-3xl p-4 sm:p-5 shadow-2xl border border-white/20 relative overflow-hidden text-white flex flex-col justify-between min-h-[380px]">
              <div class="flex items-center justify-between text-[9px] font-mono text-white/80 relative z-10 px-1 mb-2">
                <button onclick="window.switchProjectModalScreen(1)" class="text-white hover:text-amber-300 flex items-center gap-1 cursor-pointer font-bold">
                  ‹ Back to Login
                </button>
                <span class="px-2 py-0.5 rounded-full bg-white/20 font-bold">SCREEN 5 OF 5</span>
              </div>

              <!-- Header -->
              <div class="text-center mb-2 relative z-10">
                <h3 class="text-xl font-black text-white font-display">Reset Password</h3>
                <p class="text-[10px] text-blue-100">Enter your email to receive a recovery token</p>
              </div>

              <!-- Form Card -->
              <div class="bg-white rounded-2xl p-4 space-y-3 shadow-xl relative z-10 text-stone-800 text-xs">
                <div>
                  <label class="block text-[10px] font-bold text-stone-500 uppercase font-mono mb-1">Account Email</label>
                  <div class="flex items-center gap-2 px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl">
                    <i data-lucide="mail" class="w-3.5 h-3.5 text-stone-400"></i>
                    <input type="email" readonly value="your.name@example.com" class="w-full bg-transparent text-xs text-stone-800 font-semibold focus:outline-none" />
                  </div>
                </div>

                <div class="p-2.5 bg-stone-50 rounded-xl border border-stone-200/60 text-[10px] text-stone-500 leading-relaxed">
                  We will send a secure verification token and password reset link to your registered email.
                </div>

                <button onclick="window.switchProjectModalScreen(1)" class="w-full py-2.5 bg-gradient-to-r from-[#e17055] to-[#f0932b] text-white rounded-xl text-xs font-extrabold transition flex items-center justify-center gap-1.5 shadow-sm cursor-pointer">
                  <i data-lucide="send" class="w-3.5 h-3.5"></i>
                  <span>Send Reset Link</span>
                </button>

                <div class="text-center pt-1 border-t border-stone-100">
                  <button onclick="window.switchProjectModalScreen(1)" class="text-[10px] text-[#6C5CE7] font-extrabold hover:underline">
                    Return to Log In
                  </button>
                </div>
              </div>
            </div>
          `
        },
        {
          id: 'backend',
          name: '6. Node.js JWT REST API',
          shortName: 'Backend API',
          badge: '$1.99 CODEBASE',
          badgeColor: 'bg-emerald-500/20 text-emerald-300',
          title: 'Full-Stack Node.js Express REST API ($1.99)',
          subtitle: 'Production bcrypt password hashing, token issuance, secure cookies, and auth middleware.',
          html: `
            <div class="w-full max-w-sm mx-auto bg-stone-950 rounded-3xl p-4 sm:p-5 shadow-2xl border border-stone-800 text-stone-100 flex flex-col justify-between min-h-[380px]">
              <div class="flex items-center justify-between text-[9px] font-mono text-stone-400 mb-2">
                <span class="font-bold text-emerald-400 flex items-center gap-1"><i data-lucide="server" class="w-3 h-3"></i> NODE.JS REST SERVER</span>
                <span class="px-2 py-0.5 rounded-full bg-stone-800 text-stone-300 font-bold">$1.99 COMMERCIAL</span>
              </div>

              <!-- Endpoint List -->
              <div class="space-y-1.5 font-mono text-[10px] my-auto">
                <div class="p-2 bg-stone-900/90 rounded-xl border border-stone-800 flex items-center justify-between">
                  <span class="text-emerald-400 font-bold">POST</span>
                  <span class="text-stone-300">/api/auth/register</span>
                  <span class="text-[8px] text-stone-500">bcrypt hash</span>
                </div>
                <div class="p-2 bg-stone-900/90 rounded-xl border border-stone-800 flex items-center justify-between">
                  <span class="text-emerald-400 font-bold">POST</span>
                  <span class="text-stone-300">/api/auth/login</span>
                  <span class="text-[8px] text-stone-500">JWT token</span>
                </div>
                <div class="p-2 bg-stone-900/90 rounded-xl border border-stone-800 flex items-center justify-between">
                  <span class="text-emerald-400 font-bold">POST</span>
                  <span class="text-stone-300">/api/auth/verify-2fa</span>
                  <span class="text-[8px] text-stone-500">OTP logic</span>
                </div>
                <div class="p-2 bg-stone-900/90 rounded-xl border border-stone-800 flex items-center justify-between">
                  <span class="text-blue-400 font-bold">GET</span>
                  <span class="text-stone-300">/api/auth/me</span>
                  <span class="text-[8px] text-stone-500">Bearer check</span>
                </div>
              </div>

              <div class="pt-2 border-t border-stone-800">
                <button onclick="window.openModalBackendCheckout()" class="w-full py-2.5 bg-[#e17055] hover:bg-[#d65d40] text-white rounded-xl text-xs font-extrabold transition flex items-center justify-center gap-1.5 shadow-sm cursor-pointer">
                  <i data-lucide="zap" class="w-3.5 h-3.5 text-amber-300"></i>
                  <span>Unlock Backend Source ($1.99)</span>
                </button>
              </div>
            </div>
          `
        }
      ];
    } else if (project.id === 'luxe-salon-website') {
      screens = [
        {
          id: 'home',
          name: '1. Luxury Homepage',
          shortName: 'Hero & Home',
          badge: 'LUXURY AESTHETIC',
          badgeColor: 'bg-amber-500/20 text-amber-300',
          title: 'Luxe Salon Luxury Homepage',
          subtitle: 'High-converting gold & obsidian aesthetic with instant booking CTAs.',
          html: `
            <div class="w-full max-w-sm mx-auto bg-gradient-to-br from-[#1a1a1a] via-[#2d241e] to-[#4a3928] rounded-3xl p-4 sm:p-5 shadow-2xl border border-amber-500/30 text-stone-100 flex flex-col justify-between min-h-[380px]">
              <div class="flex items-center justify-between text-[9px] font-mono text-amber-400">
                <span class="font-extrabold font-serif tracking-wider">LUXE SALON</span>
                <span class="bg-amber-950/60 px-2 py-0.5 rounded border border-amber-500/30">100/100 SPEED</span>
              </div>
              <div class="text-center my-auto py-3">
                <div class="text-lg font-serif font-bold text-amber-200">Artistry in Every Strand</div>
                <p class="text-[10px] text-stone-300 mt-1 max-w-xs mx-auto">Elevated beauty, precision haircutting, and rejuvenating spa treatments.</p>
              </div>
              <div class="space-y-2">
                <button onclick="window.switchProjectModalScreen(3)" class="w-full py-2 bg-gradient-to-r from-amber-600 to-amber-500 text-stone-950 rounded-xl text-xs font-extrabold">Book Appointment</button>
                <button onclick="window.switchProjectModalScreen(1)" class="w-full py-2 bg-stone-900/90 text-amber-300 border border-amber-500/30 rounded-xl text-xs font-bold">View Service Menu</button>
              </div>
            </div>
          `
        },
        {
          id: 'services',
          name: '2. Dynamic Services',
          shortName: 'Service Menu',
          badge: 'FILTER TABS',
          badgeColor: 'bg-blue-500/20 text-blue-300',
          title: 'Interactive Service Menu & Pricing',
          subtitle: 'Category filter tabs across Haircut, Coloring, Spa, and Bridal treatments.',
          html: `
            <div class="w-full max-w-sm mx-auto bg-stone-900 rounded-3xl p-4 shadow-2xl border border-amber-500/30 text-stone-100 flex flex-col justify-between min-h-[380px]">
              <div class="text-center mb-2">
                <span class="text-[9px] font-mono text-amber-400">TREATMENTS & RATES</span>
                <h4 class="text-base font-serif font-bold text-stone-100">Service Catalog</h4>
              </div>
              <div class="space-y-1.5 text-xs font-medium">
                <div class="p-2 bg-stone-800/80 rounded-xl border border-stone-700 flex justify-between">
                  <span>Couture Haircut & Style</span>
                  <span class="text-amber-400 font-bold">$120</span>
                </div>
                <div class="p-2 bg-stone-800/80 rounded-xl border border-stone-700 flex justify-between">
                  <span>Balayage & Gloss Finish</span>
                  <span class="text-amber-400 font-bold">$240</span>
                </div>
                <div class="p-2 bg-stone-800/80 rounded-xl border border-stone-700 flex justify-between">
                  <span>Rejuvenating Scalp Spa</span>
                  <span class="text-amber-400 font-bold">$95</span>
                </div>
              </div>
              <button onclick="window.switchProjectModalScreen(3)" class="w-full py-2 bg-amber-500 text-stone-950 rounded-xl text-xs font-bold mt-2">Book This Service</button>
            </div>
          `
        },
        {
          id: 'booking',
          name: '3. Booking Modal & API',
          shortName: 'Booking & API',
          badge: 'EXPRESS REST API',
          badgeColor: 'bg-emerald-500/20 text-emerald-300',
          title: 'Stylist Booking Modal & Express API',
          subtitle: 'Interactive appointment scheduling with form validation and Node.js REST server.',
          html: `
            <div class="w-full max-w-sm mx-auto bg-stone-950 rounded-3xl p-4 shadow-2xl border border-stone-800 text-stone-100 flex flex-col justify-between min-h-[380px]">
              <div class="text-center mb-2">
                <span class="text-[9px] font-mono text-emerald-400">APPOINTMENT SCHEDULER</span>
                <h4 class="text-base font-serif font-bold text-stone-100">Instant Online Booking</h4>
              </div>
              <div class="space-y-2 text-xs">
                <input type="text" readonly value="Client: Jane Doe" class="w-full p-2 bg-stone-900 rounded-lg border border-stone-700 text-xs text-stone-300" />
                <input type="text" readonly value="Stylist: Elena Rostova (Master Colorist)" class="w-full p-2 bg-stone-900 rounded-lg border border-stone-700 text-xs text-stone-300" />
                <div class="p-2 bg-stone-900 rounded-lg border border-stone-700 text-[10px] text-emerald-400 font-mono">POST /api/appointments -> 201 Created</div>
              </div>
              <button onclick="window.openModalBackendCheckout()" class="w-full py-2.5 bg-[#e17055] text-white rounded-xl text-xs font-extrabold mt-2">Unlock Full Backend ($2.99)</button>
            </div>
          `
        }
      ];
    } else {
      screens = [
        {
          id: 'overview',
          name: '1. Architecture View',
          shortName: 'Overview',
          badge: project.tag,
          badgeColor: 'bg-purple-500/20 text-purple-300',
          title: project.title,
          subtitle: project.shortDescription,
          html: `
            <div class="w-full max-w-sm mx-auto bg-stone-950 rounded-3xl p-5 shadow-2xl border border-stone-800 text-stone-100 flex flex-col justify-between min-h-[300px]">
              <div class="flex items-center justify-between text-[10px] font-mono text-stone-400">
                <span class="text-purple-400 font-bold">${project.tag}</span>
                <span>DEVICE: ${project.deviceType.toUpperCase()}</span>
              </div>
              <div class="text-center my-4">
                <h4 class="text-lg font-bold text-white">${project.title}</h4>
                <p class="text-xs text-stone-400 mt-1">${project.shortDescription}</p>
              </div>
              <a href="${project.liveUrl}" target="_blank" class="w-full py-2.5 bg-stone-800 hover:bg-stone-700 text-white rounded-xl text-xs font-bold text-center block">
                Open External Preview
              </a>
            </div>
          `
        }
      ];
    }

    state.currentProjectScreensData = screens;
    state.activeProjectScreenIdx = 0;

    countBadge.textContent = `${screens.length} SCREEN${screens.length > 1 ? 'S' : ''}`;
    hintText.textContent = `Click any screen tab above to preview the ${project.title} interface flow.`;

    // Render Tabs
    tabsContainer.innerHTML = screens.map((s, idx) => `
      <button onclick="window.switchProjectModalScreen(${idx})" class="pm-screen-pill px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 ${idx === 0 ? 'bg-purple-600 text-white shadow-sm' : 'bg-stone-800 text-stone-400 hover:text-white'}">
        <span>${s.name}</span>
      </button>
    `).join('');

    // Render Viewport
    window.switchProjectModalScreen(0);
  };

  window.switchProjectModalScreen = function (screenIdx) {
    const screens = state.currentProjectScreensData || [];
    if (!screens[screenIdx]) return;

    state.activeProjectScreenIdx = screenIdx;
    const s = screens[screenIdx];

    // Update tab styling
    const pills = document.querySelectorAll('.pm-screen-pill');
    pills.forEach((p, i) => {
      if (i === screenIdx) {
        p.className = 'pm-screen-pill px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 bg-purple-600 text-white shadow-sm';
      } else {
        p.className = 'pm-screen-pill px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 bg-stone-800 text-stone-400 hover:text-white';
      }
    });

    // Update viewport
    const viewport = document.getElementById('pm-screen-viewport');
    if (viewport) {
      viewport.innerHTML = s.html;
      refreshIcons();
    }
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

  // --- DIGITAL PRODUCTS & TEMPLATES STORE (ZIP DOWNLOADS & LIVE PREVIEWS) ---
  state.currentInspectedProduct = null;
  state.currentInspectedFile = null;
  state.activeCheckoutProductId = null;
  state.activeTemplateDemoId = null;

  // Checkout Modal
  window.openCheckoutModal = function (productId) {
    const prod = (data.monetizationProducts || []).find(p => p.id === productId);
    if (!prod) return;

    state.activeCheckoutProductId = productId;

    document.getElementById('cm-prod-title').textContent = prod.title;
    document.getElementById('cm-prod-price').textContent = prod.backendPrice || prod.price;
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

    showToast(`License key generated! Your backend access is unlocked.`);
  };

  window.downloadCurrentBackendZip = function () {
    const prodId = state.activeCheckoutProductId || 'prod-luxe-salon';
    window.downloadProjectZip(prodId, true);
  };

  // --- INTERACTIVE TEMPLATE LIVE PREVIEW MODAL ---
  window.openTemplateDemoModal = function (templateUrl, title, techTag, downloadId) {
    const iframe = document.getElementById('tdm-iframe');
    const titleEl = document.getElementById('tdm-title');
    const tagEl = document.getElementById('tdm-tech-tag');
    const newTabLink = document.getElementById('tdm-newtab-link');

    state.activeTemplateDemoId = downloadId || (templateUrl.includes('luxe') ? 'prod-luxe-salon' : 'prod-auth-screens');

    if (titleEl) titleEl.textContent = title || 'Template Live Preview';
    if (tagEl) tagEl.textContent = techTag || 'HTML5 • CSS3 • Vanilla JS';
    if (newTabLink) newTabLink.href = templateUrl;

    if (iframe) {
      iframe.src = templateUrl;
    }

    window.setTemplateDemoViewport('desktop');
    window.openModal('template-demo-modal');
  };

  window.setTemplateDemoViewport = function (size) {
    const frame = document.getElementById('tdm-viewport-frame');
    if (!frame) return;

    const btnDesktop = document.getElementById('btn-vp-desktop');
    const btnTablet = document.getElementById('btn-vp-tablet');
    const btnMobile = document.getElementById('btn-vp-mobile');

    [btnDesktop, btnTablet, btnMobile].forEach(b => {
      if (b) {
        b.className = 'px-2.5 py-1.5 rounded-lg text-xs font-bold text-stone-400 hover:text-white flex items-center gap-1 transition';
      }
    });

    if (size === 'mobile') {
      frame.style.maxWidth = '390px';
      frame.style.height = '680px';
      if (btnMobile) btnMobile.className = 'px-2.5 py-1.5 rounded-lg text-xs font-bold bg-stone-800 text-white flex items-center gap-1 transition';
    } else if (size === 'tablet') {
      frame.style.maxWidth = '768px';
      frame.style.height = '100%';
      if (btnTablet) btnTablet.className = 'px-2.5 py-1.5 rounded-lg text-xs font-bold bg-stone-800 text-white flex items-center gap-1 transition';
    } else {
      frame.style.maxWidth = '100%';
      frame.style.height = '100%';
      if (btnDesktop) btnDesktop.className = 'px-2.5 py-1.5 rounded-lg text-xs font-bold bg-stone-800 text-white flex items-center gap-1 transition';
    }
  };

  window.downloadCurrentTemplateZip = function () {
    const prodId = state.activeTemplateDemoId || 'prod-luxe-salon';
    window.downloadProjectZip(prodId, false);
  };

  // --- SOURCE CODE INSPECTOR MODAL ---
  window.openProjectCodeModal = function (productId) {
    const prod = (data.monetizationProducts || []).find(p => p.id === productId) || data.monetizationProducts[0];
    state.currentInspectedProduct = prod;

    const titleEl = document.getElementById('cim-title');
    if (titleEl) titleEl.textContent = `${prod.title} — Source Inspector`;

    const tabsContainer = document.getElementById('cim-tabs-container');
    let files = [];

    if (prod.id === 'prod-luxe-salon') {
      files = [
        { name: 'index.html', path: 'templates/luxe-salon/index.html', lang: 'html' },
        { name: 'style.css', path: 'templates/luxe-salon/style.css', lang: 'css' },
        { name: 'script.js', path: 'templates/luxe-salon/script.js', lang: 'javascript' },
        { name: 'README.md', path: 'templates/luxe-salon/README.md', lang: 'markdown' }
      ];
    } else if (prod.id === 'prod-auth-screens') {
      files = [
        { name: 'index.html', path: 'templates/web-auth-screens/index.html', lang: 'html' },
        { name: 'styles.css', path: 'templates/web-auth-screens/assets/css/styles.css', lang: 'css' },
        { name: 'app.js', path: 'templates/web-auth-screens/assets/js/app.js', lang: 'javascript' },
        { name: 'README.md', path: 'templates/web-auth-screens/README.md', lang: 'markdown' }
      ];
    } else {
      files = [
        { name: 'Luxe-index.html', path: 'templates/luxe-salon/index.html', lang: 'html' },
        { name: 'Auth-index.html', path: 'templates/web-auth-screens/index.html', lang: 'html' },
        { name: 'Luxe-style.css', path: 'templates/luxe-salon/style.css', lang: 'css' },
        { name: 'Auth-styles.css', path: 'templates/web-auth-screens/assets/css/styles.css', lang: 'css' }
      ];
    }

    state.currentInspectedFiles = files;

    if (tabsContainer) {
      tabsContainer.innerHTML = files.map((f, idx) => `
        <button onclick="window.switchInspectTab('${f.name}')" id="cim-tab-${idx}" class="cim-tab-btn px-2.5 py-1 rounded-lg text-xs font-mono font-bold ${idx === 0 ? 'bg-stone-800 text-white' : 'text-stone-400 hover:text-white'} transition">
          ${f.name}
        </button>
      `).join('');
    }

    window.switchInspectTab(files[0].name);
    window.openModal('code-inspector-modal');
  };

  window.switchInspectTab = function (fileName) {
    const file = (state.currentInspectedFiles || []).find(f => f.name === fileName) || (state.currentInspectedFiles && state.currentInspectedFiles[0]);
    if (!file) return;

    state.currentInspectedFile = file;

    document.querySelectorAll('.cim-tab-btn').forEach(btn => {
      if (btn.textContent.trim() === fileName) {
        btn.className = 'cim-tab-btn px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-stone-800 text-white transition';
      } else {
        btn.className = 'cim-tab-btn px-2.5 py-1 rounded-lg text-xs font-mono font-bold text-stone-400 hover:text-white transition';
      }
    });

    const codeEl = document.getElementById('cim-code-content');
    if (!codeEl) return;

    codeEl.textContent = `// Loading ${file.name}...`;

    fetch(file.path)
      .then(res => {
        if (!res.ok) throw new Error('File not fetched');
        return res.text();
      })
      .then(text => {
        codeEl.textContent = text;
        state._lastLoadedCode = text;
      })
      .catch(err => {
        // High fidelity fallback snippet if fetch is blocked
        const fallbackText = `<!-- Source File: ${file.name} -->\n<!-- Zero-Build HTML5 / CSS3 / Vanilla JavaScript -->\n\n/* Loaded from codertech template library */\nconsole.log('Project: ${file.name} ready for production deployment');`;
        codeEl.textContent = fallbackText;
        state._lastLoadedCode = fallbackText;
      });
  };

  window.copyCurrentInspectCode = function () {
    const code = state._lastLoadedCode || document.getElementById('cim-code-content')?.textContent;
    if (code) {
      window.copyText(code, `${state.currentInspectedFile?.name || 'File'} Code`);
    }
  };

  // --- PURE CLIENT-SIDE JSZIP PACKAGER & DOWNLOADER ---
  window.downloadProjectZip = async function (productId, includeBackend = false) {
    if (typeof JSZip === 'undefined') {
      showToast('Downloading package...');
      window.open(`https://github.com/codertech`, '_blank');
      return;
    }

    showToast(`📦 Preparing ZIP archive for ${productId.replace('prod-', '')}...`);

    try {
      const zip = new JSZip();

      if (productId === 'prod-luxe-salon') {
        const rootFolder = zip.folder('luxe-salon-website');
        
        // Fetch files
        const [html, css, js, readme] = await Promise.all([
          fetch('templates/luxe-salon/index.html').then(r => r.text()).catch(() => '<!DOCTYPE html><html><body>Luxe Salon</body></html>'),
          fetch('templates/luxe-salon/style.css').then(r => r.text()).catch(() => '/* Luxe Salon CSS */'),
          fetch('templates/luxe-salon/script.js').then(r => r.text()).catch(() => '// Luxe Salon JS'),
          fetch('templates/luxe-salon/README.md').then(r => r.text()).catch(() => '# Luxe Salon')
        ]);

        rootFolder.file('index.html', html);
        rootFolder.file('style.css', css);
        rootFolder.file('script.js', js);
        rootFolder.file('README.md', readme);

        if (includeBackend) {
          const backendFolder = rootFolder.folder('backend');
          const [pkg, srv, env] = await Promise.all([
            fetch('templates/luxe-salon/backend/package.json').then(r => r.text()).catch(() => '{}'),
            fetch('templates/luxe-salon/backend/server.js').then(r => r.text()).catch(() => '// Node.js Server'),
            fetch('templates/luxe-salon/backend/.env').then(r => r.text()).catch(() => 'PORT=5000')
          ]);
          backendFolder.file('package.json', pkg);
          backendFolder.file('server.js', srv);
          backendFolder.file('.env', env);
        }

        const zipBlob = await zip.generateAsync({ type: 'blob' });
        triggerBlobDownload(zipBlob, includeBackend ? 'luxe-salon-fullstack-suite.zip' : 'luxe-salon-website-frontend.zip');
        showToast('✅ Luxe Salon ZIP package downloaded successfully!');

      } else if (productId === 'prod-auth-screens') {
        const rootFolder = zip.folder('web-authentication-screens');

        const [html, css, js, readme] = await Promise.all([
          fetch('templates/web-auth-screens/index.html').then(r => r.text()).catch(() => '<!DOCTYPE html><html><body>Auth Screens</body></html>'),
          fetch('templates/web-auth-screens/assets/css/styles.css').then(r => r.text()).catch(() => '/* Auth CSS */'),
          fetch('templates/web-auth-screens/assets/js/app.js').then(r => r.text()).catch(() => '// Auth JS'),
          fetch('templates/web-auth-screens/README.md').then(r => r.text()).catch(() => '# Auth Screens')
        ]);

        rootFolder.file('index.html', html);
        rootFolder.file('README.md', readme);

        const assetsFolder = rootFolder.folder('assets');
        assetsFolder.folder('css').file('styles.css', css);
        assetsFolder.folder('js').file('app.js', js);

        if (includeBackend) {
          const backendFolder = rootFolder.folder('backend');
          const [pkg, srv, env] = await Promise.all([
            fetch('templates/web-auth-screens/backend/package.json').then(r => r.text()).catch(() => '{}'),
            fetch('templates/web-auth-screens/backend/server.js').then(r => r.text()).catch(() => '// JWT Server'),
            fetch('templates/web-auth-screens/backend/.env').then(r => r.text()).catch(() => 'PORT=5000')
          ]);
          backendFolder.file('package.json', pkg);
          backendFolder.file('server.js', srv);
          backendFolder.file('.env', env);
        }

        const zipBlob = await zip.generateAsync({ type: 'blob' });
        triggerBlobDownload(zipBlob, includeBackend ? 'web-auth-screens-fullstack-jwt.zip' : 'web-authentication-screens-frontend.zip');
        showToast('✅ Auth Screens ZIP package downloaded successfully!');

      } else {
        // Super Bundle (Both projects)
        const luxeFolder = zip.folder('luxe-salon-website');
        const authFolder = zip.folder('web-authentication-screens');

        const [luxeHtml, luxeCss, luxeJs, luxeReadme, authHtml, authCss, authJs, authReadme] = await Promise.all([
          fetch('templates/luxe-salon/index.html').then(r => r.text()).catch(() => ''),
          fetch('templates/luxe-salon/style.css').then(r => r.text()).catch(() => ''),
          fetch('templates/luxe-salon/script.js').then(r => r.text()).catch(() => ''),
          fetch('templates/luxe-salon/README.md').then(r => r.text()).catch(() => ''),
          fetch('templates/web-auth-screens/index.html').then(r => r.text()).catch(() => ''),
          fetch('templates/web-auth-screens/assets/css/styles.css').then(r => r.text()).catch(() => ''),
          fetch('templates/web-auth-screens/assets/js/app.js').then(r => r.text()).catch(() => ''),
          fetch('templates/web-auth-screens/README.md').then(r => r.text()).catch(() => '')
        ]);

        luxeFolder.file('index.html', luxeHtml);
        luxeFolder.file('style.css', luxeCss);
        luxeFolder.file('script.js', luxeJs);
        luxeFolder.file('README.md', luxeReadme);

        authFolder.file('index.html', authHtml);
        authFolder.file('README.md', authReadme);
        const authAssets = authFolder.folder('assets');
        authAssets.folder('css').file('styles.css', authCss);
        authAssets.folder('js').file('app.js', authJs);

        zip.file('SUPER_BUNDLE_README.md', `# Codertech Full-Stack Web Development Super Bundle\n\nIncludes:\n1. Luxe Salon Luxury Web Platform\n2. Modern Web Authentication Gateway Suite\n\nCrafted with zero-build HTML5, CSS3, and Vanilla JavaScript by Isaac (@codertech).\n`);

        const zipBlob = await zip.generateAsync({ type: 'blob' });
        triggerBlobDownload(zipBlob, 'codertech-web-developer-super-bundle.zip');
        showToast('✅ Super Bundle ZIP downloaded successfully!');
      }

    } catch (err) {
      console.error('ZIP generation error:', err);
      showToast('Error packaging files. Redirecting to source...');
      window.open('https://github.com/codertech', '_blank');
    }
  };

  function triggerBlobDownload(blob, fileName) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 200);
  }

  // Photo Customizer Modal
  window.openPhotoSettingsModal = function () {
    window.openModal('photo-modal');
  };

  window.selectAvatarPreset = function (url) {
    state.customAvatar = url;
    localStorage.setItem('codertech_custom_avatar', url);
    if (state.currentUser) {
      state.currentUser.avatar = url;
      localStorage.setItem('codertech_user', JSON.stringify(state.currentUser));
    }
    initProfile();
    renderUserProfileView();
    if (typeof window.updateNavbarAuthState === 'function') window.updateNavbarAuthState();
    showToast('Updated profile photo!');
    window.closeModal();
  };

  window.saveCustomAvatar = function () {
    const input = document.getElementById('photo-url-input');
    if (!input || !input.value.trim()) return;

    state.customAvatar = input.value.trim();
    localStorage.setItem('codertech_custom_avatar', state.customAvatar);
    if (state.currentUser) {
      state.currentUser.avatar = state.customAvatar;
      localStorage.setItem('codertech_user', JSON.stringify(state.currentUser));
    }
    initProfile();
    renderUserProfileView();
    if (typeof window.updateNavbarAuthState === 'function') window.updateNavbarAuthState();
    showToast('Custom photo saved!');
    window.closeModal();
  };

  window.resetDefaultAvatar = function () {
    state.customAvatar = '';
    localStorage.removeItem('codertech_custom_avatar');
    if (state.currentUser) {
      state.currentUser.avatar = data.profile.avatar;
      localStorage.setItem('codertech_user', JSON.stringify(state.currentUser));
    }
    initProfile();
    renderUserProfileView();
    if (typeof window.updateNavbarAuthState === 'function') window.updateNavbarAuthState();
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

  // --- KEYBOARD SHORTCUTS (⌘K, ESC, Shift+D) ---
  function initKeyboardShortcuts() {
    window.addEventListener('keydown', (e) => {
      // ⌘K or Ctrl+K or '/'
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        window.openSearchModal();
      } else if (e.key === 'Escape') {
        window.closeModal();
      } else if (e.shiftKey && (e.key === 'D' || e.key === 'd')) {
        // Toggle theme shortcut Shift+D
        const activeTag = document.activeElement ? document.activeElement.tagName : '';
        if (activeTag !== 'INPUT' && activeTag !== 'TEXTAREA') {
          e.preventDefault();
          window.toggleTheme();
        }
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

  // --- DYNAMIC SITEMAP.XML GENERATOR ---
  window.generateDynamicSitemapXml = function () {
    const baseUrl = 'https://codertech.dev';
    const today = new Date().toISOString().split('T')[0];

    const corePages = [
      { loc: `${baseUrl}/`, priority: '1.0', changefreq: 'daily' },
      { loc: `${baseUrl}/#/projects`, priority: '0.9', changefreq: 'weekly' },
      { loc: `${baseUrl}/#/blog`, priority: '0.9', changefreq: 'daily' },
      { loc: `${baseUrl}/#services`, priority: '0.8', changefreq: 'monthly' },
      { loc: `${baseUrl}/#process`, priority: '0.7', changefreq: 'monthly' },
      { loc: `${baseUrl}/#monetize`, priority: '0.8', changefreq: 'weekly' },
      { loc: `${baseUrl}/#socials`, priority: '0.7', changefreq: 'monthly' },
      { loc: `${baseUrl}/#faq`, priority: '0.6', changefreq: 'monthly' }
    ];

    const blogEntries = (data.blogPosts || []).map(post => ({
      loc: `${baseUrl}/#/blog/${post.slug}`,
      lastmod: today,
      changefreq: 'weekly',
      priority: '0.85'
    }));

    const projectEntries = (data.projects || []).map(proj => ({
      loc: `${baseUrl}/#project-${proj.id}`,
      lastmod: today,
      changefreq: 'monthly',
      priority: '0.80'
    }));

    const allEntries = [...corePages, ...blogEntries, ...projectEntries];

    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n`;
    xml += `        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"\n`;
    xml += `        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9\n`;
    xml += `        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">\n`;

    allEntries.forEach(entry => {
      xml += `  <url>\n`;
      xml += `    <loc>${entry.loc}</loc>\n`;
      if (entry.lastmod) {
        xml += `    <lastmod>${entry.lastmod}</lastmod>\n`;
      }
      if (entry.changefreq) {
        xml += `    <changefreq>${entry.changefreq}</changefreq>\n`;
      }
      if (entry.priority) {
        xml += `    <priority>${entry.priority}</priority>\n`;
      }
      xml += `  </url>\n`;
    });

    xml += `</urlset>`;
    return xml;
  };

  window.openSitemapModal = function () {
    const xml = window.generateDynamicSitemapXml();
    const blogCount = (data.blogPosts || []).length;
    const projCount = (data.projects || []).length;
    const coreCount = 8;
    const totalCount = blogCount + projCount + coreCount;

    const statTotal = document.getElementById('sitemap-stat-total');
    const statBlogs = document.getElementById('sitemap-stat-blogs');
    const statProjs = document.getElementById('sitemap-stat-projects');
    const statPages = document.getElementById('sitemap-stat-pages');
    const codePreview = document.getElementById('sitemap-code-preview');

    if (statTotal) statTotal.textContent = totalCount;
    if (statBlogs) statBlogs.textContent = blogCount;
    if (statProjs) statProjs.textContent = projCount;
    if (statPages) statPages.textContent = coreCount;

    if (codePreview) {
      codePreview.textContent = xml;
    }

    window.openModal('sitemap-modal');

    if (typeof window.trackEvent === 'function') {
      window.trackEvent('sitemap_view', { totalUrls: totalCount });
    }
  };

  window.copySitemapXml = function () {
    const xml = window.generateDynamicSitemapXml();
    window.copyText(xml, 'sitemap.xml content');
    if (typeof window.trackEvent === 'function') {
      window.trackEvent('sitemap_copy', { timestamp: Date.now() });
    }
  };

  window.downloadSitemapXml = function () {
    const xml = window.generateDynamicSitemapXml();
    const blob = new Blob([xml], { type: 'application/xml;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'sitemap.xml';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast('Downloaded sitemap.xml successfully! 🚀');

    if (typeof window.trackEvent === 'function') {
      window.trackEvent('sitemap_download', { timestamp: Date.now() });
    }
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

  // ============================================================================
  // AUTHENTICATION SYSTEM (Sign In, Sign Up, 2FA OTP, Social OAuth, Modals)
  // ============================================================================

  function updateNavbarAuthState() {
    const navContainer = document.getElementById('nav-auth-container');
    const mobileContainer = document.getElementById('mobile-auth-container');
    const user = state.currentUser;
    const avatarUrl = state.customAvatar || (user && user.avatar) || data.profile.avatar;

    if (navContainer) {
      if (user && user.isLoggedIn) {
        navContainer.innerHTML = `
          <div class="flex items-center gap-2">
            <a href="profile.html" class="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-white border border-stone-200 hover:border-purple-300 text-stone-800 text-xs font-bold transition shadow-2xs group">
              <img src="${avatarUrl}" alt="${user.name}" class="w-5 h-5 rounded-full object-cover border border-purple-200 dynamic-user-avatar" />
              <span class="max-w-[80px] sm:max-w-[110px] truncate">${user.name}</span>
            </a>
            <button onclick="window.logoutUser()" class="hidden lg:flex p-1.5 text-stone-400 hover:text-rose-600 transition" title="Log Out">
              <i data-lucide="log-out" class="w-3.5 h-3.5"></i>
            </button>
          </div>
        `;
      } else {
        navContainer.innerHTML = `
          <a href="auth.html" class="px-3.5 py-1.5 rounded-xl bg-white border border-stone-200 text-stone-700 hover:text-stone-900 hover:border-stone-300 text-xs font-bold flex items-center gap-1.5 transition shadow-2xs">
            <i data-lucide="user" class="w-3.5 h-3.5 text-[#6C5CE7]"></i>
            <span>Sign In</span>
          </a>
        `;
      }
    }

    if (mobileContainer) {
      if (user && user.isLoggedIn) {
        mobileContainer.innerHTML = `
          <div class="flex items-center justify-between gap-3">
            <a href="profile.html" onclick="window.toggleMobileNav()" class="flex items-center gap-2.5">
              <img src="${avatarUrl}" alt="${user.name}" class="w-8 h-8 rounded-full object-cover border border-purple-300 dynamic-user-avatar" />
              <div>
                <div class="text-xs font-bold text-stone-900">${user.name}</div>
                <div class="text-[10px] text-stone-500 font-mono">${user.handle || user.email}</div>
              </div>
            </a>
            <button onclick="window.toggleMobileNav(); window.logoutUser();" class="px-3 py-1 bg-rose-50 border border-rose-200 text-xs font-bold text-rose-700 rounded-lg shadow-2xs">
              Log Out
            </button>
          </div>
        `;
      } else {
        mobileContainer.innerHTML = `
          <div class="flex items-center justify-between gap-2">
            <div class="text-xs font-bold text-stone-500 uppercase font-mono">Account</div>
            <div class="flex items-center gap-2">
              <a href="auth.html" onclick="window.toggleMobileNav();" class="px-3 py-1 bg-white border border-stone-200 text-xs font-bold text-stone-800 rounded-lg shadow-2xs">
                Sign In
              </a>
              <a href="auth.html#signup" onclick="window.toggleMobileNav();" class="px-3 py-1 bg-[#6C5CE7] text-xs font-bold text-white rounded-lg shadow-2xs">
                Create Account
              </a>
            </div>
          </div>
        `;
      }
    }

    refreshIcons();
  }
  window.updateNavbarAuthState = updateNavbarAuthState;

  // Auth Modal Trigger & Mode Switcher
  function openAuthModal(mode = 'signin') {
    setModalAuthMode(mode);
    window.openModal('auth-modal');
  }
  window.openAuthModal = openAuthModal;

  function setModalAuthMode(mode) {
    state.modalAuthMode = mode;
    const isSignup = mode === 'signup';

    const tabSignIn = document.getElementById('m-auth-tab-signin');
    const tabSignUp = document.getElementById('m-auth-tab-signup');
    const title = document.getElementById('modal-auth-title');
    const subtitle = document.getElementById('modal-auth-subtitle');
    const nameField = document.getElementById('m-field-name');
    const submitBtn = document.getElementById('m-auth-submit-btn');

    if (tabSignIn && tabSignUp) {
      if (isSignup) {
        tabSignUp.className = 'flex-1 py-1.5 text-xs font-bold rounded-lg transition bg-white text-stone-900 shadow-2xs';
        tabSignIn.className = 'flex-1 py-1.5 text-xs font-bold rounded-lg transition text-stone-600 hover:text-stone-900';
      } else {
        tabSignIn.className = 'flex-1 py-1.5 text-xs font-bold rounded-lg transition bg-white text-stone-900 shadow-2xs';
        tabSignUp.className = 'flex-1 py-1.5 text-xs font-bold rounded-lg transition text-stone-600 hover:text-stone-900';
      }
    }

    if (title) title.textContent = isSignup ? 'Create Account' : 'Sign In to codertech';
    if (subtitle) subtitle.textContent = isSignup ? 'Fill your details to start using all developer features.' : 'Access user profile, saved articles, and developer toolkits.';
    if (nameField) {
      if (isSignup) {
        nameField.classList.remove('hidden');
      } else {
        nameField.classList.add('hidden');
      }
    }
    if (submitBtn) submitBtn.textContent = isSignup ? 'Create Account' : 'Sign In';
  }
  window.setModalAuthMode = setModalAuthMode;

  function handleModalAuthSubmit(e) {
    e.preventDefault();
    const email = document.getElementById('m-auth-email')?.value.trim() || 'isaacapptech23developer@gmail.com';
    const name = document.getElementById('m-auth-name')?.value.trim() || email.split('@')[0];
    const isSignup = state.modalAuthMode === 'signup';

    state.currentUser = {
      isLoggedIn: true,
      name: isSignup ? name : (state.currentUser?.name || 'Isaac'),
      handle: isSignup ? `@${name.toLowerCase().replace(/\s+/g, '_')}` : (state.currentUser?.handle || '@isaac_codertech'),
      email: email,
      role: state.currentUser?.role || 'Full-Stack Engineer & Kotlin Android Developer',
      avatar: state.customAvatar || state.currentUser?.avatar || data.profile.avatar,
      bio: state.currentUser?.bio || 'Developer on codertech platform.',
      location: state.currentUser?.location || 'Global / Remote',
      github: state.currentUser?.github || 'https://github.com',
      twitter: state.currentUser?.twitter || 'https://twitter.com'
    };

    localStorage.setItem('codertech_user', JSON.stringify(state.currentUser));
    window.closeModal();
    updateNavbarAuthState();
    renderUserProfileView();
    showToast(isSignup ? `Welcome ${name}! Your account has been created.` : `Welcome back! Signed in as ${state.currentUser.name}`);
  }
  window.handleModalAuthSubmit = handleModalAuthSubmit;

  // ============================================================================
  // AUTHENTICATION GATEWAY & MULTI-SCREEN SUITE
  // ============================================================================

  function showAuthGatewayScreen(screenName) {
    const validScreen = ['welcome', 'signin', 'signup', 'verify', 'forgot'].includes(screenName) ? screenName : 'welcome';
    const screens = ['welcome', 'signin', 'signup', 'verify', 'forgot'];
    screens.forEach(s => {
      const panel = document.getElementById(`m-screen-${s}`);
      if (panel) {
        if (s === validScreen) {
          panel.classList.remove('hidden');
          panel.classList.add('active');
        } else {
          panel.classList.remove('active');
          panel.classList.add('hidden');
        }
      }
    });

    if (validScreen === 'verify') {
      setTimeout(() => {
        const firstOtp = document.getElementById('m-otp-1');
        if (firstOtp) firstOtp.focus();
      }, 100);
      startGatewayOtpCountdown();
    }

    refreshIcons();
  }
  window.showAuthGatewayScreen = showAuthGatewayScreen;

  function openAuthGateway(screenName = 'welcome') {
    showAuthGatewayScreen(screenName);
    window.openModal('auth-modal');
  }
  window.openAuthGateway = openAuthGateway;

  function skipToPortfolio() {
    try {
      sessionStorage.setItem('codertech_auth_bypassed', 'true');
    } catch (e) {}
    window.closeModal();
    showToast('Exploring codertech as Guest 🚀');
  }
  window.skipToPortfolio = skipToPortfolio;

  function setModalAuthMode(mode) {
    showAuthGatewayScreen(mode === 'signup' ? 'signup' : 'signin');
  }
  window.setModalAuthMode = setModalAuthMode;

  function handleGatewaySignIn(e) {
    e.preventDefault();
    const email = document.getElementById('input-signin-email')?.value.trim() || 'isaacapptech23developer@gmail.com';
    const name = email === 'isaacapptech23developer@gmail.com' ? 'Isaac' : (email.split('@')[0] || 'Developer');

    state.currentUser = {
      isLoggedIn: true,
      name: name,
      handle: `@${name.toLowerCase().replace(/\s+/g, '_')}`,
      email: email,
      role: 'Full-Stack Engineer & Kotlin Android Developer',
      avatar: state.customAvatar || data.profile.avatar,
      bio: 'Software engineer building modern native Kotlin Android apps and lightweight, ultra-fast web architectures.',
      location: 'Global / Remote',
      github: 'https://github.com',
      twitter: 'https://twitter.com'
    };

    localStorage.setItem('codertech_user', JSON.stringify(state.currentUser));
    try {
      sessionStorage.setItem('codertech_auth_bypassed', 'true');
    } catch (err) {}

    window.closeModal();
    updateNavbarAuthState();
    renderUserProfileView();
    showToast(`Welcome back, ${name}! ✨`);
    window.location.hash = '#/profile';
  }
  window.handleGatewaySignIn = handleGatewaySignIn;

  function handleGatewaySignUp(e) {
    e.preventDefault();
    const name = document.getElementById('input-signup-name')?.value.trim() || 'Isaac';
    const email = document.getElementById('input-signup-email')?.value.trim() || 'isaacapptech23developer@gmail.com';

    state.pendingUser = {
      name,
      email,
      handle: `@${name.toLowerCase().replace(/\s+/g, '_')}`,
      role: 'Full-Stack Engineer & Kotlin Developer',
      avatar: state.customAvatar || data.profile.avatar,
      bio: 'Software engineer building apps with Kotlin & Web tech.'
    };

    const emailDisplay = document.getElementById('gateway-verify-email-display');
    if (emailDisplay) emailDisplay.textContent = email;

    showAuthGatewayScreen('verify');
    showToast(`OTP sent to ${email} (Demo: 2026)`, 'info');
  }
  window.handleGatewaySignUp = handleGatewaySignUp;

  function fillDemoGatewayOtp() {
    const o1 = document.getElementById('m-otp-1');
    const o2 = document.getElementById('m-otp-2');
    const o3 = document.getElementById('m-otp-3');
    const o4 = document.getElementById('m-otp-4');
    if (o1) o1.value = '2';
    if (o2) o2.value = '0';
    if (o3) o3.value = '2';
    if (o4) o4.value = '6';
    showToast('Auto-filled OTP: 2026', 'info');
  }
  window.fillDemoGatewayOtp = fillDemoGatewayOtp;

  function startGatewayOtpCountdown() {
    if (state.otpTimerInterval) clearInterval(state.otpTimerInterval);
    state.otpTimeRemaining = 45;
    const timerEl = document.getElementById('gateway-otp-countdown');
    const resendBtn = document.getElementById('gateway-btn-resend-otp');

    if (resendBtn) resendBtn.disabled = true;

    state.otpTimerInterval = setInterval(() => {
      state.otpTimeRemaining -= 1;
      if (timerEl) timerEl.textContent = `(${state.otpTimeRemaining}s)`;

      if (state.otpTimeRemaining <= 0) {
        clearInterval(state.otpTimerInterval);
        if (timerEl) timerEl.textContent = '';
        if (resendBtn) resendBtn.disabled = false;
      }
    }, 1000);
  }

  function resendGatewayOtp() {
    startGatewayOtpCountdown();
    showToast('New 4-digit code sent (Demo: 2026)', 'info');
  }
  window.resendGatewayOtp = resendGatewayOtp;

  function submitGatewayVerifyOtp() {
    const user = state.pendingUser || {
      name: 'Isaac',
      email: 'isaacapptech23developer@gmail.com',
      handle: '@isaac_codertech',
      role: 'Full-Stack Engineer & Kotlin Android Developer',
      avatar: state.customAvatar || data.profile.avatar,
      bio: 'Software engineer building modern native Android apps and high-performance web systems.'
    };

    state.currentUser = {
      ...user,
      isLoggedIn: true,
      location: 'Global / Remote',
      github: 'https://github.com',
      twitter: 'https://twitter.com'
    };

    localStorage.setItem('codertech_user', JSON.stringify(state.currentUser));
    try {
      sessionStorage.setItem('codertech_auth_bypassed', 'true');
    } catch (err) {}

    window.closeModal();
    updateNavbarAuthState();
    renderUserProfileView();
    showToast(`Account verified! 🎉 Welcome to codertech, ${user.name}.`);
    window.location.hash = '#/profile';
  }
  window.submitGatewayVerifyOtp = submitGatewayVerifyOtp;

  function handleGatewayForgotSubmit(e) {
    e.preventDefault();
    const email = document.getElementById('input-forgot-email')?.value.trim() || 'isaacapptech23developer@gmail.com';
    const emailDisplay = document.getElementById('gateway-verify-email-display');
    if (emailDisplay) emailDisplay.textContent = email;

    showToast(`Password recovery OTP sent to ${email}`, 'info');
    showAuthGatewayScreen('verify');
  }
  window.handleGatewayForgotSubmit = handleGatewayForgotSubmit;

  function socialAuth(provider) {
    const providerNames = {
      Google: 'Isaac (Google User)',
      GitHub: 'Isaac App Tech',
      Apple: 'Isaac (Apple ID)',
      Facebook: 'Isaac Developer'
    };

    state.currentUser = {
      isLoggedIn: true,
      name: providerNames[provider] || `${provider} User`,
      handle: `@${(providerNames[provider] || provider).toLowerCase().replace(/\s+/g, '_')}`,
      email: 'isaacapptech23developer@gmail.com',
      role: 'Full-Stack Engineer & Kotlin Android Developer',
      avatar: state.customAvatar || data.profile.avatar,
      bio: `Logged in via ${provider} OAuth authentication.`,
      location: 'Global / Remote',
      github: 'https://github.com',
      twitter: 'https://twitter.com'
    };

    localStorage.setItem('codertech_user', JSON.stringify(state.currentUser));
    try {
      sessionStorage.setItem('codertech_auth_bypassed', 'true');
    } catch (err) {}

    window.closeModal();
    updateNavbarAuthState();
    renderUserProfileView();
    showToast(`Signed in with ${provider} successfully! 🚀`);
    window.location.hash = '#/profile';
  }
  window.socialAuth = socialAuth;
  window.handleSocialLogin = socialAuth;

  // Full Screen Auth Page View (#/auth)
  function switchAuthTab(tab) {
    const validTab = ['signin', 'signup', 'verify', 'forgot'].includes(tab) ? tab : 'signin';
    const screens = ['signin', 'signup', 'verify', 'forgot'];
    screens.forEach(s => {
      const el = document.getElementById(`auth-screen-${s}`);
      if (el) {
        if (s === validTab) {
          el.classList.remove('hidden');
          el.classList.add('active');
        } else {
          el.classList.remove('active');
          el.classList.add('hidden');
        }
      }
    });

    const btnSignin = document.getElementById('auth-tab-btn-signin');
    const btnSignup = document.getElementById('auth-tab-btn-signup');
    const statusText = document.getElementById('auth-screen-status');

    if (btnSignin && btnSignup) {
      if (validTab === 'signup') {
        btnSignup.className = 'flex-1 py-2 text-xs font-bold rounded-xl transition bg-[#6C5CE7] text-white shadow-xs';
        btnSignin.className = 'flex-1 py-2 text-xs font-bold rounded-xl transition text-stone-600 hover:text-stone-900';
        if (statusText) statusText.textContent = 'Registration';
      } else if (validTab === 'signin') {
        btnSignin.className = 'flex-1 py-2 text-xs font-bold rounded-xl transition bg-[#6C5CE7] text-white shadow-xs';
        btnSignup.className = 'flex-1 py-2 text-xs font-bold rounded-xl transition text-stone-600 hover:text-stone-900';
        if (statusText) statusText.textContent = 'Secure Session';
      } else if (validTab === 'verify') {
        if (statusText) statusText.textContent = '2FA Verification';
      } else if (validTab === 'forgot') {
        if (statusText) statusText.textContent = 'Password Recovery';
      }
    }

    refreshIcons();
  }
  window.switchAuthTab = switchAuthTab;

  function togglePasswordVisibility(inputId, btn) {
    const input = document.getElementById(inputId);
    if (!input) return;
    const isPassword = input.type === 'password';
    input.type = isPassword ? 'text' : 'password';

    if (btn) {
      btn.innerHTML = isPassword
        ? '<i data-lucide="eye-off" class="w-4 h-4"></i>'
        : '<i data-lucide="eye" class="w-4 h-4"></i>';
      refreshIcons();
    }
  }
  window.togglePasswordVisibility = togglePasswordVisibility;

  function handleSignInSubmit(e) {
    e.preventDefault();
    const email = document.getElementById('signin-email')?.value.trim() || 'isaacapptech23developer@gmail.com';
    const name = email === 'isaacapptech23developer@gmail.com' ? 'Isaac' : (email.split('@')[0] || 'Developer');

    state.currentUser = {
      isLoggedIn: true,
      name: name,
      handle: `@${name.toLowerCase().replace(/\s+/g, '_')}`,
      email: email,
      role: 'Full-Stack Engineer & Kotlin Android Developer',
      avatar: state.customAvatar || data.profile.avatar,
      bio: 'Software engineer building modern native Kotlin Android apps and lightweight, ultra-fast web architectures. Passionate about developer tools and tech blogging.',
      location: 'Global / Remote',
      github: 'https://github.com',
      twitter: 'https://twitter.com'
    };

    localStorage.setItem('codertech_user', JSON.stringify(state.currentUser));
    updateNavbarAuthState();
    renderUserProfileView();
    showToast(`Welcome back, ${name}!`);
    window.location.hash = '#/profile';
  }
  window.handleSignInSubmit = handleSignInSubmit;

  function fillDemoCredentials(type = 'isaac') {
    const emailInput = document.getElementById('signin-email');
    const passInput = document.getElementById('signin-password');
    const gatewayEmail = document.getElementById('input-signin-email');
    const gatewayPass = document.getElementById('input-signin-password');

    if (type === 'isaac') {
      if (emailInput) emailInput.value = 'isaacapptech23developer@gmail.com';
      if (passInput) passInput.value = 'codertech2026';
      if (gatewayEmail) gatewayEmail.value = 'isaacapptech23developer@gmail.com';
      if (gatewayPass) gatewayPass.value = 'codertech2026';
      showToast('Loaded demo credentials: Isaac (Lead Dev)');
    } else {
      if (emailInput) emailInput.value = 'guest.developer@codertech.dev';
      if (passInput) passInput.value = 'demo12345';
      if (gatewayEmail) gatewayEmail.value = 'guest.developer@codertech.dev';
      if (gatewayPass) gatewayPass.value = 'demo12345';
      showToast('Loaded demo credentials: Guest Member');
    }
  }
  window.fillDemoCredentials = fillDemoCredentials;

  function fillDemoOtp() {
    const d1 = document.getElementById('otp-digit-1');
    const d2 = document.getElementById('otp-digit-2');
    const d3 = document.getElementById('otp-digit-3');
    const d4 = document.getElementById('otp-digit-4');
    if (d1) d1.value = '2';
    if (d2) d2.value = '0';
    if (d3) d3.value = '2';
    if (d4) d4.value = '6';
    fillDemoGatewayOtp();
    showToast('Auto-filled OTP: 2026', 'info');
  }
  window.fillDemoOtp = fillDemoOtp;

  function handleSignUpSubmit(e) {
    e.preventDefault();
    const name = document.getElementById('signup-name')?.value.trim() || 'Developer';
    const email = document.getElementById('signup-email')?.value.trim() || 'user@codertech.dev';

    state.pendingUser = {
      name,
      email,
      handle: `@${name.toLowerCase().replace(/\s+/g, '_')}`,
      role: 'Full-Stack Engineer & Kotlin Developer',
      avatar: state.customAvatar || data.profile.avatar,
      bio: 'Developer building apps with Kotlin & Web tech.'
    };

    const emailDisplay = document.getElementById('auth-verify-email-text');
    if (emailDisplay) emailDisplay.textContent = email;

    switchAuthTab('verify');
    startOtpCountdown();
    showToast(`OTP Code sent to ${email} (Demo code: 2026)`, 'info');

    setTimeout(() => {
      const d1 = document.getElementById('otp-digit-1');
      if (d1) d1.focus();
    }, 100);
  }
  window.handleSignUpSubmit = handleSignUpSubmit;

  function startOtpCountdown() {
    if (state.otpTimerInterval) clearInterval(state.otpTimerInterval);
    state.otpTimeRemaining = 45;
    const timerEl = document.getElementById('otp-countdown-timer');
    const resendBtn = document.getElementById('btn-resend-otp');

    if (resendBtn) resendBtn.disabled = true;

    state.otpTimerInterval = setInterval(() => {
      state.otpTimeRemaining -= 1;
      if (timerEl) timerEl.textContent = `(${state.otpTimeRemaining}s)`;

      if (state.otpTimeRemaining <= 0) {
        clearInterval(state.otpTimerInterval);
        if (timerEl) timerEl.textContent = '';
        if (resendBtn) resendBtn.disabled = false;
      }
    }, 1000);
  }

  function resendOtpCode() {
    startOtpCountdown();
    showToast('New 4-digit verification code sent (Demo: 2026)', 'info');
  }
  window.resendOtpCode = resendOtpCode;

  function submitVerifyOtp() {
    const user = state.pendingUser || {
      name: 'Isaac',
      email: 'isaacapptech23developer@gmail.com',
      handle: '@isaac_codertech',
      role: 'Full-Stack Engineer & Kotlin Android Developer',
      avatar: state.customAvatar || data.profile.avatar,
      bio: 'Software engineer on codertech.'
    };

    state.currentUser = {
      ...user,
      isLoggedIn: true,
      location: 'Global / Remote',
      github: 'https://github.com',
      twitter: 'https://twitter.com'
    };

    localStorage.setItem('codertech_user', JSON.stringify(state.currentUser));
    updateNavbarAuthState();
    renderUserProfileView();
    showToast('Account successfully verified! 🎉 Welcome to codertech.');
    window.location.hash = '#/profile';
  }
  window.submitVerifyOtp = submitVerifyOtp;

  function handleForgotSubmit(e) {
    e.preventDefault();
    const email = document.getElementById('forgot-email')?.value.trim() || 'your email';
    showToast(`Password recovery link sent to ${email}`, 'info');
    setTimeout(() => {
      switchAuthTab('signin');
    }, 1500);
  }
  window.handleForgotSubmit = handleForgotSubmit;

  function showTermsModal() {
    window.openModal('terms-modal');
  }
  window.showTermsModal = showTermsModal;

  function logoutUser() {
    if (state.currentUser) {
      state.currentUser.isLoggedIn = false;
    }
    localStorage.setItem('codertech_user', JSON.stringify(state.currentUser));
    updateNavbarAuthState();
    showToast('Logged out of session. See you soon!');
    window.location.hash = '#home';
  }
  window.logoutUser = logoutUser;

  function initOtpInputListeners() {
    // Both full-page OTP and Gateway OTP inputs
    const otpInputs = document.querySelectorAll('.otp-input-field, .gateway-otp-input');
    otpInputs.forEach((input, index, allInputs) => {
      input.addEventListener('input', (e) => {
        if (e.target.value.length >= 1) {
          e.target.value = e.target.value.slice(-1);
          // Look for next sibling input
          const nextInput = input.nextElementSibling;
          if (nextInput && nextInput.tagName === 'INPUT') {
            nextInput.focus();
          }
        }
      });

      input.addEventListener('keydown', (e) => {
        if (e.key === 'Backspace' && !e.target.value) {
          const prevInput = input.previousElementSibling;
          if (prevInput && prevInput.tagName === 'INPUT') {
            prevInput.focus();
          }
        }
      });
    });
  }

  // ============================================================================
  // USER PROFILE VIEW (#/profile)
  // ============================================================================

  function switchProfileTab(tab) {
    const tabs = ['info', 'avatar', 'settings', 'bookmarks'];
    tabs.forEach(t => {
      const panel = document.getElementById(`ptab-panel-${t}`);
      const btn = document.getElementById(`ptab-btn-${t}`);
      if (panel) {
        if (t === tab) {
          panel.classList.remove('hidden');
        } else {
          panel.classList.add('hidden');
        }
      }
      if (btn) {
        if (t === tab) {
          btn.className = 'w-full px-4 py-3 rounded-2xl text-left text-xs font-bold flex items-center gap-3 transition bg-[#6C5CE7] text-white shadow-2xs';
        } else {
          btn.className = 'w-full px-4 py-3 rounded-2xl text-left text-xs font-bold flex items-center gap-3 transition text-stone-600 hover:bg-stone-50';
        }
      }
    });

    if (tab === 'bookmarks') {
      renderProfileSavedBlogs();
    }

    refreshIcons();
  }
  window.switchProfileTab = switchProfileTab;

  function renderUserProfileView() {
    const user = state.currentUser || {
      name: 'Isaac',
      handle: '@isaac_codertech',
      email: 'isaacapptech23developer@gmail.com',
      role: 'Full-Stack Engineer & Kotlin Android Developer',
      bio: 'Software engineer building modern native Kotlin Android apps and lightweight, ultra-fast web architectures.',
      location: 'Global / Remote',
      github: 'https://github.com',
      twitter: 'https://twitter.com'
    };

    const avatarUrl = state.customAvatar || user.avatar || data.profile.avatar;

    const nameDisplay = document.getElementById('user-profile-name-display');
    const handleDisplay = document.getElementById('user-profile-handle-display');
    const emailDisplay = document.getElementById('user-profile-email-display');
    const avatarImg = document.getElementById('user-profile-avatar');

    if (nameDisplay) nameDisplay.textContent = user.name;
    if (handleDisplay) handleDisplay.textContent = user.handle;
    if (emailDisplay) emailDisplay.textContent = user.email;
    if (avatarImg) avatarImg.src = avatarUrl;

    const inputName = document.getElementById('prof-name');
    const inputHandle = document.getElementById('prof-handle');
    const inputRole = document.getElementById('prof-headline');
    const inputEmail = document.getElementById('prof-email');
    const inputBio = document.getElementById('prof-bio');
    const inputLoc = document.getElementById('prof-location');
    const inputGh = document.getElementById('prof-github');
    const inputTw = document.getElementById('prof-twitter');

    if (inputName) inputName.value = user.name || 'Isaac';
    if (inputHandle) inputHandle.value = user.handle || '@isaac_codertech';
    if (inputRole) inputRole.value = user.role || 'Full-Stack Engineer & Kotlin Android Developer';
    if (inputEmail) inputEmail.value = user.email || 'isaacapptech23developer@gmail.com';
    if (inputBio) inputBio.value = user.bio || '';
    if (inputLoc) inputLoc.value = user.location || 'Global / Remote';
    if (inputGh) inputGh.value = user.github || 'https://github.com';
    if (inputTw) inputTw.value = user.twitter || 'https://twitter.com';

    renderProfileSavedBlogs();
  }
  window.renderUserProfileView = renderUserProfileView;

  function handleProfileSave(e) {
    e.preventDefault();
    const name = document.getElementById('prof-name')?.value.trim() || 'Isaac';
    const handle = document.getElementById('prof-handle')?.value.trim() || '@isaac_codertech';
    const role = document.getElementById('prof-headline')?.value.trim() || 'Full-Stack Engineer';
    const email = document.getElementById('prof-email')?.value.trim() || 'isaacapptech23developer@gmail.com';
    const bio = document.getElementById('prof-bio')?.value.trim() || '';
    const location = document.getElementById('prof-location')?.value.trim() || 'Global / Remote';
    const github = document.getElementById('prof-github')?.value.trim() || 'https://github.com';
    const twitter = document.getElementById('prof-twitter')?.value.trim() || 'https://twitter.com';

    state.currentUser = {
      ...(state.currentUser || {}),
      isLoggedIn: true,
      name,
      handle,
      role,
      email,
      bio,
      location,
      github,
      twitter,
      avatar: state.customAvatar || state.currentUser?.avatar || data.profile.avatar
    };

    localStorage.setItem('codertech_user', JSON.stringify(state.currentUser));
    renderUserProfileView();
    updateNavbarAuthState();
    showToast('Profile information saved successfully! ✓');
  }
  window.handleProfileSave = handleProfileSave;

  function setThemeFromProfile(theme) {
    const isDark = theme === 'dark';
    try {
      localStorage.setItem('codertech_theme', theme);
    } catch (e) {}
    applyTheme(theme, true);

    const cardLight = document.getElementById('theme-card-light');
    const cardDark = document.getElementById('theme-card-dark');
    const badgeLight = document.getElementById('badge-light-active');
    const badgeDark = document.getElementById('badge-dark-active');

    if (cardLight && cardDark) {
      if (isDark) {
        cardLight.className = 'p-5 rounded-3xl border-2 cursor-pointer transition border-stone-200 bg-stone-50 hover:border-stone-400';
        cardDark.className = 'p-5 rounded-3xl border-2 cursor-pointer transition border-[#6C5CE7] bg-stone-900 text-white shadow-xs';
        if (badgeLight) badgeLight.classList.add('hidden');
        if (badgeDark) badgeDark.classList.remove('hidden');
      } else {
        cardLight.className = 'p-5 rounded-3xl border-2 cursor-pointer transition border-[#6C5CE7] bg-purple-50/40 shadow-xs';
        cardDark.className = 'p-5 rounded-3xl border-2 cursor-pointer transition border-stone-200 bg-stone-900 text-white hover:border-stone-400';
        if (badgeLight) badgeLight.classList.remove('hidden');
        if (badgeDark) badgeDark.classList.add('hidden');
      }
    }
  }
  window.setThemeFromProfile = setThemeFromProfile;

  function renderProfileSavedBlogs() {
    const container = document.getElementById('profile-saved-blogs-list');
    const statCount = document.getElementById('stat-saved-count');
    if (statCount) {
      statCount.textContent = `${state.bookmarkedBlogs.length} Bookmark${state.bookmarkedBlogs.length === 1 ? '' : 's'}`;
    }

    if (!container) return;

    if (state.bookmarkedBlogs.length === 0) {
      container.innerHTML = `
        <div class="p-8 text-center bg-stone-50 rounded-2xl border border-stone-200/80 space-y-2">
          <div class="text-stone-400 font-bold text-xs">No bookmarked articles yet</div>
          <p class="text-stone-500 text-xs">Bookmark your favorite Android Kotlin playbooks or Web architecture guides to read them anytime.</p>
          <a href="#/blog" class="inline-block mt-2 px-4 py-2 bg-[#6C5CE7] text-white rounded-xl text-xs font-bold shadow-2xs">
            Browse Tech Blog
          </a>
        </div>
      `;
      return;
    }

    const savedPosts = (data.blogPosts || []).filter(p => state.bookmarkedBlogs.includes(p.id));

    container.innerHTML = savedPosts.map(p => `
      <div class="p-4 rounded-2xl bg-stone-50 border border-stone-200/80 hover:border-purple-200 transition flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div class="space-y-1">
          <div class="flex items-center gap-2">
            <span class="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-purple-100 text-[#6C5CE7]">${p.category.toUpperCase()}</span>
            <span class="text-xs text-stone-500 font-mono">${p.readTime}</span>
          </div>
          <a href="#/blog/${p.slug}" class="text-sm font-bold text-stone-900 hover:text-[#6C5CE7] transition font-display block">
            ${p.title}
          </a>
          <p class="text-xs text-stone-500 line-clamp-1">${p.excerpt}</p>
        </div>
        <div class="flex items-center gap-2 shrink-0">
          <a href="#/blog/${p.slug}" class="px-3 py-1.5 bg-white border border-stone-200 hover:bg-stone-100 text-stone-800 text-xs font-bold rounded-xl transition flex items-center gap-1 shadow-2xs">
            <span>Read</span>
            <i data-lucide="arrow-right" class="w-3 h-3"></i>
          </a>
          <button onclick="window.toggleBlogBookmark('${p.id}'); if(typeof window.renderProfileSavedBlogs === 'function') window.renderProfileSavedBlogs();" class="p-1.5 bg-white border border-stone-200 hover:bg-rose-50 text-rose-600 rounded-xl transition cursor-pointer" title="Remove Bookmark">
            <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
          </button>
        </div>
      </div>
    `).join('');

    refreshIcons();
  }
  window.renderProfileSavedBlogs = renderProfileSavedBlogs;

  // ============================================================================
  // LIVE CAMERA STUDIO MODAL (WebRTC / Mobile & Desktop Camera Snapshot)
  // ============================================================================

  function openCameraModal() {
    window.openModal('camera-modal');
    startCameraStream();
  }
  window.openCameraModal = openCameraModal;

  function startCameraStream() {
    const video = document.getElementById('camera-stream-video');
    const preview = document.getElementById('camera-snapshot-preview');
    const liveControls = document.getElementById('camera-live-controls');
    const reviewControls = document.getElementById('camera-review-controls');
    const fallbackMsg = document.getElementById('camera-fallback-msg');
    const liveBadge = document.getElementById('camera-live-badge');

    if (preview) preview.classList.add('hidden');
    if (video) {
      video.classList.remove('hidden');
      video.style.transform = state.isCameraMirrored ? 'scaleX(-1)' : 'scaleX(1)';
    }
    if (liveControls) liveControls.classList.remove('hidden');
    if (reviewControls) reviewControls.classList.add('hidden');
    if (fallbackMsg) fallbackMsg.classList.add('hidden');
    if (liveBadge) liveBadge.classList.remove('hidden');

    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      stopCameraStream();

      navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: state.cameraFacingMode || 'user',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      }).then(stream => {
        state.cameraStream = stream;
        if (video) {
          video.srcObject = stream;
          video.play().catch(e => console.warn('Video play error:', e));
        }
      }).catch(err => {
        console.warn('Camera access error:', err);
        if (fallbackMsg) fallbackMsg.classList.remove('hidden');
        if (liveBadge) liveBadge.classList.add('hidden');
      });
    } else {
      if (fallbackMsg) fallbackMsg.classList.remove('hidden');
      if (liveBadge) liveBadge.classList.add('hidden');
    }
  }

  function stopCameraStream() {
    if (state.cameraStream) {
      state.cameraStream.getTracks().forEach(track => track.stop());
      state.cameraStream = null;
    }
  }

  function closeCameraModal() {
    stopCameraStream();
    window.closeModal();
  }
  window.closeCameraModal = closeCameraModal;

  function toggleCameraMirror() {
    state.isCameraMirrored = !state.isCameraMirrored;
    const video = document.getElementById('camera-stream-video');
    if (video) {
      video.style.transform = state.isCameraMirrored ? 'scaleX(-1)' : 'scaleX(1)';
    }
  }
  window.toggleCameraMirror = toggleCameraMirror;

  function switchCameraDevice() {
    state.cameraFacingMode = state.cameraFacingMode === 'user' ? 'environment' : 'user';
    startCameraStream();
  }
  window.switchCameraDevice = switchCameraDevice;

  function takeCameraSnapshot() {
    const video = document.getElementById('camera-stream-video');
    const canvas = document.getElementById('camera-capture-canvas');
    const preview = document.getElementById('camera-snapshot-preview');
    const flash = document.getElementById('camera-flash-overlay');
    const liveControls = document.getElementById('camera-live-controls');
    const reviewControls = document.getElementById('camera-review-controls');
    const liveBadge = document.getElementById('camera-live-badge');

    if (!video || !canvas) return;

    // Flash animation
    if (flash) {
      flash.style.opacity = '1';
      setTimeout(() => { flash.style.opacity = '0'; }, 150);
    }

    const w = video.videoWidth || 640;
    const h = video.videoHeight || 480;
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');

    if (state.isCameraMirrored) {
      ctx.translate(w, 0);
      ctx.scale(-1, 1);
    }
    ctx.drawImage(video, 0, 0, w, h);

    const snapshotData = canvas.toDataURL('image/jpeg', 0.92);
    state.capturedSnapshotData = snapshotData;

    if (preview) {
      preview.src = snapshotData;
      preview.classList.remove('hidden');
    }
    video.classList.add('hidden');

    if (liveControls) liveControls.classList.add('hidden');
    if (reviewControls) reviewControls.classList.remove('hidden');
    if (liveBadge) liveBadge.classList.add('hidden');
  }
  window.takeCameraSnapshot = takeCameraSnapshot;

  function retakeCameraSnapshot() {
    const video = document.getElementById('camera-stream-video');
    const preview = document.getElementById('camera-snapshot-preview');
    const liveControls = document.getElementById('camera-live-controls');
    const reviewControls = document.getElementById('camera-review-controls');
    const liveBadge = document.getElementById('camera-live-badge');

    if (preview) preview.classList.add('hidden');
    if (video) video.classList.remove('hidden');
    if (liveControls) liveControls.classList.remove('hidden');
    if (reviewControls) reviewControls.classList.add('hidden');
    if (liveBadge) liveBadge.classList.remove('hidden');
    state.capturedSnapshotData = null;
  }
  window.retakeCameraSnapshot = retakeCameraSnapshot;

  function applyCameraAvatar() {
    if (!state.capturedSnapshotData) return;

    state.customAvatar = state.capturedSnapshotData;
    localStorage.setItem('codertech_custom_avatar', state.customAvatar);

    if (state.currentUser) {
      state.currentUser.avatar = state.customAvatar;
      localStorage.setItem('codertech_user', JSON.stringify(state.currentUser));
    }

    initProfile();
    renderUserProfileView();
    updateNavbarAuthState();
    closeCameraModal();
    showToast('Live camera photo applied as avatar! 📸');
  }
  window.applyCameraAvatar = applyCameraAvatar;

  function handleAvatarFileInput(e) {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      showToast('File size must be under 5MB', 'info');
      return;
    }

    const reader = new FileReader();
    reader.onload = function (event) {
      const dataUrl = event.target.result;
      state.customAvatar = dataUrl;
      localStorage.setItem('codertech_custom_avatar', dataUrl);

      if (state.currentUser) {
        state.currentUser.avatar = dataUrl;
        localStorage.setItem('codertech_user', JSON.stringify(state.currentUser));
      }

      initProfile();
      renderUserProfileView();
      updateNavbarAuthState();
      showToast('Avatar uploaded successfully! 🚀');
    };
    reader.readAsDataURL(file);
  }
  window.handleAvatarFileInput = handleAvatarFileInput;

})();
