import sequelize from "@/lib/db";
import { withErrorHandler } from "@/lib/withErrorHandler";
import { AIFeedback } from "@/models/AIFeedback";
import { Exam } from "@/models/Exam";
import { Part } from "@/models/Part";
import { UserAnswer } from "@/models/UserAnswer";
import { UserAttemptPart } from "@/models/UserAttemptPart";
import { UserExamAttempt } from "@/models/UserExamAttempt";
import dayjs from "dayjs";
import { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "GET")
    return res
      .status(405)
      .json({ success: false, message: "Method Not Allowed" });

  const { id: attemptId, user_id: userId } = req.query;

  if (!attemptId || !userId)
    return res
      .status(400)
      .json({ success: false, message: "Missing attempt_id or user_id" });

  await sequelize.authenticate();

  const attempt = await UserExamAttempt.findOne({
    where: { id: attemptId.toString(), user_id: userId },
    include: [{ model: Exam }],
  });

  if (!attempt)
    return res
      .status(404)
      .json({ success: false, message: "Attempt not found" });

  const start = dayjs(attempt.start_time);
  const end = dayjs(attempt.end_time);
  const durationInMinutes = end.diff(start, "minute");
  const score = attempt.score;

  const attemptParts = await UserAttemptPart.findAll({
    where: { user_exam_attempt_id: attemptId },
    include: [{ model: Part }],
  });

  const questionCountMap: { [key: string]: number } = {
    "1": 6,
    "2": 15,
    "3": 39,
    "4": 30,
    "5": 30,
    "6": 16,
    "7": 54,
  };

  let totalQuestions = 0;
  const partNumbers: number[] = [];

  const aiFeedbacks = await AIFeedback.findAll({
    where: {
      content_type: "user_attempt_part",
      content_id: attemptId,
    },
  });

  const parts = attemptParts.map((ap) => {
    const partNumber = ap.part.part_number;
    const feedback = aiFeedbacks.find(
      (fb) =>
        fb.content_type === "user_attempt_part" && fb.id === ap.ai_feedback_id
    );

    partNumbers.push(partNumber);
    totalQuestions += questionCountMap[partNumber.toString()] || 0;

    return {
      part_number: partNumber,
      feedback_text: feedback?.feedback_text || null,
      suggestions: feedback?.suggestions || null,
      strengths: feedback?.strengths || null,
      weaknesses: feedback?.weaknesses || null,
    };
  });

  const correctAnswers = await UserAnswer.count({
    where: {
      user_exam_attempt_id: attemptId,
      is_correct: true,
    },
  });

  return res.json({
    success: true,
    data: {
      exam_title: attempt.exam.title,
      score,
      correctAnswers,
      totalQuestions,
      durationInMinutes,
      parts,
    },
  });
};

export default withErrorHandler(handler);
