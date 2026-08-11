import React, { useState } from 'react';
import { X, Download, Printer, Bookmark, Share2, BookOpen, Check, FileText, ExternalLink } from 'lucide-react';
import { KDLHResource, NoteResource } from '../../types';
import { exportResourceToTxt } from '../../utils/exportUtils';

interface PdfViewerModalProps {
  resource: KDLHResource | null;
  onClose: () => void;
  onToggleSave?: (id: string) => void;
  isSaved?: boolean;
}

export const PdfViewerModal: React.FC<PdfViewerModalProps> = ({
  resource,
  onClose,
  onToggleSave,
  isSaved = false
}) => {
  const [copied, setCopied] = useState(false);

  if (!resource) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const isNote = resource.category === 'NOTE';
  const noteContent = isNote ? (resource as NoteResource).contentMarkdown : null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 overflow-y-auto font-mono">
      <div className="bg-black/90 text-cyan-100 rounded-2xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-[0_0_30px_rgba(6,182,212,0.2)] border border-cyan-900/50 overflow-hidden backdrop-blur-xl animate-in fade-in zoom-in duration-200">
        
        {/* Modal Header */}
        <div className="bg-cyan-950/80 text-white px-6 py-4 flex items-center justify-between border-b border-cyan-900/50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-cyan-950 border border-cyan-500/40 text-cyan-400 rounded-lg shadow-[0_0_8px_rgba(6,182,212,0.2)]">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest block">
                {resource.category.replace('_', ' ')} • {resource.subjectName} ({resource.form})
              </span>
              <h3 className="text-lg font-bold text-white line-clamp-1 uppercase tracking-wider">
                {resource.title}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {onToggleSave && (
              <button
                onClick={() => onToggleSave(resource.id)}
                className={`p-2 rounded-lg text-xs font-medium flex items-center gap-1 transition-all border ${
                  isSaved ? 'bg-cyan-400 text-black border-cyan-400 shadow-[0_0_10px_#22d3ee]' : 'bg-black/60 text-cyan-200 border-cyan-900/50 hover:bg-cyan-950/50'
                }`}
              >
                <Bookmark className="w-4 h-4 fill-current" />
                <span className="hidden sm:inline uppercase">{isSaved ? 'Saved' : 'Save'}</span>
              </button>
            )}

            <button
              onClick={() => exportResourceToTxt(resource)}
              className="p-2 bg-black/60 border border-cyan-900/50 text-cyan-200 rounded-lg hover:bg-cyan-950/50 transition-colors flex items-center gap-1 text-xs uppercase tracking-wider"
              title="Export Summary to Local .TXT File"
            >
              <Download className="w-4 h-4 text-cyan-400" /> <span className="hidden sm:inline">Export .TXT</span>
            </button>

            <button
              onClick={handlePrint}
              className="p-2 bg-black/60 border border-cyan-900/50 text-cyan-200 rounded-lg hover:bg-cyan-950/50 transition-colors hidden sm:flex items-center gap-1 text-xs uppercase tracking-wider"
              title="Print Document"
            >
              <Printer className="w-4 h-4" /> Print
            </button>

            <button
              onClick={handleShare}
              className="p-2 bg-black/60 border border-cyan-900/50 text-cyan-200 rounded-lg hover:bg-cyan-950/50 transition-colors text-xs flex items-center gap-1"
              title="Share Link"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4 text-cyan-400" />}
            </button>

            <button
              onClick={onClose}
              className="p-2 bg-black/60 border border-cyan-900/50 text-cyan-200 rounded-lg hover:bg-rose-950 hover:border-rose-500/50 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Sub-header info bar */}
        <div className="bg-black/60 border-b border-cyan-900/50 px-6 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs text-cyan-300 font-mono">
          <div className="flex items-center gap-4">
            <span><strong className="text-cyan-400">Author:</strong> {resource.author} ({resource.authorRole})</span>
            <span><strong className="text-cyan-400">Added:</strong> {resource.dateAdded}</span>
            <span><strong className="text-cyan-400">Status:</strong> <span className="font-semibold text-cyan-300">{resource.permissionStatus}</span></span>
          </div>

          {resource.sourceUrl && (
            <a 
              href={resource.sourceUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-cyan-400 hover:text-cyan-300 hover:underline flex items-center gap-1 font-semibold uppercase tracking-wider"
            >
              Official Source Link <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>

        {/* Modal Body / Reader View */}
        <div className="p-6 overflow-y-auto flex-1 bg-cyan-950/20 space-y-6 font-mono">
          {noteContent ? (
            <div className="bg-black/80 p-8 rounded-xl border border-cyan-900/50 shadow-sm max-w-none text-cyan-100 font-sans leading-relaxed text-sm sm:text-base space-y-4">
              <div className="border-b border-cyan-900/40 pb-4 mb-6">
                <span className="text-xs font-bold uppercase tracking-wider text-cyan-300 bg-cyan-950 px-2.5 py-1 rounded border border-cyan-800 font-mono">
                  KDLH Certified Study Material
                </span>
                <h1 className="text-2xl font-black text-white uppercase tracking-wider mt-2 font-mono">
                  {resource.title}
                </h1>
                <p className="text-cyan-300/80 text-sm mt-1">{resource.description}</p>
              </div>

              {/* Render formatted study guide content */}
              <div className="whitespace-pre-line space-y-3 text-cyan-100">
                {noteContent}
              </div>
            </div>
          ) : (
            <div className="bg-black/80 p-8 rounded-xl border border-cyan-900/50 shadow-sm text-center space-y-4 my-8">
              <FileText className="w-16 h-16 text-cyan-400 mx-auto animate-pulse" />
              <h4 className="text-lg font-bold text-white uppercase tracking-wider">{resource.title}</h4>
              <p className="text-cyan-200/80 max-w-md mx-auto text-sm font-sans">{resource.description}</p>
              
              <div className="bg-cyan-950/60 border border-cyan-800/60 rounded-lg p-4 max-w-md mx-auto text-xs text-cyan-200 text-left space-y-1 font-mono">
                <p><strong>License Status:</strong> {resource.permissionStatus}</p>
                <p><strong>Source Repository:</strong> {resource.sourceName || 'Kizimba Secondary Academic Vault'}</p>
                {resource.license && <p><strong>Rights:</strong> {resource.license}</p>}
              </div>

              <div className="pt-2 flex justify-center gap-3">
                <button 
                  onClick={() => alert(`Simulated Download of: ${resource.title}. In production, this streams the PDF file.`)}
                  className="px-5 py-2.5 bg-cyan-400 text-black rounded-lg font-bold text-xs flex items-center gap-2 hover:bg-cyan-300 transition-all shadow-[0_0_10px_#22d3ee] uppercase tracking-wider"
                >
                  <Download className="w-4 h-4" /> Download Resource File
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-black/80 px-6 py-3 border-t border-cyan-900/50 flex items-center justify-between text-xs text-cyan-400/80">
          <span>Kizimba Digital Learning Hub (KDLH) • ISAACK EDWARD LUNGWA</span>
          <button 
            onClick={onClose}
            className="px-4 py-1.5 bg-cyan-950 hover:bg-cyan-900 text-cyan-200 border border-cyan-800 rounded font-semibold transition-colors uppercase tracking-wider"
          >
            Close Reader
          </button>
        </div>

      </div>
    </div>
  );
};
