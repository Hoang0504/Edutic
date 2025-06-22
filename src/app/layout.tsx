import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import RightSideBar from "@/components/layout/RightSideBar";
import { PomodoroProvider } from "@/contexts/PomodoroContext";
import { MusicProvider } from "@/contexts/MusicContext";
import MusicBreakModal from "@/components/features/MusicBreakModal";
import BreakEndModal from "@/components/features/BreakEndModal";
import StudyModal from "@/components/features/StudyModal";
import StudyEndModal from "@/components/features/StudyEndModal";
import MusicControl from "@/components/features/MusicControl";
import "./globals.css";

export const metadata = {
  title: "My TOEIC App",
  description: "Luyện thi TOEIC hiệu quả",
};

function AppContent({ children }: { children: React.ReactNode }) {
  const user = {
    name: "null",
    // avatar: '/path/to/avatar.jpg'
  };

  return (
    <MusicProvider>
      <PomodoroProvider>
        <div className="min-h-screen bg-gray-50 flex flex-col">
          <Header user={user} />
          <main className="flex-1 py-6">{children}</main>
          <Footer />
          <RightSideBar />
          <MusicBreakModal />
          <BreakEndModal />
          <StudyModal />
          <StudyEndModal />
          <MusicControl />
        </div>
      </PomodoroProvider>
    </MusicProvider>
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
        <AppContent>{children}</AppContent>
      </body>
    </html>
  );
}
