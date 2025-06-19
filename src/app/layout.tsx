import { Metadata } from "next";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import RightSideBar from "@/components/layout/RightSideBar";
import "./globals.css";

export const metadata: Metadata = {
  title: "Edutic - Ôn là trúng, Luyện là đạt",
  description: "Luyện thi TOEIC hiệu quả",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = {
    name: "null",
    // avatar: '/path/to/avatar.jpg'
  };

  return (
    <html lang="vi">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body>
        <div className="min-h-screen bg-gray-50 flex flex-col">
          <Header user={user} />
          <main className="flex-1 py-6">{children}</main>
          <Footer />
          <RightSideBar />
        </div>
      </body>
    </html>
  );
}
