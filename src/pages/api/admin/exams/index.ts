import type { NextApiRequest, NextApiResponse } from "next";
import { withErrorHandler } from "@/lib/withErrorHandler";
import { Exam } from "@/models/Exam";
import { Part } from "@/models/Part";
import { ExamPart } from "@/models/ExamPart";
import sequelize from "@/lib/db";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  await sequelize.authenticate();

  if (req.method === "GET") {
    try {
      // Get all exams with their parts
      const exams = await Exam.findAll({
        include: [
          {
            model: ExamPart,
            include: [
              {
                model: Part,
                attributes: ['id', 'part_number', 'title', 'description', 'difficulty_level']
              }
            ]
          }
        ],
        order: [['created_at', 'DESC']]
      });

      return res.status(200).json({
        success: true,
        data: {
          exams: exams.map(exam => ({
            id: exam.id,
            title: exam.title,
            type: exam.type,
            description: exam.description,
            estimated_time: exam.estimated_time,
            year_of_release: exam.year_of_release,
            is_published: exam.is_published,
            created_at: exam.created_at,
            parts_count: exam.examParts?.length || 0,
            parts: exam.examParts?.map((ep: any) => ({
              part_number: ep.part?.part_number,
              title: ep.part?.title,
              difficulty_level: ep.part?.difficulty_level
            })) || []
          }))
        }
      });

    } catch (error) {
      console.error("Get exams error:", error);
      return res.status(500).json({
        success: false,
        data: { message: "Lỗi khi lấy danh sách đề thi" }
      });
    }
  }

  if (req.method === "POST") {
    try {
      const { title, type, description, estimated_time, year_of_release } = req.body;

      // Validate required fields
      if (!title || !description) {
        return res.status(400).json({
          success: false,
          data: { message: "Title and description are required" }
        });
      }

      // Create exam
      const exam = await Exam.create({
        title,
        type: type || 'full_test',
        description,
        estimated_time: estimated_time || 120,
        year_of_release: year_of_release || new Date().getFullYear(),
        is_published: false,
        created_at: new Date(),
        updated_at: new Date()
      });

      return res.status(201).json({
        success: true,
        data: {
          message: "Đề thi đã được tạo thành công",
          exam: {
            id: exam.id,
            title: exam.title,
            type: exam.type,
            description: exam.description,
            estimated_time: exam.estimated_time,
            year_of_release: exam.year_of_release,
            is_published: exam.is_published
          }
        }
      });

    } catch (error) {
      console.error("Create exam error:", error);
      return res.status(500).json({
        success: false,
        data: { message: "Lỗi khi tạo đề thi" }
      });
    }
  }

  return res.status(405).json({
    success: false,
    data: { message: "Method not allowed" }
  });
}

export default withErrorHandler(handler, "Có lỗi xảy ra khi xử lý yêu cầu exam"); 