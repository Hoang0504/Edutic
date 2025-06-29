import { withErrorHandler } from "@/lib/withErrorHandler";
import { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "GET") {
    const { user_exam_attempt_id, part_id } = req.query;
  }
  return res.status(405).end();
};

export default withErrorHandler(handler);
