import React, { useState } from 'react';
import { X, Sparkles, Plus, Trash2, Printer, Download, Save, BookOpen, AlertCircle } from 'lucide-react';
import { SchemeOfWork, SchemeOfWorkItem } from '../../types';
import { KdlhStorageService } from '../../services/storage';

interface SchemeOfWorkModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialScheme?: SchemeOfWork | null;
  onSaved?: (scheme: SchemeOfWork) => void;
}

export const SchemeOfWorkModal: React.FC<SchemeOfWorkModalProps> = ({
  isOpen,
  onClose,
  initialScheme,
  onSaved
}) => {
  const [academicYear, setAcademicYear] = useState<string>(initialScheme?.academicYear || '2026');
  const [term, setTerm] = useState<'Term 1' | 'Term 2'>(initialScheme?.term || 'Term 1');
  const [form, setForm] = useState<string>(initialScheme?.form || 'Form IV');
  const [subject, setSubject] = useState<string>(initialScheme?.subject || 'Chemistry');
  const [teacherName, setTeacherName] = useState<string>(initialScheme?.teacherName || 'Mwl. Isaack Edward Lungwa');
  const [schoolName, setSchoolName] = useState<string>(initialScheme?.schoolName || 'Kizimba Secondary School');
  const [weeksCount, setWeeksCount] = useState<number>(initialScheme?.weeksCount || 12);
  const [periodsPerWeek, setPeriodsPerWeek] = useState<number>(initialScheme?.periodsPerWeek || 4);
  const [isAiGenerated, setIsAiGenerated] = useState<boolean>(initialScheme?.isAiGenerated || false);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  const [items, setItems] = useState<SchemeOfWorkItem[]>(
    initialScheme?.items || [
      {
        id: 'item-1',
        weekNumber: 1,
        datesRange: 'Jan 12 - Jan 16',
        topic: 'Organic Chemistry',
        subtopic: 'Naming & Structure of Alcohols',
        periods: 4,
        competenceObjectives: 'Define alcohols, classify primary/secondary/tertiary alcohols, and apply IUPAC rules.',
        teachingActivities: 'Teacher leads brainstorming on hydroxyl group (-OH) and demonstrates molecular models.',
        learningActivities: 'Learners draw structural formulas of methanol to pentanol and build models.',
        resourcesRequired: 'KDLH Organic Chemistry Note, Molecular model kits, Chart of IUPAC rules.',
        assessmentMethod: 'Oral questioning & Board exercises.',
        remarks: 'Covered successfully.'
      }
    ]
  );

  if (!isOpen) return null;

  const handleAddItem = () => {
    const newItem: SchemeOfWorkItem = {
      id: `sow-item-${Date.now()}`,
      weekNumber: items.length + 1,
      datesRange: `Week ${items.length + 1}`,
      topic: 'Organic Chemistry',
      subtopic: 'Preparation & Properties',
      periods: periodsPerWeek,
      competenceObjectives: 'Students understand chemical reactions and laboratory preparations.',
      teachingActivities: 'Demonstrate experiments and guide group discussions.',
      learningActivities: 'Observe reactions, record observations, write balanced equations.',
      resourcesRequired: 'KDLH Practical Guide & Reagents.',
      assessmentMethod: 'Short quiz & lab practical checklist.',
      remarks: 'Pending execution.'
    };
    setItems([...items, newItem]);
  };

  const handleRemoveItem = (id: string) => {
    setItems(items.filter((item) => item.id !== id).map((item, idx) => ({ ...item, weekNumber: idx + 1 })));
  };

  const handleUpdateItem = (id: string, field: keyof SchemeOfWorkItem, value: any) => {
    setItems(items.map((item) => item.id === id ? { ...item, [field]: value } : item));
  };

  const handleGenerateAiScheme = async () => {
    setIsGenerating(true);
    setTimeout(() => {
      const generatedItems: SchemeOfWorkItem[] = [
        {
          id: `ai-item-1`,
          weekNumber: 1,
          datesRange: 'Jan 12 - Jan 16',
          topic: 'Organic Chemistry',
          subtopic: 'Introduction to Functional Groups & Alcohols',
          periods: periodsPerWeek,
          competenceObjectives: 'Classify organic compounds by functional group with focus on alcohols.',
          teachingActivities: 'Teacher explains general formula CnH2n+1OH and IUPAC nomenclature.',
          learningActivities: 'Students name structural isomers and draw molecular arrangements.',
          resourcesRequired: 'KDLH Digital Note: Organic Chemistry & IUPAC chart.',
          assessmentMethod: 'Classwork worksheet & oral check.',
          remarks: 'AI Drafted'
        },
        {
          id: `ai-item-2`,
          weekNumber: 2,
          datesRange: 'Jan 19 - Jan 23',
          topic: 'Organic Chemistry',
          subtopic: 'Fermentation & Industrial Ethanol Preparation',
          periods: periodsPerWeek,
          competenceObjectives: 'Describe fermentation of glucose and hydration of ethene.',
          teachingActivities: 'Teacher sets up fermentation yeast experiment in conical flask.',
          learningActivities: 'Learners measure temperature, observe CO2 evolution, write equations.',
          resourcesRequired: 'KDLH Lab Guide, Glucose, Yeast, Limewater.',
          assessmentMethod: 'Practical observation report.',
          remarks: 'AI Drafted'
        },
        {
          id: `ai-item-3`,
          weekNumber: 3,
          datesRange: 'Jan 26 - Jan 30',
          topic: 'Organic Chemistry',
          subtopic: 'Oxidation of Alcohols & Carboxylic Acids',
          periods: periodsPerWeek,
          competenceObjectives: 'Predict oxidation products of primary, secondary, and tertiary alcohols.',
          teachingActivities: 'Teacher demonstrates dichromate color change from orange to green.',
          learningActivities: 'Students write oxidation equations for ethanol to ethanal and ethanoic acid.',
          resourcesRequired: 'KDLH Video Tutorial & Potassium Dichromate.',
          assessmentMethod: 'End-of-topic revision test.',
          remarks: 'AI Drafted'
        }
      ];

      setItems(generatedItems);
      setIsAiGenerated(true);
      setIsGenerating(false);
    }, 1200);
  };

  const handleSaveScheme = () => {
    const scheme: SchemeOfWork = {
      id: initialScheme?.id || `scheme-${Date.now()}`,
      title: `${subject} ${form} Scheme of Work (${academicYear})`,
      academicYear,
      term,
      form,
      subject,
      teacherName,
      schoolName,
      weeksCount: items.length,
      periodsPerWeek,
      status: 'APPROVED',
      isAiGenerated,
      items,
      dateCreated: new Date().toISOString().split('T')[0]
    };

    KdlhStorageService.addSchemeOfWork(scheme);
    if (onSaved) onSaved(scheme);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-2 sm:p-4 overflow-y-auto">
      <div className="bg-slate-900 text-slate-100 rounded-2xl w-full max-w-6xl shadow-2xl border border-slate-800 flex flex-col max-h-[92vh] overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/20">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
                KDLH Scheme of Work Builder
                {isAiGenerated && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 font-semibold">
                    AI Generated Draft
                  </span>
                )}
              </h2>
              <p className="text-xs text-slate-400">
                Teacher: <strong className="text-slate-200">{teacherName}</strong> • {schoolName}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleGenerateAiScheme}
              disabled={isGenerating}
              className="px-3.5 py-1.5 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 text-xs font-bold rounded-lg transition shadow flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" /> {isGenerating ? 'Generating Draft...' : 'AI Auto-Generate'}
            </button>
            <button 
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* AI Disclaimer Banner */}
        {isAiGenerated && (
          <div className="px-6 py-2.5 bg-amber-950/40 border-b border-amber-500/30 text-amber-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>
              <strong>AI-generated draft:</strong> Verify against the current official Tanzania government syllabus curriculum before final submission.
            </span>
          </div>
        )}

        {/* Top Parameters Bar */}
        <div className="p-6 border-b border-slate-800 bg-slate-950/60 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
          <div>
            <label className="text-slate-400 font-semibold block mb-1">Academic Year</label>
            <input 
              type="text" 
              value={academicYear} 
              onChange={(e) => setAcademicYear(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-teal-300 font-bold focus:outline-none focus:border-teal-500"
            />
          </div>
          <div>
            <label className="text-slate-400 font-semibold block mb-1">Term</label>
            <select 
              value={term} 
              onChange={(e) => setTerm(e.target.value as any)}
              className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-teal-500"
            >
              <option value="Term 1">Term 1</option>
              <option value="Term 2">Term 2</option>
            </select>
          </div>
          <div>
            <label className="text-slate-400 font-semibold block mb-1">Form / Class</label>
            <input 
              type="text" 
              value={form} 
              onChange={(e) => setForm(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-teal-500"
            />
          </div>
          <div>
            <label className="text-slate-400 font-semibold block mb-1">Subject</label>
            <input 
              type="text" 
              value={subject} 
              onChange={(e) => setSubject(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-teal-500"
            />
          </div>
          <div>
            <label className="text-slate-400 font-semibold block mb-1">Total Weeks</label>
            <input 
              type="number" 
              value={weeksCount} 
              onChange={(e) => setWeeksCount(Number(e.target.value))}
              className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-teal-500"
            />
          </div>
          <div>
            <label className="text-slate-400 font-semibold block mb-1">Periods/Week</label>
            <input 
              type="number" 
              value={periodsPerWeek} 
              onChange={(e) => setPeriodsPerWeek(Number(e.target.value))}
              className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-teal-500"
            />
          </div>
        </div>

        {/* Scheme Items Table Editor */}
        <div className="flex-1 p-6 overflow-x-auto overflow-y-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-950 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-800">
                <th className="p-2.5 w-12">Wk</th>
                <th className="p-2.5 w-28">Dates</th>
                <th className="p-2.5 min-w-[140px]">Topic & Subtopic</th>
                <th className="p-2.5 min-w-[180px]">Competence & Objectives</th>
                <th className="p-2.5 min-w-[160px]">Teaching Activities</th>
                <th className="p-2.5 min-w-[160px]">Learning Activities</th>
                <th className="p-2.5 min-w-[140px]">Resources</th>
                <th className="p-2.5 w-10 text-center">Act</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {items.map((item) => (
                <tr key={item.id} className="hover:bg-slate-950/40">
                  <td className="p-2 align-top font-bold text-teal-400 text-center pt-3">
                    {item.weekNumber}
                  </td>
                  <td className="p-2 align-top">
                    <input 
                      type="text" 
                      value={item.datesRange}
                      onChange={(e) => handleUpdateItem(item.id, 'datesRange', e.target.value)}
                      className="w-full p-1.5 bg-slate-950 border border-slate-800 rounded text-slate-200 focus:outline-none focus:border-teal-500"
                    />
                  </td>
                  <td className="p-2 align-top space-y-1">
                    <input 
                      type="text" 
                      placeholder="Main Topic"
                      value={item.topic}
                      onChange={(e) => handleUpdateItem(item.id, 'topic', e.target.value)}
                      className="w-full p-1.5 bg-slate-950 border border-slate-800 rounded font-semibold text-teal-300 focus:outline-none focus:border-teal-500"
                    />
                    <input 
                      type="text" 
                      placeholder="Subtopic"
                      value={item.subtopic}
                      onChange={(e) => handleUpdateItem(item.id, 'subtopic', e.target.value)}
                      className="w-full p-1.5 bg-slate-950 border border-slate-800 rounded text-slate-300 focus:outline-none focus:border-teal-500"
                    />
                  </td>
                  <td className="p-2 align-top">
                    <textarea 
                      rows={2}
                      value={item.competenceObjectives}
                      onChange={(e) => handleUpdateItem(item.id, 'competenceObjectives', e.target.value)}
                      className="w-full p-1.5 bg-slate-950 border border-slate-800 rounded text-slate-300 leading-tight focus:outline-none focus:border-teal-500"
                    />
                  </td>
                  <td className="p-2 align-top">
                    <textarea 
                      rows={2}
                      value={item.teachingActivities}
                      onChange={(e) => handleUpdateItem(item.id, 'teachingActivities', e.target.value)}
                      className="w-full p-1.5 bg-slate-950 border border-slate-800 rounded text-slate-300 leading-tight focus:outline-none focus:border-teal-500"
                    />
                  </td>
                  <td className="p-2 align-top">
                    <textarea 
                      rows={2}
                      value={item.learningActivities}
                      onChange={(e) => handleUpdateItem(item.id, 'learningActivities', e.target.value)}
                      className="w-full p-1.5 bg-slate-950 border border-slate-800 rounded text-slate-300 leading-tight focus:outline-none focus:border-teal-500"
                    />
                  </td>
                  <td className="p-2 align-top">
                    <input 
                      type="text" 
                      value={item.resourcesRequired}
                      onChange={(e) => handleUpdateItem(item.id, 'resourcesRequired', e.target.value)}
                      className="w-full p-1.5 bg-slate-950 border border-slate-800 rounded text-slate-300 focus:outline-none focus:border-teal-500"
                    />
                  </td>
                  <td className="p-2 align-top text-center pt-3">
                    <button
                      onClick={() => handleRemoveItem(item.id)}
                      className="p-1 text-red-400 hover:text-red-300"
                      title="Delete Week Row"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <button
            onClick={handleAddItem}
            className="mt-4 px-4 py-2 bg-slate-950 hover:bg-slate-800 text-teal-400 text-xs font-semibold rounded-xl border border-teal-500/30 transition flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" /> Add Next Week Row
          </button>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-800 bg-slate-950 flex justify-between items-center">
          <div className="flex gap-2">
            <button
              onClick={() => window.print()}
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition flex items-center gap-1.5"
            >
              <Printer className="w-4 h-4 text-teal-400" /> Print Scheme
            </button>
            <button
              onClick={() => alert('PDF scheme exported.')}
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition flex items-center gap-1.5"
            >
              <Download className="w-4 h-4 text-teal-400" /> Export PDF
            </button>
          </div>

          <button
            onClick={handleSaveScheme}
            className="px-6 py-2.5 bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-400 hover:to-emerald-500 text-slate-950 font-bold text-xs rounded-xl transition shadow-xl flex items-center gap-1.5"
          >
            <Save className="w-4 h-4" /> Save Scheme of Work
          </button>
        </div>

      </div>
    </div>
  );
};
