import { NextApiRequest, NextApiResponse } from "next";

import sequelize from "@/lib/db";
import { Vocabulary } from "@/models/Vocabulary";
import { normalizeVocabulary } from "@/utils/normalize";
import { withErrorHandler } from "@/lib/withErrorHandler";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  if (!id || isNaN(+id)) return res.status(400).json({ message: "Invalid ID" });

  await sequelize.authenticate();

  const vocab = await Vocabulary.findByPk(+id);
  if (!vocab) return res.status(404).json({ message: "Vocabulary not found" });

  if (req.method === "GET") {
    const normalized = normalizeVocabulary(vocab);

    return res.status(200).json(normalized);
  }

  return res.status(405).end();
}

export default withErrorHandler(handler, "Failed to handle vocabulary request");
