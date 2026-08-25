import React, { useState, useEffect } from 'react';
import { Sparkles, Send, Menu, X, Image as ImageIcon, BookOpen, Layers, Briefcase, MessageSquare, DollarSign, Search } from 'lucide-react';
import { ProfileConfig } from '../types';

interface NavbarProps {
  profile: ProfileConfig;
  onOpenContact: () => void;
  onOpenPhotoSettings: () => void;
  onOpenSearch?: () => void;
  activeSection: string;
  currentView?: 'home' | 'blog-list' | 'blog-post' | 'projects-list';
  onNavigate?: (view: 'home' | 'blog-list' | 'projects-list', targetSectionId?: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  profile,
  onOpenContact,
  onOpenPhotoSettings,
  onOpenSearch,
  activeSection,
  currentView = 'home',
  onNavigate,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '#home', id: 'home', view: 'home' as const },
    { name: 'Projects', href: '#projects', id: 'projects', view: 'projects-list' as const },
    { name: 'Services', href: '#services', id: 'services', view: 'home' as const },
    { name: 'Process', href: '#process', id: 'process', view: 'home' as const },
    { name: 'Blog', href: '#blog', id: 'blog', view: 'blog-list' as const },
    { name: 'Socials', href: '#social', id: 'social', view: 'home' as const },
    { name: 'Monetize', href: '#monetize', id: 'monetize', view: 'home' as const },
  ];

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    item: { href: string; id: string; view?: 'home' | 'blog-list' | 'projects-list'; name?: string }
  ) => {
    e.preventDefault();
    setMobileMenuOpen(false);

    if (onNavigate) {
      if (item.id === 'blog') {
        onNavigate('blog-list');
        return;
      }
      if (item.id === 'projects' && currentView !== 'home') {
        onNavigate('projects-list');
        return;
      }
      if (currentView !== 'home') {
        onNavigate('home', item.id);
        return;
      }
    }

    const target = document.querySelector(item.href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header
      id="main-navbar"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#FFF8F3]/90 backdrop-blur-md shadow-xs py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <a
            href="#home"
            onClick={(e) => handleNavClick(e, { name: 'Home', href: '#home', id: 'home', view: 'home' })}
            className="flex items-center gap-2 group cursor-pointer"
            id="brand-logo-link"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#6C5CE7] to-[#A29BFE] flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform">
              <Sparkles className="w-4 h-4" />
            </div>
            <span className="font-serif-display text-2xl font-bold tracking-tight text-stone-900 group-hover:text-[#6C5CE7] transition-colors">
              {profile.brandName}
            </span>
          </a>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-8" id="desktop-navigation">
            {navLinks.map((link) => {
              const isActive = activeSection === link.id;
              return (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link)}
                  className={`text-sm font-medium transition-colors relative py-1 ${
                    isActive
                      ? 'text-stone-900 font-semibold'
                      : 'text-stone-600 hover:text-[#6C5CE7]'
                  }`}
                  id={`nav-link-${link.id}`}
                >
                  {link.name}
                  {isActive && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-[#FF7675] rounded-full" />
                  )}
                </a>
              );
            })}
          </nav>

          {/* Action Buttons */}
          <div className="hidden sm:flex items-center gap-3">
            {/* Global Search Quick Trigger */}
            <button
              onClick={onOpenSearch}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 text-xs font-medium text-stone-700 bg-white/90 hover:bg-white rounded-full border border-stone-200 shadow-xs hover:border-[#6C5CE7] hover:shadow-soft transition-all cursor-pointer group"
              title="Search projects, articles, and tech (⌘K or Ctrl+K)"
              id="btn-nav-global-search"
            >
              <Search className="w-3.5 h-3.5 text-[#6C5CE7] group-hover:scale-110 transition-transform" />
              <span className="text-stone-500 group-hover:text-stone-800">Search</span>
              <kbd className="hidden lg:inline-flex items-center px-1.5 py-0.5 text-[10px] font-mono text-stone-500 bg-stone-100 rounded border border-stone-200">
                ⌘K
              </kbd>
            </button>

            <button
              onClick={onOpenPhotoSettings}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-stone-600 bg-white/80 hover:bg-white rounded-full border border-stone-200 shadow-xs hover:border-[#A29BFE] transition-all"
              title="Set custom hero photo / brand details"
              id="btn-photo-customizer"
            >
              <ImageIcon className="w-3.5 h-3.5 text-[#6C5CE7]" />
              <span>Customize Photo</span>
            </button>

            <button
              onClick={onOpenContact}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-[#FF7675] to-[#FF8E8D] hover:from-[#e7605f] hover:to-[#ff7b7a] rounded-full shadow-glow-coral hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer"
              id="btn-nav-lets-talk"
            >
              <span>Let's Talk</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex items-center gap-2 md:hidden">
            {onOpenSearch && (
              <button
                onClick={onOpenSearch}
                className="p-2 text-stone-700 bg-white border border-stone-200 rounded-full shadow-xs hover:bg-stone-50"
                title="Search projects & blog"
                id="btn-mobile-search-trigger"
              >
                <Search className="w-4 h-4 text-[#6C5CE7]" />
              </button>
            )}
            <button
              onClick={onOpenContact}
              className="p-2 text-white bg-[#FF7675] rounded-full shadow-xs"
              title="Let's talk"
            >
              <Send className="w-4 h-4" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-stone-700 hover:bg-stone-100 transition-colors"
              aria-label="Toggle menu"
              id="btn-mobile-menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#FFF8F3]/98 border-b border-stone-200 px-6 py-5 shadow-lg backdrop-blur-md animate-fadeIn">
          {/* Quick Search in Mobile Menu */}
          {onOpenSearch && (
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenSearch();
              }}
              className="w-full mb-3 py-2.5 px-4 bg-white rounded-xl border border-stone-200 shadow-xs flex items-center justify-between text-stone-600 text-sm"
              id="btn-mobile-drawer-search"
            >
              <div className="flex items-center gap-2.5">
                <Search className="w-4 h-4 text-[#6C5CE7]" />
                <span>Search projects & articles...</span>
              </div>
              <span className="text-[11px] bg-stone-100 text-stone-500 px-2 py-0.5 rounded font-mono">
                ⌘K
              </span>
            </button>
          )}

          <div className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => handleNavClick(e, link)}
                className="flex items-center justify-between text-base font-medium text-stone-800 hover:text-[#6C5CE7] py-2 border-b border-stone-100"
              >
                <span>{link.name}</span>
                <span className="text-xs text-stone-400">➔</span>
              </a>
            ))}
            <div className="pt-2 flex flex-col gap-3">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenPhotoSettings();
                }}
                className="w-full py-2.5 px-4 text-sm font-medium text-stone-700 bg-white rounded-xl border border-stone-200 flex items-center justify-center gap-2"
              >
                <ImageIcon className="w-4 h-4 text-[#6C5CE7]" />
                <span>Customize Hero Image</span>
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenContact();
                }}
                className="w-full py-3 px-4 text-sm font-semibold text-white bg-gradient-to-r from-[#FF7675] to-[#FF8E8D] rounded-xl flex items-center justify-center gap-2 shadow-glow-coral"
              >
                <span>Let's Talk</span>
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
