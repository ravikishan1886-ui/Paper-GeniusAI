export type QuestionType =
  | 'mcq'
  | 'vsa'
  | 'sa'
  | 'la'
  | 'numerical'
  | 'case_study'
  | 'assertion_reason'
  | 'fill_in_blanks'
  | 'true_false'
  | 'match_the_columns'
  | 'diagram_based'
  | 'source_based';

export interface Question {
  id: string;
  sectionId: string;
  number: number;
  type: QuestionType;
  text: string;
  options?: string[]; // 4 options for MCQs
  correctOption?: string; // 'A' | 'B' | 'C' | 'D'
  hasInternalChoice?: boolean;
  orQuestion?: {
    text: string;
    options?: string[];
    correctOption?: string;
    answer: string;
    solutionSteps?: string[];
  };
  marks: number;
  difficulty: 'easy' | 'moderate' | 'challenging' | 'hots';
  chapter?: string;
  topic?: string;
  diagramDescription?: string;
  casePassage?: string;
}

export interface MarkingStep {
  step: string;
  marks: number;
}

export interface AnswerItem {
  questionNumber: number;
  questionId: string;
  type: QuestionType;
  correctAnswer: string;
  solutionSteps: string[];
  markingScheme: MarkingStep[];
  keyFormulasOrEquations?: string[];
  explanation?: string;
}

export interface Section {
  id: string;
  name: string; // e.g. "Section A"
  title: string; // e.g. "Multiple Choice Questions"
  instructions?: string;
  questionCount: number;
  marksPerQuestion: number;
  totalMarks: number;
  questionType: QuestionType;
  questions: Question[];
}

export interface WatermarkConfig {
  text: string;
  enabled: boolean;
  opacity: number; // 0 to 1, default 0.12
  rotation: number; // -35 degrees
  color: string; // light gray e.g. '#64748b'
  fontSize: number;
}

export interface QuestionPaper {
  id: string;
  userId?: string;
  createdAt: string;
  updatedAt: string;
  title: string;
  instituteName: string;
  country: string;
  board: string;
  classLevel: string;
  academicYear: string;
  subject: string;
  examType: string;
  language: string;
  durationMinutes: number;
  maxMarks: number;
  totalCalculatedMarks: number;
  difficulty: string;
  syllabusType: 'complete' | 'chapters' | 'topics' | 'custom';
  syllabusText?: string;
  chapters: string[];
  generalInstructions: string[];
  sections: Section[];
  answerKey: AnswerItem[];
  watermark: WatermarkConfig;
}

export interface GeneratePaperRequest {
  title: string;
  instituteName?: string;
  country: string;
  board: string;
  classLevel: string;
  academicYear: string;
  subject: string;
  examType: string;
  language: string;
  durationMinutes: number;
  maxMarks: number;
  difficulty: string;
  syllabusType: 'complete' | 'chapters' | 'topics' | 'custom';
  syllabusText?: string;
  chapters: string[];
  sections: {
    id: string;
    name: string;
    title: string;
    questionCount: number;
    marksPerQuestion: number;
    questionType: QuestionType;
    instructions?: string;
  }[];
  watermark?: WatermarkConfig;
}

export interface BankQuestion {
  id: string;
  userId?: string;
  subject: string;
  classLevel: string;
  chapter: string;
  difficulty: 'easy' | 'moderate' | 'challenging' | 'hots';
  type: QuestionType;
  marks: number;
  text: string;
  options?: string[];
  answer: string;
  solution?: string;
  createdAt: string;
}
