import React, { useState } from 'react';
import { 
  Calendar, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Clock, 
  UserCheck, 
  ShieldAlert, 
  Filter, 
  Printer, 
  Download, 
  Search,
  Users,
  TrendingUp,
  FileSpreadsheet
} from 'lucide-react';
import { UserProfile } from '../types';

interface AttendanceViewProps {
  currentUser: UserProfile;
  onNavigate?: (route: string) => void;
}

interface StudentAttendanceRecord {
  id: string;
  name: string;
  admissionNo: string;
  form: string;
  className: string;
  status: 'PRESENT' | 'ABSENT' | 'SICK' | 'EXCUSED';
  // Restricted Admin-only fields
  feeStatus?: 'PAID' | 'PENDING' | 'OVERDUE';
  academicStatus?: 'GOOD_STANDING' | 'PROBATION' | 'EXCELLENT';
}

const INITIAL_STUDENTS: StudentAttendanceRecord[] = [
  { id: 'st-1', name: 'Juma Baraka', admissionNo: 'KDLH-2025-001', form: 'Form IV', className: 'Form IV A', status: 'PRESENT', feeStatus: 'PAID', academicStatus: 'EXCELLENT' },
  { id: 'st-2', name: 'Neema John', admissionNo: 'KDLH-2025-002', form: 'Form IV', className: 'Form IV A', status: 'PRESENT', feeStatus: 'PAID', academicStatus: 'EXCELLENT' },
  { id: 'st-3', name: 'Baraka Said', admissionNo: 'KDLH-2025-003', form: 'Form IV', className: 'Form IV A', status: 'ABSENT', feeStatus: 'PENDING', academicStatus: 'GOOD_STANDING' },
  { id: 'st-4', name: 'Amina Hassan', admissionNo: 'KDLH-2025-004', form: 'Form IV', className: 'Form IV A', status: 'SICK', feeStatus: 'PAID', academicStatus: 'GOOD_STANDING' },
  { id: 'st-5', name: 'David Emmanuel', admissionNo: 'KDLH-2025-005', form: 'Form IV', className: 'Form IV A', status: 'EXCUSED', feeStatus: 'PAID', academicStatus: 'GOOD_STANDING' },
  { id: 'st-6', name: 'Grace Joseph', admissionNo: 'KDLH-2025-006', form: 'Form IV', className: 'Form IV A', status: 'PRESENT', feeStatus: 'PAID', academicStatus: 'EXCELLENT' },
  { id: 'st-7', name: 'Amani Mussa', admissionNo: 'KDLH-2025-007', form: 'Form IV', className: 'Form IV B', status: 'PRESENT', feeStatus: 'PAID', academicStatus: 'GOOD_STANDING' }
];

