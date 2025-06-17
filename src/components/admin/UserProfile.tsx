'use client';
import React from 'react';
import Image from 'next/image';

interface User {
  id: number;
  email: string;
  avatar: string;
  role: string;
}

interface UserProfileProps {
  user?: User;
  onClose?: () => void;
}

const UserProfile = ({ user, onClose }: UserProfileProps) => {
  return (
    <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-lg w-80 h-full fixed top-0 right-0 transform transition-transform duration-300 ease-in-out z-50">
      {onClose && (
        <button
          className="absolute top-2 right-2 text-red-600 hover:text-red-800"
          onClick={onClose}
        >
          <svg
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      )}
      <div className="flex flex-col items-center space-y-4">
        {user?.avatar && (
          <Image
            src={user.avatar}
            alt={`${user.email}'s avatar`}
            width={100}
            height={100}
            className="rounded-full object-cover"
          />
        )}
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">{user?.email || 'N/A'}</h2> {/* Sử dụng email làm name */}
        <p className="text-gray-600 dark:text-gray-300">Email: {user?.email || 'N/A'}</p>
        <p className="text-gray-600 dark:text-gray-300">Role: {user?.role || 'N/A'}</p>
      </div>
    </div>
  );
};

export default UserProfile;