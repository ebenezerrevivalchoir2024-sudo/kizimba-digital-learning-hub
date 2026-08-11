import React, { useState, useMemo } from 'react';
import { FlaskConical, AlertTriangle, CheckCircle2, Video, FileText, Download } from 'lucide-react';
import { PracticalLabResource, KDLHResource } from '../types';

interface PracticalsViewProps {
  resources: KDLHResource[];
  onSelectResource: (resource: KDLHResource) => void;
}

export const PracticalsView: React.FC<PracticalsViewProps> = ({ resources, onSelectResource }) => {
  const [selectedSubject, setSelectedSubject] = useState<string>('ALL');

  const practicals = useMemo(() => {
    return resources.filter(r => r.category === 'PRACTICAL') as PracticalLabResource[];
  }, [resources]);

  const filtered = useMemo(() => {
    if (selectedSubject === 'ALL') return practicals;
    return practicals.filter(p => p.subjectName.toLowerCase() === selectedSubject.toLowerCase());
  }, [practicals, selectedSubject]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8 font-mono">
      
      {/* Header */}
      <div className="bg-black/60 text-cyan-100 p-8 rounded-2xl border border-cyan-900/50 shadow-[0_0_20px_rgba(6,182,212,0.1)] space-y-3 backdrop-blur-xl">
        <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest block">
          Science Laboratory Technology
        </span>
        <h1 className="text-2xl sm:text-4xl font-black text-white tracking-wider uppercase">KDLH Digital Practical Lab</h1>
        <p className="text-sm text-cyan-200/80 max-w-2xl leading-relaxed font-sans">
          Interactive practical laboratory guides for Chemistry, Biology, and Physics with detailed apparatus setups, safety procedures, chemical equations, and calculations.
        </p>
      </div>

      {/* Subject Filter Bar */}
      <div className="flex items-center gap-2 overflow-x-auto text-xs font-bold bg-cyan-950/20 p-3 rounded-2xl border border-cyan-900/50 shadow-xs backdrop-blur-md">
        <span className="text-cyan-400 mr-2 uppercase tracking-wider">Subject Filter:</span>
        {['ALL', 'Chemistry', 'Biology', 'Physics'].map(sub => (
          <button
            key={sub}
            onClick={() => setSelectedSubject(sub)}
            className={`px-4 py-2 rounded-xl transition-all border ${
              selectedSubject === sub ? 'bg-cyan-400 text-black border-cyan-400 shadow-[0_0_10px_#22d3ee]' : 'bg-black/40 text-cyan-200 border-cyan-900/40 hover:bg-cyan-950/40'
            }`}
          >
            {sub}
          </button>
        ))}
      </div>

      {/* Practicals Cards Grid */}
      <div className="space-y-6">
        {filtered.map(prac => (
          <div key={prac.id} className="bg-black/60 rounded-2xl border border-cyan-900/50 shadow-[0_0_20px_rgba(6,182,212,0.1)] p-6 space-y-6 backdrop-blur-xl">
            
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-cyan-900/40 pb-4">
              <div>
                <span className="text-xs font-bold text-cyan-300 bg-cyan-950 px-2.5 py-0.5 rounded border border-cyan-800">
                  {prac.subjectName} • {prac.form}
                </span>
                <h3 className="text-xl font-bold text-white tracking-wider uppercase mt-2">{prac.title}</h3>
                <p className="text-xs text-cyan-300/70 font-sans">{prac.description}</p>
              </div>

              <button
                onClick={() => onSelectResource(prac)}
                className="px-4 py-2 bg-cyan-400 hover:bg-cyan-300 text-black rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-[0_0_10px_#22d3ee] transition-all uppercase tracking-wider self-start sm:self-auto"
              >
                <FileText className="w-4 h-4" /> View Complete Guide
              </button>
            </div>

            {/* Objective Box */}
            <div className="bg-cyan-950/40 p-4 rounded-xl border border-cyan-800/50 text-xs text-cyan-200 space-y-1">
              <strong className="text-cyan-400 block text-xs uppercase tracking-wider">Experiment Objective:</strong>
              <p className="font-sans">{prac.objective}</p>
            </div>

            {/* Grid of Apparatus & Safety */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              
              {/* Apparatus & Chemicals */}
              <div className="bg-black/40 p-4 rounded-xl border border-cyan-900/40 space-y-2">
                <h4 className="font-bold text-cyan-400 flex items-center gap-1 uppercase tracking-wider">
                  <FlaskConical className="w-4 h-4 text-cyan-400" /> Apparatus & Chemicals Required:
                </h4>
                <ul className="list-disc list-inside text-cyan-200/80 space-y-1 pl-1 font-sans">
                  {prac.apparatus.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                  {prac.chemicalsMaterials.map((chem, idx) => (
                    <li key={`chem-${idx}`} className="font-semibold text-cyan-300">{chem}</li>
                  ))}
                </ul>
              </div>

              {/* Safety Precautions */}
              <div className="bg-amber-950/20 p-4 rounded-xl border border-amber-500/40 space-y-2 text-amber-200">
                <h4 className="font-bold text-amber-400 flex items-center gap-1 uppercase tracking-wider">
                  <AlertTriangle className="w-4 h-4 text-amber-400" /> Safety Precautions:
                </h4>
                <ul className="list-disc list-inside text-amber-200/90 space-y-1 pl-1 font-sans">
                  {prac.safetyPrecautions.map((safe, idx) => (
                    <li key={idx}>{safe}</li>
                  ))}
                </ul>
              </div>

            </div>

            {/* Procedure Steps Highlights */}
            <div className="space-y-2">
              <h4 className="font-bold text-xs uppercase tracking-wider text-cyan-400">Key Procedure Steps:</h4>
              <ol className="list-decimal list-inside text-xs text-cyan-200/80 space-y-1 bg-black/40 p-4 rounded-xl border border-cyan-900/40 font-sans">
                {prac.procedureSteps.slice(0, 4).map((step, idx) => (
                  <li key={idx} className="leading-relaxed">{step}</li>
                ))}
              </ol>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
};
