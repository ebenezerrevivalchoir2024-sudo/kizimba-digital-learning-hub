import React from 'react';
import { 
  Sparkles, 
  Search, 
  BookOpen, 
  FileText, 
  FlaskConical, 
  Video, 
  Scan, 
  Award, 
  ArrowRight,
  GraduationCap,
  CheckCircle2,
  HelpCircle,
  Brain,
  MessageSquare,
  ShieldCheck
} from 'lucide-react';
import { KDLHResource, Subject, CmsSettings } from '../types';
import { FounderCard } from '../components/common/FounderCard';
import { ResourceCard } from '../components/common/ResourceCard';

interface HomeViewProps {
  onNavigate: (route: string) => void;
  onOpenSearch: () => void;
  resources: KDLHResource[];
  subjects: Subject[];
  cmsSettings: CmsSettings;
  onSelectResource: (resource: KDLHResource) => void;
  savedResourceIds: string[];
  onToggleSaveResource: (id: string) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  onNavigate,
  onOpenSearch,
  resources,
  subjects,
  cmsSettings,
  onSelectResource,
  savedResourceIds,
  onToggleSaveResource
}) => {
  // Exactly 3 featured resources as requested
  const featuredResources = resources
    .filter(r => r.featured || cmsSettings.featuredResourceIds.includes(r.id))
    .slice(0, 3);

  // Core 6 quick-access cards
  const quickAccessCards = [
    {
      title: 'Notes',
      subtitle: 'Form I–VI Modules',
      route: '/notes',
      icon: <FileText className="w-6 h-6 text-cyan-400" />,
      color: 'from-cyan-500/20 to-cyan-500/5 border-cyan-500/30'
    },
    {
      title: 'Past Papers',
      subtitle: 'NECTA Exams & Solutions',
      route: '/past-papers',
      icon: <BookOpen className="w-6 h-6 text-blue-400" />,
      color: 'from-blue-500/20 to-blue-500/5 border-blue-500/30'
    },
    {
      title: 'Practicals',
      subtitle: 'Chemistry, Physics, Bio',
      route: '/practicals',
      icon: <FlaskConical className="w-6 h-6 text-emerald-400" />,
      color: 'from-emerald-500/20 to-emerald-500/5 border-emerald-500/30'
    },
    {
      title: 'Videos',
      subtitle: 'Lessons & Tutorials',
      route: '/videos',
      icon: <Video className="w-6 h-6 text-rose-400" />,
      color: 'from-rose-500/20 to-rose-500/5 border-rose-500/30'
    },
    {
      title: 'Revision',
      subtitle: 'Quizzes & Worksheets',
      route: '/past-papers',
      icon: <Award className="w-6 h-6 text-amber-400" />,
      color: 'from-amber-500/20 to-amber-500/5 border-amber-500/30'
    },
    {
      title: 'KDLH AI',
      subtitle: '24/7 Academic Tutor',
      route: '/ai-assistant',
      icon: <Sparkles className="w-6 h-6 text-purple-400" />,
      color: 'from-purple-500/20 to-purple-500/5 border-purple-500/30'
    }
  ];

  return (
    <div className="space-y-12 pb-16 font-sans bg-slate-950 text-slate-100 min-h-screen">
      
      {/* 1. FULL-WIDTH HERO SECTION WITH PERFORMANCE OPTIMIZED IMAGE */}
      <section className="relative overflow-hidden bg-slate-950 border-b border-slate-800">
        
        {/* Background Image Container */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1600&q=80" 
            alt="Students studying together in library"
            className="w-full h-full object-cover object-center opacity-25 filter blur-[1px]"
            loading="eager"
            fetchPriority="high"
            decoding="async"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/90 to-slate-900/85" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/60" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-24 text-center space-y-6">
          
          {/* Tagline Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs font-semibold backdrop-blur-md shadow-inner">
            <Sparkles className="w-4 h-4 text-teal-400 animate-pulse" />
            <span className="tracking-widest uppercase font-mono">LEARN • PRACTICE • ASK • IMPROVE</span>
          </div>

          {/* Main Title */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight max-w-4xl mx-auto drop-shadow-md">
            {cmsSettings.heroTitle || 'KIZIMBA DIGITAL LEARNING HUB (KDLH)'}
          </h1>

          {/* Subtitle */}
          <p className="text-sm sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed font-normal">
            {cmsSettings.heroSubtitle || 'A comprehensive secondary digital learning system providing verified Form I–VI subject notes, past papers, practical guides, educational videos, camera exam scanning, and AI tutoring.'}
          </p>

          {/* Search Bar Bar */}
          <div className="pt-2 max-w-2xl mx-auto">
            <div 
              onClick={onOpenSearch}
              className="bg-slate-900/90 border border-slate-700/80 hover:border-teal-400/60 rounded-2xl p-2.5 sm:p-3 flex items-center gap-3 cursor-pointer transition-all shadow-2xl backdrop-blur-md text-slate-400 text-xs sm:text-sm group"
            >
              <Search className="w-5 h-5 text-teal-400 ml-2 group-hover:scale-110 transition-transform" />
              <span className="flex-1 text-left text-slate-300 truncate">Search notes, past papers, practicals, videos, tutorials...</span>
              <span className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs rounded-xl transition shadow-md whitespace-nowrap">
                Search
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => onNavigate('/notes')}
              className="px-6 py-3.5 bg-teal-600 hover:bg-teal-500 text-white font-bold rounded-xl shadow-lg transition-all flex items-center gap-2 text-xs sm:text-sm uppercase tracking-wider"
            >
              <BookOpen className="w-4 h-4" /> EXPLORE LEARNING
            </button>

            <button
              onClick={() => onNavigate('/ai-assistant')}
              className="px-6 py-3.5 bg-purple-950/90 hover:bg-purple-900 text-purple-200 border border-purple-500/50 font-bold rounded-xl shadow-lg transition-all flex items-center gap-2 text-xs sm:text-sm uppercase tracking-wider"
            >
              <Sparkles className="w-4 h-4 text-purple-400" /> ASK KDLH AI
            </button>
          </div>

          {/* Founder Credit */}
          <div className="pt-2 text-xs text-slate-400 font-mono">
            Founder & Director: <strong className="text-white">ISAACK EDWARD LUNGWA</strong> • Kizimba Secondary School
          </div>

        </div>
      </section>

      {/* MAIN CONTAINER */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-12">
        
        {/* 2. SINGLE ROW OF 6 CORE QUICK-ACCESS CARDS */}
        <section className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <div>
              <span className="text-xs font-bold text-teal-400 uppercase tracking-wider block">Core Learning Hub</span>
              <h2 className="text-lg font-bold text-white">Quick Access Modules</h2>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
            {quickAccessCards.map((card, idx) => (
              <div
                key={idx}
                onClick={() => onNavigate(card.route)}
                className={`bg-gradient-to-b ${card.color} bg-slate-900 p-4 rounded-2xl border hover:border-teal-400/60 transition-all duration-300 cursor-pointer flex flex-col items-center text-center justify-between space-y-3 group shadow-md hover:shadow-xl hover:-translate-y-1`}
              >
                <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-xl group-hover:scale-110 transition-transform">
                  {card.icon}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white group-hover:text-teal-300 transition-colors">
                    {card.title}
                  </h3>
                  <p className="text-[10px] text-slate-400 mt-0.5 line-clamp-1">
                    {card.subtitle}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 3. SECTION FOR 3 FEATURED RESOURCES */}
        <section className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <div>
              <span className="text-xs font-bold text-teal-400 uppercase tracking-wider block">Handpicked Academic Content</span>
              <h2 className="text-lg font-bold text-white">Featured Learning Resources</h2>
            </div>
            <button 
              onClick={() => onNavigate('/notes')}
              className="text-xs font-bold text-teal-400 hover:text-teal-300 flex items-center gap-1.5 transition"
            >
              Browse All Resources <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredResources.map(res => (
              <ResourceCard
                key={res.id}
                resource={res}
                onSelect={onSelectResource}
                onToggleSave={onToggleSaveResource}
                isSaved={savedResourceIds.includes(res.id)}
              />
            ))}
          </div>
        </section>

        {/* 4. COMPACT SUBJECT SELECTOR */}
        <section className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <div>
              <span className="text-xs font-bold text-teal-400 uppercase tracking-wider block">Secondary Curriculum</span>
              <h2 className="text-lg font-bold text-white">Choose Subject (Form I – VI)</h2>
            </div>
            <button 
              onClick={() => onNavigate('/notes')}
              className="text-xs font-bold text-teal-400 hover:text-teal-300 flex items-center gap-1 transition"
            >
              VIEW ALL SUBJECTS <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {subjects.slice(0, 8).map(sub => (
              <div
                key={sub.id}
                onClick={() => onNavigate('/notes')}
                className="bg-slate-900/90 p-4 rounded-xl border border-slate-800 hover:border-teal-500/50 transition cursor-pointer flex items-center justify-between group shadow-sm"
              >
                <div>
                  <h3 className="text-xs font-bold text-white group-hover:text-teal-400 transition-colors">
                    {sub.name}
                  </h3>
                  <span className="text-[10px] text-slate-400">{sub.topicCount} Topics</span>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-teal-400 group-hover:translate-x-1 transition" />
              </div>
            ))}
          </div>
        </section>

        {/* 5. MEET KDLH AI TUTOR HIGHLIGHT */}
        <section className="bg-slate-900 p-6 sm:p-8 rounded-2xl border border-slate-800 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          <div className="md:col-span-8 space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-950 border border-purple-800 text-purple-300 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5 text-purple-400" /> MEET KDLH AI TUTOR
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white">Instant Answers Grounded in NECTA Curriculum</h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Ask any question about Chemistry, Physics, Biology, or Mathematics. Get step-by-step explanations, balanced chemical equations, mathematical proofs, and past paper solutions tailored for Form I through Form VI students.
            </p>
            <div className="pt-2 flex flex-wrap gap-2 text-xs font-mono text-slate-400">
              <span className="px-2.5 py-1 bg-slate-950 rounded-lg border border-slate-800">✓ Step-by-Step Problem Solving</span>
              <span className="px-2.5 py-1 bg-slate-950 rounded-lg border border-slate-800">✓ NECTA Format Guidance</span>
              <span className="px-2.5 py-1 bg-slate-950 rounded-lg border border-slate-800">✓ Camera Exam OCR Scanning</span>
            </div>
          </div>

          <div className="md:col-span-4 flex flex-col items-center justify-center p-6 bg-slate-950 rounded-xl border border-slate-800 text-center space-y-4">
            <Brain className="w-12 h-12 text-purple-400 animate-pulse" />
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-white">Have a tricky question?</h4>
              <p className="text-xs text-slate-400">Ask KDLH AI right now for instant step-by-step help.</p>
            </div>
            <button
              onClick={() => onNavigate('/ai-assistant')}
              className="w-full py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl text-xs uppercase tracking-wider transition shadow-lg flex items-center justify-center gap-2"
            >
              <MessageSquare className="w-4 h-4" /> ASK KDLH AI
            </button>
          </div>
        </section>

        {/* 6. FOUNDER SECTION */}
        <section>
          <FounderCard />
        </section>

      </div>
    </div>
  );
};
