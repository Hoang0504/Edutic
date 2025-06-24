'use client';

import { useState, useEffect, useRef } from 'react';
import { BellIcon, UserCircleIcon, ChevronDownIcon, DocumentTextIcon, CalendarIcon, BookOpenIcon, ClipboardDocumentListIcon, Bars3Icon, XMarkIcon, PlayIcon, PauseIcon, StopIcon, MusicalNoteIcon, SpeakerWaveIcon, SpeakerXMarkIcon, BackwardIcon, ForwardIcon } from '@heroicons/react/24/outline';
import { usePomodoro } from '@/contexts/PomodoroContext';
import { useMusic } from '@/contexts/MusicContext';
import ConfirmModal from '@/components/ui/ConfirmModal';
import MarqueeText from '@/components/ui/MarqueeText';

interface HeaderProps {
  user?: {
    name: string;
    avatar?: string;
  };
}

export default function Header({ user }: HeaderProps) {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMusicDropdownOpen, setIsMusicDropdownOpen] = useState(false);
  const [activeNotificationTab, setActiveNotificationTab] = useState<'all' | 'unread' | 'read'>('all');
  const [showStopConfirm, setShowStopConfirm] = useState(false);

  // Pomodoro context
  const { 
    isActive, 
    isRunning, 
    currentTime, 
    isStudyMode, 
    formatTime, 
    startTimer, 
    pauseTimer, 
    stopFocusMode,
    openStudyModal,
    openBreakModal
  } = usePomodoro();

  // Music context
  const {
    isPlaying: isMusicPlaying,
    isMuted,
    currentTime: musicCurrentTime,
    duration: musicDuration,
    volume,
    currentTrack,
    isLoaded: isMusicLoaded,
    isStudyMusicActive,
    togglePlay: toggleMusicPlay,
    toggleMute,
    nextTrack,
    previousTrack,
    setVolume,
    seekTo,
    stopStudyMusic,
    formatTime: formatMusicTime
  } = useMusic();

  // Refs for dropdowns
  const notificationRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const musicDropdownRef = useRef<HTMLDivElement>(null);

  // Click outside handler
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setIsNotificationOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
      if (musicDropdownRef.current && !musicDropdownRef.current.contains(event.target as Node)) {
        setIsMusicDropdownOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Mobile menu outside click handler
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
        setIsMobileMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handlePomodoroToggle = () => {
    if (isRunning) {
      pauseTimer();
    } else {
      startTimer();
    }
  };

  const handleTimerClick = () => {
    if (isStudyMode) {
      openStudyModal();
    } else {
      openBreakModal();
    }
  };

  const handleStopClick = () => {
    setShowStopConfirm(true);
  };

  const handleStopConfirm = () => {
    stopFocusMode();
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
  };

  const musicProgressPercentage = musicDuration > 0 ? (musicCurrentTime / musicDuration) * 100 : 0;

  // Sample notifications data
  const notifications = [
    {
      id: 1,
      title: "Có đề thi mới vừa cập nhật",
      time: "2 giờ trước",
      isRead: false,
      icon: DocumentTextIcon
    },
    {
      id: 2,
      title: "Bạn còn 5 ngày nữa để chuẩn bị kỳ thi tiếp theo",
      time: "1 ngày trước",
      isRead: false,
      icon: CalendarIcon
    },
    {
      id: 3,
      title: "Kết quả bài thi TOEIC Practice Test #15 đã có",
      time: "2 ngày trước",
      isRead: true,
      icon: DocumentTextIcon
    },
    {
      id: 4,
      title: "Bạn đã hoàn thành 100 flashcards tuần này",
      time: "3 ngày trước",
      isRead: false,
      icon: CalendarIcon
    },
    {
      id: 5,
      title: "Lịch học flashcard hôm nay: Business English",
      time: "4 ngày trước",
      isRead: true,
      icon: DocumentTextIcon
    },
    {
      id: 6,
      title: "Đề thi thử mới đã được thêm vào thư viện",
      time: "5 ngày trước",
      isRead: false,
      icon: DocumentTextIcon
    },
    {
      id: 7,
      title: "Bạn đã đạt target score trong bài thi gần nhất",
      time: "1 tuần trước",
      isRead: true,
      icon: CalendarIcon
    },
    {
      id: 8,
      title: "Cập nhật tính năng mới: Thống kê chi tiết",
      time: "1 tuần trước",
      isRead: true,
      icon: DocumentTextIcon
    }
  ];

  const unreadNotifications = notifications.filter(n => !n.isRead);
  const readNotifications = notifications.filter(n => n.isRead);
  const displayNotifications = activeNotificationTab === 'all' 
    ? notifications 
    : activeNotificationTab === 'unread'
    ? unreadNotifications
    : readNotifications;

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="bg-blue-600 text-white px-2 sm:px-3 py-1 rounded text-xs sm:text-sm font-semibold">
              Logo
            </div>
          </div>

          {/* Navigation Menu - Hidden on mobile, shown on sm+ */}
          <div className="hidden sm:flex items-center space-x-8">
            <a 
              href="/flashcards" 
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
            >
              Flashcard của tôi
            </a>
            <a 
              href="/exams" 
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
            >
              Đề thi online
            </a>
          </div>

          {/*  Mobile Menu, Pomodoro Timer, Notifications & User Menu */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            {/* Mobile Menu Button - Only shown on mobile */}
            <div className="sm:hidden relative" ref={mobileMenuRef}>
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                {isMobileMenuOpen ? (
                  <XMarkIcon className="h-5 w-5" />
                ) : (
                  <Bars3Icon className="h-5 w-5" />
                )}
              </button>

              {/* Mobile Menu Dropdown */}
              {isMobileMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                  <div className="py-1">
                    <a
                      href="/flashcards"
                      className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <BookOpenIcon className="h-5 w-5 mr-3 text-gray-400" />
                      Flashcard của tôi
                    </a>
                    <a
                      href="/exams"
                      className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <ClipboardDocumentListIcon className="h-5 w-5 mr-3 text-gray-400" />
                      Đề thi online
                    </a>
                  </div>
                </div>
              )}
            </div>

            {/* Pomodoro Timer - Show when active */}
            {isActive && (
              <div className="flex items-center bg-blue-50 border border-blue-200 rounded-lg px-3 py-2">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  <div className="text-sm font-medium text-gray-800">
                    {isStudyMode ? 'Học' : 'Nghỉ'}
                  </div>
                  <button
                    onClick={handleTimerClick}
                    className="text-lg font-bold text-blue-600 min-w-[4rem] hover:text-blue-700 cursor-pointer transition-colors"
                    title={`Click để mở modal ${isStudyMode ? 'học' : 'nghỉ ngơi'}`}
                  >
                    {formatTime(currentTime)}
                  </button>
                  
                  {/* Timer Controls */}
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={handlePomodoroToggle}
                      className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors ${
                        isRunning 
                          ? 'bg-red-500 hover:bg-red-600 text-white' 
                          : 'bg-green-500 hover:bg-green-600 text-white'
                      }`}
                      title={isRunning ? 'Tạm dừng' : 'Tiếp tục'}
                    >
                      {isRunning ? (
                        <PauseIcon className="w-4 h-4" />
                      ) : (
                        <PlayIcon className="w-3 h-3 ml-0.5" />
                      )}
                    </button>
                    
                    <button
                      onClick={handleStopClick}
                      className="w-7 h-7 rounded-full bg-gray-500 hover:bg-gray-600 text-white flex items-center justify-center transition-colors"
                      title="Dừng"
                    >
                      <StopIcon className="w-4 h-4" />
                    </button>

                    {/* Music Control Icon */}
                    <div className="relative" ref={musicDropdownRef}>
                      <button
                        onClick={() => setIsMusicDropdownOpen(!isMusicDropdownOpen)}
                        className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors ${
                          isStudyMusicActive && isMusicPlaying
                            ? 'bg-purple-500 hover:bg-purple-600 text-white' 
                            : 'bg-blue-500 hover:bg-blue-600 text-white'
                        }`}
                        title="Điều khiển nhạc"
                      >
                        <MusicalNoteIcon className="w-4 h-4" />
                      </button>

                      {/* Music Control Dropdown */}
                      {isMusicDropdownOpen && (
                        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                          {/* Header */}
                          <div className="px-4 py-3 border-b border-gray-200">
                            <h3 className="text-base font-semibold text-gray-900">Điều khiển nhạc</h3>
                          </div>

                          {/* Music Player Content */}
                          <div className="p-4 space-y-4">
                            {isStudyMusicActive ? (
                              <>
                                {/* Current Track Info */}
                                <div className="flex items-center space-x-3">
                                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                                    <MusicalNoteIcon className="w-5 h-5 text-white" />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="max-w-[200px]">
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

                                {/* Progress Bar */}
                                <div className="space-y-1">
                                  <div className="flex justify-between text-xs text-gray-500">
                                    <span>{formatMusicTime(musicCurrentTime)}</span>
                                    <span>{musicDuration > 0 ? formatMusicTime(musicDuration) : currentTrack.duration}</span>
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
                                      style={{ width: `${musicProgressPercentage}%` }}
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
                                    onClick={toggleMusicPlay}
                                    disabled={!isMusicLoaded}
                                    className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-full disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                                    title={isMusicPlaying ? "Tạm dừng" : "Phát"}
                                  >
                                    {isMusicPlaying ? (
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

                                {/* Stop Music Button */}
                                <button
                                  onClick={() => {
                                    stopStudyMusic();
                                    setIsMusicDropdownOpen(false);
                                  }}
                                  className="w-full px-4 py-2 bg-red-100 hover:bg-red-200 text-red-600 rounded-lg transition-colors text-sm font-medium"
                                >
                                  Dừng nhạc
                                </button>

                                {/* Loading Indicator */}
                                {!isMusicLoaded && (
                                  <div className="text-center text-xs text-gray-500">
                                    Đang tải nhạc...
                                  </div>
                                )}
                              </>
                            ) : (
                              <div className="text-center py-4">
                                <MusicalNoteIcon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                                <p className="text-sm text-gray-500 mb-4">Chưa có nhạc đang phát</p>
                                <p className="text-xs text-gray-400">Nhạc sẽ tự động phát khi bạn bắt đầu học hoặc nghỉ ngơi</p>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Notification Bell */}
            <div className="relative" ref={notificationRef}>
              <button
                onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                className="relative p-2 sm:p-1"
              >
                <BellIcon className="h-5 w-5 sm:h-6 sm:w-6 text-gray-600 hover:text-gray-800 cursor-pointer transition-colors" />
                {/* Notification badge */}
                {unreadNotifications.length > 0 && (
                  <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></span>
                )}
              </button>

              {/* Notification Dropdown */}
              {isNotificationOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50 max-w-[calc(100vw-1.5rem)] mx-3 sm:mx-0">
                  {/* Header */}
                  <div className="px-4 py-3 border-b border-gray-200">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900">Thông báo</h3>
                  </div>

                  {/* Tabs */}
                  <div className="flex border-b border-gray-200">
                    <button
                      onClick={() => setActiveNotificationTab('all')}
                      className={`flex-1 px-2 sm:px-4 py-2 text-xs sm:text-sm font-medium transition-colors ${
                        activeNotificationTab === 'all'
                          ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      Tất cả
                    </button>
                    <button
                      onClick={() => setActiveNotificationTab('unread')}
                      className={`flex-1 px-2 sm:px-4 py-2 text-xs sm:text-sm font-medium transition-colors ${
                        activeNotificationTab === 'unread'
                          ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      Chưa đọc
                    </button>
                    <button
                      onClick={() => setActiveNotificationTab('read')}
                      className={`flex-1 px-2 sm:px-4 py-2 text-xs sm:text-sm font-medium transition-colors ${
                        activeNotificationTab === 'read'
                          ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      Đã đọc
                    </button>
                  </div>

                  {/* Notifications List */}
                  <div className="max-h-72 sm:max-h-80 overflow-y-auto">
                    {displayNotifications.length > 0 ? (
                      displayNotifications.map((notification) => {
                        const IconComponent = notification.icon;
                        return (
                          <div
                            key={notification.id}
                            className="px-3 sm:px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 cursor-pointer"
                          >
                            <div className="flex items-start space-x-3">
                              <div className="flex-shrink-0 mt-1">
                                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                  <IconComponent className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600" />
                                </div>
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-xs sm:text-sm font-medium text-gray-900 line-clamp-2">
                                  {notification.title}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                  {notification.time}
                                </p>
                              </div>
                              {!notification.isRead && (
                                <div className="flex-shrink-0">
                                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="px-4 py-8 text-center">
                        <p className="text-gray-500 text-xs sm:text-sm">Không có thông báo nào</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* User Menu */}
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center space-x-1 sm:space-x-2 text-gray-700 hover:text-blue-600 transition-colors"
              >
                {user?.avatar ? (
                  <img 
                    src={user.avatar} 
                    alt={user.name} 
                    className="h-6 w-6 sm:h-8 sm:w-8 rounded-full"
                  />
                ) : (
                  <UserCircleIcon className="h-6 w-6 sm:h-8 sm:w-8" />
                )}
                <span className="font-medium text-sm sm:text-base hidden sm:inline">{user?.name || 'Null'}</span>
                <ChevronDownIcon className="h-3 w-3 sm:h-4 sm:w-4" />
              </button>

              {/* Dropdown Menu */}
              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-44 sm:w-48 bg-white rounded-md shadow-lg border border-gray-200 z-50">
                  <div className="py-1">
                    <a
                      href="/profile"
                      className="block px-3 sm:px-4 py-2 text-xs sm:text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Thông tin cá nhân
                    </a>
                    <a
                      href="/add-music"
                      className="flex items-center px-3 sm:px-4 py-2 text-xs sm:text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <MusicalNoteIcon className="h-4 w-4 mr-2" />
                      Thêm nhạc
                    </a>
                    <a
                      href="/settings"
                      className="block px-3 sm:px-4 py-2 text-xs sm:text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Cài đặt
                    </a>
                    <div className="border-t border-gray-100"></div>
                    <button
                      onClick={() => {
                        // Handle logout
                        window.location.href = '/login';
                      }}
                      className="block w-full text-left px-3 sm:px-4 py-2 text-xs sm:text-sm text-red-600 hover:bg-gray-100"
                    >
                      Đăng xuất
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Stop Confirmation Modal */}
      <ConfirmModal
        isOpen={showStopConfirm}
        onClose={() => setShowStopConfirm(false)}
        onConfirm={handleStopConfirm}
        title="Tắt chế độ tập trung"
        message="Bạn có chắc chắn muốn tắt chế độ tập trung? Tiến trình hiện tại sẽ bị mất."
        confirmText="Tắt chế độ"
        cancelText="Tiếp tục"
        type="warning"
      />
    </header>
  );
}
