import { useState } from 'react';
import * as XLSX from 'xlsx';
import { ExamImportData, ExamInfo, ExamPart, ExamQuestion, ExamAnswer } from '@/types/exam';

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

      // Validate data
      const validation = validateData(examData, partsData, questionsData, answersData);
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
          answers: answersData
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
      type: mapPartType(result.type)
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
      image_url: result.image_url || result.image || undefined
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
      explanation: result.explanation || result.explain || undefined
    };
  });
}

function validateData(
  exam: ExamInfo, 
  parts: ExamPart[], 
  questions: ExamQuestion[], 
  answers: ExamAnswer[]
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
  
  if (answers.length === 0) {
    return { valid: false, error: 'Không có đáp án nào' };
  }

  // Validate part numbers
  const partNumbers = new Set(parts.map(p => p.part_number));
  const questionParts = new Set(questions.map(q => q.part_number));
  const invalidQuestionParts = Array.from(questionParts).filter(p => !partNumbers.has(p));
  
  if (invalidQuestionParts.length > 0) {
    return { 
      valid: false, 
      error: `Câu hỏi thuộc phần không tồn tại: ${invalidQuestionParts.join(', ')}` 
    };
  }

  // Validate question numbers
  const questionNumbers = new Set(questions.map(q => q.question_number));
  const answerQuestions = new Set(answers.map(a => a.question_number));
  const invalidAnswerQuestions = Array.from(answerQuestions).filter(q => !questionNumbers.has(q));
  
  if (invalidAnswerQuestions.length > 0) {
    return { 
      valid: false, 
      error: `Đáp án cho câu hỏi không tồn tại: ${invalidAnswerQuestions.join(', ')}` 
    };
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