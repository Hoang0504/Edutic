'use client';

import React, { useState } from 'react';
import ExamLayout from '@/components/exam/ExamLayout';
import ListeningExam from '@/components/exam/ListeningExam';

interface ExamPageProps {
  params: {
    id: string;
  };
}

const ExamPage = ({ params }: ExamPageProps) => {
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: string }>({});

  const handleExit = () => {
    // Handle exam exit
    console.log('Exiting exam...');
  };

  const handleSubmit = () => {
    // Handle exam submission
    console.log('Submitting exam...');
  };

  const handleAnswerSelect = (questionId: number, answer: string) => {
    // Handle answer selection
    console.log(`Question ${questionId}: ${answer}`);
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleQuestionClick = (questionId: number) => {
    // Handle question navigation
    console.log(`Navigate to question ${questionId}`);
  };

  return (
    <ExamLayout
      examTitle="Tên đề thi"
      totalTime={120} // 120 minutes
      onExit={handleExit}
      onSubmit={handleSubmit}
      selectedAnswers={selectedAnswers}
      onQuestionClick={handleQuestionClick}
    >
      <ListeningExam
        parts={[]} // Will use sample data from component
        onAnswerSelect={handleAnswerSelect}
      />
    </ExamLayout>
  );
};

export default ExamPage; 