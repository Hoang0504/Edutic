import { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcryptjs';
import { Sequelize } from '@/lib/db';
import { UserModel } from '@/models/user';
// const { Sequelize, DataTypes } = require('sequelize');

// // Load models directly
// const config = require('@/config/config.json')['development'];
// const sequelize = new Sequelize(config.database, config.username, config.password, config);

// const UserModel = require('@/models/user.js')(sequelize, DataTypes);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const existingUser = await UserModel.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Generate verification token
    const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();
    const verificationTokenExpires = new Date();
    verificationTokenExpires.setHours(verificationTokenExpires.getHours() + 24); // Token expires in 24 hours

    const user = await UserModel.create({
      email,
      password_hash: hashedPassword,
      name,
      is_email_verified: false,
      auth_provider: 'email',
      role: 'student',
      verification_token: verificationToken,
      verification_token_expires: verificationTokenExpires
    });

    console.log('User created successfully:', user.id);
    console.log('Verification token:', verificationToken);

    return res.status(201).json({
      message: 'Registration successful',
      userId: user.id,
      email: user.email,
      name: user.name,
      verificationToken: verificationToken 
    });

  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ 
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
} 