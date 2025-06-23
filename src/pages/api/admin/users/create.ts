import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
import { NextApiRequest, NextApiResponse } from "next";

import sequelize from "@/lib/db";
import { User } from "@/models/User";
import { normalizeUser } from "@/utils/normalize";
import { withErrorHandler } from "@/lib/withErrorHandler";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  if (req.method === "POST") {
    await sequelize.authenticate();

    const { email, password, avatar = null, role = "admin" } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ message: "Email already in use" });
    }

    const password_hash = await bcrypt.hash(password, 10);

    const user = await User.create({
      email,
      avatar,
      password_hash,
      role,
      is_email_verified: true,
      auth_provider: "email",
      uuid: uuidv4(),
      created_at: new Date(),   
  updated_at: new Date(),  
    });
    return res.status(201).json(normalizeUser(user));
  } else {
    res.status(405).end();
  }
}

export default withErrorHandler(handler, "Failed to create user");
