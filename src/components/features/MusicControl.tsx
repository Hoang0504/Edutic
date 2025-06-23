'use client';

import { useState } from 'react';
import { 
  PlayIcon, 
  PauseIcon, 
  SpeakerWaveIcon,
  SpeakerXMarkIcon,
  BackwardIcon,
  ForwardIcon,
  ChevronUpIcon,
  ChevronDownIcon
} from '@heroicons/react/24/outline';
import { useMusic } from '@/contexts/MusicContext';
import MarqueeText from '@/components/ui/MarqueeText';

export default function MusicControl() {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const {
    isPlaying,
    isMuted,
    currentTime,
    duration,
    volume,
    currentTrack,
    isLoaded,
    isStudyMusicActive,
    togglePlay,
    toggleMute,
    nextTrack,
    previousTrack,
    setVolume,
    seekTo,
    stopStudyMusic,
    formatTime
  } = useMusic();

  if (!isStudyMusicActive) return null;

  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
  };

  return (
    <div className="fixed right-2 sm:right-4 top-4 z-30 bg-white/95 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      {/* Compact Header */}
      <div className="flex items-center justify-between p-3 min-w-[280px]">
        <div className="flex items-center space-x-3 flex-1 min-w-0">
          {/* Play/Pause Button */}
          <button
            onClick={togglePlay}
            disabled={!isLoaded}
            className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-full disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center"
          >
            {isPlaying ? (
              <PauseIcon className="w-4 h-4" />
            ) : (
              <PlayIcon className="w-4 h-4" />
            )}
          </button>

          {/* Track Info */}
          <div className="flex-1 min-w-0">
            <div className="max-w-[140px]">
              <MarqueeText 
                text={currentTrack.title}
                className="text-sm font-medium text-gray-800"
                speed={40}
                pauseOnHover={true}
                pauseDuration={1000}
              />
            </div>
            <p className="text-xs text-gray-500 truncate">{currentTrack.artist}</p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center space-x-2">
          {/* Mute Toggle */}
          <button
            onClick={toggleMute}
            className="p-1.5 hover:bg-gray-100 rounded-md transition-colors"
            title={isMuted ? "Bật tiếng" : "Tắt tiếng"}
          >
            {isMuted || volume === 0 ? (
              <SpeakerXMarkIcon className="w-4 h-4 text-gray-600" />
            ) : (
              <SpeakerWaveIcon className="w-4 h-4 text-gray-600" />
            )}
          </button>

          {/* Stop Music */}
          <button
            onClick={stopStudyMusic}
            className="px-2 py-1 text-xs bg-red-100 hover:bg-red-200 text-red-600 rounded transition-colors"
            title="Dừng nhạc"
          >
            Dừng
          </button>

          {/* Expand Toggle */}
          <button
            onClick={toggleExpand}
            className="p-1.5 hover:bg-gray-100 rounded-md transition-colors"
            title={isExpanded ? "Thu gọn" : "Mở rộng"}
          >
            {isExpanded ? (
              <ChevronUpIcon className="w-4 h-4 text-gray-600" />
            ) : (
              <ChevronDownIcon className="w-4 h-4 text-gray-600" />
            )}
          </button>
        </div>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="px-3 pb-3 space-y-3 border-t border-gray-100">
          {/* Progress Bar */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs text-gray-500">
              <span>{formatTime(currentTime)}</span>
              <span>{duration > 0 ? formatTime(duration) : currentTrack.duration}</span>
            </div>
            <div 
              className="w-full bg-gray-200 rounded-full h-1.5 cursor-pointer"
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const percentage = ((e.clientX - rect.left) / rect.width) * 100;
                seekTo(percentage);
              }}
            >
              <div 
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-1.5 rounded-full transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>

          {/* Music Controls */}
          <div className="flex items-center justify-center space-x-4">
            <button
              onClick={previousTrack}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              title="Bài trước"
            >
              <BackwardIcon className="w-4 h-4 text-gray-600" />
            </button>

            <button
              onClick={togglePlay}
              disabled={!isLoaded}
              className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-full disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              title={isPlaying ? "Tạm dừng" : "Phát"}
            >
              {isPlaying ? (
                <PauseIcon className="w-5 h-5" />
              ) : (
                <PlayIcon className="w-5 h-5" />
              )}
            </button>

            <button
              onClick={nextTrack}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              title="Bài tiếp theo"
            >
              <ForwardIcon className="w-4 h-4 text-gray-600" />
            </button>
          </div>

          {/* Volume Control */}
          <div className="flex items-center space-x-2">
            <button
              onClick={toggleMute}
              className="p-1 hover:bg-gray-100 rounded transition-colors flex-shrink-0"
            >
              {isMuted || volume === 0 ? (
                <SpeakerXMarkIcon className="w-4 h-4 text-gray-600" />
              ) : (
                <SpeakerWaveIcon className="w-4 h-4 text-gray-600" />
              )}
            </button>
            
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={isMuted ? 0 : volume}
              onChange={handleVolumeChange}
              className="flex-1 h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
              title="Âm lượng"
            />
          </div>

          {/* Loading Indicator */}
          {!isLoaded && (
            <div className="text-center text-xs text-gray-500">
              Đang tải nhạc...
            </div>
          )}
        </div>
      )}
    </div>
  );
} 