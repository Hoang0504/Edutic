"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";

import API_ENDPOINTS from "@/constants/api";

type Part = {
  part_id: number;
  part_number: number;
  title: string;
  skill: "l" | "r" | "w" | "s";
  questionCount: number;
  questionStart: number;
  time_limit: number;
  order_index: number;
};

type ExamAttemptInfo = {
  exam_id: number;
  title: string;
  estimated_time: number;
  mode: string;
  parts: Part[];
};

type ContextType = {
  data: ExamAttemptInfo | null;
  //   loading: boolean;
  //   error: string | null;
};

const ExamAttemptInfoContext = createContext<ContextType>({
  data: null,
  //   loading: false,
  //   error: null,
});

export const ExamAttemptInfoProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [data, setData] = useState<ExamAttemptInfo | null>(null);
  //   const [loading, setLoading] = useState(true);
  //   const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchExamInfo = async (examId: string) => {
      try {
        // setLoading(true);
        const res = await fetch(API_ENDPOINTS.EXAM_ATTEMPTS.INFO(examId));
        const result = await res.json();
        setData(result); // assuming result is an array
      } catch (error) {
        console.error("Failed to fetch exam info:", error);
        setData(null);
      } finally {
        // setLoading(false);
      }
    };

    // Example usage, replace with actual exam ID
    fetchExamInfo("1"); // Replace "1" with the actual exam ID you want to fetch
  }, []);

  return (
    <ExamAttemptInfoContext.Provider value={{ data }}>
      {children}
    </ExamAttemptInfoContext.Provider>
  );
};

export const useExamAttemptInfo = () => useContext(ExamAttemptInfoContext);
