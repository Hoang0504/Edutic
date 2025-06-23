import { Metadata } from "next";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "@/contexts/AuthContext";
import "./globals.css";

import { MusicProvider } from "@/contexts/MusicContext";
import { PomodoroProvider } from "@/contexts/PomodoroContext";
import { RouteLoadingProvider } from "@/context/RouteLoadingContext";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import BreakEndModal from "@/components/features/BreakEndModal";
import MusicBreakModal from "@/components/features/MusicBreakModal";
import StudyModal from "@/components/features/StudyModal";
import StudyEndModal from "@/components/features/StudyEndModal";
import MusicControl from "@/components/features/MusicControl";
import RightSidebar from "@/components/layout/RightSideBar";

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
    <AuthProvider>
      <RouteLoadingProvider>
        <MusicProvider>
          <PomodoroProvider>
            <div className="min-h-screen bg-gray-50 flex flex-col">
              <Header user={user} />
              <main className="flex-1 py-6">{children}</main>
              <Footer />
              <RightSidebar />
              <MusicBreakModal />
              <BreakEndModal />
              <StudyModal />
              <StudyEndModal />
              <MusicControl />
            </div>
          </PomodoroProvider>
        </MusicProvider>
      </RouteLoadingProvider>
    </AuthProvider>
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
        <AppContent>{children}</AppContent>
      </body>
    </html>
  );
}
