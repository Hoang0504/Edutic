import { useState } from 'react';
import * as XLSX from 'xlsx';
import { ExamImportData, ExamInfo, ExamPart, ExamQuestion, ExamAnswer, Translation, EXAM_TYPE_CONFIGS, ExamQuestionGroup } from '@/types/exam';

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
    audioFiles: File[] = [],
    groupImages: { [groupId: number]: File[] } = {},
    questionImages: { [questionNumber: number]: File } = {}
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

      // Add group images (multiple images per group)
      Object.entries(groupImages).forEach(([groupId, files]) => {
        files.forEach((file, index) => {
          const suffix = index === 0 ? '' : `_${index + 1}`;
          formData.append(`groupImage_${groupId}${suffix}`, file);
        });
      });

      // Add question images
      Object.entries(questionImages).forEach(([questionNumber, file]) => {
        formData.append(`questionImage_${questionNumber}`, file);
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

    // Extract test name from file name for folder structure
    const testName = fileName.replace(/\.[^/.]+$/, ''); // Remove extension

    // Process Question Groups sheet (optional)
    let questionGroups: ExamQuestionGroup[] = [];
    // Detect sheet name for QuestionGroups (case & space insensitive)
    const qgSheetName = workbook.SheetNames.find((name) => name.replace(/\s+/g, '').toLowerCase() === 'questiongroups');
    if (qgSheetName && workbook.Sheets[qgSheetName]) {
      const groupsSheetName = qgSheetName;
      const rawGroupsData = XLSX.utils.sheet_to_json(workbook.Sheets[groupsSheetName], {header:1}) as any[];
      
      // Convert first row headers to normalized keys (trim lower-case)
      const headers = rawGroupsData[0].map((h: string) => (h || '').toString().trim().replace(/\s+/g,'_').toLowerCase());
      
      const groupsData = rawGroupsData.slice(1).map((rowArr: any[]) => {
        const obj: any = {};
        headers.forEach((h: string, idx: number) => {
          obj[h] = rowArr[idx];
        });
        return obj;
      });
      
      questionGroups = groupsData.map(row => {
        const groupId = row.group_id || row.group_no || row.groupid || row.id;
        const partNumber = row.part_number || row.partno || row.partnumber || row['part_number'];
        const startQuestion = row.start_question || row.question_start;
        const endQuestion = row.end_question || row.question_end;
        
        // Handle image URLs based on passage presence
        let imageUrls: string[] = [];
        
        if (!row.passage || row.passage.trim() === '') {
          // If passage is empty, generate image URLs
          const baseImageName = `${startQuestion}-${endQuestion}`;
          imageUrls.push(`/test1_2024/part${partNumber}/${baseImageName}.png`);
          
          // Check if multiple images are specified
          if (row.image_count && row.image_count > 1) {
            for (let i = 2; i <= row.image_count; i++) {
              imageUrls.push(`/test1_2024/part${partNumber}/${baseImageName}_${i}.png`);
            }
          }
        } else if (row.image_url) {
          // If image_url is provided, split by space to handle multiple images
          imageUrls = (row.image_url as string).split(' ').map((url: string) => url.trim()).filter((url: string) => url);
        }

        return {
          group_id: parseInt(groupId) || 0,
          part_number: parseInt(partNumber) || 0,
          passage: ((row.passage ?? row['passage'] ?? row.content ?? '') as string).trim(),
          image_url: imageUrls.join(' '), // Join multiple image URLs with space
          instruction: row.instruction,
          question_range: [parseInt(startQuestion) || 0, parseInt(endQuestion) || 0],
          vietnamese_translation: row.vietnamese_translation
        } as ExamQuestionGroup;
      });
    }

    // Process Questions sheet
    const questionsSheet = workbook.Sheets['Questions'];
    if (!questionsSheet) throw new Error('Thiếu sheet "Questions"');
    
    const rawQuestionsData = XLSX.utils.sheet_to_json(questionsSheet, {header:1}) as any[];
    const qHeaders = rawQuestionsData[0].map((h: string) => h.toString().trim().replace(/\s+/g,'_').toLowerCase());
    const questionsData = rawQuestionsData.slice(1).map((rowArr: any[]) => {
      const obj: any = {};
      qHeaders.forEach((h: string, idx: number) => {
        obj[h] = rowArr[idx];
      });
      return obj;
    });
    
    // Debug: Log the first few rows to see column names
    console.log('Debug - Sample questions data from Excel:', questionsData.slice(0, 3));
    console.log('Debug - Available columns:', Object.keys(questionsData[0] || {}));
    
    const questions: ExamQuestion[] = questionsData.map(row => {
      // Try different possible column names for group_id
      const groupId = row.group_id || row.group_no || row.groupid;
      
      console.log(`Debug - Question ${row.question_number}: group_id value = "${groupId}", type = ${typeof groupId}`);
      
      return {
        part_number: parseInt(row.part_number || row.partnumber || row.part_no || 0) || 0,
        question_number: parseInt(row.question_number || row.questionno || row['question_no'] || 0) || 0,
        group_id: groupId ? parseInt(groupId) : null,
        content: row.content || row.question || row['question_content'] || '',
        question_type: 'multiple_choice' as const,
        vietnamese_translation: row.vietnamese_translation || ''
      };
    });

    console.log('Debug - Processed questions with group_id:', questions.map(q => ({
      number: q.question_number,
      group_id: q.group_id,
      part_number: q.part_number
    })));

    // Create mapping từ question_number to part_number
    const questionToPartMap = new Map<number, number>();
    questions.forEach(q => {
      questionToPartMap.set(q.question_number, q.part_number);
    });

    // Process Answers sheet
    const answersSheet = workbook.Sheets['Answers'];
    if (!answersSheet) throw new Error('Thiếu sheet "Answers"');
    
    const rawAnswersData = XLSX.utils.sheet_to_json(answersSheet, {header:1}) as any[];
    const aHeaders = rawAnswersData[0].map((h: string) => h.toString().trim().replace(/\s+/g,'_').toLowerCase());
    const answersData = rawAnswersData.slice(1).map((rowArr: any[]) => {
      const obj: any = {};
      aHeaders.forEach((h: string, idx: number) => {
        obj[h] = rowArr[idx];
      });
      return obj;
    });
    
    console.log('Answers data count:', answersData.length);
    console.log('Sample answer data:', answersData[0]);
    
    const answers: ExamAnswer[] = answersData.map(row => {
      const questionNumber = parseInt(row.question_number || row.questionno || row['question_no'] || '0');
      const partNumber = questionToPartMap.get(questionNumber);
      
      if (!partNumber) {
        console.warn(`Không tìm thấy part_number cho question ${questionNumber}`);
      }
      
      // Extract answer letter from answer_text (e.g. "A. She's eating in a picnic area.")
      const content = row.answer_text || row.content || row.answer || row['answer_text'] || '';
      const answerLetter = content.split('.')[0].trim(); // Get "A" from "A. She's eating..."
      
      return {
        part_number: partNumber || 1, // Default to part 1 if not found
        question_number: questionNumber,
        content: content,
        answer_letter: answerLetter, // Add this for UI display purposes
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
      question_groups: questionGroups, // Thêm question groups vào return
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
      part_number: parseInt(row.part_number) || 0,
      question_number: parseInt(row.question_number) || 0,
      group_id: null, // Structured exams don't use question groups
      content: row.content || '',
      question_type: examType as 'speaking' | 'writing',
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
            answer_letter: '', // Add empty answer_letter for structured exams
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