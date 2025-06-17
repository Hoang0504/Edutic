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
    // Parse form data using multer
    await new Promise<void>((resolve, reject) => {
      upload.array('audioFiles')(req as any, res as any, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });

    // Get parsed exam data from form
    const examData = JSON.parse(req.body.data || '{}');
    const audioFiles = req.files || [];

    // Log received data for testing
    console.log("=== EXAM IMPORT DATA ===");
    console.log("Exam info:", examData.exam);
    console.log("Parts count:", examData.parts?.length || 0);
    console.log("Questions count:", examData.questions?.length || 0);
    console.log("Answers count:", examData.answers?.length || 0);
    console.log("Audio files count:", audioFiles.length);
    
    // Log each audio file info
    audioFiles.forEach((file, index) => {
      console.log(`Audio file ${index + 1}:`, {
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
    const listeningParts = examData.parts.filter((part: any) => part.type === 'listening');
    if (listeningParts.length > audioFiles.length) {
      return res.status(400).json({
        success: false,
        data: { 
          message: `Thiếu file audio. Cần ${listeningParts.length} file cho các part listening nhưng chỉ nhận được ${audioFiles.length} file.`
        }
      });
    }

    // TODO: Process and save to database
    // For now, just return success with the data we received

    return res.status(200).json({
      success: true,
      data: {
        message: "Đã nhận dữ liệu thành công",
        summary: {
          examTitle: examData.exam.title,
          partsCount: examData.parts.length,
          questionsCount: examData.questions.length,
          answersCount: examData.answers.length,
          audioFilesCount: audioFiles.length,
          listeningPartsCount: listeningParts.length
        }
      }
    });

  } catch (error) {
    console.error("Import error:", error);
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