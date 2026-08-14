import React, { useState, useMemo } from 'react';
import { HelpCircle, Search, CheckCircle2, ChevronDown, ChevronUp, Plus, BookOpen } from 'lucide-react';
import { QuestionBankItem, KDLHResource, Subject, UserProfile } from '../types';
import { AddContentModal } from '../components/common/AddContentModal';

interface QuestionsViewProps {
  resources: KDLHResource[];
  subjects?: Subject[];
  currentUser?: UserProfile;
  onRefreshResources?: () => void;
}

export const QuestionsView: React.FC<QuestionsViewProps> = ({ 
  resources,
  subjects = [],
  currentUser,
  onRefreshResources
}) => {
  const [selectedForm, setSelectedForm] = useState<string>('ALL');
  const [selectedSubject, setSelectedSubject] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [addModalOpen, setAddModalOpen] = useState<boolean>(false);

  const questions = useMemo(() => {
    return resources.filter(r => r.category === 'QUESTION') as QuestionBankItem[];
  }, [resources]);

  const filtered = useMemo(() => {
    return questions.filter(q => {
      const matchesForm = selectedForm === 'ALL' || q.form === selectedForm;
      const matchesSubject = selectedSubject === 'ALL' || q.subjectName.toLowerCase() === selectedSubject.toLowerCase();
      const matchesQuery = !searchQuery || 
        q.questionText.toLowerCase().includes(searchQuery.toLowerCase()) || 
        q.topic?.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesForm && matchesSubject && matchesQuery;
    });
  }, [questions, selectedForm, selectedSubject, searchQuery]);

  const formsList = ['ALL', 'Form I', 'Form II', 'Form III', 'Form IV', 'Form V', 'Form VI'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8 font-mono">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-950 via-slate-900 to-indigo-950 text-white p-8 rounded-3xl border border-purple-800/40 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-3xl">
          <span className="text-xs font-bold text-purple-400 uppercase tracking-widest block">
            Central Academic Item Bank • Form I to Form VI
          </span>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white uppercase tracking-wider">Question Bank Repository</h1>
          <p className="text-xs sm:text-sm text-purple-200/90 leading-relaxed font-sans">
            Search and practice questions categorized by subject, topic, form, and difficulty with step-by-step solutions and marking schemes.
          </p>
        </div>

        <button
          onClick={() => setAddModalOpen(true)}
          className="px-5 py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-extrabold text-xs uppercase tracking-wider shadow-lg flex items-center gap-2 whitespace-nowrap border border-white/20 transition-transform transform hover:scale-105"
        >
          <Plus className="w-4 h-4 text-purple-200" />
          <span>Upload Question</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-slate-900/90 p-6 rounded-2xl border border-purple-900/40 shadow-md grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-bold text-purple-400 uppercase tracking-wider mb-1">Search Question</label>
          <div className="relative">
            <Search className="w-4 h-4 text-purple-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search topic, text..."
              className="w-full pl-9 pr-3 py-2 bg-black/60 border border-purple-900/40 rounded-xl text-xs font-medium text-white focus:outline-none focus:border-purple-400"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-purple-400 uppercase tracking-wider mb-1">Subject</label>
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="w-full px-3 py-2 bg-black/60 border border-purple-900/40 rounded-xl text-xs font-bold text-purple-200 focus:outline-none focus:border-purple-400"
          >
            <option value="ALL" className="bg-slate-900 text-white">All Tanzanian Subjects</option>
            {subjects.map(s => (
              <option key={s.id} value={s.name} className="bg-slate-900 text-white">{s.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-purple-400 uppercase tracking-wider mb-1">Form</label>
          <select
            value={selectedForm}
            onChange={(e) => setSelectedForm(e.target.value)}
            className="w-full px-3 py-2 bg-black/60 border border-purple-900/40 rounded-xl text-xs font-bold text-purple-200 focus:outline-none focus:border-purple-400"
          >
            {formsList.map(f => (
              <option key={f} value={f} className="bg-slate-900 text-white">{f}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Question Items List */}
      <div className="space-y-4">
        {filtered.map(q => {
          const isExpanded = expandedId === q.id;
          return (
            <div key={q.id} className="bg-slate-900/90 rounded-2xl border border-purple-900/40 shadow-lg overflow-hidden transition-all">
              <div 
                onClick={() => setExpandedId(isExpanded ? null : q.id)}
                className="p-5 flex items-center justify-between cursor-pointer hover:bg-slate-800/60 transition-colors"
              >
                <div className="space-y-1 max-w-3xl">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="font-bold text-purple-300 bg-purple-950 border border-purple-700/60 px-2.5 py-0.5 rounded-lg">
                      {q.subjectName} • {q.form}
                    </span>
                    <span className="text-slate-400 font-sans">{q.questionType} • Marks: {q.marks}</span>
                  </div>
                  <h4 className="font-bold text-white text-base font-sans">{q.questionText}</h4>
                </div>

                <button className="p-2 text-purple-400 hover:text-white">
                  {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </button>
              </div>

              {isExpanded && (
                <div className="p-5 bg-black/50 border-t border-purple-900/40 text-xs space-y-3 font-sans">
                  {q.options && q.options.length > 0 && (
                    <div className="space-y-1">
                      <strong className="text-purple-300 block font-mono">Options:</strong>
                      {q.options.map((opt, idx) => (
                        <div key={idx} className="p-2.5 bg-slate-900 rounded-xl border border-slate-800 text-slate-200">{opt}</div>
                      ))}
                    </div>
                  )}

                  <div className="p-3 bg-emerald-950/60 border border-emerald-700/60 rounded-xl space-y-1">
                    <strong className="text-emerald-300 block font-mono">Correct Answer & Marking Guide:</strong>
                    <p className="font-bold text-emerald-200">{q.correctAnswer}</p>
                  </div>

                  {q.explanation && (
                    <div className="p-3 bg-blue-950/60 border border-blue-700/60 rounded-xl text-blue-200">
                      <strong className="block font-mono text-blue-300">Step-by-Step Solution:</strong> {q.explanation}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="bg-slate-900/80 p-10 rounded-2xl border border-purple-900/40 text-center text-slate-400 space-y-4">
          <HelpCircle className="w-12 h-12 mx-auto text-purple-400" />
          <div className="space-y-1">
            <h4 className="font-bold text-white text-base">No questions found for this filter</h4>
            <p className="text-xs text-slate-300 max-w-md mx-auto">
              Add topical or exam practice questions for {selectedForm} using the upload button below.
            </p>
          </div>
          <button
            onClick={() => setAddModalOpen(true)}
            className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold uppercase tracking-wider inline-flex items-center gap-2 shadow-lg"
          >
            <Plus className="w-4 h-4" /> Upload Question Now
          </button>
        </div>
      )}

      {/* Upload Modal */}
      <AddContentModal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        defaultCategory="QUESTION"
        subjects={subjects}
        onContentAdded={() => onRefreshResources && onRefreshResources()}
        uploaderName={currentUser?.name || 'KDLH Examiner'}
      />

    </div>
  );
};
