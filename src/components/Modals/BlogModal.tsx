import React, { useState, useEffect } from 'react';
import { X, Clock, Heart, Bookmark, Share2, Copy, Check, MessageSquare, Send, ThumbsUp, User } from 'lucide-react';
import { BlogPost, BlogComment } from '../../types';
import { copyToClipboard } from '../../utils/safeClipboard';

interface BlogModalProps {
  post: BlogPost | null;
  onClose: () => void;
}

export const BlogModal: React.FC<BlogModalProps> = ({ post, onClose }) => {
  if (!post) return null;

  const [likes, setLikes] = useState(post.likesCount);
  const [hasLiked, setHasLiked] = useState(false);
  const [hasBookmarked, setHasBookmarked] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Comment state
  const [comments, setComments] = useState<BlogComment[]>(post.comments || []);
  const [newCommentName, setNewCommentName] = useState('');
  const [newCommentText, setNewCommentText] = useState('');

  useEffect(() => {
    if (post) {
      setLikes(post.likesCount);
      setHasLiked(false);
      setHasBookmarked(false);
      setCopiedLink(false);
      setComments(post.comments || []);
    }
  }, [post?.id]);

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

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;

    const newComment: BlogComment = {
      id: `comment-${Date.now()}`,
      author: newCommentName.trim() || 'Tech Reader',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      content: newCommentText.trim(),
      createdAt: 'Just now',
      likes: 1,
    };

    setComments([newComment, ...comments]);
    setNewCommentText('');
    setNewCommentName('');
  };

  // Render markdown format helper
  const renderMarkdownContent = (markdown: string) => {
    const lines = markdown.split('\n');
    return lines.map((line, idx) => {
      if (line.startsWith('## ')) {
        return (
          <h2 key={idx} className="font-serif-display text-2xl font-bold text-stone-900 mt-8 mb-4">
            {line.replace('## ', '')}
          </h2>
        );
      }
      if (line.startsWith('### ')) {
        return (
          <h3 key={idx} className="font-bold text-stone-900 text-lg mt-6 mb-2">
            {line.replace('### ', '')}
          </h3>
        );
      }
      if (line.startsWith('- ')) {
        return (
          <li key={idx} className="text-sm text-stone-700 leading-relaxed ml-4 list-disc mb-1">
            {line.replace('- ', '')}
          </li>
        );
      }
      if (line.startsWith('```')) {
        return null; // Handle code blocks below
      }
      if (line.trim() === '') {
        return <div key={idx} className="h-3" />;
      }
      return (
        <p key={idx} className="text-sm sm:text-base text-stone-700 leading-relaxed mb-4">
          {line}
        </p>
      );
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-stone-900/60 backdrop-blur-xs animate-fadeIn overflow-y-auto">
      <div
        className="bg-white rounded-[32px] max-w-3xl w-full shadow-2xl border border-stone-200 overflow-hidden relative animate-scaleUp my-8"
        id="blog-article-modal"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-10 h-10 rounded-full bg-white/90 backdrop-blur-md text-stone-700 hover:bg-stone-100 flex items-center justify-center shadow-md z-20 cursor-pointer transition-all hover:rotate-90"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Hero Cover */}
        <div className="relative h-64 sm:h-80 w-full overflow-hidden">
          <img
            src={post.coverImage}
            alt={post.title}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-900/80 via-stone-900/30 to-transparent" />
          
          <div className="absolute bottom-6 left-6 right-6 text-white">
            <span className="inline-block px-3 py-1 bg-[#6C5CE7] text-white text-xs font-bold rounded-full mb-3 shadow-md">
              {post.category}
            </span>
            <h1 className="font-serif-display text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight">
              {post.title}
            </h1>
          </div>
        </div>

        {/* Article Meta Bar */}
        <div className="px-6 sm:px-10 py-4 bg-stone-50 border-b border-stone-200/80 flex flex-wrap items-center justify-between gap-4 text-xs text-stone-600">
          <div className="flex items-center gap-3">
            <img
              src={post.author.avatar}
              alt={post.author.name}
              className="w-8 h-8 rounded-full object-cover border border-stone-300"
              referrerPolicy="no-referrer"
            />
            <div>
              <div className="font-bold text-stone-900">{post.author.name}</div>
              <div className="text-[10px] text-stone-500">{post.publishedAt} • {post.readTime}</div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleLike}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-full border transition-all ${
                hasLiked
                  ? 'bg-rose-50 border-rose-200 text-rose-600 font-bold'
                  : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-50'
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${hasLiked ? 'fill-current' : ''}`} />
              <span>{likes}</span>
            </button>

            <button
              onClick={() => setHasBookmarked(!hasBookmarked)}
              className={`p-1.5 rounded-full border transition-all ${
                hasBookmarked
                  ? 'bg-amber-50 border-amber-200 text-amber-600'
                  : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-50'
              }`}
              title="Bookmark article"
            >
              <Bookmark className={`w-4 h-4 ${hasBookmarked ? 'fill-current' : ''}`} />
            </button>

            <button
              onClick={handleCopyLink}
              className="flex items-center gap-1 px-3 py-1.5 bg-white border border-stone-200 hover:bg-stone-50 text-stone-700 rounded-full transition-all"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
              <span>{copiedLink ? 'Copied Link' : 'Share'}</span>
            </button>
          </div>
        </div>

        {/* Article Body */}
        <div className="p-6 sm:p-10 space-y-4">
          
          <div className="prose max-w-none text-stone-800">
            {renderMarkdownContent(post.contentMarkdown)}
          </div>

          {/* Tags */}
          <div className="pt-6 border-t border-stone-100 flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 rounded-full bg-stone-100 text-stone-700 text-xs font-semibold"
              >
                #{tag}
              </span>
            ))}
          </div>

          {/* Author Bio Card */}
          <div className="my-8 p-5 bg-purple-50 rounded-2xl border border-purple-100 flex items-center gap-4">
            <img
              src={post.author.avatar}
              alt={post.author.name}
              className="w-14 h-14 rounded-2xl object-cover border-2 border-white shadow-xs"
              referrerPolicy="no-referrer"
            />
            <div>
              <h4 className="font-bold text-stone-900 text-sm">Written by {post.author.name}</h4>
              <p className="text-xs text-stone-600 mt-0.5">
                Full-stack developer, technical writer, and creator building digital tools and sharing actionable blueprints to help developers grow.
              </p>
            </div>
          </div>

          {/* Comments Section */}
          <div className="pt-6 border-t border-stone-100">
            <h3 className="font-serif-display text-xl font-bold text-stone-900 mb-4 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-[#6C5CE7]" />
              <span>Discussion ({comments.length})</span>
            </h3>

            {/* Comment Input */}
            <form onSubmit={handleAddComment} className="bg-stone-50 rounded-2xl p-4 border border-stone-200 mb-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                <input
                  type="text"
                  placeholder="Your Name / Dev Handle"
                  value={newCommentName}
                  onChange={(e) => setNewCommentName(e.target.value)}
                  className="px-3.5 py-2 bg-white rounded-xl border border-stone-200 text-xs text-stone-800 focus:outline-none focus:border-[#6C5CE7]"
                />
              </div>
              <textarea
                rows={3}
                placeholder="Share your thoughts, ask a technical question, or leave feedback..."
                value={newCommentText}
                onChange={(e) => setNewCommentText(e.target.value)}
                className="w-full px-3.5 py-2 bg-white rounded-xl border border-stone-200 text-xs text-stone-800 focus:outline-none focus:border-[#6C5CE7] mb-3"
              />
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#6C5CE7] hover:bg-[#5742DE] text-white text-xs font-bold rounded-full shadow-md transition-all flex items-center gap-1.5"
                >
                  <span>Post Comment</span>
                  <Send className="w-3 h-3" />
                </button>
              </div>
            </form>

            {/* Comments List */}
            <div className="space-y-3">
              {comments.map((c) => (
                <div key={c.id} className="p-3.5 bg-stone-50/70 rounded-xl border border-stone-100 flex items-start gap-3">
                  <img
                    src={c.avatar}
                    alt={c.author}
                    className="w-8 h-8 rounded-full object-cover border border-stone-200 shrink-0"
                    referrerPolicy="no-referrer"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-stone-900">{c.author}</span>
                      <span className="text-[10px] text-stone-400">{c.createdAt}</span>
                    </div>
                    <p className="text-xs text-stone-700 mt-1 leading-relaxed">{c.content}</p>
                  </div>
                </div>
              ))}
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};
