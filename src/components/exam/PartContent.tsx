"use client";

import {
  PauseIcon,
  PlayIcon,
  SpeakerWaveIcon,
} from "@heroicons/react/24/outline";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { useSelectedAnswers } from "@/contexts/SelectedAnswersContext";
import { usePartDetail } from "@/hooks";

interface PartContentProps {
  activePart: number;
}

function PartContent({ activePart }: PartContentProps) {
  const { data: partDetail, isLoading } = usePartDetail(activePart!);
  const { selectedAnswers, setSelectedAnswers } = useSelectedAnswers();

  // console.log(partDetail);

  const [currentPage, setCurrentPage] = useState(1);
  const questionsPerPage = 3;

  const combinedQuestions = useMemo(() => {
    const allQuestions: {
      id: number;
      question_number: number;
      content: string;
      image_url: string;
      question_type: string;
      answers: any[];
      groupContent?: string;
      groupImages?: string[];
      groupId?: number;
    }[] = [];

    if (Array.isArray(partDetail?.groups)) {
      partDetail.groups.forEach((group: any) => {
        group.questions.forEach((q: any, index: number) => {
          allQuestions.push({
            ...q,
            groupId: group.id,
            groupContent: index === 0 ? group.content : undefined,
            groupImages:
              index === 0 && group.image_url
                ? group.image_url.split(" ")
                : undefined,
          });
        });
      });
    }
    return [
      ...allQuestions,
      ...(partDetail?.questions ?? []).map((q) => ({ ...q, groupId: null })),
    ];
  }, [partDetail]);

  // console.log(combinedQuestions);

  const currentPart = partDetail?.part;
  const questions = combinedQuestions;
  // console.log(questions);

  const totalPages = Math.ceil(questions.length / questionsPerPage);

  const paginatedQuestions = useMemo(() => {
    const start = (currentPage - 1) * questionsPerPage;
    return questions.slice(start, start + questionsPerPage);
  }, [questions, currentPage]);

  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(50);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);

    audio.addEventListener("timeupdate", updateTime);
    audio.addEventListener("loadedmetadata", updateDuration);
    audio.addEventListener("ended", () => setIsPlaying(false));

    return () => {
      audio.removeEventListener("timeupdate", updateTime);
      audio.removeEventListener("loadedmetadata", updateDuration);
      audio.removeEventListener("ended", () => setIsPlaying(false));
    };
  }, [currentPart]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume]);

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

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

  const handleAnswerSelect = useCallback(
    (questionId: number, answerId: number) => {
      setSelectedAnswers((prev: any) => ({
        ...prev,
        [questionId]: answerId,
      }));
    },
    []
  );

  useEffect(() => {
    if (!isLoading && questions.length > 0) {
      setCurrentPage(1);
    }
  }, [isLoading, questions]);

  return (
    <>
      {/* Audio Player */}
      {currentPart?.audio && (
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
      )}

      {/* Question Section - Compact Design */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="mb-4">
          {paginatedQuestions.map((question) => (
            <div key={question.id} className="mb-6">
              {/* Group Info (Only for first question of the group) */}
              {("groupContent" in question && question.groupContent) ||
                ("groupImages" in question &&
                  question.groupImages &&
                  question.groupImages.length > 0 && (
                    <div className="mb-4 p-4 pb-2 border rounded-lg">
                      {"groupContent" in question && question.groupContent && (
                        <p className="text-sm font-semibold mb-2">
                          {question.groupContent}
                        </p>
                      )}
                      {"groupImages" in question &&
                        question.groupImages &&
                        question.groupImages.length > 0 && (
                          <>
                            {question.groupImages.map(
                              (img: string, idx: number) => (
                                <img
                                  key={idx}
                                  src={`/${img.trim()}`}
                                  alt={`Group illustration ${idx + 1}`}
                                  className="w-lg"
                                />
                              )
                            )}
                          </>
                        )}
                    </div>
                  ))}

              {/* Question Content */}
              <div className="mb-8">
                <p className="font-medium mb-4">
                  <b>Question {question.question_number}:</b> {question.content}
                </p>

                {question.image_url && (
                  <img
                    src={`/${question.image_url.trim()}`}
                    alt={`Question ${question.question_number} image`}
                    className="w-lg mb-2"
                  />
                )}

                <div className="space-y-3">
                  {question.answers.map((answer: any, index: number) => {
                    const optionLetter = String.fromCharCode(65 + index);
                    const isSelected =
                      selectedAnswers[question.id] === answer.id;

                    return (
                      <label
                        key={answer.id}
                        className={`flex items-start space-x-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                          isSelected
                            ? "bg-blue-50 border-blue-300"
                            : "bg-white border-gray-200 hover:bg-gray-50"
                        }`}
                      >
                        <input
                          type="radio"
                          name={`question-${question.id}`}
                          value={optionLetter}
                          checked={isSelected}
                          onChange={() =>
                            handleAnswerSelect(question.id, answer.id)
                          }
                          className="mt-1 w-4 h-4 text-blue-600"
                        />
                        <span className="text-gray-800">{answer.content}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            </div>
          ))}

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between mt-6 space-x-2">
            {/* Previous button */}
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              className="px-3 py-1 text-sm rounded border border-gray-300 disabled:opacity-50"
            >
              Prev
            </button>

            {/* Question dots */}
            <ul className="inline-flex items-center space-x-1">
              {Array.from({ length: totalPages }, (_, index) => {
                const isCurrent = currentPage === index + 1;
                const isAnswered = questions
                  .slice(
                    index * questionsPerPage,
                    (index + 1) * questionsPerPage
                  )
                  .every((q) => selectedAnswers[q.id]);

                return (
                  <li key={index}>
                    <button
                      onClick={() => setCurrentPage(index + 1)}
                      className={`w-8 h-8 text-sm rounded-full font-medium transition-colors focus:outline-none ${
                        isCurrent
                          ? "bg-blue-600 text-white"
                          : isAnswered
                          ? "bg-green-500 text-white"
                          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                      }`}
                    >
                      {index + 1}
                    </button>
                  </li>
                );
              })}
            </ul>

            {/* Next button */}
            <button
              disabled={currentPage === totalPages}
              onClick={() =>
                setCurrentPage((prev) => Math.min(totalPages, prev + 1))
              }
              className="px-3 py-1 text-sm rounded border border-gray-300 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default PartContent;
