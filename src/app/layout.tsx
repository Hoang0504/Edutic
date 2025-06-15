import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import "./globals.css";

export const metadata = {
  title: "My TOEIC App",
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
      <body>
        <div className="min-h-screen bg-gray-50 flex flex-col">
          <Header user={user} />
          <main className="flex-1 py-6">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
