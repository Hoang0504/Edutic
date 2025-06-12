import type { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
import { User } from '@/models/User';
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

    if (req.method === 'PUT') {
      try {
        const { avatar } = req.body;

        if (!avatar || typeof avatar !== 'string') {
          return res.status(400).json({ message: 'Avatar URL is required and must be a string' });
        }

        try {
          new URL(avatar);
        } catch {
          return res.status(400).json({ message: 'Invalid avatar URL format' });
        }

        await User.update(
          { 
            avatar: avatar,
            updated_at: new Date()
          },
          { where: { id: userId } }
        );

        const updatedUser = await User.findByPk(userId, {
          attributes: ['id', 'email', 'name', 'avatar', 'role']
        });

        return res.status(200).json({
          message: 'Avatar updated successfully',
          user: {
            id: updatedUser!.id,
            email: updatedUser!.email,
            name: updatedUser!.name,
            avatar: updatedUser!.avatar,
            role: updatedUser!.role
          }
        });

      } catch (error) {
        console.error('Update avatar error:', error);
        return res.status(500).json({ message: 'Error updating avatar' });
      }

    } else if (req.method === 'DELETE') {
      try {
        await User.update(
          { 
            avatar: '',
            updated_at: new Date()
          },
          { where: { id: userId } }
        );

        return res.status(200).json({
          message: 'Avatar removed successfully'
        });

      } catch (error) {
        console.error('Remove avatar error:', error);
        return res.status(500).json({ message: 'Error removing avatar' });
      }

    } else {
      return res.status(405).json({ message: 'Method not allowed' });
    }

  } catch (error) {
    if (error instanceof Error && error.message.includes('token')) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    console.error('Avatar API error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
} 