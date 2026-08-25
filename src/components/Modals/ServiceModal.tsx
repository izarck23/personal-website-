import React from 'react';
import { X, Check, Clock, DollarSign, Target, Send } from 'lucide-react';
import { ServiceItem } from '../../types';

interface ServiceModalProps {
  service: ServiceItem | null;
  onClose: () => void;
  onInquire: (serviceTitle: string) => void;
}

export const ServiceModal: React.FC<ServiceModalProps> = ({
  service,
  onClose,
  onInquire,
}) => {
  if (!service) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-stone-900/60 backdrop-blur-xs animate-fadeIn overflow-y-auto">
      <div
        className="bg-white rounded-[32px] max-w-xl w-full shadow-2xl border border-stone-200 overflow-hidden relative animate-scaleUp my-8"
        id="service-detail-modal"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-10 h-10 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 flex items-center justify-center shadow-xs z-20 cursor-pointer transition-all hover:rotate-90"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div
          className="p-6 sm:p-8 text-white relative overflow-hidden"
          style={{ backgroundColor: service.accentColor }}
        >
          <span className="text-xs font-bold uppercase tracking-wider bg-white/20 px-3 py-1 rounded-full mb-2 inline-block">
            Service Scope
          </span>
          <h2 className="font-serif-display text-2xl sm:text-3xl font-bold">
            {service.title}
          </h2>
          <p className="text-xs sm:text-sm text-white/90 mt-1">
            {service.description}
          </p>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8 space-y-6 text-stone-800">
          
          {/* Quick Metrics */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-stone-50 rounded-2xl p-3.5 border border-stone-100 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-purple-100 text-[#6C5CE7] flex items-center justify-center">
                <DollarSign className="w-4 h-4" />
              </div>
              <div>
                <div className="text-[10px] text-stone-400 font-bold uppercase">Pricing</div>
                <div className="text-sm font-bold text-stone-900">{service.startingPrice}</div>
              </div>
            </div>

            <div className="bg-stone-50 rounded-2xl p-3.5 border border-stone-100 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-rose-100 text-[#FF7675] flex items-center justify-center">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <div className="text-[10px] text-stone-400 font-bold uppercase">Estimated Timeline</div>
                <div className="text-sm font-bold text-stone-900">{service.estimatedTimeline}</div>
              </div>
            </div>
          </div>

          {/* Ideal For */}
          <div>
            <h3 className="font-bold text-stone-900 text-sm mb-1.5 flex items-center gap-2">
              <Target className="w-4 h-4 text-[#6C5CE7]" />
              <span>Ideal For</span>
            </h3>
            <p className="text-xs sm:text-sm text-stone-600 bg-purple-50/50 p-3.5 rounded-xl border border-purple-100">
              {service.idealFor}
            </p>
          </div>

          {/* Key Deliverables */}
          <div>
            <h3 className="font-bold text-stone-900 text-sm mb-3">
              What's Included in This Package
            </h3>
            <div className="space-y-2">
              {service.features.map((feat, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-stone-700">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Action */}
          <div className="pt-4 border-t border-stone-100 flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-3 text-xs font-bold text-stone-600 bg-stone-100 hover:bg-stone-200 rounded-full transition-all"
            >
              Close
            </button>
            <button
              onClick={() => {
                onClose();
                onInquire(`Inquiry for ${service.title}`);
              }}
              className="flex-1 py-3 text-xs font-bold text-white bg-gradient-to-r from-[#FF7675] to-[#FF8E8D] hover:from-[#e7605f] hover:to-[#ff7b7a] rounded-full shadow-glow-coral transition-all flex items-center justify-center gap-2"
            >
              <span>Inquire for This Service</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
