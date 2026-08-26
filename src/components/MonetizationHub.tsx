import React, { useState } from 'react';
import { DollarSign, Download, Calendar, Zap, Check, Star, ShieldCheck, Sparkles, ArrowRight, Calculator } from 'lucide-react';
import { MonetizationProduct } from '../types';

interface MonetizationHubProps {
  products: MonetizationProduct[];
  onOpenContact: (prefillTopic?: string) => void;
}

export const MonetizationHub: React.FC<MonetizationHubProps> = ({
  products,
  onOpenContact,
}) => {
  // Interactive Project Cost Estimator State
  const [projectType, setProjectType] = useState<'mvp' | 'fullstack' | 'mobile' | 'audit'>('fullstack');
  const [timelineSpeed, setTimelineSpeed] = useState<'standard' | 'express'>('standard');
  const [includeAuth, setIncludeAuth] = useState(true);
  const [includePayments, setIncludePayments] = useState(true);
  const [includeAI, setIncludeAI] = useState(false);

  // Calculate estimated price
  const calculateEstimate = () => {
    let base = 1200;
    if (projectType === 'mvp') base = 800;
    if (projectType === 'fullstack') base = 1600;
    if (projectType === 'mobile') base = 1900;
    if (projectType === 'audit') base = 450;

    if (includeAuth) base += 200;
    if (includePayments) base += 300;
    if (includeAI) base += 350;
    if (timelineSpeed === 'express') base *= 1.25;

    return Math.round(base);
  };

  const [checkoutSimulatedProduct, setCheckoutSimulatedProduct] = useState<MonetizationProduct | null>(null);
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);

  const handleSimulatePurchase = () => {
    setCheckoutSuccess(true);
  };

  const handleCloseCheckout = () => {
    setCheckoutSimulatedProduct(null);
    setCheckoutSuccess(false);
  };

  return (
    <section id="monetize" className="py-24 bg-[#FFF8F3] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-3">
            <DollarSign className="w-3.5 h-3.5" />
            <span>Monetization & Developer Store</span>
          </div>

          <h2 className="font-serif-display text-3xl sm:text-4xl md:text-5xl font-bold text-stone-900 tracking-tight">
            Digital Products & Services
          </h2>
          <p className="text-stone-600 mt-3 text-sm sm:text-base leading-relaxed">
            Accelerate your tech build with battle-tested boilerplates, playbooks, and direct 1-on-1 code mentorship.
          </p>
        </div>

        {/* Digital Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {products.map((prod) => (
            <div
              key={prod.id}
              className="bg-white rounded-[32px] p-7 shadow-soft hover:shadow-card hover:-translate-y-1.5 transition-all duration-300 border border-stone-200/80 flex flex-col justify-between relative group"
            >
              <div>
                {/* Badge */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-orange-100 text-orange-700">
                    {prod.badge}
                  </span>
                  <div className="flex items-center gap-1 text-xs font-bold text-amber-500">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span>{prod.popularityRating}</span>
                    <span className="text-stone-400 font-normal">({prod.salesCount}+ devs)</span>
                  </div>
                </div>

                {/* Title */}
                <h3 className="font-bold text-stone-900 text-xl mb-2 group-hover:text-[#6C5CE7] transition-colors">
                  {prod.title}
                </h3>

                {/* Price */}
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="font-serif-display text-3xl font-bold text-stone-900">
                    {prod.price}
                  </span>
                  <span className="text-xs text-stone-500">one-time / instant access</span>
                </div>

                {/* Description */}
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed mb-6">
                  {prod.description}
                </p>

                {/* Feature checklist */}
                <div className="space-y-2 mb-6">
                  {prod.features.map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-stone-700">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action button */}
              <div className="pt-4 border-t border-stone-100">
                <button
                  onClick={() => setCheckoutSimulatedProduct(prod)}
                  className="w-full py-3 px-4 bg-stone-900 hover:bg-[#6C5CE7] text-white font-bold text-xs sm:text-sm rounded-full shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Get Instant Access</span>
                </button>
                <p className="text-[10px] text-center text-stone-400 mt-2 flex items-center justify-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-500" />
                  <span>14-day money-back guarantee • Secure checkout</span>
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Interactive Freelance & Project Quote Estimator Widget */}
        <div className="bg-white rounded-[36px] p-8 sm:p-12 shadow-card border border-purple-100 max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-stone-100">
            <div className="w-10 h-10 rounded-2xl bg-purple-100 text-[#6C5CE7] flex items-center justify-center">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif-display text-2xl font-bold text-stone-900">
                Interactive Project Quote Estimator
              </h3>
              <p className="text-xs sm:text-sm text-stone-500">
                Calculate an instant price estimate for custom web & mobile software development.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            
            {/* Options Column */}
            <div className="md:col-span-7 space-y-5">
              
              {/* Project Type */}
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
                  1. Project Scope
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'mvp', label: 'Starter MVP ($800+)' },
                    { id: 'fullstack', label: 'Full-Stack Web ($1.6K+)' },
                    { id: 'mobile', label: 'Mobile Native ($1.9K+)' },
                    { id: 'audit', label: 'Codebase Audit ($450+)' }
                  ].map((type) => (
                    <button
                      key={type.id}
                      onClick={() => setProjectType(type.id as any)}
                      className={`py-2 px-3 text-xs font-semibold rounded-xl border text-left transition-all ${
                        projectType === type.id
                          ? 'border-[#6C5CE7] bg-purple-50 text-[#6C5CE7]'
                          : 'border-stone-200 text-stone-700 hover:bg-stone-50'
                      }`}
                    >
                      {type.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Add-ons */}
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
                  2. Modules & Integrations
                </label>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setIncludeAuth(!includeAuth)}
                    className={`py-1.5 px-3 rounded-full text-xs font-medium border flex items-center gap-1.5 transition-all ${
                      includeAuth
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                        : 'bg-stone-50 text-stone-600 border-stone-200'
                    }`}
                  >
                    {includeAuth && <Check className="w-3 h-3" />}
                    <span>Auth & User Roles (+$200)</span>
                  </button>

                  <button
                    onClick={() => setIncludePayments(!includePayments)}
                    className={`py-1.5 px-3 rounded-full text-xs font-medium border flex items-center gap-1.5 transition-all ${
                      includePayments
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                        : 'bg-stone-50 text-stone-600 border-stone-200'
                    }`}
                  >
                    {includePayments && <Check className="w-3 h-3" />}
                    <span>Stripe Billing & Webhooks (+$300)</span>
                  </button>

                  <button
                    onClick={() => setIncludeAI(!includeAI)}
                    className={`py-1.5 px-3 rounded-full text-xs font-medium border flex items-center gap-1.5 transition-all ${
                      includeAI
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                        : 'bg-stone-50 text-stone-600 border-stone-200'
                    }`}
                  >
                    {includeAI && <Check className="w-3 h-3" />}
                    <span>AI & Gemini LLM Engine (+$350)</span>
                  </button>
                </div>
              </div>

              {/* Timeline Speed */}
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
                  3. Timeline Speed
                </label>
                <div className="flex gap-3">
                  <button
                    onClick={() => setTimelineSpeed('standard')}
                    className={`flex-1 py-2 px-3 text-xs font-semibold rounded-xl border transition-all ${
                      timelineSpeed === 'standard'
                        ? 'border-[#6C5CE7] bg-purple-50 text-[#6C5CE7]'
                        : 'border-stone-200 text-stone-700'
                    }`}
                  >
                    Standard (2-4 Weeks)
                  </button>
                  <button
                    onClick={() => setTimelineSpeed('express')}
                    className={`flex-1 py-2 px-3 text-xs font-semibold rounded-xl border transition-all ${
                      timelineSpeed === 'express'
                        ? 'border-orange-500 bg-orange-50 text-orange-700'
                        : 'border-stone-200 text-stone-700'
                    }`}
                  >
                    ⚡ Express Sprint (7-10 Days)
                  </button>
                </div>
              </div>

            </div>

            {/* Estimated Price Card */}
            <div className="md:col-span-5 bg-gradient-to-br from-stone-900 to-purple-950 text-white rounded-3xl p-6 shadow-xl text-center flex flex-col justify-between">
              <div>
                <span className="text-[11px] font-mono tracking-widest text-purple-300 uppercase">
                  Estimated Investment
                </span>
                <div className="font-serif-display text-4xl sm:text-5xl font-bold my-2 text-amber-300">
                  ${calculateEstimate().toLocaleString()}
                </div>
                <p className="text-xs text-stone-300">
                  Includes full source code, documentation, and 30-day post-launch support warranty.
                </p>
              </div>

              <button
                onClick={() => onOpenContact(`Project Scope: ${projectType}, Estimate: $${calculateEstimate()}`)}
                className="mt-6 w-full py-3.5 px-4 bg-gradient-to-r from-[#FF7675] to-[#FF8E8D] text-white font-bold text-sm rounded-full shadow-glow-coral hover:scale-105 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Book This Project Scope</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>
        </div>

      </div>

      {/* Simulated Product Checkout Modal */}
      {checkoutSimulatedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-stone-200 animate-scaleUp">
            {checkoutSuccess ? (
              <div className="text-center space-y-4 animate-fadeIn">
                <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
                  <ShieldCheck className="w-8 h-8" />
                </div>

                <h3 className="font-serif-display text-2xl font-bold text-stone-900">
                  Demo Order Complete! 🎉
                </h3>

                <p className="text-xs text-stone-600 leading-relaxed">
                  You've simulated unlocking <span className="font-bold text-stone-900">{checkoutSimulatedProduct.title}</span>. In production, this instantly delivers your download link and webhook-generated GitHub repository invite.
                </p>

                <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-[11px] text-stone-600 font-mono break-all text-left">
                  <div className="text-[10px] uppercase font-bold text-stone-400 font-sans mb-1">Demo License Key</div>
                  <code>CTECH-{checkoutSimulatedProduct.id.toUpperCase()}-{(Math.random() * 100000).toFixed(0)}</code>
                </div>

                <div className="pt-2 flex gap-3">
                  <button
                    onClick={handleCloseCheckout}
                    className="w-full py-3 text-xs font-bold text-white bg-[#6C5CE7] hover:bg-[#5742DE] rounded-full shadow-md transition-all cursor-pointer"
                  >
                    Done Exploring
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-4">
                  <Download className="w-6 h-6" />
                </div>

                <h3 className="font-serif-display text-2xl font-bold text-center text-stone-900 mb-1">
                  {checkoutSimulatedProduct.title}
                </h3>
                <div className="text-center font-bold text-emerald-600 text-xl mb-4">
                  {checkoutSimulatedProduct.price}
                </div>

                <p className="text-xs text-stone-600 text-center mb-6">
                  You are accessing the digital download package. In production, this connects to Stripe Checkout with instant license key fulfillment.
                </p>

                <div className="bg-stone-50 rounded-2xl p-4 mb-6 text-xs space-y-2 border border-stone-100">
                  <div className="flex justify-between text-stone-600">
                    <span>Product Type:</span>
                    <span className="font-bold text-stone-800">{checkoutSimulatedProduct.type}</span>
                  </div>
                  <div className="flex justify-between text-stone-600">
                    <span>Delivery:</span>
                    <span className="font-bold text-stone-800">{checkoutSimulatedProduct.deliveryTime}</span>
                  </div>
                  <div className="flex justify-between text-stone-600">
                    <span>License:</span>
                    <span className="font-bold text-stone-800">Commercial Single/Team</span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={handleCloseCheckout}
                    className="flex-1 py-3 text-xs font-bold text-stone-600 bg-stone-100 hover:bg-stone-200 rounded-full transition-all cursor-pointer"
                  >
                    Close
                  </button>
                  <button
                    onClick={handleSimulatePurchase}
                    className="flex-1 py-3 text-xs font-bold text-white bg-[#6C5CE7] hover:bg-[#5742DE] rounded-full shadow-md transition-all cursor-pointer"
                  >
                    Simulate Purchase
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
};
