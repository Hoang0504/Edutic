
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
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
} from '@heroicons/react/24/outline';
import { useAdminContext } from '@/context/AdminContext'; 
import config from '@/config/Routes';
import logo from '@/assetadmin/logo.png'; 
import blogIcon from '@/assetadmin/blog.png'; 

const AdminSidebar = () => {
  const { admin, handleLogoutAdmin } = useAdminContext();
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = (e: React.MouseEvent) => {
    e.preventDefault();
    const loggedOut = handleLogoutAdmin?.();
    if (loggedOut) {
      router.push(config.routes.loginAdmin);
    }
  };

  const menuItems = [
    {
      key: config.routes.admin,
      label: 'Dashboard',
      icon: <HomeIcon className="h-5 w-5" />,
    },
    {
      key: config.routes.userAdmin,
      label: 'Users',
      icon: <UserIcon className="h-5 w-5" />,
    },
    {
      key: config.routes.billingAdmin,
      label: 'Billing',
      icon: <CreditCardIcon className="h-5 w-5" />,
    },
    {
      key: config.routes.advertisementAdmin,
      label: 'Advertisement',
      icon: <UserPlusIcon className="h-5 w-5" />,
    },
    {
      key: config.routes.insuranceAdmin,
      label: 'Insurance',
      icon: <ShieldCheckIcon className="h-5 w-5" />,
    },
    {
      key: config.routes.insuranceContentAdmin,
      label: 'Insurance Content',
      icon: <BuildingOfficeIcon className="h-5 w-5" />,
    },
    {
      key: config.routes.vehicleAdmin,
      label: 'Vehicle',
      icon: <TruckIcon className="h-5 w-5" />,
    },
    {
      key: config.routes.blogAdmin,
      label: 'Blog',
      icon: <Image src={blogIcon} alt="Blog" width={20} height={20} />,
    },
    {
      key: config.routes.insurancePackage,
      label: 'Insurance Package',
      icon: <ShieldCheckIcon className="h-5 w-5" />,
    },
    {
      key: config.routes.indemnityAdmin,
      label: 'Compensation',
      icon: <CurrencyDollarIcon className="h-5 w-5" />,
    },
    {
      key: config.routes.sendEmailReminderAdmin,
      label: 'Send Email Reminder',
      icon: <EnvelopeIcon className="h-5 w-5" />,
    },
    {
      key: '/logout',
      label: 'Logout',
      icon: <PowerIcon className="h-5 w-5" />,
      onClick: handleLogout,
    },
  ];

  // Lọc menu nếu là Employee
  const filteredItems =
    admin?.role === 'Employee'
      ? menuItems.filter((_, index) => ![0, 1, 4, 5, 8].includes(index))
      : menuItems;

  return (
    <aside className="fixed top-0 left-0 w-[280px] h-screen bg-[#006494] text-white shadow-lg z-10">
      {/* Logo */}
      <div className="flex flex-col items-center border-b border-white/20 py-4">
        <Image src={logo} alt="Logo" className="mb-2" width={50} height={50} />
        <h2 className="text-lg font-semibold">Vehicle Insurance</h2>
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
