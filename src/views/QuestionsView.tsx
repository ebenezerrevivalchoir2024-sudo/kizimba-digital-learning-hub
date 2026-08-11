import React, { useState, useMemo } from 'react';
import { HelpCircle, Search, CheckCircle2, ChevronDown, ChevronUp } from 'lucide-react';
import { QuestionBankItem, KDLHResource } from '../types';

interface QuestionsViewProps {
  resources: KDLHResource[];
}

export const QuestionsView: React.FC<QuestionsViewProps> = ({ resources }) => {
  const [selectedSubject, setSelectedSubject] = useState<string>('ALL');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const questions = useMemo(() => {
    return resources.filter(r => r.category === 'QUESTION') as QuestionBankItem[];
  }, [resources]);

  const filtered = useMemo(() => {
    if (selectedSubject === 'ALL') return questions;
    return questions.filter(q => q.subjectName.toLowerCase() === selectedSubject.toLowerCase());
  }, [questions, selectedSubject]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-950 via-slate-900 to-indigo-950 text-white p-8 rounded-2xl shadow-xl space-y-3 border border-purple-800/40">
        <span className="text-xs font-bold text-purple-400 uppercase tracking-wider block">
          Central Academic Item Bank
        </span>
        <h1 className="text-2xl sm:text-4xl font-black">Question Bank Repository</h1>
        <p className="text-sm text-purple-200 max-w-2xl leading-relaxed">
          Search and practice questions categorized by subject, topic, and difficulty with step-by-step marking schemes.
        </p>
      </div>

      {/* Filter Bar */}
      <div className="flex items-center gap-2 overflow-x-auto text-xs font-bold bg-white p-3 rounded-2xl border border-slate-200/80 shadow-xs">
        <span className="text-slate-500 mr-2">Subject Filter:</span>
        {['ALL', 'Chemistry', 'Physics', 'Biology'].map(sub => (
          <button
            key={sub}
            onClick={() => setSelectedSubject(sub)}
            className={`px-4 py-2 rounded-xl transition-colors ${
              selectedSubject === sub ? 'bg-purple-700 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            {sub}
          </button>
        ))}
      </div>

      {/* Question Items List */}
      <div className="space-y-4">
        {filtered.map(q => {
          const isExpanded = expandedId === q.id;
          return (
            <div key={q.id} className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
              <div 
                onClick={() => setExpandedId(isExpanded ? null : q.id)}
                className="p-5 flex items-center justify-between cursor-pointer hover:bg-slate-50 transition-colors"
              >
                <div className="space-y-1 max-w-2xl">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded">
                      {q.subjectName} • {q.form}
                    </span>
                    <span className="text-slate-500">{q.questionType} • Marks: {q.marks}</span>
                  </div>
                  <h4 className="font-bold text-slate-900 text-base">{q.questionText}</h4>
                </div>

                <button className="p-2 text-slate-400 hover:text-slate-700">
                  {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </button>
              </div>

              {isExpanded && (
                <div className="p-5 bg-slate-50 border-t border-slate-100 text-xs space-y-3">
                  {q.options && (
                    <div className="space-y-1">
                      <strong className="text-slate-700 block">Options:</strong>
                      {q.options.map((opt, idx) => (
                        <div key={idx} className="p-2 bg-white rounded border border-slate-200">{opt}</div>
                      ))}
                    </div>
                  )}

                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl space-y-1">
                    <strong className="text-emerald-900 block">Correct Answer & Marking Guide:</strong>
                    <p className="font-bold text-emerald-800">{q.correctAnswer}</p>
                  </div>

                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-blue-900">
                    <strong>Step-by-Step Explanation:</strong> {q.explanation}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

    </div>
  );
};
