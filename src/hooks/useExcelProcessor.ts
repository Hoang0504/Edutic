import { useState } from 'react';
import * as XLSX from 'xlsx';
import { ExamImportData, ExamInfo, ExamPart, ExamQuestion, ExamAnswer, Translation, EXAM_TYPE_CONFIGS } from '@/types/exam';

interface ProcessResult {
  success: boolean;
  data?: ExamImportData;
  error?: string;
}

export const useExcelProcessor = () => {
  const [isProcessing, setIsProcessing] = useState(false);

  const processExcelFile = async (file: File): Promise<ProcessResult> => {
    setIsProcessing(true);
    
    try {
      const arrayBuffer = await file.arrayBuffer();
      const workbook = XLSX.read(arrayBuffer, { type: 'array' });

      // Validate required sheets
      const requiredSheets = ['Exam Info', 'Parts', 'Questions', 'Answers'];
      const missingSheets = requiredSheets.filter(sheet => !workbook.SheetNames.includes(sheet));
      
      if (missingSheets.length > 0) {
        return {
          success: false,
          error: `File Excel thiếu các sheet: ${missingSheets.join(', ')}`
        };
      }

      // Process each sheet
      const examData = processExamSheet(workbook.Sheets['Exam Info']);
      const partsData = processPartsSheet(workbook.Sheets['Parts']);
      const questionsData = processQuestionsSheet(workbook.Sheets['Questions']);
      const answersData = processAnswersSheet(workbook.Sheets['Answers']);

      // Process translations if exists
      let translationsData: Translation[] = [];
      if (workbook.SheetNames.includes('Translations')) {
        translationsData = processTranslationsSheet(workbook.Sheets['Translations']);
      }

      // Detect exam type based on data
      const detectedExamType = detectExamType(partsData, questionsData);
      examData.exam_type = detectedExamType;

      // Validate data
      const validation = validateData(examData, partsData, questionsData, answersData, detectedExamType);
      if (!validation.valid) {
        return {
          success: false,
          error: validation.error
        };
      }

      return {
        success: true,
        data: {
          exam: examData,
          parts: partsData,
          questions: questionsData,
          answers: answersData,
          translations: translationsData
        }
      };

    } catch (error) {
      console.error('Excel processing error:', error);
      return {
        success: false,
        error: 'Lỗi xử lý file Excel. Vui lòng kiểm tra định dạng file.'
      };
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    processExcelFile,
    isProcessing
  };
};

function processExamSheet(sheet: XLSX.WorkSheet): ExamInfo {
  const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });
  const rows = data as any[][];
  
  // Assuming format: [Header row, Data row]
  const headers = rows[0] || [];
  const values = rows[1] || [];
  
  const result: any = {};
  headers.forEach((header: string, index: number) => {
    if (header && values[index] !== undefined) {
      result[header.toLowerCase().replace(/\s+/g, '_')] = values[index];
    }
  });

  return {
    title: result.title || '',
    description: result.description || '',
    difficulty: mapDifficulty(result.difficulty || result.level),
    estimated_time: parseInt(result.duration || result.estimated_time) || 120,
    is_published: false
  };
}

function processPartsSheet(sheet: XLSX.WorkSheet): ExamPart[] {
  const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });
  const rows = data as any[][];
  
  if (rows.length < 2) return [];
  
  const headers = rows[0];
  const dataRows = rows.slice(1);
  
  return dataRows.map(row => {
    const result: any = {};
    headers.forEach((header: string, index: number) => {
      if (header && row[index] !== undefined) {
        result[header.toLowerCase().replace(/\s+/g, '_')] = row[index];
      }
    });

    return {
      part_number: parseInt(result.part_no || result.part_number) || 0,
      title: result.title || '',
      description: result.description || '',
      instruction: result.instruction || '',
      time_limit: parseTimeLimit(result.time_limit),
      type: mapPartType(result.type),
      difficulty_level: result.difficulty_level || 'medium'
    };
  });
}

function processQuestionsSheet(sheet: XLSX.WorkSheet): ExamQuestion[] {
  const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });
  const rows = data as any[][];
  
  if (rows.length < 2) return [];
  
  const headers = rows[0];
  const dataRows = rows.slice(1);
  
  return dataRows.map(row => {
    const result: any = {};
    headers.forEach((header: string, index: number) => {
      if (header && row[index] !== undefined) {
        result[header.toLowerCase().replace(/\s+/g, '_')] = row[index];
      }
    });

    return {
      part_number: parseInt(result.part_no || result.part_number) || 0,
      question_number: parseInt(result.question_no || result.question_number) || 0,
      content: result.content || result.question_content || '',
      question_type: mapQuestionType(result.type || result.question_type),
      image_url: result.image_url || result.image || undefined,
      vietnamese_translation: result.vietnamese_translation || result.translation || undefined
    };
  });
}

