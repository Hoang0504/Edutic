import { NextApiRequest, NextApiResponse } from "next";

import sequelize from "@/lib/db";
import { Vocabulary } from "@/models/Vocabulary";
import { normalizeVocabulary } from "@/utils/normalize";
import { withErrorHandler } from "@/lib/withErrorHandler";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  if (!id || isNaN(+id)) return res.status(400).json({ message: "Invalid ID" });

  await sequelize.authenticate();

  const vocab = await Vocabulary.findByPk(+id);
  if (!vocab) return res.status(404).json({ message: "Vocabulary not found" });

  if (req.method === "GET") {
    const normalized = normalizeVocabulary(vocab);

    return res.status(200).json(normalized);
  }

  if (req.method === "PUT") {
  const {
    word,
    image_url,
    pronunciation,
    speech_audio_url,
    meaning,
    example,
    context,
    status,
  } = req.body;

  // Chỉ lấy các trường được gửi lên
  type UpdateData = {
    word?: string;
    image_url?: string;
    pronunciation?: string;
    speech_audio_url?: string;
    meaning?: string;
    example?: string;
    context?: string;
    status?: "pending" | "approved" | "rejected";
    updated_at?: Date;
  };
  const updateData: UpdateData = {};
  if (word !== undefined) updateData.word = word;
  if (image_url !== undefined) updateData.image_url = image_url;
  if (pronunciation !== undefined) updateData.pronunciation = pronunciation;
  if (speech_audio_url !== undefined) updateData.speech_audio_url = speech_audio_url;
  if (meaning !== undefined) updateData.meaning = meaning;
  if (example !== undefined) updateData.example = example;
  if (context !== undefined) updateData.context = context;
  if (status !== undefined) {
    const allowedStatus = ["pending", "approved", "rejected"];
    if (!allowedStatus.includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }
    updateData.status = status;
  }

  // Cập nhật updated_at
  updateData.updated_at = new Date();

  await vocab.update(updateData);

  const normalized = normalizeVocabulary(vocab);
  return res.status(200).json(normalized);
}

  if (req.method === "DELETE") {
    await vocab.destroy();
    return res.status(204).json({ message: "Vocabulary deleted successfully" });
  }

  return res.status(405).end();
}

export default withErrorHandler(handler, "Failed to handle vocabulary request");
