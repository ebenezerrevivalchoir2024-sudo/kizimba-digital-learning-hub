import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Users, 
  Video, 
  Settings, 
  FileText, 
  CheckCircle2, 
  XCircle, 
  Trash2, 
  Eye, 
  Upload, 
  Play, 
  Music, 
  FolderPlus, 
  RefreshCw, 
  Loader2,
  Lock,
  CloudUpload,
  UserCheck,
  UserX,
  Clock,
  Phone,
  GraduationCap,
  Sparkles,
  BookOpen
} from 'lucide-react';
import { KDLHResource, CmsSettings, UserRole, UserProfile, FirestoreUserStats, TeacherApprovalStatus } from '../types';
import { AuthService } from '../services/authService';
import { KdlhStorageService } from '../services/storage';

interface AdminControlViewProps {
  currentUser: UserProfile;
  resources: KDLHResource[];
  cmsSettings: CmsSettings;
  onUpdateCms: (settings: CmsSettings) => void;
  onRefreshResources: () => void;
}

export const AdminControlView: React.FC<AdminControlViewProps> = ({
  currentUser,
  resources,
  cmsSettings,
  onUpdateCms,
  onRefreshResources
}) => {
  const [activeTab, setActiveTab] = useState<'TEACHER_APPROVALS' | 'USERS' | 'MEDIA' | 'CMS' | 'RESOURCE_APPROVALS'>('TEACHER_APPROVALS');
  const [mediaSubTab, setMediaSubTab] = useState<'VIDEOS' | 'AUDIO' | 'PRACTICAL_VIDEOS' | 'TUTORIALS' | 'MUSIC'>('VIDEOS');
  const [testingResource, setTestingResource] = useState<KDLHResource | null>(null);
  const [addModalOpen, setAddModalOpen] = useState(false);

  // Role validation logic: ADMIN, TEACHER, or FOUNDER
  const effectiveUser = currentUser || AuthService.getCurrentUser() || KdlhStorageService.getCurrentUser();
  const userRole = effectiveUser?.role?.toUpperCase() || 'STUDENT';
  const isAuthorized = ['ADMIN', 'TEACHER', 'FOUNDER'].includes(userRole);

  const handleOpenAddContent = () => {
    if (isAuthorized) {
      setAddModalOpen(true);
    }
  };

  // User Management & Stats State
  const [userList, setUserList] = useState<UserProfile[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [userSearch, setUserSearch] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState<'ALL' | 'STUDENT' | 'TEACHER' | 'ADMIN' | 'PENDING_TEACHERS'>('ALL');
  const [stats, setStats] = useState<FirestoreUserStats | null>(null);
  const [actionInProgress, setActionInProgress] = useState<string | null>(null);

  // CMS Form State
  const [heroTitle, setHeroTitle] = useState(cmsSettings.heroTitle);
  const [heroSubtitle, setHeroSubtitle] = useState(cmsSettings.heroSubtitle);
  const [tagline, setTagline] = useState(cmsSettings.tagline);
  const [saved, setSaved] = useState(false);

  // New Media Item State
  const [newTitle, setNewTitle] = useState('');
  const [newSubject, setNewSubject] = useState('Chemistry');
  const [newForm, setNewForm] = useState('Form IV');
  const [newTopic, setNewTopic] = useState('General Studies');
  const [newMediaUrl, setNewMediaUrl] = useState('');
  const [newPermission, setNewPermission] = useState<'AUTHORIZED' | 'OPEN_LICENSE' | 'SCHOOL_OWNED'>('AUTHORIZED');

  const pendingResources = resources.filter(r => (r as any).approvalStatus === 'PENDING');

  const fetchUsersAndStats = async () => {
    setLoadingUsers(true);
    try {
      const [users, userStats] = await Promise.all([
        AuthService.getAllUsers(),
        AuthService.getFirestoreUserStats()
      ]);
      setUserList(users);
      setStats(userStats);
    } catch (e) {
      console.warn('Failed to load users or stats:', e);
    } finally {
      setLoadingUsers(false);
    }
  };

  useEffect(() => {
    fetchUsersAndStats();
  }, []);

  const handleApproveTeacher = async (teacherId: string) => {
    setActionInProgress(teacherId);
    try {
      await AuthService.approveTeacher(teacherId, currentUser.id);
      setUserList(prev => prev.map(u => u.id === teacherId ? { ...u, teacherApprovalStatus: 'APPROVED' } : u));
      const updatedStats = await AuthService.getFirestoreUserStats();
      setStats(updatedStats);
    } catch (err) {
      alert('Failed to approve teacher application.');
    } finally {
      setActionInProgress(null);
    }
  };

  const handleRejectTeacher = async (teacherId: string) => {
    if (!confirm('Reject this teacher verification and reclassify account as Student?')) return;
    setActionInProgress(teacherId);
    try {
      await AuthService.rejectTeacher(teacherId, currentUser.id);
      setUserList(prev => prev.map(u => u.id === teacherId ? { ...u, role: 'STUDENT', teacherApprovalStatus: 'REJECTED' } : u));
      const updatedStats = await AuthService.getFirestoreUserStats();
      setStats(updatedStats);
    } catch (err) {
      alert('Failed to reject teacher application.');
    } finally {
      setActionInProgress(null);
    }
  };

  const handleUpdateUserRole = async (userId: string, newRole: UserRole) => {
    try {
      await AuthService.updateUser(userId, { 
        role: newRole,
        teacherApprovalStatus: newRole === 'TEACHER' ? 'APPROVED' : undefined
      });
      setUserList(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
      const updatedStats = await AuthService.getFirestoreUserStats();
      setStats(updatedStats);
    } catch (err) {
      alert('Failed to update user role');
    }
  };

  const handleToggleUserStatus = async (userId: string, currentStatus?: string) => {
    const nextStatus = currentStatus === 'suspended' ? 'active' : 'suspended';
    try {
      await AuthService.updateUser(userId, { status: nextStatus as any });
      setUserList(prev => prev.map(u => u.id === userId ? { ...u, status: nextStatus as any } : u));
      const updatedStats = await AuthService.getFirestoreUserStats();
      setStats(updatedStats);
    } catch (err) {
      alert('Failed to update user status');
    }
  };

  const handleCmsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: CmsSettings = {
      ...cmsSettings,
      heroTitle,
      heroSubtitle,
      tagline
    };
    onUpdateCms(updated);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleApproveResource = (id: string) => {
    KdlhStorageService.updateResourceApproval(id, 'APPROVED');
    onRefreshResources();
  };

  const handleRejectResource = (id: string) => {
    KdlhStorageService.updateResourceApproval(id, 'REJECTED');
    onRefreshResources();
  };

  const handleAddMedia = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newMediaUrl) return;

    const isVideoType = mediaSubTab === 'VIDEOS' || mediaSubTab === 'PRACTICAL_VIDEOS' || mediaSubTab === 'TUTORIALS';
    let category: any = 'VIDEO';
    if (mediaSubTab === 'TUTORIALS') category = 'TUTORIAL';
    if (mediaSubTab === 'AUDIO') category = 'AUDIO';
    if (mediaSubTab === 'MUSIC') category = 'MUSIC';

    const newRes: KDLHResource = {
      id: `media-${Date.now()}`,
      title: newTitle,
      description: `Verified ${category} educational resource uploaded by ${currentUser.name}.`,
      category,
      subjectId: `sub-${newSubject.toLowerCase().slice(0, 4)}`,
      subjectName: newSubject,
      form: newForm,
      topic: newTopic,
      author: currentUser.name,
      authorRole: 'System Administrator',
      uploaderId: currentUser.id,
      dateAdded: new Date().toISOString().split('T')[0],
      views: 12,
      downloads: 4,
      featured: true,
      approvalStatus: 'APPROVED',
      permissionStatus: newPermission,
      tags: [category, newSubject, newForm],
      ...(isVideoType ? {
        videoUrl: newMediaUrl,
        thumbnailUrl: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=800&q=80',
        duration: '15:00',
        durationSeconds: 900,
        isTutorial: mediaSubTab === 'TUTORIALS'
      } : {
        audioUrl: newMediaUrl,
        duration: '10:00',
        durationSeconds: 600,
        audioCategory: 'LESSON',
        speaker: currentUser.name
      })
    } as KDLHResource;


    KdlhStorageService.addResource(newRes);
    onRefreshResources();
    setNewTitle('');
    setNewMediaUrl('');
    alert(`Successfully added ${category} to KDLH Media Hub!`);
  };

  // Filtered Teacher Applications
  const pendingTeachers = userList.filter(u => u.role === 'TEACHER' && u.teacherApprovalStatus === 'PENDING');
  const approvedTeachers = userList.filter(u => u.role === 'TEACHER' && (u.teacherApprovalStatus === 'APPROVED' || !u.teacherApprovalStatus));

  // Filtered Users
  const filteredUsers = userList.filter(u => {
    const matchesSearch = 
      u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.email.toLowerCase().includes(userSearch.toLowerCase()) ||
      (u.phone && u.phone.includes(userSearch)) ||
      u.role.toLowerCase().includes(userSearch.toLowerCase());
    
    if (!matchesSearch) return false;
    if (userRoleFilter === 'STUDENT') return u.role === 'STUDENT';
    if (userRoleFilter === 'TEACHER') return u.role === 'TEACHER';
    if (userRoleFilter === 'ADMIN') return u.role === 'ADMIN' || u.role === 'FOUNDER';
    if (userRoleFilter === 'PENDING_TEACHERS') return u.role === 'TEACHER' && u.teacherApprovalStatus === 'PENDING';
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8 font-mono">
      
      {/* Header */}
      <div className="bg-slate-900 text-white p-6 rounded-2xl border border-slate-800 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-950 border border-blue-500/40 text-blue-300 text-xs font-bold">
            <ShieldCheck className="w-4 h-4 text-blue-400" /> KDLH System Governance & Verification Center
          </div>
          <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-wider">Admin Control Center</h1>
          <p className="text-xs text-slate-400 font-sans">
            Founder & Master Administrator: <strong className="text-amber-300 font-mono">ISAACK EDWARD LUNGWA</strong> • Kizimba Secondary School
          </p>
        </div>

        {/* Main Tabs */}
        <div className="flex flex-wrap items-center gap-2 bg-slate-950 p-1.5 rounded-xl border border-slate-800 text-xs font-bold">
          <button
            onClick={() => setActiveTab('TEACHER_APPROVALS')}
            className={`px-3.5 py-2 rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'TEACHER_APPROVALS' ? 'bg-amber-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <GraduationCap className="w-4 h-4" /> 
            <span>Teachers</span>
            {pendingTeachers.length > 0 && (
              <span className="px-1.5 py-0.5 rounded-full bg-red-500 text-white text-[10px] font-black animate-pulse">
                {pendingTeachers.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('USERS')}
            className={`px-3.5 py-2 rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'USERS' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Users className="w-4 h-4" /> Users ({userList.length})
          </button>

          <button
            onClick={() => setActiveTab('MEDIA')}
            className={`px-3.5 py-2 rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'MEDIA' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Video className="w-4 h-4" /> Media Hub
          </button>

          <button
            onClick={() => setActiveTab('CMS')}
            className={`px-3.5 py-2 rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'CMS' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Settings className="w-4 h-4" /> CMS
          </button>

          <button
            onClick={() => setActiveTab('RESOURCE_APPROVALS')}
            className={`px-3.5 py-2 rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'RESOURCE_APPROVALS' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <FileText className="w-4 h-4" /> Resources ({pendingResources.length})
          </button>

          {isAuthorized && (
            <button
              onClick={handleOpenAddContent}
              className="px-3.5 py-2 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white transition-all flex items-center gap-1.5 shadow-md uppercase tracking-wider text-[11px] font-black"
            >
              <CloudUpload className="w-4 h-4 text-emerald-200" /> Upload
            </button>
          )}
        </div>
      </div>

      {/* Real Firestore User Statistics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
          <div className="text-[11px] text-slate-400 font-sans uppercase tracking-wider font-bold">Total Accounts</div>
          <div className="text-2xl font-black text-white mt-1">{stats?.totalUsers || userList.length}</div>
          <div className="text-[10px] text-blue-400 font-sans mt-0.5">In Firestore DB</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
          <div className="text-[11px] text-blue-300 font-sans uppercase tracking-wider font-bold">Students</div>
          <div className="text-2xl font-black text-blue-400 mt-1">{stats?.studentsCount || userList.filter(u => u.role === 'STUDENT').length}</div>
          <div className="text-[10px] text-slate-400 font-sans mt-0.5">Learner Accounts</div>
        </div>

        <div className="bg-slate-900 border border-emerald-900/50 p-4 rounded-2xl">
          <div className="text-[11px] text-emerald-300 font-sans uppercase tracking-wider font-bold">Certified Teachers</div>
          <div className="text-2xl font-black text-emerald-400 mt-1">{stats?.approvedTeachersCount || approvedTeachers.length}</div>
          <div className="text-[10px] text-emerald-500/80 font-sans mt-0.5">Approved & Verified</div>
        </div>

        <div className={`p-4 rounded-2xl border ${pendingTeachers.length > 0 ? 'bg-amber-950/40 border-amber-500/60' : 'bg-slate-900 border-slate-800'}`}>
          <div className="text-[11px] text-amber-300 font-sans uppercase tracking-wider font-bold flex items-center justify-between">
            <span>Pending Teachers</span>
            {pendingTeachers.length > 0 && <Clock className="w-3.5 h-3.5 text-amber-400 animate-spin" />}
          </div>
          <div className="text-2xl font-black text-amber-400 mt-1">{stats?.pendingTeachersCount || pendingTeachers.length}</div>
          <div className="text-[10px] text-amber-300/80 font-sans mt-0.5">Awaiting Approval</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
          <div className="text-[11px] text-purple-300 font-sans uppercase tracking-wider font-bold">Administrators</div>
          <div className="text-2xl font-black text-purple-400 mt-1">{stats?.adminsCount || userList.filter(u => u.role === 'ADMIN' || u.role === 'FOUNDER').length}</div>
          <div className="text-[10px] text-slate-400 font-sans mt-0.5">Governance</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
          <div className="text-[11px] text-teal-300 font-sans uppercase tracking-wider font-bold">Active Status</div>
          <div className="text-2xl font-black text-teal-400 mt-1">{stats?.activeUsersCount || userList.filter(u => u.status !== 'suspended').length}</div>
          <div className="text-[10px] text-teal-500/80 font-sans mt-0.5">Non-suspended</div>
        </div>
      </div>

      {/* TAB 1: TEACHER APPLICATIONS & VERIFICATION */}
      {activeTab === 'TEACHER_APPROVALS' && (
        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <h3 className="text-lg font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-amber-400" /> Teacher Verification Gate & Staff Directory
              </h3>
              <p className="text-xs text-slate-400 font-sans mt-0.5">
                Strict administrative gate: Users selecting "Teacher" must be verified and approved by the Head of School / Admin before acquiring exam marking and curriculum publishing permissions.
              </p>
            </div>

            <button
              onClick={fetchUsersAndStats}
              disabled={loadingUsers}
              className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold flex items-center gap-1.5 flex-shrink-0"
            >
              {loadingUsers ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
              Sync Database
            </button>
          </div>

          {/* Pending Applications Queue */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-amber-400" /> Pending Teacher Applications ({pendingTeachers.length})
              </h4>
            </div>

            {pendingTeachers.length === 0 ? (
              <div className="p-6 bg-slate-950/60 rounded-xl border border-slate-800 text-center text-xs text-slate-400 font-sans">
                ✨ No pending teacher applications currently awaiting approval. All staff accounts verified.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {pendingTeachers.map((teacher) => (
                  <div key={teacher.id} className="p-4 bg-slate-950 rounded-2xl border border-amber-500/50 shadow-lg space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="font-bold text-white text-sm font-mono">{teacher.name}</div>
                        <div className="text-xs text-slate-400 font-sans mt-0.5 flex items-center gap-1.5">
                          <span>{teacher.email}</span>
                          {teacher.phone && (
                            <span className="inline-flex items-center gap-1 text-emerald-400 font-mono">
                              <Phone className="w-3 h-3" /> {teacher.phone}
                            </span>
                          )}
                        </div>
                      </div>
                      <span className="px-2.5 py-1 rounded-lg bg-amber-950 text-amber-300 border border-amber-500/50 text-[10px] font-bold uppercase tracking-wider">
                        Pending
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs font-sans bg-slate-900/90 p-2.5 rounded-xl border border-slate-800">
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase font-mono block">School</span>
                        <span className="text-slate-200 font-semibold">{teacher.school || 'Kizimba Secondary'}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase font-mono block">Subjects</span>
                        <span className="text-slate-200 font-semibold">{teacher.subjects?.join(', ') || 'Chemistry, Biology'}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-1 font-mono">
                      <button
                        onClick={() => handleApproveTeacher(teacher.id)}
                        disabled={actionInProgress === teacher.id}
                        className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-md disabled:opacity-50"
                      >
                        {actionInProgress === teacher.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <UserCheck className="w-3.5 h-3.5" />}
                        Approve Teacher
                      </button>

                      <button
                        onClick={() => handleRejectTeacher(teacher.id)}
                        disabled={actionInProgress === teacher.id}
                        className="py-2 px-3 bg-rose-950 hover:bg-rose-900 text-rose-300 border border-rose-800/60 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 disabled:opacity-50"
                      >
                        <UserX className="w-3.5 h-3.5" />
                        Reject / Student
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Approved Teachers Directory */}
          <div className="space-y-3 pt-4 border-t border-slate-800">
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Certified & Approved Teachers ({approvedTeachers.length})
            </h4>

            {approvedTeachers.length === 0 ? (
              <div className="p-4 bg-slate-950/40 rounded-xl text-center text-xs text-slate-500 font-sans">
                No approved teacher records found.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider font-bold">
                      <th className="py-2.5 px-3">Teacher</th>
                      <th className="py-2.5 px-3">Contact</th>
                      <th className="py-2.5 px-3">Subjects / Classes</th>
                      <th className="py-2.5 px-3">Verification State</th>
                      <th className="py-2.5 px-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-sans">
                    {approvedTeachers.map((teacher) => (
                      <tr key={teacher.id} className="hover:bg-slate-950/40 transition-colors">
                        <td className="py-3 px-3">
                          <div className="font-bold text-white font-mono">{teacher.name}</div>
                          <div className="text-[10px] text-slate-400">{teacher.school || 'Kizimba Secondary School'}</div>
                        </td>
                        <td className="py-3 px-3">
                          <div className="text-slate-300 text-xs">{teacher.email}</div>
                          {teacher.phone && <div className="text-[11px] text-emerald-400 font-mono">{teacher.phone}</div>}
                        </td>
                        <td className="py-3 px-3 text-slate-300">
                          {teacher.subjects?.join(', ') || 'General Sciences'}
                        </td>
                        <td className="py-3 px-3 font-mono">
                          <span className="px-2.5 py-1 rounded-md bg-emerald-950 border border-emerald-500/50 text-emerald-300 text-[10px] font-bold">
                            APPROVED
                          </span>
                        </td>
                        <td className="py-3 px-3 text-right font-mono">
                          <button
                            onClick={() => handleRejectTeacher(teacher.id)}
                            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-rose-950 text-slate-300 hover:text-rose-300 border border-slate-700 text-[11px] transition-colors"
                          >
                            Revoke / Student
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: USER MANAGEMENT */}
      {activeTab === 'USERS' && (
        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <h3 className="text-lg font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-400" /> Database Users & System Roles
              </h3>
              <p className="text-xs text-slate-400 font-sans mt-0.5">
                Manage registered platform accounts, assign user roles (Student, Teacher, Admin), and control account status.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
              <input 
                type="text"
                placeholder="Search name, phone, email..."
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                className="px-3.5 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500 font-sans w-full sm:w-56"
              />
              
              <select
                value={userRoleFilter}
                onChange={(e) => setUserRoleFilter(e.target.value as any)}
                className="px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500 font-mono"
              >
                <option value="ALL">All Roles</option>
                <option value="STUDENT">Students</option>
                <option value="TEACHER">Teachers</option>
                <option value="PENDING_TEACHERS">Pending Teachers</option>
                <option value="ADMIN">Admins / Founder</option>
              </select>

              <button
                onClick={fetchUsersAndStats}
                disabled={loadingUsers}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold flex items-center gap-1.5 flex-shrink-0"
              >
                {loadingUsers ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                Sync
              </button>
            </div>
          </div>

          {loadingUsers ? (
            <div className="py-16 text-center text-slate-400 font-sans flex flex-col items-center gap-2">
              <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
              <span>Fetching user records from Firestore database...</span>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="py-12 text-center text-slate-500 text-xs font-sans">
              No registered user records match your search filter.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider font-bold">
                    <th className="py-3 px-4">User</th>
                    <th className="py-3 px-4">Contact / Phone</th>
                    <th className="py-3 px-4">Role</th>
                    <th className="py-3 px-4">Form / Subjects</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-sans">
                  {filteredUsers.map(user => (
                    <tr key={user.id} className="hover:bg-slate-950/50 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-white font-mono">
                        <div className="flex items-center gap-2">
                          <span>{user.name}</span>
                          {user.role === 'FOUNDER' && (
                            <span className="px-1.5 py-0.5 rounded bg-amber-500 text-black text-[9px] font-black uppercase">
                              Founder
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] text-slate-400 font-sans">{user.school || 'Kizimba Secondary School'}</div>
                      </td>
                      <td className="py-3.5 px-4 text-slate-300">
                        <div>{user.email}</div>
                        {user.phone && <div className="text-emerald-400 font-mono text-[11px]">{user.phone}</div>}
                      </td>
                      <td className="py-3.5 px-4 font-mono">
                        <select
                          value={user.role}
                          onChange={(e) => handleUpdateUserRole(user.id, e.target.value as UserRole)}
                          disabled={user.role === 'FOUNDER'}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border focus:outline-none ${
                            user.role === 'ADMIN' || user.role === 'FOUNDER' ? 'bg-amber-950 border-amber-500/50 text-amber-300' :
                            user.role === 'TEACHER' ? 'bg-emerald-950 border-emerald-500/50 text-emerald-300' : 'bg-blue-950 border-blue-500/50 text-blue-300'
                          }`}
                        >
                          <option value="STUDENT">STUDENT</option>
                          <option value="TEACHER">TEACHER</option>
                          <option value="ADMIN">ADMIN</option>
                        </select>
                        {user.role === 'TEACHER' && user.teacherApprovalStatus === 'PENDING' && (
                          <span className="ml-1.5 px-1.5 py-0.5 rounded bg-amber-900/80 text-amber-200 text-[9px] font-bold">
                            PENDING
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-slate-300">
                        {user.role === 'STUDENT' ? (user.form || 'Form IV') : (user.subjects?.join(', ') || 'N/A')}
                      </td>
                      <td className="py-3.5 px-4 font-mono">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          user.status === 'suspended' ? 'bg-rose-950 text-rose-300 border border-rose-800' : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                        }`}>
                          {user.status === 'suspended' ? 'SUSPENDED' : 'ACTIVE'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono">
                        <button
                          onClick={() => handleToggleUserStatus(user.id, user.status)}
                          disabled={user.role === 'FOUNDER'}
                          className={`px-3 py-1 rounded-lg text-[11px] font-bold transition-all border ${
                            user.status === 'suspended'
                              ? 'bg-emerald-950 text-emerald-300 border-emerald-700 hover:bg-emerald-900'
                              : 'bg-rose-950 text-rose-300 border-rose-800 hover:bg-rose-900'
                          }`}
                        >
                          {user.status === 'suspended' ? 'Activate' : 'Suspend'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: MEDIA HUB MANAGER */}
      {activeTab === 'MEDIA' && (
        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <h3 className="text-lg font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Video className="w-5 h-5 text-blue-400" /> Digital Media Manager
              </h3>
              <p className="text-xs text-slate-400 font-sans mt-0.5">
                Upload and manage video lessons, audio lessons, tutorials, and curriculum recordings.
              </p>
            </div>

            <div className="flex items-center gap-2 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-bold">
              <button
                onClick={() => setMediaSubTab('VIDEOS')}
                className={`px-3 py-1.5 rounded-lg transition-all ${mediaSubTab === 'VIDEOS' ? 'bg-blue-600 text-white' : 'text-slate-400'}`}
              >
                Videos
              </button>
              <button
                onClick={() => setMediaSubTab('AUDIO')}
                className={`px-3 py-1.5 rounded-lg transition-all ${mediaSubTab === 'AUDIO' ? 'bg-blue-600 text-white' : 'text-slate-400'}`}
              >
                Audio
              </button>
              <button
                onClick={() => setMediaSubTab('TUTORIALS')}
                className={`px-3 py-1.5 rounded-lg transition-all ${mediaSubTab === 'TUTORIALS' ? 'bg-blue-600 text-white' : 'text-slate-400'}`}
              >
                Tutorials
              </button>
            </div>
          </div>

          <form onSubmit={handleAddMedia} className="space-y-4 bg-slate-950/80 p-5 rounded-2xl border border-slate-800">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
              <Upload className="w-4 h-4" /> Add New {mediaSubTab} Resource
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-slate-400 mb-1">Title</label>
                <input 
                  type="text" 
                  value={newTitle} 
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Form 4 Chemistry: Extraction of Metals"
                  required
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500 font-sans"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">Media URL (MP4 / MP3 / YouTube / Direct)</label>
                <input 
                  type="text" 
                  value={newMediaUrl} 
                  onChange={(e) => setNewMediaUrl(e.target.value)}
                  placeholder="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
                  required
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500 font-sans"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">Subject</label>
                <select 
                  value={newSubject}
                  onChange={(e) => setNewSubject(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="Chemistry">Chemistry</option>
                  <option value="Physics">Physics</option>
                  <option value="Biology">Biology</option>
                  <option value="Mathematics">Mathematics</option>
                  <option value="Geography">Geography</option>
                  <option value="History">History</option>
                  <option value="English">English</option>
                  <option value="Kiswahili">Kiswahili</option>
                  <option value="Civics">Civics</option>
                </select>
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">Form / Level</label>
                <select 
                  value={newForm}
                  onChange={(e) => setNewForm(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500"
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

            <button
              type="submit"
              className="py-2.5 px-5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-md flex items-center gap-2"
            >
              <Upload className="w-4 h-4" /> Publish to KDLH Media Hub
            </button>
          </form>
        </div>
      )}

      {/* TAB 4: CMS SETTINGS */}
      {activeTab === 'CMS' && (
        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-xl space-y-6">
          <div className="border-b border-slate-800 pb-4">
            <h3 className="text-lg font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Settings className="w-5 h-5 text-blue-400" /> Homepage Content Management
            </h3>
            <p className="text-xs text-slate-400 font-sans mt-0.5">
              Customize portal headers, slogans, and institutional messaging for Kizimba Secondary School.
            </p>
          </div>

          <form onSubmit={handleCmsSubmit} className="space-y-4 font-sans text-xs">
            <div>
              <label className="block text-xs font-mono font-bold text-slate-300 uppercase mb-1">Portal Hero Title</label>
              <input 
                type="text"
                value={heroTitle}
                onChange={(e) => setHeroTitle(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-mono font-bold text-slate-300 uppercase mb-1">Portal Subtitle</label>
              <input 
                type="text"
                value={heroSubtitle}
                onChange={(e) => setHeroSubtitle(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-mono font-bold text-slate-300 uppercase mb-1">Founder Tagline</label>
              <input 
                type="text"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <button
              type="submit"
              className="py-2.5 px-6 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all shadow-md flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" /> Save CMS Changes
            </button>

            {saved && (
              <div className="p-3 bg-emerald-950 text-emerald-300 border border-emerald-800 rounded-xl font-mono text-xs">
                CMS settings updated successfully!
              </div>
            )}
          </form>
        </div>
      )}

      {/* TAB 5: RESOURCE APPROVALS */}
      {activeTab === 'RESOURCE_APPROVALS' && (
        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-xl space-y-6">
          <div className="border-b border-slate-800 pb-4">
            <h3 className="text-lg font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-400" /> Academic Resource Moderation Queue
            </h3>
            <p className="text-xs text-slate-400 font-sans mt-0.5">
              Review and approve educational materials submitted by teachers and contributors before public student viewing.
            </p>
          </div>

          {pendingResources.length === 0 ? (
            <div className="py-12 text-center text-slate-500 text-xs font-sans">
              All submitted educational resources have been reviewed and approved!
            </div>
          ) : (
            <div className="space-y-3">
              {pendingResources.map((res) => (
                <div key={res.id} className="p-4 bg-slate-950 rounded-xl border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <div className="font-bold text-white text-sm">{res.title}</div>
                    <div className="text-xs text-slate-400 font-sans mt-0.5">
                      {res.subjectName} • {res.form} • Author: {res.author}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 font-mono">
                    <button
                      onClick={() => handleApproveResource(res.id)}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition-all flex items-center gap-1"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" /> Approve
                    </button>
                    <button
                      onClick={() => handleRejectResource(res.id)}
                      className="px-3 py-1.5 bg-rose-950 hover:bg-rose-900 text-rose-300 border border-rose-800 rounded-lg text-xs font-bold transition-all flex items-center gap-1"
                    >
                      <XCircle className="w-3.5 h-3.5" /> Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

    </div>
  );
};
