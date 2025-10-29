import { NextApiRequest, NextApiResponse } from "next";

import sequelize from "@/lib/db";

import { Op } from "sequelize";
import { Exam } from "@/models/Exam";
import { withErrorHandler } from "@/lib/withErrorHandler";
import { UserExamAttempt } from "@/models/UserExamAttempt";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    await sequelize.authenticate();

    const { user_id, latest, type, search } = req.query;

    if (type || search) {
      await sequelize.authenticate();

      const whereConditions: any = {};

      // Filter by type
      if (type && (type === "random" || type === "full_test")) {
        whereConditions.type = type;
      }

      // Search by title
      if (search && typeof search === "string") {
        whereConditions.title = {
          [Op.like]: `%${search}%`,
        };
      }

      const exams = await Exam.findAll({
        where: whereConditions,
        attributes: ["id", "title", "type", "estimated_time"],
        order: [["created_at", "DESC"]],
      });

      return res.status(200).json(exams);
    }

    const include: any[] = [];

    if (user_id) {
      include.push({
        model: UserExamAttempt,
        as: "userExamAttempts",
        where: { user_id },
        attributes: ["start_time", "end_time", "score", "status"],
      });
    }

    const exams = await Exam.findAll({
      include,
      order: [["created_at", "DESC"]],
      limit: latest ? 6 : undefined,
    });

    const data = exams.map((exam) => {
      let questionCount = 0;

      switch (exam.type) {
        case "random":
        case "full_test":
          questionCount = 200;
          break;
        case "speaking":
          questionCount = 11;
          break;
        case "writing":
          questionCount = 8;
        default:
          questionCount = 0;
      }

      const attempt = exam.userExamAttempts?.[0];

      return {
        id: exam.id,
        title: exam.title,
        duration: exam.estimated_time,
        year: new Date(exam.created_at).getFullYear(),
        questionCount,
        releaseDate: exam.created_at.toLocaleDateString("vi-VN"),
        testDuration: attempt
          ? (new Date(attempt.end_time).getTime() -
              new Date(attempt.start_time).getTime()) /
            60000
          : 0,
        score: attempt?.score || 0,
        status: attempt?.status || "not_started",
      };
    });

    return res.status(200).json(data);
  }

  res.status(405).json({ error: "Method not allowed" });
}

export default withErrorHandler(handler, "Error fetching exams");
