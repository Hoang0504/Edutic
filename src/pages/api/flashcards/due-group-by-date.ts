import { Op, Sequelize } from "sequelize";
import { NextApiRequest, NextApiResponse } from "next";

import sequelize from "@/lib/db";

import { Flashcard } from "@/models/Flashcard";
import { withErrorHandler } from "@/lib/withErrorHandler";
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  await sequelize.authenticate();

  if (req.method !== "GET") return res.status(405).end();

  const { user_id } = req.query;

  if (!user_id || isNaN(+user_id)) {
    return res.status(400).json({ message: "Invalid or missing user_id" });
  }

  const grouped = await Flashcard.findAll({
    where: {
      user_id,
      next_review_date: {
        [Op.lte]: new Date(),
      },
    },
    attributes: [
      [Sequelize.fn("DATE", Sequelize.col("next_review_date")), "date"],
      [Sequelize.fn("COUNT", Sequelize.col("id")), "count"],
    ],
    group: [Sequelize.fn("DATE", Sequelize.col("next_review_date"))],
    order: [[Sequelize.fn("DATE", Sequelize.col("next_review_date")), "DESC"]],
    raw: true,
  });

  const data = grouped.map((item: any) => ({
    key: item.date,
    label: item.date,
    count: Number(item.count),
    type: "date",
  }));

  return res.status(200).json(data);
};

export default withErrorHandler(handler);
