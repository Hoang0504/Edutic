"use client";

import { useState } from "react";
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

// Interface for question
interface Question {
  id: number;
  isCorrect: boolean;
  userAnswer: string;
  correctAnswer: string;
  userContent?: string;
}

// Mock data for exam results
const examResultsData = {
  1: {
    id: 1,
    title: "Đề thi 1",
    totalScore: 850,
    listeningScore: 425,
    readingScore: 425,
    speakingScore: 150,
    writingScore: 140,
    timeSpent: "1 giờ 30 phút",
    correctAnswers: 162,
    totalQuestions: 200,
    parts: [
      {
        id: 1,
        name: "Listening Part 1 - Photographs",
        type: "listening",
        questions: Array.from({ length: 6 }, (_, i) => ({
          id: i + 1,
          isCorrect: i < 5,
          userAnswer: i < 5 ? "A" : "B",
          correctAnswer: "A",
        })) as Question[],
      },
      {
        id: 2,
        name: "Listening Part 2 - Question–Response",
        type: "listening",
        questions: Array.from({ length: 25 }, (_, i) => ({
          id: i + 7,
          isCorrect: i < 20,
          userAnswer: i < 20 ? "C" : "A",
          correctAnswer: "C",
        })),
      },
      {
        id: 3,
        name: "Listening Part 3 - Short Conversations",
        type: "listening",
        questions: Array.from({ length: 39 }, (_, i) => ({
          id: i + 32,
          isCorrect: i < 30,
          userAnswer: i < 30 ? "B" : "D",
          correctAnswer: "B",
        })),
      },
      {
        id: 4,
        name: "Listening Part 4 - Short Talks",
        type: "listening",
        questions: Array.from({ length: 30 }, (_, i) => ({
          id: i + 71,
          isCorrect: i < 25,
          userAnswer: i < 25 ? "D" : "A",
          correctAnswer: "D",
        })),
      },
      {
        id: 5,
        name: "Reading Part 5 - Incomplete Sentences",
        type: "reading",
        questions: Array.from({ length: 30 }, (_, i) => ({
          id: i + 101,
          isCorrect: i < 25,
          userAnswer: i < 25 ? "A" : "C",
          correctAnswer: "A",
        })),
      },
      {
        id: 6,
        name: "Reading Part 6 - Text Completion",
        type: "reading",
        questions: Array.from({ length: 16 }, (_, i) => ({
          id: i + 131,
          isCorrect: i < 12,
          userAnswer: i < 12 ? "B" : "A",
          correctAnswer: "B",
        })),
      },
      {
        id: 7,
        name: "Reading Part 7 - Reading Comprehension",
        type: "reading",
        questions: Array.from({ length: 54 }, (_, i) => ({
          id: i + 147,
          isCorrect: i < 45,
          userAnswer: i < 45 ? "C" : "B",
          correctAnswer: "C",
        })),
      },
      {
        id: 8,
        name: "Speaking",
        type: "speaking",
        questions: Array.from({ length: 5 }, (_, i) => ({
          id: i + 1,
          isCorrect: i < 4,
          userAnswer: `Speaking response ${i + 1}`,
          correctAnswer: "Good",
          userContent:
            i === 0
              ? "In my opinion, technology has greatly improved our daily lives. For example, smartphones allow us to communicate instantly with people around the world..."
              : i === 1
              ? "I believe that environmental protection is crucial for our future. We should reduce plastic usage and promote renewable energy..."
              : i === 2
              ? "My favorite hobby is reading books because it helps me learn new things and expand my knowledge about different cultures..."
              : i === 3
              ? "Working from home has both advantages and disadvantages. On one hand, it saves commuting time, but on the other hand..."
              : "Education plays a vital role in society. It not only provides knowledge but also develops critical thinking skills...",
        })),
      },
      {
        id: 9,
        name: "Writing",
        type: "writing",
        questions: Array.from({ length: 2 }, (_, i) => ({
          id: i + 1,
          isCorrect: i < 1,
          userAnswer: `Writing task ${i + 1}`,
          correctAnswer: "Excellent",
          userContent:
            i === 0
              ? "Dear Manager,\n\nI am writing to express my interest in the marketing position advertised on your company website. With my 3 years of experience in digital marketing and proven track record of increasing brand awareness by 40%, I believe I would be a valuable addition to your team.\n\nI have extensive experience with social media marketing, content creation, and data analysis. In my previous role at ABC Company, I successfully managed multiple campaigns that resulted in a 25% increase in sales revenue.\n\nI would welcome the opportunity to discuss how my skills and experience can contribute to your company's continued success.\n\nSincerely,\nNguyen Van A"
              : "The graph shows the changes in smartphone usage among different age groups from 2010 to 2020. Overall, there was a significant increase in smartphone adoption across all age demographics.\n\nThe most notable change occurred in the 18-24 age group, where usage increased from 45% in 2010 to 95% in 2020. Similarly, the 25-34 age group saw an increase from 35% to 90% during the same period.\n\nInterestingly, even older demographics showed substantial growth. The 55-64 age group increased from just 8% to 65%, demonstrating that smartphone technology became more accessible and user-friendly over the decade.\n\nIn conclusion, smartphone usage has become nearly universal among younger generations while gaining significant traction among older users as well.",
        })),
      },
    ],
  },
};

