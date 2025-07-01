"use client";

import React, { useMemo } from "react";

// import { useExamAttemptInfo } from "@/contexts/ExamAttemptInfoContext";

interface QuestionNavigatorProps {
  selectedAnswers: { [key: number]: string };
  onQuestionClick: (questionId: number) => void;
  activeSkill: "listening" | "reading" | "writing" | "speaking";
}

const QuestionNavigator: React.FC<QuestionNavigatorProps> = ({
  selectedAnswers,
  onQuestionClick,
  activeSkill,
}) => {
  // Different part structures for different skills
  const getPartsForSkill = (skill: string) => {
    switch (skill) {
      case "listening":
        return [
          { id: 1, name: "Part 1", questionStart: 1, questionCount: 6 },
          { id: 2, name: "Part 2", questionStart: 7, questionCount: 25 },
          { id: 3, name: "Part 3", questionStart: 32, questionCount: 39 },
          { id: 4, name: "Part 4", questionStart: 71, questionCount: 30 },
        ];
      case "reading":
        return [
          { id: 5, name: "Part 5", questionStart: 101, questionCount: 30 },
          { id: 6, name: "Part 6", questionStart: 131, questionCount: 16 },
          { id: 7, name: "Part 7", questionStart: 147, questionCount: 54 },
        ];
      case "writing":
        return [
          { id: 1, name: "Part 1", questionStart: 1, questionCount: 5 },
          { id: 2, name: "Part 2", questionStart: 6, questionCount: 1 },
        ];
      case "speaking":
        return [
          { id: 1, name: "Part 1", questionStart: 1, questionCount: 2 },
          { id: 2, name: "Part 2", questionStart: 3, questionCount: 1 },
          { id: 3, name: "Part 3", questionStart: 4, questionCount: 3 },
          { id: 4, name: "Part 4", questionStart: 7, questionCount: 3 },
          { id: 5, name: "Part 5", questionStart: 10, questionCount: 1 },
          { id: 6, name: "Part 6", questionStart: 11, questionCount: 1 },
        ];
      default:
        return [
          { id: 1, name: "Part 1", questionStart: 1, questionCount: 6 },
          { id: 2, name: "Part 2", questionStart: 7, questionCount: 6 },
          { id: 3, name: "Part 3", questionStart: 13, questionCount: 6 },
          { id: 4, name: "Part 4", questionStart: 19, questionCount: 6 },
        ];
    }
  };

  const parts = getPartsForSkill(activeSkill);

  // const parts = useMemo(() => {
  //   if (!data) return [];

  //   return data.parts.map((part) => ({
  //     id: part.part_id,
  //     name: part.title,
  //     questionStart: part.questionStart,
  //     questionCount: part.questionCount,
  //   }));
  // }, [data]);

  const getQuestionNumbers = (part: (typeof parts)[0]) => {
    return Array.from(
      { length: part.questionCount },
      (_, i) => part.questionStart + i
    );
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
          const questionNumbers = getQuestionNumbers(part);
          return (
            <div key={part.id} className="space-y-3">
              <div className="text-sm font-medium text-gray-700">
                {part.name}:
              </div>
              <div className={`grid gap-2 ${getGridCols(part.questionCount)}`}>
                {questionNumbers.map((questionNum) => (
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
          );
        })}
      </div>
    </div>
  );
};

export default QuestionNavigator;
