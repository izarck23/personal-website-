import React from 'react';
import { Sparkles, ArrowRight, Heart, Code, Terminal, Palette, Coffee, Laptop, Star, UserPlus } from 'lucide-react';
import { ProfileConfig } from '../types';
import defaultHeroCreatorImg from '../assets/images/hero_tech_creator_1787669566326.jpg';

interface HeroSectionProps {
  profile: ProfileConfig;
  onViewWork: () => void;
  onAboutMe: () => void;
  onOpenPhotoSettings: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  profile,
  onViewWork,
  onAboutMe,
  onOpenPhotoSettings,
}) => {
  // Use custom uploaded image if available, else generated hero creator illustration
  const heroImageSrc = profile.customHeroPhoto || defaultHeroCreatorImg;

  return (
    <section
      id="home"
      className="relative pt-28 pb-16 md:pt-36 md:pb-24 overflow-hidden bg-gradient-to-b from-[#FFF8F3] via-[#FEF3EC] to-[#F5EEFB]"
    >
      {/* Background Decorative Sparkles & Blobs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-[#FF7675]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-40 right-10 w-96 h-96 bg-[#A29BFE]/15 rounded-full blur-3xl pointer-events-none" />

      {/* Floating Sparkle Elements */}
      <div className="absolute top-24 left-1/4 text-[#FF7675] opacity-60 animate-pulse-subtle hidden md:block">
        <Sparkles className="w-5 h-5" />
      </div>
      <div className="absolute top-1/3 left-12 text-[#6C5CE7] opacity-40 animate-float hidden lg:block">
        <Star className="w-6 h-6 fill-current" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Copy & CTAs */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            
            {/* Top Pill Badge */}
            <div
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FFEAE6] text-[#E76F51] text-xs sm:text-sm font-semibold tracking-wide border border-[#FFD3C9] shadow-2xs mb-6 hover:scale-105 transition-transform"
              id="hero-tag-badge"
            >
              <span>{profile.heroBadge}</span>
            </div>

            {/* Main Headline */}
            <div className="relative mb-6">
              {/* Cute line accents */}
              <div className="absolute -left-6 top-1 text-[#FF7675] hidden sm:block">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4 8L8 4M2 14L8 12M5 19L9 16" stroke="#FF7675" strokeWidth="2.5" strokeLinecap="round"/>
                </svg>
              </div>

              <h1 className="font-serif-display text-4xl sm:text-5xl md:text-6xl lg:text-[62px] leading-[1.12] text-stone-900 tracking-tight">
                {profile.heroHeadline}{' '}
                <span className="text-[#8B7EFF] italic relative inline-block">
                  {profile.heroHeadlineAccent.split(' ')[0] || 'people'}
                </span>{' '}
                <span className="text-[#FF7675] relative inline-block">
                  {profile.heroHeadlineAccent.split(' ').slice(1).join(' ') || 'love.'}
                  <svg className="absolute -bottom-2 left-0 w-full" height="8" viewBox="0 0 100 8" preserveAspectRatio="none">
                    <path d="M0 5 Q 25 1, 50 5 T 100 5" fill="none" stroke="#FF7675" strokeWidth="3" strokeLinecap="round" />
                  </svg>
                </span>
              </h1>
            </div>

            {/* Subtitle Bio */}
            <p className="text-base sm:text-lg text-stone-600 max-w-xl leading-relaxed mb-8 font-normal">
              {profile.heroBio}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-4">
              <button
                onClick={onViewWork}
                className="inline-flex items-center gap-3 px-7 py-3.5 text-sm sm:text-base font-bold text-white bg-gradient-to-r from-[#FF7675] to-[#FF8E8D] hover:from-[#e86362] hover:to-[#ff7b7a] rounded-full shadow-glow-coral hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer group"
                id="btn-hero-view-work"
              >
                <span>View My Work</span>
                <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center group-hover:translate-x-1 transition-transform">
                  ➔
                </span>
              </button>

              <button
                onClick={onAboutMe}
                className="inline-flex flex-col items-center justify-center px-7 py-3.5 text-sm sm:text-base font-bold text-stone-800 bg-white/80 hover:bg-white border border-stone-200 hover:border-stone-300 rounded-full shadow-xs hover:shadow-md transition-all cursor-pointer relative"
                id="btn-hero-about-me"
              >
                <span>About Me</span>
                <span className="text-[#8B7EFF] text-xs -mt-1 font-bold">〰〰</span>
              </button>
            </div>

            {/* Quick Tech Stack Badges */}
            <div className="mt-10 pt-6 border-t border-stone-200/60 w-full max-w-lg flex items-center gap-4 flex-wrap">
              <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">Tech Focus:</span>
              {['TypeScript', 'React 19', 'Next.js', 'Node/Express', 'AI & Monetization'].map((tech) => (
                <span
                  key={tech}
                  className="text-xs px-2.5 py-1 rounded-md bg-white/70 text-stone-700 border border-stone-200/70 font-medium"
                >
                  {tech}
                </span>
              ))}
            </div>

          </div>

          {/* Right Column: Hero Illustration & Interactive Photo Switcher */}
          <div className="lg:col-span-5 relative flex justify-center">
            
            {/* Background Blob Card */}
            <div className="relative w-full max-w-[440px] aspect-square rounded-[36px] bg-gradient-to-tr from-[#FFEADB] via-[#FCE4EC] to-[#EDE7F6] p-4 shadow-card border border-white/80 flex items-center justify-center">
              
              {/* Top Floating Browser Window Widget */}
              <div className="absolute -top-6 -right-4 sm:-right-6 bg-white rounded-2xl p-3 shadow-lg border border-purple-100 flex items-center gap-3 animate-float z-20">
                <div className="flex gap-1">
                  <div className="w-2.5 h-2.5 rounded-full bg-rose-400" />
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                </div>
                <div className="text-[11px] font-mono font-semibold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md flex items-center gap-1">
                  <Terminal className="w-3 h-3 text-purple-600" />
                  <span>codertech.dev</span>
                </div>
              </div>

              {/* Top Left Heart Bubble */}
              <div className="absolute top-4 -left-4 bg-white p-2.5 rounded-2xl shadow-md border border-rose-100 flex items-center justify-center animate-pulse-subtle z-20">
                <Heart className="w-5 h-5 text-[#FF7675] fill-current" />
              </div>

              {/* Main Avatar / Illustration Container */}
              <div className="relative w-full h-full rounded-[28px] overflow-hidden bg-white/40 backdrop-blur-xs border border-white/60 group">
                <img
                  src={heroImageSrc}
                  alt={`${profile.creatorName} - ${profile.brandName}`}
                  className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                  decoding="async"
                  fetchPriority="high"
                  onError={(e) => {
                    const target = e.currentTarget;
                    if (target.src !== defaultHeroCreatorImg) {
                      target.src = defaultHeroCreatorImg;
                    }
                  }}
                />

                {/* Hover overlay to change image */}
                <div className="absolute inset-0 bg-stone-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-4 text-center">
                  <p className="text-white text-xs font-semibold">Customize Profile Photo</p>
                  <button
                    onClick={onOpenPhotoSettings}
                    className="px-3.5 py-1.5 bg-white text-stone-800 text-xs font-bold rounded-full shadow-md hover:bg-stone-100 transition-all flex items-center gap-1.5"
                  >
                    <UserPlus className="w-3.5 h-3.5 text-[#6C5CE7]" />
                    <span>Upload / Set Photo</span>
                  </button>
                </div>
              </div>

              {/* Floating Swatch Tokens */}
              <div className="absolute -bottom-5 -left-4 bg-white/95 backdrop-blur-md rounded-2xl p-2.5 shadow-lg border border-stone-200/80 flex items-center gap-2 z-20">
                <div className="w-6 h-6 rounded-lg bg-[#FF7675]" title="Coral Accent" />
                <div className="w-6 h-6 rounded-lg bg-[#6C5CE7]" title="Lavender Indigo" />
                <div className="w-6 h-6 rounded-lg bg-[#FFEAA7]" title="Warm Peach" />
                <span className="text-[11px] font-bold text-stone-600 ml-1">#codertech</span>
              </div>

              {/* Bottom Right Coffee Mug Card */}
              <div className="absolute -bottom-4 -right-4 bg-white/95 backdrop-blur-md rounded-2xl p-2.5 shadow-lg border border-stone-200/80 flex items-center gap-2 z-20">
                <div className="w-7 h-7 rounded-xl bg-orange-50 flex items-center justify-center text-orange-500">
                  <Coffee className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <div className="text-[10px] font-bold text-stone-400 uppercase">Building</div>
                  <div className="text-xs font-bold text-stone-800">Clean Code ☕</div>
                </div>
              </div>

            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
