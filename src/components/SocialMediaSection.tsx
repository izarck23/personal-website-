import React, { useState } from 'react';
import {
  Github,
  Linkedin,
  Twitter,
  Youtube,
  MessageSquare,
  Mail,
  ExternalLink,
  Copy,
  Check,
  Sparkles,
  Share2,
  Users,
  Globe,
  Radio
} from 'lucide-react';
import { socialLinksData } from '../data/portfolioData';
import { ProfileConfig } from '../types';
import { copyToClipboard } from '../utils/safeClipboard';

interface SocialMediaSectionProps {
  profile: ProfileConfig;
  onOpenContact: () => void;
}

export const SocialMediaSection: React.FC<SocialMediaSectionProps> = ({
  profile,
  onOpenContact,
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Github':
        return <Github className="w-5 h-5" />;
      case 'Linkedin':
        return <Linkedin className="w-5 h-5" />;
      case 'Twitter':
        return <Twitter className="w-5 h-5" />;
      case 'Youtube':
        return <Youtube className="w-5 h-5" />;
      case 'Discord':
        return <MessageSquare className="w-5 h-5" />;
      case 'Mail':
        return <Mail className="w-5 h-5" />;
      default:
        return <Globe className="w-5 h-5" />;
    }
  };

  const handleCopy = async (id: string, text: string) => {
    await copyToClipboard(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  return (
    <section id="social" className="py-20 bg-gradient-to-b from-[#FAF5FF] via-[#FFF8F3] to-[#FAF5FF] relative overflow-hidden border-t border-b border-stone-200/60">
      {/* Background Decorative Blob */}
      <div className="absolute top-0 right-10 w-96 h-96 bg-purple-100/50 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-80 h-80 bg-rose-100/40 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-purple-100 text-[#6C5CE7] text-xs font-bold uppercase tracking-wider mb-3">
            <Radio className="w-3.5 h-3.5 text-[#FF7675] animate-pulse" />
            <span>Community & Online Presence</span>
          </div>

          <h2 className="font-serif-display text-3xl sm:text-4xl md:text-5xl font-bold text-stone-900 tracking-tight">
            Connect with {profile.brandName}
          </h2>

          <p className="text-stone-600 mt-3 text-sm sm:text-base leading-relaxed">
            Follow along for open-source codebases, daily engineering breakdowns, YouTube tutorials, and live community discussions.
          </p>
        </div>

        {/* Social Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {socialLinksData.map((social) => {
            const isEmail = social.id === 'email';
            const isCopied = copiedId === social.id;

            return (
              <div
                key={social.id}
                className="bg-white rounded-[28px] p-6 border border-stone-200/80 shadow-soft hover:shadow-card hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between group relative overflow-hidden"
                id={`social-card-${social.id}`}
              >
                {/* Accent Top Border Bar */}
                <div
                  className="absolute top-0 left-0 right-0 h-1.5 opacity-80 group-hover:opacity-100 transition-opacity"
                  style={{ backgroundColor: social.color }}
                />

                <div>
                  {/* Top Bar: Icon & Badge */}
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform"
                      style={{ backgroundColor: social.color }}
                    >
                      {getIcon(social.iconName)}
                    </div>

                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 bg-stone-50 border border-stone-100 text-stone-600 rounded-full">
                      {social.badge}
                    </span>
                  </div>

                  {/* Platform Name & Handle */}
                  <div className="mb-2">
                    <h3 className="font-serif-display text-xl font-bold text-stone-900 group-hover:text-[#6C5CE7] transition-colors">
                      {social.name}
                    </h3>
                    <p className="text-xs font-semibold text-stone-500 font-mono mt-0.5">
                      {social.handle}
                    </p>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-stone-600 leading-relaxed mb-4">
                    {social.description}
                  </p>
                </div>

                {/* Footer Bar: Stats & Direct Actions */}
                <div className="pt-4 border-t border-stone-100 flex items-center justify-between gap-2 mt-2">
                  <div className="text-[11px] font-bold text-stone-500 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-[#FF7675]" />
                    <span>{social.stats}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Copy Handle Button */}
                    <button
                      onClick={() => handleCopy(social.id, isEmail ? profile.email : social.url)}
                      className="p-2 rounded-xl bg-stone-50 hover:bg-stone-100 text-stone-600 hover:text-stone-900 border border-stone-200 transition-all text-xs"
                      title={isCopied ? 'Copied to clipboard' : 'Copy link / handle'}
                    >
                      {isCopied ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>

                    {/* Follow / Open Button */}
                    {isEmail ? (
                      <button
                        onClick={onOpenContact}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-white shadow-xs transition-all hover:scale-105 active:scale-95"
                        style={{ backgroundColor: social.color }}
                      >
                        <span>Send Message</span>
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    ) : (
                      <a
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-white shadow-xs transition-all hover:scale-105 active:scale-95"
                        style={{ backgroundColor: social.color }}
                      >
                        <span>Visit</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>

              </div>
            );
          })}
        </div>

        {/* Fast Action Banner */}
        <div className="mt-12 bg-white rounded-[32px] p-6 sm:p-8 border border-stone-200/90 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 border border-purple-100 text-[#6C5CE7] flex items-center justify-center shrink-0">
              <Share2 className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-stone-900 text-sm sm:text-base">
                Share codertech with other developers
              </h4>
              <p className="text-xs text-stone-600 mt-0.5">
                Recommend the portfolio, open-source projects, and articles with your network.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={() => handleCopy('portfolio-share', window.location.origin)}
              className="flex-1 sm:flex-none px-5 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-full text-xs font-bold transition-all flex items-center justify-center gap-2 border border-stone-200"
            >
              {copiedId === 'portfolio-share' ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Link Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Portfolio Link</span>
                </>
              )}
            </button>

            <button
              onClick={onOpenContact}
              className="flex-1 sm:flex-none px-6 py-2.5 bg-[#FF7675] hover:bg-[#e7605f] text-white rounded-full text-xs font-bold shadow-glow-coral transition-all hover:scale-105 active:scale-95"
            >
              Start Collaboration
            </button>
          </div>
        </div>

      </div>
    </section>
  );
};
