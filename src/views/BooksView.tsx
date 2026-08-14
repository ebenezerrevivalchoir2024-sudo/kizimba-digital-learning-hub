import React, { useState, useMemo } from 'react';
import { BookOpen, Search, Plus } from 'lucide-react';
import { BookResource, Subject, KDLHResource, UserProfile } from '../types';
import { ResourceCard } from '../components/common/ResourceCard';
import { AddContentModal } from '../components/common/AddContentModal';
import { ModuleVisualBanner } from '../components/common/ModuleVisualBanner';

interface BooksViewProps {
  resources: KDLHResource[];
  subjects: Subject[];
  currentUser?: UserProfile;
  onSelectResource: (resource: KDLHResource) => void;
  savedResourceIds: string[];
  onToggleSaveResource: (id: string) => void;
  onRefreshResources?: () => void;
}

export const BooksView: React.FC<BooksViewProps> = ({
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

  const booksList = useMemo(() => {
    return resources.filter(r => r.category === 'BOOK') as BookResource[];
  }, [resources]);

  const filteredBooks = useMemo(() => {
    return booksList.filter(book => {
      const matchesForm = selectedForm === 'ALL' || book.form === selectedForm;
      const matchesSubject = selectedSubject === 'ALL' || book.subjectId === selectedSubject;
      const matchesQuery = 
        !searchQuery ||
        book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.author?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.topic?.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesForm && matchesSubject && matchesQuery;
    });
  }, [booksList, selectedForm, selectedSubject, searchQuery]);

  const formsList = ['ALL', 'Form I', 'Form II', 'Form III', 'Form IV', 'Form V', 'Form VI'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-8 font-serif">
      
      {/* Module Visual Rotating Header Banner */}
      <ModuleVisualBanner
        moduleKey="BOOKS"
        actionButton={
          <button
            onClick={() => setAddModalOpen(true)}
            className="px-5 py-3 rounded-2xl bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-500 hover:to-yellow-500 text-white font-bold text-xs uppercase tracking-wider shadow-xl flex items-center gap-2 whitespace-nowrap border border-amber-400/50 transition-transform transform hover:scale-105 font-mono"
          >
            <Plus className="w-4 h-4 text-amber-200" />
            <span>Upload Textbook / Book</span>
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
              placeholder="Search book title, author, topic..."
              className="w-full pl-9 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-2xl text-xs font-medium text-white focus:outline-none focus:border-amber-400 placeholder:text-slate-500 font-sans"
            />
          </div>

          {/* Subject Filter */}
          <div>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-2xl text-xs font-bold text-slate-200 focus:outline-none focus:border-amber-400 font-mono"
            >
              <option value="ALL" className="bg-slate-900 text-white">All Tanzanian Subjects</option>
              {subjects.map(s => (
                <option key={s.id} value={s.id} className="bg-slate-900 text-white">{s.name}</option>
              ))}
            </select>
          </div>

          {/* Form Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto text-xs scrollbar-none font-mono">
            {formsList.map(f => (
              <button
                key={f}
                onClick={() => setSelectedForm(f)}
                className={`px-3 py-2 rounded-xl font-bold whitespace-nowrap transition-all border ${
                  selectedForm === f ? 'bg-amber-400 text-black border-amber-400 shadow-md' : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBooks.map(book => (
          <ResourceCard
            key={book.id}
            resource={book}
            onSelect={onSelectResource}
            onToggleSave={onToggleSaveResource}
            isSaved={savedResourceIds.includes(book.id)}
          />
        ))}
      </div>

      {filteredBooks.length === 0 && (
        <div className="bg-slate-900/80 p-12 rounded-3xl border border-blue-900/40 text-center text-slate-400 space-y-4">
          <BookOpen className="w-12 h-12 mx-auto text-amber-400" />
          <div className="space-y-1">
            <h4 className="font-bold text-white text-base">No books found for this filter</h4>
            <p className="text-xs text-slate-300 max-w-md mx-auto font-sans">
              Add textbooks or learning reference materials for {selectedForm} using the upload button below.
            </p>
          </div>
          <button
            onClick={() => setAddModalOpen(true)}
            className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold uppercase tracking-wider inline-flex items-center gap-2 shadow-lg font-mono"
          >
            <Plus className="w-4 h-4" /> Upload Book Now
          </button>
        </div>
      )}

      {/* Upload Modal */}
      <AddContentModal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        defaultCategory="BOOK"
        subjects={subjects}
        onContentAdded={() => onRefreshResources && onRefreshResources()}
        uploaderName={currentUser?.name || 'KDLH Librarian'}
      />

    </div>
  );
};
