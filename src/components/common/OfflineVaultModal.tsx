import React, { useState, useEffect, useMemo } from 'react';
import { 
  X, 
  HardDrive, 
  Wifi, 
  WifiOff, 
  Database, 
  BookOpen, 
  FileText, 
  Plus, 
  Trash2, 
  RefreshCw, 
  Download, 
  CheckCircle2, 
  AlertCircle,
  Zap,
  Folder,
  FolderDown,
  FolderCheck,
  ChevronDown,
  ChevronUp,
  FolderOpen
} from 'lucide-react';
import { KDLHResource, SavedNote } from '../../types';
import { KdlhStorageService } from '../../services/storage';
import { IndexedDbService } from '../../services/db';
import { exportSingleNoteToTxt, exportAllNotesToTxt, exportResourceToTxt, exportSubjectFolderToTxt } from '../../utils/exportUtils';

interface OfflineVaultModalProps {
  isOpen: boolean;
  onClose: () => void;
  isOnline: boolean;
  onSelectResource: (resource: KDLHResource) => void;
}

export const OfflineVaultModal: React.FC<OfflineVaultModalProps> = ({
  isOpen,
  onClose,
  isOnline,
  onSelectResource
}) => {
  const [activeTab, setActiveTab] = useState<'FOLDERS' | 'RESOURCES' | 'NOTES' | 'STATS'>('FOLDERS');
  const [allResources, setAllResources] = useState<KDLHResource[]>([]);
  const [cachedResources, setCachedResources] = useState<KDLHResource[]>([]);
  const [savedNotes, setSavedNotes] = useState<SavedNote[]>([]);
  const [storageStats, setStorageStats] = useState({
    resourceCount: 0,
    notesCount: 0,
    queuedActionsCount: 0,
    totalSizeBytes: 0,
  });
  const [syncing, setSyncing] = useState(false);
  const [cachingAll, setCachingAll] = useState(false);
  const [cachingSubject, setCachingSubject] = useState<string | null>(null);
  const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({});

  // New Note State
  const [showNoteForm, setShowNoteForm] = useState(false);
  const [noteTitle, setNoteTitle] = useState('');
  const [noteSubject, setNoteSubject] = useState('Chemistry');
  const [noteForm, setNoteForm] = useState('Form IV');
  const [noteContent, setNoteContent] = useState('');

  useEffect(() => {
    if (isOpen) {
      loadOfflineData();
    }
  }, [isOpen]);

  const loadOfflineData = async () => {
    try {
      const all = KdlhStorageService.getAllResources();
      const resources = await KdlhStorageService.getOfflineCachedResources();
      const notes = await KdlhStorageService.getUserNotes();
      const stats = await IndexedDbService.getStorageStats();

      setAllResources(all);
      setCachedResources(resources);
      setSavedNotes(notes);
      setStorageStats(stats);
    } catch (e) {
      console.warn('Failed to load IndexedDB vault data:', e);
    }
  };

  const subjectFoldersMap = useMemo(() => {
    const map: Record<string, KDLHResource[]> = {};
    allResources.forEach(res => {
      const subj = res.subjectName || 'General Studies';
      if (!map[subj]) map[subj] = [];
      map[subj].push(res);
    });
    return map;
  }, [allResources]);

  const handleDownloadSubjectFolder = async (subjectName: string, folderResources: KDLHResource[]) => {
    setCachingSubject(subjectName);
    await KdlhStorageService.cacheResourcesBulk(folderResources);
    await loadOfflineData();
    setCachingSubject(null);
  };

  const toggleFolderExpand = (subjectName: string) => {
    setExpandedFolders(prev => ({ ...prev, [subjectName]: !prev[subjectName] }));
  };

  const handleSyncQueue = async () => {
    setSyncing(true);
    await KdlhStorageService.syncOfflineQueue();
    await loadOfflineData();
    setSyncing(false);
  };

  const handlePrecacheAll = async () => {
    setCachingAll(true);
    await KdlhStorageService.initIndexedDbSync();
    await loadOfflineData();
    setCachingAll(false);
  };

  const handleCreateNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteTitle.trim() || !noteContent.trim()) return;

    const newNote: SavedNote = {
      id: `sn-usr-${Date.now()}`,
      title: noteTitle.trim(),
      subjectName: noteSubject,
      form: noteForm,
      content: noteContent.trim(),
      dateCreated: new Date().toISOString().split('T')[0],
      lastModified: new Date().toISOString().split('T')[0],
      syncStatus: isOnline ? 'synced' : 'offline-draft',
      tags: [noteSubject, noteForm, 'Student Notes']
    };

    await KdlhStorageService.saveUserNote(newNote);
    setNoteTitle('');
    setNoteContent('');
    setShowNoteForm(false);
    await loadOfflineData();
  };

  const handleDeleteNote = async (id: string) => {
    await KdlhStorageService.deleteUserNote(id);
    await loadOfflineData();
  };

  const handleRemoveCachedResource = async (id: string) => {
    await KdlhStorageService.uncacheResourceFromOffline(id);
    await loadOfflineData();
  };

  if (!isOpen) return null;

  const formattedSize = (storageStats.totalSizeBytes / (1024 * 1024)).toFixed(2);

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto font-mono">
      <div className="bg-black/90 text-cyan-100 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-[0_0_30px_rgba(6,182,212,0.2)] border border-cyan-900/50 overflow-hidden backdrop-blur-xl animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="bg-cyan-950/80 text-white p-6 relative border-b border-cyan-900/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-cyan-950 border border-cyan-500/40 text-cyan-300 text-xs font-bold shadow-[0_0_8px_rgba(6,182,212,0.2)]">
              <Database className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
              IndexedDB & Service Worker Offline Storage
            </div>
            <h2 className="text-xl sm:text-2xl font-black uppercase tracking-wider flex items-center gap-2">
              <HardDrive className="w-6 h-6 text-cyan-400" /> KDLH Student Offline Vault
            </h2>
            <p className="text-xs text-cyan-300/80 font-sans">
              Read cached notes, past papers & write local study drafts even with zero internet.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-2 ${
              isOnline ? 'bg-emerald-950/80 border-emerald-500/50 text-emerald-300' : 'bg-amber-950/80 border-amber-500/50 text-amber-300 animate-pulse'
            }`}>
              {isOnline ? <Wifi className="w-4 h-4 text-emerald-400" /> : <WifiOff className="w-4 h-4 text-amber-400" />}
              <span>{isOnline ? 'ONLINE' : 'OFFLINE MODE'}</span>
            </div>

            <button 
              onClick={onClose}
              className="p-2 text-cyan-400 hover:text-white rounded-lg bg-black/60 border border-cyan-900/50 hover:bg-cyan-950/50 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Selection Bar */}
        <div className="flex border-b border-cyan-900/50 bg-black/60 text-xs font-bold overflow-x-auto">
          <button
            onClick={() => setActiveTab('FOLDERS')}
            className={`flex-1 py-3 px-4 text-center border-b-2 transition-all uppercase tracking-wider flex items-center justify-center gap-2 whitespace-nowrap ${
              activeTab === 'FOLDERS' ? 'border-cyan-400 text-cyan-400 bg-cyan-950/30 shadow-[0_0_10px_#22d3ee]' : 'border-transparent text-cyan-400/70 hover:text-cyan-200'
            }`}
          >
            <FolderDown className="w-4 h-4" /> Subject Folders
          </button>

          <button
            onClick={() => setActiveTab('RESOURCES')}
            className={`flex-1 py-3 px-4 text-center border-b-2 transition-all uppercase tracking-wider flex items-center justify-center gap-2 whitespace-nowrap ${
              activeTab === 'RESOURCES' ? 'border-cyan-400 text-cyan-400 bg-cyan-950/30 shadow-[0_0_10px_#22d3ee]' : 'border-transparent text-cyan-400/70 hover:text-cyan-200'
            }`}
          >
            <BookOpen className="w-4 h-4" /> Cached Items ({cachedResources.length})
          </button>

          <button
            onClick={() => setActiveTab('NOTES')}
            className={`flex-1 py-3 px-4 text-center border-b-2 transition-all uppercase tracking-wider flex items-center justify-center gap-2 whitespace-nowrap ${
              activeTab === 'NOTES' ? 'border-cyan-400 text-cyan-400 bg-cyan-950/30 shadow-[0_0_10px_#22d3ee]' : 'border-transparent text-cyan-400/70 hover:text-cyan-200'
            }`}
          >
            <FileText className="w-4 h-4" /> Saved Notes ({savedNotes.length})
          </button>

          <button
            onClick={() => setActiveTab('STATS')}
            className={`flex-1 py-3 px-4 text-center border-b-2 transition-all uppercase tracking-wider flex items-center justify-center gap-2 whitespace-nowrap ${
              activeTab === 'STATS' ? 'border-cyan-400 text-cyan-400 bg-cyan-950/30 shadow-[0_0_10px_#22d3ee]' : 'border-transparent text-cyan-400/70 hover:text-cyan-200'
            }`}
          >
            <Database className="w-4 h-4" /> Storage Stats
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 bg-cyan-950/20 space-y-6">
          
          {/* TAB 0: SUBJECT FOLDERS (DOWNLOAD ALL) */}
          {activeTab === 'FOLDERS' && (
            <div className="space-y-4 font-mono">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-black/60 p-4 rounded-xl border border-cyan-900/50">
                <div>
                  <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <FolderDown className="w-5 h-5 text-cyan-400" /> Subject Folders & Bulk Offline Storage
                  </h4>
                  <p className="text-xs text-cyan-300/80 font-sans">
                    Download complete subject repositories to IndexedDB in 1 click for seamless offline revision.
                  </p>
                </div>
                
                <button
                  onClick={handlePrecacheAll}
                  disabled={cachingAll}
                  className="px-4 py-2 bg-cyan-400 hover:bg-cyan-300 text-black font-bold text-xs rounded-xl flex items-center gap-2 shadow-[0_0_12px_#22d3ee] uppercase tracking-wider disabled:opacity-50 transition-all self-start sm:self-auto"
                  title="Cache All Resources Across All Subjects"
                >
                  <Download className={`w-4 h-4 ${cachingAll ? 'animate-bounce' : ''}`} />
                  {cachingAll ? 'Caching All Subjects...' : 'Download All Subject Folders'}
                </button>
              </div>

              {/* Grid of Subject Folders */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(subjectFoldersMap).map(([subjName, rawResources]) => {
                  const folderResources = rawResources as KDLHResource[];
                  const cachedCount = folderResources.filter(r => cachedResources.some(c => c.id === r.id)).length;
                  const totalCount = folderResources.length;
                  const isFullyCached = cachedCount === totalCount && totalCount > 0;
                  const progressPct = totalCount > 0 ? Math.round((cachedCount / totalCount) * 100) : 0;
                  const isSavingThisFolder = cachingSubject === subjName;
                  const isExpanded = !!expandedFolders[subjName];

                  return (
                    <div 
                      key={subjName}
                      className="p-4 bg-black/70 rounded-xl border border-cyan-900/60 shadow-lg space-y-4 hover:border-cyan-500/50 transition-all flex flex-col justify-between"
                    >
                      <div className="space-y-3">
                        {/* Folder Header */}
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2.5">
                            <div className="p-2 rounded-lg bg-cyan-950 border border-cyan-800 text-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.2)]">
                              <Folder className="w-5 h-5" />
                            </div>
                            <div>
                              <h5 className="font-bold text-white text-base uppercase tracking-wider">{subjName} Folder</h5>
                              <span className="text-[11px] text-cyan-300/80 font-mono block">
                                {totalCount} {totalCount === 1 ? 'Resource' : 'Resources'} Total
                              </span>
                            </div>
                          </div>

                          {isFullyCached ? (
                            <span className="text-emerald-400 font-bold bg-emerald-950/80 border border-emerald-500/50 px-2.5 py-1 rounded-lg text-[11px] flex items-center gap-1.5 shadow-[0_0_8px_rgba(16,185,129,0.3)]">
                              <FolderCheck className="w-3.5 h-3.5 text-emerald-400" /> ALL CACHED
                            </span>
                          ) : (
                            <span className="text-cyan-300 font-bold bg-cyan-950/80 border border-cyan-800 px-2.5 py-1 rounded-lg text-[11px]">
                              {cachedCount} / {totalCount} Saved ({progressPct}%)
                            </span>
                          )}
                        </div>

                        {/* Progress Bar */}
                        <div className="w-full bg-cyan-950/80 rounded-full h-2 overflow-hidden border border-cyan-900/50">
                          <div 
                            className={`h-full transition-all duration-300 ${
                              isFullyCached 
                                ? 'bg-emerald-400 shadow-[0_0_8px_#34d399]' 
                                : 'bg-cyan-400 shadow-[0_0_8px_#22d3ee]'
                            }`}
                            style={{ width: `${progressPct}%` }}
                          />
                        </div>
                      </div>

                      {/* Action Row */}
                      <div className="pt-2 border-t border-cyan-900/40 space-y-2">
                        <div className="flex items-center justify-between gap-2 text-xs">
                          {/* Bulk Download Button for this folder */}
                          <button
                            onClick={() => handleDownloadSubjectFolder(subjName, folderResources)}
                            disabled={isSavingThisFolder || isFullyCached}
                            className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 uppercase tracking-wider text-xs transition-all ${
                              isFullyCached
                                ? 'bg-emerald-950/60 border border-emerald-600/40 text-emerald-300 cursor-default'
                                : 'bg-cyan-400 hover:bg-cyan-300 text-black shadow-[0_0_10px_#22d3ee] disabled:opacity-50'
                            }`}
                          >
                            <FolderDown className={`w-4 h-4 ${isSavingThisFolder ? 'animate-bounce' : ''}`} />
                            {isSavingThisFolder 
                              ? 'Saving Folder...' 
                              : isFullyCached 
                                ? 'Folder Saved' 
                                : `Download Folder (${totalCount})`
                            }
                          </button>

                          <div className="flex items-center gap-1">
                            {/* Export Folder to TXT Compilation */}
                            <button
                              onClick={() => exportSubjectFolderToTxt(subjName, folderResources)}
                              className="px-2.5 py-1.5 bg-black/60 border border-cyan-900/50 hover:bg-cyan-950/60 text-cyan-300 rounded-lg font-bold flex items-center gap-1 uppercase tracking-wider text-[11px] transition-colors"
                              title={`Export all ${subjName} materials to a single compilation TXT file`}
                            >
                              <Download className="w-3.5 h-3.5 text-cyan-400" /> .TXT
                            </button>

                            {/* Expand Items */}
                            <button
                              onClick={() => toggleFolderExpand(subjName)}
                              className="p-1.5 bg-cyan-950/80 hover:bg-cyan-900/80 text-cyan-300 border border-cyan-800 rounded-lg transition-colors"
                              title="Toggle Items List"
                            >
                              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                            </button>
                          </div>
                        </div>

                        {/* Collapsible Item List */}
                        {isExpanded && (
                          <div className="mt-3 pt-3 border-t border-cyan-900/40 space-y-2 animate-in fade-in duration-150">
                            <span className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider block">
                              Items in {subjName} Folder:
                            </span>
                            <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                              {folderResources.map((res) => {
                                const itemCached = cachedResources.some(c => c.id === res.id);
                                return (
                                  <div 
                                    key={res.id} 
                                    className="p-2 bg-black/80 rounded-lg border border-cyan-900/40 flex items-center justify-between text-xs gap-2"
                                  >
                                    <div className="flex items-center gap-2 truncate">
                                      {itemCached ? (
                                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                                      ) : (
                                        <BookOpen className="w-3.5 h-3.5 text-cyan-600 flex-shrink-0" />
                                      )}
                                      <span className="text-white truncate font-sans">{res.title}</span>
                                    </div>

                                    <div className="flex items-center gap-1.5 flex-shrink-0">
                                      <button
                                        onClick={() => {
                                          onSelectResource(res);
                                          onClose();
                                        }}
                                        className="text-[10px] text-cyan-300 hover:text-white uppercase font-bold underline"
                                      >
                                        Open
                                      </button>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 1: CACHED RESOURCES */}
          {activeTab === 'RESOURCES' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-black/60 p-4 rounded-xl border border-cyan-900/50">
                <div>
                  <h4 className="text-sm font-bold text-white uppercase tracking-wider">Offline Learning Materials</h4>
                  <p className="text-xs text-cyan-300/80 font-sans">
                    These resources are permanently stored in IndexedDB and Service Worker cache for offline access.
                  </p>
                </div>
                <button
                  onClick={handlePrecacheAll}
                  disabled={cachingAll}
                  className="px-4 py-2 bg-cyan-400 hover:bg-cyan-300 text-black font-bold text-xs rounded-xl flex items-center gap-2 shadow-[0_0_10px_#22d3ee] uppercase tracking-wider disabled:opacity-50 transition-all self-start sm:self-auto"
                >
                  <Download className={`w-4 h-4 ${cachingAll ? 'animate-bounce' : ''}`} />
                  {cachingAll ? 'Caching All Materials...' : 'Pre-cache All Materials'}
                </button>
              </div>

              {cachedResources.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {cachedResources.map((res) => (
                    <div 
                      key={res.id} 
                      className="p-4 bg-black/60 rounded-xl border border-cyan-900/50 shadow-sm space-y-3 hover:border-cyan-500/50 transition-all flex flex-col justify-between"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-cyan-300 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800 uppercase">
                            {res.subjectName} • {res.form}
                          </span>
                          <span className="text-emerald-400 font-bold flex items-center gap-1 text-[11px]">
                            <CheckCircle2 className="w-3.5 h-3.5" /> CACHED OFFLINE
                          </span>
                        </div>

                        <h5 className="font-bold text-white text-sm uppercase tracking-wider line-clamp-1">{res.title}</h5>
                        <p className="text-xs text-cyan-300/80 font-sans line-clamp-2">{res.description}</p>
                      </div>

                      <div className="pt-2 border-t border-cyan-900/40 flex items-center justify-between gap-2 text-xs">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              onSelectResource(res);
                              onClose();
                            }}
                            className="px-3 py-1.5 bg-cyan-950 border border-cyan-500/40 hover:bg-cyan-900 text-cyan-200 rounded-lg font-bold flex items-center gap-1.5 uppercase tracking-wider transition-colors"
                          >
                            <BookOpen className="w-3.5 h-3.5 text-cyan-400" /> Read Offline
                          </button>

                          <button
                            onClick={() => exportResourceToTxt(res)}
                            className="px-2.5 py-1.5 bg-black/60 border border-cyan-900/50 hover:bg-cyan-950/60 text-cyan-300 rounded-lg font-bold flex items-center gap-1 uppercase tracking-wider text-[11px] transition-colors"
                            title="Export Summary to Local .TXT File"
                          >
                            <Download className="w-3.5 h-3.5 text-cyan-400" /> .TXT
                          </button>
                        </div>

                        <button
                          onClick={() => handleRemoveCachedResource(res.id)}
                          className="p-1.5 text-rose-400 hover:text-white rounded hover:bg-rose-950/60 transition-colors"
                          title="Remove from Offline Cache"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-cyan-400/80 space-y-2 bg-black/40 rounded-xl border border-cyan-900/40">
                  <BookOpen className="w-12 h-12 mx-auto text-cyan-600" />
                  <p className="font-bold text-white">No cached resources in IndexedDB yet.</p>
                  <p className="text-xs text-cyan-300/70 font-sans max-w-sm mx-auto">
                    Click "Pre-cache All Materials" or save any study note / past paper while browsing to make it available offline.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: SAVED NOTES */}
          {activeTab === 'NOTES' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between bg-black/60 p-4 rounded-xl border border-cyan-900/50">
                <div>
                  <h4 className="text-sm font-bold text-white uppercase tracking-wider">Student Offline Notes Vault</h4>
                  <p className="text-xs text-cyan-300/80 font-sans">
                    Write personal study notes offline. Drafts are automatically stored in IndexedDB and queued for auto-sync.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {savedNotes.length > 0 && (
                    <button
                      onClick={() => exportAllNotesToTxt(savedNotes)}
                      className="px-3 py-2 bg-black/80 border border-cyan-500/50 text-cyan-300 font-bold text-xs rounded-xl flex items-center gap-1.5 hover:bg-cyan-950/80 transition-all uppercase tracking-wider"
                      title="Export All Saved Notes to single Compilation TXT File"
                    >
                      <Download className="w-4 h-4 text-cyan-400" /> Export All (.TXT)
                    </button>
                  )}

                  <button
                    onClick={() => setShowNoteForm(!showNoteForm)}
                    className="px-4 py-2 bg-cyan-400 text-black font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-[0_0_10px_#22d3ee] uppercase tracking-wider hover:bg-cyan-300 transition-all"
                  >
                    <Plus className="w-4 h-4" /> {showNoteForm ? 'Cancel Note' : 'New Note'}
                  </button>
                </div>
              </div>

              {/* Form to create new note */}
              {showNoteForm && (
                <form onSubmit={handleCreateNote} className="p-5 bg-black/80 rounded-xl border border-cyan-500/50 space-y-4 shadow-[0_0_15px_rgba(6,182,212,0.15)]">
                  <h5 className="text-xs font-bold text-cyan-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Plus className="w-4 h-4 text-cyan-400" /> Create Offline Study Note
                  </h5>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-2">
                      <label className="block text-[11px] text-cyan-400 font-bold uppercase mb-1">Title</label>
                      <input 
                        type="text" 
                        value={noteTitle}
                        onChange={(e) => setNoteTitle(e.target.value)}
                        placeholder="e.g. Organic Chemistry NECTA Formulae"
                        required
                        className="w-full px-3 py-2 bg-black/60 border border-cyan-900/50 rounded-lg text-xs text-white placeholder:text-cyan-700 focus:outline-none focus:border-cyan-400 font-sans"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] text-cyan-400 font-bold uppercase mb-1">Subject</label>
                      <select
                        value={noteSubject}
                        onChange={(e) => setNoteSubject(e.target.value)}
                        className="w-full px-3 py-2 bg-black/60 border border-cyan-900/50 rounded-lg text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"
                      >
                        <option value="Chemistry">Chemistry</option>
                        <option value="Biology">Biology</option>
                        <option value="Physics">Physics</option>
                        <option value="Mathematics">Mathematics</option>
                        <option value="Geography">Geography</option>
                        <option value="Civics">Civics</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] text-cyan-400 font-bold uppercase mb-1">Note Content & Key Concepts</label>
                    <textarea 
                      value={noteContent}
                      onChange={(e) => setNoteContent(e.target.value)}
                      placeholder="Write your equations, summary notes, or practical steps here..."
                      rows={4}
                      required
                      className="w-full p-3 bg-black/60 border border-cyan-900/50 rounded-lg text-xs text-white placeholder:text-cyan-700 focus:outline-none focus:border-cyan-400 font-sans"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-cyan-400 text-black font-bold text-xs uppercase tracking-wider rounded-lg shadow-[0_0_10px_#22d3ee] hover:bg-cyan-300 transition-all"
                  >
                    Save Note to IndexedDB
                  </button>
                </form>
              )}

              {/* Notes List */}
              <div className="space-y-3">
                {savedNotes.map((note) => (
                  <div key={note.id} className="p-4 bg-black/60 rounded-xl border border-cyan-900/50 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-cyan-300 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800 uppercase">
                          {note.subjectName} • {note.form}
                        </span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase border ${
                          note.syncStatus === 'synced' ? 'bg-emerald-950 border-emerald-500/50 text-emerald-300' : 'bg-amber-950 border-amber-500/50 text-amber-300'
                        }`}>
                          {note.syncStatus === 'synced' ? 'SYNCED TO VAULT' : 'OFFLINE DRAFT'}
                        </span>
                      </div>

                      <span className="text-[11px] text-cyan-400/70">{note.dateCreated}</span>
                    </div>

                    <h5 className="font-bold text-white text-sm uppercase tracking-wider">{note.title}</h5>
                    <p className="text-xs text-cyan-100 font-sans whitespace-pre-line leading-relaxed bg-black/40 p-3 rounded-lg border border-cyan-900/30">
                      {note.content}
                    </p>

                    <div className="pt-2 flex items-center justify-between text-xs">
                      <div className="flex gap-1.5 flex-wrap">
                        {note.tags?.map((t, idx) => (
                          <span key={idx} className="text-[10px] bg-cyan-950 text-cyan-300 px-2 py-0.5 rounded border border-cyan-900/50">
                            #{t}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => exportSingleNoteToTxt(note)}
                          className="px-2.5 py-1 bg-black/60 border border-cyan-900/50 hover:bg-cyan-950/60 text-cyan-300 rounded font-bold flex items-center gap-1 uppercase tracking-wider text-[10px] transition-colors"
                          title="Export Note to Local .TXT File"
                        >
                          <Download className="w-3.5 h-3.5 text-cyan-400" /> Export .TXT
                        </button>

                        <button
                          onClick={() => handleDeleteNote(note.id)}
                          className="p-1 text-rose-400 hover:text-white rounded hover:bg-rose-950/60 transition-colors"
                          title="Delete Note"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: STORAGE STATS & SYNC */}
          {activeTab === 'STATS' && (
            <div className="space-y-6">
              
              {/* Storage Overview Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 bg-black/60 rounded-xl border border-cyan-900/50 space-y-1">
                  <span className="text-xs text-cyan-400 uppercase font-bold">Cached Resources</span>
                  <div className="text-2xl font-black text-white">{storageStats.resourceCount}</div>
                  <span className="text-[11px] text-cyan-300/70">Stored in IndexedDB</span>
                </div>

                <div className="p-4 bg-black/60 rounded-xl border border-cyan-900/50 space-y-1">
                  <span className="text-xs text-cyan-400 uppercase font-bold">Saved Study Notes</span>
                  <div className="text-2xl font-black text-white">{storageStats.notesCount}</div>
                  <span className="text-[11px] text-cyan-300/70">Personal Student Drafts</span>
                </div>

                <div className="p-4 bg-black/60 rounded-xl border border-cyan-900/50 space-y-1">
                  <span className="text-xs text-cyan-400 uppercase font-bold">IndexedDB Usage</span>
                  <div className="text-2xl font-black text-cyan-300">{formattedSize} MB</div>
                  <span className="text-[11px] text-cyan-300/70">Total Encrypted Local Data</span>
                </div>
              </div>

              {/* Sync Controls */}
              <div className="bg-black/80 p-5 rounded-xl border border-cyan-900/50 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                      <Zap className="w-4 h-4 text-cyan-400" /> Offline Action Sync Queue
                    </h4>
                    <p className="text-xs text-cyan-300/80 font-sans">
                      {storageStats.queuedActionsCount} pending offline action(s) queued for synchronization.
                    </p>
                  </div>

                  <button
                    onClick={handleSyncQueue}
                    disabled={syncing || !isOnline}
                    className="px-4 py-2 bg-cyan-400 disabled:opacity-40 text-black font-bold text-xs rounded-xl flex items-center gap-2 shadow-[0_0_10px_#22d3ee] uppercase tracking-wider hover:bg-cyan-300 transition-all"
                  >
                    <RefreshCw className={`w-4 h-4 ${syncing ? 'animate-spin' : ''}`} />
                    {syncing ? 'Syncing...' : 'Sync Now'}
                  </button>
                </div>

                {!isOnline && (
                  <div className="p-3 bg-amber-950/60 border border-amber-500/50 rounded-lg text-xs text-amber-200 flex items-center gap-2 font-sans">
                    <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0" />
                    <span>You are currently offline. Queue will auto-flush once internet connectivity is restored.</span>
                  </div>
                )}
              </div>

              {/* Service Worker Info Box */}
              <div className="p-5 bg-cyan-950/40 rounded-xl border border-cyan-800/50 space-y-2 text-xs">
                <h5 className="font-bold text-cyan-300 uppercase tracking-wider flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400" /> PWA Service Worker Status
                </h5>
                <ul className="list-disc list-inside space-y-1 text-cyan-200/90 font-sans">
                  <li><strong>Strategy:</strong> Stale-While-Revalidate with IndexedDB synthetic fallbacks.</li>
                  <li><strong>Scope:</strong> Full secondary education notes, past papers, and practical guides.</li>
                  <li><strong>Storage engine:</strong> High-performance async IndexedDB key-value stores.</li>
                </ul>
              </div>

            </div>
          )}

        </div>

        {/* Footer */}
        <div className="bg-black/80 p-4 border-t border-cyan-900/50 flex items-center justify-between text-xs text-cyan-400/80">
          <span>KDLH Offline Engine • Kizimba Secondary School</span>
          <button 
            onClick={onClose}
            className="px-4 py-1.5 bg-cyan-950 hover:bg-cyan-900 text-cyan-200 border border-cyan-800 rounded font-semibold transition-colors uppercase tracking-wider"
          >
            Close Vault
          </button>
        </div>

      </div>
    </div>
  );
};
