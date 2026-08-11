import { 
  UserProfile, 
  KDLHResource, 
  NotificationItem, 
  CmsSettings, 
  UserRole,
  StudentProgress,
  SavedNote,
  ExamPaper,
  ScannedExamScript,
  SchemeOfWork,
  LessonPlan,
  NoteSummary,
  CurriculumTopic,
  StudentTopicProgress
} from '../types';
import { IndexedDbService } from './db';

import { 
  DEMO_USERS, 
  INITIAL_NOTES, 
  INITIAL_PAST_PAPERS, 
  INITIAL_PRACTICALS, 
  INITIAL_VIDEOS, 
  INITIAL_BOOKS, 
  INITIAL_QUESTIONS, 
  INITIAL_AUDIO, 
  INITIAL_MUSIC, 
  INITIAL_TEACHER_RESOURCES, 
  INITIAL_NOTIFICATIONS, 
  INITIAL_CMS_SETTINGS 
} from '../data/mockData';

import {
  INITIAL_EXAMS,
  INITIAL_SCANNED_SCRIPTS,
  INITIAL_SCHEMES_OF_WORK,
  INITIAL_LESSON_PLANS,
  INITIAL_NOTE_SUMMARIES,
  INITIAL_CURRICULUM_TOPICS,
  INITIAL_TOPIC_PROGRESS
} from '../data/mockCurriculumData';

const CURRENT_USER_KEY = 'kdlh_current_user_v1';
const RESOURCES_KEY = 'kdlh_resources_v1';
const BOOKMARKS_KEY = 'kdlh_bookmarks_v1';
const NOTIFICATIONS_KEY = 'kdlh_notifications_v1';
const CMS_SETTINGS_KEY = 'kdlh_cms_settings_v1';
const PROGRESS_KEY = 'kdlh_student_progress_v1';

const EXAMS_KEY = 'kdlh_exams_v1';
const SCANNED_SCRIPTS_KEY = 'kdlh_scanned_scripts_v1';
const SCHEMES_KEY = 'kdlh_schemes_of_work_v1';
const LESSON_PLANS_KEY = 'kdlh_lesson_plans_v1';
const NOTE_SUMMARIES_KEY = 'kdlh_note_summaries_v1';
const CURRICULUM_TOPICS_KEY = 'kdlh_curriculum_topics_v1';
const TOPIC_PROGRESS_KEY = 'kdlh_topic_progress_v1';

export class KdlhStorageService {
  // Current logged in user
  static getCurrentUser(): UserProfile {
    try {
      const stored = localStorage.getItem(CURRENT_USER_KEY);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.warn('Storage read failed', e);
    }
    // Default to Student or Founder/Admin if desired
    return DEMO_USERS[0]; // Student Juma Baraka by default
  }

  static setCurrentUser(user: UserProfile): void {
    try {
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    } catch (e) {
      console.warn('Storage write failed', e);
    }
  }

  static switchUserRole(role: UserRole): UserProfile {
    const found = DEMO_USERS.find(u => u.role === role) || DEMO_USERS[0];
    this.setCurrentUser(found);
    return found;
  }

  // All resources combined
  static getAllResources(): KDLHResource[] {
    try {
      const stored = localStorage.getItem(RESOURCES_KEY);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.warn('Resource storage read failed', e);
    }

    const initialCombined: KDLHResource[] = [
      ...INITIAL_NOTES,
      ...INITIAL_PAST_PAPERS,
      ...INITIAL_PRACTICALS,
      ...INITIAL_VIDEOS,
      ...INITIAL_BOOKS,
      ...INITIAL_QUESTIONS,
      ...INITIAL_AUDIO,
      ...INITIAL_MUSIC,
      ...INITIAL_TEACHER_RESOURCES
    ];
    this.saveAllResources(initialCombined);
    return initialCombined;
  }

  static saveAllResources(resources: KDLHResource[]): void {
    try {
      localStorage.setItem(RESOURCES_KEY, JSON.stringify(resources));
    } catch (e) {
      console.warn('Resource storage write failed', e);
    }
  }

  static addResource(resource: KDLHResource): void {
    const current = this.getAllResources();
    const updated = [resource, ...current];
    this.saveAllResources(updated);
  }

  static saveResource(resource: KDLHResource): void {
    this.addResource(resource);
  }

  static deleteResource(id: string): void {
    const current = this.getAllResources();
    const updated = current.filter(r => r.id !== id);
    this.saveAllResources(updated);
  }

  static updateResourceStatus(id: string, approvalStatus: KDLHResource['approvalStatus']): void {
    const current = this.getAllResources();
    const updated = current.map(r => r.id === id ? { ...r, approvalStatus } : r);
    this.saveAllResources(updated);
  }

