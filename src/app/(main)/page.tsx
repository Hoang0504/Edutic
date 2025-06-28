"use client";

import { AcademicCapIcon, ClockIcon, TrophyIcon, UserGroupIcon, ChartBarIcon } from '@heroicons/react/24/outline';

export default function HomePage() {
  // Mock data for online members
  const onlineMembers = [
    { id: 1, name: 'Nguyễn Văn A', avatar: '/api/placeholder/32/32', score: 850, status: 'online' },
    { id: 2, name: 'Trần Thị B', avatar: '/api/placeholder/32/32', score: 720, status: 'online' },
    { id: 3, name: 'Lê Minh C', avatar: '/api/placeholder/32/32', score: 680, status: 'online' },
    { id: 4, name: 'Phạm Thu D', avatar: '/api/placeholder/32/32', score: 790, status: 'online' },
    { id: 5, name: 'Hoàng Nam E', avatar: '/api/placeholder/32/32', score: 650, status: 'online' },
  ];

  // Mock data for leaderboard
  const leaderboard = [
    { rank: 1, name: 'Nguyễn Văn A', score: 950 },
    { rank: 2, name: 'Trần Thị B', score: 925 },
    { rank: 3, name: 'Lê Minh C', score: 890 },
    { rank: 4, name: 'Phạm Thu D', score: 875 },
    { rank: 5, name: 'Hoàng Nam E', score: 860 },
    { rank: 6, name: 'Vũ Thị F', score: 845 },
    { rank: 7, name: 'Đặng Minh G', score: 830 },
    { rank: 8, name: 'Bùi Thu H', score: 815 },
  ];

  return (
    <div className="max-w-none mx-auto px-4 sm:px-6 lg:px-8">
      {/* Greeting Section */}
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
          Xin chào, Tên!
        </h1>
        <p className="text-gray-600">
          Chào mừng bạn trở lại với Edutic. Hãy bắt đầu hành trình học tập hôm nay!
        </p>
      </div>

      {/* Main Layout - Adjusted columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Column - Main Content */}
        <div className="lg:col-span-9">
          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <ClockIcon className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Kỳ thi gần nhất</p>
                  <p className="text-xl font-bold text-gray-900">5 ngày</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <AcademicCapIcon className="w-6 h-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Ngày dự thi</p>
                  <p className="text-xl font-bold text-gray-900">15/12/2024</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <TrophyIcon className="w-6 h-6 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Target Score</p>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span>Nghe: 450</span>
                      <span>Nói: 160</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span>Đọc: 450</span>
                      <span>Viết: 180</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Results & Latest Tests */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Kết quả thi gần nhất</h2>
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">TOEIC Practice Test #{i}</p>
                      <p className="text-sm text-gray-600">2 ngày trước</p>
                    </div>
                    <div className="text-lg font-bold text-blue-600">
                      {800 + i * 20}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Đề thi mới nhất</h2>
              <div className="grid grid-cols-2 gap-3">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="p-3 bg-gray-50 rounded-lg text-center">
                    <p className="font-medium text-gray-900 text-sm">Test #{i}</p>
                    <p className="text-xs text-gray-600">200 câu</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Online Members & Leaderboard */}
        <div className="lg:col-span-3 space-y-4">
          {/* Online Members */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            <div className="flex items-center mb-4">
              <UserGroupIcon className="w-5 h-5 text-green-600 mr-2" />
              <h2 className="text-base font-semibold text-gray-900">Thành viên đang online</h2>
              <span className="ml-auto bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full">
                {onlineMembers.length}
              </span>
            </div>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {onlineMembers.map((member) => (
                <div key={member.id} className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg transition-colors">
                  <div className="relative">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                      {member.name.charAt(0)}
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{member.name}</p>
                    <p className="text-xs text-gray-500">Score: {member.score}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Leaderboard */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            <div className="flex items-center mb-4">
              <ChartBarIcon className="w-5 h-5 text-yellow-600 mr-2" />
              <h2 className="text-base font-semibold text-gray-900">Bảng xếp hạng</h2>
            </div>
            <div className="space-y-2 max-h-80 overflow-y-auto">
              {leaderboard.map((user) => (
                <div key={user.rank} className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg transition-colors">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    user.rank === 1 ? 'bg-yellow-500 text-white' :
                    user.rank === 2 ? 'bg-gray-400 text-white' :
                    user.rank === 3 ? 'bg-orange-600 text-white' :
                    'bg-gray-200 text-gray-700'
                  }`}>
                    {user.rank}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
                    <span className="text-xs text-blue-600 font-medium">{user.score}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
