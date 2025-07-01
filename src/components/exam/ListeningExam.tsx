"use client";

import React, { useState, useRef, useEffect } from "react";

import {
  PlayIcon,
  PauseIcon,
  SpeakerWaveIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/solid";

import FullPageLoading from "../features/FullPageLoading";

import { usePartDetail } from "@/hooks";
import { useSelectedAnswers } from "@/contexts/SelectedAnswersContext";
import { useExamAttemptInfo } from "@/contexts/ExamAttemptInfoContext";

interface Answer {
  id: number;
  content: string;
}

interface Question {
  id: number;
  question_number: number;
  content: string;
  image_url: string;
  question_type: string;
  answers: Answer[];
}

interface Part {
  id: number;
  title: string;
  audio?: string;
  questions: Question[];
}

interface ListeningExamProps {
  parts: Part[];
}

const ListeningExam: React.FC<ListeningExamProps> = ({ parts }) => {
  const { selectedAnswers, setSelectedAnswers } = useSelectedAnswers();
  const [activeSection, setActiveSection] = useState(1);
  // const [activePart, setActivePart] = useState(1);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [currentQuestionNumber, setCurrentQuestionNumber] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(50);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  // const [selectedAnswers, setSelectedAnswers] = useState<{
  //   [key: number]: string;
  // }>({});

  const audioRef = useRef<HTMLAudioElement>(null);

  const { data: examData } = useExamAttemptInfo();
  const listeningParts = examData?.parts?.filter(
    (part: any) => part.skill === "l"
  );

  const activePart = examData?.parts?.find((part: any) => part.skill === "l");

  const activePartId = activePart?.part_id;

  const { data: partDetail, loading } = usePartDetail(activePartId);

  useEffect(() => {
    if (activePart?.questionStart != null) {
      setCurrentQuestionNumber(activePart.questionStart);
    }
  }, [activePart]);

  if (!examData || !activePartId || loading) {
    return <FullPageLoading />;
  }

  const currentPart = partDetail?.part;
  const questions = partDetail?.questions ?? [];
  const currentQuestion = questions[currentQuestionIndex];

  // useEffect(() => {
  //   // Reset question index when section changes
  //   setCurrentQuestionIndex(0);
  // }, [activeSection]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleAnswerSelect = (questionId: number, answer: string) => {
    setSelectedAnswers((prev: any) => ({
      ...prev,
      [questionId]: answer,
    }));
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  const handleNextQuestion = () => {
    // if (currentQuestionIndex < currentSection.questions.length - 1) {
    //   setCurrentQuestionIndex(currentQuestionIndex + 1);
    // } else {
    //   // Move to next section if available
    //   const nextSectionIndex =
    //     currentPart.sections.findIndex((s) => s.id === activeSection) + 1;
    //   if (nextSectionIndex < currentPart.sections.length) {
    //     setActiveSection(currentPart.sections[nextSectionIndex].id);
    //     setCurrentQuestionIndex(0);
    //   }
    // }
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setCurrentQuestionNumber((prev) => prev + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setCurrentQuestionNumber((prev) => prev - 1);
    }
    // else {
    //   // Move to previous section if available
    //   const prevSectionIndex =
    //     currentPart.sections.findIndex((s) => s.id === activeSection) - 1;
    //   if (prevSectionIndex >= 0) {
    //     setActiveSection(currentPart.sections[prevSectionIndex].id);
    //     setCurrentQuestionIndex(
    //       currentPart.sections[prevSectionIndex].questions.length - 1
    //     );
    //   }
    // }
  };

  // const canGoPrevious = () => {
  //   return (
  //     currentQuestionIndex > 0 ||
  //     currentPart.sections.findIndex((s) => s.id === activeSection) > 0
  //   );
  // };

  // const canGoNext = () => {
  //   const sectionIndex = currentPart.sections.findIndex(
  //     (s) => s.id === activeSection
  //   );
  //   return (
  //     currentQuestionIndex < currentSection.questions.length - 1 ||
  //     sectionIndex < currentPart.sections.length - 1
  //   );
  // };
  const canGoNext = () => currentQuestionIndex < questions.length - 1;
  const canGoPrevious = () => currentQuestionIndex > 0;

  return (
    <div className="space-y-6">
      {/* Sections Navigation */}
      <div className="bg-white rounded-lg shadow-sm border p-4">
        <div className="flex space-x-2">
          {parts.map((part) => (
            <button
              key={part.id}
              onClick={() => setActiveSection(part.id)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeSection === part.id
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {part.title}
            </button>
          ))}
        </div>
      </div>

      {/* Audio Player */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center space-x-4">
          <button
            onClick={togglePlay}
            className="w-12 h-12 bg-green-500 hover:bg-green-600 rounded-full flex items-center justify-center text-white transition-colors"
          >
            {isPlaying ? (
              <PauseIcon className="w-6 h-6" />
            ) : (
              <PlayIcon className="w-6 h-6 ml-1" />
            )}
          </button>

          {/* Waveform Visualization */}
          <div className="flex-1 flex items-center space-x-1">
            {Array.from({ length: 40 }, (_, i) => (
              <div
                key={i}
                className={`w-1 rounded-full transition-all duration-300 ${
                  isPlaying && i <= (currentTime / duration) * 40
                    ? "bg-green-500 h-8"
                    : "bg-gray-300 h-4"
                }`}
                style={{
                  height: `${Math.random() * 20 + 10}px`,
                  backgroundColor:
                    isPlaying && i <= (currentTime / duration) * 40
                      ? "#10b981"
                      : "#d1d5db",
                }}
              />
            ))}
          </div>

          {/* Volume Control */}
          <div className="flex items-center space-x-2">
            <SpeakerWaveIcon className="w-5 h-5 text-gray-600" />
            <input
              type="range"
              min="0"
              max="100"
              value={volume}
              onChange={(e) => setVolume(Number(e.target.value))}
              className="w-20 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>
        </div>

        {/* Audio Progress */}
        <div className="mt-4 flex items-center space-x-2 text-sm text-gray-600">
          <span>{formatTime(currentTime)}</span>
          <div className="flex-1 bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{
                width: `${duration ? (currentTime / duration) * 100 : 0}%`,
              }}
            />
          </div>
          <span>{formatTime(duration)}</span>
        </div>

        <audio ref={audioRef} src={currentPart?.audio} preload="metadata" />
      </div>

      {/* Question Section - Compact Design */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="mb-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-medium text-gray-800">
              Question {currentQuestionNumber}
            </h3>
            {/* <div className="text-sm text-gray-500">
              {currentQuestion?.content}
            </div> */}
          </div>

          {/* Question Text */}
          {currentQuestion?.content && (
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <p className="text-gray-800 font-medium">
                {currentQuestion.content}
              </p>
            </div>
          )}

          {/* Answer Options */}
          <div className="space-y-3">
            {currentQuestion?.answers.map((answer: any, index: number) => {
              const optionLetter = String.fromCharCode(65 + index); // A, B, C, D
              const isSelected =
                selectedAnswers[currentQuestion.id] === optionLetter;

              return (
                <label
                  key={index}
                  className={`flex items-start space-x-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                    isSelected
                      ? "bg-blue-50 border-blue-300"
                      : "bg-white border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  <input
                    type="radio"
                    name={`question-${currentQuestion.id}`}
                    value={optionLetter}
                    checked={isSelected}
                    onChange={() =>
                      handleAnswerSelect(currentQuestion.id, optionLetter)
                    }
                    className="mt-1 w-4 h-4 text-blue-600"
                  />
                  <span className="text-gray-800">{answer.content}</span>
                </label>
              );
            })}
          </div>

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between mt-6">
            <button
              onClick={handlePreviousQuestion}
              disabled={!canGoPrevious()}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                canGoPrevious()
                  ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  : "bg-gray-50 text-gray-400 cursor-not-allowed"
              }`}
            >
              <ChevronLeftIcon className="w-4 h-4" />
              <span>Previous</span>
            </button>

            <div className="flex items-center space-x-2">
              {questions.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentQuestionIndex(index)}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index === currentQuestionIndex
                      ? "bg-blue-500"
                      : selectedAnswers[questions[index].id]
                      ? "bg-green-500"
                      : "bg-gray-300 hover:bg-gray-400"
                  }`}
                />
              ))}
            </div>

            <button
              onClick={handleNextQuestion}
              disabled={!canGoNext()}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                canGoNext()
                  ? "bg-blue-500 text-white hover:bg-blue-600"
                  : "bg-gray-50 text-gray-400 cursor-not-allowed"
              }`}
            >
              <span>Next</span>
              <ChevronRightIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListeningExam;
