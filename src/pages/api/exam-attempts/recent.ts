import { withErrorHandler } from "@/lib/withErrorHandler";
import { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";
import { UserExamAttempt } from "@/models/UserExamAttempt";
import { Exam } from "@/models/Exam";

const JWT_SECRET = process.env.JWT_SECRET as string;

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "GET") return res.status(405).end();

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

  const attempts = await UserExamAttempt.findAll({
    where: { user_id: userId },
    include: [
      {
        model: Exam,
        as: "exam",
        attributes: ["title"],
      },
    ],
    order: [["created_at", "DESC"]],
    limit: 3,
  });

  const now = new Date();
  const results = attempts.map((attempt) => {
    const diffTime = Math.abs(
      now.getTime() - new Date(attempt.created_at).getTime()
    );
    const daysAgo = Math.floor(diffTime / (1000 * 60 * 60 * 24)); // làm tròn xuống

    return {
      id: attempt.id,
      title: attempt.exam.title,
      daysAgo,
      score: attempt.score,
      status: attempt.status,
    };
  });

  return res.json(results);
};

export default withErrorHandler(handler);
