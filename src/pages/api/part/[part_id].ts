import { NextApiRequest, NextApiResponse } from "next";

import sequelize from "@/lib/db";

import { Part } from "@/models/Part";
import { Answer } from "@/models/Answer";
import { Question } from "@/models/Question";
import { AudioFile } from "@/models/AudioFile";
import { withErrorHandler } from "@/lib/withErrorHandler";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "GET") return res.status(405).end();

  const { part_id } = req.query;
  if (!part_id) return res.status(400).json({ message: "Missing part_id" });

  await sequelize.authenticate();

  const part = await Part.findByPk(part_id.toString(), {
    include: [
      {
        model: AudioFile,
        as: "audioFile", // alias nếu bạn có đặt
        attributes: ["file_path"], // hoặc các trường cần thiết như duration, transcript...
      },
    ],
  });
  if (!part) return res.status(404).json({ message: "Part not found" });

  const questions = await Question.findAll({
    where: { part_id },
    include: [
      {
        model: Answer,
        as: "answers",
        attributes: ["id", "content"],
      },
    ],
    order: [["question_number", "ASC"]],
  });

  const data = {
    part: {
      id: part.id,
      title: part.title,
      instructions: part.instruction,
      audio: part.audioFile?.file_path || null,
      time_limit: part.time_limit,
    },
    questions: questions.map((q) => ({
      id: q.id,
      question_number: q.question_number,
      content: q.content,
      image_url: q.image_url,
      question_type: q.question_type,
      answers: q.answers,
    })),
  };

  return res.status(200).json(data);
};

export default withErrorHandler(handler);
