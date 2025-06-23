import { NextApiRequest, NextApiResponse } from "next";
import { User } from "@/models/User";
import { withErrorHandler } from "@/lib/withErrorHandler";
import sequelize from "@/lib/db";
import { normalizeUser } from "@/utils/normalize";
import bcrypt from "bcryptjs";

type UpdateUserPayload = {
  email?: string;
  name?: string;
  avatar?: string;
  role?: "student" | "admin";
  password_hash?: string;
};

async function handler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void | NextApiResponse<unknown>> {
  await sequelize.authenticate();

  const { id } = req.query;

  if (!id || isNaN(+id)) return res.status(400).json({ message: "Invalid ID" });

  if (req.method === "GET") {
    const user = await User.findByPk(id.toString());
    if (!user) return res.status(404).json({ message: "User not found" });
    return res.status(200).json(normalizeUser(user));
  }

 if (req.method === "PUT") {
  try {
    const user = await User.findByPk(id.toString());
    if (!user) return res.status(404).json({ message: "User not found" });

    const { email, name, avatar, password, role } = req.body;
    const updateData: UpdateUserPayload = {};

    if (email) {
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser && existingUser.id !== user.id) {
        return res.status(409).json({ message: "Email already in use" });
      }
      updateData.email = email;
    }
    if (name) updateData.name = name;
    if (avatar) updateData.avatar = avatar;
    if (role) updateData.role = role;
    if (password) {
      updateData.password_hash = await bcrypt.hash(password, 10);
    }

    console.log("Update data:", updateData); // Thêm dòng này để log dữ liệu gửi lên

    await user.update(updateData);
    return res.status(200).json(normalizeUser(user));
  } catch (err) {
    console.error("Update user error:", err); // Log lỗi chi tiết
    return res.status(500).json({ message: "Internal server error", error: err instanceof Error ? err.message : err });
  }
}

  if (req.method === "DELETE") {
    const user = await User.findByPk(id.toString());
    if (!user) return res.status(404).json({ message: "User not found" });

    await user.destroy();
    return res.status(204).json({ message: "User deleted" });
  }

  res.status(405).end();
}

export default withErrorHandler(handler, "Failed to handle user request");
