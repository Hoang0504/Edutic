'use client';

import React, { useState } from 'react';

interface ExamPermissionDialogProps {
  isOpen: boolean;
  onPermissionGranted: () => void;
  onSkipProctoring: () => void;
  onCancel: () => void;
}

const ExamPermissionDialog: React.FC<ExamPermissionDialogProps> = ({
  isOpen,
  onPermissionGranted,
  onSkipProctoring,
  onCancel
}) => {
  const [isRequesting, setIsRequesting] = useState(false);
  const [permissionError, setPermissionError] = useState<string | null>(null);

  const requestPermissions = async () => {
    setIsRequesting(true);
    setPermissionError(null);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });

      // Check if both video and audio tracks are available
      const videoTracks = stream.getVideoTracks();
      const audioTracks = stream.getAudioTracks();

      if (videoTracks.length === 0) {
        throw new Error('Camera không được cấp quyền');
      }

      if (audioTracks.length === 0) {
        throw new Error('Microphone không được cấp quyền');
      }

      // Stop the test stream
      stream.getTracks().forEach(track => track.stop());

      // Permission granted successfully
      onPermissionGranted();
    } catch (error: any) {
      console.error('Permission error:', error);
      
      let errorMessage = '';
      if (error.name === 'NotAllowedError') {
        errorMessage = 'Bạn đã từ chối quyền truy cập camera hoặc microphone. Vui lòng cấp quyền và thử lại.';
      } else if (error.name === 'NotFoundError') {
        errorMessage = 'Không tìm thấy camera hoặc microphone trên thiết bị của bạn.';
      } else if (error.name === 'NotReadableError') {
        errorMessage = 'Camera hoặc microphone đang được sử dụng bởi ứng dụng khác.';
      } else {
        errorMessage = error.message || 'Có lỗi xảy ra khi truy cập camera và microphone.';
      }
      
      setPermissionError(errorMessage);
    } finally {
      setIsRequesting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">
            Cài đặt giám sát thi
          </h2>
        </div>

        {/* Content */}
        <div className="px-6 py-4">
          <div className="mb-4">
            <div className="flex items-start space-x-3 mb-4">
              <div className="flex-shrink-0">
                <svg className="w-6 h-6 text-blue-500 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.55-3.64a1 1 0 011.45.9v5.48a1 1 0 01-1.45.9L15 10zM4 6h7a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V8a2 2 0 012-2z" />
                </svg>
              </div>
              <div>
                <h3 className="font-medium text-gray-800 mb-2">
                  Để đảm bảo chất lượng bài thi của bạn tốt nhất
                </h3>
                <p className="text-sm text-gray-600 mb-3">
                  Hệ thống cần quyền truy cập vào:
                </p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center space-x-2">
                    <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span><strong>Camera:</strong> Phát hiện sự hiện diện của thí sinh</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span><strong>Microphone:</strong> Giám sát âm thanh xung quanh</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="bg-amber-50 border-l-4 border-amber-400 p-3 mb-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="w-5 h-5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-amber-700">
                    <strong>Lưu ý:</strong> Cần cấp quyền cho cả camera và microphone để sử dụng tính năng giám sát.
                  </p>
                </div>
              </div>
            </div>

            {permissionError && (
              <div className="bg-red-50 border-l-4 border-red-400 p-3 mb-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="w-5 h-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700">{permissionError}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 flex space-x-3">
          <button
            onClick={requestPermissions}
            disabled={isRequesting}
            className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center"
          >
            {isRequesting ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Đang yêu cầu quyền...
              </>
            ) : (
              'Cho phép truy cập'
            )}
          </button>
          
          <button
            onClick={onSkipProctoring}
            className="px-4 py-2 border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg font-medium transition-colors"
          >
            Tắt giám sát
          </button>
          
          <button
            onClick={onCancel}
            className="px-4 py-2 border border-red-300 hover:bg-red-50 text-red-700 rounded-lg font-medium transition-colors"
          >
            Hủy
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExamPermissionDialog; 