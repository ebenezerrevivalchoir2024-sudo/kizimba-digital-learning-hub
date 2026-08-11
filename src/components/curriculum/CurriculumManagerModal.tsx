import React, { useState } from 'react';
import { X, Plus, Trash2, Edit2, Link, Save, Database, Upload, Download, BookOpen, Layers } from 'lucide-react';
import { CurriculumTopic, CurriculumSubtopic } from '../../types';
import { KdlhStorageService } from '../../services/storage';

interface CurriculumManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CurriculumManagerModal: React.FC<CurriculumManagerModalProps> = ({
  isOpen,
  onClose
}) => {
  const [selectedForm, setSelectedForm] = useState<string>('Form IV');
  const [selectedSubject, setSelectedSubject] = useState<string>('Chemistry');
  const [topics, setTopics] = useState<CurriculumTopic[]>(
    KdlhStorageService.getCurriculumTopics()
  );

  const [activeTopicId, setActiveTopicId] = useState<string>(
    topics[0]?.id || 'topic-chem-f4-1'
  );

  const [newTopicName, setNewTopicName] = useState<string>('');
  const [newSubtopicName, setNewSubtopicName] = useState<string>('');

  if (!isOpen) return null;

  const filteredTopics = topics.filter(
    t => t.form === selectedForm && t.subjectName.toLowerCase() === selectedSubject.toLowerCase()
  );

  const activeTopic = topics.find(t => t.id === activeTopicId) || filteredTopics[0] || topics[0];

  const handleAddTopic = () => {
    if (!newTopicName.trim()) return;
    const newTopic: CurriculumTopic = {
      id: `topic-${Date.now()}`,
      subjectId: `sub-${selectedSubject.toLowerCase().slice(0, 4)}`,
      subjectName: selectedSubject,
      form: selectedForm,
      level: selectedForm.includes('V') ? 'ADVANCED_SECONDARY' : 'ORDINARY_SECONDARY',
      name: newTopicName,
      description: `Official ${selectedForm} syllabus topic for ${selectedSubject}`,
      orderIndex: topics.length + 1,
      subtopics: []
    };

    const updated = [...topics, newTopic];
    setTopics(updated);
    KdlhStorageService.saveCurriculumTopics(updated);
    setActiveTopicId(newTopic.id);
    setNewTopicName('');
  };

  const handleAddSubtopic = () => {
    if (!newSubtopicName.trim() || !activeTopic) return;
    const newSub: CurriculumSubtopic = {
      id: `subtopic-${Date.now()}`,
      topicId: activeTopic.id,
      name: newSubtopicName,
      competencies: ['Master fundamental principles and problem solving'],
      linkedResourceIds: []
    };

    const updated = topics.map(t => {
      if (t.id === activeTopic.id) {
        return { ...t, subtopics: [...t.subtopics, newSub] };
      }
      return t;
    });

    setTopics(updated);
    KdlhStorageService.saveCurriculumTopics(updated);
    setNewSubtopicName('');
  };

  const handleDeleteTopic = (id: string) => {
    const updated = topics.filter(t => t.id !== id);
    setTopics(updated);
    KdlhStorageService.saveCurriculumTopics(updated);
    if (activeTopicId === id && updated.length > 0) {
      setActiveTopicId(updated[0].id);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-2 sm:p-4 overflow-y-auto">
      <div className="bg-slate-900 text-slate-100 rounded-2xl w-full max-w-5xl shadow-2xl border border-slate-800 flex flex-col max-h-[92vh] overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/20">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-100">KDLH Official Curriculum Control Center</h2>
              <p className="text-xs text-slate-400">Manage Forms I-VI topics, subtopics, and linked learning resources</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => alert('Syllabus CSV template exported.')}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg border border-slate-700 transition flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5 text-teal-400" /> CSV Export
            </button>
            <button 
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="p-4 border-b border-slate-800 bg-slate-950/60 flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="text-slate-400 font-semibold">Form:</span>
              <select
                value={selectedForm}
                onChange={(e) => setSelectedForm(e.target.value)}
                className="px-2.5 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-teal-300 font-bold focus:outline-none focus:border-teal-500"
              >
                <option value="Form I">Form I</option>
                <option value="Form II">Form II</option>
                <option value="Form III">Form III</option>
                <option value="Form IV">Form IV</option>
                <option value="Form V">Form V</option>
                <option value="Form VI">Form VI</option>
              </select>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="text-slate-400 font-semibold">Subject:</span>
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="px-2.5 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-teal-500"
              >
                <option value="Chemistry">Chemistry</option>
                <option value="Physics">Physics</option>
                <option value="Biology">Biology</option>
                <option value="Mathematics">Mathematics</option>
                <option value="Geography">Geography</option>
                <option value="History">History</option>
                <option value="English">English</option>
                <option value="Kiswahili">Kiswahili</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="New Topic Name..."
              value={newTopicName}
              onChange={(e) => setNewTopicName(e.target.value)}
              className="px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 text-xs focus:outline-none focus:border-teal-500"
            />
            <button
              onClick={handleAddTopic}
              className="px-3 py-1.5 bg-teal-600 hover:bg-teal-500 text-white font-bold rounded-lg text-xs flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" /> Add Topic
            </button>
          </div>
        </div>

        {/* Master-Detail Topic Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-0 flex-1 overflow-hidden">
          
          {/* Topics Sidebar */}
          <div className="md:col-span-5 border-r border-slate-800 p-4 space-y-2 overflow-y-auto">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              Topics ({filteredTopics.length})
            </h3>

            {filteredTopics.length === 0 ? (
              <div className="py-12 text-center text-slate-500 text-xs">
                No topics created for {selectedForm} {selectedSubject} yet.
              </div>
            ) : (
              filteredTopics.map((t) => (
                <div
                  key={t.id}
                  onClick={() => setActiveTopicId(t.id)}
                  className={`p-3 rounded-xl border transition cursor-pointer flex items-center justify-between ${
                    activeTopicId === t.id
                      ? 'border-teal-500 bg-teal-500/10'
                      : 'border-slate-800 bg-slate-950/60 hover:bg-slate-950'
                  }`}
                >
                  <div>
                    <h4 className="text-xs font-bold text-slate-200">{t.name}</h4>
                    <p className="text-[10px] text-teal-400 mt-0.5">{t.subtopics.length} Subtopics linked</p>
                  </div>

                  <button
                    onClick={(e) => { e.stopPropagation(); handleDeleteTopic(t.id); }}
                    className="p-1 text-slate-500 hover:text-red-400"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Subtopics & Linked Resources */}
          <div className="md:col-span-7 p-5 space-y-4 overflow-y-auto bg-slate-950">
            {activeTopic ? (
              <>
                <div className="pb-3 border-b border-slate-800">
                  <span className="text-[10px] text-teal-400 font-bold uppercase tracking-widest block">
                    {activeTopic.form} • {activeTopic.subjectName}
                  </span>
                  <h3 className="text-base font-extrabold text-slate-100 mt-0.5">{activeTopic.name}</h3>
                  <p className="text-xs text-slate-400 mt-1">{activeTopic.description}</p>
                </div>

                {/* Subtopic Creator */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter new subtopic name..."
                    value={newSubtopicName}
                    onChange={(e) => setNewSubtopicName(e.target.value)}
                    className="flex-1 px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-teal-500"
                  />
                  <button
                    onClick={handleAddSubtopic}
                    className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs rounded-xl transition flex items-center gap-1"
                  >
                    <Plus className="w-4 h-4" /> Add Subtopic
                  </button>
                </div>

                {/* Subtopics List */}
                <div className="space-y-3 pt-2">
                  {activeTopic.subtopics.map((sub, i) => (
                    <div key={sub.id} className="p-3.5 bg-slate-900 border border-slate-800 rounded-xl space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-slate-200">
                          {i + 1}. {sub.name}
                        </span>
                        <span className="text-[10px] text-teal-400 font-semibold flex items-center gap-1">
                          <Link className="w-3 h-3" /> {sub.linkedResourceIds.length} Resources
                        </span>
                      </div>

                      <div className="text-[11px] text-slate-400">
                        Competencies: {sub.competencies.join(', ')}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="py-20 text-center text-slate-500 text-xs">
                Select or add a topic on the left sidebar to manage subtopics.
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
