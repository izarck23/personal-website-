import React, { useState } from 'react';
import { BookOpen, Sparkles, Clock, Heart, Bookmark, Search, ArrowRight, TrendingUp, Tag, Eye } from 'lucide-react';
import { BlogPost } from '../types';

interface BlogSectionProps {
  posts: BlogPost[];
  onSelectPost: (post: BlogPost) => void;
  onViewAllArticles?: () => void;
}

export const BlogSection: React.FC<BlogSectionProps> = ({ posts, onSelectPost, onViewAllArticles }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(new Set());
  const [likedIds, setLikedIds] = useState<Set<string>>(new Set());

  const categories = ['All', 'Monetization', 'Full-Stack', 'Tech Journey', 'AI & Tools'];

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
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <section id="blog" className="py-24 bg-gradient-to-b from-[#FFF8F3] to-[#F7F1FB] relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/4 right-0 w-80 h-80 bg-purple-100/40 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-purple-100 text-[#6C5CE7] text-xs font-bold uppercase tracking-wider mb-3">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Tech Blogs & Growth Playbook</span>
            </div>

            <h2 className="font-serif-display text-3xl sm:text-4xl md:text-5xl font-bold text-stone-900 tracking-tight">
              Thoughts, Tutorials & Monetization
            </h2>
            <p className="text-stone-600 mt-2 text-sm sm:text-base max-w-xl">
              Documenting my tech journey, architecture blueprints, and real strategies for online software monetization.
            </p>
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search tech articles & guides..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white text-xs sm:text-sm text-stone-800 rounded-full border border-stone-200 focus:outline-none focus:border-[#6C5CE7] shadow-xs"
            />
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-[#6C5CE7] text-white shadow-md'
                  : 'bg-white text-stone-600 border border-stone-200 hover:border-purple-200'
              }`}
            >
              {cat}
            </button>
          ))}
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
                className="bg-white rounded-[28px] overflow-hidden shadow-soft hover:shadow-card hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between border border-stone-200/80 cursor-pointer group"
                id={`blog-card-${post.id}`}
              >
                <div>
                  {/* Post Cover Image */}
                  <div className="relative h-48 w-full overflow-hidden bg-stone-100">
                    <img
                      src={post.coverImage}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                      loading="lazy"
                      decoding="async"
                      onError={(e) => {
                        const target = e.currentTarget;
                        target.src = 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=80';
                      }}
                    />
                    {/* Category Badge */}
                    <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[11px] font-bold text-[#6C5CE7] shadow-xs">
                      {post.category}
                    </div>

                    {/* Bookmark Quick Button */}
                    <button
                      onClick={(e) => toggleBookmark(e, post.id)}
                      className={`absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center shadow-xs transition-colors ${
                        isBookmarked ? 'text-amber-500' : 'text-stone-500 hover:text-amber-500'
                      }`}
                      title={isBookmarked ? 'Saved to bookmarks' : 'Bookmark post'}
                    >
                      <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
                    </button>
                  </div>

                  {/* Post Body */}
                  <div className="p-6">
                    {/* Meta info */}
                    <div className="flex items-center gap-3 text-xs text-stone-500 mb-2.5">
                      <span>{post.publishedAt}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {post.readTime}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="font-bold text-stone-900 text-lg sm:text-xl mb-2.5 group-hover:text-[#6C5CE7] transition-colors leading-snug line-clamp-2">
                      {post.title}
                    </h3>

                    {/* Excerpt */}
                    <p className="text-xs sm:text-sm text-stone-600 leading-relaxed line-clamp-3 mb-4">
                      {post.excerpt}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {post.tags.slice(0, 3).map((tag) => (
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

                {/* Card Footer */}
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
                    Read Article ➔
                  </span>
                </div>
              </article>
            );
          })}
        </div>

        {filteredPosts.length === 0 && (
          <div className="text-center py-16 bg-white rounded-3xl border border-stone-200 p-8">
            <BookOpen className="w-8 h-8 text-stone-400 mx-auto mb-3" />
            <h3 className="text-base font-bold text-stone-800">No articles match your search</h3>
            <p className="text-xs text-stone-500 mt-1">Try searching for other keywords or select 'All'</p>
          </div>
        )}

        {/* View All Articles Banner */}
        {onViewAllArticles && (
          <div className="mt-12 text-center">
            <button
              onClick={onViewAllArticles}
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-white hover:bg-stone-50 text-stone-900 border border-stone-200 rounded-full font-bold text-xs sm:text-sm shadow-soft hover:shadow-card hover:scale-105 active:scale-95 transition-all cursor-pointer"
              id="btn-view-all-blog-posts"
            >
              <span>Explore All {posts.length} Articles & Guides</span>
              <ArrowRight className="w-4 h-4 text-[#6C5CE7]" />
            </button>
          </div>
        )}

      </div>
    </section>
  );
};
