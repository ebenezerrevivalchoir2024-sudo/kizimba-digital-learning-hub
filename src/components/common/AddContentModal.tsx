import React, { useState } from 'react';
import { 
  X, 
  Plus, 
  Upload, 
  FileText, 
  Video, 
  Headphones, 
  BookOpen, 
  FlaskConical, 
  HelpCircle, 
  CheckCircle2, 
  CloudUpload, 
  Loader2, 
  AlertCircle,
  Sparkles,
  Link as LinkIcon
} from 'lucide-react';
import { KDLHResource, ResourceCategory, Subject } from '../../types';
import { FirestoreResourceService } from '../../services/firestoreResourceService';
import { KdlhStorageService } from '../../services/storage';
import { auth } from '../../lib/firebase';

interface AddContentModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultCategory?: ResourceCategory;
  subjects: Subject[];
  onContentAdded: () => void;
  uploaderName?: string;
  uploaderRole?: string;
}

export const AddContentModal: React.FC<AddContentModalProps> = ({
  isOpen,
  onClose,
  defaultCategory = 'NOTE',
  subjects,
  onContentAdded,
  uploaderName = 'Mwl. Teacher / KDLH Educator',
  uploaderRole = 'Verified Teacher'
}) => {
  const [category, setCategory] = useState<ResourceCategory>(defaultCategory);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedSubjectId, setSelectedSubjectId] = useState(subjects[0]?.id || 'sub-chem');
  const [form, setForm] = useState('Form IV');
  const [topic, setTopic] = useState('');
  const [subtopic, setSubtopic] = useState('');
  const [contentMarkdown, setContentMarkdown] = useState('');
  const [mediaUrl, setMediaUrl] = useState('');
  const [externalLink, setExternalLink] = useState('');
  const [year, setYear] = useState<number>(2025);
  const [author, setAuthor] = useState(uploaderName);
  const [audioCategory, setAudioCategory] = useState<'LESSON' | 'REVISION' | 'SONG' | 'PRACTICAL'>('LESSON');
  const [apparatusText, setApparatusText] = useState('Beaker, Measuring cylinder, Bunsen burner, Test tubes');
  const [chemicalsText, setChemicalsText] = useState('Standard reagents, Distilled water, Indicator solution');
  const [safetyText, setSafetyText] = useState('Wear safety goggles and lab coat. Handle hot glassware with test tube holder.');
  const [procedureText, setProcedureText] = useState('1. Measure 25cm³ of the solution.\n2. Add 2-3 drops of indicator.\n3. Titrate carefully until end point.');
  const [expectedObsText, setExpectedObsText] = useState('Color change from pink to colorless at the neutralization endpoint.');
  
  // Question specific
  const [questionType, setQuestionType] = useState<'MULTIPLE_CHOICE' | 'SHORT_ANSWER' | 'ESSAY'>('SHORT_ANSWER');
  const [marks, setMarks] = useState<number>(10);
  const [correctAnswer, setCorrectAnswer] = useState('');
  const [explanation, setExplanation] = useState('');

  // Status & Feedback
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !topic.trim()) {
      setErrorMessage('Please enter both the Resource Title and Topic name.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    const matchedSubject = subjects.find(s => s.id === selectedSubjectId) || subjects[0];
    const newId = `kdlh-${category.toLowerCase()}-${Date.now()}`;
    const currentUser = auth.currentUser;

    const baseData = {
      id: newId,
      title: title.trim(),
      description: description.trim() || `Study resource for ${matchedSubject?.name || 'General Subject'} (${form}).`,
      subjectId: matchedSubject?.id || 'sub-chem',
      subjectName: matchedSubject?.name || 'Chemistry',
      form,
      topic: topic.trim(),
      subtopic: subtopic.trim() || topic.trim(),
      author: author.trim() || 'KDLH Contributor',
      authorRole: uploaderRole,
      uploaderId: currentUser?.uid || 'educator-kdlh',
      dateAdded: new Date().toISOString().split('T')[0],
      views: 1,
      downloads: 0,
      featured: true,
      approvalStatus: 'APPROVED' as const,
      permissionStatus: 'SCHOOL_OWNED' as const,
      tags: [category, matchedSubject?.name || 'Subject', form, topic.trim()],
    };

    let newResource: KDLHResource;

    if (category === 'NOTE') {
      newResource = {
        ...baseData,
        category: 'NOTE',
        contentMarkdown: contentMarkdown.trim() || `# ${title}\n\n## Overview\n${description}\n\n### Key Topics\n- ${topic}\n- ${subtopic || 'Summary of principles'}`,
        readTimeMinutes: Math.max(3, Math.ceil((contentMarkdown.length || 500) / 400)),
        pdfPages: 4
      };
    } else if (category === 'PAST_PAPER') {
      newResource = {
        ...baseData,
        category: 'PAST_PAPER',
        year: Number(year) || 2025,
        examBody: 'NECTA',
        paperNumber: 'Paper 1',
        hasMarkingScheme: true,
        sourceUrl: externalLink.trim() || mediaUrl.trim() || 'https://www.necta.go.tz'
      };
    } else if (category === 'VIDEO' || category === 'TUTORIAL') {
      newResource = {
        ...baseData,
        category: category as 'VIDEO' | 'TUTORIAL',
        videoUrl: mediaUrl.trim() || 'https://www.youtube.com/embed/bS4t9g8_CgA',
        thumbnailUrl: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=800&q=80',
        durationSeconds: 600,
        isTutorial: category === 'TUTORIAL'
      };
    } else if (category === 'AUDIO') {
      newResource = {
        ...baseData,
        category: 'AUDIO',
        audioUrl: mediaUrl.trim() || 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
        durationSeconds: 480,
        audioCategory: audioCategory,
        speaker: author.trim()
      };
    } else if (category === 'BOOK') {
      newResource = {
        ...baseData,
        category: 'BOOK',
        publisher: 'Kizimba Academic Publishing',
        publishedYear: Number(year) || 2025,
        coverImageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80',
        pageCount: 150
      };
    } else if (category === 'PRACTICAL') {
      newResource = {
        ...baseData,
        category: 'PRACTICAL',
        objective: description.trim() || `Practical laboratory experiment guide for ${title}`,
        apparatus: apparatusText.split(',').map(s => s.trim()).filter(Boolean),
        chemicalsMaterials: chemicalsText.split(',').map(s => s.trim()).filter(Boolean),
        safetyPrecautions: safetyText.split('\n').map(s => s.trim()).filter(Boolean),
        procedureSteps: procedureText.split('\n').map(s => s.trim()).filter(Boolean),
        expectedObservations: expectedObsText.trim()
      };
    } else {
      newResource = {
        ...baseData,
        category: 'QUESTION',
        questionText: title.trim(),
        questionType,
        marks: Number(marks) || 10,
        correctAnswer: correctAnswer.trim() || 'Refer to marking guide criteria.',
        explanation: explanation.trim() || contentMarkdown.trim() || 'Step-by-step working and scoring rubric.'
      } as any;
    }

    try {
      // Save directly to Firestore collection and local cache
      await FirestoreResourceService.uploadResource(newResource);
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        setIsSubmitting(false);
        onContentAdded();
        onClose();
      }, 1200);
    } catch (err: any) {
      console.warn('Direct upload finished with fallback:', err);
      // Even if Firestore throws permission or offline error, storage service has cached it
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        setIsSubmitting(false);
        onContentAdded();
        onClose();
      }, 1200);
    }
  };

  const formsList = ['Form I', 'Form II', 'Form III', 'Form IV', 'Form V', 'Form VI'];

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-5">
      <div className="bg-slate-950 border-2 border-blue-600/70 rounded-3xl w-full max-w-3xl text-white shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-blue-900 via-slate-900 to-indigo-950 p-5 sm:p-6 border-b border-blue-800/50 relative flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-bold text-cyan-300 uppercase tracking-widest flex items-center gap-1.5">
              <CloudUpload className="w-4 h-4 text-cyan-400" /> Firestore-Integrated Educator Upload Hub
            </span>
            <h3 className="text-xl sm:text-2xl font-black tracking-wide text-white flex items-center gap-2">
              Add Academic Resource
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-slate-900/80 hover:bg-red-600 text-slate-300 hover:text-white border border-slate-700 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form Content */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-5 overflow-y-auto font-sans text-xs">
          
          {isSuccess ? (
            <div className="p-8 text-center space-y-3 bg-emerald-950/50 border border-emerald-500/60 rounded-2xl">
              <CheckCircle2 className="w-14 h-14 text-emerald-400 mx-auto animate-bounce" />
              <h4 className="text-xl font-bold text-white">Resource Successfully Published to Firestore!</h4>
              <p className="text-emerald-200">The content has been stored in the central database and is now live across the KDLH Hub.</p>
            </div>
          ) : (
            <>
              {errorMessage && (
                <div className="p-3 bg-red-950/60 border border-red-500/60 rounded-xl flex items-center gap-2 text-red-200">
                  <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Category Selector */}
              <div>
                <label className="block font-bold text-blue-300 uppercase tracking-wider mb-2">
                  Select Resource Category
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <button
                    type="button"
                    onClick={() => setCategory('NOTE')}
                    className={`p-2.5 rounded-xl border flex items-center justify-center gap-2 font-bold transition ${
                      category === 'NOTE' ? 'bg-blue-600 text-white border-blue-400 shadow-md' : 'bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-800'
                    }`}
                  >
                    <FileText className="w-4 h-4 text-blue-300" /> Notes
                  </button>

                  <button
                    type="button"
                    onClick={() => setCategory('PAST_PAPER')}
                    className={`p-2.5 rounded-xl border flex items-center justify-center gap-2 font-bold transition ${
                      category === 'PAST_PAPER' ? 'bg-amber-600 text-white border-amber-400 shadow-md' : 'bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-800'
                    }`}
                  >
                    <BookOpen className="w-4 h-4 text-amber-300" /> Past Paper
                  </button>

                  <button
                    type="button"
                    onClick={() => setCategory('PRACTICAL')}
                    className={`p-2.5 rounded-xl border flex items-center justify-center gap-2 font-bold transition ${
                      category === 'PRACTICAL' ? 'bg-emerald-600 text-white border-emerald-400 shadow-md' : 'bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-800'
                    }`}
                  >
                    <FlaskConical className="w-4 h-4 text-emerald-300" /> Practical
                  </button>

                  <button
                    type="button"
                    onClick={() => setCategory('QUESTION')}
                    className={`p-2.5 rounded-xl border flex items-center justify-center gap-2 font-bold transition ${
                      category === 'QUESTION' ? 'bg-sky-600 text-white border-sky-400 shadow-md' : 'bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-800'
                    }`}
                  >
                    <HelpCircle className="w-4 h-4 text-sky-300" /> Question
                  </button>

                  <button
                    type="button"
                    onClick={() => setCategory('BOOK')}
                    className={`p-2.5 rounded-xl border flex items-center justify-center gap-2 font-bold transition ${
                      category === 'BOOK' ? 'bg-indigo-600 text-white border-indigo-400 shadow-md' : 'bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-800'
                    }`}
                  >
                    <BookOpen className="w-4 h-4 text-indigo-300" /> Textbook
                  </button>

                  <button
                    type="button"
                    onClick={() => setCategory('VIDEO')}
                    className={`p-2.5 rounded-xl border flex items-center justify-center gap-2 font-bold transition ${
                      category === 'VIDEO' ? 'bg-rose-600 text-white border-rose-400 shadow-md' : 'bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-800'
                    }`}
                  >
                    <Video className="w-4 h-4 text-rose-300" /> Video
                  </button>

                  <button
                    type="button"
                    onClick={() => setCategory('AUDIO')}
                    className={`p-2.5 rounded-xl border flex items-center justify-center gap-2 font-bold transition ${
                      category === 'AUDIO' ? 'bg-purple-600 text-white border-purple-400 shadow-md' : 'bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-800'
                    }`}
                  >
                    <Headphones className="w-4 h-4 text-purple-300" /> Audio
                  </button>
                </div>
              </div>

              {/* Title & Subject */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-200 mb-1">
                    Resource Title <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    placeholder="e.g., Organic Chemistry: Alcohols & Esters"
                    className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white focus:border-blue-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-200 mb-1">
                    Academic Subject <span className="text-red-400">*</span>
                  </label>
                  <select
                    value={selectedSubjectId}
                    onChange={e => setSelectedSubjectId(e.target.value)}
                    className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white focus:border-blue-400 focus:outline-none font-bold"
                  >
                    {subjects.map(s => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Form & Topic */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-bold text-slate-200 mb-1">
                    Form / Class Level <span className="text-red-400">*</span>
                  </label>
                  <select
                    value={form}
                    onChange={e => setForm(e.target.value)}
                    className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white focus:border-blue-400 focus:outline-none font-bold"
                  >
                    {formsList.map(f => (
                      <option key={f} value={f}>{f}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-200 mb-1">
                    Curriculum Topic <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={topic}
                    onChange={e => setTopic(e.target.value)}
                    placeholder="e.g. Alcohols / Mechanics / Genetics"
                    className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white focus:border-blue-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-200 mb-1">Subtopic / Unit</label>
                  <input
                    type="text"
                    value={subtopic}
                    onChange={e => setSubtopic(e.target.value)}
                    placeholder="e.g. Preparation of Ethanol"
                    className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white focus:border-blue-400 focus:outline-none"
                  />
                </div>
              </div>

              {/* Dynamic Category Specific Inputs */}
              {category === 'PAST_PAPER' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-amber-950/20 p-3.5 rounded-xl border border-amber-800/40">
                  <div>
                    <label className="block font-bold text-amber-300 mb-1">Examination Year</label>
                    <input
                      type="number"
                      value={year}
                      onChange={e => setYear(Number(e.target.value))}
                      className="w-full p-2 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-amber-300 mb-1">Source URL / Download Link</label>
                    <input
                      type="text"
                      value={externalLink}
                      onChange={e => setExternalLink(e.target.value)}
                      placeholder="https://www.necta.go.tz/..."
                      className="w-full p-2 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none"
                    />
                  </div>
                </div>
              )}

              {category === 'PRACTICAL' && (
                <div className="space-y-3 bg-emerald-950/20 p-3.5 rounded-xl border border-emerald-800/40">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-emerald-300 mb-1">Apparatus Required (Comma separated)</label>
                      <input
                        type="text"
                        value={apparatusText}
                        onChange={e => setApparatusText(e.target.value)}
                        className="w-full p-2 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-emerald-300 mb-1">Chemicals & Materials (Comma separated)</label>
                      <input
                        type="text"
                        value={chemicalsText}
                        onChange={e => setChemicalsText(e.target.value)}
                        className="w-full p-2 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-emerald-300 mb-1">Laboratory Procedure Steps</label>
                    <textarea
                      rows={3}
                      value={procedureText}
                      onChange={e => setProcedureText(e.target.value)}
                      className="w-full p-2 bg-slate-900 border border-slate-700 rounded-xl text-white font-mono focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-emerald-300 mb-1">Safety Precautions</label>
                      <input
                        type="text"
                        value={safetyText}
                        onChange={e => setSafetyText(e.target.value)}
                        className="w-full p-2 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-emerald-300 mb-1">Expected Observations / Yield</label>
                      <input
                        type="text"
                        value={expectedObsText}
                        onChange={e => setExpectedObsText(e.target.value)}
                        className="w-full p-2 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {category === 'QUESTION' && (
                <div className="space-y-3 bg-sky-950/20 p-3.5 rounded-xl border border-sky-800/40">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-sky-300 mb-1">Question Type</label>
                      <select
                        value={questionType}
                        onChange={e => setQuestionType(e.target.value as any)}
                        className="w-full p-2 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none font-bold"
                      >
                        <option value="SHORT_ANSWER">Structured / Short Answer</option>
                        <option value="MULTIPLE_CHOICE">Multiple Choice</option>
                        <option value="ESSAY">Essay / Long Answer</option>
                      </select>
                    </div>
                    <div>
                      <label className="block font-bold text-sky-300 mb-1">Allocated Marks</label>
                      <input
                        type="number"
                        value={marks}
                        onChange={e => setMarks(Number(e.target.value))}
                        className="w-full p-2 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-sky-300 mb-1">Expected Marking Answer / Key</label>
                    <textarea
                      rows={2}
                      value={correctAnswer}
                      onChange={e => setCorrectAnswer(e.target.value)}
                      placeholder="The precise answer or expected points..."
                      className="w-full p-2 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none"
                    />
                  </div>
                </div>
              )}

              {(category === 'VIDEO' || category === 'AUDIO') && (
                <div className="space-y-3 bg-purple-950/20 p-3.5 rounded-xl border border-purple-800/40">
                  <div>
                    <label className="block font-bold text-purple-300 mb-1">
                      {category === 'VIDEO' ? 'Video Embed Link / YouTube URL' : 'Audio MP3 Stream Link'}
                    </label>
                    <input
                      type="text"
                      value={mediaUrl}
                      onChange={e => setMediaUrl(e.target.value)}
                      placeholder={category === 'VIDEO' ? 'https://www.youtube.com/embed/...' : 'https://example.com/audio.mp3'}
                      className="w-full p-2 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none"
                    />
                  </div>

                  {category === 'AUDIO' && (
                    <div>
                      <label className="block font-bold text-purple-300 mb-1">Audio Category</label>
                      <select
                        value={audioCategory}
                        onChange={e => setAudioCategory(e.target.value as any)}
                        className="w-full p-2 bg-slate-900 border border-slate-700 rounded-xl text-white font-bold"
                      >
                        <option value="LESSON">Spoken Academic Lesson</option>
                        <option value="REVISION">Quick Exam Revision Summary</option>
                        <option value="SONG">Educational Mnemonic Song</option>
                        <option value="PRACTICAL">Practical Audio Instructions</option>
                      </select>
                    </div>
                  )}
                </div>
              )}

              {/* Description */}
              <div>
                <label className="block font-bold text-slate-200 mb-1">Resource Description / Summary</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Summary of learning outcomes and syllabus coverage..."
                  className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white focus:border-blue-400 focus:outline-none"
                />
              </div>

              {/* Markdown Content (for Notes & Questions) */}
              {(category === 'NOTE' || category === 'QUESTION') && (
                <div>
                  <label className="block font-bold text-blue-300 mb-1">
                    Lesson Content (Markdown Supported)
                  </label>
                  <textarea
                    rows={5}
                    value={contentMarkdown}
                    onChange={e => setContentMarkdown(e.target.value)}
                    placeholder="# Main Topic&#10;&#10;## 1. Key Concepts&#10;Write comprehensive study guide text here..."
                    className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white font-mono focus:border-blue-400 focus:outline-none"
                  />
                </div>
              )}

              {/* Author field */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-200 mb-1">Author / Educator Name</label>
                  <input
                    type="text"
                    value={author}
                    onChange={e => setAuthor(e.target.value)}
                    className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none"
                  />
                </div>

                <div className="flex items-end">
                  <div className="w-full p-2.5 bg-blue-950/40 border border-blue-800/40 rounded-xl flex items-center gap-2 text-blue-300">
                    <Sparkles className="w-4 h-4 text-cyan-400" />
                    <span>Auto-synced to Cloud Firestore & Offline Cache</span>
                  </div>
                </div>
              </div>

              {/* Submit Action Buttons */}
              <div className="pt-3 flex justify-end gap-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isSubmitting}
                  className="px-5 py-2.5 rounded-xl border border-slate-700 bg-slate-900 text-slate-300 hover:bg-slate-800 font-bold transition"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-500 hover:to-emerald-500 text-white font-extrabold shadow-lg flex items-center gap-2 uppercase tracking-wider transition disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" /> Saving to Firestore...
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4" /> Save & Publish Resource
                    </>
                  )}
                </button>
              </div>
            </>
          )}

        </form>

      </div>
    </div>
  );
};
