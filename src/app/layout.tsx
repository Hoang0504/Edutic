import { Metadata } from "next";
import "./globals.css";
import { SelectedMenuProvider } from "@/contexts/SelectedAminMenuContext";

export const metadata: Metadata = {
  title: "Edutic - Ôn là trúng, Luyện là đạt",
  description: "Luyện thi TOEIC hiệu quả",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body>
        <SelectedMenuProvider>{children}</SelectedMenuProvider>
      </body>
    </html>
  );
}
