import React from 'react';
import { Monitor, Smartphone, Server, Palette, ArrowRight, Check, Sparkles, Heart } from 'lucide-react';
import { ServiceItem } from '../types';

interface ServicesSectionProps {
  services: ServiceItem[];
  onSelectService: (service: ServiceItem) => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({
  services,
  onSelectService,
}) => {
  const getServiceIcon = (iconName: string) => {
    switch (iconName) {
      case 'Monitor':
        return <Monitor className="w-6 h-6 text-[#6C5CE7]" />;
      case 'Smartphone':
        return <Smartphone className="w-6 h-6 text-[#FF7675]" />;
      case 'Server':
        return <Server className="w-6 h-6 text-[#0984E3]" />;
      case 'Palette':
        return <Palette className="w-6 h-6 text-[#F39C12]" />;
      default:
        return <Monitor className="w-6 h-6 text-[#6C5CE7]" />;
    }
  };

  const getBadgeStyle = (index: number) => {
    switch (index) {
      case 0:
        return {
          iconBg: 'bg-purple-100',
          btnBg: 'bg-[#6C5CE7]',
        };
      case 1:
        return {
          iconBg: 'bg-rose-100',
          btnBg: 'bg-[#FF7675]',
        };
      case 2:
        return {
          iconBg: 'bg-indigo-100',
          btnBg: 'bg-[#5742DE]',
        };
      case 3:
        return {
          iconBg: 'bg-amber-100',
          btnBg: 'bg-[#F39C12]',
        };
      default:
        return {
          iconBg: 'bg-purple-100',
          btnBg: 'bg-[#6C5CE7]',
        };
    }
  };

  return (
    <section id="services" className="py-24 bg-[#FFF8F3] relative overflow-hidden">
      {/* Decorative background stars */}
      <div className="absolute top-12 left-8 text-amber-400 opacity-60">
        <Sparkles className="w-5 h-5" />
      </div>
      <div className="absolute bottom-12 right-8 text-rose-400 opacity-60">
        <Heart className="w-5 h-5 fill-current" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#FFEAE6] text-[#E76F51] text-xs font-bold uppercase tracking-wider mb-3">
            <span>What I Do</span>
          </div>

          <h2 className="font-serif-display text-3xl sm:text-4xl md:text-5xl font-bold text-stone-900 tracking-tight flex items-center justify-center gap-2">
            <span>Services I can help you with</span>
            <span className="text-rose-500 font-sans text-2xl sm:text-3xl">🤍</span>
          </h2>
        </div>

        {/* 4 Cards Grid matching template */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => {
            const styles = getBadgeStyle(index);
            return (
              <div
                key={service.id}
                onClick={() => onSelectService(service)}
                className="bg-white rounded-3xl p-6 shadow-soft hover:shadow-card hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between border border-stone-200/80 cursor-pointer group"
                id={`service-card-${service.id}`}
              >
                <div>
                  {/* Icon Box */}
                  <div
                    className={`w-14 h-14 rounded-2xl ${styles.iconBg} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}
                  >
                    {getServiceIcon(service.iconName)}
                  </div>

                  {/* Title */}
                  <h3 className="font-bold text-stone-900 text-lg mb-2.5 group-hover:text-[#6C5CE7] transition-colors">
                    {service.title}
                  </h3>

                  {/* Description */}
                  <p className="text-xs sm:text-sm text-stone-600 leading-relaxed mb-6">
                    {service.description}
                  </p>
                </div>

                {/* Bottom Arrow Button */}
                <div className="flex items-center justify-between pt-4 border-t border-stone-100">
                  <span className="text-xs font-bold text-stone-500">From {service.startingPrice}</span>
                  <div
                    className={`w-8 h-8 rounded-full ${styles.btnBg} text-white flex items-center justify-center shadow-md group-hover:scale-110 transition-transform`}
                  >
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
