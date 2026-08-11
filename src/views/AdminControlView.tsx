import React, { useState } from 'react';
import { 
  ShieldCheck, CheckCircle2, XCircle, Settings, Users, FileText, Music, 
  Video, Headphones, Play, Plus, Trash2, Edit, ExternalLink, Sparkles, RefreshCw 
} from 'lucide-react';
import { UserProfile, CmsSettings, KDLHResource, VideoResource, AudioResource, MusicResource } from '../types';
import { KdlhStorageService } from '../services/storage';
import { MediaPlayerModal } from '../components/common/MediaPlayerModal';

interface AdminControlViewProps {
  currentUser: UserProfile;
  cmsSettings: CmsSettings;
  onUpdateCms: (settings: CmsSettings) => void;
  resources: KDLHResource[];
  onRefreshResources: () => void;
}

export const AdminControlView: React.FC<AdminControlViewProps> = ({
  currentUser,
  cmsSettings,
  onUpdateCms,
  resources,
  onRefreshResources
}) => {
  const [activeTab, setActiveTab] = useState<'CMS' | 'APPROVALS' | 'MEDIA'>('MEDIA');
  const [mediaSubTab, setMediaSubTab] = useState<'VIDEOS' | 'AUDIO' | 'PRACTICAL_VIDEOS' | 'TUTORIALS' | 'MUSIC'>('VIDEOS');
  const [testingResource, setTestingResource] = useState<KDLHResource | null>(null);

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

  const handleApprove = (id: string) => {
    KdlhStorageService.updateResourceApproval(id, 'APPROVED');
    onRefreshResources();
  };

  const handleReject = (id: string) => {
    KdlhStorageService.updateResourceApproval(id, 'REJECTED');
    onRefreshResources();
  };

  const handleAddMedia = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newMediaUrl) return;

    const isVideoType = mediaSubTab === 'VIDEOS' || mediaSubTab === 'PRACTICAL_VIDEOS' || mediaSubTab === 'TUTORIALS';
    const isAudioType = mediaSubTab === 'AUDIO';
    const isMusicType = mediaSubTab === 'MUSIC';

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
        durationSeconds: 600,
        isTutorial: mediaSubTab === 'TUTORIALS'
      } : {}),
      ...(isAudioType ? {
        audioUrl: newMediaUrl,
        durationSeconds: 480,
        audioCategory: 'LESSON',
        speaker: currentUser.name
      } : {}),
      ...(isMusicType ? {
        artist: 'School Band',
        songTitle: newTitle,
        audioUrl: newMediaUrl,
        durationSeconds: 180,
        rightsRecord: {
          id: `rr-${Date.now()}`,
          artist: 'School Band',
          songTitle: newTitle,
          publisher: 'KDLH Admin',
          rightsOwner: 'Kizimba Secondary School',
          licenseType: newPermission,
          uploadStatus: 'AUTHORIZED',
          approvalStatus: 'APPROVED',
          sourceUrl: newMediaUrl
        }
      } : {})
    } as KDLHResource;

    KdlhStorageService.saveResource(newRes);
    onRefreshResources();
    setNewTitle('');
    setNewMediaUrl('');
    alert('Media item added successfully! Click [TEST MEDIA] to verify playback.');
  };

  // Filter media for admin manager
  const videoMedia = resources.filter(r => r.category === 'VIDEO');
  const tutorialMedia = resources.filter(r => r.category === 'TUTORIAL');
  const practicalVideoMedia = resources.filter(r => r.category === 'VIDEO' && (r.title.toLowerCase().includes('practical') || r.topic.toLowerCase().includes('practical')));
  const audioMedia = resources.filter(r => r.category === 'AUDIO');
  const musicMedia = resources.filter(r => r.category === 'MUSIC');

  const currentMediaList = 
    mediaSubTab === 'VIDEOS' ? videoMedia :
    mediaSubTab === 'PRACTICAL_VIDEOS' ? practicalVideoMedia :
    mediaSubTab === 'TUTORIALS' ? tutorialMedia :
    mediaSubTab === 'AUDIO' ? audioMedia : musicMedia;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8 font-mono">
      
      {/* Header */}
      <div className="bg-slate-900 text-white p-6 rounded-2xl border border-slate-800 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-950 border border-blue-500/40 text-blue-300 text-xs font-bold">
            <ShieldCheck className="w-4 h-4 text-blue-400" /> KDLH System Governance & Media Manager
          </div>
          <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-wider">Admin Control Center</h1>
          <p className="text-xs text-slate-400">
            Founder: <strong className="text-white">ISAACK EDWARD LUNGWA</strong> • Kizimba Digital Learning Hub
          </p>
        </div>

        {/* Main Tabs */}
        <div className="flex items-center gap-2 bg-slate-950 p-1.5 rounded-xl border border-slate-800 text-xs font-bold">
          <button
            onClick={() => setActiveTab('MEDIA')}
            className={`px-4 py-2 rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'MEDIA' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Video className="w-4 h-4" /> Media Manager
          </button>
          <button
            onClick={() => setActiveTab('CMS')}
            className={`px-4 py-2 rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'CMS' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Settings className="w-4 h-4" /> Homepage CMS
          </button>
          <button
            onClick={() => setActiveTab('APPROVALS')}
            className={`px-4 py-2 rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'APPROVALS' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <FileText className="w-4 h-4" /> Approvals ({pendingResources.length})
          </button>
        </div>
      </div>

      {/* MEDIA MANAGER TAB */}
      {activeTab === 'MEDIA' && (
        <div className="space-y-6">
          
          {/* Sub-tabs */}
          <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-3">
            {[
              { key: 'VIDEOS', label: `Video Lessons (${videoMedia.length})`, icon: <Video className="w-4 h-4" /> },
              { key: 'PRACTICAL_VIDEOS', label: `Practical Videos (${practicalVideoMedia.length})`, icon: <Video className="w-4 h-4 text-emerald-400" /> },
              { key: 'TUTORIALS', label: `Tutorials (${tutorialMedia.length})`, icon: <Video className="w-4 h-4 text-purple-400" /> },
              { key: 'AUDIO', label: `Audio Lessons (${audioMedia.length})`, icon: <Headphones className="w-4 h-4 text-teal-400" /> },
              { key: 'MUSIC', label: `School Music (${musicMedia.length})`, icon: <Music className="w-4 h-4 text-pink-400" /> }
            ].map(st => (
              <button
                key={st.key}
                onClick={() => setMediaSubTab(st.key as any)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                  mediaSubTab === st.key 
                    ? 'bg-blue-600 text-white shadow-lg' 
                    : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {st.icon}
                <span>{st.label}</span>
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Add New Media Form */}
            <div className="lg:col-span-4 bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-xl space-y-4">
              <h3 className="text-base font-bold text-white border-b border-slate-800 pb-2 flex items-center gap-2">
                <Plus className="w-4 h-4 text-blue-400" /> Add New {mediaSubTab.replace('_', ' ')}
              </h3>

              <form onSubmit={handleAddMedia} className="space-y-3 text-xs font-bold">
                <div>
                  <label className="block text-slate-400 mb-1">Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Acid-Base Titration Practical Video"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-blue-500 font-sans"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-slate-400 mb-1">Subject</label>
                    <select
                      value={newSubject}
                      onChange={(e) => setNewSubject(e.target.value)}
                      className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-blue-500 font-sans"
                    >
                      <option value="Chemistry">Chemistry</option>
                      <option value="Physics">Physics</option>
                      <option value="Biology">Biology</option>
                      <option value="Mathematics">Mathematics</option>
                      <option value="School Anthem">School Anthem / Arts</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1">Form</label>
                    <select
                      value={newForm}
                      onChange={(e) => setNewForm(e.target.value)}
                      className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-blue-500 font-sans"
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
                  <label className="block text-slate-400 mb-1">Topic</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Volumetric Analysis"
                    value={newTopic}
                    onChange={(e) => setNewTopic(e.target.value)}
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-blue-500 font-sans"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Direct Media Source URL</label>
                  <input
                    type="url"
                    required
                    placeholder="https://www.youtube.com/embed/... or https://.../stream.mp3"
                    value={newMediaUrl}
                    onChange={(e) => setNewMediaUrl(e.target.value)}
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-blue-500 font-sans"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Permission Rights</label>
                  <select
                    value={newPermission}
                    onChange={(e) => setNewPermission(e.target.value as any)}
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-blue-500 font-sans"
                  >
                    <option value="AUTHORIZED">AUTHORIZED (Verified Educational License)</option>
                    <option value="SCHOOL_OWNED">SCHOOL_OWNED (Kizimba Secondary Rights)</option>
                    <option value="OPEN_LICENSE">OPEN_LICENSE (Creative Commons / Public)</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" /> Save Media Item
                </button>
              </form>
            </div>

            {/* Media Items Table with [TEST MEDIA] */}
            <div className="lg:col-span-8 bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-base font-bold text-white uppercase tracking-wider">
                  Active {mediaSubTab.replace('_', ' ')} Directory ({currentMediaList.length})
                </h3>
                <button 
                  onClick={onRefreshResources}
                  className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold flex items-center gap-1.5"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> Refresh List
                </button>
              </div>

              {currentMediaList.length === 0 ? (
                <div className="py-12 text-center text-slate-500 text-xs">
                  No media items configured for this sub-category.<br />Use the form on the left to add one.
                </div>
              ) : (
                <div className="space-y-3 max-h-[550px] overflow-y-auto pr-1">
                  {currentMediaList.map(item => {
                    const videoUrl = (item as VideoResource).videoUrl;
                    const audioUrl = (item as AudioResource).audioUrl || (item as MusicResource).audioUrl;
                    return (
                      <div
                        key={item.id}
                        className="p-4 bg-slate-950/80 rounded-xl border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                      >
                        <div className="space-y-1 max-w-md">
                          <div className="flex items-center gap-2 text-[10px] text-amber-400 font-bold uppercase">
                            <span>{item.subjectName} ({item.form})</span>
                            <span>•</span>
                            <span className="text-emerald-400">{item.permissionStatus}</span>
                          </div>
                          <h4 className="font-bold text-sm text-white">{item.title}</h4>
                          <p className="text-xs text-slate-400 line-clamp-1">{item.description}</p>
                          <span className="text-[10px] text-slate-500 block truncate">
                            URL: {videoUrl || audioUrl || 'Not configured'}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 self-end sm:self-center">
                          {/* CRITICAL [TEST MEDIA] BUTTON */}
                          <button
                            onClick={() => setTestingResource(item)}
                            className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold rounded-xl text-xs flex items-center gap-1.5 shadow-md transition-all"
                            title="Test media playback directly"
                          >
                            <Play className="w-3.5 h-3.5 fill-white" /> TEST MEDIA
                          </button>

                          <button
                            onClick={() => {
                              if (confirm(`Delete media item "${item.title}"?`)) {
                                KdlhStorageService.deleteResource(item.id);
                                onRefreshResources();
                              }
                            }}
                            className="p-2 bg-slate-800 hover:bg-rose-900 text-rose-400 hover:text-white rounded-xl transition-colors"
                            title="Delete item"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

          </div>

        </div>
      )}

      {/* CMS TAB */}
      {activeTab === 'CMS' && (
        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-xl space-y-4 max-w-2xl mx-auto">
          <h3 className="text-lg font-bold text-white border-b border-slate-800 pb-2 flex items-center gap-2">
            <Settings className="w-5 h-5 text-blue-400" /> Platform CMS & Banner Customizer
          </h3>

          {saved && (
            <div className="p-3 bg-emerald-950/60 border border-emerald-500/50 text-emerald-300 rounded-xl text-xs font-bold flex items-center gap-2 font-sans">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" /> Homepage CMS Settings Updated Successfully!
            </div>
          )}

          <form onSubmit={handleCmsSubmit} className="space-y-4 text-xs font-bold">
            <div>
              <label className="block text-slate-400 mb-1">Hero Title</label>
              <input
                type="text"
                value={heroTitle}
                onChange={(e) => setHeroTitle(e.target.value)}
                className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-blue-500 font-sans"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Hero Subtitle</label>
              <textarea
                value={heroSubtitle}
                onChange={(e) => setHeroSubtitle(e.target.value)}
                className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-blue-500 font-sans h-20"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Tagline</label>
              <input
                type="text"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-blue-500 font-sans"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs uppercase tracking-wider transition-all shadow-md"
            >
              Save CMS Changes
            </button>
          </form>
        </div>
      )}

      {/* APPROVALS TAB */}
      {activeTab === 'APPROVALS' && (
        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-xl space-y-4 max-w-3xl mx-auto">
          <h3 className="text-lg font-bold text-white border-b border-slate-800 pb-2 flex items-center justify-between">
            <span className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-400" /> Pending Upload Approvals
            </span>
            <span className="text-xs bg-blue-950 text-blue-300 border border-blue-800 font-extrabold px-2.5 py-0.5 rounded-full">
              {pendingResources.length} Pending
            </span>
          </h3>

          {pendingResources.length > 0 ? (
            <div className="space-y-3">
              {pendingResources.map(res => (
                <div key={res.id} className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-blue-400">{res.category} • {res.form}</span>
                    <span className="text-slate-400">By {res.author}</span>
                  </div>
                  <h4 className="font-bold text-white uppercase tracking-wider">{res.title}</h4>
                  <p className="text-slate-300 line-clamp-1 font-sans">{res.description}</p>

                  <div className="pt-2 flex gap-2">
                    <button
                      onClick={() => handleApprove(res.id)}
                      className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold text-xs flex items-center gap-1 uppercase tracking-wider"
                    >
                      <CheckCircle2 className="w-4 h-4" /> Approve
                    </button>
                    <button
                      onClick={() => handleReject(res.id)}
                      className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-lg font-bold text-xs flex items-center gap-1 uppercase tracking-wider"
                    >
                      <XCircle className="w-4 h-4" /> Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-slate-400 space-y-1">
              <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
              <p className="font-bold text-white text-xs">All submitted items have been reviewed!</p>
            </div>
          )}
        </div>
      )}

      {/* TEST MEDIA MODAL */}
      <MediaPlayerModal
        resource={testingResource}
        allResources={resources}
        onClose={() => setTestingResource(null)}
      />

    </div>
  );
};
