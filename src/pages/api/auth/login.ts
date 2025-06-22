import type { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "@/models/User";
import sequelize from "@/lib/db";
import { withErrorHandler } from "@/lib/withErrorHandler";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      data: { message: "Method not allowed" },
    });
  }

  await sequelize.authenticate();

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      data: { message: "Email and password are required" },
    });
  }

  const user = await User.findOne({
    where: { email },
  });

  if (!user) {
    return res.status(401).json({
      success: false,
      data: { message: "Invalid credentials" },
    });
  }

  const isValidPassword = await bcrypt.compare(password, user.password_hash);
  if (!isValidPassword) {
    return res.status(401).json({
      success: false,
      data: { message: "Invalid credentials" },
    });
  }

  // Check if email is verified
  if (!user.is_email_verified) {
    return res.status(401).json({
      success: false,
      data: { 
        message: "Please verify your email before logging in",
        emailNotVerified: true,
        email: user.email
      },
    });
  }

  await user.update({
    last_login: new Date(),
    updated_at: new Date(),
  });

  const token = jwt.sign(
    {
      userId: user.id,
      role: user.role,
    },
    process.env.JWT_SECRET!,
    { expiresIn: "7d" }
  );

  return res.status(200).json({
    success: true,
    data: {
      message: "Login successful",
      token: token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        is_email_verified: user.is_email_verified,
      },
    },
  });
}

export default withErrorHandler(
  handler,
  "Có lỗi xảy ra trong quá trình đăng nhập"
);