export default function ExamResultsPage() {
  const params = useParams();
  const examId = (params?.examId as string) || "1";

  // State để quản lý trang hiện tại cho danh sách parts
  const [currentPartPage, setCurrentPartPage] = useState(1);
  const partsPerPage = 1; // Hiển thị 1 part mỗi trang

  // Get exam results data (fallback to exam 1 if not found)
  const examResults =
    examResultsData[examId as unknown as keyof typeof examResultsData] ||
    examResultsData[1];

  // Tính toán phân trang cho parts
  const totalPartPages = Math.ceil(examResults.parts.length / partsPerPage);
  const startPartIndex = (currentPartPage - 1) * partsPerPage;
  const endPartIndex = startPartIndex + partsPerPage;
  const currentParts = examResults.parts.slice(startPartIndex, endPartIndex);

  // Function để thay đổi trang parts
  const handlePartPageChange = (newPage: number) => {
    setCurrentPartPage(newPage);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <div className="mb-4">
          <Link
            href={`/exams/${examId}`}
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            <span>Quay lại chi tiết đề thi</span>
          </Link>
        </div>

        {/* Header */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-900">
              Xem chi tiết đề thi: {examResults.title}
            </h1>
            <button className="px-4 py-2 bg-orange-400 text-white rounded-lg font-medium">
              Xem đáp án
            </button>
          </div>

          {/* Overall Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-sm text-gray-600">Kết quả thi</div>
              <div className="text-xl font-bold text-blue-600">
                {examResults.totalScore}
              </div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="text-sm text-gray-600">Câu trả lời đúng</div>
              <div className="text-xl font-bold text-green-600">
                {examResults.correctAnswers}/{examResults.totalQuestions}
              </div>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="text-sm text-gray-600">Câu hỏi</div>
              <div className="text-xl font-bold text-purple-600">
                {examResults.totalQuestions}
              </div>
            </div>
            <div className="bg-orange-50 p-4 rounded-lg">
              <div className="text-sm text-gray-600">Điểm</div>
              <div className="text-xl font-bold text-orange-600">
                {examResults.totalScore}
              </div>
            </div>
          </div>

          {/* Time and Detailed Scores */}
          <div className="flex items-center gap-2 text-gray-600 mb-4">
            <ClockIcon className="h-4 w-4" />
            <span className="text-sm">
              Thời gian làm bài: {examResults.timeSpent}
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Nghe:</span>
              <span className="ml-2 font-medium" style={{ color: "black" }}>
                Điểm số bài / Điểm tổng
              </span>
              <div className="font-bold text-blue-600">
                Trả lời đúng: {examResults.listeningScore}/
                {examResults.listeningScore}
              </div>
            </div>
            <div>
              <span className="text-gray-600">Viết:</span>
              <span className="ml-2 font-medium" style={{ color: "black" }}>
                Điểm số bài / Điểm tổng
              </span>
              <div className="font-bold text-green-600">
                Điểm số bài / Điểm tổng: {examResults.writingScore}/
                {examResults.writingScore}
              </div>
            </div>
            <div>
              <span className="text-gray-600">Đọc:</span>
              <span className="ml-2 font-medium" style={{ color: "black" }}>
                Điểm số bài / Điểm tổng
              </span>
              <div className="font-bold text-purple-600">
                Trả lời đúng: {examResults.readingScore}/
                {examResults.readingScore}
              </div>
            </div>
            <div>
              <span className="text-gray-600">Nói:</span>
              <span className="ml-2 font-medium" style={{ color: "black" }}>
                Điểm số bài / Điểm tổng
              </span>
              <div className="font-bold text-orange-600">
                Điểm số bài / Điểm tổng: {examResults.speakingScore}/
                {examResults.speakingScore}
              </div>
            </div>
          </div>
        </div>

        {/* Parts Results */}
        <div className="space-y-6">
          {currentParts.map((part, partIndex) => {
            const actualPartIndex = startPartIndex + partIndex;

            return (
              <div
                key={part.id}
                className="bg-white rounded-lg border border-gray-200 p-6"
              >
                <div className="mb-4 pb-2 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900">
                    {actualPartIndex + 1}. {part.name}
                    <span className="ml-4 text-sm font-normal text-gray-600">
                      Điểm / Điểm chuẩn
                    </span>
                  </h2>
                </div>

                {/* Questions with integrated answers */}
                {part.type === "listening" || part.type === "reading" ? (
                  <div className="grid grid-cols-2 gap-3">
                    {part.questions.map((question, index) => (
                      <div
                        key={question.id}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`
                            w-8 h-8 rounded-full flex items-center justify-center text-white font-medium text-sm
                            ${
                              question.isCorrect ? "bg-blue-500" : "bg-gray-400"
                            }
                          `}
                          >
                            {question.id}
                          </div>
                          <div>
                            <span className="text-sm text-gray-600">
                              {question.userAnswer} / {question.correctAnswer}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {question.isCorrect ? (
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
                ) : (
                  <div className="space-y-4">
                    {part.questions.map((question, index) => (
                      <div
                        key={`content-${question.id}`}
                        className="bg-gray-50 p-4 rounded-lg"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-gray-900">
                            {part.type === "speaking"
                              ? `Câu trả lời ${question.id}:`
                              : `Bài viết ${question.id}:`}
                          </h4>
                          {question.isCorrect ? (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                              <CheckCircleIcon className="h-3 w-3 mr-1" />
                              Tốt
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800">
                              <XCircleIcon className="h-3 w-3 mr-1" />
                              Cần cải thiện
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-gray-700 whitespace-pre-line">
                          {(question as any).userContent || "Không có nội dung"}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Parts Pagination */}
        {totalPartPages > 1 && (
          <div className="mt-8 flex justify-center items-center gap-4">
            <button
              onClick={() =>
                handlePartPageChange(Math.max(1, currentPartPage - 1))
              }
              disabled={currentPartPage === 1}
              style={{ color: "black" }}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeftIcon className="h-4 w-4" />
              Trang trước
            </button>

            <div className="flex items-center gap-2">
              {[...Array(totalPartPages)].map((_, index) => {
                const pageNumber = index + 1;
                return (
                  <button
                    key={pageNumber}
                    onClick={() => handlePartPageChange(pageNumber)}
                    className={`px-3 py-2 border rounded-lg text-sm font-medium transition-colors ${
                      currentPartPage === pageNumber
                        ? "bg-blue-600 text-white border-blue-600"
                        : "border-gray-300 text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {pageNumber}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() =>
                handlePartPageChange(
                  Math.min(totalPartPages, currentPartPage + 1)
                )
              }
              disabled={currentPartPage === totalPartPages}
              style={{ color: "black" }}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Trang sau
              <ChevronRightIcon className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
