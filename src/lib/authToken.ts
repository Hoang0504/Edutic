import { NextApiRequest } from "next";
import jwt from "jsonwebtoken";

export function getUserFromRequest(req: NextApiRequest) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new Error("Thiếu token xác thực");
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    return decoded;
  } catch (error) {
    throw new Error("Token không hợp lệ");
  }
}
