import type { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcryptjs";
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

  const { email, password, name } = req.body;

  if (!email || !password || !name) {
    return res.status(400).json({
      success: false,
      data: { message: "Missing required fields" },
    });
  }

  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) {
    return res.status(400).json({
      success: false,
      data: { message: "Email already registered" },
    });
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await User.create({
    email,
    password_hash: hashedPassword,
    name,
    is_email_verified: false,
    auth_provider: "email",
    role: "student", // Default role
    uuid: crypto.randomUUID(),
    created_at: new Date(),
    updated_at: new Date(),
  } as any);

  console.log("User created successfully:", user.id);

  return res.status(201).json({
    success: true,
    data: {
      message: "Registration successful",
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    },
  });
}

export default withErrorHandler(
  handler,
  "Có lỗi xảy ra trong quá trình đăng ký"
);
 