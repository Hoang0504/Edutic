'use client';

import { AcademicCapIcon, ClockIcon, TrophyIcon } from '@heroicons/react/24/outline';

export default function DashboardPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Greeting Section */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
          Xin chào, Tên!
        </h1>
        <p className="text-gray-600">
          Chào mừng bạn trở lại với Edutic. Hãy bắt đầu hành trình học tập hôm nay!
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <ClockIcon className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Kỳ thi gần nhất</p>
              <p className="text-xl font-bold text-gray-900">5 ngày</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <AcademicCapIcon className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Ngày dự thi</p>
              <p className="text-xl font-bold text-gray-900">15/12/2024</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <TrophyIcon className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Target Score</p>
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span>Nghe: 450</span>
                  <span>Nói: 160</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span>Đọc: 450</span>
                  <span>Viết: 180</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Results */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Kết quả thi gần nhất</h2>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">TOEIC Practice Test #{i}</p>
                  <p className="text-sm text-gray-600">2 ngày trước</p>
                </div>
                <div className="text-lg font-bold text-blue-600">
                  {800 + i * 20}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Đề thi mới nhất</h2>
          <div className="grid grid-cols-2 gap-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="p-3 bg-gray-50 rounded-lg text-center">
                <p className="font-medium text-gray-900 text-sm">Test #{i}</p>
                <p className="text-xs text-gray-600">200 câu</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 