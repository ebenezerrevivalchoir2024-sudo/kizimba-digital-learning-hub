import React, { useState } from 'react';
import { 
  X, 
  User, 
  ShieldCheck, 
  GraduationCap, 
  CheckCircle2, 
  Lock, 
  Mail, 
  AlertCircle, 
  Loader2, 
  Phone, 
  KeyRound, 
  School,
  Info
} from 'lucide-react';
import { UserRole, UserProfile } from '../../types';
import { AuthService } from '../../services/authService';

interface AuthModalProps {
  isOpen: boolean;
  onClose?: () => void;
  currentUser?: UserProfile | null;
  onSelectUser: (user: UserProfile) => void;
  isGated?: boolean;
}

type AuthTab = 'SIGN_IN' | 'REGISTER' | 'PHONE' | 'ADMIN_PORTAL' | 'RESET';

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onSelectUser,
  isGated = false
}) => {
  const [activeTab, setActiveTab] = useState<AuthTab>('SIGN_IN');
  
  // Sign In Form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Phone Auth state
  const [phoneNum, setPhoneNum] = useState('+255 ');
  const [phoneOtp, setPhoneOtp] = useState('');
  const [phoneName, setPhoneName] = useState('');
  const [phoneRole, setPhoneRole] = useState<UserRole>('STUDENT');
  const [phoneForm, setPhoneForm] = useState('Form IV');
  const [phoneSubjects, setPhoneSubjects] = useState('Chemistry, Biology');
  const [otpSent, setOtpSent] = useState(false);

  // Admin Portal Auth state
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [adminSecretKey, setAdminSecretKey] = useState('');

  // Register Form state
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regPhone, setRegPhone] = useState('+255 ');
  const [regRole, setRegRole] = useState<UserRole>('STUDENT');
  const [regSchool, setRegSchool] = useState('Kizimba Secondary School');
  const [regForm, setRegForm] = useState('Form IV');
  const [regSubjects, setRegSubjects] = useState('Chemistry');

  // Password Reset state
  const [resetEmail, setResetEmail] = useState('');

  // UI state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const clearMessages = () => {
    setError(null);
    setSuccessMessage(null);
  };

  const handleTabChange = (tab: AuthTab) => {
    clearMessages();
    setActiveTab(tab);
  };

  const handleGoogleLoginSubmit = async () => {
    clearMessages();
    setLoading(true);

    try {
      const userProfile = await AuthService.loginWithGoogle(regRole);
      onSelectUser(userProfile);
      setSuccessMessage('Google authentication verified. Access granted.');
      setTimeout(() => {
        if (onClose) onClose();
      }, 500);
    } catch (err: any) {
      console.error('Google Auth error:', err);
      setError(err.message || 'Google authentication failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearMessages();
    setLoading(true);

    try {
      const userProfile = await AuthService.login(loginEmail, loginPassword);
      onSelectUser(userProfile);
      setSuccessMessage('Welcome back to Kizimba Digital Learning Hub!');
      setTimeout(() => {
        if (onClose) onClose();
      }, 500);
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.message || 'Failed to sign in. Please verify your email and password.');
    } finally {
      setLoading(false);
    }
  };

  const handlePhoneSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    clearMessages();
    const clean = phoneNum.trim().replace(/[\s\-()]/g, '');
    if (!clean || clean.length < 10) {
      setError('Please enter a valid Tanzanian mobile phone number (+255...).');
      return;
    }
    setLoading(true);

    try {
      await AuthService.sendPhoneOtp(phoneNum, 'recaptcha-container');
      setOtpSent(true);
      setPhoneOtp('');
      setSuccessMessage(`Official SMS OTP code sent to ${phoneNum}. Please enter the 6-digit code below.`);
    } catch (err: any) {
      console.error('Phone OTP error:', err);
      setError(err?.message || 'Failed to send SMS OTP code. Please verify your phone number and network connection.');
    } finally {
      setLoading(false);
    }
  };

  const handlePhoneVerifySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearMessages();
    setLoading(true);

    try {
      const subjectsArray = phoneRole === 'TEACHER' ? phoneSubjects.split(',').map(s => s.trim()).filter(Boolean) : undefined;
      const userProfile = await AuthService.verifyPhoneOtpAndSignIn(phoneOtp, {
        phoneNum,
        name: phoneName.trim() || `User ${phoneNum.slice(-4)}`,
        role: phoneRole,
        form: phoneRole === 'STUDENT' ? phoneForm : undefined,
        school: 'Kizimba Secondary School',
        subjects: subjectsArray
      });

      onSelectUser(userProfile);
      setSuccessMessage(
        phoneRole === 'TEACHER' 
          ? 'Phone registration verified! Teacher application submitted for Admin approval.' 
          : 'Phone authentication successful! Entering KDLH learning portal...'
      );
      setTimeout(() => {
        if (onClose) onClose();
      }, 800);
    } catch (err: any) {
      setError(err.message || 'Invalid SMS verification code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAdminLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearMessages();
    setLoading(true);

    try {
      const adminProfile = await AuthService.loginAdminPortal(adminEmail, adminPassword, adminSecretKey);
      onSelectUser(adminProfile);
      setSuccessMessage('Administrative master clearance verified. Access granted.');
      setTimeout(() => {
        if (onClose) onClose();
      }, 600);
    } catch (err: any) {
      setError(err.message || 'Administrative verification failed. Invalid credentials or clearance key.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearMessages();

    if (!regName.trim() || !regEmail.trim() || !regPassword) {
      setError('Please fill in all required fields.');
      return;
    }

    if (regPassword.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);

    try {
      const subjectsArray = regRole === 'TEACHER' ? regSubjects.split(',').map(s => s.trim()).filter(Boolean) : undefined;
      const newUser = await AuthService.register({
        email: regEmail.trim(),
        password: regPassword,
        name: regName.trim(),
        phone: regPhone.trim().length >= 10 ? regPhone.trim() : undefined,
        role: regRole,
        school: regSchool,
        form: regRole === 'STUDENT' ? regForm : undefined,
        subjects: subjectsArray
      });
      
      onSelectUser(newUser);
      setSuccessMessage(
        regRole === 'TEACHER'
          ? 'Teacher account created! Application submitted to Admin for verification.'
          : 'Student account registered successfully! Welcome to KDLH.'
      );
      setTimeout(() => {
        if (onClose) onClose();
      }, 800);
    } catch (err: any) {
      console.error('Registration error:', err);
      setError(err.message || 'Failed to create account. Email may already be registered.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearMessages();

    if (!resetEmail) {
      setError('Please enter your registered email address.');
      return;
    }

    setLoading(true);

    try {
      await AuthService.sendPasswordReset(resetEmail.trim());
      setSuccessMessage('Password reset link sent to your email inbox.');
    } catch (err: any) {
      console.error('Reset password error:', err);
      setError(err.message || 'Unable to send password reset email.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 font-serif ${isGated ? 'bg-slate-950/95' : ''}`}>
      {/* Invisible reCAPTCHA container for Firebase Phone Auth */}
      <div id="recaptcha-container"></div>

      <div className="bg-slate-950 rounded-3xl w-full max-w-lg shadow-[0_0_60px_rgba(37,99,235,0.45)] border border-blue-600/50 overflow-hidden text-slate-100 max-h-[94vh] flex flex-col">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-blue-900 text-white p-5 relative border-b border-blue-700/50 flex-shrink-0">
          {!isGated && onClose && (
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 p-1.5 text-slate-300 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
          
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-bold text-amber-300 uppercase tracking-widest flex items-center gap-1 font-mono">
              <School className="w-3.5 h-3.5" /> Kizimba Secondary School
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black uppercase tracking-wider text-white">
            {isGated ? 'KDLH Secure Registration Gate' : 'KDLH Authentication Portal'}
          </h3>
          <p className="text-xs text-blue-200 font-sans mt-0.5">
            {isGated 
              ? 'Authentication required before accessing KDLH curriculum & learning hub.' 
              : 'Role-based authentication for Students, Teachers & Administrators.'}
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-blue-900/60 bg-black/70 text-[11px] font-bold flex-shrink-0 overflow-x-auto scrollbar-none">
          <button
            onClick={() => handleTabChange('SIGN_IN')}
            className={`py-3 px-3 text-center border-b-2 transition-all uppercase tracking-wider whitespace-nowrap flex-1 ${
              activeTab === 'SIGN_IN' ? 'border-amber-400 text-amber-300 bg-blue-950/40' : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            User Login
          </button>

          <button
            onClick={() => handleTabChange('PHONE')}
            className={`py-3 px-3 text-center border-b-2 transition-all uppercase tracking-wider whitespace-nowrap flex-1 ${
              activeTab === 'PHONE' ? 'border-amber-400 text-amber-300 bg-blue-950/40' : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            Phone SMS
          </button>

          <button
            onClick={() => handleTabChange('REGISTER')}
            className={`py-3 px-3 text-center border-b-2 transition-all uppercase tracking-wider whitespace-nowrap flex-1 ${
              activeTab === 'REGISTER' ? 'border-amber-400 text-amber-300 bg-blue-950/40' : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            Register
          </button>

          <button
            onClick={() => handleTabChange('ADMIN_PORTAL')}
            className={`py-3 px-3 text-center border-b-2 transition-all uppercase tracking-wider whitespace-nowrap flex-1 ${
              activeTab === 'ADMIN_PORTAL' ? 'border-red-500 text-red-400 bg-red-950/30' : 'border-transparent text-red-400/80 hover:text-red-300'
            }`}
          >
            Admin Portal 🛡️
          </button>
        </div>

        {/* Alerts */}
        {(error || successMessage) && (
          <div className="p-4 bg-black/40 border-b border-blue-900/50 flex-shrink-0">
            {error && (
              <div className="p-3 bg-rose-950/90 border border-rose-500/60 text-rose-200 text-xs rounded-xl flex items-start gap-2.5 font-sans">
                <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}
            {successMessage && (
              <div className="p-3 bg-emerald-950/90 border border-emerald-500/60 text-emerald-200 text-xs rounded-xl flex items-start gap-2.5 font-sans">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span>{successMessage}</span>
              </div>
            )}
          </div>
        )}

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto flex-1 font-sans text-sm">
          
          {/* TAB 1: STANDARD EMAIL SIGN IN */}
          {activeTab === 'SIGN_IN' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-mono font-bold text-amber-300 uppercase tracking-wider mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-3 text-blue-400" />
                  <input 
                    type="email" 
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="student@kizimba.ac.tz" 
                    required
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-slate-900/90 border border-blue-900/60 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-xs font-mono font-bold text-amber-300 uppercase tracking-wider">Password</label>
                  <button 
                    type="button" 
                    onClick={() => handleTabChange('RESET')}
                    className="text-xs text-blue-300 hover:text-white underline font-mono"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-3 text-blue-400" />
                  <input 
                    type="password" 
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••" 
                    required
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-slate-900/90 border border-blue-900/60 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-blue-700 to-indigo-700 hover:from-blue-600 hover:to-indigo-600 text-white rounded-xl font-mono font-bold text-xs uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(37,99,235,0.4)] flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Sign In with Email'}
              </button>

              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-800"></div></div>
                <div className="relative flex justify-center text-[10px] font-mono uppercase"><span className="bg-slate-950 px-2 text-slate-400">Or continue with</span></div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={handleGoogleLoginSubmit}
                  disabled={loading}
                  className="py-2.5 px-3 bg-slate-900 hover:bg-slate-800 text-slate-100 border border-slate-700 rounded-xl font-mono font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                  </svg>
                  <span>Google</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleTabChange('PHONE')}
                  className="py-2.5 px-3 bg-slate-900 hover:bg-slate-800 text-slate-100 border border-slate-700 rounded-xl font-mono font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2"
                >
                  <Phone className="w-4 h-4 text-emerald-400" />
                  <span>Phone SMS</span>
                </button>
              </div>
            </form>
          )}

          {/* TAB 2: PHONE SMS AUTHENTICATION */}
          {activeTab === 'PHONE' && (
            <div className="space-y-4">
              <p className="text-xs text-slate-300 font-sans leading-relaxed">
                Log in or register using your Tanzanian mobile phone number (+255). We will verify your identity via SMS code.
              </p>

              {!otpSent ? (
                <form onSubmit={handlePhoneSendOtp} className="space-y-3.5">
                  <div>
                    <label className="block text-xs font-mono font-bold text-amber-300 uppercase tracking-wider mb-1">Mobile Phone Number</label>
                    <div className="relative">
                      <Phone className="w-4 h-4 absolute left-3 top-3 text-emerald-400" />
                      <input 
                        type="tel" 
                        value={phoneNum}
                        onChange={(e) => setPhoneNum(e.target.value)}
                        placeholder="+255 712 345 678" 
                        required
                        className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-slate-900/90 border border-blue-900/60 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-400 font-mono"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 bg-emerald-700 hover:bg-emerald-600 text-white rounded-xl font-mono font-bold text-xs uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(16,185,129,0.4)] flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Request SMS Code'}
                  </button>
                </form>
              ) : (
                <form onSubmit={handlePhoneVerifySubmit} className="space-y-3.5">
                  <div>
                    <label className="block text-xs font-mono font-bold text-amber-300 uppercase tracking-wider mb-1">Your Full Name</label>
                    <input 
                      type="text" 
                      value={phoneName}
                      onChange={(e) => setPhoneName(e.target.value)}
                      placeholder="e.g. Mussa Selemani" 
                      required
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/90 border border-blue-900/60 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-mono font-bold text-amber-300 uppercase tracking-wider mb-1">Identify As</label>
                      <select 
                        value={phoneRole}
                        onChange={(e) => setPhoneRole(e.target.value as UserRole)}
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-blue-900/60 text-xs text-white focus:outline-none focus:border-amber-400 font-mono"
                      >
                        <option value="STUDENT">Student (Form I - VI)</option>
                        <option value="TEACHER">Teacher</option>
                      </select>
                    </div>

                    {phoneRole === 'STUDENT' ? (
                      <div>
                        <label className="block text-xs font-mono font-bold text-amber-300 uppercase tracking-wider mb-1">Class Form</label>
                        <select 
                          value={phoneForm}
                          onChange={(e) => setPhoneForm(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-blue-900/60 text-xs text-white focus:outline-none focus:border-amber-400 font-mono"
                        >
                          <option value="Form I">Form I</option>
                          <option value="Form II">Form II</option>
                          <option value="Form III">Form III</option>
                          <option value="Form IV">Form IV</option>
                          <option value="Form V">Form V</option>
                          <option value="Form VI">Form VI</option>
                        </select>
                      </div>
                    ) : (
                      <div>
                        <label className="block text-xs font-mono font-bold text-amber-300 uppercase tracking-wider mb-1">Teaching Subjects</label>
                        <input 
                          type="text" 
                          value={phoneSubjects}
                          onChange={(e) => setPhoneSubjects(e.target.value)}
                          placeholder="e.g. Chemistry, Biology" 
                          className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-blue-900/60 text-xs text-white focus:outline-none focus:border-amber-400"
                        />
                      </div>
                    )}
                  </div>

                  {phoneRole === 'TEACHER' && (
                    <div className="p-2.5 bg-amber-950/40 border border-amber-500/40 rounded-xl flex items-start gap-2 text-[11px] text-amber-200">
                      <Info className="w-4 h-4 flex-shrink-0 text-amber-400 mt-0.5" />
                      <span>Teacher accounts require administrative verification by Kizimba Secondary School Head of School / Admin before full exam marking and publication tools activate.</span>
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-mono font-bold text-amber-300 uppercase tracking-wider mb-1">Enter 6-Digit SMS Code</label>
                    <div className="relative">
                      <KeyRound className="w-4 h-4 absolute left-3 top-3 text-amber-400" />
                      <input 
                        type="text" 
                        value={phoneOtp}
                        onChange={(e) => setPhoneOtp(e.target.value)}
                        placeholder="••••••" 
                        maxLength={6}
                        required
                        className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-slate-900/90 border border-blue-900/60 text-sm text-white font-mono tracking-widest focus:outline-none focus:border-amber-400"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl font-mono font-bold text-xs uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(16,185,129,0.4)] flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Verify & Enter KDLH'}
                  </button>

                  <button
                    type="button"
                    onClick={() => setOtpSent(false)}
                    className="w-full text-center text-xs text-slate-400 hover:text-white underline font-mono"
                  >
                    Change Phone Number
                  </button>
                </form>
              )}
            </div>
          )}

          {/* TAB 3: REGISTER NEW USER */}
          {activeTab === 'REGISTER' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-mono font-bold text-amber-300 uppercase tracking-wider mb-1">Full Legal Name</label>
                <input 
                  type="text" 
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  placeholder="e.g. Baraka Juma" 
                  required
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-900/90 border border-blue-900/60 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-mono font-bold text-amber-300 uppercase tracking-wider mb-1">Email Address</label>
                <input 
                  type="email" 
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  placeholder="baraka@kizimba.ac.tz" 
                  required
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-900/90 border border-blue-900/60 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-mono font-bold text-amber-300 uppercase tracking-wider mb-1">Phone Number (+255)</label>
                <input 
                  type="tel" 
                  value={regPhone}
                  onChange={(e) => setRegPhone(e.target.value)}
                  placeholder="+255 712 345 678" 
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-900/90 border border-blue-900/60 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-400 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-mono font-bold text-amber-300 uppercase tracking-wider mb-1">Password</label>
                <input 
                  type="password" 
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  placeholder="At least 6 characters" 
                  required
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-900/90 border border-blue-900/60 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono font-bold text-amber-300 uppercase tracking-wider mb-1">Account Role</label>
                  <select 
                    value={regRole}
                    onChange={(e) => setRegRole(e.target.value as UserRole)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-blue-900/60 text-xs text-white focus:outline-none focus:border-amber-400 font-mono"
                  >
                    <option value="STUDENT">Student</option>
                    <option value="TEACHER">Teacher</option>
                  </select>
                </div>

                {regRole === 'STUDENT' ? (
                  <div>
                    <label className="block text-xs font-mono font-bold text-amber-300 uppercase tracking-wider mb-1">Class / Form</label>
                    <select 
                      value={regForm}
                      onChange={(e) => setRegForm(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-blue-900/60 text-xs text-white focus:outline-none focus:border-amber-400 font-mono"
                    >
                      <option value="Form I">Form I</option>
                      <option value="Form II">Form II</option>
                      <option value="Form III">Form III</option>
                      <option value="Form IV">Form IV</option>
                      <option value="Form V">Form V</option>
                      <option value="Form VI">Form VI</option>
                    </select>
                  </div>
                ) : (
                  <div>
                    <label className="block text-xs font-mono font-bold text-amber-300 uppercase tracking-wider mb-1">Teaching Subjects</label>
                    <input 
                      type="text" 
                      value={regSubjects}
                      onChange={(e) => setRegSubjects(e.target.value)}
                      placeholder="e.g. Chemistry"
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-blue-900/60 text-xs text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>
                )}
              </div>

              {regRole === 'TEACHER' && (
                <div className="p-2.5 bg-amber-950/40 border border-amber-500/40 rounded-xl flex items-start gap-2 text-[11px] text-amber-200">
                  <Info className="w-4 h-4 flex-shrink-0 text-amber-400 mt-0.5" />
                  <span>Teacher registration will enter <strong>PENDING TEACHER VERIFICATION</strong> status until approved by the Head of School / Admin.</span>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-blue-700 to-indigo-700 hover:from-blue-600 hover:to-indigo-600 text-white rounded-xl font-mono font-bold text-xs uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(37,99,235,0.4)] flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Create Account'}
              </button>
            </form>
          )}

          {/* TAB 4: SECURE ADMIN PORTAL */}
          {activeTab === 'ADMIN_PORTAL' && (
            <form onSubmit={handleAdminLoginSubmit} className="space-y-4">
              <div className="p-3.5 bg-red-950/40 border border-red-500/40 rounded-2xl">
                <div className="flex items-center gap-2 text-red-400 font-bold text-xs font-mono uppercase mb-1">
                  <ShieldCheck className="w-4 h-4" /> Restricted Administrative Portal
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed font-sans">
                  This portal is reserved strictly for Kizimba Secondary School Administrators, Head of School, and Founder Isaack Edward Lungwa. Students are strictly prohibited.
                </p>
              </div>

              <div>
                <label className="block text-xs font-mono font-bold text-red-400 uppercase tracking-wider mb-1">Admin Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-3 text-red-400" />
                  <input 
                    type="email" 
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                    placeholder="isaack.lungwa@kizimba.ac.tz" 
                    required
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-slate-900/90 border border-red-900/60 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-red-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono font-bold text-red-400 uppercase tracking-wider mb-1">Admin Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-3 text-red-400" />
                  <input 
                    type="password" 
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    placeholder="••••••••" 
                    required
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-slate-900/90 border border-red-900/60 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-red-400"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-mono font-bold text-amber-300 uppercase tracking-wider">Administrative Master Clearance Key</label>
                  <span className="text-[10px] font-mono text-slate-400">Key: KDLH-2026</span>
                </div>
                <div className="relative">
                  <KeyRound className="w-4 h-4 absolute left-3 top-3 text-amber-400" />
                  <input 
                    type="password" 
                    value={adminSecretKey}
                    onChange={(e) => setAdminSecretKey(e.target.value)}
                    placeholder="Enter clearance key" 
                    required
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-slate-900/90 border border-amber-900/60 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-400 font-mono"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-red-700 to-rose-700 hover:from-red-600 hover:to-rose-600 text-white rounded-xl font-mono font-bold text-xs uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(220,38,38,0.5)] flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Authorize Administrative Access'}
              </button>
            </form>
          )}

          {/* TAB 5: RESET PASSWORD */}
          {activeTab === 'RESET' && (
            <form onSubmit={handleResetSubmit} className="space-y-4">
              <p className="text-xs text-slate-300 font-sans">
                Enter your registered school email address below. We will send you an email link to reset your password securely.
              </p>

              <div>
                <label className="block text-xs font-mono font-bold text-amber-300 uppercase tracking-wider mb-1">Registered Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-3 text-blue-400" />
                  <input 
                    type="email" 
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    placeholder="user@kizimba.ac.tz" 
                    required
                    className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-slate-900/90 border border-blue-900/60 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-blue-700 to-indigo-700 hover:from-blue-600 hover:to-indigo-600 text-white rounded-xl font-mono font-bold text-xs uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(37,99,235,0.4)] flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Send Reset Link'}
              </button>
            </form>
          )}

        </div>

        {/* Footer */}
        <div className="bg-black/90 p-3 text-center border-t border-blue-900/50 text-[11px] text-slate-400 flex-shrink-0 font-serif">
          Kizimba Secondary School • Digital Learning Hub Auth Engine
        </div>

      </div>
    </div>
  );
};
