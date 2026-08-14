import React, { useState, useMemo } from 'react';
import { Search, Plus, BookOpen, Sparkles } from 'lucide-react';
import { NoteResource, Subject, KDLHResource, UserProfile } from '../types';
import { ResourceCard } from '../components/common/ResourceCard';
import { AddContentModal } from '../components/common/AddContentModal';
import { ModuleVisualBanner } from '../components/common/ModuleVisualBanner';

interface NotesViewProps {
  resources: KDLHResource[];
  subjects: Subject[];
  currentUser?: UserProfile;
  onSelectResource: (resource: KDLHResource) => void;
  savedResourceIds: string[];
  onToggleSaveResource: (id: string) => void;
  onRefreshResources?: () => void;
}

export const NotesView: React.FC<NotesViewProps> = ({
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
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [addModalOpen, setAddModalOpen] = useState<boolean>(false);

  const notesList = useMemo(() => {
    return resources.filter(r => r.category === 'NOTE') as NoteResource[];
  }, [resources]);

  const filteredNotes = useMemo(() => {
    return notesList.filter(note => {
      const matchesForm = selectedForm === 'ALL' || note.form === selectedForm;
      const matchesSubject = selectedSubject === 'ALL' || note.subjectId === selectedSubject;
      const matchesQuery = 
        !searchQuery ||
        note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.description.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesForm && matchesSubject && matchesQuery;
    });
  }, [notesList, selectedForm, selectedSubject, searchQuery]);

  const formsList = ['ALL', 'Form I', 'Form II', 'Form III', 'Form IV', 'Form V', 'Form VI'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-8 font-serif">
      
      {/* Visual Rotating Header Banner */}
      <ModuleVisualBanner
        moduleKey="NOTES"
        actionButton={
          <button
            onClick={() => setAddModalOpen(true)}
            className="px-5 py-3 rounded-2xl bg-gradient-to-r from-blue-700 to-indigo-700 hover:from-blue-600 hover:to-indigo-600 text-white font-bold text-xs uppercase tracking-wider shadow-xl flex items-center gap-2 whitespace-nowrap border border-amber-400/50 transition-transform transform hover:scale-105 font-mono"
          >
            <Plus className="w-4 h-4 text-amber-300" />
            <span>Upload / Create Note</span>
          </button>
        }
      />

      {/* Filter Controls */}
      <div className="bg-slate-900/90 p-5 rounded-3xl border border-blue-900/60 shadow-xl space-y-4 backdrop-blur-md">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 text-amber-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search topic e.g. Alcohols, Genetics, Algebra..."
              className="w-full pl-9 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-2xl text-xs font-medium text-white focus:outline-none focus:border-amber-400 placeholder:text-slate-500 font-sans"
            />
          </div>

          {/* Subject Filter */}
          <div>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-2xl text-xs font-bold text-amber-300 focus:outline-none focus:border-amber-400 font-mono"
            >
              <option value="ALL" className="bg-slate-900 text-white">All Tanzanian Subjects</option>
              {subjects.map(s => (
                <option key={s.id} value={s.id} className="bg-slate-900 text-white">{s.name}</option>
              ))}
            </select>
          </div>

          {/* Form Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto text-xs scrollbar-none">
            {formsList.map(f => (
              <button
                key={f}
                onClick={() => setSelectedForm(f)}
                className={`px-3 py-2 rounded-xl font-bold whitespace-nowrap transition-all border font-mono ${
                  selectedForm === f ? 'bg-blue-600 text-white border-amber-400 shadow-md' : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Notes Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredNotes.map(note => (
          <ResourceCard
            key={note.id}
            resource={note}
            onSelect={onSelectResource}
            onToggleSave={onToggleSaveResource}
            isSaved={savedResourceIds.includes(note.id)}
          />
        ))}
      </div>

      {filteredNotes.length === 0 && (
        <div className="bg-slate-900/80 p-12 rounded-3xl border border-blue-900/40 text-center text-slate-400 space-y-4">
          <BookOpen className="w-12 h-12 mx-auto text-blue-400" />
          <div className="space-y-1">
            <h4 className="font-bold text-white text-base">No notes found for this filter</h4>
            <p className="text-xs text-slate-300 max-w-md mx-auto font-sans">
              You can upload notes for {selectedSubject !== 'ALL' ? subjects.find(s=>s.id===selectedSubject)?.name : 'this subject'} ({selectedForm}) using the upload button below.
            </p>
          </div>
          <button
            onClick={() => setAddModalOpen(true)}
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold uppercase tracking-wider inline-flex items-center gap-2 shadow-lg font-mono"
          >
            <Plus className="w-4 h-4" /> Add Note Now
          </button>
        </div>
      )}

      {/* Upload Modal */}
      <AddContentModal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        defaultCategory="NOTE"
        subjects={subjects}
        onContentAdded={() => onRefreshResources && onRefreshResources()}
        uploaderName={currentUser?.name || 'KDLH Teacher'}
      />

    </div>
  );
};
