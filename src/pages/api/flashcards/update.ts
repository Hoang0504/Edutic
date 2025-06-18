// import { getUserFromRequest } from "@/lib/authToken";
import dayjs from "dayjs";
import { NextApiRequest, NextApiResponse } from "next";

import { Flashcard } from "@/models/Flashcard";

const reviewIntervals: Record<number, number> = {
  0: 1,
  1: 2,
  2: 4,
  3: 7,
  4: 14,
  5: 30,
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "PATCH")
    return res.status(405).json({ message: "Phương thức không được hỗ trợ" });

  const user = { id: 1 }; //await getUserFromRequest(req);
  if (!user || !user.id) {
    return res
      .status(401)
      .json({ message: "Người dùng không hợp lệ hoặc chưa đăng nhập" });
  }

  const { id } = req.query;

  if (typeof id !== "string" || !id) {
    return res.status(400).json({ message: "ID của flashcard không hợp lệ" });
  }

  const flashcard = await Flashcard.findOne({
    where: { id, user_id: user.id },
  });
  if (!flashcard)
    return res.status(404).json({ message: "Flashcard không tồn tại" });

  flashcard.review_count += 1;
  if (flashcard.review_count >= 5 && flashcard.mastery_level < 5) {
    flashcard.mastery_level += 1; // Tăng level khi đủ 5 lần
    flashcard.review_count = 0; // Reset count
  }

  const days = reviewIntervals[flashcard.mastery_level];
  flashcard.next_review_date = dayjs().add(days, "day").toDate(); // Cập nhật ngày ôn

  await flashcard.save();
  res.status(200).json({ message: "Cập nhật thành công" });
}
