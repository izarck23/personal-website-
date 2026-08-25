import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { FeaturedProjects } from './components/FeaturedProjects';
import { ProcessSection } from './components/ProcessSection';
import { ServicesSection } from './components/ServicesSection';
import { TestimonialsSection } from './components/TestimonialsSection';
import { CTAAndFAQSection } from './components/CTAAndFAQSection';
import { BlogSection } from './components/BlogSection';
import { SocialMediaSection } from './components/SocialMediaSection';
import { MonetizationHub } from './components/MonetizationHub';
import { Footer } from './components/Footer';

// Dedicated Full-Page Components
import { BlogListPage } from './components/BlogListPage';
import { BlogPostPage } from './components/BlogPostPage';
import { ProjectsPage } from './components/ProjectsPage';

// Modals
import { ProjectModal } from './components/Modals/ProjectModal';
import { BlogModal } from './components/Modals/BlogModal';
import { ContactModal } from './components/Modals/ContactModal';
import { ServiceModal } from './components/Modals/ServiceModal';
import { PhotoSettingsModal } from './components/Modals/PhotoSettingsModal';
import { GlobalSearchModal } from './components/Modals/GlobalSearchModal';

// Data
import {
  initialProfileConfig,
  projectsData,
  processStepsData,
  servicesData,
  testimonialsData,
  faqData,
  blogPostsData,
  monetizationProductsData,
} from './data/portfolioData';
import { Project, ServiceItem, BlogPost, ProfileConfig } from './types';

type AppView = 'home' | 'blog-list' | 'blog-post' | 'projects-list';

