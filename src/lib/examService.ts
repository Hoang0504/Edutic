import sequelize from '@/lib/db';
import { Exam } from '@/models/Exam';
import { Part } from '@/models/Part';
import { Question } from '@/models/Question';
import { Answer } from '@/models/Answer';
import { AudioFile } from '@/models/AudioFile';
import { Translation } from '@/models/Translation';
import { QuestionGroup } from '@/models/QuestionGroup';
import { ExamPart } from '@/models/ExamPart';
import { saveAudioFile, saveQuestionImage, getAudioDuration } from './fileUpload';

interface ExamData {
  exam: {
    title: string;
    type: string;
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
  }>;
  answers: Array<{
    part_number: number;
    question_number: number;
    content: string;
    is_correct: boolean;
    explanation?: string;
    vietnamese_translation?: string;
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
  audioFiles: Express.Multer.File[]
): Promise<{ examId: number; summary: any }> {
  const transaction = await sequelize.transaction();
  
  try {
    // 1. Create exam
    const exam = await Exam.create({
      title: examData.exam.title,
      type: examData.exam.type as 'random' | 'full_test',
      description: examData.exam.description,
      estimated_time: examData.exam.estimated_time,
      year_of_release: examData.exam.year_of_release,
      is_published: false,
      created_at: new Date(),
      updated_at: new Date()
    }, { transaction });

    const examId = exam.id;

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
      if (partData.type === 'listening' && audioFiles[audioFileIndex]) {
        const audioFile = audioFiles[audioFileIndex];
        const filePath = await saveAudioFile(audioFile, examId, partData.part_number);
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

    // 3. Create question groups and questions
    const questionMap = new Map<string, number>(); // part_number:question_number -> question_id

    for (const partNumber of [...new Set(examData.questions.map(q => q.part_number))]) {
      const partId = partMap.get(partNumber);
      if (!partId) continue;

      // Create a default question group for each part
      const group = await QuestionGroup.create({
        part_id: partId,
        content: `Question group for part ${partNumber}`,
        created_at: new Date()
      }, { transaction });

      // Create questions for this part
      const partQuestions = examData.questions.filter(q => q.part_number === partNumber);
      
      for (const questionData of partQuestions) {
        const question = await Question.create({
          part_id: partId,
          group_id: group.id,
          question_number: questionData.question_number,
          content: questionData.content,
          question_type: questionData.question_type as any,
          image_url: '', // Will be set when images are uploaded
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
    }

    // 4. Create answers
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

    await transaction.commit();

    return {
      examId,
      summary: {
        examTitle: examData.exam.title,
        partsCount: examData.parts.length,
        questionsCount: examData.questions.length,
        answersCount: examData.answers.length,
        audioFilesProcessed: audioFileIndex
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
      const filePath = await saveAudioFile(audioFile, examId, partData.part_number);
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