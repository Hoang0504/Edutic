'use client';

import { useState } from 'react';
import { BellIcon, UserCircleIcon, ChevronDownIcon } from '@heroicons/react/24/outline';

interface HeaderProps {
  user?: {
    name: string;
    avatar?: string;
  };
}

export default function Header({ user }: HeaderProps) {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="bg-blue-600 text-white px-3 py-1 rounded text-sm font-semibold">
              Logo
            </div>
          </div>

          {/* Thanh nav  */}
          <div className="flex items-center space-x-8">
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
            
            {/* Chuông thông báo */}
            <div className="relative">
              <BellIcon className="h-6 w-6 text-gray-600 hover:text-gray-800 cursor-pointer transition-colors" />
              <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></span>
            </div>
          </div>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-colors"
            >
              {user?.avatar ? (
                <img 
                  src={user.avatar} 
                  alt={user.name} 
                  className="h-8 w-8 rounded-full"
                />
              ) : (
                <UserCircleIcon className="h-8 w-8" />
              )}
              <span className="font-medium">{user?.name || 'Null'}</span>
              <ChevronDownIcon className="h-4 w-4" />
            </button>

            {/* Dropdown Menu */}
            {isUserMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-50">
                <div className="py-1">
                  <a
                    href="/profile"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Thông tin cá nhân
                  </a>
                  <a
                    href="/settings"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Cài đặt
                  </a>
                  <div className="border-t border-gray-100"></div>
                  <button
                    onClick={() => {
                      window.location.href = '/login';
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                  >
                    Đăng xuất
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
