import React, { useState } from 'react';
import { X, Plus, Trash2, Printer, Download, Save, FileText, Sparkles, HelpCircle, CheckSquare } from 'lucide-react';
import { ExamPaper, ExamQuestionItem } from '../../types';
import { KdlhStorageService } from '../../services/storage';

interface ExamBuilderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExamCreated?: (exam: ExamPaper) => void;
}

export const ExamBuilderModal: React.FC<ExamBuilderModalProps> = ({
  isOpen,
  onClose,
  onExamCreated
}) => {
  const [title, setTitle] = useState<string>('Form IV Chemistry Midterm Examination 2026');
  const [form, setForm] = useState<string>('Form IV');
  const [subject, setSubject] = useState<string>('Chemistry');
  const [durationMinutes, setDurationMinutes] = useState<number>(180);
  const [instructions, setInstructions] = useState<string>('Answer ALL questions in Section A and Section B. Show calculations step-by-step.');

  const [questions, setQuestions] = useState<ExamQuestionItem[]>([
    {
      id: 'eq-1',
      questionNumber: 1,
      questionText: 'Define functional group and state the functional group of Alcohols.',
      topic: 'Organic Chemistry',
      questionType: 'SHORT_ANSWER',
      maxMarks: 2,
      expectedAnswer: 'Functional group definition (1 mark). Hydroxyl (-OH) group (1 mark).',
      markingPoints: [
        { id: 'mp-1', pointNumber: 1, description: 'Correct definition of functional group', marks: 1 },
        { id: 'mp-2', pointNumber: 2, description: 'Identification of hydroxyl (-OH) group', marks: 1 }
      ]
    }
  ]);

  const [isAiGenerating, setIsAiGenerating] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleAddQuestion = () => {
    const newQ: ExamQuestionItem = {
      id: `q-${Date.now()}`,
      questionNumber: questions.length + 1,
      questionText: 'Write a balanced chemical equation for the oxidation of ethanol using acidified potassium dichromate.',
      topic: 'Organic Chemistry',
      questionType: 'SHORT_ANSWER',
      maxMarks: 3,
      expectedAnswer: 'CH3CH2OH + 2[O] -> CH3COOH + H2O',
      markingPoints: [
        { id: `mp-${Date.now()}-1`, pointNumber: 1, description: 'Ethanal intermediate', marks: 1 },
        { id: `mp-${Date.now()}-2`, pointNumber: 2, description: 'Ethanoic acid product', marks: 1 },
        { id: `mp-${Date.now()}-3`, pointNumber: 3, description: 'Water byproduct & balancing', marks: 1 }
      ]
    };
    setQuestions([...questions, newQ]);
  };

  const handleRemoveQuestion = (id: string) => {
    setQuestions(questions.filter(q => q.id !== id).map((q, idx) => ({ ...q, questionNumber: idx + 1 })));
  };

  const handleAiAutoGenerateQuestions = () => {
    setIsAiGenerating(true);
    setTimeout(() => {
      const generated: ExamQuestionItem[] = [
        {
          id: `ai-q1`,
          questionNumber: 1,
          questionText: 'Calculate the percentage yield of ethanol if 180g of glucose yields 46g of ethanol during fermentation.',
          topic: 'Stoichiometry & Fermentation',
          questionType: 'CALCULATION',
          maxMarks: 5,
          expectedAnswer: 'Theoretical yield = 92g. Actual yield = 46g. Percentage yield = (46/92)*100% = 50%.',
          markingPoints: [
            { id: 'mp-ai-1', pointNumber: 1, description: 'Fermentation reaction setup', marks: 1 },
            { id: 'mp-ai-2', pointNumber: 2, description: 'Molar mass setup', marks: 1 },
            { id: 'mp-ai-3', pointNumber: 3, description: 'Theoretical yield 92g', marks: 1 },
            { id: 'mp-ai-4', pointNumber: 4, description: 'Percentage formula application', marks: 1 },
            { id: 'mp-ai-5', pointNumber: 5, description: 'Final answer 50%', marks: 1 }
          ]
        },
        {
          id: `ai-q2`,
          questionNumber: 2,
          questionText: 'Draw and label a simple laboratory distillation apparatus used to separate ethanol from water.',
          topic: 'Laboratory Apparatus',
          questionType: 'STRUCTURED',
          maxMarks: 5,
          expectedAnswer: 'Distillation flask, fractionating column, liebig condenser, thermometer, receiver flask.',
          markingPoints: [
            { id: 'mp-ai-21', pointNumber: 1, description: 'Flask setup', marks: 1 },
            { id: 'mp-ai-22', pointNumber: 2, description: 'Condenser orientation', marks: 1 },
            { id: 'mp-ai-23', pointNumber: 3, description: 'Thermometer placement', marks: 1 },
            { id: 'mp-ai-24', pointNumber: 4, description: 'Water inlet/outlet arrows', marks: 1 },
            { id: 'mp-ai-25', pointNumber: 5, description: 'Collection vessel', marks: 1 }
          ]
        }
      ];

      setQuestions(generated);
      setIsAiGenerating(false);
    }, 1200);
  };

  const handleSaveExam = () => {
    const totalMarks = questions.reduce((sum, q) => sum + q.maxMarks, 0);
    const exam: ExamPaper = {
      id: `exam-${Date.now()}`,
      title,
      form,
      subject,
      date: new Date().toISOString().split('T')[0],
      durationMinutes,
      totalMarks,
      instructions,
      academicYear: '2026',
      questions,
      createdByTeacherId: 'teacher-lungwa',
      isPublished: true
    };

    KdlhStorageService.addExam(exam);
    if (onExamCreated) onExamCreated(exam);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-2 sm:p-4 overflow-y-auto">
      <div className="bg-slate-900 text-slate-100 rounded-2xl w-full max-w-5xl shadow-2xl border border-slate-800 flex flex-col max-h-[92vh] overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/20">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-100">KDLH Exam & Marking Scheme Builder</h2>
              <p className="text-xs text-slate-400">Generate printable question papers & AI marking schemes</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleAiAutoGenerateQuestions}
              disabled={isAiGenerating}
              className="px-3.5 py-1.5 bg-gradient-to-r from-amber-500 to-orange-600 text-slate-950 text-xs font-bold rounded-lg transition flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" /> {isAiGenerating ? 'Generating...' : 'AI Question Bank'}
            </button>
            <button 
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Form Params */}
        <div className="p-6 border-b border-slate-800 bg-slate-950/60 grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
          <div>
            <label className="text-slate-400 font-semibold block mb-1">Exam Title</label>
            <input 
              type="text" 
              value={title} 
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2 bg-slate-900 border border-slate-800 rounded-lg text-teal-300 font-bold focus:outline-none focus:border-teal-500"
            />
          </div>
          <div>
            <label className="text-slate-400 font-semibold block mb-1">Form</label>
            <input 
              type="text" 
              value={form} 
              onChange={(e) => setForm(e.target.value)}
              className="w-full p-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-teal-500"
            />
          </div>
          <div>
            <label className="text-slate-400 font-semibold block mb-1">Subject</label>
            <input 
              type="text" 
              value={subject} 
              onChange={(e) => setSubject(e.target.value)}
              className="w-full p-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-teal-500"
            />
          </div>
          <div>
            <label className="text-slate-400 font-semibold block mb-1">Duration (Mins)</label>
            <input 
              type="number" 
              value={durationMinutes} 
              onChange={(e) => setDurationMinutes(Number(e.target.value))}
              className="w-full p-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-teal-500"
            />
          </div>
        </div>

        {/* Questions Editor */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-slate-200 uppercase tracking-wider text-xs">
              Questions & Marking Scheme Points ({questions.length})
            </h3>
            <span className="text-teal-400 font-bold">
              Total Marks: {questions.reduce((s, q) => s + q.maxMarks, 0)}
            </span>
          </div>

          <div className="space-y-4">
            {questions.map((q, idx) => (
              <div key={q.id} className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="px-2.5 py-1 bg-teal-500/20 text-teal-300 font-bold rounded-lg border border-teal-500/30">
                    Question {q.questionNumber} ({q.maxMarks} Marks)
                  </span>
                  <button
                    onClick={() => handleRemoveQuestion(q.id)}
                    className="text-red-400 hover:text-red-300 p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div>
                  <label className="text-slate-400 font-semibold block mb-1">Question Prompt</label>
                  <input
                    type="text"
                    value={q.questionText}
                    onChange={(e) => {
                      const updated = [...questions];
                      updated[idx].questionText = e.target.value;
                      setQuestions(updated);
                    }}
                    className="w-full p-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-teal-500"
                  />
                </div>

                <div>
                  <label className="text-slate-400 font-semibold block mb-1">Expected Answer (Marking Scheme)</label>
                  <textarea
                    rows={2}
                    value={q.expectedAnswer}
                    onChange={(e) => {
                      const updated = [...questions];
                      updated[idx].expectedAnswer = e.target.value;
                      setQuestions(updated);
                    }}
                    className="w-full p-2 bg-slate-900 border border-slate-800 rounded-lg text-emerald-300 font-mono focus:outline-none focus:border-teal-500"
                  />
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={handleAddQuestion}
            className="px-4 py-2 bg-slate-950 hover:bg-slate-800 text-teal-400 font-semibold rounded-xl border border-teal-500/30 transition flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" /> Add Question
          </button>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950 flex justify-between items-center">
          <div className="flex gap-2">
            <button
              onClick={() => window.print()}
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition flex items-center gap-1.5"
            >
              <Printer className="w-4 h-4 text-teal-400" /> Print Question Paper
            </button>
          </div>

          <button
            onClick={handleSaveExam}
            className="px-6 py-2.5 bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-400 hover:to-emerald-500 text-slate-950 font-bold text-xs rounded-xl transition shadow-xl flex items-center gap-1.5"
          >
            <Save className="w-4 h-4" /> Save Exam & Scheme
          </button>
        </div>

      </div>
    </div>
  );
};
