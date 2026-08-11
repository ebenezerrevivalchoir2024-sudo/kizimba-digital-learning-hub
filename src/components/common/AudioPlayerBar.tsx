import React, { useState, useEffect } from 'react';
import { Headphones, X, AlertTriangle, RefreshCw } from 'lucide-react';

interface AudioPlayerBarProps {
  currentAudio: {
    id: string;
    title: string;
    artist: string;
    url: string;
  } | null;
  onClose: () => void;
}

export const AudioPlayerBar: React.FC<AudioPlayerBarProps> = ({ currentAudio, onClose }) => {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setHasError(false);
  }, [currentAudio?.id, currentAudio?.url]);

  if (!currentAudio) return null;

  const isUrlValid = Boolean(
    currentAudio.url && 
    currentAudio.url.trim().length > 5 && 
    (currentAudio.url.startsWith('http://') || currentAudio.url.startsWith('https://'))
  );

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 text-cyan-100 border-t border-slate-800 shadow-[0_-5px_20px_rgba(0,0,0,0.8)] px-4 py-3 flex flex-col sm:flex-row items-center justify-between gap-3 font-mono backdrop-blur-xl animate-in slide-in-from-bottom duration-200">
      <div className="flex items-center gap-3 w-full sm:w-auto">
        <div className="w-10 h-10 rounded-lg bg-slate-900 border border-slate-700 text-teal-400 flex items-center justify-center flex-shrink-0 shadow-sm">
          <Headphones className="w-5 h-5 text-teal-400 animate-pulse" />
        </div>
        <div className="line-clamp-1">
          <div className="flex items-center gap-2">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider line-clamp-1">{currentAudio.title}</h4>
            <span className="text-[10px] bg-slate-800 text-teal-300 px-2 py-0.5 rounded border border-slate-700 font-bold whitespace-nowrap">
              ID: {currentAudio.id}
            </span>
          </div>
          <p className="text-[11px] text-slate-400 line-clamp-1">{currentAudio.artist}</p>
        </div>
      </div>

      <div className="w-full sm:w-auto max-w-md flex items-center gap-3">
        {!isUrlValid || hasError ? (
          <div className="flex items-center gap-2 px-3 py-1.5 bg-rose-950/80 border border-rose-800/80 rounded-lg text-xs text-rose-200 w-full">
            <AlertTriangle className="w-4 h-4 text-rose-400 flex-shrink-0" />
            <span className="text-[11px] font-sans truncate">
              Media stream error for record ID [{currentAudio.id}]. Placeholder media blocked.
            </span>
            <button 
              onClick={() => setHasError(false)} 
              className="p-1 hover:bg-rose-900 rounded text-rose-300 font-bold ml-auto flex items-center gap-1 text-[10px] uppercase"
              title="Retry playback"
            >
              <RefreshCw className="w-3 h-3" /> Retry
            </button>
          </div>
        ) : (
          <audio 
            controls 
            autoPlay 
            src={currentAudio.url} 
            className="w-full h-8 accent-teal-400" 
            onError={() => setHasError(true)}
          />
        )}
      </div>

      <button 
        onClick={onClose}
        className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition"
        title="Close Player"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
