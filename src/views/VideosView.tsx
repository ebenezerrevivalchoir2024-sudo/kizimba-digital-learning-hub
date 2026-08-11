import React, { useState, useMemo } from 'react';
import { Video, Play, Search, Clock, Sparkles } from 'lucide-react';
import { VideoResource, KDLHResource } from '../types';
import { ResourceCard } from '../components/common/ResourceCard';

interface VideosViewProps {
  resources: KDLHResource[];
  onSelectResource: (resource: KDLHResource) => void;
}

export const VideosView: React.FC<VideosViewProps> = ({ resources, onSelectResource }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  const videos = useMemo(() => {
    return resources.filter(r => r.category === 'VIDEO' || r.category === 'TUTORIAL') as VideoResource[];
  }, [resources]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-rose-950 via-slate-900 to-red-950 text-white p-8 rounded-2xl shadow-xl space-y-3 border border-rose-800/40">
        <span className="text-xs font-bold text-rose-400 uppercase tracking-wider block">
          Visual Academic Learning
        </span>
        <h1 className="text-2xl sm:text-4xl font-black">Video Learning Center</h1>
        <p className="text-sm text-rose-200 max-w-2xl leading-relaxed">
          High-definition educational video lessons, practical lab experiments, and teacher tutorial walk-throughs.
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {videos.map(vid => (
          <ResourceCard
            key={vid.id}
            resource={vid}
            onSelect={onSelectResource}
          />
        ))}
      </div>

    </div>
  );
};
