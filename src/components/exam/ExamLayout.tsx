"use client";

import Link from "next/link";
import React, { useState, useEffect } from "react";

import { useRouter } from "next/navigation";

import LRExam from "./LRExam";
import WritingExam from "./WritingExam";
import ROUTES from "@/constants/routes";
import SpeakingExam from "./SpeakingExam";
import API_ENDPOINTS from "@/constants/api";
import QuestionNavigator from "./QuestionNavigator";

import { useExamAttemptInfo } from "@/contexts/ExamAttemptInfoContext";
import { useSelectedAnswers } from "@/contexts/SelectedAnswersContext";
import { useExamProctoring } from "@/hooks/UseExamProctoring";
import ExamProctoring from "./ExamProctoring";
import ExamPermissionDialog from "../ExamPermissionDialog";
import ExamViolationAlert from "./ExamViolationAlert";

// interface ExamLayoutProps {
//   // mode: "lr" | "sw";
//   // examTitle: string;
//   // totalTime: number; // in minutes
//   onExit: () => void;
//   onSubmit: () => void;
//   children: React.ReactNode;
//   onSkillChange?: (skill: string) => void;
//   selectedAnswers?: { [key: number]: string };
//   onQuestionClick?: (questionId: number) => void;
// }

const getInitialActiveSkill = (mode: string | undefined) => {
  if (mode === "l") return "listening";
  if (mode === "r") return "reading";
  if (mode === "lr") return "listening";
  if (mode === "s") return "speaking";
  if (mode === "w") return "writing";
  if (mode === "sw") return "speaking";
  return "listening"; // fallback default
};

const getInitialSkills = (mode: string | undefined) => {
  if (mode === "l") return ["Listening"];
  if (mode === "r") return ["Reading"];
  if (mode === "lr") return ["Listening", "Reading"];
  if (mode === "s") return ["Speaking"];
  if (mode === "w") return ["Writing"];
  if (mode === "sw") return ["Speaking", "Writing"];
  return []; // fallback default
};

