import React, { useState } from 'react';
import { HelpCircle, Clock, CheckCircle2, XCircle, Award, RotateCcw, Sparkles } from 'lucide-react';
import { KDLHResource, QuestionBankItem } from '../types';
import { KdlhStorageService } from '../services/storage';

interface RevisionViewProps {
  resources: KDLHResource[];
}

export const RevisionView: React.FC<RevisionViewProps> = ({ resources }) => {
  const questions = resources.filter(r => r.category === 'QUESTION') as QuestionBankItem[];

  const [activeSubject, setActiveSubject] = useState<string>('Chemistry');
  const [selectedForm, setSelectedForm] = useState<string>('Form IV');
  const [testStarted, setTestStarted] = useState<boolean>(false);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<{ [key: string]: string }>({});
  const [testCompleted, setTestCompleted] = useState<boolean>(false);

  const activeQuestions = questions.filter(q => q.subjectName === activeSubject && q.form === selectedForm);
  const currentQ = activeQuestions[currentQuestionIdx];

  const handleStartTest = () => {
    setTestStarted(true);
    setCurrentQuestionIdx(0);
    setUserAnswers({});
    setTestCompleted(false);
  };

  const handleOptionSelect = (option: string) => {
    if (!currentQ) return;
    setUserAnswers(prev => ({ ...prev, [currentQ.id]: option }));
  };

  const handleNext = () => {
    if (currentQuestionIdx < activeQuestions.length - 1) {
      setCurrentQuestionIdx(prev => prev + 1);
    } else {
      // Complete test
      setTestCompleted(true);
      // Calculate score
      let correct = 0;
      activeQuestions.forEach(q => {
        if (userAnswers[q.id] === q.correctAnswer) {
          correct++;
        }
      });
      KdlhStorageService.addQuizScore(
        `${selectedForm} ${activeSubject} Revision Quiz`,
        activeSubject,
        correct,
        activeQuestions.length
      );
    }
  };

  const calculateScore = () => {
    let correct = 0;
    activeQuestions.forEach(q => {
      if (userAnswers[q.id] === q.correctAnswer) {
        correct++;
      }
    });
    return { correct, total: activeQuestions.length };
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-950 via-slate-900 to-indigo-950 text-white p-8 rounded-2xl shadow-xl space-y-3 border border-purple-800/40">
        <span className="text-xs font-bold text-purple-400 uppercase tracking-wider block">
          Interactive Knowledge Assessment
        </span>
        <h1 className="text-2xl sm:text-4xl font-black">KDLH Revision Center</h1>
        <p className="text-sm text-purple-200 max-w-2xl leading-relaxed">
          Prepare for national examinations with topic revision tests, timed practice quizzes, instant scoring, and step-by-step explanations.
        </p>
      </div>

      {!testStarted ? (
        /* Quiz Setup Screen */
        <div className="bg-white p-8 rounded-2xl border border-slate-200/80 shadow-md max-w-2xl mx-auto space-y-6">
          <h3 className="text-xl font-bold text-slate-900 border-b border-slate-100 pb-3">Configure Practice Test</h3>

          <div className="space-y-4 text-xs font-bold">
            <div>
              <label className="block text-slate-700 mb-1">Select Subject:</label>
              <select
                value={activeSubject}
                onChange={(e) => setActiveSubject(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm"
              >
                <option value="Chemistry">Chemistry (Form IV Alcohols & Reactions)</option>
                <option value="Physics">Physics (Form IV Circuits & Electronics)</option>
                <option value="Biology">Biology (Form IV Genetics)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-700 mb-1">Select Form Level:</label>
              <select
                value={selectedForm}
                onChange={(e) => setSelectedForm(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm"
              >
                <option value="Form IV">Form IV</option>
                <option value="Form II">Form II</option>
                <option value="Form VI">Form VI</option>
              </select>
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-xl border border-blue-200 text-xs text-blue-900 space-y-1">
            <p><strong>Available Questions:</strong> {activeQuestions.length} Questions Ready</p>
            <p><strong>Format:</strong> Multiple Choice, Calculations & Step-by-step Explanations</p>
          </div>

          <button
            onClick={handleStartTest}
            disabled={activeQuestions.length === 0}
            className="w-full py-3.5 bg-purple-700 hover:bg-purple-800 disabled:opacity-50 text-white rounded-xl font-extrabold text-sm uppercase tracking-wide shadow-md transition-colors"
          >
            Start Revision Quiz
          </button>
        </div>
      ) : testCompleted ? (
        /* Score & Feedback Screen */
        <div className="bg-white p-8 rounded-2xl border border-slate-200/80 shadow-lg max-w-2xl mx-auto text-center space-y-6">
          <div className="w-20 h-20 bg-purple-100 text-purple-700 rounded-full flex items-center justify-center mx-auto">
            <Award className="w-10 h-10" />
          </div>

          <div>
            <h3 className="text-2xl font-black text-slate-900">Quiz Completed!</h3>
            <p className="text-xs text-slate-500">{selectedForm} {activeSubject} Revision Results</p>
          </div>

          {(() => {
            const { correct, total } = calculateScore();
            const percent = total > 0 ? Math.round((correct / total) * 100) : 0;
            return (
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-2">
                <span className="text-4xl font-black text-purple-700">{percent}%</span>
                <p className="text-xs font-bold text-slate-700">You scored {correct} out of {total} questions correctly.</p>
              </div>
            );
          })()}

          {/* Detailed Question Review */}
          <div className="text-left space-y-4 pt-4 border-t border-slate-100">
            <h4 className="font-bold text-xs uppercase text-slate-500">Question Breakdown:</h4>
            {activeQuestions.map((q, idx) => {
              const isCorrect = userAnswers[q.id] === q.correctAnswer;
              return (
                <div key={q.id} className={`p-4 rounded-xl border text-xs space-y-1 ${isCorrect ? 'bg-emerald-50/60 border-emerald-200' : 'bg-rose-50/60 border-rose-200'}`}>
                  <div className="flex items-center justify-between font-bold">
                    <span>Q{idx + 1}: {q.questionText}</span>
                    {isCorrect ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <XCircle className="w-4 h-4 text-rose-600" />}
                  </div>
                  <p className="text-slate-600">Your Answer: <strong>{userAnswers[q.id] || 'Not answered'}</strong></p>
                  <p className="text-slate-600">Correct Answer: <strong className="text-emerald-700">{q.correctAnswer}</strong></p>
                  <p className="text-slate-500 italic pt-1">Explanation: {q.explanation}</p>
                </div>
              );
            })}
          </div>

          <button
            onClick={() => setTestStarted(false)}
            className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold uppercase tracking-wider inline-flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" /> Take Another Quiz
          </button>
        </div>
      ) : (
        /* Live Active Question Screen */
        <div className="bg-white p-8 rounded-2xl border border-slate-200/80 shadow-md max-w-3xl mx-auto space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4 text-xs font-bold text-slate-500">
            <span>Question {currentQuestionIdx + 1} of {activeQuestions.length}</span>
            <span className="text-purple-700">{activeSubject} ({selectedForm})</span>
          </div>

          {currentQ && (
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-slate-900">{currentQ.questionText}</h3>

              {currentQ.options ? (
                <div className="space-y-3">
                  {currentQ.options.map((opt, idx) => {
                    const isSelected = userAnswers[currentQ.id] === opt;
                    return (
                      <div
                        key={idx}
                        onClick={() => handleOptionSelect(opt)}
                        className={`p-4 rounded-xl border text-sm font-medium cursor-pointer transition-all ${
                          isSelected ? 'border-purple-600 bg-purple-50 text-purple-900 font-bold' : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                        }`}
                      >
                        {opt}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <textarea
                  value={userAnswers[currentQ.id] || ''}
                  onChange={(e) => handleOptionSelect(e.target.value)}
                  placeholder="Type your structured answer here..."
                  className="w-full p-4 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 h-32"
                />
              )}

              <button
                onClick={handleNext}
                disabled={!userAnswers[currentQ.id]}
                className="w-full py-3.5 bg-purple-700 hover:bg-purple-800 disabled:opacity-50 text-white rounded-xl font-extrabold text-xs uppercase tracking-wide transition-colors"
              >
                {currentQuestionIdx < activeQuestions.length - 1 ? 'Next Question →' : 'Submit Quiz Results'}
              </button>
            </div>
          )}
        </div>
      )}

    </div>
  );
};
