import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Search, 
  Bell, 
  User, 
  Menu, 
  X, 
  Sparkles, 
  GraduationCap, 
  FileText, 
  FlaskConical, 
  Video, 
  HelpCircle, 
  Headphones, 
  Music, 
  Briefcase,
  ShieldCheck,
  ChevronDown,
  HardDrive,
  Wifi,
  WifiOff
} from 'lucide-react';
import { UserProfile, UserRole } from '../../types';
import { subscribeSwStatus } from '../../serviceWorkerRegistration';

interface NavbarProps {
  activeRoute: string;
  onNavigate: (route: string) => void;
  currentUser: UserProfile;
  onOpenSearch: () => void;
  onOpenNotifications: () => void;
  unreadCount: number;
  onOpenAuth: () => void;
  onOpenOfflineVault: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeRoute,
  onNavigate,
  currentUser,
  onOpenSearch,
  onOpenNotifications,
  unreadCount,
  onOpenAuth,
  onOpenOfflineVault
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeSwStatus((status) => {
      setIsOnline(status.isOnline);
    });
    return unsubscribe;
  }, []);


  const navItems = [
    { key: 'HOME', label: 'HOME', route: '/' },
    { key: 'NOTES', label: 'NOTES', route: '/notes' },
    { key: 'PAST_PAPERS', label: 'PAST PAPERS', route: '/past-papers' },
    { key: 'PRACTICALS', label: 'PRACTICALS', route: '/practicals' },
    { key: 'EXAM_SCANNER', label: 'AI SCANNER', route: '/exam-scanner', highlight: true },
    { key: 'TEACHER_HUB', label: 'TEACHER WORKSPACE', route: '/teacher-workspace' },
    { key: 'REVISION', label: 'REVISION', route: '/revision' },
    { key: 'QUESTIONS', label: 'QUESTIONS', route: '/questions' },
    { key: 'BOOKS', label: 'BOOKS', route: '/books' },
    { key: 'TEACHER', label: 'RESOURCES', route: '/teacher-resources' },
    { key: 'AI', label: 'AI ASSISTANT', route: '/ai-assistant', highlight: true }
  ];

  return (
    <header className="sticky top-0 z-40 bg-black/80 backdrop-blur-xl text-cyan-100 shadow-2xl border-b border-cyan-900/40">
      {/* Top Founder Announcement Bar */}
      <div className="bg-gradient-to-r from-cyan-950 via-slate-950 to-cyan-950 border-b border-cyan-900/40 px-4 py-1.5 text-center text-[11px] font-semibold text-cyan-200 flex items-center justify-between">
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
          <span className="truncate">
            <strong className="text-cyan-400 font-extrabold tracking-wide">KIZIMBA DIGITAL LEARNING HUB (KDLH)</strong> • Founded by <strong className="text-white">ISAACK EDWARD LUNGWA</strong>
          </span>
          <span className="hidden md:inline-block text-amber-300/90 font-mono font-bold uppercase tracking-widest text-[10px]">
            LEARN • PRACTICE • ASK • IMPROVE
          </span>
        </div>
      </div>

      {/* Primary Navigation Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <div 
            onClick={() => onNavigate('/')}
            className="flex items-center gap-3 cursor-pointer group flex-shrink-0"
          >
            <div className="w-10 h-10 rounded-xl bg-cyan-950 border border-cyan-500/50 p-0.5 shadow-[0_0_12px_rgba(6,182,212,0.3)] group-hover:shadow-[0_0_20px_rgba(6,182,212,0.6)] group-hover:scale-105 transition-all">
              <div className="w-full h-full bg-black/80 rounded-[10px] flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-cyan-400" />
              </div>
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-black text-lg text-white tracking-widest font-mono">KDLH</span>
                <span className="text-[9px] bg-cyan-400 text-black font-black px-1.5 py-0.5 rounded tracking-widest uppercase shadow-[0_0_8px_#22d3ee]">
                  HUB
                </span>
              </div>
              <span className="text-[10px] text-cyan-400/80 font-mono font-medium tracking-wider block -mt-1">
                Kizimba Secondary School
              </span>
            </div>
          </div>

          {/* Desktop Links Bar */}
          <nav className="hidden xl:flex items-center gap-1 overflow-x-auto py-1 scrollbar-none text-xs font-mono font-semibold">
            {navItems.map(item => {
              const isActive = activeRoute === item.route;
              return (
                <button
                  key={item.key}
                  onClick={() => onNavigate(item.route)}
                  className={`px-2.5 py-1.5 rounded-lg transition-all whitespace-nowrap flex items-center gap-1 text-[11px] tracking-wider ${
                    isActive 
                      ? 'bg-cyan-400 text-black font-bold shadow-[0_0_12px_#22d3ee]' 
                      : item.highlight
                      ? 'bg-purple-950/60 text-purple-300 hover:bg-purple-900/60 border border-purple-500/50 shadow-[0_0_10px_rgba(168,85,247,0.3)]'
                      : 'text-cyan-200/80 hover:text-cyan-100 hover:bg-cyan-950/50 border border-transparent hover:border-cyan-900/50'
                  }`}
                >
                  {item.highlight && <Sparkles className="w-3.5 h-3.5 text-purple-400 animate-pulse" />}
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Action Icons & User Dropdown */}
          <div className="flex items-center gap-2 font-mono">
            <button
              onClick={onOpenSearch}
              className="p-2 text-cyan-300 hover:text-white bg-black/40 hover:bg-cyan-950/60 border border-cyan-900/40 hover:border-cyan-500/40 rounded-lg transition-all flex items-center gap-1.5 text-xs"
              title="Global Search"
            >
              <Search className="w-4 h-4 text-cyan-400" />
              <span className="hidden sm:inline font-semibold">Search</span>
            </button>

            <button
              onClick={onOpenNotifications}
              className="p-2 text-cyan-300 hover:text-white bg-black/40 hover:bg-cyan-950/60 border border-cyan-900/40 hover:border-cyan-500/40 rounded-lg transition-all relative"
              title="Notifications"
            >
              <Bell className="w-4 h-4 text-amber-400" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-500 shadow-[0_0_6px_#f43f5e] animate-pulse" />
              )}
            </button>

            {/* Offline Vault & Network Status Badge */}
            <button
              onClick={onOpenOfflineVault}
              className={`px-2.5 py-1.5 rounded-lg border text-xs font-bold transition-all flex items-center gap-1.5 ${
                isOnline 
                  ? 'bg-black/40 hover:bg-cyan-950/60 border-cyan-900/40 hover:border-cyan-500/40 text-cyan-200' 
                  : 'bg-amber-950/80 border-amber-500/60 text-amber-300 shadow-[0_0_10px_rgba(245,158,11,0.3)] animate-pulse'
              }`}
              title="KDLH Student Offline Vault"
            >
              <HardDrive className="w-4 h-4 text-cyan-400" />
              <span className="hidden lg:inline uppercase tracking-wider text-[11px]">Vault</span>
              <span className={`w-2 h-2 rounded-full ${isOnline ? 'bg-emerald-400 shadow-[0_0_6px_#34d399]' : 'bg-amber-400 shadow-[0_0_6px_#fbbf24]'}`} />
            </button>


            {/* Role / Profile Button */}
            <button
              onClick={onOpenAuth}
              className="flex items-center gap-2 pl-2.5 pr-3 py-1.5 bg-cyan-950/30 hover:bg-cyan-900/40 rounded-xl border border-cyan-800/50 hover:border-cyan-500/50 transition-all text-xs font-bold"
            >
              <div className={`p-1 rounded-md ${
                currentUser.role === 'ADMIN' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' :
                currentUser.role === 'TEACHER' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
              }`}>
                {currentUser.role === 'ADMIN' && <ShieldCheck className="w-3.5 h-3.5" />}
                {currentUser.role === 'TEACHER' && <GraduationCap className="w-3.5 h-3.5" />}
                {currentUser.role === 'STUDENT' && <User className="w-3.5 h-3.5" />}
              </div>

              <div className="text-left hidden md:block font-mono">
                <span className="block text-white text-[11px] leading-tight line-clamp-1">{currentUser.name}</span>
                <span className="block text-[9px] text-cyan-400 font-semibold uppercase tracking-wider">{currentUser.role}</span>
              </div>

              <ChevronDown className="w-3 h-3 text-cyan-400" />
            </button>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-2 text-cyan-300 hover:text-white bg-black/40 hover:bg-cyan-950/60 border border-cyan-900/40 rounded-lg"
            >
              {mobileMenuOpen ? <X className="w-6 h-6 text-cyan-400" /> : <Menu className="w-6 h-6 text-cyan-400" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Nav Menu Drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-black/95 border-t border-cyan-900/50 px-4 py-4 space-y-2 max-h-[80vh] overflow-y-auto backdrop-blur-2xl">
          <div className="grid grid-cols-2 gap-2 text-xs font-mono font-bold">
            {navItems.map(item => (
              <button
                key={item.key}
                onClick={() => {
                  onNavigate(item.route);
                  setMobileMenuOpen(false);
                }}
                className={`p-2.5 rounded-lg text-left transition-colors flex items-center gap-2 border ${
                  activeRoute === item.route 
                    ? 'bg-cyan-400 text-black border-cyan-400 shadow-[0_0_10px_#22d3ee]' 
                    : 'bg-cyan-950/30 text-cyan-200 border-cyan-900/40 hover:bg-cyan-900/40'
                }`}
              >
                <span>{item.label}</span>
              </button>
            ))}
          </div>

          <div className="pt-3 border-t border-cyan-900/40 flex items-center justify-between text-xs font-mono text-cyan-400">
            <span>Role: <strong className="text-white">{currentUser.role}</strong></span>
            <button onClick={onOpenAuth} className="text-cyan-300 font-bold underline">
              Switch Role
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
