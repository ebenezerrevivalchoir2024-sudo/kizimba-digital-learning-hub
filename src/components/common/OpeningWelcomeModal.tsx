import React, { useState, useEffect } from 'react';
import { 
  GraduationCap, BookOpen, Sparkles, X, ChevronRight, 
  Award, ShieldCheck, Heart, Clock, Compass, Sun, Moon, Palette, RotateCw
} from 'lucide-react';
import { themeSwitcherService, EntryTheme } from '../../services/themeSwitcherService';

interface OpeningWelcomeModalProps {
  userName?: string;
  userRole?: string;
  onClose: () => void;
  isOpen: boolean;
}

export const OpeningWelcomeModal: React.FC<OpeningWelcomeModalProps> = ({
  userName = 'Student',
  userRole = 'STUDENT',
  onClose,
  isOpen
}) => {
  const [currentTheme, setCurrentTheme] = useState<EntryTheme>(themeSwitcherService.getCurrentTheme());

  useEffect(() => {
    if (isOpen) {
      const unsubscribe = themeSwitcherService.subscribe(theme => {
        setCurrentTheme(theme);
      });
      return () => unsubscribe();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleRotateTheme = () => {
    themeSwitcherService.rotateNextTheme();
  };

  const allThemes = themeSwitcherService.getAllThemes();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in font-serif">
      <div className={`relative w-full max-w-3xl rounded-3xl border-2 ${currentTheme.borderColor} bg-gradient-to-br ${currentTheme.bgGradient} ${currentTheme.patternStyle} text-white shadow-2xl overflow-hidden flex flex-col my-auto max-h-[90vh]`}>
        
        {/* Dynamic Image Header with Decorative Badges */}
        <div className="relative h-48 sm:h-56 overflow-hidden">
          <img 
            src={currentTheme.bgImageUrl || 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=1200&q=80'} 
            alt="Kizimba Secondary School Environment" 
            className="w-full h-full object-cover brightness-75 hover:scale-105 transition duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
          
          {/* Top Marquee Bar inside Modal */}
          <div className="absolute top-0 left-0 right-0 bg-red-700/90 text-white text-[11px] font-bold py-1 overflow-hidden shadow-md">
            <div className="animate-marquee space-x-8">
              <span>🎓 KIZIMBA SECONDARY SCHOOL</span>
              <span>📚 KIZIMBA DIGITAL LEARNING HUB (KDLH)</span>
              <span>✏️ FOUNDER: ISAKA EDWARD LUNGWA</span>
              <span>🌸 EXCELLENCE IN EDUCATION • FORM I TO FORM VI</span>
              <span>🧪 SCIENCE, ARTS & COMMERCIAL STUDIES</span>
              {/* Duplicate for infinite loop */}
              <span>🎓 KIZIMBA SECONDARY SCHOOL</span>
              <span>📚 KIZIMBA DIGITAL LEARNING HUB (KDLH)</span>
              <span>✏️ FOUNDER: ISAKA EDWARD LUNGWA</span>
              <span>🌸 EXCELLENCE IN EDUCATION • FORM I TO FORM VI</span>
            </div>
          </div>

          {/* Top right actions: theme rotater & close button */}
          <div className="absolute top-8 right-4 flex items-center gap-2">
            <button
              onClick={handleRotateTheme}
              title="Switch Educational Theme"
              className="p-2 rounded-full bg-black/60 hover:bg-blue-600 text-white border border-white/20 transition flex items-center gap-1.5 text-xs font-sans px-3"
            >
              <Palette className="w-4 h-4 text-amber-300" />
              <span className="hidden sm:inline font-bold">Theme</span>
            </button>
            <button 
              onClick={onClose}
              className="p-2 rounded-full bg-black/60 hover:bg-red-600 text-white border border-white/20 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Title Badges on Image */}
          <div className="absolute bottom-4 left-6 right-6 space-y-1">
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${currentTheme.accentBadgeBg} text-white border border-white/30 shadow-lg flex items-center gap-1.5`}>
                <GraduationCap className="w-4 h-4" />
                <span>{currentTheme.name}</span>
              </span>
              <span className="bg-black/60 text-emerald-300 px-3 py-1 rounded-full text-xs font-bold border border-emerald-500/40">
                {currentTheme.iconEmoji} Kizimba Secondary School
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-wide drop-shadow-md">
              Welcome back, <span className="text-blue-300 font-black">{userName}</span>!
            </h2>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 overflow-y-auto font-serif">
          
          {/* Motto and Special Message */}
          <div className="p-4 bg-slate-900/90 rounded-2xl border border-blue-900/60 shadow-inner space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-blue-300">
              <span className="flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-blue-400" />
                <em>{currentTheme.motto}</em>
              </span>
              <span className="text-emerald-400 font-sans text-[11px]">
                Active Session • Ready to Learn
              </span>
            </div>
            <p className="text-sm text-slate-200 italic leading-relaxed pt-1">
              {currentTheme.quote}
            </p>
            <div className="text-right text-xs font-bold text-emerald-400 font-sans">
              — {currentTheme.quoteAuthor}
            </div>
          </div>

          {/* Educational Elements Banner */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {(currentTheme.decorations || []).map((dec, idx) => (
              <div 
                key={idx} 
                className="p-3 bg-black/50 border border-blue-800/40 rounded-xl text-center hover:border-emerald-400 transition"
              >
                <span className="text-xs font-bold text-white block">
                  {dec}
                </span>
              </div>
            ))}
          </div>

          {/* Key Announcements & Quick Actions */}
          <div className="bg-gradient-to-r from-blue-900/40 via-slate-900 to-emerald-900/40 p-4 rounded-2xl border border-blue-800/40 space-y-2 text-xs">
            <div className="font-bold text-white flex items-center justify-between">
              <span className="flex items-center gap-1 text-emerald-300">
                <ShieldCheck className="w-4 h-4" /> Comprehensive KDLH Educational Features
              </span>
              <span className="text-blue-300">Form I - Form VI</span>
            </div>
            <p className="text-slate-300 leading-relaxed font-sans text-[11px]">
              Access teacher-verified notes, NECTA past papers with answer walkthroughs, practical experiment guides 🧪, educational video lessons 🎥, audio tutorials 🎧, and AI study assistant.
            </p>
          </div>

          {/* Modal Footer / Enter Button */}
          <div className="pt-2 flex items-center justify-between gap-4 border-t border-slate-800">
            <div className="text-[11px] text-slate-400 font-sans italic hidden sm:block">
              Headmaster & Founder: <strong className="text-white">Isaack Edward Lungwa</strong>
            </div>

            <button
              onClick={onClose}
              className="w-full sm:w-auto ml-auto px-8 py-3 bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-600 hover:from-blue-500 hover:to-emerald-500 text-white font-extrabold text-sm uppercase tracking-wider rounded-2xl shadow-xl hover:shadow-2xl hover:scale-105 transition-all flex items-center justify-center gap-2 border border-blue-400/50"
            >
              <span>ENTER KDLH HUB</span>
              <ChevronRight className="w-5 h-5 text-white" />
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
