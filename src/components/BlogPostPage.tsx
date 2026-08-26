import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Clock,
  Heart,
  Bookmark,
  Share2,
  Copy,
  Check,
  MessageSquare,
  Send,
  Eye,
  Calendar,
  User,
  Sparkles,
  Twitter,
  Linkedin,
  Tag,
  ArrowRight,
  Code2,
  ThumbsUp
} from 'lucide-react';
import { BlogPost, BlogComment, ProfileConfig } from '../types';
import { copyToClipboard } from '../utils/safeClipboard';

interface BlogPostPageProps {
  post: BlogPost;
  allPosts: BlogPost[];
  profile: ProfileConfig;
  onBackToBlogList: () => void;
  onSelectPost: (post: BlogPost) => void;
  onOpenContact: () => void;
}

export const BlogPostPage: React.FC<BlogPostPageProps> = ({
  post,
  allPosts,
  profile,
  onBackToBlogList,
  onSelectPost,
  onOpenContact,
}) => {
  const [likes, setLikes] = useState(post.likesCount);
  const [hasLiked, setHasLiked] = useState(false);
  const [hasBookmarked, setHasBookmarked] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCodeSnippet, setCopiedCodeSnippet] = useState<string | null>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Comments
  const [comments, setComments] = useState<BlogComment[]>(post.comments || []);
  const [newCommentName, setNewCommentName] = useState('');
  const [newCommentText, setNewCommentText] = useState('');

  // Reset and sync state when post changes
  useEffect(() => {
    setLikes(post.likesCount);
    setHasLiked(false);
    setHasBookmarked(false);
    setComments(post.comments || []);
    setCopiedLink(false);
    setCopiedCodeSnippet(null);
  }, [post.id]);

  // Scroll reading progress
  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollTop;
      const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      if (windowHeight > 0) {
        const scrollPercent = (totalScroll / windowHeight) * 100;
        setScrollProgress(scrollPercent);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Related posts (excluding current)
  const relatedPosts = allPosts
    .filter((p) => p.id !== post.id && (p.category === post.category || p.tags.some((t) => post.tags.includes(t))))
    .slice(0, 3);

  const handleLike = () => {
    if (hasLiked) {
      setLikes((prev) => prev - 1);
      setHasLiked(false);
    } else {
      setLikes((prev) => prev + 1);
      setHasLiked(true);
    }
  };

  const handleCopyLink = async () => {
    await copyToClipboard(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleCopyCode = async (code: string, id: string) => {
    await copyToClipboard(code);
    setCopiedCodeSnippet(id);
    setTimeout(() => setCopiedCodeSnippet(null), 2500);
  };

  const handleShareTwitter = () => {
    const text = encodeURIComponent(`"${post.title}" by ${profile.brandName}`);
    const url = encodeURIComponent(window.location.href);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank', 'noopener,noreferrer');
  };

  const handleShareLinkedIn = () => {
    const url = encodeURIComponent(window.location.href);
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, '_blank', 'noopener,noreferrer');
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;

    const newComment: BlogComment = {
      id: `comment-${Date.now()}`,
      author: newCommentName.trim() || 'Fellow Developer',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      content: newCommentText.trim(),
      createdAt: 'Just now',
      likes: 1,
    };

    setComments([newComment, ...comments]);
    setNewCommentText('');
    setNewCommentName('');
  };

  // Render markdown parser with code snippet blocks
  const renderMarkdownContent = (markdown: string) => {
    const lines = markdown.split('\n');
    const elements: React.ReactNode[] = [];
    let inCodeBlock = false;
    let codeLanguage = '';
    let codeLines: string[] = [];

    lines.forEach((line, index) => {
      if (line.startsWith('```')) {
        if (!inCodeBlock) {
          inCodeBlock = true;
          codeLanguage = line.replace('```', '').trim() || 'typescript';
          codeLines = [];
        } else {
          inCodeBlock = false;
          const fullCode = codeLines.join('\n');
          const snippetId = `code-snippet-${index}`;
          const isCopied = copiedCodeSnippet === snippetId;

          elements.push(
            <div key={`code-${index}`} className="my-6 rounded-2xl bg-stone-900 text-stone-100 overflow-hidden border border-stone-800 shadow-lg">
              <div className="flex items-center justify-between px-4 py-2.5 bg-stone-950/80 border-b border-stone-800 text-xs text-stone-400">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                  </div>
                  <span className="font-mono font-semibold ml-2 text-[11px] text-stone-300 uppercase">{codeLanguage}</span>
                </div>

                <button
                  onClick={() => handleCopyCode(fullCode, snippetId)}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-stone-800 hover:bg-stone-700 text-stone-300 text-[11px] transition-colors"
                >
                  {isCopied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{isCopied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

              <pre className="p-4 text-xs sm:text-sm font-mono overflow-x-auto text-emerald-300/90 leading-relaxed">
                <code>{fullCode}</code>
              </pre>
            </div>
          );
        }
        return;
      }

      if (inCodeBlock) {
        codeLines.push(line);
        return;
      }

      if (line.startsWith('## ')) {
        elements.push(
          <h2 key={index} className="font-serif-display text-2xl sm:text-3xl font-bold text-stone-900 mt-10 mb-4 pt-4 border-t border-stone-100">
            {line.replace('## ', '')}
          </h2>
        );
      } else if (line.startsWith('### ')) {
        elements.push(
          <h3 key={index} className="font-bold text-stone-900 text-lg sm:text-xl mt-6 mb-3 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#6C5CE7]" />
            <span>{line.replace('### ', '')}</span>
          </h3>
        );
      } else if (line.startsWith('- [x] ') || line.startsWith('- [ ] ')) {
        const isChecked = line.startsWith('- [x] ');
        elements.push(
          <div key={index} className="flex items-center gap-2.5 py-1 text-xs sm:text-sm text-stone-700">
            <div className={`w-4 h-4 rounded flex items-center justify-center ${isChecked ? 'bg-emerald-500 text-white' : 'border border-stone-300'}`}>
              {isChecked && <Check className="w-3 h-3 stroke-3" />}
            </div>
            <span>{line.replace(/- \[[x ]\] /, '')}</span>
          </div>
        );
      } else if (line.startsWith('- ')) {
        elements.push(
          <li key={index} className="text-xs sm:text-sm text-stone-700 leading-relaxed ml-5 list-disc mb-1.5 marker:text-[#6C5CE7]">
            {line.replace('- ', '')}
          </li>
        );
      } else if (line.trim() === '') {
        elements.push(<div key={index} className="h-2" />);
      } else {
        elements.push(
          <p key={index} className="text-sm sm:text-base text-stone-700 leading-relaxed mb-4">
            {line}
          </p>
        );
      }
    });

    return elements;
  };

  return (
    <div className="min-h-screen bg-[#FFF8F3] pt-20 pb-20">
      
      {/* Top Fixed Reading Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-1.5 bg-stone-100 z-50">
        <div
          className="h-full bg-gradient-to-r from-[#6C5CE7] via-[#FF7675] to-[#8B7EFF] transition-all duration-150"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Navigation Breadcrumb Bar */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 mb-8">
        <div className="flex items-center justify-between">
          <button
            onClick={onBackToBlogList}
            className="inline-flex items-center gap-2 text-xs font-bold text-stone-600 hover:text-[#6C5CE7] bg-white px-4 py-2 rounded-full border border-stone-200 shadow-2xs transition-all hover:-translate-x-1 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>All Articles</span>
          </button>

          <div className="text-xs text-stone-500 hidden sm:flex items-center gap-2">
            <span>Blog</span>
            <span>/</span>
            <span className="text-[#6C5CE7] font-bold">{post.category}</span>
          </div>
        </div>
      </div>

      {/* Article Container */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8" id="single-blog-post-page">
        
        {/* Main Article Card */}
        <div className="bg-white rounded-[36px] overflow-hidden border border-stone-200/80 shadow-card">
          
          {/* Hero Cover Image */}
          <div className="relative h-72 sm:h-96 w-full overflow-hidden">
            <img
              src={post.coverImage}
              alt={post.title}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-900/85 via-stone-900/30 to-transparent" />
            
            <div className="absolute bottom-8 left-6 sm:left-10 right-6 sm:right-10 text-white">
              <span className="inline-block px-3.5 py-1 bg-[#6C5CE7] text-white text-xs font-bold rounded-full mb-3 shadow-md">
                {post.category}
              </span>
              <h1 className="font-serif-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-tight drop-shadow-xs">
                {post.title}
              </h1>
            </div>
          </div>

          {/* Metadata & Author Bar */}
          <div className="px-6 sm:px-10 py-4 bg-stone-50/90 border-b border-stone-200 flex flex-wrap items-center justify-between gap-4">
            
            {/* Author */}
            <div className="flex items-center gap-3">
              <img
                src={post.author.avatar}
                alt={post.author.name}
                className="w-10 h-10 rounded-full object-cover border border-stone-300 shadow-2xs"
                referrerPolicy="no-referrer"
              />
              <div>
                <div className="font-bold text-xs sm:text-sm text-stone-900">{post.author.name}</div>
                <div className="text-[11px] text-stone-500 flex items-center gap-2">
                  <span>{post.publishedAt}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {post.readTime}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Eye className="w-3 h-3" />
                    {post.viewsCount} reads
                  </span>
                </div>
              </div>
            </div>

            {/* Top Share & Reaction Controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleLike}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border text-xs font-bold transition-all ${
                  hasLiked
                    ? 'bg-rose-50 border-rose-200 text-rose-600'
                    : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-50'
                }`}
              >
                <Heart className={`w-3.5 h-3.5 ${hasLiked ? 'fill-current' : ''}`} />
                <span>{likes}</span>
              </button>

              <button
                onClick={() => setHasBookmarked(!hasBookmarked)}
                className={`p-2 rounded-full border transition-all text-xs ${
                  hasBookmarked
                    ? 'bg-amber-50 border-amber-200 text-amber-600'
                    : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-50'
                }`}
                title="Bookmark article"
              >
                <Bookmark className={`w-3.5 h-3.5 ${hasBookmarked ? 'fill-current' : ''}`} />
              </button>

              <button
                onClick={handleShareTwitter}
                className="p-2 rounded-full bg-white border border-stone-200 hover:bg-stone-50 text-stone-600 hover:text-[#1DA1F2] transition-colors"
                title="Share on X"
              >
                <Twitter className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={handleShareLinkedIn}
                className="p-2 rounded-full bg-white border border-stone-200 hover:bg-stone-50 text-stone-600 hover:text-[#0A66C2] transition-colors"
                title="Share on LinkedIn"
              >
                <Linkedin className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={handleCopyLink}
                className="flex items-center gap-1 px-3 py-1.5 bg-white border border-stone-200 hover:bg-stone-50 text-stone-700 rounded-full text-xs font-semibold transition-all"
              >
                {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedLink ? 'Copied' : 'Share'}</span>
              </button>
            </div>

          </div>

          {/* Article Full Body */}
          <div className="p-6 sm:p-10 lg:p-12 space-y-6">
            
            {/* Excerpt Lead Box */}
            <div className="p-5 bg-purple-50/70 border border-purple-100 rounded-2xl text-stone-800 text-sm sm:text-base leading-relaxed font-medium">
              <span className="font-bold text-[#6C5CE7] block mb-1 uppercase tracking-wider text-xs">Summary & Core Idea</span>
              {post.excerpt}
            </div>

            {/* Parsed Markdown Body */}
            <div className="prose prose-stone max-w-none text-stone-800">
              {renderMarkdownContent(post.contentMarkdown)}
            </div>

            {/* Tags Row */}
            <div className="pt-8 border-t border-stone-100 flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-stone-500 mr-2">Topic Tags:</span>
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-full text-xs font-semibold transition-colors"
                >
                  #{tag}
                </span>
              ))}
            </div>

            {/* Author Signature & CTA Card */}
            <div className="my-8 p-6 sm:p-8 bg-gradient-to-r from-purple-50 via-white to-rose-50 rounded-3xl border border-purple-100 flex flex-col sm:flex-row items-center gap-6">
              <img
                src={post.author.avatar}
                alt={post.author.name}
                className="w-20 h-20 rounded-3xl object-cover border-2 border-white shadow-md shrink-0"
                referrerPolicy="no-referrer"
              />
              <div className="flex-1 text-center sm:text-left">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#6C5CE7]">About the Author</span>
                <h4 className="font-serif-display text-xl font-bold text-stone-900 mt-0.5">{post.author.name}</h4>
                <p className="text-xs sm:text-sm text-stone-600 mt-1 leading-relaxed">
                  Full-stack software developer and tech creator helping developers build high-quality software, master modern TypeScript architectures, and create sustainable online income.
                </p>
                <div className="mt-4 flex flex-wrap items-center justify-center sm:justify-start gap-3">
                  <button
                    onClick={onOpenContact}
                    className="px-4 py-2 bg-[#6C5CE7] hover:bg-[#5742DE] text-white text-xs font-bold rounded-full shadow-xs transition-all cursor-pointer"
                  >
                    Get in Touch
                  </button>
                  <a
                    href={profile.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-white hover:bg-stone-100 text-stone-800 text-xs font-bold rounded-full border border-stone-200 transition-all"
                  >
                    View GitHub Repos
                  </a>
                </div>
              </div>
            </div>

            {/* Comments / Discussion */}
            <div className="pt-8 border-t border-stone-100">
              <h3 className="font-serif-display text-2xl font-bold text-stone-900 mb-6 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-[#6C5CE7]" />
                <span>Discussion ({comments.length})</span>
              </h3>

              {/* Add Comment Form */}
              <form onSubmit={handleAddComment} className="bg-stone-50 rounded-2xl p-5 border border-stone-200 mb-8">
                <h4 className="text-xs font-bold uppercase text-stone-700 mb-3">Leave a thought or question</h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                  <input
                    type="text"
                    placeholder="Your Name or Dev Handle"
                    value={newCommentName}
                    onChange={(e) => setNewCommentName(e.target.value)}
                    className="px-4 py-2.5 bg-white rounded-xl border border-stone-200 text-xs text-stone-800 focus:outline-none focus:border-[#6C5CE7]"
                  />
                </div>

                <textarea
                  rows={3}
                  required
                  placeholder="What are your thoughts on this architecture or topic? Ask a technical question or share your perspective..."
                  value={newCommentText}
                  onChange={(e) => setNewCommentText(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white rounded-xl border border-stone-200 text-xs sm:text-sm text-stone-800 focus:outline-none focus:border-[#6C5CE7] mb-3"
                />

                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-[#6C5CE7] hover:bg-[#5742DE] text-white text-xs font-bold rounded-full shadow-xs transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <span>Post Comment</span>
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
              </form>

              {/* Comments List */}
              <div className="space-y-4">
                {comments.map((c) => (
                  <div key={c.id} className="p-4 bg-stone-50/80 rounded-2xl border border-stone-100 flex items-start gap-4">
                    <img
                      src={c.avatar}
                      alt={c.author}
                      className="w-9 h-9 rounded-full object-cover border border-stone-200 shrink-0"
                      referrerPolicy="no-referrer"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs sm:text-sm text-stone-900">{c.author}</span>
                        <span className="text-[11px] text-stone-400">{c.createdAt}</span>
                      </div>
                      <p className="text-xs sm:text-sm text-stone-700 mt-1.5 leading-relaxed">{c.content}</p>
                    </div>
                  </div>
                ))}
              </div>

            </div>

          </div>
        </div>

        {/* Next to Read / Related Articles */}
        {relatedPosts.length > 0 && (
          <div className="mt-16">
            <h3 className="font-serif-display text-2xl font-bold text-stone-900 mb-6 flex items-center justify-between">
              <span>Related Articles & Guides</span>
              <button
                onClick={onBackToBlogList}
                className="text-xs font-bold text-[#6C5CE7] hover:underline"
              >
                View all articles ➔
              </button>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedPosts.map((related) => (
                <div
                  key={related.id}
                  onClick={() => onSelectPost(related)}
                  className="bg-white rounded-3xl p-5 border border-stone-200 shadow-soft hover:shadow-card hover:-translate-y-1 transition-all cursor-pointer flex flex-col justify-between group"
                >
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#6C5CE7] bg-purple-50 px-2.5 py-1 rounded-full inline-block mb-2.5">
                      {related.category}
                    </span>
                    <h4 className="font-serif-display font-bold text-stone-900 group-hover:text-[#6C5CE7] transition-colors leading-snug line-clamp-2 text-sm sm:text-base mb-2">
                      {related.title}
                    </h4>
                    <p className="text-xs text-stone-600 line-clamp-2 mb-4 leading-relaxed">
                      {related.excerpt}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
                    <span>{related.readTime}</span>
                    <span className="font-bold text-[#6C5CE7] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      <span>Read</span>
                      <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </article>
    </div>
  );
};
