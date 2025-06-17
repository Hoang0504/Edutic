import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import db from '@/models';
import { serialize } from 'cookie';


const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { token } = req.body;

    // Verify Google token
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID
    });

    const payload = ticket.getPayload();
    if (!payload) {
      return res.status(400).json({ message: 'Invalid token' });
    }

    const { email, name, sub: googleId } = payload;

    // Find or create user
    let user = await (db as any).User.findOne({
      where: { 
        email 
      }
    });

    if (!user) {
      // Create new user
      user = await (db as any).User.create({
        email,
        name,
        auth_provider: 'google',
        auth_provider_id: googleId,
        is_email_verified: true, // Google emails are pre-verified
        role: 'student'
      });
    } else if (user.auth_provider !== 'google') {
      return res.status(400).json({ 
        message: 'This email is already registered with a different authentication method' 
      });
    }

    // Update last login
    await user.update({
      last_login: new Date()
    });

    // Generate JWT
    const jwtToken = jwt.sign(
      { 
        userId: user.id,
        role: user.role 
      },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    );

    const cookie = serialize('token', jwtToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/'
    });

    res.setHeader('Set-Cookie', cookie);

    return res.status(200).json({
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    });

  } catch (error) {
    console.error('Google authentication error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
} 