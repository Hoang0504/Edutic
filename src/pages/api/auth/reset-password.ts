import type { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcryptjs';
import { Op } from 'sequelize';
import { User } from '@/models/User';
import { sequelize } from '@/lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Ensure database connection
    await sequelize.authenticate();

    const { action } = req.body;

    if (action === 'request') {
      // Handle reset password request - send token via email
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

      // Generate reset token
      const resetToken = Math.floor(100000 + Math.random() * 900000).toString();
      const resetTokenExpires = new Date();
      resetTokenExpires.setHours(resetTokenExpires.getHours() + 24); // Token expires in 24 hours (same as register)

      // Update user with reset token
      await user.update({
        verification_token: resetToken,
        verification_token_expires: resetTokenExpires
      });

      console.log('Reset token generated for user:', user.id);
      console.log('Reset token:', resetToken);
      console.log('Token expires at:', resetTokenExpires);
      
      // Verify token was saved by re-fetching user
      const updatedUser = await User.findOne({ where: { email } });
      console.log('Verification: saved token in DB:', updatedUser?.verification_token);
      console.log('Verification: saved expiry in DB:', updatedUser?.verification_token_expires);

      // Return success with token for client-side email sending
      return res.status(200).json({
        message: 'Reset code has been sent',
        resetToken: resetToken,
        email: user.email,
        name: user.name
      });

    } else if (action === 'reset') {
      // Handle password reset with token
      const { email, token, newPassword } = req.body;

      console.log('Reset password request received:', { email, token: token ? 'TOKEN_PROVIDED' : 'NO_TOKEN', newPassword: newPassword ? 'PASSWORD_PROVIDED' : 'NO_PASSWORD' });

      if (!email || !token || !newPassword) {
        console.log('Missing required fields:', { email: !!email, token: !!token, newPassword: !!newPassword });
        return res.status(400).json({ message: 'Email, token, and new password are required' });
      }

      if (newPassword.length < 6) {
        console.log('Password too short:', newPassword.length);
        return res.status(400).json({ message: 'Password must be at least 6 characters' });
      }

      console.log('Looking for user with email:', email, 'and token:', token);

      // Find user with matching email and valid token
      const user = await User.findOne({
        where: {
          email: email,
          verification_token: token,
          verification_token_expires: {
            [Op.gt]: new Date() // Token not expired
          }
        }
      });

      console.log('Database query result:', user ? 'USER_FOUND' : 'USER_NOT_FOUND');

      if (!user) {
        console.log('User not found with provided token and email or token expired');
        // Let's also check if user exists with different conditions
        const userWithEmail = await User.findOne({ where: { email } });
        if (userWithEmail) {
          console.log('User exists but token mismatch. User token:', userWithEmail.verification_token, 'Provided token:', token);
          console.log('Token expires at:', userWithEmail.verification_token_expires, 'Current time:', new Date());
          console.log('Is token expired?', userWithEmail.verification_token_expires < new Date());
          console.log('Token comparison:', userWithEmail.verification_token === token);
        } else {
          console.log('User with email not found at all');
        }
        return res.status(400).json({ message: 'Invalid or expired reset token' });
      }

      console.log('User found, proceeding with password reset for user ID:', user.id);

      // Hash new password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);

      // Update user password and clear reset token
      await user.update({
        password_hash: hashedPassword,
        verification_token: undefined,
        verification_token_expires: undefined
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