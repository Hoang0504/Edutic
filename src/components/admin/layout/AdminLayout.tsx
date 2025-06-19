'use client';
import React, { ReactNode, useState } from 'react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { Squares2X2Icon } from '@heroicons/react/24/outline';
import UserAdmin from '../UserAdmin';
import Exams from '../Exams';

interface AdminLayoutProps {
  children?: ReactNode;
}

type MenuKey = 'dashboard' | 'users' | 'exams';

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const [selectedMenu, setSelectedMenu] = useState<MenuKey>('dashboard');

  const handleMenuSelect = (menuKey: string) => {
    // Chuyển string thành MenuKey, chỉ chấp nhận các giá trị hợp lệ
    if (['dashboard', 'users', 'exams'].includes(menuKey)) {
      setSelectedMenu(menuKey as MenuKey);
    }
  };
  // Nội dung tương ứng với mỗi menu
  const renderContent = () => {
    switch (selectedMenu) {
      case 'dashboard':
        return (
          <div>
            <h1 className="text-2xl font-semibold">Dashboard</h1>
            <p>Đây là trang quản lý Dashboard.</p>
          </div>
        );
      case 'users':
        return (
          <UserAdmin />
        );
      case 'exams':
        return (
          <Exams />
        );
      default:
        return children || null; // Nếu không khớp, giữ nguyên children (nếu có)
    }
  };

  return (
    <div className="min-h-screen flex">
      <AdminSidebar onMenuSelect={handleMenuSelect} />
      <div className="flex flex-col flex-1 ml-[280px] bg-gray-100">
        <header className="bg-[#001529] text-white flex items-center justify-center h-16 shadow">
          <h1 className="flex items-center text-xl font-semibold">
            <Squares2X2Icon className="h-6 w-6 mr-2" />
            EDUTIC
          </h1>
        </header>
        <main className="p-6">
          <div className="bg-white rounded-lg shadow p-6 min-h-[360px]">
            {renderContent()}
          </div>
        </main>
        <footer className="text-center text-sm text-gray-500 py-4">
          ©2025 Created by Group 2
        </footer>
      </div>
    </div>
  );
};

export default AdminLayout;
