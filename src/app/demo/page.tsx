'use client';

import Link from 'next/link';
import { PencilIcon, SpeakerWaveIcon, SparklesIcon } from '@heroicons/react/24/outline';

export default function DemoPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <SparklesIcon className="h-12 w-12 text-purple-600 mr-3" />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              EDUTIC AI Demo
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Trải nghiệm tính năng phân tích TOEIC với AI DeepSeek
          </p>
          <div className="mt-4 text-sm text-gray-500">
            Các trang demo để kiểm tra tính năng trước khi tích hợp vào hệ thống chính
          </div>
        </div>

        {/* Demo Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Writing Demo */}
          <Link href="/demo/writing" className="group">
            <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-8 border border-gray-100 hover:border-blue-200 transform hover:-translate-y-1">
              <div className="flex items-center mb-6">
                <div className="bg-blue-100 p-3 rounded-full mr-4 group-hover:bg-blue-200 transition-colors">
                  <PencilIcon className="h-8 w-8 text-blue-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">TOEIC Writing</h2>
              </div>
              
              <p className="text-gray-600 mb-6 leading-relaxed">
                Viết bài essay, email và nhận phản hồi chi tiết từ AI DeepSeek về ngữ pháp, 
                từ vựng, cấu trúc và nội dung.
              </p>
              
              <div className="space-y-3 mb-6">
                <div className="flex items-center text-sm text-gray-500">
                  <span className="w-2 h-2 bg-blue-400 rounded-full mr-3"></span>
                  Phân tích ngữ pháp và từ vựng
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <span className="w-2 h-2 bg-blue-400 rounded-full mr-3"></span>
                  Đánh giá cấu trúc và mạch lạc
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <span className="w-2 h-2 bg-blue-400 rounded-full mr-3"></span>
                  Gợi ý cải thiện cụ thể
                </div>
              </div>
              
              <div className="text-blue-600 font-medium group-hover:text-blue-700 flex items-center">
                Thử ngay →
              </div>
            </div>
          </Link>

          {/* Speaking Demo */}
          <Link href="/demo/speaking" className="group">
            <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-8 border border-gray-100 hover:border-purple-200 transform hover:-translate-y-1">
              <div className="flex items-center mb-6">
                <div className="bg-purple-100 p-3 rounded-full mr-4 group-hover:bg-purple-200 transition-colors">
                  <SpeakerWaveIcon className="h-8 w-8 text-purple-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">TOEIC Speaking</h2>
              </div>
              
              <p className="text-gray-600 mb-6 leading-relaxed">
                Ghi âm bài nói, chuyển đổi giọng nói thành văn bản và nhận phân tích 
                về phát âm, độ trôi chảy và nội dung.
              </p>
              
              <div className="space-y-3 mb-6">
                <div className="flex items-center text-sm text-gray-500">
                  <span className="w-2 h-2 bg-purple-400 rounded-full mr-3"></span>
                  Speech-to-Text tự động
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <span className="w-2 h-2 bg-purple-400 rounded-full mr-3"></span>
                  Phân tích phát âm và độ trôi chảy
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <span className="w-2 h-2 bg-purple-400 rounded-full mr-3"></span>
                  Đánh giá nội dung và thời gian
                </div>
              </div>
              
              <div className="text-purple-600 font-medium group-hover:text-purple-700 flex items-center">
                Thử ngay →
              </div>
            </div>
          </Link>
        </div>

        {/* Technical Info */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Thông tin kỹ thuật</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-700 mb-2">🔧 Công nghệ sử dụng</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• DeepSeek AI API cho phân tích nội dung</li>
                <li>• Web Speech API cho Speech-to-Text</li>
                <li>• Next.js 14 với App Router</li>
                <li>• Tailwind CSS cho giao diện</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-700 mb-2">📝 Cần tích hợp</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Database lưu feedback vào bảng ai_feedbacks</li>
                <li>• Authentication để lấy user_id</li>
                <li>• Environment variable DEEPSEEK_API_KEY</li>
                <li>• Xử lý lỗi và retry logic</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Note */}
        <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">Lưu ý</h3>
              <div className="mt-2 text-sm text-yellow-700">
                <p>
                  Hiện tại API đang sử dụng mock data để demo. Khi tích hợp thực tế, 
                  cần cấu hình DEEPSEEK_API_KEY và kết nối database.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 