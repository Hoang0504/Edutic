import { NextApiRequest, NextApiResponse } from "next";

import sequelize from "@/lib/db";

import { Exam } from "@/models/Exam";
import { Part } from "@/models/Part";
import { Question } from "@/models/Question";
import { UserAnswer } from "@/models/UserAnswer";
import { UserAttemptPart } from "@/models/UserAttemptPart";
import { UserExamAttempt } from "@/models/UserExamAttempt";
import { withErrorHandler } from "@/lib/withErrorHandler";

const getSkill = (examType: string, partNumber: number): string => {
  switch (examType) {
    case "full_test":
      if (partNumber >= 1 && partNumber <= 4) return "l";
      if (partNumber >= 5 && partNumber <= 7) return "r";
      return "";
    case "speaking":
      return "s"; // All parts in speaking exam are speaking
    case "writing":
      return "w"; // All parts in writing exam are writing
    default:
      return "";
  }
};

const getQuestionInfo = (
  examType: string,
  partNumber: number
): { questionCount: number; questionStart: number } => {
  switch (examType) {
    case "full-test":
      switch (partNumber) {
        case 1:
          return { questionCount: 6, questionStart: 1 };
        case 2:
          return { questionCount: 25, questionStart: 7 };
        case 3:
          return { questionCount: 39, questionStart: 32 };
        case 4:
          return { questionCount: 30, questionStart: 71 };
        case 5:
          return { questionCount: 30, questionStart: 101 };
        case 6:
          return { questionCount: 16, questionStart: 131 };
        case 7:
          return { questionCount: 54, questionStart: 147 };
        default:
          return { questionCount: 0, questionStart: 0 };
      }
    case "speaking":
      switch (partNumber) {
        case 1:
          return { questionCount: 4, questionStart: 1 };
        case 2:
          return { questionCount: 5, questionStart: 5 };
        case 3:
          return { questionCount: 2, questionStart: 10 };
        default:
          return { questionCount: 0, questionStart: 0 };
      }
    case "writing":
      switch (partNumber) {
        case 1:
          return { questionCount: 5, questionStart: 1 };
        case 2:
          return { questionCount: 3, questionStart: 6 };
        default:
          return { questionCount: 0, questionStart: 0 };
      }
    default:
      return { questionCount: 0, questionStart: 0 };
  }
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  await sequelize.authenticate();
  if (req.method === "GET") {
    const { id: attemptId } = req.query;
    let totalQuestionCount = 0;

    if (!attemptId) {
      return res.status(400).json({ message: "Missing attemptId" });
    }

    const attempt = await UserExamAttempt.findByPk(attemptId.toString(), {
      include: [Exam],
    });

    if (!attempt) {
      return res.status(404).json({ message: "User exam attempt not found" });
    }

    await UserAnswer.destroy({ where: { user_exam_attempt_id: attempt.id } });

    const userParts = await UserAttemptPart.findAll({
      where: { user_exam_attempt_id: attemptId },
      include: [
        {
          model: Part,
          as: "part",
        },
      ],
      order: [["order_index", "ASC"]],
    });

    const skillSet = new Set<string>([]);

    const parts = await Promise.all(
      userParts.map(async (up) => {
        const firstQuestion = await Question.findOne({
          where: {
            part_id: up.part.id,
          },
          attributes: ["id"],
        });

        const skill = getSkill(attempt.exam.type, up.part.part_number);

        skillSet.add(skill);

        const { questionCount, questionStart } = getQuestionInfo(
          attempt.exam.type,
          up.part.part_number
        );

        totalQuestionCount += questionCount;

        return {
          part_id: up.part.id,
          part_number: up.part.part_number,
          title: up.part.title,
          skill: skill,
          questionCount,
          questionStart,
          questionIdStart: firstQuestion!.id,
          time_limit: up.part.time_limit,
          order_index: up.order_index,
        };
      })
    );

    const mode = Array.from(skillSet).sort().join("");

    return res.status(200).json({
      exam_id: attempt.exam.id,
      title: attempt.exam.title,
      type: attempt.exam.type,
      estimated_time: attempt.estimated_time,
      totalQuestionCount,
      mode,
      parts,
    });
  }

  return res.status(405).end();
};

export default withErrorHandler(handler);
