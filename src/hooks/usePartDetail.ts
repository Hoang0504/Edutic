import { useEffect, useState } from "react";

import API_ENDPOINTS from "@/constants/api";

const usePartDetail = (partId?: number) => {
  const [data, setData] = useState<{
    part: {
      id: number;
      title: string;
      instructions: string | null;
      audio: string;
      time_limit: number;
    };
    groups: {
      groupId: number;
      groupContent: string;
      groupImages: string[];
      questions: any[];
    };
    questions: any[];
  } | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      if (!partId) return;

      try {
        setLoading(true);
        const res = await fetch(API_ENDPOINTS.PART.DETAIL(partId.toString()));
        const result = await res.json();
        setData(result); // assuming result is an array
      } catch (error) {
        console.error("Failed to fetch exam info:", error);
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [partId]);

  return { data, loading, error };
};

export default usePartDetail;
