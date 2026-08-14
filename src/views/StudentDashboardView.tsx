import React, { useState, useEffect } from 'react';
import { 
  User, 
  Bookmark, 
  Award, 
  BookOpen, 
  Sparkles, 
  ChevronRight, 
  Brain, 
  FileText, 
  HelpCircle, 
  FlaskConical, 
  Video, 
  Headphones, 
  FolderArchive, 
  BarChart3, 
  CalendarCheck,
  Building,
  GraduationCap
} from 'lucide-react';
import { UserProfile, KDLHResource } from '../types';
import { KdlhStorageService } from '../services/storage';
import { ResourceCard } from '../components/common/ResourceCard';

interface StudentDashboardViewProps {
  currentUser: UserProfile;
  resources: KDLHResource[];
  onSelectResource: (resource: KDLHResource) => void;
  savedResourceIds: string[];
  onToggleSaveResource: (id: string) => void;
  onNavigate: (route: string) => void;
}

export const StudentDashboardView: React.FC<StudentDashboardViewProps> = ({
  currentUser,
  resources,
  onSelectResource,
  savedResourceIds,
  onToggleSaveResource,
  onNavigate
}) => {
  const [scores, setScores] = useState<any[]>([]);

  useEffect(() => {
    setScores(KdlhStorageService.getQuizScores());
  }, []);

  const savedResources = resources.filter(r => savedResourceIds.includes(r.id));

  const quickAccessCards = [
    { title: 'KDLH AI ✏️', icon: <Brain className="w-5 h-5 text-blue-400" />, route: '/ai-assistant', desc: 'AI Tutor & Homework Help', badge: 'AI Tutor' },
    { title: 'Learning 📚', icon: <BookOpen className="w-5 h-5 text-emerald-400" />, route: '/notes', desc: 'Form I–VI Study Notes', badge: 'Curriculum' },
    { title: 'Questions ❓', icon: <HelpCircle className="w-5 h-5 text-amber-400" />, route: '/questions', desc: 'Topic Practice Quizzes', badge: 'Revision' },
    { title: 'Past Papers 📜', icon: <FileText className="w-5 h-5 text-purple-400" />, route: '/past-papers', desc: 'NECTA Past Papers', badge: 'Exams' },
    { title: 'Practicals 🧪', icon: <FlaskConical className="w-5 h-5 text-rose-400" />, route: '/practicals', desc: 'Science Lab Experiments', badge: 'Labs' },
    { title: 'Videos 🎥', icon: <Video className="w-5 h-5 text-cyan-400" />, route: '/videos', desc: 'Educational Video Lessons', badge: 'Media' },
    { title: 'Audio 🎧', icon: <Headphones className="w-5 h-5 text-teal-400" />, route: '/audio', desc: 'Audio Podcasts & Lessons', badge: 'Listen' },
    { title: 'Resources 🌸', icon: <FolderArchive className="w-5 h-5 text-indigo-400" />, route: '/books', desc: 'Syllabus & Digital Books', badge: 'Library' },
    { title: 'My Reports 📊', icon: <BarChart3 className="w-5 h-5 text-sky-400" />, route: '/reports', desc: 'Academic Report Cards', badge: 'Grades' },
    { title: 'My Attendance 📅', icon: <CalendarCheck className="w-5 h-5 text-green-400" />, route: '/attendance', desc: 'Roll Call & Daily Log', badge: 'Presence' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8 font-serif">
      
      {/* Student Welcome & Profile Banner */}
      <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-emerald-950 border border-blue-800/50 rounded-2xl p-6 sm:p-8 shadow-2xl text-white flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-5 font-serif">
          {currentUser.avatarUrl ? (
            <img 
              src={currentUser.avatarUrl} 
              alt={currentUser.name} 
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover border-2 border-emerald-400 shadow-xl"
            />
          ) : (
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-blue-900 border-2 border-emerald-400 flex items-center justify-center font-bold text-white text-2xl shadow-xl">
              {currentUser.name.charAt(0)}
            </div>
          )}

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-emerald-300 uppercase tracking-widest">🌸 KDLH STUDENT PORTAL 🎓</span>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-sans font-bold px-2 py-0.5 rounded border border-emerald-500/30">
                {currentUser.role}
              </span>
            </div>
            <h1 className="text-2xl font-black text-white">{currentUser.name}</h1>
            <p className="text-xs text-blue-200 flex items-center gap-2 font-serif italic">
              <GraduationCap className="w-4 h-4 text-emerald-400" /> {currentUser.form || 'Form IV'} • {currentUser.school || 'Kizimba Secondary School'}
            </p>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="flex items-center gap-4 bg-slate-950/80 p-3.5 rounded-xl border border-blue-800/50 text-xs font-serif">
          <div className="text-center px-3">
            <span className="text-2xl font-black text-emerald-400 block">{currentUser.streakDays || 14}</span>
            <span className="text-slate-300 text-[10px]">Streak Days 🔥</span>
          </div>
          <div className="w-px h-8 bg-slate-800" />
          <div className="text-center px-3">
            <span className="text-2xl font-black text-teal-400 block">{savedResourceIds.length}</span>
            <span className="text-slate-400 text-[10px]">Saved Items</span>
          </div>
        </div>
      </div>

      {/* Quick Learning Access Cards (10 Cards Grid) */}
      <div className="space-y-3">
        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">
          Quick Learning Access
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {quickAccessCards.map((card, idx) => (
            <div
              key={idx}
              onClick={() => onNavigate(card.route)}
              className="bg-slate-900 border border-slate-800 hover:border-blue-500/60 p-4 rounded-xl shadow-lg transition-all hover:-translate-y-0.5 cursor-pointer flex flex-col justify-between space-y-3 group"
            >
              <div className="flex items-center justify-between">
                <div className="p-2 bg-slate-950 rounded-lg border border-slate-800 group-hover:border-blue-500/30">
                  {card.icon}
                </div>
                <span className="text-[9px] font-mono font-bold text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                  {card.badge}
                </span>
              </div>

              <div>
                <h3 className="font-bold text-xs text-white group-hover:text-blue-400 transition-colors">
                  {card.title}
                </h3>
                <p className="text-[10px] text-slate-400 mt-0.5 leading-tight">
                  {card.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Saved Resources & Quiz History */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Saved Bookmarks */}
        <div className="lg:col-span-8 bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider font-mono flex items-center gap-2">
              <Bookmark className="w-4 h-4 text-blue-400" /> Saved Resources ({savedResources.length})
            </h3>
            <button onClick={() => onNavigate('/notes')} className="text-[11px] font-bold text-blue-400 hover:underline">
              Browse Notes →
            </button>
          </div>

          {savedResources.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {savedResources.slice(0, 4).map(res => (
                <ResourceCard
                  key={res.id}
                  resource={res}
                  onSelect={onSelectResource}
                  onToggleSave={onToggleSaveResource}
                  isSaved={true}
                />
              ))}
            </div>
          ) : (
            <div className="py-8 text-center text-slate-500 text-xs space-y-1">
              <Bookmark className="w-8 h-8 mx-auto text-slate-600" />
              <p className="font-bold text-slate-300">No saved resources yet.</p>
              <p className="text-[11px] text-slate-500">Click the bookmark icon on any note, paper, or practical guide to save it for quick offline revision.</p>
            </div>
          )}
        </div>

        {/* Quiz History */}
        <div className="lg:col-span-4 bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4 shadow-xl font-mono">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-400" /> Quiz History
            </h3>
            <button onClick={() => onNavigate('/questions')} className="text-[11px] font-bold text-amber-400 hover:underline">
              Take Quiz →
            </button>
          </div>

          {scores.length > 0 ? (
            <div className="divide-y divide-slate-800 text-xs space-y-2">
              {scores.slice(0, 5).map((s, idx) => (
                <div key={idx} className="pt-2 flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-white text-xs">{s.quizTitle}</h4>
                    <p className="text-[10px] text-slate-500">{s.date}</p>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-teal-400">{s.score} / {s.total}</span>
                    <span className="block text-[10px] text-slate-400">{Math.round((s.score / s.total) * 100)}%</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center text-slate-500 text-xs space-y-1">
              <Award className="w-8 h-8 mx-auto text-slate-600" />
              <p className="font-bold text-slate-300">No quizzes taken yet.</p>
              <p className="text-[11px] text-slate-500">Go to Questions to test your subject knowledge.</p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
