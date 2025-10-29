import type { NextApiRequest, NextApiResponse } from 'next';
import { User } from '@/lib/db';
import { sequelize } from '@/lib/db';
import { withErrorHandler } from '@/lib/withErrorHandler';
import { getUserFromRequest } from '@/lib/authToken';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Check method first
  if (!['PUT', 'DELETE'].includes(req.method!)) {
    return res.status(405).json({ 
      success: false, 
      data: { message: 'Method not allowed' } 
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
      data: { message: error instanceof Error ? error.message : 'Unauthorized' } 
    });
  }

  const { userId } = decoded;

  if (req.method === 'PUT') {
    const { avatar } = req.body;

    if (!avatar || typeof avatar !== 'string') {
      return res.status(400).json({ 
        success: false, 
        data: { message: 'Avatar URL is required and must be a string' } 
      });
    }

    try {
      new URL(avatar);
    } catch {
      return res.status(400).json({ 
        success: false, 
        data: { message: 'Invalid avatar URL format' } 
      });
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
      success: true,
      data: {
        message: 'Avatar updated successfully',
        user: {
          id: updatedUser!.id,
          email: updatedUser!.email,
          name: updatedUser!.name,
          avatar: updatedUser!.avatar,
          role: updatedUser!.role
        }
      }
    });

  } else if (req.method === 'DELETE') {
    await User.update(
      { 
        avatar: '',
        updated_at: new Date()
      },
      { where: { id: userId } }
    );

    return res.status(200).json({
      success: true,
      data: {
        message: 'Avatar removed successfully'
      }
    });
  }
}

export default withErrorHandler(handler, 'Có lỗi xảy ra khi xử lý avatar người dùng'); 