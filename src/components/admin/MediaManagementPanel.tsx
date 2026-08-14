import React, { useState } from 'react';
import { 
  Video, Headphones, Plus, Trash2, Edit3, Eye, EyeOff, Search, 
  CheckCircle, Sparkles, AlertCircle, Upload, ShieldCheck, Film, Music, RefreshCw, X
} from 'lucide-react';
import { 
  KDLHResource, VideoResource, AudioResource, UserProfile, 
  VideoCategoryType, MediaLevelType, AudioHubCategory, AudioSubcategory 
} from '../../types';
import { KdlhStorageService } from '../../services/storage';

interface MediaManagementPanelProps {
  currentUser: UserProfile;
  resources: KDLHResource[];
  onRefreshResources: () => void;
}

export const MediaManagementPanel: React.FC<MediaManagementPanelProps> = ({
  currentUser,
  resources,
  onRefreshResources
}) => {
  const [activeTab, setActiveTab] = useState<'PRACTICAL_VIDEOS' | 'ALL_VIDEOS' | 'AUDIO_HUB'>('PRACTICAL_VIDEOS');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterForm, setFilterForm] = useState('ALL');
  const [filterSubject, setFilterSubject] = useState('ALL');

  // Modal / Form state for Video
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [editingVideo, setEditingVideo] = useState<VideoResource | null>(null);
  const [videoFormData, setVideoFormData] = useState({
    title: '',
    description: '',
    videoUrl: '',
    thumbnailUrl: '',
    durationSeconds: 900,
    level: 'O-LEVEL' as MediaLevelType,
    form: 'Form IV',
    subjectName: 'Chemistry',
    topic: 'Volumetric Analysis',
    practicalName: '',
    videoCategory: 'PRACTICALS' as VideoCategoryType,
    author: currentUser.name || 'KDLH Academic Admin',
    permissionStatus: 'AUTHORIZED' as any,
    published: true,
    sourceName: 'KDLH Media Studio'
  });

  // Modal / Form state for Audio
  const [showAudioModal, setShowAudioModal] = useState(false);
  const [editingAudio, setEditingAudio] = useState<AudioResource | null>(null);
  const [audioFormData, setAudioFormData] = useState({
    title: '',
    description: '',
    audioUrl: '',
    thumbnailUrl: '',
    durationSeconds: 600,
    hubCategory: 'EDUCATIONAL' as AudioHubCategory,
    audioSubcategory: 'LESSON_EXPLANATION' as AudioSubcategory,
    level: 'O-LEVEL' as MediaLevelType,
    form: 'Form IV',
    subjectName: 'Chemistry',
    topic: 'Organic Chemistry',
    speaker: currentUser.name || 'KDLH Senior Tutor',
    author: currentUser.name || 'KDLH Senior Tutor',
    permissionStatus: 'AUTHORIZED' as any,
    published: true,
    sourceName: 'KDLH Offline Audio Studio'
  });

  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  // Filtered lists
  const allVideos = resources.filter(r => r.category === 'VIDEO' || r.category === 'TUTORIAL') as VideoResource[];
  const practicalVideos = allVideos.filter(v => v.videoCategory === 'PRACTICALS' || v.practicalName || v.tags?.includes('Practical'));
  const allAudios = resources.filter(r => r.category === 'AUDIO') as AudioResource[];

  const formsList = ['Form I', 'Form II', 'Form III', 'Form IV', 'Form V', 'Form VI'];
  const subjectsList = ['Chemistry', 'Physics', 'Biology', 'Mathematics', 'Computer Science', 'Geography', 'History', 'Civics', 'English Language', 'Kiswahili', 'Agriculture'];

  // Handle Video Submit (Add or Edit)
  const handleSaveVideo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoFormData.title.trim() || !videoFormData.videoUrl.trim()) {
      alert('Please provide video title and a valid video URL.');
      return;
    }

    const currentAll = KdlhStorageService.getAllResources();

    if (editingVideo) {
      const updated = currentAll.map(r => {
        if (r.id === editingVideo.id) {
          return {
            ...r,
            title: videoFormData.title,
            description: videoFormData.description,
            videoUrl: videoFormData.videoUrl,
            thumbnailUrl: videoFormData.thumbnailUrl || 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=800&q=80',
            durationSeconds: Number(videoFormData.durationSeconds),
            level: videoFormData.level,
            form: videoFormData.form,
            subjectName: videoFormData.subjectName,
            topic: videoFormData.topic,
            practicalName: videoFormData.practicalName,
            videoCategory: videoFormData.videoCategory,
            author: videoFormData.author,
            published: videoFormData.published,
            sourceName: videoFormData.sourceName,
            tags: [videoFormData.subjectName, videoFormData.form, videoFormData.videoCategory, videoFormData.level]
          } as VideoResource;
        }
        return r;
      });
      KdlhStorageService.saveAllResources(updated);
      showToast('Video updated successfully.');
    } else {
      const newVideo: VideoResource = {
        id: `vid-admin-${Date.now()}`,
        title: videoFormData.title,
        description: videoFormData.description,
        category: 'VIDEO',
        subjectId: `sub-${videoFormData.subjectName.toLowerCase().slice(0, 4)}`,
        subjectName: videoFormData.subjectName,
        form: videoFormData.form,
        topic: videoFormData.topic,
        practicalName: videoFormData.practicalName,
        videoCategory: videoFormData.videoCategory,
        level: videoFormData.level,
        author: videoFormData.author,
        authorRole: 'KDLH Admin / Media Creator',
        uploaderId: currentUser.id,
        dateAdded: new Date().toISOString().split('T')[0],
        views: 1,
        downloads: 0,
        featured: true,
        approvalStatus: 'APPROVED',
        permissionStatus: videoFormData.permissionStatus,
        videoUrl: videoFormData.videoUrl,
        thumbnailUrl: videoFormData.thumbnailUrl || 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80',
        durationSeconds: Number(videoFormData.durationSeconds),
        isTutorial: videoFormData.videoCategory === 'PRACTICALS',
        mediaTypeOrigin: 'ADMIN_UPLOADED',
        published: videoFormData.published,
        sourceName: videoFormData.sourceName,
        tags: [videoFormData.subjectName, videoFormData.form, videoFormData.videoCategory, 'Admin Uploaded']
      };

      currentAll.unshift(newVideo);
      KdlhStorageService.saveAllResources(currentAll);
      showToast('New practical/educational video published successfully.');
    }

    setShowVideoModal(false);
    setEditingVideo(null);
    onRefreshResources();
  };

  // Handle Audio Submit (Add or Edit)
  const handleSaveAudio = (e: React.FormEvent) => {
    e.preventDefault();
    if (!audioFormData.title.trim() || !audioFormData.audioUrl.trim()) {
      alert('Please provide audio title and a valid audio file URL.');
      return;
    }

    const currentAll = KdlhStorageService.getAllResources();

    if (editingAudio) {
      const updated = currentAll.map(r => {
        if (r.id === editingAudio.id) {
          return {
            ...r,
            title: audioFormData.title,
            description: audioFormData.description,
            audioUrl: audioFormData.audioUrl,
            thumbnailUrl: audioFormData.thumbnailUrl || 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80',
            durationSeconds: Number(audioFormData.durationSeconds),
            hubCategory: audioFormData.hubCategory,
            audioSubcategory: audioFormData.audioSubcategory,
            level: audioFormData.level,
            form: audioFormData.form,
            subjectName: audioFormData.subjectName,
            topic: audioFormData.topic,
            speaker: audioFormData.speaker,
            author: audioFormData.author,
            published: audioFormData.published,
            sourceName: audioFormData.sourceName
          } as AudioResource;
        }
        return r;
      });
      KdlhStorageService.saveAllResources(updated);
      showToast('Audio record updated successfully.');
    } else {
      const newAudio: AudioResource = {
        id: `audio-admin-${Date.now()}`,
        title: audioFormData.title,
        description: audioFormData.description,
        category: 'AUDIO',
        subjectId: `sub-${audioFormData.subjectName.toLowerCase().slice(0, 4)}`,
        subjectName: audioFormData.subjectName,
        form: audioFormData.form,
        topic: audioFormData.topic,
        author: audioFormData.author,
        authorRole: 'KDLH Audio Creator',
        uploaderId: currentUser.id,
        dateAdded: new Date().toISOString().split('T')[0],
        views: 1,
        downloads: 0,
        featured: true,
        approvalStatus: 'APPROVED',
        permissionStatus: audioFormData.permissionStatus,
        audioUrl: audioFormData.audioUrl,
        thumbnailUrl: audioFormData.thumbnailUrl || 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80',
        durationSeconds: Number(audioFormData.durationSeconds),
        audioCategory: audioFormData.hubCategory === 'REFRESHMENT' ? 'MOTIVATION' : 'LESSON',
        hubCategory: audioFormData.hubCategory,
        audioSubcategory: audioFormData.audioSubcategory,
        speaker: audioFormData.speaker,
        level: audioFormData.level,
        mediaTypeOrigin: 'ADMIN_UPLOADED',
        published: audioFormData.published,
        sourceName: audioFormData.sourceName,
        tags: [audioFormData.subjectName, audioFormData.form, audioFormData.hubCategory, 'KDLH Offline Audio']
      };

      currentAll.unshift(newAudio);
      KdlhStorageService.saveAllResources(currentAll);
      showToast('New audio recording published to Audio Hub.');
    }

    setShowAudioModal(false);
    setEditingAudio(null);
    onRefreshResources();
  };

  const handleDeleteResource = (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return;
    const currentAll = KdlhStorageService.getAllResources();
    const updated = currentAll.filter(r => r.id !== id);
    KdlhStorageService.saveAllResources(updated);
    showToast(`Deleted resource: ${title}`);
    onRefreshResources();
  };

  const handleTogglePublish = (resource: KDLHResource) => {
    const currentAll = KdlhStorageService.getAllResources();
    const updated = currentAll.map(r => {
      if (r.id === resource.id) {
        const isPub = (r as any).published !== false;
        return {
          ...r,
          published: !isPub
        };
      }
      return r;
    });
    KdlhStorageService.saveAllResources(updated);
    showToast(`Toggled publish status for: ${resource.title}`);
    onRefreshResources();
  };

  const openNewVideoModal = (isPractical: boolean = true) => {
    setEditingVideo(null);
    setVideoFormData({
      title: '',
      description: '',
      videoUrl: '',
      thumbnailUrl: '',
      durationSeconds: 900,
      level: 'O-LEVEL',
      form: 'Form IV',
      subjectName: 'Chemistry',
      topic: isPractical ? 'Acid-Base Titration' : 'Organic Chemistry',
      practicalName: isPractical ? 'Volumetric Analysis Titration' : '',
      videoCategory: isPractical ? 'PRACTICALS' : 'LESSONS',
      author: currentUser.name || 'KDLH Senior Tutor',
      permissionStatus: 'AUTHORIZED',
      published: true,
      sourceName: 'KDLH Admin Studio'
    });
    setShowVideoModal(true);
  };

  const openEditVideoModal = (vid: VideoResource) => {
    setEditingVideo(vid);
    setVideoFormData({
      title: vid.title,
      description: vid.description,
      videoUrl: vid.videoUrl,
      thumbnailUrl: vid.thumbnailUrl,
      durationSeconds: vid.durationSeconds || 900,
      level: vid.level || 'O-LEVEL',
      form: vid.form,
      subjectName: vid.subjectName,
      topic: vid.topic,
      practicalName: vid.practicalName || '',
      videoCategory: vid.videoCategory || 'PRACTICALS',
      author: vid.author,
      permissionStatus: vid.permissionStatus,
      published: vid.published !== false,
      sourceName: vid.sourceName || 'KDLH Studio'
    });
    setShowVideoModal(true);
  };

  const openNewAudioModal = (hubCat: AudioHubCategory = 'EDUCATIONAL') => {
    setEditingAudio(null);
    setAudioFormData({
      title: '',
      description: '',
      audioUrl: '',
      thumbnailUrl: '',
      durationSeconds: 600,
      hubCategory: hubCat,
      audioSubcategory: hubCat === 'REFRESHMENT' ? 'MOTIVATIONAL' : 'LESSON_EXPLANATION',
      level: 'O-LEVEL',
      form: 'Form IV',
      subjectName: 'Chemistry',
      topic: 'Organic Chemistry Revision',
      speaker: currentUser.name || 'KDLH Voice Studio',
      author: currentUser.name || 'KDLH Voice Studio',
      permissionStatus: 'AUTHORIZED',
      published: true,
      sourceName: 'KDLH Offline Audio'
    });
    setShowAudioModal(true);
  };

  const openEditAudioModal = (aud: AudioResource) => {
    setEditingAudio(aud);
    setAudioFormData({
      title: aud.title,
      description: aud.description,
      audioUrl: aud.audioUrl,
      thumbnailUrl: aud.thumbnailUrl || '',
      durationSeconds: aud.durationSeconds || 600,
      hubCategory: aud.hubCategory || 'EDUCATIONAL',
      audioSubcategory: aud.audioSubcategory || 'LESSON_EXPLANATION',
      level: aud.level || 'O-LEVEL',
      form: aud.form,
      subjectName: aud.subjectName,
      topic: aud.topic,
      speaker: aud.speaker || aud.author,
      author: aud.author,
      permissionStatus: aud.permissionStatus,
      published: aud.published !== false,
      sourceName: aud.sourceName || 'KDLH Audio'
    });
    setShowAudioModal(true);
  };

  return (
    <div className="space-y-6 font-mono">
      
      {/* Toast notification */}
      {toastMsg && (
        <div className="fixed top-20 right-6 z-50 bg-emerald-950 border border-emerald-500 text-emerald-200 px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 animate-in fade-in slide-in-from-top duration-300">
          <CheckCircle className="w-5 h-5 text-emerald-400" />
          <span className="text-xs font-bold">{toastMsg}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-cyan-950 via-slate-950 to-purple-950 p-6 rounded-2xl border border-cyan-800/50 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-cyan-400 uppercase tracking-widest">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>KDLH Administrative Media Control Center</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-wider mt-1">
            Media Management Studio
          </h2>
          <p className="text-xs text-cyan-200/80 font-sans mt-1 max-w-xl">
            Upload, edit, publish, and manage Practical Videos, Educational Audio, and Refreshment/Entertainment audio tracks for KDLH students.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => openNewVideoModal(true)}
            className="px-3.5 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-black font-black text-xs uppercase tracking-wider rounded-xl transition shadow-lg flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" /> Upload Practical Video
          </button>
          <button
            onClick={() => openNewAudioModal('EDUCATIONAL')}
            className="px-3.5 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-black text-xs uppercase tracking-wider rounded-xl transition shadow-lg flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" /> Upload Educational Audio
          </button>
          <button
            onClick={() => openNewAudioModal('REFRESHMENT')}
            className="px-3.5 py-2 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-400 hover:to-pink-500 text-white font-black text-xs uppercase tracking-wider rounded-xl transition shadow-lg flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" /> Upload Refreshment Audio
          </button>
        </div>
      </div>

      {/* Main Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-cyan-900/40 pb-3">
        <div className="flex items-center gap-2 overflow-x-auto text-xs font-bold">
          <button
            onClick={() => setActiveTab('PRACTICAL_VIDEOS')}
            className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 border ${
              activeTab === 'PRACTICAL_VIDEOS' 
                ? 'bg-emerald-400 text-black border-emerald-400 shadow-[0_0_12px_#34d399]' 
                : 'bg-black/40 text-cyan-200 border-cyan-900/40 hover:bg-cyan-950'
            }`}
          >
            <Film className="w-4 h-4 text-emerald-400" />
            <span>Admin Practical Videos ({practicalVideos.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('ALL_VIDEOS')}
            className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 border ${
              activeTab === 'ALL_VIDEOS' 
                ? 'bg-cyan-400 text-black border-cyan-400 shadow-[0_0_12px_#22d3ee]' 
                : 'bg-black/40 text-cyan-200 border-cyan-900/40 hover:bg-cyan-950'
            }`}
          >
            <Video className="w-4 h-4 text-cyan-400" />
            <span>All Video Hub Records ({allVideos.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('AUDIO_HUB')}
            className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 border ${
              activeTab === 'AUDIO_HUB' 
                ? 'bg-purple-400 text-black border-purple-400 shadow-[0_0_12px_#c084fc]' 
                : 'bg-black/40 text-cyan-200 border-cyan-900/40 hover:bg-cyan-950'
            }`}
          >
            <Headphones className="w-4 h-4 text-purple-400" />
            <span>Audio Hub Records ({allAudios.length})</span>
          </button>
        </div>

        {/* Search & Filter */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-4 h-4 text-cyan-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search title, subject, topic..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-3 py-1.5 bg-black/60 border border-cyan-900/50 rounded-xl text-xs text-cyan-100 placeholder-cyan-600 focus:outline-none focus:border-cyan-400 w-48 sm:w-64"
            />
          </div>
        </div>
      </div>

      {/* PRACTICAL VIDEOS TAB */}
      {activeTab === 'PRACTICAL_VIDEOS' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-cyan-300">
            <span>Showing Admin & Discovered Practical Demonstration Videos:</span>
            <button
              onClick={() => openNewVideoModal(true)}
              className="text-emerald-400 font-bold hover:underline flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" /> Add Practical Video
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {practicalVideos
              .filter(v => 
                v.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                v.subjectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                v.topic.toLowerCase().includes(searchQuery.toLowerCase())
              )
              .map(vid => {
                const isPublished = vid.published !== false;
                return (
                  <div key={vid.id} className="bg-black/60 rounded-2xl border border-cyan-900/50 p-4 space-y-3 relative group backdrop-blur-xl">
                    <div className="aspect-video bg-slate-900 rounded-xl overflow-hidden relative border border-cyan-950">
                      <img src={vid.thumbnailUrl} alt={vid.title} className="w-full h-full object-cover" />
                      <span className="absolute top-2 left-2 text-[10px] bg-emerald-950 text-emerald-300 font-bold px-2 py-0.5 rounded border border-emerald-800">
                        {vid.level || 'O-LEVEL'} • {vid.form}
                      </span>
                      <span className="absolute bottom-2 right-2 text-[10px] bg-black/80 text-cyan-300 font-mono px-2 py-0.5 rounded">
                        {Math.floor(vid.durationSeconds / 60)} mins
                      </span>
                    </div>

                    <div>
                      <div className="flex items-center justify-between gap-1 text-[10px] text-amber-400 font-bold uppercase">
                        <span>{vid.subjectName} • {vid.topic}</span>
                        <span className={isPublished ? 'text-emerald-400' : 'text-rose-400'}>
                          {isPublished ? 'PUBLISHED' : 'HIDDEN'}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-white line-clamp-2 mt-0.5">{vid.title}</h4>
                      {vid.practicalName && (
                        <p className="text-[11px] text-emerald-300/90 font-mono mt-1">Practical: {vid.practicalName}</p>
                      )}
                    </div>

                    <div className="pt-2 border-t border-cyan-900/40 flex items-center justify-between text-xs">
                      <button
                        onClick={() => handleTogglePublish(vid)}
                        className={`p-1.5 rounded-lg border flex items-center gap-1 text-[11px] ${
                          isPublished ? 'bg-emerald-950/60 text-emerald-300 border-emerald-800' : 'bg-rose-950/60 text-rose-300 border-rose-800'
                        }`}
                        title={isPublished ? 'Hide from students' : 'Publish to students'}
                      >
                        {isPublished ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                        <span>{isPublished ? 'Published' : 'Hidden'}</span>
                      </button>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => openEditVideoModal(vid)}
                          className="p-1.5 bg-cyan-950 hover:bg-cyan-900 text-cyan-300 rounded-lg border border-cyan-800 transition"
                          title="Edit Practical Video"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteResource(vid.id, vid.title)}
                          className="p-1.5 bg-rose-950 hover:bg-rose-900 text-rose-300 rounded-lg border border-rose-800 transition"
                          title="Delete Video"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* ALL VIDEOS TAB */}
      {activeTab === 'ALL_VIDEOS' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-cyan-300">
            <span>All Video Lessons, Tutorials & Explanations:</span>
            <button
              onClick={() => openNewVideoModal(false)}
              className="text-cyan-400 font-bold hover:underline flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" /> Add Video Lesson
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {allVideos
              .filter(v => 
                v.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                v.subjectName.toLowerCase().includes(searchQuery.toLowerCase())
              )
              .map(vid => {
                const isPublished = vid.published !== false;
                return (
                  <div key={vid.id} className="bg-black/60 rounded-2xl border border-cyan-900/50 p-4 space-y-3 backdrop-blur-xl">
                    <div className="aspect-video bg-slate-900 rounded-xl overflow-hidden relative border border-cyan-950">
                      <img src={vid.thumbnailUrl} alt={vid.title} className="w-full h-full object-cover" />
                      <span className="absolute top-2 left-2 text-[10px] bg-cyan-950 text-cyan-300 font-bold px-2 py-0.5 rounded border border-cyan-800">
                        {vid.videoCategory || 'LESSONS'} • {vid.form}
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] text-amber-400 font-bold uppercase block">{vid.subjectName} • {vid.topic}</span>
                      <h4 className="text-sm font-bold text-white line-clamp-2 mt-0.5">{vid.title}</h4>
                      <p className="text-[11px] text-cyan-200/70 font-sans line-clamp-2 mt-1">{vid.description}</p>
                    </div>

                    <div className="pt-2 border-t border-cyan-900/40 flex items-center justify-between text-xs">
                      <button
                        onClick={() => handleTogglePublish(vid)}
                        className={`p-1.5 rounded-lg border flex items-center gap-1 text-[11px] ${
                          isPublished ? 'bg-emerald-950/60 text-emerald-300 border-emerald-800' : 'bg-rose-950/60 text-rose-300 border-rose-800'
                        }`}
                      >
                        {isPublished ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                        <span>{isPublished ? 'Published' : 'Hidden'}</span>
                      </button>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => openEditVideoModal(vid)}
                          className="p-1.5 bg-cyan-950 hover:bg-cyan-900 text-cyan-300 rounded-lg border border-cyan-800 transition"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteResource(vid.id, vid.title)}
                          className="p-1.5 bg-rose-950 hover:bg-rose-900 text-rose-300 rounded-lg border border-rose-800 transition"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* AUDIO HUB TAB */}
      {activeTab === 'AUDIO_HUB' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-cyan-300">
            <span>Educational Audio & Refreshment Audio Tracks:</span>
            <div className="flex gap-2">
              <button
                onClick={() => openNewAudioModal('EDUCATIONAL')}
                className="text-cyan-400 font-bold hover:underline flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Add Educational Audio
              </button>
              <button
                onClick={() => openNewAudioModal('REFRESHMENT')}
                className="text-purple-400 font-bold hover:underline flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Add Refreshment Audio
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {allAudios
              .filter(a => 
                a.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                a.subjectName.toLowerCase().includes(searchQuery.toLowerCase())
              )
              .map(aud => {
                const isPublished = aud.published !== false;
                const isRefreshment = aud.hubCategory === 'REFRESHMENT';

                return (
                  <div key={aud.id} className={`rounded-2xl border p-4 space-y-3 backdrop-blur-xl ${
                    isRefreshment 
                      ? 'bg-purple-950/20 border-purple-800/50 shadow-[0_0_15px_rgba(168,85,247,0.1)]' 
                      : 'bg-black/60 border-cyan-900/50'
                  }`}>
                    <div className="flex items-start justify-between gap-2">
                      <div className="p-2.5 rounded-xl bg-slate-900 border border-cyan-800 text-cyan-400">
                        {isRefreshment ? <Music className="w-5 h-5 text-pink-400" /> : <Headphones className="w-5 h-5 text-cyan-400" />}
                      </div>

                      <div className="text-right">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                          isRefreshment ? 'bg-pink-950 text-pink-300 border-pink-800' : 'bg-cyan-950 text-cyan-300 border-cyan-800'
                        }`}>
                          {aud.hubCategory || 'EDUCATIONAL'}
                        </span>
                        <span className="block text-[10px] text-cyan-400 mt-1 font-mono">
                          {aud.audioSubcategory || aud.audioCategory}
                        </span>
                      </div>
                    </div>

                    <div>
                      <span className="text-[10px] text-amber-400 font-bold uppercase block">{aud.subjectName} • {aud.form}</span>
                      <h4 className="text-sm font-bold text-white line-clamp-2 mt-0.5">{aud.title}</h4>
                      <p className="text-[11px] text-cyan-300/80 font-mono mt-1">Speaker/Artist: {aud.speaker || aud.author}</p>
                    </div>

                    <div className="pt-2 border-t border-cyan-900/40 flex items-center justify-between text-xs">
                      <button
                        onClick={() => handleTogglePublish(aud)}
                        className={`p-1.5 rounded-lg border flex items-center gap-1 text-[11px] ${
                          isPublished ? 'bg-emerald-950/60 text-emerald-300 border-emerald-800' : 'bg-rose-950/60 text-rose-300 border-rose-800'
                        }`}
                      >
                        {isPublished ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                        <span>{isPublished ? 'Published' : 'Hidden'}</span>
                      </button>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => openEditAudioModal(aud)}
                          className="p-1.5 bg-cyan-950 hover:bg-cyan-900 text-cyan-300 rounded-lg border border-cyan-800 transition"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteResource(aud.id, aud.title)}
                          className="p-1.5 bg-rose-950 hover:bg-rose-900 text-rose-300 rounded-lg border border-rose-800 transition"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* VIDEO MODAL (Upload / Edit) */}
      {showVideoModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-950 border border-cyan-800 rounded-2xl w-full max-w-2xl p-6 space-y-4 shadow-2xl text-cyan-100 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between border-b border-cyan-900/50 pb-3">
              <div className="flex items-center gap-2">
                <Film className="w-5 h-5 text-emerald-400" />
                <h3 className="font-bold text-lg text-white">
                  {editingVideo ? 'Edit Video Resource' : 'Publish New Video (Admin Upload)'}
                </h3>
              </div>
              <button onClick={() => setShowVideoModal(false)} className="text-cyan-400 hover:text-white p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveVideo} className="space-y-4 text-xs font-mono">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-cyan-300 font-bold mb-1">Video Title *</label>
                  <input
                    type="text"
                    required
                    value={videoFormData.title}
                    onChange={(e) => setVideoFormData({...videoFormData, title: e.target.value})}
                    placeholder="e.g. Chemistry Titration Practical"
                    className="w-full p-2.5 bg-black border border-cyan-800 rounded-xl text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="block text-cyan-300 font-bold mb-1">Video URL (Embed / Stream) *</label>
                  <input
                    type="text"
                    required
                    value={videoFormData.videoUrl}
                    onChange={(e) => setVideoFormData({...videoFormData, videoUrl: e.target.value})}
                    placeholder="https://www.youtube.com/embed/..."
                    className="w-full p-2.5 bg-black border border-cyan-800 rounded-xl text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-cyan-300 font-bold mb-1">Level</label>
                  <select
                    value={videoFormData.level}
                    onChange={(e) => setVideoFormData({...videoFormData, level: e.target.value as MediaLevelType})}
                    className="w-full p-2.5 bg-black border border-cyan-800 rounded-xl text-white focus:outline-none focus:border-cyan-400"
                  >
                    <option value="O-LEVEL">O-Level</option>
                    <option value="A-LEVEL">A-Level</option>
                    <option value="GENERAL">General</option>
                  </select>
                </div>

                <div>
                  <label className="block text-cyan-300 font-bold mb-1">Form</label>
                  <select
                    value={videoFormData.form}
                    onChange={(e) => setVideoFormData({...videoFormData, form: e.target.value})}
                    className="w-full p-2.5 bg-black border border-cyan-800 rounded-xl text-white focus:outline-none focus:border-cyan-400"
                  >
                    {formsList.map(f => <option key={f} value={f}>{f}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-cyan-300 font-bold mb-1">Subject</label>
                  <select
                    value={videoFormData.subjectName}
                    onChange={(e) => setVideoFormData({...videoFormData, subjectName: e.target.value})}
                    className="w-full p-2.5 bg-black border border-cyan-800 rounded-xl text-white focus:outline-none focus:border-cyan-400"
                  >
                    {subjectsList.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-cyan-300 font-bold mb-1">Topic</label>
                  <input
                    type="text"
                    value={videoFormData.topic}
                    onChange={(e) => setVideoFormData({...videoFormData, topic: e.target.value})}
                    placeholder="e.g. Volumetric Analysis"
                    className="w-full p-2.5 bg-black border border-cyan-800 rounded-xl text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="block text-cyan-300 font-bold mb-1">Practical Name (if practical)</label>
                  <input
                    type="text"
                    value={videoFormData.practicalName}
                    onChange={(e) => setVideoFormData({...videoFormData, practicalName: e.target.value})}
                    placeholder="e.g. Acid-Base Titration"
                    className="w-full p-2.5 bg-black border border-cyan-800 rounded-xl text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-cyan-300 font-bold mb-1">Description</label>
                <textarea
                  rows={2}
                  value={videoFormData.description}
                  onChange={(e) => setVideoFormData({...videoFormData, description: e.target.value})}
                  placeholder="Comprehensive description of the video content..."
                  className="w-full p-2.5 bg-black border border-cyan-800 rounded-xl text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-cyan-300 font-bold mb-1">Thumbnail URL</label>
                  <input
                    type="text"
                    value={videoFormData.thumbnailUrl}
                    onChange={(e) => setVideoFormData({...videoFormData, thumbnailUrl: e.target.value})}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full p-2.5 bg-black border border-cyan-800 rounded-xl text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="block text-cyan-300 font-bold mb-1">Source / Creator Attribution</label>
                  <input
                    type="text"
                    value={videoFormData.sourceName}
                    onChange={(e) => setVideoFormData({...videoFormData, sourceName: e.target.value})}
                    placeholder="e.g. KDLH Science Studio / Channel Name"
                    className="w-full p-2.5 bg-black border border-cyan-800 rounded-xl text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-cyan-900/40">
                <label className="flex items-center gap-2 cursor-pointer text-cyan-200">
                  <input
                    type="checkbox"
                    checked={videoFormData.published}
                    onChange={(e) => setVideoFormData({...videoFormData, published: e.target.checked})}
                    className="w-4 h-4 accent-cyan-400 rounded"
                  />
                  <span>Publish immediately to students</span>
                </label>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowVideoModal(false)}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-black font-black rounded-xl shadow-lg"
                  >
                    Save & Publish
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* AUDIO MODAL (Upload / Edit) */}
      {showAudioModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-950 border border-purple-800 rounded-2xl w-full max-w-2xl p-6 space-y-4 shadow-2xl text-purple-100 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between border-b border-purple-900/50 pb-3">
              <div className="flex items-center gap-2">
                <Headphones className="w-5 h-5 text-purple-400" />
                <h3 className="font-bold text-lg text-white">
                  {editingAudio ? 'Edit Audio Record' : 'Publish New Audio (Admin Upload)'}
                </h3>
              </div>
              <button onClick={() => setShowAudioModal(false)} className="text-purple-400 hover:text-white p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveAudio} className="space-y-4 text-xs font-mono">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-purple-300 font-bold mb-1">Audio Title *</label>
                  <input
                    type="text"
                    required
                    value={audioFormData.title}
                    onChange={(e) => setAudioFormData({...audioFormData, title: e.target.value})}
                    placeholder="e.g. Form IV Organic Chemistry Audio Lesson"
                    className="w-full p-2.5 bg-black border border-purple-800 rounded-xl text-white focus:outline-none focus:border-purple-400"
                  />
                </div>

                <div>
                  <label className="block text-purple-300 font-bold mb-1">Audio File URL / Stream *</label>
                  <input
                    type="text"
                    required
                    value={audioFormData.audioUrl}
                    onChange={(e) => setAudioFormData({...audioFormData, audioUrl: e.target.value})}
                    placeholder="https://... / audio.mp3"
                    className="w-full p-2.5 bg-black border border-purple-800 rounded-xl text-white focus:outline-none focus:border-purple-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-purple-300 font-bold mb-1">Hub Category</label>
                  <select
                    value={audioFormData.hubCategory}
                    onChange={(e) => setAudioFormData({...audioFormData, hubCategory: e.target.value as AudioHubCategory})}
                    className="w-full p-2.5 bg-black border border-purple-800 rounded-xl text-white focus:outline-none focus:border-purple-400"
                  >
                    <option value="EDUCATIONAL">Educational Audio</option>
                    <option value="REFRESHMENT">Refresh & Entertainment 🎧</option>
                  </select>
                </div>

                <div>
                  <label className="block text-purple-300 font-bold mb-1">Form</label>
                  <select
                    value={audioFormData.form}
                    onChange={(e) => setAudioFormData({...audioFormData, form: e.target.value})}
                    className="w-full p-2.5 bg-black border border-purple-800 rounded-xl text-white focus:outline-none focus:border-purple-400"
                  >
                    {formsList.map(f => <option key={f} value={f}>{f}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-purple-300 font-bold mb-1">Subject</label>
                  <select
                    value={audioFormData.subjectName}
                    onChange={(e) => setAudioFormData({...audioFormData, subjectName: e.target.value})}
                    className="w-full p-2.5 bg-black border border-purple-800 rounded-xl text-white focus:outline-none focus:border-purple-400"
                  >
                    {subjectsList.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-purple-300 font-bold mb-1">Speaker / Artist / Creator Name</label>
                <input
                  type="text"
                  value={audioFormData.speaker}
                  onChange={(e) => setAudioFormData({...audioFormData, speaker: e.target.value})}
                  placeholder="e.g. Madam Grace Mbowe / KDLH Choir"
                  className="w-full p-2.5 bg-black border border-purple-800 rounded-xl text-white focus:outline-none focus:border-purple-400"
                />
              </div>

              <div>
                <label className="block text-purple-300 font-bold mb-1">Description</label>
                <textarea
                  rows={2}
                  value={audioFormData.description}
                  onChange={(e) => setAudioFormData({...audioFormData, description: e.target.value})}
                  placeholder="Audio explanation details..."
                  className="w-full p-2.5 bg-black border border-purple-800 rounded-xl text-white focus:outline-none focus:border-purple-400"
                />
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-purple-900/40">
                <label className="flex items-center gap-2 cursor-pointer text-purple-200">
                  <input
                    type="checkbox"
                    checked={audioFormData.published}
                    onChange={(e) => setAudioFormData({...audioFormData, published: e.target.checked})}
                    className="w-4 h-4 accent-purple-400 rounded"
                  />
                  <span>Publish immediately to Audio Hub</span>
                </label>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowAudioModal(false)}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-400 hover:to-pink-500 text-white font-black rounded-xl shadow-lg"
                  >
                    Save Audio
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
