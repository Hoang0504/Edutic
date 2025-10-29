import { NextApiRequest, NextApiResponse } from "next";
import sequelize from "@/lib/db";
import { Translation } from "@/models/Translation";
import { withErrorHandler } from "@/lib/withErrorHandler";

async function handler(req: NextApiRequest, res: NextApiResponse): Promise<void> {
  await sequelize.authenticate();
  const { id } = req.query; 
  if (req.method === 'PUT') {
    const { content_type, content_id, vietnamese_text, updated_at } = req.body;

    try {
      const existingTranslation = await Translation.findOne({
        where: { content_type, content_id },
      });

      if (existingTranslation) {
        await existingTranslation.update({
          vietnamese_text,
          updated_at: new Date(updated_at),
        });
        res.status(200).json({ message: 'Translation updated successfully' });
      } else {
        // Nếu không tồn tại, tạo mới (dùng POST thay vì PUT nếu muốn tránh)
        await Translation.create({
          content_type,
          content_id,
          vietnamese_text,
          created_at: new Date(),
          updated_at: new Date(updated_at),
        });
        res.status(201).json({ message: 'Translation created successfully' });
      }
    } catch (error) {
      console.error("Error updating translation:", error);
      const errorMessage = typeof error === "object" && error !== null && "message" in error ? (error as { message: string }).message : String(error);
      res.status(500).json({ error: 'Internal Server Error', details: errorMessage });
    }
  } else {
    res.status(405).end();
  }
}

export default withErrorHandler(handler, "Failed to update translation");