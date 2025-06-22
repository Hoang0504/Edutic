import { Metadata } from "next";
import { PomodoroProvider } from "@/contexts/PomodoroContext";
import MusicBreakModal from "@/components/features/MusicBreakModal";
import BreakEndModal from "@/components/features/BreakEndModal";
import "./globals.css";

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
      <RightSideBar />
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
        <PomodoroProvider>
          <AppContent>{children}</AppContent>
        </PomodoroProvider>
      </body>
    </html>
  );
}
