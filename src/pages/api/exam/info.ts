import sequelize from "@/lib/db";
import { withErrorHandler } from "@/lib/withErrorHandler";
import { Exam } from "@/models/Exam";
import { Part } from "@/models/Part";
import { UserAttemptPart } from "@/models/UserAttemptPart";
import { UserExamAttempt } from "@/models/UserExamAttempt";
import dayjs from "dayjs";
import { NextApiRequest, NextApiResponse } from "next";

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
    const attempt = await UserExamAttempt.findOne({
      where: {
        exam_id: exam.id,
        user_id: user_id.toString(),
      },
      order: [["created_at", "DESC"]],
    });

    if (attempt) {
      const start = dayjs(attempt.start_time);
      const end = dayjs(attempt.end_time);
      const durationInMinutes = end.diff(start, "minute");

      const attemptParts = await UserAttemptPart.findAll({
        where: { user_exam_attempt_id: attempt.id },
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

      examData.attemptId = attempt.id;
      examData.maxScore = maxScore;
      examData.score = attempt.score;
      examData.status = attempt.status;
      examData.partNumbers = partNumbers;
      examData.testDuration = durationInMinutes;
      examData.totalQuestionsAnswered = totalQuestionsAnswered;
    }
  }

  return res.status(200).json(examData);
};

export default withErrorHandler(handler);
