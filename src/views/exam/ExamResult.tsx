"use client";

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ClockIcon,
  ArrowLeftIcon,
  CheckCircleIcon,
  XCircleIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";
import API_ENDPOINTS from "@/constants/api";
import FullPageLoading from "@/components/features/FullPageLoading";
import NotFound from "@/app/not-found";

// Interface for question
interface Question {
  id: number;
  isCorrect: boolean;
  userAnswer: string;
  correctAnswer: string;
  userContent?: string;
}

function ExamResults({ examId }: { examId: string }) {
  const [loading, setLoading] = useState(true);
  const [examData, setExamData] = useState<any>(null);
  const partCacheRef = useRef<Record<string, any>>({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [questionLoading, setQuestionLoading] = useState(false);
  const [activePartDetail, setActivePartDetail] = useState<any>(null);
  const [selectedQuestion, setSelectedQuestion] = useState<any>(null);
  const [activePartNumber, setActivePartNumber] = useState<string | null>(null);

  const handleQuestionDetail = async (questionId: string) => {
    setQuestionLoading(true);
    try {
      const res = await fetch(
        API_ENDPOINTS.EXAM_ATTEMPTS.QUESTION_DETAILS(examId, questionId)
      );
      const data = await res.json();
      setSelectedQuestion(data);
      setIsModalOpen(true);
    } catch (err) {
      console.error("Lỗi tải câu hỏi", err);
    }
    setQuestionLoading(false);
  };

  useEffect(() => {
    if (!examId) return;

    const fetchExamSummary = async () => {
      setLoading(true);

      try {
        const res = await fetch(
          `${API_ENDPOINTS.EXAM_ATTEMPTS.DETAILS(examId)}?user_id=2`
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
  }, [examId]);

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
        API_ENDPOINTS.EXAM_ATTEMPTS.PART(examId, partNumber)
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
          href={`/exams/${examId}`}
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
            {activePartDetail.questions.map((question: any) => (
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
                  onClick={() => handleQuestionDetail(question.question_id)}
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
            <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
              <button
                className="absolute top-0 right-0 p-4 text-gray-400 hover:text-gray-600"
                onClick={() => {
                  setIsModalOpen(false);
                  setSelectedQuestion(null);
                }}
              >
                ✕
              </button>

              <h3 className="text-lg font-semibold mb-2 text-gray-900">
                Câu hỏi {selectedQuestion.question_number}
              </h3>

              <p className="text-sm text-gray-700 mb-2 whitespace-pre-line">
                {selectedQuestion.content}
              </p>

              <p className="text-sm text-gray-700 mb-2 whitespace-pre-line">
                {selectedQuestion.group_content}
              </p>

              {selectedQuestion.question_image_url && (
                <img
                  src={`/${selectedQuestion.question_image_url}`}
                  alt="Câu hỏi"
                  className="mb-3 rounded shadow max-h-64 object-contain"
                />
              )}

              {selectedQuestion.group_image_url && (
                <img
                  src={`/${selectedQuestion.group_image_url}`}
                  alt="Câu hỏi"
                  className="mb-3 rounded shadow max-h-64 object-contain"
                />
              )}

              <ul className="space-y-2 mb-4">
                {selectedQuestion.answers.map((a: any) => (
                  <li
                    key={a.option}
                    className={`text-sm px-3 py-2 rounded border ${
                      a.is_correct
                        ? "bg-green-100 border-green-400 text-green-900 font-semibold"
                        : selectedQuestion.user_answer?.option === a.option
                        ? "bg-red-100 border-red-400 text-red-900"
                        : "border-gray-300"
                    }`}
                  >
                    {a.content}
                  </li>
                ))}
              </ul>

              {selectedQuestion.explanation && (
                <div className="text-sm text-gray-700">
                  <strong>Giải thích:</strong> {selectedQuestion.explanation}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default ExamResults;
