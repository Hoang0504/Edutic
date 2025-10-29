// hooks/useHomeData.ts
import { useQuery } from "@tanstack/react-query";

import API_ENDPOINTS from "@/constants/api";

import { fetcher } from "@/utils/fetcher";

export const useLatestTests = () =>
  useQuery({
    queryKey: ["latestTests"],
    queryFn: async () => {
      const res = await fetcher(API_ENDPOINTS.EXAMS.LATEST);
      return res;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

export const useRecentAttempts = (token?: string) =>
  useQuery({
    queryKey: ["recentAttempts", token],
    queryFn: async () => {
      const res = await fetcher(API_ENDPOINTS.EXAM_ATTEMPTS.RECENT, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res;
    },
    enabled: !!token, // bắt buộc token phải có giá trị thì mới gọi
    staleTime: 1000 * 60 * 5,
  });