export const AttendanceView: React.FC<AttendanceViewProps> = ({ currentUser, onNavigate }) => {
  const [selectedForm, setSelectedForm] = useState('Form IV');
  const [selectedClass, setSelectedClass] = useState('Form IV A');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedSession, setSelectedSession] = useState<'MORNING' | 'AFTERNOON' | 'EVENING'>('MORNING');
  const [activeTab, setActiveTab] = useState<'MARK' | 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'INDIVIDUAL'>('MARK');
  
  const [students, setStudents] = useState<StudentAttendanceRecord[]>(INITIAL_STUDENTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStudentForHistory, setSelectedStudentForHistory] = useState<StudentAttendanceRecord>(INITIAL_STUDENTS[0]);

  const isTeacherOrAdmin = currentUser.role === 'TEACHER' || currentUser.role === 'ADMIN' || currentUser.role === 'FOUNDER';
  const isAdminOrFounder = currentUser.role === 'ADMIN' || currentUser.role === 'FOUNDER';

  const handleStatusChange = (studentId: string, status: 'PRESENT' | 'ABSENT' | 'SICK' | 'EXCUSED') => {
    if (!isTeacherOrAdmin) return;
    setStudents(prev => prev.map(s => s.id === studentId ? { ...s, status } : s));
  };

  const handleFeeStatusChange = (studentId: string, feeStatus: 'PAID' | 'PENDING' | 'OVERDUE') => {
    if (!isAdminOrFounder) return;
    setStudents(prev => prev.map(s => s.id === studentId ? { ...s, feeStatus } : s));
  };

  const filteredStudents = students.filter(s => 
    (selectedClass === 'ALL' || s.className === selectedClass) &&
    (s.name.toLowerCase().includes(searchQuery.toLowerCase()) || s.admissionNo.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const presentCount = filteredStudents.filter(s => s.status === 'PRESENT').length;
  const absentCount = filteredStudents.filter(s => s.status === 'ABSENT').length;
  const sickCount = filteredStudents.filter(s => s.status === 'SICK').length;
  const excusedCount = filteredStudents.filter(s => s.status === 'EXCUSED').length;
  const totalStudents = filteredStudents.length;
  const attendanceRate = totalStudents > 0 ? Math.round((presentCount / totalStudents) * 100) : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      
      {/* Attendance Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl text-white flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-teal-400 uppercase tracking-widest">KDLH ACADEMIC GOVERNANCE</span>
            <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-teal-500/20 text-teal-300 font-bold border border-teal-500/30">
              ATTENDANCE & ROLL CALL
            </span>
          </div>
          <h1 className="text-2xl font-black">Student Attendance Register</h1>
          <p className="text-xs text-slate-300">
            Track daily, weekly, and monthly classroom attendance for Kizimba Secondary School students.
          </p>
        </div>

        {/* Quick Summary Cards */}
        <div className="flex items-center gap-4 bg-slate-950/80 p-3.5 rounded-xl border border-slate-800 text-xs font-mono">
          <div className="text-center px-2">
            <span className="text-xl font-black text-emerald-400 block">{presentCount}</span>
            <span className="text-slate-400 text-[10px]">Present</span>
          </div>
          <div className="w-px h-8 bg-slate-800" />
          <div className="text-center px-2">
            <span className="text-xl font-black text-rose-400 block">{absentCount}</span>
            <span className="text-slate-400 text-[10px]">Absent</span>
          </div>
          <div className="w-px h-8 bg-slate-800" />
          <div className="text-center px-2">
            <span className="text-xl font-black text-teal-400 block">{attendanceRate}%</span>
            <span className="text-slate-400 text-[10px]">Class Rate</span>
          </div>
        </div>
      </div>

      {/* Selector Toolbar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg flex flex-wrap items-center justify-between gap-4 text-xs font-bold text-slate-200">
        <div className="flex flex-wrap items-center gap-3">
          <div>
            <label className="block text-slate-400 text-[10px] uppercase mb-1">Form</label>
            <select
              value={selectedForm}
              onChange={(e) => setSelectedForm(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-teal-500"
            >
              <option value="Form I">Form I</option>
              <option value="Form II">Form II</option>
              <option value="Form III">Form III</option>
              <option value="Form IV">Form IV</option>
              <option value="Form V">Form V</option>
              <option value="Form VI">Form VI</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-400 text-[10px] uppercase mb-1">Class Stream</label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-teal-500"
            >
              <option value="Form IV A">Form IV A</option>
              <option value="Form IV B">Form IV B</option>
              <option value="ALL">All Streams</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-400 text-[10px] uppercase mb-1">Date</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-teal-500 font-sans"
            />
          </div>

          <div>
            <label className="block text-slate-400 text-[10px] uppercase mb-1">Session</label>
            <select
              value={selectedSession}
              onChange={(e) => setSelectedSession(e.target.value as any)}
              className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-teal-500"
            >
              <option value="MORNING">Morning Session (8:00 AM)</option>
              <option value="AFTERNOON">Afternoon Session (2:00 PM)</option>
              <option value="EVENING">Evening Study (5:00 PM)</option>
            </select>
          </div>
        </div>

        {/* View Tabs */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveTab('MARK')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              activeTab === 'MARK' ? 'bg-teal-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Mark Register
          </button>
          <button
            onClick={() => setActiveTab('DAILY')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              activeTab === 'DAILY' ? 'bg-teal-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Daily Summary
          </button>
          <button
            onClick={() => setActiveTab('WEEKLY')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              activeTab === 'WEEKLY' ? 'bg-teal-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Weekly Report
          </button>
          <button
            onClick={() => setActiveTab('MONTHLY')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              activeTab === 'MONTHLY' ? 'bg-teal-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Monthly Summary
          </button>
        </div>
      </div>

      {/* Main Content Stage */}
      {activeTab === 'MARK' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-base font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Users className="w-5 h-5 text-teal-400" />
                Student Roll Call List — {selectedClass} ({selectedDate})
              </h2>
              <p className="text-xs text-slate-400">
                {isTeacherOrAdmin ? 'Mark student statuses: Present, Absent, Sick, or Excused.' : 'Viewing class attendance log.'}
              </p>
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search student or admission no..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-teal-500 font-sans"
              />
            </div>
          </div>

          {/* Student Roll Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] tracking-wider font-bold">
                <tr>
                  <th className="p-3">Admission No</th>
                  <th className="p-3">Student Name</th>
                  <th className="p-3">Form / Stream</th>
                  <th className="p-3">Attendance Status</th>
                  {isAdminOrFounder && <th className="p-3 text-amber-400 font-bold">Fee Status (Admin Restricted)</th>}
                  {isAdminOrFounder && <th className="p-3 text-purple-400 font-bold">Academic Status (Admin)</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-200 font-sans">
                {filteredStudents.map(student => (
                  <tr key={student.id} className="hover:bg-slate-950/60 transition">
                    <td className="p-3 font-mono font-bold text-teal-400">{student.admissionNo}</td>
                    <td className="p-3 font-bold text-white">{student.name}</td>
                    <td className="p-3 text-slate-400">{student.className}</td>
                    
                    {/* Status Buttons */}
                    <td className="p-3">
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleStatusChange(student.id, 'PRESENT')}
                          disabled={!isTeacherOrAdmin}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition flex items-center gap-1 ${
                            student.status === 'PRESENT'
                              ? 'bg-emerald-600 text-white shadow-md'
                              : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white'
                          }`}
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" /> Present
                        </button>

                        <button
                          onClick={() => handleStatusChange(student.id, 'ABSENT')}
                          disabled={!isTeacherOrAdmin}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition flex items-center gap-1 ${
                            student.status === 'ABSENT'
                              ? 'bg-rose-600 text-white shadow-md'
                              : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white'
                          }`}
                        >
                          <XCircle className="w-3.5 h-3.5" /> Absent
                        </button>

                        <button
                          onClick={() => handleStatusChange(student.id, 'SICK')}
                          disabled={!isTeacherOrAdmin}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition flex items-center gap-1 ${
                            student.status === 'SICK'
                              ? 'bg-amber-600 text-white shadow-md'
                              : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white'
                          }`}
                        >
                          <AlertCircle className="w-3.5 h-3.5" /> Sick
                        </button>

                        <button
                          onClick={() => handleStatusChange(student.id, 'EXCUSED')}
                          disabled={!isTeacherOrAdmin}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition flex items-center gap-1 ${
                            student.status === 'EXCUSED'
                              ? 'bg-blue-600 text-white shadow-md'
                              : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white'
                          }`}
                        >
                          <Clock className="w-3.5 h-3.5" /> Excused
                        </button>
                      </div>
                    </td>

                    {/* Admin Restricted Fields */}
                    {isAdminOrFounder && (
                      <td className="p-3">
                        <select
                          value={student.feeStatus || 'PAID'}
                          onChange={(e) => handleFeeStatusChange(student.id, e.target.value as any)}
                          className="bg-slate-950 border border-amber-500/40 text-amber-300 text-[11px] font-bold rounded-lg px-2 py-1"
                        >
                          <option value="PAID">PAID (Clear)</option>
                          <option value="PENDING">PENDING</option>
                          <option value="OVERDUE">OVERDUE</option>
                        </select>
                      </td>
                    )}

                    {isAdminOrFounder && (
                      <td className="p-3 font-mono text-[11px] font-bold text-purple-300">
                        {student.academicStatus || 'GOOD_STANDING'}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="pt-4 border-t border-slate-800 flex justify-between items-center text-xs text-slate-400 font-mono">
            <span>Total Students: {totalStudents} | Present: {presentCount} | Absent: {absentCount}</span>
            <button 
              onClick={() => alert('Attendance register confirmed and saved for ' + selectedDate)}
              className="px-5 py-2 bg-gradient-to-r from-teal-500 to-emerald-600 text-slate-950 font-bold text-xs rounded-xl shadow-lg"
            >
              Confirm & Save Register
            </button>
          </div>
        </div>
      )}

      {/* DAILY / WEEKLY / MONTHLY SUMMARIES */}
      {activeTab !== 'MARK' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6 text-white">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-base font-bold text-white uppercase tracking-wider">
                {activeTab} Attendance Summary & Analytics — {selectedClass}
              </h2>
              <p className="text-xs text-slate-400">Class aggregate attendance analytics and trend metrics.</p>
            </div>
            <button 
              onClick={() => window.print()} 
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-teal-300 border border-teal-500/30 text-xs font-bold rounded-xl flex items-center gap-1.5"
            >
              <Printer className="w-4 h-4" /> Print Attendance Report
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-center">
            <div className="p-5 bg-slate-950 rounded-2xl border border-slate-800 space-y-1">
              <span className="text-3xl font-black text-emerald-400 block">{attendanceRate}%</span>
              <span className="text-xs text-slate-400 uppercase font-bold">Overall Attendance Rate</span>
            </div>
            <div className="p-5 bg-slate-950 rounded-2xl border border-slate-800 space-y-1">
              <span className="text-3xl font-black text-teal-400 block">{presentCount} / {totalStudents}</span>
              <span className="text-xs text-slate-400 uppercase font-bold">Present Students</span>
            </div>
            <div className="p-5 bg-slate-950 rounded-2xl border border-slate-800 space-y-1">
              <span className="text-3xl font-black text-rose-400 block">{absentCount}</span>
              <span className="text-xs text-slate-400 uppercase font-bold">Unexcused Absences</span>
            </div>
            <div className="p-5 bg-slate-950 rounded-2xl border border-slate-800 space-y-1">
              <span className="text-3xl font-black text-amber-400 block">{sickCount + excusedCount}</span>
              <span className="text-xs text-slate-400 uppercase font-bold">Sick / Excused</span>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
