'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
  totalScore?: number;
}

interface Filter {
  startDate: Date | null;
  endDate: Date | null;
  type: 'all' | 'inactive' | 'topPerformers';
  minScore: string;
}

interface ApiResponse {
  data: UserProgress[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
}

const UserAnalytics = () => {
  const router = useRouter();

  const [filter, setFilter] = useState<Filter>({
    startDate: null,
    endDate: null,
    type: 'all',
    minScore: '',
  });
  const [users, setUsers] = useState<UserProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [exportColumns, setExportColumns] = useState({
    listening_score: true,
    reading_score: true,
    speaking_score: true,
    writing_score: true,
    total_study_time: true,
    last_activity_date: true,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  useEffect(() => {
    fetchUserAnalytics();
  }, [filter, currentPage]);

  const fetchUserAnalytics = async () => {
    setLoading(true);
    setError(null);
    try {
      const queryParams = new URLSearchParams({
        page: currentPage.toString(),
        limit: pageSize.toString(),
      }).toString();
      const response = await fetch(`/api/admin/user_progresses?${queryParams}`);
      if (!response.ok) throw new Error('Failed to fetch UserAnalytics');
      const data: ApiResponse = await response.json();

      let filteredUsers = data.data.map((progress) => ({
        ...progress,
        totalScore:
          progress.listening_score +
          progress.reading_score +
          progress.speaking_score +
          progress.writing_score,
      }));

      if (filter.type === 'inactive') {
        filteredUsers = filteredUsers.filter((u) => !u.last_activity_date);
      } else if (filter.type === 'topPerformers' && filter.minScore) {
        filteredUsers = filteredUsers.filter(
          (u) => u.totalScore >= parseInt(filter.minScore)
        );
      }

      if (filter.startDate && filter.endDate) {
        filteredUsers = filteredUsers.filter((u) => {
          const activeDate = u.last_activity_date ? new Date(u.last_activity_date) : null;
          return (
            activeDate &&
            activeDate >= filter.startDate! &&
            activeDate <= filter.endDate!
          );
        });
      }

      setUsers(filteredUsers);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      toast.error('⚠️ Lỗi khi tải dữ liệu');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilter((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAnalyze = () => {
    if (!filter.startDate || !filter.endDate) {
      toast.warn('⚠️ Vui lòng chọn khoảng thời gian');
      return;
    }
    fetchUserAnalytics();
    toast.success('✅ Phân tích thành công');
  };

  const handleExport = () => {
    const csv = convertToCSV(users, exportColumns);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'user_analytics.csv';
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success('📥 Xuất báo cáo thành công');
  };

  const convertToCSV = (users: UserProgress[], columns: typeof exportColumns) => {
    const headers = [
      columns.listening_score ? 'Listening Score' : '',
      columns.reading_score ? 'Reading Score' : '',
      columns.speaking_score ? 'Speaking Score' : '',
      columns.writing_score ? 'Writing Score' : '',
      columns.total_study_time ? 'Total Study Time' : '',
      columns.last_activity_date ? 'Last Activity Date' : '',
    ]
      .filter(Boolean)
      .join(',');
    const rows = users.map((u) =>
      [
        columns.listening_score ? u.listening_score : '',
        columns.reading_score ? u.reading_score : '',
        columns.speaking_score ? u.speaking_score : '',
        columns.writing_score ? u.writing_score : '',
        columns.total_study_time ? u.total_study_time : '',
        columns.last_activity_date ? u.last_activity_date || '' : '',
      ]
        .filter(Boolean)
        .join(',')
    );
    return headers + '\n' + rows.join('\n');
  };

  const paginatedUsers = users.slice(0, pageSize);
  const totalPages = Math.ceil(users.length / pageSize);

  if (loading) return <div className="text-center p-4">Loading...</div>;
  if (error) return <div className="text-center p-4 text-red-500">Error: {error}</div>;

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-[#006494] text-white flex justify-between items-center p-4">
        <h1 className="text-2xl font-semibold mx-auto">User Analytics</h1>
        <button
          className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
          onClick={() => router.push('/admin/login')}
        >
          Logout
        </button>
      </header>

      <main className="flex-1 p-4">
        <div className="bg-white p-4 rounded-lg shadow">
          {/* Filter Panel */}
          <div className="mb-4 p-4 border rounded">
            <div className="flex space-x-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Từ ngày</label>
                <DatePicker
                  selected={filter.startDate}
                  onChange={(date) => setFilter((prev) => ({ ...prev, startDate: date }))}
                  className="mt-1 block w-full rounded-md border-gray-300"
                  placeholderText="Chọn ngày"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Đến ngày</label>
                <DatePicker
                  selected={filter.endDate}
                  onChange={(date) => setFilter((prev) => ({ ...prev, endDate: date }))}
                  className="mt-1 block w-full rounded-md border-gray-300"
                  placeholderText="Chọn ngày"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Loại lọc</label>
                <select
                  name="type"
                  value={filter.type}
                  onChange={handleFilterChange}
                  className="mt-1 block w-full rounded-md border-gray-300"
                >
                  <option value="all">Tất cả</option>
                  <option value="inactive">Không hoạt động</option>
                  <option value="topPerformers">Top performers</option>
                </select>
              </div>
              {filter.type === 'topPerformers' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">Điểm tối thiểu</label>
                  <input
                    type="number"
                    name="minScore"
                    value={filter.minScore}
                    onChange={handleFilterChange}
                    className="mt-1 block w-full rounded-md border-gray-300"
                    placeholder="Nhập điểm"
                  />
                </div>
              )}
            </div>
            <div className="flex space-x-2">
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                onClick={handleAnalyze}
              >
                🔍 Phân tích
              </button>
              <button
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                onClick={handleExport}
              >
                📥 Xuất báo cáo
              </button>
            </div>
          </div>

          {/* Export Column Selection */}
          <div className="mb-4 p-4 border rounded">
            <h3 className="text-lg font-medium mb-2">Chọn cột để xuất</h3>
            <div className="flex space-x-4">
              {Object.keys(exportColumns).map((col) => (
                <label key={col} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={exportColumns[col as keyof typeof exportColumns]}
                    onChange={(e) =>
                      setExportColumns((prev) => ({ ...prev, [col]: e.target.checked }))
                    }
                  />
                  <span className="ml-2 capitalize">
                    {col.replace(/_/g, ' ').replace('total study time', 'Tổng thời gian học').replace('last activity date', 'Ngày hoạt động cuối')}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-200">
                  <th className="p-2 border">STT</th>
                  <th className="p-2 border">Tên người dùng</th>
                  <th className="p-2 border">Listening</th>
                  <th className="p-2 border">Reading</th>
                  <th className="p-2 border">Speaking</th>
                  <th className="p-2 border">Writing</th>
                  <th className="p-2 border">Tổng điểm</th>
                  <th className="p-2 border">Ngày hoạt động</th>
                </tr>
              </thead>
              <tbody>
                {paginatedUsers.map((user, index) => (
                  <tr key={user.id} className="border-t hover:bg-gray-100">
                    <td className="p-2 border">{(currentPage - 1) * pageSize + index + 1}</td>
                    <td className="p-2 border">{user.name}</td>
                    <td className="p-2 border">{user.listening_score}</td>
                    <td className="p-2 border">{user.reading_score}</td>
                    <td className="p-2 border">{user.speaking_score}</td>
                    <td className="p-2 border">{user.writing_score}</td>
                    <td className="p-2 border">{user.totalScore}</td>
                    <td className="p-2 border">{user.last_activity_date || 'Chưa hoạt động'}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            <div className="mt-4 flex justify-end">
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </button>
              <span className="mx-4 py-2">{currentPage} / {totalPages}</span>
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                onClick={() => setCurrentPage(currentPage + 1)}
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

export default UserAnalytics;
