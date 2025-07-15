import dayjs from "dayjs";
import jwt from "jsonwebtoken";
import sequelize from "@/lib/db";

import { NextApiRequest, NextApiResponse } from "next";

import { Exam } from "@/models/Exam";
import { Part } from "@/models/Part";
import { formatDateTime } from "@/utils";
import { Question } from "@/models/Question";
import { withErrorHandler } from "@/lib/withErrorHandler";
import { UserExamAttempt } from "@/models/UserExamAttempt";
import { UserAttemptPart } from "@/models/UserAttemptPart";

const questionCountsByPart: Record<number, number> = {
  1: 6,
  2: 25,
  3: 39,
  4: 30,
  5: 30,
  6: 16,
  7: 54,
};

const JWT_SECRET = process.env.JWT_SECRET as string;

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "GET")
    return res.status(405).json({ message: "Method Not Allowed" });

  // Token authorize
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(404).json({ message: "Missing or invalid token" });
  }
  const token = authHeader.split(" ")[1];

  const decoded: any = jwt.verify(token, JWT_SECRET);

  if (!decoded?.userId) {
    return res.status(401).json({ message: "Invalid token payload" });
  }
  const userId = decoded.userId;

  // check missing examId
  const { id: examId } = req.query;
  if (!examId) {
    return res.status(400).json({ message: "Missing examId" });
  }

  await sequelize.authenticate();

  const exam = await Exam.findByPk(examId.toString(), {
    attributes: [
      "id",
      "title",
      "type",
      "year_of_release",
      "estimated_time",
      "is_published",
    ],
  });

  if (!exam || !exam.is_published) {
    return res.status(404).json({ message: "Exam not found or not published" });
  }

  const examData: any = {
    id: exam.id,
    title: exam.title,
    type: exam.type,
    duration: exam.estimated_time,
    year: exam.year_of_release,
    releaseDate: dayjs(exam.created_at).format("DD/MM/YYYY"),
  };

  let totalQuestions = 0;
  let maxScore = 0;

  if (exam.type === "full_test") {
    totalQuestions = 200;
    maxScore = 990;
  } else if (exam.type === "speaking") {
    totalQuestions = 11;
    maxScore = 200;
  } else if (exam.type === "writing") {
    totalQuestions = 8;
    maxScore = 200;
  }

  examData.totalQuestions = totalQuestions;
  examData.maxScore = maxScore;

  if (userId) {
    const attempts = [];
    const allAttempts = await UserExamAttempt.findAll({
      where: {
        exam_id: exam.id,
        user_id: Number(userId),
      },
      order: [["start_time", "DESC"]],
    });

    for (const at of allAttempts) {
      const attemptParts = await UserAttemptPart.findAll({
        where: { user_exam_attempt_id: at.id },
        include: [
          {
            model: Part,
            attributes: ["id", "part_number"],
          },
        ],
        attributes: ["id"],
      });

      // console.log(attemptParts);

      let totalQuestions = 0;
      const partIdsNeedQuery: number[] = [];
      let partNumbers: number[] = [];

      for (const ap of attemptParts) {
        const partNumber = ap.part?.part_number;
        partNumbers.push(partNumber);
        if (
          partNumber &&
          !(exam.type === "speaking" || exam.type === "writing")
        ) {
          totalQuestions += questionCountsByPart[partNumber];
        } else {
          partIdsNeedQuery.push(ap.part?.id); // speaking/writing sẽ xử lý sau
        }
      }

      if (partIdsNeedQuery.length > 0) {
        const countExtra = await Question.count({
          where: {
            part_id: partIdsNeedQuery,
          },
        });
        totalQuestions += countExtra;
      }

      const maxScore = totalQuestions * 5;
      const durationInMinutes =
        at.start_time && at.end_time
          ? dayjs(at.end_time).diff(dayjs(at.start_time), "minute")
          : 0;

      const formattedStartTime = formatDateTime(at.start_time);

      const summary = {
        attemptId: at.id,
        attemptScore: at.score,
        attemptStatus: at.status,
        attemptMaxScore: maxScore,
        attemptPartNumbers: partNumbers,
        attemptStartTime: formattedStartTime,
        attemptTotalQuestions: totalQuestions,
        attemptTestDuration: durationInMinutes,
        attemptEstimatedDuration: at.estimated_time,
      };

      attempts.push(summary);
    }

    // Nếu có ít nhất 1 bài làm => dùng bài mới nhất làm dữ liệu chính
    if (attempts.length > 0) {
      const latest = attempts[0];

      examData.attemptId = latest.attemptId;
      examData.attemptMaxScore = latest.attemptMaxScore;
      examData.attemptScore = latest.attemptScore;
      examData.attemptStatus = latest.attemptStatus;
      examData.attemptPartNumbers = latest.attemptPartNumbers;
      examData.attemptEstimatedDuration = latest.attemptEstimatedDuration;
      examData.attemptTestDuration = latest.attemptTestDuration;
      examData.attemptTotalQuestions = latest.attemptTotalQuestions;
      examData.attemptStartTime = latest.attemptStartTime;
    }

    // Thêm mảng lịch sử
    examData.attempts = attempts;
  }

  return res.status(200).json(examData);
};

export default withErrorHandler(handler);
