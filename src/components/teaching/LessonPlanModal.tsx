import React, { useState } from 'react';
import { X, Sparkles, Save, Printer, Download, BookOpen, Clock, FileText } from 'lucide-react';
import { LessonPlan } from '../../types';
import { KdlhStorageService } from '../../services/storage';

interface LessonPlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialPlan?: LessonPlan | null;
  onSaved?: (plan: LessonPlan) => void;
}

export const LessonPlanModal: React.FC<LessonPlanModalProps> = ({
  isOpen,
  onClose,
  initialPlan,
  onSaved
}) => {
  const [subject, setSubject] = useState<string>(initialPlan?.subject || 'Chemistry');
  const [form, setForm] = useState<string>(initialPlan?.form || 'Form IV');
  const [topic, setTopic] = useState<string>(initialPlan?.topic || 'Organic Chemistry');
  const [subtopic, setSubtopic] = useState<string>(initialPlan?.subtopic || 'Naming of Alcohols');
  const [duration, setDuration] = useState<number>(initialPlan?.durationMinutes || 80);
  const [teacherName, setTeacherName] = useState<string>(initialPlan?.teacherName || 'Mwl. Isaack Edward Lungwa');
  const [schoolName, setSchoolName] = useState<string>(initialPlan?.schoolName || 'Kizimba Secondary School');
  
  const [mainCompetence, setMainCompetence] = useState<string>(
    initialPlan?.mainCompetence || 'Ability to apply IUPAC nomenclature to classify and name organic compounds.'
  );
  const [specificCompetence, setSpecificCompetence] = useState<string>(
    initialPlan?.specificCompetence || 'Name primary, secondary, and tertiary alcohols and draw structural isomers up to C5.'
  );

  const [introduction, setIntroduction] = useState<string>(
    initialPlan?.introduction || '5 mins: Brainstorm alkane structures and introduce the hydroxyl (-OH) group substitution.'
  );
  const [lessonDevelopment, setLessonDevelopment] = useState<string>(
    initialPlan?.lessonDevelopment || '45 mins: Step 1: Longest carbon chain rule. Step 2: Numbering rule closest to -OH. Step 3: Differentiate 1°, 2°, 3° alcohols.'
  );
  const [practice, setPractice] = useState<string>(
    initialPlan?.practice || '15 mins: Guided student whiteboard exercise naming 5 structural alcohol isomers.'
  );
  const [assessment, setAssessment] = useState<string>(
    initialPlan?.assessment || '10 mins: Exit ticket quiz with 3 structural formulas.'
  );
  const [conclusion, setConclusion] = useState<string>(
    initialPlan?.conclusion || '3 mins: Summarize IUPAC suffix -ol and numbering priority.'
  );
  const [homework, setHomework] = useState<string>(
    initialPlan?.homework || 'Solve KDLH Organic Chemistry Revision Questions #1-5.'
  );
  const [reflection, setReflection] = useState<string>(
    initialPlan?.reflection || 'Learners actively engaged with ball-and-stick models. Secondary alcohol numbering requires brief review next period.'
  );

  const [isAiGenerating, setIsAiGenerating] = useState<boolean>(false);
  const [isAiGenerated, setIsAiGenerated] = useState<boolean>(initialPlan?.isAiGenerated || false);

  if (!isOpen) return null;

  const handleAiGenerate = async () => {
    setIsAiGenerating(true);
    setTimeout(() => {
      setMainCompetence(`Understand chemical principles in ${topic} for secondary curriculum standards.`);
      setSpecificCompetence(`Apply principles of ${subtopic} in laboratory and real-life contexts.`);
      setIntroduction(`5 mins: Spark curiosity regarding ${subtopic} with a real-life observation and problem prompt.`);
      setLessonDevelopment(`45 mins: Step 1: Explain core principles. Step 2: Demonstrations using KDLH digital aids. Step 3: Group inquiry analysis.`);
      setPractice(`15 mins: Guided practice solving structured problems in pairs.`);
      setAssessment(`10 mins: Individual quick check quiz.`);
      setConclusion(`3 mins: Wrap up key takeaways and definitions.`);
      setHomework(`Complete revision questions in KDLH student portal.`);
      setReflection(`AI Drafted lesson plan ready for teacher review.`);
      setIsAiGenerated(true);
      setIsAiGenerating(false);
    }, 1200);
  };

  const handleSave = () => {
    const plan: LessonPlan = {
      id: initialPlan?.id || `lp-${Date.now()}`,
      title: `Lesson Plan: ${subtopic}`,
      schoolName,
      teacherName,
      subject,
      form,
      date: new Date().toISOString().split('T')[0],
      durationMinutes: duration,
      topic,
      subtopic,
      mainCompetence,
      specificCompetence,
      learningObjectives: [
        `Define functional properties of ${subtopic}`,
        `Solve key problems related to ${subtopic}`,
        `Apply knowledge in practical assessment`
      ],
      teachingMethods: ['Guided Discovery', 'Group Problem Solving', 'Lab Demonstration'],
      learningActivities: ['Active discussion', 'Whiteboard practice', 'Pair work'],
      teachingResources: ['KDLH Digital Notes', 'Laboratory Kits', 'Question Worksheets'],
      introduction,
      lessonDevelopment,
      practice,
      assessment,
      conclusion,
      homework,
      reflection,
      isAiGenerated,
      dateCreated: new Date().toISOString().split('T')[0]
    };

    KdlhStorageService.addLessonPlan(plan);
    if (onSaved) onSaved(plan);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-2 sm:p-4 overflow-y-auto">
      <div className="bg-slate-900 text-slate-100 rounded-2xl w-full max-w-4xl shadow-2xl border border-slate-800 flex flex-col max-h-[92vh] overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/20">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
                KDLH Lesson Plan Builder
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
              onClick={handleAiGenerate}
              disabled={isAiGenerating}
              className="px-3.5 py-1.5 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 text-xs font-bold rounded-lg transition shadow flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" /> {isAiGenerating ? 'Generating...' : 'AI Auto-Generate'}
            </button>
            <button 
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs">
          
          {/* Metadata Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-slate-950 rounded-xl border border-slate-800">
            <div>
              <label className="text-slate-400 font-semibold block mb-1">Subject</label>
              <input 
                type="text" 
                value={subject} 
                onChange={(e) => setSubject(e.target.value)}
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
              <label className="text-slate-400 font-semibold block mb-1">Topic</label>
              <input 
                type="text" 
                value={topic} 
                onChange={(e) => setTopic(e.target.value)}
                className="w-full p-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-teal-500"
              />
            </div>
            <div>
              <label className="text-slate-400 font-semibold block mb-1">Subtopic</label>
              <input 
                type="text" 
                value={subtopic} 
                onChange={(e) => setSubtopic(e.target.value)}
                className="w-full p-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-teal-500"
              />
            </div>
          </div>

          {/* Competencies */}
          <div className="space-y-3">
            <div>
              <label className="text-slate-400 font-bold block mb-1">Main Competence</label>
              <textarea 
                rows={2}
                value={mainCompetence}
                onChange={(e) => setMainCompetence(e.target.value)}
                className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-teal-500"
              />
            </div>
            <div>
              <label className="text-slate-400 font-bold block mb-1">Specific Competence</label>
              <textarea 
                rows={2}
                value={specificCompetence}
                onChange={(e) => setSpecificCompetence(e.target.value)}
                className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-teal-500"
              />
            </div>
          </div>

          {/* Lesson Stages */}
          <div className="space-y-3">
            <h3 className="font-bold text-teal-400 uppercase tracking-wider text-xs">Lesson Execution Stages</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="text-slate-400 font-semibold block mb-1">1. Introduction (Hook & Brainstorming)</label>
                <textarea 
                  rows={3}
                  value={introduction}
                  onChange={(e) => setIntroduction(e.target.value)}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-300 focus:outline-none focus:border-teal-500"
                />
              </div>

              <div>
                <label className="text-slate-400 font-semibold block mb-1">2. Lesson Development & Explanation</label>
                <textarea 
                  rows={3}
                  value={lessonDevelopment}
                  onChange={(e) => setLessonDevelopment(e.target.value)}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-300 focus:outline-none focus:border-teal-500"
                />
              </div>

              <div>
                <label className="text-slate-400 font-semibold block mb-1">3. Guided Practice & Group Work</label>
                <textarea 
                  rows={3}
                  value={practice}
                  onChange={(e) => setPractice(e.target.value)}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-300 focus:outline-none focus:border-teal-500"
                />
              </div>

              <div>
                <label className="text-slate-400 font-semibold block mb-1">4. Assessment & Exit Ticket</label>
                <textarea 
                  rows={3}
                  value={assessment}
                  onChange={(e) => setAssessment(e.target.value)}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-300 focus:outline-none focus:border-teal-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="text-slate-400 font-semibold block mb-1">5. Homework & Assignment</label>
                <input 
                  type="text"
                  value={homework}
                  onChange={(e) => setHomework(e.target.value)}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-300 focus:outline-none focus:border-teal-500"
                />
              </div>

              <div>
                <label className="text-slate-400 font-semibold block mb-1">6. Post-Lesson Teacher Reflection</label>
                <input 
                  type="text"
                  value={reflection}
                  onChange={(e) => setReflection(e.target.value)}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-300 focus:outline-none focus:border-teal-500"
                />
              </div>
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-800 bg-slate-950 flex justify-between items-center">
          <div className="flex gap-2">
            <button
              onClick={() => window.print()}
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition flex items-center gap-1.5"
            >
              <Printer className="w-4 h-4 text-teal-400" /> Print
            </button>
            <button
              onClick={() => alert('PDF export generated.')}
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition flex items-center gap-1.5"
            >
              <Download className="w-4 h-4 text-teal-400" /> Export PDF
            </button>
          </div>

          <button
            onClick={handleSave}
            className="px-6 py-2.5 bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-400 hover:to-emerald-500 text-slate-950 font-bold text-xs rounded-xl transition shadow-xl flex items-center gap-1.5"
          >
            <Save className="w-4 h-4" /> Save Lesson Plan
          </button>
        </div>

      </div>
    </div>
  );
};
