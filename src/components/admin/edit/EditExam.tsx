'use client';
import React from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import { PencilIcon } from '@heroicons/react/24/outline';

const EditExamPage = () => {
  return (
    <AdminLayout>
      <div className="bg-white dark:bg-gray-700 rounded-lg shadow p-6">
        <h2 className="text-2xl font-semibold flex items-center mb-6">
          <PencilIcon className="h-6 w-6 mr-2 text-primary" />
          Edit Exam
        </h2>
        <form className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              defaultValue="Bài kiểm tra cơ bản" // Giá trị mặc định (có thể thay đổi)
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary dark:bg-gray-600 dark:border-gray-500 dark:text-white"
              placeholder="Nhập tiêu đề"
            />
          </div>
          <div>
            <label htmlFor="level" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Level
            </label>
            <select
              id="level"
              name="level"
              defaultValue="Easy" // Giá trị mặc định
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary dark:bg-gray-600 dark:border-gray-500 dark:text-white"
            >
              <option value="Easy">Dễ</option>
              <option value="Medium">Trung bình</option>
              <option value="Hard">Khó</option>
            </select>
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              defaultValue="Mô tả chi tiết cho bài kiểm tra này." // Giá trị mặc định
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary dark:bg-gray-600 dark:border-gray-500 dark:text-white"
              rows={3}
              placeholder="Nhập mô tả"
            />
          </div>
          <button
            type="submit"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            <PencilIcon className="h-5 w-5 mr-2" />
           Update Exam
          </button>
        </form>
      </div>
    </AdminLayout>
  );
};

export default EditExamPage;