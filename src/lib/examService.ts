import sequelize from '@/lib/db';
import { Exam } from '@/models/Exam';
import { Part } from '@/models/Part';
import { Question } from '@/models/Question';
import { Answer } from '@/models/Answer';
import { AudioFile } from '@/models/AudioFile';
import { Translation } from '@/models/Translation';
import { QuestionGroup } from '@/models/QuestionGroup';
import { ExamPart } from '@/models/ExamPart';
import { saveAudioFile, saveQuestionImage, getAudioDuration, saveImageFile } from './fileUpload';

interface ExamData {
  exam: {
    title: string;
    type: string;
    exam_type?: string;
    description: string;
    estimated_time: number;
    year_of_release: number;
  };
  parts: Array<{
    part_number: number;
    title: string;
    description: string;
    instruction: string;
    difficulty_level: string;
    time_limit: number;
    type: string;
  }>;
  questions: Array<{
    part_number: number;
    question_number: number;
    content: string;
    question_type: string;
    vietnamese_translation?: string;
    group_id?: number;
  }>;
  answers: Array<{
    part_number: number;
    question_number: number;
    content: string;
    is_correct: boolean;
    explanation?: string;
    vietnamese_translation?: string;
  }>;
  question_groups?: Array<{
    group_id: number;
    part_number: number;
    passage: string;
    image_url?: string;
  }>;
}

interface PartData {
  title: string;
  part_number: number;
  difficulty_level: string;
  instruction: string;
  time_limit: number;
  questions: Array<{
    question: string;
    vietnamese_translation?: string;
    answers: Array<{
      content: string;
      is_correct: boolean;
      explanation?: string;
      vietnamese_translation?: string;
    }>;
  }>;
  translations: Array<{
    question_id?: number;
    vietnamese_text: string;
  }>;
}

