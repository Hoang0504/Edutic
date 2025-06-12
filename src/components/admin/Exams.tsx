'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
// import Image from 'next/image';

// Định nghĩa kiểu cho exam
interface Exam {
  id: number;
  title: string;
  type: string;
  description: string;
  is_published: boolean;
}

const Exams = () => {
  const router = useRouter();
  const [filterName, setFilterName] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [selectedExam, setSelectedExam] = useState<Exam | null>(null);

  // Mock data
  const mockData: Exam[] = [
    { id: 1, title: 'Math Exam 2025', type: 'Multiple Choice', description: 'Basic math test', is_published: true },
    { id: 2, title: 'Science Exam', type: 'Essay', description: 'Science concepts', is_published: false },
    { id: 3, title: 'History Quiz', type: 'True/False', description: 'Historical events', is_published: true },
  ];

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilterName(e.target.value);
    setCurrentPage(1);
  };

  const filteredExams = mockData.filter((exam: Exam) => {
    const searchLower = filterName.toLowerCase();
    const titleLower = exam.title.toLowerCase();
    return titleLower.includes(searchLower);
  });

  const pageSize = 2;
  const paginatedExams = filteredExams.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const totalExams = filteredExams.length;

  const handleModalCancel = () => {
    setIsAddModalVisible(false);
    setIsEditModalVisible(false);
    setIsDetailModalVisible(false);
  };

  const handleLogoutAdmin = () => {
    router.push('/admin/login');
  };

  const handleEdit = (exam: Exam) => {
    setSelectedExam(exam);
    setIsEditModalVisible(true);
  };

  const handleDetail = (exam: Exam) => {
    setSelectedExam(exam);
    setIsDetailModalVisible(true);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-[#006494] text-white flex justify-between items-center p-4">
        <button
          className="flex items-center bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          onClick={() => setIsAddModalVisible(true)}
        >
          <span className="mr-2">+</span> Add Exam
        </button>
        <h1 className="text-2xl font-semibold mx-auto">Exam Management</h1>
        <div className="flex space-x-2">
          <button
            className="flex items-center bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
            onClick={handleLogoutAdmin}
          >
            <svg
              className="w-5 h-5 mr-1"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z"
                clipRule="evenodd"
              />
            </svg>
            Logout
          </button>
        </div>
      </header>

      <main className="flex-1 p-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <input
            type="text"
            placeholder="Search for exam by title"
            value={filterName}
            onChange={handleFilterChange}
            className="w-full p-2 border rounded mb-4"
          />

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-200">
                  <th className="p-2 border">Id</th>
                  <th className="p-2 border">Title</th>
                  <th className="p-2 border">Type</th>
                  <th className="p-2 border">Description</th>
                  <th className="p-2 border">Published</th>
                  <th className="p-2 border">Action</th>
                </tr>
              </thead>
              <tbody>
                {paginatedExams.map((exam) => (
                  <tr key={exam.id} className="border-t">
                    <td className="p-2 border">{exam.id}</td>
                    <td className="p-2 border">{exam.title}</td>
                    <td className="p-2 border">{exam.type}</td>
                    <td className="p-2 border">{exam.description}</td>
                    <td className="p-2 border">{exam.is_published ? 'Yes' : 'No'}</td>
                    <td className="p-2 border flex space-x-2">
                      <button
                        className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
                        onClick={() => handleEdit(exam)}
                      >
                        Edit
                      </button>
                      <button
                        className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                        onClick={() => handleDetail(exam)}
                      >
                        Detail
                      </button>
                      <button
                        className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                        onClick={() => {}}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="mt-4 flex justify-end">
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </button>
              <span className="mx-4 py-2">{currentPage} / {Math.ceil(totalExams / pageSize)}</span>
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === Math.ceil(totalExams / pageSize)}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </main>

      <div className="modal">
        <div className={isAddModalVisible ? 'modal-content' : 'hidden'}>
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
              <h2 className="text-xl font-semibold mb-4">Add Exam</h2>
              <div>Add Exam Form Placeholder</div>
              <button
                className="mt-4 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                onClick={handleModalCancel}
              >
                Close
              </button>
            </div>
          </div>
        </div>

        <div className={isEditModalVisible ? 'modal-content' : 'hidden'}>
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
              <h2 className="text-xl font-semibold mb-4">Edit Exam</h2>
              <div>Edit Exam Form for {selectedExam?.title}</div>
              <button
                className="mt-4 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                onClick={handleModalCancel}
              >
                Close
              </button>
            </div>
          </div>
        </div>

        <div className={isDetailModalVisible ? 'modal-content' : 'hidden'}>
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
              <h2 className="text-xl font-semibold mb-4">Exam Details</h2>
              {selectedExam && (
                <div className="text-center">
                  <h3 className="text-xl font-semibold">{selectedExam.title}</h3>
                  <p>Type: {selectedExam.type}</p>
                  <p>Description: {selectedExam.description}</p>
                  <p>Published: {selectedExam.is_published ? 'Yes' : 'No'}</p>
                </div>
              )}
              <button
                className="mt-4 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                onClick={handleModalCancel}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Exams;