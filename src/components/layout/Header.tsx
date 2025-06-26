"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";

import {
  BellIcon,
  UserCircleIcon,
  ChevronDownIcon,
  DocumentTextIcon,
  CalendarIcon,
  AcademicCapIcon,
  BookOpenIcon,
  ClipboardDocumentListIcon,
  Bars3Icon,
  XMarkIcon,
  PauseIcon,
  PlayIcon,
  StopIcon,
} from "@heroicons/react/24/outline";

import { useAuth } from "@/contexts/AuthContext";
import { usePomodoro } from "@/contexts/PomodoroContext";
import ConfirmModal from "../ui/ConfirmModal";

export default function Header() {
  const { user, isLoggedIn, logout } = useAuth();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeNotificationTab, setActiveNotificationTab] = useState<
    "all" | "unread" | "read"
  >("all");
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
  } = usePomodoro();

  // Refs for dropdowns
  const notificationRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  // Click outside handler
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target as Node)
      ) {
        setIsNotificationOpen(false);
      }
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node)
      ) {
        setIsUserMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Mobile menu outside click handler
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target as Node)
      ) {
        setIsMobileMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handlePomodoroToggle = () => {
    if (isRunning) {
      pauseTimer();
    } else {
      startTimer();
    }
  };

  const handleStopClick = () => {
    setShowStopConfirm(true);
  };

  const handleStopConfirm = () => {
    stopFocusMode();
  };

  // Sample notifications data
  const notifications = [
    {
      id: 1,
      title: "Có đề thi mới vừa cập nhật",
      time: "2 giờ trước",
      isRead: false,
      icon: DocumentTextIcon,
    },
    {
      id: 2,
      title: "Bạn còn 5 ngày nữa để chuẩn bị kỳ thi tiếp theo",
      time: "1 ngày trước",
      isRead: false,
      icon: CalendarIcon,
    },
    {
      id: 3,
      title: "Kết quả bài thi TOEIC Practice Test #15 đã có",
      time: "2 ngày trước",
      isRead: true,
      icon: DocumentTextIcon,
    },
    {
      id: 4,
      title: "Bạn đã hoàn thành 100 flashcards tuần này",
      time: "3 ngày trước",
      isRead: false,
      icon: CalendarIcon,
    },
    {
      id: 5,
      title: "Lịch học flashcard hôm nay: Business English",
      time: "4 ngày trước",
      isRead: true,
      icon: DocumentTextIcon,
    },
    {
      id: 6,
      title: "Đề thi thử mới đã được thêm vào thư viện",
      time: "5 ngày trước",
      isRead: false,
      icon: DocumentTextIcon,
    },
    {
      id: 7,
      title: "Bạn đã đạt target score trong bài thi gần nhất",
      time: "1 tuần trước",
      isRead: true,
      icon: CalendarIcon,
    },
    {
      id: 8,
      title: "Cập nhật tính năng mới: Thống kê chi tiết",
      time: "1 tuần trước",
      isRead: true,
      icon: DocumentTextIcon,
    },
  ];

  const unreadNotifications = notifications.filter((n) => !n.isRead);
  const readNotifications = notifications.filter((n) => n.isRead);
  const displayNotifications =
    activeNotificationTab === "all"
      ? notifications
      : activeNotificationTab === "unread"
      ? unreadNotifications
      : readNotifications;

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm fixed top-0 start-0 right-0 z-10">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between md:h-14 sm:h-16">
          {/* Logo */}
          <div className="flex items-center h-full">
            <Link
              href="/"
              className="text-white rounded text-xs sm:text-sm font-semibold inline-flex items-center h-full"
            >
              <div className="relative h-full aspect-square">
                <Image
                  src="/logo.png"
                  alt="Edutic logo"
                  fill
                  className="object-contain"
                />
              </div>
            </Link>
          </div>

          {/* Navigation Menu - Hidden on mobile, shown on sm+ */}
          <div className="hidden sm:flex items-center space-x-8">
            {isLoggedIn && (
              <Link
                href="/flashcards"
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
              >
                Flashcard của tôi
              </Link>
            )}
            <Link
              href="/exams"
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
            >
              Đề thi online
            </Link>
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
                    {isStudyMode ? "Học" : "Nghỉ"}
                  </div>
                  <div className="text-lg font-bold text-blue-600 min-w-[4rem]">
                    {formatTime(currentTime)}
                  </div>

                  {/* Timer Controls */}
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={handlePomodoroToggle}
                      className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors ${
                        isRunning
                          ? "bg-red-500 hover:bg-red-600 text-white"
                          : "bg-green-500 hover:bg-green-600 text-white"
                      }`}
                      title={isRunning ? "Tạm dừng" : "Tiếp tục"}
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
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                  {/* Header with tabs */}
                  <div className="p-4 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">
                      Thông báo
                    </h3>
                    <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
                      <button
                        onClick={() => setActiveNotificationTab("all")}
                        className={`flex-1 px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                          activeNotificationTab === "all"
                            ? "bg-white text-gray-900 shadow-sm"
                            : "text-gray-600 hover:text-gray-900"
                        }`}
                      >
                        Tất cả ({notifications.length})
                      </button>
                      <button
                        onClick={() => setActiveNotificationTab("unread")}
                        className={`flex-1 px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                          activeNotificationTab === "unread"
                            ? "bg-white text-gray-900 shadow-sm"
                            : "text-gray-600 hover:text-gray-900"
                        }`}
                      >
                        Chưa đọc ({unreadNotifications.length})
                      </button>
                      <button
                        onClick={() => setActiveNotificationTab("read")}
                        className={`flex-1 px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                          activeNotificationTab === "read"
                            ? "bg-white text-gray-900 shadow-sm"
                            : "text-gray-600 hover:text-gray-900"
                        }`}
                      >
                        Đã đọc ({readNotifications.length})
                      </button>
                    </div>
                  </div>

                  {/* Notification list */}
                  <div className="max-h-80 overflow-y-auto">
                    {displayNotifications.length > 0 ? (
                      displayNotifications.map((notification) => {
                        const IconComponent = notification.icon;
                        return (
                          <div
                            key={notification.id}
                            className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors ${
                              !notification.isRead ? "bg-blue-50" : ""
                            }`}
                          >
                            <div className="flex items-start space-x-3">
                              <div
                                className={`flex-shrink-0 p-2 rounded-full ${
                                  !notification.isRead
                                    ? "bg-blue-100"
                                    : "bg-gray-100"
                                }`}
                              >
                                <IconComponent
                                  className={`h-4 w-4 ${
                                    !notification.isRead
                                      ? "text-blue-600"
                                      : "text-gray-600"
                                  }`}
                                />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p
                                  className={`text-sm ${
                                    !notification.isRead
                                      ? "font-medium text-gray-900"
                                      : "text-gray-700"
                                  }`}
                                >
                                  {notification.title}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                  {notification.time}
                                </p>
                              </div>
                              {!notification.isRead && (
                                <div className="flex-shrink-0">
                                  <div className="h-2 w-2 bg-blue-600 rounded-full"></div>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="p-8 text-center text-gray-500">
                        <BellIcon className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                        <p className="text-sm">
                          {activeNotificationTab === "unread"
                            ? "Không có thông báo chưa đọc"
                            : activeNotificationTab === "read"
                            ? "Không có thông báo đã đọc"
                            : "Không có thông báo nào"}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Footer */}
                  {displayNotifications.length > 0 && (
                    <div className="p-3 border-t border-gray-200 bg-gray-50">
                      <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                        Xem tất cả thông báo
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {!isLoggedIn ? (
              <div className="flex items-center space-x-2">
                <Link
                  href="/login"
                  className="text-sm text-gray-700 hover:text-blue-600 font-medium"
                >
                  Đăng nhập
                </Link>
                <Link
                  href="/register"
                  className="bg-blue-600 text-white px-3 py-1.5 rounded text-sm font-medium hover:bg-blue-700"
                >
                  Đăng ký
                </Link>
              </div>
            ) : (
              // {/* User Avatar & Dropdown */}
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-2 text-sm text-gray-700 hover:text-gray-900 transition-colors"
                >
                  <UserCircleIcon className="h-6 w-6 sm:h-8 sm:w-8 text-gray-600" />
                  <span className="hidden sm:block font-medium">
                    {user?.name || "User"}
                  </span>
                  <ChevronDownIcon className="h-4 w-4 text-gray-500" />
                </button>

                {/* User Dropdown Menu */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                    <div className="py-1">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900">
                          {user?.name}
                        </p>
                        <p className="text-sm text-gray-500">{user?.email}</p>
                        <p className="text-xs text-blue-600 capitalize">
                          {user?.role}
                        </p>
                      </div>
                      <Link
                        href="/profile"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <UserCircleIcon className="h-4 w-4 mr-3 text-gray-400" />
                        Thông tin cá nhân
                      </Link>
                      {user?.role === "admin" && (
                        <Link
                          href="/admin"
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <AcademicCapIcon className="h-4 w-4 mr-3 text-gray-400" />
                          Quản trị
                        </Link>
                      )}
                      <button
                        onClick={() => {
                          logout();
                          setIsUserMenuOpen(false);
                        }}
                        className="w-full text-left flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                      >
                        <svg
                          className="h-4 w-4 mr-3"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                          />
                        </svg>
                        Đăng xuất
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
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
