import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = {
    name: 'null',
    // avatar: '/path/to/avatar.jpg' 
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header user={user} />
      <main className="flex-1 py-6">
        {children}
      </main>
      <Footer />
    </div>
  );
}
