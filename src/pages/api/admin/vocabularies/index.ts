import { Op } from "sequelize";
import { NextApiRequest, NextApiResponse } from "next";

import sequelize from "@/lib/db";
import { Vocabulary } from "@/models/Vocabulary";
import { normalizeVocabulary } from "@/utils/normalize";
import { withErrorHandler } from "@/lib/withErrorHandler";
import { User } from "@/models/User";
import { Flashcard } from "@/models/Flashcard";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  await sequelize.authenticate();

  if (req.method === "GET") {
    const { page = 1, limit = 10, word, context, status } = req.query;

    // Tạo điều kiện where dựa vào các trường tìm kiếm
    const whereClause: Record<string, unknown> = {};

    if (word) {
      whereClause.word = { [Op.like]: `%${word.toString()}%` };
    }

    if (context) {
      whereClause.context = { [Op.like]: `%${context.toString()}%` };
    }

    if (status) {
      whereClause.status = status.toString(); // nếu status là dạng string (ví dụ: 'active', 'inactive')
    }

    const vocabularies = await Vocabulary.findAll({
      where: whereClause,
      limit: +limit,
      offset: (+page - 1) * +limit,
      order: [["created_at", "DESC"]],
    });

    const totalVocabularies = await Vocabulary.count({ where: whereClause });
    const totalPages = Math.ceil(totalVocabularies / +limit);

    res.status(200).json({
      data: vocabularies.map(normalizeVocabulary),
      currentPage: +page,
      totalPages,
      totalItems: totalVocabularies,
    });
  }

  if (req.method === "POST") {
    let user_existing = null;

    const {
      user_id,
      word,
      image_url,
      pronunciation,
      speech_audio_url,
      meaning,
      example,
      context,
      status = "pending",
    } = req.body;

    if (user_id) {
      user_existing = await User.findOne({ where: { id: user_id } });
      if (!user_existing) {
        return res.status(400).json({ message: "User is not found" });
      }
    }

    if (!word || !meaning || !example || !context) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    let vocab = await Vocabulary.findOne({ where: { word, example } });

    if (vocab) {
      return res
        .status(200)
        .json({ message: "This word + example already exists" });
    }

    vocab = await Vocabulary.create({
      word,
      image_url,
      pronunciation,
      speech_audio_url,
      meaning,
      example,
      context,
      status,
    });

    if (user_existing) {
      Flashcard.create({ user_id: user_existing.id, vocabulary_id: vocab.id });
    }

    // const normalized = normalizeVocabulary(vocab);
    return res.status(201).json({ message: "Created successfully" });
  }

  return res.status(405).end();
}

export default withErrorHandler(handler, "Cannot get vocabularies list");
