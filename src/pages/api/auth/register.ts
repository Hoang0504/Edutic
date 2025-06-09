import type { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcryptjs";
import { User } from "@/models/User";
import { sequelize } from "@/lib/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    // Ensure database connection
    await sequelize.authenticate();

    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }
    
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      email,
      password_hash: hashedPassword,
      name,
      is_email_verified: false,
      auth_provider: "email",
      role: "user",
      created_at: new Date(),
      updated_at: new Date(),
    } as any);

    console.log("User created successfully:", user.id);

    return res.status(201).json({
      message: "Registration successful",
      userId: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    });
  } catch (error) {
    console.error("Registration error:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
