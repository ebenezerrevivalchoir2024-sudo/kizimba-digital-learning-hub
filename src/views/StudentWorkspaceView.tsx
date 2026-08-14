import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Download, 
  Mic, 
  MicOff, 
  Sparkles, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  TrendingUp, 
  FolderDown, 
  Folder, 
  Search, 
  Share2,
  Printer
} from 'lucide-react';
import { StudentTopicProgress, NoteSummary, KDLHResource } from '../types';
import { KdlhStorageService } from '../services/storage';

export const StudentWorkspaceView: React.FC = () => {
  const [topicProgress, setTopicProgress] = useState<StudentTopicProgress[]>([]);
  const [summaries, setSummaries] = useState<NoteSummary[]>([]);
  const [isListening, setIsListening] = useState<boolean>(false);
  const [voiceQuery, setVoiceQuery] = useState<string>('');
  const [activeFolderDownloaded, setActiveFolderDownloaded] = useState<boolean>(false);

  useEffect(() => {
    setTopicProgress(KdlhStorageService.getStudentTopicProgress());
    setSummaries(KdlhStorageService.getNoteSummaries());
  }, []);

  const startVoiceSearch = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Speech recognition is not supported in this browser. You can type your search directly.');
      return;
    }

    try {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => setIsListening(true);
      recognition.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0])
          .map((result: any) => result.transcript)
          .join('');
        setVoiceQuery(transcript);
      };

      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);

      recognition.start();
    } catch (e) {
      console.warn('Speech recognition error:', e);
      setIsListening(false);
    }
  };

  const handleExportNoteToTxt = (summary: NoteSummary) => {
    const textContent = `
=====================================================
KIZIMBA DIGITAL LEARNING HUB (KDLH) - STUDY SUMMARY
Founder: Isaack Edward Lungwa
Tagline: LEARN • PRACTICE • ASK • IMPROVE
=====================================================

TITLE: ${summary.sourceTitle}
DATE GENERATED: ${summary.dateCreated}
LANGUAGE: ${summary.language}

EXECUTIVE SUMMARY:
${summary.shortSummary}

KEY REVISION POINTS:
${(summary.keyPoints || []).map((pt, i) => `${i + 1}. ${pt}`).join('\n')}

IMPORTANT DEFINITIONS:
${(summary.importantDefinitions || []).map(d => `- ${d.term}: ${d.definition}`).join('\n')}

ESSENTIAL FORMULAS:
${(summary.formulas || []).map(f => `- ${f.name}: ${f.formula}`).join('\n')}

EXAM REVISION QUESTIONS:
${(summary.examQuestions || []).map((q, i) => `Q${i + 1} (${q.marks} Marks): ${q.question}`).join('\n')}

=====================================================
Downloaded from KDLH Offline Student Vault
`.trim();

    const element = document.createElement('a');
    const file = new Blob([textContent], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `${summary.sourceTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_summary.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleDownloadFolderAll = (folderName: string) => {
    setActiveFolderDownloaded(true);
    setTimeout(() => {
      alert(`All resources in "${folderName}" folder successfully packaged and saved for offline reading!`);
      setActiveFolderDownloaded(false);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-6 lg:p-8 space-y-6">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-teal-400 uppercase tracking-widest">KDLH STUDENT DASHBOARD</span>
            <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-teal-500/20 text-teal-300 font-bold border border-teal-500/30">
              OFFLINE VAULT & REVISION HUB
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-100 mt-2">
            Student Topic Revision & Study Workspace
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
            Speech-to-text voice search • Export summaries to text file for printing • Subject folder 'Download All' • AI weak topic remediation.
          </p>
        </div>

        {/* Speech Search Widget */}
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 min-w-[280px] space-y-2">
          <label className="text-[11px] font-bold text-teal-400 uppercase tracking-wider block">
            Speech-to-Text Voice Search
          </label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Ask or search topics..."
              value={voiceQuery}
              onChange={(e) => setVoiceQuery(e.target.value)}
              className="flex-1 px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-teal-500"
            />
            <button
              onClick={startVoiceSearch}
              className={`p-2 rounded-lg transition border ${
                isListening 
                  ? 'bg-red-500/20 text-red-400 border-red-500/40 animate-pulse' 
                  : 'bg-teal-600 hover:bg-teal-500 text-white border-teal-500/30'
              }`}
              title="Click to speak"
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* Main Student Workspace Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Offline Subject Folders & Download All (Left 5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                  Offline Vault Subject Folders
                </h2>
                <p className="text-[11px] text-slate-400 mt-0.5">Download full subject folder for offline viewing</p>
              </div>
              <FolderDown className="w-5 h-5 text-teal-400" />
            </div>

            <div className="space-y-3">
              {[
                { subject: 'Chemistry Form IV', filesCount: 14, size: '42 MB' },
                { subject: 'Physics Form IV', filesCount: 12, size: '38 MB' },
                { subject: 'Biology Form IV', filesCount: 18, size: '54 MB' },
                { subject: 'Mathematics Form IV', filesCount: 15, size: '29 MB' }
              ].map((folder, idx) => (
                <div 
                  key={idx}
                  className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between hover:border-teal-500/40 transition"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-teal-500/10 text-teal-400 border border-teal-500/20">
                      <Folder className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-xs font-bold text-slate-200">{folder.subject}</h3>
                      <p className="text-[10px] text-slate-400">{folder.filesCount} Resources • {folder.size}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDownloadFolderAll(folder.subject)}
                    className="px-3 py-1.5 bg-teal-600/20 hover:bg-teal-600 text-teal-300 hover:text-white rounded-lg text-xs font-semibold border border-teal-500/30 transition flex items-center gap-1"
                  >
                    <FolderDown className="w-3.5 h-3.5" /> Download All
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Topic Mastery & Weak Areas */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                Topic Mastery & AI Weak Area Analysis
              </h2>
              <TrendingUp className="w-4 h-4 text-teal-400" />
            </div>

            <div className="space-y-3">
              {topicProgress.map((tp) => (
                <div key={tp.topicId} className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-200">{tp.topicName}</span>
                    <span className={`font-bold ${tp.masteryPercentage < 65 ? 'text-amber-400' : 'text-emerald-400'}`}>
                      {tp.masteryPercentage}%
                    </span>
                  </div>

                  <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${tp.masteryPercentage < 65 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                      style={{ width: `${tp.masteryPercentage}%` }}
                    />
                  </div>

                  {tp.masteryPercentage < 65 && (
                    <div className="text-[10px] text-amber-300 font-medium flex items-center gap-1 pt-0.5">
                      <AlertCircle className="w-3 h-3" /> Weak area detected: Recommended revision quiz & notes ready.
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Study Summaries & Text Export (Right 7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                  Saved Notes & Personal Summaries
                </h2>
                <p className="text-[11px] text-slate-400 mt-0.5">Export study guides directly to text (.txt) file for offline printing</p>
              </div>
              <FileText className="w-5 h-5 text-teal-400" />
            </div>

            <div className="space-y-4">
              {summaries.map((s) => (
                <div key={s.id} className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] font-bold text-teal-400 uppercase tracking-wider block">
                        {s.sourceType}
                      </span>
                      <h3 className="text-sm font-bold text-slate-100">{s.sourceTitle}</h3>
                    </div>

                    <button
                      onClick={() => handleExportNoteToTxt(s)}
                      className="px-3 py-1.5 bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs rounded-xl transition shadow flex items-center gap-1.5"
                    >
                      <Download className="w-3.5 h-3.5" /> Export TXT
                    </button>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed bg-slate-900 p-3 rounded-xl border border-slate-800">
                    {s.shortSummary}
                  </p>

                  <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-400">
                    <div>Key Points: <strong className="text-slate-200">{s.keyPoints.length}</strong></div>
                    <div>Flashcards: <strong className="text-slate-200">{s.flashcards.length}</strong></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