export default function App() {
  const [profile, setProfile] = useState<ProfileConfig>(() => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const saved = localStorage.getItem('codertech_profile');
        if (saved) {
          return { ...initialProfileConfig, ...JSON.parse(saved) };
        }
      }
    } catch (e) {
      console.warn('Could not read saved profile from localStorage:', e);
    }
    return initialProfileConfig;
  });

  const [currentView, setCurrentView] = useState<AppView>('home');
  const [activeBlogSlug, setActiveBlogSlug] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState('home');

  // Modal States
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [selectedBlog, setSelectedBlog] = useState<BlogPost | null>(null);
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [contactInitialTopic, setContactInitialTopic] = useState('');
  const [photoSettingsOpen, setPhotoSettingsOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);

  // Global Keyboard Shortcut for Search (⌘K / Ctrl+K / '/')
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      // Check for Cmd+K / Ctrl+K
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchModalOpen((prev) => !prev);
        return;
      }

      // Check for '/' when not in an input/textarea
      if (e.key === '/' && !searchModalOpen) {
        const target = e.target as HTMLElement;
        if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)) {
          return;
        }
        e.preventDefault();
        setSearchModalOpen(true);
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [searchModalOpen]);

  // Parse URL hash for clean SPA routing
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash.startsWith('#/blog/')) {
        const slug = hash.replace('#/blog/', '');
        const post = blogPostsData.find((p) => p.slug === slug || p.id === slug);
        if (post) {
          setActiveBlogSlug(post.slug);
          setCurrentView('blog-post');
          window.scrollTo({ top: 0, behavior: 'smooth' });
          return;
        }
      }

      if (hash === '#/blog' || hash === '#blog-list') {
        setCurrentView('blog-list');
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }

      if (hash === '#/projects' || hash === '#projects-list') {
        setCurrentView('projects-list');
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }

      // Default or internal section anchor
      setCurrentView('home');
      if (hash && !hash.startsWith('#/')) {
        const sectionId = hash.replace('#', '');
        const el = document.getElementById(sectionId);
        if (el) {
          setTimeout(() => el.scrollIntoView({ behavior: 'smooth' }), 100);
        }
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Active section detector on scroll when on home view
  useEffect(() => {
    if (currentView !== 'home') return;

    const sections = ['home', 'projects', 'services', 'process', 'social', 'blog', 'monetize', 'faq'];
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 200;
      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [currentView]);

  const handleUpdateProfile = (updated: Partial<ProfileConfig>) => {
    setProfile((prev) => {
      const next = { ...prev, ...updated };
      try {
        if (typeof window !== 'undefined' && window.localStorage) {
          localStorage.setItem('codertech_profile', JSON.stringify(next));
        }
      } catch (e) {
        console.warn('Could not save profile to localStorage:', e);
      }
      return next;
    });
  };

  const handleOpenContactWithTopic = (topic?: string) => {
    setContactInitialTopic(topic || '');
    setContactModalOpen(true);
  };

  const navigateTo = (view: AppView, targetSectionId?: string) => {
    setCurrentView(view);
    if (view === 'home') {
      window.location.hash = targetSectionId ? `#${targetSectionId}` : '#home';
      if (targetSectionId) {
        setTimeout(() => {
          const el = document.getElementById(targetSectionId);
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } else if (view === 'blog-list') {
      window.location.hash = '#/blog';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (view === 'projects-list') {
      window.location.hash = '#/projects';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSelectBlogPost = (post: BlogPost) => {
    setActiveBlogSlug(post.slug);
    setCurrentView('blog-post');
    window.location.hash = `#/blog/${post.slug}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const activePost = blogPostsData.find((p) => p.slug === activeBlogSlug) || blogPostsData[0];

  return (
    <div className="min-h-screen bg-[#FFF8F3] text-stone-800 selection:bg-[#ff7675]/20 selection:text-[#e76f51] relative flex flex-col justify-between">
      
      {/* Top Fixed Navbar */}
      <Navbar
        profile={profile}
        onOpenContact={() => handleOpenContactWithTopic()}
        onOpenPhotoSettings={() => setPhotoSettingsOpen(true)}
        onOpenSearch={() => setSearchModalOpen(true)}
        activeSection={activeSection}
        currentView={currentView}
        onNavigate={navigateTo}
      />

      {/* Main View Switcher */}
      <main className="flex-1">
        {currentView === 'home' && (
          <>
            {/* Hero Section */}
            <HeroSection
              profile={profile}
              onViewWork={() => {
                const el = document.getElementById('projects');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              onAboutMe={() => {
                const el = document.getElementById('process');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              onOpenPhotoSettings={() => setPhotoSettingsOpen(true)}
            />

            {/* Featured Projects with Carousel + Explore All Button */}
            <FeaturedProjects
              projects={projectsData}
              onSelectProject={(proj) => setSelectedProject(proj)}
              onViewAllProjects={() => navigateTo('projects-list')}
            />

            {/* Process Section */}
            <ProcessSection steps={processStepsData} />

            {/* Services Section */}
            <ServicesSection
              services={servicesData}
              onSelectService={(serv) => setSelectedService(serv)}
            />

            {/* Testimonials Section */}
            <TestimonialsSection testimonials={testimonialsData} />

            {/* Dedicated Social Media Section */}
            <SocialMediaSection
              profile={profile}
              onOpenContact={() => handleOpenContactWithTopic('Social Network Collaboration')}
            />

            {/* CTA & Quick Questions FAQ Banner */}
            <CTAAndFAQSection
              faqs={faqData}
              onOpenContact={() => handleOpenContactWithTopic()}
            />

            {/* Blog & Tech Journey Articles (Homepage preview + View All link) */}
            <BlogSection
              posts={blogPostsData}
              onSelectPost={handleSelectBlogPost}
              onViewAllArticles={() => navigateTo('blog-list')}
            />

            {/* Monetization & Digital Products Toolkit */}
            <MonetizationHub
              products={monetizationProductsData}
              onOpenContact={handleOpenContactWithTopic}
            />
          </>
        )}

        {/* Dedicated Full Blog Listing View */}
        {currentView === 'blog-list' && (
          <BlogListPage
            posts={blogPostsData}
            profile={profile}
            projects={projectsData}
            onSelectPost={handleSelectBlogPost}
            onNavigateHome={() => navigateTo('home')}
            onOpenGlobalSearch={() => setSearchModalOpen(true)}
            onSelectProject={(proj) => setSelectedProject(proj)}
          />
        )}

        {/* Dedicated Single Blog Post Reader View */}
        {currentView === 'blog-post' && (
          <BlogPostPage
            post={activePost}
            allPosts={blogPostsData}
            profile={profile}
            onBackToBlogList={() => navigateTo('blog-list')}
            onSelectPost={handleSelectBlogPost}
            onOpenContact={() => handleOpenContactWithTopic(`Discussion regarding: ${activePost.title}`)}
          />
        )}

        {/* Dedicated Portfolio & Projects View */}
        {currentView === 'projects-list' && (
          <ProjectsPage
            projects={projectsData}
            profile={profile}
            posts={blogPostsData}
            onSelectProject={(proj) => setSelectedProject(proj)}
            onNavigateHome={() => navigateTo('home')}
            onOpenContact={handleOpenContactWithTopic}
            onOpenGlobalSearch={() => setSearchModalOpen(true)}
            onSelectBlog={handleSelectBlogPost}
          />
        )}
      </main>

      {/* Global Footer */}
      <Footer
        profile={profile}
        onOpenContact={() => handleOpenContactWithTopic()}
        onNavigate={navigateTo}
      />

      {/* Interactive Modals */}
      <GlobalSearchModal
        isOpen={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
        projects={projectsData}
        posts={blogPostsData}
        services={servicesData}
        profile={profile}
        onSelectProject={(proj) => setSelectedProject(proj)}
        onSelectBlog={handleSelectBlogPost}
        onSelectService={(serv) => setSelectedService(serv)}
        onNavigateToView={navigateTo}
      />

      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />

      <BlogModal
        post={selectedBlog}
        onClose={() => setSelectedBlog(null)}
      />

      <ServiceModal
        service={selectedService}
        onClose={() => setSelectedService(null)}
        onInquire={(serviceTitle) => handleOpenContactWithTopic(serviceTitle)}
      />

      <ContactModal
        isOpen={contactModalOpen}
        onClose={() => setContactModalOpen(false)}
        profile={profile}
        initialTopic={contactInitialTopic}
      />

      <PhotoSettingsModal
        isOpen={photoSettingsOpen}
        onClose={() => setPhotoSettingsOpen(false)}
        profile={profile}
        onUpdateProfile={handleUpdateProfile}
      />

    </div>
  );
}
