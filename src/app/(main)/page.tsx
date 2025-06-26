"use client";

import { useState } from "react";

import FlashcardOverview from "@/components/features/flashcards/FlashcardOverview";

function DashboardPage() {
  const [targetScores, setTargetScores] = useState({
    listening: 400,
    speaking: 150,
    reading: 400,
    writing: 150,
  });
  const [isEditingTarget, setIsEditingTarget] = useState(false);

  const recentTests = [
    { id: 1, title: "Bài 1", status: "Xem chi tiết" },
    { id: 2, title: "Bài 1", status: "Xem chi tiết" },
    { id: 3, title: "Bài 1", status: "Xem chi tiết" },
  ];

  const latestTests = [
    { id: 1, title: "Bài 1", status: "Xem chi tiết" },
    { id: 2, title: "Bài 1", status: "Xem chi tiết" },
    { id: 3, title: "Bài 1", status: "Xem chi tiết" },
    { id: 4, title: "Bài 1", status: "Xem chi tiết" },
    { id: 5, title: "Bài 1", status: "Xem chi tiết" },
    { id: 6, title: "Bài 1", status: "Xem chi tiết" },
  ];

  const updateTargetScore = (
    skill: keyof typeof targetScores,
    value: number
  ) => {
    setTargetScores((prev) => ({
      ...prev,
      [skill]: value,
    }));
  };

  return (
    <div>
      {/* User */}
      <div className="mb-6 sm:mb-8">
        <h2 className="text-2xl font-semibold text-gray-900">Xin chào, Tên</h2>
      </div>

      {/* Flash card gần nhất */}
      <div className="mb-6 sm:mb-8 bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          {/* Next Exam */}
          <div className="text-center">
            <h3 className="text-xs sm:text-sm font-medium text-gray-500 mb-2">
              Flashcard gần nhất
            </h3>
            <p className="text-xl sm:text-2xl font-bold text-gray-900">
              5 ngày
            </p>
          </div>

          {/*Ngày ôn tập */}
          <div className="text-center">
            <h3 className="text-xs sm:text-sm font-medium text-gray-500 mb-2">
              Ngày ôn tập
            </h3>
            <p className="text-base sm:text-lg font-semibold text-gray-900">
              ngày cụ thể
            </p>
          </div>

          {/* Target Score */}
          <div className="text-center">
            <h3 className="text-xs sm:text-sm font-medium text-gray-500 mb-2">
              Target
            </h3>
            {isEditingTarget ? (
              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-1 sm:gap-2">
                  <div>
                    <label className="text-xs text-gray-500">Nghe</label>
                    <input
                      type="number"
                      value={targetScores.listening}
                      onChange={(e) =>
                        updateTargetScore("listening", Number(e.target.value))
                      }
                      className="w-full px-1 sm:px-2 py-1 border border-gray-300 rounded text-center text-xs sm:text-sm"
                      min="0"
                      max="495"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500">Nói</label>
                    <input
                      type="number"
                      value={targetScores.speaking}
                      onChange={(e) =>
                        updateTargetScore("speaking", Number(e.target.value))
                      }
                      className="w-full px-1 sm:px-2 py-1 border border-gray-300 rounded text-center text-xs sm:text-sm"
                      min="0"
                      max="200"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500">Đọc</label>
                    <input
                      type="number"
                      value={targetScores.reading}
                      onChange={(e) =>
                        updateTargetScore("reading", Number(e.target.value))
                      }
                      className="w-full px-1 sm:px-2 py-1 border border-gray-300 rounded text-center text-xs sm:text-sm"
                      min="0"
                      max="495"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500">Viết</label>
                    <input
                      type="number"
                      value={targetScores.writing}
                      onChange={(e) =>
                        updateTargetScore("writing", Number(e.target.value))
                      }
                      className="w-full px-1 sm:px-2 py-1 border border-gray-300 rounded text-center text-xs sm:text-sm"
                      min="0"
                      max="200"
                    />
                  </div>
                </div>
                <button
                  onClick={() => setIsEditingTarget(false)}
                  className="text-xs sm:text-sm text-green-600 hover:text-green-800"
                >
                  ✓ Lưu
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="text-xs sm:text-sm font-medium text-gray-700 grid grid-cols-2 gap-1 sm:gap-2">
                  <div>Nghe: {targetScores.listening}</div>
                  <div>Nói: {targetScores.speaking}</div>
                  <div>Đọc: {targetScores.reading}</div>
                  <div>Viết: {targetScores.writing}</div>
                </div>
                <button
                  onClick={() => setIsEditingTarget(true)}
                  className="text-xs sm:text-sm text-blue-600 hover:text-blue-800"
                >
                  ✏️ Chỉnh sửa
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Đề thi mới nhất */}
      <div className="mb-6 sm:mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4 sm:mb-6">
          Đề thi mới nhất
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-6">
          {latestTests.map((test) => (
            <div
              key={test.id}
              className="bg-gray-400 rounded-lg p-4 sm:p-6 text-center text-white hover:bg-gray-500 transition-colors cursor-pointer"
            >
              <h3 className="text-base sm:text-lg font-semibold mb-2">
                {test.title}
              </h3>
              <p className="text-xs sm:text-sm">{test.status}</p>
            </div>
          ))}
        </div>

        <div className="text-center">
          <button className="text-blue-500 hover:text-blue-700 font-medium text-sm sm:text-base">
            Xem tất cả &gt;&gt;&gt; :
          </button>
        </div>
      </div>

      {/* Flashcard Section */}
      <div className="mb-6 sm:mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4 sm:mb-6">
          Flashcard
        </h2>
        <FlashcardOverview />
      </div>

      {/* Kết quả thi gần nhất */}
      <div className="mb-6 sm:mb-8">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6 p-2 bg-purple-100 border border-purple-300 rounded-lg inline-block">
          Kết quả thi gần nhất
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-4">
          {recentTests.map((test) => (
            <div
              key={test.id}
              className="bg-gray-400 rounded-lg p-4 sm:p-6 text-center text-white hover:bg-gray-500 transition-colors cursor-pointer"
            >
              <h3 className="text-base sm:text-lg font-semibold mb-2">
                {test.title}
              </h3>
              <p className="text-xs sm:text-sm">{test.status}</p>
            </div>
          ))}
        </div>

        <div className="text-center">
          <button className="text-blue-500 hover:text-blue-700 font-medium text-sm sm:text-base">
            Xem tất cả &gt;&gt;&gt;
          </button>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
