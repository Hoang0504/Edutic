import type { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcryptjs';
import { User } from '@/models/User';
import sequelize from '@/lib/db';
import { withErrorHandler } from '@/lib/withErrorHandler';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      message: 'Method not allowed'
    });
  }

  await sequelize.authenticate();

  const { action, email, newPassword } = req.body;

  if (action === 'request') {
    // Request reset token
    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }

    const user = await User.findOne({
      where: { email }
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Email not found'
      });
    }

    // Return user info for email sending (without sensitive data)
    return res.status(200).json({
      success: true,
      message: 'User found',
      resetToken: 'valid', // Frontend will generate actual code
      email: user.email,
      name: user.name
    });

  } else if (action === 'reset') {
    // Reset password
    if (!email || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Email and new password are required'
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters'
      });
    }

    const user = await User.findOne({
      where: { email }
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'User not found'
      });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update password
    await user.update({
      password_hash: hashedPassword,
      updated_at: new Date()
    });

    return res.status(200).json({
      success: true,
      message: 'Password reset successfully'
    });

  } else {
    return res.status(400).json({
      success: false,
      message: 'Invalid action'
    });
  }
}

export default withErrorHandler(
  handler,
  'Có lỗi xảy ra trong quá trình đặt lại mật khẩu'
); 