import { Sequelize } from "sequelize";
import { NextApiRequest, NextApiResponse } from "next";

import sequelize from "@/lib/db";

import { Flashcard } from "@/models/Flashcard";
import { Vocabulary } from "@/models/Vocabulary";
import { withErrorHandler } from "@/lib/withErrorHandler";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  await sequelize.authenticate();

  if (req.method !== "GET") return res.status(405).end();

  const { user_id } = req.query;
  let grouped;

  if (user_id) {
    grouped = await Flashcard.findAll({
      where: { user_id },
      attributes: [
        [Sequelize.fn("COUNT", Sequelize.col("Flashcard.id")), "count"],
        [Sequelize.col("vocabulary.context"), "context"],
      ],
      include: [
        {
          model: Vocabulary,
          as: "vocabulary",
          attributes: [],
          required: true, // Ensures INNER JOIN
        },
      ],
      group: ["vocabulary.context"], // Use the alias you defined in the association
      order: [["vocabulary", "context", "ASC"]],
      raw: true,
    });
  } else {
    grouped = await Vocabulary.findAll({
      where: { status: "approved" },
      attributes: [
        "context",
        [Sequelize.fn("COUNT", Sequelize.col("id")), "count"],
      ],
      group: ["context"],
      order: [["context", "ASC"]],
      raw: true,
    });
  }

  const data = grouped.map((item: any) => ({
    key: item.context,
    label: item.context?.replace(/_/g, " ").toUpperCase(),
    count: item.count,
    type: "context",
  }));

  return res.status(200).json(data);
};
export default withErrorHandler(handler);
