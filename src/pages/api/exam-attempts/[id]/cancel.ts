import { NextApiRequest, NextApiResponse } from "next";

import sequelize from "@/lib/db";

import { withErrorHandler } from "@/lib/withErrorHandler";
import { UserExamAttempt } from "@/models/UserExamAttempt";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "PATCH") return res.status(405).end();

  const { id } = req.query;
  const attemptId = parseInt(id?.toString()!) || NaN;

  if (isNaN(attemptId))
    return res.status(400).json({ success: false, message: "Invalid input" });

  await sequelize.authenticate();

  await UserExamAttempt.update(
    { status: "abandoned" },
    { where: { id: attemptId } }
  );

  res.json({ message: "Exam attempt canceled" });
}

export default withErrorHandler(handler);
