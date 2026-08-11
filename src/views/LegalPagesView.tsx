import React from 'react';
import { ShieldCheck, FileText, Lock, Award } from 'lucide-react';

export const LegalPagesView: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-8 rounded-2xl shadow-xl space-y-3 border border-slate-800">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold">
          <ShieldCheck className="w-3.5 h-3.5" /> Legal Framework & Educational Resource Policy
        </div>
        <h1 className="text-2xl sm:text-4xl font-black">Privacy, Terms & Copyright Policies</h1>
        <p className="text-xs sm:text-sm text-slate-300">
          Founded by <strong>ISAACK EDWARD LUNGWA</strong> • Kizimba Digital Learning Hub (KDLH)
        </p>
      </div>

      {/* Policy Sections */}
      <div className="bg-white p-8 rounded-2xl border border-slate-200/80 shadow-md space-y-8 text-xs text-slate-700 leading-relaxed">
        
        {/* Section 1 */}
        <div className="space-y-2">
          <h3 className="text-base font-bold text-slate-900 uppercase tracking-wider text-blue-700">1. Educational Resource & Copyright Policy</h3>
          <p>
            Kizimba Digital Learning Hub (KDLH) operates under strict intellectual property guidelines. All digital study notes, practical laboratory guides, schemes of work, and assessment items hosted on KDLH are either:
          </p>
          <ul className="list-disc list-inside space-y-1 pl-2">
            <li>Created and owned by teachers at Kizimba Secondary School.</li>
            <li>Adapted from public domain NECTA past examination publications for educational revision.</li>
            <li>Openly licensed under Creative Commons or educational fair use terms.</li>
          </ul>
        </div>

        {/* Section 2 */}
        <div className="space-y-2">
          <h3 className="text-base font-bold text-slate-900 uppercase tracking-wider text-blue-700">2. Commercial Music & Copyright Rights Policy</h3>
          <p>
            KDLH enforces a strict copyright rights workflow for all media assets. Commercial pop music is not hosted or redistributed without verified authorization or written licensing agreements. Unlicensed tracks are provided via official external source links or permitted embeds only.
          </p>
        </div>

        {/* Section 3 */}
        <div className="space-y-2">
          <h3 className="text-base font-bold text-slate-900 uppercase tracking-wider text-blue-700">3. Student Data Privacy & AI Interactions</h3>
          <p>
            Student activity logs, quiz scores, and saved bookmarks are stored securely in client-side storage. AI prompts sent to the KDLH AI Assistant are processed server-side in compliance with strict privacy standards and are used solely to generate academic responses.
          </p>
        </div>

        {/* Founder Attribution */}
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-slate-800 space-y-1">
          <strong className="block text-slate-900">Official Platform Ownership:</strong>
          <p>
            Kizimba Digital Learning Hub (KDLH) is created and founded by <strong>ISAACK EDWARD LUNGWA</strong> for Kizimba Secondary School.
          </p>
        </div>

      </div>

    </div>
  );
};
