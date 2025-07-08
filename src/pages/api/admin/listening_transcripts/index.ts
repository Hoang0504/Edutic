import { NextApiRequest, NextApiResponse } from "next";
import sequelize from "@/lib/db";
import { AudioFile } from "@/models/AudioFile";
import { ListeningTranscript } from "@/models/ListeningTranscript";
import { Translation } from "@/models/Translation";
import { withErrorHandler } from "@/lib/withErrorHandler";

async function handler(req: NextApiRequest, res: NextApiResponse): Promise<void> {
  await sequelize.authenticate();

  if (req.method === 'GET') {
    const { page = 1, limit = 10 } = req.query;
    const offset = (Number(page) - 1) * Number(limit);

    try {
      console.log("Fetching audio files with page:", page, "limit:", limit);
      const audioFiles = await AudioFile.findAll({
        include: [
          {
            model: ListeningTranscript,
            attributes: ['id', 'audio_file_id', 'level', 'blanks'],
            as: "listeningTranscripts",
          },
          {
            model: Translation,
            attributes: ['vietnamese_text'],
            where: { content_type: 'transcript' },
            required: false,
          },
        ],
        limit: Number(limit),
        offset: offset,
      });

      console.log("Raw audioFiles data:", audioFiles);
      const responseData = audioFiles.map(file => {
        const translation = file.translation; 
        return {
          id: file.id,
          file_path: file.file_path,
          duration: file.duration,
          transcript: file.transcript,
          vietnameseTranslation: translation ? translation.vietnamese_text : null,
          created_at: file.created_at,
          listeningTranscripts: file.listeningTranscripts.map(transcript => ({
            id: transcript.id,
            audio_file_id: transcript.audio_file_id,
            level: transcript.level,
            blanks: transcript.blanks,
          })),
        };
      });

      console.log("Processed responseData:", responseData);
      res.status(200).json({ data: responseData, total: await AudioFile.count() });
    } catch (error) {
      console.error("Error fetching audio files:", error);
      const errorMessage = error instanceof Error ? error.message : String(error);
      res.status(500).json({ error: 'Internal Server Error', details: errorMessage });
    }
  } else {
    res.status(405).end();
  }
}

export default withErrorHandler(handler, "Failed to fetch listening transcripts");