'use client';

import React from 'react';

interface ExamViolationAlertProps {
  isVisible: boolean;
  violationType: 'face' | 'audio';
  message: string;
  onContinue: () => void;
  onCancel: () => void;
}

const ExamViolationAlert: React.FC<ExamViolationAlertProps> = ({
  isVisible,
  violationType,
  message,
  onContinue,
  onCancel
}) => {
  if (!isVisible) return null;

  const getIcon = () => {
    if (violationType === 'face') {
      return (
        <svg className="w-12 h-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
      );
    } else {
      return (
        <svg className="w-12 h-12 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
        </svg>
      );
    }
  };

  const getTitle = () => {
    if (violationType === 'face') {
      return 'Cảnh báo: Không phát hiện khuôn mặt';
    } else {
      return 'Cảnh báo: Phát hiện âm thanh';
    }
  };

  const getDescription = () => {
    if (violationType === 'face') {
      return 'Hệ thống không thể phát hiện khuôn mặt của bạn. Vui lòng đảm bảo bạn đang ngồi trước camera và có đủ ánh sáng.';
    } else {
      return 'Hệ thống phát hiện âm thanh trong phần thi đọc. Vui lòng giữ im lặng và không nói chuyện trong phần này.';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-[60]">
      {/* Overlay to prevent interaction */}
      <div className="absolute inset-0" />
      
      {/* Alert Modal */}
      <div className="relative bg-white rounded-lg shadow-2xl max-w-lg w-full mx-4 animate-pulse">
        {/* Alert Banner */}
        <div className={`px-6 py-4 rounded-t-lg ${
          violationType === 'face' ? 'bg-red-500' : 'bg-orange-500'
        }`}>
          <div className="flex items-center space-x-3">
            <div className="bg-white rounded-full p-2">
              {getIcon()}
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">
                {getTitle()}
              </h2>
              <p className="text-white text-opacity-90 text-sm">
                Bài thi đã được tạm dừng
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-6">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              Chi tiết vi phạm:
            </h3>
            <div className="bg-gray-100 rounded-lg p-4 mb-4">
              <p className="text-gray-700">{message}</p>
            </div>
            <p className="text-sm text-gray-600">
              {getDescription()}
            </p>
          </div>

          {/* Instructions */}
          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h4 className="text-sm font-medium text-blue-800">
                  Hướng dẫn khắc phục:
                </h4>
                <div className="mt-2 text-sm text-blue-700">
                  {violationType === 'face' ? (
                    <ul className="list-disc list-inside space-y-1">
                      <li>Đảm bảo khuôn mặt của bạn hướng về phía camera</li>
                      <li>Kiểm tra ánh sáng trong phòng (tránh ngược sáng)</li>
                      <li>Di chuyển gần camera hơn nếu cần thiết</li>
                      <li>Loại bỏ các vật che khuất khuôn mặt</li>
                    </ul>
                  ) : (
                    <ul className="list-disc list-inside space-y-1">
                      <li>Giữ im lặng trong phần thi đọc</li>
                      <li>Tắt các thiết bị gây tiếng ồn</li>
                      <li>Thông báo với người xung quanh về việc đang thi</li>
                      <li>Sử dụng tai nghe nếu có tiếng ồn từ bên ngoài</li>
                    </ul>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Warning */}
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  <strong>Cảnh báo:</strong> Vi phạm liên tục có thể dẫn đến việc hủy bài thi. 
                  Vui lòng tuân thủ các quy định để đảm bảo tính công bằng của kỳ thi.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="px-6 py-4 border-t border-gray-200 flex space-x-3">
          <button
            onClick={onContinue}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-lg font-medium transition-colors flex items-center justify-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1M9 16h1m4 0h1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Tiếp tục thi
          </button>
          
          <button
            onClick={onCancel}
            className="px-6 py-3 border border-red-300 hover:bg-red-50 text-red-700 rounded-lg font-medium transition-colors flex items-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            Hủy làm bài
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExamViolationAlert; 