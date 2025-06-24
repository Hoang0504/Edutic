import { Toaster } from "react-hot-toast";

import { AuthProvider } from "@/contexts/AuthContext";
import { MusicProvider } from "@/contexts/MusicContext";
import { PomodoroProvider } from "@/contexts/PomodoroContext";
import { DictionaryProvider } from "@/contexts/DictionaryContext";
import { RouteLoadingProvider } from "@/contexts/RouteLoadingContext";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import StudyModal from "@/components/features/StudyModal";
import RightSidebar from "@/components/layout/RightSideBar";
import MusicControl from "@/components/features/MusicControl";
import StudyEndModal from "@/components/features/StudyEndModal";
import BreakEndModal from "@/components/features/BreakEndModal";
import MusicBreakModal from "@/components/features/MusicBreakModal";

function AppContent({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <DictionaryProvider>
        <RouteLoadingProvider>
          <MusicProvider>
            <PomodoroProvider>
              <div className="min-h-screen bg-gray-50 flex flex-col">
                {/* user={user} */}
                <Header />
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
      </DictionaryProvider>
    </AuthProvider>
  );
}

function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Toaster position="top-right" />
      <AppContent>{children}</AppContent>
    </>
  );
}

export default MainLayout;
