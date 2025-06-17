import { Flashcard } from "@/models/Flashcard";
import { User } from "@/models/User";
import { Vocabulary } from "@/models/Vocabulary";
import type { NextApiRequest, NextApiResponse } from "next";
// import { User, Flashcard, Vocabulary } from "@/lib/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Phương thức không được hỗ trợ" });
  }

  const { word, example, user_id } = req.body;

  if (!word || !example || !user_id) {
    return res.status(400).json({ message: "Thiếu thông tin bắt buộc." });
  }

  try {
    // Check if user exists
    const user = await User.findByPk(user_id);
    if (!user) {
      return res
        .status(401)
        .json({ message: "Người dùng không tồn tại hoặc chưa đăng nhập." });
    }

    let vocabulary = await Vocabulary.findOne({ where: { word, example } });

    if (!vocabulary) {
      // Insert new vocabulary with default values
      vocabulary = await Vocabulary.create({
        word,
        image_url: null,
        pronunciation: null,
        speech_audio_url: null,
        meaning: null,
        example,
        context: null,
        status: "pending",
      });
    }

    const flashcard = await Flashcard.findOne({
      where: { vocabulary_id: vocabulary.id, user_id },
    });

    if (!flashcard) {
      await Flashcard.create({
        user_id,
        vocabulary_id: vocabulary.id,
        mastery_level: 1,
        next_review_date: null,
        review_count: 0,
      });
    }

    return res.status(200).json({
      status: vocabulary.status,
      message: flashcard
        ? `Từ ${word} đã được thêm vào flashcard trước đó.`
        : `Flashcard mới đã được tạo cho từ ${word} với trạng thái ${vocabulary.status}.`,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Lỗi server." });
  }
}
