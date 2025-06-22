import { NextApiRequest, NextApiResponse } from "next";
import { Vocabulary } from "@/models/Vocabulary";
import { Sequelize } from "sequelize";
import { withErrorHandler } from "@/lib/withErrorHandler";
import sequelize from "@/lib/db";

type ContextGroup = {
  context: string;
  getDataValue: (key: string) => unknown;
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  await sequelize.authenticate();

  if (req.method !== "GET") return res.status(405).end();

  const grouped = await Vocabulary.findAll({
    where: { status: "approved" },
    attributes: [
      "context",
      [Sequelize.fn("COUNT", Sequelize.col("id")), "count"],
    ],
    group: ["context"],
    order: [["context", "ASC"]],
  });

  const data = (grouped as ContextGroup[]).map((item) => ({
    key: item.context,
    label: item.context?.replace(/_/g, " ").toUpperCase(),
    count: Number(item.getDataValue("count")),
    type: "context",
  }));

  return res.status(200).json(data);
};

export default withErrorHandler(handler);
