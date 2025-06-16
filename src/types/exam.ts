export interface ExamInfo {
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  estimated_time: number; // in minutes
  is_published?: boolean;
}

export interface ExamPart {
  part_number: number;
  title: string;
  description?: string;
  instruction?: string;
  time_limit: number; // in seconds
  type: 'listening' | 'reading';
}

export interface ExamQuestion {
  part_number: number;
  question_number: number;
  content: string;
  question_type: 'multiple_choice' | 'fill_blank' | 'essay';
  image_url?: string;
}

export interface ExamAnswer {
  question_number: number;
  content: string;
  is_correct: boolean;
  explanation?: string;
}

export interface ExamImportData {
  exam: ExamInfo;
  parts: ExamPart[];
  questions: ExamQuestion[];
  answers: ExamAnswer[];
}

export interface AudioFile {
  file: File;
  partNumber: number;
  name: string;
}

export type TabType = 'exam' | 'parts' | 'questions' | 'answers'; 