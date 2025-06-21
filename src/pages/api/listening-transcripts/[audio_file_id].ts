import { NextApiRequest, NextApiResponse } from "next";

import sequelize from "@/lib/db";
import { AudioFile } from "@/models/AudioFile";
import { Translation } from "@/models/Translation";
import { withErrorHandler } from "@/lib/withErrorHandler";
import { ListeningTranscript } from "@/models/ListeningTranscript";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  await sequelize.authenticate();

  const audio_file_id = Number(req.query.audio_file_id);

  if (isNaN(audio_file_id)) {
    return res.status(400).json({ message: "Invalid audio_file_id" });
  }

  const audio = await AudioFile.findByPk(audio_file_id);
  if (!audio) {
    return res.status(404).json({ message: "Audio file not found" });
  }

  const [easy, medium, hard] = await Promise.all([
    ListeningTranscript.findOne({ where: { audio_file_id, level: "easy" } }),
    ListeningTranscript.findOne({ where: { audio_file_id, level: "medium" } }),
    ListeningTranscript.findOne({ where: { audio_file_id, level: "hard" } }),
  ]);

  const translation = await Translation.findOne({
    where: {
      content_type: "audio_transcript",
      content_id: audio_file_id,
    },
  });

  const result = {
    audio_path: audio.file_path,
    transcript: audio.transcript,
    vietnameseTranscript: translation?.vietnamese_text || null,
    level: {
      easy: easy?.blanks || [],
      medium: medium?.blanks || [],
      hard: hard?.blanks || [],
    },
  };

  return res.status(200).json(result);
}

export default withErrorHandler(
  handler,
  "Failed to fetch listening transcripts"
);
