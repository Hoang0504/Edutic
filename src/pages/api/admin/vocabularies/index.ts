import { Op } from "sequelize";
import { NextApiRequest, NextApiResponse } from "next";

import sequelize from "@/lib/db";
import { Vocabulary } from "@/models/Vocabulary";
import { normalizeVocabulary } from "@/utils/normalize";
import { withErrorHandler } from "@/lib/withErrorHandler";

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
    const {
      word,
      image_url,
      pronunciation,
      speech_audio_url,
      meaning,
      example,
      context,
      status = "pending",
    } = req.body;

    if (!word || !meaning || !example || !context) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const existing = await Vocabulary.findOne({ where: { word, example } });
    if (existing) {
      return res
        .status(200)
        .json({ message: "This word + example already exists" });
    }

    const vocab = await Vocabulary.create({
      word,
      image_url,
      pronunciation,
      speech_audio_url,
      meaning,
      example,
      context,
      status,
    });

    const normalized = normalizeVocabulary(vocab);
    return res.status(201).json(normalized);
  }

  return res.status(405).end();
}

export default withErrorHandler(handler, "Cannot get vocabularies list");
