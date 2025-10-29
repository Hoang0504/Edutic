'use client'
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface Admin {
  username: string;
  role: string;
}

interface AdminContextProps {
  admin: Admin | null;
  setAdmin: (admin: Admin | null) => void;
  handleLogoutAdmin: () => boolean;
}
const AdminContext = createContext<AdminContextProps | undefined>(undefined);

export const AdminProvider = ({ children }: { children: ReactNode }) => {
  const [admin, setAdmin] = useState<Admin | null>(null);

  const handleLogoutAdmin = () => {
    setAdmin(null);
    // Xoá token, clear localStorage nếu có
    return true;
  };

  return (
    <AdminContext.Provider value={{ admin, setAdmin, handleLogoutAdmin }}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdminContext = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdminContext must be used within AdminProvider');
  }
  return context;
};
