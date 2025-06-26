'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';


const AdminDashboard = () => {
  const router = useRouter();

  // Dữ liệu mẫu cố định
  const leaderboard = [
   { id: 1, name: 'Nguyễn A', score: 2000, avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&q=80&w=50&h=50&fit=crop', rank: 1 },
    { id: 2, name: 'Trần B', score: 1600, avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&q=80&w=50&h=50&fit=crop', rank: 2 },
    { id: 3, name: 'Lê C', score: 1300, avatar: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?ixlib=rb-4.0.3&q=80&w=50&h=50&fit=crop', rank: 3 },
    { id: 4, name: 'Phạm D', score: 1250, avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&q=80&w=50&h=50&fit=crop', rank: 4 },
    { id: 5, name: 'Võ E', score: 1230, avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?ixlib=rb-4.0.3&q=80&w=50&h=50&fit=crop', rank: 5 },
    { id: 6, name: 'Hồ F', score: 1215, avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-4.0.3&q=80&w=50&h=50&fit=crop', rank: 6 },
    { id: 7, name: 'Ngô G', score: 1200, avatar: 'https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?ixlib=rb-4.0.3&q=80&w=50&h=50&fit=crop', rank: 7 },
  ];

  const [currentPage, setCurrentPage] = useState(1);
  const [periodType, setPeriodType] = useState('weekly');
  const [startDate, setStartDate] = useState('2025-06-01');
  const pageSize = 10;
  


  const handleViewResults = () => {
    // Logic giả lập khi nhấn Xem kết quả (chỉ log)
    console.log(`Viewing results for ${periodType} from ${startDate}`);
  };

  const top3 = leaderboard.slice(0, 3);
  const remaining = leaderboard.slice(3);
  const paginatedRemaining = remaining.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );
  const totalPages = Math.ceil(remaining.length / pageSize);
  const maxScore = Math.max(...top3.map(u => u.score));

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-[#006494] text-white">
        <div className="text-center py-2">
          <h1 className="text-2xl font-semibold">🏆 DashBoardAdmin</h1>
        </div>
        <div className="flex justify-between items-center p-4">
          <div className="flex space-x-4 items-center">
            <select
              value={periodType}
              onChange={(e) => setPeriodType(e.target.value)}
              className="p-2 border rounded text-black"
            >
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </select>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="p-2 border rounded text-black"
            />
            <button
              onClick={handleViewResults}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              🔍 Xem kết quả
            </button>
          </div>
          <button
            className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
            onClick={() => router.push('/admin/login')}
          >
            Logout
          </button>
        </div>
      </header>
 
      <main className="flex-1 p-4">
        {/* Top 3 User */}
        <div className="bg-white p-4 rounded-lg shadow mb-6">
          <h3 className="text-xl font-semibold mb-4">Top 3 Users</h3>
          <div className="flex justify-around items-end h-64">
            {top3.map((user) => (
              <div key={user.id} className="text-center">
                <div
                  className="w-16 mx-auto rounded-t"
                  style={{
                    height: `${(user.score / maxScore) * 180 + 40}px`,
                    backgroundColor:
                      user.rank === 1 ? '#FFD700' : user.rank === 2 ? '#C0C0C0' : '#CD7F32',
                    transition: 'height 0.3s',
                     display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
                  }}
                >
                  <Image
                    src={user.avatar}
                    alt={user.name}
                    width={48}
                    height={48}
                    className="w-12 h-12 rounded-full mx-auto -mt-6"
                  />
                  <p className="mt-2 text-sm">{user.name}</p>
                  <p className="text-sm">{user.score}</p>
                  <p className="text-xs">Rank {user.rank}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bảng xếp hạng còn lại */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-xl font-semibold mb-4">Leaderboard (Rank 4+)</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-200">
                  <th className="p-2 border">#</th>
                  <th className="p-2 border">Avatar</th>
                  <th className="p-2 border">Tên người dùng</th>
                  <th className="p-2 border">Điểm số</th>
                  <th className="p-2 border">Thứ hạng</th>
                </tr>
              </thead>
              <tbody>
                {paginatedRemaining.map((user) => (
                  <tr key={user.id} className="border-t">
                    <td className="p-2 border">{user.rank}</td>
                    <td className="p-2 border">
                      <Image
                        src={user.avatar}
                        alt={user.name}
                        width={40}
                        height={40}
                        className="w-10 h-10 rounded-full"
                      />
                    </td>
                    <td className="p-2 border">{user.name}</td>
                    <td className="p-2 border">{user.score}</td>
                    <td className="p-2 border">{user.rank}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="mt-4 flex justify-end">
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                Previous
              </button>
              <span className="mx-4 py-2">{currentPage} / {totalPages}</span>
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                onClick={() => setCurrentPage((prev) => (prev < totalPages ? prev + 1 : prev))}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;