import React from 'react';
import { GraduationCap, Shield, Heart, Award, Sparkles, BookOpen } from 'lucide-react';

interface FooterProps {
  onNavigate: (route: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-black/90 text-cyan-100 border-t border-cyan-900/40 pt-12 pb-8 font-mono relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-12">
        
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-950 border border-cyan-500/50 p-0.5 shadow-[0_0_12px_rgba(6,182,212,0.3)]">
                <div className="w-full h-full bg-black/90 rounded-[10px] flex items-center justify-center">
                  <GraduationCap className="w-6 h-6 text-cyan-400" />
                </div>
              </div>
              <div>
                <h3 className="font-extrabold text-lg text-white tracking-wider">KIZIMBA DIGITAL LEARNING HUB</h3>
                <span className="text-xs text-cyan-400 font-bold tracking-widest uppercase">KDLH</span>
              </div>
            </div>

            <p className="text-xs text-cyan-200/70 leading-relaxed max-w-md">
              One digital space for learning, revision, practicals, educational resources, and intelligent academic support at Kizimba Secondary School, Tanzania.
            </p>

            <div className="bg-cyan-950/20 border border-cyan-900/50 p-3.5 rounded-xl text-xs space-y-1 backdrop-blur-sm">
              <span className="text-cyan-400 font-bold block uppercase tracking-wider text-[10px]">Founder Branding</span>
              <p className="text-cyan-100">
                Founded by <strong className="text-white font-bold">ISAACK EDWARD LUNGWA</strong>
              </p>
              <p className="text-cyan-300/70 text-[11px]">
                Founder & Creator of Kizimba Digital Learning Hub
              </p>
            </div>

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 text-xs font-bold shadow-[0_0_10px_rgba(6,182,212,0.2)]">
              <Award className="w-3.5 h-3.5 text-cyan-400" /> LEARN • PRACTICE • ASK • IMPROVE
            </div>
          </div>

          {/* Core Modules */}
          <div className="space-y-3">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-cyan-400">Core Learning</h4>
            <ul className="space-y-2 text-xs text-cyan-200/70">
              <li><button onClick={() => onNavigate('/notes')} className="hover:text-cyan-300 transition-colors">Digital Notes Library</button></li>
              <li><button onClick={() => onNavigate('/past-papers')} className="hover:text-cyan-300 transition-colors">Past Papers Repository</button></li>
              <li><button onClick={() => onNavigate('/practicals')} className="hover:text-cyan-300 transition-colors">Digital Practical Lab</button></li>
              <li><button onClick={() => onNavigate('/videos')} className="hover:text-cyan-300 transition-colors">Video Learning Center</button></li>
              <li><button onClick={() => onNavigate('/tutorials')} className="hover:text-cyan-300 transition-colors">Step-by-Step Tutorials</button></li>
              <li><button onClick={() => onNavigate('/revision')} className="hover:text-cyan-300 transition-colors">Interactive Revision Center</button></li>
            </ul>
          </div>

          {/* Media & Resources */}
          <div className="space-y-3">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-cyan-400">Media & Resources</h4>
            <ul className="space-y-2 text-xs text-cyan-200/70">
              <li><button onClick={() => onNavigate('/books')} className="hover:text-cyan-300 transition-colors">Digital Library / Books</button></li>
              <li><button onClick={() => onNavigate('/questions')} className="hover:text-cyan-300 transition-colors">Question Bank</button></li>
              <li><button onClick={() => onNavigate('/audio')} className="hover:text-cyan-300 transition-colors">Audio Lessons & Podcasts</button></li>
              <li><button onClick={() => onNavigate('/music')} className="hover:text-cyan-300 transition-colors">Music & Entertainment Hub</button></li>
              <li><button onClick={() => onNavigate('/teacher-resources')} className="hover:text-cyan-300 transition-colors">Teacher Resource Center</button></li>
              <li><button onClick={() => onNavigate('/ai-assistant')} className="hover:text-purple-300 font-bold text-purple-400 flex items-center gap-1"><Sparkles className="w-3 h-3 text-purple-400" /> KDLH AI Assistant</button></li>
            </ul>
          </div>

          {/* Platform & Legal */}
          <div className="space-y-3">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-cyan-400">Platform & Rights</h4>
            <ul className="space-y-2 text-xs text-cyan-200/70">
              <li><button onClick={() => onNavigate('/about')} className="hover:text-cyan-300 transition-colors">About KDLH & Founder</button></li>
              <li><button onClick={() => onNavigate('/contact')} className="hover:text-cyan-300 transition-colors">Contact Administration</button></li>
              <li><button onClick={() => onNavigate('/legal')} className="hover:text-cyan-300 transition-colors">Privacy Policy</button></li>
              <li><button onClick={() => onNavigate('/legal')} className="hover:text-cyan-300 transition-colors">Terms of Use</button></li>
              <li><button onClick={() => onNavigate('/legal')} className="hover:text-cyan-300 transition-colors">Copyright & Resource Policy</button></li>
            </ul>
          </div>

        </div>

        {/* Legal Resource Notice */}
        <div className="bg-cyan-950/30 p-4 rounded-xl border border-cyan-900/50 text-[11px] text-cyan-200/70 leading-relaxed space-y-1">
          <span className="font-bold text-cyan-300 block">Copyright & Educational Resource Policy:</span>
          <p>
            Kizimba Digital Learning Hub respects intellectual property rights. All notes, practical guides, assessment tools, and tutorial media are school-owned, teacher-created, openly licensed, or attributed to public-domain/official sources. Copyrighted third-party content is accessed via authorized official links or embeds.
          </p>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-cyan-900/40 flex flex-col sm:flex-row items-center justify-between text-xs text-cyan-400/60 gap-4">
          <p>© {new Date().getFullYear()} KIZIMBA DIGITAL LEARNING HUB (KDLH). Founded by <strong className="text-white">ISAACK EDWARD LUNGWA</strong>.</p>
          <p className="flex items-center gap-1 text-cyan-300/80">
            Built for Kizimba Secondary School, Tanzania • EdTech Platform
          </p>
        </div>

      </div>
    </footer>
  );
};
