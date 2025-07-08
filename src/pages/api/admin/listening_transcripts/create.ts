import { NextApiRequest, NextApiResponse } from "next";
import sequelize from "@/lib/db";
import { AudioFile } from "@/models/AudioFile";
import { ListeningTranscript } from "@/models/ListeningTranscript";
import { withErrorHandler } from "@/lib/withErrorHandler";
import fs from "fs";
import path from "path";
import { promisify } from "util";

const writeFileAsync = promisify(fs.writeFile);

async function handler(req: NextApiRequest, res: NextApiResponse): Promise<void> {
  await sequelize.authenticate();
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const formData = req.body as any; // Giả định formData được gửi từ client
  const audioFile = formData.get("file") as File;
  const initialTranscript = formData.get("transcript") as string;

  if (!audioFile || !initialTranscript) {
    res.status(400).json({ error: "Invalid file or transcript data" });
    return;
  }

  const uploadDir = path.join(process.cwd(), "public/uploads/audio");
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const fileName = `${Date.now()}-${audioFile.name}`;
  const filePath = path.join(uploadDir, fileName);

  try {
    // Lưu file audio vào thư mục public/uploads/audio
    const arrayBuffer = await audioFile.arrayBuffer();
    await writeFileAsync(filePath, Buffer.from(arrayBuffer));

    // Tạo bản ghi AudioFile
    const newAudioFile = await AudioFile.create({
      part_id: 1, // Giả định part_id, cần điều chỉnh logic thực tế
      file_path: `/uploads/audio/${fileName}`, // Cập nhật đường dẫn
      duration: 0, // Cần tính toán duration từ file audio
      transcript: initialTranscript,
      created_at: new Date(),
    });

    // Tạo bản ghi ListeningTranscript cho level 'easy' ban đầu
    await ListeningTranscript.create({
      audio_file_id: newAudioFile.id,
      level: "easy",
      blanks: {},
      created_at: new Date(),
    });

    res.status(201).json({
      message: "Audio file and transcript created successfully",
      id: newAudioFile.id,
    });
  } catch (error) {
    console.error("Error creating audio file and transcript:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

export default withErrorHandler(handler, "Failed to create audio file and transcript");

// Disable body parsing to handle FormData correctly
export const config = {
  api: {
    bodyParser: false,
  },
};