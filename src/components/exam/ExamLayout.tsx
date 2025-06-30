"use client";

import React, { useState, useEffect } from "react";
import QuestionNavigator from "./QuestionNavigator";
import ListeningExam from "./ListeningExam";

interface ExamLayoutProps {
  mode: "lr" | "sw";
  examTitle: string;
  totalTime: number; // in minutes
  onExit: () => void;
  onSubmit: () => void;
  onSkillChange?: (skill: string) => void;
  selectedAnswers?: { [key: number]: string };
  onQuestionClick?: (questionId: number) => void;
}

const getInitialSkill = (mode: string | null) => {
  if (mode === "lr") return "listening";
  if (mode === "sw") return "speaking";
  return "listening"; // fallback default
};

const ExamLayout: React.FC<ExamLayoutProps> = ({
  mode,
  examTitle,
  totalTime,
  onExit,
  onSubmit,
  onSkillChange,
  selectedAnswers = {},
  onQuestionClick = () => {},
}) => {
  const [timeLeft, setTimeLeft] = useState(totalTime * 60); // convert to seconds
  const [activeSkill, setActiveSkill] = useState<
    "listening" | "reading" | "writing" | "speaking"
  >(getInitialSkill(mode));

  const allSkills = [
    { id: "listening", name: "Listening", color: "bg-blue-500" },
    { id: "reading", name: "Reading", color: "bg-green-500" },
    { id: "speaking", name: "Speaking", color: "bg-red-500" },
    { id: "writing", name: "Writing", color: "bg-yellow-500" },
  ];

  const skills = mode === "lr" ? allSkills.slice(0, 2) : allSkills.slice(2);

  useEffect(() => {
    const timer = setInterval(() => {
      if (!isTimerPaused && !proctoringSystem.isTimerPaused) {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            onSubmit();
            return 0;
          }
          return prev - 1;
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [onSubmit, isTimerPaused, proctoringSystem.isTimerPaused]);

  // Show permission dialog when exam starts
  useEffect(() => {
    // Show permission dialog after a short delay to ensure page is loaded
    const timeout = setTimeout(() => {
      proctoringSystem.requestProctoringPermission();
    }, 500);

    return () => clearTimeout(timeout);
  }, []);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleSkillChange = (
    skill: "listening" | "reading" | "writing" | "speaking"
  ) => {
    setActiveSkill(skill);
    if (onSkillChange) {
      onSkillChange(skill);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-semibold text-gray-800">{examTitle}</h1>
              
              {/* Proctoring status indicator */}
              {proctoringSystem.proctoringEnabled && (
                <div className="flex items-center space-x-2 text-sm">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-green-600 font-medium">Giám sát đang hoạt động</span>
                </div>
              )}
              
              {/* Violation warning */}
              {proctoringSystem.shouldShowRiskWarning() && (
                <div className="flex items-center space-x-2 text-sm">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span className="text-red-600 font-medium">
                    Cảnh báo: {proctoringSystem.getViolationStats().total} vi phạm
                  </span>
                </div>
              )}
            </div>
            
            <div className="flex items-center space-x-3">
              {/* Timer pause indicator */}
              {(isTimerPaused || proctoringSystem.isTimerPaused) && (
                <div className="flex items-center space-x-2 text-orange-600">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-sm font-medium">Đã tạm dừng</span>
                </div>
              )}
              
              <button
                onClick={onExit}
                className="bg-teal-500 hover:bg-teal-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
              >
                Thoát
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Skills Navigation */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex space-x-1">
            {skills.map((skill) => (
              <button
                key={skill.id}
                onClick={() => handleSkillChange(skill.id as any)}
                className={`px-6 py-3 font-medium text-sm rounded-t-lg transition-colors ${
                  activeSkill === skill.id
                    ? "bg-gray-100 text-gray-800 border-b-2 border-blue-500"
                    : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
                }`}
              >
                {skill.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex gap-6">
          {/* Main Content */}
          <div className="flex-1">
            {activeSkill === "listening" && (
              <ListeningExam
                parts={[]} // Will use sample data from component
              />
            )}
            {activeSkill === "reading" && (
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h2 className="text-lg font-medium text-gray-800 mb-4">
                  Reading Section
                </h2>
                <p className="text-gray-600">
                  Reading interface will be implemented here.
                </p>
              </div>
            )}
            {activeSkill === "writing" && (
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h2 className="text-lg font-medium text-gray-800 mb-4">
                  Writing Section
                </h2>
                <p className="text-gray-600">
                  Writing interface will be implemented here.
                </p>
              </div>
            )}
            {activeSkill === "speaking" && (
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h2 className="text-lg font-medium text-gray-800 mb-4">
                  Speaking Section
                </h2>
                <p className="text-gray-600">
                  Speaking interface will be implemented here.
                </p>
              </div>
            )}
          </div>

          {/* Right Sidebar */}
          <div className="w-80 space-y-6">
            {/* Timer */}
            <div className="bg-white rounded-lg shadow-sm border p-4">
              <h3 className="font-medium text-gray-800 mb-2">Thời gian làm bài</h3>
              <div className={`text-2xl font-bold mb-4 ${
                (isTimerPaused || proctoringSystem.isTimerPaused) ? 'text-orange-600' : 'text-red-600'
              }`}>
              <h3 className="font-medium text-gray-800 mb-2">
                Thời gian làm bài
              </h3>
              <div className="text-2xl font-bold text-red-600 mb-4">
                {formatTime(timeLeft)}
              </div>
              <button
                onClick={onSubmit}
                className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg font-medium transition-colors"
              >
                Nộp bài
              </button>
            </div>

            {/* Question Navigator */}
            <QuestionNavigator
              selectedAnswers={selectedAnswers}
              onQuestionClick={onQuestionClick}
            />
          </div>
        </div>
      </div>

      {/* Proctoring Camera */}
      <ExamProctoring
        isEnabled={proctoringSystem.proctoringEnabled}
        onViolation={proctoringSystem.handleViolation}
        onPauseTimer={(pause) => setIsTimerPaused(pause)}
        currentSkill={activeSkill}
      />

      {/* Permission Dialog */}
      <ExamPermissionDialog
        isOpen={proctoringSystem.showPermissionDialog}
        onPermissionGranted={proctoringSystem.handlePermissionGranted}
        onSkipProctoring={proctoringSystem.handleSkipProctoring}
        onCancel={proctoringSystem.handlePermissionCancel}
      />

      {/* Violation Alert */}
      <ExamViolationAlert
        isVisible={proctoringSystem.showViolationAlert}
        violationType={proctoringSystem.currentViolation?.type || 'face'}
        message={proctoringSystem.currentViolation?.message || ''}
        onContinue={proctoringSystem.handleContinueAfterViolation}
        onCancel={proctoringSystem.handleCancelFromViolation}
      />
    </div>
  );
};

export default ExamLayout;
