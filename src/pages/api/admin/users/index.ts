import { Op } from "sequelize";
import { NextApiRequest, NextApiResponse } from "next";

import sequelize from "@/lib/db";
import { User } from "@/models/User";
import { normalizeUser } from "@/utils/normalize";
import { withErrorHandler } from "@/lib/withErrorHandler";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  await sequelize.authenticate();
  if (req.method !== "GET") {
    res.status(405).end();
  } else {
    const { page = 1, limit = 10, email } = req.query;

    const whereClause = email
      ? { email: { [Op.like]: `%${email.toString()}%` } }
      : {};

    const users = await User.findAll({
      where: whereClause,
      limit: +limit,
      offset: (+page - 1) * +limit,
      order: [["created_at", "DESC"]],
    });

    const totalUsers = await User.count({ where: whereClause });
    const totalPages = Math.ceil(totalUsers / +limit);

    res.status(200).json({
      data: users.map(normalizeUser),
      currentPage: +page,
      totalPages,
      totalItems: totalUsers,
    });
  }
}

export default withErrorHandler(handler, "Failed to fetch users");
