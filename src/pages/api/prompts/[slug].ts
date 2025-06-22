import { NextApiRequest, NextApiResponse } from "next";
import { Op } from "sequelize";
import sequelize from "@/lib/db";
import { AIGeneratedContent } from "@/models/AIGeneratedContent";
import { ApiUsage } from "@/models/ApiUsage";
import { withErrorHandler } from "@/lib/withErrorHandler";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  await sequelize.authenticate();
  const { userId, slug } = req.query;

  if (typeof userId !== "string" || typeof slug !== "string") {
    return res.status(400).json({
      message: "userId and slug parameters are required and must be strings",
    });
  }

  if (!slug) {
    return res.status(400).json({ message: "Slug parameter is required" });
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const usage = await ApiUsage.findOne({
    where: {
      user_id: userId,
      date: {
        [Op.gte]: today,
      },
    },
  });

  const maxDailyRequests = 20;
  if (usage && usage.request_count >= maxDailyRequests) {
    return res.status(429).json({
      message: "Daily API limit exceeded",
      limit: maxDailyRequests,
      remaining: 0,
    });
  }

  const promptContent = await AIGeneratedContent.findOne({
    where: { slug: slug.toString() },
    attributes: ["prompt_used", "type", "content_id"],
  });

  if (!promptContent) {
    return res.status(404).json({ message: "Prompt not found" });
  }

  if (usage && userId) {
    await usage.increment("request_count");
  } else {
    await ApiUsage.create({
      user_id: parseInt(userId!),
      request_count: 1,
      date: today.toISOString(),
    });

    return res.status(200).json({
      prompt: promptContent.prompt_used,
      content_type: promptContent.type,
      content_id: promptContent.content_id,
      remaining: usage
        ? maxDailyRequests - usage.request_count - 1
        : maxDailyRequests - 1,
    });
  }

  return res.status(405).end();
}

export default withErrorHandler(handler, "Cannot get prompt");
