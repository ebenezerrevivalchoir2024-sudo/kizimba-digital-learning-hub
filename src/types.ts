export type UserRole = 'FOUNDER' | 'ADMIN' | 'TEACHER' | 'STUDENT';

export type TeacherApprovalStatus = 'APPROVED' | 'PENDING' | 'REJECTED';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  form?: string; // Form I to VI
  school: string;
  studentId?: string;
  subjects?: string[]; // Taught subjects for teachers
  formsTaught?: string[]; // Taught forms for teachers
  avatarUrl?: string;
  joinedDate: string;
  streakDays: number;
  status?: 'active' | 'suspended';
  teacherApprovalStatus?: TeacherApprovalStatus;
  teacherApprovalDate?: string;
  teacherApprovedBy?: string;
  authProvider?: 'phone' | 'email' | 'google' | 'admin';
  isRegistered?: boolean;
  registrationDate?: string;
  lastActiveAt?: string;
}

export interface FirestoreUserStats {
  totalUsers: number;
  studentsCount: number;
  teachersCount: number;
  approvedTeachersCount: number;
  pendingTeachersCount: number;
  adminsCount: number;
  activeUsersCount: number;
  lastUpdated: string;
}

export type AcademicLevel = 'ORDINARY_SECONDARY' | 'ADVANCED_SECONDARY';

export interface Subject {
  id: string;
  name: string;
  code: string;
  level: AcademicLevel;
  forms: string[]; // e.g., ['Form I', 'Form II', 'Form III', 'Form IV']
  iconName: string;
  color: string;
  description: string;
  topicCount: number;
}

export type ResourceCategory = 
  | 'NOTE'
  | 'PAST_PAPER'
  | 'PRACTICAL'
  | 'VIDEO'
  | 'TUTORIAL'
  | 'BOOK'
  | 'QUESTION'
  | 'AUDIO'
  | 'MUSIC'
  | 'TEACHER_RESOURCE';

export type PermissionStatus = 
  | 'AUTHORIZED'
  | 'OPEN_LICENSE'
  | 'PUBLIC_DOMAIN'
  | 'OFFICIAL_SOURCE'
  | 'SCHOOL_OWNED'
  | 'PENDING_REVIEW'
  | 'NOT_AUTHORIZED';

export type ApprovalStatus = 'APPROVED' | 'PENDING' | 'REJECTED' | 'ARCHIVED';

export interface BaseResource {
  id: string;
  title: string;
  description: string;
  category: ResourceCategory;
  subjectId: string;
  subjectName: string;
  form: string;
  topic: string;
  subtopic?: string;
  author: string;
  authorRole: string;
  uploaderId: string;
  dateAdded: string;
  views: number;
  downloads: number;
  rating?: number;
  featured: boolean;
  approvalStatus: ApprovalStatus;
  permissionStatus: PermissionStatus;
  sourceName?: string;
  sourceUrl?: string;
  license?: string;
  tags: string[];
}

export interface NoteResource extends BaseResource {
  category: 'NOTE';
  fileUrl?: string;
  readTimeMinutes: number;
  contentMarkdown?: string;
  pdfPages?: number;
}

export interface PastPaperResource extends BaseResource {
  category: 'PAST_PAPER';
  year: number;
  examBody: 'NECTA' | 'MOCK' | 'TERMINAL' | 'ANNUAL' | 'MIDTERM';
  paperNumber: string; // e.g. "Paper 1"
  hasMarkingScheme: boolean;
  fileUrl?: string;
}

export interface PracticalLabResource extends BaseResource {
  category: 'PRACTICAL';
  objective: string;
  apparatus: string[];
  chemicalsMaterials: string[];
  safetyPrecautions: string[];
  procedureSteps: string[];
  expectedObservations: string;
  calculationsFormulae?: string;
  videoUrl?: string;
  fileUrl?: string;
}

export type VideoCategoryType = 
  | 'LESSONS'
  | 'PRACTICALS'
  | 'QUESTIONS'
  | 'PAST_PAPER_EXPLANATIONS'
  | 'NOTES_EXPLANATIONS'
  | 'REVISION'
  | 'EXAM_PREPARATION'
  | 'SCIENCE'
  | 'MATHEMATICS'
  | 'LANGUAGES'
  | 'GENERAL_EDUCATION';

