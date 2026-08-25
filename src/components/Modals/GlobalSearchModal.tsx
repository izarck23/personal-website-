import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Search,
  X,
  BookOpen,
  Layers,
  ArrowRight,
  ExternalLink,
  Github,
  Clock,
  Sparkles,
  Tag,
  Briefcase,
  Code,
  Smartphone,
  Monitor,
  Laptop,
  Flame,
  CheckCircle2,
  TrendingUp,
  CornerDownLeft
} from 'lucide-react';
import { Project, BlogPost, ServiceItem, ProfileConfig } from '../../types';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  projects: Project[];
  posts: BlogPost[];
  services: ServiceItem[];
  profile: ProfileConfig;
  onSelectProject: (project: Project) => void;
  onSelectBlog: (post: BlogPost) => void;
  onSelectService: (service: ServiceItem) => void;
  onNavigateToView: (view: 'home' | 'blog-list' | 'projects-list', sectionId?: string) => void;
}

type SearchCategoryFilter = 'all' | 'projects' | 'blogs' | 'services';

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  projects,
  posts,
  services,
  profile,
  onSelectProject,
  onSelectBlog,
  onSelectService,
  onNavigateToView,
}) => {
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<SearchCategoryFilter>('all');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsContainerRef = useRef<HTMLDivElement>(null);

  // Suggested quick keywords
  const popularKeywords = [
    'TypeScript',
    'React',
    'Monetization',
    'SaaS',
    'Mobile',
    'Tailwind',
    'Node.js',
    'Architecture',
    'Clean Code'
  ];

  // Focus input automatically on open
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
      setSelectedIndex(0);
    } else {
      setQuery('');
      setActiveCategory('all');
    }
  }, [isOpen]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Filter Projects
  const filteredProjects = useMemo(() => {
    if (!query.trim()) return projects.slice(0, 4);
    const q = query.toLowerCase().trim();
    return projects.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.shortDescription.toLowerCase().includes(q) ||
        p.fullDescription.toLowerCase().includes(q) ||
        p.tag.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.techStack.some((t) => t.toLowerCase().includes(q)) ||
        p.highlights.some((h) => h.toLowerCase().includes(q))
    );
  }, [projects, query]);

  // Filter Blog Posts
  const filteredPosts = useMemo(() => {
    if (!query.trim()) return posts.slice(0, 4);
    const q = query.toLowerCase().trim();
    return posts.filter(
      (post) =>
        post.title.toLowerCase().includes(q) ||
        post.excerpt.toLowerCase().includes(q) ||
        post.contentMarkdown.toLowerCase().includes(q) ||
        post.category.toLowerCase().includes(q) ||
        post.tags.some((t) => t.toLowerCase().includes(q))
    );
  }, [posts, query]);

  // Filter Services
  const filteredServices = useMemo(() => {
    if (!query.trim()) return services.slice(0, 3);
    const q = query.toLowerCase().trim();
    return services.filter(
      (s) =>
        s.title.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q) ||
        s.idealFor.toLowerCase().includes(q) ||
        s.features.some((f) => f.toLowerCase().includes(q))
    );
  }, [services, query]);

  // Flattened active results for keyboard arrow navigation
  interface FlatResultItem {
    type: 'project' | 'blog' | 'service';
    data: any;
  }

  const flattenedResults = useMemo<FlatResultItem[]>(() => {
    const list: FlatResultItem[] = [];
    if (activeCategory === 'all' || activeCategory === 'projects') {
      filteredProjects.forEach((p) => list.push({ type: 'project', data: p }));
    }
    if (activeCategory === 'all' || activeCategory === 'blogs') {
      filteredPosts.forEach((b) => list.push({ type: 'blog', data: b }));
    }
    if (activeCategory === 'all' || activeCategory === 'services') {
      filteredServices.forEach((s) => list.push({ type: 'service', data: s }));
    }
    return list;
  }, [activeCategory, filteredProjects, filteredPosts, filteredServices]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev < flattenedResults.length - 1 ? prev + 1 : 0));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : flattenedResults.length - 1));
      } else if (e.key === 'Enter') {
        if (flattenedResults.length > 0 && selectedIndex < flattenedResults.length) {
          e.preventDefault();
          const item = flattenedResults[selectedIndex];
          if (item.type === 'project') {
            onSelectProject(item.data);
          } else if (item.type === 'blog') {
            onSelectBlog(item.data);
          } else if (item.type === 'service') {
            onSelectService(item.data);
          }
          onClose();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, flattenedResults, selectedIndex, onClose, onSelectProject, onSelectBlog, onSelectService]);

  if (!isOpen) return null;

  const totalResultsCount =
    (activeCategory === 'all' || activeCategory === 'projects' ? filteredProjects.length : 0) +
    (activeCategory === 'all' || activeCategory === 'blogs' ? filteredPosts.length : 0) +
    (activeCategory === 'all' || activeCategory === 'services' ? filteredServices.length : 0);

  const highlightMatch = (text: string, highlight: string) => {
    if (!highlight.trim()) return text;
    const regex = new RegExp(`(${highlight.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);
    return parts.map((part, i) =>
      regex.test(part) ? (
        <mark key={i} className="bg-amber-200/80 text-stone-900 px-0.5 rounded font-bold">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  const getDeviceIcon = (deviceType: string) => {
    switch (deviceType) {
      case 'mobile':
        return <Smartphone className="w-3.5 h-3.5" />;
      case 'dashboard':
        return <Monitor className="w-3.5 h-3.5" />;
      default:
        return <Laptop className="w-3.5 h-3.5" />;
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center p-3 sm:p-6 md:p-10 pt-16 sm:pt-20 bg-stone-950/60 backdrop-blur-md animate-fade-in"
      onClick={onClose}
      id="global-search-modal-backdrop"
    >
      <div
        className="w-full max-w-3xl bg-[#FFF8F3] rounded-[32px] border border-stone-200/90 shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-scale-up"
        onClick={(e) => e.stopPropagation()}
        id="global-search-modal-content"
      >
        {/* Top Search Input Bar */}
        <div className="p-4 sm:p-6 bg-white border-b border-stone-200 relative">
          <div className="flex items-center gap-3 bg-stone-50 rounded-2xl px-4 py-3 border border-stone-200 focus-within:border-[#6C5CE7] focus-within:bg-white focus-within:ring-2 focus-within:ring-[#6C5CE7]/20 transition-all">
            <Search className="w-5 h-5 text-[#6C5CE7] shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setSelectedIndex(0);
              }}
              placeholder="Search projects, blog articles, tech stack (e.g., React, TypeScript, Monetization)..."
              className="w-full bg-transparent text-sm sm:text-base text-stone-900 placeholder:text-stone-400 focus:outline-none"
              id="global-search-input"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="p-1 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-200 transition-colors"
                title="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <div className="hidden sm:flex items-center gap-1 text-[11px] font-mono text-stone-400 bg-white border border-stone-200 px-2 py-0.5 rounded-md shrink-0">
              <span>ESC</span>
            </div>
          </div>

          {/* Category Filter Chips & Results Counter */}
          <div className="flex flex-wrap items-center justify-between gap-3 mt-4 pt-2">
            <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
              {[
                { id: 'all', label: 'All Results', count: filteredProjects.length + filteredPosts.length + filteredServices.length },
                { id: 'projects', label: 'Projects', count: filteredProjects.length },
                { id: 'blogs', label: 'Blog Posts', count: filteredPosts.length },
                { id: 'services', label: 'Services', count: filteredServices.length },
              ].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => {
                    setActiveCategory(cat.id as SearchCategoryFilter);
                    setSelectedIndex(0);
                  }}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                    activeCategory === cat.id
                      ? 'bg-[#6C5CE7] text-white shadow-xs'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  <span>{cat.label}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                      activeCategory === cat.id ? 'bg-white/25 text-white' : 'bg-stone-200 text-stone-700'
                    }`}
                  >
                    {cat.count}
                  </span>
                </button>
              ))}
            </div>

            <div className="text-xs font-semibold text-stone-500 hidden sm:block">
              {query ? `Filtering for "${query}"` : 'Browse all items'}
            </div>
          </div>

          {/* Popular Tag Suggestions */}
          {!query && (
            <div className="flex flex-wrap items-center gap-1.5 mt-3 pt-3 border-t border-stone-100">
              <span className="text-[11px] font-bold text-stone-400 uppercase mr-1 flex items-center gap-1">
                <TrendingUp className="w-3 h-3 text-[#FF7675]" />
                Trending:
              </span>
              {popularKeywords.map((kw) => (
                <button
                  key={kw}
                  onClick={() => setQuery(kw)}
                  className="px-2.5 py-0.5 rounded-lg bg-purple-50/80 hover:bg-purple-100 text-[#6C5CE7] text-[11px] font-medium transition-colors cursor-pointer border border-purple-100"
                >
                  {kw}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Results Scroll Area */}
        <div
          ref={resultsContainerRef}
          className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 max-h-[55vh]"
          id="global-search-results-list"
        >
          {totalResultsCount === 0 ? (
            <div className="py-12 text-center">
              <div className="w-12 h-12 rounded-2xl bg-stone-100 text-stone-400 flex items-center justify-center mx-auto mb-3">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-stone-800">No results found for "{query}"</h3>
              <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
                Try searching for a different keyword like "React", "Mobile", "TypeScript", or "Monetization".
              </p>
              <button
                onClick={() => setQuery('')}
                className="mt-4 px-4 py-2 bg-[#6C5CE7] text-white text-xs font-bold rounded-full shadow-xs cursor-pointer"
              >
                Clear Search Filter
              </button>
            </div>
          ) : (
            <>
              {/* SECTION: Projects Results */}
              {(activeCategory === 'all' || activeCategory === 'projects') && filteredProjects.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-3 px-1">
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-stone-500">
                      <Layers className="w-3.5 h-3.5 text-[#FF7675]" />
                      <span>Projects & Software ({filteredProjects.length})</span>
                    </div>
                    <button
                      onClick={() => {
                        onClose();
                        onNavigateToView('projects-list');
                      }}
                      className="text-xs font-bold text-[#6C5CE7] hover:underline flex items-center gap-1"
                    >
                      <span>View all in directory</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>

                  <div className="space-y-2.5">
                    {filteredProjects.map((project) => (
                      <div
                        key={project.id}
                        onClick={() => {
                          onSelectProject(project);
                          onClose();
                        }}
                        className="p-4 bg-white rounded-2xl border border-stone-200/80 hover:border-[#6C5CE7] hover:shadow-soft transition-all duration-200 cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
                        id={`search-item-project-${project.id}`}
                      >
                        <div className="flex items-start gap-3.5">
                          <div
                            className="w-10 h-10 rounded-xl flex items-center justify-center text-white shrink-0 shadow-2xs group-hover:scale-105 transition-transform"
                            style={{ backgroundColor: project.accentColor }}
                          >
                            {getDeviceIcon(project.deviceType)}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-serif-display font-bold text-sm sm:text-base text-stone-900 group-hover:text-[#6C5CE7] transition-colors">
                                {highlightMatch(project.title, query)}
                              </h4>
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-stone-100 text-stone-600 uppercase">
                                {project.tag}
                              </span>
                            </div>
                            <p className="text-xs text-stone-600 mt-0.5 line-clamp-1">
                              {highlightMatch(project.shortDescription, query)}
                            </p>
                            <div className="flex flex-wrap gap-1 mt-2">
                              {project.techStack.map((tech) => (
                                <span
                                  key={tech}
                                  className="text-[10px] bg-stone-50 text-stone-600 px-2 py-0.5 rounded border border-stone-200"
                                >
                                  {highlightMatch(tech, query)}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                          {project.liveUrl && (
                            <a
                              href={project.liveUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="px-2.5 py-1 bg-stone-900 hover:bg-stone-800 text-white rounded-md text-[11px] font-bold flex items-center gap-1 transition-colors"
                              title="Open demo"
                            >
                              <span>Demo</span>
                              <ExternalLink className="w-2.5 h-2.5" />
                            </a>
                          )}
                          <span className="text-xs font-bold text-[#6C5CE7] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                            <span>Open Details</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* SECTION: Blog Articles Results */}
              {(activeCategory === 'all' || activeCategory === 'blogs') && filteredPosts.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-3 px-1">
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-stone-500">
                      <BookOpen className="w-3.5 h-3.5 text-[#6C5CE7]" />
                      <span>Blog Articles & Tech Guides ({filteredPosts.length})</span>
                    </div>
                    <button
                      onClick={() => {
                        onClose();
                        onNavigateToView('blog-list');
                      }}
                      className="text-xs font-bold text-[#6C5CE7] hover:underline flex items-center gap-1"
                    >
                      <span>Explore all articles</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>

                  <div className="space-y-2.5">
                    {filteredPosts.map((post) => (
                      <div
                        key={post.id}
                        onClick={() => {
                          onSelectBlog(post);
                          onClose();
                        }}
                        className="p-4 bg-white rounded-2xl border border-stone-200/80 hover:border-[#6C5CE7] hover:shadow-soft transition-all duration-200 cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
                        id={`search-item-blog-${post.id}`}
                      >
                        <div className="flex items-start gap-3.5">
                          <img
                            src={post.coverImage}
                            alt={post.title}
                            className="w-14 h-14 rounded-xl object-cover border border-stone-200 shrink-0 group-hover:scale-105 transition-transform"
                            referrerPolicy="no-referrer"
                          />
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-bold text-[#6C5CE7] bg-purple-50 px-2 py-0.5 rounded-full">
                                {post.category}
                              </span>
                              <div className="text-[11px] text-stone-400 flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                <span>{post.readTime}</span>
                              </div>
                            </div>
                            <h4 className="font-serif-display font-bold text-sm sm:text-base text-stone-900 group-hover:text-[#6C5CE7] transition-colors mt-0.5 line-clamp-1">
                              {highlightMatch(post.title, query)}
                            </h4>
                            <p className="text-xs text-stone-600 line-clamp-1 mt-0.5">
                              {highlightMatch(post.excerpt, query)}
                            </p>
                          </div>
                        </div>

                        <div className="self-end sm:self-center shrink-0">
                          <span className="text-xs font-bold text-[#6C5CE7] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                            <span>Read Guide</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* SECTION: Services Results */}
              {(activeCategory === 'all' || activeCategory === 'services') && filteredServices.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-stone-500 mb-3 px-1">
                    <Briefcase className="w-3.5 h-3.5 text-[#FF7675]" />
                    <span>Engineering Services & Consulting ({filteredServices.length})</span>
                  </div>

                  <div className="space-y-2.5">
                    {filteredServices.map((service) => (
                      <div
                        key={service.id}
                        onClick={() => {
                          onSelectService(service);
                          onClose();
                        }}
                        className="p-4 bg-white rounded-2xl border border-stone-200/80 hover:border-[#6C5CE7] hover:shadow-soft transition-all duration-200 cursor-pointer flex items-center justify-between gap-3 group"
                        id={`search-item-service-${service.id}`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className="w-10 h-10 rounded-xl flex items-center justify-center text-white shrink-0 font-bold"
                            style={{ backgroundColor: service.accentColor }}
                          >
                            <Code className="w-5 h-5" />
                          </div>
                          <div>
                            <h4 className="font-serif-display font-bold text-sm text-stone-900 group-hover:text-[#6C5CE7] transition-colors">
                              {highlightMatch(service.title, query)}
                            </h4>
                            <p className="text-xs text-stone-500 line-clamp-1">{service.description}</p>
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <div className="font-bold text-xs text-stone-900">{service.startingPrice}</div>
                          <span className="text-[11px] text-[#6C5CE7] font-semibold">View details ➔</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Bottom Keyboard Shortcut Hint Footer */}
        <div className="px-6 py-3.5 bg-stone-100/90 border-t border-stone-200 flex items-center justify-between text-xs text-stone-500">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-white rounded border border-stone-300 font-mono text-[10px] text-stone-700 shadow-2xs">ESC</kbd>
              <span>close</span>
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-white rounded border border-stone-300 font-mono text-[10px] text-stone-700 shadow-2xs">↵</kbd>
              <span>open item</span>
            </span>
            <span className="hidden sm:flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-white rounded border border-stone-300 font-mono text-[10px] text-stone-700 shadow-2xs">↑↓</kbd>
              <span>navigate</span>
            </span>
          </div>

          <div className="text-[11px] font-medium text-stone-600">
            {profile.brandName} Global Search
          </div>
        </div>
      </div>
    </div>
  );
};
