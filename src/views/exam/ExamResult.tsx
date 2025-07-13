"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";

import {
  ClockIcon,
  ArrowLeftIcon,
  CheckCircleIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";

import NotFound from "@/app/not-found";
import ROUTES from "@/constants/routes";
import API_ENDPOINTS from "@/constants/api";
import FullPageLoading from "@/components/features/FullPageLoading";

import { useAuth } from "@/contexts/AuthContext";
import { useQuestionDetailQuery } from "@/hooks/useQuestionDetailQuery";

// Interface for question
interface Question {
  id: number;
  isCorrect: boolean;
  userAnswer: string;
  correctAnswer: string;
  userContent?: string;
}

function ExamResults({ examAttemptId }: { examAttemptId: string }) {
  const { user, token } = useAuth();

  const [loading, setLoading] = useState(true);
  const [examData, setExamData] = useState<any>(null);
  const partCacheRef = useRef<Record<string, any>>({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activePartDetail, setActivePartDetail] = useState<any>(null);
  const [activePartNumber, setActivePartNumber] = useState<string | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<
    number | null
  >(null);

  const questionList = useMemo(() => {
    return activePartDetail?.questions ?? [];
  }, [activePartDetail]);
  const questionId =
    currentQuestionIndex !== null
      ? questionList[currentQuestionIndex].question_id
      : null;

  const { data: selectedQuestion, isLoading: questionLoading } =
    useQuestionDetailQuery(examAttemptId, questionId);

  const handleOpenQuestionModal = (questionId: number) => {
    const index = questionList.findIndex(
      (q: any) => q.question_id === questionId
    );

    setCurrentQuestionIndex(index);
    setIsModalOpen(true);
  };

  useEffect(() => {
    if (!examAttemptId || !user) return;

    const fetchExamSummary = async () => {
      setLoading(true);

      try {
        const res = await fetch(
          API_ENDPOINTS.EXAM_ATTEMPTS.DETAILS(examAttemptId, user.id.toString())
        );
        const result = await res.json();

        // console.log(result);

        if (result.success && result.data) {
          setExamData(result.data);
          fetchPartDetail(result.data.parts[0].part_number);
        } else {
          console.log(result.message);
        }
      } catch (error) {
        console.error("Lỗi khi tải exam summary", error);
      } finally {
        setLoading(false);
      }
    };

    fetchExamSummary();
  }, [examAttemptId, user]);

  const fetchPartDetail = async (partNumber: string) => {
    setActivePartNumber(partNumber);
    // setActivePartDetail(null); // loading state

    // Nếu đã có trong cache thì lấy ra luôn
    if (partCacheRef.current[partNumber]) {
      setActivePartDetail(partCacheRef.current[partNumber]);
      return;
    }

    try {
      const res = await fetch(
        API_ENDPOINTS.EXAM_ATTEMPTS.PART(examAttemptId, partNumber),
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      const data = await res.json();

      partCacheRef.current[partNumber] = data;

      setActivePartDetail(data);
    } catch (error) {
      console.error("Không thể tải dữ liệu part", error);
      setActivePartDetail(null); // reset
    }
  };

  const feedbackLabels: Record<string, string> = {
    feedback_text: "Nhận xét tổng quan",
    suggestions: "Đề xuất cải thiện",
    strengths: "Điểm mạnh",
    weaknesses: "Điểm yếu",
  };

  if (loading) return <FullPageLoading />;

  if (!examData) return <NotFound />;

  return (
    <div className="min-h-screen p-4">
      {/* Back Button */}
      <div className="mb-4">
        <Link
          href={ROUTES.EXAM.OVERVIEW_HISTORY(examData.exam_id, examAttemptId)}
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          <span>Quay lại</span>
        </Link>
      </div>

      {/* Header */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-gray-900">
            Xem chi tiết: {examData?.exam_title}
          </h1>
        </div>

        {/* Overall Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="text-sm text-gray-600">Câu trả lời đúng</div>
            <div className="text-xl font-bold text-green-600">
              {examData?.correctAnswers}/{examData?.totalQuestions}
            </div>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="text-sm text-gray-600">Câu hỏi</div>
            <div className="text-xl font-bold text-purple-600">
              {examData?.totalQuestions}
            </div>
          </div>
          <div className="bg-orange-50 p-4 rounded-lg">
            <div className="text-sm text-gray-600">Điểm</div>
            <div className="text-xl font-bold text-orange-600">
              {examData?.score}
            </div>
          </div>
        </div>

        {/* Time and Detailed Scores */}
        <div className="flex items-center gap-2 text-gray-600 mb-4">
          <ClockIcon className="h-4 w-4" />
          <span className="text-sm">
            Thời gian làm bài: {examData?.durationInMinutes} phút
          </span>
        </div>
      </div>

      {/* Tabs for parts */}
      <div className="mb-6 border-b border-gray-200">
        <div className="flex flex-wrap gap-2">
          {examData?.parts.map((part: any) => (
            <button
              key={part.part_number}
              onClick={() => fetchPartDetail(part.part_number)}
              className={`px-4 py-2 rounded-t-md text-sm font-medium ${
                activePartNumber === part.part_number
                  ? "bg-blue-100 text-blue-700 border-b-2 border-blue-700"
                  : "text-gray-600 hover:text-blue-600"
              }`}
            >
              Part {part.part_number}
            </button>
          ))}
        </div>
      </div>

      {/* Parts Results */}
      {activePartDetail && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-900 flex flex-wrap items-center gap-4">
            <span className="text-xl text-blue-600">
              {activePartDetail.part_title}
            </span>

            <span className="inline-flex items-center gap-1 text-sm px-3 py-1 bg-green-100 text-green-800 rounded-full">
              Đúng: {activePartDetail.question_correct}/{activePartDetail.total}{" "}
              câu
            </span>

            <span className="inline-flex items-center gap-1 text-sm px-3 py-1 bg-orange-100 text-orange-800 rounded-full">
              Điểm: {activePartDetail.score}
            </span>
          </h2>

          {/* AI Feedback */}
          <div className="mb-6 space-y-3">
            {["feedback_text", "suggestions", "strengths", "weaknesses"].map(
              (key, i) => (
                <div
                  key={key}
                  className={`p-4 rounded-md ${
                    i === 0
                      ? "bg-blue-50 border-l-4 border-blue-400"
                      : i === 1
                      ? "bg-green-50 border-l-4 border-green-400"
                      : i === 2
                      ? "bg-yellow-50 border-l-4 border-yellow-400"
                      : "bg-red-50 border-l-4 border-red-400"
                  }`}
                >
                  <div className="text-sm font-semibold mb-1 capitalize">
                    {feedbackLabels[key]}
                  </div>
                  <div className="text-sm text-gray-800 whitespace-pre-line">
                    {
                      examData.parts.find(
                        (p: any) =>
                          p.part_number === activePartDetail.part_number
                      )?.[key]
                    }
                  </div>
                </div>
              )
            )}
          </div>

          {/* Questions */}
          <div className="grid grid-cols-2 gap-3">
            {activePartDetail?.questions?.map((question: any) => (
              <div
                key={question.question_id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-medium text-sm ${
                      question.is_correct ? "bg-blue-500" : "bg-gray-400"
                    }`}
                  >
                    {question.question_number}
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">
                      {question.user_answer ? `${question.user_answer} / ` : ""}
                      {question.correct_answer}
                    </span>
                  </div>
                </div>
                <div
                  className="flex items-center gap-2 cursor-pointer"
                  onClick={() => handleOpenQuestionModal(question.question_id)}
                >
                  {question.is_correct ? (
                    <>
                      <CheckCircleIcon className="h-4 w-4 text-green-500" />
                      <span className="text-xs text-green-600 font-medium">
                        [chi tiết]
                      </span>
                    </>
                  ) : (
                    <>
                      <XCircleIcon className="h-4 w-4 text-red-500" />
                      <span className="text-xs text-red-600 font-medium">
                        [chi tiết]
                      </span>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {loading && <FullPageLoading />}

      {isModalOpen && selectedQuestion && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          {questionLoading ? (
            <FullPageLoading />
          ) : (
            <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl p-8 relative overflow-y-auto max-h-[90vh]">
              <button
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-xl"
                onClick={() => {
                  setIsModalOpen(false);
                }}
              >
                ✕
              </button>

              <h3 className="text-2xl font-bold mb-4 text-gray-900">
                Câu {selectedQuestion.question_number}
              </h3>

              <div className="grid grid-cols-1 gap-6 mb-6">
                <div>
                  {activePartDetail.audio_file_path && (
                    <div className="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <p className="text-sm font-semibold text-gray-700 mb-2">
                        🎧 Nghe đoạn hội thoại:
                      </p>
                      <audio
                        controls
                        src={`${activePartDetail.audio_file_path}`}
                        className="w-full mb-2"
                      >
                        Trình duyệt của bạn không hỗ trợ phát âm thanh.
                      </audio>

                      {activePartDetail.audio_status && (
                        <Link
                          href={`/practice/audio/${selectedQuestion.question_id}`}
                          className="inline-flex items-center gap-1 px-4 py-2 bg-blue-100 text-blue-700 font-medium rounded-lg hover:bg-blue-200 transition-colors no-underline"
                        >
                          <span>🎧 Sang trang luyện nghe thông minh</span>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={2}
                            stroke="currentColor"
                            className="w-4 h-4"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                            />
                          </svg>
                        </Link>
                      )}
                    </div>
                  )}
                  <p className="text-sm font-semibold text-gray-700 mb-2">
                    Văn bản đoạn hội thoại:
                  </p>
                  <p className="text-sm text-gray-800 whitespace-pre-line">
                    {selectedQuestion.group_content}
                  </p>

                  {selectedQuestion.group_image_url && (
                    <div className="relative w-full mt-3 rounded border overflow-hidden">
                      <Image
                        src={`/${selectedQuestion.group_image_url}`}
                        alt={`anh doan van ${selectedQuestion.question_id}`}
                        width={0}
                        height={0}
                        sizes="100vw"
                        className="w-full h-auto object-contain"
                      />
                    </div>
                  )}

                  {selectedQuestion.group_translation && (
                    <p className="mt-2 text-sm italic text-gray-500">
                      Dịch: {selectedQuestion.group_translation}
                    </p>
                  )}
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-700 mb-2">
                    Nội dung câu hỏi:
                  </p>
                  <p className="text-sm text-gray-800 whitespace-pre-line">
                    {selectedQuestion.content}
                  </p>

                  {selectedQuestion.question_image_url && (
                    <div className="relative w-full mt-3 rounded border overflow-hidden">
                      <Image
                        src={`/${selectedQuestion.question_image_url}`}
                        alt="Ảnh câu hỏi"
                        width={0}
                        height={0}
                        sizes="100vw"
                        className="w-full h-auto object-contain"
                      />
                    </div>
                  )}

                  {selectedQuestion.question_translation && (
                    <p className="mt-2 text-sm italic text-gray-500">
                      Dịch: {selectedQuestion.question_translation}
                    </p>
                  )}
                </div>
              </div>

              <ul className="space-y-3 mb-4">
                {selectedQuestion.answers.map((a: any, idx: number) => (
                  <li
                    key={idx}
                    className={`text-sm px-4 py-2 rounded-lg border transition-all ${
                      a.is_correct
                        ? "bg-green-100 border-green-400 text-green-900 font-semibold"
                        : selectedQuestion.user_answer?.content === a.content
                        ? "bg-red-100 border-red-400 text-red-900"
                        : "border-gray-300"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span>{a.content}</span>
                      <span className="text-xs text-gray-500">
                        {a.translation}
                      </span>
                    </div>
                    {a.explanation && (
                      <p className="text-sm text-gray-500 mt-1 italic">
                        Giải thích: {a.explanation}
                      </p>
                    )}
                  </li>
                ))}
              </ul>

              {selectedQuestion.explanation && (
                <div className="bg-blue-50 border-l-4 border-blue-400 px-4 py-3 rounded text-sm text-gray-800">
                  <strong>Giải thích tổng quan:</strong>{" "}
                  {selectedQuestion.explanation}
                </div>
              )}

              <div className="flex justify-between mt-6">
                <button
                  disabled={currentQuestionIndex === 0}
                  onClick={() =>
                    setCurrentQuestionIndex((prev) => (prev ?? 0) - 1)
                  }
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 disabled:opacity-50"
                >
                  ← Quay lại
                </button>

                <button
                  disabled={currentQuestionIndex === questionList.length - 1}
                  onClick={() =>
                    setCurrentQuestionIndex((prev) => (prev ?? 0) + 1)
                  }
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                >
                  Tiếp theo →
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default ExamResults;
