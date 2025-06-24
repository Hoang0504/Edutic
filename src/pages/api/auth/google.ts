import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import { User } from '@/models/User';
import sequelize from '@/lib/db';
import { withErrorHandler } from '@/lib/withErrorHandler';
import { randomUUID } from 'crypto';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      success: false, 
      data: { message: 'Method not allowed' } 
    });
  }

  await sequelize.authenticate();

  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ 
      success: false, 
      data: { message: 'Token is required' } 
    });
  }

  // Verify Google token
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: process.env.GOOGLE_CLIENT_ID
  });

  const payload = ticket.getPayload();
  if (!payload) {
    return res.status(400).json({ 
      success: false, 
      data: { message: 'Invalid token' } 
    });
  }

  const { email, name, sub: googleId } = payload;

  if (!email || !name) {
    return res.status(400).json({ 
      success: false, 
      data: { message: 'Required user information not available from Google' } 
    });
  }

  // Find or create user
  let user = await User.findOne({
    where: { 
      email 
    }
  });

  if (!user) {
    // Create new user
    user = await User.create({
      email,
      name,
      password_hash: '', // Google users don't need password
      auth_provider: 'google',
      auth_provider_id: googleId,
      is_email_verified: true, // Google emails are pre-verified
      role: 'student', // Changed from 'user' to 'student' to match database enum
      uuid: randomUUID(),
      created_at: new Date(),
      updated_at: new Date(),
    } as any);
  } else if (user.auth_provider !== 'google') {
    return res.status(400).json({ 
      success: false,
      data: { message: 'Email này đã được đăng ký bằng phương thức khác. Vui lòng đăng nhập bằng email/password.' }
    });
  }

  // Update last login
  await user.update({
    last_login: new Date(),
    updated_at: new Date(),
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

  // Set cookie
  res.setHeader('Set-Cookie', `auth-token=${jwtToken}; HttpOnly; Path=/; Max-Age=${7 * 24 * 60 * 60}; SameSite=Strict`);

  return res.status(200).json({
    success: true,
    data: {
      message: 'Đăng nhập Google thành công',
      token: jwtToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        is_email_verified: user.is_email_verified
      }
    }
  });
}

export default withErrorHandler(handler, 'Có lỗi xảy ra trong quá trình đăng nhập Google'); 