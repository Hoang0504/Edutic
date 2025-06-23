import { useState } from 'react';
import * as XLSX from 'xlsx';
import { ExamImportData, ExamInfo, ExamPart, ExamQuestion, ExamAnswer, Translation, EXAM_TYPE_CONFIGS } from '@/types/exam';

interface ProcessResult {
  success: boolean;
  data?: ExamImportData;
  error?: string;
}

interface SubmitResult {
  success: boolean;
  data?: {
    examId: number;
    summary: any;
    message: string;
  };
  error?: string;
}

export function useExcelProcessor() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const processExcelFile = async (file: File): Promise<ProcessResult> => {
    setIsProcessing(true);
    
    try {
      // Read Excel file
      const arrayBuffer = await file.arrayBuffer();
      const workbook = XLSX.read(arrayBuffer, { type: 'array' });
      
      // Get worksheet names
      const sheetNames = workbook.SheetNames;
      console.log('Available sheets:', sheetNames);
      
      // Determine exam type based on file name and content
      const examType = determineExamType(file.name, sheetNames, workbook);
      console.log('Detected exam type:', examType);
      
      // Process based on exam type
      let result: ExamImportData;
      
      if (examType === 'full_toeic') {
        result = processFullToeicExam(workbook, file.name);
      } else if (examType === 'speaking' || examType === 'writing') {
        result = processStructuredExam(workbook, examType, file.name);
      } else {
        throw new Error('Không thể xác định loại đề thi từ file Excel');
      }
      
      return { success: true, data: result };
      
    } catch (error) {
      console.error('Excel processing error:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Lỗi xử lý file Excel' 
      };
    } finally {
      setIsProcessing(false);
    }
  };

  // Submit exam data to database
  const submitExamToDatabase = async (
    examData: ExamImportData, 
    audioFiles: File[] = []
  ): Promise<SubmitResult> => {
    setIsSubmitting(true);
    
    try {
      // Prepare form data
      const formData = new FormData();
      formData.append('data', JSON.stringify(examData));
      
      // Add audio files
      audioFiles.forEach((audioFile, index) => {
        formData.append('audioFiles', audioFile);
      });

      // Submit to API
      const response = await fetch('/api/admin/exams/import', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        return {
          success: true,
          data: {
            examId: result.data.examId,
            summary: result.data.summary,
            message: result.data.message
          }
        };
      } else {
        return {
          success: false,
          error: result.data?.message || 'Lỗi khi lưu đề thi'
        };
      }

    } catch (error) {
      console.error('Submit exam error:', error);
      return {
        success: false,
        error: 'Lỗi kết nối với server'
      };
    } finally {
      setIsSubmitting(false);
    }
  };

  const determineExamType = (fileName: string, sheetNames: string[], workbook: XLSX.WorkBook): 'full_toeic' | 'speaking' | 'writing' => {
    // Check file name first
    if (fileName.toLowerCase().includes('speaking')) {
      return 'speaking';
    }
    
    if (fileName.toLowerCase().includes('writing')) {
      return 'writing';
    }
    
    if (fileName.toLowerCase().includes('toeic')) {
      return 'full_toeic';
    }
    
    // Check sheet structure for TOEIC
    if (sheetNames.includes('Exams') && sheetNames.includes('Parts') && 
        sheetNames.includes('Questions') && sheetNames.includes('Answers')) {
      return 'full_toeic';
    }
    
    // Default to full_toeic for unrecognized files
    return 'full_toeic';
  };

  const processFullToeicExam = (workbook: XLSX.WorkBook, fileName: string): ExamImportData => {
    // Process Exams sheet
    const examSheet = workbook.Sheets['Exams'];
    if (!examSheet) throw new Error('Thiếu sheet "Exams"');
    
    const examData = XLSX.utils.sheet_to_json(examSheet)[0] as any;
    const exam: ExamInfo = {
      title: examData.title || `TOEIC Test - ${new Date().toLocaleDateString()}`,
      description: examData.description || 'TOEIC test với các parts reading',
      difficulty: (examData.difficulty as 'easy' | 'medium' | 'hard') || 'medium',
      estimated_time: examData.estimated_time || 60,
      exam_type: 'full_toeic'
    };

    // Process Parts sheet
    const partsSheet = workbook.Sheets['Parts'];
    if (!partsSheet) throw new Error('Thiếu sheet "Parts"');
    
    const partsData = XLSX.utils.sheet_to_json(partsSheet) as any[];
    const parts: ExamPart[] = partsData.map(row => ({
      part_number: row.part_number,
      title: row.title,
      description: row.description,
      instruction: row.instruction,
      difficulty_level: row.difficulty_level || 'medium',
      time_limit: row.time_limit || 20,
      type: [1, 2, 3, 4].includes(row.part_number) ? 'listening' : 'reading'
    }));

    // Process Questions sheet
    const questionsSheet = workbook.Sheets['Questions'];
    if (!questionsSheet) throw new Error('Thiếu sheet "Questions"');
    
    const questionsData = XLSX.utils.sheet_to_json(questionsSheet) as any[];
    const questions: ExamQuestion[] = questionsData.map(row => ({
      part_number: row.part_number,
      question_number: row.question_number,
      content: row.content,
      question_type: 'multiple_choice' as const,
      vietnamese_translation: row.vietnamese_translation || ''
    }));

    // Create mapping từ question_number to part_number
    const questionToPartMap = new Map<number, number>();
    questions.forEach(q => {
      questionToPartMap.set(q.question_number, q.part_number);
    });

    // Process Answers sheet
    const answersSheet = workbook.Sheets['Answers'];
    if (!answersSheet) throw new Error('Thiếu sheet "Answers"');
    
    const answersData = XLSX.utils.sheet_to_json(answersSheet) as any[];
    console.log('Answers data count:', answersData.length);
    console.log('Sample answer data:', answersData[0]);
    
    const answers: ExamAnswer[] = answersData.map(row => {
      const questionNumber = parseInt(row.question_number || row['Question No'] || row['Question Number'] || '0');
      const partNumber = questionToPartMap.get(questionNumber);
      
      if (!partNumber) {
        console.warn(`Không tìm thấy part_number cho question ${questionNumber}`);
      }
      
      // Handle missing answer_text - construct from answer_letter if needed
      let content = row.answer_text || row.content || row['Content'] || row['Answer Text'] || '';
      if (!content && row.answer_letter) {
        content = `(${row.answer_letter}) [Missing answer text]`;
        console.warn(`Missing answer_text for question ${questionNumber}, option ${row.answer_letter}`);
      }
      
      return {
        part_number: partNumber || 1, // Default to part 1 if not found
        question_number: questionNumber,
        content: content,
        is_correct: row.is_correct === true || row.is_correct === 'TRUE' || row.is_correct === 1 || 
                   row['Is Correct'] === true || row['Is Correct'] === 'TRUE' || row['Is Correct'] === 1,
        explanation: row.explanation || row['Explanation'] || '', // Keep empty if not available
        vietnamese_translation: row.vietnamese_translation || row['Vietnamese Translation'] || ''
      };
    });

    console.log('Processed answers count:', answers.length);
    console.log('Sample processed answers:');
    answers.slice(0, 5).forEach((answer, index) => {
      console.log(`Answer ${index + 1}:`, {
        question_number: answer.question_number,
        part_number: answer.part_number,
        content: answer.content?.substring(0, 50) + '...',
        is_correct: answer.is_correct
      });
    });

    // Process translations
    const translations: Translation[] = [];
    
    // Add question translations
    questions.forEach(q => {
      if (q.vietnamese_translation) {
        translations.push({
          question_id: q.question_number,
          type: 'question',
          vietnamese_text: q.vietnamese_translation
        });
      }
    });

    // Add answer translations
    answers.forEach(a => {
      if (a.vietnamese_translation) {
        translations.push({
          question_id: a.question_number,
          type: 'answer',
          vietnamese_text: a.vietnamese_translation
        });
      }
    });

    return {
      exam,
      parts,
      questions,
      answers,
      translations
    };
  };

  const processStructuredExam = (workbook: XLSX.WorkBook, examType: 'speaking' | 'writing', fileName: string): ExamImportData => {
    // Process Exams sheet
    const examSheet = workbook.Sheets['Exams'];
    if (!examSheet) throw new Error('Thiếu sheet "Exams"');
    
    const examData = XLSX.utils.sheet_to_json(examSheet)[0] as any;
    const exam: ExamInfo = {
      title: examData.title || `${examType === 'speaking' ? 'Speaking' : 'Writing'} Test - ${new Date().toLocaleDateString()}`,
      description: examData.description || EXAM_TYPE_CONFIGS[examType].description,
      difficulty: (examData.difficulty as 'easy' | 'medium' | 'hard') || 'medium',
      estimated_time: examData.estimated_time || EXAM_TYPE_CONFIGS[examType].defaultDuration,
      exam_type: examType
    };

    // Process Parts sheet
    const partsSheet = workbook.Sheets['Parts'];
    if (!partsSheet) throw new Error('Thiếu sheet "Parts"');
    
    const partsData = XLSX.utils.sheet_to_json(partsSheet) as any[];
    const parts: ExamPart[] = partsData.map(row => ({
      part_number: row.part_number,
      title: row.title,
      description: row.description,
      instruction: row.instruction,
      difficulty_level: row.difficulty_level || 'medium',
      time_limit: row.time_limit || 20,
      type: 'reading' // Speaking và Writing đều dùng 'reading' type (không cần audio)
    }));

    // Process Questions sheet
    const questionsSheet = workbook.Sheets['Questions'];
    if (!questionsSheet) throw new Error('Thiếu sheet "Questions"');
    
    const questionsData = XLSX.utils.sheet_to_json(questionsSheet) as any[];
    const questions: ExamQuestion[] = questionsData.map(row => ({
      part_number: row.part_number,
      question_number: row.question_number,
      content: row.content,
      question_type: examType, // Use 'speaking' or 'writing' directly
      vietnamese_translation: row.vietnamese_translation || ''
    }));

    // Speaking và Writing không cần answers, nhưng vẫn kiểm tra sheet để tránh lỗi
    let answers: ExamAnswer[] = [];
    if (workbook.Sheets['Answers']) {
      // Có thể có sheet Answers nhưng để trống, chỉ parse nếu có dữ liệu
      const answersData = XLSX.utils.sheet_to_json(workbook.Sheets['Answers']) as any[];
      if (answersData.length > 0 && answersData[0].question_number) {
        const questionToPartMap = new Map<number, number>();
        questions.forEach(q => {
          questionToPartMap.set(q.question_number, q.part_number);
        });

        answers = answersData.map(row => {
          const questionNumber = parseInt(row.question_number || '0');
          const partNumber = questionToPartMap.get(questionNumber);
          
          return {
            part_number: partNumber || 1,
            question_number: questionNumber,
            content: row.content || '',
            is_correct: false, // Speaking/Writing không có đáp án đúng/sai
            explanation: row.explanation || '',
            vietnamese_translation: row.vietnamese_translation || ''
          };
        });
      }
    }

    // Process translations
    const translations: Translation[] = [];
    
    // Add question translations
    questions.forEach(q => {
      if (q.vietnamese_translation) {
        translations.push({
          question_id: q.question_number,
          type: 'question',
          vietnamese_text: q.vietnamese_translation
        });
      }
    });

    return {
      exam,
      parts,
      questions,
      answers,
      translations
    };
  };

  return {
    processExcelFile,
    submitExamToDatabase,
    isProcessing,
    isSubmitting
  };
} 