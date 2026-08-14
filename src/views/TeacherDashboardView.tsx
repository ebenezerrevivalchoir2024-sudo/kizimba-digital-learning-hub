import React from 'react';
import { 
  GraduationCap, 
  Upload, 
  FileText, 
  CheckCircle2, 
  Clock, 
  Users, 
  Camera, 
  CalendarCheck, 
  BarChart3, 
  BookOpen, 
  HelpCircle, 
  FolderPlus,
  Building
} from 'lucide-react';
import { UserProfile, KDLHResource } from '../types';

interface TeacherDashboardViewProps {
  currentUser: UserProfile;
  resources: KDLHResource[];
  onNavigate: (route: string) => void;
}

export const TeacherDashboardView: React.FC<TeacherDashboardViewProps> = ({
  currentUser,
  resources,
  onNavigate
}) => {
  const teacherUploads = resources.filter(r => r.category === 'TEACHER_RESOURCE');

  const teacherTools = [
    { title: 'Teacher Workspace', icon: <BookOpen className="w-5 h-5 text-emerald-400" />, route: '/teacher-workspace', desc: 'Schemes of work & lesson notes' },
    { title: 'AI Exam Scanner', icon: <Camera className="w-5 h-5 text-amber-400" />, route: '/exam-scanner', desc: 'Camera capture & automated marking' },
    { title: 'Questions & Quizzes', icon: <HelpCircle className="w-5 h-5 text-blue-400" />, route: '/questions', desc: 'Create & review topic tests' },
    { title: 'Attendance Register', icon: <CalendarCheck className="w-5 h-5 text-teal-400" />, route: '/attendance', desc: 'Daily roll call & student logs' },
    { title: 'Student Reports', icon: <BarChart3 className="w-5 h-5 text-sky-400" />, route: '/reports', desc: 'Academic performance report cards' },
    { title: 'Upload Resources', icon: <FolderPlus className="w-5 h-5 text-purple-400" />, route: '/teacher-resources', desc: 'Distribute study guides & files' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8 font-sans">
      
      {/* Teacher Portal Header */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 text-white p-6 sm:p-8 rounded-2xl shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 border border-emerald-800/40">
        <div className="flex items-center gap-5">
          {currentUser.avatarUrl ? (
            <img 
              src={currentUser.avatarUrl} 
              alt={currentUser.name} 
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover border-2 border-emerald-400 shadow-xl"
            />
          ) : (
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-emerald-900 border-2 border-emerald-400 flex items-center justify-center font-bold text-emerald-200 text-2xl shadow-xl">
              {currentUser.name.charAt(0)}
            </div>
          )}

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block">KDLH Educator Portal</span>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-mono font-bold px-2 py-0.5 rounded border border-emerald-500/30">
                {currentUser.role}
              </span>
            </div>
            <h1 className="text-2xl font-black text-white">{currentUser.name}</h1>
            <p className="text-xs text-emerald-200 flex items-center gap-2 font-mono">
              <Building className="w-4 h-4 text-emerald-400" /> {currentUser.school || 'Kizimba Secondary School'}
            </p>
          </div>
        </div>

        <button
          onClick={() => onNavigate('/teacher-resources')}
          className="px-6 py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-xl text-xs uppercase tracking-wide shadow-lg transition-colors flex items-center gap-2"
        >
          <Upload className="w-4 h-4" /> Manage & Upload Resources
        </button>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 font-mono">
        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-sm space-y-1">
          <span className="text-3xl font-black text-emerald-400">{teacherUploads.length}</span>
          <span className="block text-xs font-bold text-slate-400">Curriculum Files Uploaded</span>
        </div>

        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-sm space-y-1">
          <span className="text-3xl font-black text-blue-400">12</span>
          <span className="block text-xs font-bold text-slate-400">Classes Reached (Form I - VI)</span>
        </div>

        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-sm space-y-1">
          <span className="text-3xl font-black text-purple-400">100%</span>
          <span className="block text-xs font-bold text-slate-400">Syllabus Compliance</span>
        </div>
      </div>

      {/* Educator Tools Grid */}
      <div className="space-y-4">
        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">
          Educator Control Suite
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {teacherTools.map((tool, idx) => (
            <div
              key={idx}
              onClick={() => onNavigate(tool.route)}
              className="bg-slate-900 border border-slate-800 hover:border-emerald-500/50 p-6 rounded-2xl shadow-xl transition-all hover:-translate-y-0.5 cursor-pointer space-y-3 group"
            >
              <div className="p-3 bg-slate-950 rounded-xl w-fit border border-slate-800 group-hover:border-emerald-500/30">
                {tool.icon}
              </div>
              <div>
                <h3 className="font-bold text-sm text-white group-hover:text-emerald-400 transition-colors">
                  {tool.title}
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  {tool.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
