import sequelize from "@/lib/db";
import { withErrorHandler } from "@/lib/withErrorHandler";
import { AudioFile } from "@/models/AudioFile";
import { ListeningTranscript } from "@/models/ListeningTranscript";
import { NextApiRequest, NextApiResponse } from "next";

type BlankItem = {
  index: number;
  position: number;
  length: number;
};

async function handler(req: NextApiRequest, res: NextApiResponse) {
  await sequelize.authenticate();

  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { audio_file_id, level, blanks } = req.body;

  if (!audio_file_id || !Array.isArray(blanks)) {
    return res
      .status(400)
      .json({ message: "audio_file_id and blanks[] are required" });
  }

  if (!["easy", "medium", "hard"].includes(level)) {
    return res.status(400).json({ message: "Invalid level value" });
  }

  const isValidBlanks = (blanks as BlankItem[]).every(
    (item: BlankItem) =>
      typeof item.index === "number" &&
      typeof item.position === "number" &&
      typeof item.length === "number"
  );

  if (!isValidBlanks) {
    return res.status(400).json({ message: "Invalid blanks format" });
  }

  const audioFile = await AudioFile.findByPk(audio_file_id);
  if (!audioFile) {
    return res.status(404).json({ message: "Audio file not found" });
  }

  const transcript = await ListeningTranscript.create({
    audio_file_id,
    level,
    blanks,
  });

  return res.status(201).json({ message: "Transcript created", transcript });
}

export default withErrorHandler(
  handler,
  "Failed to create listening transcript"
);
