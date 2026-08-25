import React, { useState } from 'react';
import { Send, Plus, Minus, Mail, Sparkles, MessageCircle } from 'lucide-react';
import { FAQItem } from '../types';
import cuteEnvelopeHeartImg from '../assets/images/cute_envelope_heart_1787669669793.jpg';

interface CTAAndFAQSectionProps {
  faqs: FAQItem[];
  onOpenContact: () => void;
}

export const CTAAndFAQSection: React.FC<CTAAndFAQSectionProps> = ({
  faqs,
  onOpenContact,
}) => {
  const [openFaqId, setOpenFaqId] = useState<string | null>(faqs[0]?.id || null);

  const toggleFaq = (id: string) => {
    setOpenFaqId((prev) => (prev === id ? null : id));
  };

  return (
    <section id="faq" className="py-16 bg-[#FFF8F3] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Coral / Orange Banner Card matching template */}
        <div
          className="rounded-[36px] bg-gradient-to-r from-[#FF7675] via-[#FF807F] to-[#FF8E8D] p-8 sm:p-12 lg:p-14 text-white shadow-glow-coral relative overflow-hidden"
          id="cta-faq-banner"
        >
          {/* Subtle Background Shapes */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-10 -left-10 w-72 h-72 bg-amber-400/20 rounded-full blur-2xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center relative z-10">
            
            {/* Left Column: CTA Pitch */}
            <div className="lg:col-span-5 flex flex-col items-start text-left">
              <span className="text-xs font-bold tracking-widest uppercase text-white/80 bg-white/15 px-3.5 py-1 rounded-full mb-4">
                Let's Create Together
              </span>

              <h2 className="font-serif-display text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight mb-4 text-white">
                Have a project in mind?{' '}
                <span className="block italic text-amber-100">
                  Let's bring it to life!
                </span>
              </h2>

              {/* Squiggly line accent */}
              <div className="mb-8 text-white/70">
                <svg width="120" height="12" viewBox="0 0 120 12" fill="none">
                  <path d="M2 6 Q 15 1, 30 6 T 60 6 T 90 6 T 118 6" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
                </svg>
              </div>

              <button
                onClick={onOpenContact}
                className="inline-flex items-center gap-3 px-8 py-4 text-sm sm:text-base font-bold text-stone-900 bg-white hover:bg-stone-50 rounded-full shadow-lg hover:shadow-2xl hover:scale-105 active:scale-98 transition-all cursor-pointer group"
                id="btn-cta-send-message"
              >
                <span>Send Me a Message</span>
                <span className="w-7 h-7 rounded-full bg-[#FF7675] text-white flex items-center justify-center group-hover:translate-x-1 transition-transform">
                  <Send className="w-3.5 h-3.5" />
                </span>
              </button>
            </div>

            {/* Right Column: Quick Questions FAQ Accordion + Floating Envelope */}
            <div className="lg:col-span-7 bg-white text-stone-800 rounded-[28px] p-6 sm:p-8 shadow-xl relative">
              
              <div className="flex items-center justify-between mb-6 pb-3 border-b border-stone-100">
                <div>
                  <h3 className="font-bold text-stone-900 text-lg sm:text-xl">
                    Quick Questions
                  </h3>
                  <p className="text-xs text-stone-500">Frequently asked by clients & builders</p>
                </div>

                {/* Floating 3D Envelope Asset */}
                <div className="w-12 h-12 rounded-2xl bg-orange-50 p-1 shadow-xs border border-orange-100 hidden sm:block">
                  <img
                    src={cuteEnvelopeHeartImg}
                    alt="letter"
                    className="w-full h-full object-cover rounded-xl"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>

              {/* Accordion List */}
              <div className="space-y-3">
                {faqs.slice(0, 4).map((faq) => {
                  const isOpen = openFaqId === faq.id;
                  return (
                    <div
                      key={faq.id}
                      className="border border-stone-100 rounded-2xl overflow-hidden transition-colors hover:border-purple-200"
                    >
                      <button
                        onClick={() => toggleFaq(faq.id)}
                        className="w-full py-3.5 px-4 text-left font-semibold text-xs sm:text-sm text-stone-800 flex items-center justify-between gap-3 hover:text-[#6C5CE7] transition-colors"
                      >
                        <span>{faq.question}</span>
                        <span className="w-6 h-6 rounded-full bg-stone-100 text-stone-600 flex items-center justify-center shrink-0">
                          {isOpen ? <Minus className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                        </span>
                      </button>

                      {isOpen && (
                        <div className="px-4 pb-4 text-xs text-stone-600 leading-relaxed bg-stone-50/50 pt-1 animate-fadeIn">
                          {faq.answer}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
