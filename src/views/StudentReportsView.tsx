import React, { useState, useEffect, useRef } from 'react';
import { 
  FileText, 
  Printer, 
  User, 
  Search, 
  Award, 
  CheckCircle2, 
  TrendingUp, 
  BookOpen, 
  AlertCircle,
  ShieldCheck,
  Calendar,
  Upload,
  Sparkles,
  Bot,
  Filter,
  Layers,
  Edit,
  Save,
  Check,
  X,
  FileSpreadsheet,
  Download,
  Users,
  Eye
} from 'lucide-react';
import { UserProfile, WeeklyStudentReport } from '../types';
import { KdlhStorageService } from '../services/storage';

interface StudentReportsViewProps {
  currentUser: UserProfile;
  onNavigate?: (route: string) => void;
}

interface UploadedDocumentFile {
  id: string;
  name: string;
  size: number;
  type: string;
  content: string; // text or CSV string
}

export const StudentReportsView: React.FC<StudentReportsViewProps> = ({ currentUser, onNavigate }) => {
  const [activeTab, setActiveTab] = useState<'view_reports' | 'ai_generator'>('view_reports');
  const [reports, setReports] = useState<WeeklyStudentReport[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  
  // AI Multi-Document State
  const [uploadedFiles, setUploadedFiles] = useState<UploadedDocumentFile[]>([]);
  const [examTitleInput, setExamTitleInput] = useState('Form IV Terminal Examination 2026');
  const [targetFormInput, setTargetFormInput] = useState('Form IV');
  const [isAnalyzingDocs, setIsAnalyzingDocs] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  
  // AI Results Pending Admin Approval
  const [aiClassSummary, setAiClassSummary] = useState<any | null>(null);
  const [aiDraftReports, setAiDraftReports] = useState<any[]>([]);
  const [aiDuplicateFlags, setAiDuplicateFlags] = useState<any[]>([]);
  const [editingDraftIndex, setEditingDraftIndex] = useState<number | null>(null);
  const [editingDraftData, setEditingDraftData] = useState<any | null>(null);
  const [publishSuccessMsg, setPublishSuccessMsg] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const isStudent = currentUser.role === 'STUDENT';
  const isTeacher = currentUser.role === 'TEACHER';
  const isAdminOrFounder = currentUser.role === 'ADMIN' || currentUser.role === 'FOUNDER';

  useEffect(() => {
    loadPublishedReports();
  }, [currentUser]);

  const loadPublishedReports = () => {
    const list = KdlhStorageService.getPublishedStudentReports();
    setReports(list);
  };

  // Role Filtering:
  // - Student sees ONLY their own report.
  // - Teacher & Admin see authorized reports.
  const authorizedReports = reports.filter(r => {
    if (isStudent) {
      return r.studentName.toLowerCase().includes(currentUser.name.toLowerCase()) || 
             r.admissionNumber.toLowerCase() === currentUser.id.toLowerCase();
    }
    return true;
  });

  const [selectedReport, setSelectedReport] = useState<WeeklyStudentReport | null>(null);

  useEffect(() => {
    if (authorizedReports.length > 0 && !selectedReport) {
      setSelectedReport(authorizedReports[0]);
    }
  }, [reports, currentUser]);

  const filteredReports = authorizedReports.filter(r => 
    r.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.className.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.admissionNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handlePrint = () => {
    window.print();
  };

  // --- File Upload Handler ---
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files: File[] = Array.from(e.target.files);

    files.forEach((file: File) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string || '';
        const newDoc: UploadedDocumentFile = {
          id: `doc-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          name: file.name,
          size: file.size,
          type: file.name.split('.').pop() || 'txt',
          content: text.slice(0, 50000) // cap size for safety
        };
        setUploadedFiles(prev => [...prev, newDoc]);
      };
      reader.readAsText(file);
    });
  };

  const removeUploadedFile = (id: string) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== id));
  };

  // --- Run AI Analysis ---
  const handleRunAiAnalysis = async () => {
    if (uploadedFiles.length === 0) {
      setAnalysisError('Please upload at least one document (CSV, XLSX, TXT, DOCX, or PDF text) first.');
      return;
    }

    setIsAnalyzingDocs(true);
    setAnalysisError(null);
    setPublishSuccessMsg(null);

    try {
      const payload = {
        documents: uploadedFiles,
        examinationTitle: examTitleInput,
        form: targetFormInput,
        school: 'Kizimba Secondary School'
      };

      const res = await fetch('/api/ai/analyze-documents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        throw new Error(`AI Analysis server error: ${res.statusText}`);
      }

      const data = await res.json();
      setAiClassSummary(data.classSummary || null);
      setAiDraftReports(data.studentReports || []);
      setAiDuplicateFlags(data.duplicateFlags || []);
    } catch (err: any) {
      console.error('AI Document Analysis failed:', err);
      setAnalysisError(err.message || 'Failed to analyze documents with AI.');
    } finally {
      setIsAnalyzingDocs(false);
    }
  };

  // --- Edit Draft Report before Publish ---
  const handleOpenEditDraft = (index: number) => {
    setEditingDraftIndex(index);
    setEditingDraftData(JSON.parse(JSON.stringify(aiDraftReports[index])));
  };

  const handleSaveDraftEdit = () => {
    if (editingDraftIndex !== null && editingDraftData) {
      const updated = [...aiDraftReports];
      updated[editingDraftIndex] = editingDraftData;
      setAiDraftReports(updated);
      setEditingDraftIndex(null);
      setEditingDraftData(null);
    }
  };

  // --- Approve and Publish Reports ---
  const handleApproveAndPublish = () => {
    if (aiDraftReports.length === 0) return;

    const formattedPublished: WeeklyStudentReport[] = aiDraftReports.map((draft, idx) => ({
      id: draft.id || `rep-pub-${Date.now()}-${idx}`,
      weekNumber: 6,
      datesRange: '10 Feb 2026 - 14 Feb 2026',
      studentId: draft.studentId || `std-${idx + 10}`,
      studentName: draft.studentName || 'Student Name',
      admissionNumber: draft.admissionNumber || `KDLH-2026-00${idx + 1}`,
      form: draft.form || targetFormInput,
      className: draft.className || `${targetFormInput} A`,
      subjectsTaught: (draft.marksObtained || []).map((m: any) => m.subject),
      topicsCovered: ['Terminal Exam Content', 'Practical Evaluation'],
      testsConducted: [examTitleInput],
      marksObtained: (draft.marksObtained || []).map((m: any) => ({
        subject: m.subject,
        score: Number(m.score) || 0,
        total: Number(m.total) || 100,
        grade: m.grade || (m.score >= 80 ? 'A' : m.score >= 70 ? 'B' : 'C')
      })),
      attendanceDays: draft.attendanceDays || 20,
      totalSchoolDays: draft.totalSchoolDays || 20,
      homeworkStatus: 'Completed assigned revision past papers',
      strengths: draft.strengths || ['Good overall academic progress'],
      weaknesses: draft.weaknesses || ['Continue regular practice'],
      teacherComments: draft.teacherComments || 'Official report approved by KDLH Academic Administration.',
      recommendedImprovement: 'Maintain study schedule for national examinations.',
      teacherName: currentUser.name || 'Academic Administrator',
      dateGenerated: new Date().toISOString().split('T')[0]
    }));

    // Add to storage
    KdlhStorageService.addPublishedStudentReports(formattedPublished);
    loadPublishedReports();

    setPublishSuccessMsg(`Successfully published ${formattedPublished.length} student report(s) to official database!`);
    setAiClassSummary(null);
    setAiDraftReports([]);
    setAiDuplicateFlags([]);
    setUploadedFiles([]);

    // Switch tab to view reports
    setTimeout(() => {
      setActiveTab('view_reports');
    }, 1200);
  };

  // --- Export Reports CSV ---
  const handleExportCSV = () => {
    if (authorizedReports.length === 0) return;
    let csv = 'Admission Number,Student Name,Form,Class,Attendance,Average Score,Teacher Comments\n';
    authorizedReports.forEach(r => {
      const totalScore = r.marksObtained.reduce((acc, m) => acc + m.score, 0);
      const totalMax = r.marksObtained.reduce((acc, m) => acc + m.total, 0);
      const avg = totalMax > 0 ? Math.round((totalScore / totalMax) * 100) : 0;
      csv += `"${r.admissionNumber}","${r.studentName}","${r.form}","${r.className}","${r.attendanceDays}/${r.totalSchoolDays}","${avg}%","${r.teacherComments.replace(/"/g, '""')}"\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `KDLH_Student_Reports_${targetFormInput}.csv`;
    a.click();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl text-white flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-blue-400 uppercase tracking-widest">KDLH OFFICIAL ACADEMIC PORTAL</span>
            <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 font-bold border border-blue-500/30">
              STUDENT REPORT CARDS
            </span>
          </div>
          <h1 className="text-2xl font-black">Student Academic Performance Reports</h1>
          <p className="text-xs text-slate-300">
            {isStudent 
              ? 'View your official academic test results, attendance history, and teacher comments.' 
              : 'Access, generate with AI, approve, and print official Tanzanian secondary student reports.'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {!isStudent && (
            <button
              onClick={handleExportCSV}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-teal-300 border border-slate-700 font-bold text-xs rounded-xl shadow transition flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" /> Export CSV
            </button>
          )}

          <button
            onClick={handlePrint}
            className="px-5 py-2.5 bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-400 hover:to-emerald-500 text-slate-950 font-bold text-xs rounded-xl shadow-xl flex items-center gap-2"
          >
            <Printer className="w-4 h-4" /> Print Report Card
          </button>
        </div>
      </div>

      {/* Tabs for Teachers and Admins */}
      {!isStudent && (
        <div className="flex items-center gap-2 border-b border-slate-800 pb-1">
          <button
            onClick={() => setActiveTab('view_reports')}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition ${
              activeTab === 'view_reports' 
                ? 'bg-blue-600 text-white shadow-lg' 
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <FileText className="w-4 h-4" /> View & Print Published Reports ({authorizedReports.length})
          </button>

          <button
            onClick={() => setActiveTab('ai_generator')}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition ${
              activeTab === 'ai_generator' 
                ? 'bg-gradient-to-r from-teal-500 to-emerald-600 text-slate-950 shadow-lg' 
                : 'text-teal-400 hover:bg-slate-900'
            }`}
          >
            <Bot className="w-4 h-4" /> AI Document & Report Analysis Engine
          </button>
        </div>
      )}

      {/* TAB 1: VIEW & PRINT REPORTS */}
      {activeTab === 'view_reports' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column: Student Selector (Hidden for Students) */}
          {!isStudent && (
            <div className="lg:col-span-4 space-y-3">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl space-y-3">
                <div className="flex justify-between items-center">
                  <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                    Authorized Student Reports ({filteredReports.length})
                  </h3>
                  <span className="text-[10px] text-teal-400 font-semibold">Live Firestore</span>
                </div>

                {/* Search Bar */}
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="Search student or class..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-blue-500 font-sans"
                  />
                </div>

                {/* List */}
                <div className="space-y-2 max-h-[580px] overflow-y-auto pr-1">
                  {filteredReports.map(rep => (
                    <div
                      key={rep.id}
                      onClick={() => setSelectedReport(rep)}
                      className={`p-3.5 rounded-xl border transition cursor-pointer ${
                        selectedReport?.id === rep.id
                          ? 'border-blue-500 bg-blue-500/10'
                          : 'border-slate-800 bg-slate-950/60 hover:bg-slate-950'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-bold text-xs text-white">{rep.studentName}</h4>
                          <span className="text-[10px] text-slate-400">{rep.admissionNumber} • {rep.className}</span>
                        </div>
                        <span className="text-[10px] bg-emerald-950 text-emerald-400 px-2 py-0.5 rounded font-bold border border-emerald-800">
                          {rep.form}
                        </span>
                      </div>
                    </div>
                  ))}
                  {filteredReports.length === 0 && (
                    <div className="p-4 text-center text-xs text-slate-500">
                      No reports found.
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Right Column: Official Student Report Card */}
          <div className={isStudent ? 'lg:col-span-12' : 'lg:col-span-8'}>
            {selectedReport ? (
              <div className="bg-slate-950 p-6 sm:p-8 rounded-2xl border border-slate-800 space-y-6 text-slate-200 shadow-2xl print:bg-white print:text-black">
                
                {/* Header Letterhead */}
                <div className="border-b border-slate-800 pb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-black text-white uppercase tracking-wider">KIZIMBA SECONDARY SCHOOL</h2>
                    <p className="text-xs text-amber-400 font-bold uppercase tracking-widest">KIZIMBA DIGITAL LEARNING HUB (KDLH)</p>
                    <p className="text-[11px] text-slate-400">Official Student Academic & Progress Performance Report</p>
                  </div>
                  <div className="text-right text-xs text-slate-400 font-mono">
                    <p><strong>Form:</strong> {selectedReport.form}</p>
                    <p><strong>Generated:</strong> {selectedReport.dateGenerated}</p>
                    <p><strong>Status:</strong> <span className="text-emerald-400 font-bold">APPROVED & PUBLISHED</span></p>
                  </div>
                </div>

                {/* Student Info Card */}
                <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-sans">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-600/20 border border-blue-500/40 text-blue-300 flex items-center justify-center font-bold text-sm">
                      {selectedReport.studentName.charAt(0)}
                    </div>
                    <div>
                      <span className="text-slate-500 text-[10px] block uppercase font-bold">Student Name</span>
                      <strong className="text-white text-sm">{selectedReport.studentName}</strong>
                    </div>
                  </div>

                  <div>
                    <span className="text-slate-500 text-[10px] block uppercase font-bold">Admission Number</span>
                    <strong className="text-teal-400 font-mono">{selectedReport.admissionNumber}</strong>
                  </div>

                  <div>
                    <span className="text-slate-500 text-[10px] block uppercase font-bold">Form & Stream</span>
                    <strong className="text-white">{selectedReport.form} ({selectedReport.className})</strong>
                  </div>

                  <div>
                    <span className="text-slate-500 text-[10px] block uppercase font-bold">Attendance Record</span>
                    <strong className="text-emerald-400 font-mono">{selectedReport.attendanceDays} / {selectedReport.totalSchoolDays} Days</strong>
                  </div>
                </div>

                {/* Subject Test Marks */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-amber-400" /> Test & Examination Performance
                  </h4>

                  <div className="overflow-x-auto border border-slate-800 rounded-xl">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-900 text-slate-400 text-[10px] uppercase tracking-wider">
                        <tr>
                          <th className="p-3">Subject</th>
                          <th className="p-3">Score</th>
                          <th className="p-3">Max Marks</th>
                          <th className="p-3">Percentage</th>
                          <th className="p-3">Grade</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800 text-slate-300 font-mono">
                        {selectedReport.marksObtained.map((m, idx) => {
                          const pct = Math.round((m.score / m.total) * 100);
                          return (
                            <tr key={idx} className="hover:bg-slate-900/50">
                              <td className="p-3 font-bold text-white font-sans">{m.subject}</td>
                              <td className="p-3">{m.score}</td>
                              <td className="p-3">{m.total}</td>
                              <td className="p-3 font-bold text-teal-400">{pct}%</td>
                              <td className="p-3">
                                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-950 text-blue-300 border border-blue-800">
                                  {m.grade}
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Topics & Homework */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-sans">
                  <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 space-y-2">
                    <h5 className="font-bold text-blue-400 uppercase text-[10px]">Covered Topics</h5>
                    <ul className="list-disc list-inside space-y-1 text-slate-300">
                      {selectedReport.topicsCovered.map((t, idx) => (
                        <li key={idx}>{t}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 space-y-2">
                    <h5 className="font-bold text-emerald-400 uppercase text-[10px]">Assignments & Homework</h5>
                    <p className="text-slate-300 leading-relaxed">{selectedReport.homeworkStatus}</p>
                  </div>
                </div>

                {/* Teacher Remarks & Recommendations */}
                <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 space-y-3 text-xs font-sans">
                  <div>
                    <h5 className="font-bold text-emerald-400 uppercase text-[10px]">Academic Strengths</h5>
                    <p className="text-slate-300">{selectedReport.strengths.join(' • ')}</p>
                  </div>

                  <div>
                    <h5 className="font-bold text-amber-400 uppercase text-[10px]">Improvement Opportunities</h5>
                    <p className="text-slate-300">{selectedReport.weaknesses.join(' • ')}</p>
                  </div>

                  <div className="pt-2 border-t border-slate-800">
                    <h5 className="font-bold text-white uppercase text-[10px] mb-1">Teacher Comments</h5>
                    <p className="text-slate-300 italic">"{selectedReport.teacherComments}"</p>
                    <p className="text-teal-400 font-bold mt-2">Recommended Strategy: {selectedReport.recommendedImprovement}</p>
                  </div>
                </div>

                {/* Sign Off */}
                <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-500 font-mono">
                  <span>Authorized Teacher: <strong>{selectedReport.teacherName}</strong></span>
                  <span>Verified: KDLH Firestore Database</span>
                </div>

              </div>
            ) : (
              <div className="py-16 text-center text-slate-500 text-xs">
                No report card selected.
              </div>
            )}
          </div>

        </div>
      )}

      {/* TAB 2: AI MULTI-DOCUMENT REPORT GENERATOR */}
      {!isStudent && activeTab === 'ai_generator' && (
        <div className="space-y-8">
          
          {/* Upload & Setup Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-teal-500/10 border border-teal-500/30 text-teal-400">
                <Bot className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">AI Multi-Document Analysis & Student Report Engine</h3>
                <p className="text-xs text-slate-400">
                  Upload multiple mark sheets, student lists, or attendance files (CSV, XLSX, PDF text, DOCX). The AI will parse tables, match students, flag duplicates, and build candidate reports for Admin approval.
                </p>
              </div>
            </div>

            {/* Inputs: Form & Exam Title */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">Target Form / Class</label>
                <select
                  value={targetFormInput}
                  onChange={(e) => setTargetFormInput(e.target.value)}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-teal-500"
                >
                  <option value="Form I">Form I</option>
                  <option value="Form II">Form II</option>
                  <option value="Form III">Form III</option>
                  <option value="Form IV">Form IV</option>
                  <option value="Form V">Form V</option>
                  <option value="Form VI">Form VI</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">Examination / Report Title</label>
                <input
                  type="text"
                  value={examTitleInput}
                  onChange={(e) => setExamTitleInput(e.target.value)}
                  placeholder="e.g. Form IV Mid-Term Examination 2026"
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-teal-500"
                />
              </div>
            </div>

            {/* Dropzone */}
            <div className="border-2 border-dashed border-slate-700 hover:border-teal-500 rounded-2xl p-6 text-center space-y-3 bg-slate-950/50 transition">
              <Upload className="w-10 h-10 text-teal-400 mx-auto" />
              <div>
                <h4 className="text-xs font-bold text-slate-200">Drag & Drop or Select Multiple Mark Sheets / Files</h4>
                <p className="text-[11px] text-slate-400 mt-1">
                  Supports CSV, XLSX, PDF, DOCX, TXT. You can upload separate files for Chemistry, Mathematics, Physics, etc.
                </p>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept=".csv,.txt,.json,.tsv,.xlsx,.docx,.pdf"
                onChange={handleFileUpload}
                className="hidden"
              />

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-teal-300 font-bold text-xs rounded-xl border border-slate-700 transition inline-flex items-center gap-1.5"
              >
                <Upload className="w-3.5 h-3.5" /> Select Files
              </button>
            </div>

            {/* Uploaded File Badges */}
            {uploadedFiles.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Uploaded Files ({uploadedFiles.length})
                </h4>
                <div className="flex flex-wrap gap-2">
                  {uploadedFiles.map(file => (
                    <div
                      key={file.id}
                      className="px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl flex items-center gap-2 text-xs text-slate-200"
                    >
                      <FileSpreadsheet className="w-4 h-4 text-teal-400" />
                      <span className="font-medium">{file.name}</span>
                      <span className="text-[10px] text-slate-500">({Math.round(file.size / 1024)} KB)</span>
                      <button
                        onClick={() => removeUploadedFile(file.id)}
                        className="p-1 hover:text-red-400 text-slate-500 transition"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Error Message */}
            {analysisError && (
              <div className="p-4 bg-red-950/80 border border-red-800 text-red-200 rounded-xl text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                <span>{analysisError}</span>
              </div>
            )}

            {/* Success Message */}
            {publishSuccessMsg && (
              <div className="p-4 bg-emerald-950/80 border border-emerald-800 text-emerald-200 rounded-xl text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>{publishSuccessMsg}</span>
              </div>
            )}

            {/* Action Bar */}
            <div className="pt-2 flex justify-end">
              <button
                onClick={handleRunAiAnalysis}
                disabled={isAnalyzingDocs || uploadedFiles.length === 0}
                className="px-6 py-3 bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-400 hover:to-emerald-500 disabled:opacity-50 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl shadow-xl flex items-center gap-2 transition"
              >
                {isAnalyzingDocs ? (
                  <>
                    <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                    AI Processing Documents...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" /> Run AI Document Synthesis & Matching
                  </>
                )}
              </button>
            </div>
          </div>

          {/* AI Analysis Preview & Approval Workspace */}
          {aiClassSummary && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-6">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    AI Analysis Results Preview
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">
                      REQUIRES ADMIN CONFIRMATION
                    </span>
                  </h3>
                  <p className="text-xs text-slate-400">
                    Review generated student marks and flags before publishing to the official database.
                  </p>
                </div>

                <button
                  onClick={handleApproveAndPublish}
                  className="px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl shadow-xl flex items-center gap-2 self-start sm:self-auto"
                >
                  <CheckCircle2 className="w-4 h-4" /> Approve & Publish Official Reports
                </button>
              </div>

              {/* Executive Class Summary Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 block font-bold uppercase">Students Identified</span>
                  <strong className="text-xl text-white font-mono">{aiClassSummary.totalStudentsFound}</strong>
                </div>

                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 block font-bold uppercase">Class Average</span>
                  <strong className="text-xl text-teal-400 font-mono">{aiClassSummary.classAveragePercent}%</strong>
                </div>

                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 block font-bold uppercase">Identified Subjects</span>
                  <strong className="text-xs text-blue-400 font-semibold">{aiClassSummary.subjectsIdentified?.join(', ')}</strong>
                </div>

                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 block font-bold uppercase">Review Flags</span>
                  <strong className="text-xl text-amber-400 font-mono">{aiDuplicateFlags.length}</strong>
                </div>
              </div>

              {/* Duplicate / Uncertain Flags Warning Box */}
              {aiDuplicateFlags.length > 0 && (
                <div className="p-4 bg-amber-950/60 border border-amber-800 rounded-xl space-y-2">
                  <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4 text-amber-400" /> Student Identity & Duplicate Flags ({aiDuplicateFlags.length})
                  </h4>
                  <ul className="space-y-1 text-xs text-amber-200/90 list-disc list-inside">
                    {aiDuplicateFlags.map((flag: any, idx: number) => (
                      <li key={idx}>
                        <strong>{flag.studentName || 'Student'}:</strong> {flag.issue}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Extracted Student Draft Reports Table */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Generated Student Draft Reports ({aiDraftReports.length})
                </h4>

                <div className="overflow-x-auto border border-slate-800 rounded-xl bg-slate-950">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-900 text-slate-400 text-[10px] uppercase tracking-wider">
                      <tr>
                        <th className="p-3">Admission No</th>
                        <th className="p-3">Student Name</th>
                        <th className="p-3">Form</th>
                        <th className="p-3">Subject Marks</th>
                        <th className="p-3">Average %</th>
                        <th className="p-3">Match Status</th>
                        <th className="p-3 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800 text-slate-300 font-mono">
                      {aiDraftReports.map((draft: any, idx: number) => (
                        <tr key={idx} className="hover:bg-slate-900/50">
                          <td className="p-3 text-teal-400 font-bold">{draft.admissionNumber}</td>
                          <td className="p-3 font-bold text-white font-sans">{draft.studentName}</td>
                          <td className="p-3">{draft.form}</td>
                          <td className="p-3 font-sans text-[11px]">
                            {(draft.marksObtained || []).map((m: any) => `${m.subject}: ${m.score}/${m.total}`).join(' • ')}
                          </td>
                          <td className="p-3 font-bold text-emerald-400">{draft.averageMark}%</td>
                          <td className="p-3">
                            {draft.isUncertainMatch ? (
                              <span className="px-2 py-0.5 bg-amber-950 text-amber-300 border border-amber-800 rounded text-[10px] font-bold">
                                Review Required
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 bg-emerald-950 text-emerald-300 border border-emerald-800 rounded text-[10px] font-bold">
                                Verified
                              </span>
                            )}
                          </td>
                          <td className="p-3 text-right font-sans">
                            <button
                              onClick={() => handleOpenEditDraft(idx)}
                              className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-teal-300 rounded-lg text-xs font-bold transition inline-flex items-center gap-1"
                            >
                              <Edit className="w-3.5 h-3.5" /> Edit
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* Modal to Edit Candidate Draft Report */}
          {editingDraftData && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-lg w-full space-y-4 text-xs">
                <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                  <h3 className="font-bold text-sm text-white flex items-center gap-2">
                    <Edit className="w-4 h-4 text-teal-400" /> Edit Draft Report: {editingDraftData.studentName}
                  </h3>
                  <button onClick={() => setEditingDraftData(null)} className="text-slate-400 hover:text-white">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-slate-400 font-bold mb-1">Student Name</label>
                    <input
                      type="text"
                      value={editingDraftData.studentName}
                      onChange={(e) => setEditingDraftData({ ...editingDraftData, studentName: e.target.value })}
                      className="w-full p-2 bg-slate-950 border border-slate-800 rounded-lg text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 font-bold mb-1">Admission Number</label>
                    <input
                      type="text"
                      value={editingDraftData.admissionNumber}
                      onChange={(e) => setEditingDraftData({ ...editingDraftData, admissionNumber: e.target.value })}
                      className="w-full p-2 bg-slate-950 border border-slate-800 rounded-lg text-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 font-bold mb-1">Teacher Comments</label>
                    <textarea
                      rows={3}
                      value={editingDraftData.teacherComments}
                      onChange={(e) => setEditingDraftData({ ...editingDraftData, teacherComments: e.target.value })}
                      className="w-full p-2 bg-slate-950 border border-slate-800 rounded-lg text-white"
                    />
                  </div>
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    onClick={() => setEditingDraftData(null)}
                    className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveDraftEdit}
                    className="px-4 py-2 bg-teal-500 hover:bg-teal-400 text-slate-950 rounded-lg font-bold flex items-center gap-1"
                  >
                    <Save className="w-3.5 h-3.5" /> Save Changes
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      )}

    </div>
  );
};
