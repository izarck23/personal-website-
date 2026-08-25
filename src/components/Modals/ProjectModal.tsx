import React from 'react';
import { X, ExternalLink, Github, CheckCircle, Layers, Sparkles, Cpu } from 'lucide-react';
import { Project } from '../../types';

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({ project, onClose }) => {
  if (!project) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-stone-900/60 backdrop-blur-xs animate-fadeIn overflow-y-auto">
      <div
        className="bg-white rounded-[32px] max-w-3xl w-full shadow-2xl border border-stone-200 overflow-hidden relative animate-scaleUp my-8"
        id="project-detail-modal"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-10 h-10 rounded-full bg-white/90 backdrop-blur-md text-stone-700 hover:bg-stone-100 flex items-center justify-center shadow-md z-20 cursor-pointer transition-all hover:rotate-90"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Top Banner */}
        <div
          className="p-8 sm:p-10 text-white relative overflow-hidden"
          style={{ backgroundColor: project.accentColor }}
        >
          <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          
          <div className="relative z-10">
            <span className="inline-block text-xs font-bold uppercase tracking-wider bg-white/20 px-3 py-1 rounded-full mb-3">
              {project.tag}
            </span>
            <h2 className="font-serif-display text-3xl sm:text-4xl font-bold mb-3">
              {project.title}
            </h2>
            <p className="text-sm sm:text-base text-white/90 max-w-xl leading-relaxed">
              {project.shortDescription}
            </p>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-10 space-y-8 text-stone-800">
          
          {/* Key Metrics */}
          {project.metrics && project.metrics.length > 0 && (
            <div className="grid grid-cols-3 gap-4">
              {project.metrics.map((m, idx) => (
                <div key={idx} className="bg-stone-50 rounded-2xl p-4 text-center border border-stone-100">
                  <div className="text-[11px] font-bold text-stone-400 uppercase">{m.label}</div>
                  <div className="font-serif-display text-xl sm:text-2xl font-bold text-stone-900 mt-1">
                    {m.value}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Overview */}
          <div>
            <h3 className="font-bold text-stone-900 text-lg mb-2 flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#6C5CE7]" />
              <span>Project Overview & Architecture</span>
            </h3>
            <p className="text-sm text-stone-600 leading-relaxed">
              {project.fullDescription}
            </p>
          </div>

          {/* Highlights & Engineering Features */}
          <div>
            <h3 className="font-bold text-stone-900 text-lg mb-3 flex items-center gap-2">
              <Cpu className="w-4 h-4 text-[#6C5CE7]" />
              <span>Key Technical Highlights</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {project.highlights.map((h, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-stone-700 bg-stone-50/80 p-3 rounded-xl border border-stone-100">
                  <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>{h}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Tech Stack Pills */}
          <div>
            <h3 className="font-bold text-stone-900 text-sm mb-2.5">
              Technologies & Frameworks
            </h3>
            <div className="flex flex-wrap gap-2">
              {project.techStack.map((tech) => (
                <span
                  key={tech}
                  className="px-3 py-1 bg-purple-50 text-[#6C5CE7] border border-purple-100 rounded-lg text-xs font-bold"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Action Links */}
          <div className="pt-4 border-t border-stone-100 flex flex-wrap gap-4 items-center justify-between">
            <div className="flex gap-3">
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-full text-xs font-bold shadow-md transition-all"
                >
                  <span>Live Demo</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-full text-xs font-bold transition-all border border-stone-200"
                >
                  <Github className="w-3.5 h-3.5" />
                  <span>Source Code</span>
                </a>
              )}
            </div>

            <button
              onClick={onClose}
              className="text-xs font-bold text-stone-500 hover:text-stone-800 px-4 py-2"
            >
              Close Window
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