  static toggleFeaturedResource(id: string): void {
    const current = this.getAllResources();
    const updated = current.map(r => r.id === id ? { ...r, featured: !r.featured } : r);
    this.saveAllResources(updated);
  }

  // Bookmarks / Saved Resources
  static getSavedResourceIds(): string[] {
    try {
      const stored = localStorage.getItem(BOOKMARKS_KEY);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.warn('Bookmarks read failed', e);
    }
    return ['note-chem-f4-alcohols', 'pp-chem-f4-2024'];
  }

  // Alias for getAllResources
  static getResources(): KDLHResource[] {
    return this.getAllResources();
  }

  static saveCmsSettings(newSettings: CmsSettings): CmsSettings {
    return this.updateCmsSettings(newSettings);
  }

  static updateResourceApproval(id: string, approvalStatus: KDLHResource['approvalStatus']): void {
    this.updateResourceStatus(id, approvalStatus);
  }

  static getQuizScores(): any[] {
    return this.getStudentProgress().recentScores;
  }

  static toggleSaveResource(id: string): string[] {
    const current = this.getSavedResourceIds();
    let updated: string[];
    if (current.includes(id)) {
      updated = current.filter(x => x !== id);
    } else {
      updated = [...current, id];
    }
    try {
      localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(updated));
    } catch (e) {
      console.warn('Bookmarks write failed', e);
    }
    return updated;
  }

  // Notifications
  static getNotifications(): NotificationItem[] {
    try {
      const stored = localStorage.getItem(NOTIFICATIONS_KEY);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.warn('Notifications read failed', e);
    }
    return INITIAL_NOTIFICATIONS;
  }

  static markNotificationRead(id: string): void {
    const list = this.getNotifications();
    const updated = list.map(n => n.id === id ? { ...n, read: true } : n);
    try {
      localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(updated));
    } catch (e) {
      console.warn('Notifications write failed', e);
    }
  }

  // CMS Settings
  static getCmsSettings(): CmsSettings {
    try {
      const stored = localStorage.getItem(CMS_SETTINGS_KEY);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.warn('CMS read failed', e);
    }
    return INITIAL_CMS_SETTINGS;
  }

  static updateCmsSettings(newSettings: Partial<CmsSettings>): CmsSettings {
    const current = this.getCmsSettings();
    const updated = { ...current, ...newSettings };
    try {
      localStorage.setItem(CMS_SETTINGS_KEY, JSON.stringify(updated));
    } catch (e) {
      console.warn('CMS write failed', e);
    }
    return updated;
  }

  // Student Progress
  static getStudentProgress(): StudentProgress {
    try {
      const stored = localStorage.getItem(PROGRESS_KEY);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.warn('Progress read failed', e);
    }
    return {
      studentId: 'user-student-1',
      completedTopicsCount: 12,
      totalRevisionTestsTaken: 8,
      averageScorePercent: 88,
      totalStudyMinutes: 450,
      savedResourceIds: this.getSavedResourceIds(),
      recentScores: [
        { testTitle: 'Form IV Chemistry: Alcohols Quiz', score: 9, total: 10, date: '2025-02-14', subject: 'Chemistry' },
        { testTitle: 'Form IV Physics: Circuits Test', score: 8, total: 10, date: '2025-02-10', subject: 'Physics' },
        { testTitle: 'Form IV Biology: Genetics Review', score: 10, total: 10, date: '2025-02-05', subject: 'Biology' }
      ]
    };
  }

  static addQuizScore(title: string, subject: string, score: number, total: number): void {
    const progress = this.getStudentProgress();
    const newRecord = {
      testTitle: title,
      score,
      total,
      date: new Date().toISOString().split('T')[0],
      subject
    };
    const updatedScores = [newRecord, ...progress.recentScores];
    const totalTaken = progress.totalRevisionTestsTaken + 1;
    const avgScore = Math.round(
      updatedScores.reduce((acc, curr) => acc + (curr.score / curr.total) * 100, 0) / updatedScores.length
    );

    const updatedProgress: StudentProgress = {
      ...progress,
      totalRevisionTestsTaken: totalTaken,
      averageScorePercent: avgScore,
      recentScores: updatedScores
    };

    try {
      localStorage.setItem(PROGRESS_KEY, JSON.stringify(updatedProgress));
    } catch (e) {
      console.warn('Progress write failed', e);
    }
  }

  // --- IndexedDB Offline Methods ---
  static async initIndexedDbSync(): Promise<void> {
    try {
      const resources = this.getAllResources();
      await IndexedDbService.bulkCacheResources(resources);

      const existingNotes = await IndexedDbService.getAllNotes();
      if (existingNotes.length === 0) {
        const defaultNotes: SavedNote[] = [
          {
            id: 'sn-chem-alcohols-summary',
            title: 'Organic Chemistry: Alcohols & Esterification Key Equations',
            subjectName: 'Chemistry',
            form: 'Form IV',
            content: '1. Primary Alcohols undergo oxidation to produce Aldehydes then Carboxylic Acids.\n2. Reactions with Conc. H2SO4 at 170°C produce Alkenes (Dehydration).\n3. Esterification: Ethanol + Ethanoic Acid -> Ethyl Ethanoate + Water.',
            dateCreated: '2025-02-12',
            lastModified: '2025-02-12',
            syncStatus: 'synced',
            tags: ['Chemistry', 'Form IV', 'NECTA']
          },
          {
            id: 'sn-physics-ohm-law',
            title: "Physics Form IV: Ohm's Law & Resistance Calculations",
            subjectName: 'Physics',
            form: 'Form IV',
            content: 'V = I * R. Series Resistance: R_total = R1 + R2 + R3. Parallel Resistance: 1/R_total = 1/R1 + 1/R2.',
            dateCreated: '2025-02-10',
            lastModified: '2025-02-10',
            syncStatus: 'synced',
            tags: ['Physics', 'Circuits']
          }
        ];
        for (const n of defaultNotes) {
          await IndexedDbService.saveNote(n);
        }
      }
    } catch (e) {
      console.warn('Failed to initialize IndexedDB sync:', e);
    }
  }

  static async cacheResourceForOffline(resource: KDLHResource): Promise<void> {
    await IndexedDbService.cacheResource(resource);
  }

  static async cacheResourcesBulk(resources: KDLHResource[]): Promise<void> {
    await IndexedDbService.bulkCacheResources(resources);
  }

  static async cacheSubjectFolder(subjectName: string): Promise<number> {
    const all = this.getAllResources();
    const subjectResources = all.filter(r => r.subjectName.toLowerCase() === subjectName.toLowerCase());
    await IndexedDbService.bulkCacheResources(subjectResources);
    return subjectResources.length;
  }

  static async uncacheResourceFromOffline(id: string): Promise<void> {
    await IndexedDbService.removeCachedResource(id);
  }

  static async isResourceCachedForOffline(id: string): Promise<boolean> {
    const item = await IndexedDbService.getCachedResourceById(id);
    return item !== null;
  }

  static async getOfflineCachedResources(): Promise<KDLHResource[]> {
    const cachedItems = await IndexedDbService.getAllCachedResources();
    return cachedItems.map(item => item.resource);
  }

  static async saveUserNote(note: SavedNote): Promise<void> {
    await IndexedDbService.saveNote(note);
    if (!navigator.onLine) {
      await IndexedDbService.enqueueOfflineAction({
        id: `action-note-${Date.now()}`,
        actionType: 'SAVE_NOTE',
        payload: note,
        timestamp: new Date().toISOString()
      });
    }
  }

  static async getUserNotes(): Promise<SavedNote[]> {
    return await IndexedDbService.getAllNotes();
  }

  static async deleteUserNote(id: string): Promise<void> {
    await IndexedDbService.deleteNote(id);
  }

  static async syncOfflineQueue(): Promise<{ syncedCount: number }> {
    if (!navigator.onLine) return { syncedCount: 0 };
    try {
      const queue = await IndexedDbService.getOfflineQueue();
      if (queue.length === 0) return { syncedCount: 0 };

      for (const item of queue) {
        if (item.actionType === 'SAVE_NOTE') {
          const note: SavedNote = { ...item.payload, syncStatus: 'synced' };
          await IndexedDbService.saveNote(note);
        } else if (item.actionType === 'TOGGLE_BOOKMARK') {
          this.toggleSaveResource(item.payload.id);
        }
      }

      await IndexedDbService.clearOfflineQueue();
      return { syncedCount: queue.length };
    } catch (e) {
      console.warn('Failed to sync offline queue:', e);
      return { syncedCount: 0 };
    }
  }

  // --- EXAMS & MARKING SCHEMES ---
  static getExams(): ExamPaper[] {
    try {
      const stored = localStorage.getItem(EXAMS_KEY);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.warn('Exams storage read failed', e);
    }
    this.saveExams(INITIAL_EXAMS);
    return INITIAL_EXAMS;
  }

  static saveExams(exams: ExamPaper[]): void {
    try {
      localStorage.setItem(EXAMS_KEY, JSON.stringify(exams));
    } catch (e) {
      console.warn('Exams storage write failed', e);
    }
  }

  static addExam(exam: ExamPaper): void {
    const list = this.getExams();
    this.saveExams([exam, ...list]);
  }

  // --- SCANNED SCRIPTS & AI MARKING ---
  static getScannedScripts(): ScannedExamScript[] {
    try {
      const stored = localStorage.getItem(SCANNED_SCRIPTS_KEY);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.warn('Scanned scripts storage read failed', e);
    }
    this.saveScannedScripts(INITIAL_SCANNED_SCRIPTS);
    return INITIAL_SCANNED_SCRIPTS;
  }

  static saveScannedScripts(scripts: ScannedExamScript[]): void {
    try {
      localStorage.setItem(SCANNED_SCRIPTS_KEY, JSON.stringify(scripts));
    } catch (e) {
      console.warn('Scanned scripts storage write failed', e);
    }
  }

  static saveScannedScript(script: ScannedExamScript): void {
    const list = this.getScannedScripts();
    const existingIndex = list.findIndex(s => s.id === script.id);
    let updated: ScannedExamScript[];
    if (existingIndex >= 0) {
      updated = [...list];
      updated[existingIndex] = script;
    } else {
      updated = [script, ...list];
    }
    this.saveScannedScripts(updated);
  }

  // --- SCHEMES OF WORK ---
  static getSchemesOfWork(): SchemeOfWork[] {
    try {
      const stored = localStorage.getItem(SCHEMES_KEY);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.warn('Schemes storage read failed', e);
    }
    this.saveSchemesOfWork(INITIAL_SCHEMES_OF_WORK);
    return INITIAL_SCHEMES_OF_WORK;
  }

  static saveSchemesOfWork(schemes: SchemeOfWork[]): void {
    try {
      localStorage.setItem(SCHEMES_KEY, JSON.stringify(schemes));
    } catch (e) {
      console.warn('Schemes storage write failed', e);
    }
  }

  static addSchemeOfWork(scheme: SchemeOfWork): void {
    const list = this.getSchemesOfWork();
    this.saveSchemesOfWork([scheme, ...list]);
  }

  // --- LESSON PLANS ---
  static getLessonPlans(): LessonPlan[] {
    try {
      const stored = localStorage.getItem(LESSON_PLANS_KEY);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.warn('Lesson plans storage read failed', e);
    }
    this.saveLessonPlans(INITIAL_LESSON_PLANS);
    return INITIAL_LESSON_PLANS;
  }

  static saveLessonPlans(plans: LessonPlan[]): void {
    try {
      localStorage.setItem(LESSON_PLANS_KEY, JSON.stringify(plans));
    } catch (e) {
      console.warn('Lesson plans storage write failed', e);
    }
  }

  static addLessonPlan(plan: LessonPlan): void {
    const list = this.getLessonPlans();
    this.saveLessonPlans([plan, ...list]);
  }

  // --- NOTE SUMMARIES ---
  static getNoteSummaries(): NoteSummary[] {
    try {
      const stored = localStorage.getItem(NOTE_SUMMARIES_KEY);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.warn('Note summaries storage read failed', e);
    }
    this.saveNoteSummaries(INITIAL_NOTE_SUMMARIES);
    return INITIAL_NOTE_SUMMARIES;
  }

  static saveNoteSummaries(summaries: NoteSummary[]): void {
    try {
      localStorage.setItem(NOTE_SUMMARIES_KEY, JSON.stringify(summaries));
    } catch (e) {
      console.warn('Note summaries storage write failed', e);
    }
  }

  static addNoteSummary(summary: NoteSummary): void {
    const list = this.getNoteSummaries();
    this.saveNoteSummaries([summary, ...list]);
  }

  // --- CURRICULUM TOPICS DATABASE ---
  static getCurriculumTopics(): CurriculumTopic[] {
    try {
      const stored = localStorage.getItem(CURRICULUM_TOPICS_KEY);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.warn('Curriculum topics storage read failed', e);
    }
    this.saveCurriculumTopics(INITIAL_CURRICULUM_TOPICS);
    return INITIAL_CURRICULUM_TOPICS;
  }

  static saveCurriculumTopics(topics: CurriculumTopic[]): void {
    try {
      localStorage.setItem(CURRICULUM_TOPICS_KEY, JSON.stringify(topics));
    } catch (e) {
      console.warn('Curriculum topics storage write failed', e);
    }
  }

  static addCurriculumTopic(topic: CurriculumTopic): void {
    const list = this.getCurriculumTopics();
    this.saveCurriculumTopics([topic, ...list]);
  }

  // --- STUDENT TOPIC PROGRESS ---
  static getStudentTopicProgress(studentId: string = 'student-juma'): StudentTopicProgress[] {
    try {
      const stored = localStorage.getItem(TOPIC_PROGRESS_KEY);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.warn('Topic progress storage read failed', e);
    }
    this.saveStudentTopicProgress(INITIAL_TOPIC_PROGRESS);
    return INITIAL_TOPIC_PROGRESS;
  }

  static saveStudentTopicProgress(progress: StudentTopicProgress[]): void {
    try {
      localStorage.setItem(TOPIC_PROGRESS_KEY, JSON.stringify(progress));
    } catch (e) {
      console.warn('Topic progress storage write failed', e);
    }
  }
}

