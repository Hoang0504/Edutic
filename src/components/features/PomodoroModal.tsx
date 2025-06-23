'use client';

import { useState } from 'react';
import { XMarkIcon, PlayIcon, PauseIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import { usePomodoro } from '@/contexts/PomodoroContext';
import ConfirmModal from '@/components/ui/ConfirmModal';

interface PomodoroModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PomodoroModal({ isOpen, onClose }: PomodoroModalProps) {
  const [showCloseConfirm, setShowCloseConfirm] = useState(false);

  const {
    studyTime,
    breakTime,
    currentTime,
    isStudyMode,
    isRunning,
    isActive,
    studyMinutes,
    breakMinutes,
    setStudyMinutes,
    setBreakMinutes,
    startTimer,
    pauseTimer,
    resetTimer,
    startFocusMode,
    stopFocusMode,
    formatTime,
    openStudyModal
  } = usePomodoro();

  const handleStart = () => {
    if (isRunning) {
      pauseTimer();
    } else {
      startTimer();
    }
  };

  const handleStudyTimeChange = (value: number) => {
    if (value >= 1 && value <= 120) { // 1-120 minutes
      setStudyMinutes(value);
    }
  };

  const handleBreakTimeChange = (value: number) => {
    if (value >= 1 && value <= 60) { // 1-60 minutes
      setBreakMinutes(value);
    }
  };

  const handleFocusMode = () => {
    startFocusMode();
    onClose();
    // Open study modal after a short delay to allow focus mode to start
    setTimeout(() => {
      openStudyModal();
    }, 100);
  };

  const handleCloseAttempt = () => {
    if (isActive && isRunning) {
      setShowCloseConfirm(true);
    } else {
      onClose();
    }
  };

  const handleCloseConfirm = () => {
    stopFocusMode();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay - Only show when modal is open and not in focus mode */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-70 transition-opacity duration-300 z-40"
        onClick={handleCloseAttempt}
      />

      {/* Modal */}
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-100">
            <h2 className="text-xl font-semibold text-gray-800">Pomodoro Timer</h2>
            <button
              onClick={handleCloseAttempt}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <XMarkIcon className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Timer Display */}
            <div className="text-center">
              <div className="text-sm font-medium text-gray-600 mb-2">
                {isStudyMode ? 'Thời gian học' : 'Thời gian nghỉ'}
              </div>
              <div className="text-6xl font-bold text-gray-800 mb-4">
                {formatTime(currentTime)}
              </div>
            </div>

            {/* Time Input Controls */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Thời gian học (phút)
                </label>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleStudyTimeChange(studyMinutes - 1)}
                    disabled={studyMinutes <= 1 || isActive}
                    className="w-8 h-8 bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed rounded-full flex items-center justify-center text-gray-600 font-semibold"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    min="1"
                    max="120"
                    value={studyMinutes}
                    style={{color: 'black'}}
                    onChange={(e) => handleStudyTimeChange(parseInt(e.target.value) || 1)}
                    disabled={isActive}
                    className="w-16 px-2 py-1 text-center border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                  />
                  <button
                    onClick={() => handleStudyTimeChange(studyMinutes + 1)}
                    disabled={studyMinutes >= 120 || isActive}
                    className="w-8 h-8 bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed rounded-full flex items-center justify-center text-gray-600 font-semibold"
                  >
                    +
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Thời gian nghỉ (phút)
                </label>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleBreakTimeChange(breakMinutes - 1)}
                    disabled={breakMinutes <= 1 || isActive}
                    className="w-8 h-8 bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed rounded-full flex items-center justify-center text-gray-600 font-semibold"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    min="1"
                    max="60"
                    value={breakMinutes}
                    style={{color: 'black'}}
                    onChange={(e) => handleBreakTimeChange(parseInt(e.target.value) || 1)}
                    disabled={isActive}
                    className="w-16 px-2 py-1 text-center border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                  />
                  <button
                    onClick={() => handleBreakTimeChange(breakMinutes + 1)}
                    disabled={breakMinutes >= 60 || isActive}
                    className="w-8 h-8 bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed rounded-full flex items-center justify-center text-gray-600 font-semibold"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* Focus Mode Button */}
            <button
              onClick={handleFocusMode}
              className="w-full py-3 bg-gradient-to-r from-cyan-400 to-blue-500 text-white font-medium rounded-lg hover:from-cyan-500 hover:to-blue-600 transition-all duration-200 transform hover:scale-[1.02]"
            >
              bắt đầu chế độ tập trung
            </button>
          </div>
        </div>
      </div>

      {/* Close Confirmation Modal */}
      <ConfirmModal
        isOpen={showCloseConfirm}
        onClose={() => setShowCloseConfirm(false)}
        onConfirm={handleCloseConfirm}
        title="Tắt chế độ tập trung"
        message="Bạn có chắc chắn muốn tắt chế độ tập trung? Tiến trình hiện tại sẽ bị mất."
        confirmText="Tắt chế độ"
        cancelText="Tiếp tục"
        type="warning"
      />
    </>
  );
} 