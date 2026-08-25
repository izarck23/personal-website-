import React, { useState } from 'react';
import { Quote, ChevronLeft, ChevronRight, Star, Heart } from 'lucide-react';
import { Testimonial } from '../types';

interface TestimonialsSectionProps {
  testimonials: Testimonial[];
}

export const TestimonialsSection: React.FC<TestimonialsSectionProps> = ({
  testimonials,
}) => {
  const [startIndex, setStartIndex] = useState(0);

  const nextTestimonials = () => {
    setStartIndex((prev) => (prev + 1 >= testimonials.length - 2 ? 0 : prev + 1));
  };

  const prevTestimonials = () => {
    setStartIndex((prev) => (prev <= 0 ? Math.max(0, testimonials.length - 3) : prev - 1));
  };

  const visibleTestimonials = testimonials.slice(startIndex, startIndex + 3);

  return (
    <section id="testimonials" className="py-20 bg-gradient-to-b from-[#FFF8F3] via-[#F4EFFB] to-[#FFF8F3] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Controls & Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-purple-100 text-[#6C5CE7] text-xs font-bold uppercase tracking-wider mb-3">
              <span>Kind Words</span>
            </div>
            <h2 className="font-serif-display text-3xl sm:text-4xl md:text-5xl font-bold text-stone-900 tracking-tight">
              What clients say
            </h2>
          </div>

          {/* Navigation Arrows */}
          <div className="flex items-center gap-2 mt-4 sm:mt-0">
            <button
              onClick={prevTestimonials}
              className="w-9 h-9 rounded-full bg-white border border-stone-200 text-stone-700 hover:bg-stone-50 flex items-center justify-center shadow-xs active:scale-95 transition-all"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={nextTestimonials}
              className="w-9 h-9 rounded-full bg-white border border-stone-200 text-stone-700 hover:bg-stone-50 flex items-center justify-center shadow-xs active:scale-95 transition-all"
              aria-label="Next testimonial"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content Layout: 3D Mug Mascot on Left + Cards on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: 3D Cute Coffee Mug Mascot */}
          <div className="lg:col-span-3 flex justify-center">
            <div className="relative w-44 h-44 sm:w-52 sm:h-52 rounded-3xl bg-gradient-to-tr from-purple-100 via-rose-100 to-amber-100 p-2 shadow-card flex items-center justify-center animate-float">
              {/* Mascot Image */}
              <img
                src="/src/assets/images/mascot_coffee_mug_1787669580415.jpg"
                alt="codertech mascot"
                className="w-full h-full object-cover rounded-2xl"
                referrerPolicy="no-referrer"
              />
              {/* Heart Badge */}
              <div className="absolute -top-3 -left-3 bg-white p-2 rounded-full shadow-md text-rose-500 animate-pulse-subtle">
                <Heart className="w-4 h-4 fill-current" />
              </div>
            </div>
          </div>

          {/* Right Column: Testimonial Cards */}
          <div className="lg:col-span-9 grid grid-cols-1 md:grid-cols-3 gap-5">
            {visibleTestimonials.map((item, idx) => (
              <div
                key={item.id}
                className="bg-white rounded-3xl p-6 shadow-soft hover:shadow-card hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between border border-stone-200/70 relative"
              >
                {/* Colored Quote Mark */}
                <div className="mb-4">
                  <span
                    className="text-3xl font-serif leading-none font-bold"
                    style={{ color: item.accentColor || '#6C5CE7' }}
                  >
                    “
                  </span>
                </div>

                {/* Quote copy */}
                <p className="text-xs sm:text-sm text-stone-700 leading-relaxed font-normal mb-6 italic">
                  "{item.quote}"
                </p>

                {/* Author Info */}
                <div className="flex items-center gap-3 pt-4 border-t border-stone-100">
                  <img
                    src={item.avatarUrl}
                    alt={item.author}
                    className="w-10 h-10 rounded-full object-cover border border-stone-200 shrink-0"
                    referrerPolicy="no-referrer"
                  />
                  <div className="overflow-hidden">
                    <h4 className="text-xs font-bold text-stone-900 truncate">
                      {item.author}
                    </h4>
                    <p className="text-[11px] text-stone-500 truncate">
                      {item.role}, {item.company}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
};