function processAnswersSheet(sheet: XLSX.WorkSheet): ExamAnswer[] {
  const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });
  const rows = data as any[][];
  
  if (rows.length < 2) return [];
  
  const headers = rows[0];
  const dataRows = rows.slice(1);
  
  return dataRows.map(row => {
    const result: any = {};
    headers.forEach((header: string, index: number) => {
      if (header && row[index] !== undefined) {
        result[header.toLowerCase().replace(/\s+/g, '_')] = row[index];
      }
    });

    return {
      question_number: parseInt(result.question_no || result.question_number) || 0,
      content: result.content || result.answer_content || '',
      is_correct: mapBooleanValue(result.is_correct || result.correct),
      explanation: result.explanation || result.explain || undefined,
      vietnamese_translation: result.vietnamese_translation || result.translation || undefined
    };
  });
}

function processTranslationsSheet(sheet: XLSX.WorkSheet): Translation[] {
  const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });
  const rows = data as any[][];
  
  if (rows.length < 2) return [];
  
  const headers = rows[0];
  const dataRows = rows.slice(1);
  
  return dataRows.map(row => {
    const result: any = {};
    headers.forEach((header: string, index: number) => {
      if (header && row[index] !== undefined) {
        result[header.toLowerCase().replace(/\s+/g, '_')] = row[index];
      }
    });

    return {
      question_id: parseInt(result.question_id || result.question_no) || undefined,
      answer_id: parseInt(result.answer_id) || undefined,
      type: (result.type === 'answer') ? 'answer' : 'question',
      vietnamese_text: result.vietnamese_text || result.translation || ''
    };
  });
}

function detectExamType(parts: ExamPart[], questions: ExamQuestion[]): 'speaking_practice' | 'writing_practice' | 'full_toeic' {
  const questionCount = questions.length;
  const partNumbers = parts.map(p => p.part_number);
  
  // Check for full TOEIC exam (must have all 7 parts and ~200 questions)
  const hasAll7Parts = [1, 2, 3, 4, 5, 6, 7].every(num => partNumbers.includes(num));
  if (hasAll7Parts && questionCount >= 150) {
    return 'full_toeic';
  }
  
  // For practice types, check if there's only one "part" or no meaningful part division
  if (parts.length === 1 || partNumbers.every(num => num === 1)) {
    // Determine between speaking and writing based on content or explicit indicators
    const examTitle = questions[0]?.content?.toLowerCase() || '';
    const hasWritingKeywords = examTitle.includes('write') || examTitle.includes('essay') || 
                              examTitle.includes('viết') || examTitle.includes('writing');
    const hasSpeakingKeywords = examTitle.includes('speak') || examTitle.includes('talk') || 
                               examTitle.includes('nói') || examTitle.includes('speaking');
    
    if (hasWritingKeywords) {
      return 'writing_practice';
    } else if (hasSpeakingKeywords) {
      return 'speaking_practice';
    }
    
    // Default assumption: if small number of questions, likely speaking; if more, likely writing
    return questionCount <= 20 ? 'speaking_practice' : 'writing_practice';
  }
  
  // If has multiple parts but not all 7, default to writing practice
  return 'writing_practice';
}