function ExamLayout({ examAttemptId }: { examAttemptId: string }) {
  const { data, loadData } = useExamAttemptInfo(); // Custom context hook
  const mode = data?.mode;
  const examTitle = data?.title;
  const totalQuestions = data?.totalQuestionCount ?? 0;
  const totalTime = data?.estimated_time ?? 120;

  const [activeSkill, setActiveSkill] = useState<
    "listening" | "reading" | "writing" | "speaking" | null
  >(null);
  const [skills, setSkills] = useState<string[]>([]);
  const [startTime, setStartTime] = useState<Date | null>(null); // convert to seconds
  const [timeLeft, setTimeLeft] = useState<number | null>(null); // convert to seconds
  const [responses, setResponses] = useState<{ [key: number]: any }>({});
  const [currentQuestionId, setCurrentQuestionId] = useState<
    number | undefined
  >(undefined);
  const [isPartActive, setIsPartActive] = useState(false);
  const { selectedAnswers, setSelectedAnswers } = useSelectedAnswers();
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [submitWarning, setSubmitWarning] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isTimerPaused, setIsTimerPaused] = useState(false);

  const router = useRouter();

  const proctoringSystem = useExamProctoring({
    isEnabled: true,
    // currentSkill: activeSkill,
    onTimerPause: (pause: boolean) => {
      setIsTimerPaused(pause);
      console.log("Timer paused:", pause);
    },
    onExamCancel: () => {
      console.log("Exam cancelled by proctoring system");
      alert("Bài thi đã bị hủy bởi hệ thống giám sát");
      handleCancel();
    },
  });

  useEffect(() => {
    if (examAttemptId) loadData(examAttemptId);
  }, [examAttemptId]);

  // Get time for each skill (in minutes)
  const getSkillTime = (skill: string) => {
    switch (skill) {
      case "listening":
        return 45; // 45 minutes
      case "reading":
        return 75; // 75 minutes
      case "writing":
        return 8; // 8 minutes
      case "speaking":
        return 8; // 8 minutes
      default:
        return totalTime;
    }
  };

  // const skills = [
  //   { id: "listening", name: "Listening", color: "bg-blue-500" },
  //   { id: "reading", name: "Reading", color: "bg-green-500" },
  //   { id: "writing", name: "Writing", color: "bg-yellow-500" },
  //   { id: "speaking", name: "Speaking", color: "bg-red-500" },
  // ];

  // Start part timer
  const startPartTimer = () => {
    setIsPartActive(true);
    // setTimeLeft(getSkillTime(activeSkill) * 60);
  };

  const handleCancel = async () => {
    try {
      const res = await fetch(
        API_ENDPOINTS.EXAM_ATTEMPTS.CANCEL(examAttemptId),
        {
          method: "PATCH",
        }
      );

      if (res.ok) {
        router.push(ROUTES.BASE_URL);
      }
    } catch (error) {
      console.error("Failed to cancel exam info:", error);
    }
  };

  const submitExam = async () => {
    // Implement your exam submission logic here
    // console.log("Exam submitted with answers:", selectedAnswers);
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      const res = await fetch(
        API_ENDPOINTS.EXAM_ATTEMPTS.SUBMIT(examAttemptId),
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            startTime,
            selectedAnswers,
          }),
        }
      );

      if (!res.ok) {
        console.log(res);

        setSubmitError(
          "Edutic đang gặp lỗi nộp bài thi của bạn, xin lỗi vì sự bất tiện, xin vui lòng thử lại sau!"
        );
        return;
      }

      router.push(`${ROUTES.EXAM.OVERVIEW}/${data?.exam_id}`);
    } catch (error) {
      console.error("Failed to fetch exam info:", error);
      setSubmitError(
        "Edutic đang gặp lỗi nộp bài thi của bạn, xin lỗi vì sự bất tiện, xin vui lòng thử lại sau!"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (mode && !activeSkill) {
      setActiveSkill(getInitialActiveSkill(mode));
    }
    if (mode && skills.length === 0) {
      setSkills(getInitialSkills(mode));
    }
  }, [mode]);

  useEffect(() => {
    if (totalTime) {
      setStartTime(new Date());
      setTimeLeft(totalTime * 60); // convert to seconds
    }
  }, [totalTime]);

  useEffect(() => {
    if (timeLeft === null) return;

    const timer = setInterval(() => {
      if (!isTimerPaused && !proctoringSystem.isTimerPaused) {
        setTimeLeft((prev) => {
          if (prev !== null && prev <= 1) {
            clearInterval(timer);
            submitExam();
            return 0;
          }
          return (prev ?? 0) - 1;
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, isTimerPaused, proctoringSystem.isTimerPaused]);

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
    // setCurrentQuestionId(undefined);
    // if (onSkillChange) {
    //   onSkillChange(skill);
    // }
  };

  // Handle speaking/writing responses
  const handleAnswerSubmit = async (
    questionId: number,
    response: string,
    audioBlob?: Blob
  ) => {
    setResponses((prev) => ({
      ...prev,
      [questionId]: { response, audioBlob },
    }));
  };

  // Handle individual question submission (for writing/speaking specific questions)
  const handleQuestionSubmit = (questionId: number, answer: string) => {
    // setSelectedAnswers((prev) => ({
    //   ...prev,
    //   [questionId]: answer,
    // }));
  };

  // Handle question navigation when clicking on question numbers
  const handleQuestionClick = (questionId: number) => {
    // Only allow navigation for writing and speaking
    if (activeSkill === "writing" || activeSkill === "speaking") {
      setCurrentQuestionId(questionId);
    }

    // Call the original onQuestionClick for other functionality
    // onQuestionClick(questionId);
  };

  // Get parts structure for current active skill
  const getPartsForActiveSkill = () => {
    switch (activeSkill) {
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
        return [];
    }
  };

  // Handle part completion with AI analysis
  const handlePartComplete = async (partId: number, responses: any[]) => {
    try {
      console.log(`Part ${partId} completed with responses:`, responses);

      // Combine all responses for this part
      const combinedContent = responses
        .map((r) => r.transcription || r.response)
        .filter(Boolean)
        .join("\n\n");

      if (!combinedContent.trim()) {
        console.warn("No content to analyze for part", partId);
        return;
      }

      let apiEndpoint = "";
      let analysisData: any = {};

      if (activeSkill === "speaking") {
        apiEndpoint = "/api/demo/analyze-speaking";
        analysisData = {
          question: `TOEIC Speaking Part ${partId} - Multiple responses`,
          transcription: combinedContent,
          recordingTime: responses.length * 30, // Estimate based on number of responses
        };
      } else if (activeSkill === "writing") {
        apiEndpoint = "/api/demo/analyze-writing";
        analysisData = {
          question: `TOEIC Writing Part ${partId} - Multiple responses`,
          essay: combinedContent,
        };
      }

      if (apiEndpoint) {
        const response = await fetch(apiEndpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(analysisData),
        });

        if (response.ok) {
          const feedback = await response.json();
          console.log(`AI feedback for part ${partId}:`, feedback);

          // Show feedback to user (you can implement a modal or sidebar for this)
          alert(
            `Part ${partId} completed! AI Score: ${feedback.score}/10. Check console for detailed feedback.`
          );
        } else {
          console.error("Failed to get AI analysis");
        }
      }
    } catch (error) {
      console.error("Error analyzing part:", error);
    }
  };

  const handleExamSubmit = () => {
    // console.log(selectedAnswers);
    const totalSelectedAnswers = Object.keys(selectedAnswers).length;

    if ((timeLeft ?? 0) > 0 && totalSelectedAnswers < totalQuestions) {
      setSubmitWarning(
        `Bạn chưa làm xong bài (đã trả lời ${totalSelectedAnswers}/${totalQuestions} câu) hoặc thời gian chưa hết. Bạn có chắc chắn muốn nộp bài không?`
      );
      setShowSubmitModal(true);
      return;
    }

    submitExam();
  };

  const handleConfirmSubmit = () => {
    setShowSubmitModal(false);
    setTimeLeft(null);
    submitExam();
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-white shadow-sm rounded-tl-lg rounded-tr-lg">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-semibold text-gray-800">{examTitle}</h1>

            {/* Proctoring status indicator */}
            {proctoringSystem.proctoringEnabled && (
              <div className="flex items-center space-x-2 text-sm">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-green-600 font-medium">
                  Giám sát đang hoạt động
                </span>
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
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span className="text-sm font-medium">Đã tạm dừng</span>
              </div>
            )}

            <Link
              href={ROUTES.BASE_URL}
              className="bg-teal-500 hover:bg-teal-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
            >
              Thoát
            </Link>
          </div>
        </div>
      </div>

      {/* Skills Navigation */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex space-x-1">
            {/* handleSkillChange(skill.id as any) */}
            {skills.map((skill) => (
              <button
                key={skill}
                onClick={() =>
                  setActiveSkill(
                    skill.toLowerCase() as
                      | "listening"
                      | "reading"
                      | "writing"
                      | "speaking"
                  )
                }
                className={`px-6 py-3 font-medium text-sm rounded-t-lg transition-colors ${
                  activeSkill === skill.toLowerCase()
                    ? "bg-gray-100 text-gray-800 border-b-2 border-blue-500"
                    : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
                }`}
              >
                {skill}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-6">
        <div className="flex gap-6">
          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {(activeSkill === "listening" || activeSkill === "reading") && (
              <LRExam activeSkill={activeSkill} />
            )}
            {activeSkill === "writing" && (
              <WritingExam
                parts={[]} // Will be populated from props or API later
                onAnswerSubmit={handleAnswerSubmit}
                onPartComplete={handlePartComplete}
                onQuestionSubmit={handleQuestionSubmit}
                currentQuestionId={currentQuestionId}
                onStartPart={startPartTimer}
              />
            )}
            {activeSkill === "speaking" && (
              <SpeakingExam
                parts={[]} // Will be populated from props or API later
                onAnswerSubmit={handleAnswerSubmit}
                onPartComplete={handlePartComplete}
                onQuestionSubmit={handleQuestionSubmit}
                currentQuestionId={currentQuestionId}
                onStartPart={startPartTimer}
              />
            )}
          </div>

          {/* Right Sidebar */}
          <div className="w-64 space-y-6">
            {/* Timer */}
            <div className="bg-white rounded-lg shadow-sm border p-4">
              <h3 className="font-medium text-gray-800 mb-2">
                Thời gian làm bài
              </h3>
              <div className="text-2xl font-bold text-red-600 mb-4">
                {formatTime(timeLeft ?? 0)}
              </div>
              <button
                onClick={handleExamSubmit}
                disabled={isSubmitting}
                className={`w-full ${
                  isSubmitting
                    ? "bg-red-400 cursor-not-allowed"
                    : "bg-green-500 hover:bg-green-600"
                } text-white py-2 rounded-lg font-medium transition-colors`}
              >
                {isSubmitting ? "Đang nộp bài..." : "Nộp bài"}
              </button>
              {submitError && (
                <p className="text-red-600 text-sm mt-2">{submitError}</p>
              )}
            </div>

            {/* Question Navigator */}
            <QuestionNavigator
            // onQuestionClick={handleQuestionClick}
            />

            {/* Progress Summary */}
            <div className="bg-white rounded-lg shadow-sm border p-4">
              <h3 className="font-medium text-gray-800 mb-3">
                Progress Summary
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Listening:</span>
                  <span className="font-medium">Completed</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Reading:</span>
                  <span className="font-medium">Not started</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Writing:</span>
                  <span className="font-medium">In progress</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Speaking:</span>
                  <span className="font-medium">Not started</span>
                </div>
              </div>
            </div>
          </div>

          {showSubmitModal && (
            <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
                <h2 className="text-lg font-semibold mb-4 text-red-600">
                  Xác nhận nộp bài
                </h2>
                <p className="text-gray-700 mb-4">{submitWarning}</p>
                <div className="flex justify-end space-x-3">
                  <button
                    className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded-lg text-sm"
                    onClick={() => setShowSubmitModal(false)}
                  >
                    Hủy
                  </button>
                  <button
                    className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm"
                    onClick={() => {
                      setShowSubmitModal(false);
                      handleConfirmSubmit();
                      // onSubmit(); // Uncomment if you want to trigger real submit logic
                    }}
                  >
                    Xác nhận nộp bài
                  </button>
                </div>
              </div>
            </div>
          )}
          {/* Proctoring Camera */}
          <ExamProctoring
            isEnabled={proctoringSystem.proctoringEnabled}
            onViolation={proctoringSystem.handleViolation}
            onPauseTimer={(pause) => setIsTimerPaused(pause)}
            currentSkill="reading"
          />
          {/* {activeSkill} */}

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
            violationType={proctoringSystem.currentViolation?.type || "face"}
            message={proctoringSystem.currentViolation?.message || ""}
            onContinue={proctoringSystem.handleContinueAfterViolation}
            onCancel={proctoringSystem.handleCancelFromViolation}
          />
        </div>
      </div>
    </div>
  );
}

export default ExamLayout;
