'use client';
import React, { useState } from 'react';
import { PlusCircleIcon, XMarkIcon } from '@heroicons/react/24/outline';
import Image from 'next/image'; // Import Image từ next/image

interface AddUserProps {
  onSubmit: (e: React.FormEvent, formData: { email: string; role: string; avatarFile?: File }) => void;
  onCancel: () => void;
}

const AddUserPage = ({ onSubmit, onCancel }: AddUserProps) => {
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | undefined>(undefined);
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('Employee');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(e, { email, role, avatarFile });
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRole(e.target.value);
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setAvatarFile(undefined);
      setAvatarPreview(null);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-700 rounded-lg shadow p-6 relative">
      <button
        className="absolute top-2 right-2 text-red-600 hover:text-red-800"
        onClick={onCancel}
      >
        <XMarkIcon className="h-6 w-6" />
      </button>
      <h2 className="text-2xl font-semibold flex items-center mb-6">
        <PlusCircleIcon className="h-6 w-6 mr-2 text-blue-600" />
        Add New User
      </h2>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={handleEmailChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-600 focus:ring-blue-600 dark:bg-gray-600 dark:border-gray-500 dark:text-white"
            placeholder="Nhập email"
          />
        </div>
        <div>
          <label htmlFor="role" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Role
          </label>
          <select
            id="role"
            name="role"
            value={role}
            onChange={handleRoleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-600 focus:ring-blue-600 dark:bg-gray-600 dark:border-gray-500 dark:text-white"
          >
            <option value="Employee">Employee</option>
            <option value="Admin">Admin</option>
          </select>
        </div>
        <div>
          <label htmlFor="avatar" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Avatar
          </label>
          <div className="mt-1 flex items-center space-x-4">
            <input
              type="file"
              id="avatar"
              name="avatar"
              accept="image/*"
              onChange={handleAvatarChange}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => document.getElementById('avatar')?.click()}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Upload Avatar
            </button>
            {avatarPreview && (
              <Image
                src={avatarPreview} // Sử dụng base64 URL từ FileReader
                alt="Avatar Preview"
                width={64} // Đặt kích thước cố định (phù hợp với w-16)
                height={64} // Đặt kích thước cố định (phù hợp với h-16)
                className="object-cover rounded-full"
              />
            )}
          </div>
        </div>
        <div className="flex justify-center">
          <button
            type="submit"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600"
          >
            <PlusCircleIcon className="h-5 w-5 mr-2" />
            Add User
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddUserPage;