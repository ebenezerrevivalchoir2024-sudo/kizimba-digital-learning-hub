import React, { useState, useEffect } from 'react';
import { User, Bookmark, Award, BookOpen, Clock, CheckCircle2, Sparkles, ChevronRight } from 'lucide-react';
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      
      {/* Student Welcome Banner */}
      <div className="bg-gradient-to-r from-cyan-950 via-black to-slate-950 text-white p-8 rounded-2xl shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6 border border-cyan-900/50 font-mono">
        <div className="space-y-2">
          <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest block">Student Dashboard Portal</span>
          <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-wider text-white">Welcome back, {currentUser.name}!</h1>
          <p className="text-xs sm:text-sm text-cyan-300">{currentUser.school} • {currentUser.form || 'Form IV'}</p>
        </div>

        <div className="flex items-center gap-4 bg-black/60 p-4 rounded-xl border border-cyan-900/50 text-xs font-mono">
          <div>
            <span className="text-2xl font-black text-cyan-400 block">{currentUser.streakDays || 5} Days</span>
            <span className="text-cyan-300/70 font-semibold">Study Streak</span>
          </div>
          <div className="w-px h-8 bg-cyan-900/50" />
          <div>
            <span className="text-2xl font-black text-cyan-300 block">{savedResourceIds.length}</span>
            <span className="text-cyan-300/70 font-semibold">Saved Items</span>
          </div>
        </div>
      </div>

      {/* Saved Bookmarks Section */}
      <div className="space-y-4 font-mono">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-white flex items-center gap-2 uppercase tracking-wider">
            <Bookmark className="w-5 h-5 text-cyan-400" /> My Saved Resources
          </h3>
          <span className="text-xs text-cyan-400/80">{savedResources.length} saved</span>
        </div>

        {savedResources.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedResources.map(res => (
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
          <div className="bg-black/60 p-8 rounded-2xl border border-cyan-900/50 text-center text-cyan-400/80 space-y-2">
            <Bookmark className="w-8 h-8 mx-auto text-cyan-600" />
            <p className="font-bold text-white text-sm uppercase tracking-wider">No saved resources yet.</p>
            <p className="text-xs text-cyan-300/70 font-sans">Click the bookmark icon or offline hard drive icon on any note or past paper to save it for offline reading.</p>
          </div>
        )}
      </div>

      {/* Quiz Scores History */}
      <div className="bg-black/60 p-6 rounded-2xl border border-cyan-900/50 shadow-xl space-y-4 font-mono">
        <h3 className="text-base font-bold text-white flex items-center gap-2 uppercase tracking-wider">
          <Award className="w-5 h-5 text-cyan-400" /> Revision Quiz Performance
        </h3>

        {scores.length > 0 ? (
          <div className="divide-y divide-slate-100 text-xs">
            {scores.map((s, idx) => (
              <div key={idx} className="py-3 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-slate-800">{s.quizTitle}</h4>
                  <p className="text-slate-400">{s.date}</p>
                </div>
                <div className="text-right">
                  <span className="font-black text-purple-700 text-sm">{s.score} / {s.total}</span>
                  <span className="block text-[10px] text-emerald-600 font-bold">{Math.round((s.score / s.total) * 100)}%</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-500">No revision quizzes completed yet. Go to <button onClick={() => onNavigate('/revision')} className="text-blue-700 font-bold underline">Revision Center</button> to take your first test.</p>
        )}
      </div>

    </div>
  );
};
