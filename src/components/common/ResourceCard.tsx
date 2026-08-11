import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  BookOpen, 
  FlaskConical, 
  Video, 
  HelpCircle, 
  Headphones, 
  Music, 
  Briefcase, 
  Eye, 
  Download, 
  Bookmark, 
  CheckCircle2, 
  Clock, 
  Lock,
  Sparkles,
  ExternalLink,
  HardDrive
} from 'lucide-react';
import { KDLHResource } from '../../types';
import { KdlhStorageService } from '../../services/storage';
import { exportResourceToTxt } from '../../utils/exportUtils';

interface ResourceCardProps {
  resource: KDLHResource;
  onSelect: (resource: KDLHResource) => void;
  onToggleSave?: (id: string) => void;
  isSaved?: boolean;
}

export const ResourceCard: React.FC<ResourceCardProps> = ({
  resource,
  onSelect,
  onToggleSave,
  isSaved = false
}) => {
  const [isCached, setIsCached] = useState(false);

  useEffect(() => {
    let isMounted = true;
    KdlhStorageService.isResourceCachedForOffline(resource.id).then((cached) => {
      if (isMounted) setIsCached(cached);
    });
    return () => { isMounted = false; };
  }, [resource.id]);

  const handleToggleCache = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isCached) {
      await KdlhStorageService.uncacheResourceFromOffline(resource.id);
      setIsCached(false);
    } else {
      await KdlhStorageService.cacheResourceForOffline(resource);
      setIsCached(true);
    }
  };

  const getCategoryIcon = () => {
    switch (resource.category) {
      case 'NOTE':
        return <FileText className="w-5 h-5 text-cyan-400" />;
      case 'PAST_PAPER':
        return <BookOpen className="w-5 h-5 text-cyan-300" />;
      case 'PRACTICAL':
        return <FlaskConical className="w-5 h-5 text-emerald-400" />;
      case 'VIDEO':
      case 'TUTORIAL':
        return <Video className="w-5 h-5 text-rose-400" />;
      case 'BOOK':
        return <BookOpen className="w-5 h-5 text-amber-400" />;
      case 'QUESTION':
        return <HelpCircle className="w-5 h-5 text-purple-400" />;
      case 'AUDIO':
        return <Headphones className="w-5 h-5 text-teal-400" />;
      case 'MUSIC':
        return <Music className="w-5 h-5 text-pink-400" />;
      case 'TEACHER_RESOURCE':
        return <Briefcase className="w-5 h-5 text-cyan-200" />;
      default:
        return <FileText className="w-5 h-5 text-cyan-400" />;
    }
  };

  const getPermissionBadge = () => {
    switch (resource.permissionStatus) {
      case 'SCHOOL_OWNED':
        return <span className="bg-cyan-950/80 text-cyan-300 text-[10px] font-bold px-2 py-0.5 rounded border border-cyan-800">KDLH School Owned</span>;
      case 'OFFICIAL_SOURCE':
        return <span className="bg-emerald-950/80 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded border border-emerald-800">NECTA / Official</span>;
      case 'OPEN_LICENSE':
        return <span className="bg-purple-950/80 text-purple-300 text-[10px] font-bold px-2 py-0.5 rounded border border-purple-800">Open License</span>;
      case 'PUBLIC_DOMAIN':
        return <span className="bg-slate-900/80 text-slate-300 text-[10px] font-bold px-2 py-0.5 rounded border border-slate-700">Public Domain</span>;
      case 'NOT_AUTHORIZED':
        return <span className="bg-rose-950/80 text-rose-300 text-[10px] font-bold px-2 py-0.5 rounded border border-rose-800 flex items-center gap-1"><Lock className="w-2.5 h-2.5"/> External Link Only</span>;
      default:
        return <span className="bg-amber-950/80 text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded border border-amber-800">Verified</span>;
    }
  };

  return (
    <div className="bg-cyan-950/20 border border-cyan-900/40 hover:border-cyan-500/60 rounded-xl shadow-[0_0_15px_rgba(6,182,212,0.05)] hover:shadow-[0_0_20px_rgba(6,182,212,0.2)] transition-all duration-300 flex flex-col justify-between overflow-hidden group font-mono backdrop-blur-md">
      <div className="p-5">
        {/* Top Header Row */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-black/60 border border-cyan-900/40 rounded-lg group-hover:border-cyan-500/50 transition-colors">
              {getCategoryIcon()}
            </div>
            <div>
              <span className="text-xs font-bold text-cyan-300 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-900/60">
                {resource.subjectName}
              </span>
              <span className="text-xs font-medium text-cyan-400/70 ml-1.5">
                {resource.form}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={(e) => {
                e.stopPropagation();
                exportResourceToTxt(resource);
              }}
              className="p-1.5 rounded-lg transition-colors border text-cyan-500/60 hover:text-cyan-300 bg-black/40 border-cyan-900/40"
              title="Export Summary to Local .TXT File for Offline Printing"
            >
              <Download className="w-4 h-4" />
            </button>

            <button
              onClick={handleToggleCache}
              className={`p-1.5 rounded-lg transition-colors border ${
                isCached 
                  ? 'text-cyan-400 bg-cyan-950/80 border-cyan-500/60 shadow-[0_0_8px_#22d3ee]' 
                  : 'text-cyan-500/60 hover:text-cyan-300 bg-black/40 border-cyan-900/40'
              }`}
              title={isCached ? "Cached in IndexedDB for Offline Study" : "Download & Cache in IndexedDB"}
            >
              <HardDrive className={`w-4 h-4 ${isCached ? 'text-cyan-400' : ''}`} />
            </button>

            {onToggleSave && (
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleSave(resource.id);
                }}
                className={`p-1.5 rounded-lg transition-colors border ${isSaved ? 'text-amber-400 bg-amber-950/40 border-amber-500/50' : 'text-cyan-500/60 hover:text-cyan-300 bg-black/40 border-cyan-900/40'}`}
                title={isSaved ? "Saved" : "Save resource"}
              >
                <Bookmark className="w-4 h-4 fill-current" />
              </button>
            )}
          </div>
        </div>

        {/* Title */}
        <h4 
          onClick={() => onSelect(resource)}
          className="text-base font-bold text-white group-hover:text-cyan-400 transition-colors line-clamp-2 cursor-pointer mb-2 leading-snug"
        >
          {resource.title}
        </h4>

        {/* Description */}
        <p className="text-cyan-200/70 text-xs line-clamp-2 mb-3 leading-relaxed">
          {resource.description}
        </p>

        {/* Metadata Badges */}
        <div className="flex flex-wrap items-center gap-2 mb-2">
          {getPermissionBadge()}
          {resource.topic && (
            <span className="text-[11px] font-medium text-cyan-300/80 bg-black/40 border border-cyan-900/40 px-2 py-0.5 rounded line-clamp-1">
              Topic: {resource.topic}
            </span>
          )}
        </div>
      </div>

      {/* Footer Details */}
      <div className="px-5 py-3 bg-black/40 border-t border-cyan-900/40 flex items-center justify-between text-xs text-cyan-400/70">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <Eye className="w-3.5 h-3.5 text-cyan-500" /> {resource.views}
          </span>
          {resource.downloads > 0 && (
            <span className="flex items-center gap-1">
              <Download className="w-3.5 h-3.5 text-cyan-500" /> {resource.downloads}
            </span>
          )}
        </div>

        <button
          onClick={() => onSelect(resource)}
          className="inline-flex items-center gap-1 font-bold text-cyan-400 hover:text-cyan-200 transition-colors text-xs uppercase tracking-wider"
        >
          Open <ExternalLink className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};
