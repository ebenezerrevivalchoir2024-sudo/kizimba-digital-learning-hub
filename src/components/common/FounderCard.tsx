import React from 'react';
import { Award, GraduationCap, ShieldCheck, Sparkles, BookOpen } from 'lucide-react';

export const FounderCard: React.FC = () => {
  return (
    <div className="bg-cyan-950/20 border border-cyan-900/50 text-cyan-100 rounded-2xl p-8 shadow-[0_0_30px_rgba(6,182,212,0.12)] relative overflow-hidden font-mono backdrop-blur-xl">
      {/* Decorative radial glows */}
      <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -left-12 -top-12 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
        {/* Founder Avatar Badge */}
        <div className="flex-shrink-0 relative">
          <div className="w-32 h-32 md:w-36 md:h-36 rounded-2xl bg-cyan-950 border border-cyan-400 p-1 shadow-[0_0_20px_rgba(6,182,212,0.3)]">
            <div className="w-full h-full bg-black/90 rounded-[14px] flex flex-col items-center justify-center p-3 text-center border border-cyan-800">
              <GraduationCap className="w-12 h-12 text-cyan-400 mb-1 animate-pulse" />
              <span className="text-[11px] font-bold tracking-wider text-cyan-300 uppercase">Founder</span>
              <span className="text-xs text-white font-semibold line-clamp-1">KDLH EdTech</span>
            </div>
          </div>
          <div className="absolute -bottom-2 -right-2 bg-cyan-400 text-black px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wide flex items-center gap-1 shadow-[0_0_10px_#22d3ee]">
            <ShieldCheck className="w-3 h-3" /> Creator
          </div>
        </div>

        {/* Founder Information */}
        <div className="flex-1 text-center md:text-left space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 text-xs font-semibold shadow-[0_0_8px_rgba(6,182,212,0.2)]">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" /> Founder & Visionary
          </div>

          <h3 className="text-2xl md:text-3xl font-extrabold text-white tracking-widest uppercase">
            ISAACK EDWARD LUNGWA
          </h3>

          <p className="text-cyan-400 text-sm md:text-base font-semibold">
            Founder & Creator of Kizimba Digital Learning Hub
          </p>

          <p className="text-cyan-200/80 text-sm leading-relaxed max-w-2xl font-sans">
            Founded by <strong className="text-white">ISAACK EDWARD LUNGWA</strong>, Kizimba Digital Learning Hub (KDLH) was built to provide Kizimba Secondary School students and teachers with a modern, high-quality digital learning ecosystem. Empowering Tanzanian youth through curated digital notes, interactive practical laboratories, past papers, educational video tutorials, audio podcasts, and intelligent academic assistance.
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs font-mono font-medium text-cyan-300/80">
            <span className="flex items-center gap-1 text-cyan-300">
              <BookOpen className="w-3.5 h-3.5 text-cyan-400" /> Kizimba Secondary School
            </span>
            <span className="flex items-center gap-1 text-amber-300">
              <Award className="w-3.5 h-3.5 text-amber-400" /> Tagline: LEARN • PRACTICE • ASK • IMPROVE
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
