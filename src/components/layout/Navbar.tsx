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
  Sun,
  Moon,
  SunMoon,
  Check
} from 'lucide-react';
import { UserProfile, UserRole } from '../../types';
import { subscribeSwStatus } from '../../serviceWorkerRegistration';
import { appThemeService, ThemeMode, AppThemeConfig } from '../../services/appThemeService';
import { AuthService } from '../../services/authService';

interface NavbarProps {
  activeRoute: string;
  onNavigate: (route: string) => void;
  currentUser: UserProfile | null;
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
  const [themeConfig, setThemeConfig] = useState<AppThemeConfig>(appThemeService.getThemeConfig());
  const [themeMenuOpen, setThemeMenuOpen] = useState(false);

  const isTeacherOrAdmin = AuthService.isTeacherOrAdmin(currentUser);
  const isAdmin = AuthService.isAdmin(currentUser);


  useEffect(() => {
    const unsubscribeSw = subscribeSwStatus((status) => {
      setIsOnline(status.isOnline);
    });
    const unsubscribeTheme = appThemeService.subscribe((cfg) => {
      setThemeConfig(cfg);
    });

    return () => {
      unsubscribeSw();
      unsubscribeTheme();
    };
  }, []);

  // Filter navigation items based on role access
  const allNavItems = [
    { key: 'HOME', label: 'HOME', route: '/', roles: ['STUDENT', 'TEACHER', 'ADMIN', 'FOUNDER'] },
    { key: 'DASHBOARD', label: 'DASHBOARD', route: '/dashboard', highlight: true, roles: ['STUDENT', 'TEACHER', 'ADMIN', 'FOUNDER'] },
    { key: 'VIDEO_HUB', label: '🎥 VIDEOS', route: '/videos', roles: ['STUDENT', 'TEACHER', 'ADMIN', 'FOUNDER'] },
    { key: 'AUDIO_HUB', label: '🎧 AUDIO', route: '/audio', roles: ['STUDENT', 'TEACHER', 'ADMIN', 'FOUNDER'] },
    { key: 'NOTES', label: 'NOTES', route: '/notes', roles: ['STUDENT', 'TEACHER', 'ADMIN', 'FOUNDER'] },
    { key: 'PAST_PAPERS', label: 'PAST PAPERS', route: '/past-papers', roles: ['STUDENT', 'TEACHER', 'ADMIN', 'FOUNDER'] },
    { key: 'PRACTICALS', label: 'PRACTICALS', route: '/practicals', roles: ['STUDENT', 'TEACHER', 'ADMIN', 'FOUNDER'] },
    { key: 'BOOKS', label: 'LIBRARY', route: '/books', roles: ['STUDENT', 'TEACHER', 'ADMIN', 'FOUNDER'] },
    { key: 'EXAM_SCANNER', label: 'AI SCANNER ✏️', route: '/exam-scanner', teacherOnly: true, roles: ['TEACHER', 'ADMIN', 'FOUNDER'] },
    { key: 'TEACHER_HUB', label: 'TEACHER WORKSPACE', route: '/teacher-workspace', teacherOnly: true, roles: ['TEACHER', 'ADMIN', 'FOUNDER'] },
    { key: 'ATTENDANCE', label: 'ATTENDANCE', route: '/attendance', teacherOnly: true, roles: ['TEACHER', 'ADMIN', 'FOUNDER'] },
    { key: 'REPORTS', label: 'REPORTS', route: '/reports', roles: ['STUDENT', 'TEACHER', 'ADMIN', 'FOUNDER'] },
    { key: 'ADMIN_PORTAL', label: 'ADMIN CONTROL 🛡️', route: '/admin-portal', adminOnly: true, roles: ['ADMIN', 'FOUNDER'] },
    { key: 'AI', label: 'KDLH AI ✨', route: '/ai-assistant', highlight: true, roles: ['STUDENT', 'TEACHER', 'ADMIN', 'FOUNDER'] }
  ];

  const visibleNavItems = allNavItems.filter(item => {
    if (item.adminOnly) return isAdmin;
    if (item.teacherOnly) return isTeacherOrAdmin;
    return true;
  });

