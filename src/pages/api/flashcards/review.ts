// pages/api/flashcards/review.ts

import { NextApiRequest, NextApiResponse } from "next";
import dayjs from "dayjs";
import { Op } from "sequelize";
import { Flashcard } from "@/models/Flashcard";
import { Vocabulary } from "@/models/Vocabulary";
import sequelize from "@/lib/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  await sequelize.authenticate();

  const group = parseInt(req.query.group as string) || 1;
  const limit = 10;
  const offset = (group - 1) * limit;

  //   const authHeader = req.headers.authorization;
  //   if (!authHeader || !authHeader.startsWith("Bearer ")) {
  //     return res.status(401).json({ message: "Thiếu token xác thực" });
  //   }

  //   const token = authHeader.split(" ")[1];
  const decoded = { id: 2 }; // verifyToken(token);
  if (!decoded || !decoded.id) {
    return res
      .status(401)
      .json({ message: "Người dùng không hợp lệ hoặc chưa đăng nhập" });
  }

  try {
    const flashcards = await Flashcard.findAll({
      where: {
        user_id: decoded.id,
        next_review_date: {
          [Op.lte]: dayjs().startOf("day").toDate(),
        },
      },
      include: [
        {
          model: Vocabulary,
          attributes: ["word", "meaning", "example"],
          as: "vocabulary",
        },
      ],
      order: [["next_review_date", "ASC"]],
      limit, // Giới hạn số lượng flashcards trả về
      offset, // Bỏ qua số lượng flashcards đã có trong các nhóm trước
    });

    if (!flashcards || flashcards.length === 0) {
      return res
        .status(404)
        .json({ message: "Không có thẻ flash nào cần ôn tập" });
    }

    const result = flashcards.map((f) => ({
      id: f.id,
      word: f.vocabulary?.word,
      meaning: f.vocabulary?.meaning,
      example: f.vocabulary?.example,
      next_review_date: f.next_review_date,
    }));

    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ message: "Lỗi máy chủ", error });
  }
}
