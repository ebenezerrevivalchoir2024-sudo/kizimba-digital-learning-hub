import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Search, X, FileText, BookOpen, FlaskConical, Video, HelpCircle, Headphones, Music, Briefcase, ChevronRight, Mic, MicOff } from 'lucide-react';
import { KDLHResource, ResourceCategory } from '../../types';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  resources: KDLHResource[];
  onSelectResource: (resource: KDLHResource) => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  resources,
  onSelectResource
}) => {
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ResourceCategory | 'ALL'>('ALL');
  const [selectedForm, setSelectedForm] = useState<string>('ALL');
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(true);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setSpeechSupported(false);
    }
  }, []);

  useEffect(() => {
    if (!isOpen && isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  }, [isOpen, isListening]);

  const toggleSpeechRecognition = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert('Voice search is not supported in this browser. Please try Google Chrome or Safari.');
      return;
    }

    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0])
          .map((result: any) => result.transcript)
          .join('');
        setQuery(transcript);
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      console.error('Failed to start speech recognition:', err);
      setIsListening(false);
    }
  };

  const categoriesList: { key: ResourceCategory | 'ALL'; label: string; icon: React.ReactNode }[] = [
    { key: 'ALL', label: 'All Resources', icon: <Search className="w-3.5 h-3.5" /> },
    { key: 'NOTE', label: 'Notes', icon: <FileText className="w-3.5 h-3.5 text-blue-500" /> },
    { key: 'PAST_PAPER', label: 'Past Papers', icon: <BookOpen className="w-3.5 h-3.5 text-indigo-500" /> },
    { key: 'PRACTICAL', label: 'Practicals', icon: <FlaskConical className="w-3.5 h-3.5 text-emerald-500" /> },
    { key: 'VIDEO', label: 'Videos', icon: <Video className="w-3.5 h-3.5 text-rose-500" /> },
    { key: 'TUTORIAL', label: 'Tutorials', icon: <Video className="w-3.5 h-3.5 text-rose-500" /> },
    { key: 'BOOK', label: 'Books', icon: <BookOpen className="w-3.5 h-3.5 text-amber-500" /> },
    { key: 'QUESTION', label: 'Questions', icon: <HelpCircle className="w-3.5 h-3.5 text-purple-500" /> },
    { key: 'AUDIO', label: 'Audio', icon: <Headphones className="w-3.5 h-3.5 text-teal-500" /> },
    { key: 'MUSIC', label: 'Music', icon: <Music className="w-3.5 h-3.5 text-pink-500" /> },
    { key: 'TEACHER_RESOURCE', label: 'Teacher', icon: <Briefcase className="w-3.5 h-3.5 text-slate-500" /> }
  ];

  const formsList = ['ALL', 'Form I', 'Form II', 'Form III', 'Form IV', 'Form V', 'Form VI'];

  const filtered = useMemo(() => {
    return resources.filter(r => {
      const matchesQuery = 
        !query ||
        r.title.toLowerCase().includes(query.toLowerCase()) ||
        r.subjectName.toLowerCase().includes(query.toLowerCase()) ||
        r.topic.toLowerCase().includes(query.toLowerCase()) ||
        r.description.toLowerCase().includes(query.toLowerCase()) ||
        r.tags.some(t => t.toLowerCase().includes(query.toLowerCase()));

      const matchesCategory = selectedCategory === 'ALL' || r.category === selectedCategory;
      const matchesForm = selectedForm === 'ALL' || r.form === selectedForm;

      return matchesQuery && matchesCategory && matchesForm;
    });
  }, [resources, query, selectedCategory, selectedForm]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-start justify-center pt-12 sm:pt-20 px-3 pb-6 overflow-y-auto font-mono">
      <div className="bg-black/90 rounded-2xl w-full max-w-3xl shadow-[0_0_30px_rgba(6,182,212,0.2)] border border-cyan-900/50 overflow-hidden flex flex-col max-h-[85vh] animate-in fade-in slide-in-from-top-4 duration-200 text-cyan-100">
        
        {/* Search Input Bar */}
        <div className="p-4 bg-cyan-950/80 text-white flex items-center gap-3 border-b border-cyan-900/50">
          <Search className="w-6 h-6 text-cyan-400 flex-shrink-0 animate-pulse" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={isListening ? "Listening... Speak now..." : "Search notes, past papers, organic chemistry, practicals..."}
            className="w-full bg-transparent text-white placeholder:text-cyan-600 text-base sm:text-lg focus:outline-none font-medium font-sans"
            autoFocus
          />
          
          {query && (
            <button onClick={() => setQuery('')} className="p-1 text-cyan-400 hover:text-white" title="Clear Search">
              <X className="w-5 h-5" />
            </button>
          )}

          {/* Voice Search Button */}
          <button
            type="button"
            onClick={toggleSpeechRecognition}
            className={`p-2 rounded-xl transition-all border flex items-center gap-1.5 text-xs font-bold ${
              isListening 
                ? 'bg-rose-600 border-rose-400 text-white shadow-[0_0_15px_#f43f5e] animate-pulse' 
                : 'bg-black/60 border-cyan-900/50 text-cyan-300 hover:bg-cyan-950/80 hover:text-white hover:border-cyan-500/50'
            }`}
            title={isListening ? "Listening... Click to stop" : "Voice Search (Speech to Text)"}
          >
            {isListening ? (
              <>
                <MicOff className="w-5 h-5 text-white" />
                <span className="hidden sm:inline uppercase tracking-wider text-[11px] text-white">Listening</span>
              </>
            ) : (
              <>
                <Mic className="w-5 h-5 text-cyan-400" />
                <span className="hidden sm:inline uppercase tracking-wider text-[11px] text-cyan-300">Voice</span>
              </>
            )}
          </button>

          <button onClick={onClose} className="p-2 text-cyan-300 hover:text-white rounded-lg bg-black/60 border border-cyan-900/50 text-xs font-semibold">
            Esc
          </button>
        </div>

        {/* Listening Active Indicator Banner */}
        {isListening && (
          <div className="px-4 py-2 bg-rose-950/80 border-b border-rose-800/80 text-rose-200 text-xs flex items-center justify-between font-sans animate-pulse">
            <span className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
              Microphone active — Listening for query. Speak clearly...
            </span>
            <button 
              onClick={toggleSpeechRecognition}
              className="text-white underline font-bold hover:text-rose-300 uppercase tracking-wider text-[11px]"
            >
              Done Speaking
            </button>
          </div>
        )}

        {/* Filters Row */}
        <div className="px-4 py-3 bg-black/60 border-b border-cyan-900/50 space-y-2">
          {/* Categories Pill Bar */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
            {categoriesList.map(cat => (
              <button
                key={cat.key}
                onClick={() => setSelectedCategory(cat.key)}
                className={`px-3 py-1.5 rounded-full font-semibold flex items-center gap-1.5 whitespace-nowrap transition-all border ${
                  selectedCategory === cat.key 
                    ? 'bg-cyan-400 text-black border-cyan-400 shadow-[0_0_10px_#22d3ee]' 
                    : 'bg-black/40 text-cyan-200 border-cyan-900/40 hover:bg-cyan-950/40'
                }`}
              >
                {cat.icon}
                <span>{cat.label}</span>
              </button>
            ))}
          </div>

          {/* Form Filter Bar */}
          <div className="flex items-center gap-2 text-xs text-cyan-400 pt-1">
            <span className="font-bold uppercase tracking-wider">Academic Level:</span>
            <div className="flex items-center gap-1 overflow-x-auto">
              {formsList.map(f => (
                <button
                  key={f}
                  onClick={() => setSelectedForm(f)}
                  className={`px-2.5 py-0.5 rounded text-[11px] font-bold transition-all border ${
                    selectedForm === f ? 'bg-cyan-400 text-black border-cyan-400 shadow-[0_0_8px_#22d3ee]' : 'bg-black/40 text-cyan-200 border-cyan-900/40 hover:bg-cyan-950/40'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results List */}
        <div className="p-4 overflow-y-auto flex-1 divide-y divide-cyan-900/30 space-y-1">
          {filtered.length > 0 ? (
            filtered.map(res => (
              <div
                key={res.id}
                onClick={() => {
                  onSelectResource(res);
                  onClose();
                }}
                className="p-3.5 hover:bg-cyan-950/40 rounded-xl transition-all cursor-pointer flex items-center justify-between group"
              >
                <div className="space-y-1 max-w-xl">
                  <div className="flex items-center gap-2 text-xs font-mono">
                    <span className="font-bold text-cyan-300 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800">
                      {res.subjectName}
                    </span>
                    <span className="text-cyan-400/70 font-medium">{res.form} • {res.category}</span>
                  </div>
                  <h4 className="text-sm font-bold text-white group-hover:text-cyan-400 transition-colors line-clamp-1 uppercase tracking-wider">
                    {res.title}
                  </h4>
                  <p className="text-xs text-cyan-300/70 line-clamp-1 font-sans">{res.description}</p>
                </div>

                <div className="flex items-center gap-2 text-cyan-400 group-hover:text-cyan-300">
                  <span className="text-xs font-semibold hidden sm:inline uppercase">Open</span>
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12 text-cyan-400/80 space-y-2">
              <Search className="w-12 h-12 mx-auto text-cyan-600" />
              <p className="font-bold text-white">No resources found matching your search.</p>
              <p className="text-xs text-cyan-300/70 font-sans">Try searching "Organic Chemistry", "NECTA", "Alcohols", or "Physics".</p>
            </div>
          )}
        </div>

        {/* Search Footer */}
        <div className="px-4 py-2.5 bg-black/80 border-t border-cyan-900/50 text-xs text-cyan-400/80 flex items-center justify-between">
          <span>Showing <strong className="text-cyan-300">{filtered.length}</strong> resources</span>
          <span>KDLH Universal Educational Search Engine</span>
        </div>

      </div>
    </div>
  );
};
