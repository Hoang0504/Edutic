"use client";
import React, { ReactNode, useState } from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { Squares2X2Icon } from "@heroicons/react/24/outline";
import { AdminProvider } from "@/context/AdminContext";
import UserAdmin from "@/components/admin/UserAdmin";
import Exams from "@/components/admin/Exams";
import Flashcard from "@/components/admin/Flashcard";

interface AdminLayoutProps {
  children?: ReactNode;
}

type MenuKey = "dashboard" | "users" | "exams" | "flashcard";

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const [selectedMenu, setSelectedMenu] = useState<MenuKey>("dashboard");

  const handleMenuSelect = (menuKey: string) => {
    // Chuyển string thành MenuKey, chỉ chấp nhận các giá trị hợp lệ
    if (["dashboard", "users", "exams", "flashcard"].includes(menuKey)) {
      setSelectedMenu(menuKey as MenuKey);
    }
  };
  // Nội dung tương ứng với mỗi menu
  const renderContent = () => {
    switch (selectedMenu) {
      case "dashboard":
        return (
          <div>
            <h1 className="text-2xl font-semibold">Dashboard</h1>
            <p>Đây là trang quản lý Dashboard.</p>
          </div>
        );
      case "users":
        return <UserAdmin />;
      case "exams":
        return <Exams />;
      case "flashcard":
        return <Flashcard />;
      default:
        return children || null; // Nếu không khớp, giữ nguyên children (nếu có)
    }
  };

  return (
    <AdminProvider>
      <div className="min-h-screen flex">
        <AdminSidebar onMenuSelect={handleMenuSelect} />
        <div className="flex flex-col flex-1 ml-[280px] bg-gray-100">
          <div className="bg-[#001529] text-white flex items-center justify-center h-16 shadow">
            <h1 className="flex items-center text-xl font-semibold">
              <Squares2X2Icon className="h-6 w-6 mr-2" />
              EDUTIC
            </h1>
          </div>
          <main className="p-6">
            <div className="bg-white rounded-lg shadow p-6 min-h-[360px]">
              {renderContent()}
            </div>
          </main>
          <div className="text-center text-sm text-gray-500 py-4">
            ©2025 Created by Group 2
          </div>
        </div>
      </div>
    </AdminProvider>
  );
};

export default AdminLayout;
