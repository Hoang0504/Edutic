import { NextApiRequest, NextApiResponse } from "next";

import sequelize from "@/lib/db";

import { withErrorHandler } from "@/lib/withErrorHandler";
import { AudioFile } from "@/models/AudioFile";
import { Part } from "@/models/Part";
import { ExamPart } from "@/models/ExamPart";
import { Exam } from "@/models/Exam";
import { ListeningTranscript } from "@/models/ListeningTranscript";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    await sequelize.authenticate();

    const audioFiles = await AudioFile.findAll({
      include: [
        {
          model: ListeningTranscript,
          as: "listeningTranscripts",
          required: true,
        },
        {
          model: Part,
          as: "part",
          attributes: ["part_number", "title"],
          include: [
            {
              model: ExamPart,
              as: "examParts",
              attributes: ["exam_id"],
              include: [
                {
                  model: Exam,
                  as: "exam",
                  attributes: ["title"],
                },
              ],
            },
          ],
        },
      ],
      attributes: ["part_id"],
    });

    const output = audioFiles.map((af) => ({
      title: `Audio part ${af.part.part_number} - ${af.part.examParts[0].exam.title}`,
    }));

    return res.status(200).json(output);
  }

  res.status(405).json({ error: "Method not allowed" });
}

export default withErrorHandler(handler, "Error fetching exams");
