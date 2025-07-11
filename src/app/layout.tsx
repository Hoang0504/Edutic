import { Metadata } from "next";

import "./globals.css";

import ReactQueryProvider from "@/components/providers/ReactQueryProvider";

import { I18nProvider } from "@/contexts/I18nContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { SelectedMenuProvider } from "@/contexts/SelectedAminMenuContext";

export const metadata: Metadata = {
  title: "Edutic - Ôn là trúng, Luyện là đạt - Luyện thi TOEIC hiệu quả",
  description:
    "Ôn luyện TOEIC trực tuyến cùng Edutic - bài thi, kết quả, flashcard và nhiều hơn thế.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ReactQueryProvider>
          <I18nProvider>
            <AuthProvider>
              <SelectedMenuProvider>{children}</SelectedMenuProvider>
            </AuthProvider>
          </I18nProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
