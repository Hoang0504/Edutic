import type { NextApiRequest, NextApiResponse } from "next";

import { withErrorHandler } from "@/lib/withErrorHandler";
import { deleteExamWithCascade } from "@/lib/examService";
import sequelize from "@/lib/db";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { examId } = req.query;

  if (!examId || Array.isArray(examId) || isNaN(Number(examId))) {
    return res.status(400).json({ success: false, data: { message: "Invalid examId" } });
  }

  const id = Number(examId);

  await sequelize.authenticate();

  if (req.method === "DELETE") {
    try {
      await deleteExamWithCascade(id);

      return res.status(200).json({
        success: true,
        data: { message: "Đã xoá đề thi và toàn bộ dữ liệu liên quan" },
      });
    } catch (error) {
      console.error("Delete exam error:", error);
      return res.status(500).json({
        success: false,
        data: { message: "Có lỗi xảy ra khi xoá đề thi" },
      });
    }
  }

  return res.status(405).json({ success: false, data: { message: "Method not allowed" } });
}

export default withErrorHandler(handler, "Lỗi khi xoá đề thi"); 