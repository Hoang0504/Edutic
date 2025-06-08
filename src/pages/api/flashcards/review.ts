// pages/api/flashcards/review.ts

import { NextApiRequest, NextApiResponse } from "next";
// import { verifyToken } from '@/lib/jwt';
import { Flashcard } from "@/models/Flashcard";
import { Vocabulary } from "@/models/Vocabulary";
import dayjs from "dayjs";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Phương thức không được hỗ trợ" });
  }

  //   const authHeader = req.headers.authorization;
  //   if (!authHeader || !authHeader.startsWith("Bearer ")) {
  //     return res.status(401).json({ message: "Thiếu token xác thực" });
  //   }

  //   const token = authHeader.split(" ")[1];
  const decoded = { id: 1 }; // verifyToken(token);
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
          lte: dayjs().toDate(),
        },
      },
      include: [
        {
          model: Vocabulary,
          attributes: ["word", "meaning", "example"],
          as: "vocabulary",
        },
      ],
    });

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
