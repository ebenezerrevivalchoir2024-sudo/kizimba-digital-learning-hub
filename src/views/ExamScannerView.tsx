import React, { useState, useEffect } from 'react';
import { 
  Scan, 
  Plus, 
  FileText, 
  CheckCircle2, 
  AlertTriangle, 
  UserCheck, 
  Search, 
  Printer, 
  Sparkles, 
  Award, 
  ArrowRight 
} from 'lucide-react';
import { ScannedExamScript, ScannedPage } from '../types';
import { KdlhStorageService } from '../services/storage';
import { CameraScannerModal } from '../components/scanner/CameraScannerModal';
import { AiMarkingReviewPanel } from '../components/scanner/AiMarkingReviewPanel';
import { ExamReportViewModal } from '../components/scanner/ExamReportViewModal';

export const ExamScannerView: React.FC = () => {
  const [scripts, setScripts] = useState<ScannedExamScript[]>([]);
  const [selectedScript, setSelectedScript] = useState<ScannedExamScript | null>(null);
  const [isScannerOpen, setIsScannerOpen] = useState<boolean>(false);
  const [isReportOpen, setIsReportOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    const loaded = KdlhStorageService.getScannedScripts();
    setScripts(loaded);
    if (loaded.length > 0) {
      setSelectedScript(loaded[0]);
    }
  }, []);

  const handlePagesCaptured = (pages: ScannedPage[]) => {
    // Generate new script entry from camera capture
    const newScript: ScannedExamScript = {
      id: `script-${Date.now()}`,
      examId: 'exam-chem-f4-term1',
      examTitle: 'Chemistry Form IV Terminal Examination 2026',
      studentId: 'stud-juma',
      studentName: 'Juma Baraka',
      teacherId: 'teacher-lungwa',
      teacherName: 'Mwl. Isaack Edward Lungwa',
      form: 'Form IV',
      subject: 'Chemistry',
      scanDate: new Date().toISOString().split('T')[0],
      scannedPages: pages,
      ocrConfidence: 96,
      markingConfidence: 94,
      overallScore: 82,
      totalMarks: 100,
      percentage: 82,
      grade: 'A',
      status: 'NEEDS_TEACHER_REVIEW',
      topicPerformance: [
        { topic: 'Organic Chemistry', score: 26, total: 30, percentage: 87 },
        { topic: 'Chemical Kinetics', score: 28, total: 35, percentage: 80 },
        { topic: 'Volumetric Analysis', score: 28, total: 35, percentage: 80 }
      ],
      questionResults: [
        {
          questionId: 'q-scanned-1',
          questionNumber: 1,
          questionText: 'Define functional group and state the functional group of Alcohols.',
          maxMarks: 2,
          awardedMarks: 2,
          confidence: 98,
          studentAnswerText: 'Functional group is an atom or group of atoms that determines the chemical properties of an organic compound. Hydroxyl (-OH).',
          expectedAnswerText: 'Functional group definition (1 mark). Hydroxyl (-OH) group (1 mark).',
          explanation: 'Full marks awarded. Both parts accurately defined.',
          diagramDetected: false,
          isUncertain: false,
          markingPointsBreakdown: [
            { pointDescription: 'Definition of functional group', max: 1, awarded: 1, status: 'CORRECT' },
            { pointDescription: 'Hydroxyl group formula', max: 1, awarded: 1, status: 'CORRECT' }
          ]
        },
        {
          questionId: 'q-scanned-2',
          questionNumber: 2,
          questionText: 'Write balanced equation for oxidation of ethanol using acidified potassium dichromate.',
          maxMarks: 3,
          awardedMarks: 2,
          confidence: 78,
          studentAnswerText: 'C2H5OH + [O] -> CH3COOH + H2O (missing oxygen balance digit 2)',
          expectedAnswerText: 'C2H5OH + 2[O] -> CH3COOH + H2O',
          explanation: 'Handwritten oxygen coefficient coefficient 2 missing in balanced equation.',
          diagramDetected: false,
          isUncertain: true,
          markingPointsBreakdown: [
            { pointDescription: 'Ethanal/ethanoic product formula', max: 2, awarded: 2, status: 'CORRECT' },
            { pointDescription: 'Balanced 2[O] coefficient', max: 1, awarded: 0, status: 'INCORRECT' }
          ]
        }
      ],
      aiFeedback: 'Great accuracy in IUPAC naming. Focus on balancing oxidation oxygen stoichiometry.'
    };

    KdlhStorageService.saveScannedScript(newScript);
    setScripts(prev => [newScript, ...prev]);
    setSelectedScript(newScript);
  };

  const filteredScripts = scripts.filter(s =>
    s.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.examTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.subject.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-6 lg:p-8 space-y-6">
      
      {/* Top Banner Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-teal-500/10 text-teal-400 border border-teal-500/30">
            <Scan className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-teal-400 uppercase tracking-widest">KDLH Advanced Teaching System</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 font-bold">AI Exam Scanner v2.0</span>
            </div>
            <h1 className="text-2xl font-black text-slate-100 mt-1">AI Exam Scanner & Auto Marking</h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Scan student handwritten scripts using phone camera or computer webcam • OCR recognition • AI Marking • Teacher Review
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsScannerOpen(true)}
          className="px-6 py-3 bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-400 hover:to-emerald-500 text-slate-950 font-extrabold text-xs rounded-xl transition shadow-xl flex items-center justify-center gap-2"
        >
          <Plus className="w-5 h-5" /> Scan New Exam Script
        </button>
      </div>

      {/* Main Workspace Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Scanned Scripts List (Left Column) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl space-y-3">
            <div className="flex justify-between items-center">
              <h2 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Scanned Scripts Archive ({scripts.length})
              </h2>
              <span className="text-[10px] text-teal-400 font-semibold">Live Storage</span>
            </div>

            {/* Search Bar */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search student, subject or exam..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-teal-500"
              />
            </div>

            {/* List */}
            <div className="space-y-2.5 max-h-[600px] overflow-y-auto pr-1">
              {filteredScripts.length === 0 ? (
                <div className="py-12 text-center text-slate-500 text-xs">
                  No scanned scripts found.<br />Click Scan New Exam Script to begin.
                </div>
              ) : (
                filteredScripts.map((s) => (
                  <div
                    key={s.id}
                    onClick={() => setSelectedScript(s)}
                    className={`p-3.5 rounded-xl border transition cursor-pointer ${
                      selectedScript?.id === s.id
                        ? 'border-teal-500 bg-teal-500/10'
                        : 'border-slate-800 bg-slate-950/60 hover:bg-slate-950'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-xs font-bold text-slate-100">{s.studentName}</h3>
                        <p className="text-[11px] text-slate-400">{s.subject} • {s.form}</p>
                      </div>

                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        s.status === 'FINALIZED' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
                      }`}>
                        {s.percentage}% ({s.grade})
                      </span>
                    </div>

                    <div className="mt-2 text-[10px] text-slate-500 flex justify-between items-center">
                      <span>{s.scanDate}</span>
                      <span className="text-teal-400 font-semibold">{s.scannedPages.length} Pages</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* AI Marking & Review Panel (Right Column) */}
        <div className="lg:col-span-8">
          {selectedScript ? (
            <AiMarkingReviewPanel
              script={selectedScript}
              onFinalized={(updated) => {
                setScripts(scripts.map(s => s.id === updated.id ? updated : s));
                setSelectedScript(updated);
              }}
              onViewReport={(scr) => {
                setSelectedScript(scr);
                setIsReportOpen(true);
              }}
            />
          ) : (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center text-slate-500">
              Select a scanned script from the left list to review AI marking and grant teacher approval.
            </div>
          )}
        </div>

      </div>

      {/* Camera Modal */}
      <CameraScannerModal
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        onPagesCaptured={handlePagesCaptured}
      />

      {/* Official Report Modal */}
      <ExamReportViewModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        script={selectedScript}
      />

    </div>
  );
};
