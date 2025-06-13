import type { NextApiRequest, NextApiResponse } from 'next';
import { User } from '@/lib/db';
import { UserProfile } from '@/lib/db';
import { UserTargetSkill } from '@/models/UserTargetSkill';
import { Skill } from '@/models/Skill';
import { sequelize } from '@/lib/db';
import { withErrorHandler } from '@/lib/withErrorHandler';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Check method first
  if (req.method !== 'GET') {
    return res.status(405).json({ 
      success: false, 
      data: { message: 'Method not allowed' } 
    });
  }

  await sequelize.authenticate();

  const { id } = req.query;

  if (!id || isNaN(Number(id))) {
    return res.status(400).json({ 
      success: false, 
      data: { message: 'Invalid user ID' } 
    });
  }

  const userId = parseInt(id as string);

  const user = await User.findByPk(userId, {
    attributes: ['id', 'name', 'avatar', 'created_at'] 
  });

  if (!user) {
    return res.status(404).json({ 
      success: false, 
      data: { message: 'User not found' } 
    });
  }

  const userProfile = await UserProfile.findOne({
    where: { user_id: userId }
  });

  // Get user target skills with skill information
  const userTargetSkills = await UserTargetSkill.findAll({
    where: { user_id: userId },
    include: [
      {
        model: Skill,
        attributes: ['id', 'name', 'description']
      }
    ]
  });

  return res.status(200).json({
    success: true,
    data: {
      user: {
        id: user.id,
        name: user.name,
        avatar: user.avatar,
        created_at: user.created_at
      },
      profile: userProfile ? {
        study_time_preference: userProfile.study_time_preference,
        level: userProfile.level,
        created_at: userProfile.created_at
      } : null,
      target_skills: userTargetSkills.map(targetSkill => ({
        skill_id: targetSkill.skill_id,
        skill: {
          id: targetSkill.skill!.id,
          name: targetSkill.skill!.name,
          description: targetSkill.skill!.description
        },
        target_score: targetSkill.target_score
      }))
    }
  });
}

export default withErrorHandler(handler, 'Có lỗi xảy ra khi lấy thông tin hồ sơ công khai'); 