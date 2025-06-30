import { NextApiRequest, NextApiResponse } from "next";
import { User } from "@/models/User";
import { withErrorHandler } from "@/lib/withErrorHandler";
import sequelize from "@/lib/db";
import { normalizeUser } from "@/utils/normalize";
import bcrypt from "bcryptjs";
import fs from "fs";
import path from "path";
import multer from "multer";

type UpdateUserPayload = {
  email?: string;
  name?: string;
  avatar?: string;
  role?: "student" | "admin";
  password_hash?: string;
};



interface NextApiRequestWithFiles extends NextApiRequest {
  file?: Express.Multer.File;
  files?: {
    [fieldname: string]: Express.Multer.File[];
  };
}

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

async function handler(req: NextApiRequestWithFiles, res: NextApiResponse): Promise<void | NextApiResponse<unknown>> {
  await sequelize.authenticate();

  const { id } = req.query;

  if (!id || isNaN(+id)) return res.status(400).json({ message: "Invalid ID" });

  if (req.method === "GET") {
    const user = await User.findByPk(id.toString());
    if (!user) return res.status(404).json({ message: "User not found" });
    return res.status(200).json(normalizeUser(user));
  }

  if (req.method === "PUT") {
    // Xử lý file upload
    await new Promise<void>((resolve, reject) => {
      uploadMiddleware(
        req as any,
        res as any,
        (err: unknown) => {
          if (err) {
            console.error("Multer error:", err);
            return reject(err);
          }
          resolve();
        }
      );
    });

    const user = await User.findByPk(id.toString());
    if (!user) return res.status(404).json({ message: "User not found" });

    const { email, name, role, password } = req.body;
    const avatarFile = req.file;
    const updateData: UpdateUserPayload = {};

    if (email) {
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser && existingUser.id !== user.id) {
        return res.status(409).json({ message: "Email already in use" });
      }
      updateData.email = email;
    }
    if (name) updateData.name = name;
    if (role) updateData.role = role;
    if (password) {
      updateData.password_hash = await bcrypt.hash(password, 10);
    }
    if (avatarFile) {
      updateData.avatar = `/uploads/images/${avatarFile.filename}`;
    }

    await user.update(updateData);
    return res.status(200).json(normalizeUser(user));
  }

  if (req.method === "DELETE") {
    const user = await User.findByPk(id.toString());
    if (!user) return res.status(404).json({ message: "User not found" });

    await user.destroy();
    return res.status(204).json({ message: "User deleted" });
  }

  res.status(405).end();
}

export const config = {
  api: {
    bodyParser: false, // Tắt bodyParser để dùng multer
  },
};

export default withErrorHandler(handler, "Failed to handle user request");