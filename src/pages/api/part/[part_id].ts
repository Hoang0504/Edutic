import { NextApiRequest, NextApiResponse } from "next";

import sequelize from "@/lib/db";

import { Part } from "@/models/Part";
import { Answer } from "@/models/Answer";
import { Question } from "@/models/Question";
import { AudioFile } from "@/models/AudioFile";
import { withErrorHandler } from "@/lib/withErrorHandler";
import { QuestionGroup } from "@/models/QuestionGroup";

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

  const groupedQuestionGroups = await QuestionGroup.findAll({
    include: [
      {
        model: Question,
        as: "questions",
        where: { part_id },
        include: [
          {
            model: Answer,
            as: "answers",
            attributes: ["id", "content"],
          },
        ],
        order: [["question_number", "ASC"]],
      },
    ],
    order: [["id", "ASC"]],
  });

  const individualQuestions = await Question.findAll({
    where: {
      part_id,
      group_id: null,
    },
    include: [
      {
        model: Answer,
        as: "answers",
        attributes: ["id", "content"],
      },
    ],
    order: [["question_number", "ASC"]],
  });

  const grouped = groupedQuestionGroups.map((group) => ({
    id: group.id,
    content:
      part.part_number === 3 || part.part_number === 4 ? "" : group.content,
    image_url: group.image_url,
    questions: group.questions.map((q) => ({
      id: q.id,
      question_number: q.question_number,
      content: part.part_number === 2 ? "" : q.content,
      image_url: part.part_number === 2 ? "" : q.image_url,
      question_type: q.question_type,
      answers: q.answers.map((a) => ({
        id: a.id,
        content: part.part_number === 2 ? a.content.slice(0, 2) : a.content,
      })),
    })),
  }));

  const standalone = individualQuestions.map((q) => ({
    id: q.id,
    question_number: q.question_number,
    content: part.part_number === 2 ? "" : q.content,
    image_url: part.part_number === 2 ? "" : q.image_url,
    question_type: q.question_type,
    answers: q.answers.map((a) => ({
      id: a.id,
      content:
        part.part_number === 1 || part.part_number === 2
          ? a.content.slice(0, 2)
          : a.content,
    })),
  }));

  const data = {
    part: {
      id: part.id,
      title: part.title,
      instructions: part.instruction,
      audio: part.audioFile?.file_path || null,
      time_limit: part.time_limit,
    },
    groups: grouped,
    questions: standalone,
  };

  return res.status(200).json(data);
};

export default withErrorHandler(handler);