  const handleSetTheme = (mode: ThemeMode) => {
    appThemeService.setMode(mode);
    setThemeMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-950/95 text-slate-100 shadow-2xl border-b border-blue-900/40 backdrop-blur-xl transition-colors">
      
      {/* 1. Top Announcement Marquee Ticker - Horizontally Scrollable & Animated */}
      <div className="bg-gradient-to-r from-blue-950 via-slate-950 to-blue-900 border-b border-blue-900/60 py-1.5 text-xs text-white overflow-x-auto scrollbar-none font-serif">
        <div className="animate-marquee space-x-8 font-serif font-bold tracking-wide min-w-max">
          <span className="text-amber-300">🎓 KIZIMBA SECONDARY SCHOOL</span>
          <span className="text-white">📚 KIZIMBA DIGITAL LEARNING HUB (KDLH)</span>
          <span className="text-emerald-400">✏️ FOUNDER: MWL. ISAACK EDWARD LUNGWA</span>
          <span className="text-blue-300">🌸 EXCELLENCE & CHARACTER • FORM I TO FORM VI</span>
          <span className="text-amber-400">🧪 SCIENCE LABS • PAST PAPERS • AI EXAM MARKER</span>
          {/* Duplicate loop */}
          <span className="text-amber-300">🎓 KIZIMBA SECONDARY SCHOOL</span>
          <span className="text-white">📚 KIZIMBA DIGITAL LEARNING HUB (KDLH)</span>
          <span className="text-emerald-400">✏️ FOUNDER: MWL. ISAACK EDWARD LUNGWA</span>
          <span className="text-blue-300">🌸 EXCELLENCE & CHARACTER • FORM I TO FORM VI</span>
          <span className="text-amber-400">🧪 SCIENCE LABS • PAST PAPERS • AI EXAM MARKER</span>
        </div>
      </div>

      {/* 2. Primary Navigation Bar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6">
        <div className="flex items-center justify-between h-16 gap-2">
          
          {/* Logo & Brand */}
          <div 
            onClick={() => onNavigate('/')}
            className="flex items-center gap-2.5 cursor-pointer group flex-shrink-0"
          >
            <div className="w-10 h-10 rounded-2xl bg-blue-900/80 border border-amber-400/60 p-0.5 shadow-[0_0_15px_rgba(234,179,8,0.3)] group-hover:scale-105 transition-transform flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-amber-300" />
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-black text-lg text-white tracking-widest font-mono">KDLH</span>
                <span className="text-[9px] bg-gradient-to-r from-amber-400 to-amber-500 text-black font-black px-1.5 py-0.5 rounded tracking-widest uppercase shadow-[0_0_8px_#fbbf24]">
                  HUB
                </span>
              </div>
              <span className="text-[10px] text-blue-200/90 font-mono font-medium tracking-wider block -mt-1 truncate max-w-[130px] sm:max-w-none">
                Kizimba Secondary School
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 overflow-x-auto py-1 scrollbar-none text-xs font-mono font-semibold">
            {visibleNavItems.map(item => {
              const isActive = activeRoute === item.route;
              return (
                <button
                  key={item.key}
                  onClick={() => onNavigate(item.route)}
                  className={`px-2.5 py-1.5 rounded-xl transition-all whitespace-nowrap flex items-center gap-1 text-[11px] tracking-wider ${
                    isActive 
                      ? 'bg-blue-600 text-white font-bold shadow-[0_0_15px_rgba(37,99,235,0.6)] border border-blue-400' 
                      : item.highlight
                      ? 'bg-amber-950/60 text-amber-300 hover:bg-amber-900/60 border border-amber-500/50 shadow-[0_0_10px_rgba(245,158,11,0.3)]'
                      : 'text-slate-200 hover:text-white hover:bg-blue-900/40 border border-transparent'
                  }`}
                >
                  {item.highlight && <Sparkles className="w-3 h-3 text-amber-300 animate-pulse" />}
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Action Bar (Search, Theme, Notifs, Vault, Auth, Menu) */}
          <div className="flex items-center gap-1.5 sm:gap-2 font-mono flex-shrink-0">
            
            {/* Search */}
            <button
              onClick={onOpenSearch}
              className="p-2 text-slate-200 hover:text-white bg-slate-900 hover:bg-blue-900/50 border border-blue-900/50 rounded-xl transition-all flex items-center gap-1 text-xs"
              title="Global Subject & Note Search"
            >
              <Search className="w-4 h-4 text-amber-300" />
              <span className="hidden md:inline font-semibold">Search</span>
            </button>

            {/* Theme Switcher Button with Dropdown */}
            <div className="relative">
              <button
                onClick={() => setThemeMenuOpen(!themeMenuOpen)}
                className="p-2 text-slate-200 hover:text-white bg-slate-900 hover:bg-blue-900/50 border border-blue-900/50 rounded-xl transition-all flex items-center gap-1 text-xs"
                title={`Current Theme: ${themeConfig.mode.toUpperCase()}`}
              >
                {themeConfig.mode === 'auto' ? (
                  <SunMoon className="w-4 h-4 text-amber-400" />
                ) : themeConfig.isDark ? (
                  <Moon className="w-4 h-4 text-blue-300" />
                ) : (
                  <Sun className="w-4 h-4 text-amber-400" />
                )}
              </button>

              {themeMenuOpen && (
                <div className="absolute right-0 mt-2 w-36 bg-slate-900 border border-blue-800/80 rounded-2xl shadow-2xl p-1.5 z-50 text-xs space-y-1">
                  <button
                    onClick={() => handleSetTheme('auto')}
                    className={`w-full px-2.5 py-1.5 rounded-xl flex items-center justify-between ${
                      themeConfig.mode === 'auto' ? 'bg-blue-600 text-white font-bold' : 'text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <SunMoon className="w-3.5 h-3.5 text-amber-300" /> Auto
                    </span>
                    {themeConfig.mode === 'auto' && <Check className="w-3.5 h-3.5" />}
                  </button>

                  <button
                    onClick={() => handleSetTheme('light')}
                    className={`w-full px-2.5 py-1.5 rounded-xl flex items-center justify-between ${
                      themeConfig.mode === 'light' ? 'bg-blue-600 text-white font-bold' : 'text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <Sun className="w-3.5 h-3.5 text-amber-400" /> Light
                    </span>
                    {themeConfig.mode === 'light' && <Check className="w-3.5 h-3.5" />}
                  </button>

                  <button
                    onClick={() => handleSetTheme('dark')}
                    className={`w-full px-2.5 py-1.5 rounded-xl flex items-center justify-between ${
                      themeConfig.mode === 'dark' ? 'bg-blue-600 text-white font-bold' : 'text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <Moon className="w-3.5 h-3.5 text-blue-300" /> Dark
                    </span>
                    {themeConfig.mode === 'dark' && <Check className="w-3.5 h-3.5" />}
                  </button>
                </div>
              )}
            </div>

            {/* Notifications */}
            <button
              onClick={onOpenNotifications}
              className="p-2 text-slate-200 hover:text-white bg-slate-900 hover:bg-blue-900/50 border border-blue-900/50 rounded-xl transition-all relative"
              title="Academic Notifications"
            >
              <Bell className="w-4 h-4 text-amber-400" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-500 shadow-[0_0_6px_#f43f5e] animate-pulse" />
              )}
            </button>

            {/* Offline Vault Badge */}
            <button
              onClick={onOpenOfflineVault}
              className={`p-2 sm:px-2.5 sm:py-1.5 rounded-xl border text-xs font-bold transition-all flex items-center gap-1.5 ${
                isOnline 
                  ? 'bg-slate-900 hover:bg-blue-900/50 border-blue-900/50 text-slate-200' 
                  : 'bg-amber-950 border-amber-500 text-amber-300 shadow-[0_0_10px_rgba(245,158,11,0.3)] animate-pulse'
              }`}
              title="KDLH Student Offline Study Vault"
            >
              <HardDrive className="w-4 h-4 text-blue-400" />
              <span className="hidden xl:inline uppercase tracking-wider text-[11px]">Vault</span>
              <span className={`w-2 h-2 rounded-full ${isOnline ? 'bg-emerald-400' : 'bg-amber-400'}`} />
            </button>

            {/* Role Profile & Sign In */}
            {currentUser ? (
              <button
                onClick={onOpenAuth}
                className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1.5 bg-blue-950/70 hover:bg-blue-900/80 rounded-2xl border border-blue-600/50 hover:border-amber-400/60 transition-all text-xs font-bold shadow-md"
              >
                <div className={`p-1 rounded-lg ${
                  currentUser.role === 'ADMIN' || currentUser.role === 'FOUNDER' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' :
                  currentUser.role === 'TEACHER' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                }`}>
                  {(currentUser.role === 'ADMIN' || currentUser.role === 'FOUNDER') && <ShieldCheck className="w-3.5 h-3.5" />}
                  {currentUser.role === 'TEACHER' && <GraduationCap className="w-3.5 h-3.5" />}
                  {currentUser.role === 'STUDENT' && <User className="w-3.5 h-3.5" />}
                </div>

                <div className="text-left hidden md:block font-mono max-w-[100px] truncate">
                  <span className="block text-white text-[11px] leading-tight truncate">{currentUser.name}</span>
                  <span className="block text-[9px] text-amber-400 font-semibold uppercase tracking-wider">
                    {currentUser.role === 'TEACHER' && currentUser.teacherApprovalStatus === 'PENDING' ? 'TEACHER (PENDING)' : currentUser.role}
                  </span>
                </div>

                <ChevronDown className="w-3 h-3 text-slate-300" />
              </button>
            ) : (
              <button
                onClick={onOpenAuth}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-black rounded-2xl font-bold text-xs uppercase tracking-wider transition-all shadow-[0_0_15px_rgba(245,158,11,0.4)]"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Sign In / Register</span>
              </button>
            )}


            {/* Mobile Hamburger Menu */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-slate-200 hover:text-white bg-slate-900 hover:bg-blue-900/50 border border-blue-900/50 rounded-xl"
              aria-label="Toggle Mobile Navigation"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 text-amber-400" /> : <Menu className="w-5 h-5 text-amber-400" />}
            </button>
          </div>

        </div>
      </div>

      {/* 3. Mobile Fast Horizontal Scrollable Strip (Ensures all tabs accessible instantly on phone) */}
      <div className="lg:hidden bg-slate-900/90 border-t border-blue-900/50 px-2 py-1.5 overflow-x-auto scrollbar-none flex items-center gap-1.5 scroll-touch">
        {visibleNavItems.map(item => {
          const isActive = activeRoute === item.route;
          return (
            <button
              key={item.key}
              onClick={() => onNavigate(item.route)}
              className={`px-3 py-1.5 rounded-xl whitespace-nowrap text-[11px] font-mono font-bold tracking-wider transition-all flex-shrink-0 ${
                isActive 
                  ? 'bg-blue-600 text-white shadow-[0_0_12px_rgba(37,99,235,0.6)] border border-blue-400' 
                  : item.highlight
                  ? 'bg-amber-950/60 text-amber-300 border border-amber-500/50'
                  : 'bg-black/40 text-slate-300 hover:text-white border border-blue-950'
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </div>

      {/* 4. Full Mobile Nav Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-slate-950/98 border-t border-blue-900/60 px-4 py-4 space-y-3 max-h-[80vh] overflow-y-auto backdrop-blur-2xl font-serif">
          <div className="grid grid-cols-2 gap-2 text-xs font-mono font-bold">
            {visibleNavItems.map(item => (
              <button
                key={item.key}
                onClick={() => {
                  onNavigate(item.route);
                  setMobileMenuOpen(false);
                }}
                className={`p-3 rounded-2xl text-left transition-all flex items-center gap-2 border ${
                  activeRoute === item.route 
                    ? 'bg-blue-600 text-white border-blue-400 shadow-[0_0_12px_rgba(37,99,235,0.6)]' 
                    : 'bg-slate-900 text-slate-200 border-blue-950 hover:border-blue-800'
                }`}
              >
                <span className="truncate">{item.label}</span>
              </button>
            ))}
          </div>

          <div className="pt-3 border-t border-blue-900/50 flex items-center justify-between text-xs font-mono text-slate-300">
            <span>Role: <strong className="text-amber-300">{currentUser.role}</strong></span>
            <button 
              onClick={() => {
                onOpenAuth();
                setMobileMenuOpen(false);
              }} 
              className="text-blue-300 hover:text-white font-bold underline"
            >
              Manage Account
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
