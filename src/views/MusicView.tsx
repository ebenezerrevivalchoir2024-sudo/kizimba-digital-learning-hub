import React, { useState } from 'react';
import { Music, ShieldCheck, Lock, ExternalLink, Play, AlertCircle } from 'lucide-react';
import { MusicResource, KDLHResource } from '../types';

interface MusicViewProps {
  resources: KDLHResource[];
  onSelectResource: (resource: KDLHResource) => void;
  onPlayAudioGlobal?: (title: string, artist: string, url: string) => void;
}

export const MusicView: React.FC<MusicViewProps> = ({
  resources,
  onSelectResource,
  onPlayAudioGlobal
}) => {
  const musicList = resources.filter(r => r.category === 'MUSIC') as MusicResource[];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-pink-950 via-slate-900 to-purple-950 text-white p-8 rounded-2xl shadow-xl space-y-3 border border-pink-800/40">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Authorized Media Rights & Copyright Workflow
        </div>
        <h1 className="text-2xl sm:text-4xl font-black">Music & Entertainment Hub</h1>
        <p className="text-sm text-pink-200 max-w-2xl leading-relaxed">
          Authorized KDLH original music, school songs, national anthems, and legally licensed educational audio. Unlicensed commercial uploads are prohibited.
        </p>
      </div>

      {/* Rights Policy Notice Box */}
      <div className="bg-slate-900 text-slate-200 p-6 rounded-2xl border border-slate-800 text-xs space-y-2">
        <h4 className="font-bold text-amber-400 flex items-center gap-1.5 text-sm">
          <ShieldCheck className="w-4 h-4 text-emerald-400" /> KDLH Music Rights & Copyright Notice
        </h4>
        <p className="text-slate-300 leading-relaxed">
          Commercial pop music is strictly managed. KDLH publishes only school-owned songs, public domain assets, or music with explicit license agreements. Unauthorized commercial tracks are provided via official external links only.
        </p>
      </div>

      {/* Music Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {musicList.map(item => (
          <div key={item.id} className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-md space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-pink-700 bg-pink-50 px-2.5 py-1 rounded-full border border-pink-200">
                {item.rightsRecord.uploadStatus}
              </span>
              <span className="text-xs text-slate-400 font-semibold">{item.rightsRecord.licenseType}</span>
            </div>

            <div>
              <h3 className="font-bold text-slate-900 text-lg">{item.songTitle}</h3>
              <p className="text-xs font-semibold text-slate-500">Artist: {item.artist}</p>
            </div>

            <p className="text-xs text-slate-600">{item.description}</p>

            {/* Rights Metadata */}
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-[11px] text-slate-600 space-y-1">
              <div><strong>Rights Owner:</strong> {item.rightsRecord.rightsOwner}</div>
              <div><strong>Publisher:</strong> {item.rightsRecord.publisher}</div>
            </div>

            <div className="pt-2 flex items-center justify-between">
              <button
                onClick={() => onSelectResource(item)}
                className="px-4 py-2 bg-pink-600 hover:bg-pink-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 transition-colors"
              >
                <Play className="w-4 h-4 fill-current" /> Listen / View Rights
              </button>

              {item.rightsRecord.sourceUrl && (
                <a 
                  href={item.rightsRecord.sourceUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-xs text-blue-700 hover:underline font-bold flex items-center gap-1"
                >
                  Official Link <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
