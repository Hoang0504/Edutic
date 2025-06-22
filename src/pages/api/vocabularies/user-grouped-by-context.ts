import { NextApiRequest, NextApiResponse } from "next";

import { Sequelize } from "sequelize";
import { Flashcard } from "@/models/Flashcard";
import { Vocabulary } from "@/models/Vocabulary";
import { withErrorHandler } from "@/lib/withErrorHandler";
import sequelize from "@/lib/db";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    await sequelize.authenticate();
    const { user_id } = req.query;

    if (!user_id || isNaN(+user_id)) {
      return res.status(400).json({ message: "Invalid or missing user_id" });
    }

    const grouped = await Flashcard.findAll({
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

    const data = grouped.map((item: any) => ({
      key: item.context,
      label: item.context?.replace(/_/g, " ").toUpperCase(),
      count: Number(item.count),
      type: "context",
    }));

    return res.status(200).json(data);
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};

export default withErrorHandler(handler);
