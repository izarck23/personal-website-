import React, { useState, useEffect } from 'react';
import { X, Send, Mail, CheckCircle2, Sparkles, MessageSquare, Clock, DollarSign, Calendar } from 'lucide-react';
import { ProfileConfig } from '../../types';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: ProfileConfig;
  initialTopic?: string;
}

export const ContactModal: React.FC<ContactModalProps> = ({
  isOpen,
  onClose,
  profile,
  initialTopic = '',
}) => {
  if (!isOpen) return null;

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [serviceType, setServiceType] = useState('Full-Stack Web App');
  const [budget, setBudget] = useState('$1,500 - $3,000');
  const [timeline, setTimeline] = useState('2-4 Weeks');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialTopic) {
      setMessage((prev) => (prev ? `${prev}\n\n[Context: ${initialTopic}]` : `Hi ${profile.creatorName}! I'm interested in: ${initialTopic}`));
    }
  }, [initialTopic, profile.creatorName]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !name.trim()) return;

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 900);
  };

  const handleReset = () => {
    setSubmitted(false);
    setName('');
    setEmail('');
    setMessage('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-stone-900/60 backdrop-blur-xs animate-fadeIn overflow-y-auto">
      <div
        className="bg-white rounded-[32px] max-w-xl w-full shadow-2xl border border-stone-200 overflow-hidden relative animate-scaleUp my-8"
        id="contact-form-modal"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-10 h-10 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 flex items-center justify-center shadow-xs z-20 cursor-pointer transition-all hover:rotate-90"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="p-8 sm:p-12 text-center space-y-4 animate-fadeIn">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-md">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <h3 className="font-serif-display text-3xl font-bold text-stone-900">
              Message Received! 🚀
            </h3>

            <p className="text-sm text-stone-600 max-w-sm mx-auto leading-relaxed">
              Thank you, <span className="font-bold text-stone-900">{name}</span>! I've received your project inquiry and will reply to <span className="font-bold text-[#6C5CE7]">{email}</span> within 24 hours.
            </p>

            <div className="pt-6">
              <button
                onClick={handleReset}
                className="px-8 py-3 bg-[#6C5CE7] hover:bg-[#5742DE] text-white font-bold text-sm rounded-full shadow-md transition-all cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          <div>
            {/* Header Banner */}
            <div className="p-6 sm:p-8 bg-gradient-to-r from-[#FF7675] to-[#FF8E8D] text-white">
              <span className="text-xs font-bold uppercase tracking-wider bg-white/20 px-3 py-1 rounded-full mb-2 inline-block">
                Start a Conversation
              </span>
              <h2 className="font-serif-display text-2xl sm:text-3xl font-bold">
                Let's build something extraordinary.
              </h2>
              <p className="text-xs sm:text-sm text-white/90 mt-1">
                Tell me about your project, idea, or tech challenge.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-4 text-left">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sarah Jenkins"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm text-stone-800 focus:outline-none focus:border-[#6C5CE7] focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                    Your Email *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. sarah@startup.io"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm text-stone-800 focus:outline-none focus:border-[#6C5CE7] focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                    Project / Service Type
                  </label>
                  <select
                    value={serviceType}
                    onChange={(e) => setServiceType(e.target.value)}
                    className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm text-stone-800 focus:outline-none focus:border-[#6C5CE7]"
                  >
                    <option value="Full-Stack Web App">Full-Stack Web App</option>
                    <option value="Mobile Native App">Mobile Native App</option>
                    <option value="Cloud / API Backend">Cloud / API Architecture</option>
                    <option value="Tech Mentorship & Monetization">Tech Mentorship & Monetization</option>
                    <option value="Codebase Audit">Codebase & Performance Audit</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                    Estimated Budget
                  </label>
                  <select
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm text-stone-800 focus:outline-none focus:border-[#6C5CE7]"
                  >
                    <option value="$800 - $1,500">$800 - $1,500</option>
                    <option value="$1,500 - $3,000">$1,500 - $3,000</option>
                    <option value="$3,000 - $6,000">$3,000 - $6,000</option>
                    <option value="$6,000+">$6,000+</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                  Project Details / Message
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Share key requirements, goals, target deadline, or links to existing designs/code..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm text-stone-800 focus:outline-none focus:border-[#6C5CE7] focus:bg-white"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 px-6 bg-gradient-to-r from-[#FF7675] to-[#FF8E8D] hover:from-[#e7605f] hover:to-[#ff7b7a] text-white font-bold text-sm rounded-full shadow-glow-coral transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
                >
                  {loading ? (
                    <span className="inline-block animate-spin">⚡</span>
                  ) : (
                    <>
                      <span>Send Project Request</span>
                      <Send className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>

              {/* Direct email note */}
              <p className="text-[11px] text-center text-stone-400 mt-2">
                Or email directly at{' '}
                <a href={`mailto:${profile.email}`} className="text-[#6C5CE7] font-semibold underline">
                  {profile.email}
                </a>
              </p>

            </form>
          </div>
        )}

      </div>
    </div>
  );
};
