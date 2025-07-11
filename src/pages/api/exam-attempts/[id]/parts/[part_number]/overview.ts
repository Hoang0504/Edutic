import { NextApiRequest, NextApiResponse } from "next";

import sequelize from "@/lib/db";

import { Part } from "@/models/Part";
import { Answer } from "@/models/Answer";
import { getAnswerOption } from "@/utils";
import { Question } from "@/models/Question";
import { AudioFile } from "@/models/AudioFile";
import { UserAnswer } from "@/models/UserAnswer";
import { withErrorHandler } from "@/lib/withErrorHandler";

// kiểm tra xem user có phải là user đã làm đề thi này không thì mới cho lấy thông tin
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "GET") return res.status(405).end();

  const { id: attemptId, part_number: partNumber } = req.query;

  // console.log({ attemptId, partNumber });

  if (!attemptId || !partNumber)
    return res
      .status(400)
      .json({ message: "Missing attempt_id or part_number" });

  await sequelize.authenticate();

  const part = await Part.findOne({
    where: { part_number: partNumber },
    include: [
      {
        model: AudioFile,
        as: "audioFile",
        attributes: ["file_path", "status"],
      },
    ],
  });
  if (!part) return res.status(404).json({ message: "Part not found" });

  const questions = await Question.findAll({
    where: { part_id: part.id },
    include: [
      {
        model: UserAnswer,
        where: { user_exam_attempt_id: attemptId },
        required: false,
      },
      {
        model: Answer,
        as: "answers",
      },
    ],
  });

  // console.log(questions);

  const questionList = questions.map((q) => {
    const userAns = q.user_answers ? q.user_answers[0] : null;
    const correctAns = q.answers.find((a) => a.is_correct);

    return {
      question_id: q.id,
      question_number: q.question_number,
      user_answer: userAns ? getAnswerOption(q.answers, userAns.answer_id) : "",
      correct_answer: getAnswerOption(q.answers, correctAns?.id),
      is_correct: userAns?.is_correct ?? false,
    };
  });
  const questionCorrectCount = questionList.filter((q) => q.is_correct).length;

  return res.json({
    part_number: part.part_number,
    part_title: part.title,
    audio_file_path: part?.audioFile?.file_path ?? "",
    audio_status: part?.audioFile?.status ?? "",
    total: questionList.length,
    question_correct: questionCorrectCount,
    score: questionCorrectCount * 5,
    questions: questionList,
  });
};

export default withErrorHandler(handler);
