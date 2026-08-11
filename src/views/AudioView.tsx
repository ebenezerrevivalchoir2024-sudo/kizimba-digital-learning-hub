import React from 'react';
import { Headphones, Play, Radio, Volume2 } from 'lucide-react';
import { AudioResource, KDLHResource } from '../types';
import { ResourceCard } from '../components/common/ResourceCard';

interface AudioViewProps {
  resources: KDLHResource[];
  onSelectResource: (resource: KDLHResource) => void;
  onPlayAudioGlobal?: (title: string, artist: string, url: string) => void;
}

export const AudioView: React.FC<AudioViewProps> = ({
  resources,
  onSelectResource,
  onPlayAudioGlobal
}) => {
  const audioLessons = resources.filter(r => r.category === 'AUDIO') as AudioResource[];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-950 via-slate-900 to-emerald-950 text-white p-8 rounded-2xl shadow-xl space-y-3 border border-teal-800/40">
        <span className="text-xs font-bold text-teal-400 uppercase tracking-wider block">
          Spoken Academic Learning
        </span>
        <h1 className="text-2xl sm:text-4xl font-black">Audio Learning & Podcasts</h1>
        <p className="text-sm text-teal-200 max-w-2xl leading-relaxed">
          Listen to concise revision summaries, teacher explanations, and educational podcast episodes anywhere.
        </p>
      </div>

      {/* Audio Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {audioLessons.map(audio => (
          <ResourceCard
            key={audio.id}
            resource={audio}
            onSelect={onSelectResource}
          />
        ))}
      </div>

    </div>
  );
};
