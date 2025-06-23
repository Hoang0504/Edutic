'use client';
import React, { useState, useEffect } from 'react';
import { PencilIcon, XMarkIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';

interface EditUserProps {
  onSubmit: (e: React.FormEvent, formData: { email?: string; role?: string; avatar?: string; avatarFile?: File; password?: string }) => void;
  onCancel: () => void;
  initialData?: { email: string; role: string; avatar: string };
}

const EditUserPage = ({ onSubmit, onCancel, initialData }: EditUserProps) => {
  const [formData, setFormData] = useState({
    email: initialData?.email || '',
    role: initialData?.role || 'user',
    avatar: initialData?.avatar || '',
    password: '',
  });
  const [avatarPreview, setAvatarPreview] = useState<string | null>(initialData?.avatar || null);
  const [avatarFile, setAvatarFile] = useState<File | undefined>(undefined);

  useEffect(() => {
    if (initialData) {
      setFormData({
        email: initialData.email || '',
        role: initialData.role || 'user',
        avatar: initialData.avatar || '',
        password: '',
      });
      setAvatarPreview(initialData.avatar || null);
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(e, { ...formData, avatarFile });
    console.log('Form submitted with data:', { ...formData, avatarFile });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, password: e.target.value }));
  };

 const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setAvatarPreview(event.target.result as string);
        setAvatarFile(file);
        e.target.value = ""; // reset input
      }
    };
    reader.readAsDataURL(file);
  }
};

useEffect(() => {
  console.log('avatarPreview changed:', avatarPreview);
}, [avatarPreview]);

  return (
    <div className="bg-white dark:bg-gray-700 rounded-lg shadow p-6 relative">
      <button
        className="absolute top-2 right-2 text-red-600 hover:text-red-800"
        onClick={onCancel}
      >
        <XMarkIcon className="h-6 w-6" />
      </button>
      <h2 className="text-2xl font-semibold flex items-center mb-6">
        <PencilIcon className="h-6 w-6 mr-2 text-blue-600" />
        Edit User
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
            value={formData.email}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-600 focus:ring-blue-600 dark:bg-gray-600 dark:border-gray-500 dark:text-white"
            placeholder="Nhập email"
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Password (leave blank to keep unchanged)
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handlePasswordChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-600 focus:ring-blue-600 dark:bg-gray-600 dark:border-gray-500 dark:text-white"
            placeholder="Nhập password mới (tùy chọn)"
          />
        </div>
        <div>
          <label htmlFor="role" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Role
          </label>
          <select
            id="role"
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-600 focus:ring-blue-600 dark:bg-gray-600 dark:border-gray-500 dark:text-white"
          >
            <option value="student">student</option>
            <option value="admin">admin</option>
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
                key={avatarPreview}
                src={avatarPreview}
                alt="Avatar Preview"
                width={64}
                height={64}
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
            <PencilIcon className="h-5 w-5 mr-2" />
            Update User
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditUserPage;