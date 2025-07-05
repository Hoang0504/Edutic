"use client";

import React, { useMemo } from "react";

import { useExamAttemptInfo } from "@/contexts/ExamAttemptInfoContext";
import { useSelectedAnswers } from "@/contexts/SelectedAnswersContext";

const QuestionNavigator: React.FC = () => {
  const { data } = useExamAttemptInfo();
  const { selectedAnswers } = useSelectedAnswers();

  const parts = useMemo(() => {
    if (!data) return [];

    return data.parts.map((part) => ({
      id: part.part_id,
      name: part.title,
      questionStart: part.questionStart,
      questionCount: part.questionCount,
      questionIdStart: part.questionIdStart,
    }));
  }, [data]);

  const getQuestionInfos = (part: (typeof parts)[0]): any => {
    return Array.from({ length: part.questionCount }, (_, i) => ({
      id: part.questionIdStart + i,
      number: part.questionStart + i,
    }));
  };

  // Determine grid columns based on question count
  const getGridCols = (questionCount: number) => {
    if (questionCount <= 6) return "grid-cols-6";
    if (questionCount <= 10) return "grid-cols-5";
    if (questionCount <= 16) return "grid-cols-4";
    if (questionCount <= 25) return "grid-cols-5";
    return "grid-cols-6";
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      <div className="p-4 space-y-4">
        {parts.map((part) => {
          const questionInfos = getQuestionInfos(part);
          return (
            <div key={part.id} className="space-y-3">
              <div className="text-sm font-medium text-gray-700">
                {part.name}:
              </div>
              <div className={`grid gap-2 ${getGridCols(part.questionCount)}`}>
                {questionInfos.map((q: any) => (
                  <button
                    key={q.id}
                    className={`w-8 h-8 rounded text-xs font-medium transition-colors bg-gray-100 text-gray-600 hover:bg-gray-200 border border-gray-300 ${
                      selectedAnswers[q.id]
                        ? "bg-green-500 text-white hover:bg-green-600"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200 border border-gray-300"
                    }`}
                    onClick={() => {}}
                  >
                    {q.number}
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default QuestionNavigator;
