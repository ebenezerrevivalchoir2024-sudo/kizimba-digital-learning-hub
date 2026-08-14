import React, { useState, useMemo } from 'react';
import { Search, Plus, BookOpen } from 'lucide-react';
import { PastPaperResource, Subject, KDLHResource, UserProfile } from '../types';
import { ResourceCard } from '../components/common/ResourceCard';
import { AddContentModal } from '../components/common/AddContentModal';
import { ModuleVisualBanner } from '../components/common/ModuleVisualBanner';

interface PastPapersViewProps {
  resources: KDLHResource[];
  subjects: Subject[];
  currentUser?: UserProfile;
  onSelectResource: (resource: KDLHResource) => void;
  savedResourceIds: string[];
  onToggleSaveResource: (id: string) => void;
  onRefreshResources?: () => void;
}

export const PastPapersView: React.FC<PastPapersViewProps> = ({
  resources,
  subjects,
  currentUser,
  onSelectResource,
  savedResourceIds,
  onToggleSaveResource,
  onRefreshResources
}) => {
  const [selectedForm, setSelectedForm] = useState<string>('ALL');
  const [selectedSubject, setSelectedSubject] = useState<string>('ALL');
  const [selectedYear, setSelectedYear] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [addModalOpen, setAddModalOpen] = useState<boolean>(false);

  const papersList = useMemo(() => {
    return resources.filter(r => r.category === 'PAST_PAPER') as PastPaperResource[];
  }, [resources]);

  const filteredPapers = useMemo(() => {
    return papersList.filter(paper => {
      const matchesForm = selectedForm === 'ALL' || paper.form === selectedForm;
      const matchesSubject = selectedSubject === 'ALL' || paper.subjectId === selectedSubject;
      const matchesYear = selectedYear === 'ALL' || String(paper.year) === selectedYear;
      const matchesSearch = !searchQuery || 
        paper.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        paper.topic?.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesForm && matchesSubject && matchesYear && matchesSearch;
    });
  }, [papersList, selectedForm, selectedSubject, selectedYear, searchQuery]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-8 font-serif">
      
      {/* Visual Rotating Header Banner */}
      <ModuleVisualBanner
        moduleKey="PAST_PAPERS"
        actionButton={
          <button
            onClick={() => setAddModalOpen(true)}
            className="px-5 py-3 rounded-2xl bg-gradient-to-r from-amber-600 to-indigo-700 hover:from-amber-500 hover:to-indigo-600 text-white font-bold text-xs uppercase tracking-wider shadow-xl flex items-center gap-2 whitespace-nowrap border border-amber-400/50 transition-transform transform hover:scale-105 font-mono"
          >
            <Plus className="w-4 h-4 text-amber-200" />
            <span>Upload Past Paper</span>
          </button>
        }
      />

      {/* Filters Bar */}
      <div className="bg-slate-900/90 p-5 rounded-3xl border border-blue-900/60 shadow-xl grid grid-cols-1 sm:grid-cols-4 gap-4 backdrop-blur-md">
        <div>
          <label className="block text-xs font-bold text-amber-300 uppercase tracking-wider mb-1 font-mono">Search Exam</label>
          <div className="relative">
            <Search className="w-4 h-4 text-amber-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search e.g. Chemistry Paper 1..."
              className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-2xl text-xs font-medium text-white focus:outline-none focus:border-amber-400 font-sans"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-amber-300 uppercase tracking-wider mb-1 font-mono">Subject</label>
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-2xl text-xs font-bold text-slate-200 focus:outline-none focus:border-amber-400 font-mono"
          >
            <option value="ALL" className="bg-slate-900 text-white">All Tanzanian Subjects</option>
            {subjects.map(s => (
              <option key={s.id} value={s.id} className="bg-slate-900 text-white">{s.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-amber-300 uppercase tracking-wider mb-1 font-mono">Form / Level</label>
          <select
            value={selectedForm}
            onChange={(e) => setSelectedForm(e.target.value)}
            className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-2xl text-xs font-bold text-slate-200 focus:outline-none focus:border-amber-400 font-mono"
          >
            <option value="ALL" className="bg-slate-900 text-white">All Forms (I - VI)</option>
            <option value="Form I" className="bg-slate-900 text-white">Form I</option>
            <option value="Form II" className="bg-slate-900 text-white">Form II (FTNA)</option>
            <option value="Form III" className="bg-slate-900 text-white">Form III</option>
            <option value="Form IV" className="bg-slate-900 text-white">Form IV (CSEE)</option>
            <option value="Form V" className="bg-slate-900 text-white">Form V</option>
            <option value="Form VI" className="bg-slate-900 text-white">Form VI (ACSEE)</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-amber-300 uppercase tracking-wider mb-1 font-mono">Exam Year</label>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-2xl text-xs font-bold text-slate-200 focus:outline-none focus:border-amber-400 font-mono"
          >
            <option value="ALL" className="bg-slate-900 text-white">All Exam Years</option>
            <option value="2025" className="bg-slate-900 text-white">2025</option>
            <option value="2024" className="bg-slate-900 text-white">2024</option>
            <option value="2023" className="bg-slate-900 text-white">2023</option>
            <option value="2022" className="bg-slate-900 text-white">2022</option>
            <option value="2021" className="bg-slate-900 text-white">2021</option>
            <option value="2020" className="bg-slate-900 text-white">2020</option>
          </select>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPapers.map(paper => (
          <ResourceCard
            key={paper.id}
            resource={paper}
            onSelect={onSelectResource}
            onToggleSave={onToggleSaveResource}
            isSaved={savedResourceIds.includes(paper.id)}
          />
        ))}
      </div>

      {filteredPapers.length === 0 && (
        <div className="bg-slate-900/80 p-12 rounded-3xl border border-blue-900/40 text-center text-slate-400 space-y-4">
          <BookOpen className="w-12 h-12 mx-auto text-amber-400" />
          <div className="space-y-1">
            <h4 className="font-bold text-white text-base">No past papers found for this selection</h4>
            <p className="text-xs text-slate-300 max-w-md mx-auto font-sans">
              Add NECTA or school examination past papers and marking schemes for {selectedForm} using the upload button below.
            </p>
          </div>
          <button
            onClick={() => setAddModalOpen(true)}
            className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold uppercase tracking-wider inline-flex items-center gap-2 shadow-lg font-mono"
          >
            <Plus className="w-4 h-4" /> Upload Past Paper Now
          </button>
        </div>
      )}

      {/* Upload Modal */}
      <AddContentModal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        defaultCategory="PAST_PAPER"
        subjects={subjects}
        onContentAdded={() => onRefreshResources && onRefreshResources()}
        uploaderName={currentUser?.name || 'KDLH Academic Unit'}
      />

    </div>
  );
};
