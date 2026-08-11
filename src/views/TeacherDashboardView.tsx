import React from 'react';
import { GraduationCap, Upload, FileText, CheckCircle2, Clock, Users } from 'lucide-react';
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      
      {/* Teacher Portal Header */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-indigo-950 text-white p-8 rounded-2xl shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 border border-emerald-800/40">
        <div className="space-y-2">
          <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block">KDLH Teacher Portal</span>
          <h1 className="text-2xl sm:text-3xl font-black">Educator Workspace: {currentUser.name}</h1>
          <p className="text-xs sm:text-sm text-emerald-200">Secondary Educator • Kizimba Secondary School</p>
        </div>

        <button
          onClick={() => onNavigate('/teacher-resources')}
          className="px-6 py-3.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black rounded-xl text-xs uppercase tracking-wide shadow-lg transition-colors flex items-center gap-2"
        >
          <Upload className="w-4 h-4" /> Manage & Upload Resources
        </button>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-1">
          <span className="text-3xl font-black text-emerald-700">{teacherUploads.length}</span>
          <span className="block text-xs font-bold text-slate-600">Curriculum Files Uploaded</span>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-1">
          <span className="text-3xl font-black text-blue-700">12</span>
          <span className="block text-xs font-bold text-slate-600">Classes Reached (Form I - VI)</span>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-1">
          <span className="text-3xl font-black text-purple-700">100%</span>
          <span className="block text-xs font-bold text-slate-600">Syllabus Compliance</span>
        </div>
      </div>

    </div>
  );
};
