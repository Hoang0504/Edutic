import type { NextApiRequest, NextApiResponse } from 'next';
import { User } from '@/models/User';
import sequelize from '@/lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Ensure database connection
    await sequelize.authenticate();

    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    // Find user with email and not verified
    const user = await User.findOne({
      where: {
        email: email,
        is_email_verified: false
      }
    });

    if (!user) {
      return res.status(400).json({ message: 'User not found or already verified' });
    }

    await user.update({
      is_email_verified: true,
      updated_at: new Date()
    });

    return res.status(200).json({ message: 'Email verified successfully' });

  } catch (error) {
    console.error('Email verification error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
} 