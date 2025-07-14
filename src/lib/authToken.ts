import jwt from "jsonwebtoken";
import { NextApiRequest, NextApiResponse } from "next";

export function verifyAuthToken(
  req: NextApiRequest,
  res: NextApiResponse
): { id: number } | null {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({ message: "Token not found." });
      return null;
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: number;
    };

    return { id: decoded.userId };
  } catch (error) {
    if (res) {
      res.status(403).json({ message: "Token không hợp lệ hoặc đã hết hạn." });
    }
    return null;
  }
}
