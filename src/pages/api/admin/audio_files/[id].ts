import { NextApiRequest, NextApiResponse } from "next";
import sequelize from "@/lib/db";
import { AudioFile } from "@/models/AudioFile";
import { ListeningTranscript } from "@/models/ListeningTranscript";
import { Translation } from "@/models/Translation";
import { withErrorHandler } from "@/lib/withErrorHandler";
import fs from "fs";
import path from "path";
import { promisify } from "util";
import formidable from "formidable";

const writeFileAsync = promisify(fs.writeFile);

async function handler(req: NextApiRequest, res: NextApiResponse): Promise<void> {
  await sequelize.authenticate();
  const { id } = req.query;

  if (req.method === 'PUT') {
    if (req.headers['content-type']?.startsWith('multipart/form-data')) {
      // Xử lý cập nhật file audio với formidable
      const form = new formidable.IncomingForm({
        uploadDir: path.join(process.cwd(), "public/uploads/audio"),
        keepExtensions: true,
      });

      form.parse(req, async (err, fields, files) => {
        if (err) {
          console.error("Formidable error:", err);
          return res.status(500).json({ error: 'Internal Server Error', details: err.message });
        }

        let newAudioFile: formidable.File | undefined;
        if (Array.isArray(files.file)) {
          newAudioFile = files.file[0];
        } else if (files.file) {
          newAudioFile = files.file as formidable.File;
        }
        let fileName: string | undefined;
        if (Array.isArray(fields.fileName)) {
          fileName = fields.fileName[0];
        } else if (typeof fields.fileName === "string") {
          fileName = fields.fileName;
        } else {
          fileName = newAudioFile?.originalFilename ?? undefined;
        }

        if (newAudioFile) {
          try {
            const audioFile = await AudioFile.findByPk(Number(id));
            if (!audioFile) {
              return res.status(404).json({ error: 'Audio file not found' });
            }

            // Xóa file cũ
            const oldFilePath = path.join(process.cwd(), "public", audioFile.file_path.replace(/^\//, ""));
            if (fs.existsSync(oldFilePath)) {
              fs.unlinkSync(oldFilePath);
            }

            // Lưu file mới
            const newFileName = `${Date.now()}-${fileName}`;
            const uploadDir = path.join(process.cwd(), "public/uploads/audio");
            const newFilePath = path.join(uploadDir, newFileName);
            fs.renameSync((newAudioFile as formidable.File).filepath, newFilePath);

            // Cập nhật database
            await audioFile.update({
              file_path: `/uploads/audio/${newFileName}`,
            });

            res.status(200).json({ message: 'Audio file updated successfully' });
          } catch (error) {
            console.error("Error updating audio file (file):", error);
            const errorMessage = error instanceof Error ? error.message : String(error);
            res.status(500).json({ error: 'Internal Server Error', details: errorMessage });
          }
        }
      });
    } else {
      // Xử lý cập nhật vietnameseTranslation (lưu vào Translation)
      const { vietnameseTranslation } = req.body || {};
      console.log("Received vietnameseTranslation:", vietnameseTranslation);
      if (vietnameseTranslation === undefined) {
        return res.status(400).json({ error: 'vietnameseTranslation is required' });
      }
      try {
        const audioFile = await AudioFile.findByPk(Number(id));
        if (!audioFile) {
          return res.status(404).json({ error: 'Audio file not found' });
        }

        // Kiểm tra và cập nhật hoặc tạo bản dịch trong Translation
        let translation = await Translation.findOne({
          where: { content_type: 'transcript', content_id: audioFile.id },
        });
        if (translation) {
          await translation.update({ vietnamese_text: vietnameseTranslation, updated_at: new Date() });
        } else {
          await Translation.create({
            content_type: 'transcript',
            content_id: audioFile.id,
            vietnamese_text: vietnameseTranslation,
            created_at: new Date(),
            updated_at: new Date(),
          });
        }

        res.status(200).json({ message: 'Updated successfully' });
      } catch (error) {
        console.error("Error updating audio file (translation):", error);
         const errorMessage = error instanceof Error ? error.message : String(error);
            res.status(500).json({ error: 'Internal Server Error', details: errorMessage });
      }
    }
  } else if (req.method === 'DELETE') {
    try {
      const audioFile = await AudioFile.findByPk(Number(id));
      if (!audioFile) {
        return res.status(404).json({ error: 'Audio file not found' });
      }

      await ListeningTranscript.destroy({ where: { audio_file_id: Number(id) } });
      await Translation.destroy({ where: { content_type: 'transcript', content_id: Number(id) } });
      const filePath = path.join(process.cwd(), "public", audioFile.file_path.replace(/^\//, ""));
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
      await audioFile.destroy();

      res.status(200).json({ message: 'Audio file and related transcripts deleted successfully' });
    } catch (error) {
      console.error("Error deleting audio file:", error);
      const errorMessage = error instanceof Error ? error.message : String(error);
            res.status(500).json({ error: 'Internal Server Error', details: errorMessage });
    }
  } else {
    res.status(405).end();
  }
}

export default withErrorHandler(handler, "Failed to update or delete audio file");

export const config = {
  api: {
    bodyParser: true, // Bật bodyParser cho JSON
  },
};