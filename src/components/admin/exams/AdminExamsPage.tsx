
import React from 'react';
import Link from 'next/link';
import { PlusIcon, DocumentArrowUpIcon } from '@heroicons/react/24/outline';
// import AdminLayout from '@/components/layout/AdminLayout';

export default function AdminExamsPage() {
  return (
    // <AdminLayout>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Quản lý đề thi</h1>
            <p className="text-gray-600">Tạo, chỉnh sửa và quản lý các đề thi trong hệ thống</p>
          </div>
          
          <div className="flex space-x-3">
            {/* Traditional Add Exam Button */}
            <Link
              href="/admin/exams/create"
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              <PlusIcon className="h-4 w-4 mr-2" />
              Tạo đề thủ công
            </Link>
            
            {/* Import from Excel Button */}
            <Link
              href="/admin/exams/import"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              <DocumentArrowUpIcon className="h-4 w-4 mr-2" />
              Tạo đề từ Excel
            </Link>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Danh sách đề thi</h2>
          </div>
          
          <div className="p-6">
            {/* Empty state for now */}
            <div className="text-center py-12">
              <DocumentArrowUpIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-4 text-lg font-medium text-gray-900">Chưa có đề thi nào</h3>
              <p className="mt-2 text-gray-500">
                Bắt đầu bằng cách tạo đề thi mới hoặc nhập từ file Excel
              </p>
              <div className="mt-6 flex justify-center space-x-3">
                <Link
                  href="/admin/exams/create"
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  <PlusIcon className="h-4 w-4 mr-2" />
                  Tạo đề thủ công
                </Link>
                <Link
                  href="/admin/exams/import"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  <DocumentArrowUpIcon className="h-4 w-4 mr-2" />
                  Nhập từ Excel
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-3">
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
                    <dd className="text-lg font-medium text-gray-900">
                      0
                    </dd>
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
                    <dd className="text-lg font-medium text-gray-900">
                      0
                    </dd>
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
                    <dd className="text-lg font-medium text-gray-900">
                      0
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    // </AdminLayout>
  );
} 