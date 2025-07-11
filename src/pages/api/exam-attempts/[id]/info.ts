import { NextApiRequest, NextApiResponse } from "next";

import sequelize from "@/lib/db";

import { Exam } from "@/models/Exam";
import { Part } from "@/models/Part";
import { Question } from "@/models/Question";
import { UserAnswer } from "@/models/UserAnswer";
import { UserAttemptPart } from "@/models/UserAttemptPart";
import { UserExamAttempt } from "@/models/UserExamAttempt";
import { withErrorHandler } from "@/lib/withErrorHandler";

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

    const getSkill = (partNumber: number): string => {
      if (partNumber >= 1 && partNumber <= 4) return "l";
      if (partNumber >= 5 && partNumber <= 7) return "r";
      if (partNumber >= 8 && partNumber <= 12) return "s";
      if (partNumber >= 13 && partNumber <= 15) return "w";
      return "";
    };
    const skillSet = new Set<string>([]);

    const parts = await Promise.all(
      userParts.map(async (up) => {
        let questionCount = 0;
        let questionStart = 0;

        const firstQuestion = await Question.findOne({
          where: {
            part_id: up.part.id,
          },
          attributes: ["id"],
        });

        const skill = getSkill(up.part.part_number);

        skillSet.add(skill);
        switch (up.part.part_number) {
          case 1:
            questionCount = 6;
            questionStart = 1;
            break;
          case 2:
            questionCount = 25;
            questionStart = 7;
            break;
          case 3:
            questionCount = 39;
            questionStart = 32;
            break;
          case 4:
            questionCount = 30;
            questionStart = 71;
            break;
          case 5:
            questionCount = 30;
            questionStart = 101;
            break;
          case 6:
            questionCount = 16;
            questionStart = 131;
            break;
          case 7:
            questionCount = 54;
            questionStart = 147;
            break;
          default:
            questionCount = 0;
            questionStart = 0;
            break;
        }

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
      estimated_time: attempt.estimated_time,
      totalQuestionCount,
      mode,
      parts,
    });
  }

  return res.status(405).end();
};

export default withErrorHandler(handler);
