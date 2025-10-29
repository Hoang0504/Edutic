'use client';

import { XMarkIcon, PlayIcon, PauseIcon } from '@heroicons/react/24/outline';
import { usePomodoro } from '@/contexts/PomodoroContext';
import { useMusic } from '@/contexts/MusicContext';
import MarqueeText from '@/components/ui/MarqueeText';

export default function StudyModal() {
  const { 
    isStudyModalOpen, 
    currentTime: studyTime, 
    formatTime, 
    closeStudyModal,
    isRunning,
    pauseTimer,
    startTimer
  } = usePomodoro();

  const {
    isPlaying: isMusicPlaying,
    currentTrack,
    togglePlay: toggleMusicPlay,
    nextTrack,
    previousTrack,
    startStudyMusic,
    isStudyMusicActive
  } = useMusic();

  const toggleTimer = () => {
    if (isRunning) {
      pauseTimer();
    } else {
      startTimer();
    }
  };

  // Start music when modal opens if not already active
  const handleModalOpen = () => {
    if (!isStudyMusicActive) {
      startStudyMusic();
    }
  };

  if (!isStudyModalOpen) return null;

  // Auto start music when modal is open
  if (isStudyModalOpen && !isStudyMusicActive) {
    startStudyMusic();
  }

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black bg-opacity-60 transition-opacity duration-300 z-50" />

      {/* Modal */}
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div className="bg-gradient-to-br from-green-100 to-blue-100 rounded-2xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden border border-green-200">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-green-200">
            <h2 className="text-xl font-semibold text-gray-800">Giờ học tập</h2>
            <button
              onClick={closeStudyModal}
              className="p-2 hover:bg-white/50 rounded-full transition-colors"
            >
              <XMarkIcon className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Study Timer */}
            <div className="text-center">
              <div className="text-sm text-gray-600 mb-2">Thời gian học còn lại</div>
              <div className="text-4xl font-bold text-green-600 mb-4">
                {formatTime(studyTime)}
              </div>
              
              {/* Timer Control Button */}
              <button
                onClick={toggleTimer}
                className="flex items-center justify-center space-x-2 mx-auto px-6 py-3 bg-gradient-to-r from-green-500 to-blue-500 text-white font-medium rounded-lg hover:from-green-600 hover:to-blue-600 transition-all duration-200 shadow-lg"
              >
                {isRunning ? (
                  <PauseIcon className="w-5 h-5" />
                ) : (
                  <PlayIcon className="w-5 h-5" />
                )}
                <span>{isRunning ? 'Tạm dừng' : 'Bắt đầu'}</span>
              </button>
            </div>

            {/* Music Info & Simple Controls */}
            <div className="bg-white/30 rounded-xl p-4 space-y-3">
              <div className="text-center">
                <div className="text-sm text-gray-600 mb-2">Đang phát</div>
                <div className="max-w-full px-2">
                  <MarqueeText 
                    text={currentTrack.title}
                    className="text-lg font-medium text-gray-800 mb-1"
                    speed={60}
                    pauseOnHover={true}
                    pauseDuration={1500}
                  />
                </div>
                <p className="text-gray-600 text-sm">{currentTrack.artist}</p>
              </div>

              {/* Quick Music Controls */}
              <div className="flex items-center justify-center space-x-4">
                <button
                  onClick={previousTrack}
                  className="p-2 bg-white/40 hover:bg-white/60 rounded-full transition-colors"
                  title="Bài trước"
                >
                  <svg className="w-5 h-5 text-gray-700" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/>
                  </svg>
                </button>

                <button
                  onClick={toggleMusicPlay}
                  className="p-3 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-full transition-all duration-200 shadow-lg"
                  title={isMusicPlaying ? "Tạm dừng nhạc" : "Phát nhạc"}
                >
                  {isMusicPlaying ? (
                    <PauseIcon className="w-6 h-6" />
                  ) : (
                    <PlayIcon className="w-6 h-6" />
                  )}
                </button>

                <button
                  onClick={nextTrack}
                  className="p-2 bg-white/40 hover:bg-white/60 rounded-full transition-colors"
                  title="Bài tiếp theo"
                >
                  <svg className="w-5 h-5 text-gray-700" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M16 18h2V6h-2zm-3.5-6L4 6v12z"/>
                  </svg>
                </button>
              </div>

              <div className="text-center">
                <p className="text-xs text-gray-500">
                  Nhạc sẽ tiếp tục phát trong nền khi đóng modal
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
} 