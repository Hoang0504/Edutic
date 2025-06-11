import type { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
import { User } from '@/models/User';
import { UserProfile } from '@/models/UserProfile';
import { sequelize } from '@/lib/db';

interface AuthenticatedRequest extends NextApiRequest {
  user?: {
    userId: number;
    role: string;
  };
}

interface DecodedToken {
  userId: number;
  role: string;
  iat?: number;
  exp?: number;
}

// verify JWT token
const verifyToken = (req: AuthenticatedRequest): Promise<DecodedToken> => {
  return new Promise((resolve, reject) => {
    const token = req.cookies.token;

    if (!token) {
      reject(new Error('No token provided'));
      return;
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as DecodedToken;
      resolve(decoded);
    } catch (error) {
      reject(new Error('Invalid token'));
    }
  });
};

const authenticateUser = async (req: AuthenticatedRequest): Promise<DecodedToken> => {
  try {
    const decoded = await verifyToken(req);
    req.user = decoded;
    return decoded;
  } catch (error) {
    throw error;
  }
};

export default async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  try {
    await sequelize.authenticate();

    const decoded = await authenticateUser(req);
    const { userId } = decoded;

    if (req.method === 'GET') {
      try {
        const user = await User.findByPk(userId, {
          attributes: ['id', 'email', 'name', 'avatar', 'role', 'created_at']
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
            email: user.email,
            name: user.name,
            avatar: user.avatar,
            role: user.role,
            created_at: user.created_at
          },
          profile: userProfile ? {
            target_score: userProfile.target_score,
            study_time_preference: userProfile.study_time_preference,
            level: userProfile.level,
            created_at: userProfile.created_at,
            updated_at: userProfile.updated_at
          } : null
        });

      } catch (error) {
        console.error('Get profile error:', error);
        return res.status(500).json({ message: 'Error fetching profile' });
      }

    } else if (req.method === 'PUT') {
      try {
        const { 
          name, 
          avatar, 
          target_score, 
          study_time_preference, 
          level 
        } = req.body;

        if (level && !['beginner', 'intermediate', 'advanced'].includes(level)) {
          return res.status(400).json({ message: 'Invalid level. Must be beginner, intermediate, or advanced' });
        }

        if (target_score !== undefined && (target_score < 0 || target_score > 1000)) {
          return res.status(400).json({ message: 'Target score must be between 0 and 1000' });
        }

        if (study_time_preference !== undefined && (study_time_preference < 1 || study_time_preference > 480)) {
          return res.status(400).json({ message: 'Study time preference must be between 1 and 480 minutes' });
        }

        const transaction = await sequelize.transaction();

        try {
          if (name !== undefined || avatar !== undefined) {
            const updateData: any = { updated_at: new Date() };
            if (name !== undefined) updateData.name = name;
            if (avatar !== undefined) updateData.avatar = avatar;

            await User.update(updateData, {
              where: { id: userId },
              transaction
            });
          }

          if (target_score !== undefined || study_time_preference !== undefined || level !== undefined) {
            const profileData: any = { updated_at: new Date() };
            if (target_score !== undefined) profileData.target_score = target_score;
            if (study_time_preference !== undefined) profileData.study_time_preference = study_time_preference;
            if (level !== undefined) profileData.level = level;

            const [userProfile, created] = await UserProfile.findOrCreate({
              where: { user_id: userId },
              defaults: {
                user_id: userId,
                target_score: target_score ?? 0,
                study_time_preference: study_time_preference ?? 30,
                level: level ?? 'beginner',
                created_at: new Date(),
                updated_at: new Date()
              } as any,
              transaction
            });

            if (!created) {
              await userProfile.update(profileData, { transaction });
            }
          }

          await transaction.commit();

          const updatedUser = await User.findByPk(userId, {
            attributes: ['id', 'email', 'name', 'avatar', 'role', 'created_at']
          });

          const updatedProfile = await UserProfile.findOne({
            where: { user_id: userId }
          });

          return res.status(200).json({
            message: 'Profile updated successfully',
            user: {
              id: updatedUser!.id,
              email: updatedUser!.email,
              name: updatedUser!.name,
              avatar: updatedUser!.avatar,
              role: updatedUser!.role,
              created_at: updatedUser!.created_at
            },
            profile: updatedProfile ? {
              target_score: updatedProfile.target_score,
              study_time_preference: updatedProfile.study_time_preference,
              level: updatedProfile.level,
              created_at: updatedProfile.created_at,
              updated_at: updatedProfile.updated_at
            } : null
          });

        } catch (error) {
          await transaction.rollback();
          throw error;
        }

      } catch (error) {
        console.error('Update profile error:', error);
        return res.status(500).json({ message: 'Error updating profile' });
      }

    } else if (req.method === 'DELETE') {
      try {
        const transaction = await sequelize.transaction();

        try {
          await UserProfile.destroy({
            where: { user_id: userId },
            transaction
          });

          await User.update(
            { 
              avatar: '',
              updated_at: new Date()
            },
            { 
              where: { id: userId },
              transaction
            }
          );

          await transaction.commit();

          return res.status(200).json({
            message: 'Profile reset successfully'
          });

        } catch (error) {
          await transaction.rollback();
          throw error;
        }

      } catch (error) {
        console.error('Reset profile error:', error);
        return res.status(500).json({ message: 'Error resetting profile' });
      }

    } else {
      return res.status(405).json({ message: 'Method not allowed' });
    }

  } catch (error) {
    if (error instanceof Error && error.message.includes('token')) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    console.error('Profile API error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
} 