import React, { useState } from 'react';
import { 
  Check, 
  X, 
  Sparkles, 
  ZoomIn, 
  ZoomOut, 
  RotateCw, 
  Printer, 
  Download, 
  MessageSquare,
  Edit2,
  ChevronLeft,
  ChevronRight,
  Eye,
  Award
} from 'lucide-react';
import { ScannedExamScript, ScannedPage, QuestionMarkingResult } from '../../types';

interface RedPenExamViewerProps {
  script: ScannedExamScript;
  onUpdateScript?: (updated: ScannedExamScript) => void;
}

export const RedPenExamViewer: React.FC<RedPenExamViewerProps> = ({
  script,
  onUpdateScript
}) => {
  const [currentPageIndex, setCurrentPageIndex] = useState<number>(0);
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [showAnnotations, setShowAnnotations] = useState<boolean>(true);
  const [selectedAnnotationQ, setSelectedAnnotationQ] = useState<string | null>(null);

  const pages = script.scannedPages || [];
  const currentPage: ScannedPage | undefined = pages[currentPageIndex];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl text-slate-100 font-serif">
      
      {/* Top Header Controls */}
      <div className="bg-slate-950 px-4 sm:px-6 py-3.5 border-b border-blue-900/50 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-red-950/80 text-red-400 border border-red-800/60 flex items-center justify-center font-bold text-xs">
            <Edit2 className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              KDLH Red-Pen Exam Script Viewer
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-500/20 text-red-300 font-mono font-bold">
                Teacher Red-Ink Mode
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Student: <span className="text-amber-300 font-semibold">{script.studentName}</span> ({script.form}) • Subject: <span className="text-blue-300 font-semibold">{script.subject}</span>
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Zoom controls */}
          <div className="hidden sm:flex items-center bg-slate-900 border border-slate-800 rounded-xl p-1 text-xs">
            <button
              onClick={() => setZoomLevel(prev => Math.max(70, prev - 15))}
              className="p-1.5 hover:text-white text-slate-400"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="px-2 font-mono text-[11px] text-slate-300">{zoomLevel}%</span>
            <button
              onClick={() => setZoomLevel(prev => Math.min(160, prev + 15))}
              className="p-1.5 hover:text-white text-slate-400"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Toggle Red Ink Layer */}
          <button
            onClick={() => setShowAnnotations(!showAnnotations)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 border ${
              showAnnotations 
                ? 'bg-red-950 text-red-300 border-red-700' 
                : 'bg-slate-800 text-slate-400 border-slate-700'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Red Ink {showAnnotations ? 'ON' : 'OFF'}</span>
          </button>

          {/* Print Script */}
          <button
            onClick={handlePrint}
            className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow"
          >
            <Printer className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Print Script</span>
          </button>
        </div>
      </div>

      {/* Main Canvas & Script Overlay */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 min-h-[500px]">
        
        {/* Visual Script Viewer Stage */}
        <div className="lg:col-span-8 bg-slate-950/80 p-4 flex flex-col items-center justify-center relative overflow-auto border-r border-slate-800">
          
          {pages.length === 0 ? (
            <div className="py-16 text-center text-slate-400 text-sm">
              No scanned pages available for this examination script.
            </div>
          ) : (
            <div className="relative max-w-full flex flex-col items-center">
              
              {/* The Scanned Page Container */}
              <div 
                className="relative bg-white rounded-xl shadow-2xl overflow-hidden border border-slate-300 transition-all duration-200"
                style={{ 
                  width: `${Math.min(650, (600 * zoomLevel) / 100)}px`,
                  minHeight: '480px'
                }}
              >
                {/* Background scanned page image or realistic manuscript page */}
                {currentPage?.imageUrl ? (
                  <img 
                    src={currentPage.imageUrl} 
                    alt={`Page ${currentPageIndex + 1}`}
                    className="w-full h-auto object-contain block"
                  />
                ) : (
                  <div className="p-8 text-slate-800 space-y-4 font-mono text-xs bg-amber-50/40 min-h-[520px]">
                    <div className="border-b-2 border-slate-300 pb-3 flex justify-between items-center text-slate-700">
                      <div>
                        <span className="font-bold uppercase tracking-wider block">KDLH EXAMINATION SCRIPT • PAGE {currentPageIndex + 1}</span>
                        <span className="text-[10px] text-slate-500">{script.examTitle}</span>
                      </div>
                      <span className="font-bold text-slate-700">CANDIDATE: {script.studentName}</span>
                    </div>

                    <div className="space-y-6 pt-2">
                      {(script.questionResults || []).map((q, idx) => (
                        <div key={q.questionId} className="space-y-1.5">
                          <p className="font-bold text-slate-800">Q{q.questionNumber}. {q.questionText}</p>
                          <p className="pl-4 italic text-slate-600 bg-slate-100/70 p-2 rounded border border-slate-200">
                            {q.studentAnswerText || 'Answer written in script.'}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* RED PEN ANNOTATION LAYER */}
                {showAnnotations && (
                  <div className="absolute inset-0 pointer-events-none p-4 flex flex-col justify-between">
                    
                    {/* Top Right Red Mark Stamp */}
                    <div className="self-end red-pen-stamp p-2.5 rounded-2xl bg-red-600/10 border-2 border-red-600 shadow-lg text-center backdrop-blur-sm pointer-events-auto transform rotate-2">
                      <div className="text-2xl sm:text-3xl font-black text-red-600 font-serif leading-none">
                        {script.overallScore}/{script.totalMarks}
                      </div>
                      <div className="text-[10px] font-black text-red-700 tracking-widest uppercase font-mono">
                        GRADE: {script.grade} • VERIFIED ✍️
                      </div>
                    </div>

                    {/* Question Annotations & Marks */}
                    <div className="space-y-6 pt-4 pointer-events-auto">
                      {(script.questionResults || []).map((q, idx) => {
                        const isFull = q.awardedMarks === q.maxMarks;
                        const isZero = q.awardedMarks === 0;

                        return (
                          <div 
                            key={q.questionId}
                            onClick={() => setSelectedAnnotationQ(q.questionId)}
                            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-red-500/15 border border-red-600 text-red-700 shadow-md cursor-pointer hover:scale-105 transition-transform"
                          >
                            {isFull ? (
                              <Check className="w-5 h-5 text-red-600 stroke-[3]" />
                            ) : isZero ? (
                              <X className="w-5 h-5 text-red-600 stroke-[3]" />
                            ) : (
                              <span className="font-bold text-red-600 text-sm">✓/</span>
                            )}
                            <span className="font-black text-sm font-serif">
                              Q{q.questionNumber}: +{q.awardedMarks}/{q.maxMarks}
                            </span>
                            {q.teacherOverride && (
                              <span className="text-[9px] bg-red-600 text-white font-bold px-1 rounded">
                                Adjusted
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {/* Bottom Teacher Margin Signature */}
                    <div className="self-start pt-4 text-red-700 font-serif italic text-xs border-t border-dashed border-red-400/60 w-full flex justify-between items-center pointer-events-auto">
                      <span>Mwl: <strong>{script.teacherName}</strong> (KDLH Academic Office)</span>
                      <span className="text-[10px] font-mono font-bold text-red-600">OCR & SCHEME MATCHED</span>
                    </div>

                  </div>
                )}

              </div>

              {/* Page Selector Bar */}
              {pages.length > 1 && (
                <div className="flex items-center gap-3 mt-4 bg-slate-900 px-4 py-2 rounded-2xl border border-slate-800 text-xs">
                  <button
                    onClick={() => setCurrentPageIndex(prev => Math.max(0, prev - 1))}
                    disabled={currentPageIndex === 0}
                    className="p-1 rounded-lg text-slate-300 hover:text-white disabled:opacity-30"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  <span className="font-bold text-amber-300">
                    Page {currentPageIndex + 1} of {pages.length}
                  </span>

                  <button
                    onClick={() => setCurrentPageIndex(prev => Math.min(pages.length - 1, prev + 1))}
                    disabled={currentPageIndex === pages.length - 1}
                    className="p-1 rounded-lg text-slate-300 hover:text-white disabled:opacity-30"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}

            </div>
          )}

        </div>

        {/* Right Sidebar: Breakdown & Explanations */}
        <div className="lg:col-span-4 p-5 space-y-4 bg-slate-950 overflow-y-auto max-h-[600px]">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider font-mono">
              Red-Ink Evaluation Summary
            </h4>
            <span className="text-xs font-bold text-emerald-400">
              {script.percentage}% ({script.grade})
            </span>
          </div>

          <div className="space-y-3">
            {(script.questionResults || []).map((q) => (
              <div 
                key={q.questionId}
                className={`p-3.5 rounded-2xl border transition ${
                  selectedAnnotationQ === q.questionId 
                    ? 'border-red-500 bg-red-950/20' 
                    : 'border-slate-800 bg-slate-900/60'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">Question {q.questionNumber}</span>
                  <span className="text-xs font-black text-red-400 font-serif">
                    +{q.awardedMarks} / {q.maxMarks} Marks
                  </span>
                </div>

                <p className="text-xs text-slate-300 mt-1 line-clamp-2 italic">
                  "{q.studentAnswerText}"
                </p>

                <div className="mt-2 text-[11px] text-slate-400 space-y-1">
                  <div className="text-emerald-400 font-medium font-mono text-[10px]">
                    Expected: {q.expectedAnswerText}
                  </div>
                  <div className="text-slate-300">
                    AI Note: {q.explanation}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Overall Pedagogical Feedback */}
          {script.aiFeedback && (
            <div className="p-4 rounded-2xl bg-blue-950/40 border border-blue-800/60 text-xs text-blue-200 space-y-1">
              <span className="font-bold text-amber-300 block">Teacher/AI Comprehensive Remarks:</span>
              <p className="leading-relaxed">{script.aiFeedback}</p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
