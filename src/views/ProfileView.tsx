import React, { useState } from 'react';
import { 
  User, 
  Camera, 
  Upload, 
  ShieldCheck, 
  GraduationCap, 
  Sparkles, 
  CheckCircle2, 
  Mail, 
  Building, 
  BookOpen, 
  Award,
  Save
} from 'lucide-react';
import { UserProfile } from '../types';

interface ProfileViewProps {
  currentUser: UserProfile;
  onUpdateUser?: (updated: UserProfile) => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({ currentUser, onUpdateUser }) => {
  const [name, setName] = useState(currentUser.name);
  const [school, setSchool] = useState(currentUser.school || 'Kizimba Secondary School');
  const [form, setForm] = useState(currentUser.form || 'Form IV');
  const [avatarUrl, setAvatarUrl] = useState(currentUser.avatarUrl || '');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      setAvatarUrl(base64);
    };
    reader.readAsDataURL(file);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedUser: UserProfile = {
      ...currentUser,
      name,
      school,
      form: currentUser.role === 'STUDENT' ? form : undefined,
      avatarUrl
    };

    if (onUpdateUser) {
      onUpdateUser(updatedUser);
    }

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8 font-sans">
      
      {/* Profile Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-cyan-950 to-slate-900 border border-cyan-800/40 rounded-2xl p-6 sm:p-8 shadow-2xl text-white flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          {/* Avatar with Camera Overlay */}
          <div className="relative group">
            {avatarUrl ? (
              <img 
                src={avatarUrl} 
                alt={name} 
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-4 border-cyan-400 shadow-xl"
              />
            ) : (
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-cyan-950 border-4 border-cyan-400 flex items-center justify-center font-bold text-cyan-300 text-3xl shadow-xl">
                {name.charAt(0)}
              </div>
            )}

            <label className="absolute bottom-0 right-0 p-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 rounded-full cursor-pointer shadow-lg transition-transform group-hover:scale-110">
              <Camera className="w-4 h-4" />
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleImageUpload} 
                className="hidden" 
              />
            </label>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black">{name}</h1>
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase border ${
                currentUser.role === 'FOUNDER' ? 'bg-purple-950 border-purple-500 text-purple-300' :
                currentUser.role === 'ADMIN' ? 'bg-amber-950 border-amber-500 text-amber-300' :
                currentUser.role === 'TEACHER' ? 'bg-emerald-950 border-emerald-500 text-emerald-300' : 'bg-cyan-950 border-cyan-500 text-cyan-300'
              }`}>
                {currentUser.role}
              </span>
            </div>
            <p className="text-xs text-slate-300 flex items-center gap-1">
              <Building className="w-3.5 h-3.5 text-cyan-400" /> {school} {currentUser.form ? `• ${currentUser.form}` : ''}
            </p>
            <p className="text-xs text-slate-400 font-mono flex items-center gap-1">
              <Mail className="w-3.5 h-3.5 text-slate-500" /> {currentUser.email}
            </p>
          </div>
        </div>

        {/* Member Badge */}
        <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 text-xs font-mono text-center space-y-1 min-w-[160px]">
          <span className="text-cyan-400 font-bold block">KDLH Account Status</span>
          <span className="text-emerald-400 font-black text-sm block">ACTIVE</span>
          <span className="text-slate-500 text-[10px]">Joined {currentUser.joinedDate || '2025'}</span>
        </div>
      </div>

      {/* Edit Profile Form */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl space-y-6 text-slate-200">
        <div className="border-b border-slate-800 pb-4 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <User className="w-5 h-5 text-cyan-400" /> Profile Information & Avatar Settings
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">Manage your user details and profile picture.</p>
          </div>

          {savedSuccess && (
            <span className="text-xs font-bold text-emerald-400 bg-emerald-950/80 border border-emerald-500/50 px-3 py-1 rounded-lg flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" /> Profile Updated!
            </span>
          )}
        </div>

        <form onSubmit={handleSaveProfile} className="space-y-4 text-xs font-sans">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-400 font-mono font-bold uppercase mb-1">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-cyan-500 font-sans"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-mono font-bold uppercase mb-1">School / Institution</label>
              <input
                type="text"
                value={school}
                onChange={(e) => setSchool(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-cyan-500 font-sans"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {currentUser.role === 'STUDENT' && (
              <div>
                <label className="block text-slate-400 font-mono font-bold uppercase mb-1">Form Level</label>
                <select
                  value={form}
                  onChange={(e) => setForm(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-cyan-500 font-sans"
                >
                  <option value="Form I">Form I</option>
                  <option value="Form II">Form II</option>
                  <option value="Form III">Form III</option>
                  <option value="Form IV">Form IV</option>
                  <option value="Form V">Form V</option>
                  <option value="Form VI">Form VI</option>
                </select>
              </div>
            )}

            <div>
              <label className="block text-slate-400 font-mono font-bold uppercase mb-1">Profile Image URL or Upload</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="https://example.com/avatar.jpg"
                  value={avatarUrl}
                  onChange={(e) => setAvatarUrl(e.target.value)}
                  className="flex-1 px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-cyan-500 font-sans"
                />
                <label className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-cyan-300 font-bold rounded-xl cursor-pointer border border-cyan-500/30 flex items-center gap-1.5 whitespace-nowrap">
                  <Upload className="w-4 h-4" /> Upload Photo
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                </label>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 flex justify-end">
            <button
              type="submit"
              className="px-6 py-2.5 bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-400 hover:to-emerald-500 text-slate-950 font-bold rounded-xl shadow-lg flex items-center gap-2"
            >
              <Save className="w-4 h-4" /> Save Profile Changes
            </button>
          </div>
        </form>
      </div>

    </div>
  );
};
