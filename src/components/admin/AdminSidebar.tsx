'use client';
import React from 'react';
import Image from 'next/image';
import {
  HomeIcon,
  UserIcon,
  DocumentTextIcon,
  PowerIcon,
} from '@heroicons/react/24/outline';
import { useAdminContext } from '@/context/AdminContext';
import { useRouter } from 'next/navigation';
import logo from '@/components/admin/assetadmin/logo.jpg';

interface AdminSidebarProps {
  onMenuSelect: (menuKey: string) => void; // Định nghĩa hàm onMenuSelect
}

const AdminSidebar = ({ onMenuSelect }: AdminSidebarProps) => {
  const { admin, handleLogoutAdmin } = useAdminContext();
  const router = useRouter();

  const handleLogout = (e: React.MouseEvent) => {
    e.preventDefault();
    const loggedOut = handleLogoutAdmin?.();
    if (loggedOut) {
      router.push('/admin/login');
    }
  };

  const menuItems = [
    { key: 'dashboard', label: 'Dashboard', icon: <HomeIcon className="h-5 w-5" /> },
    { key: 'users', label: 'Users', icon: <UserIcon className="h-5 w-5" /> },
    { key: 'exams', label: 'Exams', icon: <DocumentTextIcon className="h-5 w-5" /> },
    { key: 'logout', label: <button onClick={handleLogout}>Logout</button>, icon: <PowerIcon className="h-5 w-5" /> },
  ];

  const filteredItems = admin?.role === 'Employee'
    ? menuItems.filter((_, index) => ![0, 1].includes(index)) // Chỉ lọc Dashboard và Users
    : menuItems;

  return (
    <aside className="fixed top-0 left-0 w-[280px] h-screen bg-[#006494] text-white shadow-lg z-10">
      <div className="flex flex-col items-center border-b border-white/20 py-4">
        <Image src={logo} alt="Logo" className="mb-2" width={50} height={50} />
        <h2 className="text-lg font-semibold">EDUTIC</h2>
      </div>
      <nav className="mt-4 flex flex-col space-y-1 px-4">
        {filteredItems.map((item) => (
          <div
            key={item.key}
            onClick={() => item.key !== 'logout' && onMenuSelect(item.key)} // Gọi hàm onMenuSelect khi nhấp
            className={`flex items-center px-3 py-2 rounded cursor-pointer hover:bg-[#005478] transition ${
              item.key === 'logout' ? '' : 'hover:bg-[#005478]'
            }`}
          >
            {item.icon}
            <span className="ml-2">{item.label}</span>
          </div>
        ))}
      </nav>
    </aside>
  );
};

export default AdminSidebar;