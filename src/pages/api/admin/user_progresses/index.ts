import { Op } from "sequelize";
import { NextApiRequest, NextApiResponse } from "next";
import sequelize from "@/lib/db";
import { UserProgress } from "@/models/UserProgress";
import { User } from "@/models/User";
import { withErrorHandler } from "@/lib/withErrorHandler";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  await sequelize.authenticate();
  if (req.method !== "GET") {
    res.status(405).end();
  } else {
    const { page = 1, limit = 10, userId } = req.query;

    const whereClause = userId
      ? { user_id: { [Op.like]: `%${userId.toString()}%` } }
      : {};

    const userProgress = await UserProgress.findAll({
      where: whereClause,
      limit: +limit,
      offset: (+page - 1) * +limit,
      include: [{ model: User, attributes: ["id", "name", "email", "avatar"] }],
      order: [["updated_at", "DESC"]],
    });

    const totalItems = await UserProgress.count({ where: whereClause });
    const totalPages = Math.ceil(totalItems / +limit);

    res.status(200).json({
      data: userProgress.map((progress) => ({
        id: progress.id,
        user_id: progress.user_id,
        name: progress.user?.name || progress.user?.email || "Unknown",
        avatar: progress.user?.avatar || "",
        listening_score: progress.listening_score,
        reading_score: progress.reading_score,
        speaking_score: progress.speaking_score,
        writing_score: progress.writing_score,
        total_study_time: progress.total_study_time,
        last_activity_date: progress.last_activity_date?.toISOString() || null,
        updated_at: progress.updated_at?.toISOString(),
      })),
      currentPage: +page,
      totalPages,
      totalItems,
    });
  }
}

export default withErrorHandler(handler, "Failed to fetch user progress");
