import React, { useState, useRef, useEffect } from 'react';
import { 
  X, Video, Headphones, Music, 
  ExternalLink, Info, AlertTriangle, RefreshCw, FileText, 
  HelpCircle, FlaskConical, ChevronRight, ShieldCheck 
} from 'lucide-react';
import { KDLHResource, VideoResource, AudioResource, MusicResource } from '../../types';

interface MediaPlayerModalProps {
  isOpen?: boolean;
  resource: KDLHResource | null;
  allResources?: KDLHResource[];
  onClose: () => void;
  onNavigateResource?: (resource: KDLHResource) => void;
  onPlayAudioGlobal?: (id: string, title: string, artist: string, url: string) => void;
}

export const MediaPlayerModal: React.FC<MediaPlayerModalProps> = ({
  isOpen = true,
  resource,
  allResources = [],
  onClose,
  onNavigateResource,
  onPlayAudioGlobal
}) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const [hasError, setHasError] = useState(false);
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'NOTES' | 'QUESTIONS' | 'PRACTICALS'>('OVERVIEW');

  useEffect(() => {
    setHasError(false);
    setIsPlaying(true);
  }, [resource?.id]);

  if (!isOpen || !resource) return null;

  const isVideo = resource.category === 'VIDEO' || resource.category === 'TUTORIAL';
  const isAudio = resource.category === 'AUDIO';
  const isMusic = resource.category === 'MUSIC';

  const videoRes = isVideo ? (resource as VideoResource) : null;
  const audioRes = isAudio ? (resource as AudioResource) : null;
  const musicRes = isMusic ? (resource as MusicResource) : null;

  // Strict Media Source Validation for exact record ID
  const rawUrl = videoRes?.videoUrl || audioRes?.audioUrl || musicRes?.audioUrl;
  const mediaUrl = rawUrl?.trim();
  const isUrlValid = Boolean(
    mediaUrl && 
    mediaUrl.length > 5 && 
    (mediaUrl.startsWith('http://') || mediaUrl.startsWith('https://'))
  );

  // Related Content Lookup
  const relatedNotes = allResources.filter(r => r.category === 'NOTE' && (r.subjectName === resource.subjectName || r.topic === resource.topic)).slice(0, 3);
  const relatedQuestions = allResources.filter(r => r.category === 'QUESTION' && (r.subjectName === resource.subjectName || r.topic === resource.topic)).slice(0, 3);
  const relatedPracticals = allResources.filter(r => r.category === 'PRACTICAL' && (r.subjectName === resource.subjectName || r.topic === resource.topic)).slice(0, 3);

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-slate-900 text-white rounded-2xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl border border-slate-800 overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="px-6 py-4 flex items-center justify-between border-b border-slate-800 bg-slate-950">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-slate-900 text-teal-400 rounded-lg border border-slate-800">
              {isVideo && <Video className="w-5 h-5 text-rose-400" />}
              {isAudio && <Headphones className="w-5 h-5 text-teal-400" />}
              {isMusic && <Music className="w-5 h-5 text-pink-400" />}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider">
                  {resource.category} • {resource.subjectName} ({resource.form})
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded font-mono font-bold uppercase bg-slate-800 text-teal-300 border border-slate-700">
                  Record ID: {resource.id}
                </span>
                <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
                  resource.permissionStatus === 'AUTHORIZED' || resource.permissionStatus === 'SCHOOL_OWNED' 
                    ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                    : 'bg-slate-800 text-slate-300'
                }`}>
                  {resource.permissionStatus}
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-white line-clamp-1 mt-0.5">
                {resource.title}
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 bg-slate-800 hover:bg-rose-900 text-slate-300 hover:text-white rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Media Player Container */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          
          {/* VIDEO PLAYER */}
          {isVideo && videoRes && (
            <div className="space-y-4">
              <div className="aspect-video bg-black rounded-xl overflow-hidden border border-slate-800 relative flex items-center justify-center group shadow-2xl">
                {!isUrlValid || hasError ? (
                  <div className="text-center p-8 space-y-3 max-w-md bg-slate-950/90 border border-slate-800 rounded-2xl">
                    <AlertTriangle className="w-12 h-12 text-amber-400 mx-auto" />
                    <div className="space-y-1">
                      <h4 className="font-bold text-base text-white">Video Stream Unavailable</h4>
                      <p className="text-xs text-teal-400 font-mono">Database Record ID: [{resource.id}]</p>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      The video media URL for record <strong>"{resource.title}"</strong> is currently not configured or failed to load. KDLH strictly prohibits playing unrelated or placeholder video streams.
                    </p>
                    <button
                      onClick={() => setHasError(false)}
                      className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-xl font-bold text-xs inline-flex items-center gap-2 shadow-md transition-all"
                    >
                      <RefreshCw className="w-4 h-4" /> Retry Stream Reload
                    </button>
                  </div>
                ) : (
                  <iframe
                    src={mediaUrl}
                    title={videoRes.title}
                    className="w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    onError={() => setHasError(true)}
                  />
                )}
              </div>

              {/* Player Controls Bar */}
              <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700/60 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-300">
                <div className="flex items-center gap-4">
                  <span><strong>Teacher / Author:</strong> {videoRes.author}</span>
                  <span><strong>Difficulty:</strong> {videoRes.difficulty || 'All Levels'}</span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-slate-400 font-semibold">Playback Speed:</span>
                  {[0.75, 1.0, 1.25, 1.5, 2.0].map(speed => (
                    <button
                      key={speed}
                      onClick={() => setPlaybackSpeed(speed)}
                      className={`px-2 py-0.5 rounded font-bold transition-colors ${
                        playbackSpeed === speed ? 'bg-teal-600 text-white shadow-sm' : 'bg-slate-700 hover:bg-slate-600 text-slate-300'
                      }`}
                    >
                      {speed}x
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* AUDIO & MUSIC PLAYER */}
          {(isAudio || isMusic) && (
            <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-teal-950/40 p-8 rounded-2xl border border-slate-800 text-center space-y-6 shadow-xl">
              <div className="w-24 h-24 mx-auto rounded-full bg-slate-900 border-2 border-teal-500/40 flex items-center justify-center text-teal-400 shadow-inner">
                {isAudio ? <Headphones className="w-10 h-10 text-teal-400" /> : <Music className="w-10 h-10 text-pink-400" />}
              </div>

              <div>
                <div className="inline-block px-3 py-1 rounded-full bg-slate-950 border border-slate-800 text-[11px] font-mono text-teal-400 mb-2">
                  VERIFIED RECORD ID: {resource.id}
                </div>
                <h3 className="text-xl font-bold text-white mb-1">{resource.title}</h3>
                <p className="text-sm text-slate-400">{resource.author} • {resource.subjectName}</p>
              </div>

              {/* Audio Player Controls */}
              {!isUrlValid || hasError ? (
                <div className="bg-slate-950 p-6 rounded-2xl border border-rose-900/40 max-w-md mx-auto space-y-3">
                  <AlertTriangle className="w-8 h-8 text-rose-400 mx-auto" />
                  <h4 className="font-bold text-sm text-white">Audio Stream Error</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Media URL for database record <strong>[{resource.id}]</strong> is unavailable or unverified. Unrelated or placeholder audio will never be substituted.
                  </p>
                  <button
                    onClick={() => setHasError(false)}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-bold rounded-xl text-teal-300 border border-teal-500/40 inline-flex items-center gap-1.5 transition"
                  >
                    <RefreshCw className="w-3.5 h-3.5" /> Retry Audio Connection
                  </button>
                </div>
              ) : (
                <div className="max-w-md mx-auto space-y-3">
                  <audio 
                    controls 
                    autoPlay 
                    src={mediaUrl} 
                    className="w-full accent-teal-400" 
                    onError={() => setHasError(true)}
                  />

                  <div className="flex items-center justify-between text-xs text-slate-400 pt-2">
                    <span>Rights Status: <strong className="text-emerald-400">{resource.permissionStatus}</strong></span>
                    {onPlayAudioGlobal && (
                      <button 
                        onClick={() => onPlayAudioGlobal(resource.id, resource.title, resource.author, mediaUrl || '')}
                        className="text-teal-400 hover:text-teal-300 font-bold flex items-center gap-1 transition"
                      >
                        Dock in Bottom Bar <ExternalLink className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Music Rights Workflow Details */}
              {isMusic && musicRes && (
                <div className="mt-6 p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-left text-xs text-slate-300 space-y-2 max-w-lg mx-auto">
                  <div className="flex items-center gap-1.5 font-bold text-amber-400 border-b border-slate-800 pb-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" /> Authorized Rights & Licensing Metadata
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-[11px] font-mono text-slate-400">
                    <div><strong>Artist:</strong> {musicRes.rightsRecord.artist}</div>
                    <div><strong>Rights Owner:</strong> {musicRes.rightsRecord.rightsOwner}</div>
                    <div><strong>Publisher:</strong> {musicRes.rightsRecord.publisher}</div>
                    <div><strong>License Type:</strong> {musicRes.rightsRecord.licenseType}</div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TABBED INFORMATION & RELATED RESOURCES */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-2 overflow-x-auto">
              {[
                { id: 'OVERVIEW', label: 'Overview & Details', icon: <Info className="w-3.5 h-3.5" /> },
                { id: 'NOTES', label: `Related Notes (${relatedNotes.length})`, icon: <FileText className="w-3.5 h-3.5" /> },
                { id: 'QUESTIONS', label: `Questions (${relatedQuestions.length})`, icon: <HelpCircle className="w-3.5 h-3.5" /> },
                { id: 'PRACTICALS', label: `Practicals (${relatedPracticals.length})`, icon: <FlaskConical className="w-3.5 h-3.5" /> }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                    activeTab === tab.id 
                      ? 'bg-teal-600 text-white shadow-sm' 
                      : 'bg-slate-800/60 hover:bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>

            {/* TAB CONTENT */}
            {activeTab === 'OVERVIEW' && (
              <div className="bg-slate-800/40 p-5 rounded-xl border border-slate-800 text-sm leading-relaxed text-slate-300 space-y-2">
                <h4 className="font-bold text-white text-xs uppercase tracking-wider text-teal-400 flex items-center gap-1">
                  <Info className="w-3.5 h-3.5" /> Pedagogical Overview
                </h4>
                <p>{resource.description}</p>
                <div className="pt-3 border-t border-slate-800 flex flex-wrap items-center gap-4 text-xs text-slate-400 font-mono">
                  <span><strong>Record ID:</strong> {resource.id}</span>
                  <span><strong>Subject:</strong> {resource.subjectName}</span>
                  <span><strong>Form:</strong> {resource.form}</span>
                  <span><strong>Topic:</strong> {resource.topic}</span>
                  <span><strong>Date Added:</strong> {resource.dateAdded}</span>
                </div>
              </div>
            )}

            {activeTab === 'NOTES' && (
              <div className="space-y-2">
                {relatedNotes.length === 0 ? (
                  <p className="text-xs text-slate-500 py-4">No related notes found for this subject topic.</p>
                ) : (
                  relatedNotes.map(n => (
                    <div
                      key={n.id}
                      onClick={() => onNavigateResource && onNavigateResource(n)}
                      className="p-3 bg-slate-800/60 hover:bg-slate-800 rounded-xl border border-slate-700/50 flex items-center justify-between cursor-pointer transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <FileText className="w-4 h-4 text-cyan-400" />
                        <div>
                          <h5 className="font-bold text-xs text-white">{n.title}</h5>
                          <span className="text-[10px] text-slate-400">{n.subjectName} • {n.form}</span>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-400" />
                    </div>
                  ))
                )}
              </div>
            )}

            {activeTab === 'QUESTIONS' && (
              <div className="space-y-2">
                {relatedQuestions.length === 0 ? (
                  <p className="text-xs text-slate-500 py-4">No related questions found for this subject topic.</p>
                ) : (
                  relatedQuestions.map(q => (
                    <div
                      key={q.id}
                      onClick={() => onNavigateResource && onNavigateResource(q)}
                      className="p-3 bg-slate-800/60 hover:bg-slate-800 rounded-xl border border-slate-700/50 flex items-center justify-between cursor-pointer transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <HelpCircle className="w-4 h-4 text-purple-400" />
                        <div>
                          <h5 className="font-bold text-xs text-white">{q.title}</h5>
                          <span className="text-[10px] text-slate-400">{q.subjectName} • {q.form}</span>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-400" />
                    </div>
                  ))
                )}
              </div>
            )}

            {activeTab === 'PRACTICALS' && (
              <div className="space-y-2">
                {relatedPracticals.length === 0 ? (
                  <p className="text-xs text-slate-500 py-4">No related practical guides found for this subject topic.</p>
                ) : (
                  relatedPracticals.map(p => (
                    <div
                      key={p.id}
                      onClick={() => onNavigateResource && onNavigateResource(p)}
                      className="p-3 bg-slate-800/60 hover:bg-slate-800 rounded-xl border border-slate-700/50 flex items-center justify-between cursor-pointer transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <FlaskConical className="w-4 h-4 text-emerald-400" />
                        <div>
                          <h5 className="font-bold text-xs text-white">{p.title}</h5>
                          <span className="text-[10px] text-slate-400">{p.subjectName} • {p.form}</span>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-400" />
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-500 font-mono">
          <span>Kizimba Digital Learning Hub (KDLH) Verified Media Engine</span>
          <button 
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg font-semibold transition-colors font-sans"
          >
            Close Player
          </button>
        </div>

      </div>
    </div>
  );
};
