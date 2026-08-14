import React from 'react';
import { GraduationCap, Award, BookOpen, Sparkles, Heart, ShieldCheck, ArrowRight, School } from 'lucide-react';

interface FooterProps {
  onNavigate: (route: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-slate-950 text-slate-200 border-t border-blue-900/60 pt-12 pb-8 font-serif relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-10">
        
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-blue-950 border border-amber-400/60 p-0.5 shadow-lg flex-shrink-0">
                <div className="w-full h-full bg-slate-900 rounded-xl flex items-center justify-center">
                  <GraduationCap className="w-6 h-6 text-amber-400" />
                </div>
              </div>
              <div>
                <h3 className="font-extrabold text-base sm:text-lg text-white tracking-wide">
                  KIZIMBA DIGITAL LEARNING HUB
                </h3>
                <span className="text-xs text-amber-300 font-bold tracking-widest uppercase font-mono">
                  KDLH • TANZANIA EDTECH
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed max-w-md font-sans">
              A comprehensive digital academic portal for secondary students and educators at Kizimba Secondary School in Bumbuli, Tanga. Providing curriculum notes, past papers, practical guides, video lessons, and AI exam marking.
            </p>

            <div className="bg-slate-900/90 border border-blue-800/60 p-4 rounded-2xl text-xs space-y-1 shadow-md">
              <span className="text-amber-400 font-bold block uppercase tracking-wider text-[10px] font-mono">
                Platform Founder
              </span>
              <p className="text-white font-bold text-sm">
                Mwl. Isaack Edward Lungwa
              </p>
              <p className="text-slate-300 text-[11px] font-sans">
                Founder & Lead Architect • Kizimba Digital Learning Hub
              </p>
            </div>

            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-950/80 border border-amber-400/40 text-amber-300 text-xs font-bold font-mono">
              <Award className="w-4 h-4 text-amber-400" />
              <span>LEARN • PRACTICE • MASTER • EXCEL</span>
            </div>
          </div>

          {/* Academic Modules */}
          <div className="space-y-3">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-amber-300 font-mono">
              Core Academic
            </h4>
            <ul className="space-y-2 text-xs text-slate-300 font-sans">
              <li>
                <button onClick={() => onNavigate('/notes')} className="hover:text-amber-300 transition-colors text-left">
                  📚 Notes & Syllabus
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/past-papers')} className="hover:text-amber-300 transition-colors text-left">
                  📝 NECTA Past Papers
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/practicals')} className="hover:text-amber-300 transition-colors text-left">
                  🧪 Science Practicals
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/videos')} className="hover:text-amber-300 transition-colors text-left">
                  🎥 Video Learning Hub
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/books')} className="hover:text-amber-300 transition-colors text-left">
                  📖 Digital Textbooks
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/questions')} className="hover:text-amber-300 transition-colors text-left">
                  ❓ Question Bank
                </button>
              </li>
            </ul>
          </div>

          {/* Teacher & AI Tools */}
          <div className="space-y-3">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-amber-300 font-mono">
              Teacher & AI Tools
            </h4>
            <ul className="space-y-2 text-xs text-slate-300 font-sans">
              <li>
                <button onClick={() => onNavigate('/exam-scanner')} className="hover:text-amber-300 transition-colors text-left flex items-center gap-1">
                  📷 AI Exam Scanner
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/ai-assistant')} className="hover:text-amber-300 transition-colors text-left flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-400" /> KDLH AI Study Tutor
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/teacher-workspace')} className="hover:text-amber-300 transition-colors text-left">
                  👨🏽‍🏫 Teacher Workspace
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/attendance')} className="hover:text-amber-300 transition-colors text-left">
                  📅 Student Attendance
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/reports')} className="hover:text-amber-300 transition-colors text-left">
                  📊 Academic Reports
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/audio')} className="hover:text-amber-300 transition-colors text-left">
                  🎧 Audio Lessons
                </button>
              </li>
            </ul>
          </div>

          {/* Institutional Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-amber-300 font-mono">
              Institutional
            </h4>
            <ul className="space-y-2 text-xs text-slate-300 font-sans">
              <li>
                <button onClick={() => onNavigate('/about')} className="hover:text-amber-300 transition-colors text-left">
                  About KDLH & Founder
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/contact')} className="hover:text-amber-300 transition-colors text-left">
                  Contact School Office
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/legal')} className="hover:text-amber-300 transition-colors text-left">
                  Educational Fair Use Policy
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/legal')} className="hover:text-amber-300 transition-colors text-left">
                  Terms & Privacy Notice
                </button>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Clean Copyright Strip */}
        <div className="pt-6 border-t border-blue-900/40 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-3 font-sans">
          <p>© {new Date().getFullYear()} KIZIMBA DIGITAL LEARNING HUB (KDLH). Built for Kizimba Secondary School, Bumbuli, Tanga, Tanzania.</p>
          <p className="flex items-center gap-1.5 text-amber-300 font-serif">
            <span>Founded by</span>
            <strong className="text-white">Isaack Edward Lungwa</strong>
          </p>
        </div>

      </div>
    </footer>
  );
};
