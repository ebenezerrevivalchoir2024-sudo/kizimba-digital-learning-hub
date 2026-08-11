import React, { useState } from 'react';
import { X, Sparkles, BookOpen, FileText, CheckCircle2, Bookmark, Globe, Layers, Download, HelpCircle } from 'lucide-react';
import { NoteSummary, KDLHResource } from '../../types';
import { KdlhStorageService } from '../../services/storage';

interface NoteSummarizerModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedResource?: KDLHResource | null;
  onSummaryGenerated?: (summary: NoteSummary) => void;
}

export const NoteSummarizerModal: React.FC<NoteSummarizerModalProps> = ({
  isOpen,
  onClose,
  selectedResource,
  onSummaryGenerated
}) => {
  const [summaryLength, setSummaryLength] = useState<'SHORT' | 'MEDIUM' | 'DETAILED'>('MEDIUM');
  const [targetLevel, setTargetLevel] = useState<'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED'>('INTERMEDIATE');
  const [language, setLanguage] = useState<'ENGLISH' | 'KISWAHILI'>('ENGLISH');
  const [isSummarizing, setIsSummarizing] = useState<boolean>(false);

  const [activeSummary, setActiveSummary] = useState<NoteSummary | null>(
    selectedResource ? null : KdlhStorageService.getNoteSummaries()[0] || null
  );

  if (!isOpen) return null;

  const handleGenerateSummary = async () => {
    setIsSummarizing(true);
    setTimeout(() => {
      const isSwahili = language === 'KISWAHILI';
      const sourceTitle = selectedResource?.title || 'Form IV Chemistry - Organic Chemistry: Alcohols';

      const newSummary: NoteSummary = {
        id: `summary-${Date.now()}`,
        sourceResourceId: selectedResource?.id || 'note-chem-f4-alcohols',
        sourceTitle,
        sourceType: 'KDLH Authorized Note',
        summaryLength,
        targetLevel,
        language,
        shortSummary: isSwahili
          ? 'Alkohol ni misombo ya kikaboni yenye kundi la kikazi la hidrosili (-OH) na fomula ya jumla CnH2n+1OH. Ethanoli hutengenezwa kwa chachu ya sukari au haidreshani ya etheni.'
          : 'Alcohols are organic compounds containing the hydroxyl (-OH) functional group with general formula CnH2n+1OH. Ethanol is prepared via glucose fermentation or ethene hydration.',
        detailedSummary: isSwahili
          ? `Maudhui Makuu ya Somo: ${sourceTitle}\n\n1. Ainisho la Alkohol: Alkohol zimegawanyika katika msingi (primary 1°), sekondari (secondary 2°), na elimu ya juu (tertiary 3°).\n\n2. Utengenezaji wa Ethanoli: Fermentation ya sukari kwa kutumia chachu anaerobiki au haidreshani ya etheni kwa kichocheo cha asidi ya fosforiki.\n\n3. Mwitikio wa Oksidisho: Alkohol ya msingi inaporejelewa na acidified potassium dichromate hubadilika rangi kutoka machungwa (orange) kwenda kijani (green).`
          : `Comprehensive Overview of ${sourceTitle}:\n\n1. Classification of Alcohols: Primary (1°), secondary (2°), and tertiary (3°) based on alkyl group substituents on hydroxyl-bearing carbon.\n\n2. Industrial & Lab Preparation: Glucose fermentation catalyzed by zymase enzymes in yeast under 30-37°C anaerobic conditions, or hydration of ethene.\n\n3. Oxidation & Chemical Tests: Primary alcohols oxidize to aldehydes and carboxylic acids using acidified K2Cr2O7 (orange to green transition).`,
        keyPoints: isSwahili ? [
          'Fomula ya jumla ya alkohol: CnH2n+1OH.',
          'Kundi la kikazi: Hidrosili (-OH).',
          'Equation ya Fermentation: C6H12O6 -> 2 C2H5OH + 2 CO2.',
          'Jaribio la Dichromate: Rangi ya machungwa inabadilika kuwa kijani.'
        ] : [
          'General Formula: CnH2n+1OH.',
          'Functional Group: Hydroxyl (-OH).',
          'Fermentation Equation: C6H12O6 -> 2 C2H5OH + 2 CO2.',
          'Oxidation Test: Acidified K2Cr2O7 turns from orange to green.'
        ],
        importantDefinitions: [
          { 
            term: isSwahili ? 'Alkohol' : 'Alcohol', 
            definition: isSwahili ? 'Msumbo wa kikaboni wenye kundi la hidrosili (-OH).' : 'An organic compound containing a hydroxyl (-OH) group bonded to a saturated carbon atom.' 
          },
          { 
            term: isSwahili ? 'Fermentation' : 'Fermentation', 
            definition: isSwahili ? 'Mchakato wa enzymatic unaobadili sukari kuwa alkohol na carbon dioxide.' : 'Enzymatic breakdown of carbohydrates into ethanol and carbon dioxide.' 
          }
        ],
        formulas: [
          { name: 'General Formula', formula: 'C_n H_{2n+1} OH' },
          { name: 'Fermentation Equation', formula: 'C6H12O6 -> 2 C2H5OH + 2 CO2' }
        ],
        flashcards: [
          { 
            question: isSwahili ? 'Kundi la kikazi la alkohol ni gani?' : 'What is the functional group of alcohols?', 
            answer: isSwahili ? 'Kundi la Hidrosili (-OH)' : 'Hydroxyl group (-OH)' 
          },
          { 
            question: isSwahili ? 'Rangi ya K2Cr2O7 inabadilika vipi?' : 'What color change occurs during dichromate oxidation?', 
            answer: isSwahili ? 'Machungwa kwenda Kijani' : 'Orange to Green' 
          }
        ],
        examQuestions: [
          { question: 'State TWO industrial uses of ethanol.', marks: 2 },
          { question: 'Write a balanced chemical equation for reaction of ethanol with sodium.', marks: 3 }
        ],
        dateCreated: new Date().toISOString().split('T')[0]
      };

      KdlhStorageService.addNoteSummary(newSummary);
      setActiveSummary(newSummary);
      setIsSummarizing(false);
      if (onSummaryGenerated) onSummaryGenerated(newSummary);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-2 sm:p-4 overflow-y-auto">
      <div className="bg-slate-900 text-slate-100 rounded-2xl w-full max-w-5xl shadow-2xl border border-slate-800 flex flex-col max-h-[92vh] overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-100">KDLH AI Note Summarizer & Study Guide</h2>
              <p className="text-xs text-slate-400">
                Source: <span className="text-teal-300 font-semibold">{selectedResource?.title || 'Form IV Chemistry - Organic Chemistry: Alcohols'}</span>
              </p>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Options Bar */}
        <div className="p-4 border-b border-slate-800 bg-slate-950/60 grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
          <div>
            <label className="text-slate-400 font-semibold block mb-1">Summary Length</label>
            <select
              value={summaryLength}
              onChange={(e) => setSummaryLength(e.target.value as any)}
              className="w-full p-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-teal-500"
            >
              <option value="SHORT">Short (Executive Summary)</option>
              <option value="MEDIUM">Medium (Standard Revision)</option>
              <option value="DETAILED">Detailed (Comprehensive Guide)</option>
            </select>
          </div>

          <div>
            <label className="text-slate-400 font-semibold block mb-1">Academic Level</label>
            <select
              value={targetLevel}
              onChange={(e) => setTargetLevel(e.target.value as any)}
              className="w-full p-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-teal-500"
            >
              <option value="BEGINNER">Beginner (Form I - II)</option>
              <option value="INTERMEDIATE">Intermediate (Form III - IV)</option>
              <option value="ADVANCED">Advanced (Form V - VI)</option>
            </select>
          </div>

          <div>
            <label className="text-slate-400 font-semibold block mb-1">Language</label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as any)}
              className="w-full p-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-teal-500"
            >
              <option value="ENGLISH">English</option>
              <option value="KISWAHILI">Kiswahili</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={handleGenerateSummary}
              disabled={isSummarizing}
              className="w-full py-2 bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-400 hover:to-emerald-500 text-slate-950 font-bold text-xs rounded-lg transition shadow-lg flex items-center justify-center gap-1.5"
            >
              <Sparkles className="w-4 h-4" /> {isSummarizing ? 'Generating Summary...' : 'Summarize Note'}
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs">
          
          {activeSummary ? (
            <>
              {/* Citation Source Banner */}
              <div className="p-3 bg-teal-950/40 border border-teal-500/30 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-teal-400" />
                  <span className="text-teal-200 font-semibold">SOURCE: {activeSummary.sourceTitle}</span>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded bg-teal-500/20 text-teal-300 font-bold uppercase">
                  AI-Generated Summary
                </span>
              </div>

              {/* Quick Summary */}
              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                <h3 className="font-bold text-teal-400 uppercase tracking-wider text-xs flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" /> Quick Executive Summary
                </h3>
                <p className="text-slate-200 leading-relaxed">{activeSummary.shortSummary}</p>
              </div>

              {/* Key Points */}
              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                <h3 className="font-bold text-teal-400 uppercase tracking-wider text-xs flex items-center gap-1.5">
                  <Layers className="w-4 h-4" /> Key Revision Points
                </h3>
                <ul className="space-y-1.5 list-disc list-inside text-slate-300">
                  {activeSummary.keyPoints.map((pt, idx) => (
                    <li key={idx} className="leading-relaxed">{pt}</li>
                  ))}
                </ul>
              </div>

              {/* Definitions & Formulas Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Definitions */}
                <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                  <h3 className="font-bold text-teal-400 uppercase tracking-wider text-xs">Important Definitions</h3>
                  <div className="space-y-2">
                    {activeSummary.importantDefinitions.map((def, i) => (
                      <div key={i} className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                        <span className="font-bold text-emerald-300 block">{def.term}</span>
                        <span className="text-slate-400 text-[11px]">{def.definition}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Formulas */}
                <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                  <h3 className="font-bold text-teal-400 uppercase tracking-wider text-xs">Essential Chemical Formulas</h3>
                  <div className="space-y-2">
                    {activeSummary.formulas.map((form, i) => (
                      <div key={i} className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                        <span className="font-semibold text-slate-300 block">{form.name}</span>
                        <span className="font-mono text-teal-300 font-bold">{form.formula}</span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* Flashcards & Revision Questions */}
              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
                <h3 className="font-bold text-teal-400 uppercase tracking-wider text-xs flex items-center gap-1.5">
                  <HelpCircle className="w-4 h-4" /> Quick Flashcards & Revision Practice
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {activeSummary.flashcards.map((fc, i) => (
                    <div key={i} className="p-3 bg-slate-900 border border-slate-800 rounded-xl space-y-1">
                      <span className="text-teal-300 font-bold block">Q: {fc.question}</span>
                      <span className="text-emerald-300 font-semibold block text-[11px]">A: {fc.answer}</span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="py-16 text-center text-slate-500">
              Click <strong>Summarize Note</strong> to generate structured revision points, formulas, and flashcards.
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950 flex justify-end gap-2">
          <button
            onClick={() => window.print()}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition flex items-center gap-1.5"
          >
            <Download className="w-4 h-4 text-teal-400" /> Export Guide
          </button>
        </div>

      </div>
    </div>
  );
};
