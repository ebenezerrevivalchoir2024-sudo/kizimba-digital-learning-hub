/**
 * KDLH Exam Scanner & AI Evaluation Engine - Database Schema Types
 * Location: /src/types/examTypes.ts
 * 
 * Supports backend-ready architecture (Relational SQL / Drizzle / Firestore ORM)
 * for KIZIMBA DIGITAL LEARNING HUB (KDLH).
 */

export type AcademicLevel = 'ORDINARY_SECONDARY' | 'ADVANCED_SECONDARY';

export type ExamStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';

export type ExamScriptStatus = 'DRAFT_SCAN' | 'NEEDS_TEACHER_REVIEW' | 'FINALIZED';

export type QuestionType = 
  | 'MULTIPLE_CHOICE' 
  | 'SHORT_ANSWER' 
  | 'STRUCTURED' 
  | 'CALCULATION' 
  | 'TRUE_FALSE' 
  | 'DIAGRAM' 
  | 'ESSAY';

export type MarkingStatus = 'CORRECT' | 'PARTIAL' | 'INCORRECT' | 'MISSING';

export type TeacherOverrideStatus = 'ACCEPTED' | 'EDITED' | 'REVIEW' | 'REJECTED';

// ==========================================
// 1. DATABASE SCHEMA: EXAMS ('exams')
// ==========================================
export interface ExamRecord {
  /** Primary Key UUID or Document ID */
  id: string;
  /** Exam Code, e.g., KDLH-CHEM-2026-T1 */
  examCode: string;
  /** Title of the examination */
  title: string;
  /** Foreign Key referencing subjects table or subject identifier */
  subjectId: string;
  /** Subject name, e.g., 'Chemistry' */
  subject: string;
  /** Form level, e.g., 'Form IV' or 'Form VI' */
  form: string;
  /** Academic Level */
  academicLevel: AcademicLevel;
  /** Academic Year, e.g., '2026' */
  academicYear: string;
  /** Term or Exam Body identifier */
  term: 'Term 1' | 'Term 2' | 'Terminal' | 'Annual' | 'Mock' | 'NECTA';
  /** Total maximum marks achievable */
  totalMarks: number;
  /** Duration in minutes */
  durationMinutes: number;
  /** Examination instructions and guidelines */
  instructions: string;
  /** Foreign Key referencing users/teachers table */
  createdByTeacherId: string;
  /** Teacher name for display */
  teacherName: string;
  /** School / Institution name */
  schoolName: string;
  /** Exam lifecycle status */
  status: ExamStatus;
  /** ISO 8601 Timestamp when created */
  createdAt: string;
  /** ISO 8601 Timestamp when updated */
  updatedAt: string;
}

// ==========================================
// 2. DATABASE SCHEMA: EXAM QUESTIONS ('exam_questions')
// ==========================================
export interface ExamQuestionRecord {
  /** Primary Key UUID */
  id: string;
  /** Foreign Key referencing exams(id) */
  examId: string;
  /** Question sequential number in the exam (1, 2, 3...) */
  questionNumber: number;
  /** Section identifier if applicable (e.g., 'Section A', 'Section B') */
  section?: string;
  /** Question Type */
  questionType: QuestionType;
  /** The full text of the question */
  questionText: string;
  /** Topic name from curriculum */
  topic: string;
  /** Subtopic name from curriculum */
  subtopic?: string;
  /** Maximum marks allocated to this question */
  maxMarks: number;
  /** Multiple Choice Options if applicable */
  options?: string[];
  /** Expected correct short response or formula */
  correctAnswer?: string;
  /** URL to diagram/image if question includes figures */
  diagramUrl?: string;
  /** Display order index */
  orderIndex: number;
  /** ISO 8601 Timestamp when created */
  createdAt: string;
  /** ISO 8601 Timestamp when updated */
  updatedAt: string;
}

// ==========================================
// 3. DATABASE SCHEMA: MARKING SCHEMES ('marking_schemes')
// ==========================================
export interface MarkingPointRecord {
  /** Unique ID for the marking point */
  id: string;
  /** Sequential point number (1, 2, 3...) */
  pointNumber: number;
  /** Expected explanation, chemical step, formula, or keyword */
  description: string;
  /** Marks awarded for fulfilling this specific point */
  marks: number;
  /** Keywords for OCR/AI matcher verification */
  keywords?: string[];
}

export interface MarkingSchemeRecord {
  /** Primary Key UUID */
  id: string;
  /** Foreign Key referencing exams(id) */
  examId: string;
  /** Foreign Key referencing exam_questions(id) */
  questionId: string;
  /** Expected comprehensive model answer */
  expectedAnswer: string;
  /** Alternative acceptable phrasing or methods */
  alternativeAnswers?: string[];
  /** Breakdown of discrete marking points */
  markingPoints: MarkingPointRecord[];
  /** Guidance and tips for human markers or AI model prompt context */
  teacherNotes?: string;
  /** Rubric criteria for open-ended or essay questions */
  rubricCriteria?: {
    criterion: string;
    maxScore: number;
    description: string;
  }[];
  /** AI evaluation guidelines / special tolerances */
  aiGuidelines?: string;
  /** Foreign Key referencing author teacher */
  createdByTeacherId: string;
  /** ISO 8601 Timestamp when created */
  createdAt: string;
  /** ISO 8601 Timestamp when updated */
  updatedAt: string;
}