export type MediaLevelType = 'O-LEVEL' | 'A-LEVEL' | 'GENERAL';

export type MediaTypeOrigin = 'ADMIN_UPLOADED' | 'ONLINE_DISCOVERED' | 'KDLH_OFFLINE';

export interface VideoResource extends BaseResource {
  category: 'VIDEO' | 'TUTORIAL';
  videoUrl: string;
  thumbnailUrl: string;
  durationSeconds: number;
  difficulty?: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  isTutorial: boolean;
  transcript?: string;
  videoCategory?: VideoCategoryType;
  level?: MediaLevelType;
  practicalName?: string;
  mediaTypeOrigin?: MediaTypeOrigin;
  published?: boolean;
  qualityOptions?: string[];
  connectedMaterialIds?: {
    noteIds?: string[];
    questionIds?: string[];
    practicalIds?: string[];
    revisionIds?: string[];
  };
}

export interface BookResource extends BaseResource {
  category: 'BOOK';
  publisher: string;
  publishedYear: number;
  isbn?: string;
  coverImageUrl: string;
  fileUrl?: string;
  pageCount: number;
}

export type QuestionType = 'MULTIPLE_CHOICE' | 'SHORT_ANSWER' | 'STRUCTURED' | 'CALCULATION' | 'TRUE_FALSE';

export interface QuestionBankItem extends BaseResource {
  category: 'QUESTION';
  questionType: QuestionType;
  questionText: string;
  options?: string[];
  correctAnswer: string;
  explanation: string;
  marks: number;
  examYear?: number;
  audioExplanationUrl?: string;
}

export type AudioHubCategory = 'EDUCATIONAL' | 'REFRESHMENT';

export type AudioSubcategory = 
  | 'LESSON_EXPLANATION'
  | 'TOPIC_EXPLANATION'
  | 'REVISION'
  | 'QUESTION_EXPLANATION'
  | 'NOTES_AUDIO'
  | 'EXAM_PREPARATION'
  | 'PRACTICAL_EXPLANATION'
  | 'LANGUAGE'
  | 'STUDY_TIPS'
  | 'MUSIC'
  | 'MOTIVATIONAL'
  | 'INSTRUMENTAL'
  | 'RELAXATION'
  | 'PUBLIC_DOMAIN'
  | 'KDLH_OFFLINE';

export interface AudioResource extends BaseResource {
  category: 'AUDIO';
  audioUrl: string;
  durationSeconds: number;
  audioCategory: 'LESSON' | 'PODCAST' | 'REVISION_SUMMARY' | 'ANNOUNCEMENT' | 'MOTIVATION';
  hubCategory?: AudioHubCategory;
  audioSubcategory?: AudioSubcategory;
  speaker: string;
  level?: MediaLevelType;
  mediaTypeOrigin?: MediaTypeOrigin;
  published?: boolean;
  thumbnailUrl?: string;
  connectedMaterialIds?: {
    noteIds?: string[];
    questionIds?: string[];
    practicalIds?: string[];
  };
}

export interface MediaRightsRecord {
  id: string;
  artist: string;
  songTitle: string;
  publisher: string;
  rightsOwner: string;
  licenseType: string;
  permissionDocUrl?: string;
  expiryDate?: string;
  sourceUrl: string;
  uploadStatus: PermissionStatus;
  approvalStatus: ApprovalStatus;
  audioUrl?: string;
}

export interface MusicResource extends BaseResource {
  category: 'MUSIC';
  artist: string;
  songTitle: string;
  audioUrl?: string;
  externalEmbedUrl?: string;
  durationSeconds: number;
  rightsRecord: MediaRightsRecord;
}

export interface TeacherResourceItem extends BaseResource {
  category: 'TEACHER_RESOURCE';
  resourceSubtype: 'SCHEME_OF_WORK' | 'LESSON_PLAN' | 'TEACHING_AID' | 'ASSESSMENT' | 'MARKING_SCHEME';
  fileUrl?: string;
}

export type KDLHResource = 
  | NoteResource
  | PastPaperResource
  | PracticalLabResource
  | VideoResource
  | BookResource
  | QuestionBankItem
  | AudioResource
  | MusicResource
  | TeacherResourceItem;

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  date: string;
  read: boolean;
  type: 'NEW_CONTENT' | 'APPROVAL' | 'SYSTEM' | 'AI' | 'TEST_RESULT';
  targetRole?: UserRole;
  linkRoute?: string;
}

