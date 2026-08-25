import React, { useState, useMemo } from 'react';
import {
  BookOpen,
  Search,
  Clock,
  Heart,
  Bookmark,
  ArrowRight,
  TrendingUp,
  Tag,
  Eye,
  ArrowLeft,
  Filter,
  Sparkles,
  Check,
  Share2,
  X,
  Layers
} from 'lucide-react';
import { BlogPost, ProfileConfig, Project } from '../types';

interface BlogListPageProps {
  posts: BlogPost[];
  profile: ProfileConfig;
  projects?: Project[];
  onSelectPost: (post: BlogPost) => void;
  onNavigateHome: () => void;
  onOpenGlobalSearch?: () => void;
  onSelectProject?: (project: Project) => void;
}

export const BlogListPage: React.FC<BlogListPageProps> = ({
  posts,
  profile,
  projects = [],
  onSelectPost,
  onNavigateHome,
  onOpenGlobalSearch,
  onSelectProject,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(new Set());
  const [likedIds, setLikedIds] = useState<Set<string>>(new Set());

  const categories = ['All', 'Monetization', 'Full-Stack', 'Architecture', 'Tech Journey', 'AI & Tools'];

  // All unique tags
  const allTags = useMemo(() => {
    const tagsSet = new Set<string>();
    posts.forEach((p) => p.tags.forEach((t) => tagsSet.add(t)));
    return Array.from(tagsSet);
  }, [posts]);

  const toggleBookmark = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setBookmarkedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleLike = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setLikedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const filteredPosts = posts.filter((post) => {
    const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory;
    const matchesTag = !selectedTag || post.tags.includes(selectedTag);
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      post.title.toLowerCase().includes(q) ||
      post.excerpt.toLowerCase().includes(q) ||
      post.contentMarkdown.toLowerCase().includes(q) ||
      post.tags.some((t) => t.toLowerCase().includes(q));
    return matchesCategory && matchesTag && matchesSearch;
  });

  // Matching projects count for cross-discovery
  const matchingProjectsCount = useMemo(() => {
    if (!searchQuery.trim() || !projects.length) return 0;
    const q = searchQuery.toLowerCase().trim();
    return projects.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.shortDescription.toLowerCase().includes(q) ||
        p.techStack.some((t) => t.toLowerCase().includes(q))
    ).length;
  }, [projects, searchQuery]);

  return (
    <div className="min-h-screen bg-[#FFF8F3] pt-24 pb-20">
      
      {/* Top Breadcrumbs & Back Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <div className="flex items-center justify-between">
          <button
            onClick={onNavigateHome}
            className="inline-flex items-center gap-2 text-xs font-bold text-stone-600 hover:text-[#6C5CE7] bg-white px-4 py-2 rounded-full border border-stone-200 shadow-2xs transition-all hover:-translate-x-1 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Portfolio</span>
          </button>

          <div className="text-xs text-stone-500 hidden sm:flex items-center gap-2">
            <span>Home</span>
            <span>/</span>
            <span className="text-stone-900 font-bold">Tech Blog & Articles</span>
          </div>
        </div>
      </div>

      {/* Hero Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="bg-gradient-to-r from-[#6C5CE7] via-[#8B7EFF] to-[#A29BFE] text-white rounded-[36px] p-8 sm:p-12 relative overflow-hidden shadow-card">
          {/* Decorative shapes */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-[#FF7675]/20 rounded-full blur-xl pointer-events-none" />

          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold uppercase tracking-wider mb-4">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Engineering & Monetization Notes</span>
            </div>

            <h1 className="font-serif-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
              The {profile.brandName} Blog
            </h1>

            <p className="text-sm sm:text-base text-purple-100 leading-relaxed max-w-xl">
              Practical guides on full-stack web development, TypeScript architectures, developer productivity, and solo founder software monetization.
            </p>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Filter and Search Bar */}
        <div className="bg-white rounded-[28px] p-6 border border-stone-200/80 shadow-soft mb-10 space-y-4">
          
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Category Pills */}
            <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 no-scrollbar">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    setSelectedCategory(cat);
                    setSelectedTag(null);
                  }}
                  className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-[#6C5CE7] text-white shadow-xs'
                      : 'bg-stone-50 text-stone-600 border border-stone-200 hover:border-purple-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Search Input & Global Search Trigger */}
            <div className="flex items-center gap-2 w-full md:w-auto">
              <div className="relative w-full md:w-80">
                <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search articles by title, tag, topic..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-9 py-2.5 bg-stone-50 text-xs sm:text-sm text-stone-800 rounded-full border border-stone-200 focus:outline-none focus:border-[#6C5CE7] focus:bg-white transition-colors"
                  id="blog-list-search-input"
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
                  id="btn-blog-list-global-search"
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
          {(searchQuery || selectedCategory !== 'All' || selectedTag) && (
            <div className="pt-2 flex flex-wrap items-center justify-between gap-2 text-xs bg-purple-50/50 p-3 rounded-2xl border border-purple-100">
              <div className="flex items-center gap-2 text-stone-700">
                <span className="font-bold text-[#6C5CE7]">
                  Showing {filteredPosts.length} of {posts.length} articles
                </span>
                {searchQuery && (
                  <span>
                    matching <strong className="text-stone-900">"{searchQuery}"</strong>
                  </span>
                )}
                {selectedCategory !== 'All' && (
                  <span className="bg-purple-100 text-[#6C5CE7] px-2 py-0.5 rounded-full text-[11px] font-semibold">
                    Category: {selectedCategory}
                  </span>
                )}
                {selectedTag && (
                  <span className="bg-purple-100 text-[#6C5CE7] px-2 py-0.5 rounded-full text-[11px] font-semibold">
                    #{selectedTag}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-3">
                {matchingProjectsCount > 0 && onOpenGlobalSearch && (
                  <button
                    onClick={onOpenGlobalSearch}
                    className="text-[#FF7675] hover:text-[#e7605f] font-bold text-xs flex items-center gap-1 cursor-pointer underline"
                  >
                    <Layers className="w-3.5 h-3.5" />
                    <span>Also found {matchingProjectsCount} matching project{matchingProjectsCount > 1 ? 's' : ''}</span>
                  </button>
                )}
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('All');
                    setSelectedTag(null);
                  }}
                  className="text-stone-500 hover:text-stone-800 font-bold text-xs cursor-pointer"
                >
                  Reset filters
                </button>
              </div>
            </div>
          )}

          {/* Popular Tags Row */}
          <div className="pt-3 border-t border-stone-100 flex flex-wrap items-center gap-2 text-xs">
            <span className="text-stone-400 font-bold text-[11px] uppercase mr-1">Tags:</span>
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${
                  selectedTag === tag
                    ? 'bg-purple-100 text-[#6C5CE7] font-bold border border-purple-200'
                    : 'bg-stone-100/70 hover:bg-stone-200/70 text-stone-600'
                }`}
              >
                #{tag}
              </button>
            ))}
            {selectedTag && (
              <button
                onClick={() => setSelectedTag(null)}
                className="text-[11px] text-[#FF7675] font-bold underline ml-2"
              >
                Clear Tag Filter
              </button>
            )}
          </div>

        </div>

        {/* Blog Post Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.map((post) => {
            const isBookmarked = bookmarkedIds.has(post.id);
            const isLiked = likedIds.has(post.id);
            const likes = post.likesCount + (isLiked ? 1 : 0);

            return (
              <article
                key={post.id}
                onClick={() => onSelectPost(post)}
                className="bg-white rounded-[32px] overflow-hidden shadow-soft hover:shadow-card hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between border border-stone-200/80 cursor-pointer group"
                id={`blog-list-post-${post.id}`}
              >
                <div>
                  {/* Cover Image */}
                  <div className="relative h-52 w-full overflow-hidden">
                    <img
                      src={post.coverImage}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                    
                    <div className="absolute top-3.5 left-3.5 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[11px] font-bold text-[#6C5CE7] shadow-xs">
                      {post.category}
                    </div>

                    <button
                      onClick={(e) => toggleBookmark(e, post.id)}
                      className={`absolute top-3.5 right-3.5 w-8 h-8 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center shadow-xs transition-colors ${
                        isBookmarked ? 'text-amber-500' : 'text-stone-500 hover:text-amber-500'
                      }`}
                      title="Bookmark post"
                    >
                      <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
                    </button>
                  </div>

                  {/* Body Content */}
                  <div className="p-6">
                    {/* Meta bar */}
                    <div className="flex items-center gap-3 text-xs text-stone-500 mb-2.5">
                      <span>{post.publishedAt}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {post.readTime}
                      </span>
                    </div>

                    {/* Title */}
                    <h2 className="font-serif-display text-xl font-bold text-stone-900 group-hover:text-[#6C5CE7] transition-colors leading-snug mb-3">
                      {post.title}
                    </h2>

                    {/* Excerpt */}
                    <p className="text-xs sm:text-sm text-stone-600 leading-relaxed line-clamp-3 mb-4">
                      {post.excerpt}
                    </p>

                    {/* Tag list */}
                    <div className="flex flex-wrap gap-1.5 mb-2">
                      {post.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-[10px] font-semibold bg-stone-50 text-stone-600 px-2 py-0.5 rounded-md border border-stone-100"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Footer Bar */}
                <div className="px-6 pb-6 pt-3 border-t border-stone-100 flex items-center justify-between mt-auto">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={(e) => toggleLike(e, post.id)}
                      className={`flex items-center gap-1 text-xs font-semibold transition-colors ${
                        isLiked ? 'text-rose-500' : 'text-stone-500 hover:text-rose-500'
                      }`}
                    >
                      <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-current' : ''}`} />
                      <span>{likes}</span>
                    </button>

                    <span className="flex items-center gap-1 text-xs text-stone-400">
                      <Eye className="w-3.5 h-3.5" />
                      <span>{post.viewsCount}</span>
                    </span>
                  </div>

                  <span className="text-xs font-bold text-[#6C5CE7] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    <span>Read Full Post</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </article>
            );
          })}
        </div>

        {filteredPosts.length === 0 && (
          <div className="text-center py-20 bg-white rounded-[32px] border border-stone-200 p-8 shadow-xs">
            <BookOpen className="w-12 h-12 text-stone-400 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-stone-900">No articles matched your criteria</h3>
            <p className="text-xs sm:text-sm text-stone-500 mt-1 max-w-sm mx-auto">
              Try adjusting your search terms, selecting "All" categories, or resetting the active tag filter.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('All');
                setSearchQuery('');
                setSelectedTag(null);
              }}
              className="mt-4 px-5 py-2.5 bg-[#6C5CE7] text-white text-xs font-bold rounded-full shadow-xs cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
