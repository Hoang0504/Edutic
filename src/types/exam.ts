export interface ExamInfo {
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  estimated_time: number; // in minutes
  is_published?: boolean;
  exam_type?: 'full_toeic' | 'speaking' | 'writing'; // Removed practice types
}

export interface ExamPart {
  part_number: number;
  title: string;
  description?: string;
  instruction?: string;
  time_limit: number; // in minutes
  type: 'listening' | 'reading';
  difficulty_level?: string;
  audio?: {
    file_path?: string;
    duration?: number; // in minutes
    transcript?: string;
  };
}

export interface ExamQuestion {
  part_number: number;
  question_number: number;
  content: string;
  question_type: 'multiple_choice' | 'fill_in_blank' | 'matching' | 'speaking' | 'writing'; // Updated to match database ENUM
  image_url?: string;
  image_file?: File; // Upload ảnh cho câu hỏi
  vietnamese_translation?: string; // Bản dịch tiếng Việt
}

export interface ExamAnswer {
  part_number: number;
  question_number: number;
  content: string;
  is_correct: boolean;
  explanation?: string;
  vietnamese_translation?: string; // Bản dịch tiếng Việt cho đáp án
}

export interface Translation {
  question_id?: number;
  answer_id?: number;
  type: 'question' | 'answer';
  vietnamese_text: string;
}

export interface ExamImportData {
  exam: ExamInfo;
  parts: ExamPart[];
  questions: ExamQuestion[];
  answers: ExamAnswer[];
  translations?: Translation[];
}

export interface AudioFile {
  file: File;
  partNumber: number;
  name: string;
}

// API request type cho việc gửi từng part
export interface PartSubmissionData {
  title: string;
  part_number: number;
  difficulty_level: string;
  instruction: string;
  time_limit: number; // in minutes
  audio?: {
    file_path: string;
    duration: number; // in minutes
    transcript: string;
  };
  questions: {
    question: string;
    image_file?: File;
    vietnamese_translation?: string;
    answers: {
      content: string;
      is_correct: boolean;
      explanation?: string;
      vietnamese_translation?: string;
    }[];
  }[];
  translations: {
    question_id?: number;
    vietnamese_text: string;
  }[];
}

export type TabType = 'exam' | 'parts' | 'questions' | 'answers';
export type PartTabType = 'part1' | 'part2' | 'part3' | 'part4' | 'part5' | 'part6' | 'part7';

// Exam type configuration
export interface ExamTypeConfig {
  type: 'full_toeic' | 'speaking' | 'writing'; // Removed practice types
  maxQuestions: number;
  defaultDuration: number; // in minutes
  parts: number[];
  description: string;
  needsPartDivision: boolean; // Có cần chia part hay không
  needsAnswers: boolean; // Có cần đáp án hay không
  questionStructure: {
    partNumber: number;
    title: string;
    questionRange: [number, number]; // [start, end] question numbers
    questionCount: number;
  }[];
}

export const EXAM_TYPE_CONFIGS: Record<string, ExamTypeConfig> = {
  speaking: {
    type: 'speaking',
    maxQuestions: 11,
    defaultDuration: 20,
    parts: [1, 2, 3], // 3 parts cho speaking test
    description: 'Đề thi Speaking - 11 câu hỏi theo chuẩn đánh giá',
    needsPartDivision: true,
    needsAnswers: false, // Không cần đáp án cho speaking
    questionStructure: [
      {
        partNumber: 1,
        title: 'Part 1 - Personal Introduction',
        questionRange: [1, 3],
        questionCount: 3
      },
      {
        partNumber: 2,
        title: 'Part 2 - Describe & Express',
        questionRange: [4, 6],
        questionCount: 3
      },
      {
        partNumber: 3,
        title: 'Part 3 - Express Opinion',
        questionRange: [7, 11],
        questionCount: 5
      }
    ]
  },
  writing: {
    type: 'writing',
    maxQuestions: 8,
    defaultDuration: 60,
    parts: [1, 2], // 2 parts cho writing test
    description: 'Đề thi Writing - 8 câu hỏi theo chuẩn đánh giá',
    needsPartDivision: true,
    needsAnswers: false, // Không cần đáp án cho writing
    questionStructure: [
      {
        partNumber: 1,
        title: 'Part 1 - Complete Sentence',
        questionRange: [1, 5],
        questionCount: 5
      },
      {
        partNumber: 2,
        title: 'Part 2 - Write an Essay',
        questionRange: [6, 8],
        questionCount: 3
      }
    ]
  },
  full_toeic: {
    type: 'full_toeic',
    maxQuestions: 200,
    defaultDuration: 120,
    parts: [1, 2, 3, 4, 5, 6, 7], // All TOEIC parts
    description: 'Đề thi TOEIC đầy đủ - 200 câu hỏi, 7 parts theo chuẩn ETS',
    needsPartDivision: true,
    needsAnswers: true,
    questionStructure: [
      {
        partNumber: 1,
        title: 'Part 1 - Photographs',
        questionRange: [1, 6],
        questionCount: 6
      },
      {
        partNumber: 2, 
        title: 'Part 2 - Question-Response',
        questionRange: [7, 31],
        questionCount: 25
      },
      {
        partNumber: 3,
        title: 'Part 3 - Short Conversations', 
        questionRange: [32, 70],
        questionCount: 39
      },
      {
        partNumber: 4,
        title: 'Part 4 - Short Talks',
        questionRange: [71, 100], 
        questionCount: 30
      },
      {
        partNumber: 5,
        title: 'Part 5 - Incomplete Sentences',
        questionRange: [101, 130],
        questionCount: 30
      },
      {
        partNumber: 6,
        title: 'Part 6 - Text Completion',
        questionRange: [131, 146],
        questionCount: 16
      },
      {
        partNumber: 7,
        title: 'Part 7 - Reading Comprehension', 
        questionRange: [147, 200],
        questionCount: 54
      }
    ]
  }
}; 