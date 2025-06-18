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
