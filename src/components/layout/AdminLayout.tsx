'use client';

import React, { ReactNode } from 'react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { Squares2X2Icon } from '@heroicons/react/24/outline';

interface AdminLayoutProps {
  children: ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  return (
    <div className="min-h-screen flex">
      <AdminSidebar />
      <div className="flex flex-col flex-1 ml-[280px] bg-gray-100">
        <header className="bg-[#001529] text-white flex items-center justify-center h-16 shadow">
          <h1 className="flex items-center text-xl font-semibold">
            <Squares2X2Icon className="h-6 w-6 mr-2" />
            Admin Dashboard
          </h1>
        </header>
        <main className="p-6">
          <div className="bg-white rounded-lg shadow p-6 min-h-[360px]">
            {children}
          </div>
        </main>
        <footer className="text-center text-sm text-gray-500 py-4">
          ©2025 Created by Quang Huy
        </footer>
      </div>
    </div>
  );
};

export default AdminLayout;
