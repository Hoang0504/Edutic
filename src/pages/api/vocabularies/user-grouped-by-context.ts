import { NextApiRequest, NextApiResponse } from "next";

import { Sequelize } from "sequelize";
import { Flashcard } from "@/models/Flashcard";
import { Vocabulary } from "@/models/Vocabulary";
import { withErrorHandler } from "@/lib/withErrorHandler";
import sequelize from "@/lib/db";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  await sequelize.authenticate();
  const { user_id } = req.query;

  if (!user_id || isNaN(+user_id)) {
    return res.status(400).json({ message: "Invalid or missing user_id" });
  }

  //   return res
  //     .status(200)
  //     .json([{ key: "test", label: "TEST", count: 1, type: "context" }]);

  const grouped = await Flashcard.findAll({
    where: { user_id },
    attributes: [],
    include: [
      {
        model: Vocabulary,
        attributes: [
          "context",
          [Sequelize.fn("COUNT", Sequelize.col("Flashcard.id")), "count"],
        ],
      },
    ],
    group: ["Vocabulary.context"],
    // order: [[Vocabulary, "context", "ASC"]],
    order: [["Vocabulary.context", "ASC"]],
    raw: true,
  });

  return res
    .status(200)
    .json([{ key: "test", label: "TEST", count: 1, type: "context" }]);

  //   const data = grouped.map((item: any) => ({
  //     key: item["Vocabulary.context"],
  //     label: item["Vocabulary.context"]?.replace(/_/g, " ").toUpperCase(),
  //     count: Number(item["Vocabulary.count"]),
  //     type: "context",
  //   }));

  //   const data = grouped.map((item: any) => ({
  //     key: item["Vocabulary.context"],
  //     label: item["Vocabulary.context"]?.replace(/_/g, " ").toUpperCase(),
  //     count: Number(item["Vocabulary.count"]),
  //     type: "context",
  //   }));

  console.log(grouped);

  const data = grouped
    .filter(
      (item: any) =>
        item["Vocabulary.context"] !== undefined &&
        item["Vocabulary.count"] !== undefined
    )
    .map((item: any) => ({
      key: item["Vocabulary.context"],
      label: item["Vocabulary.context"]?.replace(/_/g, " ").toUpperCase(),
      count: Number(item["Vocabulary.count"]),
      type: "context",
    }));

  //   return res.status(200).json(data);
  return res
    .status(200)
    .json([{ key: "test", label: "TEST", count: 1, type: "context" }]);
};

export default withErrorHandler(handler);
