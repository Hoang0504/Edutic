import type { NextApiRequest, NextApiResponse } from "next";
import multer from "multer";
import { withErrorHandler } from "@/lib/withErrorHandler";
import { createExamWithData } from "@/lib/examService";

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit
  },
});

// Extend NextApiRequest to include files
interface MulterRequest extends NextApiRequest {
  files?: Express.Multer.File[];
}

async function handler(req: MulterRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      data: { message: "Method not allowed" }
    });
  }

  try {
    // Parse form data using multer for all files
    await new Promise<void>((resolve, reject) => {
      upload.any()(req as any, res as any, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });

    // Get parsed exam data from form
    const examData = JSON.parse(req.body.data || '{}');
    const allFiles = req.files || [];

    // Separate files by type
    const audioFiles = allFiles.filter(file => file.fieldname === 'audioFiles');
    const groupImageFiles = allFiles.filter(file => file.fieldname.startsWith('groupImage_'));
    const questionImageFiles = allFiles.filter(file => file.fieldname.startsWith('questionImage_'));

    // Log received data for debugging
    console.log("=== EXAM IMPORT DATA ===");
    console.log("Exam info:", examData.exam);
    console.log("Parts count:", examData.parts?.length || 0);
    console.log("Questions count:", examData.questions?.length || 0);
    console.log("Answers count:", examData.answers?.length || 0);
    console.log("Audio files count:", audioFiles.length);
    console.log("Group image files count:", groupImageFiles.length);
    console.log("Question image files count:", questionImageFiles.length);
    console.log("Parts details:", examData.parts?.map((p: any) => ({
      part_number: p.part_number,
      title: p.title,
      type: p.type
    })));
    
    // Log each file info
    audioFiles.forEach((file, index) => {
      console.log(`Audio file ${index + 1}:`, {
        originalname: file.originalname,
        size: file.size,
        mimetype: file.mimetype
      });
    });

    groupImageFiles.forEach((file, index) => {
      console.log(`Group image file ${index + 1}:`, {
        fieldname: file.fieldname,
        originalname: file.originalname,
        size: file.size,
        mimetype: file.mimetype
      });
    });

    questionImageFiles.forEach((file, index) => {
      console.log(`Question image file ${index + 1}:`, {
        fieldname: file.fieldname,
        originalname: file.originalname,
        size: file.size,
        mimetype: file.mimetype
      });
    });

    // Validate required fields
    if (!examData.exam || !examData.parts || !examData.questions || !examData.answers) {
      return res.status(400).json({
        success: false,
        data: { message: "Missing required exam data sections" }
      });
    }

    // Validate parts that require audio files
    const listeningParts = examData.parts.filter((part: any) => [1, 2, 3, 4].includes(part.part_number));
    
    // Only require audio for full_toeic exam type
    const isFullToeic = examData.exam.exam_type === 'full_toeic';
    
    if (isFullToeic && listeningParts.length > 0) {
      // For TOEIC exams, validate that we have audio files for listening parts
      if (audioFiles.length < listeningParts.length) {
        return res.status(400).json({
          success: false,
          data: { 
            message: `TOEIC exam requires ${listeningParts.length} audio files for listening parts (Part 1-4), but only ${audioFiles.length} were provided` 
          }
        });
      }

      // Validate audio file types
      for (const audioFile of audioFiles) {
        if (!audioFile.mimetype.startsWith('audio/')) {
          return res.status(400).json({
            success: false,
            data: { message: `File "${audioFile.originalname}" is not a valid audio file` }
          });
        }
      }
    } else if (examData.exam.exam_type === 'speaking' || examData.exam.exam_type === 'writing') {
      // Speaking and Writing exams don't require audio files
      console.log(`${examData.exam.exam_type} exam detected - no audio files required`);
    }

    // Validate exam data structure
    if (!examData.exam.title || !examData.exam.description) {
      return res.status(400).json({
        success: false,
        data: { message: "Exam title and description are required" }
      });
    }

    // Set default values for missing fields
    const processedExamData = {
      ...examData,
      exam: {
        title: examData.exam.title,
        type: examData.exam.type || 'full_test',
        description: examData.exam.description,
        estimated_time: examData.exam.estimated_time || 120,
        year_of_release: examData.exam.year_of_release || new Date().getFullYear()
      }
    };

    // Create exam with all data in database
    console.log("💾 Saving to database...");
    const result = await createExamWithData(processedExamData, audioFiles, groupImageFiles, questionImageFiles);

    return res.status(200).json({
      success: true,
      data: {
        message: "Đề thi đã được tạo thành công",
        examId: result.examId,
        summary: result.summary
      }
    });

  } catch (error) {
    console.error("Import error:", error);
    
    // Return more specific error messages
    if (error instanceof Error) {
      return res.status(500).json({
        success: false,
        data: { 
          message: "Lỗi khi lưu đề thi vào database",
          error: error.message 
        }
      });
    }
    
    return res.status(500).json({
      success: false,
      data: { message: "Lỗi xử lý dữ liệu import" }
    });
  }
}

export default withErrorHandler(handler, "Có lỗi xảy ra trong quá trình import đề thi");

// Disable Next.js default body parser for file uploads
export const config = {
  api: {
    bodyParser: false,
  },
}; 