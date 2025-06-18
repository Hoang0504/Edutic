import { NextApiRequest, NextApiResponse } from "next";
import { User } from "@/models/User";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;

  if (!id || isNaN(+id)) return res.status(400).json({ message: "Invalid ID" });

  try {
    if (req.method === "GET") {
      const user = await User.findByPk(id);
      if (!user) return res.status(404).json({ message: "User not found" });
      return res.status(200).json(user);
    }

    if (req.method === "PUT") {
      const user = await User.findByPk(id);
      if (!user) return res.status(404).json({ message: "User not found" });

      const { name, avatar, role } = req.body;
      await user.update({ name, avatar, role });
      return res.status(200).json(user);
    }

    if (req.method === "DELETE") {
      const user = await User.findByPk(id);
      if (!user) return res.status(404).json({ message: "User not found" });

      await user.destroy();
      return res.status(204).end();
    }

    res.status(405).end();
  } catch (error) {
    console.error("User handler error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
