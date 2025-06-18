import type { NextApiRequest, NextApiResponse } from "next";
import multer from "multer";
import { withErrorHandler } from "@/lib/withErrorHandler";

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit
  },
});

// Extend NextApiRequest to include files
interface MulterRequest extends NextApiRequest {
  files?: { [fieldname: string]: Express.Multer.File[] };
  query: {
    examId: string;
  };
}

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      data: { message: "Method not allowed" }
    });
  }

  const { examId } = req.query;

  if (!examId || typeof examId !== 'string') {
    return res.status(400).json({
      success: false,
      data: { message: "Thiếu examId" }
    });
  }

  try {
    // Parse form data using multer for audio files and question images
    await new Promise<void>((resolve, reject) => {
      upload.fields([
        { name: 'audioFile', maxCount: 1 },
        { name: 'questionImages', maxCount: 50 } // Max 50 question images per part
      ])(req as any, res as any, (err: any) => {
        if (err) reject(err);
        else resolve();
      });
    });

    // Get parsed part data from form
    const partData = JSON.parse(req.body.partData || '{}');
    const multerReq = req as MulterRequest;
    const files = multerReq.files || {};
    const audioFile = files.audioFile?.[0];
    const questionImages = files.questionImages || [];

    // Log received data for testing
    console.log("=== PART SUBMISSION DATA ===");
    console.log("Exam ID:", examId);
    console.log("Part data:", {
      title: partData.title,
      part_number: partData.part_number,
      questions_count: partData.questions?.length || 0,
      translations_count: partData.translations?.length || 0
    });
    console.log("Audio file:", audioFile ? {
      originalname: audioFile.originalname,
      size: audioFile.size,
      mimetype: audioFile.mimetype
    } : 'None');
    console.log("Question images count:", questionImages.length);

    // Validate required fields
    if (!partData.title || !partData.part_number || !partData.questions) {
      return res.status(400).json({
        success: false,
        data: { message: "Missing required part data" }
      });
    }

    // Validate part number
    if (partData.part_number < 1 || partData.part_number > 7) {
      return res.status(400).json({
        success: false,
        data: { message: "Part number must be between 1 and 7" }
      });
    }

    // Validate questions structure
    if (!Array.isArray(partData.questions) || partData.questions.length === 0) {
      return res.status(400).json({
        success: false,
        data: { message: "Part must have at least one question" }
      });
    }

    // Determine exam type based on data
    const isPracticeType = partData.questions.every((q: any) => !q.answers || q.answers.length === 0);
    const isFullToeicType = partData.part_number >= 1 && partData.part_number <= 7 && 
                           partData.questions.some((q: any) => q.answers && q.answers.length >= 4);

    // Validate based on exam type
    if (isPracticeType) {
      // For practice types (speaking/writing), questions don't need answers
      console.log("Detected practice type - no answer validation required");
    } else {
      // For full TOEIC, validate each question has answers
      for (const question of partData.questions) {
        if (!Array.isArray(question.answers) || question.answers.length === 0) {
          return res.status(400).json({
            success: false,
            data: { message: "TOEIC exam questions must have answers" }
          });
        }

        // Check if at least one answer is correct for TOEIC
        const hasCorrectAnswer = question.answers.some((answer: any) => answer.is_correct === true);
        if (!hasCorrectAnswer) {
          return res.status(400).json({
            success: false,
            data: { message: `Question "${question.question}" must have at least one correct answer` }
          });
        }
      }
    }

    // Validate listening parts have audio (only for TOEIC)
    const isListeningPart = [1, 2, 3, 4].includes(partData.part_number);
    if (isListeningPart && !isPracticeType && !audioFile) {
      return res.status(400).json({
        success: false,
        data: { message: `Part ${partData.part_number} is listening part and requires audio file` }
      });
    }

    // Validate audio file type
    if (audioFile && !audioFile.mimetype.startsWith('audio/')) {
      return res.status(400).json({
        success: false,
        data: { message: "Audio file must be a valid audio format" }
      });
    }

    // Validate image files
    for (const imageFile of questionImages) {
      if (!imageFile.mimetype.startsWith('image/')) {
        return res.status(400).json({
          success: false,
          data: { message: `File ${imageFile.originalname} is not a valid image format` }
        });
      }
    }

    // TODO: Process and save to database
    // 1. Save exam part data
    // 2. Save audio file if exists
    // 3. Save question images if exist
    // 4. Save questions and answers
    // 5. Save translations

    // For now, just return success with summary
    return res.status(200).json({
      success: true,
      data: {
        message: `Đã nhận dữ liệu Part ${partData.part_number} thành công`,
        examType: isPracticeType ? 'practice' : 'toeic',
        summary: {
          examId: examId,
          partNumber: partData.part_number,
          partTitle: partData.title,
          questionsCount: partData.questions.length,
          translationsCount: partData.translations?.length || 0,
          hasAudio: !!audioFile,
          questionImagesCount: questionImages.length,
          totalAnswers: partData.questions.reduce((total: number, q: any) => total + (q.answers?.length || 0), 0)
        }
      }
    });

  } catch (error) {
    console.error("Part submission error:", error);
    return res.status(500).json({
      success: false,
      data: { message: "Lỗi xử lý dữ liệu part" }
    });
  }
}

export default withErrorHandler(handler, "Có lỗi xảy ra trong quá trình gửi part");

// Disable Next.js default body parser for file uploads
export const config = {
  api: {
    bodyParser: false,
  },
}; 