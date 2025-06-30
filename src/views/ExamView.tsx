"use client";

import React, { useState } from "react";

import ExamLayout from "@/components/exam/ExamLayout";
import { useQueryParams } from "@/hooks";
import NotFound from "@/app/not-found";

// interface ExamPageProps {
//   params: {
//     id: string;
//   };
// }
// { params }: ExamPageProps

const ExamView = () => {
  const { mode } = useQueryParams();
  const [selectedAnswers, setSelectedAnswers] = useState<{
    [key: number]: string;
  }>({});

  const validModes = ["lr", "sw"];

  if (!mode || !validModes.includes(mode)) {
    return NotFound();
  }

  const handleExit = () => {
    // Handle exam exit
    console.log("Exiting exam...");
  };

  const handleSubmit = () => {
    // Handle exam submission
    console.log("Submitting exam...");
  };

  // const handleAnswerSelect = (questionId: number, answer: string) => {
  //   // Handle answer selection
  //   console.log(`Question ${questionId}: ${answer}`);
  //   setSelectedAnswers((prev) => ({
  //     ...prev,
  //     [questionId]: answer,
  //   }));
  // };

  const handleQuestionClick = (questionId: number) => {
    // Handle question navigation
    console.log(`Navigate to question ${questionId}`);
  };

  return (
    <ExamLayout
      mode={mode as "lr" | "sw"}
      examTitle="Tên đề thi"
      totalTime={120} // 120 minutes
      onExit={handleExit}
      onSubmit={handleSubmit}
      selectedAnswers={selectedAnswers}
      onQuestionClick={handleQuestionClick}
    />
  );
};

export default ExamView;
