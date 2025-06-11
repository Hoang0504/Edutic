import { NextApiRequest, NextApiResponse } from "next";
import { sequelize } from "@/lib/db";
import { Exam } from "@/models/Exam";
import { Op } from "sequelize";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    await sequelize.authenticate();

    const { type, search } = req.query;

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
  } catch (error) {
    console.error("Error fetching exams:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
} 