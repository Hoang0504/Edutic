"use client";

import { useState } from "react";

export default function DashboardPage() {
  const [targetScores, setTargetScores] = useState({
    listening: 400,
    speaking: 150,
    reading: 400,
    writing: 150,
  });
  const [isEditingTarget, setIsEditingTarget] = useState(false);

  const flashcardSchedule = [
    { day: "t2", date: "24/12/2015", completed: true },
    { day: "t3", date: "25/12/2025", completed: false },
    { day: "t4", date: "26/12/2025", completed: false },
    { day: "t5", date: "27/12/2025", completed: false },
    { day: "t6", date: "28/12/2025", completed: false },
    { day: "t7", date: "29/12/2025", completed: false },
    { day: "CN", date: "30/12/2025", completed: false },
  ];

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

  const updateTargetScore = (skill: keyof typeof targetScores, value: number) => {
    setTargetScores(prev => ({
      ...prev,
      [skill]: value
    }));
  };

  return (
    <div className="max-w-6xl mx-auto px-3 sm:px-6 lg:px-8 pb-20 sm:pb-6">
      {/* User */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">Xin chào, Tên</h1>
      </div>

      {/* Flash card gần nhất */}
      <div className="mb-6 sm:mb-8 bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          {/* Next Exam */}
          <div className="text-center">
            <h3 className="text-xs sm:text-sm font-medium text-gray-500 mb-2">
              Flash card gần nhất
            </h3>
            <p className="text-xl sm:text-2xl font-bold text-gray-900">5 ngày</p>
          </div>

          {/*Ngày ôn tập */}
          <div className="text-center">
            <h3 className="text-xs sm:text-sm font-medium text-gray-500 mb-2">
              Ngày ôn tập
            </h3>
            <p className="text-base sm:text-lg font-semibold text-gray-900">ngày cụ thể</p>
          </div>

          {/* Target Score */}
          <div className="text-center">
            <h3 className="text-xs sm:text-sm font-medium text-gray-500 mb-2">Target</h3>
            {isEditingTarget ? (
              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-1 sm:gap-2">
                  <div>
                    <label className="text-xs text-gray-500">Nghe</label>
                    <input
                      type="number"
                      value={targetScores.listening}
                      onChange={(e) => updateTargetScore('listening', Number(e.target.value))}
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
                      onChange={(e) => updateTargetScore('speaking', Number(e.target.value))}
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
                      onChange={(e) => updateTargetScore('reading', Number(e.target.value))}
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
                      onChange={(e) => updateTargetScore('writing', Number(e.target.value))}
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

      {/* Flashcard Section */}
      <div className="mb-6 sm:mb-8">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6">
          flashcard của tôi
        </h2>
        
        {/* Calendar  */}
        <div className="grid grid-cols-7 gap-2 sm:gap-4 mb-6">
          {flashcardSchedule.map((item, index) => (
            <div
              key={index}
              className={`
                relative p-2 sm:p-4 rounded-lg text-center cursor-pointer transition-all
                ${
                  item.completed
                    ? "bg-green-100 border-2 border-green-300 text-green-800"
                    : "bg-gray-100 border-2 border-gray-300 text-gray-600 hover:bg-gray-200"
                }
              `}
            >
              <div className="text-sm sm:text-lg font-semibold mb-1 sm:mb-2">{item.day}</div>
              <div className="text-xs sm:text-sm leading-tight">{item.date}</div>
              {item.completed && (
                <div className="absolute top-1 right-1">
                  <svg
                    className="w-3 h-3 sm:w-4 sm:h-4 text-green-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>
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
              <h3 className="text-base sm:text-lg font-semibold mb-2">{test.title}</h3>
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

      {/* Đề thi mới nhất */}
      <div className="mb-6 sm:mb-8">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6">
          Đề thi mới nhất
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-6">
          {latestTests.map((test) => (
            <div
              key={test.id}
              className="bg-gray-400 rounded-lg p-4 sm:p-6 text-center text-white hover:bg-gray-500 transition-colors cursor-pointer"
            >
              <h3 className="text-base sm:text-lg font-semibold mb-2">{test.title}</h3>
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
    </div>
  );
}
