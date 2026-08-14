import React, { useState } from 'react';
import { 
  Brain, 
  BookOpen, 
  HelpCircle, 
  FileText, 
  FlaskConical, 
  Video, 
  Headphones, 
  FolderKanban, 
  Briefcase, 
  BarChart3, 
  CalendarCheck, 
  Scan, 
  User, 
  Sparkles, 
  ArrowRight, 
  ChevronRight, 
  Search, 
  Award,
  Library,
  GraduationCap,
  Camera
} from 'lucide-react';
import { UserProfile, KDLHResource, Subject } from '../types';
import { ImageCarousel } from '../components/common/ImageCarousel';

interface MainDashboardViewProps {
  currentUser: UserProfile;
  resources: KDLHResource[];
  subjects: Subject[];
  onNavigate: (route: string) => void;
  onOpenSearch: () => void;
  onSelectResource: (resource: KDLHResource) => void;
  onOpenAuth: () => void;
}

export const MainDashboardView: React.FC<MainDashboardViewProps> = ({
  currentUser,
  subjects,
  onNavigate,
  onOpenSearch
}) => {
  const [selectedForm, setSelectedForm] = useState<string>('ALL');

  const navModules = [
    {
      id: 'ai',
      title: 'KDLH AI Study Tutor',
      subtitle: '24/7 Academic Problem Solving & Step-by-Step Explanations',
      image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80',
      icon: <Brain className="w-5 h-5 text-amber-300" />,
      route: '/ai-assistant',
      badge: '24/7 AI Tutor 🧠',
      borderAccent: 'border-blue-700/60 hover:border-amber-400',
      roles: ['STUDENT', 'TEACHER', 'ADMIN', 'FOUNDER']
    },
    {
      id: 'learning',
      title: 'Curriculum Notes',
      subtitle: 'Form I–VI Verified Notes & Topic Breakdown',
      image: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=600&q=80',
      icon: <BookOpen className="w-5 h-5 text-blue-300" />,
      route: '/notes',
      badge: 'Notes & Syllabus 📚',
      borderAccent: 'border-blue-800/60 hover:border-amber-400',
      roles: ['STUDENT', 'TEACHER', 'ADMIN', 'FOUNDER']
    },
    {
      id: 'practicals',
      title: 'Science Practical Lab',
      subtitle: 'Titration, Mechanics, Optics & Specimens',
      image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=600&q=80',
      icon: <FlaskConical className="w-5 h-5 text-emerald-300" />,
      route: '/practicals',
      badge: 'Science Labs 🧪',
      borderAccent: 'border-emerald-800/60 hover:border-amber-400',
      roles: ['STUDENT', 'TEACHER', 'ADMIN', 'FOUNDER']
    },
    {
      id: 'past-papers',
      title: 'NECTA Past Papers',
      subtitle: 'Solved National Exams with Marking Schemes',
      image: 'https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?auto=format&fit=crop&w=600&q=80',
      icon: <FileText className="w-5 h-5 text-amber-300" />,
      route: '/past-papers',
      badge: 'NECTA Archive 📝',
      borderAccent: 'border-amber-800/60 hover:border-amber-400',
      roles: ['STUDENT', 'TEACHER', 'ADMIN', 'FOUNDER']
    },
    {
      id: 'videos',
      title: 'Video Learning Hub',
      subtitle: 'Recorded Lessons & Practical Demonstrations',
      image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=600&q=80',
      icon: <Video className="w-5 h-5 text-rose-300" />,
      route: '/videos',
      badge: 'Video Hub 🎥',
      borderAccent: 'border-rose-800/60 hover:border-amber-400',
      roles: ['STUDENT', 'TEACHER', 'ADMIN', 'FOUNDER']
    },
    {
      id: 'resources',
      title: 'Digital Library & Books',
      subtitle: 'Curriculum Textbooks & Reference Literature',
      image: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=600&q=80',
      icon: <FolderKanban className="w-5 h-5 text-teal-300" />,
      route: '/books',
      badge: 'Digital Library 📖',
      borderAccent: 'border-teal-800/60 hover:border-amber-400',
      roles: ['STUDENT', 'TEACHER', 'ADMIN', 'FOUNDER']
    },
    {
      id: 'questions',
      title: 'Topical Question Bank',
      subtitle: 'Self-Testing Questions with Answers',
      image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=600&q=80',
      icon: <HelpCircle className="w-5 h-5 text-indigo-300" />,
      route: '/questions',
      badge: 'Question Bank ❓',
      borderAccent: 'border-indigo-800/60 hover:border-amber-400',
      roles: ['STUDENT', 'TEACHER', 'ADMIN', 'FOUNDER']
    },
    {
      id: 'audio',
      title: 'Audio Lessons & Podcasts',
      subtitle: 'Spoken Narration & Audio Study Notes',
      image: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=600&q=80',
      icon: <Headphones className="w-5 h-5 text-amber-300" />,
      route: '/audio',
      badge: 'Audio Hub 🎧',
      borderAccent: 'border-blue-800/60 hover:border-amber-400',
      roles: ['STUDENT', 'TEACHER', 'ADMIN', 'FOUNDER']
    },
    {
      id: 'exam-scanner',
      title: 'AI Exam Optical Grader',
      subtitle: 'Camera OCR Handwritten Script Grader',
      image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=600&q=80',
      icon: <Scan className="w-5 h-5 text-amber-400" />,
      route: '/exam-scanner',
      badge: 'OCR Marking 📷',
      borderAccent: 'border-amber-500/60 hover:border-amber-300',
      roles: ['STUDENT', 'TEACHER', 'ADMIN', 'FOUNDER']
    },
    {
      id: 'teacher-workspace',
      title: 'Teacher Workspace',
      subtitle: 'Lesson Plans, Schemes of Work & Syllabi',
      image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=600&q=80',
      icon: <Briefcase className="w-5 h-5 text-amber-300" />,
      route: '/teacher-workspace',
      badge: 'Teacher Tools 👨🏽‍🏫',
      borderAccent: 'border-amber-800/60 hover:border-amber-400',
      roles: ['STUDENT', 'TEACHER', 'ADMIN', 'FOUNDER']
    },
    {
      id: 'reports',
      title: 'Academic Reports',
      subtitle: 'Term Examination Performance & Trends',
      image: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=600&q=80',
      icon: <BarChart3 className="w-5 h-5 text-blue-300" />,
      route: '/reports',
      badge: 'Analytics 📊',
      borderAccent: 'border-blue-800/60 hover:border-amber-400',
      roles: ['STUDENT', 'TEACHER', 'ADMIN', 'FOUNDER']
    },
    {
      id: 'attendance',
      title: 'Attendance Register',
      subtitle: 'Daily Student & Class Attendance Logs',
      image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=600&q=80',
      icon: <CalendarCheck className="w-5 h-5 text-emerald-300" />,
      route: '/attendance',
      badge: 'Register 📅',
      borderAccent: 'border-emerald-800/60 hover:border-amber-400',
      roles: ['STUDENT', 'TEACHER', 'ADMIN', 'FOUNDER']
    }
  ];

  const visibleModules = navModules.filter(m => m.roles.includes(currentUser.role));
  const formsList = ['ALL', 'Form I', 'Form II', 'Form III', 'Form IV', 'Form V', 'Form VI'];

  const filteredSubjects = selectedForm === 'ALL' 
    ? subjects 
    : subjects.filter(s => s.forms.includes(selectedForm));

  return (
    <div className="space-y-8 pb-16 font-serif bg-slate-950 text-slate-100 min-h-screen">
      
      {/* Top Banner Header */}
      <section className="bg-gradient-to-r from-blue-950 via-slate-900 to-black border-b border-blue-800/60 py-8 px-4 sm:px-8 relative overflow-hidden">
        <div className="absolute top-0 right-1/4 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 relative z-10 font-serif">
          
          <div className="space-y-2 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-900/80 border border-amber-400/50 text-amber-300 text-xs font-bold font-mono shadow-md">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>🎓 KDLH Academic Portal • Kizimba Secondary School</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-white tracking-wide">
              Welcome, <span className="text-amber-300">{currentUser.name}</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-200 max-w-xl italic font-sans">
              "Access Tanzanian secondary school verified notes 📚, past papers, practical guides 🧪, video lessons 🎥, and AI tutoring."
            </p>
          </div>

          {/* User Profile Quick Card */}
          <div className="bg-slate-900/90 border border-blue-700/60 rounded-2xl p-4 flex items-center gap-4 shadow-xl min-w-[260px]">
            {currentUser.avatarUrl ? (
              <img src={currentUser.avatarUrl} alt={currentUser.name} className="w-12 h-12 rounded-full object-cover border-2 border-amber-400" />
            ) : (
              <div className="w-12 h-12 rounded-full bg-blue-950 border-2 border-amber-400 flex items-center justify-center font-bold text-amber-300 text-lg font-mono">
                {currentUser.name.charAt(0)}
              </div>
            )}
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-white">{currentUser.name}</span>
                <span className="px-2 py-0.5 rounded-full bg-blue-950 border border-amber-400/60 text-[10px] font-mono font-bold text-amber-300 uppercase">
                  {currentUser.role}
                </span>
              </div>
              <p className="text-xs text-slate-300 font-sans">{currentUser.school}</p>
              {currentUser.form && (
                <span className="text-[11px] font-bold text-amber-300 block font-mono">{currentUser.form}</span>
              )}
            </div>
          </div>

        </div>
      </section>

      {/* Main Workspace Layout */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 space-y-10 font-serif">

        {/* Global Search trigger bar */}
        <div 
          onClick={onOpenSearch}
          className="bg-slate-900 border border-blue-900/60 hover:border-amber-400 rounded-2xl p-3 sm:p-4 flex items-center gap-3 cursor-pointer transition shadow-md group text-slate-300 text-xs sm:text-sm"
        >
          <Search className="w-5 h-5 text-amber-400 ml-1 group-hover:scale-110 transition-transform" />
          <span className="flex-1 text-slate-300 truncate font-sans">Search Chemistry, Physics, Biology, Mathematics notes, questions, past papers...</span>
          <span className="px-4 py-2 bg-gradient-to-r from-blue-700 to-indigo-700 hover:from-blue-600 hover:to-indigo-600 text-white font-bold text-xs rounded-xl transition shadow whitespace-nowrap font-mono">
            Search KDLH
          </span>
        </div>

        {/* Educational Image Carousel Feature */}
        <div>
          <ImageCarousel 
            variant="hero"
            showCategoryTabs={true}
            showControls={true}
            showIndicators={true}
            autoPlayInterval={6000}
            onNavigate={onNavigate}
          />
        </div>

        {/* Visual Learning Stations & Educational Galleries */}
        <section className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-blue-900/60 pb-2">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider font-mono">
                <Camera className="w-4 h-4 text-amber-400" />
                <span>Curated Academic Photography</span>
              </div>
              <h2 className="text-xl font-bold text-white">Visual Learning Stations & Lab Showcase</h2>
            </div>
            <span className="text-xs text-slate-400 font-mono">Live Educational Focus Tracks</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Station 1: Science Laboratories & Practical Work */}
            <div className="space-y-3 bg-slate-900/80 p-4 rounded-3xl border border-blue-900/60 shadow-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FlaskConical className="w-4 h-4 text-emerald-400" />
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                    Science Laboratories
                  </h4>
                </div>
                <span className="text-[10px] text-emerald-300 font-mono px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-800">
                  Experiments 🧪
                </span>
              </div>
              <ImageCarousel 
                variant="card"
                category="labs"
                autoPlayInterval={5000}
                onNavigate={onNavigate}
                heightClassName="h-44 sm:h-48"
              />
              <div className="flex items-center justify-between pt-1">
                <span className="text-[11px] text-slate-300 font-sans">Chemistry, Physics & Biology</span>
                <button
                  onClick={() => onNavigate('/practicals')}
                  className="px-3 py-1.5 rounded-xl bg-emerald-950 hover:bg-emerald-900 border border-emerald-700/60 text-xs font-bold text-emerald-300 flex items-center gap-1 transition font-mono"
                >
                  <span>Open Labs</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* Station 2: Classrooms & Master Lectures */}
            <div className="space-y-3 bg-slate-900/80 p-4 rounded-3xl border border-blue-900/60 shadow-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-blue-400" />
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                    Interactive Classrooms
                  </h4>
                </div>
                <span className="text-[10px] text-blue-300 font-mono px-2 py-0.5 rounded bg-blue-950/80 border border-blue-800">
                  Lectures 📚
                </span>
              </div>
              <ImageCarousel 
                variant="card"
                category="classrooms"
                autoPlayInterval={6000}
                onNavigate={onNavigate}
                heightClassName="h-44 sm:h-48"
              />
              <div className="flex items-center justify-between pt-1">
                <span className="text-[11px] text-slate-300 font-sans">Form I – Form VI Delivery</span>
                <button
                  onClick={() => onNavigate('/notes')}
                  className="px-3 py-1.5 rounded-xl bg-blue-950 hover:bg-blue-900 border border-blue-700/60 text-xs font-bold text-blue-300 flex items-center gap-1 transition font-mono"
                >
                  <span>Open Notes</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* Station 3: Digital Libraries & NECTA Exam Vaults */}
            <div className="space-y-3 bg-slate-900/80 p-4 rounded-3xl border border-blue-900/60 shadow-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Library className="w-4 h-4 text-amber-400" />
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                    Digital Libraries
                  </h4>
                </div>
                <span className="text-[10px] text-amber-300 font-mono px-2 py-0.5 rounded bg-amber-950/80 border border-amber-800">
                  Reference 📖
                </span>
              </div>
              <ImageCarousel 
                variant="card"
                category="libraries"
                autoPlayInterval={5500}
                onNavigate={onNavigate}
                heightClassName="h-44 sm:h-48"
              />
              <div className="flex items-center justify-between pt-1">
                <span className="text-[11px] text-slate-300 font-sans">Books & NECTA Archives</span>
                <button
                  onClick={() => onNavigate('/books')}
                  className="px-3 py-1.5 rounded-xl bg-amber-950 hover:bg-amber-900 border border-amber-700/60 text-xs font-bold text-amber-300 flex items-center gap-1 transition font-mono"
                >
                  <span>Open Library</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Visual Module Cards Grid */}
        <section className="space-y-4">
          <div className="flex items-center justify-between border-b border-blue-900/60 pb-2">
            <div>
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block font-mono">Dashboard Navigation</span>
              <h2 className="text-xl font-bold text-white">Visual Academic Learning Portals</h2>
            </div>
            <span className="text-xs text-slate-400 font-mono">{visibleModules.length} Modules Available</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {visibleModules.map((mod) => (
              <div
                key={mod.id}
                onClick={() => onNavigate(mod.route)}
                className={`bg-slate-900 rounded-2xl border ${mod.borderAccent} overflow-hidden hover:scale-[1.02] transition-all duration-300 cursor-pointer flex flex-col justify-between shadow-xl group`}
              >
                {/* Visual Image Header on Card */}
                <div className="relative h-32 w-full overflow-hidden bg-slate-950">
                  <img
                    src={mod.image}
                    alt={mod.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 filter brightness-[0.75]"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />
                  
                  <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 bg-black/70 border border-white/20 px-2.5 py-0.5 rounded-full backdrop-blur">
                    {mod.icon}
                    <span className="text-[10px] font-mono font-bold text-amber-300">
                      {mod.badge}
                    </span>
                  </div>
                </div>

                {/* Card Content Body */}
                <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-base font-bold text-white group-hover:text-amber-300 transition-colors flex items-center justify-between">
                      <span>{mod.title}</span>
                      <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-amber-400 group-hover:translate-x-1 transition-transform" />
                    </h3>
                    <p className="text-xs text-slate-300 mt-1 font-sans leading-relaxed">
                      {mod.subtitle}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-amber-400 font-bold">
                    <span>Access Portal</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Secondary Curriculum Subject Explorer */}
        <section className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-blue-900/60 pb-3">
            <div>
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block font-mono">Tanzanian Curriculum</span>
              <h2 className="text-xl font-bold text-white">Secondary Subjects (Form I – Form VI)</h2>
            </div>

            {/* Form Selector Tabs */}
            <div className="flex flex-wrap items-center gap-1.5 bg-slate-900 p-1.5 rounded-xl border border-blue-900/60">
              {formsList.map((f) => (
                <button
                  key={f}
                  onClick={() => setSelectedForm(f)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                    selectedForm === f
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* Subjects Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
            {filteredSubjects.map((sub) => (
              <div
                key={sub.id}
                onClick={() => onNavigate('/notes')}
                className="bg-slate-900/90 border border-slate-800 hover:border-amber-400 p-4 rounded-2xl transition cursor-pointer flex flex-col justify-between space-y-3 group hover:shadow-lg"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-blue-950 text-amber-300 border border-blue-800">
                    {sub.code}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-amber-400 group-hover:translate-x-1 transition-transform" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors">
                    {sub.name}
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-0.5 font-mono">{sub.topicCount} Topics</p>
                </div>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
};
