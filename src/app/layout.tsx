import { Metadata } from "next";

import "./globals.css";

import { I18nProvider } from "@/contexts/I18nContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { SelectedMenuProvider } from "@/contexts/SelectedAminMenuContext";

export const metadata: Metadata = {
  title: "Edutic - Ôn là trúng, Luyện là đạt",
  description: "Luyện thi TOEIC hiệu quả",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <I18nProvider>
          <AuthProvider>
            <SelectedMenuProvider>{children}</SelectedMenuProvider>
          </AuthProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
