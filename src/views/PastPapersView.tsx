import React, { useState, useMemo } from 'react';
import { Search, BookOpen, ExternalLink, ShieldCheck, Download, FileText } from 'lucide-react';
import { PastPaperResource, Subject, KDLHResource } from '../types';
import { ResourceCard } from '../components/common/ResourceCard';

interface PastPapersViewProps {
  resources: KDLHResource[];
  subjects: Subject[];
  onSelectResource: (resource: KDLHResource) => void;
  savedResourceIds: string[];
  onToggleSaveResource: (id: string) => void;
}

export const PastPapersView: React.FC<PastPapersViewProps> = ({
  resources,
  subjects,
  onSelectResource,
  savedResourceIds,
  onToggleSaveResource
}) => {
  const [selectedForm, setSelectedForm] = useState<string>('ALL');
  const [selectedSubject, setSelectedSubject] = useState<string>('ALL');
  const [selectedYear, setSelectedYear] = useState<string>('ALL');

  const papersList = useMemo(() => {
    return resources.filter(r => r.category === 'PAST_PAPER') as PastPaperResource[];
  }, [resources]);

  const filteredPapers = useMemo(() => {
    return papersList.filter(paper => {
      const matchesForm = selectedForm === 'ALL' || paper.form === selectedForm;
      const matchesSubject = selectedSubject === 'ALL' || paper.subjectId === selectedSubject;
      const matchesYear = selectedYear === 'ALL' || String(paper.year) === selectedYear;

      return matchesForm && matchesSubject && matchesYear;
    });
  }, [papersList, selectedForm, selectedSubject, selectedYear]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8 font-mono">
      
      {/* Header */}
      <div className="bg-black/60 text-cyan-100 p-8 rounded-2xl border border-cyan-900/50 shadow-[0_0_20px_rgba(6,182,212,0.1)] space-y-3 backdrop-blur-xl">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950 border border-cyan-500/40 text-cyan-300 text-xs font-bold shadow-[0_0_8px_rgba(6,182,212,0.2)]">
          <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" /> Official NECTA & School Examination Archive
        </div>
        <h1 className="text-2xl sm:text-4xl font-black text-white tracking-wider uppercase">Past Papers Repository</h1>
        <p className="text-sm text-cyan-200/80 max-w-2xl leading-relaxed font-sans">
          Access National Examinations Council of Tanzania (NECTA) CSEE and ACSEE examination papers with official marking schemes and solution guides.
        </p>
      </div>

      {/* Filters Bar */}
      <div className="bg-cyan-950/20 p-6 rounded-2xl border border-cyan-900/50 shadow-sm grid grid-cols-1 sm:grid-cols-3 gap-4 backdrop-blur-md">
        <div>
          <label className="block text-xs font-bold text-cyan-400 uppercase tracking-wider mb-1">Subject</label>
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

        <div>
          <label className="block text-xs font-bold text-cyan-400 uppercase tracking-wider mb-1">Form / Level</label>
          <select
            value={selectedForm}
            onChange={(e) => setSelectedForm(e.target.value)}
            className="w-full px-3 py-2 bg-black/60 border border-cyan-900/50 rounded-xl text-xs font-bold text-cyan-200 focus:outline-none focus:border-cyan-400"
          >
            <option value="ALL" className="bg-slate-900 text-white">All Forms</option>
            <option value="Form IV" className="bg-slate-900 text-white">Form IV (CSEE)</option>
            <option value="Form VI" className="bg-slate-900 text-white">Form VI (ACSEE)</option>
            <option value="Form II" className="bg-slate-900 text-white">Form II (FTNA)</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-cyan-400 uppercase tracking-wider mb-1">Exam Year</label>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="w-full px-3 py-2 bg-black/60 border border-cyan-900/50 rounded-xl text-xs font-bold text-cyan-200 focus:outline-none focus:border-cyan-400"
          >
            <option value="ALL" className="bg-slate-900 text-white">All Years</option>
            <option value="2024" className="bg-slate-900 text-white">2024</option>
            <option value="2023" className="bg-slate-900 text-white">2023</option>
            <option value="2022" className="bg-slate-900 text-white">2022</option>
            <option value="2021" className="bg-slate-900 text-white">2021</option>
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

    </div>
  );
};