function validateData(
  exam: ExamInfo, 
  parts: ExamPart[], 
  questions: ExamQuestion[], 
  answers: ExamAnswer[],
  examType: 'speaking_practice' | 'writing_practice' | 'full_toeic'
): { valid: boolean; error?: string } {
  
  if (!exam.title) {
    return { valid: false, error: 'Thiếu tiêu đề đề thi' };
  }
  
  if (parts.length === 0) {
    return { valid: false, error: 'Không có phần nào trong đề thi' };
  }
  
  if (questions.length === 0) {
    return { valid: false, error: 'Không có câu hỏi nào' };
  }

  // Get exam configuration
  const config = EXAM_TYPE_CONFIGS[examType];
  
  // Validate question count
  if (questions.length > config.maxQuestions) {
    return { 
      valid: false, 
      error: `${config.description} chỉ được phép có tối đa ${config.maxQuestions} câu hỏi, nhưng có ${questions.length} câu hỏi` 
    };
  }

  // For practice types (speaking/writing), answers are optional
  if (config.needsAnswers && answers.length === 0) {
    return { valid: false, error: 'Không có đáp án nào' };
  }

  // For full TOEIC, validate strict part structure
  if (examType === 'full_toeic') {
    // Validate all required parts exist
    const partNumbers = parts.map(p => p.part_number);
    const missingParts = config.parts.filter(num => !partNumbers.includes(num));
    if (missingParts.length > 0) {
      return {
        valid: false,
        error: `Đề thi TOEIC thiếu các part: ${missingParts.join(', ')}`
      };
    }

    // Validate question numbering follows TOEIC standard
    for (const partConfig of config.questionStructure) {
      const partQuestions = questions.filter(q => q.part_number === partConfig.partNumber);
      const [expectedStart, expectedEnd] = partConfig.questionRange;
      
      // Check question count for each part
      if (partQuestions.length !== partConfig.questionCount) {
        return {
          valid: false,
          error: `Part ${partConfig.partNumber} phải có đúng ${partConfig.questionCount} câu hỏi, nhưng có ${partQuestions.length} câu`
        };
      }

      // Check question numbering
      const questionNumbers = partQuestions.map(q => q.question_number).sort((a, b) => a - b);
      const expectedNumbers = Array.from({ length: partConfig.questionCount }, (_, i) => expectedStart + i);
      
      for (let i = 0; i < expectedNumbers.length; i++) {
        if (questionNumbers[i] !== expectedNumbers[i]) {
          return {
            valid: false,
            error: `Part ${partConfig.partNumber} câu hỏi phải được đánh số từ ${expectedStart} đến ${expectedEnd}, nhưng có lỗi ở câu ${questionNumbers[i] || 'missing'}`
          };
        }
      }
    }

    // Validate answers for TOEIC (must have answers)
    const questionNumbers = new Set(questions.map(q => q.question_number));
    const answerQuestions = new Set(answers.map(a => a.question_number));
    const missingAnswerQuestions = Array.from(questionNumbers).filter(q => !answerQuestions.has(q));
    
    if (missingAnswerQuestions.length > 0) {
      return { 
        valid: false, 
        error: `Thiếu đáp án cho các câu hỏi: ${missingAnswerQuestions.slice(0, 5).join(', ')}${missingAnswerQuestions.length > 5 ? '...' : ''}` 
      };
    }
  }

  // For practice types, validate part structure is simple
  if (examType === 'speaking_practice' || examType === 'writing_practice') {
    const partNumbers = parts.map(p => p.part_number);
    
    // Should have only one logical part (can be numbered 1 or all same number)
    const uniqueParts = [...new Set(partNumbers)];
    if (uniqueParts.length > 1 && !uniqueParts.every(num => num === 1)) {
      return {
        valid: false,
        error: `${config.description} không cần chia nhiều part. Hãy sử dụng part number = 1 cho tất cả topics.`
      };
    }

    // Validate part numbers match questions
    const questionParts = new Set(questions.map(q => q.part_number));
    const invalidQuestionParts = Array.from(questionParts).filter(p => !partNumbers.includes(p));
    
    if (invalidQuestionParts.length > 0) {
      return { 
        valid: false, 
        error: `Topics thuộc phần không tồn tại: ${invalidQuestionParts.join(', ')}` 
      };
    }
  }

  return { valid: true };
}

// Helper functions
function mapDifficulty(value: any): 'easy' | 'medium' | 'hard' {
  const str = String(value).toLowerCase();
  if (str.includes('easy') || str.includes('dễ')) return 'easy';
  if (str.includes('hard') || str.includes('khó')) return 'hard';
  return 'medium';
}

function mapPartType(value: any): 'listening' | 'reading' {
  const str = String(value).toLowerCase();
  return str.includes('listen') || str.includes('nghe') ? 'listening' : 'reading';
}

function mapQuestionType(value: any): 'multiple_choice' | 'fill_blank' | 'essay' {
  const str = String(value).toLowerCase();
  if (str.includes('fill') || str.includes('điền')) return 'fill_blank';
  if (str.includes('essay') || str.includes('tự luận')) return 'essay';
  return 'multiple_choice';
}

function mapBooleanValue(value: any): boolean {
  if (typeof value === 'boolean') return value;
  const str = String(value).toLowerCase();
  return str === 'true' || str === '1' || str === 'yes' || str === 'đúng' || str === '✓';
}

function parseTimeLimit(value: any): number {
  if (typeof value === 'number') return value;
  
  const str = String(value).toLowerCase();
  
  // Parse "X minutes" or "X phút"
  const minuteMatch = str.match(/(\d+)\s*(minute|phút|min)/);
  if (minuteMatch) {
    return parseInt(minuteMatch[1]) * 60;
  }
  
  // Parse "X:Y" format (minutes:seconds)
  const timeMatch = str.match(/(\d+):(\d+)/);
  if (timeMatch) {
    return parseInt(timeMatch[1]) * 60 + parseInt(timeMatch[2]);
  }
  
  // Parse plain number (assume seconds)
  const numberMatch = str.match(/(\d+)/);
  if (numberMatch) {
    return parseInt(numberMatch[1]);
  }
  
  return 0;
} 