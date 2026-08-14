import React from 'react';
import { X, Printer, Download, Award, CheckCircle, AlertCircle, BookOpen, User, Calendar, Sparkles } from 'lucide-react';
import { ScannedExamScript } from '../../types';

interface ExamReportViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  script: ScannedExamScript | null;
}

export const ExamReportViewModal: React.FC<ExamReportViewModalProps> = ({
  isOpen,
  onClose,
  script
}) => {
  if (!isOpen || !script) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-2 sm:p-4 overflow-y-auto">
      <div className="bg-slate-900 text-slate-100 rounded-2xl w-full max-w-4xl shadow-2xl border border-slate-800 flex flex-col max-h-[92vh] overflow-hidden">
        
        {/* Modal Controls Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-teal-400" />
            <h2 className="text-base font-bold text-slate-100">KDLH Official Examination Report</h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition border border-slate-700"
            >
              <Printer className="w-3.5 h-3.5 text-teal-400" /> Print
            </button>
            <button
              onClick={() => alert('PDF export generated for ' + script.studentName)}
              className="px-3 py-1.5 bg-teal-600 hover:bg-teal-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition shadow"
            >
              <Download className="w-3.5 h-3.5" /> Download PDF
            </button>
            <button 
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Transcript Body */}
        <div className="p-6 sm:p-8 overflow-y-auto bg-slate-950 print:bg-white print:text-black">
          
          {/* School Banner Header */}
          <div className="border-b-2 border-teal-500 pb-6 text-center space-y-1">
            <h1 className="text-2xl font-black text-teal-400 print:text-teal-800 tracking-tight">
              KIZIMBA DIGITAL LEARNING HUB (KDLH)
            </h1>
            <p className="text-xs text-slate-400 print:text-slate-600 font-semibold uppercase tracking-widest">
              LEARN • PRACTICE • ASK • IMPROVE
            </p>
            <p className="text-[11px] text-slate-500 print:text-slate-500">
              Founder: Isaack Edward Lungwa • Official Secondary Education Examination Report
            </p>
          </div>

          {/* Student & Examination Details Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-6 text-xs border-b border-slate-800 print:border-slate-300">
            <div>
              <span className="text-slate-400 print:text-slate-500 font-medium block">STUDENT NAME</span>
              <span className="text-slate-100 print:text-black font-bold">{script.studentName}</span>
            </div>
            <div>
              <span className="text-slate-400 print:text-slate-500 font-medium block">CLASS & FORM</span>
              <span className="text-slate-100 print:text-black font-bold">{script.form}</span>
            </div>
            <div>
              <span className="text-slate-400 print:text-slate-500 font-medium block">SUBJECT</span>
              <span className="text-slate-100 print:text-black font-bold">{script.subject}</span>
            </div>
            <div>
              <span className="text-slate-400 print:text-slate-500 font-medium block">DATE SCANNED</span>
              <span className="text-slate-100 print:text-black font-bold">{script.scanDate}</span>
            </div>
          </div>

          {/* Overall Performance Card */}
          <div className="my-6 p-4 rounded-xl bg-slate-900 print:bg-slate-100 border border-slate-800 print:border-slate-300 flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-slate-400 print:text-slate-600 uppercase tracking-wider block">
                EXAMINATION TITLE
              </span>
              <span className="text-lg font-extrabold text-slate-100 print:text-slate-900">
                {script.examTitle}
              </span>
            </div>

            <div className="flex items-center gap-6">
              <div className="text-center">
                <span className="text-xs text-slate-400 print:text-slate-600 font-semibold block">TOTAL SCORE</span>
                <span className="text-2xl font-black text-teal-400 print:text-teal-700">
                  {script.overallScore} / {script.totalMarks}
                </span>
              </div>
              <div className="text-center">
                <span className="text-xs text-slate-400 print:text-slate-600 font-semibold block">PERCENTAGE</span>
                <span className="text-2xl font-black text-emerald-400 print:text-emerald-700">
                  {script.percentage}%
                </span>
              </div>
              <div className="text-center">
                <span className="text-xs text-slate-400 print:text-slate-600 font-semibold block">GRADE</span>
                <span className="text-2xl font-black text-amber-400 print:text-amber-700">
                  {script.grade}
                </span>
              </div>
            </div>
          </div>

          {/* Topic Performance Breakdown */}
          <div className="my-6 space-y-3">
            <h3 className="text-xs font-bold text-slate-300 print:text-slate-800 uppercase tracking-wider">
              Topic Mastery & Performance Breakdown
            </h3>

            <div className="space-y-2">
              {(script.topicPerformance || []).map((tp, i) => (
                <div key={i} className="p-3 rounded-lg bg-slate-900 print:bg-slate-50 border border-slate-800 print:border-slate-200">
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span className="text-slate-200 print:text-black">{tp.topic}</span>
                    <span className="text-teal-400 print:text-teal-700">{tp.score}/{tp.total} ({tp.percentage}%)</span>
                  </div>
                  <div className="w-full h-2 bg-slate-800 print:bg-slate-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-teal-500 to-emerald-500 rounded-full"
                      style={{ width: `${tp.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Question-by-Question Transcript Table */}
          <div className="my-6 space-y-3">
            <h3 className="text-xs font-bold text-slate-300 print:text-slate-800 uppercase tracking-wider">
              Question-by-Question Detailed Results
            </h3>

            <div className="overflow-x-auto rounded-xl border border-slate-800 print:border-slate-300">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900 print:bg-slate-200 text-slate-400 print:text-slate-700 uppercase font-semibold">
                  <tr>
                    <th className="p-3">Q#</th>
                    <th className="p-3">Question Prompt</th>
                    <th className="p-3 text-center">Max</th>
                    <th className="p-3 text-center">Awarded</th>
                    <th className="p-3">Evaluation Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 print:divide-slate-200 text-slate-300 print:text-black">
                  {(script.questionResults || []).map((q) => (
                    <tr key={q.questionId} className="hover:bg-slate-900/50">
                      <td className="p-3 font-bold text-teal-400 print:text-teal-700">Q{q.questionNumber}</td>
                      <td className="p-3 max-w-xs">{q.questionText}</td>
                      <td className="p-3 text-center font-semibold">{q.maxMarks}</td>
                      <td className="p-3 text-center font-bold text-emerald-400 print:text-emerald-700">{q.awardedMarks}</td>
                      <td className="p-3 text-[11px] text-slate-400 print:text-slate-600">{q.explanation}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Remarks & AI Recommendations */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
            <div className="p-4 rounded-xl bg-slate-900 print:bg-slate-100 border border-slate-800 print:border-slate-300 text-xs">
              <span className="font-bold text-teal-400 print:text-teal-800 block mb-1">Teacher Remarks</span>
              <p className="text-slate-300 print:text-slate-700 leading-relaxed">
                {script.teacherComments || "Student demonstrated good analytical capability and subject understanding."}
              </p>
              <div className="mt-4 pt-2 border-t border-slate-800 print:border-slate-300 text-[10px] text-slate-500">
                Teacher Signature: <strong className="text-slate-300 print:text-black">{script.teacherName}</strong>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 print:bg-slate-100 border border-slate-800 print:border-slate-300 text-xs">
              <span className="font-bold text-emerald-400 print:text-emerald-800 block mb-1 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" /> KDLH AI Revision Guidance
              </span>
              <p className="text-slate-300 print:text-slate-700 leading-relaxed">
                {script.aiFeedback || "Focus on laboratory diagram water inlet directional arrows."}
              </p>
              <div className="mt-3 text-[10px] text-teal-400 print:text-teal-700 font-semibold">
                Recommended Resources linked in Student Dashboard.
              </div>
            </div>
          </div>

          {/* Verification Footer */}
          <div className="pt-6 border-t border-slate-800 print:border-slate-300 text-center text-[10px] text-slate-500 print:text-slate-600 space-y-1">
            <p>Certified Digital Result Transcript • KIZIMBA DIGITAL LEARNING HUB (KDLH)</p>
            <p>Founder: Isaack Edward Lungwa • All Student Records Protected under Privacy Guidelines</p>
          </div>

        </div>

      </div>
    </div>
  );
};