// ==========================================
// 4. DATABASE SCHEMA: EXAM SCRIPTS ('exam_scripts')
// ==========================================
export interface ScannedPageRecord {
  /** Page identifier */
  id: string;
  /** 1-based page number */
  pageNumber: number;
  /** Image URL or Base64 Data URL */
  imageUrl: string;
  /** OCR scanning confidence (0.00 to 1.00) */
  confidence: number;
  /** OCR extracted raw text */
  processedText?: string;
  /** Image enhancement and alignment parameters */
  adjustments?: {
    brightness: number;
    contrast: number;
    rotate: number;
    cropApplied: boolean;
  };
}

export interface MarkingPointBreakdownRecord {
  pointDescription: string;
  awarded: number;
  max: number;
  status: MarkingStatus;
}

export interface TeacherOverrideRecord {
  overriddenMarks: number;
  overrideReason: string;
  status: TeacherOverrideStatus;
  updatedByTeacherId: string;
  updatedAt: string;
}

export interface QuestionMarkingResultRecord {
  /** Foreign Key referencing exam_questions(id) */
  questionId: string;
  /** Question number for fast lookup */
  questionNumber: number;
  /** Question text */
  questionText: string;
  /** Transcribed student answer text */
  studentAnswerText: string;
  /** Model answer for side-by-side review */
  expectedAnswerText: string;
  /** Maximum marks for this question */
  maxMarks: number;
  /** Marks awarded by AI */
  awardedMarks: number;
  /** AI confidence score (0.00 to 1.00) */
  confidence: number;
  /** AI reasoning & explanation for awarded marks */
  explanation: string;
  /** Detailed breakdown per marking point */
  markingPointsBreakdown: MarkingPointBreakdownRecord[];
  /** Optional teacher override record */
  teacherOverride?: TeacherOverrideRecord;
  /** True if OCR detected a hand-drawn diagram */
  diagramDetected?: boolean;
  /** True if AI flagged answer for low confidence or ambiguity */
  isUncertain?: boolean;
}

export interface TopicPerformanceRecord {
  topic: string;
  score: number;
  total: number;
  percentage: number;
}

export interface ExamScriptRecord {
  /** Primary Key UUID */
  id: string;
  /** Foreign Key referencing exams(id) */
  examId: string;
  /** Exam Title for quick display */
  examTitle: string;
  /** Foreign Key referencing users/students table */
  studentId: string;
  /** Student Name */
  studentName: string;
  /** Class / Form */
  form: string;
  /** Subject name */
  subject: string;
  /** Foreign Key referencing teacher reviewing script */
  teacherId: string;
  /** Teacher Name */
  teacherName: string;
  /** ISO 8601 Scan Date */
  scanDate: string;
  /** Array of scanned script pages */
  scannedPages: ScannedPageRecord[];
  /** Final score awarded */
  overallScore: number;
  /** Maximum marks achievable */
  totalMarks: number;
  /** Final percentage score */
  percentage: number;
  /** Letter Grade (A, B, C, D, F) */
  grade: string;
  /** Overall OCR confidence score */
  ocrConfidence: number;
  /** Overall AI marking confidence score */
  markingConfidence: number;
  /** Script lifecycle status */
  status: ExamScriptStatus;
  /** Individual question marking details */
  questionResults: QuestionMarkingResultRecord[];
  /** Performance breakdown by subject topic */
  topicPerformance: TopicPerformanceRecord[];
  /** General comments provided by evaluating teacher */
  teacherComments?: string;
  /** AI-generated holistic feedback and study recommendations */
  aiFeedback?: string;
  /** ISO 8601 Timestamp when created */
  createdAt: string;
  /** ISO 8601 Timestamp when updated */
  updatedAt: string;
}

// Convenient type aliases matching exact requested names
export type Exam = ExamRecord;
export type ExamQuestion = ExamQuestionRecord;
export type MarkingScheme = MarkingSchemeRecord;
export type MarkingPoint = MarkingPointRecord;
export type ExamScript = ExamScriptRecord;
export type ScannedPage = ScannedPageRecord;

// ==========================================
// RELATIONAL COMBINED TYPES & DTOs FOR API
// ==========================================

export interface ExamWithDetails extends ExamRecord {
  questions: (ExamQuestionRecord & { markingScheme?: MarkingSchemeRecord })[];
}

export interface CreateExamDTO {
  examCode: string;
  title: string;
  subjectId: string;
  subject: string;
  form: string;
  academicLevel: AcademicLevel;
  academicYear: string;
  term: 'Term 1' | 'Term 2' | 'Terminal' | 'Annual' | 'Mock' | 'NECTA';
  totalMarks: number;
  durationMinutes: number;
  instructions: string;
  createdByTeacherId: string;
  teacherName: string;
  schoolName: string;
}

export interface CreateExamQuestionDTO {
  examId: string;
  questionNumber: number;
  section?: string;
  questionType: QuestionType;
  questionText: string;
  topic: string;
  subtopic?: string;
  maxMarks: number;
  options?: string[];
  correctAnswer?: string;
  diagramUrl?: string;
  orderIndex: number;
}

export interface CreateMarkingSchemeDTO {
  examId: string;
  questionId: string;
  expectedAnswer: string;
  alternativeAnswers?: string[];
  markingPoints: {
    pointNumber: number;
    description: string;
    marks: number;
    keywords?: string[];
  }[];
  teacherNotes?: string;
  rubricCriteria?: {
    criterion: string;
    maxScore: number;
    description: string;
  }[];
  aiGuidelines?: string;
  createdByTeacherId: string;
}

export interface SubmitScriptForScanningDTO {
  examId: string;
  studentId: string;
  studentName: string;
  form: string;
  subject: string;
  teacherId: string;
  pages: {
    pageNumber: number;
    imageBase64: string;
  }[];
}
