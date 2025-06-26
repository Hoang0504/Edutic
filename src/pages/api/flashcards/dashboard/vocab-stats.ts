import { NextApiRequest, NextApiResponse } from "next";

import { Flashcard } from "@/models/Flashcard";
import { Vocabulary } from "@/models/Vocabulary";
import { withErrorHandler } from "@/lib/withErrorHandler";
import { Op } from "sequelize";
import sequelize from "@/lib/db";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  await sequelize.authenticate();

  if (req.method === "GET") {
    const { user_id } = req.query;

    let user_vocab_count = null;
    let user_vocab_due_count = null;

    // if (!user_id || isNaN(+user_id)) {
    //   return res.status(400).json({ message: "Missing or invalid user_id" });
    // }

    const approved_vocab_count = await Vocabulary.count({
      where: { status: "approved" },
    });

    if (user_id) {
      user_vocab_count = await Flashcard.count({
        where: { user_id },
      });

      user_vocab_due_count = await Flashcard.count({
        where: {
          user_id,
          next_review_date: { [Op.lte]: new Date() },
        },
      });
    }

    const contexts = await Vocabulary.findAll({
      where: { status: "approved" },
      attributes: ["context"],
      group: ["context"],
    });

    const context_groups = contexts.map((item) => item.context.toUpperCase());

    return res.status(200).json({
      approved_vocab_count,
      ...(user_id ? { user_vocab_count, user_vocab_due_count } : {}),
      context_groups,
    });
  }

  res.status(405).json({ error: "Method not allowed" });
}

export default withErrorHandler(handler, "Error in handler");
