import sequelize from "@/lib/db";
import { withErrorHandler } from "@/lib/withErrorHandler";
import { ExamPart } from "@/models/ExamPart";
import { Part } from "@/models/Part";
import { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "GET") return res.status(405).end();

  const { id: examId } = req.query;

  if (!examId) return res.status(400).json({ message: "Missing exam_id" });

  await sequelize.authenticate();

  const examParts = await ExamPart.findAll({
    where: { exam_id: examId },
    include: [
      {
        model: Part,
        as: "part",
        attributes: ["id", "part_number"],
      },
    ],
    attributes: [],
  });

  const parts = examParts.map((ep) => ep.part);

  res.json({
    examId,
    parts,
  });
};

export default withErrorHandler(handler);