// Create exam with all data
export async function createExamWithData(
  examData: ExamData,
  audioFiles: Express.Multer.File[],
  groupImageFiles: Express.Multer.File[] = [],
  questionImageFiles: Express.Multer.File[] = []
): Promise<{ examId: number; summary: any }> {
  const transaction = await sequelize.transaction();
  
  try {
    // 1. Create exam
    // Determine the correct DB enum value for the exam type
    const resolvedExamType = (() => {
      const srcType = (examData.exam.exam_type || examData.exam.type) as string | undefined;
      if (srcType === 'full_toeic') return 'full_test';
      if (srcType === 'speaking') return 'speaking';
      if (srcType === 'writing') return 'writing';
      return 'full_test'; // Fallback to full_test
    })() as 'random' | 'full_test' | 'speaking' | 'writing';

    const exam = await Exam.create({
      title: examData.exam.title,
      type: resolvedExamType,
      description: examData.exam.exam_type ? 
        `[${examData.exam.exam_type}] ${examData.exam.description}` : 
        examData.exam.description,
      estimated_time: examData.exam.estimated_time,
      year_of_release: examData.exam.year_of_release || new Date().getFullYear(),
      is_published: false,
      created_at: new Date(),
      updated_at: new Date()
    }, { transaction });

    const examId = exam.id;

    // Create directories for image storage
    const examFolderName = `${examData.exam.title.toLowerCase().replace(/\s+/g, '_')}_${examData.exam.year_of_release}`;
    
    // Process group images to create a mapping
    const groupImageMap = new Map<string, string[]>(); // groupId -> image URLs
    
    for (const imageFile of groupImageFiles) {
      // Extract group ID from fieldname (e.g., "groupImage_24" or "groupImage_24_2")
      const match = imageFile.fieldname.match(/groupImage_(\d+)(?:_(\d+))?/);
      if (match) {
        const groupId = match[1];
        const imageIndex = match[2] ? parseInt(match[2]) : 1;
        
        // Find questions for this group to determine the file naming
        const groupQuestions = examData.questions.filter(q => q.group_id?.toString() === groupId);
        if (groupQuestions.length > 0) {
          const minQuestion = Math.min(...groupQuestions.map(q => q.question_number));
          const maxQuestion = Math.max(...groupQuestions.map(q => q.question_number));
          
          // Determine part number for folder structure
          const partNumber = groupQuestions[0].part_number;
          const folderPath = `${examFolderName}/part${partNumber}`;
          
          // Generate file name
          const suffix = imageIndex === 1 ? '' : `_${imageIndex}`;
          const fileName = `${minQuestion}-${maxQuestion}${suffix}.png`;
          const filePath = `${folderPath}/${fileName}`;
          
          // Save image file
          await saveImageFile(imageFile, filePath);
          
          // Store in map
          if (!groupImageMap.has(groupId)) {
            groupImageMap.set(groupId, []);
          }
          groupImageMap.get(groupId)!.push(filePath);
        }
      }
    }

    // Process question images
    const questionImageMap = new Map<string, string>(); // questionNumber -> image URL
    
    for (const imageFile of questionImageFiles) {
      // Extract question number from fieldname (e.g., "questionImage_25")
      const match = imageFile.fieldname.match(/questionImage_(\d+)/);
      if (match) {
        const questionNumber = match[1];
        
        // Find the question to determine part number
        const question = examData.questions.find(q => q.question_number.toString() === questionNumber);
        if (question) {
          const partNumber = question.part_number;
          const folderPath = `${examFolderName}/part${partNumber}`;
          const fileName = `${questionNumber}.png`;
          const filePath = `${folderPath}/${fileName}`;
          
          // Save image file
          await saveImageFile(imageFile, filePath);
          questionImageMap.set(questionNumber, filePath);
        }
      }
    }

    // 2. Create parts and their relationships
    const partMap = new Map<number, number>(); // part_number -> part_id
    let audioFileIndex = 0;

    for (const partData of examData.parts) {
      // Create part
      const part = await Part.create({
        part_number: partData.part_number,
        title: partData.title,
        description: partData.description,
        instruction: partData.instruction,
        difficulty_level: partData.difficulty_level as 'easy' | 'medium' | 'hard',
        time_limit: partData.time_limit,
        created_at: new Date(),
        updated_at: new Date()
      }, { transaction });

      partMap.set(partData.part_number, part.id);

      // Create exam-part relationship
      await ExamPart.create({
        exam_id: examId,
        part_id: part.id,
        order_index: partData.part_number
      }, { transaction });

      // Handle audio file for listening parts
      if ([1, 2, 3, 4].includes(partData.part_number) && audioFiles[audioFileIndex]) {
        const audioFile = audioFiles[audioFileIndex];
        const filePath = await saveAudioFile(audioFile, examFolderName, partData.part_number);
        const duration = getAudioDuration(audioFile);

        await AudioFile.create({
          part_id: part.id,
          file_path: filePath,
          duration: duration,
          transcript: '', // Will be filled later if needed
          created_at: new Date()
        }, { transaction });

        audioFileIndex++;
      }
    }

    // 3. Create questions and question groups
    const questionMap = new Map<string, number>();
    const createdGroups = new Map<string, number>(); // Track created groups by part_number:group_id

    // Handle specific question numbers
    const processedQuestions = new Set<number>();
    
    for (const questionData of examData.questions) {
      // Skip if already processed (avoid duplicates)
      if (processedQuestions.has(questionData.question_number)) {
        continue;
      }
      
      // Convert Set to Array for iteration
      const processedArray = Array.from(processedQuestions);
      processedQuestions.add(questionData.question_number);

      const partNumber = questionData.part_number;
      const partId = partMap.get(partNumber);
      if (!partId) continue;

      // Xử lý question groups cho reading comprehension
      let groupId: number | null = null;
      
      if (questionData.group_id) {
        // Nếu có group_id từ Excel, tạo hoặc sử dụng group đã tồn tại
        const groupKey = `${partNumber}:${questionData.group_id}`;
        
        if (createdGroups.has(groupKey)) {
          // Group đã tồn tại, sử dụng lại
          groupId = createdGroups.get(groupKey)!;
        } else {
          // Tạo group mới từ question_groups data hoặc default
          const groupData = examData.question_groups?.find(g => 
            g.group_id === questionData.group_id && g.part_number === partNumber
          );
          
          // Get image URLs for this group (multiple images separated by space)
          const groupImages = groupImageMap.get(questionData.group_id.toString()) || [];
          const imageUrl = groupImages.length > 0 ? groupImages.join(' ') : (groupData?.image_url || null);
          
          const group = await QuestionGroup.create({
            part_id: partId,
            content: groupData?.passage || `Reading passage for questions in group ${questionData.group_id}`,
            image_url: imageUrl,
            created_at: new Date()
          }, { transaction });
          
          groupId = group.id;
          createdGroups.set(groupKey, groupId);
        }
      }

      // Create question with image URL if available
      const questionImageUrl = questionImageMap.get(questionData.question_number.toString()) || '';
      
      const question = await Question.create({
        part_id: partId,
        group_id: groupId,
        question_number: questionData.question_number,
        content: questionData.content,
        question_type: questionData.question_type as any,
        image_url: questionImageUrl,
        created_at: new Date(),
        updated_at: new Date()
      }, { transaction });

      questionMap.set(`${partNumber}:${questionData.question_number}`, question.id);

      // Add Vietnamese translation if exists
      if (questionData.vietnamese_translation) {
        await Translation.create({
          content_type: 'question',
          content_id: question.id,
          vietnamese_text: questionData.vietnamese_translation,
          created_at: new Date(),
          updated_at: new Date()
        }, { transaction });
      }
    }

    // 4. Create answers (only if provided)
    if (Array.isArray(examData.answers) && examData.answers.length > 0) {
      for (const answerData of examData.answers) {
        const questionId = questionMap.get(`${answerData.part_number}:${answerData.question_number}`);
        if (!questionId) continue;

        const answer = await Answer.create({
          question_id: questionId,
          content: answerData.content,
          is_correct: answerData.is_correct,
          explanation: answerData.explanation || '',
          created_at: new Date()
        }, { transaction });

        // Add Vietnamese translation if exists
        if (answerData.vietnamese_translation) {
          await Translation.create({
            content_type: 'answer',
            content_id: answer.id,
            vietnamese_text: answerData.vietnamese_translation,
            created_at: new Date(),
            updated_at: new Date()
          }, { transaction });
        }
      }
    }

    await transaction.commit();

    return {
      examId,
      summary: {
        examTitle: examData.exam.title,
        partsCount: examData.parts.length,
        questionsCount: examData.questions.length,
        answersCount: Array.isArray(examData.answers) ? examData.answers.length : 0,
        audioFilesProcessed: audioFileIndex,
        groupImagesProcessed: groupImageFiles.length,
        questionImagesProcessed: questionImageFiles.length,
        groupsWithImages: groupImageMap.size,
        questionsWithImages: questionImageMap.size
      }
    };

  } catch (error) {
    await transaction.rollback();
    throw error;
  }
}

