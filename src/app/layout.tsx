// src/app/layout.tsx
import "./globals.css";

export const metadata = {
  title: "My TOEIC App",
  description: "Luyện thi TOEIC hiệu quả",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body className="bg-white text-gray-900">{children}</body>
    </html>
  );
}
