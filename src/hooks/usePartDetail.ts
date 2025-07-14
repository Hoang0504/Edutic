import { useQuery } from "@tanstack/react-query";

import API_ENDPOINTS from "@/constants/api";

import { fetcher } from "@/utils/fetcher";
import { PartDetailType } from "@/types/exam";

export const usePartDetail = (partId: number, enabled = true) => {
  return useQuery<PartDetailType>({
    queryKey: ["part-detail", partId],
    queryFn: async () => {
      const res = await fetcher(API_ENDPOINTS.PART.DETAIL(partId.toString()));
      return res;
    },
    enabled: !!partId && enabled, // chỉ gọi khi có giá trị hợp lệ
    staleTime: 1000 * 60 * 5, // cache 3 phút
    refetchOnWindowFocus: false,
  });
};

export default usePartDetail;
