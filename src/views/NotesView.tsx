import React, { useState, useMemo } from 'react';
import { Search, Filter, BookOpen, FileText, CheckCircle2, Bookmark, Download, Sparkles } from 'lucide-react';
import { NoteResource, Subject, KDLHResource } from '../types';
import { ResourceCard } from '../components/common/ResourceCard';

interface NotesViewProps {
  resources: KDLHResource[];
  subjects: Subject[];
  onSelectResource: (resource: KDLHResource) => void;
  savedResourceIds: string[];
  onToggleSaveResource: (id: string) => void;
}

export const NotesView: React.FC<NotesViewProps> = ({
  resources,
  subjects,
  onSelectResource,
  savedResourceIds,
  onToggleSaveResource
}) => {
  const [selectedForm, setSelectedForm] = useState<string>('ALL');
  const [selectedSubject, setSelectedSubject] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8 font-mono">
      
      {/* Header */}
      <div className="bg-black/60 text-cyan-100 p-8 rounded-2xl border border-cyan-900/50 shadow-[0_0_20px_rgba(6,182,212,0.1)] space-y-3 backdrop-blur-xl">
        <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest block">
          Digital Academic Repository
        </span>
        <h1 className="text-2xl sm:text-4xl font-black text-white tracking-wider uppercase">Digital Notes Library</h1>
        <p className="text-sm text-cyan-200/80 max-w-2xl leading-relaxed font-sans">
          Comprehensive, teacher-prepared study notes for Form I through Form VI aligned with the official Tanzanian secondary school curriculum.
        </p>
      </div>

      {/* Filter Controls */}
      <div className="bg-cyan-950/20 p-6 rounded-2xl border border-cyan-900/50 shadow-sm space-y-4 backdrop-blur-md">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 text-cyan-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search topic e.g. Alcohols, Genetics..."
              className="w-full pl-9 pr-4 py-2 bg-black/60 border border-cyan-900/50 rounded-xl text-xs font-medium text-white focus:outline-none focus:border-cyan-400 placeholder:text-cyan-600"
            />
          </div>

          {/* Subject Filter */}
          <div>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full px-3 py-2 bg-black/60 border border-cyan-900/50 rounded-xl text-xs font-bold text-cyan-200 focus:outline-none focus:border-cyan-400"
            >
              <option value="ALL" className="bg-slate-900 text-white">All Subjects</option>
              {subjects.map(s => (
                <option key={s.id} value={s.id} className="bg-slate-900 text-white">{s.name}</option>
              ))}
            </select>
          </div>

          {/* Form Filter Pills */}
          <div className="flex items-center gap-1 overflow-x-auto text-xs">
            {formsList.map(f => (
              <button
                key={f}
                onClick={() => setSelectedForm(f)}
                className={`px-3 py-2 rounded-xl font-bold whitespace-nowrap transition-all border ${
                  selectedForm === f ? 'bg-cyan-400 text-black border-cyan-400 shadow-[0_0_10px_#22d3ee]' : 'bg-black/40 text-cyan-200 border-cyan-900/40 hover:bg-cyan-950/40'
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
        <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center text-slate-500 space-y-2">
          <BookOpen className="w-12 h-12 mx-auto text-slate-300" />
          <h4 className="font-bold text-slate-800">No notes found matching selected filters</h4>
          <p className="text-xs">Try clearing search query or selecting "All Subjects".</p>
        </div>
      )}

    </div>
  );
};