export interface StudentProgress {
  studentId: string;
  completedTopicsCount: number;
  totalRevisionTestsTaken: number;
  averageScorePercent: number;
  totalStudyMinutes: number;
  savedResourceIds: string[];
  recentScores: {
    testTitle: string;
    score: number;
    total: number;
    date: string;
    subject: string;
  }[];
}

export interface AiChatMessage {
  id: string;
  sender: 'USER' | 'AI';
  text: string;
  timestamp: string;
  citations?: {
    title: string;
    type: ResourceCategory;
    id: string;
  }[];
}

export interface CmsSettings {
  heroTitle: string;
  heroSubtitle: string;
  tagline: string;
  featuredResourceIds: string[];
  announcementText: string;
  contactEmail: string;
  contactPhone: string;
}

export interface SavedNote {
  id: string;
  title: string;
  subjectName: string;
  form: string;
  content: string;
  dateCreated: string;
  lastModified: string;
  syncStatus: 'synced' | 'offline-draft';
  tags?: string[];
}

export interface OfflineCachedResource {
  id: string;
  resource: KDLHResource;
  cachedAt: string;
  sizeBytes: number;
}

export interface OfflineQueueAction {
  id: string;
  actionType: 'SAVE_NOTE' | 'TOGGLE_BOOKMARK' | 'RECORD_QUIZ_SCORE';
  payload: any;
  timestamp: string;
}

// -------------------------------------------------------------------
// KDLH ADVANCED TEACHING, SCANNING, MARKING & CURRICULUM TYPES
// -------------------------------------------------------------------

export interface MarkingPoint {
  id: string;
  pointNumber: number;
  description: string;
  marks: number;
}

export interface ExamQuestionItem {
  id: string;
  questionNumber: number;
  questionText: string;
  topic: string;
  subtopic?: string;
  questionType: QuestionType;
  maxMarks: number;
  expectedAnswer: string;
  markingPoints: MarkingPoint[];
  alternativeAnswers?: string[];
  teacherNotes?: string;
}

export interface ExamPaper {
  id: string;
  title: string;
  form: string;
  subject: string;
  topic?: string;
  date: string;
  durationMinutes: number;
  totalMarks: number;
  instructions: string;
  academicYear: string;
  questions: ExamQuestionItem[];
  createdByTeacherId: string;
  isPublished: boolean;
}

export interface ScannedPage {
  id: string;
  pageNumber: number;
  imageUrl: string;
  confidence: number;
  processedText?: string;
  adjustments?: {
    brightness: number;
    contrast: number;
    rotate: number;
    cropApplied: boolean;
  };
}

export interface MarkingPointBreakdown {
  pointDescription: string;
  awarded: number;
  max: number;
  status: 'CORRECT' | 'PARTIAL' | 'INCORRECT' | 'MISSING';
}

export interface QuestionMarkingResult {
  questionId: string;
  questionNumber: number;
  questionText: string;
  studentAnswerText: string;
  expectedAnswerText: string;
  maxMarks: number;
  awardedMarks: number;
  confidence: number;
  explanation: string;
  markingPointsBreakdown: MarkingPointBreakdown[];
  teacherOverride?: {
    overriddenMarks: number;
    overrideReason: string;
    status: 'ACCEPTED' | 'EDITED' | 'REVIEW' | 'REJECTED';
  };
  diagramDetected?: boolean;
  isUncertain?: boolean;
}

export interface TopicPerformanceRecord {
  topic: string;
  score: number;
  total: number;
  percentage: number;
}

export interface ScannedExamScript {
  id: string;
  examId: string;
  examTitle: string;
  studentId: string;
  studentName: string;
  form: string;
  subject: string;
  teacherId: string;
  teacherName: string;
  scanDate: string;
  scannedPages: ScannedPage[];
  overallScore: number;
  totalMarks: number;
  percentage: number;
  grade: string;
  ocrConfidence: number;
  markingConfidence: number;
  status: 'DRAFT_SCAN' | 'NEEDS_TEACHER_REVIEW' | 'FINALIZED';
  questionResults: QuestionMarkingResult[];
  topicPerformance: TopicPerformanceRecord[];
  teacherComments?: string;
  aiFeedback?: string;
}

