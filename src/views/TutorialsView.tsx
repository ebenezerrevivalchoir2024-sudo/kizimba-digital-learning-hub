import React from 'react';
import { Video, Play, BookOpen, CheckCircle2 } from 'lucide-react';
import { KDLHResource, VideoResource } from '../types';

interface TutorialsViewProps {
  resources: KDLHResource[];
  onSelectResource: (resource: KDLHResource) => void;
}

export const TutorialsView: React.FC<TutorialsViewProps> = ({ resources, onSelectResource }) => {
  const tutorials = resources.filter(r => r.category === 'TUTORIAL' || (r.category === 'VIDEO' && (r as VideoResource).isTutorial)) as VideoResource[];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-950 to-slate-900 text-white p-8 rounded-2xl shadow-xl space-y-3">
        <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block">
          Step-by-Step Teaching
        </span>
        <h1 className="text-2xl sm:text-4xl font-black">KDLH Step-by-Step Tutorials</h1>
        <p className="text-sm text-blue-200 max-w-2xl leading-relaxed">
          Master difficult topics step-by-step with structured video tutorials by experienced Kizimba Secondary School teachers.
        </p>
      </div>

      {/* Continue Watching Section */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-3">
        <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider text-blue-700">Continue Watching</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {tutorials.slice(0, 2).map(tut => (
            <div 
              key={tut.id}
              onClick={() => onSelectResource(tut)}
              className="p-4 rounded-xl border border-slate-200 hover:border-blue-400 transition-all cursor-pointer flex items-center gap-4 bg-slate-50 hover:bg-white group"
            >
              <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                <Play className="w-6 h-6 fill-current" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-blue-700 uppercase bg-blue-100 px-2 py-0.5 rounded">
                  {tut.subjectName} • {tut.form}
                </span>
                <h4 className="font-bold text-sm text-slate-900 group-hover:text-blue-700 transition-colors line-clamp-1 mt-0.5">
                  {tut.title}
                </h4>
                <p className="text-xs text-slate-500 line-clamp-1">{tut.topic}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* All Tutorials List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {tutorials.map(tut => (
          <div 
            key={tut.id}
            onClick={() => onSelectResource(tut)}
            className="bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all cursor-pointer overflow-hidden group"
          >
            <div className="aspect-video bg-slate-900 relative flex items-center justify-center">
              {tut.thumbnailUrl ? (
                <img src={tut.thumbnailUrl} alt={tut.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
              ) : (
                <Video className="w-12 h-12 text-slate-600" />
              )}
              <div className="absolute inset-0 bg-slate-950/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-lg">
                  <Play className="w-6 h-6 fill-current" />
                </div>
              </div>
            </div>

            <div className="p-5 space-y-2">
              <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                {tut.subjectName} • {tut.form}
              </span>
              <h4 className="font-bold text-slate-900 group-hover:text-blue-700 transition-colors line-clamp-2">
                {tut.title}
              </h4>
              <p className="text-xs text-slate-500 line-clamp-2">{tut.description}</p>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
