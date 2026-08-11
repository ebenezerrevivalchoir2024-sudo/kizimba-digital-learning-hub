import React, { useState, useEffect } from 'react';
import { 
  KDLHResource, 
  UserProfile, 
  CmsSettings, 
  NotificationItem, 
  Subject 
} from './types';
import { KdlhStorageService } from './services/storage';
import { DEMO_USERS, INITIAL_SUBJECTS } from './data/mockData';

// Layout Components
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';

// Modals
import { PdfViewerModal } from './components/common/PdfViewerModal';
import { MediaPlayerModal } from './components/common/MediaPlayerModal';
import { GlobalSearchModal } from './components/common/GlobalSearchModal';
import { NotificationDrawer } from './components/common/NotificationDrawer';
import { AuthModal } from './components/common/AuthModal';
import { AudioPlayerBar } from './components/common/AudioPlayerBar';
import { OfflineVaultModal } from './components/common/OfflineVaultModal';
import { subscribeSwStatus } from './serviceWorkerRegistration';

// Views
import { HomeView } from './views/HomeView';
import { NotesView } from './views/NotesView';
import { PastPapersView } from './views/PastPapersView';
import { PracticalsView } from './views/PracticalsView';
import { VideosView } from './views/VideosView';
import { TutorialsView } from './views/TutorialsView';
import { BooksView } from './views/BooksView';
import { RevisionView } from './views/RevisionView';
import { QuestionsView } from './views/QuestionsView';
import { AudioView } from './views/AudioView';
import { MusicView } from './views/MusicView';
import { TeacherResourcesView } from './views/TeacherResourcesView';
import { AiAssistantView } from './views/AiAssistantView';
import { StudentDashboardView } from './views/StudentDashboardView';
import { TeacherDashboardView } from './views/TeacherDashboardView';
import { AdminControlView } from './views/AdminControlView';
import { AboutView } from './views/AboutView';
import { LegalPagesView } from './views/LegalPagesView';
import { ContactView } from './views/ContactView';
import { ExamScannerView } from './views/ExamScannerView';
import { TeacherWorkspaceView } from './views/TeacherWorkspaceView';
import { StudentWorkspaceView } from './views/StudentWorkspaceView';

