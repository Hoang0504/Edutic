'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ClockIcon, UserGroupIcon, CalendarIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';

// Mock data for exam details

type ExamStatus = 'completed' | 'incomplete' | 'not_started';

export default function ExamDetailPage() {
  const params = useParams();
  const examId = params.examId as string;
  
  // Get exam data (fallback to exam 1 if not found)
  const exam = examData[examId as keyof typeof examData] || examData[1];
  
  const getStatusBadge = (status: ExamStatus) => {
    switch (status) {
      case 'completed':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 border border-green-200">
            Đã làm
          </span>
        );
      case 'incomplete':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800 border border-yellow-200">
            Chưa hoàn thành
          </span>
        );
      case 'not_started':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800 border border-purple-200">
            Chưa làm
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <div className="mb-4">
          <Link 
            href="/exams" 
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            <span>Quay lại danh sách đề thi</span>
          </Link>
        </div>

        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-900">{exam.title}</h1>
            <div className="flex items-center gap-3">
              {exam.status === 'completed' && (
                <Link 
                  href={`/exams/${examId}/results`}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                >
                  Xem đáp án
                </Link>
              )}
              {getStatusBadge(exam.status)}
            </div>
          </div>
          
          {/* Exam Stats */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
            <div className="flex items-center gap-2 text-gray-600 mb-4">
              <ClockIcon className="h-4 w-4" />
              <span className="text-sm">
                {exam.status === 'completed' ? 'Thời gian đã làm:' : 'Thời gian làm bài:'} {exam.testDuration} phút | {exam.questionCount} câu hỏi | {exam.usersPracticed} người đã luyện tập đề thi này
              </span>
            </div>
          </div>
        </div>

        {/* Exam Structure */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
            Cấu trúc đề thi
          </h2>
          
          <div className="space-y-4">
            {exam.sections.map((section, index) => (
              <div key={index} className="flex items-center justify-between py-4 border-b border-gray-100 last:border-b-0">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-lg">
                    {section.icon}
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{section.name} : {section.questions}</h3>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-sm font-medium text-gray-700">
                    {section.score || ""}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 justify-center">
          {exam.status === 'completed' ? (
            <button className="px-6 py-3 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors font-medium border border-green-200">
              Bắt đầu làm lại
            </button>
          ) : (
            <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
              Bắt đầu làm
            </button>
          )}
        </div>

        {/* Additional Info */}
        <div className="mt-8 bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Thông tin bổ sung</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <ClockIcon className="h-4 w-4" />
              <span>Thời gian: {exam.duration} phút</span>
            </div>
            <div className="flex items-center gap-2">
              <CalendarIcon className="h-4 w-4" />
              <span>Năm: {exam.year}</span>
            </div>
            <div className="flex items-center gap-2">
              <UserGroupIcon className="h-4 w-4" />
              <span>{exam.totalUsers} bình luận</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
