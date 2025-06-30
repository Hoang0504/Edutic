import { Toaster } from "react-hot-toast";

import { MusicProvider } from "@/contexts/MusicContext";
import { PomodoroProvider } from "@/contexts/PomodoroContext";
import { DictionaryProvider } from "@/contexts/DictionaryContext";
import { RouteLoadingProvider } from "@/contexts/RouteLoadingContext";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import StudyModal from "@/components/features/StudyModal";
import RightSidebar from "@/components/layout/RightSideBar";
import StudyEndModal from "@/components/features/StudyEndModal";
import BreakEndModal from "@/components/features/BreakEndModal";
import MusicBreakModal from "@/components/features/MusicBreakModal";

function AppContent({ children }: { children: React.ReactNode }) {
  return (
    <DictionaryProvider>
      <RouteLoadingProvider>
        <MusicProvider>
          <PomodoroProvider>
            <div className="min-h-screen flex flex-col">
              {/* user={user} */}
              <Header />
              <main className="flex-1 sm:mt-16 md:mt-14 sm:px-8 py-16 bg-gradient-to-br from-sky-50 to-sky-100">
                <div className="w-full max-w-7xl mx-auto">{children}</div>
              </main>
              <Footer />
              <RightSidebar />
              <MusicBreakModal />
              <BreakEndModal />
              <StudyModal />
              <StudyEndModal />
            </div>
          </PomodoroProvider>
        </MusicProvider>
      </RouteLoadingProvider>
    </DictionaryProvider>
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
