import { NextApiRequest, NextApiResponse } from 'next';
import db from '@/models';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ message: 'Verification token is required' });
    }

    // Find user with matching token
    const user = await (db as any).User.findOne({
      where: {
        verification_token: token,
        is_email_verified: false,
        verification_token_expires: {
          [(db as any).Sequelize.Op.gt]: new Date() // Token not expired
        }
      }
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired verification token' });
    }


    await user.update({
      is_email_verified: true,
      verification_token: null,
      verification_token_expires: null
    });

    return res.status(200).json({ message: 'Email verified successfully' });

  } catch (error) {
    console.error('Email verification error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
} 