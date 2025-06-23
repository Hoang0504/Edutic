import Cors from "cors";
import { NextApiRequest, NextApiResponse } from "next";

// Helper to run middleware with async/await
function runMiddleware(
  req: NextApiRequest,
  res: NextApiResponse,
  fn: (
    req: NextApiRequest,
    res: NextApiResponse,
    next: (result?: unknown) => void
  ) => void
) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result: unknown) => {
      if (result instanceof Error) return reject(result);
      return resolve(result);
    });
  });
}

// Allow only same origin (e.g. http://localhost:3000 or your domain)
const cors = Cors({
  origin: process.env.ALLOWED_ORIGIN || "http://localhost:3000", // your frontend URL
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
});

export async function applyCors(req: NextApiRequest, res: NextApiResponse) {
  await runMiddleware(req, res, cors);
}
