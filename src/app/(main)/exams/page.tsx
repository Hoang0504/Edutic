'use client';

import { useState } from 'react';
import { ClockIcon, PencilIcon, ChatBubbleLeftIcon, CalendarIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

// Dữ liệu mẫu cho đề thi
const sampleExams = [
  {
    id: 1,
    title: "Tên đề thi",
    duration: 90,
    year: 2000,
    questionCount: 1000,
    releaseDate: "05/6/2025",
    testDuration: 4,
    score: 80,
    status: "completed" as const
  },
  {
    id: 2,
    title: "Tên đề thi",
    duration: 90,
    year: 2000,
    questionCount: 1000,
    releaseDate: "05/6/2025",
    testDuration: 4,
    score: 80,
    status: "incomplete" as const
  },
  {
    id: 3,
    title: "Tên đề thi",
    duration: 90,
    year: 2000,
    questionCount: 1000,
    releaseDate: "05/6/2025",
    testDuration: 4,
    score: 80,
    status: "not_started" as const
  },
  {
    id: 4,
    title: "Tên đề thi",
    duration: 90,
    year: 2000,
    questionCount: 1000,
    releaseDate: "05/6/2025",
    testDuration: 4,
    score: 80,
    status: "completed" as const
  },
  {
    id: 5,
    title: "Tên đề thi",
    duration: 90,
    year: 2000,
    questionCount: 1000,
    releaseDate: "05/6/2025",
    testDuration: 4,
    score: 80,
    status: "incomplete" as const
  },
  {
    id: 6,
    title: "Tên đề thi",
    duration: 90,
    year: 2000,
    questionCount: 1000,
    releaseDate: "05/6/2025",
    testDuration: 4,
    score: 80,
    status: "not_started" as const
  }
];

type ExamStatus = 'completed' | 'incomplete' | 'not_started';
type TabType = 'all' | 'random' | 'written' | 'speaking';

export default function ExamsPage() {
  const [activeTab, setActiveTab] = useState<TabType>('all');
  const [sortBy, setSortBy] = useState('releaseDate');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const totalPages = Math.ceil(sampleExams.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentExams = sampleExams.slice(startIndex, startIndex + itemsPerPage);

  const getStatusButton = (status: ExamStatus) => {
    switch (status) {
      case 'completed':
        return (
          <button className="px-3 py-1 text-xs rounded-full bg-green-100 text-green-700 border border-green-200">
            Đã làm
          </button>
        );
      case 'incomplete':
        return (
          <button className="px-3 py-1 text-xs rounded-full bg-yellow-100 text-yellow-700 border border-yellow-200">
            Chưa hoàn thành
          </button>
        );
      case 'not_started':
        return (
          <button className="px-3 py-1 text-xs rounded-full bg-gray-100 text-gray-700 border border-gray-200">
            Chưa làm
          </button>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Thư viện đề thi</h1>
          
          {/* Tabs */}
          <div className="flex flex-wrap gap-2 mb-4">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                activeTab === 'all'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              Tất cả
            </button>
            <button
              onClick={() => setActiveTab('random')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                activeTab === 'random'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              Tạo đề thi ngẫu nhiên
            </button>
            <button
              onClick={() => setActiveTab('written')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                activeTab === 'written'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              Đề thi viết
            </button>
            <button
              onClick={() => setActiveTab('speaking')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                activeTab === 'speaking'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              Đề thi nói
            </button>
          </div>

          {/* Filter Section */}
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Xếp xếp:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="releaseDate">Ngày phát hành</option>
                <option value="title">Tên đề thi</option>
                <option value="duration">Thời gian</option>
              </select>
            </div>
            <button className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium">
              Ngày phát hành
            </button>
          </div>
        </div>

        {/* Exams Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {currentExams.map((exam) => (
            <div key={exam.id} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow">
              {/* Header */}
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold text-gray-900">{exam.title}</h3>
                <span className="text-sm text-gray-500">{exam.year}</span>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <ClockIcon className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-600">{exam.duration} phút</span>
                </div>
                <div className="flex items-center gap-2">
                  <PencilIcon className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-600">{exam.questionCount} câu</span>
                </div>
                <div className="flex items-center gap-2">
                  <CalendarIcon className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-600">Ngày phát hành: {exam.releaseDate}</span>
                </div>
                <div className="flex items-center gap-2">
                  <ClockIcon className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-600">{exam.testDuration} phút thi</span>
                </div>
              </div>

              {/* Score and Status */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">Điểm thi:</span>
                  <span className="font-semibold text-blue-600">{exam.score}/100</span>
                </div>
                {getStatusButton(exam.status)}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Link 
                  href={`/exams/${exam.id}`} 
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium text-center block"
                >
                  Xem chi tiết &gt;&gt;
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-center items-center gap-2">
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            &lt;
          </button>
          
          {[...Array(totalPages)].map((_, index) => {
            const pageNumber = index + 1;
            return (
              <button
                key={pageNumber}
                onClick={() => setCurrentPage(pageNumber)}
                className={`px-3 py-2 border rounded-lg text-sm font-medium transition-colors ${
                  currentPage === pageNumber
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                {pageNumber}
              </button>
            );
          })}
          
          {totalPages > 3 && (
            <>
              <span className="px-2 text-gray-500">...</span>
              <button
                onClick={() => setCurrentPage(10)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50"
              >
                10
              </button>
            </>
          )}
          
          <button
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            &gt;
          </button>
        </div>
      </div>
    </div>
  );
}
