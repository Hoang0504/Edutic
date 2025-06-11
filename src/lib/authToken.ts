import jwt from "jsonwebtoken";
import { NextApiRequest } from "next";

import DecodedToken from "@/interfaces/decodedToken";

export function getUserFromRequest(req: NextApiRequest) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new Error("Thiếu token xác thực");
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as DecodedToken;
    return decoded;
  } catch {
    throw new Error("Token không hợp lệ");
  }
}
