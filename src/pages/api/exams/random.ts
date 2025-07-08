import { NextApiRequest, NextApiResponse } from "next";
import { Exam } from "@/models/Exam";
import { Part } from "@/models/Part";
import { ExamPart } from "@/models/ExamPart";
import sequelize from "@/lib/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    await sequelize.authenticate();

    const { include_parts, difficulty } = req.body;

    if (
      !include_parts ||
      !Array.isArray(include_parts) ||
      include_parts.length === 0
    ) {
      return res
        .status(400)
        .json({
          message: "include_parts is required and must be a non-empty array",
        });
    }

    if (!difficulty || !["easy", "medium", "hard"].includes(difficulty)) {
      return res
        .status(400)
        .json({
          message:
            "difficulty is required and must be 'easy', 'medium', or 'hard'",
        });
    }

    const transaction = await sequelize.transaction();

    try {
      const currentDate = new Date().toISOString().split("T")[0];
      const exam = await Exam.create(
        {
          title: `Random Practice ${currentDate}`,
          description: "Đề luyện ngẫu nhiên",
          type: "random",
          is_published: true,
          estimated_time: include_parts.length * 30, // Estimate 30 minutes per part
          created_at: new Date(),
          updated_at: new Date(),
        } as any,
        { transaction }
      );

      // 2. For each part_number in include_parts, find random part
      const selectedParts = [];

      for (let i = 0; i < include_parts.length; i++) {
        const partNumber = include_parts[i];

        // Find random part with part_number and difficulty
        const randomPart = await Part.findOne({
          where: {
            part_number: partNumber,
            difficulty_level: difficulty,
          },
          order: sequelize.random(), // ORDER BY RAND()
          transaction: transaction,
        });

        if (!randomPart) {
          await transaction.rollback();
          return res.status(404).json({
            message: `No part found with part_number ${partNumber} and difficulty ${difficulty}`,
          });
        }

        selectedParts.push(randomPart);

        await ExamPart.create(
          {
            exam_id: exam.id,
            part_id: randomPart.id,
            order_index: i + 1,
          } as any,
          { transaction }
        );
      }

      await transaction.commit();

      // Return created exam with selected parts info
      return res.status(201).json({
        exam: {
          id: exam.id,
          title: exam.title,
          description: exam.description,
          type: exam.type,
          estimated_time: exam.estimated_time,
          is_published: exam.is_published,
        },
        selected_parts: selectedParts.map((part, index) => ({
          id: part.id,
          part_number: part.part_number,
          title: part.title,
          difficulty_level: part.difficulty_level,
          order_index: index + 1,
        })),
        message: "Random exam created successfully",
      });
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  } catch (error) {
    console.error("Error creating random exam:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
