import React, { useState } from 'react';
import { 
  Scan, 
  BookOpen, 
  FileText, 
  Sparkles, 
  Database, 
  Plus, 
  CheckSquare, 
  HelpCircle, 
  Layers, 
  Award, 
  UserCheck, 
  Printer, 
  TrendingUp,
  CloudUpload,
  ShieldAlert,
  Lock
} from 'lucide-react';
import { UserProfile } from '../types';
import { AuthService } from '../services/authService';
import { KdlhStorageService } from '../services/storage';
import { CameraScannerModal } from '../components/scanner/CameraScannerModal';
import { SchemeOfWorkModal } from '../components/teaching/SchemeOfWorkModal';
import { LessonPlanModal } from '../components/teaching/LessonPlanModal';
import { NoteSummarizerModal } from '../components/teaching/NoteSummarizerModal';
import { ExamBuilderModal } from '../components/teaching/ExamBuilderModal';
import { CurriculumManagerModal } from '../components/curriculum/CurriculumManagerModal';
import { WeeklyReportingModal } from '../components/reports/WeeklyReportingModal';
import { AddContentModal } from '../components/common/AddContentModal';
import { INITIAL_SUBJECTS } from '../data/mockData';
import { ExamScannerView } from './ExamScannerView';

interface TeacherWorkspaceViewProps {
  currentUser?: UserProfile;
  onRefreshResources?: () => void;
}

