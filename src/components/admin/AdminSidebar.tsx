'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  HomeIcon,
  UserIcon,
  CreditCardIcon,
  UserPlusIcon,
  BuildingOfficeIcon,
  TruckIcon,
  ShieldCheckIcon,
  CurrencyDollarIcon,
  EnvelopeIcon,
  PowerIcon,
  AcademicCapIcon,
  DocumentTextIcon,
  ClipboardIcon,
} from '@heroicons/react/24/outline';
// import { useAdminContext } from '@/context/AdminContext'; 
import config from '@/config/Routes';
// import logo from '@/assetadmin/logo.png'; 
// import blogIcon from '@/assetadmin/blog.png'; 

const AdminSidebar = () => {
  // const { admin, handleLogoutAdmin } = useAdminContext();
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = (e: React.MouseEvent) => {
    e.preventDefault();
    // Simple logout for now
    router.push('/admin/login');
  };

  const menuItems = [
    {
      key: config.routes.admin || '/admin',
      label: 'Dashboard',
      icon: <HomeIcon className="h-5 w-5" />,
    },
    {
      key: '/admin/exams',
      label: 'Exams',
      icon: <AcademicCapIcon className="h-5 w-5" />,
    },
    {
      key: config.routes.userAdmin || '/admin/users',
      label: 'Users',
      icon: <UserIcon className="h-5 w-5" />,
    },
    {
      key: config.routes.billingAdmin || '/admin/billing',
      label: 'Billing',
      icon: <CreditCardIcon className="h-5 w-5" />,
    },
    {
      key: config.routes.advertisementAdmin || '/admin/advertisement',
      label: 'Advertisement',
      icon: <UserPlusIcon className="h-5 w-5" />,
    },
    { key: 'flashcard', label: 'Flashcard', icon: <ClipboardIcon className="h-5 w-5" /> },
    {
      key: config.routes.insuranceAdmin || '/admin/insurance',
      label: 'Insurance',
      icon: <ShieldCheckIcon className="h-5 w-5" />,
    },
    {
      key: config.routes.insuranceContentAdmin || '/admin/insurance-content',
      label: 'Insurance Content',
      icon: <BuildingOfficeIcon className="h-5 w-5" />,
    },
    {
      key: config.routes.vehicleAdmin || '/admin/vehicle',
      label: 'Vehicle',
      icon: <TruckIcon className="h-5 w-5" />,
    },
    {
      key: config.routes.blogAdmin || '/admin/blog',
      label: 'Blog',
      icon: <DocumentTextIcon className="h-5 w-5" />,
    },
    {
      key: config.routes.insurancePackage || '/admin/insurance-package',
      label: 'Insurance Package',
      icon: <ShieldCheckIcon className="h-5 w-5" />,
    },
    {
      key: config.routes.indemnityAdmin || '/admin/indemnity',
      label: 'Compensation',
      icon: <CurrencyDollarIcon className="h-5 w-5" />,
    },
    {
      key: config.routes.sendEmailReminderAdmin || '/admin/send-email-reminder',
      label: 'Send Email Reminder',
      icon: <EnvelopeIcon className="h-5 w-5" />,
    },
    {
      key: 'logout-btn',
      label: 'Logout',
      icon: <PowerIcon className="h-5 w-5" />,
      onClick: handleLogout,
    },
  ];

  // For now, show all menu items (can be filtered later when AdminProvider is properly set up)
  const filteredItems = menuItems;

  return (
    <aside className="fixed top-0 left-0 w-[280px] h-screen bg-[#006494] text-white shadow-lg z-10">
      {/* Logo */}
      <div className="flex flex-col items-center border-b border-white/20 py-4">
        <div className="mb-2 w-12 h-12 bg-white rounded-full flex items-center justify-center">
          <AcademicCapIcon className="h-8 w-8 text-[#006494]" />
        </div>
        <h2 className="text-lg font-semibold">Edutic Admin</h2>
      </div>

      {/* Menu */}
      <nav className="mt-4 flex flex-col space-y-1 px-4">
        {filteredItems.map((item) =>
          item.onClick ? (
            <button
              key={item.key}
              onClick={item.onClick}
              className="flex items-center w-full text-left px-3 py-2 rounded hover:bg-[#005478] transition"
            >
              {item.icon}
              <span className="ml-2">{item.label}</span>
            </button>
          ) : (
            <Link
              key={item.key}
              href={item.key}
              className={`flex items-center px-3 py-2 rounded hover:bg-[#005478] transition ${
                pathname === item.key ? 'bg-[#00456e]' : ''
              }`}
            >
              {item.icon}
              <span className="ml-2">{item.label}</span>
            </Link>
          )
        )}
      </nav>
    </aside>
  );
};

export default AdminSidebar;
