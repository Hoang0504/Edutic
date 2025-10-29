import { NextApiRequest, NextApiResponse } from "next";
import sequelize from "@/lib/db";
import { AIGeneratedContent } from "@/models/AIGeneratedContent";
import { withErrorHandler } from "@/lib/withErrorHandler";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  await sequelize.authenticate();

  if (req.method === "POST") {
    const { slug, type, content_id, prompt_used } = req.body;

    // Validate required fields
    if (!slug || !type || !content_id || !prompt_used) {
      return res.status(400).json({
        message:
          "Missing required fields (slug, type, content_id, prompt_used are required)",
      });
    }

    const validTypes = ["question", "part", "exam", "vocabulary", "dictionary"];
    if (!validTypes.includes(type)) {
      return res.status(400).json({
        message: `Invalid type. Must be one of: ${validTypes.join(", ")}`,
      });
    }

    // Check if slug already exists
    const existingPrompt = await AIGeneratedContent.findOne({
      where: { slug },
    });

    if (existingPrompt) {
      return res.status(409).json({
        message: "Prompt with this slug already exists",
      });
    }

    const newPrompt = await AIGeneratedContent.create({
      slug,
      type,
      content_id,
      prompt_used,
    });

    return res.status(201).json({
      message: "Prompt created successfully",
      data: {
        id: newPrompt.id,
        slug: newPrompt.slug,
        type: newPrompt.type,
      },
    });
  }
}

export default withErrorHandler(handler, "Cannot create prompt");
