'use client';

import { useState, useEffect, useRef } from 'react';
import { 
  XMarkIcon, 
  PlayIcon, 
  PauseIcon, 
  SpeakerWaveIcon,
  SpeakerXMarkIcon,
  BackwardIcon,
  ForwardIcon
} from '@heroicons/react/24/outline';
import { usePomodoro } from '@/contexts/PomodoroContext';
import MarqueeText from '@/components/ui/MarqueeText';

export default function MusicBreakModal() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [isAudioLoaded, setIsAudioLoaded] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  
  const { 
    isBreakModalOpen, 
    currentTime: breakTime, 
    formatTime, 
    closeBreakModal, 
    continueStudying,
    isRunning,
    pauseTimer,
    startTimer
  } = usePomodoro();

  // Real music data with file from workspace
  const currentSong = {
    title: "PART 1 - TEST 1 - TOEIC Listening Practice - Beautiful Instrumental Background Music for Concentration and Focus",
    artist: "TOEIC Practice Audio",
    src: "/PART 1 - TEST 1.mp3",
    duration: "2:45"
  };

  const togglePlay = () => {
    if (audioRef.current && isAudioLoaded) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play().catch(console.error);
        setIsPlaying(true);
      }
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      const newMuted = !isMuted;
      setIsMuted(newMuted);
      audioRef.current.muted = newMuted;
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
      if (newVolume > 0) {
        setIsMuted(false);
        audioRef.current.muted = false;
      }
    }
  };

  const skipToPosition = (percentage: number) => {
    if (audioRef.current && duration > 0) {
      const newTime = (percentage / 100) * duration;
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const formatMusicTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Initialize audio - setup khi modal mở
  useEffect(() => {
    if (audioRef.current && isBreakModalOpen) {
      const audio = audioRef.current;
      audio.volume = volume;
      
      const handleLoadedMetadata = () => {
        console.log('Audio loaded, duration:', audio.duration);
        setDuration(audio.duration);
        setIsAudioLoaded(true);
      };
      
      const handleTimeUpdate = () => {
        setCurrentTime(audio.currentTime);
      };
      
      const handleEnded = () => {
        setIsPlaying(false);
        setCurrentTime(0);
        audio.currentTime = 0;
      };

      const handleCanPlay = () => {
        setIsAudioLoaded(true);
      };

      const handleLoadStart = () => {
        setIsAudioLoaded(false);
      };
      
      // Remove existing listeners first
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('loadstart', handleLoadStart);
      
      // Add fresh listeners
      audio.addEventListener('loadedmetadata', handleLoadedMetadata);
      audio.addEventListener('timeupdate', handleTimeUpdate);
      audio.addEventListener('ended', handleEnded);
      audio.addEventListener('canplay', handleCanPlay);
      audio.addEventListener('loadstart', handleLoadStart);
      
      return () => {
        audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
        audio.removeEventListener('timeupdate', handleTimeUpdate);
        audio.removeEventListener('ended', handleEnded);
        audio.removeEventListener('canplay', handleCanPlay);
        audio.removeEventListener('loadstart', handleLoadStart);
      };
    }
  }, [isBreakModalOpen]);

  // Update volume riêng biệt
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  // Auto play when break modal opens
  useEffect(() => {
    if (isBreakModalOpen && audioRef.current) {
      // Reset hoàn toàn audio state khi modal mở lại
      const audio = audioRef.current;
      
      // Reset tất cả state
      setIsPlaying(false);
      setCurrentTime(0);
      setIsAudioLoaded(false);
      
      // Force reload audio để đảm bảo events hoạt động
      audio.load();
      
      // Wait for audio to load, then reset and play
      const timer = setTimeout(() => {
        if (audioRef.current) {
          audioRef.current.currentTime = 0;
          setCurrentTime(0);
          
          // Try to play when ready
          if (isAudioLoaded || audioRef.current.readyState >= 3) {
            audioRef.current.play().then(() => {
              setIsPlaying(true);
            }).catch(console.error);
          }
        }
      }, 800);

      return () => clearTimeout(timer);
    } else if (!isBreakModalOpen) {
      // Stop audio when modal closes
      if (audioRef.current) {
        audioRef.current.pause();
        setIsPlaying(false);
        setCurrentTime(0);
      }
    }
  }, [isBreakModalOpen]);

  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

  if (!isBreakModalOpen) return null;

  return (
    <>
      {/* Hidden Audio Element */}
      <audio 
        ref={audioRef}
        src={currentSong.src}
        preload="metadata"
        crossOrigin="anonymous"
      />

      {/* Overlay */}
      <div className="fixed inset-0 bg-black bg-opacity-60 transition-opacity duration-300 z-50" />

      {/* Modal */}
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div className="bg-gradient-to-br from-purple-100 to-blue-100 rounded-2xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden border border-purple-200">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-purple-200">
            <h2 className="text-xl font-semibold text-gray-800">Giờ nghỉ ngơi</h2>
            <button
              onClick={closeBreakModal}
              className="p-2 hover:bg-white/50 rounded-full transition-colors"
            >
              <XMarkIcon className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Break Timer */}
            <div className="text-center">
              <div className="text-sm text-gray-600 mb-2">Thời gian nghỉ còn lại</div>
              <div className="text-4xl font-bold text-blue-600 mb-4">
                {formatTime(breakTime)}
              </div>
            </div>

            {/* Music Info */}
            <div className="text-center">
              <div className="max-w-full px-4">
                <MarqueeText 
                  key={`music-title-${isBreakModalOpen}`} // Force re-render when modal opens
                  text={currentSong.title}
                  className="text-lg font-medium text-gray-800 mb-1"
                  speed={60}
                  pauseOnHover={true}
                  pauseDuration={1500}
                />
              </div>
              <p className="text-gray-600 text-sm">{currentSong.artist}</p>
            </div>

            {/* Music Progress */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-gray-600">
                <span>{formatMusicTime(currentTime)}</span>
                <span>{duration > 0 ? formatMusicTime(duration) : currentSong.duration}</span>
              </div>
              <div 
                className="w-full bg-gray-300 rounded-full h-2 cursor-pointer"
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const percentage = ((e.clientX - rect.left) / rect.width) * 100;
                  skipToPosition(percentage);
                }}
              >
                <div 
                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            </div>

            {/* Audio Loading Indicator */}
            {!isAudioLoaded && (
              <div className="text-center text-sm text-gray-500">
                Đang tải nhạc...
              </div>
            )}

            {/* Music Controls */}
            <div className="flex items-center justify-center space-x-4">
              <button
                className="w-10 h-10 bg-white/70 hover:bg-white/90 rounded-full flex items-center justify-center transition-colors disabled:opacity-50"
                disabled={!isAudioLoaded}
                onClick={() => {
                  if (audioRef.current && duration > 0) {
                    const newTime = Math.max(0, currentTime - 10);
                    audioRef.current.currentTime = newTime;
                  }
                }}
              >
                <BackwardIcon className="w-5 h-5 text-gray-700" />
              </button>
              
              <button
                onClick={togglePlay}
                disabled={!isAudioLoaded}
                className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
                title={isPlaying ? "Tạm dừng nhạc" : "Phát nhạc"}
              >
                {isPlaying ? (
                  <PauseIcon className="w-6 h-6 text-gray-700" />
                ) : (
                  <PlayIcon className="w-6 h-6 text-gray-700 ml-1" />
                )}
              </button>
              
              <button
                className="w-10 h-10 bg-white/70 hover:bg-white/90 rounded-full flex items-center justify-center transition-colors disabled:opacity-50"
                disabled={!isAudioLoaded}
                onClick={() => {
                  if (audioRef.current && duration > 0) {
                    const newTime = Math.min(duration, currentTime + 10);
                    audioRef.current.currentTime = newTime;
                  }
                }}
              >
                <ForwardIcon className="w-5 h-5 text-gray-700" />
              </button>
            </div>

            {/* Volume Control */}
            <div className="flex items-center space-x-3">
              <button
                onClick={toggleMute}
                className="p-2 hover:bg-white/50 rounded-full transition-colors"
              >
                {isMuted || volume === 0 ? (
                  <SpeakerXMarkIcon className="w-5 h-5 text-gray-600" />
                ) : (
                  <SpeakerWaveIcon className="w-5 h-5 text-gray-600" />
                )}
              </button>
              
              <div className="flex-1">
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={isMuted ? 0 : volume}
                  onChange={handleVolumeChange}
                  className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer slider"
                  style={{
                    background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${(isMuted ? 0 : volume) * 100}%, #d1d5db ${(isMuted ? 0 : volume) * 100}%, #d1d5db 100%)`
                  }}
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3">
              <button
                onClick={continueStudying}
                className="flex-1 py-3 bg-gradient-to-r from-cyan-400 to-blue-500 text-white font-medium rounded-lg hover:from-cyan-500 hover:to-blue-600 transition-all duration-200"
              >
                Tiếp tục học bài
              </button>
              
              <button
                onClick={isRunning ? pauseTimer : startTimer}
                className="px-6 py-3 bg-gradient-to-r from-purple-400 to-purple-600 text-white font-medium rounded-lg hover:from-purple-500 hover:to-purple-700 transition-all duration-200 flex items-center space-x-2"
              >
                {isRunning ? (
                  <>
                    <PauseIcon className="w-4 h-4" />
                    <span>Tạm dừng</span>
                  </>
                ) : (
                  <>
                    <PlayIcon className="w-4 h-4" />
                    <span>Tiếp tục</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 16px;
          width: 16px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
        
        .slider::-moz-range-thumb {
          height: 16px;
          width: 16px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          border: none;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
      `}</style>
    </>
  );
} 