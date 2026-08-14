import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, Pause, Volume2, VolumeX, FastForward, Rewind, 
  RotateCcw, Repeat, Shuffle, Headphones, Music, X, ChevronUp, ChevronDown, Sparkles
} from 'lucide-react';
import { AudioResource, MusicResource } from '../../types';
import { AudioSynthService } from '../../services/audioSynthesis';

interface AudioPlayerBarProps {
  currentTrack: AudioResource | MusicResource | null;
  onClose: () => void;
  onNext?: () => void;
  onPrev?: () => void;
}

export const AudioPlayerBar: React.FC<AudioPlayerBarProps> = ({
  currentTrack,
  onClose,
  onNext,
  onPrev
}) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.85);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1.0);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isSpeakingSynth, setIsSpeakingSynth] = useState(false);
  const [synthText, setSynthText] = useState('');

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Speech Synth Listener
  useEffect(() => {
    const unsubscribe = AudioSynthService.subscribe((speaking, text) => {
      setIsSpeakingSynth(speaking);
      if (text) setSynthText(text);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (currentTrack?.audioUrl && audioRef.current) {
      audioRef.current.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
    }
  }, [currentTrack?.audioUrl]);

  const togglePlay = () => {
    if (isSpeakingSynth) {
      if (isPlaying) {
        AudioSynthService.pause();
        setIsPlaying(false);
      } else {
        AudioSynthService.resume();
        setIsPlaying(true);
      }
      return;
    }

    if (!audioRef.current || !currentTrack?.audioUrl) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      setDuration(audioRef.current.duration || currentTrack?.durationSeconds || 0);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const targetTime = Number(e.target.value);
    setCurrentTime(targetTime);
    if (audioRef.current) {
      audioRef.current.currentTime = targetTime;
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setVolume(val);
    if (audioRef.current) {
      audioRef.current.volume = val;
    }
    setIsMuted(val === 0);
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const changeSpeed = () => {
    const rates = [0.75, 1.0, 1.25, 1.5, 2.0];
    const nextIdx = (rates.indexOf(playbackRate) + 1) % rates.length;
    const nextRate = rates[nextIdx];
    setPlaybackRate(nextRate);
    if (audioRef.current) {
      audioRef.current.playbackRate = nextRate;
    }
  };

  const formatTime = (secs: number) => {
    if (isNaN(secs)) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  if (!currentTrack && !isSpeakingSynth) return null;

  const isRefreshment = currentTrack && ('hubCategory' in currentTrack) && currentTrack.hubCategory === 'REFRESHMENT';

  return (
    <div className={`fixed bottom-0 left-0 right-0 z-40 transition-all duration-300 font-mono ${
      isMinimized ? 'translate-y-12' : 'translate-y-0'
    }`}>
      {currentTrack?.audioUrl && (
        <audio
          ref={audioRef}
          src={currentTrack.audioUrl}
          onTimeUpdate={handleTimeUpdate}
          onError={() => setIsPlaying(false)}
          onEnded={() => {
            setIsPlaying(false);
            if (onNext) onNext();
          }}
        />
      )}

      <div className={`mx-auto max-w-6xl px-4 py-3 rounded-t-3xl border-t border-x shadow-[0_-10px_30px_rgba(0,0,0,0.8)] backdrop-blur-2xl flex flex-col sm:flex-row items-center justify-between gap-3 text-white ${
        isRefreshment 
          ? 'bg-gradient-to-r from-purple-950/95 via-pink-950/95 to-slate-950/95 border-purple-600/50' 
          : 'bg-gradient-to-r from-cyan-950/95 via-slate-950/95 to-blue-950/95 border-cyan-500/50'
      }`}>

        {/* Minimize / Expand Toggle */}
        <button
          onClick={() => setIsMinimized(!isMinimized)}
          className="absolute -top-6 right-6 px-3 py-0.5 bg-slate-900 border border-cyan-800 rounded-t-lg text-xs font-bold text-cyan-300 flex items-center gap-1 shadow-lg hover:bg-cyan-950"
        >
          {isMinimized ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          <span>{isMinimized ? 'Player' : 'Hide'}</span>
        </button>

        {/* Track Metadata */}
        <div className="flex items-center gap-3 w-full sm:w-1/3 min-w-0">
          <div className={`p-2.5 rounded-2xl border shadow-inner ${
            isRefreshment 
              ? 'bg-pink-950 border-pink-500 text-pink-300' 
              : 'bg-cyan-950 border-cyan-500 text-cyan-300'
          }`}>
            {isSpeakingSynth ? (
              <Sparkles className="w-5 h-5 text-amber-400 animate-spin" />
            ) : isRefreshment ? (
              <Music className="w-5 h-5 animate-pulse" />
            ) : (
              <Headphones className="w-5 h-5 animate-pulse" />
            )}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5 text-[10px] uppercase font-bold tracking-widest text-cyan-300">
              <span className={`px-1.5 py-0.2 rounded border ${
                isRefreshment ? 'bg-pink-950 text-pink-300 border-pink-700' : 'bg-cyan-950 text-cyan-300 border-cyan-700'
              }`}>
                {isSpeakingSynth ? 'AI READ ALOUD' : (currentTrack as any)?.hubCategory || currentTrack?.category}
              </span>
              <span className="truncate text-amber-300">
                {isSpeakingSynth ? 'SPEECH SYNTHESIZER' : currentTrack?.subjectName}
              </span>
            </div>

            <h4 className="text-xs sm:text-sm font-bold truncate text-white mt-0.5">
              {isSpeakingSynth ? synthText : currentTrack?.title}
            </h4>
            <p className="text-[11px] text-cyan-200/70 truncate font-mono">
              {isSpeakingSynth ? 'KDLH Audio Reader' : (currentTrack as any)?.speaker || currentTrack?.author}
            </p>
          </div>
        </div>

        {/* Player Controls */}
        <div className="flex flex-col items-center justify-center w-full sm:w-1/3 gap-1">
          <div className="flex items-center gap-3">
            {onPrev && (
              <button onClick={onPrev} className="p-1.5 text-cyan-300 hover:text-white transition">
                <Rewind className="w-4 h-4" />
              </button>
            )}

            <button
              onClick={togglePlay}
              className={`p-3 rounded-2xl font-black transition shadow-lg flex items-center justify-center ${
                isRefreshment
                  ? 'bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-400 hover:to-purple-500 text-white shadow-pink-950'
                  : 'bg-gradient-to-r from-cyan-400 to-teal-500 hover:from-cyan-300 hover:to-teal-400 text-black shadow-cyan-950'
              }`}
            >
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
            </button>

            {onNext && (
              <button onClick={onNext} className="p-1.5 text-cyan-300 hover:text-white transition">
                <FastForward className="w-4 h-4" />
              </button>
            )}

            <button
              onClick={changeSpeed}
              className="px-2 py-0.5 bg-black/60 border border-cyan-800 rounded text-[10px] font-bold text-cyan-300 hover:border-cyan-400"
              title="Playback Speed"
            >
              {playbackRate}x
            </button>
          </div>

          {!isSpeakingSynth && (
            <div className="flex items-center gap-2 w-full text-[10px] text-cyan-300/80 font-mono">
              <span>{formatTime(currentTime)}</span>
              <input
                type="range"
                min={0}
                max={duration || 100}
                value={currentTime}
                onChange={handleSeek}
                className="w-full h-1 bg-cyan-950 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
              <span>{formatTime(duration)}</span>
            </div>
          )}
        </div>

        {/* Volume & Close */}
        <div className="flex items-center justify-end gap-3 w-full sm:w-1/3">
          <div className="hidden sm:flex items-center gap-2">
            <button onClick={toggleMute} className="text-cyan-300 hover:text-white">
              {isMuted || volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
            <input
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={isMuted ? 0 : volume}
              onChange={handleVolumeChange}
              className="w-20 h-1 bg-cyan-950 rounded-lg appearance-none cursor-pointer accent-cyan-400"
            />
          </div>

          <button
            onClick={() => {
              if (isSpeakingSynth) AudioSynthService.stop();
              onClose();
            }}
            className="p-1.5 bg-black/40 hover:bg-rose-950 hover:text-rose-300 text-cyan-400 rounded-xl border border-cyan-900/50 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
