import API_ENDPOINTS from "@/constants/api";

import { fetcher } from "@/utils/fetcher";
import { useQuery } from "@tanstack/react-query";

export const useQuestionDetailQuery = (examId: string, questionId: string) => {
  return useQuery({
    queryKey: ["question-detail", questionId],
    queryFn: async () => {
      const res = await fetcher(
        API_ENDPOINTS.EXAM_ATTEMPTS.QUESTION_DETAILS(examId, questionId)
      );
      return res;
    },
    enabled: !!questionId,
    staleTime: 5 * 60 * 1000, // 5 phút cache
  });
};
