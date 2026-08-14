import React, { useState, useMemo } from 'react';
import { 
  Headphones, Play, Search, Music, BookOpen, 
  Volume2, Mic, Plus
} from 'lucide-react';
import { AudioResource, MusicResource, KDLHResource, AudioHubCategory, Subject, UserProfile } from '../types';
import { AudioSynthService } from '../services/audioSynthesis';
import { AddContentModal } from '../components/common/AddContentModal';
import { ModuleVisualBanner } from '../components/common/ModuleVisualBanner';

interface AudioViewProps {
  resources: KDLHResource[];
  subjects?: Subject[];
  currentUser?: UserProfile;
  onSelectResource: (resource: KDLHResource) => void;
  onPlayAudioGlobal?: (id: string, title: string, artist: string, url: string) => void;
  onRefreshResources?: () => void;
}

export const AudioView: React.FC<AudioViewProps> = ({ 
  resources, 
  subjects = [],
  currentUser,
  onSelectResource,
  onPlayAudioGlobal,
  onRefreshResources
}) => {
  const [activeTab, setActiveTab] = useState<AudioHubCategory>('EDUCATIONAL');
  const [selectedForm, setSelectedForm] = useState<string>('ALL');
  const [selectedSubject, setSelectedSubject] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [addModalOpen, setAddModalOpen] = useState<boolean>(false);

  // Synth Text Input for "Listen to Notes & Questions"
  const [sampleNoteText, setSampleNoteText] = useState<string>(
    'Organic Chemistry - Alcohols: Alcohols are organic compounds containing the hydroxyl (-OH) functional group. Primary alcohols oxidise to aldehydes and carboxylic acids upon heating with acidified potassium dichromate.'
  );

  // Extract all audio resources
  const allAudios = useMemo(() => {
    return resources.filter(r => r.category === 'AUDIO' && (r as any).published !== false) as AudioResource[];
  }, [resources]);

  const allMusic = useMemo(() => {
    return resources.filter(r => r.category === 'MUSIC' && (r as any).published !== false) as MusicResource[];
  }, [resources]);

  // Educational vs Refreshment lists
  const educationalAudios = useMemo(() => {
    return allAudios.filter(a => a.hubCategory !== 'REFRESHMENT');
  }, [allAudios]);

  const refreshmentAudios = useMemo(() => {
    const fromAudio = allAudios.filter(a => a.hubCategory === 'REFRESHMENT');
    return [...fromAudio, ...allMusic];
  }, [allAudios, allMusic]);

  const formsList = ['Form I', 'Form II', 'Form III', 'Form IV', 'Form V', 'Form VI'];
  const subjectsList = ['Chemistry', 'Physics', 'Biology', 'Mathematics', 'Computer Science', 'Geography', 'History', 'Civics', 'English Language', 'Kiswahili', 'General Studies / Motivation'];

  // Current active list
  const currentList = activeTab === 'EDUCATIONAL' ? educationalAudios : refreshmentAudios;

  const filteredItems = useMemo(() => {
    return currentList.filter(item => {
      // Form filter
      if (selectedForm !== 'ALL' && item.form !== selectedForm) return false;

      // Subject filter
      if (selectedSubject !== 'ALL' && item.subjectName.toLowerCase() !== selectedSubject.toLowerCase()) return false;

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = item.title.toLowerCase().includes(q);
        const matchDesc = item.description?.toLowerCase().includes(q);
        const matchTopic = item.topic?.toLowerCase().includes(q);
        const matchSpeaker = ((item as any).speaker || (item as any).author || '').toLowerCase().includes(q);
        if (!matchTitle && !matchDesc && !matchTopic && !matchSpeaker) return false;
      }

      return true;
    });
  }, [currentList, selectedForm, selectedSubject, searchQuery]);

  const handleSpeakText = () => {
    if (!sampleNoteText.trim()) return;
    AudioSynthService.speakText(sampleNoteText, 'KDLH Audio Reader Lesson');
  };

  const handleStopSynth = () => {
    AudioSynthService.stop();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-8 font-serif">
      
      {/* Module Visual Rotating Header Banner */}
      <ModuleVisualBanner
        moduleKey="AUDIO"
        actionButton={
          <button
            onClick={() => setAddModalOpen(true)}
            className="px-5 py-3 rounded-2xl bg-gradient-to-r from-blue-700 to-indigo-700 hover:from-blue-600 hover:to-indigo-600 text-white font-bold text-xs uppercase tracking-wider shadow-xl flex items-center gap-2 whitespace-nowrap border border-amber-400/50 transition-transform transform hover:scale-105 font-mono"
          >
            <Plus className="w-4 h-4 text-amber-300" />
            <span>Upload Audio Track</span>
          </button>
        }
      />

      {/* TWO MAIN SECTION SWITCHER BUTTONS */}
      <div className="flex flex-wrap items-center gap-3">
        <button
          onClick={() => setActiveTab('EDUCATIONAL')}
          className={`px-5 py-3 rounded-2xl font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 border shadow-xl font-mono ${
            activeTab === 'EDUCATIONAL'
              ? 'bg-blue-600 text-white border-amber-400 shadow-md scale-105'
              : 'bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-800'
          }`}
        >
          <BookOpen className="w-4 h-4 text-amber-300" />
          <span>📚 Educational Audio ({educationalAudios.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('REFRESHMENT')}
          className={`px-5 py-3 rounded-2xl font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 border shadow-xl font-mono ${
            activeTab === 'REFRESHMENT'
              ? 'bg-gradient-to-r from-purple-700 to-indigo-800 text-white border-amber-400 shadow-md scale-105'
              : 'bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-800'
          }`}
        >
          <Music className="w-4 h-4 text-pink-400" />
          <span>🎧 Refreshment & Motivation ({refreshmentAudios.length})</span>
        </button>
      </div>

      {/* LISTEN TO NOTES & QUESTIONS TOOL (SPEECH SYNTHESIZER DEMO) */}
      <div className="bg-slate-900/90 p-6 rounded-3xl border border-blue-900/60 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-blue-950 border border-blue-700 text-amber-300 rounded-xl">
              <Mic className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-white uppercase tracking-wider">
                Interactive Audio Reader (Text-To-Speech Studio)
              </h3>
              <p className="text-xs text-slate-300 font-sans">
                Listen to any Note, Question, or Practical procedure read aloud in real-time.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleSpeakText}
              className="px-4 py-2 bg-gradient-to-r from-blue-700 to-indigo-700 hover:from-blue-600 hover:to-indigo-600 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg flex items-center gap-2 font-mono border border-amber-400/40"
            >
              <Volume2 className="w-4 h-4 text-amber-300" /> Listen To Note
            </button>
            <button
              onClick={handleStopSynth}
              className="px-3 py-2 bg-slate-950 hover:bg-red-950 text-red-400 border border-red-800/60 font-bold text-xs rounded-xl font-mono"
            >
              Stop
            </button>
          </div>
        </div>

        <textarea
          rows={2}
          value={sampleNoteText}
          onChange={(e) => setSampleNoteText(e.target.value)}
          className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-amber-400 font-sans"
        />
      </div>

      {/* SEARCH AND FILTERS */}
      <div className="bg-slate-900/90 p-5 rounded-3xl border border-blue-900/60 shadow-xl space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
          
          {/* Search bar */}
          <div className="md:col-span-2 relative">
            <Search className="w-4 h-4 text-amber-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search audio title, topic, speaker, artist..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 bg-slate-950 border border-slate-800 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 font-sans"
            />
          </div>

          {/* Form Filter */}
          <div>
            <select
              value={selectedForm}
              onChange={(e) => setSelectedForm(e.target.value)}
              className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-2xl text-slate-200 focus:outline-none focus:border-amber-400 font-mono"
            >
              <option value="ALL">All Forms (I - VI)</option>
              {formsList.map(f => <option key={f} value={f}>{f}</option>)}
            </select>
          </div>

          {/* Subject Filter */}
          <div>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-2xl text-slate-200 focus:outline-none focus:border-amber-400 font-mono"
            >
              <option value="ALL">All Subjects</option>
              {subjectsList.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

        </div>
      </div>

      {/* AUDIO LISTING GRID */}
      {filteredItems.length === 0 ? (
        <div className="bg-slate-900/80 border border-blue-900/40 rounded-3xl p-12 text-center space-y-4">
          <Headphones className="w-12 h-12 text-blue-400 mx-auto" />
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-white">No Audio Records Found</h3>
            <p className="text-xs text-slate-300 max-w-md mx-auto font-sans">
              No audio files match your selected category or filter. You can upload an audio track or educational audio lesson using the button below.
            </p>
          </div>
          <button
            onClick={() => setAddModalOpen(true)}
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold uppercase tracking-wider inline-flex items-center gap-2 shadow-lg font-mono"
          >
            <Plus className="w-4 h-4" /> Upload Audio Track
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map(item => {
            const audioItem = item as AudioResource;
            const musicItem = item as MusicResource;

            const title = item.title;
            const speakerArtist = (audioItem.speaker || musicItem.artist || item.author || 'KDLH Audio');
            const audioUrl = audioItem.audioUrl || musicItem.audioUrl || '';

            return (
              <div
                key={item.id}
                className="bg-slate-900/90 rounded-3xl border border-blue-900/60 hover:border-amber-400/80 p-5 sm:p-6 space-y-4 shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="p-3 rounded-2xl bg-blue-950 border border-blue-800 text-amber-300">
                      {activeTab === 'REFRESHMENT' ? <Music className="w-6 h-6" /> : <Headphones className="w-6 h-6" />}
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded bg-blue-950 text-amber-300 border border-blue-800 font-mono">
                        {item.form}
                      </span>
                      <span className="block text-[10px] text-amber-400 font-bold uppercase mt-1 font-mono">
                        {item.subjectName}
                      </span>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-bold text-white text-base line-clamp-2">
                      {title}
                    </h3>
                    <p className="text-xs text-slate-300 font-sans line-clamp-2 mt-1">
                      {item.description}
                    </p>
                  </div>

                  <div className="text-[11px] text-blue-300 font-mono flex items-center justify-between pt-1">
                    <span>Speaker/Artist: {speakerArtist}</span>
                    <span>{Math.floor((item.durationSeconds || 600) / 60)} mins</span>
                  </div>
                </div>

                {/* PLAY CONTROL */}
                <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
                  <button
                    onClick={() => {
                      if (onPlayAudioGlobal && audioUrl) {
                        onPlayAudioGlobal(item.id, title, speakerArtist, audioUrl);
                      } else {
                        onSelectResource(item);
                      }
                    }}
                    className="flex-1 py-2.5 px-4 rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg bg-gradient-to-r from-blue-700 to-indigo-700 hover:from-blue-600 hover:to-indigo-600 text-white font-mono border border-amber-400/40"
                  >
                    <Play className="w-4 h-4 fill-current text-amber-300" />
                    <span>Play Audio</span>
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* Upload Modal */}
      <AddContentModal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        defaultCategory="AUDIO"
        subjects={subjects}
        onContentAdded={() => onRefreshResources && onRefreshResources()}
        uploaderName={currentUser?.name || 'KDLH Audio Presenter'}
      />

    </div>
  );
};
