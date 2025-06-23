import { NextApiRequest, NextApiResponse } from "next";
import { applyCors } from "./middleware/cors";

type HandlerFunction = (
  req: NextApiRequest,
  res: NextApiResponse
) => Promise<void | NextApiResponse<unknown>>;

export function withErrorHandler(
  handler: HandlerFunction,
  errorMessage?: string
) {
  return async function (req: NextApiRequest, res: NextApiResponse) {
    try {
      await applyCors(req, res); // Apply CORS middleware
      await handler(req, res);
    } catch (error: Error | unknown) {
      console.error("API Error:", error);
      res.status(500).json({
        success: false,
        data: {
          message: errorMessage || "Có lỗi xảy ra trong quá trình xử lý.",
          error:
            process.env.NODE_ENV === "development" && error instanceof Error
              ? error.message
              : undefined,
        },
      });
    }
  };
}

// Trong một file API ví dụ review.ts
// import { withErrorHandler } from '@/lib/withErrorHandler';

// export default withErrorHandler(async function handler(req, res) {
//   // logic chính ở đây
// }, 'Không thể lấy danh sách flashcards cần ôn tập');
