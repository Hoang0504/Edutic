import { NextApiRequest, NextApiResponse } from "next";
import { Op, literal } from "sequelize";

import sequelize from "@/lib/db";
import { Flashcard } from "@/models/Flashcard";
import { Vocabulary } from "@/models/Vocabulary";
import { withErrorHandler } from "@/lib/withErrorHandler";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  await sequelize.authenticate();

  if (req.method !== "GET") return res.status(405).end();
  const { user_id, date } = req.query;

  if (!user_id || !date) {
    return res.status(400).json({ message: "Missing user_id or date" });
  }

  const flashcards = await Flashcard.findAll({
    where: {
      user_id,
      next_review_date: {
        [Op.and]: [
          { [Op.gte]: literal(`DATE('${date}')`) },
          { [Op.lt]: literal(`DATE('${date}') + INTERVAL 1 DAY`) },
        ],
      },
    },
    include: [
      {
        model: Vocabulary,
      },
    ],
  });

  const data = flashcards.map((fc) => ({
    id: fc.vocabulary.id,
    word: fc.vocabulary.word,
    meaning: fc.vocabulary.meaning,
    example: fc.vocabulary.example,
    image_url: fc.vocabulary.image_url,
    pronunciation: fc.vocabulary.pronunciation,
    speech_audio_url: fc.vocabulary.speech_audio_url,
  }));

  return res.status(200).json(data);
};

export default withErrorHandler(handler);
