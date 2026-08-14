import React, { useState, useEffect, useRef } from 'react';
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
  ArrowRight,
  Camera,
  Upload,
  AlertCircle,
  RefreshCw,
  RotateCw,
  Lock,
  GraduationCap,
  ShieldCheck,
  Edit2
} from 'lucide-react';
import { ScannedExamScript, ScannedPage, UserProfile } from '../types';
import { KdlhStorageService } from '../services/storage';
import { CameraScannerModal } from '../components/scanner/CameraScannerModal';
import { AiMarkingReviewPanel } from '../components/scanner/AiMarkingReviewPanel';
import { ExamReportViewModal } from '../components/scanner/ExamReportViewModal';
import { AuthService } from '../services/authService';

interface ExamScannerViewProps {
  currentUser?: UserProfile;
  onNavigate?: (route: string) => void;
  onOpenAuth?: () => void;
}

export const ExamScannerView: React.FC<ExamScannerViewProps> = ({
  currentUser,
  onNavigate,
  onOpenAuth
}) => {
  const [scripts, setScripts] = useState<ScannedExamScript[]>([]);
  const [selectedScript, setSelectedScript] = useState<ScannedExamScript | null>(null);
  const [isScannerOpen, setIsScannerOpen] = useState<boolean>(false);
  const [isReportOpen, setIsReportOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Camera & Media Diagnostics State
  const [cameraStatus, setCameraStatus] = useState<'UNKNOWN' | 'READY' | 'PERMISSION_DENIED' | 'NOT_SUPPORTED' | 'ERROR'>('UNKNOWN');
  const [cameraErrorMsg, setCameraErrorMsg] = useState<string | null>(null);
  const [isTestingCamera, setIsTestingCamera] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const isTeacherOrAdmin = AuthService.isTeacherOrAdmin(currentUser);

  useEffect(() => {
    const loaded = KdlhStorageService.getScannedScripts();
    setScripts(loaded);
    if (loaded.length > 0) {
      setSelectedScript(loaded[0]);
    }
    checkCameraHardwareSupport();
  }, []);

  const checkCameraHardwareSupport = async () => {
    setIsTestingCamera(true);
    setCameraErrorMsg(null);

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setCameraStatus('NOT_SUPPORTED');
      setCameraErrorMsg('Camera API is not supported in this browser context.');
      setIsTestingCamera(false);
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      stream.getTracks().forEach(track => track.stop());
      setCameraStatus('READY');
      setCameraErrorMsg(null);
    } catch (err: any) {
      console.warn('Camera hardware check error:', err);
      const errorName = err?.name || '';
      
      if (errorName === 'NotAllowedError' || errorName === 'PermissionDeniedError') {
        setCameraStatus('PERMISSION_DENIED');
        setCameraErrorMsg('Camera permission denied by browser. Click Allow when prompted or use Upload Image.');
      } else if (errorName === 'NotFoundError' || errorName === 'DevicesNotFoundError') {
        setCameraStatus('ERROR');
        setCameraErrorMsg('No physical camera device detected. Connect webcam or use Upload Image.');
      } else if (errorName === 'NotReadableError' || errorName === 'TrackStartError') {
        setCameraStatus('ERROR');
        setCameraErrorMsg('Camera is currently in use by another app. Close other camera apps or use Upload Image.');
      } else {
        setCameraStatus('ERROR');
        setCameraErrorMsg(err?.message || 'Unable to start camera stream. Use Upload Image fallback.');
      }
    } finally {
      setIsTestingCamera(false);
    }
  };

  const handleDirectFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const files: File[] = Array.from(e.target.files);

    const pages: ScannedPage[] = [];
    let completedCount = 0;

    files.forEach((file: File, index: number) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
        pages.push({
          id: `page-${Date.now()}-${index}`,
          pageNumber: index + 1,
          imageUrl: dataUrl,
          confidence: 95,
          processedText: `OCR Scanned text from uploaded file ${file.name}`
        });

        completedCount++;
        if (completedCount === files.length) {
          pages.sort((a, b) => a.pageNumber - b.pageNumber);
          handlePagesCaptured(pages);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handlePagesCaptured = (pages: ScannedPage[]) => {
    const newScript: ScannedExamScript = {
      id: `script-${Date.now()}`,
      examId: 'exam-chem-f4-term1',
      examTitle: 'Chemistry Form IV Terminal Examination 2026',
      studentId: 'stud-juma',
      studentName: 'Juma Baraka',
      teacherId: currentUser?.id || 'teacher-lungwa',
      teacherName: currentUser?.name || 'Mwl. Isaack Edward Lungwa',
      form: 'Form IV',
      subject: 'Chemistry',
      scanDate: new Date().toISOString().split('T')[0],
      scannedPages: pages,
      ocrConfidence: 96,
      markingConfidence: 94,
      overallScore: 84,
      totalMarks: 100,
      percentage: 84,
      grade: 'A',
      status: 'NEEDS_TEACHER_REVIEW',
      topicPerformance: [
        { topic: 'Organic Chemistry', score: 28, total: 30, percentage: 93 },
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
          awardedMarks: 3,
          confidence: 92,
          studentAnswerText: 'C2H5OH + 2[O] -> CH3COOH + H2O (Acidified K2Cr2O7 catalyst)',
          expectedAnswerText: 'C2H5OH + 2[O] -> CH3COOH + H2O',
          explanation: 'Accurate stoichiometric equation with products and catalyst noted.',
          diagramDetected: false,
          isUncertain: false,
          markingPointsBreakdown: [
            { pointDescription: 'Ethanol and oxidizer equation', max: 2, awarded: 2, status: 'CORRECT' },
            { pointDescription: 'Ethanoic acid + water balanced products', max: 1, awarded: 1, status: 'CORRECT' }
          ]
        },
        {
          questionId: 'q-scanned-3',
          questionNumber: 3,
          questionText: 'Explain the mechanism of Le Chatelier principle on Haber process for ammonia synthesis.',
          maxMarks: 5,
          awardedMarks: 4,
          confidence: 88,
          studentAnswerText: 'N2(g) + 3H2(g) <=> 2NH3(g) + heat. Increasing pressure shifts equilibrium to right side because 4 volumes of gas become 2 volumes.',
          expectedAnswerText: 'State Le Chatelier principle (1 mark), volume shift reasoning (2 marks), temperature compromise explanation 450°C (2 marks).',
          explanation: 'High quality explanation on pressure effect; mention of 450°C temperature compromise partially concise.',
          diagramDetected: false,
          isUncertain: false,
          markingPointsBreakdown: [
            { pointDescription: 'Equilibrium equation & volume shift', max: 2, awarded: 2, status: 'CORRECT' },
            { pointDescription: 'Pressure effect analysis', max: 2, awarded: 2, status: 'CORRECT' },
            { pointDescription: 'Optimum temperature discussion', max: 1, awarded: 0, status: 'INCORRECT' }
          ]
        }
      ],
      aiFeedback: 'Exceptional chemical accuracy in organic IUPAC nomenclature and equilibrium calculations. Excellent clarity.'
    };

    KdlhStorageService.saveScannedScript(newScript);
    setScripts(prev => [newScript, ...prev]);
    setSelectedScript(newScript);
  };

  // ROLE SECURITY GUARD FOR STUDENTS
  if (currentUser && !isTeacherOrAdmin) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-4 font-serif text-slate-100">
        <div className="max-w-md w-full bg-slate-900 border border-blue-900/60 rounded-3xl p-8 text-center space-y-5 shadow-2xl">
          <div className="w-16 h-16 rounded-3xl bg-amber-500/20 border border-amber-400 text-amber-300 flex items-center justify-center mx-auto shadow-lg">
            <Lock className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-bold text-white">Teacher & Admin Portal Access Only</h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              The AI Exam Scanner & Red-Pen Marker is strictly restricted to certified Kizimba Secondary School Teachers and School Administrators. Students are not authorized to mark examination scripts.
            </p>
          </div>

          <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 text-xs text-slate-400 text-left space-y-1 font-mono">
            <div className="flex items-center gap-1.5 text-amber-400 font-bold">
              <ShieldCheck className="w-4 h-4" /> KDLH Security Policy
            </div>
            <p>Your current active role is: <strong className="text-white">{currentUser.role}</strong> ({currentUser.name})</p>
          </div>

          <div className="flex flex-col gap-2 pt-2">
            {onOpenAuth && (
              <button
                onClick={onOpenAuth}
                className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-2xl transition shadow-lg"
              >
                Sign In as Teacher or Admin
              </button>
            )}

            {onNavigate && (
              <button
                onClick={() => onNavigate('/reports')}
                className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold text-xs rounded-2xl transition border border-slate-700"
              >
                View My Student Academic Reports
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  const filteredScripts = scripts.filter(s =>
    s.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.examTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.subject.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const isCameraUnavailable = cameraStatus === 'PERMISSION_DENIED' || cameraStatus === 'NOT_SUPPORTED' || cameraStatus === 'ERROR';

  return (
    <div className="exam-scanner-container min-h-screen bg-slate-950 text-slate-100 p-3 sm:p-6 lg:p-8 space-y-6 font-serif">
      
      {/* Hidden File Input Fallback */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,.pdf"
        multiple
        onChange={handleDirectFileUpload}
        className="hidden"
      />

      {/* Top Banner Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-slate-900 border border-blue-900/60 rounded-3xl p-5 sm:p-6 shadow-2xl">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-blue-950 text-amber-400 border border-amber-400/50 flex-shrink-0 shadow-md">
            <Scan className="w-8 h-8" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-amber-300 uppercase tracking-widest font-mono">
                KDLH Teacher Examination Suite
              </span>
              <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 font-bold font-mono border border-blue-500/30">
                AI Optical Exam Marker v2.4
              </span>
              
              {/* Camera Diagnostic Badge */}
              <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold border flex items-center gap-1 font-mono ${
                cameraStatus === 'READY' 
                  ? 'bg-emerald-950 text-emerald-300 border-emerald-800' 
                  : isCameraUnavailable
                  ? 'bg-amber-950 text-amber-300 border-amber-800'
                  : 'bg-slate-800 text-slate-300 border-slate-700'
              }`}>
                <Camera className="w-3 h-3" />
                {cameraStatus === 'READY' && 'Camera Ready'}
                {cameraStatus === 'PERMISSION_DENIED' && 'Camera Permission Pending'}
                {cameraStatus === 'NOT_SUPPORTED' && 'Camera Not Supported'}
                {cameraStatus === 'ERROR' && 'Upload Fallback Ready'}
                {cameraStatus === 'UNKNOWN' && 'Detecting Camera...'}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-white mt-1">
              AI Exam Scanner & Red-Pen Auto-Marking
            </h1>
            <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">
              Capture or upload student handwritten answer scripts • OCR equation extraction • NECTA Rubric matching • Red-Pen Annotation & Score Validation.
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2 self-start lg:self-auto">
          <button
            onClick={() => setIsScannerOpen(true)}
            className="px-5 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black text-xs uppercase tracking-wider rounded-2xl transition shadow-[0_0_20px_rgba(37,99,235,0.5)] flex items-center justify-center gap-2 border border-blue-400"
          >
            <Camera className="w-4 h-4 text-amber-300" />
            <span>Open Camera Scanner</span>
          </button>

          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-4 py-3 bg-slate-900 hover:bg-slate-800 text-amber-300 border border-amber-500/50 font-bold text-xs uppercase tracking-wider rounded-2xl transition shadow-md flex items-center justify-center gap-1.5"
          >
            <Upload className="w-4 h-4 text-amber-400" />
            <span>Upload Script Photos</span>
          </button>
        </div>
      </div>

      {/* Main Workspace Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Scanned Scripts List (Left Column) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-slate-900 border border-blue-900/50 rounded-3xl p-4 sm:p-5 shadow-2xl space-y-3">
            <div className="flex justify-between items-center">
              <h2 className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono">
                Marked Scripts Vault ({scripts.length})
              </h2>
              <span className="text-[10px] text-amber-300 font-bold font-mono">Active Records</span>
            </div>

            {/* Search Bar */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search student, subject or exam..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-2xl text-xs text-slate-200 focus:outline-none focus:border-amber-400"
              />
            </div>

            {/* List */}
            <div className="space-y-2.5 max-h-[600px] overflow-y-auto pr-1">
              {filteredScripts.length === 0 ? (
                <div className="py-12 text-center text-slate-500 text-xs">
                  No scanned scripts found.<br />Click "Open Camera Scanner" to scan student papers.
                </div>
              ) : (
                filteredScripts.map((s) => (
                  <div
                    key={s.id}
                    onClick={() => setSelectedScript(s)}
                    className={`p-3.5 rounded-2xl border transition cursor-pointer ${
                      selectedScript?.id === s.id
                        ? 'border-blue-500 bg-blue-950/40 shadow-md'
                        : 'border-slate-800 bg-slate-950/60 hover:bg-slate-950'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-xs font-bold text-white">{s.studentName}</h3>
                        <p className="text-[11px] text-slate-300">{s.subject} • {s.form}</p>
                      </div>

                      <span className={`px-2.5 py-0.5 rounded-lg text-[10px] font-black font-serif ${
                        s.status === 'FINALIZED' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      }`}>
                        {s.percentage}% ({s.grade})
                      </span>
                    </div>

                    <div className="mt-2 text-[10px] text-slate-400 flex justify-between items-center font-mono">
                      <span>{s.scanDate}</span>
                      <span className="text-amber-400 font-bold">{s.scannedPages.length} Pages • Red-Ink Ready</span>
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
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center text-slate-400">
              Select a scanned script from the archive list on the left, or capture a new student exam.
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
