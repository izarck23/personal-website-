import React, { useState, useMemo } from 'react';
import {
  Code,
  ExternalLink,
  Github,
  Search,
  ArrowLeft,
  Sparkles,
  Layers,
  CheckCircle,
  Smartphone,
  Monitor,
  Laptop,
  Flame,
  Star,
  ChevronRight,
  X,
  BookOpen
} from 'lucide-react';
import { Project, ProfileConfig, BlogPost } from '../types';

interface ProjectsPageProps {
  projects: Project[];
  profile: ProfileConfig;
  posts?: BlogPost[];
  onSelectProject: (project: Project) => void;
  onNavigateHome: () => void;
  onOpenContact: (topic?: string) => void;
  onOpenGlobalSearch?: () => void;
  onSelectBlog?: (post: BlogPost) => void;
}

export const ProjectsPage: React.FC<ProjectsPageProps> = ({
  projects,
  profile,
  posts = [],
  onSelectProject,
  onNavigateHome,
  onOpenContact,
  onOpenGlobalSearch,
  onSelectBlog,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedTech, setSelectedTech] = useState<string | null>(null);

  const categories = [
    { label: 'All Projects', value: 'All' },
    { label: 'Mobile Apps', value: 'mobile' },
    { label: 'Web Dashboards', value: 'web' },
    { label: 'SaaS Platforms', value: 'saas' },
    { label: 'Developer Tools', value: 'devtool' },
    { label: 'Monetization', value: 'monetization' },
  ];

  // All unique technologies
  const allTechStacks = useMemo(() => {
    const techSet = new Set<string>();
    projects.forEach((p) => p.techStack.forEach((t) => techSet.add(t)));
    return Array.from(techSet);
  }, [projects]);

  const filteredProjects = projects.filter((project) => {
    const matchesCategory = selectedCategory === 'All' || project.category === selectedCategory;
    const matchesTech = !selectedTech || project.techStack.includes(selectedTech);
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      project.title.toLowerCase().includes(q) ||
      project.shortDescription.toLowerCase().includes(q) ||
      project.fullDescription.toLowerCase().includes(q) ||
      project.tag.toLowerCase().includes(q) ||
      project.techStack.some((t) => t.toLowerCase().includes(q)) ||
      project.highlights.some((h) => h.toLowerCase().includes(q));
    return matchesCategory && matchesTech && matchesSearch;
  });

  // Matching blog posts for cross-discovery
  const matchingPostsCount = useMemo(() => {
    if (!searchQuery.trim() || !posts.length) return 0;
    const q = searchQuery.toLowerCase().trim();
    return posts.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.excerpt.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q))
    ).length;
  }, [posts, searchQuery]);

  const getDeviceIcon = (deviceType: string) => {
    switch (deviceType) {
      case 'mobile':
        return <Smartphone className="w-4 h-4" />;
      case 'dashboard':
        return <Monitor className="w-4 h-4" />;
      default:
        return <Laptop className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF8F3] pt-24 pb-20">
      
      {/* Top Breadcrumb Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <div className="flex items-center justify-between">
          <button
            onClick={onNavigateHome}
            className="inline-flex items-center gap-2 text-xs font-bold text-stone-600 hover:text-[#6C5CE7] bg-white px-4 py-2 rounded-full border border-stone-200 shadow-2xs transition-all hover:-translate-x-1 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </button>

          <div className="text-xs text-stone-500 hidden sm:flex items-center gap-2">
            <span>Portfolio</span>
            <span>/</span>
            <span className="text-stone-900 font-bold">All Projects & Case Studies</span>
          </div>
        </div>
      </div>

      {/* Hero Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="bg-gradient-to-r from-[#6C5CE7] via-[#8B7EFF] to-[#FF7675] text-white rounded-[36px] p-8 sm:p-12 relative overflow-hidden shadow-card">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold uppercase tracking-wider mb-4">
              <Layers className="w-3.5 h-3.5" />
              <span>Engineered for Production & Speed</span>
            </div>

            <h1 className="font-serif-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
              Featured Work & Projects
            </h1>

            <p className="text-sm sm:text-base text-white/90 leading-relaxed max-w-xl">
              Explore web applications, cross-platform mobile apps, cloud architectures, and developer boilerplates built by {profile.brandName}.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Filter & Search Bar */}
        <div className="bg-white rounded-[28px] p-6 border border-stone-200/80 shadow-soft mb-10 space-y-4">
          
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Category Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 no-scrollbar">
              {categories.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => {
                    setSelectedCategory(cat.value);
                    setSelectedTech(null);
                  }}
                  className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                    selectedCategory === cat.value
                      ? 'bg-[#6C5CE7] text-white shadow-xs'
                      : 'bg-stone-50 text-stone-600 border border-stone-200 hover:border-purple-200'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Search Input & Global Search Trigger */}
            <div className="flex items-center gap-2 w-full md:w-auto">
              <div className="relative w-full md:w-80">
                <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search projects, tags, tech (e.g. React, Mobile)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-9 py-2.5 bg-stone-50 text-xs sm:text-sm text-stone-800 rounded-full border border-stone-200 focus:outline-none focus:border-[#6C5CE7] focus:bg-white transition-colors"
                  id="projects-list-search-input"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-200 transition-colors cursor-pointer"
                    title="Clear search"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {onOpenGlobalSearch && (
                <button
                  onClick={onOpenGlobalSearch}
                  className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2.5 bg-purple-50 hover:bg-purple-100 text-[#6C5CE7] border border-purple-200 rounded-full text-xs font-bold transition-all cursor-pointer shrink-0"
                  title="Open global search for projects & blog posts (⌘K)"
                  id="btn-projects-global-search"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Search All</span>
                  <kbd className="text-[10px] font-mono bg-white px-1.5 py-0.5 rounded border border-purple-200 text-purple-700">
                    ⌘K
                  </kbd>
                </button>
              )}
            </div>
          </div>

          {/* Active Search & Filter Info Bar */}
          {(searchQuery || selectedCategory !== 'All' || selectedTech) && (
            <div className="pt-2 flex flex-wrap items-center justify-between gap-2 text-xs bg-purple-50/50 p-3 rounded-2xl border border-purple-100">
              <div className="flex items-center gap-2 text-stone-700">
                <span className="font-bold text-[#6C5CE7]">
                  Showing {filteredProjects.length} of {projects.length} projects
                </span>
                {searchQuery && (
                  <span>
                    matching <strong className="text-stone-900">"{searchQuery}"</strong>
                  </span>
                )}
                {selectedCategory !== 'All' && (
                  <span className="bg-purple-100 text-[#6C5CE7] px-2 py-0.5 rounded-full text-[11px] font-semibold">
                    Category: {categories.find((c) => c.value === selectedCategory)?.label}
                  </span>
                )}
                {selectedTech && (
                  <span className="bg-purple-100 text-[#6C5CE7] px-2 py-0.5 rounded-full text-[11px] font-semibold">
                    Stack: {selectedTech}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-3">
                {matchingPostsCount > 0 && onOpenGlobalSearch && (
                  <button
                    onClick={onOpenGlobalSearch}
                    className="text-[#6C5CE7] hover:underline font-bold text-xs flex items-center gap-1 cursor-pointer"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Also found {matchingPostsCount} technical article{matchingPostsCount > 1 ? 's' : ''}</span>
                  </button>
                )}
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('All');
                    setSelectedTech(null);
                  }}
                  className="text-stone-500 hover:text-stone-800 font-bold text-xs cursor-pointer"
                >
                  Reset filters
                </button>
              </div>
            </div>
          )}

          {/* Tech Stack Chips Filter */}
          <div className="pt-3 border-t border-stone-100 flex flex-wrap items-center gap-2 text-xs">
            <span className="text-stone-400 font-bold text-[11px] uppercase mr-1">Filter by Stack:</span>
            {allTechStacks.map((tech) => (
              <button
                key={tech}
                onClick={() => setSelectedTech(selectedTech === tech ? null : tech)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${
                  selectedTech === tech
                    ? 'bg-purple-100 text-[#6C5CE7] font-bold border border-purple-200'
                    : 'bg-stone-100/70 hover:bg-stone-200/70 text-stone-600'
                }`}
              >
                {tech}
              </button>
            ))}
            {selectedTech && (
              <button
                onClick={() => setSelectedTech(null)}
                className="text-[11px] text-[#FF7675] font-bold underline ml-2"
              >
                Clear Tech Filter
              </button>
            )}
          </div>

        </div>

        {/* Project Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="bg-white rounded-[32px] overflow-hidden border border-stone-200/80 shadow-soft hover:shadow-card hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between group"
              id={`portfolio-project-${project.id}`}
            >
              <div>
                {/* Project Header Banner */}
                <div
                  className="p-6 text-white relative overflow-hidden flex items-start justify-between min-h-[140px]"
                  style={{ backgroundColor: project.accentColor }}
                >
                  <div className="relative z-10 max-w-[80%]">
                    <span className="inline-block px-2.5 py-0.5 rounded-full bg-white/20 text-[10px] font-bold tracking-wider uppercase mb-2">
                      {project.tag}
                    </span>
                    <h3 className="font-serif-display text-xl sm:text-2xl font-bold leading-tight drop-shadow-xs">
                      {project.title}
                    </h3>
                  </div>

                  <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white shrink-0">
                    {getDeviceIcon(project.deviceType)}
                  </div>
                </div>

                {/* Body Details */}
                <div className="p-6">
                  
                  {/* Short Description */}
                  <p className="text-xs sm:text-sm text-stone-600 leading-relaxed mb-4">
                    {project.shortDescription}
                  </p>

                  {/* Highlights Bullet points */}
                  <div className="space-y-1.5 mb-5">
                    {project.highlights.slice(0, 2).map((h, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-stone-700">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                        <span className="line-clamp-1">{h}</span>
                      </div>
                    ))}
                  </div>

                  {/* Tech Stack Badges */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {project.techStack.map((tech) => (
                      <span
                        key={tech}
                        className="px-2.5 py-1 bg-stone-50 border border-stone-200/80 rounded-md text-[10px] font-semibold text-stone-600"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  {/* Metrics Row */}
                  {project.metrics && project.metrics.length > 0 && (
                    <div className="grid grid-cols-3 gap-2 bg-stone-50 p-2.5 rounded-xl border border-stone-100 mb-2">
                      {project.metrics.map((m, idx) => (
                        <div key={idx} className="text-center">
                          <div className="text-[9px] font-bold text-stone-400 uppercase line-clamp-1">{m.label}</div>
                          <div className="font-serif-display text-xs font-bold text-stone-800">{m.value}</div>
                        </div>
                      ))}
                    </div>
                  )}

                </div>
              </div>

              {/* Action Buttons Footer */}
              <div className="p-6 pt-3 border-t border-stone-100 bg-stone-50/50 flex flex-wrap items-center justify-between gap-2 mt-auto">
                <div className="flex items-center gap-2">
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-stone-900 hover:bg-stone-800 text-white rounded-full text-xs font-bold shadow-2xs transition-all hover:scale-105 active:scale-95"
                    >
                      <span>Live Demo</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}

                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-stone-100 text-stone-800 rounded-full text-xs font-bold border border-stone-200 shadow-2xs transition-all hover:scale-105"
                    >
                      <Github className="w-3 h-3" />
                      <span>Code</span>
                    </a>
                  )}
                </div>

                <button
                  onClick={() => onSelectProject(project)}
                  className="text-xs font-bold text-[#6C5CE7] hover:underline flex items-center gap-1 cursor-pointer py-1"
                >
                  <span>Case Study</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>
          ))}
        </div>

        {/* Empty Search State */}
        {filteredProjects.length === 0 && (
          <div className="text-center py-20 bg-white rounded-[32px] border border-stone-200 p-8 shadow-xs">
            <Layers className="w-12 h-12 text-stone-400 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-stone-900">No projects match your filter</h3>
            <p className="text-xs sm:text-sm text-stone-500 mt-1 max-w-sm mx-auto">
              Try searching for a different keyword or resetting your active stack filter.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('All');
                setSearchQuery('');
                setSelectedTech(null);
              }}
              className="mt-4 px-5 py-2.5 bg-[#6C5CE7] text-white text-xs font-bold rounded-full shadow-xs cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* Commission Callout Card */}
        <div className="mt-16 bg-gradient-to-r from-purple-50 via-white to-rose-50 rounded-[32px] p-8 sm:p-12 border border-purple-100 flex flex-col md:flex-row items-center justify-between gap-8 shadow-soft">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#6C5CE7] mb-2 block">
              Have a custom project?
            </span>
            <h3 className="font-serif-display text-2xl sm:text-3xl font-bold text-stone-900">
              Need a bespoke web app, mobile app or backend?
            </h3>
            <p className="text-xs sm:text-sm text-stone-600 mt-2 max-w-xl leading-relaxed">
              I can turn your design, roadmap, or product concept into high-performance, maintainable software with clean TypeScript architectures.
            </p>
          </div>

          <button
            onClick={() => onOpenContact('Custom Software Project Commission')}
            className="px-8 py-3.5 bg-gradient-to-r from-[#FF7675] to-[#FF8E8D] hover:from-[#e7605f] hover:to-[#ff7b7a] text-white font-bold text-sm rounded-full shadow-glow-coral transition-all whitespace-nowrap cursor-pointer hover:scale-105 active:scale-95"
          >
            Start Your Project ➔
          </button>
        </div>

      </div>
    </div>
  );
};
