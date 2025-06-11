import { Flashcard } from "@/lib/db";
import dayjs from "dayjs";
import { NextApiRequest, NextApiResponse } from "next";
import { Op } from "sequelize";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET")
    return res.status(405).json({ message: "Method not allowed" });

  const user = { id: 1 }; //await getUserFromRequest(req);
  if (!user || !user.id) {
    return res
      .status(401)
      .json({ message: "Người dùng không hợp lệ hoặc chưa đăng nhập" });
  }

  const totalFlashcards = await Flashcard.count({
    where: {
      user_id: user.id,
      next_review_date: {
        [Op.lte]: dayjs().startOf("day").toDate(),
      },
    },
  });

  const groupCount = Math.ceil(totalFlashcards / 10);
  res.status(200).json({ totalFlashcards, groupCount });
}