export function App() {
  const [activeRoute, setActiveRoute] = useState<string>('/');
  const [resources, setResources] = useState<KDLHResource[]>([]);
  const [cmsSettings, setCmsSettings] = useState<CmsSettings>(KdlhStorageService.getCmsSettings());
  const [currentUser, setCurrentUser] = useState<UserProfile>(DEMO_USERS[0]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [savedResourceIds, setSavedResourceIds] = useState<string[]>([]);
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);

  // Modals state
  const [selectedResource, setSelectedResource] = useState<KDLHResource | null>(null);
  const [searchOpen, setSearchOpen] = useState<boolean>(false);
  const [notifDrawerOpen, setNotifDrawerOpen] = useState<boolean>(false);
  const [authModalOpen, setAuthModalOpen] = useState<boolean>(false);
  const [offlineVaultOpen, setOfflineVaultOpen] = useState<boolean>(false);
  const [currentAudio, setCurrentAudio] = useState<{ id: string; title: string; artist: string; url: string } | null>(null);

  // Load state on mount
  useEffect(() => {
    setResources(KdlhStorageService.getResources());
    setCmsSettings(KdlhStorageService.getCmsSettings());
    setNotifications(KdlhStorageService.getNotifications());
    setSavedResourceIds(KdlhStorageService.getSavedResourceIds());

    // Initialize IndexedDB sync & Service Worker status listener
    KdlhStorageService.initIndexedDbSync();

    const unsubscribe = subscribeSwStatus((status) => {
      setIsOnline(status.isOnline);
      if (status.isOnline) {
        KdlhStorageService.syncOfflineQueue();
      }
    });

    return unsubscribe;
  }, []);

  const refreshResources = () => {
    setResources(KdlhStorageService.getResources());
  };

  const handleNavigate = (route: string) => {
    setActiveRoute(route);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleToggleSaveResource = (id: string) => {
    const updated = KdlhStorageService.toggleSaveResource(id);
    setSavedResourceIds(updated);
  };

  const handleSelectResource = (resource: KDLHResource) => {
    if (resource.category === 'AUDIO' || resource.category === 'MUSIC') {
      const audioUrl = (resource as any).audioUrl || (resource as any).rightsRecord?.sourceUrl || 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3';
      const artist = (resource as any).artist || (resource as any).author || 'KDLH Audio';
      setCurrentAudio({
        title: resource.title,
        artist,
        url: audioUrl
      });
    } else {
      setSelectedResource(resource);
    }
  };

  const handleMarkNotifRead = (id: string) => {
    const updated = KdlhStorageService.markNotificationRead(id);
    setNotifications(updated);
  };

  const unreadNotifCount = notifications.filter(n => !n.read).length;

  return (
    <div className="min-h-screen bg-[#05060a] text-cyan-100/90 flex flex-col font-sans selection:bg-cyan-500 selection:text-black relative overflow-x-hidden">
      {/* Ambient Radial Background Glow */}
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_20%,_rgba(16,40,70,0.35)_0%,_transparent_75%)] pointer-events-none z-0"></div>
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none z-0"></div>
      <div className="fixed bottom-10 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl pointer-events-none z-0"></div>

      <div className="relative z-10 flex flex-col min-h-screen">
      
      {/* Navigation Header */}
      <Navbar
        activeRoute={activeRoute}
        onNavigate={handleNavigate}
        currentUser={currentUser}
        onOpenSearch={() => setSearchOpen(true)}
        onOpenNotifications={() => setNotifDrawerOpen(true)}
        unreadCount={unreadNotifCount}
        onOpenAuth={() => setAuthModalOpen(true)}
        onOpenOfflineVault={() => setOfflineVaultOpen(true)}
      />

      {/* Main View Router Content */}
      <main className="flex-1">
        {activeRoute === '/' && (
          <HomeView
            onNavigate={handleNavigate}
            onOpenSearch={() => setSearchOpen(true)}
            resources={resources}
            subjects={INITIAL_SUBJECTS}
            cmsSettings={cmsSettings}
            onSelectResource={handleSelectResource}
            savedResourceIds={savedResourceIds}
            onToggleSaveResource={handleToggleSaveResource}
          />
        )}

        {activeRoute === '/notes' && (
          <NotesView
            resources={resources}
            subjects={INITIAL_SUBJECTS}
            onSelectResource={handleSelectResource}
            savedResourceIds={savedResourceIds}
            onToggleSaveResource={handleToggleSaveResource}
          />
        )}

        {activeRoute === '/past-papers' && (
          <PastPapersView
            resources={resources}
            subjects={INITIAL_SUBJECTS}
            onSelectResource={handleSelectResource}
            savedResourceIds={savedResourceIds}
            onToggleSaveResource={handleToggleSaveResource}
          />
        )}

        {activeRoute === '/practicals' && (
          <PracticalsView
            resources={resources}
            onSelectResource={handleSelectResource}
          />
        )}

        {activeRoute === '/videos' && (
          <VideosView
            resources={resources}
            onSelectResource={handleSelectResource}
          />
        )}

        {activeRoute === '/tutorials' && (
          <TutorialsView
            resources={resources}
            onSelectResource={handleSelectResource}
          />
        )}

        {activeRoute === '/books' && (
          <BooksView
            resources={resources}
            subjects={INITIAL_SUBJECTS}
            onSelectResource={handleSelectResource}
            savedResourceIds={savedResourceIds}
            onToggleSaveResource={handleToggleSaveResource}
          />
        )}

        {activeRoute === '/revision' && (
          <RevisionView
            resources={resources}
          />
        )}

        {activeRoute === '/questions' && (
          <QuestionsView
            resources={resources}
          />
        )}

        {activeRoute === '/audio' && (
          <AudioView
            resources={resources}
            onSelectResource={handleSelectResource}
          />
        )}

        {activeRoute === '/music' && (
          <MusicView
            resources={resources}
            onSelectResource={handleSelectResource}
          />
        )}

        {activeRoute === '/teacher-resources' && (
          <TeacherResourcesView
            resources={resources}
            subjects={INITIAL_SUBJECTS}
            currentUser={currentUser}
            onRefreshResources={refreshResources}
          />
        )}

        {activeRoute === '/ai-assistant' && (
          <AiAssistantView
            currentUser={currentUser}
          />
        )}

        {activeRoute === '/exam-scanner' && (
          <ExamScannerView />
        )}

        {activeRoute === '/teacher-workspace' && (
          <TeacherWorkspaceView />
        )}

        {activeRoute === '/student-workspace' && (
          <StudentWorkspaceView />
        )}

        {activeRoute === '/student-portal' && (
          <StudentDashboardView
            currentUser={currentUser}
            resources={resources}
            onSelectResource={handleSelectResource}
            savedResourceIds={savedResourceIds}
            onToggleSaveResource={handleToggleSaveResource}
            onNavigate={handleNavigate}
          />
        )}

        {activeRoute === '/teacher-portal' && (
          <TeacherDashboardView
            currentUser={currentUser}
            resources={resources}
            onNavigate={handleNavigate}
          />
        )}

        {activeRoute === '/admin-portal' && (
          <AdminControlView
            currentUser={currentUser}
            cmsSettings={cmsSettings}
            onUpdateCms={(updated) => {
              KdlhStorageService.saveCmsSettings(updated);
              setCmsSettings(updated);
            }}
            resources={resources}
            onRefreshResources={refreshResources}
          />
        )}

        {activeRoute === '/about' && (
          <AboutView />
        )}

        {activeRoute === '/legal' && (
          <LegalPagesView />
        )}

        {activeRoute === '/contact' && (
          <ContactView />
        )}
      </main>

      {/* Footer */}
      <Footer onNavigate={handleNavigate} />

      {/* Resource Detail Modals */}
      {selectedResource && (
        selectedResource.category === 'VIDEO' || selectedResource.category === 'TUTORIAL' || selectedResource.category === 'MUSIC' || selectedResource.category === 'AUDIO' ? (
          <MediaPlayerModal
            isOpen={!!selectedResource}
            onClose={() => setSelectedResource(null)}
            resource={selectedResource}
            allResources={resources}
          />
        ) : (
          <PdfViewerModal
            isOpen={!!selectedResource}
            onClose={() => setSelectedResource(null)}
            resource={selectedResource}
          />
        )
      )}

      {/* Global Search Modal */}
      <GlobalSearchModal
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
        resources={resources}
        onSelectResource={handleSelectResource}
      />

      {/* Notification Drawer */}
      <NotificationDrawer
        isOpen={notifDrawerOpen}
        onClose={() => setNotifDrawerOpen(false)}
        notifications={notifications}
        onMarkRead={handleMarkNotifRead}
      />

      {/* Role / Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        currentUser={currentUser}
        onSelectUser={(u) => {
          setCurrentUser(u);
          if (u.role === 'STUDENT') handleNavigate('/student-portal');
          if (u.role === 'TEACHER') handleNavigate('/teacher-portal');
          if (u.role === 'ADMIN') handleNavigate('/admin-portal');
        }}
      />

      {/* Offline Vault Modal */}
      <OfflineVaultModal
        isOpen={offlineVaultOpen}
        onClose={() => setOfflineVaultOpen(false)}
        isOnline={isOnline}
        onSelectResource={handleSelectResource}
      />

      {/* Persistent Audio Player Bar */}
      <AudioPlayerBar
        currentAudio={currentAudio}
        onClose={() => setCurrentAudio(null)}
      />

      </div>
    </div>
  );
}

export default App;
