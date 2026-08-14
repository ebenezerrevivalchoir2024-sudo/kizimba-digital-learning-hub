import React from 'react';
import { 
  Sparkles, 
  Search, 
  BookOpen, 
  ArrowRight, 
  GraduationCap, 
  Award, 
  FlaskConical, 
  Brain, 
  ChevronRight, 
  Video, 
  Headphones, 
  Layers, 
  ScanLine, 
  ShieldCheck,
  CheckCircle2,
  Clock,
  Compass,
  FileCheck,
  Zap,
  Library,
  School,
  Camera
} from 'lucide-react';
import { KDLHResource, Subject, CmsSettings } from '../types';
import { FounderCard } from '../components/common/FounderCard';
import { ImageCarousel } from '../components/common/ImageCarousel';

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
  subjects
}) => {
  // Visual Module Cards with high-resolution educational photography
  const visualModules = [
    {
      id: 'notes',
      title: 'Curriculum Notes',
      subtitle: 'Form I – Form VI Verified Syllabus Notes',
      image: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=800&q=80',
      tag: 'Notes & Syllabus 📚',
      badgeColor: 'bg-blue-900/90 text-blue-200 border-blue-400/40',
      route: '/notes',
      desc: 'Concise, illustrated study notes organized by topic and form with key formulas and summary tables.'
    },
    {
      id: 'practicals',
      title: 'Practical Science Labs',
      subtitle: 'Titration, Optics, Mechanics & Dissections',
      image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=800&q=80',
      tag: 'Hands-on Experiments 🧪',
      badgeColor: 'bg-emerald-950/90 text-emerald-200 border-emerald-400/40',
      route: '/practicals',
      desc: 'Complete apparatus setups, step-by-step chemical procedures, and observation recording guides.'
    },
    {
      id: 'past-papers',
      title: 'NECTA Past Papers',
      subtitle: 'Solved National Exams & Marking Schemes',
      image: 'https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?auto=format&fit=crop&w=800&q=80',
      tag: 'Past Paper Solutions 📝',
      badgeColor: 'bg-amber-950/90 text-amber-200 border-amber-400/40',
      route: '/past-papers',
      desc: 'Form II, Form IV CSEE, and Form VI ACSEE actual past papers with detailed step-by-step solutions.'
    },
    {
      id: 'videos',
      title: 'Video Learning Hub',
      subtitle: 'Recorded Lessons & Lab Demonstrations',
      image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80',
      tag: 'Video Demonstrations 🎥',
      badgeColor: 'bg-rose-950/90 text-rose-200 border-rose-400/40',
      route: '/videos',
      desc: 'High-definition video lectures teaching mathematics, physics problem solving, and chemical reactions.'
    },
    {
      id: 'books',
      title: 'Digital Reference Library',
      subtitle: 'Curriculum Textbooks & Reference Manuals',
      image: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=800&q=80',
      tag: 'Digital Bookshelf 📖',
      badgeColor: 'bg-teal-950/90 text-teal-200 border-teal-400/40',
      route: '/books',
      desc: 'Official secondary school textbooks, supplementary study guides, and literature set-books.'
    },
    {
      id: 'exam-scanner',
      title: 'AI Exam Optical Grader',
      subtitle: 'OCR Script Scanner & Red-Pen Grading',
      image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=800&q=80',
      tag: 'OCR Optical Scanner 📷',
      badgeColor: 'bg-indigo-950/90 text-indigo-200 border-indigo-400/40',
      route: '/exam-scanner',
      desc: 'Scan student handwritten exam papers using smartphone camera or uploads with instant rubric matching.'
    }
  ];

  return (
    <div className="space-y-12 pb-16 font-serif text-slate-100 min-h-screen">
      
      {/* 1. HERO SECTION WITH EMBEDDED ROTATING EDUCATIONAL CAROUSEL */}
      <section className="max-w-7xl mx-auto px-3 sm:px-6 pt-4 sm:pt-6 space-y-6">
        
        {/* Top Tagline Badge */}
        <div className="flex justify-center">
          <div className="inline-flex items-center gap-2 px-4 sm:px-6 py-2 rounded-full bg-blue-950/90 border border-amber-400/60 text-amber-300 text-xs sm:text-sm font-bold backdrop-blur-md shadow-lg">
            <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
            <span className="tracking-widest uppercase font-mono text-center">
              🎓 KIZIMBA SECONDARY SCHOOL • FORM I TO FORM VI 📚
            </span>
          </div>
        </div>

        {/* Hero Title & Subtitle */}
        <div className="text-center space-y-3 max-w-4xl mx-auto">
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-wide leading-tight drop-shadow-2xl">
            KIZIMBA DIGITAL LEARNING HUB
          </h1>
          <p className="text-sm sm:text-base text-blue-100 leading-relaxed italic max-w-3xl mx-auto font-sans">
            "Empowering Tanzanian secondary students and educators with syllabus-verified notes 📚, NECTA past paper solutions 📝, science laboratory simulations 🧪, video lessons 🎥, and AI-assisted exam grading."
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
          <button
            onClick={() => onNavigate('/dashboard')}
            className="px-6 sm:px-8 py-3.5 sm:py-4 bg-gradient-to-r from-blue-700 via-blue-800 to-indigo-800 hover:from-blue-600 hover:to-indigo-700 text-white font-extrabold text-sm sm:text-base rounded-2xl shadow-[0_0_30px_rgba(37,99,235,0.5)] transition-all transform hover:-translate-y-0.5 flex items-center gap-2.5 uppercase tracking-wider border border-amber-400/50 font-serif"
          >
            <span>OPEN ACADEMIC DASHBOARD</span>
            <ArrowRight className="w-5 h-5 text-amber-300" />
          </button>

          <button
            onClick={() => onNavigate('/exam-scanner')}
            className="px-5 sm:px-6 py-3.5 sm:py-4 bg-slate-900 hover:bg-slate-800 text-amber-300 font-bold text-xs sm:text-sm rounded-2xl border border-amber-500/50 shadow-md transition flex items-center gap-2 uppercase tracking-wider font-mono"
          >
            <ScanLine className="w-4 h-4 text-amber-400" />
            <span>AI Exam Scanner & Marker</span>
          </button>
        </div>

        {/* 2. DYNAMIC EDUCATIONAL IMAGE CAROUSEL WITH COLLECTION TABS */}
        <div className="pt-2">
          <ImageCarousel 
            variant="hero"
            showCategoryTabs={true}
            showControls={true}
            showIndicators={true}
            autoPlayInterval={6000}
            onNavigate={onNavigate}
          />
        </div>

        {/* 3. QUICK ACCESS HORIZONTAL PILLS (Mobile-optimized scroll) */}
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-2 pt-1">
          <button
            onClick={() => onNavigate('/notes')}
            className="px-4 py-2.5 rounded-xl bg-slate-900/90 border border-blue-900 hover:border-amber-400 text-xs font-bold text-slate-200 hover:text-amber-300 flex items-center gap-2 whitespace-nowrap transition shadow-sm font-mono"
          >
            <BookOpen className="w-4 h-4 text-blue-400" /> Notes Library
          </button>
          <button
            onClick={() => onNavigate('/practicals')}
            className="px-4 py-2.5 rounded-xl bg-slate-900/90 border border-blue-900 hover:border-amber-400 text-xs font-bold text-slate-200 hover:text-amber-300 flex items-center gap-2 whitespace-nowrap transition shadow-sm font-mono"
          >
            <FlaskConical className="w-4 h-4 text-emerald-400" /> Practical Labs
          </button>
          <button
            onClick={() => onNavigate('/past-papers')}
            className="px-4 py-2.5 rounded-xl bg-slate-900/90 border border-blue-900 hover:border-amber-400 text-xs font-bold text-slate-200 hover:text-amber-300 flex items-center gap-2 whitespace-nowrap transition shadow-sm font-mono"
          >
            <Layers className="w-4 h-4 text-amber-400" /> NECTA Past Papers
          </button>
          <button
            onClick={() => onNavigate('/videos')}
            className="px-4 py-2.5 rounded-xl bg-slate-900/90 border border-blue-900 hover:border-amber-400 text-xs font-bold text-slate-200 hover:text-amber-300 flex items-center gap-2 whitespace-nowrap transition shadow-sm font-mono"
          >
            <Video className="w-4 h-4 text-rose-400" /> Video Lessons
          </button>
          <button
            onClick={() => onNavigate('/books')}
            className="px-4 py-2.5 rounded-xl bg-slate-900/90 border border-blue-900 hover:border-amber-400 text-xs font-bold text-slate-200 hover:text-amber-300 flex items-center gap-2 whitespace-nowrap transition shadow-sm font-mono"
          >
            <Library className="w-4 h-4 text-amber-300" /> Digital Library
          </button>
          <button
            onClick={() => onNavigate('/audio')}
            className="px-4 py-2.5 rounded-xl bg-slate-900/90 border border-blue-900 hover:border-amber-400 text-xs font-bold text-slate-200 hover:text-amber-300 flex items-center gap-2 whitespace-nowrap transition shadow-sm font-mono"
          >
            <Headphones className="w-4 h-4 text-teal-400" /> Audio Hub
          </button>
          <button
            onClick={() => onNavigate('/ai-assistant')}
            className="px-4 py-2.5 rounded-xl bg-slate-900/90 border border-blue-900 hover:border-amber-400 text-xs font-bold text-amber-300 flex items-center gap-2 whitespace-nowrap transition shadow-sm font-mono"
          >
            <Brain className="w-4 h-4 text-amber-300" /> 24/7 AI Tutor
          </button>
        </div>

      </section>

      {/* 4. VISUAL MODULE CARDS WITH EDUCATIONAL PHOTOGRAPHY */}
      <section className="max-w-7xl mx-auto px-3 sm:px-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-blue-900/60 pb-3">
          <div>
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block font-mono">
              Academic Modules Explorer
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-white">
              Visual Learning & Resource Portals
            </h2>
          </div>
          <button
            onClick={() => onNavigate('/dashboard')}
            className="text-xs font-bold text-amber-300 hover:text-white flex items-center gap-1 transition font-mono self-start sm:self-auto"
          >
            View All Dashboard Tools <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {visualModules.map((mod) => (
            <div
              key={mod.id}
              onClick={() => onNavigate(mod.route)}
              className="bg-slate-900 border border-blue-900/60 hover:border-amber-400/80 rounded-3xl overflow-hidden shadow-2xl transition-all duration-300 hover:-translate-y-1 cursor-pointer group flex flex-col justify-between"
            >
              {/* Card Image Banner */}
              <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-slate-950">
                <img
                  src={mod.image}
                  alt={mod.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 filter brightness-[0.8]"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-black/40" />
                
                {/* Badge Overlay */}
                <div className="absolute top-3 left-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold font-mono border backdrop-blur-md shadow-md ${mod.badgeColor}`}>
                    {mod.tag}
                  </span>
                </div>
              </div>

              {/* Card Content */}
              <div className="p-5 sm:p-6 space-y-3 flex-1 flex flex-col justify-between">
                <div className="space-y-1.5">
                  <h3 className="text-lg sm:text-xl font-bold text-white group-hover:text-amber-300 transition-colors">
                    {mod.title}
                  </h3>
                  <p className="text-xs text-amber-300/90 font-mono font-medium">
                    {mod.subtitle}
                  </p>
                  <p className="text-xs text-slate-300 font-sans leading-relaxed pt-1">
                    {mod.desc}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs font-bold text-blue-300 group-hover:text-amber-300 transition-colors font-mono">
                  <span>ENTER MODULE</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. DEDICATED VISUAL PHOTOGRAPHY SPOTLIGHTS (Labs, Classrooms, Libraries) */}
      <section className="max-w-7xl mx-auto px-3 sm:px-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-blue-900/60 pb-3">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider font-mono">
              <Camera className="w-4 h-4 text-amber-400" />
              <span>Educational Photography Spotlight</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white">
              Campus Environments & Science Learning in Action
            </h2>
          </div>
          <p className="text-xs text-slate-400 font-sans max-w-md text-right hidden sm:block">
            High-definition photographic archives illustrating practical experiments, interactive classrooms, and reference libraries.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Science Laboratories */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FlaskConical className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                  Science Laboratories
                </span>
              </div>
              <span className="text-[10px] text-emerald-400 font-mono font-bold">Titrations & Mechanics</span>
            </div>
            <ImageCarousel 
              variant="card"
              category="labs"
              autoPlayInterval={5000}
              onNavigate={onNavigate}
              heightClassName="h-52 sm:h-60"
            />
            <button
              onClick={() => onNavigate('/practicals')}
              className="w-full py-2 px-3 rounded-xl bg-slate-900 hover:bg-emerald-950 border border-slate-800 hover:border-emerald-500/60 text-xs font-bold text-emerald-300 flex items-center justify-between transition font-mono"
            >
              <span>Explore Lab Guides</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Card 2: Classroom Lectures & Instruction */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-blue-400" />
                <span className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                  Classrooms & Lectures
                </span>
              </div>
              <span className="text-[10px] text-blue-400 font-mono font-bold">Topic Delivery</span>
            </div>
            <ImageCarousel 
              variant="card"
              category="classrooms"
              autoPlayInterval={6000}
              onNavigate={onNavigate}
              heightClassName="h-52 sm:h-60"
            />
            <button
              onClick={() => onNavigate('/notes')}
              className="w-full py-2 px-3 rounded-xl bg-slate-900 hover:bg-blue-950 border border-slate-800 hover:border-blue-500/60 text-xs font-bold text-blue-300 flex items-center justify-between transition font-mono"
            >
              <span>Explore Syllabus Notes</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Card 3: Digital Libraries & Past Papers */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Library className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                  Libraries & NECTA Archives
                </span>
              </div>
              <span className="text-[10px] text-amber-400 font-mono font-bold">Reference Vault</span>
            </div>
            <ImageCarousel 
              variant="card"
              category="libraries"
              autoPlayInterval={5500}
              onNavigate={onNavigate}
              heightClassName="h-52 sm:h-60"
            />
            <button
              onClick={() => onNavigate('/past-papers')}
              className="w-full py-2 px-3 rounded-xl bg-slate-900 hover:bg-amber-950 border border-slate-800 hover:border-amber-500/60 text-xs font-bold text-amber-300 flex items-center justify-between transition font-mono"
            >
              <span>Access NECTA Past Papers</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* 6. EDUCATIONAL PILLARS & SCHOOL EXCELLENCE SHOWCASE */}
      <section className="max-w-7xl mx-auto px-3 sm:px-6">
        <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-slate-950 border border-blue-800/60 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-8">
          <div className="text-center max-w-3xl mx-auto space-y-2">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-widest font-mono">
              Academic Excellence at Kizimba Secondary School
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              Why KDLH Drives Superior Examination Results
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 font-sans leading-relaxed">
              Designed specifically for the Tanzanian curriculum from Form I to Form VI to ensure every learner excels in national assessments.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-slate-900/90 border border-blue-900/50 p-5 rounded-2xl space-y-2.5">
              <div className="w-10 h-10 rounded-xl bg-blue-950 text-blue-400 border border-blue-700/50 flex items-center justify-center font-bold">
                <BookOpen className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-white">Verified Syllabus</h4>
              <p className="text-xs text-slate-300 font-sans leading-relaxed">
                Structured notes aligned with TIE and NECTA guidelines for all secondary levels.
              </p>
            </div>

            <div className="bg-slate-900/90 border border-blue-900/50 p-5 rounded-2xl space-y-2.5">
              <div className="w-10 h-10 rounded-xl bg-emerald-950 text-emerald-400 border border-emerald-700/50 flex items-center justify-center font-bold">
                <FlaskConical className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-white">Lab & Practicals</h4>
              <p className="text-xs text-slate-300 font-sans leading-relaxed">
                Clear instructions and apparatus setups for Chemistry, Physics, and Biology.
              </p>
            </div>

            <div className="bg-slate-900/90 border border-blue-900/50 p-5 rounded-2xl space-y-2.5">
              <div className="w-10 h-10 rounded-xl bg-amber-950 text-amber-400 border border-amber-700/50 flex items-center justify-center font-bold">
                <Zap className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-white">AI Optical Grading</h4>
              <p className="text-xs text-slate-300 font-sans leading-relaxed">
                Instant handwritten OCR grading with teacher red-pen feedback and score reports.
              </p>
            </div>

            <div className="bg-slate-900/90 border border-blue-900/50 p-5 rounded-2xl space-y-2.5">
              <div className="w-10 h-10 rounded-xl bg-indigo-950 text-indigo-400 border border-indigo-700/50 flex items-center justify-center font-bold">
                <FileCheck className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-white">Offline Vault</h4>
              <p className="text-xs text-slate-300 font-sans leading-relaxed">
                Cache study materials into IndexedDB for revision without constant internet.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. SUBJECTS DIRECTORY */}
      <section className="max-w-7xl mx-auto px-3 sm:px-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-blue-900/60 pb-3">
          <div>
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block font-mono">
              Secondary Subjects
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-white">
              Curriculum Directory (Form I – Form VI)
            </h2>
          </div>
          <button
            onClick={() => onNavigate('/dashboard')}
            className="text-xs font-bold text-amber-300 hover:text-white flex items-center gap-1 transition font-mono self-start sm:self-auto"
          >
            Open All in Dashboard <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {(subjects || []).slice(0, 12).map((sub) => (
            <div 
              key={sub.id} 
              onClick={() => onNavigate('/notes')}
              className="bg-slate-900 p-4 rounded-2xl border border-slate-800 hover:border-amber-400 cursor-pointer transition group shadow-md flex flex-col justify-between"
            >
              <div>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-blue-950 text-amber-300 border border-blue-800 block w-fit mb-2">
                  {sub.code}
                </span>
                <h4 className="text-xs sm:text-sm font-bold text-white group-hover:text-amber-300 transition-colors">
                  {sub.name}
                </h4>
              </div>
              <p className="text-[10px] text-slate-400 mt-2 font-mono">
                {sub.topicCount} Study Topics
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 8. FOUNDER STORY SECTION */}
      <section className="max-w-7xl mx-auto px-3 sm:px-6">
        <FounderCard />
      </section>

    </div>
  );
};

