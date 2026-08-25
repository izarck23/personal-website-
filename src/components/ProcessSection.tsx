import React, { useState } from 'react';
import { Search, Pencil, MousePointerClick, Rocket, CheckCircle2, Star, ArrowUpRight } from 'lucide-react';
import { ProcessStep } from '../types';

interface ProcessSectionProps {
  steps: ProcessStep[];
  onSelectStep?: (step: ProcessStep) => void;
}

export const ProcessSection: React.FC<ProcessSectionProps> = ({ steps }) => {
  const [activeStepIndex, setActiveStepIndex] = useState<number | null>(null);

  const getStepIcon = (iconName: string) => {
    switch (iconName) {
      case 'Search':
        return <Search className="w-6 h-6" />;
      case 'Pencil':
        return <Pencil className="w-6 h-6" />;
      case 'MousePointerClick':
        return <MousePointerClick className="w-6 h-6" />;
      case 'Rocket':
        return <Rocket className="w-6 h-6" />;
      default:
        return <Star className="w-6 h-6" />;
    }
  };

  const getStepBg = (index: number) => {
    switch (index) {
      case 0:
        return 'from-[#A29BFE] to-[#8B7EFF] text-white shadow-purple-200';
      case 1:
        return 'from-[#FDCB6E] to-[#F39C12] text-white shadow-amber-200';
      case 2:
        return 'from-[#FF7675] to-[#E76F51] text-white shadow-rose-200';
      case 3:
        return 'from-[#6C5CE7] to-[#5742DE] text-white shadow-indigo-200';
      default:
        return 'from-[#8B7EFF] to-[#6C5CE7] text-white';
    }
  };

  return (
    <section id="process" className="relative pt-32 pb-20 bg-[#FFF8F3] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-left mb-16 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-purple-100 text-[#6C5CE7] text-xs font-bold uppercase tracking-wider mb-3">
            <span>My Process</span>
          </div>

          <h2 className="font-serif-display text-3xl sm:text-4xl md:text-5xl font-bold text-stone-900 tracking-tight flex items-center gap-2">
            <span>From idea to impact.</span>
            <span className="text-amber-400 text-2xl sm:text-3xl">⭐️</span>
          </h2>

          <p className="text-base sm:text-lg text-stone-600 mt-3 leading-relaxed">
            A simple, collaborative and user-centered process I follow for every project.
          </p>

          {/* Cute hand-drawn squiggly doodle */}
          <div className="mt-2 text-[#8B7EFF]">
            <svg width="60" height="24" viewBox="0 0 60 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 18 C15 4, 30 22, 45 6 C50 1, 55 12, 58 10" stroke="#8B7EFF" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M52 4 L58 10 L50 12" stroke="#8B7EFF" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
        </div>

        {/* 4 Steps Horizontal Flow */}
        <div className="relative">
          
          {/* Connecting Dotted Line on Desktop */}
          <div className="hidden lg:block absolute top-14 left-[12%] right-[12%] h-0.5 border-t-2 border-dashed border-stone-300 -z-0" />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
            {steps.map((step, index) => {
              const isSelected = activeStepIndex === index;
              return (
                <div
                  key={step.stepNumber}
                  onClick={() => setActiveStepIndex(isSelected ? null : index)}
                  className={`bg-white/80 hover:bg-white rounded-3xl p-6 transition-all duration-300 border cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'border-[#6C5CE7] shadow-card -translate-y-2 bg-white'
                      : 'border-stone-200/80 shadow-soft hover:shadow-card hover:-translate-y-1'
                  }`}
                  id={`process-step-${step.stepNumber}`}
                >
                  <div>
                    {/* Circle Icon Badge */}
                    <div className="flex items-center justify-between mb-6">
                      <div
                        className={`w-16 h-16 rounded-full bg-gradient-to-br ${getStepBg(
                          index
                        )} flex items-center justify-center shadow-lg transform transition-transform group-hover:scale-110`}
                      >
                        {getStepIcon(step.iconName)}
                      </div>
                      <span className="text-xs font-mono font-bold text-stone-400 bg-stone-100 px-2.5 py-1 rounded-full">
                        0{step.stepNumber}
                      </span>
                    </div>

                    {/* Step Title & Subtitle */}
                    <h3 className="text-lg font-bold text-stone-900 mb-2">
                      {step.stepNumber}. {step.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-stone-600 leading-relaxed mb-4">
                      {step.subtitle}
                    </p>
                  </div>

                  {/* Expandable / Selected Deliverables */}
                  <div className="pt-3 border-t border-stone-100">
                    <div className="flex items-center justify-between text-xs font-bold text-[#6C5CE7]">
                      <span>{isSelected ? 'Hide Details' : 'View Deliverables'}</span>
                      <ArrowUpRight className={`w-3.5 h-3.5 transition-transform ${isSelected ? 'rotate-90' : ''}`} />
                    </div>

                    {isSelected && (
                      <div className="mt-3 pt-2 space-y-1.5 animate-fadeIn text-left">
                        {step.deliverables.map((item, dIdx) => (
                          <div key={dIdx} className="flex items-start gap-1.5 text-xs text-stone-600">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                            <span>{item}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

        </div>

      </div>
    </section>
  );
};
