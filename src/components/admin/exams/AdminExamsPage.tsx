"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  PlusIcon, 
  DocumentArrowUpIcon, 
  MagnifyingGlassIcon,
  PencilIcon,
  EyeIcon,
  TrashIcon 
} from "@heroicons/react/24/outline";

import { useSelectedMenu } from "@/contexts/SelectedAminMenuContext";
import AddExamPage from "@/components/admin/add/AddExam";
import EditExamPage from "@/components/admin/edit/EditExam";

// Định nghĩa kiểu cho exam
interface Exam {
  id: number;
  title: string;
  type: string;
  estimatedTime: string;
  isPublished: boolean;
  description: string;
}

export default function AdminExamsPage() {
  const { handleMenuSelect } = useSelectedMenu();
  
  // State management cho CRUD operations
  const [filterTitle, setFilterTitle] = useState('');
  const [examType, setExamType] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [isEditExamModalVisible, setIsEditExamModalVisible] = useState(false);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [selectedExam, setSelectedExam] = useState<Exam | null>(null);

  // Mock data với nhiều exam hơn để test
  const mockData: Exam[] = [
    { id: 1, title: 'TOEIC Practice Test 1', type: 'TOEIC Sample', estimatedTime: '120 minutes', isPublished: true, description: 'Đề thi thực hành TOEIC cơ bản' },
    { id: 2, title: 'TOEIC Full Test 2024', type: 'TOEIC Full', estimatedTime: '120 minutes', isPublished: false, description: 'Đề thi TOEIC đầy đủ mới nhất' },
    { id: 3, title: 'Writing Test Set A', type: 'Writing', estimatedTime: '60 minutes', isPublished: true, description: 'Bộ đề kiểm tra kỹ năng viết' },
    { id: 4, title: 'Speaking Test Set B', type: 'Speaking', estimatedTime: '20 minutes', isPublished: true, description: 'Bộ đề kiểm tra kỹ năng nói' },
    { id: 5, title: 'TOEIC Reading Practice', type: 'TOEIC Sample', estimatedTime: '75 minutes', isPublished: false, description: 'Luyện tập kỹ năng đọc TOEIC' },
  ];

  // Filter và search functions
  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilterTitle(e.target.value);
    setCurrentPage(1);
  };

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setExamType(e.target.value);
    setCurrentPage(1);
  };

  // Lọc exam theo title và type
  const filteredExams = mockData.filter((exam: Exam) => {
    const searchLower = filterTitle.toLowerCase();
    const titleLower = exam.title.toLowerCase();
    const typeMatch = examType === 'All' || exam.type === examType;
    return titleLower.includes(searchLower) && typeMatch;
  });

  // Pagination
  const pageSize = 5;
  const paginatedExams = filteredExams.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const totalExams = filteredExams.length;
  const totalPages = Math.ceil(totalExams / pageSize);

  // Modal handlers
  const handleModalCancel = () => {
    setIsAddModalVisible(false);
    setIsEditExamModalVisible(false);
    setIsDetailModalVisible(false);
    setSelectedExam(null);
  };

  const handleEditExam = (exam: Exam) => {
    setSelectedExam(exam);
    setIsEditExamModalVisible(true);
  };

  const handleDetail = (exam: Exam) => {
    setSelectedExam(exam);
    setIsDetailModalVisible(true);
  };

  const handleDeleteExam = (examId: number) => {
    if (confirm('Bạn có chắc chắn muốn xóa đề thi này?')) {
      console.log('Delete exam:', examId);
      // TODO: Implement delete functionality
    }
  };

  const handleAddExam = (e: React.FormEvent, formData: { title: string; type: string; estimatedTime: string; isPublished: boolean; description: string }) => {
    e.preventDefault();
    console.log('Add Exam submitted', formData);
    setIsAddModalVisible(false);
    // TODO: Implement add functionality
  };

  const handleUpdateExam = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Update Exam submitted');
    setIsEditExamModalVisible(false);
    // TODO: Implement update functionality
  };

  // Statistics calculation
  const totalPublished = mockData.filter(exam => exam.isPublished).length;
  const totalDraft = mockData.filter(exam => !exam.isPublished).length;

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý đề thi</h1>
          <p className="text-gray-600">
            Tạo, chỉnh sửa và quản lý các đề thi trong hệ thống
          </p>
        </div>

        <div className="flex space-x-3">
          {/* Manual Add Exam Button */}
          <button
            onClick={() => setIsAddModalVisible(true)}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            Tạo đề thủ công
          </button>

          {/* Import from Excel Button */}
          <button
            onClick={() => handleMenuSelect("import-exam")}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            <DocumentArrowUpIcon className="h-4 w-4 mr-2" />
            Tạo đề từ Excel
          </button>
        </div>
      </div>

      {/* Statistics */}
      <div className="mb-6 grid grid-cols-1 gap-5 sm:grid-cols-3">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <DocumentArrowUpIcon className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Tổng số đề thi
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">{mockData.length}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <PlusIcon className="h-6 w-6 text-green-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Đã công khai
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">{totalPublished}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <DocumentArrowUpIcon className="h-6 w-6 text-blue-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Bản nháp
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">{totalDraft}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="bg-white shadow rounded-lg mb-6">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Tìm kiếm đề thi theo tiêu đề..."
                  value={filterTitle}
                  onChange={handleFilterChange}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            <div>
              <select
                value={examType}
                onChange={handleTypeChange}
                className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-md"
              >
                <option value="All">Tất cả loại</option>
                <option value="TOEIC Sample">TOEIC Sample</option>
                <option value="TOEIC Full">TOEIC Full</option>
                <option value="Writing">Writing</option>
                <option value="Speaking">Speaking</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Exam Table */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">
            Danh sách đề thi ({totalExams} kết quả)
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tiêu đề
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Loại
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thời gian
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedExams.map((exam) => (
                <tr key={exam.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {exam.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{exam.title}</div>
                    <div className="text-sm text-gray-500">{exam.description}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                      {exam.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {exam.estimatedTime}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {exam.isPublished ? (
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                        Công khai
                      </span>
                    ) : (
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                        Bản nháp
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleDetail(exam)}
                        className="text-blue-600 hover:text-blue-900"
                        title="Xem chi tiết"
                      >
                        <EyeIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleEditExam(exam)}
                        className="text-green-600 hover:text-green-900"
                        title="Chỉnh sửa"
                      >
                        <PencilIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteExam(exam.id)}
                        className="text-red-600 hover:text-red-900"
                        title="Xóa"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Trước
              </button>
              <button
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Sau
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Hiển thị{' '}
                  <span className="font-medium">{(currentPage - 1) * pageSize + 1}</span>
                  {' '}đến{' '}
                  <span className="font-medium">
                    {Math.min(currentPage * pageSize, totalExams)}
                  </span>
                  {' '}trong tổng số{' '}
                  <span className="font-medium">{totalExams}</span>
                  {' '}kết quả
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                  <button
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                  >
                    Trước
                  </button>
                  {[...Array(totalPages)].map((_, index) => (
                    <button
                      key={index + 1}
                      onClick={() => setCurrentPage(index + 1)}
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                        currentPage === index + 1
                          ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                          : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      {index + 1}
                    </button>
                  ))}
                  <button
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                  >
                    Sau
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      {/* Add Exam Modal */}
      {isAddModalVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md relative">
            <AddExamPage onSubmit={handleAddExam} onCancel={handleModalCancel} />
          </div>
        </div>
      )}

      {/* Edit Exam Modal */}
      {isEditExamModalVisible && selectedExam && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md relative">
            <EditExamPage
              onSubmit={handleUpdateExam}
              onCancel={handleModalCancel}
              initialData={selectedExam}
            />
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {isDetailModalVisible && selectedExam && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <div className="mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Chi tiết đề thi</h2>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-500">Tiêu đề:</label>
                <p className="text-gray-900">{selectedExam.title}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Loại:</label>
                <p className="text-gray-900">{selectedExam.type}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Thời gian ước tính:</label>
                <p className="text-gray-900">{selectedExam.estimatedTime}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Mô tả:</label>
                <p className="text-gray-900">{selectedExam.description}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Trạng thái:</label>
                <p className="text-gray-900">
                  {selectedExam.isPublished ? 'Đã công khai' : 'Bản nháp'}
                </p>
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={handleModalCancel}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
