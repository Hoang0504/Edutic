"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
} from "react";

import API_ENDPOINTS from "@/constants/api";

type Part = {
  part_id: number;
  part_number: number;
  title: string;
  skill: "l" | "r" | "w" | "s";
  questionCount: number;
  questionStart: number;
  questionIdStart: number;
  time_limit: number;
  order_index: number;
};

type ExamAttemptInfo = {
  exam_id: number;
  title: string;
  mode: string;
  totalQuestionCount: number;
  estimated_time: number;
  parts: Part[];
};

type ContextType = {
  data: ExamAttemptInfo | null;
  loadData: (examId: string) => Promise<void>;
  //   loading: boolean;
  //   error: string | null;
};

const ExamAttemptInfoContext = createContext<ContextType>({
  data: null,
  loadData: async () => {},
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

  const loadData = useCallback(async (examId: string) => {
    try {
      const res = await fetch(API_ENDPOINTS.EXAM_ATTEMPTS.INFO(examId));
      const result = await res.json();
      setData(result);
    } catch (error) {
      console.error("Failed to fetch exam info:", error);
      setData(null);
    }
  }, []);

  return (
    <ExamAttemptInfoContext.Provider value={{ data, loadData }}>
      {children}
    </ExamAttemptInfoContext.Provider>
  );
};

export const useExamAttemptInfo = () => useContext(ExamAttemptInfoContext);
