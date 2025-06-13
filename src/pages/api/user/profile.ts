import type { NextApiRequest, NextApiResponse } from "next";
import { User } from "@/lib/db";
import { UserProfile } from "@/lib/db";
import { UserTargetSkill } from "@/models/UserTargetSkill";
import { Skill } from "@/models/Skill";
import { sequelize } from "@/lib/db";
import { withErrorHandler } from "@/lib/withErrorHandler";
import { getUserFromRequest } from "@/lib/authToken";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Check method first
  if (!["GET", "PUT", "DELETE"].includes(req.method!)) {
    return res.status(405).json({
      success: false,
      data: { message: "Method not allowed" },
    });
  }

  await sequelize.authenticate();

  // Check for authentication errors specifically
  let decoded;
  try {
    decoded = getUserFromRequest(req);
  } catch (error) {
    return res.status(401).json({
      success: false,
      data: { message: error instanceof Error ? error.message : "Unauthorized" },
    });
  }

  const { userId } = decoded;

  if (req.method === "GET") {
    const user = await User.findByPk(userId, {
      attributes: ["id", "email", "name", "avatar", "role", "created_at"],
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        data: { message: "User not found" },
      });
    }

    const userProfile = await UserProfile.findOne({
      where: { user_id: userId },
    });

    // Get user target skills with skill information
    const userTargetSkills = await UserTargetSkill.findAll({
      where: { user_id: userId },
      include: [
        {
          model: Skill,
          attributes: ["id", "name", "description"],
        },
      ],
    });

    return res.status(200).json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          avatar: user.avatar,
          role: user.role,
          created_at: user.created_at,
        },
        profile: userProfile
          ? {
              study_time_preference: userProfile.study_time_preference,
              level: userProfile.level,
              created_at: userProfile.created_at,
              updated_at: userProfile.updated_at,
            }
          : null,
        target_skills: userTargetSkills.map((targetSkill) => ({
          skill_id: targetSkill.skill_id,
          skill: {
            id: targetSkill.skill!.id,
            name: targetSkill.skill!.name,
            description: targetSkill.skill!.description,
          },
          target_score: targetSkill.target_score,
        })),
      },
    });
  } else if (req.method === "PUT") {
    const { name, avatar, study_time_preference, level, target_skills } =
      req.body;

    if (level && !["beginner", "intermediate", "advanced"].includes(level)) {
      return res.status(400).json({
        success: false,
        data: {
          message: "Invalid level. Must be beginner, intermediate, or advanced",
        },
      });
    }

    if (
      study_time_preference !== undefined &&
      (study_time_preference < 1 || study_time_preference > 480)
    ) {
      return res.status(400).json({
        success: false,
        data: {
          message: "Study time preference must be between 1 and 480 minutes",
        },
      });
    }

    // Validate target_skills if provided
    if (target_skills && Array.isArray(target_skills)) {
      for (const targetSkill of target_skills) {
        if (!targetSkill.skill_id || typeof targetSkill.skill_id !== "number") {
          return res.status(400).json({
            success: false,
            data: { message: "Each target skill must have a valid skill_id" },
          });
        }
        if (
          !targetSkill.target_score ||
          targetSkill.target_score < 0 ||
          targetSkill.target_score > 1000
        ) {
          return res.status(400).json({
            success: false,
            data: { message: "Target score must be between 0 and 1000" },
          });
        }
      }
    }

    if (name !== undefined || avatar !== undefined) {
      const updateData: any = { updated_at: new Date() };
      if (name !== undefined) updateData.name = name;
      if (avatar !== undefined) updateData.avatar = avatar;

      await User.update(updateData, {
        where: { id: userId },
      });
    }

    if (study_time_preference !== undefined || level !== undefined) {
      const profileData: any = { updated_at: new Date() };
      if (study_time_preference !== undefined)
        profileData.study_time_preference = study_time_preference;
      if (level !== undefined) profileData.level = level;

      const [userProfile, created] = await UserProfile.findOrCreate({
        where: { user_id: userId },
        defaults: {
          user_id: userId,
          study_time_preference: study_time_preference ?? 30,
          level: level ?? "beginner",
          created_at: new Date(),
          updated_at: new Date(),
        } as any,
      });

      if (!created) {
        await userProfile.update(profileData);
      }
    }

    // Update target skills if provided
    if (target_skills && Array.isArray(target_skills)) {
      // Delete existing target skills for this user
      await UserTargetSkill.destroy({
        where: { user_id: userId },
      });

      // Insert new target skills
      for (const targetSkill of target_skills) {
        await UserTargetSkill.create({
          user_id: userId,
          skill_id: Number(targetSkill.skill_id),
          target_score: Number(targetSkill.target_score),
        } as any);
      }
    }

    const updatedUser = await User.findByPk(userId, {
      attributes: ["id", "email", "name", "avatar", "role", "created_at"],
    });

    const updatedProfile = await UserProfile.findOne({
      where: { user_id: userId },
    });

    // Get updated target skills
    const updatedTargetSkills = await UserTargetSkill.findAll({
      where: { user_id: userId },
      include: [
        {
          model: Skill,
          attributes: ["id", "name", "description"],
        },
      ],
    });

    return res.status(200).json({
      success: true,
      data: {
        message: "Profile updated successfully",
        user: {
          id: updatedUser!.id,
          email: updatedUser!.email,
          name: updatedUser!.name,
          avatar: updatedUser!.avatar,
          role: updatedUser!.role,
          created_at: updatedUser!.created_at,
        },
        profile: updatedProfile
          ? {
              study_time_preference: updatedProfile.study_time_preference,
              level: updatedProfile.level,
              created_at: updatedProfile.created_at,
              updated_at: updatedProfile.updated_at,
            }
          : null,
        target_skills: updatedTargetSkills.map((targetSkill) => ({
          skill_id: targetSkill.skill_id,
          skill: {
            id: targetSkill.skill!.id,
            name: targetSkill.skill!.name,
            description: targetSkill.skill!.description,
          },
          target_score: targetSkill.target_score,
        })),
      },
    });
  } else if (req.method === "DELETE") {
    await UserProfile.destroy({
      where: { user_id: userId },
    });

    // Also delete target skills
    await UserTargetSkill.destroy({
      where: { user_id: userId },
    });

    await User.update(
      {
        avatar: "",
        updated_at: new Date(),
      },
      {
        where: { id: userId },
      }
    );

    return res.status(200).json({
      success: true,
      data: {
        message: "Profile reset successfully",
      },
    });
  }
}

export default withErrorHandler(
  handler,
  "Có lỗi xảy ra khi xử lý thông tin hồ sơ người dùng"
);
