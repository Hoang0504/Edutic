import React from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import { PlusCircleIcon } from '@heroicons/react/24/outline';

const AddUserPage = () => {
  return (
    <AdminLayout>
      <div className="bg-white dark:bg-gray-700 rounded-lg shadow p-6">
        <h2 className="text-2xl font-semibold flex items-center mb-6">
          <PlusCircleIcon className="h-6 w-6 mr-2 text-primary" />
          Thêm Mới User
        </h2>
        <form className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Tên
            </label>
            <input
              type="text"
              id="name"
              name="name"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary dark:bg-gray-600 dark:border-gray-500 dark:text-white"
              placeholder="Nhập tên"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary dark:bg-gray-600 dark:border-gray-500 dark:text-white"
              placeholder="Nhập email"
            />
          </div>
          <div>
            <label htmlFor="role" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Vai Trò
            </label>
            <select
              id="role"
              name="role"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary dark:bg-gray-600 dark:border-gray-500 dark:text-white"
            >
              <option value="Employee">Employee</option>
              <option value="Admin">Admin</option>
            </select>
          </div>
          <button
            type="submit"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            <PlusCircleIcon className="h-5 w-5 mr-2" />
            Thêm User
          </button>
        </form>
      </div>
    </AdminLayout>
  );
};

export default AddUserPage;