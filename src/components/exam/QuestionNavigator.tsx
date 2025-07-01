"use client";

import React, { useMemo } from "react";

import { useExamAttemptInfo } from "@/contexts/ExamAttemptInfoContext";

interface QuestionNavigatorProps {
  selectedAnswers: { [key: number]: string };
  onQuestionClick: (questionId: number) => void;
}

const QuestionNavigator: React.FC<QuestionNavigatorProps> = ({
  selectedAnswers,
  onQuestionClick,
}) => {
  const { data } = useExamAttemptInfo();

  const parts = useMemo(() => {
    if (!data) return [];

    return data.parts.map((part) => ({
      id: part.part_id,
      name: part.title,
      questionStart: part.questionStart,
      questionCount: part.questionCount,
    }));
  }, [data]);

  const getQuestionNumbers = (part: (typeof parts)[0]) => {
    return Array.from(
      { length: part.questionCount },
      (_, i) => part.questionStart + i
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      <div className="p-4 space-y-4">
        {parts.map((part) => (
          <div key={part.id} className="space-y-3">
            <div className="text-sm font-medium text-gray-700">
              {part.name}:
            </div>
            <div className="grid grid-cols-6 gap-2">
              {getQuestionNumbers(part).map((questionNum) => (
                <button
                  key={questionNum}
                  className={`w-8 h-8 rounded text-xs font-medium transition-colors ${
                    selectedAnswers[questionNum]
                      ? "bg-green-500 text-white hover:bg-green-600"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200 border border-gray-300"
                  }`}
                  onClick={() => onQuestionClick(questionNum)}
                >
                  {questionNum}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuestionNavigator;
