import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
import { NextApiRequest, NextApiResponse } from "next";
import multer from "multer";
import fs from "fs";
import path from "path";

import sequelize from "@/lib/db";
import { User } from "@/models/User";
import { normalizeUser } from "@/utils/normalize";
import { withErrorHandler } from "@/lib/withErrorHandler";

// Định nghĩa kiểu mở rộng cho NextApiRequest


interface NextApiRequestWithFiles extends NextApiRequest {
  file?: Express.Multer.File;
  files?: {
    [fieldname: string]: Express.Multer.File[];
  };
}

// Cấu hình Multer
const uploadMiddleware = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      const uploadDir = path.join(process.cwd(), "public/uploads/images");
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      cb(null, uploadDir);
    },
    filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
  }),
  limits: { fileSize: 10 * 1024 * 1024 }, // Giới hạn 10MB
}).single("avatar");

async function handler(req: NextApiRequestWithFiles, res: NextApiResponse): Promise<void> {
  if (req.method === "POST") {
    await sequelize.authenticate();

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

    const { email, password, role = "student" } = req.body;
    const avatarFile = req.file;

    if (!email || !password) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ message: "Email already in use" });
    }

    const password_hash = await bcrypt.hash(password, 10);
    const avatar = avatarFile ? `/uploads/images/${avatarFile.filename}` : null;

    const user = await User.create({
      email,
      avatar,
      password_hash,
      role,
      is_email_verified: true,
      auth_provider: "email",
      uuid: uuidv4(),
    });
    return res.status(201).json(normalizeUser(user));
  } else {
    res.status(405).end();
  }
}

export const config = {
  api: {
    bodyParser: false, // Tắt bodyParser để dùng multer
  },
};

export default withErrorHandler(handler, "Failed to create user");