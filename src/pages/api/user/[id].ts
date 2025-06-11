import type { NextApiRequest, NextApiResponse } from 'next';
import { User } from '@/models/User';
import { UserProfile } from '@/models/UserProfile';
import { sequelize } from '@/lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    await sequelize.authenticate();

    const { id } = req.query;

    if (!id || isNaN(Number(id))) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }

    const userId = parseInt(id as string);

    if (req.method === 'GET') {
      try {
        const user = await User.findByPk(userId, {
          attributes: ['id', 'name', 'avatar', 'created_at'] 
        });

        if (!user) {
          return res.status(404).json({ message: 'User not found' });
        }

        const userProfile = await UserProfile.findOne({
          where: { user_id: userId }
        });

        return res.status(200).json({
          user: {
            id: user.id,
            name: user.name,
            avatar: user.avatar,
            created_at: user.created_at
          },
          profile: userProfile ? {
            level: userProfile.level,
            created_at: userProfile.created_at
            // Note: Không trả về target_score và study_time_preference vì đây là thông tin private
          } : null
        });

      } catch (error) {
        console.error('Get public profile error:', error);
        return res.status(500).json({ message: 'Error fetching user profile' });
      }

    } else {
      return res.status(405).json({ message: 'Method not allowed' });
    }

  } catch (error) {
    console.error('Public profile API error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
} 