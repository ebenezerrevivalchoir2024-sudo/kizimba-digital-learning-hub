import React, { useState } from 'react';
import { 
  X, FileText, Printer, Download, User, Search, Calendar, CheckCircle2, 
  TrendingUp, Award, AlertCircle, BookOpen, Plus 
} from 'lucide-react';
import { WeeklyStudentReport, WeeklyTeachingRecord, WeeklyClassReport } from '../../types';
import { INITIAL_STUDENT_REPORTS, INITIAL_TEACHING_RECORDS, INITIAL_STUDENTS } from '../../data/mockData';

interface WeeklyReportingModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUserRole?: string;
}

export const WeeklyReportingModal: React.FC<WeeklyReportingModalProps> = ({
  isOpen,
  onClose,
  currentUserRole = 'TEACHER'
}) => {
  const [activeTab, setActiveTab] = useState<'STUDENT_REPORT' | 'TEACHING_RECORD' | 'CLASS_REPORT'>('STUDENT_REPORT');
  const [reports, setReports] = useState<WeeklyStudentReport[]>(INITIAL_STUDENT_REPORTS);
  const [records, setRecords] = useState<WeeklyTeachingRecord[]>(INITIAL_TEACHING_RECORDS);
  const [selectedReport, setSelectedReport] = useState<WeeklyStudentReport>(INITIAL_STUDENT_REPORTS[0]);
  const [searchQuery, setSearchQuery] = useState('');

  // Form State for Creating New Teaching Record
  const [isCreatingRecord, setIsCreatingRecord] = useState(false);
  const [newDate, setNewDate] = useState('2025-02-14');
  const [newSubject, setNewSubject] = useState('Chemistry');
  const [newForm, setNewForm] = useState('Form IV');
  const [newClass, setNewClass] = useState('Form IV A');
  const [newTopic, setNewTopic] = useState('Organic Chemistry');
  const [newSubtopic, setNewSubtopic] = useState('Alcohols Oxidation');
  const [newWhatWasTaught, setNewWhatWasTaught] = useState('');
  const [newObjective, setNewObjective] = useState('');

  if (!isOpen) return null;

  const handleCreateRecordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWhatWasTaught) return;

    const rec: WeeklyTeachingRecord = {
      id: `tr-${Date.now()}`,
      date: newDate,
      subject: newSubject,
      form: newForm,
      className: newClass,
      topic: newTopic,
      subtopic: newSubtopic,
      whatWasTaught: newWhatWasTaught,
      learningObjective: newObjective || 'Students master core principles and problem solving.',
      activity: 'Classroom lecture, experiment demonstration, and worksheet exercises.',
      assessment: 'End of period 5-question quick quiz.',
      remarks: 'Log recorded successfully by teacher.',
      teacherId: 'teacher-1',
      teacherName: 'Mwl. Isaack Edward Lungwa'
    };

    setRecords([rec, ...records]);
    setIsCreatingRecord(false);
    setNewWhatWasTaught('');
    alert('Weekly Teaching Record logged successfully!');
  };

  const handlePrint = () => {
    window.print();
  };

  const filteredReports = reports.filter(r => 
    r.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.className.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.admissionNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-slate-900 text-white rounded-2xl w-full max-w-5xl max-h-[92vh] flex flex-col shadow-2xl border border-slate-800 overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-4 flex items-center justify-between border-b border-slate-800 bg-slate-950">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600/20 text-blue-400 rounded-xl border border-blue-500/30">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider">KDLH Academic Management</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-blue-950 text-blue-300 font-bold border border-blue-800">
                  Student & Teaching Weekly Reports
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-white">
                Weekly Student Report & Teaching Records Center
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-bold transition flex items-center gap-1.5"
            >
              <Printer className="w-4 h-4 text-amber-400" /> Print Report
            </button>
            <button
              onClick={onClose}
              className="p-2 bg-slate-800 hover:bg-rose-900 text-slate-300 hover:text-white rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="px-6 py-3 bg-slate-950 border-b border-slate-800 flex items-center gap-2 overflow-x-auto">
          {[
            { id: 'STUDENT_REPORT', label: 'Individual Student Reports', icon: <User className="w-4 h-4 text-blue-400" /> },
            { id: 'TEACHING_RECORD', label: 'Weekly Teaching Records (What Was Taught)', icon: <BookOpen className="w-4 h-4 text-emerald-400" /> },
            { id: 'CLASS_REPORT', label: 'Weekly Class Performance Summary', icon: <TrendingUp className="w-4 h-4 text-purple-400" /> }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap ${
                activeTab === tab.id 
                  ? 'bg-blue-600 text-white shadow-md' 
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          
          {/* TAB 1: INDIVIDUAL STUDENT REPORT */}
          {activeTab === 'STUDENT_REPORT' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Student Search & List */}
              <div className="lg:col-span-4 space-y-3">
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="Search student or class..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
                  {filteredReports.map(rep => (
                    <div
                      key={rep.id}
                      onClick={() => setSelectedReport(rep)}
                      className={`p-3.5 rounded-xl border transition cursor-pointer ${
                        selectedReport.id === rep.id
                          ? 'bg-blue-600/20 border-blue-500'
                          : 'bg-slate-950/60 border-slate-800 hover:bg-slate-950'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-bold text-xs text-white">{rep.studentName}</h4>
                          <span className="text-[10px] text-slate-400">{rep.admissionNumber} • {rep.className}</span>
                        </div>
                        <span className="text-[10px] bg-emerald-950 text-emerald-400 px-2 py-0.5 rounded font-bold border border-emerald-800">
                          Week {rep.weekNumber}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Selected Student Printable Report Card */}
              <div className="lg:col-span-8 bg-slate-950 p-6 sm:p-8 rounded-2xl border border-slate-800 space-y-6 text-slate-200 shadow-xl print:bg-white print:text-black">
                
                {/* Official Letterhead */}
                <div className="border-b border-slate-800 pb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-black text-white uppercase tracking-wider">KIZIMBA SECONDARY SCHOOL</h2>
                    <p className="text-xs text-amber-400 font-bold uppercase tracking-widest">KIZIMBA DIGITAL LEARNING HUB (KDLH)</p>
                    <p className="text-[11px] text-slate-400">Official Student Weekly Academic & Progress Performance Report</p>
                  </div>
                  <div className="text-right text-xs text-slate-400 font-mono">
                    <p><strong>Week No:</strong> {selectedReport.weekNumber}</p>
                    <p><strong>Period:</strong> {selectedReport.datesRange}</p>
                    <p><strong>Generated:</strong> {selectedReport.dateGenerated}</p>
                  </div>
                </div>

                {/* Student Profile Overview Grid */}
                <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                  <div>
                    <span className="text-slate-500 text-[10px] block uppercase font-bold">Student Name</span>
                    <strong className="text-white text-sm">{selectedReport.studentName}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px] block uppercase font-bold">Admission No</span>
                    <strong className="text-teal-400">{selectedReport.admissionNumber}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px] block uppercase font-bold">Class / Form</span>
                    <strong className="text-white">{selectedReport.className} ({selectedReport.form})</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px] block uppercase font-bold">Attendance</span>
                    <strong className="text-emerald-400">{selectedReport.attendanceDays} / {selectedReport.totalSchoolDays} Days</strong>
                  </div>
                </div>

                {/* Marks & Tests Table */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-amber-400" /> Weekly Assessment & Test Marks
                  </h4>

                  <div className="overflow-x-auto border border-slate-800 rounded-xl">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-900 text-slate-400 text-[10px] uppercase tracking-wider">
                        <tr>
                          <th className="p-3">Subject</th>
                          <th className="p-3">Score</th>
                          <th className="p-3">Total</th>
                          <th className="p-3">Percentage</th>
                          <th className="p-3">Grade</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800 text-slate-300 font-mono">
                        {(selectedReport.marksObtained || []).map((m, idx) => {
                          const pct = Math.round((m.score / m.total) * 100);
                          return (
                            <tr key={idx} className="hover:bg-slate-900/50">
                              <td className="p-3 font-bold text-white">{m.subject}</td>
                              <td className="p-3">{m.score}</td>
                              <td className="p-3">{m.total}</td>
                              <td className="p-3 font-bold text-teal-400">{pct}%</td>
                              <td className="p-3">
                                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-950 text-blue-300 border border-blue-800">
                                  {m.grade}
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Topics Covered & Homework */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 space-y-2">
                    <h5 className="font-bold text-blue-400 uppercase text-[10px]">Topics Taught This Week</h5>
                    <ul className="list-disc list-inside space-y-1 text-slate-300">
                      {(selectedReport.topicsCovered || []).map((t, idx) => (
                        <li key={idx}>{t}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 space-y-2">
                    <h5 className="font-bold text-emerald-400 uppercase text-[10px]">Homework & Assignment Status</h5>
                    <p className="text-slate-300 leading-relaxed">{selectedReport.homeworkStatus}</p>
                  </div>
                </div>

                {/* Strengths, Weaknesses & Teacher Remarks */}
                <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 space-y-3 text-xs">
                  <div>
                    <h5 className="font-bold text-emerald-400 uppercase text-[10px]">Key Academic Strengths</h5>
                    <p className="text-slate-300">{selectedReport.strengths.join(' • ')}</p>
                  </div>

                  <div>
                    <h5 className="font-bold text-amber-400 uppercase text-[10px]">Areas Needing Improvement</h5>
                    <p className="text-slate-300">{selectedReport.weaknesses.join(' • ')}</p>
                  </div>

                  <div className="pt-2 border-t border-slate-800">
                    <h5 className="font-bold text-white uppercase text-[10px] mb-1">Class Teacher Remarks & Recommendation</h5>
                    <p className="text-slate-300 italic font-sans">"{selectedReport.teacherComments}"</p>
                    <p className="text-teal-400 font-bold mt-2">Recommended Action: {selectedReport.recommendedImprovement}</p>
                  </div>
                </div>

                {/* Teacher Sign Off */}
                <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-500">
                  <div>
                    <span>Class Teacher: <strong>{selectedReport.teacherName}</strong></span>
                  </div>
                  <div>
                    <span>Authorized Signature: _______________________</span>
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* TAB 2: WEEKLY TEACHING RECORD (WHAT WAS TAUGHT) */}
          {activeTab === 'TEACHING_RECORD' && (
            <div className="space-y-6">
              
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <h4 className="text-sm font-bold text-white">Weekly Teaching Records Log</h4>
                  <p className="text-xs text-slate-400">Official log of subjects, topics, subtopics, learning objectives, activities and remarks taught each week.</p>
                </div>

                <button
                  onClick={() => setIsCreatingRecord(!isCreatingRecord)}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-md flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" /> {isCreatingRecord ? 'Cancel Logging' : 'Log New Teaching Record'}
                </button>
              </div>

              {/* Form to Log New Record */}
              {isCreatingRecord && (
                <form onSubmit={handleCreateRecordSubmit} className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-4 text-xs font-bold">
                  <h5 className="text-sm text-emerald-400 font-bold">Log Classroom Teaching Session</h5>

                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                    <div>
                      <label className="block text-slate-400 mb-1">Date</label>
                      <input
                        type="date"
                        required
                        value={newDate}
                        onChange={(e) => setNewDate(e.target.value)}
                        className="w-full p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white font-sans"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 mb-1">Subject</label>
                      <select
                        value={newSubject}
                        onChange={(e) => setNewSubject(e.target.value)}
                        className="w-full p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white font-sans"
                      >
                        <option value="Chemistry">Chemistry</option>
                        <option value="Physics">Physics</option>
                        <option value="Biology">Biology</option>
                        <option value="Mathematics">Mathematics</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-slate-400 mb-1">Form</label>
                      <select
                        value={newForm}
                        onChange={(e) => setNewForm(e.target.value)}
                        className="w-full p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white font-sans"
                      >
                        <option value="Form IV">Form IV</option>
                        <option value="Form II">Form II</option>
                        <option value="Form VI">Form VI</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-slate-400 mb-1">Class Stream</label>
                      <input
                        type="text"
                        value={newClass}
                        onChange={(e) => setNewClass(e.target.value)}
                        className="w-full p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white font-sans"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-400 mb-1">Topic</label>
                      <input
                        type="text"
                        required
                        value={newTopic}
                        onChange={(e) => setNewTopic(e.target.value)}
                        className="w-full p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white font-sans"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 mb-1">Subtopic</label>
                      <input
                        type="text"
                        required
                        value={newSubtopic}
                        onChange={(e) => setNewSubtopic(e.target.value)}
                        className="w-full p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white font-sans"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1">What Was Taught (Detailed Description)</label>
                    <textarea
                      required
                      placeholder="Detail concepts taught, chemical equations, diagrams drawn, or lab experiments..."
                      value={newWhatWasTaught}
                      onChange={(e) => setNewWhatWasTaught(e.target.value)}
                      className="w-full p-3 bg-slate-900 border border-slate-800 rounded-xl text-white font-sans h-20"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs uppercase tracking-wider"
                  >
                    Save Teaching Record Log
                  </button>
                </form>
              )}

              {/* Teaching Records Table */}
              <div className="space-y-3">
                {records.map(rec => (
                  <div key={rec.id} className="p-5 bg-slate-950 rounded-2xl border border-slate-800 space-y-2 text-xs">
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-emerald-400">{rec.subject} ({rec.form} - {rec.className})</span>
                        <span>•</span>
                        <span className="text-slate-400">{rec.date}</span>
                      </div>
                      <span className="text-slate-400 font-semibold">Teacher: {rec.teacherName}</span>
                    </div>

                    <h4 className="font-bold text-white text-sm">Topic: {rec.topic} — {rec.subtopic}</h4>
                    <p className="text-slate-300 leading-relaxed font-sans">
                      <strong>What Was Taught:</strong> {rec.whatWasTaught}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-[11px] text-slate-400">
                      <div><strong>Learning Objective:</strong> {rec.learningObjective}</div>
                      <div><strong>Class Activity:</strong> {rec.activity}</div>
                      <div><strong>Assessment / Remarks:</strong> {rec.remarks}</div>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          )}

          {/* TAB 3: WEEKLY CLASS PERFORMANCE SUMMARY */}
          {activeTab === 'CLASS_REPORT' && (
            <div className="space-y-6">
              <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-4 text-xs">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div>
                    <span className="text-xs font-bold text-purple-400 uppercase tracking-widest block">Class Performance Metrics</span>
                    <h4 className="text-base font-bold text-white">Form IV A — Weekly Academic Class Summary</h4>
                  </div>
                  <span className="text-xs bg-purple-950 text-purple-300 px-3 py-1 rounded-full font-bold border border-purple-800">
                    Week 6 (Feb 2025)
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                  <div className="p-4 bg-slate-900 rounded-xl border border-slate-800">
                    <span className="text-2xl font-bold text-white block">42</span>
                    <span className="text-[10px] text-slate-400 uppercase font-bold">Total Students</span>
                  </div>
                  <div className="p-4 bg-slate-900 rounded-xl border border-slate-800">
                    <span className="text-2xl font-bold text-emerald-400 block">82.4%</span>
                    <span className="text-[10px] text-slate-400 uppercase font-bold">Class Test Average</span>
                  </div>
                  <div className="p-4 bg-slate-900 rounded-xl border border-slate-800">
                    <span className="text-2xl font-bold text-amber-400 block">100%</span>
                    <span className="text-[10px] text-slate-400 uppercase font-bold">Highest Score</span>
                  </div>
                  <div className="p-4 bg-slate-900 rounded-xl border border-slate-800">
                    <span className="text-2xl font-bold text-blue-400 block">98%</span>
                    <span className="text-[10px] text-slate-400 uppercase font-bold">Weekly Attendance</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 space-y-2">
                    <h5 className="font-bold text-emerald-400 uppercase text-[10px]">Top Performing Students This Week</h5>
                    <ul className="space-y-1 text-slate-300 font-mono">
                      <li className="flex justify-between"><span>1. Neema John</span><strong className="text-emerald-400">98% Avg</strong></li>
                      <li className="flex justify-between"><span>2. Juma Baraka</span><strong className="text-emerald-400">88% Avg</strong></li>
                      <li className="flex justify-between"><span>3. David Emmanuel</span><strong className="text-emerald-400">85% Avg</strong></li>
                    </ul>
                  </div>

                  <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 space-y-2">
                    <h5 className="font-bold text-amber-400 uppercase text-[10px]">Students Recommended for Remedial Coaching</h5>
                    <ul className="space-y-1 text-slate-300 font-mono">
                      <li className="flex justify-between"><span>1. Baraka Said</span><span className="text-amber-400">Physics Loop Equations</span></li>
                      <li className="flex justify-between"><span>2. Amina Hassan</span><span className="text-amber-400">Stoichiometry Calculations</span></li>
                    </ul>
                  </div>
                </div>

              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-500">
          <span>Kizimba Digital Learning Hub (KDLH) Reporting Engine</span>
          <button 
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg font-semibold transition-colors"
          >
            Close Report Center
          </button>
        </div>

      </div>
    </div>
  );
};
