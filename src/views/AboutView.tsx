import React from 'react';
import { FounderCard } from '../components/common/FounderCard';
import { Award, BookOpen, GraduationCap, Sparkles, Heart } from 'lucide-react';

export const AboutView: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-12">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-950 to-slate-900 text-white p-8 sm:p-12 rounded-3xl shadow-xl space-y-4 border border-blue-900/40 text-center">
        <span className="text-xs font-bold text-amber-400 uppercase tracking-widest bg-amber-400/10 border border-amber-400/30 px-3 py-1 rounded-full inline-block">
          EdTech Innovation at Kizimba Secondary School
        </span>
        <h1 className="text-3xl sm:text-5xl font-black">About Kizimba Digital Learning Hub (KDLH)</h1>
        <p className="text-sm sm:text-base text-blue-200 max-w-3xl mx-auto leading-relaxed">
          Kizimba Digital Learning Hub (KDLH) is an integrated digital EdTech ecosystem designed to provide secondary school students and teachers in Tanzania with equitable access to quality educational materials.
        </p>

        <div className="inline-block bg-blue-950/80 border border-blue-700/60 px-5 py-2 rounded-xl text-amber-300 font-black text-sm uppercase tracking-widest">
          Tagline: LEARN • PRACTICE • ASK • IMPROVE
        </div>
      </div>

      {/* Founder Section */}
      <section>
        <FounderCard />
      </section>

      {/* Mission & Vision */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-2xl border border-slate-200/80 shadow-md space-y-3">
          <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-black">
            <Award className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-slate-900">Our Mission</h3>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            To empower students and educators at Kizimba Secondary School through a comprehensive, digital-first learning repository featuring notes, past papers, practical guides, videos, and intelligent academic support.
          </p>
        </div>

        <div className="bg-white p-8 rounded-2xl border border-slate-200/80 shadow-md space-y-3">
          <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-black">
            <Sparkles className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-slate-900">Our Vision</h3>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            To serve as a national model for digital secondary education in Tanzania, ensuring that every learner has equal access to syllabus-aligned study materials regardless of geographical constraints.
          </p>
        </div>
      </div>

    </div>
  );
};