export const TeacherWorkspaceView: React.FC<TeacherWorkspaceViewProps> = ({
  currentUser,
  onRefreshResources
}) => {
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'SCANNER' | 'SCHEMES' | 'PLANS' | 'EXAMS' | 'CURRICULUM'>('OVERVIEW');

  const [isScannerOpen, setIsScannerOpen] = useState<boolean>(false);
  const [isSchemeOpen, setIsSchemeOpen] = useState<boolean>(false);
  const [isLessonOpen, setIsLessonOpen] = useState<boolean>(false);
  const [isSummarizerOpen, setIsSummarizerOpen] = useState<boolean>(false);
  const [isExamBuilderOpen, setIsExamBuilderOpen] = useState<boolean>(false);
  const [isCurriculumOpen, setIsCurriculumOpen] = useState<boolean>(false);
  const [isReportOpen, setIsReportOpen] = useState<boolean>(false);
  const [isAddContentOpen, setIsAddContentOpen] = useState<boolean>(false);

  // Role validation logic: TEACHER, ADMIN, or FOUNDER
  const effectiveUser = currentUser || AuthService.getCurrentUser() || KdlhStorageService.getCurrentUser();
  const userRole = effectiveUser?.role?.toUpperCase() || 'STUDENT';
  const isAuthorized = ['TEACHER', 'ADMIN', 'FOUNDER'].includes(userRole);

  const handleOpenAddContent = () => {
    if (isAuthorized) {
      setIsAddContentOpen(true);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-6 lg:p-8 space-y-6">
      
      {/* Teacher Workspace Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-teal-400 uppercase tracking-widest">KIZIMBA DIGITAL LEARNING HUB (KDLH)</span>
              <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-teal-500/20 text-teal-300 font-bold border border-teal-500/30">
                TEACHER AI WORKSPACE
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-100 mt-2">
              Advanced Teaching & Curriculum Hub
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
              Empowering secondary school educators with phone camera exam scanning, OCR AI auto-marking, schemes of work, lesson plans, and curriculum topic management.
            </p>
            <p className="text-[11px] text-teal-400 mt-2 font-semibold">
              Founder: Isaack Edward Lungwa • Tagline: LEARN • PRACTICE • ASK • IMPROVE
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Conditional Upload Button for Authorized Roles */}
            {isAuthorized ? (
              <button
                onClick={handleOpenAddContent}
                className="px-4 py-2.5 bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-500 hover:to-emerald-500 text-white text-xs font-black rounded-xl transition shadow-lg flex items-center gap-2 uppercase tracking-wider"
              >
                <Plus className="w-4 h-4 text-emerald-200" /> Upload Resource
              </button>
            ) : (
              <div className="px-3.5 py-2 bg-slate-900/90 border border-amber-500/40 rounded-xl text-amber-300 text-[11px] font-bold flex items-center gap-1.5 shadow">
                <Lock className="w-3.5 h-3.5 text-amber-400" /> Teacher Upload Locked
              </div>
            )}

            <button
              onClick={() => setIsScannerOpen(true)}
              className="px-4 py-2.5 bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold rounded-xl transition shadow-lg flex items-center gap-2"
            >
              <Scan className="w-4 h-4" /> Scan Exam
            </button>
            <button
              onClick={() => setIsSchemeOpen(true)}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl border border-slate-700 transition flex items-center gap-2"
            >
              <BookOpen className="w-4 h-4 text-teal-400" /> Scheme of Work
            </button>
            <button
              onClick={() => setIsLessonOpen(true)}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl border border-slate-700 transition flex items-center gap-2"
            >
              <FileText className="w-4 h-4 text-teal-400" /> Lesson Plan
            </button>
          </div>
        </div>
      </div>

      {/* Workspace Quick Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('OVERVIEW')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'OVERVIEW' ? 'bg-teal-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-200 bg-slate-900/60'
          }`}
        >
          <Sparkles className="w-4 h-4" /> All Teacher AI Tools
        </button>
        <button
          onClick={() => setActiveTab('SCANNER')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'SCANNER' ? 'bg-teal-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-200 bg-slate-900/60'
          }`}
        >
          <Scan className="w-4 h-4" /> AI Exam Scanner
        </button>
        {isAuthorized && (
          <button
            onClick={handleOpenAddContent}
            className="px-4 py-2 rounded-xl text-xs font-bold text-emerald-300 hover:text-white bg-emerald-950/60 border border-emerald-500/40 transition flex items-center gap-2 whitespace-nowrap"
          >
            <CloudUpload className="w-4 h-4 text-emerald-400" /> Upload Notes / Exams
          </button>
        )}
        <button
          onClick={() => setIsSchemeOpen(true)}
          className="px-4 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-slate-200 bg-slate-900/60 transition flex items-center gap-2 whitespace-nowrap"
        >
          <BookOpen className="w-4 h-4 text-teal-400" /> Scheme Builder
        </button>
        <button
          onClick={() => setIsLessonOpen(true)}
          className="px-4 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-slate-200 bg-slate-900/60 transition flex items-center gap-2 whitespace-nowrap"
        >
          <FileText className="w-4 h-4 text-teal-400" /> Lesson Plan Builder
        </button>
        <button
          onClick={() => setIsSummarizerOpen(true)}
          className="px-4 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-slate-200 bg-slate-900/60 transition flex items-center gap-2 whitespace-nowrap"
        >
          <Sparkles className="w-4 h-4 text-amber-400" /> Note Summarizer
        </button>
        <button
          onClick={() => setIsCurriculumOpen(true)}
          className="px-4 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-slate-200 bg-slate-900/60 transition flex items-center gap-2 whitespace-nowrap"
        >
          <Database className="w-4 h-4 text-purple-400" /> Curriculum Center
        </button>
        <button
          onClick={() => setIsReportOpen(true)}
          className="px-4 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-slate-200 bg-slate-900/60 transition flex items-center gap-2 whitespace-nowrap"
        >
          <Award className="w-4 h-4 text-emerald-400" /> Student Reports Center
        </button>
      </div>

      {/* Main Tab Content */}
      {activeTab === 'SCANNER' ? (
        <ExamScannerView />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Tool Card 1: Exam Scanner */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 hover:border-teal-500/50 transition shadow-xl group">
            <div className="w-12 h-12 rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/30 flex items-center justify-center">
              <Scan className="w-6 h-6 group-hover:scale-110 transition" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-100">AI Exam Scanner & Auto Marking</h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Capture student exam scripts with phone or webcam camera. Auto OCR handwriting recognition and marking scheme grading.
              </p>
            </div>
            <button
              onClick={() => setActiveTab('SCANNER')}
              className="w-full py-2.5 bg-slate-950 hover:bg-slate-800 text-teal-400 font-bold text-xs rounded-xl border border-teal-500/30 transition flex items-center justify-center gap-1.5"
            >
              Open Exam Scanner Workspace
            </button>
          </div>

          {/* Tool Card 2: Scheme of Work Builder */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 hover:border-teal-500/50 transition shadow-xl group">
            <div className="w-12 h-12 rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/30 flex items-center justify-center">
              <BookOpen className="w-6 h-6 group-hover:scale-110 transition" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-100">Scheme of Work Generator</h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Build term-by-term Schemes of Work aligned with official curriculum. AI draft generation with manual teacher verification.
              </p>
            </div>
            <button
              onClick={() => setIsSchemeOpen(true)}
              className="w-full py-2.5 bg-slate-950 hover:bg-slate-800 text-teal-400 font-bold text-xs rounded-xl border border-teal-500/30 transition flex items-center justify-center gap-1.5"
            >
              Open Scheme Builder
            </button>
          </div>

          {/* Tool Card 3: Lesson Plan Builder */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 hover:border-teal-500/50 transition shadow-xl group">
            <div className="w-12 h-12 rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/30 flex items-center justify-center">
              <FileText className="w-6 h-6 group-hover:scale-110 transition" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-100">Lesson Plan Generator</h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Generate structured secondary lesson plans with competencies, activities, materials, assessment, and reflection stages.
              </p>
            </div>
            <button
              onClick={() => setIsLessonOpen(true)}
              className="w-full py-2.5 bg-slate-950 hover:bg-slate-800 text-teal-400 font-bold text-xs rounded-xl border border-teal-500/30 transition flex items-center justify-center gap-1.5"
            >
              Open Lesson Plan Builder
            </button>
          </div>

          {/* Tool Card 4: Note Summarizer */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 hover:border-teal-500/50 transition shadow-xl group">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/30 flex items-center justify-center">
              <Sparkles className="w-6 h-6 group-hover:scale-110 transition" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-100">Note Summarizer & Study Guide</h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Transform extensive KDLH notes into concise executive summaries, key revision bullet points, formulas, and flashcards.
              </p>
            </div>
            <button
              onClick={() => setIsSummarizerOpen(true)}
              className="w-full py-2.5 bg-slate-950 hover:bg-slate-800 text-amber-400 font-bold text-xs rounded-xl border border-amber-500/30 transition flex items-center justify-center gap-1.5"
            >
              Summarize Notes
            </button>
          </div>

          {/* Tool Card 5: Question & Exam Builder */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 hover:border-teal-500/50 transition shadow-xl group">
            <div className="w-12 h-12 rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/30 flex items-center justify-center">
              <CheckSquare className="w-6 h-6 group-hover:scale-110 transition" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-100">Exam & Marking Scheme Builder</h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Compile custom question papers with detailed marking schemes and point breakdowns for automated AI grading.
              </p>
            </div>
            <button
              onClick={() => setIsExamBuilderOpen(true)}
              className="w-full py-2.5 bg-slate-950 hover:bg-slate-800 text-teal-400 font-bold text-xs rounded-xl border border-teal-500/30 transition flex items-center justify-center gap-1.5"
            >
              Build Question Paper
            </button>
          </div>

          {/* Tool Card 6: Curriculum Control Center */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 hover:border-teal-500/50 transition shadow-xl group">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/30 flex items-center justify-center">
              <Database className="w-6 h-6 group-hover:scale-110 transition" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-100">Admin Curriculum Center</h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Manage Forms I-VI topics, subtopics, and official learning resources for all secondary subjects.
              </p>
            </div>
            <button
              onClick={() => setIsCurriculumOpen(true)}
              className="w-full py-2.5 bg-slate-950 hover:bg-slate-800 text-purple-400 font-bold text-xs rounded-xl border border-purple-500/30 transition flex items-center justify-center gap-1.5"
            >
              Manage Curriculum Database
            </button>
          </div>

          {/* Tool Card 7: Academic Content Publisher (Teacher / Admin Exclusive) */}
          <div className="bg-slate-900 border border-blue-900/40 rounded-2xl p-6 space-y-4 hover:border-blue-500/50 transition shadow-xl group">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/30 flex items-center justify-center">
              <CloudUpload className="w-6 h-6 group-hover:scale-110 transition" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                Resource Upload Hub
                <span className="text-[10px] px-2 py-0.5 rounded-md bg-blue-900/60 text-blue-300 font-extrabold border border-blue-700/50">
                  FIRESTORE
                </span>
              </h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Upload and publish verified lesson notes, past papers with marking schemes, lab practicals, quizzes, and reference guides.
              </p>
            </div>
            {isAuthorized ? (
              <button
                onClick={handleOpenAddContent}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl transition flex items-center justify-center gap-1.5 shadow-md"
              >
                <Plus className="w-4 h-4" /> Add & Publish Content
              </button>
            ) : (
              <button
                disabled
                className="w-full py-2.5 bg-slate-950 text-slate-500 font-bold text-xs rounded-xl border border-slate-800 flex items-center justify-center gap-1.5 cursor-not-allowed"
              >
                <Lock className="w-4 h-4" /> Teacher Role Required
              </button>
            )}
          </div>

        </div>
      )}

      {/* Modals */}
      <CameraScannerModal
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        onPagesCaptured={() => setActiveTab('SCANNER')}
      />

      <SchemeOfWorkModal
        isOpen={isSchemeOpen}
        onClose={() => setIsSchemeOpen(false)}
      />

      <LessonPlanModal
        isOpen={isLessonOpen}
        onClose={() => setIsLessonOpen(false)}
      />

      <NoteSummarizerModal
        isOpen={isSummarizerOpen}
        onClose={() => setIsSummarizerOpen(false)}
      />

      <ExamBuilderModal
        isOpen={isExamBuilderOpen}
        onClose={() => setIsExamBuilderOpen(false)}
      />

      <CurriculumManagerModal
        isOpen={isCurriculumOpen}
        onClose={() => setIsCurriculumOpen(false)}
      />

      <WeeklyReportingModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
      />

      {isAuthorized && (
        <AddContentModal
          isOpen={isAddContentOpen}
          onClose={() => setIsAddContentOpen(false)}
          subjects={INITIAL_SUBJECTS}
          onContentAdded={() => {
            setIsAddContentOpen(false);
            onRefreshResources?.();
          }}
          uploaderName={effectiveUser?.name || 'Mwl. Isaack Edward Lungwa'}
          uploaderRole={effectiveUser?.role === 'ADMIN' ? 'System Administrator' : 'Verified Teacher'}
        />
      )}

    </div>
  );
};
