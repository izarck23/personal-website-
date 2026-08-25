import React, { useState } from 'react';
import { Sparkles, ChevronLeft, ChevronRight, ArrowRight, ExternalLink, Github, Smartphone, Layout, Laptop, BarChart3, Code2 } from 'lucide-react';
import { Project } from '../types';

interface FeaturedProjectsProps {
  projects: Project[];
  onSelectProject: (project: Project) => void;
  onViewAllProjects?: () => void;
}

export const FeaturedProjects: React.FC<FeaturedProjectsProps> = ({
  projects,
  onSelectProject,
  onViewAllProjects,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // For responsive viewing, let's allow sliding or navigating
  const maxIndex = Math.max(0, projects.length - 3);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  };

  // Helper for device visual representation in card top
  const renderCardMockup = (project: Project) => {
    if (project.category === 'mobile') {
      return (
        <div className="w-full h-44 bg-gradient-to-br from-rose-50 via-peach-50 to-orange-50 rounded-2xl flex items-center justify-center p-3 relative overflow-hidden group-hover:scale-[1.02] transition-transform duration-300">
          <div className="flex gap-2 items-center justify-center">
            {/* Phone 1 */}
            <div className="w-20 h-36 bg-white rounded-xl shadow-md border-2 border-stone-100 p-1.5 flex flex-col justify-between">
              <div className="w-6 h-1 bg-stone-200 rounded-full mx-auto" />
              <div className="w-full h-20 bg-emerald-50 rounded-lg flex flex-col items-center justify-center p-1">
                <span className="text-xl">🌿</span>
                <span className="text-[8px] font-bold text-emerald-800 mt-1">Fiora Live</span>
              </div>
              <div className="w-full h-3 bg-rose-100 rounded-md" />
            </div>
            {/* Phone 2 */}
            <div className="w-24 h-40 bg-white rounded-2xl shadow-lg border-2 border-stone-200 p-1.5 flex flex-col justify-between -translate-y-1">
              <div className="w-8 h-1 bg-stone-300 rounded-full mx-auto" />
              <div className="space-y-1 my-auto">
                <div className="text-[9px] font-bold text-stone-800 text-center">Soil Moisture</div>
                <div className="w-full h-10 bg-gradient-to-r from-emerald-100 to-teal-100 rounded-lg flex items-center justify-center text-xs font-bold text-teal-800">
                  84% Optimal
                </div>
                <div className="w-full h-2 bg-stone-100 rounded-full" />
              </div>
              <div className="w-6 h-1 bg-stone-300 rounded-full mx-auto" />
            </div>
          </div>
        </div>
      );
    }

    if (project.category === 'web') {
      return (
        <div className="w-full h-44 bg-gradient-to-br from-purple-50 via-indigo-50 to-purple-100 rounded-2xl p-3 flex flex-col justify-between relative overflow-hidden group-hover:scale-[1.02] transition-transform duration-300">
          <div className="flex items-center justify-between border-b border-purple-200/50 pb-2">
            <div className="flex gap-1">
              <div className="w-2 h-2 rounded-full bg-rose-400" />
              <div className="w-2 h-2 rounded-full bg-amber-400" />
              <div className="w-2 h-2 rounded-full bg-emerald-400" />
            </div>
            <div className="text-[9px] font-mono text-purple-700 bg-white px-2 py-0.5 rounded shadow-2xs">
              $120,450 MRR
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2 my-auto">
            <div className="bg-white/80 backdrop-blur-xs p-2 rounded-lg text-center shadow-2xs">
              <div className="text-[8px] text-stone-400">Users</div>
              <div className="text-xs font-bold text-purple-700">45.2K</div>
            </div>
            <div className="bg-white/80 backdrop-blur-xs p-2 rounded-lg text-center shadow-2xs">
              <div className="text-[8px] text-stone-400">Growth</div>
              <div className="text-xs font-bold text-emerald-600">+28.4%</div>
            </div>
            <div className="bg-white/80 backdrop-blur-xs p-2 rounded-lg text-center shadow-2xs">
              <div className="text-[8px] text-stone-400">Uptime</div>
              <div className="text-xs font-bold text-blue-600">99.98%</div>
            </div>
          </div>
          <div className="w-full h-6 bg-purple-200/60 rounded-md flex items-center px-2">
            <div className="w-2/3 h-2 bg-[#6C5CE7] rounded-full" />
          </div>
        </div>
      );
    }

    // Laptop / Website style
    return (
      <div className="w-full h-44 bg-gradient-to-br from-orange-50 via-peach-50 to-amber-50 rounded-2xl p-3 flex items-center justify-center relative overflow-hidden group-hover:scale-[1.02] transition-transform duration-300">
        <div className="w-56 h-36 bg-stone-900 rounded-xl p-1.5 shadow-xl flex flex-col justify-between border border-stone-700">
          <div className="w-full h-26 bg-gradient-to-br from-sky-100 via-orange-100 to-rose-100 rounded-lg overflow-hidden p-2 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[9px] font-bold text-stone-800">Wanderly AI</span>
              <span className="text-[8px] bg-white/80 px-1.5 py-0.5 rounded font-semibold text-orange-600">Explore</span>
            </div>
            <div className="grid grid-cols-2 gap-1">
              <div className="h-10 bg-white/70 rounded-md p-1 flex flex-col justify-end">
                <span className="text-[7px] font-bold text-stone-700">Kyoto Tour</span>
              </div>
              <div className="h-10 bg-white/70 rounded-md p-1 flex flex-col justify-end">
                <span className="text-[7px] font-bold text-stone-700">Amalfi Coast</span>
              </div>
            </div>
          </div>
          <div className="w-12 h-1 bg-stone-600 rounded-full mx-auto" />
        </div>
      </div>
    );
  };

  return (
    <section id="projects" className="relative py-20 bg-[#8B7EFF] overflow-hidden text-white">
      {/* Top Organic Wave SVG matching template */}
      <div className="absolute top-0 left-0 right-0 overflow-hidden leading-none z-10 -translate-y-[99%]">
        <svg
          className="relative block w-full h-12 sm:h-20 lg:h-24 text-[#8B7EFF]"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          fill="currentColor"
        >
          <path d="M0,0 C150,90 350,-40 500,60 C650,160 900,10 1200,40 L1200,120 L0,120 Z" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
        
        {/* Section Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-bold uppercase tracking-wider mb-3 shadow-2xs">
            <span>Selected Work</span>
            <span className="text-xs">▾</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-200" />
            <h2 className="font-serif-display text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">
              Featured Projects
            </h2>
            <Sparkles className="w-5 h-5 text-amber-200" />
          </div>
        </div>

        {/* Carousel / Cards Wrapper */}
        <div className="relative">
          
          {/* Navigation Prev Button */}
          <button
            onClick={prevSlide}
            className="absolute -left-3 sm:-left-5 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white text-stone-800 shadow-lg hover:bg-stone-50 hover:scale-110 active:scale-95 transition-all flex items-center justify-center z-30 cursor-pointer"
            aria-label="Previous project"
            id="btn-projects-prev"
          >
            <ChevronLeft className="w-6 h-6 text-stone-700" />
          </button>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 px-4 sm:px-0">
            {projects.slice(currentIndex, currentIndex + 3).map((project) => (
              <div
                key={project.id}
                onClick={() => onSelectProject(project)}
                className="bg-white text-stone-800 rounded-[28px] p-5 shadow-card hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between cursor-pointer group border border-white/40"
                id={`project-card-${project.id}`}
              >
                {/* Mockup Presentation */}
                <div className="mb-5">
                  {renderCardMockup(project)}
                </div>

                {/* Content */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    {/* Tag */}
                    <span className="text-[11px] font-bold tracking-wider text-stone-400 uppercase">
                      {project.tag}
                    </span>

                    {/* Title */}
                    <h3 className="font-serif-display text-xl font-bold text-stone-900 mt-1 mb-2 group-hover:text-[#6C5CE7] transition-colors">
                      {project.title}
                    </h3>

                    {/* Short Description */}
                    <p className="text-sm text-stone-600 leading-relaxed line-clamp-2 mb-4">
                      {project.shortDescription}
                    </p>
                  </div>

                  {/* Footer & Action Arrow */}
                  <div className="flex items-center justify-between pt-3 border-t border-stone-100 mt-auto">
                    <div className="flex items-center gap-1.5">
                      {project.liveUrl && (
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-stone-900 text-white text-[10px] font-bold hover:bg-stone-800 transition-transform active:scale-95"
                          title="Open live demo"
                        >
                          <span>Demo</span>
                          <ExternalLink className="w-2.5 h-2.5" />
                        </a>
                      )}

                      {project.githubUrl && (
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-stone-100 text-stone-700 text-[10px] font-bold hover:bg-stone-200 border border-stone-200 transition-colors"
                          title="View source repository"
                        >
                          <Github className="w-2.5 h-2.5" />
                          <span>Code</span>
                        </a>
                      )}
                    </div>

                    {/* Action Arrow Button */}
                    <div
                      className="w-9 h-9 rounded-full flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform"
                      style={{ backgroundColor: project.accentColor }}
                      title="View Case Study"
                    >
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation Next Button */}
          <button
            onClick={nextSlide}
            className="absolute -right-3 sm:-right-5 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white text-stone-800 shadow-lg hover:bg-stone-50 hover:scale-110 active:scale-95 transition-all flex items-center justify-center z-30 cursor-pointer"
            aria-label="Next project"
            id="btn-projects-next"
          >
            <ChevronRight className="w-6 h-6 text-stone-700" />
          </button>
        </div>

        {/* Carousel Pagination Dots & Explore All Projects Link */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-10">
          <div className="flex items-center gap-2">
            {Array.from({ length: maxIndex + 1 }).map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`h-2.5 rounded-full transition-all ${
                  currentIndex === idx ? 'w-8 bg-white' : 'w-2.5 bg-white/40 hover:bg-white/70'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>

          {onViewAllProjects && (
            <button
              onClick={onViewAllProjects}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-white text-stone-900 hover:bg-stone-100 rounded-full text-xs font-bold shadow-lg transition-all hover:scale-105 active:scale-95 cursor-pointer"
              id="btn-explore-all-projects"
            >
              <span>Explore All {projects.length} Projects</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#6C5CE7]" />
            </button>
          )}
        </div>

      </div>

      {/* Bottom Wave Divider into Process Section */}
      <div className="absolute bottom-0 left-0 right-0 overflow-hidden leading-none z-10 translate-y-[99%]">
        <svg
          className="relative block w-full h-12 sm:h-20 lg:h-24 text-[#8B7EFF]"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          fill="currentColor"
        >
          <path d="M0,0 L0,40 C300,120 500,20 700,90 C900,160 1100,60 1200,90 L1200,0 Z" />
        </svg>
      </div>
    </section>
  );
};
