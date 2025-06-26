import { Metadata } from "next";
import "./globals.css";
import { SelectedMenuProvider } from "@/contexts/SelectedAminMenuContext";
import { I18nProvider } from "@/contexts/I18nContext";

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
          <SelectedMenuProvider>
            {children}
          </SelectedMenuProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