export interface SchemeOfWorkItem {
  id: string;
  weekNumber: number;
  datesRange: string;
  topic: string;
  subtopic: string;
  periods: number;
  competenceObjectives: string;
  teachingActivities: string;
  learningActivities: string;
  resourcesRequired: string;
  assessmentMethod: string;
  remarks: string;
}

export interface SchemeOfWork {
  id: string;
  title: string;
  academicYear: string;
  term: 'Term 1' | 'Term 2';
  form: string;
  subject: string;
  teacherName: string;
  schoolName: string;
  weeksCount: number;
  periodsPerWeek: number;
  status: 'DRAFT' | 'APPROVED';
  isAiGenerated: boolean;
  items: SchemeOfWorkItem[];
  dateCreated: string;
}

export interface LessonPlan {
  id: string;
  title: string;
  schoolName: string;
  teacherName: string;
  subject: string;
  form: string;
  date: string;
  durationMinutes: number;
  topic: string;
  subtopic: string;
  mainCompetence: string;
  specificCompetence: string;
  learningObjectives: string[];
  teachingMethods: string[];
  learningActivities: string[];
  teachingResources: string[];
  introduction: string;
  lessonDevelopment: string;
  practice: string;
  assessment: string;
  conclusion: string;
  homework: string;
  reflection: string;
  isAiGenerated: boolean;
  dateCreated: string;
}

export interface NoteSummary {
  id: string;
  sourceResourceId?: string;
  sourceTitle: string;
  sourceType: string;
  summaryLength: 'SHORT' | 'MEDIUM' | 'DETAILED';
  targetLevel: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  language: 'ENGLISH' | 'KISWAHILI';
  shortSummary: string;
  detailedSummary: string;
  keyPoints: string[];
  importantDefinitions: { term: string; definition: string }[];
  formulas: { name: string; formula: string }[];
  flashcards: { question: string; answer: string }[];
  examQuestions: { question: string; marks: number }[];
  dateCreated: string;
}

export interface CurriculumSubtopic {
  id: string;
  topicId: string;
  name: string;
  competencies: string[];
  linkedResourceIds: string[];
}

export interface CurriculumTopic {
  id: string;
  subjectId: string;
  subjectName: string;
  form: string;
  level: AcademicLevel;
  name: string;
  description: string;
  orderIndex: number;
  subtopics: CurriculumSubtopic[];
}

export interface StudentTopicProgress {
  studentId: string;
  topicId: string;
  topicName: string;
  subjectName: string;
  form: string;
  percentCompleted: number;
  notesReadCount: number;
  testsAttemptedCount: number;
  averageScore: number;
  lastActivityDate: string;
  weakAreas: string[];
  strongAreas: string[];
  recommendedResourceIds: string[];
}

export interface WeeklyTeachingRecord {
  id: string;
  date: string;
  subject: string;
  form: string;
  className: string; // e.g. "Form IV A"
  topic: string;
  subtopic: string;
  whatWasTaught: string;
  learningObjective: string;
  activity: string;
  assessment: string;
  remarks: string;
  teacherId: string;
  teacherName: string;
}

export interface WeeklyStudentReport {
  id: string;
  weekNumber: number;
  datesRange: string;
  studentId: string;
  studentName: string; // Actual student name
  admissionNumber: string;
  form: string;
  className: string;
  subjectsTaught: string[];
  topicsCovered: string[];
  testsConducted: string[];
  marksObtained: { subject: string; score: number; total: number; grade: string }[];
  attendanceDays: number;
  totalSchoolDays: number;
  homeworkStatus: string;
  strengths: string[];
  weaknesses: string[];
  teacherComments: string;
  recommendedImprovement: string;
  teacherName: string;
  dateGenerated: string;
}

export interface WeeklyClassReport {
  id: string;
  className: string;
  weekNumber: number;
  datesRange: string;
  form: string;
  subject: string;
  teacherName: string;
  topicsCovered: string[];
  studentCount: number;
  averageScore: number;
  highestScore: number;
  lowestScore: number;
  studentsNeedingSupport: { studentName: string; issue: string }[];
  studentsPerformingWell: { studentName: string; achievement: string }[];
  dateGenerated: string;
}

export * from './types/examTypes';
