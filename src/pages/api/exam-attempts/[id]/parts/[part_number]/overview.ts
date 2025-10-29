import "reflect-metadata";
import { NextApiRequest, NextApiResponse } from "next";

import sequelize from "@/lib/db";

import { Part } from "@/models/Part";
import { getAnswerOption } from "@/utils";
import { UserAnswer } from "@/models/UserAnswer";
import { withErrorHandler } from "@/lib/withErrorHandler";
import { verifyAuthToken } from "@/lib/authToken";
import { UserExamAttempt } from "@/models/UserExamAttempt";
import { UserAttemptPart } from "@/models/UserAttemptPart";
import { getStaticPartData } from "@/helper";

export const config = {
  runtime: "nodejs", // Hoặc 'nodejs' nếu bạn cần các thư viện Node.js đặc biệt
  maxDuration: 30, // Giới hạn thời gian thực thi (giây)
};

// kiểm tra xem user có phải là user đã làm đề thi này không thì mới cho lấy thông tin
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "GET") return res.status(405).end();

  res.setHeader(
    "Cache-Control",
    "public, s-maxage=3600, stale-while-revalidate=1800"
    // s-maxage: 1 giờ cache trên CDN
    // stale-while-revalidate: 30 phút serve stale data trong khi revalidate
  );

  const user = verifyAuthToken(req, res);
  if (!user) return;

  const { id: attemptId, part_number: partNumber } = req.query;

  // console.log({ attemptId, partNumber });

  if (!attemptId || !partNumber)
    return res
      .status(400)
      .json({ message: "Missing attempt_id or part_number" });

  const parsedPartNumber = Number(partNumber);
  if (isNaN(parsedPartNumber)) {
    return res.status(400).json({ message: "Invalid part_number" });
  }

  await sequelize.authenticate();

  const attempt = await UserExamAttempt.findOne({
    where: { id: attemptId, user_id: user.id },
    attributes: ["id"],
  });

  if (!attempt) {
    return res
      .status(404)
      .json({ message: "User exam attempt not found or unauthorized" });
  }

  const attemptPart = await UserAttemptPart.findOne({
    where: { user_exam_attempt_id: attemptId },
    attributes: ["id"],
    include: [
      {
        model: Part,
        as: "part",
        where: { part_number: partNumber },
        // include: [
        //   {
        //     model: AudioFile,
        //     as: "audioFile",
        //     attributes: ["file_path", "status"],
        //   },
        // ],
        attributes: ["id"],
        required: true,
      },
    ],
  });

  if (!attemptPart || !attemptPart.part)
    return res.status(404).json({ message: "Attempt part not found" });

  // const part = attemptPart.part;
  const part = await getStaticPartData(attemptPart.part.id);
  if (!part) {
    return res.status(404).json({ message: "Part not found" });
  }
  // const questions = await Question.findAll({
  //   where: { part_id: part.id },
  //   include: [
  //     {
  //       model: UserAnswer,
  //       where: { user_exam_attempt_id: attemptId },
  //       required: false,
  //     },
  //     {
  //       model: Answer,
  //       as: "answers",
  //     },
  //   ],
  //   order: [["question_number", "ASC"]],
  // });

  // console.log(questions);
  // return res.json(questions);

  const userAnswers = await UserAnswer.findAll({
    where: {
      user_exam_attempt_id: attemptId,
      question_id: part.questions.map((q) => q.id),
    },
  });

  const questionList = part.questions.map((q) => {
    const userAns = userAnswers.find((ua) => ua.question_id === q.id);
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
