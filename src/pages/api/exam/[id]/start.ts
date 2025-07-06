import jwt from "jsonwebtoken";
import { NextApiRequest, NextApiResponse } from "next";

import sequelize from "@/lib/db";

import { withErrorHandler } from "@/lib/withErrorHandler";
import { UserExamAttempt } from "@/models/UserExamAttempt";
import { UserAttemptPart } from "@/models/UserAttemptPart";

const JWT_SECRET = process.env.JWT_SECRET as string;

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "POST") return res.status(405).end();

  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(404).json({ message: "Missing or invalid token" });
  }

  const token = authHeader.split(" ")[1];

  const decoded: any = jwt.verify(token, JWT_SECRET);

  // console.log(decoded);

  if (!decoded?.userId) {
    return res.status(401).json({ message: "Invalid token payload" });
  }

  const userId = decoded.userId;

  const { id: examId } = req.query;
  const {
    part_order: partOrder,
  }: { part_order: { part_id: number; order_index: number }[] } = req.body;

  if (!examId || !partOrder || !Array.isArray(partOrder))
    return res.status(400).json({ message: "Missing exam_id or part_order" });

  await sequelize.authenticate();
  const transaction = await sequelize.transaction();

  try {
    const examAttempt = await UserExamAttempt.create(
      {
        user_id: userId,
        exam_id: parseInt(examId as string),
        status: "in_progress",
      },
      { transaction }
    );

    await UserAttemptPart.bulkCreate(
      partOrder.map((p, idx) => ({
        user_exam_attempt_id: examAttempt.id,
        part_id: p.part_id,
        order_index: idx + 1,
        score: 0,
        created_at: new Date(),
      })),
      { transaction }
    );

    transaction.commit();

    return res.json({ examAttemptId: examAttempt.id });
  } catch (e) {
    transaction.rollback();
    console.log(e);
    return res.status(500).json({ message: "Server error" });
  }
};

export default withErrorHandler(handler);
