'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface UserProgress {
  id: string;
  user_id: string;
  name: string;
  avatar: string;
  listening_score: number;
  reading_score: number;
  speaking_score: number;
  writing_score: number;
  total_study_time: number;
  last_activity_date: string | null;
  updated_at: string;
  rank?: number;
  score?: number;
}

const AdminDashboard = () => {
  const router = useRouter();
  const [leaderboard, setLeaderboard] = useState<UserProgress[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [periodType, setPeriodType] = useState('weekly');
  const [startDate, setStartDate] = useState('2025-06-01');
  const pageSize = 10;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchLeaderboard();
  }, [currentPage, periodType, startDate]);

  const fetchLeaderboard = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/admin/user_progresses?page=${currentPage}&limit=${pageSize}`);
      if (!response.ok) throw new Error('Failed to fetch leaderboard');
      const data = await response.json();
      let users = data.data.map((progress: any) => ({
        id: progress.id,
        user_id: progress.user_id,
        name: progress.name,
        avatar: progress.avatar,
        listening_score: progress.listening_score,
        reading_score: progress.reading_score,
        speaking_score: progress.speaking_score,
        writing_score: progress.writing_score,
        total_study_time: progress.total_study_time,
        last_activity_date: progress.last_activity_date,
        updated_at: progress.updated_at,
        score: progress.listening_score + progress.reading_score + progress.speaking_score + progress.writing_score,
      }));

      if (startDate) {
        const start = new Date(startDate);
        users = users.filter((u: UserProgress) => {
          const lastActive: Date | null = u.last_activity_date ? new Date(u.last_activity_date) : null;
          return lastActive !== null && lastActive >= start;
        });
      }

      users = users.sort((a: UserProgress, b: UserProgress) => (b.score ?? 0) - (a.score ?? 0));
      interface RankedUserProgress extends UserProgress {
        rank: number;
      }

      users = users.map((user: UserProgress, index: number): RankedUserProgress => ({
        ...user,
        rank: index + 1 + (currentPage - 1) * pageSize,
      }));

      setLeaderboard(users);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const handleViewResults = () => {
    console.log(`Viewing results for ${periodType} from ${startDate}`);
    fetchLeaderboard();
  };

  const top3 = leaderboard.slice(0, 3);
  const remaining = leaderboard.slice(3);
  const paginatedRemaining = remaining.slice(0, pageSize);
  const totalPages = Math.ceil((leaderboard.length - 3) / pageSize) || 1;
  const maxScore = Math.max(...top3.map((u) => u.score || 0), 1);

  // Giới hạn chiều cao cột trong phần Top 3 (tối đa 180px)
  const getColumnHeight = (score: number) => {
    const maxHeight = 180; // Giới hạn chiều cao tối đa
    return Math.min((score / maxScore) * maxHeight, maxHeight) + 40; // Thêm 40px cho phần avatar và text
  };

  if (loading) return <div className="text-center p-4">Loading...</div>;
  if (error) return <div className="text-center p-4 text-red-500">Error: {error}</div>;

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
                    height: `${getColumnHeight(user.score || 0)}px`, // Giới hạn chiều cao
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
                  <p className="mt-2 text-sm font-bold">{user.name}</p> {/* In đậm tên */}
                  <p className="text-sm">{user.score || 0}</p>
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
                    <td className="p-2 border"><span className="font-bold">{user.name}</span></td> {/* In đậm tên */}
                    <td className="p-2 border">{user.score || 0}</td>
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