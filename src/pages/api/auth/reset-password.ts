import type { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcryptjs';
import { User } from '@/models/User';
import sequelize from '@/lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Ensure database connection
    await sequelize.authenticate();

    const { action } = req.body;

    if (action === 'request') {
      // Handle reset password request - generate token for frontend
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({ message: 'Email is required' });
      }

      // Find user by email
      const user = await User.findOne({ where: { email } });
      if (!user) {
        // Don't reveal if email exists or not for security
        return res.status(200).json({ 
          message: 'If the email exists, a reset code has been sent.' 
        });
      }

      // Generate reset token for frontend to use
      const resetToken = Math.floor(100000 + Math.random() * 900000).toString();

      console.log('Reset token generated for user:', user.id);
      console.log('Reset token:', resetToken);

      // Return success with token for client-side email sending
      return res.status(200).json({
        message: 'Reset code has been sent',
        resetToken: resetToken,
        email: user.email,
        name: user.name
      });

    } else if (action === 'reset') {
      // Handle password reset - just update password
      const { email, newPassword } = req.body;

      console.log('Reset password request received:', { email, newPassword: newPassword ? 'PASSWORD_PROVIDED' : 'NO_PASSWORD' });

      if (!email || !newPassword) {
        console.log('Missing required fields:', { email: !!email, newPassword: !!newPassword });
        return res.status(400).json({ message: 'Email and new password are required' });
      }

      if (newPassword.length < 6) {
        console.log('Password too short:', newPassword.length);
        return res.status(400).json({ message: 'Password must be at least 6 characters' });
      }

      console.log('Looking for user with email:', email);

      // Find user with email
      const user = await User.findOne({
        where: {
          email: email
        }
      });

      console.log('Database query result:', user ? 'USER_FOUND' : 'USER_NOT_FOUND');

      if (!user) {
        console.log('User not found with provided email');
        return res.status(400).json({ message: 'User not found' });
      }

      console.log('User found, proceeding with password reset for user ID:', user.id);

      // Hash new password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);

      // Update user password
      await user.update({
        password_hash: hashedPassword,
        updated_at: new Date()
      });

      console.log('Password reset successfully for user:', user.id);

      return res.status(200).json({ 
        message: 'Password reset successfully' 
      });

    } else {
      return res.status(400).json({ message: 'Invalid action' });
    }

  } catch (error) {
    console.error('Reset password error:', error);
    return res.status(500).json({ 
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
} 