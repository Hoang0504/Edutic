import sequelize from "@/lib/db";
import { NextApiRequest, NextApiResponse } from "next";

import { Flashcard } from "@/models/Flashcard";
import { Vocabulary } from "@/models/Vocabulary";
import { withErrorHandler } from "@/lib/withErrorHandler";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  await sequelize.authenticate();

  if (req.method !== "GET") return res.status(405).end();

  const { user_id, context } = req.query;

  if (!context) return res.status(400).json({ message: "Missing context" });

  if (user_id) {
    const flashcards = await Flashcard.findAll({
      where: { user_id },
      include: [
        {
          model: Vocabulary,
          where: { context },
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
  }

  const vocabularies = await Vocabulary.findAll({
    where: {
      context,
      status: "approved",
    },
    order: [["created_at", "DESC"]],
  });

  const data = vocabularies.map((vocab) => ({
    id: vocab.id,
    word: vocab.word,
    meaning: vocab.meaning,
    example: vocab.example,
    image_url: vocab.image_url,
    pronunciation: vocab.pronunciation,
    speech_audio_url: vocab.speech_audio_url,
  }));

  return res.status(200).json(data);
};

export default withErrorHandler(handler);
