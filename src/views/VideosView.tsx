import React, { useState, useMemo } from 'react';
import { 
  Video, Play, Search, Film, FlaskConical, BookOpen, HelpCircle, 
  Sparkles, Globe, Plus
} from 'lucide-react';
import { VideoResource, KDLHResource, VideoCategoryType, Subject, UserProfile } from '../types';
import { AddContentModal } from '../components/common/AddContentModal';
import { ModuleVisualBanner } from '../components/common/ModuleVisualBanner';

interface VideosViewProps {
  resources: KDLHResource[];
  subjects?: Subject[];
  currentUser?: UserProfile;
  onSelectResource: (resource: KDLHResource) => void;
  onNavigateToNotes?: (subject: string, topic: string) => void;
  onNavigateToQuestions?: (subject: string, topic: string) => void;
  onNavigateToPracticals?: (subject: string, topic: string) => void;
  onRefreshResources?: () => void;
}

export const VideosView: React.FC<VideosViewProps> = ({ 
  resources, 
  subjects = [],
  currentUser,
  onSelectResource,
  onNavigateToNotes,
  onNavigateToQuestions,
  onNavigateToPracticals,
  onRefreshResources
}) => {
  const [activeTab, setActiveTab] = useState<'ALL' | 'PRACTICALS' | 'LESSONS' | 'REVISION' | 'QUESTIONS'>('ALL');
  const [selectedForm, setSelectedForm] = useState<string>('ALL');
  const [selectedSubject, setSelectedSubject] = useState<string>('ALL');
  const [selectedLevel, setSelectedLevel] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [addModalOpen, setAddModalOpen] = useState<boolean>(false);

  // Extract all video items
  const allVideos = useMemo(() => {
    return resources.filter(r => (r.category === 'VIDEO' || r.category === 'TUTORIAL') && (r as any).published !== false) as VideoResource[];
  }, [resources]);

  // Extract lists for filter options
  const formsList = ['Form I', 'Form II', 'Form III', 'Form IV', 'Form V', 'Form VI'];
  const subjectsList = ['Chemistry', 'Physics', 'Biology', 'Mathematics', 'Computer Science', 'Geography', 'History', 'Civics', 'English Language', 'Kiswahili', 'Agriculture'];

  // Filtered videos based on active state
  const filteredVideos = useMemo(() => {
    return allVideos.filter(vid => {
      // Tab filter
      if (activeTab === 'PRACTICALS' && vid.videoCategory !== 'PRACTICALS' && !vid.practicalName && !vid.tags?.includes('Practical')) return false;
      if (activeTab === 'LESSONS' && vid.videoCategory !== 'LESSONS' && vid.videoCategory !== 'NOTES_EXPLANATIONS') return false;
      if (activeTab === 'REVISION' && vid.videoCategory !== 'REVISION' && vid.videoCategory !== 'EXAM_PREPARATION') return false;
      if (activeTab === 'QUESTIONS' && vid.videoCategory !== 'QUESTIONS' && vid.videoCategory !== 'PAST_PAPER_EXPLANATIONS') return false;

      // Level filter
      if (selectedLevel !== 'ALL' && vid.level && vid.level !== selectedLevel) return false;

      // Form filter
      if (selectedForm !== 'ALL' && vid.form !== selectedForm) return false;

      // Subject filter
      if (selectedSubject !== 'ALL' && vid.subjectName.toLowerCase() !== selectedSubject.toLowerCase()) return false;

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = vid.title.toLowerCase().includes(q);
        const matchTopic = vid.topic?.toLowerCase().includes(q);
        const matchDesc = vid.description?.toLowerCase().includes(q);
        const matchPractical = vid.practicalName?.toLowerCase().includes(q);
        const matchSubject = vid.subjectName?.toLowerCase().includes(q);
        if (!matchTitle && !matchTopic && !matchDesc && !matchPractical && !matchSubject) return false;
      }

      return true;
    });
  }, [allVideos, activeTab, selectedLevel, selectedForm, selectedSubject, searchQuery]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-8 font-serif">
      
      {/* Module Visual Rotating Header Banner */}
      <ModuleVisualBanner
        moduleKey="VIDEOS"
        actionButton={
          <button
            onClick={() => setAddModalOpen(true)}
            className="px-5 py-3 rounded-2xl bg-gradient-to-r from-rose-600 to-indigo-700 hover:from-rose-500 hover:to-indigo-600 text-white font-bold text-xs uppercase tracking-wider shadow-xl flex items-center gap-2 whitespace-nowrap border border-amber-400/50 transition-transform transform hover:scale-105 font-mono"
          >
            <Plus className="w-4 h-4 text-amber-300" />
            <span>Upload Video Lesson</span>
          </button>
        }
      />

      {/* SEARCH AND FILTERS TOOLBAR */}
      <div className="bg-slate-900/90 p-5 rounded-3xl border border-blue-900/60 shadow-xl space-y-4 font-serif">
        
        {/* Main Category Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-800 text-xs font-bold font-mono scrollbar-none">
          <button
            onClick={() => setActiveTab('ALL')}
            className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 whitespace-nowrap border ${
              activeTab === 'ALL'
                ? 'bg-rose-600 text-white border-rose-500 shadow-md'
                : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
            }`}
          >
            <Video className="w-4 h-4" /> All Video Hub ({allVideos.length})
          </button>

          <button
            onClick={() => setActiveTab('PRACTICALS')}
            className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 whitespace-nowrap border ${
              activeTab === 'PRACTICALS'
                ? 'bg-emerald-600 text-white border-emerald-500 shadow-md'
                : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
            }`}
          >
            <FlaskConical className="w-4 h-4 text-emerald-400" /> Lab Practical Videos
          </button>

          <button
            onClick={() => setActiveTab('LESSONS')}
            className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 whitespace-nowrap border ${
              activeTab === 'LESSONS'
                ? 'bg-blue-600 text-white border-blue-500 shadow-md'
                : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
            }`}
          >
            <BookOpen className="w-4 h-4 text-blue-400" /> Lesson Lectures
          </button>

          <button
            onClick={() => setActiveTab('REVISION')}
            className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 whitespace-nowrap border ${
              activeTab === 'REVISION'
                ? 'bg-purple-600 text-white border-purple-500 shadow-md'
                : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
            }`}
          >
            <Sparkles className="w-4 h-4 text-purple-400" /> Revision & Exam Prep
          </button>

          <button
            onClick={() => setActiveTab('QUESTIONS')}
            className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 whitespace-nowrap border ${
              activeTab === 'QUESTIONS'
                ? 'bg-amber-600 text-white border-amber-500 shadow-md'
                : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
            }`}
          >
            <HelpCircle className="w-4 h-4 text-amber-400" /> Solved Questions
          </button>
        </div>

        {/* Filter Dropdowns & Search */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3 text-xs">
          
          {/* Search bar */}
          <div className="md:col-span-2 relative">
            <Search className="w-4 h-4 text-amber-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search topic, practical name, subject..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 bg-slate-950 border border-slate-800 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 font-sans"
            />
          </div>

          {/* Form Filter */}
          <div>
            <select
              value={selectedForm}
              onChange={(e) => setSelectedForm(e.target.value)}
              className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-2xl text-slate-200 focus:outline-none focus:border-amber-400 font-mono"
            >
              <option value="ALL">All Forms (I - VI)</option>
              {formsList.map(f => <option key={f} value={f}>{f}</option>)}
            </select>
          </div>

          {/* Subject Filter */}
          <div>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-2xl text-slate-200 focus:outline-none focus:border-amber-400 font-mono"
            >
              <option value="ALL">All Subjects</option>
              {subjectsList.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          {/* Level Filter */}
          <div>
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-2xl text-slate-200 focus:outline-none focus:border-amber-400 font-mono"
            >
              <option value="ALL">All Levels</option>
              <option value="O-LEVEL">O-Level (Form 1-4)</option>
              <option value="A-LEVEL">A-Level (Form 5-6)</option>
            </select>
          </div>

        </div>
      </div>

      {/* VIDEO GRID */}
      {filteredVideos.length === 0 ? (
        <div className="bg-slate-900/80 border border-blue-900/40 rounded-3xl p-12 text-center space-y-3">
          <Video className="w-12 h-12 text-slate-500 mx-auto" />
          <h3 className="text-lg font-bold text-white">No Video Lessons Found</h3>
          <p className="text-xs text-slate-300 max-w-md mx-auto font-sans">
            No videos match your selected filter criteria. Try adjusting the form, subject, or search term.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVideos.map(vid => {
            const isPractical = vid.videoCategory === 'PRACTICALS' || vid.practicalName;

            return (
              <div
                key={vid.id}
                className="bg-slate-900/90 rounded-3xl border border-blue-900/60 overflow-hidden shadow-2xl hover:border-amber-400/80 transition-all duration-300 flex flex-col group"
              >
                {/* Thumbnail & Video Play Trigger */}
                <div 
                  onClick={() => onSelectResource(vid)}
                  className="aspect-video bg-black relative overflow-hidden cursor-pointer group-hover:opacity-95 transition"
                >
                  <img
                    src={vid.thumbnailUrl}
                    alt={vid.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />
                  
                  {/* Overlay Badges */}
                  <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                    <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded bg-black/80 text-white border border-slate-700">
                      {vid.form}
                    </span>
                    {isPractical && (
                      <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-700 flex items-center gap-1">
                        <FlaskConical className="w-3 h-3" /> Practical
                      </span>
                    )}
                  </div>

                  {/* Play Overlay Button */}
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="p-4 rounded-2xl bg-rose-600 text-white shadow-2xl scale-95 group-hover:scale-110 transition duration-300">
                      <Play className="w-8 h-8 fill-current ml-1" />
                    </div>
                  </div>

                  {/* Duration Badge */}
                  <span className="absolute bottom-3 right-3 text-[10px] font-mono bg-black/80 text-amber-300 px-2 py-0.5 rounded border border-slate-800">
                    {Math.floor(vid.durationSeconds / 60)} mins
                  </span>
                </div>

                {/* Content Details */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-[11px] font-bold text-amber-400 uppercase tracking-wider font-mono">
                      <span>{vid.subjectName} • {vid.topic}</span>
                      <span className="text-slate-400">{vid.level || 'O-LEVEL'}</span>
                    </div>

                    <h3 
                      onClick={() => onSelectResource(vid)}
                      className="font-bold text-white text-base group-hover:text-amber-300 transition cursor-pointer line-clamp-2"
                    >
                      {vid.title}
                    </h3>

                    <p className="text-xs text-slate-300 font-sans line-clamp-2 leading-relaxed">
                      {vid.description}
                    </p>

                    {vid.sourceName && (
                      <div className="text-[10px] text-blue-300 font-mono flex items-center gap-1 pt-1">
                        <Globe className="w-3 h-3" />
                        <span>Source: {vid.sourceName}</span>
                      </div>
                    )}
                  </div>

                  {/* Connected Learning Links */}
                  <div className="pt-3 border-t border-slate-800 space-y-2">
                    <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider font-mono">
                      Connected Materials:
                    </div>

                    <div className="flex flex-wrap items-center gap-1.5 text-[11px] font-mono">
                      {onNavigateToNotes && (
                        <button
                          onClick={() => onNavigateToNotes(vid.subjectName, vid.topic)}
                          className="px-2.5 py-1 bg-slate-950 hover:bg-slate-800 text-blue-300 rounded-lg border border-slate-800 flex items-center gap-1 transition"
                        >
                          <BookOpen className="w-3 h-3" /> Notes
                        </button>
                      )}

                      {onNavigateToQuestions && (
                        <button
                          onClick={() => onNavigateToQuestions(vid.subjectName, vid.topic)}
                          className="px-2.5 py-1 bg-slate-950 hover:bg-slate-800 text-amber-300 rounded-lg border border-slate-800 flex items-center gap-1 transition"
                        >
                          <HelpCircle className="w-3 h-3" /> Questions
                        </button>
                      )}

                      {onNavigateToPracticals && isPractical && (
                        <button
                          onClick={() => onNavigateToPracticals(vid.subjectName, vid.topic)}
                          className="px-2.5 py-1 bg-slate-950 hover:bg-slate-800 text-emerald-300 rounded-lg border border-slate-800 flex items-center gap-1 transition"
                        >
                          <FlaskConical className="w-3 h-3" /> Lab Guide
                        </button>
                      )}
                    </div>
                  </div>

                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Upload Modal */}
      <AddContentModal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        defaultCategory="VIDEO"
        subjects={subjects}
        onContentAdded={() => onRefreshResources && onRefreshResources()}
        uploaderName={currentUser?.name || 'KDLH Video Tutor'}
      />

    </div>
  );
};
