import { NextApiRequest, NextApiResponse } from "next";
import { User } from "@/models/User";
import sequelize from "@/lib/db";
import { withErrorHandler } from "@/lib/withErrorHandler";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  if (req.method === "POST") {
    await sequelize.authenticate();

    const { email, password_hash, name, role = "student" } = req.body;

    if (!email || !password_hash || !name) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const user = await User.create({
      email,
      password_hash,
      name,
      role,
      is_email_verified: false,
      auth_provider: "email",
    });
    return res.status(201).json(user);
  } else {
    res.status(405).end();
  }
}

export default withErrorHandler(handler, "Failed to create user");
