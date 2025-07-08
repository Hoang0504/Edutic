'use client';

import React, { useState } from 'react';
import ExamLayout from '@/components/exam/ExamLayout';
import ListeningExam from '@/components/exam/ListeningExam';

interface ExamDemoPageProps {}

const ExamDemoPage = ({}: ExamDemoPageProps) => {
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: string }>({});
  const [activeSkill, setActiveSkill] = useState<'listening' | 'reading' | 'writing' | 'speaking'>('speaking');

  const handleExit = () => {
    // Handle exam exit
    window.location.href = '/demo';
  };

  const handleSubmit = () => {
    // Handle exam submission
    alert('Exam submitted! Check console for results.');
    console.log('Final answers:', selectedAnswers);
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

  const handleSkillChange = (skill: string) => {
    setActiveSkill(skill as any);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <ExamLayout
        examTitle="TOEIC Speaking & Writing Demo Exam"
        totalTime={180} // 3 hours total
        onExit={handleExit}
        onSubmit={handleSubmit}
        selectedAnswers={selectedAnswers}
        onQuestionClick={handleQuestionClick}
        onSkillChange={handleSkillChange}
      >
        {activeSkill === 'listening' && (
          <ListeningExam
            parts={[]} // Will use sample data from component
            onAnswerSelect={handleAnswerSelect}
          />
        )}
      </ExamLayout>
    </div>
  );
};

export default ExamDemoPage; 