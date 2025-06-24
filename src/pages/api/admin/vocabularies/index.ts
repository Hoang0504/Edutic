import { Op } from "sequelize";
import { NextApiRequest, NextApiResponse } from "next";
import multer from "multer";
import fs from "fs";
import path from "path";
import sequelize from "@/lib/db";
import { Vocabulary } from "@/models/Vocabulary";
import { normalizeVocabulary } from "@/utils/normalize";
import { withErrorHandler } from "@/lib/withErrorHandler";

// Định nghĩa kiểu mở rộng cho NextApiRequest
interface MulterFile extends Express.Multer.File {
  // Có thể thêm các thuộc tính tùy chỉnh nếu cần
}

interface NextApiRequestWithFiles extends NextApiRequest {
  files?: {
    [fieldname: string]: MulterFile[];
  };
}

// Cấu hình Multer
const uploadMiddleware = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      const uploadDir = path.join(process.cwd(), "public/uploads");
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      cb(null, uploadDir);
    },
    filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
  }),
  limits: { fileSize: 10 * 1024 * 1024 }, // Giới hạn 10MB
}).fields([{ name: "image", maxCount: 1 }, { name: "audio", maxCount: 1 }]);

async function handler(req: NextApiRequestWithFiles, res: NextApiResponse) {
  await sequelize.authenticate();

  if (req.method === "GET") {
    const { page = 1, limit = 10, word, context, status } = req.query;

    const whereClause: Record<string, unknown> = {};

    if (word) {
      whereClause.word = { [Op.like]: `%${word.toString()}%` };
    }

    if (context) {
      whereClause.context = { [Op.like]: `%${context.toString()}%` };
    }

    if (status) {
      whereClause.status = status.toString();
    }

    const vocabularies = await Vocabulary.findAll({
      where: whereClause,
      limit: +limit,
      offset: (+page - 1) * +limit,
      order: [["created_at", "DESC"]],
    });

    const totalVocabularies = await Vocabulary.count({ where: whereClause });
    const totalPages = Math.ceil(totalVocabularies / +limit);

    res.status(200).json({
      data: vocabularies.map(normalizeVocabulary),
      currentPage: +page,
      totalPages,
      totalItems: totalVocabularies,
    });
  }

  if (req.method === "POST") {
    // Xử lý file upload
    await new Promise((resolve, reject) => {
      uploadMiddleware(req as any, res as any, (err) => {
        if (err) {
          console.error("Multer error:", err);
          return reject(err);
        }
        resolve(null);
      });
    });

    const { word, pronunciation, meaning, example, context, status = "pending" } = req.body;
    const imageFile = req.files?.image?.[0];
    const audioFile = req.files?.audio?.[0];

    console.log("Received data:", { word, pronunciation, meaning, example, context, status, imageFile, audioFile }); // Debug

    if (!word || !example) {
      return res.status(400).json({ message: "Word and example are required" });
    }

    const existing = await Vocabulary.findOne({ where: { word, example } });
    if (existing) {
      return res.status(200).json({ message: "This word + example already exists" });
    }

    const imageUrl = imageFile ? `/uploads/${imageFile.filename}` : null;
    const audioUrl = audioFile ? `/uploads/${audioFile.filename}` : null;

    const vocab = await Vocabulary.create({
      word,
      image_url: imageUrl,
      pronunciation: pronunciation || null,
      speech_audio_url: audioUrl,
      meaning: meaning || null,
      example,
      context: context || "Business",
      status,
      created_at: new Date(),
      updated_at: new Date(),
    });

    const normalized = normalizeVocabulary(vocab);
    return res.status(201).json(normalized);
  }

  return res.status(405).end();
}

export const config = {
  api: {
    bodyParser: false, // Tắt bodyParser để dùng multer
  },
};

export default withErrorHandler(handler, "Cannot get vocabularies list");