// Add part to existing exam
export async function addPartToExam(
  examId: number,
  partData: PartData,
  audioFile?: Express.Multer.File,
  questionImages?: Express.Multer.File[]
): Promise<{ partId: number; summary: any }> {
  const transaction = await sequelize.transaction();
  
  try {
    // 1. Check if exam exists
    const exam = await Exam.findByPk(examId);
    if (!exam) {
      throw new Error('Exam not found');
    }
    const examFolderName = `${exam.title.toLowerCase().replace(/\s+/g, '_')}_${exam.year_of_release}`;

    // 2. Create part
    const part = await Part.create({
      part_number: partData.part_number,
      title: partData.title,
      description: `Part ${partData.part_number}`,
      instruction: partData.instruction,
      difficulty_level: partData.difficulty_level as 'easy' | 'medium' | 'hard',
      time_limit: partData.time_limit,
      created_at: new Date(),
      updated_at: new Date()
    }, { transaction });

    // 3. Create exam-part relationship
    await ExamPart.create({
      exam_id: examId,
      part_id: part.id,
      order_index: partData.part_number
    }, { transaction });

    // 4. Handle audio file for listening parts
    if (audioFile && [1, 2, 3, 4].includes(partData.part_number)) {
      const filePath = await saveAudioFile(audioFile, examFolderName, partData.part_number);
      const duration = getAudioDuration(audioFile);

      await AudioFile.create({
        part_id: part.id,
        file_path: filePath,
        duration: duration,
        transcript: '',
        created_at: new Date()
      }, { transaction });
    }

    // 5. Create question group
    const group = await QuestionGroup.create({
      part_id: part.id,
      content: `Question group for part ${partData.part_number}`,
      created_at: new Date()
    }, { transaction });

    // 6. Create questions and answers
    for (let i = 0; i < partData.questions.length; i++) {
      const questionData = partData.questions[i];
      const questionNumber = i + 1;

      // Create question
      const question = await Question.create({
        part_id: part.id,
        group_id: group.id,
        question_number: questionNumber,
        content: questionData.question,
        question_type: 'multiple_choice', // Default, can be determined from answers
        image_url: '',
        created_at: new Date(),
        updated_at: new Date()
      }, { transaction });

      // Handle question image if exists
      if (questionImages) {
        const imageFile = questionImages.find(img => 
          img.originalname.includes(`question_${questionNumber}`) || 
          img.originalname.includes(`q${questionNumber}`)
        );
        
        if (imageFile) {
          const imagePath = await saveQuestionImage(imageFile, examId, partData.part_number, questionNumber);
          await question.update({ image_url: imagePath }, { transaction });
        }
      }

      // Add Vietnamese translation for question
      if (questionData.vietnamese_translation) {
        await Translation.create({
          content_type: 'question',
          content_id: question.id,
          vietnamese_text: questionData.vietnamese_translation,
          created_at: new Date(),
          updated_at: new Date()
        }, { transaction });
      }

      // Create answers
      for (const answerData of questionData.answers) {
        const answer = await Answer.create({
          question_id: question.id,
          content: answerData.content,
          is_correct: answerData.is_correct,
          explanation: answerData.explanation || '',
          created_at: new Date()
        }, { transaction });

        // Add Vietnamese translation for answer
        if (answerData.vietnamese_translation) {
          await Translation.create({
            content_type: 'answer',
            content_id: answer.id,
            vietnamese_text: answerData.vietnamese_translation,
            created_at: new Date(),
            updated_at: new Date()
          }, { transaction });
        }
      }
    }

    await transaction.commit();

    return {
      partId: part.id,
      summary: {
        examId,
        partNumber: partData.part_number,
        partTitle: partData.title,
        questionsCount: partData.questions.length,
        totalAnswers: partData.questions.reduce((total, q) => total + q.answers.length, 0),
        hasAudio: !!audioFile,
        questionImagesCount: questionImages?.length || 0
      }
    };

  } catch (error) {
    await transaction.rollback();
    throw error;
  }
} 