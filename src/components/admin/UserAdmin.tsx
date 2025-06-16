'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import AddUserPage from '@/components/admin/add/AddUser';
import EditUserPage from '@/components/admin/edit/EditUser';
import UserProfile from '@/components/admin/UserProfile';


// Định nghĩa kiểu cho user
interface User {
  id: number;
  email: string;
  avatar: string;
  role: string;
}

const UserAdmin = () => {
  const router = useRouter();
  const [filterName, setFilterName] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [isEditUserModalVisible, setIsEditUserModalVisible] = useState(false);
  const [isProfileVisible, setIsProfileVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // Mock data
  const mockData: User[] = [
    { id: 1, email: 'user1@example.com', avatar: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==', role: 'Admin' },
    { id: 2, email: 'user2@example.com', avatar: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==', role: 'User' },
    { id: 3, email: 'user3@example.com', avatar: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==', role: 'Moderator' },
  ];

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilterName(e.target.value);
    setCurrentPage(1);
  };

  const filteredUsers = mockData.filter((user: User) => {
    const searchLower = filterName.toLowerCase();
    const emailLower = user.email.toLowerCase();
    return emailLower.includes(searchLower);
  });

  const pageSize = 2;
  const paginatedUsers = filteredUsers.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const totalUsers = filteredUsers.length;

  const handleModalCancel = () => {
    setIsAddModalVisible(false);
    setIsEditUserModalVisible(false);
    setIsProfileVisible(false);
  };

  const handleLogoutAdmin = () => {
    router.push('/admin/login');
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setIsEditUserModalVisible(true);
  };

  const handleRowClick = (user: User) => {
    setSelectedUser(user);
    setIsProfileVisible(true);
  };

  const handleAddUser = (e: React.FormEvent, formData: { email: string; role: string; avatarFile?: File }) => {
    e.preventDefault();
    console.log('Add User submitted', formData);
    if (formData.avatarFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        console.log('Avatar base64:', reader.result);
      };
      reader.readAsDataURL(formData.avatarFile);
    }
    setIsAddModalVisible(false);
  };


const handleUpdateUser = (e: React.FormEvent, formData: { email: string; role: string; avatar: string; avatarFile?: File }) => {
  e.preventDefault();
  console.log('Update User submitted', formData, formData.avatarFile); // Xử lý avatarFile nếu cần
  setIsEditUserModalVisible(false);
};

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-[#006494] text-white flex justify-between items-center p-4">
        <button
          className="flex items-center bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          onClick={() => setIsAddModalVisible(true)}
        >
          <span className="mr-2">+</span> Add User
        </button>
        <h1 className="text-2xl font-semibold mx-auto">User Management</h1>
        <div className="flex space-x-2">
          <button
            className="flex items-center bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
            onClick={handleLogoutAdmin}
          >
            <svg
              className="w-5 h-5 mr-1"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z"
                clipRule="evenodd"
              />
            </svg>
            Logout
          </button>
        </div>
      </header>

      <main className="flex-1 p-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <input
            type="text"
            placeholder="Search for user by email"
            value={filterName}
            onChange={handleFilterChange}
            className="w-full p-2 border rounded mb-4"
          />

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-200">
                  <th className="p-2 border">Id</th>
                  <th className="p-2 border">Email</th>
                  <th className="p-2 border">Avatar</th>
                  <th className="p-2 border">Role</th>
                  <th className="p-2 border">Action</th>
                </tr>
              </thead>
              <tbody>
                {paginatedUsers.map((user) => (
                  <tr
                    key={user.id}
                    className="border-t cursor-pointer hover:bg-gray-100"
                    onClick={() => handleRowClick(user)}
                  >
                    <td className="p-2 border">{user.id}</td>
                    <td className="p-2 border">{user.email}</td>
                    <td className="p-2 border">
                      {user.avatar && (
                        <Image
                          src={user.avatar}
                          alt={user.email}
                          width={50}
                          height={50}
                          className="rounded-full"
                        />
                      )}
                    </td>
                    <td className="p-2 border">{user.role}</td>
                    <td className="p-2 border flex space-x-2">
                      <button
                        className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
                        onClick={() => handleEditUser(user)}
                      >
                        Edit 
                      </button>
                      <button
                        className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                        onClick={() => {}}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="mt-4 flex justify-end">
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </button>
              <span className="mx-4 py-2">{currentPage} / {Math.ceil(totalUsers / pageSize)}</span>
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === Math.ceil(totalUsers / pageSize)}
              >
                Next
              </button>
            </div>
          </div>
        </div>
        {isProfileVisible && selectedUser && <UserProfile user={selectedUser} onClose={() => setIsProfileVisible(false)} />}
      </main>

      <div className="modal">
        <div className={isAddModalVisible ? 'modal-content' : 'hidden'}>
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-700 rounded-lg shadow p-6 w-1/3 relative">
              <AddUserPage onSubmit={handleAddUser} onCancel={handleModalCancel} />
            </div>
          </div>
        </div>

        <div className={isEditUserModalVisible ? 'modal-content' : 'hidden'}>
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-700 rounded-lg shadow p-6 w-1/3 relative">
              <EditUserPage
                onSubmit={handleUpdateUser}
                onCancel={handleModalCancel}
                initialData={selectedUser ? { email: selectedUser.email, role: selectedUser.role, avatar: selectedUser.avatar } : undefined}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserAdmin;