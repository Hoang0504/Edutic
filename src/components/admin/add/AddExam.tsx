'use client';
import React, { useState } from 'react';
import { PlusCircleIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface AddExamProps {
  onSubmit: (e: React.FormEvent, formData: { title: string; level: string; description: string; published: string }) => void;
  onCancel: () => void;
}

const AddExamPage = ({ onSubmit, onCancel }: AddExamProps) => {
  const [title, setTitle] = useState('');
  const [level, setLevel] = useState('Easy');
  const [description, setDescription] = useState('');
  const [published, setPublished] = useState('Yes');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submitting form with data:', { title, level, description, published }); // Debug
    onSubmit(e, { title, level, description, published });
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const handleLevelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLevel(e.target.value);
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(e.target.value);
  };

  const handlePublishedChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPublished(e.target.value);
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
        <PlusCircleIcon className="h-6 w-6 mr-2 text-blue-600" /> {/* Sử dụng màu cụ thể nếu primary không hoạt động */}
        Add New Exam
      </h2>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={title}
            onChange={handleTitleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-600 focus:ring-blue-600 dark:bg-gray-600 dark:border-gray-500 dark:text-white"
            placeholder="Nhập tiêu đề"
          />
        </div>
        <div>
          <label htmlFor="level" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Level
          </label>
          <select
            id="level"
            name="level"
            value={level}
            onChange={handleLevelChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-600 focus:ring-blue-600 dark:bg-gray-600 dark:border-gray-500 dark:text-white"
          >
            <option value="Easy">Dễ</option>
            <option value="Medium">Trung bình</option>
            <option value="Hard">Khó</option>
          </select>
        </div>
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={description}
            onChange={handleDescriptionChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-600 focus:ring-blue-600 dark:bg-gray-600 dark:border-gray-500 dark:text-white"
            rows={3}
            placeholder="Nhập mô tả"
          />
        </div>
        <div>
          <label htmlFor="published" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Published
          </label>
          <select
            id="published"
            name="published"
            value={published}
            onChange={handlePublishedChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-600 focus:ring-blue-600 dark:bg-gray-600 dark:border-gray-500 dark:text-white"
          >
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </div>
        <div className="flex justify-center space-x-4">
          <button
            type="submit"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600" // Sử dụng màu cụ thể
          >
            <PlusCircleIcon className="h-5 w-5 mr-2" />
            Add Exam
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddExamPage;