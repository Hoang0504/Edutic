import React from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import { PlusCircleIcon } from '@heroicons/react/24/outline';

const AddExamPage = () => {
  return (
    <AdminLayout>
      <div className="bg-white dark:bg-gray-700 rounded-lg shadow p-6">
        <h2 className="text-2xl font-semibold flex items-center mb-6">
          <PlusCircleIcon className="h-6 w-6 mr-2 text-primary" />
          Thêm Mới Exam
        </h2>
        <form className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Tiêu đề
            </label>
            <input
              type="text"
              id="title"
              name="title"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary dark:bg-gray-600 dark:border-gray-500 dark:text-white"
              placeholder="Nhập tiêu đề"
            />
          </div>
          <div>
            <label htmlFor="level" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Cấp độ
            </label>
            <select
              id="level"
              name="level"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary dark:bg-gray-600 dark:border-gray-500 dark:text-white"
            >
              <option value="Easy">Dễ</option>
              <option value="Medium">Trung bình</option>
              <option value="Hard">Khó</option>
            </select>
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Mô tả
            </label>
            <textarea
              id="description"
              name="description"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary dark:bg-gray-600 dark:border-gray-500 dark:text-white"
              rows={3}
              placeholder="Nhập mô tả"
            />
          </div>
          <button
            type="submit"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            <PlusCircleIcon className="h-5 w-5 mr-2" />
            Thêm Exam
          </button>
        </form>
      </div>
    </AdminLayout>
  );
};

export default AddExamPage;