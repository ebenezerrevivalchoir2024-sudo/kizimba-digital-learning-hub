import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Edit3, 
  XCircle, 
  HelpCircle, 
  AlertTriangle, 
  Award, 
  Save, 
  FileText, 
  Sparkles, 
  UserCheck, 
  TrendingUp, 
  ChevronRight,
  BookOpen
} from 'lucide-react';
import { ScannedExamScript, QuestionMarkingResult } from '../../types';
import { KdlhStorageService } from '../../services/storage';

interface AiMarkingReviewPanelProps {
  script: ScannedExamScript;
  onFinalized?: (updatedScript: ScannedExamScript) => void;
  onViewReport?: (script: ScannedExamScript) => void;
}

export const AiMarkingReviewPanel: React.FC<AiMarkingReviewPanelProps> = ({
  script: initialScript,
  onFinalized,
  onViewReport
}) => {
  const [script, setScript] = useState<ScannedExamScript>(initialScript);
  const [activeQuestionIdx, setActiveQuestionIdx] = useState<number>(0);
  const [editingMark, setEditingMark] = useState<number | null>(null);
  const [overrideReason, setOverrideReason] = useState<string>('');
  const [isSaved, setIsSaved] = useState<boolean>(false);

  const activeQuestion = script.questionResults[activeQuestionIdx];

  const handleApplyOverride = (questionId: string, newMark: number, status: 'ACCEPTED' | 'EDITED' | 'REVIEW' | 'REJECTED') => {
    const updatedResults = script.questionResults.map((q) => {
      if (q.questionId === questionId) {
        return {
          ...q,
          awardedMarks: newMark,
          teacherOverride: {
            overriddenMarks: newMark,
            overrideReason: overrideReason || `Teacher manually updated mark to ${newMark}`,
            status
          },
          isUncertain: false
        };
      }
      return q;
    });

    // Recalculate total score, percentage, grade
    const totalMax = updatedResults.reduce((sum, q) => sum + q.maxMarks, 0);
    const awardedSum = updatedResults.reduce((sum, q) => sum + q.awardedMarks, 0);
    const percentage = Math.round((awardedSum / totalMax) * 100);

    let grade = 'F';
    if (percentage >= 80) grade = 'A';
    else if (percentage >= 70) grade = 'B';
    else if (percentage >= 60) grade = 'C';
    else if (percentage >= 50) grade = 'D';

    const updatedScript: ScannedExamScript = {
      ...script,
      overallScore: awardedSum,
      totalMarks: totalMax,
      percentage,
      grade,
      questionResults: updatedResults
    };

    setScript(updatedScript);
    setEditingMark(null);
    setOverrideReason('');
  };

  const handleFinalizeAndSave = () => {
    const finalizedScript: ScannedExamScript = {
      ...script,
      status: 'FINALIZED'
    };
    KdlhStorageService.saveScannedScript(finalizedScript);
    setIsSaved(true);
    if (onFinalized) onFinalized(finalizedScript);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-6 text-white shadow-xl">
      
      {/* Script Overview Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-teal-500/20 text-teal-300 border border-teal-500/30">
              {script.subject} • {script.form}
            </span>
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
              script.status === 'FINALIZED' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
            }`}>
              {script.status === 'FINALIZED' ? 'RESULT FINALIZED' : 'TEACHER REVIEW REQUIRED'}
            </span>
          </div>
          <h2 className="text-xl font-extrabold text-slate-100 mt-2">{script.examTitle}</h2>
          <p className="text-xs text-slate-400 mt-1">
            Student: <strong className="text-slate-200">{script.studentName}</strong> • Evaluated by: <strong className="text-slate-200">{script.teacherName}</strong>
          </p>
        </div>

        {/* Confidence Metrics & Grade Card */}
        <div className="flex items-center gap-4 bg-slate-950 p-3.5 rounded-xl border border-slate-800">
          <div className="text-center px-2">
            <div className="text-2xl font-black text-teal-400">{script.overallScore}/{script.totalMarks}</div>
            <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Total Score</div>
          </div>
          <div className="h-8 w-px bg-slate-800" />
          <div className="text-center px-2">
            <div className="text-2xl font-black text-emerald-400">{script.percentage}%</div>
            <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Grade {script.grade}</div>
          </div>
          <div className="h-8 w-px bg-slate-800" />
          <div className="text-right text-[11px] space-y-1">
            <div className="text-slate-300">OCR Conf: <span className="font-bold text-teal-400">{script.ocrConfidence}%</span></div>
            <div className="text-slate-300">Marking Conf: <span className="font-bold text-teal-400">{script.markingConfidence}%</span></div>
          </div>
        </div>
      </div>

      {/* Main Review Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
        
        {/* Left Question Selector Sidebar */}
        <div className="lg:col-span-4 space-y-2">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
            Questions ({script.questionResults.length})
          </h3>

          <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
            {script.questionResults.map((q, idx) => (
              <button
                key={q.questionId}
                onClick={() => setActiveQuestionIdx(idx)}
                className={`w-full text-left p-3.5 rounded-xl border transition flex items-center justify-between ${
                  activeQuestionIdx === idx
                    ? 'border-teal-500 bg-teal-500/10'
                    : 'border-slate-800 bg-slate-950/60 hover:bg-slate-950'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs ${
                    q.isUncertain ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40' : 'bg-slate-800 text-slate-200'
                  }`}>
                    Q{q.questionNumber}
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-slate-200 line-clamp-1">
                      {q.questionText}
                    </div>
                    <div className="text-[10px] text-slate-400 flex items-center gap-2 mt-0.5">
                      <span>Score: <strong className="text-teal-300">{q.awardedMarks}/{q.maxMarks}</strong></span>
                      {q.diagramDetected && <span className="text-purple-300 font-medium">• Diagram</span>}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  {q.isUncertain && (
                    <span className="text-amber-400" title="Manual Review Required">
                      <AlertTriangle className="w-4 h-4" />
                    </span>
                  )}
                  {q.teacherOverride && (
                    <span className="text-teal-400" title="Teacher Overridden">
                      <UserCheck className="w-4 h-4" />
                    </span>
                  )}
                  <ChevronRight className="w-4 h-4 text-slate-500" />
                </div>
              </button>
            ))}
          </div>

          {/* AI Notice */}
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-400 mt-4 flex items-start gap-2">
            <Sparkles className="w-4 h-4 text-teal-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-slate-300">KDLH AI Marking Policy</p>
              <p className="mt-0.5 text-slate-400">
                AI-assisted marking — teacher verification required. AI suggests scores based on the official scheme, but teacher override is final.
              </p>
            </div>
          </div>
        </div>

        {/* Right Detail Panel for Selected Question */}
        <div className="lg:col-span-8 bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-5">
          
          {/* Active Question Top Bar */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-lg bg-teal-500/20 text-teal-300 text-xs font-bold border border-teal-500/30">
                Question {activeQuestion.questionNumber}
              </span>
              {activeQuestion.isUncertain && (
                <span className="px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/30 flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5" /> MANUAL REVIEW REQUIRED
                </span>
              )}
            </div>

            <div className="text-sm font-black text-slate-200">
              Awarded: <span className="text-teal-400 text-base">{activeQuestion.awardedMarks}</span> / {activeQuestion.maxMarks} Marks
            </div>
          </div>

          {/* Question Text */}
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Question Prompt</h4>
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs font-medium text-slate-200 leading-relaxed">
              {activeQuestion.questionText}
            </div>
          </div>

          {/* Student Answer & OCR Text */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Student Answer (OCR Extracted)
              </h4>
              <span className="text-[10px] text-teal-400">
                OCR Confidence: {activeQuestion.confidence}%
              </span>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 text-xs font-mono text-emerald-300 leading-relaxed whitespace-pre-wrap">
              {activeQuestion.studentAnswerText}
            </div>
          </div>

          {/* Expected Answer Scheme */}
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
              Expected Answer (Marking Scheme)
            </h4>
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs font-mono text-slate-300 leading-relaxed">
              {activeQuestion.expectedAnswerText}
            </div>
          </div>

          {/* Marking Points Breakdown Table */}
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              Marking Points Breakdown
            </h4>
            <div className="space-y-1.5">
              {activeQuestion.markingPointsBreakdown.map((pt, i) => (
                <div 
                  key={i}
                  className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900 border border-slate-800/80 text-xs"
                >
                  <div className="flex items-center gap-2 text-slate-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-400" />
                    <span>{pt.pointDescription}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      pt.status === 'CORRECT' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-red-500/20 text-red-300'
                    }`}>
                      {pt.awarded}/{pt.max}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI Explanation */}
          <div className="p-3 rounded-xl bg-teal-950/30 border border-teal-500/20 text-xs text-slate-300">
            <span className="font-bold text-teal-400 block mb-0.5">AI Evaluation Reason:</span>
            {activeQuestion.explanation}
          </div>

          {/* Teacher Override Action Controls */}
          <div className="pt-4 border-t border-slate-800 space-y-3">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Teacher Action & Override
            </h4>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => handleApplyOverride(activeQuestion.questionId, activeQuestion.maxMarks, 'ACCEPTED')}
                className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition"
              >
                <CheckCircle2 className="w-4 h-4" /> [ACCEPT] Full ({activeQuestion.maxMarks}m)
              </button>

              <button
                onClick={() => setEditingMark(activeQuestion.awardedMarks)}
                className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold flex items-center gap-1.5 transition border border-slate-700"
              >
                <Edit3 className="w-4 h-4 text-teal-400" /> [EDIT MARK]
              </button>

              <button
                onClick={() => handleApplyOverride(activeQuestion.questionId, Math.max(0, activeQuestion.awardedMarks - 1), 'REVIEW')}
                className="px-3.5 py-2 bg-amber-600/80 hover:bg-amber-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition"
              >
                <HelpCircle className="w-4 h-4" /> [REVIEW] Deduct 1m
              </button>

              <button
                onClick={() => handleApplyOverride(activeQuestion.questionId, 0, 'REJECTED')}
                className="px-3.5 py-2 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition"
              >
                <XCircle className="w-4 h-4" /> [REJECT] Zero (0m)
              </button>
            </div>

            {/* Custom Edit Mark Form */}
            {editingMark !== null && (
              <div className="p-3 bg-slate-900 rounded-xl border border-teal-500/40 space-y-2">
                <div className="flex items-center gap-3">
                  <label className="text-xs text-slate-300 font-semibold">New Awarded Mark:</label>
                  <input
                    type="number"
                    min="0"
                    max={activeQuestion.maxMarks}
                    value={editingMark}
                    onChange={(e) => setEditingMark(Number(e.target.value))}
                    className="w-20 px-2 py-1 bg-slate-950 border border-slate-700 rounded-lg text-xs text-teal-300 font-bold focus:outline-none focus:border-teal-500"
                  />
                  <span className="text-xs text-slate-400">/ {activeQuestion.maxMarks}</span>
                </div>
                <div>
                  <input
                    type="text"
                    placeholder="Enter reason for teacher override..."
                    value={overrideReason}
                    onChange={(e) => setOverrideReason(e.target.value)}
                    className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-teal-500"
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setEditingMark(null)}
                    className="px-3 py-1 bg-slate-800 text-slate-400 text-xs rounded-lg hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleApplyOverride(activeQuestion.questionId, editingMark, 'EDITED')}
                    className="px-4 py-1 bg-teal-600 text-white text-xs font-bold rounded-lg hover:bg-teal-500"
                  >
                    Save Override
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>

      </div>

      {/* Final Action Footer */}
      <div className="mt-6 pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div className="text-xs text-slate-400 flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-teal-400" />
          <span>Finalizing will update student progress dashboard & generate official report.</span>
        </div>

        <div className="flex items-center gap-3">
          {onViewReport && (
            <button
              onClick={() => onViewReport(script)}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition flex items-center gap-2"
            >
              <FileText className="w-4 h-4 text-teal-400" /> View & Print Report
            </button>
          )}

          <button
            onClick={handleFinalizeAndSave}
            className="px-6 py-2.5 bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-400 hover:to-emerald-500 text-slate-950 font-bold text-xs rounded-xl transition shadow-xl flex items-center gap-2"
          >
            <Save className="w-4 h-4" /> {isSaved ? 'Finalized & Saved!' : 'Finalize Result'}
          </button>
        </div>
      </div>

    </div>
  );
};
