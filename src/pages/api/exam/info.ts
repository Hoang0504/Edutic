import dayjs from "dayjs";
import sequelize from "@/lib/db";

import { NextApiRequest, NextApiResponse } from "next";

import { Exam } from "@/models/Exam";
import { Part } from "@/models/Part";
import { formatDateTime } from "@/utils";
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

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "GET")
    return res.status(405).json({ message: "Method Not Allowed" });

  const { exam_id, user_id } = req.query;

  if (!exam_id) {
    return res.status(400).json({ message: "Missing exam_id" });
  }

  await sequelize.authenticate();

  const exam = await Exam.findByPk(exam_id.toString());

  if (!exam || !exam.is_published) {
    return res.status(404).json({ message: "Exam not found or not published" });
  }

  const examData: any = {
    id: exam.id,
    title: exam.title,
    duration: exam.estimated_time,
    year: exam.year_of_release,
    releaseDate: dayjs(exam.created_at).format("DD/MM/YYYY"),
  };

  if (user_id) {
    const allAttempts = await UserExamAttempt.findAll({
      where: {
        exam_id: exam.id,
        user_id: user_id.toString(),
      },
      order: [["created_at", "DESC"]],
    });

    const attempts = [];

    for (const at of allAttempts) {
      const attemptParts = await UserAttemptPart.findAll({
        where: { user_exam_attempt_id: at.id },
        include: [
          {
            model: Part,
            attributes: ["part_number"],
          },
        ],
        attributes: [],
      });

      let totalQuestionsAnswered = 0;
      let partNumbers: number[] = [];

      for (const ap of attemptParts) {
        const partNumber = ap.part?.part_number;
        partNumbers.push(partNumber);
        if (partNumber) {
          totalQuestionsAnswered += questionCountsByPart[partNumber];
        }
      }

      const maxScore = totalQuestionsAnswered * 5;
      const durationInMinutes =
        at.start_time && at.end_time
          ? dayjs(at.end_time).diff(dayjs(at.start_time), "minute")
          : 0;

      const formattedStartTime = formatDateTime(at.start_time);

      const summary = {
        attemptId: at.id,
        maxScore,
        score: at.score,
        status: at.status,
        partNumbers,
        estimatedDuration: at.estimated_time,
        testDuration: durationInMinutes,
        totalQuestionsAnswered,
        startTime: formattedStartTime,
      };

      attempts.push(summary);
    }

    // Nếu có ít nhất 1 bài làm => dùng bài mới nhất làm dữ liệu chính
    if (attempts.length > 0) {
      const latest = attempts[0];

      examData.attemptId = latest.attemptId;
      examData.maxScore = latest.maxScore;
      examData.score = latest.score;
      examData.status = latest.status;
      examData.partNumbers = latest.partNumbers;
      examData.estimatedDuration = latest.estimatedDuration;
      examData.testDuration = latest.testDuration;
      examData.totalQuestionsAnswered = latest.totalQuestionsAnswered;
      examData.startTime = latest.startTime;
    }

    // Thêm mảng lịch sử
    examData.attempts = attempts;
  }

  return res.status(200).json(examData);
};

export default withErrorHandler(handler);
