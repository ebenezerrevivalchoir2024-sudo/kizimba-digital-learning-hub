import React, { useState, useMemo } from 'react';
import { BookOpen, Search, Download, ExternalLink } from 'lucide-react';
import { BookResource, Subject, KDLHResource } from '../types';
import { ResourceCard } from '../components/common/ResourceCard';

interface BooksViewProps {
  resources: KDLHResource[];
  subjects: Subject[];
  onSelectResource: (resource: KDLHResource) => void;
  savedResourceIds: string[];
  onToggleSaveResource: (id: string) => void;
}

export const BooksView: React.FC<BooksViewProps> = ({
  resources,
  subjects,
  onSelectResource,
  savedResourceIds,
  onToggleSaveResource
}) => {
  const books = useMemo(() => {
    return resources.filter(r => r.category === 'BOOK') as BookResource[];
  }, [resources]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-950 via-slate-900 to-yellow-950 text-white p-8 rounded-2xl shadow-xl space-y-3 border border-amber-800/40">
        <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block">
          Authorized Digital Book Vault
        </span>
        <h1 className="text-2xl sm:text-4xl font-black">KDLH Digital Library</h1>
        <p className="text-sm text-amber-200 max-w-2xl leading-relaxed">
          Openly licensed and authorized digital textbooks, reference manuals, and academic literature for secondary education.
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {books.map(book => (
          <ResourceCard
            key={book.id}
            resource={book}
            onSelect={onSelectResource}
            onToggleSave={onToggleSaveResource}
            isSaved={savedResourceIds.includes(book.id)}
          />
        ))}
      </div>

    </div>
  );
};
