'use client';

import { CheckCircleIcon, PlayIcon, ClockIcon } from '@heroicons/react/24/outline';
import { usePomodoro } from '@/contexts/PomodoroContext';

export default function BreakEndModal() {
  const { 
    isBreakEndModalOpen, 
    closeBreakEndModal, 
    startNextSession, 
    extendBreak 
  } = usePomodoro();

  if (!isBreakEndModalOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black bg-opacity-60 transition-opacity duration-300 z-50" />

      {/* Modal */}
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-green-400 to-blue-500 p-6 text-center text-white">
            <div className="flex justify-center mb-3">
              <CheckCircleIcon className="w-16 h-16" />
            </div>
            <h2 className="text-xl font-bold">Giờ nghỉ đã kết thúc!</h2>
            <p className="text-green-100 mt-2">Bạn đã hoàn thành phiên nghỉ ngơi</p>
          </div>

          {/* Content */}
          <div className="p-6 space-y-4">
            <p className="text-gray-600 text-center">
              Bạn muốn bắt đầu phiên học tiếp theo hay nghỉ thêm một chút?
            </p>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={startNextSession}
                className="w-full py-3 bg-gradient-to-r from-cyan-400 to-blue-500 text-white font-medium rounded-lg hover:from-cyan-500 hover:to-blue-600 transition-all duration-200 flex items-center justify-center space-x-2"
              >
                <PlayIcon className="w-5 h-5" />
                <span>Bắt đầu phiên tiếp theo</span>
              </button>
              
              <button
                onClick={extendBreak}
                className="w-full py-3 bg-gradient-to-r from-orange-400 to-yellow-500 text-white font-medium rounded-lg hover:from-orange-500 hover:to-yellow-600 transition-all duration-200 flex items-center justify-center space-x-2"
              >
                <ClockIcon className="w-5 h-5" />
                <span>Nghỉ thêm</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
} 