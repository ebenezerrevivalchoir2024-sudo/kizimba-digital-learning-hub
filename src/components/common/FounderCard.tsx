import React from 'react';
import { Award, GraduationCap, ShieldCheck, Sparkles, BookOpen, Lightbulb, Heart } from 'lucide-react';

export const FounderCard: React.FC = () => {
  return (
    <div className="bg-gradient-to-br from-blue-950 via-slate-900 to-black border border-blue-700/60 text-slate-100 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden font-serif">
      {/* Decorative radial glows */}
      <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -left-12 -top-12 w-64 h-64 bg-blue-500/15 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col md:flex-row items-center md:items-start gap-8 relative z-10">
        {/* Founder Avatar Badge */}
        <div className="flex-shrink-0 relative">
          <div className="w-32 h-32 md:w-36 md:h-36 rounded-2xl bg-blue-950 border-2 border-amber-400 p-1 shadow-[0_0_25px_rgba(245,158,11,0.25)]">
            <div className="w-full h-full bg-slate-950 rounded-[12px] flex flex-col items-center justify-center p-3 text-center border border-blue-800">
              <GraduationCap className="w-10 h-10 text-amber-400 mb-1" />
              <span className="text-[10px] font-extrabold tracking-wider text-amber-300 uppercase font-mono">FOUNDER</span>
              <span className="text-xs text-white font-bold line-clamp-1">KDLH Platform</span>
            </div>
          </div>
          <div className="absolute -bottom-2 -right-2 bg-amber-400 text-black px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider flex items-center gap-1 shadow-lg font-mono">
            <ShieldCheck className="w-3.5 h-3.5" /> Founder
          </div>
        </div>

        {/* Founder Information */}
        <div className="flex-1 text-center md:text-left space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-900/80 border border-amber-400/50 text-amber-300 text-xs font-semibold shadow-inner font-mono">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Founder & Educational Innovator
          </div>

          <div>
            <h3 className="text-2xl sm:text-3xl font-black text-white tracking-wide uppercase">
              ISAKA EDWARD LUNGWA
            </h3>
            <p className="text-amber-400 text-xs sm:text-sm font-bold mt-0.5">
              Known as Isaack Lungwa • Founder of Kizimba Digital Learning Hub
            </p>
          </div>

          <p className="text-slate-200 text-xs sm:text-sm leading-relaxed max-w-2xl font-sans">
            Isaack Lungwa developed the KDLH vision through hands-on teaching experience at <strong className="text-white">Kizimba Secondary School in Bumbuli, Tanga</strong> (teaching Chemistry Form One and Form Four). As a University of Dar es Salaam student in 2026, he created KDLH to ensure every student has equal access to quality notes, practical simulations, past papers, and automated exam feedback.
          </p>

          {/* Philosophy Banner */}
          <div className="p-3.5 bg-blue-950/60 border border-amber-500/30 rounded-2xl text-xs text-amber-200 font-medium italic flex items-center gap-3">
            <Lightbulb className="w-5 h-5 text-amber-400 flex-shrink-0" />
            <span>&ldquo;Turn challenges into creativity, and creativity into something that helps other people.&rdquo;</span>
          </div>

          <div className="pt-1 flex flex-wrap items-center justify-center md:justify-start gap-2.5 text-xs font-mono font-medium text-slate-300">
            <span className="flex items-center gap-1.5 px-3 py-1 bg-slate-900/90 rounded-xl border border-blue-800/60 text-blue-200">
              <BookOpen className="w-3.5 h-3.5 text-amber-400" /> Kizimba Sec. School, Bumbuli
            </span>
            <span className="flex items-center gap-1.5 px-3 py-1 bg-slate-900/90 rounded-xl border border-blue-800/60 text-blue-200">
              <GraduationCap className="w-3.5 h-3.5 text-amber-400" /> University of Dar es Salaam
            </span>
            <span className="flex items-center gap-1.5 px-3 py-1 bg-slate-900/90 rounded-xl border border-blue-800/60 text-blue-200">
              <Heart className="w-3.5 h-3.5 text-amber-400" /> EdTech & Community Impact
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
