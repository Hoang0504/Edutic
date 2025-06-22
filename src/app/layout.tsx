import { Metadata } from "next";
import { Toaster } from "react-hot-toast";
import "./globals.css";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import RightSidebar from "@/components/layout/RightSideBar";
import BreakEndModal from "@/components/features/BreakEndModal";
import MusicBreakModal from "@/components/features/MusicBreakModal";

import { PomodoroProvider } from "@/contexts/PomodoroContext";
import { RouteLoadingProvider } from "@/context/RouteLoadingContext";

export const metadata: Metadata = {
  title: "Edutic - Ôn là trúng, Luyện là đạt",
  description: "Luyện thi TOEIC hiệu quả",
};

function AppContent({ children }: { children: React.ReactNode }) {
  const user = {
    name: "null",
    // avatar: '/path/to/avatar.jpg'
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header user={user} />
      <main className="flex-1 py-6">{children}</main>
      <Footer />
      <RightSidebar />
      <MusicBreakModal />
      <BreakEndModal />
    </div>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body>
        <Toaster position="top-right" />

        {/* <div className="min-h-screen bg-gray-50 flex flex-col"> */}
        <RouteLoadingProvider>
          <PomodoroProvider>
            <AppContent>{children}</AppContent>
          </PomodoroProvider>
        </RouteLoadingProvider>
        {/* </div> */}
      </body>
    </html>
  );
}
