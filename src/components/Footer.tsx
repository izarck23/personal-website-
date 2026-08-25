import React, { useState } from 'react';
import { Sparkles, Github, Twitter, Linkedin, Youtube, Send, ArrowRight, Heart, Globe, Check } from 'lucide-react';
import { ProfileConfig } from '../types';

interface FooterProps {
  profile: ProfileConfig;
  onOpenContact: () => void;
  onNavigate?: (view: 'home' | 'blog-list' | 'projects-list', targetSectionId?: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ profile, onOpenContact, onNavigate }) => {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) return;
    setSubscribed(true);
    setTimeout(() => {
      setSubscribed(false);
      setNewsletterEmail('');
    }, 4000);
  };

  const handleLinkClick = (view: 'home' | 'blog-list' | 'projects-list', targetId?: string) => {
    if (onNavigate) {
      onNavigate(view, targetId);
    } else if (targetId) {
      const el = document.getElementById(targetId);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-gradient-to-b from-[#FFF8F3] via-[#FAF5FF] to-[#F1EBF9] text-stone-700 pt-20 pb-12 border-t border-stone-200/70 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main 4-Column Layout matching template */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 pb-16 border-b border-stone-200/80">
          
          {/* Col 1: Brand & Socials (4 Cols) */}
          <div className="lg:col-span-4 flex flex-col justify-between">
            <div>
              {/* Brand Logo */}
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#6C5CE7] to-[#A29BFE] flex items-center justify-center text-white shadow-xs">
                  <Sparkles className="w-4 h-4" />
                </div>
                <span className="font-serif-display text-2xl font-bold text-stone-900 tracking-tight">
                  {profile.brandName}
                </span>
              </div>

              <p className="text-xs sm:text-sm text-stone-600 max-w-sm leading-relaxed mb-6">
                Building scalable web apps, developer tools, and online monetization resources that empower creators and founders.
              </p>
            </div>

            {/* Social Icons */}
            <div className="flex items-center flex-wrap gap-2.5">
              {[
                { icon: <Github className="w-4 h-4" />, href: profile.github, label: 'GitHub', color: 'hover:text-stone-900' },
                { icon: <Twitter className="w-4 h-4" />, href: profile.twitter, label: 'X / Twitter', color: 'hover:text-[#1DA1F2]' },
                { icon: <Linkedin className="w-4 h-4" />, href: profile.linkedin, label: 'LinkedIn', color: 'hover:text-[#0A66C2]' },
                { icon: <Youtube className="w-4 h-4" />, href: profile.youtube, label: 'YouTube', color: 'hover:text-[#FF0000]' },
              ].map((item, idx) => (
                <a
                  key={idx}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={item.label}
                  className={`w-9 h-9 rounded-full bg-white border border-stone-200 text-stone-600 ${item.color} hover:border-purple-300 hover:scale-110 flex items-center justify-center shadow-2xs transition-all`}
                >
                  {item.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Col 2: Explore Navigation (2 Cols) */}
          <div className="lg:col-span-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-900 mb-4">
              Explore
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm text-stone-600">
              <li>
                <button onClick={() => handleLinkClick('home', 'home')} className="hover:text-[#6C5CE7] transition-colors cursor-pointer">
                  Home
                </button>
              </li>
              <li>
                <button onClick={() => handleLinkClick('projects-list')} className="hover:text-[#6C5CE7] transition-colors cursor-pointer">
                  Portfolio & Projects
                </button>
              </li>
              <li>
                <button onClick={() => handleLinkClick('home', 'services')} className="hover:text-[#6C5CE7] transition-colors cursor-pointer">
                  Services
                </button>
              </li>
              <li>
                <button onClick={() => handleLinkClick('home', 'process')} className="hover:text-[#6C5CE7] transition-colors cursor-pointer">
                  About & Process
                </button>
              </li>
              <li>
                <button onClick={() => handleLinkClick('blog-list')} className="hover:text-[#6C5CE7] transition-colors cursor-pointer">
                  Blog & Articles
                </button>
              </li>
              <li>
                <button onClick={() => handleLinkClick('home', 'social')} className="hover:text-[#6C5CE7] transition-colors cursor-pointer">
                  Social Presence
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Information & Links (2 Cols) */}
          <div className="lg:col-span-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-900 mb-4">
              Information
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm text-stone-600">
              <li>
                <button onClick={() => handleLinkClick('home', 'process')} className="hover:text-[#6C5CE7] transition-colors cursor-pointer">
                  Tech Process
                </button>
              </li>
              <li>
                <button onClick={() => handleLinkClick('home', 'testimonials')} className="hover:text-[#6C5CE7] transition-colors cursor-pointer">
                  Testimonials
                </button>
              </li>
              <li>
                <button onClick={() => handleLinkClick('home', 'faq')} className="hover:text-[#6C5CE7] transition-colors cursor-pointer">
                  FAQ
                </button>
              </li>
              <li>
                <button onClick={onOpenContact} className="hover:text-[#6C5CE7] transition-colors font-medium cursor-pointer">
                  Contact & Inquiries
                </button>
              </li>
              <li>
                <button onClick={() => handleLinkClick('home', 'monetize')} className="hover:text-[#6C5CE7] transition-colors cursor-pointer">
                  Monetization Hub
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Stay in the loop Newsletter (4 Cols) */}
          <div className="lg:col-span-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-900 mb-2">
              Stay in the loop
            </h4>
            <p className="text-xs text-stone-600 leading-relaxed mb-4">
              Get my latest coding tutorials, tech updates, and monetization guides straight to your inbox.
            </p>

            {subscribed ? (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-full text-emerald-700 text-xs font-bold flex items-center justify-center gap-2 animate-fadeIn">
                <Check className="w-4 h-4" />
                <span>You're subscribed! Welcome aboard 🎉</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="relative flex items-center">
                <input
                  type="email"
                  required
                  placeholder="you@email.com"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  className="w-full pl-4 pr-12 py-3 bg-white text-xs sm:text-sm text-stone-800 rounded-full border border-stone-200 focus:outline-none focus:border-[#FF7675] shadow-xs"
                />
                <button
                  type="submit"
                  className="absolute right-1.5 w-9 h-9 rounded-full bg-[#FF7675] hover:bg-[#e7605f] text-white flex items-center justify-center shadow-md transition-all hover:scale-105 active:scale-95 cursor-pointer"
                  aria-label="Subscribe"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}
          </div>

        </div>

        {/* Bottom Footer Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500 gap-4">
          <div>
            © {new Date().getFullYear()} {profile.brandName}. All rights reserved.
          </div>

          <div className="flex items-center gap-1">
            <span>Designed with</span>
            <Heart className="w-3.5 h-3.5 text-[#FF7675] fill-current inline" />
            <span>by {profile.brandName}</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
