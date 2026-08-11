import React, { useState } from 'react';
import { X, User, ShieldCheck, GraduationCap, CheckCircle2 } from 'lucide-react';
import { UserRole, UserProfile } from '../../types';
import { DEMO_USERS } from '../../data/mockData';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  onSelectUser: (user: UserProfile) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onSelectUser
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState<'LOGIN' | 'PRESETS'>('PRESETS');

  if (!isOpen) return null;

  const handleCustomLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    const custom: UserProfile = {
      id: `user-custom-${Date.now()}`,
      name: email.split('@')[0].toUpperCase(),
      email,
      role: 'STUDENT',
      form: 'Form IV',
      school: 'Kizimba Secondary School',
      joinedDate: new Date().toISOString().split('T')[0],
      streakDays: 1
    };
    onSelectUser(custom);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 font-mono">
      <div className="bg-black/90 rounded-2xl w-full max-w-md shadow-[0_0_30px_rgba(6,182,212,0.2)] border border-cyan-900/50 overflow-hidden animate-in fade-in zoom-in duration-200 text-cyan-100">
        
        {/* Header */}
        <div className="bg-cyan-950/80 text-white p-6 relative border-b border-cyan-900/50">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-1 text-cyan-400 hover:text-white rounded"
          >
            <X className="w-5 h-5" />
          </button>
          
          <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest block mb-1">
            Authentication & Role Access
          </span>
          <h3 className="text-xl font-bold uppercase tracking-wider">KDLH Account Portal</h3>
          <p className="text-xs text-cyan-300/80 font-sans mt-1">Select role account preset or sign in with credentials.</p>
        </div>

        {/* Tab Toggle */}
        <div className="flex border-b border-cyan-900/50 bg-black/60 text-xs font-bold">
          <button
            onClick={() => setActiveTab('PRESETS')}
            className={`flex-1 py-3 text-center border-b-2 transition-all uppercase tracking-wider ${
              activeTab === 'PRESETS' ? 'border-cyan-400 text-cyan-400 bg-cyan-950/30' : 'border-transparent text-cyan-400/70 hover:text-cyan-200'
            }`}
          >
            Quick Role Switcher
          </button>
          <button
            onClick={() => setActiveTab('LOGIN')}
            className={`flex-1 py-3 text-center border-b-2 transition-all uppercase tracking-wider ${
              activeTab === 'LOGIN' ? 'border-cyan-400 text-cyan-400 bg-cyan-950/30' : 'border-transparent text-cyan-400/70 hover:text-cyan-200'
            }`}
          >
            Custom Sign In
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          {activeTab === 'PRESETS' ? (
            <div className="space-y-3">
              <p className="text-xs font-semibold text-cyan-400/80 mb-2 font-sans">Select a user role preset to test role permissions:</p>
              
              {DEMO_USERS.map(u => {
                const isCurrent = currentUser.id === u.id;
                return (
                  <div
                    key={u.id}
                    onClick={() => {
                      onSelectUser(u);
                      onClose();
                    }}
                    className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                      isCurrent 
                        ? 'border-cyan-400 bg-cyan-950/60 shadow-[0_0_10px_#22d3ee]' 
                        : 'border-cyan-900/40 bg-black/40 hover:border-cyan-500/50 hover:bg-cyan-950/30'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2.5 rounded-lg border ${
                        u.role === 'ADMIN' ? 'bg-amber-950/80 border-amber-500/50 text-amber-300' :
                        u.role === 'TEACHER' ? 'bg-emerald-950/80 border-emerald-500/50 text-emerald-300' : 'bg-cyan-950/80 border-cyan-500/50 text-cyan-300'
                      }`}>
                        {u.role === 'ADMIN' && <ShieldCheck className="w-5 h-5" />}
                        {u.role === 'TEACHER' && <GraduationCap className="w-5 h-5" />}
                        {u.role === 'STUDENT' && <User className="w-5 h-5" />}
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-sm text-white uppercase tracking-wider">{u.name}</h4>
                          <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded uppercase border ${
                            u.role === 'ADMIN' ? 'bg-amber-950 border-amber-500 text-amber-300' :
                            u.role === 'TEACHER' ? 'bg-emerald-950 border-emerald-500 text-emerald-300' : 'bg-cyan-950 border-cyan-500 text-cyan-300'
                          }`}>
                            {u.role}
                          </span>
                        </div>
                        <p className="text-xs text-cyan-300/70 font-sans">{u.email} • {u.form || u.school}</p>
                      </div>
                    </div>

                    {isCurrent && <CheckCircle2 className="w-5 h-5 text-cyan-400 flex-shrink-0 animate-pulse" />}
                  </div>
                );
              })}
            </div>
          ) : (
            <form onSubmit={handleCustomLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-cyan-400 uppercase tracking-wider mb-1">School Email Address</label>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="student@kizimba.ac.tz" 
                  required
                  className="w-full px-3.5 py-2 rounded-lg bg-black/60 border border-cyan-900/50 text-sm text-white placeholder:text-cyan-600 focus:outline-none focus:border-cyan-400 font-sans"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-cyan-400 uppercase tracking-wider mb-1">Password</label>
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••" 
                  required
                  className="w-full px-3.5 py-2 rounded-lg bg-black/60 border border-cyan-900/50 text-sm text-white placeholder:text-cyan-600 focus:outline-none focus:border-cyan-400 font-sans"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-cyan-400 text-black rounded-lg font-bold text-xs uppercase tracking-wider hover:bg-cyan-300 transition-all shadow-[0_0_10px_#22d3ee]"
              >
                Sign In to Platform
              </button>
            </form>
          )}
        </div>

        {/* Footer */}
        <div className="bg-black/80 p-3 text-center border-t border-cyan-900/50 text-xs text-cyan-400/80">
          Kizimba Secondary School • KDLH Role Engine
        </div>

      </div>
    </div>
  );
};
