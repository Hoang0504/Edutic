"use client";

import React, { ReactNode } from "react";

import NotFound from "../not-found";
import Exams from "@/components/admin/Exams";
import UserAdmin from "@/components/admin/UserAdmin";
import Flashcard from "@/components/admin/Flashcard";
import Dashboard from "@/components/admin/Dashboard";
import AdminSidebar from "@/components/admin/AdminSidebar";
import UserAnalytics from "@/components/admin/UserAnalytics";
import FullPageLoading from "@/components/features/FullPageLoading";
import AdminExamsPage from "@/components/admin/exams/AdminExamsPage";
import ExamImportPage from "@/components/admin/import/ExamImportPage";
import ListeningTranscript from "@/components/admin/ListeningTranscript";

import { useAuth } from "@/contexts/AuthContext";
import { AdminProvider } from "@/contexts/AdminContext";
import { Squares2X2Icon } from "@heroicons/react/24/outline";
import { useSelectedMenu } from "@/contexts/SelectedAminMenuContext";

interface AdminLayoutProps {
  children?: ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const { user, isLoading } = useAuth();
  const { selectedMenu, handleMenuSelect } = useSelectedMenu();

  if (isLoading) {
    return FullPageLoading();
  }

  if (!user || !user.role || user.role !== "admin") {
    return NotFound();
  }

  // Nội dung tương ứng với mỗi menu
  const renderContent = () => {
    switch (selectedMenu) {
      case "dashboard":
        return <Dashboard />;
      case "users":
        return <UserAdmin />;
      case "exams":
        return <AdminExamsPage />;
      case "import-exam":
        return <ExamImportPage />;
      case "flashcard":
        return <Flashcard />;
      case "listenningTranscript":
        return <ListeningTranscript />;
      case "userAnalytics":
        return <UserAnalytics />;
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
