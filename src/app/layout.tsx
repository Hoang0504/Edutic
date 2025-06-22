import { Metadata } from "next";
import { Toaster } from "react-hot-toast";
import "./globals.css";

import { RouteLoadingProvider } from "@/context/RouteLoadingContext";

export const metadata: Metadata = {
  title: "Edutic - Ôn là trúng, Luyện là đạt",
  description: "Luyện thi TOEIC hiệu quả",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body>
        <Toaster position="top-right" />
        <div className="min-h-screen bg-gray-50 flex flex-col">
          <RouteLoadingProvider>{children}</RouteLoadingProvider>
        </div>
      </body>
    </html>
  );
}
