import React, { useState, useMemo } from 'react';
import { FlaskConical, AlertTriangle, FileText, Plus, Search } from 'lucide-react';
import { PracticalLabResource, KDLHResource, Subject, UserProfile } from '../types';
import { AddContentModal } from '../components/common/AddContentModal';
import { ModuleVisualBanner } from '../components/common/ModuleVisualBanner';

interface PracticalsViewProps {
  resources: KDLHResource[];
  subjects?: Subject[];
  currentUser?: UserProfile;
  onSelectResource: (resource: KDLHResource) => void;
  onRefreshResources?: () => void;
}

export const PracticalsView: React.FC<PracticalsViewProps> = ({ 
  resources, 
  subjects = [],
  currentUser,
  onSelectResource,
  onRefreshResources
}) => {
  const [selectedForm, setSelectedForm] = useState<string>('ALL');
  const [selectedSubject, setSelectedSubject] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [addModalOpen, setAddModalOpen] = useState<boolean>(false);

  const practicals = useMemo(() => {
    return resources.filter(r => r.category === 'PRACTICAL') as PracticalLabResource[];
  }, [resources]);

  const filtered = useMemo(() => {
    return practicals.filter(p => {
      const matchesForm = selectedForm === 'ALL' || p.form === selectedForm;
      const matchesSubject = selectedSubject === 'ALL' || p.subjectName.toLowerCase() === selectedSubject.toLowerCase();
      const matchesQuery = !searchQuery || 
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        p.objective?.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesForm && matchesSubject && matchesQuery;
    });
  }, [practicals, selectedForm, selectedSubject, searchQuery]);

  const formsList = ['ALL', 'Form I', 'Form II', 'Form III', 'Form IV', 'Form V', 'Form VI'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-8 font-serif">
      
      {/* Visual Rotating Header Banner */}
      <ModuleVisualBanner
        moduleKey="PRACTICALS"
        actionButton={
          <button
            onClick={() => setAddModalOpen(true)}
            className="px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white font-bold text-xs uppercase tracking-wider shadow-xl flex items-center gap-2 whitespace-nowrap border border-amber-400/50 transition-transform transform hover:scale-105 font-mono"
          >
            <Plus className="w-4 h-4 text-amber-300" />
            <span>Upload Lab Practical</span>
          </button>
        }
      />

      {/* Filter Controls */}
      <div className="bg-slate-900/90 p-5 rounded-3xl border border-blue-900/60 shadow-xl grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-bold text-amber-300 uppercase tracking-wider mb-1 font-mono">Search Practical</label>
          <div className="relative">
            <Search className="w-4 h-4 text-amber-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search titrations, mechanics, optics..."
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
            <option value="ALL" className="bg-slate-900 text-white">All Science & Tech Subjects</option>
            {subjects.map(s => (
              <option key={s.id} value={s.name} className="bg-slate-900 text-white">{s.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-amber-300 uppercase tracking-wider mb-1 font-mono">Form</label>
          <select
            value={selectedForm}
            onChange={(e) => setSelectedForm(e.target.value)}
            className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-2xl text-xs font-bold text-slate-200 focus:outline-none focus:border-amber-400 font-mono"
          >
            {formsList.map(f => (
              <option key={f} value={f} className="bg-slate-900 text-white">{f}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Practicals Cards Grid */}
      <div className="space-y-6">
        {filtered.map(prac => (
          <div key={prac.id} className="bg-slate-900/90 rounded-3xl border border-blue-900/60 hover:border-amber-400/80 shadow-2xl p-6 sm:p-8 space-y-6 backdrop-blur-xl transition-all">
            
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
              <div>
                <span className="text-xs font-bold text-amber-300 bg-blue-950 px-3 py-1 rounded-xl border border-blue-800 font-mono">
                  {prac.subjectName} • {prac.form}
                </span>
                <h3 className="text-xl font-bold text-white tracking-wide uppercase mt-2.5">{prac.title}</h3>
                <p className="text-xs text-slate-300 font-sans mt-0.5">{prac.description}</p>
              </div>

              <button
                onClick={() => onSelectResource(prac)}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-lg transition-all uppercase tracking-wider self-start sm:self-auto font-mono"
              >
                <FileText className="w-4 h-4" /> View Complete Guide
              </button>
            </div>

            {/* Objective Box */}
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-xs text-slate-200 space-y-1">
              <strong className="text-amber-300 block text-xs uppercase tracking-wider font-mono">Experiment Objective:</strong>
              <p className="font-sans leading-relaxed">{prac.objective}</p>
            </div>

            {/* Grid of Apparatus & Safety */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              
              {/* Apparatus & Chemicals */}
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                <h4 className="font-bold text-amber-400 flex items-center gap-1 uppercase tracking-wider font-mono">
                  <FlaskConical className="w-4 h-4 text-emerald-400" /> Apparatus & Chemicals Required:
                </h4>
                <ul className="list-disc list-inside text-slate-300 space-y-1 pl-1 font-sans">
                  {(prac.apparatus || []).map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                  {(prac.chemicalsMaterials || []).map((chem, idx) => (
                    <li key={`chem-${idx}`} className="font-semibold text-amber-300">{chem}</li>
                  ))}
                </ul>
              </div>

              {/* Safety Precautions */}
              <div className="bg-amber-950/20 p-4 rounded-2xl border border-amber-500/40 space-y-2 text-amber-200">
                <h4 className="font-bold text-amber-400 flex items-center gap-1 uppercase tracking-wider font-mono">
                  <AlertTriangle className="w-4 h-4 text-amber-400" /> Safety Precautions:
                </h4>
                <ul className="list-disc list-inside text-amber-200/90 space-y-1 pl-1 font-sans">
                  {(prac.safetyPrecautions || []).map((safe, idx) => (
                    <li key={idx}>{safe}</li>
                  ))}
                </ul>
              </div>

            </div>

            {/* Procedure Steps Highlights */}
            <div className="space-y-2">
              <h4 className="font-bold text-xs uppercase tracking-wider text-amber-300 font-mono">Key Procedure Steps:</h4>
              <ol className="list-decimal list-inside text-xs text-slate-300 space-y-1 bg-slate-950 p-4 rounded-2xl border border-slate-800 font-sans">
                {(prac.procedureSteps || []).slice(0, 4).map((step, idx) => (
                  <li key={idx} className="leading-relaxed">{step}</li>
                ))}
              </ol>
            </div>

          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="bg-slate-900/80 p-12 rounded-3xl border border-blue-900/40 text-center text-slate-400 space-y-4">
          <FlaskConical className="w-12 h-12 mx-auto text-emerald-400" />
          <div className="space-y-1">
            <h4 className="font-bold text-white text-base">No practical guides found for this filter</h4>
            <p className="text-xs text-slate-300 max-w-md mx-auto font-sans">
              Add laboratory experiment procedures and practical guides for {selectedForm} using the upload button below.
            </p>
          </div>
          <button
            onClick={() => setAddModalOpen(true)}
            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold uppercase tracking-wider inline-flex items-center gap-2 shadow-lg font-mono"
          >
            <Plus className="w-4 h-4" /> Upload Practical Guide
          </button>
        </div>
      )}

      {/* Upload Modal */}
      <AddContentModal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        defaultCategory="PRACTICAL"
        subjects={subjects}
        onContentAdded={() => onRefreshResources && onRefreshResources()}
        uploaderName={currentUser?.name || 'KDLH Lab Instructor'}
      />

    </div>
  );
};
