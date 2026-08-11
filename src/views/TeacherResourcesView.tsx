import React, { useState } from 'react';
import { Briefcase, Upload, CheckCircle2, Clock, FileText, AlertCircle } from 'lucide-react';
import { TeacherResourceItem, KDLHResource, Subject, UserProfile } from '../types';
import { KdlhStorageService } from '../services/storage';

interface TeacherResourcesViewProps {
  resources: KDLHResource[];
  subjects: Subject[];
  currentUser: UserProfile;
  onRefreshResources: () => void;
}

export const TeacherResourcesView: React.FC<TeacherResourcesViewProps> = ({
  resources,
  subjects,
  currentUser,
  onRefreshResources
}) => {
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [subjectId, setSubjectId] = useState(subjects[0]?.id || 'sub-chem');
  const [formLevel, setFormLevel] = useState('Form IV');
  const [subtype, setSubtype] = useState<TeacherResourceItem['resourceSubtype']>('SCHEME_OF_WORK');
  const [submitted, setSubmitted] = useState(false);

  const teacherResources = resources.filter(r => r.category === 'TEACHER_RESOURCE') as TeacherResourceItem[];

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const selSub = subjects.find(s => s.id === subjectId);
    
    const newResource: TeacherResourceItem = {
      id: `tr-custom-${Date.now()}`,
      title,
      description,
      category: 'TEACHER_RESOURCE',
      resourceSubtype: subtype,
      subjectId,
      subjectName: selSub?.name || 'Chemistry',
      form: formLevel,
      topic: 'Teacher Curriculum Resource',
      author: currentUser.name,
      authorRole: currentUser.role === 'TEACHER' ? 'Secondary Educator' : 'Administrator',
      uploaderId: currentUser.id,
      dateAdded: new Date().toISOString().split('T')[0],
      views: 1,
      downloads: 0,
      featured: false,
      approvalStatus: currentUser.role === 'ADMIN' ? 'APPROVED' : 'PENDING',
      permissionStatus: 'SCHOOL_OWNED',
      tags: ['Teacher Resource', selSub?.name || 'Chemistry', formLevel]
    };

    KdlhStorageService.addResource(newResource);
    onRefreshResources();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setShowUploadForm(false);
      setTitle('');
      setDescription('');
    }, 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-8 rounded-2xl shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 border border-slate-800">
        <div className="space-y-2">
          <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block">
            KDLH Educator Hub
          </span>
          <h1 className="text-2xl sm:text-4xl font-black">Teacher Resource Center</h1>
          <p className="text-sm text-slate-300 max-w-xl leading-relaxed">
            Protected repository for Kizimba Secondary School teachers. Access schemes of work, lesson plans, teaching aids, and assessment rubrics.
          </p>
        </div>

        <button
          onClick={() => setShowUploadForm(!showUploadForm)}
          className="px-6 py-3.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black rounded-xl text-xs uppercase tracking-wide shadow-lg transition-colors flex items-center gap-2 flex-shrink-0"
        >
          <Upload className="w-4 h-4" /> Upload New Resource
        </button>
      </div>

      {/* Upload Form Drawer */}
      {showUploadForm && (
        <form onSubmit={handleUploadSubmit} className="bg-white p-8 rounded-2xl border border-slate-200/80 shadow-lg space-y-4 max-w-2xl mx-auto animate-in fade-in duration-200">
          <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-2">Submit Teacher Resource</h3>

          {submitted && (
            <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" /> Resource submitted successfully! {currentUser.role === 'TEACHER' ? 'Sent for Admin approval.' : 'Published immediately.'}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-bold">
            <div>
              <label className="block text-slate-700 mb-1">Resource Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Form IV Chemistry Scheme of Work"
                required
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs"
              />
            </div>

            <div>
              <label className="block text-slate-700 mb-1">Resource Type</label>
              <select
                value={subtype}
                onChange={(e) => setSubtype(e.target.value as any)}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs"
              >
                <option value="SCHEME_OF_WORK">Scheme of Work</option>
                <option value="LESSON_PLAN">Lesson Plan</option>
                <option value="TEACHING_AID">Teaching Aid</option>
                <option value="ASSESSMENT">Assessment / Test</option>
                <option value="MARKING_SCHEME">Marking Scheme</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-700 mb-1">Subject</label>
              <select
                value={subjectId}
                onChange={(e) => setSubjectId(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs"
              >
                {subjects.map(s => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-700 mb-1">Form Level</label>
              <select
                value={formLevel}
                onChange={(e) => setFormLevel(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs"
              >
                <option value="Form I">Form I</option>
                <option value="Form II">Form II</option>
                <option value="Form III">Form III</option>
                <option value="Form IV">Form IV</option>
                <option value="Form V">Form V</option>
                <option value="Form VI">Form VI</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Description / Teaching Notes</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide curriculum alignment details and objectives..."
              required
              className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-xs h-24"
            />
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              className="flex-1 py-3 bg-blue-700 hover:bg-blue-800 text-white rounded-xl font-bold text-xs uppercase tracking-wide"
            >
              Submit Resource
            </button>
            <button
              type="button"
              onClick={() => setShowUploadForm(false)}
              className="px-4 py-3 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-xl font-bold text-xs"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Teacher Resources List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {teacherResources.map(tr => (
          <div key={tr.id} className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-md space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded">
                {tr.resourceSubtype.replace(/_/g, ' ')} • {tr.form}
              </span>
              <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                tr.approvalStatus === 'APPROVED' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
              }`}>
                {tr.approvalStatus}
              </span>
            </div>

            <h3 className="font-bold text-slate-900 text-base">{tr.title}</h3>
            <p className="text-xs text-slate-600 line-clamp-2">{tr.description}</p>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>Author: {tr.author}</span>
              <span>Added: {tr.dateAdded}</span>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
